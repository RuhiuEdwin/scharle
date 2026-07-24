import type { Metadata } from "next";
import { siteInfo } from "./content";

// Client-confirmed domain (2026-07-23 feedback round) — used everywhere
// until DNS/hosting is actually pointed at it (see PROJECT.md's Domain
// timing note); override via NEXT_PUBLIC_SITE_URL for local/staging runs.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://scharlebeauty.com";

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  image,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
}): Metadata {
  // Set as an absolute string rather than relying on the layout's title
  // template — Next.js doesn't apply a parent template to metadata defined
  // in the same route segment as the template itself, which would leave
  // the home page's <title> without the site name suffix.
  const ogTitle = `${title} | ${siteInfo.name}`;
  const ogImage = image ?? "/opengraph-image";

  return {
    title: ogTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: siteInfo.name,
      type,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImage],
    },
  };
}
