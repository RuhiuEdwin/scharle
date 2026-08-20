import type { NextConfig } from "next";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? "";
const strapiUrlParsed = (() => {
  try {
    return new URL(strapiUrl);
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  output: "standalone",
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
      {
        protocol: "https",
        hostname: "*.up.railway.app",
      },
      // Matches whatever host NEXT_PUBLIC_STRAPI_URL points at (e.g. the
      // production CMS subdomain) so this doesn't need a hardcoded entry
      // per deployment target.
      ...(strapiUrlParsed && strapiUrlParsed.hostname !== "localhost"
        ? [
            {
              protocol: strapiUrlParsed.protocol.replace(":", "") as "https" | "http",
              hostname: strapiUrlParsed.hostname,
            },
          ]
        : []),
    ],
    // Next's image optimizer refuses to fetch upstream images that resolve
    // to a private/loopback IP (SSRF hardening) — that's exactly what a
    // local Strapi on localhost:1337 does, so optimization is disabled
    // whenever the CMS host is local. Remove this once Strapi is on real
    // (non-loopback) hosting; Unsplash requests were never affected.
    unoptimized: strapiUrl.includes("localhost"),
  },
};

export default nextConfig;
