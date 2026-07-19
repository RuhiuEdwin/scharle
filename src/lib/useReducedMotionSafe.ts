"use client";

import { useLayoutEffect, useState } from "react";

/** Framer Motion's own `useReducedMotion()` reads `matchMedia` during
 * render, which returns a real answer on the client but nothing on the
 * server (no `window`) — SSR always renders the animated branch, so a
 * client whose OS actually prefers reduced motion renders the plain
 * branch on its very first (hydrating) pass, a genuine attribute
 * mismatch React can't patch up. Starting state at `false` matches what
 * SSR always renders, so hydration is clean; `useLayoutEffect` then
 * corrects it before paint if the OS actually prefers reduced motion. */
export function useReducedMotionSafe() {
  const [reduced, setReduced] = useState(false);
  useLayoutEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}
