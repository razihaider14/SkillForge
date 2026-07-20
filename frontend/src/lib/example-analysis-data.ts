import type { SkillProfile } from "@/types/skill";
import type { SkillRecommendation } from "@/types/recommendation";

/**
 * Static, hand-written sample data for the Landing page's "Example
 * Analysis" section — NOT fetched from the API, NOT tied to any real
 * GitHub account. Typed against the real SkillProfile/SkillRecommendation
 * interfaces (src/types/skill.ts, src/types/recommendation.ts) specifically
 * so this renders through the actual SkillCard and RecommendationCard
 * components, not a look-alike mockup — if either interface changes, this
 * file fails to compile rather than silently drifting out of sync.
 */
export const EXAMPLE_SKILLS: SkillProfile[] = [
  {
    name: "Python",
    category: "language",
    repository_count: 12,
    repositories: ["api-gateway", "data-pipeline", "cli-tools"],
    average_detector_confidence: 0.96,
    average_practice_score: 7,
    score: 46,
    max_score: 50,
    tier: "expert",
    evidence: [
      "detected in 12 repositories",
      "average practice score 7/10",
      "consistent use across API, CLI, and data tooling projects",
    ],
    is_composite: false,
  },
  {
    name: "React",
    category: "frontend",
    repository_count: 5,
    repositories: ["dashboard-ui", "marketing-site"],
    average_detector_confidence: 0.91,
    average_practice_score: 6,
    score: 34,
    max_score: 50,
    tier: "proficient",
    evidence: ["detected in 5 repositories", "TypeScript used throughout"],
    is_composite: false,
  },
  {
    name: "Docker",
    category: "container",
    repository_count: 2,
    repositories: ["api-gateway"],
    average_detector_confidence: 0.72,
    average_practice_score: 3,
    score: 14,
    max_score: 50,
    tier: "exposure",
    evidence: ["detected in 2 repositories", "no multi-stage builds found"],
    is_composite: false,
  },
];

export const EXAMPLE_RECOMMENDATION: SkillRecommendation = {
  skill: "FastAPI",
  category: "framework",
  reason:
    "Commonly paired with Python for building typed, high-performance API backends.",
  based_on: ["Python"],
  chain: [],
};
