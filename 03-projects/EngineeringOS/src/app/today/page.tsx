import Link from "next/link";
import { ArrowRight, Clock, Flame, Gauge, Route, ShieldCheck } from "lucide-react";
import { answerBuilders, crashCourseModes, interviewRounds, weakAreaRepairs } from "@/data/founder-success-experience";

export default function TodayPage() {
  const mode = crashCourseModes[0];
  const round = interviewRounds.find((item) => item.score < 45) ?? interviewRounds[0];
  const weakArea = weakAreaRepairs[0];
  const readiness = Math.round((round.score + 58 + 41) / 3);
  const metrics = [
    { label: "Mode", value: "30 days", detail: mode.pace, icon: Route },
    { label: "Today", value: "90 min", detail: "single focused block", icon: Clock },
    { label: "Weak signal", value: `${round.score}%`, detail: round.title, icon: Gauge },
    { label: "Streak intent", value: "1 day", detail: "start clean", icon: Flame }
  ];

  return (
    <section className="space-y-6">
      <div className="eo-glow-card p-6">
        <div className="relative z-[1] grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div>
            <p className="text-sm font-semibold text-teal-700">Today cockpit</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight md:text-4xl">Your next 90 minutes are already decided.</h1>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              {mode.title}: {mode.promise}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="eo-primary-action px-4 py-2.5 text-sm" href="/syllabus/graph-bfs">
                Start today&apos;s lesson <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:bg-slate-50" href="/interview-rounds">
                Open mock loop
              </Link>
            </div>
          </div>
          <div className="eo-panel p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-white">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">Readiness pulse</p>
                <p className="text-3xl font-semibold text-teal-700">{readiness}%</p>
              </div>
            </div>
            <div className="mt-4 eo-progress">
              <span style={{ width: `${readiness}%` }} />
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">Enough signal to move. Not enough to wander.</p>
          </div>
        </div>
        <div className="relative z-[1] mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="eo-kpi p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-[var(--muted)]">{metric.label}</p>
                    <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
                  </div>
                  <Icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">{metric.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="eo-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-teal-700">Command queue</p>
              <h2 className="mt-1 text-xl font-semibold">Start here</h2>
            </div>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">80/20 locked</span>
          </div>
          <div className="mt-4 space-y-3">
            <Action href="/syllabus/graph-bfs" label="Lesson" text="Graph BFS: shortest-path thinking and visited-state timing." />
            <Action href="/interview-rounds" label="Mock" text={`${round.title}: ${round.action}`} />
            <Action href="/weak-areas" label="Repair" text={`${weakArea.area}: ${weakArea.fix[0]}`} />
          </div>
        </div>
        <div className="eo-card p-5">
          <p className="text-sm font-medium text-teal-700">Confidence repair</p>
          <h2 className="mt-1 text-xl font-semibold">End-of-day reflection</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Write one answer you improved, one weak signal you found, and one thing you will not study tomorrow.
          </p>
          <Link className="eo-primary-action mt-4 px-3 py-2 text-sm" href="/answer-builders">
            Open answer builders <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="eo-card p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-teal-700">Interview structure</p>
            <h2 className="mt-1 text-xl font-semibold">Structured answer templates</h2>
          </div>
          <Link className="text-sm font-semibold text-teal-700" href="/answer-builders">
            View all
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {answerBuilders.slice(0, 3).map((builder) => (
            <Link key={builder.title} className="eo-panel block p-4 hover:bg-teal-50" href="/answer-builders">
              <p className="font-medium">{builder.title}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{builder.sections.slice(0, 4).join(" -> ")}</p>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}

function Action({ href, label, text }: { href: string; label: string; text: string }) {
  return (
    <Link className="eo-panel group block p-4 hover:bg-teal-50" href={href}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase text-teal-700">{label}</p>
        <ArrowRight className="h-4 w-4 text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-teal-700" aria-hidden="true" />
      </div>
      <p className="mt-2 font-medium">{text}</p>
    </Link>
  );
}
