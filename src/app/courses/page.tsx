import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { CourseCarousel } from "@/components/CourseCarousel";
import { CourseAccordion } from "@/components/CourseAccordion";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { courses } from "@/lib/content";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Six hands-on programs at Scharle Beauty College: Hairdressing & Styling, Beauty Therapy, Cosmetology, Makeup Artistry, Nail Technology, and Barbering.",
};

export default function Courses() {
  return (
    <main>
      <CourseCarousel courses={courses} />

      <section style={{ padding: "56px 16px 0", maxWidth: 1100, margin: "0 auto" }}>
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
