"use client";

import { useSyncExternalStore } from "react";

/** Nothing ever changes after hydration, so the store never notifies. */
const subscribe = () => () => {};

/**
 * `false` during SSR and the hydration pass, `true` afterwards.
 *
 * Used to gate anything whose value only exists in the browser (resolved
 * theme, current time) so server and client markup always agree.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
