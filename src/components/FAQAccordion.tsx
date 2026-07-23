"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./FAQAccordion.module.css";

const EASE_SNAP = [0.16, 1.35, 0.34, 1] as const;

export function FAQAccordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div className={styles.item} key={item.question}>
            <button
              className={styles.head}
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              <span className={styles.question}>{item.question}</span>
              <motion.span
                className={styles.plus}
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ duration: 0.22, ease: EASE_SNAP }}
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: EASE_SNAP }}
                  style={{ overflow: "hidden" }}
                >
                  <p className={styles.answer}>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
