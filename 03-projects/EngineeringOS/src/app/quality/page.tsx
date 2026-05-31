import Link from "next/link";
import { getProductQualityStatus } from "@/lib/services/product-quality-service";
import { getProductionReadinessReport } from "@/lib/services/production-readiness-service";

export default function QualityPage() {
  const status = getProductQualityStatus();
  const readiness = getProductionReadinessReport();

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-teal-700">Product QA</p>
          <h1 className="text-3xl font-semibold">Quality contract dashboard</h1>
          <p className="mt-2 max-w-3xl text-[var(--muted)]">
            Executive quality signals for roadmap coverage, role readiness, strategic content, and topic depth.
          </p>
        </div>
        <Link className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white" href="/syllabus?view=table">
          Open syllabus table
        </Link>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        <Metric label="Contract health" value={`${status.coveragePercent}%`} />
        <Metric label="Domains" value={status.totals.domains} />
        <Metric label="Topics" value={status.totals.topics} />
        <Metric label="Role paths" value={status.totals.roleRoadmaps} />
      </section>

      <section className="rounded-lg border border-[var(--border)] bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Production readiness</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Phase 47 gate for alpha, beta, and production decisions.</p>
          </div>
          <div className="grid gap-2 text-sm sm:grid-cols-3">
            <Verdict label="Alpha" value={readiness.alphaVerdict} />
            <Verdict label="Beta" value={readiness.betaVerdict} />
            <Verdict label="Production" value={readiness.productionVerdict} />
          </div>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {readiness.checks.map((check) => (
            <div key={check.area} className="rounded-md bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{check.area}</p>
                <span className={`rounded-md px-2 py-1 text-xs ${check.status === "pass" ? "bg-teal-50 text-teal-800" : check.status === "watch" ? "bg-amber-50 text-amber-800" : "bg-rose-50 text-rose-800"}`}>
                  {check.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--muted)]">{check.evidence}</p>
              <p className="mt-2 text-xs font-medium text-slate-500">Required for {check.requiredFor}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <StatusPanel
          emptyText="All master-roadmap router domains are first-class syllabus domains."
          items={status.missingRouterDomains}
          title="Missing router domains"
        />
        <section className="rounded-lg border border-[var(--border)] bg-white p-5">
          <h2 className="text-xl font-semibold">Strategic content areas</h2>
          <div className="mt-4 space-y-3">
            {status.strategicAreas.map((area) => (
              <div key={area.label} className="rounded-md bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{area.label}</p>
                  <span className={`rounded-md px-2 py-1 text-xs ${area.status === "pass" ? "bg-teal-50 text-teal-800" : "bg-amber-50 text-amber-800"}`}>
                    {area.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {area.hits}/{area.required} keyword groups represented
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <StatusPanel
          emptyText="All role paths meet the minimum topic-count contract."
          items={status.thinRolePaths.map((role) => `${role.title}: ${role.topicCount} topics`)}
          title="Thin role paths"
        />
        <StatusPanel
          emptyText="No shallow topic issues detected by the product QA heuristic."
          items={status.shallowTopics.map((topic) => `${topic.title}: ${topic.issue}`)}
          title="Shallow topic watchlist"
        />
      </section>

      <section className="rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="text-xl font-semibold">Next QA workflow</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Action href="/syllabus?view=table&frequency=expert" label="Review hard topics" />
          <Action href="/syllabus?domain=career-assets" label="Review career assets" />
          <Action href="/dashboard" label="Return to daily flow" />
        </div>
      </section>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Verdict({ label, value }: { label: string; value: "ready" | "blocked" }) {
  return (
    <div className={`rounded-md px-3 py-2 ${value === "ready" ? "bg-teal-50 text-teal-900" : "bg-rose-50 text-rose-900"}`}>
      <p className="text-xs">{label}</p>
      <p className="font-semibold capitalize">{value}</p>
    </div>
  );
}

function StatusPanel({ emptyText, items, title }: { emptyText: string; items: string[]; title: string }) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-white p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <p key={item} className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
              {item}
            </p>
          ))
        ) : (
          <p className="rounded-md bg-teal-50 p-3 text-sm text-teal-900">{emptyText}</p>
        )}
      </div>
    </section>
  );
}

function Action({ href, label }: { href: string; label: string }) {
  return (
    <Link className="rounded-md border border-[var(--border)] p-3 text-sm font-medium hover:border-teal-700" href={href}>
      {label}
    </Link>
  );
}
