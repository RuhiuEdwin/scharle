import type { Metadata } from "next";
import styles from "./page.module.css";
import { Reveal } from "@/components/Reveal";
import { StaggerReveal, StaggerItem } from "@/components/StaggerReveal";
import { BookingForm } from "@/components/BookingForm";
import { AdmissionsChecklistItem } from "@/components/AdmissionsChecklist";
import { DecorativeCircle, PatternField, AccentRule } from "@/components/Decorative";
import { ButtonLink } from "@/components/Button";
import { getAdmissionsPage, getPaymentInfo, getCourses, getSiteInfo } from "@/lib/strapi";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Admissions",
  description:
    "How to join Scharle Beauty College: requirements, intakes, and booking a school visit in Nyeri Town.",
  path: "/admissions",
});

const intakeMonths = ["January", "May", "September"];

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
  const intakes = intakeMonths.map((month) => ({
    month,
    note: month === admissionsPage.activeIntakeMonth ? "Next intake" : "",
  }));

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
            Spots per intake are limited per course to keep chair-time real.
            Apply early for your preferred month.
          </p>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>
            {paymentInfo.sectionTitle}
          </span>
          <h2 className="h-display" style={{ fontSize: 26 }}>
            Two ways to pay
          </h2>
          <p className="body-text" style={{ fontSize: 14, marginTop: 8 }}>
            {paymentInfo.introNote}
          </p>

          <div className={styles.feeSummary}>
            <div>
              <span className={`h-display ${styles.feeAmount}`}>
                {paymentInfo.registrationFee}
              </span>
              <span className={`label ${styles.feeLabel}`}>Registration fee</span>
            </div>
            <div>
              <p className="body-text" style={{ fontSize: 13.5, maxWidth: "42ch" }}>
                {paymentInfo.tuitionNote}
              </p>
            </div>
          </div>

          <div className={styles.channels}>
            {paymentInfo.channels.map((channel) => (
              <div className={styles.channel} key={channel.label}>
                <span className={`label ${styles.channelLabel}`}>{channel.label}</span>
                {channel.lines.map((line) => (
                  <p className={styles.channelLine} key={line}>
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <p className={styles.disclaimer}>{paymentInfo.disclaimer}</p>
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
