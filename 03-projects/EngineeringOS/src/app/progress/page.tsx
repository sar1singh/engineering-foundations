import Link from "next/link";
import { resetLocalProgressAction } from "@/lib/actions/progress-actions";
import { appServices } from "@/lib/providers";

export default async function ProgressPage() {
  const summary = await appServices.progressSummaryService.getProgressSummary();
  const topicPercent = summary.totalTopics > 0 ? Math.round((summary.completedTopics.length / summary.totalTopics) * 100) : 0;
  const taskPercent = summary.totalTasks > 0 ? Math.round((summary.completedTasks.length / summary.totalTasks) * 100) : 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-teal-700">Progress</p>
          <h1 className="text-3xl font-semibold">Progress summary</h1>
          <p className="mt-2 text-[var(--muted)]">Local progress is tracked through the configured repository source.</p>
        </div>
        <form action={resetLocalProgressAction}>
          <button className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-700" type="submit">
            Reset local progress
          </button>
        </form>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Readiness" value={`${summary.progress.readinessScore}%`} />
        <Metric label="Topic completion" value={`${topicPercent}%`} />
        <Metric label="Task completion" value={`${taskPercent}%`} />
        <Metric label="Streak" value={`${summary.progress.streakCount} days`} />
      </div>
      <section className="rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="text-xl font-semibold">Completed topics</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {summary.completedTopics.length > 0 ? (
            summary.completedTopics.map((topic) => (
              <Link key={topic.id} href={`/topics/${topic.slug}`} className="rounded-md bg-teal-50 px-3 py-2 text-sm text-teal-800">
                {topic.title}
              </Link>
            ))
          ) : (
            <p className="text-sm text-[var(--muted)]">No topics completed yet.</p>
          )}
        </div>
      </section>
      <section className="rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="text-xl font-semibold">Weak areas</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {summary.weakTopics.length > 0 ? (
            summary.weakTopics.map((topic) => (
              <Link key={topic.id} href={`/topics/${topic.slug}`} className="rounded-md border border-[var(--border)] p-3 hover:border-teal-700">
                <p className="font-medium">{topic.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{topic.summary}</p>
              </Link>
            ))
          ) : (
            <p className="text-sm text-[var(--muted)]">No weak areas are currently tracked.</p>
          )}
        </div>
      </section>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
