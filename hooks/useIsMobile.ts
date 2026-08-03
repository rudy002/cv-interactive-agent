"use client";

import { useSyncExternalStore } from "react";

/** Matches Tailwind's `lg` breakpoint: below it, the layout is single-column. */
export const MOBILE_MEDIA_QUERY = "(max-width: 1023px)";

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(MOBILE_MEDIA_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(MOBILE_MEDIA_QUERY).matches;

/** The server has no viewport; assume desktop and let the client correct it. */
const getServerSnapshot = () => false;

/**
 * Shared breakpoint state so the layout and the fake browser never disagree
 * about which surface owns the chat.
 *
 * `useSyncExternalStore` is the right primitive here: it subscribes to a real
 * external store (matchMedia) and gives React a server snapshot, instead of the
 * setState-inside-an-effect pattern that triggers cascading renders.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
