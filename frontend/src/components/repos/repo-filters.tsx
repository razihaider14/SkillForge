import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RepoSortBy } from "@/lib/repo-filter";
import { cn } from "@/lib/utils";

interface RepoFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: RepoSortBy;
  onSortByChange: (value: RepoSortBy) => void;
  technologies: string[];
  selectedTechnology: string | null;
  onTechnologyChange: (value: string | null) => void;
  className?: string;
}

export function RepoFilters({
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
  technologies,
  selectedTechnology,
  onTechnologyChange,
  className,
}: RepoFiltersProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
          />
          <label htmlFor="repo-search" className="sr-only">
            Search repositories by name
          </label>
          <Input
            id="repo-search"
            type="search"
            placeholder="Search repositories…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-8"
          />
        </div>

        <div role="group" aria-label="Sort repositories" className="flex gap-2">
          <Button
            type="button"
            variant={sortBy === "stars" ? "default" : "outline"}
            size="sm"
            aria-pressed={sortBy === "stars"}
            onClick={() => onSortByChange("stars")}
          >
            Most stars
          </Button>
          <Button
            type="button"
            variant={sortBy === "name" ? "default" : "outline"}
            size="sm"
            aria-pressed={sortBy === "name"}
            onClick={() => onSortByChange("name")}
          >
            Name (A–Z)
          </Button>
        </div>
      </div>

      {technologies.length > 0 && (
        <div
          role="group"
          aria-label="Filter repositories by technology"
          className="flex flex-wrap gap-2"
        >
          <Button
            type="button"
            variant={selectedTechnology === null ? "default" : "outline"}
            size="sm"
            aria-pressed={selectedTechnology === null}
            onClick={() => onTechnologyChange(null)}
          >
            All technologies
          </Button>
          {technologies.map((tech) => (
            <Button
              key={tech}
              type="button"
              variant={selectedTechnology === tech ? "default" : "outline"}
              size="sm"
              aria-pressed={selectedTechnology === tech}
              onClick={() =>
                onTechnologyChange(selectedTechnology === tech ? null : tech)
              }
            >
              {tech}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
