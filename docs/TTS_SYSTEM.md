# Système TTS (Text-to-Speech) avec Animation d'Avatar

## 🎯 Fonctionnalités implémentées

### 1. Hook `useSpeech`
Localisation : `/hooks/useSpeech.ts`

Un hook React personnalisé qui gère la synthèse vocale du navigateur :
- ✅ Lecture de texte en français
- ✅ Contrôle du débit, volume, et pitch
- ✅ Pause/Reprise/Arrêt
- ✅ État `isSpeaking` pour synchroniser l'animation

### 2. Animation de l'Avatar
Localisation : `/components/Avatar3d.tsx`

L'avatar 3D réagit maintenant à la parole :
- 🎭 Légère rotation (sway) quand il parle
- 📢 Animation de "respiration" synchronisée (8 Hz)
- 🔄 Position et rotation se réinitialisent quand le TTS s'arrête

Props ajoutés :
```typescript
interface Avatar3dProps {
  expressions?: Record<string, number>;
  isSpeaking?: boolean;  // ← Nouveau
}
```

### 3. Intégration dans le Chat
Localisation : `/components/ChatInterfaces.tsx`

Le chat déclenche automatiquement la lecture vocale :
- 🔊 Les réponses de l'assistant sont lues automatiquement
- 🎚️ Bouton on/off pour activer/désactiver le son
- ⏹️ Bouton stop pour arrêter la lecture en cours
- 📊 Indicateur visuel "En train de parler..."

### 4. Architecture de partage d'état
Localisation : `/app/page.tsx`

L'état `isSpeaking` est géré au niveau de la page parent et partagé entre :
- Le composant `Avatar3d` (pour l'animation)
- Le composant `ChatInterfaces` (pour les contrôles)

## 🚀 Utilisation

### Test rapide
1. Lancez l'application : `npm run dev`
2. Ouvrez http://localhost:3000
3. Tapez un message dans le chat
4. L'avatar va **parler** et **bouger** ! 🎉

### Contrôles disponibles
- **Bouton volume** : Active/désactive la lecture automatique
- **Bouton stop** : Arrête la lecture en cours
- **Indicateur vert** : S'affiche pendant la lecture

## 🎨 Personnalisation

### Modifier la voix
Dans `ChatInterfaces.tsx`, ligne où on appelle `speak()` :
```typescript
speak(assistantMessage.content, { 
  lang: 'fr-FR',  // Langue
  rate: 1.0,      // Vitesse (0.1 à 10)
  pitch: 1.0,     // Tonalité (0 à 2)
  volume: 1.0     // Volume (0 à 1)
});
```

### Modifier l'animation
Dans `Avatar3d.tsx`, section "Animation de parole" :
```typescript
const breathe = Math.sin(elapsed * 8) * 0.015; // Fréquence & amplitude
const sway = Math.sin(elapsed * 2) * 0.02;     // Oscillation
```

## 📝 Prochaines étapes suggérées

### Phase 2 : Émotions 🎭
- [ ] Backend renvoie `{ answer, emotion }`
- [ ] Changer l'éclairage selon l'émotion
- [ ] Ajouter des particules visuelles

### Phase 3 : Avatar avec Morph Targets 🎨
- [ ] Créer un avatar Ready Player Me
- [ ] Remplacer le modèle actuel
- [ ] Animer les expressions faciales

### Phase 4 : Amélioration TTS 🎙️
- [ ] Intégrer ElevenLabs ou OpenAI TTS (voix plus naturelle)
- [ ] Lip-sync avec visèmes
- [ ] Support multilingue

## 🐛 Dépannage

**Le son ne marche pas ?**
- Vérifiez que votre navigateur autorise l'audio
- Testez dans Chrome/Edge (meilleur support de speechSynthesis)

**L'avatar ne bouge pas ?**
- Ouvrez la console pour vérifier les erreurs
- Vérifiez que `isSpeaking` est bien `true` dans React DevTools

**La voix est bizarre ?**
- C'est normal, c'est la voix du navigateur (basique)
- Pour une voix pro, utilisez une API comme ElevenLabs

## 📚 Ressources

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Three.js Animation](https://threejs.org/docs/#manual/en/introduction/Animation-system)
- [Ready Player Me](https://readyplayer.me/)

