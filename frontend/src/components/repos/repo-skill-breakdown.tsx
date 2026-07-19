import { SearchX } from "lucide-react";
import { SkillCard } from "@/components/skills/skill-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { SkillProfile } from "@/types/skill";

interface RepoSkillBreakdownProps {
  skills: SkillProfile[];
  repoName: string;
}

/**
 * Renders repo.skills — this repository's technologies scored in
 * isolation, as if it were the user's entire portfolio. NOT a slice of the
 * portfolio-level skills[] from PortfolioSkillReport; see RepositoryDetail's
 * docstring in src/types/repository.ts.
 */
export function RepoSkillBreakdown({ skills, repoName }: RepoSkillBreakdownProps) {
  if (skills.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No skills detected in this repository"
        description={`SkillForge didn't detect any technologies in ${repoName}.`}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((skill) => (
        <SkillCard key={skill.name} skill={skill} />
      ))}
    </div>
  );
}
