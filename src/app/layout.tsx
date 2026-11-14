import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Caveat, Mrs_Saint_Delafield } from "next/font/google";
import { PROFILE } from "@/lib/data";
import "./globals.css";

const interTight = localFont({
  src: "../fonts/InterTight-Variable.woff2",
  variable: "--font-inter-tight",
  weight: "100 900",
  display: "swap",
});

const instrument = localFont({
  src: [
    { path: "../fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = localFont({
  src: "../fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
  preload: false,
});

/** Handwritten signature on the back of the hero ticket (self-hosted by next/font at build time). */
const signature = Mrs_Saint_Delafield({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
  preload: false,
});

/** Handwritten notes beside the project mockups. */
const hand = Caveat({
  weight: ["500"],
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
  preload: false,
});

const title = `${PROFILE.name} — ${PROFILE.role}`;
const description = `${PROFILE.resumeSummary}.`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title,
  description,
  authors: [{ name: PROFILE.name }],
  openGraph: {
    type: "website",
    title,
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${PROFILE.name}, ${PROFILE.role}` }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#f4f2ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${instrument.variable} ${jetbrains.variable} ${signature.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
