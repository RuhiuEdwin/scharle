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
import { AccentRule, PatternField } from "@/components/Decorative";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ImgPlaceholder } from "@/components/ImgPlaceholder";
import {
  getCourses,
  getCourseBySlug,
  getTestimonials,
  getSiteInfo,
  getGalleryItemsForCourse,
} from "@/lib/strapi";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/courses/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const course = await getCourseBySlug(slug);
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
  const [course, allCourses, testimonials, siteInfo, courseGallery] = await Promise.all([
    getCourseBySlug(slug),
    getCourses(),
    getTestimonials(),
    getSiteInfo(),
    getGalleryItemsForCourse(slug),
  ]);
  if (!course) notFound();

  const courseTestimonials = testimonials.filter(
    (t) => t.courseSlug === course.slug,
  );
  const otherCourses = allCourses.filter((c) => c.slug !== course.slug);

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
        <Reveal className={styles.sectionInner}>
          <div className={styles.glance}>
            <div>
              <span className="label">Duration</span>
              <p className={`h-display ${styles.glanceValue}`}>{course.duration}</p>
            </div>
            <div>
              <span className="label">Intakes</span>
              <p className={`h-display ${styles.glanceValue}`}>{course.intakeMonths.join(" / ")}</p>
            </div>
            {course.fee && (
              <div>
                <span className="label">Fee</span>
                <p className={`h-display ${styles.glanceValue}`}>{course.fee}</p>
              </div>
            )}
          </div>
        </Reveal>
      </section>

      <section className={styles.section}>
        <PatternField style={{ width: 260, height: 260, top: 0, right: -60 }} />
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

      {courseGallery.length > 0 && (
        <section className={styles.section}>
          <Reveal className={styles.sectionInner}>
            <span className={`label ${styles.eyebrow}`}>From the Studio</span>
            <h2 className="h-display" style={{ fontSize: 24 }}>
              {course.name} in practice
            </h2>
            <div className={styles.gallery}>
              {courseGallery.map((item) => (
                <ImgPlaceholder
                  key={item.caption}
                  caption={item.caption}
                  src={item.image}
                  className={styles.galleryImage}
                />
              ))}
            </div>
          </Reveal>
        </section>
      )}

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

      {course.faqs.length > 0 && (
        <section className={styles.section}>
          <PatternField style={{ width: 220, height: 220, top: -40, left: -60 }} />
          <Reveal className={styles.sectionInner}>
            <span className={`label ${styles.eyebrow}`}>FAQs</span>
            <h2 className="h-display" style={{ fontSize: 24, marginBottom: 12 }}>
              Common questions
            </h2>
            <FAQAccordion items={course.faqs} />
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
