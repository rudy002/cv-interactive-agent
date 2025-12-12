'use client';

import { useState } from "react";
import ChatInterfaces from "@/components/ChatInterfaces";
import MiniBrowser from "@/components/MiniBrowser";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [currentTopic, setCurrentTopic] = useState<string>("");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black">
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Toggle de thème en haut à droite */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        
        <div className="flex-1 flex h-full flex-col lg:flex-row overflow-hidden">
          {/* Mini Browser (mobile: plein écran, desktop: moitié gauche) */}
          <div className="w-full lg:w-1/2 h-full relative border-b lg:border-b-0 border-r lg:border-r border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <MiniBrowser currentTopic={currentTopic} />
          </div>

          {/* Chat dédié (uniquement desktop) */}
          <div className="hidden lg:block flex-1 h-full overflow-hidden">
            <ChatInterfaces onTopicChange={setCurrentTopic} />
          </div>
        </div>
      </main>
    </div>
  );
}
