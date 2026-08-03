# Workflows n8n

Le workflow de l'agent est versionné ici, à côté du code qu'il consomme. Quand
`/api/knowledge` change, le prompt qui l'utilise change dans le même commit.

| Fichier | Rôle |
|---|---|
| `rudy-portfolio-agent.json` | Le workflow de chat, sans base vectorielle |

## En résumé : deux workflows aujourd'hui, un seul demain

| Workflow existant | Action | Fichier fourni |
|---|---|---|
| `rudy portefolio rag app` | **Importer** `rudy-portfolio-agent.json` dedans | oui |
| `interactive cv AI - ingestion a partir de google drive` | **Supprimer** | aucun, il disparaît |

Rien à éditer à la main. Le workflow d'ingestion n'a pas de version corrigée
parce qu'il n'a plus d'objet : sa seule fonction était de remplir Pinecone.

## Ce que remplace ce workflow

L'ancienne configuration comptait **deux** workflows :

1. `interactive cv AI - ingestion a partir de google drive` — surveillait un
   dossier Drive et insérait des vecteurs dans Pinecone
2. `rudy portefolio rag app` — l'agent, qui interrogeait Pinecone via un outil
   `rudy-q`

Les deux disparaissent au profit d'un seul workflow qui va chercher la
connaissance complète en HTTP.

### Pourquoi

**L'ingestion ne pouvait qu'ajouter.** Le trigger était configuré sur
`event: fileCreated` et le nœud Pinecone sur `mode: insert`. Déposer un CV mis à
jour créait de nouveaux vecteurs sans supprimer les anciens : les deux versions
coexistaient et l'agent alternait entre les deux selon les chunks remontés. Le
trigger interrogeait par ailleurs Google Drive **toutes les minutes**, soit
1 440 appels par jour pour un dossier modifié une fois par mois.

**L'outil `rudy-q` coûtait trois appels LLM par question.** C'était un
`toolVectorStore`, qui embarque son propre modèle. Chaque question déclenchait
en séquence :

```
Agent LLM #1 (décide d'appeler l'outil) → embedding → requête Pinecone
→ LLM #2 (l'outil résume les chunks) → Agent LLM #3 (rédige la réponse)
```

C'était la cause principale des 5 à 10 secondes mesurées. Le nouveau workflow
fait **un** appel LLM, précédé d'un GET HTTP d'environ 50 ms.

**Le corpus fait ~2 800 tokens**, soit environ 1 % d'une fenêtre de contexte
moderne. La recherche vectorielle n'apportait aucun bénéfice à ce volume, et
découper le CV en chunks cassait les liens transverses (« quel projet utilise
FastAPI ? » exige de croiser deux sections).

## Importer

> ⚠️ **Exporte d'abord une sauvegarde** de tes deux workflows actuels
> (**⋯ → Download**). C'est ton point de restauration.

1. Déploie le site d'abord, pour que `/api/knowledge` réponde :
   ```bash
   curl https://rudy-haddad-ai.vercel.app/api/knowledge | head -20
   ```
2. Dans n8n, **ouvre le workflow `rudy portefolio rag app` existant** — ne crée
   pas un nouveau workflow.
3. **⋯ → Import from File** → `rudy-portfolio-agent.json`

   Importer dans le workflow existant préserve son identifiant et son URL de
   webhook. Créer un nouveau workflow générerait une nouvelle URL et il faudrait
   mettre à jour `N8N_WEBHOOK_URL` sur Vercel.
4. Vérifie que les credentials OpenAI et Gmail sont bien rattachés (les
   identifiants sont conservés dans le fichier, mais n8n demande parfois de les
   resélectionner).
5. **Save**, puis teste depuis le site.

### Vérifier le nom du champ

Le prompt système lit la connaissance via :

```
{{ $('Fetch knowledge').item.json.data }}
```

`data` est le nom de sortie par défaut du nœud HTTP Request en mode texte. Après
l'import, exécute le nœud `Fetch knowledge` une fois et regarde sa sortie réelle :
si le champ porte un autre nom, corrige l'expression dans le prompt système.

## Après validation

Une fois le nouveau workflow testé et fonctionnel :

1. Désactive puis supprime le workflow `interactive cv AI - ingestion a partir de google drive`
2. Supprime l'index Pinecone `website-rudy-interactive` (plus personne ne le lit)
3. Le dossier Google Drive `interactive cv` n'a plus de rôle — tu peux le garder
   comme archive, plus rien ne le surveille

Les credentials Pinecone peuvent aussi être retirées de n8n.

## Changements de comportement à connaître

**L'agent parle désormais à la troisième personne.** L'ancien prompt lui faisait
incarner Rudy (« je », « mon parcours »), alors que l'interface l'annonce comme
« Rudy's Assistant » et que le message d'accueil dit « I'm Rudy Haddad's
assistant ». Le site et l'agent se contredisaient. Pour revenir à la première
personne, remplace la section `## Role` du prompt système.

**La mémoire passe de 4 à 10 messages.** Un recruteur qui pose six questions
perdait le fil à mi-parcours.

**L'outil Gmail est conservé.** L'agent peut toujours envoyer un message à
rudyhaddad.job@gmail.com.

## Point de sécurité

Le Chat Trigger est en `public: true`. N'importe qui connaissant l'URL du webhook
peut donc parler à l'agent **sans passer par le site**, ce qui contourne la
limite de 12 requêtes/minute appliquée dans `/api/chat`. Combiné à l'outil
Gmail, cela permet en théorie de faire envoyer des mails en masse vers ta boîte.

Deux parades possibles, par ordre de simplicité :

- activer l'authentification du webhook côté n8n (Header Auth) et transmettre
  l'en-tête depuis `/api/chat` ;
- ou déplacer la limite de débit dans le workflow lui-même.
