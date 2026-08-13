"use client";

import { useId, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./AdmissionsChecklist.module.css";
import { StaggerItem } from "@/components/StaggerReveal";

export function AdmissionsChecklistItem({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const boxRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
    // Files already satisfy this item — clear them to un-tick instead of
    // fighting the file input's own state.
    if (files.length > 0) return;
    setChecked((v) => !v);
    pop();
  }

  // A native multi-select replaces the whole FileList each time, so a
  // second picker trip would wipe out the first — sync the input's own
  // files back from our accumulated state after every change instead.
  function syncInput(next: File[]) {
    const dt = new DataTransfer();
    next.forEach((f) => dt.items.add(f));
    if (inputRef.current) inputRef.current.files = dt.files;
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length === 0) return;
    const next = [...files, ...picked];
    setFiles(next);
    setChecked(true);
    syncInput(next);
    pop();
  }

  function removeFile(name: string) {
    const next = files.filter((f) => f.name !== name);
    setFiles(next);
    syncInput(next);
    if (next.length === 0) setChecked(false);
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

        <div className={styles.attachGroup}>
          {files.map((f) => (
            <span className={styles.fileChip} key={f.name}>
              {f.name}
              <button
                type="button"
                className={styles.remove}
                aria-label={`Remove ${f.name}`}
                onClick={() => removeFile(f.name)}
              >
                ×
              </button>
            </span>
          ))}
          <label className={styles.attach} htmlFor={inputId}>
            <span className={styles.attachText}>
              {files.length > 0 ? "+ Add" : "Attach"}
            </span>
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              name="documents"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFile}
            />
          </label>
        </div>
      </div>
    </StaggerItem>
  );
}
