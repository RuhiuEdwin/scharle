import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getCourses, getBlogPosts } from "@/lib/strapi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, posts] = await Promise.all([getCourses(), getBlogPosts()]);
  const routes = ["", "/about", "/courses", "/admissions", "/gallery", "/blog", "/contact"];
  const courseRoutes = courses.map((c) => `/courses/${c.slug}`);
  const postRoutes = posts.map((p) => `/blog/${p.slug}`);

  return [...routes, ...courseRoutes, ...postRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
