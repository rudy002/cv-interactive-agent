"use client";

import ChatInterfaces from "@/components/ChatInterfaces";
import MiniBrowser from "@/components/MiniBrowser";
import ThemeToggle from "@/components/ThemeToggle";
import { ChatProvider } from "@/components/ChatProvider";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <ChatProvider>
      <div className="flex h-dvh w-full overflow-hidden bg-white dark:bg-black">
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* On mobile the theme toggle lives inside the fake address bar. */}
          <div className="hidden lg:block absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
            <ThemeToggle />
          </div>

          <div className="flex-1 flex h-full flex-col lg:flex-row overflow-hidden">
            <div className="w-full lg:w-1/2 h-full relative border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <MiniBrowser />
            </div>

            {/*
              Desktop only. Mounting it on mobile as well would give the
              conversation two live surfaces fighting over focus and scroll —
              there, the chat is a tab inside the fake browser instead.
            */}
            {!isMobile && (
              <div className="hidden lg:block flex-1 h-full overflow-hidden">
                <ChatInterfaces />
              </div>
            )}
          </div>
        </main>
      </div>
    </ChatProvider>
  );
}
