import { getCourses, getSiteInfo } from "@/lib/strapi";
import { SITE_URL } from "@/lib/seo";

export async function GET() {
  const [courses, siteInfo] = await Promise.all([getCourses(), getSiteInfo()]);
  const courseLines = courses
    .map(
      (c) =>
        `- [${c.name}](${SITE_URL}/courses/${c.slug}): ${c.duration}. ${c.overview}`,
    )
    .join("\n");

  const body = `# ${siteInfo.name}

> ${siteInfo.tagline} Hands-on beauty and barbering training in ${siteInfo.address}, Kenya.

${siteInfo.name} trains hairdressers, beauty therapists, cosmetologists, makeup artists, nail technicians, and barbers in a working studio, not a lecture hall. Every skill is practiced on real clients before graduation, and every intake is limited to keep chair-time real.

## Programs

${courseLines}

## Key pages

- [Home](${SITE_URL}/)
- [About](${SITE_URL}/about): Mission, vision, and student life.
- [Courses](${SITE_URL}/courses): All six programs, durations, and intakes.
- [Admissions](${SITE_URL}/admissions): How to join, requirements, and intake dates.
- [Gallery](${SITE_URL}/gallery): Studio and student work.
- [Contact](${SITE_URL}/contact): Phone, email, and location.

## Contact

- Phone: ${siteInfo.phone}
- Email: ${siteInfo.email}
- Address: ${siteInfo.address}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
