import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { TechBadgeList } from "@/components/repos/tech-badge-list";

describe("TechBadgeList", () => {
  it("renders a badge per technology", () => {
    render(<TechBadgeList technologies={["Python", "FastAPI"]} />);
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("FastAPI")).toBeInTheDocument();
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<TechBadgeList technologies={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows every technology when under the limit", () => {
    render(<TechBadgeList technologies={["Python", "FastAPI"]} limit={5} />);
    expect(screen.queryByText(/more/)).not.toBeInTheDocument();
  });

  it("caps at the limit and shows a +N more badge", () => {
    render(
      <TechBadgeList technologies={["A", "B", "C", "D", "E"]} limit={3} />,
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.queryByText("D")).not.toBeInTheDocument();
    expect(screen.getByText("+2 more")).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(
        <TechBadgeList technologies={["Python", "FastAPI", "Docker"]} limit={2} />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
