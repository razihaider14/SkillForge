import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/footer";

describe("Footer", () => {
  it("renders the current year in the copyright line", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it("renders Home, About, and Analyze links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: "Analyze" })).toHaveAttribute(
      "href",
      "/analyze",
    );
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(<Footer />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
