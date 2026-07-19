"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// GSAP ScrollTrigger measures pin/scrub trigger positions when each
// component mounts. If anything on the page (images, fonts, other
// components further down) finishes loading/laying out afterward, those
// measurements go stale and pinned sections can render at the wrong
// scroll offset. Refreshing once everything has actually loaded — plus on
// resize — keeps every ScrollTrigger instance on the page correct
// regardless of mount order or asset load timing.
export function ScrollTriggerRefresh() {
  useEffect(() => {
    function refresh() {
      ScrollTrigger.refresh();
    }
    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh);
    }
    window.addEventListener("resize", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, []);

  return null;
}
