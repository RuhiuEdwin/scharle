// Live Strapi data layer. Shapes returned here match content.ts's old
// static exports exactly, so page components didn't need rewriting —
// only the import source and an added `await`, per PROJECT.md's Sprint 3
// note that this swap was always meant to be data-source-only.

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

async function strapiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${STRAPI_URL}/api/${path}`, {
    headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Strapi fetch failed: GET /api/${path} -> ${res.status}`);
  }
  const json = await res.json();
  return json.data as T;
}

type StrapiMedia = { url: string };
type ListItem = { text: string };

export function mediaUrl(media: StrapiMedia | null | undefined): string {
  if (!media) return "";
  return media.url.startsWith("http") ? media.url : `${STRAPI_URL}${media.url}`;
}

// ---------------------------------------------------------------------------
// Course

export type Course = {
  slug: string;
  name: string;
  duration: string;
  fee: string;
  intakeMonths: string[];
  overview: string;
  whatYoullLearn: string[];
  careerOutcomes: string[];
  instructors: { name: string; role: string }[];
  faqs: { question: string; answer: string }[];
  featuredOnHome: boolean;
  image: string;
};

type RawCourse = {
  slug: string;
  name: string;
  duration: string;
  fee: string | null;
  intakeMonths: ListItem[];
  overview: string;
  whatYoullLearn: ListItem[];
  careerOutcomes: ListItem[];
  instructors: { name: string; role: string }[];
  faqs: { question: string; answer: string }[];
  featuredOnHome: boolean;
  heroImage: StrapiMedia | null;
  order: number;
};

const COURSE_POPULATE =
  "populate[heroImage]=true&populate[whatYoullLearn]=true&populate[careerOutcomes]=true&populate[instructors]=true&populate[intakeMonths]=true&populate[faqs]=true";

function mapCourse(c: RawCourse): Course {
  return {
    slug: c.slug,
    name: c.name,
    duration: c.duration,
    fee: c.fee ?? "",
    intakeMonths: c.intakeMonths.map((i) => i.text),
    overview: c.overview,
    whatYoullLearn: c.whatYoullLearn.map((i) => i.text),
    careerOutcomes: c.careerOutcomes.map((i) => i.text),
    instructors: c.instructors ?? [],
    faqs: c.faqs ?? [],
    featuredOnHome: c.featuredOnHome,
    image: mediaUrl(c.heroImage),
  };
}

export async function getCourses(): Promise<Course[]> {
  const raw = await strapiFetch<RawCourse[]>(
    `courses?${COURSE_POPULATE}&sort=order:asc&pagination[pageSize]=100`,
  );
  return raw.map(mapCourse);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const raw = await strapiFetch<RawCourse[]>(
    `courses?filters[slug][$eq]=${encodeURIComponent(slug)}&${COURSE_POPULATE}`,
  );
  return raw[0] ? mapCourse(raw[0]) : null;
}

// ---------------------------------------------------------------------------
// Gallery

export type GalleryItem = {
  caption: string;
  category: "Studio" | "Students";
  image: string;
  courseSlug: string | null;
};

type RawGalleryItem = {
  caption: string;
  category: "Studio" | "Students";
  image: StrapiMedia;
  order: number;
  course: { slug: string } | null;
};

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const raw = await strapiFetch<RawGalleryItem[]>(
    "gallery-items?populate[image]=true&populate[course]=true&sort=order:asc&pagination[pageSize]=100",
  );
  return raw.map((g) => ({
    caption: g.caption,
    category: g.category,
    image: mediaUrl(g.image),
    courseSlug: g.course?.slug ?? null,
  }));
}

export async function getGalleryItemsForCourse(slug: string): Promise<GalleryItem[]> {
  const all = await getGalleryItems();
  return all.filter((g) => g.courseSlug === slug);
}

// ---------------------------------------------------------------------------
// Why Scharle Highlights

export type WhyScharleHighlight = {
  title: string;
  body: string;
  image: string;
};

type RawWhyScharleHighlight = {
  title: string;
  body: string;
  image: StrapiMedia | null;
  order: number;
};

export async function getWhyScharleHighlights(): Promise<WhyScharleHighlight[]> {
  const raw = await strapiFetch<RawWhyScharleHighlight[]>(
    "why-scharle-highlights?populate[image]=true&sort=order:asc&pagination[pageSize]=100",
  );
  return raw.map((w) => ({ title: w.title, body: w.body, image: mediaUrl(w.image) }));
}

// ---------------------------------------------------------------------------
// Student Life Highlights + Testimonials (one shared collection in Strapi)

export type StudentLifeHighlight = {
  caption: string;
  showOnAbout: boolean;
  image: string;
};

export type Testimonial = {
  quote: string;
  who: string;
  courseSlug: string;
};

type RawStudentLifeHighlight = {
  caption: string;
  showOnAbout: boolean;
  image: StrapiMedia;
  quote: string | null;
  attribution: string | null;
  course: { slug: string } | null;
  order: number;
};

async function getStudentLifeRaw(): Promise<RawStudentLifeHighlight[]> {
  return strapiFetch<RawStudentLifeHighlight[]>(
    "student-life-highlights?populate[image]=true&populate[course]=true&sort=order:asc&pagination[pageSize]=100",
  );
}

export async function getStudentLifeHighlights(): Promise<StudentLifeHighlight[]> {
  const raw = await getStudentLifeRaw();
  return raw
    .filter((s) => s.showOnAbout)
    .map((s) => ({ caption: s.caption, showOnAbout: s.showOnAbout, image: mediaUrl(s.image) }));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const raw = await getStudentLifeRaw();
  return raw
    .filter((s): s is RawStudentLifeHighlight & { quote: string; attribution: string; course: { slug: string } } =>
      Boolean(s.quote && s.attribution && s.course),
    )
    .map((s) => ({ quote: s.quote, who: s.attribution, courseSlug: s.course.slug }));
}

// ---------------------------------------------------------------------------
// Payment Info

export type PaymentInfo = {
  sectionTitle: string;
  introNote: string;
  registrationFee: string;
  tuitionNote: string;
  channels: { label: string; lines: string[] }[];
  disclaimer: string;
};

type RawPaymentInfo = {
  sectionTitle: string;
  introNote: string;
  registrationFee: string;
  tuitionNote: string;
  channels: { label: string; lines: ListItem[] }[];
  disclaimer: string;
};

export async function getPaymentInfo(): Promise<PaymentInfo> {
  const raw = await strapiFetch<RawPaymentInfo>(
    "payment-info?populate[channels][populate]=lines",
  );
  return {
    sectionTitle: raw.sectionTitle,
    introNote: raw.introNote,
    registrationFee: raw.registrationFee,
    tuitionNote: raw.tuitionNote,
    channels: raw.channels.map((c) => ({ label: c.label, lines: c.lines.map((l) => l.text) })),
    disclaimer: raw.disclaimer,
  };
}

// ---------------------------------------------------------------------------
// Site Settings

export type SiteInfo = {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  calendlyUrl: string;
  socials: { platform: string; url: string; short: string }[];
};

type RawSiteSetting = {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  calendlyUrl: string | null;
  socialLinks: { platform: string; url: string }[];
};

const SHORT_BY_PLATFORM: Record<string, string> = { Instagram: "IG", TikTok: "TT", Facebook: "FB" };

export async function getSiteInfo(): Promise<SiteInfo> {
  const raw = await strapiFetch<RawSiteSetting>("site-setting?populate[socialLinks]=true");
  return {
    name: raw.name,
    tagline: raw.tagline,
    phone: raw.phone,
    email: raw.email,
    address: raw.address,
    calendlyUrl: raw.calendlyUrl ?? "",
    socials: raw.socialLinks.map((s) => ({
      platform: s.platform,
      url: s.url,
      short: SHORT_BY_PLATFORM[s.platform] ?? s.platform.slice(0, 2).toUpperCase(),
    })),
  };
}

// ---------------------------------------------------------------------------
// Home Page

export type HomePage = {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubcopy: string;
  heroImages: string[];
};

type RawHomePage = {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubcopy: string;
  heroMedia: StrapiMedia[];
};

export async function getHomePage(): Promise<HomePage> {
  const raw = await strapiFetch<RawHomePage>("home-page?populate[heroMedia]=true");
  return {
    heroEyebrow: raw.heroEyebrow,
    heroHeadline: raw.heroHeadline,
    heroSubcopy: raw.heroSubcopy,
    heroImages: (raw.heroMedia ?? []).map(mediaUrl),
  };
}

// ---------------------------------------------------------------------------
// About Page

export type AboutPage = {
  whoWeAre: { image: string; heading: string; body: string };
  mission: { heading: string; body: string };
  vision: { heading: string; body: string };
};

type RawAboutPage = {
  whoWeAre: { image: StrapiMedia; heading: string; body: string };
  mission: { heading: string; body: string };
  vision: { heading: string; body: string };
};

export async function getAboutPage(): Promise<AboutPage> {
  const raw = await strapiFetch<RawAboutPage>("about-page?populate[whoWeAre][populate]=image&populate[mission]=true&populate[vision]=true");
  return {
    whoWeAre: {
      image: mediaUrl(raw.whoWeAre.image),
      heading: raw.whoWeAre.heading,
      body: raw.whoWeAre.body,
    },
    mission: raw.mission,
    vision: raw.vision,
  };
}

// ---------------------------------------------------------------------------
// Courses Page (intro copy)

export type CoursesPage = { introHeading: string; introBody: string };

export async function getCoursesPage(): Promise<CoursesPage> {
  return strapiFetch<CoursesPage>("courses-page");
}

// ---------------------------------------------------------------------------
// Admissions Page

export type AdmissionsPage = {
  steps: { title: string; body: string }[];
  requirements: string[];
  activeIntakeMonth: string;
};

type RawAdmissionsPage = {
  howToJoinSteps: { title: string; body: string }[];
  requirementsChecklist: ListItem[];
  activeIntakeMonths: string;
};

export async function getAdmissionsPage(): Promise<AdmissionsPage> {
  const raw = await strapiFetch<RawAdmissionsPage>(
    "admissions-page?populate[howToJoinSteps]=true&populate[requirementsChecklist]=true",
  );
  return {
    steps: raw.howToJoinSteps,
    requirements: raw.requirementsChecklist.map((r) => r.text),
    activeIntakeMonth: raw.activeIntakeMonths,
  };
}

// ---------------------------------------------------------------------------
// Contact Page

export type ContactPage = {
  phone: string;
  email: string;
  address: string;
  mapEmbedUrl: string;
};

export async function getContactPage(): Promise<ContactPage> {
  return strapiFetch<ContactPage>("contact-page");
}

// ---------------------------------------------------------------------------
// Gallery Page (intro copy)

export type GalleryPage = { introHeading: string };

export async function getGalleryPage(): Promise<GalleryPage> {
  return strapiFetch<GalleryPage>("gallery-page");
}
