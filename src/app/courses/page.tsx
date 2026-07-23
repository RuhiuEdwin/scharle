import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { CourseCarousel } from "@/components/CourseCarousel";
import { CourseAccordion } from "@/components/CourseAccordion";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { PatternField } from "@/components/Decorative";
import { getCourses } from "@/lib/strapi";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Courses",
  description:
    "Six hands-on programs at Scharle Beauty College: Hairdressing & Styling, Beauty Therapy, Cosmetology, Makeup Artistry, Nail Technology, and Barbering.",
  path: "/courses",
});

export default async function Courses() {
  const courses = await getCourses();

  return (
    <main>
      <CourseCarousel courses={courses} />

      <section style={{ padding: "56px 16px 0", maxWidth: 1100, margin: "0 auto", position: "relative", overflow: "hidden" }}>
        <PatternField style={{ width: 260, height: 260, top: -20, right: -60 }} />
        <Reveal>
          <span className="label" style={{ display: "block", marginBottom: 12 }}>
            Full Curriculum
          </span>
          <h2 className="h-display" style={{ fontSize: 28 }}>
            What you&apos;ll actually learn
          </h2>
          <p className="body-text" style={{ marginTop: 10 }}>
            Every program runs on the same principle: real technique, real
            clients, real portfolio. Tap a program below for the full
            breakdown.
          </p>
        </Reveal>
      </section>

      <section style={{ padding: "32px 16px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <CourseAccordion courses={courses} />
        </Reveal>
      </section>

      <MobileCtaBar />
    </main>
  );
}
