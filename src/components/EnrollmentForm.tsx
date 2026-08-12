"use client";

import { useActionState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import styles from "./EnrollmentForm.module.css";
import { Field, fieldStyles } from "@/components/Field";
import { Button } from "@/components/Button";
import { AdmissionsChecklistItem } from "@/components/AdmissionsChecklist";
import { StaggerReveal } from "@/components/StaggerReveal";
import { submitEnrollment, type EnrollmentState } from "@/app/admissions/actions";
import type { Course } from "@/lib/strapi";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

const initialEnrollmentState: EnrollmentState = { status: "idle" };

export function EnrollmentForm({
  requirements,
  courses,
  defaultCourseSlug,
}: {
  requirements: string[];
  courses: Course[];
  defaultCourseSlug?: string;
}) {
  const [state, formAction, pending] = useActionState(
    submitEnrollment,
    initialEnrollmentState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const emailedForRef = useRef<string | null>(null);

  // Notify the admissions team by email once Strapi confirms the
  // application (and any attached documents) actually saved — never
  // fires on a failed submission. Skips quietly if EmailJS hasn't been
  // configured yet, since the application itself is already safely
  // stored in Strapi either way.
  useEffect(() => {
    if (state.status !== "success" || !state.submitted) return;
    const key = `${state.submitted.email}-${state.submitted.fullName}`;
    if (emailedForRef.current === key) return;
    emailedForRef.current = key;

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.warn(
        "EmailJS isn't configured (NEXT_PUBLIC_EMAILJS_* env vars missing) — application was saved, but no follow-up email was sent.",
      );
      return;
    }

    const course = courses.find((c) => c.slug === state.submitted?.course);
    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          applicant_name: state.submitted.fullName,
          applicant_email: state.submitted.email,
          applicant_phone: state.submitted.phone,
          course_of_interest: course?.name ?? "Not specified",
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      )
      .catch((err) => console.error("EmailJS notification failed:", err));

    formRef.current?.reset();
  }, [state, courses]);

  return (
    <form ref={formRef} action={formAction} className={styles.form} noValidate>
      <StaggerReveal className={styles.checklist}>
        {requirements.map((req) => (
          <AdmissionsChecklistItem label={req} key={req} />
        ))}
      </StaggerReveal>

      <div className={styles.divider} />

      <div className={`${fieldStyles.formGrid} ${fieldStyles.pair}`}>
        <Field label="Full name" errorMessage="Tell us your name.">
          <input type="text" name="fullName" required />
        </Field>
        <Field label="Email" errorMessage="Enter a valid email address.">
          <input type="email" name="email" required />
        </Field>
      </div>
      <div className={`${fieldStyles.formGrid} ${fieldStyles.pair}`}>
        <Field
          label="Phone number"
          errorMessage="Enter a phone number so we can reach you."
        >
          <input type="tel" name="phone" required />
        </Field>
        <Field label="Course of interest" alwaysFloated>
          <select name="course" defaultValue={defaultCourseSlug ?? ""}>
            <option value="">Not sure yet</option>
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <input
        type="text"
        name="company"
        className={fieldStyles.honeypot}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {state.status === "error" && (
        <p className={styles.formError} role="alert">
          {state.message}
        </p>
      )}
      {state.status === "success" && (
        <p className={styles.formSuccess} role="status">
          Application received — we'll follow up soon.
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        status={pending ? "loading" : "idle"}
      >
        Submit application
      </Button>
    </form>
  );
}
