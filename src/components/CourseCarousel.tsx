"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import styles from "./CourseCarousel.module.css";
import { ButtonLink } from "@/components/Button";
import type { Course } from "@/lib/strapi";

const EASE_SNAP = "expo.out";
const AUTOPLAY_MS = 6000;

export function CourseCarousel({
  courses,
  detailMode,
}: {
  courses: Course[];
  /** Used on a single course's detail page: swaps the default dual CTA
   * for one enquiry CTA pre-linked to that course (the "what you'll
   * learn" CTA doesn't make sense when you're already on that page). */
  detailMode?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animating = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const reduced = useRef(false);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  function kenBurns(i: number) {
    const media = mediaRefs.current[i];
    const img = media?.querySelector("img");
    if (!img || reduced.current) return;
    gsap.fromTo(
      img,
      { scale: 1.12, xPercent: -2 },
      { scale: 1, xPercent: 0, duration: 7, ease: "none" },
    );
  }

  function goTo(nextIndexRaw: number) {
    const nextIndex = (nextIndexRaw + courses.length) % courses.length;
    if (animating.current || nextIndex === indexRef.current) return;
    animating.current = true;

    const current = slideRefs.current[indexRef.current];
    const next = slideRefs.current[nextIndex];
    const nextMedia = mediaRefs.current[nextIndex];
    if (!current || !next) {
      animating.current = false;
      return;
    }
    const content = next.querySelector(`.${styles.content}`);
    const children = content ? Array.from(content.children) : [];

    if (reduced.current) {
      current.classList.remove(styles.active);
      next.classList.add(styles.active);
      animating.current = false;
    } else {
      gsap.set(next, { opacity: 0, zIndex: 3 });
      gsap.set(current, { zIndex: 2 });
      if (nextMedia) gsap.set(nextMedia, { scale: 1.08 });
      gsap.set(children, { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        onComplete: () => {
          current.classList.remove(styles.active);
          next.classList.add(styles.active);
          gsap.set(current, { opacity: 0 });
          animating.current = false;
        },
      });
      tl.to(current, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, 0);
      tl.to(next, { opacity: 1, duration: 0.6, ease: "power2.inOut" }, 0);
      if (nextMedia) {
        tl.to(nextMedia, { scale: 1, duration: 1.1, ease: EASE_SNAP }, 0);
      }
      tl.to(
        children,
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: "power3.out" },
        0.2,
      );
    }

    indexRef.current = nextIndex;
    setIndex(nextIndex);
    kenBurns(nextIndex);
  }

  function resumeAutoplay() {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    if (courses.length < 2) return;
    autoplayTimer.current = setInterval(
      () => goTo(indexRef.current + 1),
      AUTOPLAY_MS,
    );
  }

  useEffect(() => {
    kenBurns(0);
    resumeAutoplay();
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onManualGoTo(next: number) {
    goTo(next);
    resumeAutoplay();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") onManualGoTo(index + 1);
      if (e.key === "ArrowLeft") onManualGoTo(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) onManualGoTo(index + (dx < 0 ? 1 : -1));
    touchStartX.current = null;
  }

  return (
    <div
      className={styles.stage}
      ref={stageRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {courses.map((course, i) => (
        <div
          className={`${styles.slide} ${i === 0 ? styles.active : ""}`}
          key={course.slug}
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
            <Image
              src={course.image}
              alt={course.name}
              fill
              sizes="100vw"
              priority={i === 0}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.scrim} />
          <div className={styles.content}>
            <span className={styles.index}>
              {String(i + 1).padStart(2, "0")} / {String(courses.length).padStart(2, "0")}
            </span>
            <h2 className={`h-display ${styles.title}`}>{course.name}</h2>
            <p className={styles.meta}>
              {course.duration} · {course.intakeMonths.join(" / ")} intake
            </p>
            <p className={styles.overview}>{course.overview}</p>
            <div className={styles.ctas}>
              {detailMode ? (
                <ButtonLink
                  href={`/admissions?course=${course.slug}`}
                  variant="primary"
                  magnetic
                >
                  Enquire about this course
                </ButtonLink>
              ) : (
                <>
                  <ButtonLink href="/admissions" variant="primary">
                    Apply for this course
                  </ButtonLink>
                  <ButtonLink href={`/courses/${course.slug}`} variant="secondary">
                    What you&apos;ll learn
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {courses.length > 1 && (
        <>
          <button
            className={`${styles.arrow} ${styles.prev}`}
            aria-label="Previous course"
            onClick={() => onManualGoTo(index - 1)}
          >
            ‹
          </button>
          <button
            className={`${styles.arrow} ${styles.next}`}
            aria-label="Next course"
            onClick={() => onManualGoTo(index + 1)}
          >
            ›
          </button>

          <div className={styles.rail}>
            {courses.map((course, i) => (
              <button
                key={course.slug}
                className={`${styles.railItem} ${i === index ? styles.current : ""}`}
                onClick={() => onManualGoTo(i)}
              >
                <span className={styles.railLabel}>{course.name}</span>
                <span className={styles.railDash} />
              </button>
            ))}
          </div>

          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${((index + 1) / courses.length) * 100}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
