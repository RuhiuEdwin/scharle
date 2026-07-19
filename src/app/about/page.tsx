import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import { Reveal } from "@/components/Reveal";
import { StaggerReveal, StaggerItem } from "@/components/StaggerReveal";
import { ImgPlaceholder } from "@/components/ImgPlaceholder";
import { LayeredGrid } from "@/components/LayeredGrid";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { DecorativeCircle, DotGrid, AccentRule } from "@/components/Decorative";
import {
  whyScharleHighlights,
  studentLifeHighlights,
  testimonials,
  courses,
  siteInfo,
} from "@/lib/content";

const facultyPicks = courses
  .filter((c) => c.instructors.length > 0)
  .slice(0, 3);

export const metadata: Metadata = {
  title: "About",
  description:
    "Who Scharle Beauty College is, our mission and vision, and what student life looks like at our Nyeri Town studio.",
};

export default function About() {
  const aboutGallery = studentLifeHighlights.filter((s) => s.showOnAbout);

  return (
    <main>
      <section className={`${styles.section} ${styles.twoCol} ${styles.split}`}>
        <Reveal>
          <ImgPlaceholder
            caption="Who we are"
            src={siteInfo.aboutImage}
            className={styles.whoImage}
            priority
          />
        </Reveal>
        <Reveal delay={0.1}>
          <span className={`label ${styles.eyebrow}`}>Who We Are</span>
          <h1 className={`h-display ${styles.headline}`}>
            Nyeri&apos;s studio for real beauty careers
          </h1>
          <p className="body-text" style={{ marginTop: 12 }}>
            Scharle trains hairdressers, therapists, makeup artists, nail
            techs, and barbers in a working studio, not a lecture hall —
            every skill is practiced on real clients before you graduate.
          </p>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.alt} ${styles.twoCol} ${styles.split}`}>
        <DotGrid style={{ width: 380, height: 380, top: -40, right: -40 }} />
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Mission</span>
          <h2 className={`h-display ${styles.subHeadline}`}>
            Train real skills, build real confidence
          </h2>
          <AccentRule className={styles.rule} />
          <p className="body-text" style={{ fontSize: 14, marginTop: 8 }}>
            Every graduate leaves with hands-on technique, a client-ready
            portfolio, and the confidence to work anywhere from day one.
          </p>
        </Reveal>
        <Reveal delay={0.1} className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Vision</span>
          <h2 className={`h-display ${styles.subHeadline}`}>
            The school the industry hires from
          </h2>
          <AccentRule className={styles.rule} />
          <p className="body-text" style={{ fontSize: 14, marginTop: 8 }}>
            To be Nyeri&apos;s — and eventually Kenya&apos;s — first call
            when a salon, spa, or studio needs someone who already knows the
            chair.
          </p>
        </Reveal>
      </section>

      <section className={styles.section}>
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>
            Why Scharle Hits Different
          </span>
          <StaggerReveal className={styles.cardGrid}>
            {whyScharleHighlights.map((item) => (
              <StaggerItem key={item.title}>
                <h3 className={`h-display ${styles.cardTitle}`}>
                  {item.title}
                </h3>
                <p className="body-text" style={{ fontSize: 13.5 }}>
                  {item.body}
                </p>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <DecorativeCircle
          style={{ width: 240, height: 240, top: -80, left: -80 }}
          drift={{ y: 60, rotate: -20 }}
        />
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>The People</span>
          <h2 className="h-display" style={{ fontSize: 26 }}>
            Working pros, not just lecturers
          </h2>
          <StaggerReveal className={styles.facultyGrid}>
            {facultyPicks.map((course) => {
              const instructor = course.instructors[0];
              return (
                <StaggerItem key={course.slug}>
                  <Link
                    href={`/courses/${course.slug}`}
                    className={styles.facultyCard}
                  >
                    <span className={styles.facultyAvatar} aria-hidden="true">
                      {instructor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <span className={styles.facultyName}>
                      {instructor.name}
                    </span>
                    <span className={styles.facultyRole}>
                      {instructor.role}
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerReveal>
        </Reveal>
      </section>

      <section className={styles.section}>
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Student Life</span>
          <h2 className="h-display" style={{ fontSize: 26 }}>
            Behind the chair, behind the camera
          </h2>
          <LayeredGrid items={aboutGallery} />
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>In Their Words</span>
          <h2 className="h-display" style={{ fontSize: 24, marginBottom: 28 }}>
            Straight from students
          </h2>
          <TestimonialCarousel items={testimonials} />
        </Reveal>
      </section>

      <MobileCtaBar />
    </main>
  );
}
