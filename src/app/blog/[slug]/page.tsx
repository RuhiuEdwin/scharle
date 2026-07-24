import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";
import { Reveal } from "@/components/Reveal";
import { ImgPlaceholder } from "@/components/ImgPlaceholder";
import { ButtonLink } from "@/components/Button";
import { getBlogPosts, getBlogPostBySlug, getSiteInfo } from "@/lib/strapi";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.seoDescription,
    path: `/blog/${post.slug}`,
    type: "article",
    image: post.coverImage || undefined,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostDetail(
  props: PageProps<"/blog/[slug]">,
) {
  const { slug } = await props.params;
  const [post, allPosts, siteInfo] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPosts(),
    getSiteInfo(),
  ]);
  if (!post) notFound();

  const morePosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const postJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription,
    image: post.coverImage || undefined,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: siteInfo.name, sameAs: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />

      <section className={styles.section}>
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>{post.category}</span>
          <h1 className={`h-display ${styles.headline}`}>{post.title}</h1>
          <p className={styles.meta}>
            By {post.author} · {formatDate(post.publishedAt)}
          </p>
        </Reveal>
      </section>

      {post.coverImage && (
        <Reveal className={styles.coverWrap}>
          <ImgPlaceholder
            caption={post.title}
            src={post.coverImage}
            className={styles.cover}
            priority
            sizes="100vw"
          />
        </Reveal>
      )}

      <section className={styles.section}>
        <Reveal className={styles.sectionInner}>
          <div className={styles.prose}>
            <ReactMarkdown>{post.body}</ReactMarkdown>
          </div>
        </Reveal>
      </section>

      <section className={styles.section}>
        <Reveal className={styles.sectionInner}>
          <ButtonLink href="/blog" variant="text">
            ← Back to The Glow Up
          </ButtonLink>
        </Reveal>
      </section>

      {morePosts.length > 0 && (
        <section className={`${styles.section} ${styles.alt}`}>
          <Reveal className={styles.sectionInner}>
            <span className={`label ${styles.eyebrow}`}>Keep Reading</span>
            <div className={styles.moreGrid}>
              {morePosts.map((p) => (
                <Link href={`/blog/${p.slug}`} className={styles.moreCard} key={p.slug}>
                  <span className={styles.moreCategory}>{p.category}</span>
                  <span className={styles.moreTitle}>{p.title}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>
      )}
    </main>
  );
}
