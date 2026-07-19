import localFont from "next/font/local";

export const anton = localFont({
  src: "../fonts/anton.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-anton",
  display: "swap",
});

export const archivo = localFont({
  src: "../fonts/archivo.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-archivo",
  display: "swap",
});
