import type { Metadata } from "next";
import { anton, archivo } from "./fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollTriggerRefresh } from "@/components/ScrollTriggerRefresh";
import { siteInfo } from "@/lib/content";
import "./globals.css";

// Placeholder until the client supplies a domain / staging subdomain is
// provisioned in Sprint 2 (see PROJECT.md's Domain timing risk).
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://scharle-staging.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteInfo.name} — ${siteInfo.tagline}`,
    template: `%s — ${siteInfo.name}`,
  },
  description:
    "Hands-on training in hair, skin, nails, makeup, and barbering at Scharle Beauty College, Outspan Plaza, Nyeri Town.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteInfo.name,
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${anton.variable} ${archivo.variable}`}>
      <body>
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
