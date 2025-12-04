"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Vérifier le thème au chargement
    console.log("ThemeProvider mounted");
    console.log("HTML classes:", document.documentElement.className);
  }, []);

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem={false}
      storageKey="cv-theme"
    >
      {children}
    </NextThemesProvider>
  );
}

