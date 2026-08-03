"use client";

import { useState } from "react";
import { Check, Download, Linkedin, Mail } from "lucide-react";
import { links, profile } from "@/data/profile";

/**
 * The three things a recruiter actually came for, always one tap away.
 *
 * They used to be buried: the CV lived behind the browser's ⋮ menu, and the
 * email behind a 5–10s question to the agent. None of these need the agent at
 * all, so none of them should wait for it.
 */

const BUTTON =
  "inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors touch-manipulation min-h-9 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500";

export default function RecruiterActions() {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleEmail = async () => {
    // Copy as a safety net: without a registered mail handler the `mailto:`
    // silently does nothing and the visitor is left with no address.
    try {
      await navigator.clipboard.writeText(profile.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2500);
    } catch {
      // Clipboard blocked; the mailto navigation still runs.
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
      <a
        href={profile.resumePath}
        download={profile.resumeDownloadName}
        className={`${BUTTON} bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white`}
        title={`Download ${profile.name}'s CV (PDF)`}
      >
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        <span>CV</span>
        <span className="sr-only"> (PDF)</span>
      </a>

      <a
        href={`mailto:${profile.email}?subject=${encodeURIComponent(
          "Opportunity for you",
        )}`}
        onClick={handleEmail}
        className={`${BUTTON} bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700`}
        title={`Email ${profile.email} — the address is copied to your clipboard too`}
      >
        {emailCopied ? (
          <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" aria-hidden="true" />
        ) : (
          <Mail className="w-3.5 h-3.5" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">{emailCopied ? "Copied!" : "Email"}</span>
        <span className="sr-only">Email {profile.email}</span>
      </a>

      <a
        href={links.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={`${BUTTON} bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700`}
        title="Open LinkedIn profile"
      >
        <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="sr-only">LinkedIn profile</span>
      </a>
    </div>
  );
}
