import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggle } from "@/components/layout/theme-toggle";

function renderToggle(defaultTheme = "light") {
  return render(
    <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem={false}>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  it("renders a button once mounted", async () => {
    renderToggle("light");
    expect(await screen.findByRole("button")).toBeInTheDocument();
  });

  it("shows a 'switch to dark' label when the current theme is light", async () => {
    renderToggle("light");
    expect(
      await screen.findByRole("button", { name: "Switch to dark theme" }),
    ).toBeInTheDocument();
  });

  it("shows a 'switch to light' label when the current theme is dark", async () => {
    renderToggle("dark");
    expect(
      await screen.findByRole("button", { name: "Switch to light theme" }),
    ).toBeInTheDocument();
  });

  it("toggles the theme on click", async () => {
    const user = userEvent.setup();
    renderToggle("light");

    const button = await screen.findByRole("button", { name: "Switch to dark theme" });
    await user.click(button);

    expect(
      await screen.findByRole("button", { name: "Switch to light theme" }),
    ).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderToggle("light");
      await screen.findByRole("button");
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
