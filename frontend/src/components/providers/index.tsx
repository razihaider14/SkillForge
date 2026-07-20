import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { NavigationProgressProvider } from "@/components/providers/navigation-progress";

/**
 * Composes every app-wide provider in one place. Add new global providers
 * (e.g. an auth context, if one is ever needed) here, not in layout.tsx
 * directly, so layout.tsx stays a thin shell.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <NuqsAdapter>
          <NavigationProgressProvider>{children}</NavigationProgressProvider>
        </NuqsAdapter>
      </QueryProvider>
    </ThemeProvider>
  );
}
