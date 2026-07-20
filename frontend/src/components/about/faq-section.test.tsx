import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FAQSection } from "@/components/about/faq-section";

describe("FAQSection", () => {
  it("renders every question, initially collapsed", () => {
    render(<FAQSection />);
    const detailsElements = document.querySelectorAll("details");
    expect(detailsElements.length).toBeGreaterThan(0);
    for (const details of detailsElements) {
      expect(details).not.toHaveAttribute("open");
    }
  });

  it("mentions Deep Scan in one of the answers", () => {
    render(<FAQSection />);
    expect(screen.getAllByText(/deep scan/i).length).toBeGreaterThanOrEqual(1);
  });

  it("expands an answer on click", async () => {
    const user = userEvent.setup();
    render(<FAQSection />);

    const summary = document.querySelector("summary") as HTMLElement;
    await user.click(summary);

    expect(summary.closest("details")).toHaveAttribute("open");
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(<FAQSection />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
