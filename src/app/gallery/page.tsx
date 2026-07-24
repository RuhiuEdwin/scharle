import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { GalleryCarousel } from "@/components/GalleryCarousel";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PatternField } from "@/components/Decorative";
import { getGalleryItems } from "@/lib/strapi";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Gallery",
  description:
    "The Scharle Beauty College studio and student work, Nyeri Town.",
  path: "/gallery",
});

export default async function Gallery() {
  const galleryItems = await getGalleryItems();

  return (
    <main>
      <section style={{ padding: "48px 16px 24px", position: "relative", overflow: "hidden" }}>
        <PatternField style={{ width: 240, height: 240, top: -30, right: -40 }} />
        <Reveal>
          <span className="label" style={{ display: "block", marginBottom: 12 }}>
            Gallery
          </span>
          <h1 className="h-display" style={{ fontSize: 28 }}>
            The studio, in motion
          </h1>
        </Reveal>
      </section>

      <Reveal>
        <GalleryCarousel items={galleryItems.slice(0, 5)} />
      </Reveal>

      <section style={{ padding: "40px 16px 48px" }}>
        <Reveal>
          <GalleryGrid items={galleryItems} />
        </Reveal>
      </section>

    </main>
  );
}
