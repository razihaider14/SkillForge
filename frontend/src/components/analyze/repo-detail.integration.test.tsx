import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { http } from "msw";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { server } from "@/test/msw/server";
import { backendErrorResponse } from "@/test/msw/handlers";
import { shouldRetryQuery } from "@/lib/query/queryClient";
import {
  sampleAnalyzeResponse,
  sampleGithubReposResponse,
} from "@/lib/api/__fixtures__/sampleResponses";

const notFoundMock = vi.fn();
vi.mock("next/navigation", () => ({
  notFound: () => notFoundMock(),
}));

const { RepoDetail } = await import("@/components/analyze/repo-detail");

const API_BASE = "http://localhost:8000";
const REPO_NAME = sampleAnalyzeResponse.repositories[0].name; // "api"

function renderDetail(username = "octocat", repoName = REPO_NAME) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: shouldRetryQuery, retryDelay: 0, gcTime: 0 },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      <RepoDetail username={username} repoName={repoName} />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  notFoundMock.mockReset();
});

afterEach(() => {
  server.resetHandlers();
});

describe("RepoDetail integration (real fetch through MSW)", () => {
  it("renders name, GitHub link, technologies, metadata, and skills on success", async () => {
    renderDetail("octocat", REPO_NAME);

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: REPO_NAME })).toBeInTheDocument(),
    );

    expect(screen.getByRole("link", { name: /view on github/i })).toHaveAttribute(
      "href",
      `https://github.com/octocat/${REPO_NAME}`,
    );
    expect(screen.getByText("Technologies")).toBeInTheDocument();
    expect(screen.getByText("Metadata")).toBeInTheDocument();
    expect(screen.getByText("Skills in this repository")).toBeInTheDocument();
    // The repo-scoped skill (sampleSkill, "Python") should render via
    // SkillCard — "Python" also legitimately appears as the language and
    // as a tech badge, so assert presence rather than uniqueness.
    expect(screen.getAllByText("Python").length).toBeGreaterThanOrEqual(1);
  });

  it("layers in the description from useRepos() once it loads, alongside useAnalysis() data", async () => {
    renderDetail("octocat", REPO_NAME);

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: REPO_NAME })).toBeInTheDocument(),
    );

    const expectedDescription = sampleGithubReposResponse.repositories[0].description;
    await waitFor(() =>
      expect(screen.getByText(expectedDescription as string)).toBeInTheDocument(),
    );
  });

  it("still renders the full page correctly even if useRepos() fails (description is best-effort only)", async () => {
    server.use(
      http.get(`${API_BASE}/github/:username`, () =>
        backendErrorResponse(503, "GitHub service is temporarily unavailable."),
      ),
    );

    renderDetail("octocat", REPO_NAME);

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: REPO_NAME })).toBeInTheDocument(),
    );
    // No error state should leak through for the secondary fetch failing.
    expect(screen.queryByText("Backend unavailable")).not.toBeInTheDocument();
    expect(screen.getByText("Skills in this repository")).toBeInTheDocument();
  });

  it("shows an inline 'repository not found' state for a repo name not in the portfolio, without calling notFound()", async () => {
    renderDetail("octocat", "this-repo-does-not-exist");

    await waitFor(() =>
      expect(screen.getByText("Repository not found")).toBeInTheDocument(),
    );
    expect(
      screen.getByText(/doesn't include a repository named/i),
    ).toBeInTheDocument();
    expect(notFoundMock).not.toHaveBeenCalled();
  });

  it("calls next/navigation's notFound() when the GitHub user itself is a 404", async () => {
    server.use(
      http.get(`${API_BASE}/analyze/:username`, () =>
        backendErrorResponse(404, "GitHub user not found."),
      ),
    );

    renderDetail("nonexistent-user", REPO_NAME);

    await waitFor(() => expect(notFoundMock).toHaveBeenCalledTimes(1));
  });

  it("shows rate-limit messaging inline on a 429 response from useAnalysis", async () => {
    server.use(
      http.get(`${API_BASE}/analyze/:username`, () =>
        backendErrorResponse(429, "GitHub API rate limit exceeded."),
      ),
    );

    renderDetail("octocat", REPO_NAME);

    await waitFor(() =>
      expect(screen.getByText("GitHub rate limit exceeded")).toBeInTheDocument(),
    );
  });
});
