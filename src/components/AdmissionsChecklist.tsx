"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./AdmissionsChecklist.module.css";
import { StaggerItem } from "@/components/StaggerReveal";

export function AdmissionsChecklistItem({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  const boxRef = useRef<HTMLSpanElement>(null);

  function toggle() {
    setChecked((v) => !v);
    const box = boxRef.current;
    if (!box || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    gsap.fromTo(
      box,
      { scale: 0.85 },
      { scale: 1, duration: 0.35, ease: "back.out(2.4)" },
    );
  }

  return (
    <StaggerItem>
      <button
        type="button"
        className={styles.row}
        aria-pressed={checked}
        onClick={toggle}
      >
        <span
          className={`${styles.box} ${checked ? styles.checked : ""}`}
          ref={boxRef}
          aria-hidden="true"
        >
          <svg viewBox="0 0 16 16" className={styles.check}>
            <polyline points="3,8.5 6.5,12 13,4" />
          </svg>
        </span>
        {label}
      </button>
    </StaggerItem>
  );
}
