// src/app/layout.tsx
// Root layout – reads Settings from DB and applies theme, color, font, SEO.

import type { Metadata } from "next";
import { Inter, DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";

// Load all supported fonts (Next.js needs static imports)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body-dm",
  display: "swap",
});
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body-pj",
  display: "swap",
});

// Map font name → CSS variable
const FONT_VAR: Record<string, string> = {
  Inter: inter.variable,
  "DM Sans": dmSans.variable,
  "Plus Jakarta Sans": plusJakarta.variable,
};

// generateMetadata reads DB settings so title/description are always current
export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.settings.findFirst().catch(() => null);

  const title = settings?.seoTitle || "Portfolio";
  const description =
    settings?.seoDescription || "Full-stack developer portfolio.";

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    ),
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: title,
      description,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch settings — fall back to defaults if DB not ready
  const settings = await prisma.settings.findFirst().catch(() => null);

  const theme = settings?.theme || "dark";
  const primaryColor = settings?.primaryColor || "#6366f1";
  const font = settings?.font || "Inter";

  // Pick the right font variable class
  const fontVarClass = FONT_VAR[font] ?? inter.variable;

  // Build CSS custom properties injected into :root
  // --color-accent drives all accent/indigo utilities via Tailwind
  const cssVars = `
    --color-accent: ${primaryColor};
    --color-accent-hover: ${lighten(primaryColor, 15)};
  `.trim();

  return (
    <html
      lang="en"
      // Apply dark/light class from settings
      className={theme === "light" ? "light" : "dark"}
      suppressHydrationWarning
    >
      <head>
        {/* Inject dynamic CSS variables so Tailwind accent utilities pick them up */}
        <style>{`:root { ${cssVars} }`}</style>
      </head>
      <body className={`${fontVarClass} font-body`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

// Lighten a hex color by `amount` (0-255) for hover state
function lighten(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
