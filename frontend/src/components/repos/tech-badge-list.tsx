import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TechBadgeListProps {
  technologies: string[];
  /** Cap the number of badges shown, with a "+N more" badge for the rest. Omit to show all. */
  limit?: number;
  className?: string;
}

export function TechBadgeList({ technologies, limit, className }: TechBadgeListProps) {
  if (technologies.length === 0) {
    return null;
  }

  const visible =
    limit !== undefined ? technologies.slice(0, limit) : technologies;
  const remaining = limit !== undefined ? technologies.length - visible.length : 0;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {visible.map((tech) => (
        <Badge key={tech} variant="secondary">
          {tech}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="outline" title={technologies.slice(limit).join(", ")}>
          +{remaining} more
        </Badge>
      )}
    </div>
  );
}
