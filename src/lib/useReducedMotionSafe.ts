"use client";

import { useMediaQuery } from "@/lib/useMediaQuery";

/** Framer Motion's own `useReducedMotion()` reads `matchMedia` during
 * render, which returns a real answer on the client but nothing on the
 * server (no `window`) — SSR always renders the animated branch, so a
 * client whose OS actually prefers reduced motion renders the plain
 * branch on its very first (hydrating) pass, a genuine attribute
 * mismatch React can't patch up. `useMediaQuery` answers `false` on the
 * server, matching what SSR renders, then corrects after hydration. */
export function useReducedMotionSafe() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
