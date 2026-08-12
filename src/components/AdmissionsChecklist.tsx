"use client";

import { useId, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./AdmissionsChecklist.module.css";
import { StaggerItem } from "@/components/StaggerReveal";

export function AdmissionsChecklistItem({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const inputId = useId();

  function pop() {
    const box = boxRef.current;
    if (!box || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    gsap.fromTo(
      box,
      { scale: 0.85 },
      { scale: 1, duration: 0.35, ease: "back.out(2.4)" },
    );
  }

  function toggleManual() {
    // A file already satisfies this item — clear it to un-tick instead of
    // fighting the file input's own state.
    if (fileName) return;
    setChecked((v) => !v);
    pop();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFileName(file?.name ?? null);
    setChecked(Boolean(file));
    pop();
  }

  function clearFile() {
    setFileName(null);
    setChecked(false);
  }

  return (
    <StaggerItem>
      <div className={styles.row}>
        <button
          type="button"
          className={styles.check}
          aria-pressed={checked}
          onClick={toggleManual}
        >
          <span
            className={`${styles.box} ${checked ? styles.checked : ""}`}
            ref={boxRef}
            aria-hidden="true"
          >
            <svg viewBox="0 0 16 16" className={styles.tick}>
              <polyline points="3,8.5 6.5,12 13,4" />
            </svg>
          </span>
          <span className={styles.label}>{label}</span>
        </button>

        <label className={styles.attach} htmlFor={inputId}>
          {fileName ? (
            <span className={styles.fileChip}>
              {fileName}
              <button
                type="button"
                className={styles.remove}
                aria-label={`Remove ${fileName}`}
                onClick={(e) => {
                  e.preventDefault();
                  clearFile();
                }}
              >
                ×
              </button>
            </span>
          ) : (
            <span className={styles.attachText}>Attach</span>
          )}
          <input
            id={inputId}
            type="file"
            name="documents"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFile}
          />
        </label>
      </div>
    </StaggerItem>
  );
}
