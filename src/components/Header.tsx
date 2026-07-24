"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./Header.module.css";
import { navLinks } from "@/lib/content";
import { ButtonLink } from "@/components/Button";
import { ThemeToggle } from "@/components/ThemeToggle";

const EASE_SNAP = "cubic-bezier(0.16, 1.35, 0.34, 1)";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shrunk, setShrunk] = useState(false);
  const navListRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(false);

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

  // Body scroll lock while the full-page menu is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // GSAP-driven open/close: the overlay reveals from the burger button's
  // own screen position (a clip-path circle expand) rather than a generic
  // fade, then links stamp in with a staggered scale/rotate settle —
  // matching the site's existing "Stamp" motion signature elsewhere
  // (headline words, the header mark's spin-in) instead of a plain slide.
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    if (!mounted) return;
    const overlay = overlayRef.current;
    if (!overlay || reducedRef.current) {
      setMounted(false);
      return;
    }
    const burgerRect = burgerRef.current?.getBoundingClientRect();
    const originX = burgerRect ? burgerRect.left + burgerRect.width / 2 : window.innerWidth - 32;
    const originY = burgerRect ? burgerRect.top + burgerRect.height / 2 : 32;
    gsap.to(overlay, {
      clipPath: `circle(0% at ${originX}px ${originY}px)`,
      duration: 0.45,
      ease: "power2.in",
      onComplete: () => setMounted(false),
    });
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const burgerRect = burgerRef.current?.getBoundingClientRect();
    const originX = burgerRect ? burgerRect.left + burgerRect.width / 2 : window.innerWidth - 32;
    const originY = burgerRect ? burgerRect.top + burgerRect.height / 2 : 32;

    if (reducedRef.current) {
      gsap.set(overlay, { clipPath: "circle(150% at 50% 0%)" });
      gsap.set(linkRefs.current.filter(Boolean), { opacity: 1, y: 0, rotate: 0, scale: 1 });
      gsap.set(ctaRef.current, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(overlay, { clipPath: `circle(0% at ${originX}px ${originY}px)` });
    const links = linkRefs.current.filter((el): el is HTMLAnchorElement => Boolean(el));
    gsap.set(links, { opacity: 0, y: 26, rotate: -3, scale: 1.08 });
    gsap.set(ctaRef.current, { opacity: 0, y: 18 });

    const tl = gsap.timeline();
    tl.to(overlay, {
      clipPath: `circle(150% at ${originX}px ${originY}px)`,
      duration: 0.6,
      ease: "power3.out",
    }).to(
      links,
      {
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        stagger: 0.06,
        duration: 0.45,
        ease: "back.out(1.6)",
      },
      "-=0.25",
    ).to(
      ctaRef.current,
      { opacity: 1, y: 0, duration: 0.4, ease: EASE_SNAP },
      "-=0.2",
    );

    return () => {
      tl.kill();
    };
  }, [mounted]);

  // Per-link magnetic hover — same GSAP quickTo technique as the primary
  // CTA button's magnetic pull, scaled down for a nav-link-sized target.
  function attachMagnetic(el: HTMLAnchorElement | null) {
    if (!el || reducedRef.current) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.2);
      yTo((e.clientY - r.top - r.height / 2) * 0.3);
    });
    el.addEventListener("mouseleave", () => {
      xTo(0);
      yTo(0);
    });
  }

  return (
    <header className={`${styles.header} ${shrunk ? styles.shrunk : ""}`}>
      <Link href="/" className={styles.mark}>
        <span className={styles.circle} aria-hidden="true">
          <Image src="/logo-mark.png" alt="" width={28} height={28} priority />
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
        <ThemeToggle />
        <ButtonLink href="/admissions" variant="primary" magnetic>
          Apply Now
        </ButtonLink>
      </div>

      <button
        ref={burgerRef}
        className={styles.burger}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {mounted && (
        <div className={styles.mobileMenu} ref={overlayRef}>
          <ul>
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  ref={(el) => {
                    linkRefs.current[i] = el;
                    attachMagnetic(el);
                  }}
                >
                  <span className={styles.mobileLinkIndex}>{String(i + 1).padStart(2, "0")}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.mobileCtas} ref={ctaRef}>
            <ButtonLink href="/admissions" variant="primary" full>
              Apply Now
            </ButtonLink>
            <ButtonLink href="/admissions" variant="secondary" full>
              Book a Visit
            </ButtonLink>
          </div>
          <ThemeToggle className={styles.mobileThemeToggle} />
        </div>
      )}
    </header>
  );
}
