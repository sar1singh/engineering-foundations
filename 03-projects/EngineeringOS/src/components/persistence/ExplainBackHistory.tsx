import type { ExplainBackAttempt } from "@/types/progress";

export function ExplainBackHistory({ attempts }: { attempts: ExplainBackAttempt[] }) {
  if (attempts.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      <p className="text-sm font-medium">Saved attempts</p>
      {attempts.slice(0, 3).map((attempt) => (
        <div key={attempt.id} className="rounded-md bg-slate-50 p-3">
          <p className="text-xs text-[var(--muted)]">{formatDate(attempt.createdAt)}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{attempt.answer}</p>
        </div>
      ))}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
