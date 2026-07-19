import { describe, expect, it, vi } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RepoFilters } from "@/components/repos/repo-filters";

function renderFilters(overrides: Partial<React.ComponentProps<typeof RepoFilters>> = {}) {
  const props: React.ComponentProps<typeof RepoFilters> = {
    search: "",
    onSearchChange: vi.fn(),
    sortBy: "stars",
    onSortByChange: vi.fn(),
    technologies: ["Python", "Rust"],
    selectedTechnology: null,
    onTechnologyChange: vi.fn(),
    ...overrides,
  };
  render(<RepoFilters {...props} />);
  return props;
}

describe("RepoFilters", () => {
  it("renders the search input with the current value", () => {
    renderFilters({ search: "api" });
    expect(screen.getByLabelText("Search repositories by name")).toHaveValue("api");
  });

  it("calls onSearchChange as the user types", async () => {
    const user = userEvent.setup();
    const props = renderFilters();

    await user.type(screen.getByLabelText("Search repositories by name"), "x");
    expect(props.onSearchChange).toHaveBeenCalledWith("x");
  });

  it("marks the active sort button as pressed", () => {
    renderFilters({ sortBy: "name" });
    expect(screen.getByRole("button", { name: "Name (A–Z)" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Most stars" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onSortByChange when a sort button is clicked", async () => {
    const user = userEvent.setup();
    const props = renderFilters({ sortBy: "stars" });

    await user.click(screen.getByRole("button", { name: "Name (A–Z)" }));
    expect(props.onSortByChange).toHaveBeenCalledWith("name");
  });

  it("renders a button per offered technology, plus 'All technologies'", () => {
    renderFilters();
    expect(screen.getByRole("button", { name: "All technologies" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Python" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rust" })).toBeInTheDocument();
  });

  it("renders no technology filter row when there are no technologies", () => {
    renderFilters({ technologies: [] });
    expect(screen.queryByRole("button", { name: "All technologies" })).not.toBeInTheDocument();
  });

  it("calls onTechnologyChange with the technology when clicked", async () => {
    const user = userEvent.setup();
    const props = renderFilters();

    await user.click(screen.getByRole("button", { name: "Python" }));
    expect(props.onTechnologyChange).toHaveBeenCalledWith("Python");
  });

  it("toggles a selected technology off when clicked again", async () => {
    const user = userEvent.setup();
    const props = renderFilters({ selectedTechnology: "Python" });

    await user.click(screen.getByRole("button", { name: "Python" }));
    expect(props.onTechnologyChange).toHaveBeenCalledWith(null);
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(
        <RepoFilters
          search=""
          onSearchChange={vi.fn()}
          sortBy="stars"
          onSortByChange={vi.fn()}
          technologies={["Python", "Rust"]}
          selectedTechnology={null}
          onTechnologyChange={vi.fn()}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
