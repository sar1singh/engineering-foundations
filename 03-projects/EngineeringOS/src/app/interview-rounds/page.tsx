import { interviewRounds } from "@/data/founder-success-experience";
import Link from "next/link";

export default function InterviewRoundsPage() {
  return (
    <section className="space-y-6">
      <div className="eo-glow-card p-6">
        <p className="text-sm font-medium text-teal-700">Interview rounds</p>
        <h1 className="mt-2 text-3xl font-semibold">Prepare for the actual loop, not random topics.</h1>
        <p className="mt-2 max-w-3xl text-[var(--muted)]">Each round shows what interviewers test, the signal they need, and the next repair action.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {interviewRounds.map((round) => (
          <article key={round.title} className="eo-card p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold">{round.title}</h2>
              <span className="rounded-md bg-teal-50 px-2 py-1 text-sm font-semibold text-teal-800">{round.score}%</span>
            </div>
            <div className="mt-3 eo-progress">
              <span style={{ width: `${round.score}%` }} />
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">Pass threshold: {round.passThreshold}%</p>
            <p className="mt-3 text-sm text-[var(--muted)]">{round.tests}</p>
            <p className="mt-3 eo-panel p-3 text-sm">{round.signal}</p>
            <p className="mt-3 text-sm font-medium text-teal-700">{round.action}</p>
            <div className="mt-4 space-y-2">
              {round.prompts.map((prompt) => (
                <p key={prompt} className="rounded-md bg-slate-50 p-2 text-sm text-[var(--muted)]">{prompt}</p>
              ))}
            </div>
            <Link className="eo-primary-action mt-4 px-3 py-2 text-sm" href="/answer-builders">
              Start mock mode
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
