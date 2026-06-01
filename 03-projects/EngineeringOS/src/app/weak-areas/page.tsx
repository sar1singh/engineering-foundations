import { weakAreaRepairs } from "@/data/founder-success-experience";

export default function WeakAreasPage() {
  return (
    <section className="space-y-6">
      <div className="eo-glow-card p-6">
        <p className="text-sm font-medium text-teal-700">Weak-area repair</p>
        <h1 className="mt-2 text-3xl font-semibold">Weakness is a queue, not an identity.</h1>
        <p className="mt-2 max-w-3xl text-[var(--muted)]">Every weak area becomes a short repair plan tied to interview rounds.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {weakAreaRepairs.map((item) => (
          <article key={item.area} className="eo-card p-5">
            <h2 className="text-xl font-semibold">{item.area}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{item.why}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.rounds.map((round) => (
                <span key={round} className="rounded-md bg-teal-50 px-2 py-1 text-xs text-teal-800">{round}</span>
              ))}
            </div>
            <p className="mt-4 rounded-md bg-teal-50 p-3 text-sm text-teal-800">Confidence trend: {item.confidenceTrend}</p>
            <ol className="mt-4 space-y-2">
              {item.fix.map((step) => (
                <li key={step} className="eo-panel p-3 text-sm text-[var(--muted)]">{step}</li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </section>
  );
}
