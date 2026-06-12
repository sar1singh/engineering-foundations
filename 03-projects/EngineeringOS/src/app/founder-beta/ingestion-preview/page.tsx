import Link from "next/link";
import { MOCK_INGESTION_CANDIDATES } from "@/data/founder-beta/ingestion-mock-candidates";
import { simulateAllCandidates } from "@/lib/services/content-ingestion-simulator";
import { IngestionPreview } from "@/components/founder-beta/IngestionPreview";

export default function FounderBetaIngestionPreviewPage() {
  const results = simulateAllCandidates(MOCK_INGESTION_CANDIDATES);

  const publishReadyCount = results.filter((r) => r.finalStatus === "published").length;
  const rejectedCount = results.filter((r) => r.finalStatus === "rejected").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-700">Founder Beta</p>
          <h1 className="mt-1 text-xl font-semibold">Interactive Ingestion Simulation</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {results.length} candidates simulated &mdash; {publishReadyCount} publish-ready, {rejectedCount} rejected &mdash; session-scoped review controls
          </p>
        </div>
        <Link
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          href="/founder-beta"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="eo-card p-4 text-sm text-[var(--muted)]">
        <p className="font-semibold text-[var(--foreground)]">How it works</p>
        <p className="mt-1">
          This page interactively simulates the content ingestion review workflow. Each mock candidate flows through
          the state machine (discovered &rarr; normalized &rarr; mapped &rarr; reviewed &rarr; approved &rarr; published/rejected)
          using the pure validation helpers from Phase 7C. Use the review controls to approve, reject, or mark
          candidates as needing changes. All review decisions are session-scoped and reset on page reload.
          No scraping, no agents, no runtime ingestion.
        </p>
      </div>

      <IngestionPreview results={results} />
    </div>
  );
}
