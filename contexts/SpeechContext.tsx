"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSpeech } from "@/hooks/useSpeech";

interface SpeechContextType {
  speak: (text: string, options?: { lang?: string; rate?: number; pitch?: number; volume?: number }) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  currentText: string;
  currentCharIndex: number;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export function SpeechProvider({ children }: { children: ReactNode }) {
  const speech = useSpeech();

  return (
    <SpeechContext.Provider value={speech}>
      {children}
    </SpeechContext.Provider>
  );
}

export function useSpeechContext() {
  const context = useContext(SpeechContext);
  if (context === undefined) {
    throw new Error("useSpeechContext must be used within a SpeechProvider");
  }
  return context;
}

