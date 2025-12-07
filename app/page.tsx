'use client';

import ChatInterfaces from "@/components/ChatInterfaces";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black">
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Toggle de thème en haut à droite */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        
        <div className="flex-1 flex h-full">
          {/* Emplacement Avatar à gauche */}
          <div className="w-1/3 h-full relative bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800">
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">👤</div>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  Emplacement Avatar
                </p>
                <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-2">
                  À intégrer plus tard
                </p>
              </div>
            </div>
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
