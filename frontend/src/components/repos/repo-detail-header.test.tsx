import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { RepoDetailHeader } from "@/components/repos/repo-detail-header";

describe("RepoDetailHeader", () => {
  it("renders the repository name", () => {
    render(
      <RepoDetailHeader
        repoName="api"
        username="octocat"
        language="Python"
        stars={12}
        forks={2}
      />,
    );
    expect(screen.getByRole("heading", { name: "api" })).toBeInTheDocument();
  });

  it("renders the language", () => {
    render(
      <RepoDetailHeader
        repoName="api"
        username="octocat"
        language="Python"
        stars={12}
        forks={2}
      />,
    );
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("builds the GitHub link deterministically from username/repoName, without needing any data prop", () => {
    render(
      <RepoDetailHeader
        repoName="api"
        username="octocat"
        language="Python"
        stars={12}
        forks={2}
      />,
    );
    expect(screen.getByRole("link", { name: /view on github/i })).toHaveAttribute(
      "href",
      "https://github.com/octocat/api",
    );
  });

  it("opens the GitHub link in a new tab safely", () => {
    render(
      <RepoDetailHeader repoName="api" username="octocat" language="Python" stars={0} forks={0} />,
    );
    const link = screen.getByRole("link", { name: /view on github/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("renders stars and forks counts", () => {
    render(
      <RepoDetailHeader repoName="api" username="octocat" language="Python" stars={12} forks={2} />,
    );
    expect(screen.getByText("12 stars")).toBeInTheDocument();
    expect(screen.getByText("2 forks")).toBeInTheDocument();
  });

  it("uses singular 'star'/'fork' for a count of 1", () => {
    render(
      <RepoDetailHeader repoName="api" username="octocat" language="Python" stars={1} forks={1} />,
    );
    expect(screen.getByText("1 star")).toBeInTheDocument();
    expect(screen.getByText("1 fork")).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(
      <RepoDetailHeader
        repoName="api"
        username="octocat"
        language="Python"
        stars={0}
        forks={0}
        description="A sample API."
      />,
    );
    expect(screen.getByText("A sample API.")).toBeInTheDocument();
  });

  it("renders a loading skeleton in place of the description when isDescriptionLoading", () => {
    const { container } = render(
      <RepoDetailHeader
        repoName="api"
        username="octocat"
        language="Python"
        stars={0}
        forks={0}
        isDescriptionLoading
      />,
    );
    expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
  });

  it("renders no skeleton when description is simply absent (not loading)", () => {
    const { container } = render(
      <RepoDetailHeader repoName="api" username="octocat" language="Python" stars={0} forks={0} />,
    );
    expect(container.querySelector('[data-slot="skeleton"]')).not.toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(
        <RepoDetailHeader
          repoName="api"
          username="octocat"
          language="Python"
          stars={12}
          forks={2}
          description="A sample API."
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
