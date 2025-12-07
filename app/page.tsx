'use client';

import ChatInterfaces from "@/components/ChatInterfaces";
import ThemeToggle from "@/components/ThemeToggle";
import { AvatarPanel } from "@/components/AvatarPanel";
import { useSpeechContext } from "@/contexts/SpeechContext";

export default function Home() {
  const { isSpeaking } = useSpeechContext();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black">
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Toggle de thème en haut à droite */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <div className="flex-1 flex h-full">
          {/* Avatar à gauche */}
          <div className="w-1/3 h-full">
            <AvatarPanel isSpeaking={isSpeaking} />
          </div>
          {/* Chat à droite */}
          <div className="flex-1">
            <ChatInterfaces />
          </div>
        </div>
      </main>
    </div>
  );
}
