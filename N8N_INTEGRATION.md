# 🔗 Intégration n8n - Documentation

## ✅ Intégration terminée

L'application est maintenant connectée à n8n avec :
- ✅ Route API Next.js (`/app/api/chat/route.ts`)
- ✅ Gestion du sessionId pour Simple Memory
- ✅ Gestion des erreurs et état de chargement
- ✅ Support du système RAG avec Vector Store

## 🚀 Configuration

### Variables d'environnement

Fichier `.env.local` requis à la racine du projet :

```env
N8N_WEBHOOK_URL=https://votre-instance-n8n.com/webhook/votre-id
```

### Format des données

#### Envoi à n8n (payload) :
```json
{
  "sessionId": "session-1234567890-abc123",
  "chatInput": "Question de l'utilisateur"
}
```

#### Réception de n8n (réponse) :
Format supporté (tableau avec output) :
```json
[
  {
    "output": "La réponse de l'assistant IA"
  }
]
```

### Configuration n8n Simple Memory

Dans le node **Simple Memory**, configurez :

**Session ID** : Utilisez l'expression
```
{{ $json.sessionId }}
```

### Structure du workflow n8n

```
Webhook (Trigger)
    ↓
Simple Memory (gestion de l'historique)
    ↓
AI Agent (avec Vector Store Tool)
    ↓
Respond to Webhook
```

## 🧪 Test

```bash
npm run dev
```

Ouvrez `http://localhost:3000` et commencez à discuter !

## 📝 Notes

- Le `sessionId` est généré automatiquement côté client
- Simple Memory gère l'historique de conversation automatiquement
- Le fichier `.env.local` ne doit JAMAIS être commité dans Git

