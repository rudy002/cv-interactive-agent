# 🔗 Intégration n8n

## Architecture

```
                    data/profile.ts · projects.ts · skills.ts · knowledge.ts
                                        │  (source unique, versionnée dans git)
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
            pages du site                         GET /api/knowledge
                                                            │
Navigateur                                                  │
  │  POST /api/chat  { message, sessionId }                 │
  ▼                                                         │
Route Next.js         ← validation, rate limit, timeout 45s  │
  │  POST $N8N_WEBHOOK_URL  { chatInput, sessionId }         │
  ▼                                                         │
Workflow n8n                                                │
  Webhook → HTTP Request ──────────────────────────────────►┘
          → AI Agent (connaissance dans le prompt système)
          → Simple Memory (clé = sessionId)
          → Respond to Webhook
```

Le point clé : **il n'y a plus de base vectorielle ni de workflow d'ingestion.**
Les pages et l'agent lisent les mêmes fichiers `data/`. Éditer un projet le met
à jour aux deux endroits en même temps ; il devient impossible que le site et le
bot se contredisent.

### Pourquoi avoir retiré le RAG

Le corpus complet fait **~2 200 tokens**, soit environ 1 % d'une fenêtre de
contexte moderne. Une recherche vectorielle sur ce volume n'apportait que des
inconvénients :

- l'ingestion « nouveau fichier détecté » **ajoutait** des vecteurs sans jamais
  supprimer les anciens : deux versions du CV coexistaient et l'agent
  alternait entre les deux ;
- le découpage en chunks cassait les liens transverses (« quel projet utilise
  FastAPI ? » exige de croiser deux sections) ;
- deux sources de vérité (Drive et le repo) divergeaient sans que rien ne
  l'empêche.

Le RAG redeviendra pertinent au-delà de ~50 000 tokens de corpus.

## Ajouter une connaissance

| Tu veux ajouter… | Édite | Visible sur |
|---|---|---|
| Un projet | `data/projects.ts` | site + bot |
| Une compétence | `data/skills.ts` | site + bot |
| Un poste, une certification, une langue | `data/profile.ts` | site + bot |
| Un fait hors CV (préavis, mobilité, anecdote, FAQ recruteur) | `data/knowledge.ts` | bot uniquement |

Puis `git push`. Vercel déploie, l'agent est à jour au prochain message.
Aucune purge, aucune réingestion.

> ⚠️ Tout ce qui est dans `data/knowledge.ts` sera dit à voix haute par
> l'assistant à quiconque le demande. N'y écris rien que tu ne dirais pas à un
> inconnu au téléphone.

## Variables d'environnement

| Variable | Requise | Description |
|---|---|---|
| `N8N_WEBHOOK_URL` | oui | Webhook n8n qui expose l'agent. Serveur uniquement. |
| `KNOWLEDGE_API_TOKEN` | non | Si définie, `/api/knowledge` exige ce jeton. |

## Configurer le workflow n8n

### 1. Nœud Webhook (déclencheur)

- **HTTP Method** : `POST`
- **Respond** : `Using 'Respond to Webhook' node`

Le corps reçu :

```json
{ "sessionId": "session-1234567890-abc123", "chatInput": "Question de l'utilisateur" }
```

### 2. Nœud HTTP Request — récupérer la connaissance ⭐ nouveau

- **Method** : `GET`
- **URL** : `https://rudy-haddad-ai.vercel.app/api/knowledge`
- **Response Format** : `String`
- Si `KNOWLEDGE_API_TOKEN` est défini, ajouter un en-tête :
  `x-knowledge-token` = la valeur du jeton

Coût : ~50 ms, négligeable face aux 5 à 10 s de génération.

### 3. Nœud AI Agent

Mettre la connaissance dans le **prompt système**, en la plaçant en tête pour
qu'elle bénéficie du cache de prompt du fournisseur :

```
{{ $('HTTP Request').item.json.data }}

---

Tu es l'assistant virtuel de Rudy Haddad, sur son CV interactif.
Réponds uniquement à partir de la base de connaissance ci-dessus.
Si l'information ne s'y trouve pas, dis-le et propose son email.
Réponds dans la langue du visiteur. Sois concis : trois phrases valent mieux
que trois paragraphes.
N'invente jamais un employeur, une date, un chiffre ou une technologie.
```

> Le nom du champ dépend de la configuration du nœud HTTP Request. Si la
> réponse arrive en texte brut, ce sera souvent `{{ $('HTTP Request').item.json.data }}`.
> Vérifie la sortie réelle du nœud dans n8n et ajuste.

**Supprimer le nœud Vector Store Tool** : il n'a plus de raison d'être.

### 4. Nœud Simple Memory

Champ **Session ID** :

```
{{ $json.sessionId }}
```

Le `sessionId` est généré côté client et conservé en `sessionStorage`, donc un
rechargement de page continue la même conversation.

### 5. Nœud Respond to Webhook

Voir les deux modes de réponse ci-dessous.

### 6. Nettoyage

- Désactiver puis supprimer l'ancien workflow d'ingestion Google Drive.
- Supprimer l'index Pinecone (ou le vider), il n'est plus lu.

## Contrat de réponse

### Mode A — bufferisé (le plus simple)

`Content-Type: application/json`. Ces formes sont toutes acceptées :

```json
[{ "output": "La réponse" }]
{ "output": "La réponse" }
{ "response": "…" }   { "message": "…" }   { "text": "…" }   { "answer": "…" }
"La réponse"
```

La route renvoie ensuite au navigateur :

```json
{ "success": true, "message": "La réponse", "sessionId": "session-…" }
```

### Mode B — streaming (recommandé) ⚡

**Mesuré : la réponse complète prend 5 à 10 secondes.** En bufferisé, le
visiteur ne voit rien pendant tout ce temps. En streaming, le premier mot
s'affiche en ~60 ms.

Répondre avec `Content-Type: application/x-ndjson`, une ligne JSON par fragment :

```
{"type":"begin","metadata":{}}
{"type":"item","content":"Je "}
{"type":"item","content":"construis "}
{"type":"end","metadata":{}}
```

Les clés `delta`, `output`, `text` et `chunk` sont acceptées en plus de
`content` ; les lignes `begin` / `end` sont ignorées. **Aucun changement de code
n'est nécessaire** : la détection se fait sur le `Content-Type`.

Vérifier avec :

```bash
curl -N -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"What do you do?"}'
```

Des frames `data: {"delta":"…"}` doivent apparaître progressivement.

## Gestion des erreurs

| Situation | Réponse au navigateur |
|---|---|
| `N8N_WEBHOOK_URL` absente | `503` |
| Plus de 12 requêtes/minute par IP | `429` + `Retry-After` |
| `message` invalide, vide ou > 1000 caractères | `400` |
| n8n renvoie une erreur HTTP | `502` |
| Payload n8n illisible | `502` |
| Pas de réponse après 45 s | `504` |

Le texte d'erreur amont n'est **jamais** renvoyé au client : il peut contenir
l'URL du webhook. Le détail reste dans les logs serveur.

## Optimiser le temps de réponse

Les 5 à 10 s mesurées sont dominées par la génération du modèle. Par ordre de
rendement :

1. **Activer le streaming** — ne réduit pas le temps total mais fait passer le
   délai avant le premier mot de ~8 s à ~0,1 s.
2. **Limiter `max_tokens`** — une réponse de recruteur n'a pas besoin de 500 tokens.
3. **Vérifier l'hébergement de n8n** — sur une offre qui met l'instance en
   veille, le premier visiteur paie un démarrage à froid de plusieurs secondes.
   La variance mesurée (4,9 s vs 10,4 s) va dans ce sens.
4. **Choisir un modèle plus rapide** — les réponses sont courtes et factuelles.

Le retrait du RAG économise environ 0,5 à 1 s (embedding + requête Pinecone).
Le gain réel portait sur la justesse et la maintenance, pas sur la vitesse.

## Notes

- Les réponses obtenues pendant une visite sont mises en cache côté navigateur :
  reposer la même question est instantané et ne consomme pas de crédits.
- `/api/knowledge` renvoie un `ETag` ; n8n peut envoyer `If-None-Match` pour
  recevoir un `304` sans transfert quand rien n'a changé.
- Le fichier `.env.local` ne doit **jamais** être commité.
