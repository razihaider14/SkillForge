import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { ExampleAnalysisPreview } from "@/components/landing/example-analysis-preview";
import {
  EXAMPLE_RECOMMENDATION,
  EXAMPLE_SKILLS,
} from "@/lib/example-analysis-data";

describe("ExampleAnalysisPreview", () => {
  it("renders every example skill via the real SkillCard (tier badge present)", () => {
    render(<ExampleAnalysisPreview />);
    for (const skill of EXAMPLE_SKILLS) {
      expect(screen.getAllByText(skill.name).length).toBeGreaterThanOrEqual(1);
    }
    // Proof this is the real SkillCard, not a look-alike: it renders a
    // confidence progress bar, which a static mockup wouldn't need to.
    expect(screen.getAllByRole("progressbar").length).toBe(EXAMPLE_SKILLS.length);
  });

  it("renders the example recommendation via the real RecommendationCard", () => {
    render(<ExampleAnalysisPreview />);
    expect(screen.getAllByText(EXAMPLE_RECOMMENDATION.skill).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(EXAMPLE_RECOMMENDATION.reason)).toBeInTheDocument();
  });

  it("labels the section as illustrative, not a real account", () => {
    render(<ExampleAnalysisPreview />);
    expect(screen.getByText(/not a real github account/i)).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(<ExampleAnalysisPreview />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
