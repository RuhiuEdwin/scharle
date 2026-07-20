import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import { siteInfo } from "@/lib/content";

export const runtime = "nodejs";
export const alt = `${siteInfo.name} | ${siteInfo.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const markSrc = `data:image/png;base64,${fs
  .readFileSync(path.join(process.cwd(), "src/app/icon.png"))
  .toString("base64")}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#fafafa",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "#ff1a1a14",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -100,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "#ff1a1a0d",
            display: "flex",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} width={140} height={140} alt="" />
          <div
            style={{
              marginTop: 36,
              display: "flex",
              fontSize: 84,
              fontWeight: 800,
              color: "#141414",
              letterSpacing: -2,
            }}
          >
            SCHARLE
          </div>
          <div
            style={{
              marginTop: 4,
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              color: "#4a4a4a",
              letterSpacing: 10,
            }}
          >
            BEAUTY COLLEGE
          </div>
          <div
            style={{
              marginTop: 28,
              display: "flex",
              fontSize: 30,
              fontWeight: 600,
              color: "#e21c1c",
            }}
          >
            {siteInfo.tagline}
          </div>
          <div
            style={{
              marginTop: 20,
              display: "flex",
              fontSize: 22,
              fontWeight: 500,
              color: "#8a8a8a",
            }}
          >
            {siteInfo.address}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
