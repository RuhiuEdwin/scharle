import Image from "next/image";
import styles from "./PageHero.module.css";
import { Reveal } from "@/components/Reveal";

export function PageHero({
  eyebrow,
  title,
  subcopy,
  image,
  alt,
}: {
  eyebrow: string;
  title: string;
  subcopy?: string;
  image: string;
  alt: string;
}) {
  return (
    <div className={styles.hero}>
      <div className={styles.media}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes="100vw"
          priority
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.scrim} />
      <Reveal className={styles.content}>
        <span className={`label ${styles.eyebrow}`}>{eyebrow}</span>
        <h1 className={`h-display ${styles.title}`}>{title}</h1>
        {subcopy && <p className={styles.sub}>{subcopy}</p>}
      </Reveal>
    </div>
  );
}
