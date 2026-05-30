import Link from "next/link";
import { GuidedNextSteps } from "@/components/learning/GuidedNextSteps";
import { appServices } from "@/lib/providers";

type ContentPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ContentPage({ searchParams }: ContentPageProps) {
  const { q = "" } = await searchParams;
  const results = await appServices.searchService.search(q);
  const hasResults =
    results.roadmaps.length > 0 || results.topics.length > 0 || results.tasks.length > 0 || results.references.length > 0;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-teal-700">Content</p>
        <h1 className="text-3xl font-semibold">Content search</h1>
        <p className="mt-2 text-[var(--muted)]">
          Search mock roadmaps, topics, tasks, and references through SearchService.
        </p>
      </div>
      <form className="rounded-lg border border-[var(--border)] bg-white p-4">
        <label className="text-sm font-medium" htmlFor="q">
          Search content
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="q"
            name="q"
            defaultValue={q}
            className="min-h-10 flex-1 rounded-md border border-[var(--border)] px-3 outline-none focus:border-teal-700"
            placeholder="Try closures, caching, arrays, SQS..."
          />
          <button className="rounded-md bg-teal-700 px-4 text-sm font-medium text-white" type="submit">
            Search
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {["closures", "promises", "caching", "queues"].map((term) => (
            <Link key={term} className="rounded-md bg-slate-50 px-3 py-1 text-[var(--muted)] hover:text-teal-700" href={`/content?q=${term}`}>
              {term}
            </Link>
          ))}
        </div>
      </form>
      <GuidedNextSteps
        steps={[
          {
            href: "/graph",
            label: "Browse the roadmap",
            description: "Use the graph when you are not sure what to search for."
          },
          {
            href: "/dashboard",
            label: "Return to mission",
            description: "Jump back to the current topic and practice task."
          }
        ]}
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Roadmaps" value={results.roadmaps.length} />
        <Metric label="Topics" value={results.topics.length} />
        <Metric label="Tasks" value={results.tasks.length} />
        <Metric label="References" value={results.references.length} />
      </div>
      <section className="grid gap-6 xl:grid-cols-2">
        {!hasResults ? (
          <section className="rounded-lg border border-[var(--border)] bg-white p-5 xl:col-span-2">
            <h2 className="text-xl font-semibold">No content found</h2>
            <p className="mt-2 text-[var(--muted)]">Try a different topic, task, roadmap, or reference search.</p>
          </section>
        ) : null}
        <ResultPanel title="Topics" emptyText="No topics match this search.">
          {results.topics.slice(0, 12).map((topic) => (
            <Link key={topic.id} href={`/topics/${topic.slug}`} className="block rounded-md border border-[var(--border)] p-3 hover:border-teal-700">
              <p className="font-medium">{topic.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{topic.summary}</p>
            </Link>
          ))}
        </ResultPanel>
        <ResultPanel title="Practice tasks" emptyText="No practice tasks match this search.">
          {results.tasks.slice(0, 12).map((task) => (
            <Link key={task.id} href={`/practice/${task.slug}`} className="block rounded-md border border-[var(--border)] p-3 hover:border-teal-700">
              <p className="font-medium">{task.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{task.statement}</p>
            </Link>
          ))}
        </ResultPanel>
        <ResultPanel title="Roadmaps" emptyText="No roadmaps match this search.">
          {results.roadmaps.map((roadmap) => (
            <div key={roadmap.id} className="rounded-md border border-[var(--border)] p-3">
              <p className="font-medium">{roadmap.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{roadmap.description}</p>
            </div>
          ))}
        </ResultPanel>
        <ResultPanel title="References" emptyText="No references match this search.">
          {results.references.slice(0, 12).map((reference) => (
            <a
              key={reference.id}
              href={reference.url}
              className="block rounded-md border border-[var(--border)] p-3 hover:border-teal-700"
              rel="noreferrer"
              target="_blank"
            >
              <p className="font-medium">{reference.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{reference.priority} {reference.sourceType}</p>
            </a>
          ))}
        </ResultPanel>
      </section>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function ResultPanel({ title, emptyText, children }: { title: string; emptyText: string; children: React.ReactNode }) {
  const childCount = Array.isArray(children) ? children.length : children ? 1 : 0;

  return (
    <section className="rounded-lg border border-[var(--border)] bg-white p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">{childCount > 0 ? children : <p className="text-sm text-[var(--muted)]">{emptyText}</p>}</div>
    </section>
  );
}
