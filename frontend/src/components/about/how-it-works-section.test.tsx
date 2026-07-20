import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { HowItWorksSection } from "@/components/about/how-it-works-section";

describe("HowItWorksSection", () => {
  it("renders the three pipeline steps: detector, metadata analyzer, aggregator", () => {
    render(<HowItWorksSection />);
    expect(screen.getByText(/technology detector/i)).toBeInTheDocument();
    expect(screen.getByText(/metadata analyzer/i)).toBeInTheDocument();
    expect(screen.getByText(/aggregator/i)).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(<HowItWorksSection />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
