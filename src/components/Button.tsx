"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import styles from "./Button.module.css";

const MotionLink = motion.create(Link);

type Variant = "primary" | "secondary" | "text";

const variantClass: Record<Variant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  text: styles.text,
};

// Magnetic pull is reserved for the single highest-energy CTA on a given
// screen (usually "Apply Now") — not applied to every button, per the
// Visual & Motion System spec (design/VISUAL-MOTION-SYSTEM.md, §4).
function useMagnetic(enabled: boolean | undefined) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wrap = wrapRef.current;
    const target = wrap?.firstElementChild as HTMLElement | null;
    if (!wrap || !target) return;

    const xTo = gsap.quickTo(target, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(target, "y", { duration: 0.4, ease: "power3.out" });

    function onMove(e: MouseEvent) {
      const r = wrap!.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.35);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    }
    function onLeave() {
      xTo(0);
      yTo(0);
    }
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  return wrapRef;
}

export function ButtonLink({
  href,
  variant = "primary",
  children,
  full,
  magnetic,
}: {
  href: string;
  variant?: Variant;
  children: ReactNode;
  full?: boolean;
  magnetic?: boolean;
}) {
  const wrapRef = useMagnetic(magnetic);
  const btn = (
    <MotionLink
      href={href}
      className={`${styles.btn} ${variantClass[variant]} ${full ? styles.full : ""}`}
      whileTap={{ scale: 0.97 }}
    >
      <span>{children}</span>
    </MotionLink>
  );
  if (!magnetic) return btn;
  return (
    <span ref={wrapRef} className={styles.magneticWrap}>
      {btn}
    </span>
  );
}

export type ButtonStatus = "idle" | "loading" | "success";

export function Button({
  variant = "primary",
  children,
  type = "button",
  full,
  status = "idle",
  successLabel = "Sent",
  onClick,
}: {
  variant?: Variant;
  children: ReactNode;
  type?: "button" | "submit";
  full?: boolean;
  status?: ButtonStatus;
  successLabel?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={status !== "idle"}
      className={`${styles.btn} ${variantClass[variant]} ${full ? styles.full : ""} ${status === "success" ? styles.success : ""}`}
      whileTap={status === "idle" ? { scale: 0.97 } : undefined}
    >
      {status === "loading" && <span className={styles.spinner} aria-hidden="true" />}
      {status === "success" && <span aria-hidden="true">✓</span>}
      <span>{status === "success" ? successLabel : children}</span>
    </motion.button>
  );
}
