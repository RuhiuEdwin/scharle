import styles from "./CourseCard.module.css";
import { ImgPlaceholder } from "@/components/ImgPlaceholder";
import type { Course } from "@/lib/content";

export function CourseCard({ course }: { course: Course }) {
  return (
    <div className={styles.card}>
      <ImgPlaceholder
        caption={course.name}
        src={course.image}
        className={styles.image}
        sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
      />
      <div className={styles.body}>
        <span className={styles.meta}>{course.duration}</span>
        <h3 className={`h-display ${styles.title}`}>{course.name}</h3>
        <p className={styles.blurb}>{course.overview}</p>
      </div>
    </div>
  );
}
