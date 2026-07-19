import Image from "next/image";
import styles from "./ImgPlaceholder.module.css";

export function ImgPlaceholder({
  caption,
  height,
  className,
  src,
  priority,
  sizes = "(max-width: 760px) 100vw, 50vw",
}: {
  caption: string;
  height?: number;
  className?: string;
  src?: string;
  priority?: boolean;
  /** Override when the image doesn't actually render at 100vw/50vw (e.g. a grid tile). */
  sizes?: string;
}) {
  return (
    <div
      className={`${styles.block} ${src ? "" : styles.placeholder} ${className ?? ""}`}
      data-caption={caption}
      style={height ? { height } : undefined}
    >
      {src && (
        <Image
          src={src}
          alt={caption}
          fill
          sizes={sizes}
          className={styles.img}
          priority={priority}
        />
      )}
    </div>
  );
}
