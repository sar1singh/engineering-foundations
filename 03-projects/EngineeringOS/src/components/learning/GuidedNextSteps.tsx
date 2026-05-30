import Link from "next/link";

export type GuidedNextStep = {
  href: string;
  label: string;
  description: string;
};

type GuidedNextStepsProps = {
  title?: string;
  steps: GuidedNextStep[];
};

export function GuidedNextSteps({ title = "Suggested next steps", steps }: GuidedNextStepsProps) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-[var(--border)] bg-white p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step) => (
          <Link
            key={`${step.href}-${step.label}`}
            className="rounded-md border border-[var(--border)] p-3 transition hover:border-teal-700 hover:bg-teal-50"
            href={step.href}
          >
            <p className="font-medium">{step.label}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{step.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
