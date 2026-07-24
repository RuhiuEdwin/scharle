"use client";

import Image from "next/image";
import styles from "./TestimonialCarousel.module.css";
import { useDragCarousel } from "@/lib/useDragCarousel";

export type Testimonial = {
  quote: string;
  who: string;
  image?: string;
};

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const { index, goTo, carouselRef, trackRef, onMouseEnter, onMouseLeave } =
    useDragCarousel({ slideCount: items.length });

  return (
    <div
      className={styles.carousel}
      ref={carouselRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.viewport}>
        <div className={styles.track} ref={trackRef}>
          {items.map((item) => (
            <div className={styles.slide} key={item.who}>
              <div className={styles.card}>
                <span className={styles.mark} aria-hidden="true">
                  &ldquo;
                </span>
                <p className={styles.quote}>{item.quote}</p>
                <div className={styles.attribution}>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      width={36}
                      height={36}
                      className={styles.avatar}
                    />
                  )}
                  <span className={styles.who}>{item.who}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Controls sit below the card in their own row, never overlapping the
          text — arrows positioned over the card used to clip/obscure the
          quote on narrower viewports. */}
      <div className={styles.controls}>
        <button
          className={`${styles.arrow} ${styles.prev}`}
          aria-label="Previous testimonial"
          onClick={() => goTo(index - 1)}
        >
          ‹
        </button>
        <div className={styles.dots}>
          {items.map((item, i) => (
            <button
              key={item.who}
              className={i === index ? styles.active : ""}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button
          className={`${styles.arrow} ${styles.next}`}
          aria-label="Next testimonial"
          onClick={() => goTo(index + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}
