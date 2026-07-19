"use client";

import { useState } from "react";
import { Field, fieldStyles } from "@/components/Field";
import { Button, type ButtonStatus } from "@/components/Button";

// Real submission (storing the address, dedupe, unsubscribe) is Sprint 4+
// scope against a real endpoint. The loading/success lifecycle here is
// real UI, driven by a placeholder timeout until that call exists —
// consistent with BookingForm/ContactForm.
export function NewsletterSignup() {
  const [status, setStatus] = useState<ButtonStatus>("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2200);
    }, 1000);
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 220px", minWidth: 200 }}>
        <Field label="Email address" errorMessage="Enter a valid email address.">
          <input type="email" name="email" required />
        </Field>
      </div>
      <Button type="submit" variant="primary" status={status} successLabel="Subscribed">
        Get intake updates
      </Button>
      <input
        type="text"
        name="company"
        className={fieldStyles.honeypot}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
    </form>
  );
}
