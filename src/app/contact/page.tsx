import type { Metadata } from "next";
import styles from "./page.module.css";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { DotGrid, DecorativeCircle, AccentRule } from "@/components/Decorative";
import { siteInfo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Scharle Beauty College — phone, email, and our Outspan Plaza, Nyeri Town location.",
};

const MAPS_EMBED_SRC =
  "https://www.google.com/maps?q=Outspan+Plaza,+Nyeri+Town,+Kenya&output=embed";

export default function Contact() {
  return (
    <main>
      <section className={`${styles.section} ${styles.twoCol}`}>
        <DotGrid style={{ width: 320, height: 320, top: -40, right: -40 }} />
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Get in Touch</span>
          <h1 className={`h-display ${styles.headline}`}>Say hi first</h1>
          <p className="body-text" style={{ fontSize: 14, marginTop: 8 }}>
            Questions about a course, an intake date, or just want to swing
            by the studio? Send it here — we reply fast.
          </p>
          <div style={{ marginTop: 16 }}>
            <ContactForm />
          </div>
        </Reveal>
        <Reveal delay={0.1} className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Direct</span>
          <p className={`body-text ${styles.direct}`}>
            Phone — <strong>{siteInfo.phone}</strong>
            <br />
            Email — <strong>{siteInfo.email}</strong>
            <br />
            {siteInfo.address}
          </p>
          <div style={{ marginTop: 16 }}>
            <span className={`label ${styles.eyebrow}`}>Socials</span>
            <div className={styles.socialRow}>
              {siteInfo.socials.map((s) => (
                <a key={s.platform} href={s.url} aria-label={s.platform}>
                  {s.short}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <DecorativeCircle
          style={{ width: 220, height: 220, bottom: -80, left: -80 }}
          drift={{ y: -60, rotate: 20 }}
        />
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Find Us</span>
          <h2 className="h-display" style={{ fontSize: 24 }}>
            {siteInfo.address}
          </h2>
          <AccentRule className={styles.rule} />
          <div className={styles.mapFrame}>
            <iframe
              src={MAPS_EMBED_SRC}
              title="Scharle Beauty College — Outspan Plaza, Nyeri Town"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </section>
    </main>
  );
}
