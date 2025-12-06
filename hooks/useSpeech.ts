'use client';

import { useCallback, useEffect, useState } from 'react';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Nettoyer à la fermeture du composant
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string, options?: { 
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
  }) => {
    if (typeof window === 'undefined') return;

    // Annuler toute parole en cours
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang || 'fr-FR';
    utterance.rate = options?.rate || 1.0;
    utterance.pitch = options?.pitch || 1.0;
    utterance.volume = options?.volume || 1.0;

    setCurrentText(text);

    utterance.onstart = () => {
      console.log('🎙️ TTS: Début de la parole');
      setIsSpeaking(true);
      setIsPaused(false);
      setCurrentCharIndex(0);
      
      // Simuler la progression du texte en fonction de la durée estimée
      const wordsPerMinute = 150 * (options?.rate || 1.0);
      const words = text.split(' ').length;
      const durationMs = (words / wordsPerMinute) * 60 * 1000;
      const charsPerMs = text.length / durationMs;
      
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newIndex = Math.min(Math.floor(elapsed * charsPerMs), text.length);
        setCurrentCharIndex(newIndex);
        
        if (newIndex >= text.length) {
          clearInterval(interval);
        }
      }, 50);
      
      // Nettoyer l'interval
      (utterance as any).progressInterval = interval;
    };

    utterance.onend = () => {
      console.log('🎙️ TTS: Fin de la parole');
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentCharIndex(0);
      setCurrentText('');
      
      if ((utterance as any).progressInterval) {
        clearInterval((utterance as any).progressInterval);
      }
    };

    utterance.onerror = (e) => {
      console.error('🎙️ TTS: Erreur', e);
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentCharIndex(0);
      setCurrentText('');
      
      if ((utterance as any).progressInterval) {
        clearInterval((utterance as any).progressInterval);
      }
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);

  const pause = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    currentText,
    currentCharIndex,
  };
}

