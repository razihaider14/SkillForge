import { describe, expect, it } from "vitest";
import { withDeepScan } from "@/lib/with-deep-scan";

describe("withDeepScan", () => {
  it("returns the href unchanged when deepScan is false", () => {
    expect(withDeepScan("/analyze/octocat/repos", false)).toBe(
      "/analyze/octocat/repos",
    );
  });

  it("appends ?include_content=true when deepScan is true", () => {
    expect(withDeepScan("/analyze/octocat/repos", true)).toBe(
      "/analyze/octocat/repos?include_content=true",
    );
  });
});
