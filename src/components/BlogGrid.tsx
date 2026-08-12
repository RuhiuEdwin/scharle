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
  const [featured, ...rest] = filtered;

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

      {featured && (
        <StaggerReveal>
          <StaggerItem>
            <Link href={`/blog/${featured.slug}`} className={styles.feature}>
              <span className={styles.featureImage}>
                <ImgPlaceholder
                  caption={featured.title}
                  src={featured.coverImage}
                  className={styles.featureImageInner}
                  sizes="(max-width: 900px) 100vw, 55vw"
                />
              </span>
              <span className={styles.featureBody}>
                <span className={styles.featureMeta}>
                  <span className={styles.category}>{featured.category}</span>
                  <span className={styles.dot} aria-hidden="true" />
                  <span className={styles.date}>{formatDate(featured.publishedAt)}</span>
                </span>
                <span className={styles.featureTitle}>{featured.title}</span>
                <span className={styles.featureExcerpt}>{featured.excerpt}</span>
                <span className={styles.featureRead}>Read the story →</span>
              </span>
            </Link>
          </StaggerItem>
        </StaggerReveal>
      )}

      {rest.length > 0 && (
        <StaggerReveal className={styles.list}>
          {rest.map((post) => (
            <StaggerItem key={post.slug}>
              <Link href={`/blog/${post.slug}`} className={styles.row}>
                <span className={styles.rowThumb}>
                  <ImgPlaceholder
                    caption={post.title}
                    src={post.coverImage}
                    className={styles.rowThumbInner}
                    sizes="120px"
                  />
                </span>
                <span className={styles.rowBody}>
                  <span className={styles.rowMeta}>
                    <span className={styles.category}>{post.category}</span>
                    <span className={styles.dot} aria-hidden="true" />
                    <span className={styles.date}>{formatDate(post.publishedAt)}</span>
                  </span>
                  <span className={styles.rowTitle}>{post.title}</span>
                  <span className={styles.rowExcerpt}>{post.excerpt}</span>
                </span>
                <span className={styles.rowArrow} aria-hidden="true">→</span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerReveal>
      )}

      {filtered.length === 0 && (
        <p className="body-text" style={{ marginTop: 24 }}>
          No posts in this category yet — check back soon.
        </p>
      )}
    </div>
  );
}
