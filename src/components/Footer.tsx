import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { SocialIcon } from "@/components/SocialIcon";
import { getSiteInfo, getCourses } from "@/lib/strapi";

const linkGroups = [
  {
    title: "Site",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/gallery", label: "Gallery" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Admissions",
    links: [
      { href: "/admissions", label: "How to Join" },
      { href: "/admissions", label: "Book a Visit" },
    ],
  },
];

export async function Footer() {
  const [siteInfo, courses] = await Promise.all([getSiteInfo(), getCourses()]);

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brandCol}>
          <Link href="/" className={styles.mark}>
            <span className={styles.circle} aria-hidden="true">
              <Image src="/logo-mark.png" alt="" width={28} height={28} />
            </span>
            <span className={styles.wordLockup}>
              <span className={styles.primary}>SCHARLE</span>
              <span className={styles.secondary}>BEAUTY COLLEGE</span>
            </span>
          </Link>
          <p className={styles.tagline}>{siteInfo.tagline}</p>
          <div className={styles.socialRow}>
            {siteInfo.socials.map((s) => (
              <SocialIcon key={s.platform} platform={s.platform} url={s.url} />
            ))}
          </div>
        </div>

        <div className={styles.linkGroups}>
          {linkGroups.map((group) => (
            <div key={group.title}>
              <span className={`label ${styles.groupTitle}`}>{group.title}</span>
              <div className={styles.groupList}>
                {group.links.map((link) => (
                  <Link key={link.label} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <span className={`label ${styles.groupTitle}`}>Courses</span>
            <div className={styles.groupList}>
              {courses.map((c) => (
                <Link key={c.slug} href="/courses" className={styles.sub}>
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.middle}>
        <div className={styles.signupCol}>
          <h3 className={`h-display ${styles.signupTitle}`}>
            Get intake updates
          </h3>
          <p className={styles.signupNote}>
            Next intake dates, open days, and new course drops. No spam.
          </p>
          <NewsletterSignup />
        </div>
        <p className={styles.contactInfo}>
          Phone: <strong>{siteInfo.phone}</strong>
          <br />
          Email: <strong>{siteInfo.email}</strong>
          <br />
          {siteInfo.address}
        </p>
      </div>

      <p className={styles.fine}>
        <span>
          © {new Date().getFullYear()} {siteInfo.name}
        </span>
        <span>{siteInfo.address}</span>
      </p>
    </footer>
  );
}
