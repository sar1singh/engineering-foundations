import { ExternalLink } from "lucide-react";
import { liveSourceCategories, type LiveSourceLink } from "@/data/live-source-guides";

export default function SourcesPage() {
  return (
    <section className="space-y-6">
      <div className="eo-glow-card p-6">
        <p className="text-sm font-medium text-teal-700">Source guide</p>
        <h1 className="mt-2 text-3xl font-semibold">Use the best sources. Skip the rest for now.</h1>
        <p className="mt-2 max-w-3xl text-[var(--muted)]">EngineeringOS consolidates public material into a focused path so preparation does not become tab-hoarding.</p>
      </div>
      <div className="space-y-4">
        {liveSourceCategories.map((category) => (
          <article key={category.category} className="eo-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{category.category}</h2>
                <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">{category.goal}</p>
              </div>
              <span className="eo-chip">{category.links.length} live links</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {category.links.map((link) => (
                <SourceLinkCard key={link.url} link={link} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SourceLinkCard({ link }: { link: LiveSourceLink }) {
  return (
    <a className="eo-source-card block p-3" href={link.url} rel="noreferrer" target="_blank">
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-xs font-medium uppercase text-teal-700">{link.kind}</span>
          <span className="mt-1 block font-semibold">{link.title}</span>
        </span>
        <ExternalLink className="h-4 w-4 shrink-0 text-[var(--muted)]" aria-hidden="true" />
      </span>
      <span className="mt-2 block text-sm text-[var(--muted)]">{link.note}</span>
      <span className="mt-3 flex flex-wrap gap-1">
        {link.topics.map((topic) => (
          <span key={topic} className="rounded border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)]">
            {topic}
          </span>
        ))}
      </span>
    </a>
  );
}
