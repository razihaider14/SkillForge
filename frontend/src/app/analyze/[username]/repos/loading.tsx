import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function RepositoriesLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
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
    </main>
  );
}
