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
        <ChatInterfaces />
      </main>
    </div>
  );
}
