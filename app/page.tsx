'use client';

import Avatar2d from "@/components/Avatar2d";
import ChatInterfaces from "@/components/ChatInterfaces";
import ThemeToggle from "@/components/ThemeToggle";
import { useState } from "react";

export default function Home() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentChar, setCurrentChar] = useState('');

  const handleSpeakingChange = (speaking: boolean, char?: string) => {
    setIsSpeaking(speaking);
    setCurrentChar(char || '');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black">
      {/* Colonne gauche - Avatar 2D */}
      <aside className="hidden lg:flex lg:w-1/3 xl:w-2/5 flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
        <div className="w-full h-full flex items-center justify-center p-8">
          <Avatar2d isSpeaking={isSpeaking} currentChar={currentChar} />
        </div>
      </aside>

      {/* Colonne droite - Interface de chat */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Toggle de thème en haut à droite */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <ChatInterfaces onSpeakingChange={handleSpeakingChange} />
      </main>
    </div>
  );
}
