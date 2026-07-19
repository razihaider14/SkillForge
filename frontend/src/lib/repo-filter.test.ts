import { describe, expect, it } from "vitest";
import {
  collectTechnologies,
  filterRepositories,
  sortRepositories,
} from "@/lib/repo-filter";
import type { RepositoryDetail } from "@/types/repository";
import { sampleAnalyzeResponse } from "@/lib/api/__fixtures__/sampleResponses";

function makeRepo(overrides: {
  name: string;
  technologies: string[];
  stars: number;
}): RepositoryDetail {
  const base = sampleAnalyzeResponse.repositories[0];
  return {
    ...base,
    name: overrides.name,
    technologies: overrides.technologies,
    metadata: {
      ...base.metadata,
      maturity: { ...base.metadata.maturity, stars: overrides.stars },
    },
  };
}

const repoA = makeRepo({ name: "alpha-api", technologies: ["Python", "FastAPI"], stars: 10 });
const repoB = makeRepo({ name: "Bravo-CLI", technologies: ["Rust"], stars: 50 });
const repoC = makeRepo({ name: "charlie-lib", technologies: ["Python", "Rust"], stars: 5 });

describe("collectTechnologies", () => {
  it("returns every distinct technology across all repositories, sorted", () => {
    expect(collectTechnologies([repoA, repoB, repoC])).toEqual([
      "FastAPI",
      "Python",
      "Rust",
    ]);
  });

  it("returns an empty array for no repositories", () => {
    expect(collectTechnologies([])).toEqual([]);
  });

  it("deduplicates a technology shared by multiple repositories", () => {
    expect(collectTechnologies([repoA, repoC])).toEqual(["FastAPI", "Python", "Rust"]);
  });
});

describe("filterRepositories", () => {
  const repos = [repoA, repoB, repoC];

  it("returns everything when search is empty and technology is null", () => {
    expect(filterRepositories(repos, { search: "", technology: null })).toHaveLength(3);
  });

  it("matches repository names case-insensitively", () => {
    const result = filterRepositories(repos, { search: "bravo", technology: null });
    expect(result.map((r) => r.name)).toEqual(["Bravo-CLI"]);
  });

  it("matches a substring, not just a prefix", () => {
    const result = filterRepositories(repos, { search: "cli", technology: null });
    expect(result.map((r) => r.name)).toEqual(["Bravo-CLI"]);
  });

  it("trims whitespace from the search query", () => {
    const result = filterRepositories(repos, { search: "  alpha  ", technology: null });
    expect(result.map((r) => r.name)).toEqual(["alpha-api"]);
  });

  it("filters by exact technology match", () => {
    const result = filterRepositories(repos, { search: "", technology: "Rust" });
    expect(result.map((r) => r.name).sort()).toEqual(["Bravo-CLI", "charlie-lib"]);
  });

  it("combines search and technology filters (AND, not OR)", () => {
    const result = filterRepositories(repos, { search: "charlie", technology: "Rust" });
    expect(result.map((r) => r.name)).toEqual(["charlie-lib"]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterRepositories(repos, { search: "nonexistent", technology: null })).toEqual([]);
  });
});

describe("sortRepositories", () => {
  const repos = [repoA, repoB, repoC];

  it("sorts by stars descending", () => {
    const result = sortRepositories(repos, "stars");
    expect(result.map((r) => r.name)).toEqual(["Bravo-CLI", "alpha-api", "charlie-lib"]);
  });

  it("sorts alphabetically, case-insensitively", () => {
    const result = sortRepositories(repos, "name");
    expect(result.map((r) => r.name)).toEqual(["alpha-api", "Bravo-CLI", "charlie-lib"]);
  });

  it("does not mutate the input array", () => {
    const original = [repoB, repoA, repoC];
    const originalOrder = original.map((r) => r.name);
    sortRepositories(original, "name");
    expect(original.map((r) => r.name)).toEqual(originalOrder);
  });
});
