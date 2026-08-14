"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./BlogGrid.module.css";
import { ImgPlaceholder } from "@/components/ImgPlaceholder";
import { StaggerReveal, StaggerItem } from "@/components/StaggerReveal";
import type { BlogPost } from "@/lib/strapi";

const CATEGORIES = [
  "All",
  "Industry Trends",
  "School Life",
  "Tips & Tutorials",
  "Student Stories",
] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogGrid({ items }: { items: BlogPost[] }) {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const filtered =
    filter === "All" ? items : items.filter((p) => p.category === filter);

  return (
    <div>
      <div className={styles.chips}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.chip} ${filter === cat ? styles.active : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <StaggerReveal className={styles.grid}>
        {filtered.map((post) => (
          <StaggerItem key={post.slug}>
            <Link href={`/blog/${post.slug}`} className={styles.card}>
              <span className={styles.cardImage}>
                <ImgPlaceholder
                  caption={post.title}
                  src={post.coverImage}
                  className={styles.cardImageInner}
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
              </span>
              <span className={styles.cardDetails}>
                <span className={styles.meta}>
                  <span className={styles.category}>{post.category}</span>
                  <span className={styles.dot} aria-hidden="true" />
                  <span className={styles.date}>{formatDate(post.publishedAt)}</span>
                </span>
                <span className={styles.title}>{post.title}</span>
                <span className={styles.excerpt}>{post.excerpt}</span>
              </span>
            </Link>
          </StaggerItem>
        ))}
      </StaggerReveal>

      {filtered.length === 0 && (
        <p className="body-text" style={{ marginTop: 24 }}>
          No posts in this category yet — check back soon.
        </p>
      )}
    </div>
  );
}
