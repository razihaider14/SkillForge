import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";

function renderHeader() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <Header />
    </ThemeProvider>,
  );
}

describe("Header", () => {
  it("renders the wordmark linking home", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: "SkillForge" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("renders Home and About nav links", () => {
    renderHeader();
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav).toBeInTheDocument();
  });

  it("renders an Analyze call-to-action linking to /analyze", () => {
    renderHeader();
    const analyzeLinks = screen.getAllByRole("link", { name: "Analyze" });
    expect(analyzeLinks.length).toBeGreaterThanOrEqual(1);
    expect(analyzeLinks[0]).toHaveAttribute("href", "/analyze");
  });

  it("renders the theme toggle", async () => {
    renderHeader();
    expect(await screen.findByRole("button", { name: /switch to/i })).toBeInTheDocument();
  });

  it("renders the mobile nav toggle", () => {
    renderHeader();
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderHeader();
      await screen.findByRole("button", { name: /switch to/i });
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
