import type { Metadata } from "next";
import { siteInfo } from "./content";

// Placeholder until the client supplies a domain / staging subdomain is
// provisioned in Sprint 2 (see PROJECT.md's Domain timing risk).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://scharle-staging.example.com";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  // Set as an absolute string rather than relying on the layout's title
  // template — Next.js doesn't apply a parent template to metadata defined
  // in the same route segment as the template itself, which would leave
  // the home page's <title> without the site name suffix.
  const ogTitle = `${title} | ${siteInfo.name}`;

  return {
    title: ogTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: siteInfo.name,
      type: "website",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}
