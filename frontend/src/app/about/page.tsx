import type { Metadata } from "next";
import { HowItWorksSection } from "@/components/about/how-it-works-section";
import { HeuristicsDisclaimer } from "@/components/about/heuristics-disclaimer";
import { FAQSection } from "@/components/about/faq-section";

export const metadata: Metadata = {
  title: "About | Portlio",
  description:
    "How Portlio analyzes a GitHub portfolio: technology detection, metadata analysis, and aggregation into skills, strengths, weaknesses, and recommendations.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          About Portlio
        </h1>
        <p className="text-muted-foreground">
          Portlio doesn&apos;t score developers. It identifies what a
          public portfolio demonstrates and provides evidence-based
          recommendations.
        </p>
      </div>

      <HowItWorksSection />
      <HeuristicsDisclaimer />
      <FAQSection />
    </main>
  );
}
