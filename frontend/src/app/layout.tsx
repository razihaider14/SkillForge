import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

// Deliberately not using next/font/google here yet: this environment's
// build sandbox can't reach Google Fonts' CDN, and more importantly, real
// typeface selection is a Phase 4 design decision (see the frontend-design
// guidance the Landing/About build follows), not a Phase 0 scaffold one.
// `font-sans`/`font-mono` below fall back to the system font stack until
// then.

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
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
