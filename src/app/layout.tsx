import type { Metadata } from "next";
import { display, jakarta } from "./fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollTriggerRefresh } from "@/components/ScrollTriggerRefresh";
import { getSiteInfo } from "@/lib/strapi";
import { SITE_URL } from "@/lib/seo";
import { THEME_MODE } from "@/lib/theme";
import "./globals.css";

const description =
  "Hands-on training in hair, skin, nails, makeup, and barbering at Scharle Beauty College, Outspan Plaza, Nyeri Town.";

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteInfo();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${siteInfo.name} | ${siteInfo.tagline}`,
      template: `%s | ${siteInfo.name}`,
    },
    description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${siteInfo.name} | ${siteInfo.tagline}`,
      description,
      url: "/",
      siteName: siteInfo.name,
      type: "website",
      locale: "en_KE",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteInfo.name} | ${siteInfo.tagline}`,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteInfo = await getSiteInfo();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteInfo.name,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/icon.png`,
    description:
      "Beauty and barbering college offering hands-on training in hairdressing, beauty therapy, cosmetology, makeup artistry, nail technology, and barbering.",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteInfo.address,
      addressLocality: "Nyeri",
      addressCountry: "KE",
    },
    telephone: siteInfo.phone,
    email: siteInfo.email,
    sameAs: siteInfo.socials
      .filter((s) => s.url && s.url !== "#")
      .map((s) => s.url),
  };

  return (
    <html
      lang="en"
      className={`${display.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Sets data-theme before hydration so there's no flash of the wrong
            theme. THEME_MODE "both" resolves it the usual way (saved choice,
            else system preference); "dark"/"light" just pins the attribute —
            no toggle is rendered in that case (see Header), so there's
            nothing else to resolve. */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html:
              THEME_MODE === "both"
                ? `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`
                : `document.documentElement.setAttribute('data-theme','${THEME_MODE}');`,
          }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ScrollTriggerRefresh />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
