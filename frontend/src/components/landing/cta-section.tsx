import { UsernameForm } from "@/components/analyze/username-form";

export function CTASection() {
  return (
    <section className="border-t">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Analyze your own GitHub portfolio
        </h2>
        <p className="text-muted-foreground max-w-lg">
          Free, and it only reads public repository data — nothing is
          written back to GitHub.
        </p>
        <UsernameForm className="w-full max-w-md" />
      </div>
    </section>
  );
}
