import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getCourses } from "@/lib/strapi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getCourses();
  const routes = ["", "/about", "/courses", "/admissions", "/gallery", "/contact"];
  const courseRoutes = courses.map((c) => `/courses/${c.slug}`);

  return [...routes, ...courseRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
