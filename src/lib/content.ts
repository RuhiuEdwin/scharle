// Placeholder content, shaped to match design/content-model.md's Strapi
// collections so swapping this module for real API calls in Sprint 2/3
// is a data-source change only, not a component rewrite.
//
// Images are real, free-tier Unsplash photography (curated + verified in
// design/curated-images.md) — CMS placeholders until the client supplies
// real photos/video, per PROJECT.md's assumption that stock is swapped in
// via Strapi with zero dev work.

function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}`;
}

export type Course = {
  slug: string;
  name: string;
  duration: string;
  intakeMonths: string[];
  overview: string;
  whatYoullLearn: string[];
  /** Roles a graduate is qualified for — per content/COPY.md's Course
   * Detail addition (content-model gap flagged there, not yet in
   * design/content-model.md). */
  careerOutcomes: string[];
  /** Placeholder instructor bios — no real staff data supplied yet; flagged
   * as a content gap the same way stock imagery is until the client
   * supplies real photos/bios. */
  instructors: { name: string; role: string }[];
  featuredOnHome: boolean;
  image: string;
};

export const courses: Course[] = [
  {
    slug: "hairdressing-styling",
    name: "Hairdressing & Styling",
    duration: "6 months",
    intakeMonths: ["January", "May", "September"],
    overview:
      "Cutting, coloring, braiding, and styling for every hair type and occasion.",
    whatYoullLearn: [
      "Cutting & styling fundamentals",
      "Chemical treatments & coloring",
      "Braiding & weaving techniques",
      "Client consultation & retail",
    ],
    careerOutcomes: [
      "Salon stylist",
      "Session hairdresser",
      "Session assistant",
      "Freelance/mobile stylist",
    ],
    instructors: [{ name: "Grace Mwangi", role: "Lead Hairdressing Instructor" }],
    featuredOnHome: true,
    image: unsplash("1634449571010-02389ed0f9b0"),
  },
  {
    slug: "beauty-therapy",
    name: "Beauty Therapy",
    duration: "6 months",
    intakeMonths: ["January", "May", "September"],
    overview:
      "Skincare, facials, waxing, and spa treatments, hands-on from week one.",
    whatYoullLearn: [
      "Facials & skin analysis",
      "Waxing & hair removal",
      "Body treatments & massage basics",
      "Spa hygiene & client care",
    ],
    careerOutcomes: [
      "Spa therapist",
      "Skincare specialist",
      "Beauty salon technician",
      "Mobile beauty therapist",
    ],
    instructors: [{ name: "Faith Wanjiru", role: "Beauty Therapy Instructor" }],
    featuredOnHome: false,
    image: unsplash("1616394584738-fc6e612e71b9"),
  },
  {
    slug: "cosmetology",
    name: "Cosmetology",
    duration: "9 months",
    intakeMonths: ["January", "September"],
    overview: "Full-spectrum hair and skin care, plus salon management basics.",
    whatYoullLearn: [
      "Full-spectrum hair & skin care",
      "Product chemistry basics",
      "Salon management fundamentals",
    ],
    careerOutcomes: [
      "All-round salon cosmetologist",
      "Salon supervisor/manager track",
      "Product consultant",
    ],
    instructors: [{ name: "Esther Njoki", role: "Cosmetology Program Lead" }],
    featuredOnHome: false,
    image: unsplash("1707979577466-2d6109c68a45"),
  },
  {
    slug: "makeup-artistry",
    name: "Makeup Artistry",
    duration: "4 months",
    intakeMonths: ["January", "May", "September"],
    overview:
      "Bridal, editorial, and everyday makeup, plus how to build a client book.",
    whatYoullLearn: [
      "Bridal & editorial makeup",
      "Everyday & special-occasion looks",
      "Building a client book",
    ],
    careerOutcomes: [
      "Freelance makeup artist",
      "Bridal MUA",
      "Studio/photoshoot MUA",
      "Brand/counter makeup artist",
    ],
    instructors: [{ name: "Diana Achieng", role: "Makeup Artistry Instructor" }],
    featuredOnHome: true,
    image: unsplash("1709477542149-f4e0e21d590b"),
  },
  {
    slug: "nail-technology",
    name: "Nail Technology",
    duration: "3 months",
    intakeMonths: ["January", "May", "September"],
    overview:
      "Manicure, pedicure, gel, and nail art techniques clients actually ask for.",
    whatYoullLearn: [
      "Manicure & pedicure technique",
      "Gel, acrylic & nail art",
      "Hygiene & tool care",
    ],
    careerOutcomes: [
      "Nail technician",
      "Nail bar specialist",
      "Freelance/mobile nail tech",
    ],
    instructors: [{ name: "Purity Kamau", role: "Nail Technology Instructor" }],
    featuredOnHome: true,
    image: unsplash("1632345031435-8727f6897d53"),
  },
  {
    slug: "barbering",
    name: "Barbering",
    duration: "4 months",
    intakeMonths: ["January", "May", "September"],
    overview: "Fades, line-ups, beard work, and running a barbershop chair.",
    whatYoullLearn: [
      "Fades, line-ups & classic cuts",
      "Beard shaping & razor work",
      "Barbershop client flow",
    ],
    careerOutcomes: [
      "Barber",
      "Barbershop chair rental operator",
      "Session barber",
    ],
    instructors: [{ name: "Brian Otieno", role: "Lead Barbering Instructor" }],
    featuredOnHome: false,
    image: unsplash("1647140655214-e4a2d914971f"),
  },
];

export type GalleryItem = {
  caption: string;
  category: "Studio" | "Students";
  image: string;
};

export const galleryItems: GalleryItem[] = [
  { caption: "Studio floor", category: "Studio", image: unsplash("1633681926022-84c23e8cb2d6") },
  { caption: "Color bar", category: "Studio", image: unsplash("1707979577466-2d6109c68a45") },
  { caption: "Styling stations", category: "Studio", image: unsplash("1634449571010-02389ed0f9b0") },
  { caption: "Nail bar", category: "Studio", image: unsplash("1632345031435-8727f6897d53") },
  { caption: "Grad shoot", category: "Students", image: unsplash("1633329712165-4e578376eb87") },
  { caption: "Practice day", category: "Students", image: unsplash("1616394584738-fc6e612e71b9") },
  { caption: "Content day", category: "Students", image: unsplash("1695408247109-3bf125ad0538") },
  { caption: "Barbering practical", category: "Students", image: unsplash("1647140655214-e4a2d914971f") },
];

export type WhyScharleHighlight = {
  title: string;
  body: string;
  image: string;
};

export const whyScharleHighlights: WhyScharleHighlight[] = [
  {
    title: "Industry pros on the floor",
    body: "Not just lecturers: working stylists and therapists teach every module.",
    image: unsplash("1647140655214-e4a2d914971f"),
  },
  {
    title: "Real chairs, real clients",
    body: "You're practicing on real people from term one, not mannequins all year.",
    image: unsplash("1634449571010-02389ed0f9b0"),
  },
  {
    title: "Portfolio from day one",
    body: "Every project is shot and logged; you graduate with content, not just a certificate.",
    image: unsplash("1695408247109-3bf125ad0538"),
  },
];

export const testimonials = [
  {
    quote:
      "I walked in knowing nothing about barbering. Six months later I'm doing fades for actual paying clients.",
    who: "Brian, Barbering",
    courseSlug: "barbering",
  },
  {
    quote:
      "The instructors still work in real salons. They teach what's actually happening in the industry right now.",
    who: "Faith, Beauty Therapy",
    courseSlug: "beauty-therapy",
  },
  {
    quote:
      "Every project got shot for my portfolio. I had real content to post before I even graduated.",
    who: "Diana, Makeup Artistry",
    courseSlug: "makeup-artistry",
  },
  {
    quote:
      "Booked my first bridal client while still a student here. That doesn't happen at just any school.",
    who: "Purity, Nail Technology",
    courseSlug: "nail-technology",
  },
];

export type StudentLifeHighlight = {
  caption: string;
  showOnAbout: boolean;
  image: string;
};

export const studentLifeHighlights: StudentLifeHighlight[] = [
  { caption: "Studio", showOnAbout: true, image: unsplash("1633681926022-84c23e8cb2d6") },
  { caption: "Grad day", showOnAbout: true, image: unsplash("1633329712165-4e578376eb87") },
  { caption: "Practice day", showOnAbout: true, image: unsplash("1695408247109-3bf125ad0538") },
  { caption: "Content day", showOnAbout: true, image: unsplash("1647140655214-e4a2d914971f") },
];

export const admissionsSteps = [
  {
    title: "Inquire",
    body: "Call, DM, or drop by the studio to ask about a course.",
  },
  {
    title: "Visit or apply",
    body: "Book a school visit or submit your application directly.",
  },
  {
    title: "Enroll & start",
    body: "Confirm your intake date and show up on day one.",
  },
];

export const admissionsRequirements = [
  "KCPE or KCSE certificate (copy)",
  "National ID or birth certificate",
  "2 passport photos",
  "Registration fee",
];

/** Payment channel display only — no gateway integration. Every value below
 * is a placeholder pending real account details from the client (see
 * EXECUTION-PLAN-client-feedback-2026-07-23.md item 4); swap via CMS once
 * Strapi is live, zero dev work either way. */
export type PaymentInfo = {
  sectionTitle: string;
  introNote: string;
  registrationFee: string;
  tuitionNote: string;
  channels: { label: string; lines: string[] }[];
  disclaimer: string;
};

export const paymentInfo: PaymentInfo = {
  sectionTitle: "Fees & Payment Options",
  introNote:
    "Pay registration and tuition through either channel below. Bring your receipt/M-Pesa message with you on visit or intake day.",
  registrationFee: "KES 5,000",
  tuitionNote: "From KES 45,000 per term, course-dependent — confirmed exactly during your visit or application review.",
  channels: [
    {
      label: "Bank Transfer",
      lines: [
        "Equity Bank Kenya",
        "Acc. Name: Scharle Beauty College Ltd",
        "Acc. No: 0000000000000",
        "Branch: Nyeri",
      ],
    },
    {
      label: "M-Pesa Paybill",
      lines: [
        "Paybill No: 000000",
        "Account No: Your full name",
        "Confirm SMS before your visit",
      ],
    },
  ],
  disclaimer:
    "All figures and account details above are placeholders pending final confirmation from the college — do not send payment against them yet.",
};

export const siteInfo = {
  name: "Scharle Beauty College",
  tagline: "Learn it. Live it. Glow it.",
  phone: "0712 345 678",
  email: "hello@scharlebeauty.ke",
  address: "Outspan Plaza, Nyeri Town",
  heroImage: unsplash("1707409066859-a90674383d19"),
  aboutImage: unsplash("1633681926022-84c23e8cb2d6"),
  socials: [
    { platform: "Instagram", url: "#", short: "IG" },
    { platform: "TikTok", url: "#", short: "TT" },
    { platform: "Facebook", url: "#", short: "FB" },
  ],
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/admissions", label: "Admissions" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];
