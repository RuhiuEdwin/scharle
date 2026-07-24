"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./CourseAccordion.module.css";
import { ImgPlaceholder } from "@/components/ImgPlaceholder";
import { ButtonLink } from "@/components/Button";
import { StaggerReveal, StaggerItem } from "@/components/StaggerReveal";
import type { Course } from "@/lib/strapi";

const EASE_SNAP = [0.16, 1.35, 0.34, 1] as const;

export function CourseAccordion({ courses }: { courses: Course[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(
    courses[0]?.slug ?? null,
  );

  return (
    <StaggerReveal>
      {courses.map((course) => {
        const open = openSlug === course.slug;
        return (
          <StaggerItem className={styles.item} key={course.slug}>
            <button
              className={styles.head}
              aria-expanded={open}
              onClick={() => setOpenSlug(open ? null : course.slug)}
            >
              <h3 className="h-display">{course.name}</h3>
              <motion.span
                className={styles.plus}
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ duration: 0.22, ease: EASE_SNAP }}
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: EASE_SNAP }}
                  style={{ overflow: "hidden" }}
                >
                  <div className={styles.bodyInner}>
                    <ImgPlaceholder
                      caption={course.name}
                      src={course.image}
                      className={styles.image}
                    />
                    <p className="body-text" style={{ fontSize: 14 }}>
                      {course.duration} ·{" "}
                      {course.intakeMonths.join(" / ")} intake
                    </p>
                    <ul>
                      {course.whatYoullLearn.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className={styles.applyBtn}>
                      <ButtonLink href="/admissions" variant="primary">
                        Apply for this course
                      </ButtonLink>
                      <ButtonLink href={`/courses/${course.slug}`} variant="secondary">
                        Full course details
                      </ButtonLink>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </StaggerItem>
        );
      })}
    </StaggerReveal>
  );
}
