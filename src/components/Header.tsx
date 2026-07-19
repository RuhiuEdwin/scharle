"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { gsap } from "gsap";
import styles from "./Header.module.css";
import { navLinks } from "@/lib/content";
import { ButtonLink } from "@/components/Button";

const menuVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1.35, 0.34, 1] },
  },
};

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [shrunk, setShrunk] = useState(false);
  const navListRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      setShrunk(window.scrollY > 30);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const list = navListRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    const current = list.querySelector('a[aria-current="page"]');
    if (!current) {
      gsap.to(indicator, { opacity: 0, duration: 0.2 });
      return;
    }
    const listRect = list.getBoundingClientRect();
    const linkRect = current.getBoundingClientRect();
    gsap.to(indicator, {
      opacity: 1,
      left: linkRect.left - listRect.left,
      width: linkRect.width,
      duration: 0.35,
      ease: "expo.out",
    });
  }, [pathname]);

  return (
    <header className={`${styles.header} ${shrunk ? styles.shrunk : ""}`}>
      <Link href="/" className={styles.mark}>
        <span className={styles.circle} aria-hidden="true">
          S
        </span>
        <span className={styles.wordLockup}>
          <span className={styles.primary}>SCHARLE</span>
          <span className={styles.secondary}>BEAUTY COLLEGE</span>
        </span>
      </Link>

      <ul className={styles.navLinks} ref={navListRef}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          </li>
        ))}
        <div className={styles.navIndicator} ref={indicatorRef} aria-hidden="true" />
      </ul>

      <div className={styles.ctaSlot}>
        <ButtonLink href="/admissions" variant="primary" magnetic>
          Apply Now
        </ButtonLink>
      </div>

      <button
        className={styles.burger}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1.35, 0.34, 1] }}
          >
            <motion.ul
              variants={menuVariants}
              initial="hidden"
              animate="visible"
            >
              {navLinks.map((link) => (
                <motion.li key={link.href} variants={linkVariants}>
                  <Link
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <div className={styles.mobileCtas}>
              <ButtonLink href="/admissions" variant="primary" full>
                Apply Now
              </ButtonLink>
              <ButtonLink href="/admissions" variant="secondary" full>
                Book a Visit
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
