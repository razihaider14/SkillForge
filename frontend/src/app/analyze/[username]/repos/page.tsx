import type { Metadata } from "next";
import { RepositoryExplorer } from "@/components/analyze/repository-explorer";

interface RepositoriesPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: RepositoriesPageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username}'s repositories | SkillForge`,
    description: `Browse ${username}'s GitHub repositories, filterable by technology.`,
  };
}

export default async function RepositoriesPage({ params }: RepositoriesPageProps) {
  const { username } = await params;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <RepositoryExplorer username={username} />
    </main>
  );
}
