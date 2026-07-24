import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { BlogGrid } from "@/components/BlogGrid";
import { PatternField } from "@/components/Decorative";
import { getBlogPosts } from "@/lib/strapi";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "The Glow Up",
  description:
    "Industry trends, school activities, and behind-the-scenes stories from Scharle Beauty College in Nyeri Town.",
  path: "/blog",
});

export default async function Blog() {
  const posts = await getBlogPosts();

  return (
    <main>
      <section style={{ padding: "48px 16px 24px", position: "relative", overflow: "hidden" }}>
        <PatternField style={{ width: 240, height: 240, top: -30, right: -40 }} />
        <Reveal>
          <span className="label" style={{ display: "block", marginBottom: 12 }}>
            The Glow Up
          </span>
          <h1 className="h-display" style={{ fontSize: 28 }}>
            Industry moves, school news, and glow-worthy tips
          </h1>
        </Reveal>
      </section>

      <section style={{ padding: "0 16px 48px" }}>
        <Reveal>
          <BlogGrid items={posts} />
        </Reveal>
      </section>
    </main>
  );
}
