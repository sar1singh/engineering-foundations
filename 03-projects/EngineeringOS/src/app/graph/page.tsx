import Link from "next/link";
import { appServices } from "@/lib/providers";

export default async function GraphPage() {
  const tree = await appServices.roadmapTreeService.getActiveRoadmapTree();
  const topicCount =
    tree?.domains.reduce(
      (domainTotal, domain) =>
        domainTotal +
        domain.categories.reduce(
          (categoryTotal, category) =>
            categoryTotal + category.modules.reduce((moduleTotal, module) => moduleTotal + module.topics.length, 0),
          0
        ),
      0
    ) ?? 0;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-teal-700">Learning Graph</p>
        <h1 className="text-3xl font-semibold">{tree?.roadmap.title ?? "No active roadmap"}</h1>
        <p className="mt-2 max-w-3xl text-[var(--muted)]">
          {tree ? `${tree.domains.length} domains and ${topicCount} topics are available from RoadmapTreeService.` : "No active roadmap is available."}
        </p>
      </div>
      <div className="space-y-4">
        {tree?.domains.map(({ domain, categories }) => (
          <section key={domain.id} className="rounded-lg border border-[var(--border)] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[var(--muted)]">Domain {domain.order}</p>
                <h2 className="text-xl font-semibold">{domain.title}</h2>
              </div>
              <span className="rounded-md bg-teal-50 px-3 py-1 text-sm text-teal-800">{domain.slug}</span>
            </div>
            <div className="mt-4 space-y-4">
              {categories.map(({ category, modules }) => (
                <div key={category.id} className="rounded-md bg-slate-50 p-4">
                  <p className="font-medium">{category.title}</p>
                  <div className="mt-3 grid gap-3 lg:grid-cols-2">
                    {modules.map(({ module, topics }) => (
                      <div key={module.id} className="rounded-md border border-[var(--border)] bg-white p-3">
                        <p className="text-sm font-medium">{module.title}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {topics.length > 0 ? (
                            topics.map((topic) => (
                              <Link
                                key={topic.id}
                                href={`/topics/${topic.slug}`}
                                className="rounded-md border border-[var(--border)] px-2 py-1 text-xs hover:border-teal-700 hover:text-teal-700"
                              >
                                {topic.title}
                              </Link>
                            ))
                          ) : (
                            <span className="text-sm text-[var(--muted)]">Topics not seeded yet</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
