"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Lets a recruiter lift an answer straight into their notes or an email. */
export default function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable in this context; nothing useful to show.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors rounded-sm px-1 py-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
      aria-label={copied ? "Answer copied" : label}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" aria-hidden="true" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" aria-hidden="true" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
