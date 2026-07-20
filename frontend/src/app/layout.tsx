import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// GeistSans/GeistMono ship their font files inside the `geist` npm package
// itself, so this works without reaching Google Fonts' CDN (which this
// build environment's network policy blocks) — unlike next/font/google,
// there's no runtime or build-time fetch involved.

export const metadata: Metadata = {
  title: "SkillForge",
  description:
    "Evidence-based GitHub portfolio analysis: detected skills, strengths, weaknesses, and recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is required with next-themes: it sets the
    // `dark`/`light` class on <html> before React hydrates, which would
    // otherwise cause a (harmless but noisy) hydration warning.
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <Providers>
          <div className="flex min-h-svh flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
