import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TechBadgeList } from "@/components/repos/tech-badge-list";
import { cn } from "@/lib/utils";
import type { RepositoryMetadata } from "@/types/metadata";

interface MetadataPanelProps {
  metadata: RepositoryMetadata;
  className?: string;
}

function BooleanFact({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {value ? (
        <Check aria-hidden="true" className="text-tier-proficient-fg size-4 shrink-0" />
      ) : (
        <X aria-hidden="true" className="text-muted-foreground/50 size-4 shrink-0" />
      )}
      <span className={value ? undefined : "text-muted-foreground"}>{label}</span>
      <span className="sr-only">{value ? " — yes" : " — no"}</span>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("gap-3 py-5", className)}>
      <CardHeader className="px-5">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-5">{children}</CardContent>
    </Card>
  );
}

export function MetadataPanel({ metadata, className }: MetadataPanelProps) {
  const { documentation, license, maturity, size_metrics } = metadata;

  const topExtensions = Object.entries(size_metrics.file_count_by_extension)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
      <Section title="Engineering practices">
        <BooleanFact label="Has tests" value={metadata.has_tests} />
        <BooleanFact label="Has CI/CD" value={metadata.has_ci_cd} />
        <BooleanFact label="Uses Docker" value={metadata.has_docker} />
        <BooleanFact label="Uses Docker Compose" value={metadata.has_docker_compose} />
        <BooleanFact
          label="Has Kubernetes manifests"
          value={metadata.has_kubernetes_manifests}
        />
        {metadata.ci_providers.length > 0 && (
          <div className="mt-1">
            <TechBadgeList technologies={metadata.ci_providers} />
          </div>
        )}
      </Section>

      <Section title="Documentation">
        <Fact
          label="Quality"
          value={
            <Badge variant="outline" className="capitalize">
              {documentation.quality_tier}
            </Badge>
          }
        />
        <BooleanFact label="README" value={documentation.has_readme} />
        <BooleanFact label="License file" value={documentation.has_license_file} />
        <BooleanFact label="Changelog" value={documentation.has_changelog} />
        <BooleanFact label="Contributing guide" value={documentation.has_contributing} />
        <BooleanFact label="Code of conduct" value={documentation.has_code_of_conduct} />
        {documentation.readme_heading_count > 0 && (
          <Fact label="README headings" value={documentation.readme_heading_count} />
        )}
      </Section>

      <Section title="License">
        <BooleanFact label="License detected" value={license.detected} />
        {license.spdx_id && <Fact label="License" value={license.spdx_id} />}
      </Section>

      <Section title="Maturity">
        <Fact
          label="Tier"
          value={
            <Badge variant="outline" className="capitalize">
              {maturity.maturity_tier}
            </Badge>
          }
        />
        <Fact label="Open issues" value={maturity.open_issues} />
        {maturity.age_days !== null && (
          <Fact label="Age (days)" value={maturity.age_days} />
        )}
        {maturity.days_since_last_push !== null && (
          <Fact label="Days since last push" value={maturity.days_since_last_push} />
        )}
        <BooleanFact label="Archived" value={maturity.is_archived} />
        <BooleanFact label="Fork" value={maturity.is_fork} />
      </Section>

      {(metadata.package_managers.length > 0 || metadata.build_systems.length > 0) && (
        <Section title="Package managers & build systems" className="sm:col-span-2">
          {metadata.package_managers.length > 0 && (
            <TechBadgeList technologies={metadata.package_managers} />
          )}
          {metadata.build_systems.length > 0 && (
            <TechBadgeList technologies={metadata.build_systems} />
          )}
        </Section>
      )}

      <Section title="Size" className="sm:col-span-2">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Fact label="Files" value={size_metrics.total_files} />
          <Fact label="Directories" value={size_metrics.total_directories} />
          <Fact label="Max depth" value={size_metrics.max_directory_depth} />
          {size_metrics.repo_size_kb !== null && (
            <Fact label="Size (KB)" value={size_metrics.repo_size_kb} />
          )}
        </div>
        {topExtensions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {topExtensions.map(([extension, count]) => (
              <Badge key={extension} variant="secondary">
                {extension} × {count}
              </Badge>
            ))}
          </div>
        )}
      </Section>

      {(metadata.project_types.length > 0 || metadata.hardware_platforms.length > 0) && (
        <Section title="Tags" className="sm:col-span-2">
          {metadata.project_types.length > 0 && (
            <TechBadgeList technologies={metadata.project_types} />
          )}
          {metadata.hardware_platforms.length > 0 && (
            <TechBadgeList technologies={metadata.hardware_platforms} />
          )}
        </Section>
      )}
    </div>
  );
}
