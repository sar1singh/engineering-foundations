"use client";

import { useMemo } from "react";
import { buildGapDrivenIngestionPlan, prioritizeKnowledgeGraphGaps, runGapSubAgents, summarizeGapDrivenPlan } from "@/lib/services/gap-driven-ingestion-engine";
import { founderBetaSourceCatalog } from "@/data/founder-beta";
import { discoverySeeds } from "@/data/discovery-seeds";
import type { GapDrivenIngestionPlan, SyllabusGap } from "@/types/gap-driven-ingestion";

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    critical: "bg-red-100 text-red-800",
    high: "bg-orange-100 text-orange-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[severity] || "bg-gray-100 text-gray-600"}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

function GapTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
      {type.replace(/-/g, " ")}
    </span>
  );
}

function TraceTimeline({ traces }: { traces: GapDrivenIngestionPlan["trace"] }) {
  return (
    <div className="space-y-2">
      {traces.map((t) => (
        <div key={t.agentId} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm">
          <span className={`h-2 w-2 rounded-full ${t.status === "success" ? "bg-green-500" : "bg-red-500"}`} />
          <span className="font-medium text-gray-900">{t.agentName}</span>
          <span className="text-gray-500">{t.gapsFound} gap(s)</span>
          <span className="text-gray-400">{t.elapsedMs}ms</span>
        </div>
      ))}
    </div>
  );
}

function CandidateCard({ candidate, index }: { candidate: GapDrivenIngestionPlan["highPriorityCandidates"][0]; index: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
            <span className="text-sm font-semibold text-gray-900">{candidate.title}</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Gap: {candidate.gapId}</p>
          <p className="mt-0.5 text-xs text-gray-500">Seed: {candidate.seedId}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
              Score: {candidate.matchScore}
            </span>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              {candidate.recommendedAgent}
            </span>
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              Review required
            </span>
          </div>
          {candidate.matchReasons.length > 0 && (
            <ul className="mt-2 space-y-0.5">
              {candidate.matchReasons.map((r, i) => (
                <li key={i} className="text-xs text-gray-600">• {r}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function GapRow({ gap }: { gap: SyllabusGap }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <GapTypeBadge type={gap.type} />
            <SeverityBadge severity={gap.severity} />
          </div>
          <p className="mt-1 text-sm font-medium text-gray-900">{gap.target.entityName}</p>
          <p className="text-xs text-gray-500">{gap.target.entityType}: {gap.target.entityId}</p>
          <p className="mt-0.5 text-xs text-gray-600">{gap.reason}</p>
          <details className="mt-1">
            <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600">Details</summary>
            <p className="mt-1 text-xs text-gray-500">{gap.detail}</p>
          </details>
        </div>
      </div>
    </div>
  );
}

export function GapDrivenIngestionPreview() {
  const result = useMemo(() => {
    const agentResult = runGapSubAgents();
    const prioritized = prioritizeKnowledgeGraphGaps(agentResult.allGaps);
    const importedIds = new Set(founderBetaSourceCatalog.map((s) => s.id));
    const plan = buildGapDrivenIngestionPlan(prioritized, discoverySeeds, importedIds);
    const summary = summarizeGapDrivenPlan(plan);
    return { agentResult, prioritized, plan, summary };
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gap-Driven Ingestion Engine</h1>
        <p className="mt-1 text-sm text-gray-500">
          Agents detect syllabus gaps, rank them, and recommend content to ingest next. No writes are performed.
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            ⚠ No write — preview only
          </span>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            {result.summary.totalGaps} gaps • {result.summary.totalCandidates} candidates
          </span>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Sub-Agent Traces</h2>
        <TraceTimeline traces={result.plan.trace} />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{result.summary.totalGaps}</p>
            <p className="text-xs text-gray-500">Total gaps</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{result.summary.highPriorityCount}</p>
            <p className="text-xs text-gray-500">High-priority candidates</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{result.summary.totalCandidates}</p>
            <p className="text-xs text-gray-500">Total candidates</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{result.summary.uncoveredGapCount}</p>
            <p className="text-xs text-gray-500">Uncovered gaps</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <p className="text-xs font-semibold text-gray-700">Top gap types</p>
            <ul className="mt-1 space-y-0.5">
              {result.summary.topGapTypes.map((g, i) => (
                <li key={i} className="text-xs text-gray-600">{g}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <p className="text-xs font-semibold text-gray-700">Top agent needs</p>
            <ul className="mt-1 space-y-0.5">
              {result.summary.topAgentNeeds.map((a, i) => (
                <li key={i} className="text-xs text-gray-600">{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {result.plan.highPriorityCandidates.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">High-Priority Candidates</h2>
          <div className="mt-2 space-y-3">
            {result.plan.highPriorityCandidates.map((c, i) => (
              <CandidateCard key={c.candidateId} candidate={c} index={i} />
            ))}
          </div>
        </section>
      )}

      {result.plan.mediumPriorityCandidates.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">Medium-Priority Candidates</h2>
          <div className="mt-2 space-y-2">
            {result.plan.mediumPriorityCandidates.map((c, i) => (
              <CandidateCard key={c.candidateId} candidate={c} index={i} />
            ))}
          </div>
        </section>
      )}

      {result.plan.uncoveredGaps.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">Uncovered Gaps (No matching seed)</h2>
          <div className="mt-2 space-y-2">
            {result.plan.uncoveredGaps.slice(0, 10).map((g) => (
              <GapRow key={g.id} gap={g} />
            ))}
            {result.plan.uncoveredGaps.length > 10 && (
              <p className="text-xs text-gray-500">...and {result.plan.uncoveredGaps.length - 10} more</p>
            )}
          </div>
        </section>
      )}

      <section className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-800">No autonomous graph writes</p>
        <p className="mt-1 text-xs text-red-700">
          This engine performs syllabus gap analysis only. It does not add sources, topics, skills, or capabilities to the
          canonical graph. All candidates require human review and explicit approval before any import.
        </p>
      </section>
    </div>
  );
}
