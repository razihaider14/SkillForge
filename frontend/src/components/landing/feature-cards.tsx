import { Compass, FileSearch2, Gauge, ScanSearch } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: ScanSearch,
    title: "Technology detection",
    description:
      "Scans repository trees, manifests, and file extensions to identify languages, frameworks, and tools actually in use.",
  },
  {
    icon: FileSearch2,
    title: "Metadata analysis",
    description:
      "Looks at documentation quality, test coverage, CI/CD setup, licensing, and repository maturity — the engineering practices around the code.",
  },
  {
    icon: Gauge,
    title: "Skill scoring",
    description:
      "Aggregates evidence across every repository into a tiered skill profile — expert, proficient, developing, or exposure — not a single opaque number.",
  },
  {
    icon: Compass,
    title: "Recommendations",
    description:
      "Surfaces complementary skills worth learning next, based on gaps and patterns in the technologies already detected.",
  },
];

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">
        What Portlio looks at
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="gap-3 py-6">
            <CardHeader className="px-6">
              <feature.icon aria-hidden="true" className="text-primary size-6" />
              <h3 className="mt-2 text-base leading-none font-semibold">
                {feature.title}
              </h3>
            </CardHeader>
            <CardContent className="px-6">
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
