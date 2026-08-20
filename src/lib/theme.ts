export type ThemeMode = "dark" | "light" | "both";

const raw = process.env.NEXT_PUBLIC_THEME_MODE;

export const THEME_MODE: ThemeMode =
  raw === "dark" || raw === "light" ? raw : "both";
