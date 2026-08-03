import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-white dark:bg-black px-6">
      <div className="max-w-md text-center space-y-4">
        <p className="text-5xl" aria-hidden="true">
          🧭
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          This page does not exist
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Everything lives on the home page — the browser panel and the chat are right there.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:opacity-90 transition-opacity focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Back to the CV
        </Link>
      </div>
    </div>
  );
}
