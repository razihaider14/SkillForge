"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/**
 * One QueryClient per browser session, created lazily inside useState so it
 * survives re-renders but isn't shared across requests on the server (which
 * would leak data between users). This is the standard Next.js App Router
 * pattern for TanStack Query.
 *
 * Defaults here are deliberately conservative and generic:
 * - staleTime: 5 minutes, matching the "API Integration Strategy" section
 *   of the architecture doc (a GitHub portfolio doesn't change minute to
 *   minute, so this avoids refetching on every tab refocus).
 * - retry: 1, a safe default until Phase 1 adds the typed ApiError and the
 *   endpoint-specific policy described in the architecture doc (don't retry
 *   404, don't retry 429, do retry 503/network errors with backoff).
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
