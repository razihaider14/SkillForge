interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Does SkillForge need my GitHub password or a token?",
    answer:
      "No. Analyzing a public username requires no authentication at all. The backend can optionally use a GitHub personal access token server-side to raise its own API rate limit, but that's unrelated to you signing in — there's no login step.",
  },
  {
    question: "Does this only work for public repositories?",
    answer:
      "Yes, currently. SkillForge reads whatever GitHub's public API returns for a username, which means private repositories aren't analyzed.",
  },
  {
    question: "What does \"Deep scan\" do?",
    answer:
      "By default, SkillForge detects technologies from repository file trees and manifests alone. Deep scan additionally downloads README and manifest file contents for richer detection — at the cost of more GitHub API requests and a slower analysis.",
  },
  {
    question: "Why don't I get a single overall score?",
    answer:
      "Because a single number would hide more than it shows. SkillForge reports per-skill tiers (expert, proficient, developing, exposure) backed by specific evidence, instead of collapsing a whole portfolio into one score.",
  },
];

export function FAQSection() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold tracking-tight">
        Frequently asked questions
      </h2>
      <div className="flex flex-col divide-y rounded-lg border">
        {FAQS.map((faq) => (
          <details key={faq.question} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium select-none">
              {faq.question}
              <span
                aria-hidden="true"
                className="text-muted-foreground shrink-0 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="text-muted-foreground mt-2 text-sm">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
