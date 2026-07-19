"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

/**
 * Shared carousel mechanics used by every carousel on the site (Gallery,
 * Testimonials, and — via the same easing/snap language — the full-page
 * Courses carousel): GSAP Draggable drag-to-snap (deterministic snap on
 * release, not a physics throw — see design/VISUAL-MOTION-SYSTEM.md §3 for
 * why InertiaPlugin was dropped), optional autoplay that pauses on
 * interaction and resumes after 5s, `expo.out` slide easing throughout.
 */
export function useDragCarousel({
  slideCount,
  autoplayMs,
}: {
  slideCount: number;
  autoplayMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  function stepWidth() {
    return carouselRef.current?.getBoundingClientRect().width ?? 0;
  }

  function goTo(rawIndex: number) {
    const next = (rawIndex + slideCount) % slideCount;
    indexRef.current = next;
    setIndex(next);
    if (trackRef.current) {
      gsap.to(trackRef.current, {
        x: -next * stepWidth(),
        duration: 0.6,
        ease: "expo.out",
      });
    }
  }

  function pauseAutoplay(temporary: boolean) {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    if (temporary && autoplayMs) {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(resumeAutoplay, 5000);
    }
  }

  function resumeAutoplay() {
    if (!autoplayMs) return;
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    autoplayTimer.current = setInterval(
      () => goTo(indexRef.current + 1),
      autoplayMs,
    );
  }

  useEffect(() => {
    resumeAutoplay();
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let draggable: Draggable[] | undefined;
    if (!reduced && trackRef.current) {
      draggable = Draggable.create(trackRef.current, {
        type: "x",
        edgeResistance: 0.75,
        bounds: { minX: -stepWidth() * (slideCount - 1), maxX: 0 },
        onDragStart: () => pauseAutoplay(false),
        onDragEnd: function (this: Draggable) {
          const width = stepWidth();
          const nearest = Math.round(-this.x / width);
          goTo(Math.max(0, Math.min(slideCount - 1, nearest)));
        },
      });
    } else if (trackRef.current) {
      trackRef.current.style.overflowX = "auto";
    }

    function onResize() {
      goTo(indexRef.current);
    }
    window.addEventListener("resize", onResize);

    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      draggable?.forEach((d) => d.kill());
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideCount]);

  return {
    index,
    goTo,
    carouselRef,
    trackRef,
    onMouseEnter: () => pauseAutoplay(false),
    onMouseLeave: () => resumeAutoplay(),
  };
}
