import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { server } from "@/test/msw/server";
import { backendErrorResponse } from "@/test/msw/handlers";
import { shouldRetryQuery } from "@/lib/query/queryClient";
import { sampleAnalyzeResponse } from "@/lib/api/__fixtures__/sampleResponses";
import type { AnalyzeResponse } from "@/types/repository";

const notFoundMock = vi.fn();
vi.mock("next/navigation", () => ({
  notFound: () => notFoundMock(),
}));

const { RepositoryExplorer } = await import(
  "@/components/analyze/repository-explorer"
);

const API_BASE = "http://localhost:8000";

function renderExplorer(username = "octocat") {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: shouldRetryQuery, retryDelay: 0, gcTime: 0 },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      <RepositoryExplorer username={username} />
    </QueryClientProvider>,
  );
}

/** A richer fixture than sampleAnalyzeResponse's single repo, for exercising filter/sort. */
function multiRepoResponse(): AnalyzeResponse {
  const base = sampleAnalyzeResponse.repositories[0];
  return {
    ...sampleAnalyzeResponse,
    repository_count: 3,
    repositories: [
      {
        ...base,
        name: "alpha-api",
        technologies: ["Python", "FastAPI"],
        metadata: { ...base.metadata, maturity: { ...base.metadata.maturity, stars: 10 } },
      },
      {
        ...base,
        name: "Bravo-CLI",
        technologies: ["Rust"],
        metadata: { ...base.metadata, maturity: { ...base.metadata.maturity, stars: 50 } },
      },
      {
        ...base,
        name: "charlie-lib",
        technologies: ["Python", "Rust"],
        metadata: { ...base.metadata, maturity: { ...base.metadata.maturity, stars: 5 } },
      },
    ],
  };
}

beforeEach(() => {
  notFoundMock.mockReset();
});

afterEach(() => {
  server.resetHandlers();
});

describe("RepositoryExplorer integration (real fetch through MSW)", () => {
  it("shows a loading state, then the repository list on success", async () => {
    server.use(
      http.get(`${API_BASE}/analyze/:username`, () =>
        HttpResponse.json(multiRepoResponse()),
      ),
    );

    renderExplorer("octocat");

    expect(screen.getByText(/loading repositories/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByRole("link", { name: "alpha-api" })).toBeInTheDocument(),
    );
    expect(screen.getByRole("link", { name: "Bravo-CLI" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "charlie-lib" })).toBeInTheDocument();
  });

  it("defaults to sorting by stars descending", async () => {
    server.use(
      http.get(`${API_BASE}/analyze/:username`, () =>
        HttpResponse.json(multiRepoResponse()),
      ),
    );

    renderExplorer("octocat");
    await waitFor(() => expect(screen.getByRole("link", { name: "Bravo-CLI" })).toBeInTheDocument());

    const links = screen.getAllByRole("link").filter((el) =>
      ["alpha-api", "Bravo-CLI", "charlie-lib"].includes(el.textContent ?? ""),
    );
    expect(links.map((el) => el.textContent)).toEqual([
      "Bravo-CLI",
      "alpha-api",
      "charlie-lib",
    ]);
  });

  it("re-sorts alphabetically when 'Name (A–Z)' is clicked", async () => {
    server.use(
      http.get(`${API_BASE}/analyze/:username`, () =>
        HttpResponse.json(multiRepoResponse()),
      ),
    );
    const user = userEvent.setup();
    renderExplorer("octocat");
    await waitFor(() => expect(screen.getByRole("link", { name: "Bravo-CLI" })).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Name (A–Z)" }));

    const links = screen.getAllByRole("link").filter((el) =>
      ["alpha-api", "Bravo-CLI", "charlie-lib"].includes(el.textContent ?? ""),
    );
    expect(links.map((el) => el.textContent)).toEqual([
      "alpha-api",
      "Bravo-CLI",
      "charlie-lib",
    ]);
  });

  it("filters by search term", async () => {
    server.use(
      http.get(`${API_BASE}/analyze/:username`, () =>
        HttpResponse.json(multiRepoResponse()),
      ),
    );
    const user = userEvent.setup();
    renderExplorer("octocat");
    await waitFor(() => expect(screen.getByRole("link", { name: "Bravo-CLI" })).toBeInTheDocument());

    await user.type(screen.getByLabelText("Search repositories by name"), "charlie");

    expect(screen.getByRole("link", { name: "charlie-lib" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "alpha-api" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Bravo-CLI" })).not.toBeInTheDocument();
  });

  it("filters by technology", async () => {
    server.use(
      http.get(`${API_BASE}/analyze/:username`, () =>
        HttpResponse.json(multiRepoResponse()),
      ),
    );
    const user = userEvent.setup();
    renderExplorer("octocat");
    await waitFor(() => expect(screen.getByRole("link", { name: "Bravo-CLI" })).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "FastAPI" }));

    expect(screen.getByRole("link", { name: "alpha-api" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Bravo-CLI" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "charlie-lib" })).not.toBeInTheDocument();
  });

  it("shows the filtered empty state when search matches nothing", async () => {
    server.use(
      http.get(`${API_BASE}/analyze/:username`, () =>
        HttpResponse.json(multiRepoResponse()),
      ),
    );
    const user = userEvent.setup();
    renderExplorer("octocat");
    await waitFor(() => expect(screen.getByRole("link", { name: "Bravo-CLI" })).toBeInTheDocument());

    await user.type(
      screen.getByLabelText("Search repositories by name"),
      "nonexistent-repo",
    );

    expect(screen.getByText("No repositories match")).toBeInTheDocument();
  });

  it("calls next/navigation's notFound() on a 404 response", async () => {
    server.use(
      http.get(`${API_BASE}/analyze/:username`, () =>
        backendErrorResponse(404, "GitHub user not found."),
      ),
    );

    renderExplorer("nonexistent-user");

    await waitFor(() => expect(notFoundMock).toHaveBeenCalledTimes(1));
  });

  it("shows rate-limit messaging inline on a 429 response", async () => {
    server.use(
      http.get(`${API_BASE}/analyze/:username`, () =>
        backendErrorResponse(429, "GitHub API rate limit exceeded."),
      ),
    );

    renderExplorer("octocat");

    await waitFor(() =>
      expect(screen.getByText("GitHub rate limit exceeded")).toBeInTheDocument(),
    );
    expect(notFoundMock).not.toHaveBeenCalled();
  });

  it("shows backend-unavailable messaging inline on a 503 response", async () => {
    server.use(
      http.get(`${API_BASE}/analyze/:username`, () =>
        backendErrorResponse(503, "GitHub service is temporarily unavailable."),
      ),
    );

    renderExplorer("octocat");

    await waitFor(
      () => expect(screen.getByText("Backend unavailable")).toBeInTheDocument(),
      { timeout: 5000 },
    );
  });
});
