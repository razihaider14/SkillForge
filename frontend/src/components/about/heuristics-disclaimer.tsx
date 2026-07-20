import { Info } from "lucide-react";

export function HeuristicsDisclaimer() {
  return (
    <section
      role="note"
      className="bg-muted/50 flex items-start gap-3 rounded-lg border px-5 py-4"
    >
      <Info aria-hidden="true" className="text-muted-foreground mt-0.5 size-5 shrink-0" />
      <p className="text-sm">
        SkillForge doesn&apos;t score developers. Every skill, strength,
        weakness, and recommendation here comes from heuristics — rule-based
        detection and scoring, not a machine-learning judgment of ability.
        Those heuristics are continuously improving, but they can still miss
        context a human reviewer would catch. Treat this as a starting point
        for a conversation, not a verdict.
      </p>
    </section>
  );
}
