"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Thin wrapper around next-themes so app code imports from
 * "@/components/providers" instead of "next-themes" directly, and so we
 * have one place to change defaults later.
 *
 * Renders the `dark` class on <html>, matching the `.dark { ... }` block
 * and `@custom-variant dark` in globals.css.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
