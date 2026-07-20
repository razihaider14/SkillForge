import { describe, expect, it, vi } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/components/providers/navigation-progress", () => ({
  useNavigationProgress: () => ({ start: vi.fn() }),
}));

const { Hero } = await import("@/components/landing/hero");

describe("Hero", () => {
  it("renders a headline", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("reuses the real UsernameForm (has the GitHub username input and Analyze button)", () => {
    render(<Hero />);
    expect(screen.getByLabelText("GitHub username")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Analyze" })).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(<Hero />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
