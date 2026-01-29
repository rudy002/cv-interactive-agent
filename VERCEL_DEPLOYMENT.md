# 🚀 Guide de déploiement sur Vercel

Ce guide vous explique comment déployer votre application Next.js sur Vercel.

## 📋 Prérequis

1. **Compte Vercel** : Créez un compte gratuit sur [vercel.com](https://vercel.com)
2. **Repository Git** : Votre projet doit être sur GitHub, GitLab ou Bitbucket
3. **Variable d'environnement** : Vous devez avoir l'URL de votre webhook n8n

## 🎯 Méthode 1 : Déploiement via l'interface web (Recommandé)

### Étape 1 : Préparer votre repository Git

Assurez-vous que votre code est poussé sur GitHub/GitLab/Bitbucket :

```bash
# Si ce n'est pas déjà fait, initialisez Git et poussez votre code
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votre-username/votre-repo.git
git push -u origin main
```

### Étape 2 : Importer le projet sur Vercel

1. Connectez-vous à [vercel.com](https://vercel.com)
2. Cliquez sur **"Add New..."** → **"Project"**
3. Importez votre repository depuis GitHub/GitLab/Bitbucket
4. Vercel détectera automatiquement que c'est un projet Next.js

### Étape 3 : Configuration du projet

Vercel devrait détecter automatiquement :
- **Framework Preset** : Next.js
- **Root Directory** : `cv-ai-interactive` (si votre repo est à la racine, laissez vide)
- **Build Command** : `npm run build` (automatique)
- **Output Directory** : `.next` (automatique)

⚠️ **Important** : Si votre repository contient plusieurs projets, définissez le **Root Directory** sur `cv-ai-interactive`

### Étape 4 : Configurer les variables d'environnement

Avant de déployer, ajoutez votre variable d'environnement :

1. Dans la section **"Environment Variables"**
2. Ajoutez :
   - **Name** : `N8N_WEBHOOK_URL`
   - **Value** : L'URL complète de votre webhook n8n (ex: `https://votre-instance-n8n.com/webhook/votre-id`)
   - **Environments** : Cochez **Production**, **Preview**, et **Development**

### Étape 5 : Déployer

1. Cliquez sur **"Deploy"**
2. Attendez que le build se termine (environ 1-2 minutes)
3. Votre application sera disponible à l'URL : `https://votre-projet.vercel.app`

## 🛠️ Méthode 2 : Déploiement via CLI

### Étape 1 : Installer Vercel CLI

```bash
npm i -g vercel
```

### Étape 2 : Se connecter

```bash
vercel login
```

### Étape 3 : Déployer

Depuis le dossier `cv-ai-interactive` :

```bash
cd cv-ai-interactive
vercel
```

Suivez les instructions interactives :
- Link to existing project ? → **N** (pour la première fois)
- Project name ? → Appuyez sur Entrée pour le nom par défaut
- Directory ? → Appuyez sur Entrée (`.` pour le dossier actuel)

### Étape 4 : Configurer les variables d'environnement

```bash
vercel env add N8N_WEBHOOK_URL
```

Entrez la valeur de votre webhook n8n quand demandé.

### Étape 5 : Déployer en production

```bash
vercel --prod
```

## 🔧 Configuration avancée (optionnel)

### Fichier `vercel.json`

Si vous avez besoin de configurations spécifiques, créez un fichier `vercel.json` à la racine :

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["cdg1"]
}
```

### Variables d'environnement par environnement

Vous pouvez avoir des valeurs différentes selon l'environnement :

- **Production** : URL de production de n8n
- **Preview** : URL de staging de n8n
- **Development** : URL locale (pour les tests)

## ✅ Vérification après déploiement

1. Visitez votre URL Vercel
2. Testez la fonctionnalité de chat
3. Vérifiez les logs dans le dashboard Vercel si nécessaire

## 🔍 Dépannage

### Erreur : "N8N_WEBHOOK_URL non configurée"

- Vérifiez que la variable d'environnement est bien configurée dans Vercel
- Redéployez après avoir ajouté la variable

### Erreur de build

- Vérifiez les logs de build dans le dashboard Vercel
- Assurez-vous que toutes les dépendances sont dans `package.json`

### Problème de CORS avec n8n

Si vous avez des erreurs CORS, configurez votre workflow n8n pour accepter les requêtes depuis votre domaine Vercel.

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Next.js sur Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Variables d'environnement Vercel](https://vercel.com/docs/environment-variables)




