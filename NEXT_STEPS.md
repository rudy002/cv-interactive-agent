# 🚀 Prochaines étapes - Intégration n8n

## ✅ État actuel

### Ce qui est en place
- ✅ Interface chat (ChatInterfaces)
- ✅ Toggle thème clair/sombre (ThemeToggle)
- ✅ Emplacement réservé pour l'avatar (à gauche)
- ✅ Structure propre et minimaliste

### Ce qui a été supprimé
- ❌ Tous les composants avatar (AvatarPanel, TalkingAvatar)
- ❌ Système de speech (useSpeech, SpeechContext)
- ❌ Tests et boutons de démonstration
- ❌ Documentation temporaire

## 📁 Structure actuelle

```
cv-ai-interactive/
├── app/
│   ├── layout.tsx          # Layout principal avec ThemeProvider
│   ├── page.tsx            # Page principale (Chat + Placeholder Avatar)
│   └── globals.css         # Styles globaux
├── components/
│   ├── ChatInterfaces.tsx  # ✅ Composant chat
│   ├── ThemeProvider.tsx   # ✅ Provider thème
│   └── ThemeToggle.tsx     # ✅ Toggle clair/sombre
└── public/
    └── models/             # Modèles 3D conservés pour plus tard
```

## 🎯 Objectif : Connexion n8n

### 1. Configuration n8n

#### Créer un workflow n8n
1. **Endpoint Webhook** pour recevoir les messages du chat
2. **Traitement RAG** avec votre base de connaissances (CV, projets, expériences)
3. **Réponse** renvoyée au frontend

#### Exemple de workflow n8n
```
[Webhook] → [Vector Store / Pinecone] → [OpenAI / Claude] → [Response]
```

### 2. Modification du composant Chat

Il faudra modifier `ChatInterfaces.tsx` pour :

#### A. Remplacer l'API actuelle
```typescript
// Au lieu de l'API locale
const response = await fetch('/api/chat', { ... });

// Appeler n8n
const response = await fetch('https://your-n8n-instance.com/webhook/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    sessionId: sessionId, // Pour garder le contexte
  })
});
```

#### B. Variables d'environnement
Créer `.env.local` :
```bash
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chat
```

### 3. Étapes d'intégration

#### Étape 1 : Configurer n8n
- [ ] Créer un compte n8n (cloud ou self-hosted)
- [ ] Créer un nouveau workflow
- [ ] Ajouter un nœud Webhook (trigger)
- [ ] Configurer votre RAG (Pinecone, Supabase, etc.)
- [ ] Ajouter un nœud LLM (OpenAI, Claude, etc.)
- [ ] Tester avec Postman/Insomnia

#### Étape 2 : Adapter ChatInterfaces.tsx
```typescript
// Exemple de modification à faire

const sendMessage = async (message: string) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId: sessionStorage.getItem('chatSessionId') || generateId(),
        timestamp: new Date().toISOString(),
      }),
    });

    const data = await response.json();
    
    // Ajouter la réponse au chat
    addMessage({
      role: 'assistant',
      content: data.response, // Adapter selon votre format de réponse n8n
    });
  } catch (error) {
    console.error('Erreur n8n:', error);
    // Gérer l'erreur
  }
};
```

#### Étape 3 : Tester
- [ ] Tester localement avec `npm run dev`
- [ ] Vérifier les logs dans n8n
- [ ] Vérifier que les réponses arrivent bien

#### Étape 4 : Améliorer
- [ ] Ajouter un indicateur de chargement pendant l'attente
- [ ] Gérer les erreurs réseau
- [ ] Ajouter un timeout
- [ ] Gérer les sessions/contexte

### 4. Format de données recommandé

#### Requête vers n8n
```json
{
  "message": "Quelles sont vos compétences en React ?",
  "sessionId": "uuid-v4",
  "metadata": {
    "timestamp": "2025-01-01T12:00:00Z",
    "source": "web"
  }
}
```

#### Réponse de n8n
```json
{
  "response": "Je maîtrise React depuis 5 ans...",
  "sources": ["cv.pdf", "projects.json"],
  "confidence": 0.95,
  "sessionId": "uuid-v4"
}
```

## 🎨 Avatar (pour plus tard)

Une fois le chat avec n8n fonctionnel, on pourra :

### Option 1 : Réintégrer l'avatar simple
- Reprendre le code qui fonctionnait (AvatarPanel avec morphTargets)
- Le faire parler quand l'assistant répond
- Synchronisation labiale avec TTS

### Option 2 : Utiliser un service externe
- D3D (did.ai) - Avatars réalistes avec lip-sync parfait
- Synthesia - Avatars IA professionnels
- HeyGen - Avatars vidéo

### Option 3 : Avatar 2D simplifié
- Lottie animations
- Sprites animés
- Plus léger et plus simple

## 📝 Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Linter
npm run lint

# Nettoyer node_modules si problème
rm -rf node_modules package-lock.json
npm install
```

## 🔗 Ressources n8n

- [Documentation n8n](https://docs.n8n.io/)
- [n8n Webhooks](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [n8n AI Nodes](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain/)
- [Templates n8n](https://n8n.io/workflows/)

## 💡 Conseils

1. **Commencez simple** : Un workflow n8n basique avec une réponse statique
2. **Testez progressivement** : Ajoutez le RAG ensuite
3. **Gérez les erreurs** : Prévoyez un fallback si n8n est down
4. **Sécurisez** : Ajoutez une authentification si nécessaire
5. **Loggez tout** : Pour débugger facilement

## 🎯 Timeline suggérée

### Jour 1-2 : Setup n8n
- Créer le workflow de base
- Tester avec Postman
- Intégrer les données de votre CV

### Jour 3-4 : Intégration frontend
- Modifier ChatInterfaces.tsx
- Tester l'intégration
- Gérer les erreurs

### Jour 5 : Polish
- UX/UI améliorations
- Messages de chargement
- Gestion des erreurs élégante

### Plus tard : Avatar
- Réintégrer l'avatar quand tout le reste marche
- Tester différentes options
- Choisir la meilleure solution

---

Bon courage pour l'intégration n8n ! 🚀

