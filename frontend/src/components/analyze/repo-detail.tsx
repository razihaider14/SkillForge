"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileSearch } from "lucide-react";
import { AnalyzeErrorState } from "@/components/analyze/analyze-error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { RepoDetailHeader } from "@/components/repos/repo-detail-header";
import { RepoSkillBreakdown } from "@/components/repos/repo-skill-breakdown";
import { MetadataPanel } from "@/components/repos/metadata-panel";
import { TechBadgeList } from "@/components/repos/tech-badge-list";
import { ApiError } from "@/lib/api/errors";
import { useAnalysis, useRepos } from "@/lib/query/hooks";

interface RepoDetailProps {
  username: string;
  repoName: string;
}

function RepoDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-live="polite">
      <LoadingSkeleton variant="text-line" className="h-8 w-64" />
      <LoadingSkeleton variant="text-line" className="h-4 w-full max-w-md" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} variant="skill-card" />
        ))}
      </div>
      <span className="sr-only">Loading repository…</span>
    </div>
  );
}

export function RepoDetail({ username, repoName }: RepoDetailProps) {
  const { data, error, isLoading, refetch } = useAnalysis(username);
  // Best-effort supplementary data — see RepoDetailHeader's docstring on
  // `description`. Deliberately NOT destructuring `error` from this one:
  // if the repos list fails to load, the page still works fine without a
  // description, so that failure is never surfaced to the person here.
  const { data: reposData, isLoading: isReposLoading } = useRepos(username);

  if (isLoading) {
    return <RepoDetailSkeleton />;
  }

  if (error) {
    if (error instanceof ApiError && error.isNotFound) {
      notFound();
    }

    return (
      <div className="flex flex-col gap-8">
        <PageHeader title={`${username} — ${repoName}`} />
        <AnalyzeErrorState error={error} onRetry={() => refetch()} />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const repo = data.repositories.find((candidate) => candidate.name === repoName);

  if (!repo) {
    // This is distinct from a 404 GitHub user: the account exists and
    // loaded fine, this particular repository name just isn't in it (a
    // typo, a renamed/deleted repo, etc.) — an inline empty state, not
    // Next's notFound()/not-found.tsx, since that file's copy assumes the
    // *username* segment was the thing not found.
    return (
      <div className="flex flex-col gap-8">
        <PageHeader title={repoName} />
        <EmptyState
          icon={FileSearch}
          title="Repository not found"
          description={`${username}'s portfolio doesn't include a repository named "${repoName}".`}
          action={
            <Link
              href={`/analyze/${encodeURIComponent(username)}/repos`}
              className="text-primary text-sm underline-offset-4 hover:underline"
            >
              Back to all repositories
            </Link>
          }
        />
      </div>
    );
  }

  const repoSummary = reposData?.repositories.find(
    (candidate) => candidate.name === repoName,
  );

  return (
    <div className="flex flex-col gap-8">
      <Link
        href={`/analyze/${encodeURIComponent(username)}/repos`}
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1 text-sm"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        All repositories
      </Link>

      <RepoDetailHeader
        repoName={repo.name}
        username={username}
        language={repo.language}
        stars={repo.metadata.maturity.stars}
        forks={repo.metadata.maturity.forks}
        description={repoSummary?.description}
        isDescriptionLoading={isReposLoading}
      />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Technologies</h2>
        <TechBadgeList technologies={repo.technologies} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Metadata</h2>
        <MetadataPanel metadata={repo.metadata} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Skills in this repository</h2>
        <RepoSkillBreakdown skills={repo.skills} repoName={repo.name} />
      </section>
    </div>
  );
}
