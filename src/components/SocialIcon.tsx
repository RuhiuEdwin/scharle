import styles from "./SocialIcon.module.css";

// Compact single-path glyphs, one per guideline platform (design/BRAND-
// GUIDELINE-RECONCILIATION.md §iconography) — rendered white-on-red per the
// guideline's "row 1" icon treatment, since every current placement here
// sits on a light background.
const PATHS: Record<string, string> = {
  Facebook:
    "M13.5 9H16V6h-2.5C11.6 6 10 7.6 10 9.9V11H8v3h2v7h3v-7h2.4l.6-3H13v-1.1c0-.6.4-1 1-1z",
  Instagram:
    "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm4 3.5A4.5 4.5 0 1 1 7.5 13 4.5 4.5 0 0 1 12 8.5zm0 2A2.5 2.5 0 1 0 14.5 13 2.5 2.5 0 0 0 12 10.5zM17 6.8a1 1 0 1 1-1 1 1 1 0 0 1 1-1z",
  TikTok:
    "M14 3h2.4a4.6 4.6 0 0 0 3.6 3.9v2.5a7 7 0 0 1-3.6-1.2v6.3A5.5 5.5 0 1 1 11 9.1v2.6a3 3 0 1 0 2.5 3V3z",
  WhatsApp:
    "M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3zm0 1.8A7.2 7.2 0 0 1 17.9 17l-.1.1.5 2-2-.5A7.2 7.2 0 1 1 12 4.8zm-3.2 3.5c-.2 0-.5.1-.7.3-.2.3-.9.8-.9 2s.9 2.4 1 2.5c.1.2 1.7 2.7 4.2 3.7 2 .8 2.4.7 2.9.6.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.6-.3l-1.6-.8c-.2-.1-.4-.2-.6.1l-.5.7c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.8-.7-1.3-1.6-1.4-1.9-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4z",
  X: "M6 4h3.6l3 4.1L15.9 4H18l-4.9 6.6L18.4 20h-3.6l-3.4-4.6L7 20H4.9l5.2-7-4.1-9z",
  YouTube:
    "M20.5 8.2a2.8 2.8 0 0 0-2-2C16.9 5.7 12 5.7 12 5.7s-4.9 0-6.5.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 3 12a29 29 0 0 0 .5 3.8 2.8 2.8 0 0 0 2 2c1.6.5 6.5.5 6.5.5s4.9 0 6.5-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 21 12a29 29 0 0 0-.5-3.8zM10 15.2V8.8l5.5 3.2z",
  LinkedIn:
    "M6.9 8.9H4V19h2.9zM5.4 4.8A1.7 1.7 0 1 0 5.4 8.2 1.7 1.7 0 0 0 5.4 4.8zM20 12.9c0-3-1.6-4.4-3.7-4.4a3.2 3.2 0 0 0-2.9 1.6V8.9h-2.9c0 .7 0 10.1 0 10.1h2.9v-5.6c0-.3 0-.6.1-.8a2.3 2.3 0 0 1 2.1-1.5c1.5 0 2.1 1.1 2.1 2.8v5.1H20z",
};

export function SocialIcon({
  platform,
  url,
}: {
  platform: string;
  url: string;
}) {
  const path = PATHS[platform];
  return (
    <a
      href={url}
      className={styles.badge}
      aria-label={platform}
      target={url.startsWith("http") ? "_blank" : undefined}
      rel={url.startsWith("http") ? "noreferrer" : undefined}
    >
      {path ? (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d={path} fill="currentColor" />
        </svg>
      ) : (
        platform.slice(0, 2).toUpperCase()
      )}
    </a>
  );
}
