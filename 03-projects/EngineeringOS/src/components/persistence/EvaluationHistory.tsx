import type { SavedEvaluationResult } from "@/types/progress";

export function EvaluationHistory({ results }: { results: SavedEvaluationResult[] }) {
  if (results.length === 0) {
    return (
      <div className="mt-4 rounded-md border border-dashed border-[var(--border)] p-3">
        <p className="text-sm font-medium">Saved mock evaluations</p>
        <p className="mt-1 text-sm text-[var(--muted)]">No mock evaluation notes saved yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <p className="text-sm font-medium">Saved mock evaluations</p>
      {results.slice(0, 3).map((result) => (
        <div key={result.id} className="rounded-md bg-slate-50 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-[var(--muted)]">{formatDate(result.createdAt)}</p>
            <p className="text-sm text-teal-700">
              {result.score}/{result.maxScore} pts
            </p>
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">{result.summary}</p>
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
