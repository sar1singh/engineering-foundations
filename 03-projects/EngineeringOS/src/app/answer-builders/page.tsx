import { answerBuilders } from "@/data/founder-success-experience";

export default function AnswerBuildersPage() {
  return (
    <section className="space-y-6">
      <div className="eo-glow-card p-6">
        <p className="text-sm font-medium text-teal-700">Answer builders</p>
        <h1 className="mt-2 text-3xl font-semibold">Structure beats panic.</h1>
        <p className="mt-2 max-w-3xl text-[var(--muted)]">Use these templates to turn rough knowledge into interview-ready answers.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {answerBuilders.map((builder) => (
          <article key={builder.title} className="eo-card p-5">
            <h2 className="text-xl font-semibold">{builder.title}</h2>
            <details className="mt-4 group" open={builder.title === "HLD answer builder"}>
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm font-semibold text-[var(--foreground)]">
                <span>View framework</span>
                <span className="text-xs text-[var(--muted)] group-open:hidden">Expand</span>
                <span className="hidden text-xs text-[var(--muted)] group-open:inline">Collapse</span>
              </summary>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {builder.sections.map((section, index) => (
                <div key={section} className="eo-panel p-3 text-sm">
                  <span className="text-xs font-semibold text-teal-700">{index + 1}.</span> {section}
                </div>
              ))}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Info title="Prompt questions" items={builder.prompts} />
                <Info title="Scoring rubric" items={builder.rubric} />
                <div className="eo-panel p-3">
                  <p className="text-xs font-semibold uppercase text-teal-700">Example outline</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{builder.example}</p>
                </div>
              </div>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="eo-panel p-3">
      <p className="text-xs font-semibold uppercase text-teal-700">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
