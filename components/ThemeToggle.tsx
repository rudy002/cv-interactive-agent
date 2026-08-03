"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useHydrated } from "@/hooks/useHydrated";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const hydrated = useHydrated();

  // The resolved theme is only known in the browser; render a placeholder of
  // the same size on the server so the layout does not shift.
  if (!hydrated) {
    return <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-zinc-600 dark:text-zinc-400" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" aria-hidden="true" />
      )}
    </button>
  );
}
