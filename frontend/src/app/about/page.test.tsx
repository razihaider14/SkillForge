import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage from "@/app/about/page";

describe("AboutPage", () => {
  it("renders the page heading", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "About SkillForge" }),
    ).toBeInTheDocument();
  });

  it("renders the How It Works section", () => {
    render(<AboutPage />);
    expect(screen.getByText("How it works")).toBeInTheDocument();
  });

  it("renders the heuristics disclaimer", () => {
    render(<AboutPage />);
    expect(screen.getByText(/continuously improving/i)).toBeInTheDocument();
  });

  it("renders the FAQ section", () => {
    render(<AboutPage />);
    expect(screen.getByText("Frequently asked questions")).toBeInTheDocument();
  });
});
