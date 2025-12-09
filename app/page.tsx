'use client';

import { useState } from "react";
import ChatInterfaces from "@/components/ChatInterfaces";
import MiniBrowser from "@/components/MiniBrowser";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [currentTopic, setCurrentTopic] = useState<string>("");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black">
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Toggle de thème en haut à droite */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        
        <div className="flex-1 flex h-full">
          {/* Mini Browser à gauche */}
          <div className="w-1/2 h-full relative border-r border-zinc-200 dark:border-zinc-800">
            <MiniBrowser currentTopic={currentTopic} />
          </div>
          
          {/* Chat à droite */}
          <div className="flex-1">
            <ChatInterfaces onTopicChange={setCurrentTopic} />
          </div>
        </div>
      </main>
    </div>
  );
}
