# 🐛 Debug n8n - Erreur 500

## 🔴 Problème actuel

Votre webhook n8n retourne une **erreur 500 Internal Server Error**.

Cela signifie que :
- ✅ La connexion à n8n fonctionne
- ✅ L'URL du webhook est correcte
- ❌ Mais il y a une erreur DANS votre workflow n8n

## 🔍 Étapes de Debug

### 1. Vérifier les logs dans le terminal

Après avoir envoyé un message, vérifiez les logs dans votre terminal :

```
🔵 Envoi à n8n: { url: ..., message: ... }
📤 Payload envoyé: {...}
📥 Réponse n8n status: 500 Internal Server Error
❌ Erreur n8n détails: ...
```

### 2. Vérifier votre workflow n8n

#### A. Ouvrez votre workflow n8n et vérifiez :

1. **Le webhook est bien configuré** :
   - Path : `/webhook/votre-id`
   - Method : POST
   - Respond : "Using Respond to Webhook Node"

2. **Le workflow est ACTIVÉ** :
   - Le toggle en haut à droite doit être ON

3. **Tous les nœuds sont configurés** :
   - OpenAI/Anthropic : Clé API valide
   - Pinecone/Supabase : Connexion configurée
   - Tous les champs requis remplis

#### B. Format des données reçues par n8n :

Votre webhook reçoit :
```json
{
  "message": "Le message de l'utilisateur",
  "conversationHistory": [
    { "id": "...", "role": "user", "content": "..." },
    { "id": "...", "role": "assistant", "content": "..." }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. Tester le webhook n8n directement

Testez votre webhook avec curl pour isoler le problème :

```bash
# Format simplifié (sans historique)
curl -X POST https://votre-n8n-instance.com/webhook/votre-id \
  -H "Content-Type: application/json" \
  -d '{"message": "Bonjour"}'

# Format complet (avec historique)
curl -X POST https://votre-n8n-instance.com/webhook/votre-id \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Bonjour",
    "conversationHistory": [],
    "timestamp": "2024-01-01T00:00:00.000Z"
  }'
```

### 4. Solutions possibles

#### Solution 1 : Simplifier le payload

Si n8n n'aime pas `conversationHistory`, modifiez `app/api/chat/route.ts` :

```typescript
// Envoi simplifié (seulement le message)
const payload = {
  message,
  // conversationHistory,  // <-- Commentez cette ligne
  // timestamp: new Date().toISOString(),  // <-- Et celle-ci si besoin
};
```

#### Solution 2 : Adapter le format

Peut-être que votre n8n attend un format différent. Essayez :

```typescript
// Format alternatif 1 : Question simple
const payload = {
  question: message,  // Renommer "message" en "question"
};

// Format alternatif 2 : Format chat
const payload = {
  chatInput: message,
};
```

#### Solution 3 : Vérifier les connexions n8n

Dans votre workflow n8n, vérifiez que :
- ✅ Les credentials OpenAI/Anthropic sont valides
- ✅ Les connexions Pinecone/Supabase fonctionnent
- ✅ Tous les nœuds requis sont connectés

### 5. Workflow n8n recommandé

Voici une structure simple qui devrait fonctionner :

```
1. Webhook (Trigger)
   ↓
2. Set (Extraire le message)
   Expression: {{ $json.message }}
   ↓
3. Pinecone Vector Store (Recherche)
   Query: {{ $json.message }}
   ↓
4. OpenAI Chat (Génération)
   Prompt: Utilise ce contexte: {{ $json.data }} pour répondre: {{ $('Webhook').item.json.message }}
   ↓
5. Respond to Webhook
   Response Body: [{ "output": "{{ $json.output }}" }]
```

### 6. Test en mode "Production"

Dans n8n, cliquez sur "Test Workflow" et envoyez manuellement ce JSON :

```json
{
  "message": "Bonjour, qui es-tu ?"
}
```

Si ça marche en test mais pas depuis votre app, le problème vient du format de données.

## 📞 Besoin d'aide ?

Partagez-moi :
1. Une capture d'écran de votre workflow n8n complet
2. Les logs du terminal après avoir envoyé un message
3. Le message d'erreur exact dans n8n (si visible)

## 🎯 Prochaine étape

**Essayez d'abord de tester votre webhook directement avec curl** pour voir si le problème vient de n8n ou de l'intégration.

