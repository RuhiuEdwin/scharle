import styles from "./MobileCtaBar.module.css";
import { ButtonLink } from "@/components/Button";

// Persistent mobile-only dual CTA, per the Sprint 0 wireframe decision:
// conversion is never more than one tap away, on every page except
// Admissions (where the booking form itself is the CTA).
export function MobileCtaBar() {
  return (
    <>
      <div className={styles.bar}>
        <ButtonLink href="/admissions" variant="primary" full>
          Apply Now
        </ButtonLink>
        <ButtonLink href="/admissions" variant="secondary" full>
          Book a Visit
        </ButtonLink>
      </div>
      <div className={styles.spacer} aria-hidden="true" />
    </>
  );
}
