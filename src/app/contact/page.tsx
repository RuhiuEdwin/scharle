import type { Metadata } from "next";
import styles from "./page.module.css";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { PatternField, AccentRule } from "@/components/Decorative";
import { SocialIcon } from "@/components/SocialIcon";
import { ButtonLink } from "@/components/Button";
import { getSiteInfo, getContactPage } from "@/lib/strapi";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Scharle Beauty College: phone, email, and our Outspan Plaza, Nyeri Town location.",
  path: "/contact",
});

const FALLBACK_MAPS_EMBED_SRC =
  "https://www.google.com/maps?q=Outspan+Plaza,+Nyeri+Town,+Kenya&output=embed";

export default async function Contact() {
  const [siteInfo, contactPage] = await Promise.all([getSiteInfo(), getContactPage()]);
  const mapsEmbedSrc = contactPage.mapEmbedUrl || FALLBACK_MAPS_EMBED_SRC;

  return (
    <main>
      <section className={`${styles.section} ${styles.twoCol}`}>
        <PatternField style={{ width: 320, height: 320, top: -40, right: -40 }} />
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Get in Touch</span>
          <h1 className={`h-display ${styles.headline}`}>Say hi first</h1>
          <p className="body-text" style={{ fontSize: 14, marginTop: 8 }}>
            Questions about a course, an intake date, or just want to swing
            by the studio? Send it here. We reply fast.
          </p>
          <div style={{ marginTop: 16 }}>
            <ContactForm />
          </div>
        </Reveal>
        <Reveal delay={0.1} className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Direct</span>
          <p className={`body-text ${styles.direct}`}>
            Phone: <strong>{siteInfo.phone}</strong>
            <br />
            Email: <strong>{siteInfo.email}</strong>
            <br />
            {siteInfo.address}
          </p>
          {siteInfo.calendlyUrl && (
            <div style={{ marginTop: 16 }}>
              <ButtonLink href={siteInfo.calendlyUrl} variant="secondary" external>
                Book a discovery call
              </ButtonLink>
            </div>
          )}
          <div style={{ marginTop: 16 }}>
            <span className={`label ${styles.eyebrow}`}>Socials</span>
            <div className={styles.socialRow}>
              {siteInfo.socials.map((s) => (
                <SocialIcon key={s.platform} platform={s.platform} url={s.url} />
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <Reveal className={styles.sectionInner}>
          <span className={`label ${styles.eyebrow}`}>Find Us</span>
          <h2 className="h-display" style={{ fontSize: 24 }}>
            {siteInfo.address}
          </h2>
          <AccentRule className={styles.rule} />
          <div className={styles.mapFrame}>
            <iframe
              src={mapsEmbedSrc}
              title="Scharle Beauty College: Outspan Plaza, Nyeri Town"
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
