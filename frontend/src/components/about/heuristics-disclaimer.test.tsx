import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { HeuristicsDisclaimer } from "@/components/about/heuristics-disclaimer";

describe("HeuristicsDisclaimer", () => {
  it("states that results are heuristic-based", () => {
    render(<HeuristicsDisclaimer />);
    expect(screen.getByText(/heuristics/i)).toBeInTheDocument();
  });

  it("states that the heuristics are continuously improving", () => {
    render(<HeuristicsDisclaimer />);
    expect(screen.getByText(/continuously improving/i)).toBeInTheDocument();
  });

  it("states Portlio does not score developers", () => {
    render(<HeuristicsDisclaimer />);
    expect(screen.getByText(/doesn't score developers/i)).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(<HeuristicsDisclaimer />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
