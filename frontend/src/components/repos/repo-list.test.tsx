import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RepoList } from "@/components/repos/repo-list";
import { sampleAnalyzeResponse } from "@/lib/api/__fixtures__/sampleResponses";

const repo = sampleAnalyzeResponse.repositories[0];

describe("RepoList", () => {
  it("renders one RepoListItem per repository", () => {
    render(<RepoList repositories={[repo]} username="octocat" />);
    expect(screen.getByRole("link", { name: repo.name })).toBeInTheDocument();
  });

  it("shows an unfiltered empty-state when there are no repositories at all", () => {
    render(<RepoList repositories={[]} username="octocat" />);
    expect(screen.getByText("No public repositories")).toBeInTheDocument();
  });

  it("shows a filtered empty-state when isFiltered is true", () => {
    render(<RepoList repositories={[]} username="octocat" isFiltered />);
    expect(screen.getByText("No repositories match")).toBeInTheDocument();
  });
});
