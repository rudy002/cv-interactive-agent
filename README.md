# 💼 CV Interactif - Rudy Haddad

CV interactif avec agent conversationnel alimenté par n8n + RAG

## 🎯 État actuel

**Version** : Base propre prête pour intégration n8n

### ✅ Fonctionnalités implémentées
- Interface de chat moderne et responsive
- Thème clair/sombre avec toggle
- Emplacement réservé pour avatar (à intégrer plus tard)
- Architecture Next.js 15 optimisée

### 🚧 À faire
- Connexion au workflow n8n pour le RAG
- Intégration de l'avatar parlant
- Déploiement production

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
cv-ai-interactive/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page d'accueil (Chat + Avatar placeholder)
│   └── globals.css         # Styles globaux
├── components/
│   ├── ChatInterfaces.tsx  # Interface de chat
│   ├── ThemeProvider.tsx   # Gestion du thème
│   └── ThemeToggle.tsx     # Bouton toggle thème
├── public/
│   └── models/             # Modèles 3D pour avatar (futur)
└── NEXT_STEPS.md           # Guide d'intégration n8n
```

## 🔧 Technologies

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **React Three Fiber** - 3D (pour avatar futur)
- **n8n** - Orchestration workflow + RAG (à intégrer)

## 📝 Prochaines étapes

Voir le fichier [NEXT_STEPS.md](./NEXT_STEPS.md) pour le guide complet d'intégration n8n.

### 1. Configurer n8n
- Créer un workflow avec webhook
- Ajouter votre RAG (Pinecone, Supabase, etc.)
- Configurer le LLM (OpenAI, Claude, etc.)

### 2. Connecter le chat
- Modifier `ChatInterfaces.tsx`
- Ajouter l'URL du webhook n8n
- Tester l'intégration

### 3. Avatar (optionnel)
- Réintégrer l'avatar 3D
- Ajouter le TTS
- Synchronisation labiale

## 🌐 Déploiement

### Vercel (recommandé)
```bash
npm run build
vercel deploy
```

### Variables d'environnement
```bash
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chat
```

## 📖 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [n8n Documentation](https://docs.n8n.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📧 Contact

Rudy Haddad - [Votre email/LinkedIn]

---

**Note** : Ce projet est actuellement en phase de développement. La partie avatar a été temporairement désactivée pour se concentrer sur l'intégration n8n + RAG.
