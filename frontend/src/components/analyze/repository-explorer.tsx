"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AnalyzeErrorState } from "@/components/analyze/analyze-error-state";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { RepoFilters } from "@/components/repos/repo-filters";
import { RepoList } from "@/components/repos/repo-list";
import { useDeepScan } from "@/hooks/use-deep-scan";
import { ApiError } from "@/lib/api/errors";
import {
  collectTechnologies,
  filterRepositories,
  sortRepositories,
  type RepoSortBy,
} from "@/lib/repo-filter";
import { useAnalysis } from "@/lib/query/hooks";
import { withDeepScan } from "@/lib/with-deep-scan";

interface RepositoryExplorerProps {
  username: string;
}

function RepositoryExplorerSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-live="polite">
      <LoadingSkeleton variant="text-line" className="h-8 w-56" />
      <LoadingSkeleton variant="text-line" className="h-9 w-full max-w-md" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingSkeleton key={i} variant="skill-card" />
        ))}
      </div>
      <span className="sr-only">Loading repositories…</span>
    </div>
  );
}

export function RepositoryExplorer({ username }: RepositoryExplorerProps) {
  const [deepScan] = useDeepScan();
  const { data, error, isLoading, refetch } = useAnalysis(username, deepScan);
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState<RepoSortBy>("stars");
  const [selectedTechnology, setSelectedTechnology] = React.useState<string | null>(
    null,
  );

  if (isLoading) {
    return <RepositoryExplorerSkeleton />;
  }

  if (error) {
    // Same policy as SkillsDashboard (Phase 2): a nonexistent GitHub user
    // routes to not-found.tsx; every other error is handled inline so the
    // exact status (429/503/network) can drive the message and retry.
    if (error instanceof ApiError && error.isNotFound) {
      notFound();
    }

    return (
      <div className="flex flex-col gap-8">
        <PageHeader title={`${username} — Repositories`} />
        <AnalyzeErrorState error={error} onRetry={() => refetch()} />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const technologies = collectTechnologies(data.repositories);
  const filtered = filterRepositories(data.repositories, {
    search,
    technology: selectedTechnology,
  });
  const sorted = sortRepositories(filtered, sortBy);
  const isFiltered = search.trim() !== "" || selectedTechnology !== null;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={withDeepScan(`/analyze/${encodeURIComponent(username)}`, deepScan)}
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1 text-sm"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Back to dashboard
      </Link>

      <PageHeader
        title="Repositories"
        description={`${data.repository_count} ${
          data.repository_count === 1 ? "repository" : "repositories"
        } in ${username}'s portfolio`}
      />

      <RepoFilters
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        technologies={technologies}
        selectedTechnology={selectedTechnology}
        onTechnologyChange={setSelectedTechnology}
      />

      <RepoList
        repositories={sorted}
        username={username}
        isFiltered={isFiltered}
        deepScan={deepScan}
      />
    </div>
  );
}
