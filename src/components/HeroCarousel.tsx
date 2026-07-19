"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import styles from "./HeroCarousel.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

export type HeroSlide = {
  image?: string;
  videoUrl?: string;
  alt: string;
};

const AUTOPLAY_MS = 5500;
const EASE_SNAP = "expo.out";

export function HeroCarousel({
  slides,
  eyebrow,
  headline,
  subcopy,
  children,
}: {
  slides: HeroSlide[];
  eyebrow: string;
  headline: ReactNode;
  subcopy: string;
  children: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const animating = useRef(false);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduced = useRef(false);

  function playVideo(i: number) {
    videoRefs.current[i]?.play().catch(() => {});
  }

  function goTo(rawIndex: number) {
    if (animating.current) return;
    const next = (rawIndex + slides.length) % slides.length;
    if (next === index) return;
    animating.current = true;

    const current = slideRefs.current[index];
    const nextEl = slideRefs.current[next];
    const nextMedia = mediaRefs.current[next];
    if (!current || !nextEl) {
      animating.current = false;
      return;
    }

    if (reduced.current) {
      current.classList.remove(styles.active);
      nextEl.classList.add(styles.active);
      animating.current = false;
    } else {
      gsap.set(nextEl, { opacity: 1, zIndex: 3 });
      gsap.set(current, { zIndex: 2 });
      if (nextMedia) gsap.set(nextMedia, { scale: 1.1 });
      gsap.to(current, { opacity: 0, duration: 0.6, ease: "power2.out" });
      if (nextMedia) {
        gsap.to(nextMedia, { scale: 1, duration: 1, ease: EASE_SNAP });
      }
      gsap.delayedCall(0.6, () => {
        current.classList.remove(styles.active);
        nextEl.classList.add(styles.active);
        gsap.set(current, { opacity: 0 });
        animating.current = false;
      });
    }
    setIndex(next);
    playVideo(next);
  }

  function resumeAutoplay() {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    autoplayTimer.current = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
  }

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    playVideo(0);
    resumeAutoplay();
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Headline stagger plays once on mount, independent of slide rotation.
  useEffect(() => {
    if (reduced.current || !headlineRef.current) return;
    const split = new SplitText(headlineRef.current, { type: "words" });
    gsap.set(split.words, { opacity: 0, y: 40, rotate: -4 });
    gsap.to(split.words, {
      opacity: 1,
      y: 0,
      rotate: 0,
      stagger: 0.07,
      duration: 0.7,
      ease: "back.out(1.6)",
    });
    return () => split.revert();
  }, []);

  function onArrowClick(delta: number) {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    goTo(index + delta);
    resumeAutoplay();
  }

  return (
    <div className={styles.hero}>
      {slides.map((slide, i) => (
        <div
          className={`${styles.slide} ${i === 0 ? styles.active : ""}`}
          key={slide.alt}
          ref={(el) => {
            slideRefs.current[i] = el;
          }}
        >
          <div
            className={styles.media}
            ref={(el) => {
              mediaRefs.current[i] = el;
            }}
          >
            {slide.videoUrl ? (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                muted
                loop
                playsInline
                autoPlay={i === 0}
                preload={i === 0 ? "auto" : "none"}
              >
                <source src={slide.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={slide.image!}
                alt={slide.alt}
                fill
                sizes="100vw"
                priority={i === 0}
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
          <div className={styles.scrim} />
        </div>
      ))}

      <div className={styles.content}>
        <span className={`label ${styles.eyebrow}`}>{eyebrow}</span>
        <h1 className={`h-display ${styles.headline}`} ref={headlineRef}>
          {headline}
        </h1>
        <p className={styles.sub}>{subcopy}</p>
        <div className={styles.ctas}>{children}</div>
      </div>

      <button
        className={`${styles.arrow} ${styles.prev}`}
        aria-label="Previous slide"
        onClick={() => onArrowClick(-1)}
      >
        ‹
      </button>
      <button
        className={`${styles.arrow} ${styles.next}`}
        aria-label="Next slide"
        onClick={() => onArrowClick(1)}
      >
        ›
      </button>
      <div className={styles.dots}>
        {slides.map((slide, i) => (
          <button
            key={slide.alt}
            className={i === index ? styles.active : ""}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => onArrowClick(i - index)}
          />
        ))}
      </div>
    </div>
  );
}
