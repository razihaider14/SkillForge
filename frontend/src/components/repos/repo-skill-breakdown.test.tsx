import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { RepoSkillBreakdown } from "@/components/repos/repo-skill-breakdown";
import { sampleSkill } from "@/lib/api/__fixtures__/sampleResponses";

describe("RepoSkillBreakdown", () => {
  it("renders one SkillCard per skill", () => {
    render(<RepoSkillBreakdown skills={[sampleSkill]} repoName="api" />);
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("shows a repository-specific empty-state message, not the portfolio-wide one", () => {
    render(<RepoSkillBreakdown skills={[]} repoName="my-repo" />);
    expect(
      screen.getByText("No skills detected in this repository"),
    ).toBeInTheDocument();
    expect(screen.getByText(/my-repo/)).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no axe violations with skills", async () => {
      const { container } = render(
        <RepoSkillBreakdown skills={[sampleSkill]} repoName="api" />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no axe violations when empty", async () => {
      const { container } = render(<RepoSkillBreakdown skills={[]} repoName="api" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
