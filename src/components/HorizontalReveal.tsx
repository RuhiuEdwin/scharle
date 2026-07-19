"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  const [stacked, setStacked] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isDesktop = window.innerWidth >= 760;

    if (reduced || !isDesktop) {
      setStacked(true);
      return;
    }

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
  }, []);

  return (
    <section className={`${styles.section} ${stacked ? styles.stacked : ""}`}>
      <div className={styles.pinTarget} ref={pinTargetRef}>
        <div className={styles.head}>
          <span className="label">{eyebrow}</span>
          <h2 className="h-display">{title}</h2>
        </div>
        <div className={styles.track} ref={trackRef}>
          {items.map((item, i) => (
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
                <span className={styles.panelNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
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
