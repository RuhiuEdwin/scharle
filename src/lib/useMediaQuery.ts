"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Subscribes to a CSS media query.
 *
 * `useSyncExternalStore` rather than `useState` + an effect: it takes a
 * separate server snapshot, so SSR and the hydrating render agree and
 * React corrects the value itself immediately afterwards — no cascading
 * render, and the query keeps answering as the viewport or OS setting
 * changes. Always `false` on the server, where there is no `matchMedia`. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
