"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Decorative.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function useScrollDrift<T extends HTMLElement>(vars: gsap.TweenVars) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.to(el, {
      ...vars,
      ease: "none",
      scrollTrigger: {
        trigger: el.closest("section") ?? el,
        scrub: true,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [vars]);

  return ref;
}

export function DecorativeCircle({
  style,
  className,
  drift = { y: 100, rotate: 20 },
  dark,
}: {
  style: CSSProperties;
  className?: string;
  drift?: { y?: number; x?: number; rotate?: number };
  dark?: boolean;
}) {
  const ref = useScrollDrift<HTMLDivElement>(drift);
  return (
    <div
      ref={ref}
      className={`${styles.circle} ${className ?? ""}`}
      style={{ ...style, background: dark ? "var(--text)" : undefined }}
      aria-hidden="true"
    />
  );
}

export function PatternField({
  style,
  className,
  full,
}: {
  style: CSSProperties;
  className?: string;
  /** Full-bleed hero/divider treatment (lower opacity, larger tile) instead of a small corner accent. */
  full?: boolean;
}) {
  // Parallax drift only — no opacity target here. This used to inherit the
  // old dot-grid's `opacity: 0.2` scrub target, which is 2-4x the pattern's
  // actual CSS opacity (0.09 / 0.045) and made it scrub steadily *more*
  // visible while scrolling through a section, overriding the deliberately
  // subtle static value.
  const ref = useScrollDrift<HTMLDivElement>({ y: 50 });
  return (
    <div
      ref={ref}
      className={`${full ? styles.patternFull : styles.pattern} ${className ?? ""}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function AccentRule({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { scaleX: 1 });
      return;
    }

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => gsap.to(el, { scaleX: 1, duration: 0.9, ease: "expo.out" }),
    });
    return () => st.kill();
  }, []);

  return <div ref={ref} className={`${styles.rule} ${className ?? ""}`} aria-hidden="true" />;
}

export function GradientGlow({
  style,
  className,
}: {
  style: CSSProperties;
  className?: string;
}) {
  const ref = useScrollDrift<HTMLDivElement>({ scale: 1.15, opacity: 0.7 });
  return (
    <div
      ref={ref}
      className={`${styles.glow} ${className ?? ""}`}
      style={style}
      aria-hidden="true"
    />
  );
}
