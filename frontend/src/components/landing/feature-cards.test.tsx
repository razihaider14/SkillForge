import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { FeatureCards } from "@/components/landing/feature-cards";

describe("FeatureCards", () => {
  it("renders a section heading plus one heading per feature card", () => {
    render(<FeatureCards />);
    expect(screen.getAllByRole("heading")).toHaveLength(5);
  });

  it("includes technology detection, metadata analysis, skill scoring, and recommendations", () => {
    render(<FeatureCards />);
    expect(screen.getByText("Technology detection")).toBeInTheDocument();
    expect(screen.getByText("Metadata analysis")).toBeInTheDocument();
    expect(screen.getByText("Skill scoring")).toBeInTheDocument();
    expect(screen.getByText("Recommendations")).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(<FeatureCards />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
