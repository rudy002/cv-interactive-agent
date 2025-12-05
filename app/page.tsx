import Avatar3d from "@/components/Avatar3d";
import ChatInterfaces from "@/components/ChatInterfaces";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black">
      {/* Colonne gauche - Avatar 3D */}
      <aside className="hidden lg:flex lg:w-1/3 xl:w-2/5 flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
        <div className="w-full h-full flex items-center justify-center p-8">
          <Avatar3d />
        </div>
      </aside>

      {/* Colonne droite - Interface de chat */}
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
