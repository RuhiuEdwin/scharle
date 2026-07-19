"use client";

import { useState } from "react";
import { Field, fieldStyles } from "@/components/Field";
import { Button, type ButtonStatus } from "@/components/Button";
import { courses } from "@/lib/content";

// Submission (storage + admin email + honeypot/rate-limit enforcement) is
// wired up in Sprint 4 against real BookingRequest endpoints. The
// loading/success button lifecycle below is real UI, driven by a
// placeholder timeout until that fetch call exists.
export function BookingForm({
  defaultCourseSlug,
}: {
  /** Pre-selects "Course of interest" — set when arriving via a course
   * detail page's enquiry CTA (`/admissions?course=<slug>`). */
  defaultCourseSlug?: string;
}) {
  const [status, setStatus] = useState<ButtonStatus>("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2200);
    }, 1200);
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 520 }} noValidate>
      <div className={`${fieldStyles.formGrid} ${fieldStyles.pair}`}>
        <Field label="Full name" errorMessage="Tell us your name.">
          <input type="text" name="name" required />
        </Field>
        <Field
          label="Phone number"
          errorMessage="Enter a phone number so we can reach you."
        >
          <input type="tel" name="phone" required />
        </Field>
      </div>
      <div className={`${fieldStyles.formGrid} ${fieldStyles.pair}`}>
        <Field
          label="Course of interest"
          alwaysFloated
          errorMessage="Choose a course."
        >
          <select name="course" required defaultValue={defaultCourseSlug ?? ""}>
            <option value="" disabled>
              Choose a course
            </option>
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Preferred date"
          alwaysFloated
          errorMessage="Pick a date that works for you."
        >
          <input type="date" name="preferredDate" required />
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
      <Button type="submit" variant="primary" status={status} successLabel="Sent">
        Submit
      </Button>
    </form>
  );
}
