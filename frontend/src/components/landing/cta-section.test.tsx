import { describe, expect, it, vi } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/components/providers/navigation-progress", () => ({
  useNavigationProgress: () => ({ start: vi.fn() }),
}));

const { CTASection } = await import("@/components/landing/cta-section");

describe("CTASection", () => {
  it("renders a heading", () => {
    render(<CTASection />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });

  it("reuses the real UsernameForm", () => {
    render(<CTASection />);
    expect(screen.getByLabelText("GitHub username")).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(<CTASection />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
