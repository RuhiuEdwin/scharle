"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Self-hosted Umami. Both values are set at build time by the deploy
 * script; with either missing nothing is loaded, so a local `npm run dev`
 * and a preview build send no traffic to the live dashboard. */
const SRC = process.env.NEXT_PUBLIC_UMAMI_SRC;
const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

const DEPTHS = [25, 50, 75, 100];

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

export function Analytics() {
  const pathname = usePathname();

  // Page views, referrers and visit duration come from the script itself.
  // Scroll depth does not, so send it as an event — each threshold once per
  // page, so scrolling back up does not count twice.
  useEffect(() => {
    if (!SRC || !WEBSITE_ID) return;
    const pending = new Set(DEPTHS);
    let frame = 0;

    function measure() {
      frame = 0;
      const doc = document.documentElement;
      // A page no taller than the viewport is "fully read" on arrival;
      // recording 100% for it would drown the pages people really read.
      if (doc.scrollHeight - window.innerHeight < 200) return;
      const seen =
        ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
      for (const depth of DEPTHS) {
        if (seen >= depth && pending.delete(depth)) {
          window.umami?.track("scroll-depth", { depth, path: pathname });
        }
      }
    }

    function onScroll() {
      // Scroll fires far faster than it is worth measuring.
      if (!frame) frame = requestAnimationFrame(measure);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  if (!SRC || !WEBSITE_ID) return null;

  return (
    <Script src={SRC} data-website-id={WEBSITE_ID} strategy="afterInteractive" />
  );
}
