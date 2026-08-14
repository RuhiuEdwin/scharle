import type { Metadata } from "next";
import styles from "./page.module.css";
import { HeroCarousel } from "@/components/HeroCarousel";
import { HorizontalReveal } from "@/components/HorizontalReveal";
import { CourseCarousel } from "@/components/CourseCarousel";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { PatternField } from "@/components/Decorative";
import {
  getCourses,
  getWhyScharleHighlights,
  getTestimonials,
  getHomePage,
  getAboutPage,
} from "@/lib/strapi";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Home",
  description:
    "Scharle Beauty College: hands-on training in hair, skin, nails, makeup, and barbering in Nyeri Town. Learn it. Live it. Glow it.",
  path: "/",
});

export default async function Home() {
  const [courses, whyScharleHighlights, testimonials, home, about] = await Promise.all([
    getCourses(),
    getWhyScharleHighlights(),
    getTestimonials(),
    getHomePage(),
    getAboutPage(),
  ]);
  const featured = courses.filter((c) => c.featuredOnHome);
  const hairdressing = courses.find((c) => c.slug === "hairdressing-styling");

  return (
    <main>
      <HeroCarousel
        eyebrow={home.heroEyebrow}
        headline={
          <>
            Learn it.
            <br />
            Live it.
            <br />
            <span className="stamp-word">Glow</span> it.
          </>
        }
        subcopy={home.heroSubcopy}
        slides={[
          { image: home.heroImages[0], alt: "Scharle students" },
          ...(hairdressing ? [{ image: hairdressing.image, alt: "Hairdressing in progress" }] : []),
          { image: about.whoWeAre.image, alt: "Scharle studio interior" },
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

      <section className={styles.section}>
        <PatternField style={{ width: 260, height: 260, top: 8, right: -60 }} />
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
        <PatternField full style={{ inset: 0 }} />
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Student Voices</span>
          <h2 className="h-display" style={{ fontSize: 28, marginBottom: 28 }}>
            Slide into student life
          </h2>
          <TestimonialCarousel items={testimonials} />
        </Reveal>
      </section>

    </main>
  );
}
