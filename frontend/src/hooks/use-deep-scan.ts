"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

/**
 * Reads/writes `?include_content=true|false` in the URL. Backed by nuqs
 * (already part of the Phase 0 stack) rather than React state specifically
 * because React state doesn't survive a route change — navigating from
 * /analyze/[username] to /analyze/[username]/repos unmounts the dashboard
 * entirely, so "preserve the selection across routes" requires state that
 * lives outside any one page's component tree. The URL is that state.
 *
 * Defaults to false, matching the architecture doc's API Integration
 * Strategy: a fast, cheap first request, with Deep Scan as an explicit
 * opt-in for richer (slower, more GitHub-API-request-hungry) detection.
 *
 * Returns the same [value, setValue] shape as useState, so call sites
 * (ProfileHeader's toggle, useSkills/useAnalysis calls) don't need to know
 * this is URL-backed rather than component state.
 */
export function useDeepScan() {
  return useQueryState("include_content", parseAsBoolean.withDefault(false));
}
