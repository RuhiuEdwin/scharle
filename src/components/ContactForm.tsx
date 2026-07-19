"use client";

import { useState } from "react";
import { Field, fieldStyles } from "@/components/Field";
import { Button, type ButtonStatus } from "@/components/Button";

// Submission (storage + admin email + honeypot/rate-limit enforcement) is
// wired up in Sprint 4 against a real ContactSubmission endpoint. The
// loading/success button lifecycle below is real UI, driven by a
// placeholder timeout until that fetch call exists.
export function ContactForm() {
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
    <form onSubmit={handleSubmit} style={{ maxWidth: 460 }} noValidate>
      <Field label="Name" errorMessage="Tell us your name.">
        <input type="text" name="name" required />
      </Field>
      <Field label="Email" errorMessage="Enter a valid email address, like you@example.com">
        <input type="email" name="email" required />
      </Field>
      <Field label="Message" errorMessage="Let us know what you'd like to ask.">
        <textarea name="message" rows={4} required />
      </Field>
      <input
        type="text"
        name="company"
        className={fieldStyles.honeypot}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <Button type="submit" variant="primary" status={status} successLabel="Sent">
        Send
      </Button>
    </form>
  );
}
