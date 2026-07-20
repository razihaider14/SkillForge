import { Hero } from "@/components/landing/hero";
import { FeatureCards } from "@/components/landing/feature-cards";
import { ExampleAnalysisPreview } from "@/components/landing/example-analysis-preview";
import { CTASection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <FeatureCards />
      <ExampleAnalysisPreview />
      <CTASection />
    </main>
  );
}
