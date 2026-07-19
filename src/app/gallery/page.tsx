import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { GalleryCarousel } from "@/components/GalleryCarousel";
import { GalleryGrid } from "@/components/GalleryGrid";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { galleryItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "The Scharle Beauty College studio and student work, Nyeri Town.",
};

export default function Gallery() {
  return (
    <main>
      <section style={{ padding: "48px 16px 24px" }}>
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

      <MobileCtaBar />
    </main>
  );
}
