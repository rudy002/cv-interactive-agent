# 🎨 Ressources pour Avatars

## Sites pour trouver des avatars SVG gratuits

### 1. **DiceBear Avatars** ⭐ (Recommandé)
🔗 https://www.dicebear.com/
- API gratuite pour générer des avatars
- Plusieurs styles (Avataaars, Big Smile, Bottts, Pixel Art...)
- Très facile à intégrer
- Tu peux changer le style en changeant juste l'URL

**Exemple d'intégration :**
```tsx
<img 
  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rudy" 
  alt="Avatar"
/>
```

### 2. **Avataaars Generator**
🔗 https://getavataaars.com/
- Style cartoon populaire
- Générateur en ligne
- Téléchargement SVG gratuit
- Personnalisation complète (cheveux, vêtements, accessoires)

### 3. **Open Peeps**
🔗 https://www.openpeeps.com/
- Illustrations de personnes
- Style dessiné à la main
- Totalement gratuit et open-source
- Possibilité de combiner des éléments

### 4. **Humaaans**
🔗 https://www.humaaans.com/
- Illustrations professionnelles
- Mix & match de personnages
- Gratuit pour usage commercial
- Style moderne et épuré

### 5. **Boring Avatars**
🔗 https://boringavatars.com/
- Avatars abstraits générés
- Plusieurs styles (beam, marble, pixel, ring...)
- API simple
- Parfait pour un style minimal

### 6. **Notion Avatar Maker**
🔗 https://notion-avatar.vercel.app/
- Style Notion
- Cute et professionnel
- Téléchargement SVG
- Personnalisation facile

### 7. **Big Heads**
🔗 https://bigheads.io/
- Avatars avec grosses têtes cartoon
- React component disponible
- Open source
- Style fun et moderne

## APIs d'avatars

### UI Avatars
🔗 https://ui-avatars.com/
- Génère des avatars avec initiales
- Simple URL : `https://ui-avatars.com/api/?name=Rudy+Haddad`
- Personnalisable (couleur, taille, font)

### Robohash
🔗 https://robohash.org/
- Génère des robots, monstres, chats...
- Basé sur un hash/texte
- Fun et unique

### Multiavatar
🔗 https://multiavatar.com/
- 12 milliards d'avatars uniques
- API simple
- Style cartoon coloré

## Comment intégrer dans ton projet

### Option 1 : URL directe (le plus simple)
```tsx
export default function Avatar2d({ isSpeaking = false }: Avatar2dProps) {
  return (
    <div className="relative">
      <img 
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rudy&backgroundColor=b6e3f4"
        alt="Avatar"
        className={`w-48 h-48 rounded-full ${isSpeaking ? 'animate-bounce' : ''}`}
      />
    </div>
  );
}
```

### Option 2 : Télécharger le SVG
1. Va sur un des sites ci-dessus
2. Crée ton avatar
3. Télécharge le SVG
4. Mets-le dans `/public/avatar.svg`
5. Utilise `<img src="/avatar.svg" />`

### Option 3 : Copier le code SVG
1. Génère ton avatar
2. Copie le code SVG complet
3. Colle-le directement dans ton composant React

## Recommendation finale

Pour ton CV interactif, je recommande :

1. **DiceBear (Avataaars style)** - Pro et personnalisable
2. **Notion Avatar Maker** - Moderne et sympathique
3. **Boring Avatars (beam style)** - Minimaliste et élégant

## Exemple complet avec DiceBear

```tsx
'use client';

import { useEffect, useRef } from 'react';

interface Avatar2dProps {
  isSpeaking?: boolean;
}

export default function Avatar2d({ isSpeaking = false }: Avatar2dProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Ondes sonores */}
      {isSpeaking && (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-30" />
          <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-pulse opacity-20" />
        </>
      )}
      
      {/* Avatar */}
      <img 
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rudy"
        alt="Avatar Rudy"
        className={`w-48 h-48 rounded-full transition-transform ${
          isSpeaking ? 'scale-110' : 'scale-100'
        }`}
      />
      
      {/* Indicateur de parole */}
      {isSpeaking && (
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
      )}
    </div>
  );
}
```

C'est tout ! Super simple et ça marche immédiatement. 🚀

