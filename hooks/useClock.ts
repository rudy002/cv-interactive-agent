"use client";

import { useSyncExternalStore } from "react";

const TICK_MS = 30_000;
const PLACEHOLDER = "--:--";

function subscribe(onChange: () => void): () => void {
  const interval = setInterval(onChange, TICK_MS);
  return () => clearInterval(interval);
}

/**
 * Returns the same string for a whole minute, so React's snapshot-caching
 * requirement is satisfied.
 */
const getSnapshot = () =>
  new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const getServerSnapshot = () => PLACEHOLDER;

/**
 * Client-only wall clock.
 *
 * Rendering `new Date()` inline broke hydration: the page is prerendered, so
 * the HTML carried the *build* time while the client rendered the current one.
 * It also never ticked.
 */
export function useClock(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
