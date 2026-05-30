import Link from "next/link";
import { appServices } from "@/lib/providers";

export default async function DashboardPage() {
  const dashboard = await appServices.dashboardService.getDashboard();
  const activeRoadmap = dashboard.roadmapTree?.roadmap;
  const activeDomains = dashboard.roadmapTree?.domains.slice(0, 6) ?? [];

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-medium text-teal-700">Dashboard</p>
        <h1 className="text-3xl font-semibold">Today&apos;s Mission</h1>
        <p className="mt-2 max-w-3xl text-[var(--muted)]">
          {activeRoadmap?.title ?? "EngineeringOS"} is running on local mock content and service-backed retrieval.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-[var(--border)] bg-white p-4">
          <p className="text-sm text-[var(--muted)]">Current topic</p>
          <p className="mt-2 font-semibold">{dashboard.currentTopic?.title ?? "No active topic"}</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-4">
          <p className="text-sm text-[var(--muted)]">Readiness score</p>
          <p className="mt-2 font-semibold">{dashboard.readinessScore}%</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-4">
          <p className="text-sm text-[var(--muted)]">Revision queue</p>
          <p className="mt-2 font-semibold">{dashboard.revisionQueue.length} prompts</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-4">
          <p className="text-sm text-[var(--muted)]">Weak areas</p>
          <p className="mt-2 font-semibold">{dashboard.weakAreas.length} tracked</p>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-lg border border-[var(--border)] bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--muted)]">Next practice task</p>
              <h2 className="mt-1 text-xl font-semibold">{dashboard.todayMission?.title ?? "No task queued"}</h2>
            </div>
            {dashboard.todayMission ? (
              <Link
                className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white"
                href={`/practice/${dashboard.todayMission.slug}`}
              >
                Open task
              </Link>
            ) : null}
          </div>
          <p className="mt-4 text-[var(--muted)]">
            {dashboard.todayMission?.statement ?? "Complete more roadmap data to generate a mission."}
          </p>
          {dashboard.currentTopic ? (
            <Link className="mt-4 inline-block text-sm font-medium text-teal-700" href={`/topics/${dashboard.currentTopic.slug}`}>
              Study {dashboard.currentTopic.title}
            </Link>
          ) : null}
        </section>
        <section className="rounded-lg border border-[var(--border)] bg-white p-5">
          <h2 className="text-xl font-semibold">Revision Queue</h2>
          <div className="mt-4 space-y-3">
            {dashboard.revisionQueue.length > 0 ? (
              dashboard.revisionQueue.map((prompt) => (
                <div key={prompt.id} className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm text-[var(--muted)]">{prompt.frequency}</p>
                  <p className="mt-1 text-sm">{prompt.prompt}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">No revision prompts are queued.</p>
            )}
          </div>
        </section>
      </div>
      <section className="rounded-lg border border-[var(--border)] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Current Learning Path</h2>
          <Link className="text-sm font-medium text-teal-700" href="/graph">
            View graph
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {activeDomains.map(({ domain, categories }) => (
            <div key={domain.id} className="rounded-md border border-[var(--border)] p-3">
              <p className="font-medium">{domain.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {categories.reduce((count, category) => count + category.modules.reduce((total, module) => total + module.topics.length, 0), 0)} topics
              </p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
