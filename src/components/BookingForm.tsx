"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Field, fieldStyles } from "@/components/Field";
import { Button, type ButtonStatus } from "@/components/Button";
import { submitBooking, type BookingState } from "@/app/admissions/actions";
import type { Course } from "@/lib/strapi";

const initialBookingState: BookingState = { status: "idle" };

export function BookingForm({
  defaultCourseSlug,
  courses,
}: {
  /** Pre-selects "Course of interest" — set when arriving via a course
   * detail page's enquiry CTA (`/admissions?course=<slug>`). */
  defaultCourseSlug?: string;
  courses: Course[];
}) {
  const [state, formAction, pending] = useActionState(
    submitBooking,
    initialBookingState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Brief "Sent ✓" confirmation, then revert so the form is ready for
  // another booking — mirrors the old placeholder UI's timing.
  useEffect(() => {
    if (state.status !== "success") return;
    setShowSuccess(true);
    formRef.current?.reset();
    const t = setTimeout(() => setShowSuccess(false), 2200);
    return () => clearTimeout(t);
  }, [state]);

  const buttonStatus: ButtonStatus = pending
    ? "loading"
    : showSuccess
      ? "success"
      : "idle";

  return (
    <form ref={formRef} action={formAction} style={{ maxWidth: 520 }} noValidate>
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
      {state.status === "error" && (
        <p
          role="alert"
          style={{
            color: "var(--color-press-red)",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          {state.message}
        </p>
      )}
      <Button type="submit" variant="primary" status={buttonStatus} successLabel="Sent">
        Submit
      </Button>
    </form>
  );
}
