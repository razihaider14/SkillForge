/**
 * Appends `?include_content=true` to an internal href when deepScan is on,
 * leaving the href untouched otherwise. Used everywhere a Link crosses
 * between /analyze/[username], /analyze/[username]/repos, and
 * /analyze/[username]/repos/[repoName] — each of those routes reads its own
 * `include_content` from the URL independently (see useDeepScan), so the
 * only way the selection "carries over" is if the link that navigates
 * there explicitly includes it.
 */
export function withDeepScan(href: string, deepScan: boolean): string {
  return deepScan ? `${href}?include_content=true` : href;
}
