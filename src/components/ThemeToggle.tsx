"use client";

import { useSyncExternalStore } from "react";
import styles from "./ThemeToggle.module.css";

/** The `data-theme` attribute is the theme's single source of truth — an
 * inline script in the document sets it before paint. Reading it through
 * an observer rather than copying it into state keeps both toggles (desktop
 * header and mobile menu) showing the same thing whichever one was pressed,
 * and leaves SSR rendering the light-theme label as it always has. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const isDark = () =>
  document.documentElement.getAttribute("data-theme") === "dark";

export function ThemeToggle({ className }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  function toggle() {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage unavailable (private mode etc.) — theme just won't persist.
    }
  }

  return (
    <button
      type="button"
      className={`${styles.toggle} ${className ?? ""}`}
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className={styles.sun}>
        <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className={styles.moon}>
        <path
          d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
