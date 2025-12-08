# 🔗 Intégration n8n - Guide de Configuration

## 📋 Ce qui a été fait

✅ Route API Next.js créée (`/app/api/chat/route.ts`)
✅ Composant Chat mis à jour pour appeler l'API
✅ Gestion des erreurs et état de chargement
✅ Indicateur visuel pendant le chargement

## 🚀 Étapes pour finaliser l'intégration

### 1. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
cp .env.example .env.local
```

Modifiez `.env.local` avec vos vraies valeurs :

```env
N8N_WEBHOOK_URL=https://votre-instance-n8n.com/webhook/chat
# Si vous avez une clé API :
# N8N_API_KEY=votre_cle_api
```

### 2. Configurer votre workflow n8n

Votre workflow n8n doit :

#### Entrée (Webhook) :
- **Méthode** : POST
- **Corps attendu** :
  ```json
  {
    "message": "Question de l'utilisateur",
    "conversationHistory": [...],
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

#### Sortie (Response) :
Votre workflow doit retourner une réponse au format JSON :

**Option 1** (recommandée) :
```json
{
  "response": "La réponse de votre assistant IA"
}
```

**Option 2** :
```json
{
  "output": "La réponse de votre assistant IA"
}
```

**Option 3** :
```json
{
  "message": "La réponse de votre assistant IA"
}
```

### 3. Structure typique d'un workflow n8n RAG

```
Webhook (Trigger)
    ↓
Extraire le message
    ↓
Recherche vectorielle (Pinecone/Supabase/autre)
    ↓
Préparer le prompt avec contexte
    ↓
Appel LLM (OpenAI/Anthropic/autre)
    ↓
Formater la réponse
    ↓
Retourner la réponse
```

### 4. Adapter le code si nécessaire

Si votre n8n retourne un format différent, modifiez `app/api/chat/route.ts` ligne 32-34 :

```typescript
// Actuellement :
message: data.response || data.output || data.message || data,

// Adaptez selon votre format n8n
```

### 5. Tester l'intégration

1. Démarrez votre serveur de développement :
```bash
npm run dev
```

2. Ouvrez votre navigateur sur `http://localhost:3000`

3. Envoyez un message de test

4. Vérifiez :
   - Les logs de la console du navigateur (F12)
   - Les logs de votre workflow n8n
   - La réponse affichée dans le chat

### 6. Debug

Si ça ne fonctionne pas :

1. **Vérifier l'URL du webhook** :
   ```bash
   # Tester directement avec curl
   curl -X POST https://votre-n8n-instance.com/webhook/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"test"}'
   ```

2. **Vérifier les CORS** :
   Dans n8n, assurez-vous que votre webhook accepte les requêtes depuis votre domaine

3. **Vérifier les logs** :
   - Console navigateur (F12 → Console)
   - Terminal du serveur Next.js
   - Logs n8n

## 📝 Notes importantes

- Le fichier `.env.local` ne doit JAMAIS être commité dans Git
- Assurez-vous que votre workflow n8n est activé
- Pour la production, utilisez les variables d'environnement de votre hébergeur

## 🔒 Sécurité

Pour sécuriser votre endpoint n8n :

1. Ajoutez une authentification dans n8n
2. Utilisez `N8N_API_KEY` dans `.env.local`
3. Décommentez la ligne 20 dans `app/api/chat/route.ts` :
   ```typescript
   'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
   ```

## ❓ Besoin d'aide ?

Si vous rencontrez des problèmes, partagez :
- Les logs d'erreur du navigateur
- Les logs de n8n
- Une capture d'écran de votre workflow n8n

