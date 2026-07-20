import { UsernameForm } from "@/components/analyze/username-form";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 pt-20 pb-16 text-center sm:pt-28">
      <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        See what your GitHub portfolio actually demonstrates
      </h1>
      <p className="text-muted-foreground max-w-xl text-lg text-balance">
        SkillForge reads a public GitHub portfolio and surfaces evidence-based
        skills, strengths, weaknesses, and recommendations — no scores, no
        guesswork, just what the code shows.
      </p>
      <UsernameForm className="w-full max-w-md" />
    </section>
  );
}
