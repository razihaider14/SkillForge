import { FileSearch2, Layers, ScanSearch } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    icon: ScanSearch,
    title: "1. Technology detector",
    description:
      "Reads each repository's file tree and manifests to identify languages, frameworks, and tools — with a confidence score per detection, not a binary yes/no.",
  },
  {
    icon: FileSearch2,
    title: "2. Metadata analyzer",
    description:
      "Separately examines each repository's engineering practices: documentation quality, tests, CI/CD, licensing, and overall maturity.",
  },
  {
    icon: Layers,
    title: "3. Aggregator",
    description:
      "Combines detector and metadata signal across every repository into portfolio-level skills, strengths, weaknesses, and recommendations.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STEPS.map((step) => (
          <Card key={step.title} className="gap-3 py-6">
            <CardHeader className="px-6">
              <step.icon aria-hidden="true" className="text-primary size-6" />
              <h3 className="mt-2 text-base leading-none font-semibold">
                {step.title}
              </h3>
            </CardHeader>
            <CardContent className="px-6">
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
