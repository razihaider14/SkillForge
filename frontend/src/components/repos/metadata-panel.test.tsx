import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { MetadataPanel } from "@/components/repos/metadata-panel";
import { sampleAnalyzeResponse } from "@/lib/api/__fixtures__/sampleResponses";
import type { RepositoryMetadata } from "@/types/metadata";

const metadata = sampleAnalyzeResponse.repositories[0].metadata;

describe("MetadataPanel", () => {
  it("renders engineering practice flags", () => {
    render(<MetadataPanel metadata={metadata} />);
    expect(screen.getByText("Has tests")).toBeInTheDocument();
    expect(screen.getByText("Has CI/CD")).toBeInTheDocument();
  });

  it("renders CI providers when has_ci_cd is true", () => {
    render(<MetadataPanel metadata={metadata} />);
    expect(screen.getByText("github_actions")).toBeInTheDocument();
  });

  it("renders documentation quality tier and flags", () => {
    render(<MetadataPanel metadata={metadata} />);
    expect(screen.getByText(metadata.documentation.quality_tier)).toBeInTheDocument();
    expect(screen.getByText("README")).toBeInTheDocument();
  });

  it("renders the license section", () => {
    render(<MetadataPanel metadata={metadata} />);
    expect(screen.getByText("License detected")).toBeInTheDocument();
    expect(screen.getByText("MIT")).toBeInTheDocument();
  });

  it("renders the maturity tier and fact rows", () => {
    render(<MetadataPanel metadata={metadata} />);
    expect(screen.getByText(metadata.maturity.maturity_tier)).toBeInTheDocument();
    expect(screen.getByText("Open issues")).toBeInTheDocument();
  });

  it("renders package managers and build systems when present", () => {
    render(<MetadataPanel metadata={metadata} />);
    expect(screen.getByText("pip")).toBeInTheDocument();
  });

  it("does not render the package managers section when both arrays are empty", () => {
    const emptyMeta: RepositoryMetadata = {
      ...metadata,
      package_managers: [],
      build_systems: [],
    };
    render(<MetadataPanel metadata={emptyMeta} />);
    expect(screen.queryByText("Package managers & build systems")).not.toBeInTheDocument();
  });

  it("renders size metrics and top file extensions", () => {
    render(<MetadataPanel metadata={metadata} />);
    expect(screen.getByText("Files")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText(".py × 25")).toBeInTheDocument();
  });

  it("does not render the Tags section when project_types and hardware_platforms are both empty", () => {
    const emptyMeta: RepositoryMetadata = {
      ...metadata,
      project_types: [],
      hardware_platforms: [],
    };
    render(<MetadataPanel metadata={emptyMeta} />);
    expect(screen.queryByText("Tags")).not.toBeInTheDocument();
  });

  it("renders the Tags section when project_types is non-empty", () => {
    render(<MetadataPanel metadata={metadata} />);
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("api_backend")).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(<MetadataPanel metadata={metadata} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
