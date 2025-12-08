# 💼 CV Interactif - Rudy Haddad

CV interactif avec agent conversationnel alimenté par n8n + RAG

## 🎯 État actuel

**Version** : 1.0 - Intégration n8n fonctionnelle ✅

### ✅ Fonctionnalités implémentées
- ✅ Interface de chat moderne et responsive
- ✅ Thème clair/sombre avec toggle
- ✅ **Connexion n8n avec système RAG**
- ✅ **Gestion de l'historique de conversation (Simple Memory)**
- ✅ Gestion des erreurs et état de chargement
- ✅ Architecture Next.js 15 optimisée

### 🚧 À venir
- Intégration de l'avatar 3D parlant
- Synthèse vocale (TTS)
- Reconnaissance vocale
- Déploiement production

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Créer le fichier .env.local avec votre URL n8n
echo "N8N_WEBHOOK_URL=https://votre-n8n.com/webhook/votre-id" > .env.local

# Lancement du serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
cv-ai-interactive/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # API route pour n8n
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page d'accueil
│   └── globals.css         # Styles globaux
├── components/
│   ├── ChatInterfaces.tsx  # Interface de chat
│   ├── ThemeProvider.tsx   # Gestion du thème
│   └── ThemeToggle.tsx     # Bouton toggle thème
├── public/
│   └── models/             # Modèles 3D pour avatar (futur)
└── N8N_INTEGRATION.md      # Documentation n8n
```

## 🔧 Technologies

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **React Three Fiber** - 3D (pour avatar futur)
- **n8n** - Orchestration workflow + RAG (à intégrer)

## 📝 Configuration n8n

Voir le fichier [N8N_INTEGRATION.md](./N8N_INTEGRATION.md) pour la documentation complète.

### Workflow n8n requis :
```
Webhook → Simple Memory → AI Agent (+ Vector Store) → Respond
```

### Format des données :

**Envoi** :
```json
{
  "sessionId": "session-xxx",
  "chatInput": "message utilisateur"
}
```

**Réception** :
```json
[{ "output": "réponse de l'IA" }]
```

## 🌐 Déploiement

### Vercel (recommandé)
```bash
npm run build
vercel deploy
```

### Variables d'environnement
Créez un fichier `.env.local` :
```bash
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-id
```

## 📖 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [n8n Documentation](https://docs.n8n.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📧 Contact

Rudy Haddad - [Votre email/LinkedIn]

---

**Note** : L'intégration n8n + RAG est fonctionnelle. L'avatar 3D sera intégré dans une prochaine version.
