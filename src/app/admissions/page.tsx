import type { Metadata } from "next";
import styles from "./page.module.css";
import { Reveal } from "@/components/Reveal";
import { StaggerReveal, StaggerItem } from "@/components/StaggerReveal";
import { BookingForm } from "@/components/BookingForm";
import { AdmissionsChecklistItem } from "@/components/AdmissionsChecklist";
import { DecorativeCircle, DotGrid, AccentRule } from "@/components/Decorative";
import { admissionsSteps, admissionsRequirements } from "@/lib/content";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "How to join Scharle Beauty College: requirements, intakes, and booking a school visit in Nyeri Town.",
};

const intakes = [
  { month: "January", note: "Next intake" },
  { month: "May", note: "" },
  { month: "September", note: "" },
];

export default async function Admissions(
  props: PageProps<"/admissions">,
) {
  const searchParams = await props.searchParams;
  const courseParam = searchParams?.course;
  const defaultCourseSlug =
    typeof courseParam === "string" ? courseParam : undefined;

  return (
    <main>
      <section className={styles.section}>
        <DecorativeCircle
          style={{ width: 180, height: 180, top: -60, right: -60 }}
          drift={{ y: 40, rotate: -15 }}
        />
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>How to Join</span>
          <h1 className="h-display" style={{ fontSize: 30 }}>
            Three steps in
          </h1>
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
            Tap each item as you gather it.
          </p>
          <AccentRule className={styles.rule} />
          <StaggerReveal className={styles.checklist}>
            {admissionsRequirements.map((req) => (
              <AdmissionsChecklistItem label={req} key={req} />
            ))}
          </StaggerReveal>
        </Reveal>
        <Reveal delay={0.1}>
          <span className={`label ${styles.eyebrow}`}>Intakes</span>
          <AccentRule className={styles.rule} />
          <StaggerReveal className={styles.timeline}>
            {intakes.map((intake) => (
              <StaggerItem className={styles.intakeItem} key={intake.month}>
                <span
                  className={`${styles.intakeDot} ${
                    intake.note ? styles.intakeDotActive : ""
                  }`}
                  aria-hidden="true"
                />
                <span className={styles.intakeMonth}>{intake.month}</span>
                {intake.note && (
                  <span className={styles.intakeNote}>{intake.note}</span>
                )}
              </StaggerItem>
            ))}
          </StaggerReveal>
          <p className="body-text" style={{ fontSize: 13.5, marginTop: 16 }}>
            Spots per intake are limited per course to keep chair-time real —
            apply early for your preferred month.
          </p>
        </Reveal>
      </section>

      <section className={styles.section}>
        <DotGrid style={{ width: 240, height: 240, bottom: -60, left: -60 }} />
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>
            Book a School Visit
          </span>
          <h2 className={`h-display ${styles.formTitle}`}>
            See the studio first
          </h2>
          <BookingForm defaultCourseSlug={defaultCourseSlug} />
        </Reveal>
      </section>
    </main>
  );
}
