import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";

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
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
