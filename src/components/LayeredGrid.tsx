"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./LayeredGrid.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DEPTHS = [40, -40, 40, -40];

export function LayeredGrid({
  items,
}: {
  items: { caption: string; image: string }[];
}) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tweens = itemRefs.current.map((el, i) => {
      if (!el) return null;
      return gsap.to(el, {
        y: DEPTHS[i % DEPTHS.length],
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section") ?? el,
          scrub: true,
        },
      });
    });
    return () => {
      tweens.forEach((t) => {
        t?.scrollTrigger?.kill();
        t?.kill();
      });
    };
  }, [items.length]);

  return (
    <div className={styles.grid}>
      {items.map((item, i) => (
        <div
          className={styles.item}
          key={item.caption}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
        >
          <Image
            src={item.image}
            alt={item.caption}
            fill
            sizes="(max-width: 760px) 50vw, 25vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}
    </div>
  );
}
