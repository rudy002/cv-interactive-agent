"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeDebug() {
  const { theme, resolvedTheme } = useTheme();
  const [htmlClass, setHtmlClass] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHtmlClass(document.documentElement.className);
    
    const observer = new MutationObserver(() => {
      setHtmlClass(document.documentElement.className);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded z-50">
      <div>Theme: {theme || "loading"}</div>
      <div>Resolved: {resolvedTheme || "loading"}</div>
      <div>HTML class: {htmlClass || "(none)"}</div>
    </div>
  );
}

