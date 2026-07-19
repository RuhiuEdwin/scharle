"use client";

import { useRef, useState } from "react";
import type { FocusEvent, ReactNode } from "react";
import { gsap } from "gsap";
import styles from "./Field.module.css";

export function Field({
  label,
  errorMessage,
  alwaysFloated,
  children,
}: {
  label: string;
  /** Shown when the field fails native HTML5 validation on blur. */
  errorMessage?: string;
  /** For selects/date inputs, whose "empty" state can't cleanly sit under a floating label. */
  alwaysFloated?: boolean;
  children: ReactNode;
}) {
  const [floated, setFloated] = useState(!!alwaysFloated);
  const [invalid, setInvalid] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  function handleFocus() {
    setFloated(true);
  }

  function handleBlur(e: FocusEvent<HTMLDivElement>) {
    const target = e.target as HTMLInputElement;
    if (!alwaysFloated) setFloated(!!target.value);
    const valid = target.checkValidity ? target.checkValidity() : true;
    setInvalid(!valid);
    if (!valid && wrapRef.current) {
      gsap.fromTo(
        wrapRef.current,
        { x: -6 },
        { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" },
      );
    }
  }

  return (
    <div
      ref={wrapRef}
      className={`${styles.field} ${invalid ? styles.error : ""} ${floated ? styles.floated : ""}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      <label>{label}</label>
      <div className={styles.underline} />
      {invalid && (
        <span className={styles.errorMsg}>
          {errorMessage ?? "This field needs your attention."}
        </span>
      )}
    </div>
  );
}

export { styles as fieldStyles };
