import { ModeToggle } from "@/components/providers/mode-toggle";

/**
 * TEMPORARY scaffold-verification page.
 *
 * This is not the Landing page (Hero / FeatureCards / ExampleAnalysisPreview
 * / CTASection per the architecture doc), that's Phase 4. This page exists
 * only so `npm run dev` / `npm run build` have something to render while
 * confirming Tailwind, shadcn/ui, ThemeProvider, and QueryProvider are all
 * wired correctly. It should be deleted/replaced wholesale in Phase 4, not
 * incrementally edited into the real Landing page.
 */
export default function ScaffoldCheckPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">SkillForge, Phase 0 scaffold</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        Tailwind, shadcn/ui tokens, next-themes, and TanStack Query are
        wired. The real Landing page arrives in Phase 4.
      </p>
      <ModeToggle />
    </main>
  );
}
