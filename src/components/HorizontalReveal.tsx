"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PatternField } from "@/components/Decorative";
import { useMediaQuery } from "@/lib/useMediaQuery";
import styles from "./HorizontalReveal.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HorizontalReveal({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: { title: string; body: string; image: string }[];
}) {
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // The pinned horizontal scroll is a desktop, motion-is-fine affordance;
  // 760px is the same breakpoint the stylesheet switches on. Everything
  // else gets the plain stacked layout, including after a resize.
  const stacked = useMediaQuery(
    "(prefers-reduced-motion: reduce), (max-width: 759.98px)",
  );

  useEffect(() => {
    if (stacked) return;

    const track = trackRef.current;
    const pinTarget = pinTargetRef.current;
    if (!track || !pinTarget) return;

    const st = ScrollTrigger.create({
      trigger: pinTarget,
      start: "top top",
      end: () => `+=${track.scrollWidth - pinTarget.offsetWidth}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      animation: gsap.to(track, {
        x: () => -(track.scrollWidth - pinTarget.offsetWidth),
        ease: "none",
      }),
    });

    return () => st.kill();
  }, [stacked]);

  return (
    <section className={`${styles.section} ${stacked ? styles.stacked : ""}`}>
      <PatternField full style={{ inset: 0 }} />
      <div className={styles.pinTarget} ref={pinTargetRef}>
        <div className={styles.head}>
          <span className="label">{eyebrow}</span>
          <h2 className="h-display">{title}</h2>
        </div>
        <div className={styles.track} ref={trackRef}>
          {items.map((item) => (
            <div className={styles.panel} key={item.title}>
              <div className={styles.panelImage}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="100vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.panelText}>
                <h3 className={styles.panelTitle}>{item.title}</h3>
                <p className={styles.panelBody}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
