import type { Metadata } from "next";
import { RepoDetail } from "@/components/analyze/repo-detail";

interface RepoDetailPageProps {
  params: Promise<{ username: string; repoName: string }>;
}

export async function generateMetadata({
  params,
}: RepoDetailPageProps): Promise<Metadata> {
  const { username, repoName } = await params;
  return {
    title: `${repoName} | ${username} | SkillForge`,
    description: `Technologies, metadata, and detected skills for ${username}/${repoName}.`,
  };
}

export default async function RepoDetailPage({ params }: RepoDetailPageProps) {
  const { username, repoName } = await params;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <RepoDetail username={username} repoName={repoName} />
    </main>
  );
}
