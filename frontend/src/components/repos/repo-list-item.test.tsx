import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { RepoListItem } from "@/components/repos/repo-list-item";
import { sampleAnalyzeResponse } from "@/lib/api/__fixtures__/sampleResponses";

const repo = sampleAnalyzeResponse.repositories[0];

describe("RepoListItem", () => {
  it("renders the repository name as a link to the detail page", () => {
    render(<RepoListItem repo={repo} username="octocat" />);
    const link = screen.getByRole("link", { name: repo.name });
    expect(link).toHaveAttribute("href", `/analyze/octocat/repos/${repo.name}`);
  });

  it("renders the language", () => {
    render(<RepoListItem repo={repo} username="octocat" />);
    expect(
      screen.getByText(repo.language as string, { selector: "p" }),
    ).toBeInTheDocument();
  });

  it("renders technology badges", () => {
    render(<RepoListItem repo={repo} username="octocat" />);
    for (const tech of repo.technologies) {
      // repo.language ("Python" in the fixture) can legitimately overlap
      // with a technology name, so assert presence rather than uniqueness.
      expect(screen.getAllByText(tech).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders stars, forks, and skill count", () => {
    render(<RepoListItem repo={repo} username="octocat" />);
    expect(screen.getByText(String(repo.metadata.maturity.stars))).toBeInTheDocument();
    expect(screen.getByText(String(repo.metadata.maturity.forks))).toBeInTheDocument();
    expect(screen.getByText(`${repo.skills.length} skill`)).toBeInTheDocument();
  });

  it("URL-encodes the username and repo name in the link", () => {
    render(<RepoListItem repo={{ ...repo, name: "weird name" }} username="my user" />);
    const link = screen.getByRole("link", { name: "weird name" });
    expect(link).toHaveAttribute(
      "href",
      "/analyze/my%20user/repos/weird%20name",
    );
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(<RepoListItem repo={repo} username="octocat" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
