import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { MobileNav } from "@/components/layout/mobile-nav";

function renderMobileNav() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <MobileNav />
    </ThemeProvider>,
  );
}

describe("MobileNav", () => {
  it("renders a closed menu button by default", () => {
    renderMobileNav();
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument();
  });

  it("opens the panel on click, revealing nav links", async () => {
    const user = userEvent.setup();
    renderMobileNav();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("closes the panel when the toggle is clicked again", async () => {
    const user = userEvent.setup();
    renderMobileNav();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("button", { name: "Close menu" }));

    expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument();
  });

  it("closes the panel when a nav link is clicked", async () => {
    const user = userEvent.setup();
    renderMobileNav();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("link", { name: "About" }));

    expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument();
  });

  it("includes the theme toggle and an Analyze link when open", async () => {
    const user = userEvent.setup();
    renderMobileNav();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("link", { name: "Analyze" })).toHaveAttribute(
      "href",
      "/analyze",
    );
  });

  describe("accessibility", () => {
    it("has no axe violations when closed", async () => {
      const { container } = renderMobileNav();
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no axe violations when open", async () => {
      const user = userEvent.setup();
      const { container } = renderMobileNav();
      await user.click(screen.getByRole("button", { name: "Open menu" }));
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
