"use client";

import Image from "next/image";
import styles from "./GalleryCarousel.module.css";
import { useDragCarousel } from "@/lib/useDragCarousel";
import type { GalleryItem } from "@/lib/content";

export function GalleryCarousel({ items }: { items: GalleryItem[] }) {
  const { index, goTo, carouselRef, trackRef, onMouseEnter, onMouseLeave } =
    useDragCarousel({ slideCount: items.length, autoplayMs: 4500 });

  return (
    <div
      className={styles.carousel}
      ref={carouselRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.track} ref={trackRef}>
        {items.map((item) => (
          <div className={styles.slide} key={item.caption}>
            <Image
              src={item.image}
              alt={item.caption}
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
            <div className={styles.scrim} />
            <span className={styles.cap}>{item.caption}</span>
          </div>
        ))}
      </div>
      <button
        className={`${styles.arrow} ${styles.prev}`}
        aria-label="Previous slide"
        onClick={() => goTo(index - 1)}
      >
        ‹
      </button>
      <button
        className={`${styles.arrow} ${styles.next}`}
        aria-label="Next slide"
        onClick={() => goTo(index + 1)}
      >
        ›
      </button>
      <div className={styles.dots}>
        {items.map((item, i) => (
          <button
            key={item.caption}
            className={i === index ? styles.active : ""}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
