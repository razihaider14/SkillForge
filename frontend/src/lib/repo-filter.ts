import type { RepositoryDetail } from "@/types/repository";

export type RepoSortBy = "stars" | "name";

export interface RepoFilterState {
  search: string;
  technology: string | null;
}

/**
 * Every distinct technology across all repositories, sorted alphabetically
 * (case-insensitive) — the option list for RepoFilters' technology filter.
 * Deduplicated with a case-sensitive Set: the backend's detector emits
 * consistent, canonical technology names (e.g. always "Python", never a
 * mix of "python"/"Python"), so this doesn't attempt its own normalization
 * on top of that.
 */
export function collectTechnologies(repositories: RepositoryDetail[]): string[] {
  const technologies = new Set<string>();
  for (const repo of repositories) {
    for (const tech of repo.technologies) {
      technologies.add(tech);
    }
  }
  return Array.from(technologies).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

/**
 * Case-insensitive substring match on repository name, plus an optional
 * exact technology filter. Empty search matches everything.
 */
export function filterRepositories(
  repositories: RepositoryDetail[],
  { search, technology }: RepoFilterState,
): RepositoryDetail[] {
  const query = search.trim().toLowerCase();

  return repositories.filter((repo) => {
    const matchesSearch = query === "" || repo.name.toLowerCase().includes(query);
    const matchesTechnology =
      technology === null || repo.technologies.includes(technology);
    return matchesSearch && matchesTechnology;
  });
}

/**
 * Returns a new, sorted array — never mutates the input, since callers
 * (RepositoryExplorer) hold the original list in state/query-cache data
 * that shouldn't be mutated in place.
 *
 * "stars": descending, from metadata.maturity.stars (the only place stars
 * live on a RepositoryDetail — see src/types/repository.ts's docstring on
 * why this type has no top-level stars/forks field).
 * "name": ascending, locale-aware, case-insensitive.
 */
export function sortRepositories(
  repositories: RepositoryDetail[],
  sortBy: RepoSortBy,
): RepositoryDetail[] {
  const copy = [...repositories];

  if (sortBy === "stars") {
    return copy.sort(
      (a, b) => b.metadata.maturity.stars - a.metadata.maturity.stars,
    );
  }

  return copy.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}
