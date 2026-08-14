import type { Metadata } from "next";
import styles from "./page.module.css";
import { Reveal } from "@/components/Reveal";
import { StaggerReveal, StaggerItem } from "@/components/StaggerReveal";
import { BookingForm } from "@/components/BookingForm";
import { EnrollmentForm } from "@/components/EnrollmentForm";
import { PageHero } from "@/components/PageHero";
import { PatternField, AccentRule } from "@/components/Decorative";
import { ButtonLink } from "@/components/Button";
import { getAdmissionsPage, getPaymentInfo, getCourses, getSiteInfo } from "@/lib/strapi";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Admissions",
  description:
    "How to join Scharle Beauty College: requirements, intakes, and booking a school visit in Nyeri Town.",
  path: "/admissions",
});

export default async function Admissions(
  props: PageProps<"/admissions">,
) {
  const searchParams = await props.searchParams;
  const courseParam = searchParams?.course;
  const defaultCourseSlug =
    typeof courseParam === "string" ? courseParam : undefined;

  const [admissionsPage, paymentInfo, courses, siteInfo] = await Promise.all([
    getAdmissionsPage(),
    getPaymentInfo(),
    getCourses(),
    getSiteInfo(),
  ]);
  const { steps: admissionsSteps, requirements: admissionsRequirements } = admissionsPage;

  return (
    <main>
      <PageHero
        eyebrow="How to Join"
        title="Three steps in"
        subcopy="Call, visit, or apply online — enrolling at Scharle is quick, and we walk with you the whole way."
        image={courses[0]?.image ?? ""}
        alt="Scharle Beauty College studio"
      />

      <section className={styles.section}>
        <Reveal className={styles.sectionInner}>
          <StaggerReveal className={styles.steps}>
            {admissionsSteps.map((step, i) => (
              <StaggerItem className={styles.step} key={step.title}>
                <div className={styles.stepNumber}>{i + 1}</div>
                <div>
                  <h4 className={styles.stepTitle}>{step.title}</h4>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.alt} ${styles.twoCol}`}>
        <Reveal>
          <span className={`label ${styles.eyebrow}`}>
            Requirements Checklist
          </span>
          <p className="body-text" style={{ fontSize: 13, marginBottom: 8 }}>
            Tick items off as you gather them, or attach a file straight
            away — not everything needs a file, so attach what you have.
          </p>
          <AccentRule className={styles.rule} />
          <EnrollmentForm
            requirements={admissionsRequirements}
            courses={courses}
            defaultCourseSlug={defaultCourseSlug}
            paymentInfo={paymentInfo}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <span className={`label ${styles.eyebrow}`}>Intakes</span>
          <AccentRule className={styles.rule} />
          <p className="body-text" style={{ fontSize: 14 }}>
            Monthly intakes starting September — apply any time and we&apos;ll
            place you in the next opening class.
          </p>
        </Reveal>
      </section>

      <section className={styles.section}>
        <PatternField style={{ width: 240, height: 240, bottom: -60, left: -60 }} />
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>
            Book a School Visit
          </span>
          <h2 className={`h-display ${styles.formTitle}`}>
            See the studio first
          </h2>
          <BookingForm defaultCourseSlug={defaultCourseSlug} courses={courses} />
          {siteInfo.calendlyUrl && (
            <div className={styles.calendlyRow}>
              <span className="body-text" style={{ fontSize: 13.5 }}>
                Prefer to just pick a time yourself?
              </span>
              <ButtonLink href={siteInfo.calendlyUrl} variant="text" external>
                Book a discovery call on Calendly →
              </ButtonLink>
            </div>
          )}
        </Reveal>
      </section>
    </main>
  );
}
