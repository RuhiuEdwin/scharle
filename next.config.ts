import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
    ],
    // Next's image optimizer refuses to fetch upstream images that resolve
    // to a private/loopback IP (SSRF hardening) — that's exactly what a
    // local Strapi on localhost:1337 does, so optimization is disabled
    // whenever the CMS host is local. Remove this once Strapi is on real
    // (non-loopback) hosting; Unsplash requests were never affected.
    unoptimized: (process.env.NEXT_PUBLIC_STRAPI_URL ?? "").includes("localhost"),
  },
};

export default nextConfig;
