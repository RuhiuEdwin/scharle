import type { Metadata } from "next";
import styles from "./page.module.css";
import { HeroCarousel } from "@/components/HeroCarousel";
import { HorizontalReveal } from "@/components/HorizontalReveal";
import { CourseCarousel } from "@/components/CourseCarousel";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { ButtonLink } from "@/components/Button";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { Reveal } from "@/components/Reveal";
import { DotGrid } from "@/components/Decorative";
import {
  courses,
  whyScharleHighlights,
  testimonials,
  siteInfo,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Scharle Beauty College: hands-on training in hair, skin, nails, makeup, and barbering in Nyeri Town. Learn it. Live it. Glow it.",
};

export default function Home() {
  const featured = courses.filter((c) => c.featuredOnHome);

  return (
    <main>
      <HeroCarousel
        eyebrow="Nyeri Town · Est. beauty & barbering studio"
        headline={
          <>
            Learn it. Live it. <span className="stamp-word">Glow</span> it.
          </>
        }
        subcopy="Hands-on training in hair, skin, nails, makeup, and barbering, taught by people who still do the work, in a studio built for real practice, not just theory."
        slides={[
          { image: siteInfo.heroImage, alt: "Scharle students" },
          { videoUrl: "/videos/hairdressing.mp4", alt: "Hairdressing in progress" },
          { image: siteInfo.aboutImage, alt: "Scharle studio interior" },
        ]}
      >
        <ButtonLink href="/admissions" variant="primary" magnetic>
          Apply Now
        </ButtonLink>
        <ButtonLink href="/admissions" variant="secondary">
          Book a Visit
        </ButtonLink>
      </HeroCarousel>

      <HorizontalReveal
        eyebrow="Why Scharle Hits Different"
        title="One idea per scroll-stop"
        items={whyScharleHighlights}
      />

      <section className={styles.section} style={{ paddingBottom: 0 }}>
        <DotGrid style={{ width: 260, height: 260, top: 8, right: -60 }} />
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Featured Courses</span>
          <h2 className="h-display" style={{ fontSize: 28 }}>
            Six paths. One studio.
          </h2>
        </Reveal>
      </section>
      <CourseCarousel courses={featured} />
      <div className={styles.seeAllCourses}>
        <ButtonLink href="/courses" variant="text">
          See all 6 courses →
        </ButtonLink>
      </div>

      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Student Voices</span>
          <h2 className="h-display" style={{ fontSize: 28, marginBottom: 28 }}>
            Slide into student life
          </h2>
          <TestimonialCarousel items={testimonials} />
        </div>
      </section>

      <MobileCtaBar />
    </main>
  );
}
