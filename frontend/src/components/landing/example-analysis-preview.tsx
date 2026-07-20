import { SkillCard } from "@/components/skills/skill-card";
import { RecommendationCard } from "@/components/skills/recommendation-card";
import {
  EXAMPLE_RECOMMENDATION,
  EXAMPLE_SKILLS,
} from "@/lib/example-analysis-data";

/**
 * Deliberately reuses the real SkillCard/RecommendationCard components
 * (not a simplified look-alike) with the hardcoded sample data from
 * src/lib/example-analysis-data.ts — this section is illustrative, not
 * live, but every card is exactly what a real dashboard would render.
 */
export function ExampleAnalysisPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          What an analysis looks like
        </h2>
        <p className="text-muted-foreground">
          Illustrative example — not a real GitHub account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMPLE_SKILLS.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
        <RecommendationCard recommendation={EXAMPLE_RECOMMENDATION} />
      </div>
    </section>
  );
}
