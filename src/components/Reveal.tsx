"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

const EASE_SNAP = [0.16, 1.35, 0.34, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotionSafe();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.42, ease: EASE_SNAP, delay }}
    >
      {children}
    </motion.div>
  );
}
