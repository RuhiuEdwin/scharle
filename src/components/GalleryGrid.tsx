"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Gallery.module.css";
import { ImgPlaceholder } from "@/components/ImgPlaceholder";
import type { GalleryItem } from "@/lib/content";

const CATEGORIES = ["All", "Studio", "Students"] as const;
const EASE_SNAP = [0.16, 1.35, 0.34, 1] as const;

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered =
    filter === "All" ? items : items.filter((i) => i.category === filter);

  function close() {
    setOpenIndex(null);
  }
  function step(delta: number) {
    if (openIndex === null) return;
    setOpenIndex((openIndex + delta + filtered.length) % filtered.length);
  }

  return (
    <div>
      <div className={styles.chips}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.chip} ${filter === cat ? styles.active : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((item, i) => (
          <button
            key={item.caption}
            className={styles.tile}
            onClick={() => setOpenIndex(i)}
            aria-label={`Open ${item.caption} in lightbox`}
          >
            <ImgPlaceholder caption={item.caption} src={item.image} />
          </button>
        ))}
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {openIndex !== null && (
            <motion.div
              className={styles.lightbox}
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
            >
              <motion.div
                className={styles.lightboxInner}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.26, ease: EASE_SNAP }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.close}
                  onClick={close}
                  aria-label="Close"
                >
                  ✕
                </button>
                <button
                  className={`${styles.nav} ${styles.prev}`}
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <ImgPlaceholder
                  caption={filtered[openIndex].caption}
                  src={filtered[openIndex].image}
                  className={styles.lightboxImage}
                />
                <button
                  className={`${styles.nav} ${styles.next}`}
                  onClick={() => step(1)}
                  aria-label="Next image"
                >
                  ›
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
