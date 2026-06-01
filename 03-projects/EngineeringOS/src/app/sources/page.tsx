import { sourceGuides } from "@/data/founder-success-experience";

export default function SourcesPage() {
  return (
    <section className="space-y-6">
      <div className="eo-glow-card p-6">
        <p className="text-sm font-medium text-teal-700">Source guide</p>
        <h1 className="mt-2 text-3xl font-semibold">Use the best sources. Skip the rest for now.</h1>
        <p className="mt-2 max-w-3xl text-[var(--muted)]">EngineeringOS consolidates public material into a focused path so preparation does not become tab-hoarding.</p>
      </div>
      <div className="space-y-4">
        {sourceGuides.map((guide) => (
          <article key={guide.topic} className="eo-card p-5">
            <h2 className="text-xl font-semibold">{guide.topic}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{guide.why}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Info label="Primary" value={guide.primary} />
              <Info label="Video" value={guide.video} />
              <Info label="Article/docs" value={guide.article} />
              <Info label="Practice" value={guide.practice.join(", ")} />
              <Info label="Repository" value={guide.repo} />
              <Info label="Skip for now" value={guide.skip} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="eo-panel p-3">
      <p className="text-xs font-medium uppercase text-teal-700">{label}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{value}</p>
    </div>
  );
}
