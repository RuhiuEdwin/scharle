import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { Reveal } from "@/components/Reveal";
import { StaggerReveal, StaggerItem } from "@/components/StaggerReveal";
import { CourseCarousel } from "@/components/CourseCarousel";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { ButtonLink } from "@/components/Button";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { AccentRule, DotGrid } from "@/components/Decorative";
import { courses, testimonials, siteInfo } from "@/lib/content";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/courses/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) return {};
  return pageMetadata({
    title: course.name,
    description: `${course.overview} ${course.duration} at Scharle Beauty College, Nyeri Town.`,
    path: `/courses/${course.slug}`,
  });
}

export default async function CourseDetail(
  props: PageProps<"/courses/[slug]">,
) {
  const { slug } = await props.params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  const courseTestimonials = testimonials.filter(
    (t) => t.courseSlug === course.slug,
  );
  const otherCourses = courses.filter((c) => c.slug !== course.slug);

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.overview,
    url: `${SITE_URL}/courses/${course.slug}`,
    provider: {
      "@type": "EducationalOrganization",
      name: siteInfo.name,
      sameAs: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Onsite",
      duration: course.duration,
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <CourseCarousel courses={[course]} detailMode />

      <section className={styles.section}>
        <DotGrid style={{ width: 260, height: 260, top: 0, right: -60 }} />
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Curriculum</span>
          <h2 className="h-display" style={{ fontSize: 28 }}>
            What you&apos;ll actually learn
          </h2>
          <StaggerReveal className={styles.moduleGrid}>
            {course.whatYoullLearn.map((item, i) => (
              <StaggerItem className={styles.moduleCard} key={item}>
                <span className={styles.moduleNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p>{item}</p>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Career Outcomes</span>
          <h2 className="h-display" style={{ fontSize: 24 }}>
            Where graduates end up
          </h2>
          <AccentRule className={styles.rule} />
          <div className={styles.chips}>
            {course.careerOutcomes.map((role) => (
              <span className={styles.chip} key={role}>
                {role}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <section className={styles.section}>
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Your Instructor</span>
          <div className={styles.instructors}>
            {course.instructors.map((inst) => (
              <div className={styles.instructorCard} key={inst.name}>
                <span className={styles.avatar} aria-hidden="true">
                  {inst.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <p className={styles.instructorName}>{inst.name}</p>
                  <p className={styles.instructorRole}>{inst.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {courseTestimonials.length > 0 && (
        <section className={`${styles.section} ${styles.alt}`}>
          <Reveal className={styles.sectionInner}>
            <span className={`label ${styles.eyebrow}`}>
              From {course.name} Students
            </span>
            <h2 className="h-display" style={{ fontSize: 24, marginBottom: 28 }}>
              Hear it from them
            </h2>
            <TestimonialCarousel items={courseTestimonials} />
          </Reveal>
        </section>
      )}

      <section className={styles.section}>
        <Reveal className={`${styles.sectionInner} ${styles.enquireBlock}`}>
          <span className={`label ${styles.eyebrow}`}>Ready?</span>
          <h2 className="h-display" style={{ fontSize: 26 }}>
            Book a visit or apply for {course.name}
          </h2>
          <div className={styles.enquireCtas}>
            <ButtonLink
              href={`/admissions?course=${course.slug}`}
              variant="primary"
            >
              Enquire about this course
            </ButtonLink>
            <ButtonLink href="/courses" variant="text">
              ← All courses
            </ButtonLink>
          </div>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Other Programs</span>
          <div className={styles.otherCourses}>
            {otherCourses.map((c) => (
              <Link
                href={`/courses/${c.slug}`}
                className={styles.otherCourseLink}
                key={c.slug}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      <MobileCtaBar />
    </main>
  );
}
