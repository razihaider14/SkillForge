import { FolderX, SearchX } from "lucide-react";
import { RepoListItem } from "@/components/repos/repo-list-item";
import { EmptyState } from "@/components/shared/empty-state";
import type { RepositoryDetail } from "@/types/repository";

interface RepoListProps {
  repositories: RepositoryDetail[];
  username: string;
  /** True when the portfolio has repositories overall, but the current search/filter matched none. */
  isFiltered?: boolean;
  /** Preserved in each RepoListItem's link to the repo detail page — see src/lib/with-deep-scan.ts. */
  deepScan?: boolean;
}

export function RepoList({
  repositories,
  username,
  isFiltered = false,
  deepScan = false,
}: RepoListProps) {
  if (repositories.length === 0) {
    return (
      <EmptyState
        icon={isFiltered ? SearchX : FolderX}
        title={isFiltered ? "No repositories match" : "No public repositories"}
        description={
          isFiltered
            ? "Try a different search term or technology filter, or clear the filters to see everything."
            : "This GitHub account has no public repositories for SkillForge to analyze."
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {repositories.map((repo) => (
        <RepoListItem key={repo.name} repo={repo} username={username} deepScan={deepScan} />
      ))}
    </div>
  );
}
