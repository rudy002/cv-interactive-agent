"use client";

import { useEffect } from "react";
import { links } from "@/data/profile";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-white dark:bg-black px-6">
      <div className="max-w-md text-center space-y-4">
        <p className="text-5xl" aria-hidden="true">
          🤖
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Something went wrong
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          The interactive CV hit an unexpected error. Trying again usually fixes it.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:opacity-90 transition-opacity focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Try again
          </button>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Reach me on LinkedIn
          </a>
        </div>
        {error.digest && (
          <p className="text-xs text-zinc-400 dark:text-zinc-600 pt-2">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
