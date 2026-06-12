"use client";

import { useCallback, useState } from "react";
import { runMockAgent } from "@/lib/services/agent-runner-service";
import type { AgentRunType, AgentRunResult } from "@/types/agent-runner";

const AGENT_TYPE_OPTIONS: { value: AgentRunType; label: string; description: string }[] = [
  { value: "resource-discovery", label: "Resource Discovery", description: "Discovers content candidates from web sources" },
  { value: "topic-mapping", label: "Topic Mapping", description: "Maps normalized content to topics/skills" },
  { value: "quality-review", label: "Quality Review", description: "Reviews content quality and scores dimensions" },
  { value: "duplicate-detection", label: "Duplicate Detection", description: "Assesses duplicate risk against existing content" }
];

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2 text-sm">
      <span className="font-medium text-gray-500">{label}:</span>
      <span className="text-gray-900">{children}</span>
    </div>
  );
}

function GateBadge({ gateStatus }: { gateStatus: "pass" | "blocked" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        gateStatus === "pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${gateStatus === "pass" ? "bg-green-600" : "bg-red-600"}`} />
      Publish gate: {gateStatus === "pass" ? "Pass" : "Blocked"}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    running: "bg-blue-100 text-blue-800",
    pending: "bg-gray-100 text-gray-600",
    failed: "bg-red-100 text-red-800"
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[status] || colors.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function TracePanel({ trace }: { trace: AgentRunResult["trace"] }) {
  return (
    <div className="rounded border border-gray-200 bg-gray-50 p-4">
      <p className="mb-2 text-sm font-semibold text-gray-700">Trace</p>
      <div className="space-y-1 text-xs text-gray-600">
        <DetailRow label="Trace ID">{trace.traceId}</DetailRow>
        <DetailRow label="Agent type">{trace.agentType}</DetailRow>
        <DetailRow label="Duration">{trace.durationMs}ms</DetailRow>
        <div className="pt-1">
          <p className="mb-1 text-xs font-medium text-gray-500">Timeline ({trace.steps.length} steps)</p>
          <div className="space-y-0">
            {trace.steps.map((s, i) => {
              const stepElapsed = Math.round((trace.durationMs / trace.steps.length) * (i + 1));
              return (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      i === trace.steps.length - 1
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-200 text-gray-500"
                    }`}>
                      {i + 1}
                    </div>
                    {i < trace.steps.length - 1 && <div className="mt-0.5 h-3 w-px bg-gray-300" />}
                  </div>
                  <span className={`pt-0.5 ${i === trace.steps.length - 1 ? "font-medium text-gray-900" : "text-gray-600"}`}>
                    {s}
                  </span>
                  <span className="ml-auto pt-0.5 text-[10px] text-gray-400">+{stepElapsed}ms</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ValidationIssues({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded border border-red-200 bg-red-50 p-3">
      <p className="text-sm font-semibold text-red-800">{title}</p>
      <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-red-700">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}

function WarningsList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded border border-amber-200 bg-amber-50 p-3">
      <p className="text-sm font-semibold text-amber-800">Warnings</p>
      <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-amber-700">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}

function OutputPanel({ result }: { result: AgentRunResult }) {
  const { output } = result;

  return (
    <div className="space-y-4">
      {output.candidates.length > 0 && (
        <div className="rounded border border-gray-200 p-4">
          <p className="mb-2 text-sm font-semibold text-gray-700">Candidates ({output.candidates.length})</p>
          <div className="space-y-2">
            {output.candidates.map((c) => (
              <div key={c.id} className="rounded bg-gray-50 p-2 text-xs">
                <DetailRow label="ID">{c.id}</DetailRow>
                <DetailRow label="Title">{c.title}</DetailRow>
                <DetailRow label="Confidence">{c.estimatedConfidence.toFixed(2)}</DetailRow>
                <DetailRow label="Tags">{c.tags.join(", ")}</DetailRow>
              </div>
            ))}
          </div>
        </div>
      )}

      {output.topicMappings.length > 0 && (
        <div className="rounded border border-gray-200 p-4">
          <p className="mb-2 text-sm font-semibold text-gray-700">Topic mappings ({output.topicMappings.length})</p>
          <div className="space-y-2">
            {output.topicMappings.map((m) => (
              <div key={m.id} className="rounded bg-gray-50 p-2 text-xs">
                <DetailRow label="Topic">{m.topicName} ({m.topicId})</DetailRow>
                <DetailRow label="Relevance">{m.relevanceScore.toFixed(2)}</DetailRow>
              </div>
            ))}
          </div>
        </div>
      )}

      {output.reviews.length > 0 && (
        <div className="rounded border border-gray-200 p-4">
          <p className="mb-2 text-sm font-semibold text-gray-700">Quality review</p>
          {output.reviews.map((r) => (
            <div key={r.id} className="space-y-1 text-xs">
              <DetailRow label="Overall score">{r.overallScore.toFixed(2)}</DetailRow>
              <DetailRow label="Passed">{r.passed ? "Yes" : "No"}</DetailRow>
              <DetailRow label="Issues">{r.issues.length > 0 ? r.issues.join("; ") : "None"}</DetailRow>
            </div>
          ))}
        </div>
      )}

      {output.duplicateAssessments.length > 0 && (
        <div className="rounded border border-gray-200 p-4">
          <p className="mb-2 text-sm font-semibold text-gray-700">Duplicate assessment</p>
          {output.duplicateAssessments.map((d) => (
            <div key={d.assessedBy + d.assessedAt} className="space-y-1 text-xs">
              <DetailRow label="Similarity score">{d.similarityScore.toFixed(2)}</DetailRow>
              <DetailRow label="Overlapping topics">{d.overlappingTopicIds.length > 0 ? d.overlappingTopicIds.join(", ") : "None"}</DetailRow>
              <DetailRow label="Notes">{d.notes}</DetailRow>
            </div>
          ))}
        </div>
      )}

      {output.normalizedItems.length > 0 && (
        <div className="rounded border border-gray-200 p-4">
          <p className="mb-2 text-sm font-semibold text-gray-700">Normalized items ({output.normalizedItems.length})</p>
          {output.normalizedItems.map((n) => (
            <div key={n.id} className="rounded bg-gray-50 p-2 text-xs">
              <DetailRow label="ID">{n.id}</DetailRow>
              <DetailRow label="Title">{n.normalizedTitle}</DetailRow>
              <DetailRow label="Confidence">{n.confidenceScore.toFixed(2)}</DetailRow>
            </div>
          ))}
        </div>
      )}

      {output.warnings.length > 0 && <WarningsList items={output.warnings} />}
    </div>
  );
}

function ResultCard({ result }: { result: AgentRunResult }) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className={`rounded-t-lg border-b px-5 py-3 ${
        result.status === "completed" && result.boundaryResult.valid ? "bg-green-50" : "bg-red-50"
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900">Result</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={result.status} />
            <GateBadge gateStatus={result.gateStatus} />
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <TracePanel trace={result.trace} />

        <div className="rounded border border-gray-200 p-4">
          <p className="mb-2 text-sm font-semibold text-gray-700">Boundary / Structure validation</p>
          {result.boundaryResult.valid
            ? <p className="text-sm text-green-700">All structural checks passed</p>
            : <p className="text-sm text-red-700">Structure validation failed</p>}
          <ValidationIssues title="Structure errors" items={result.boundaryResult.errors} />
          <WarningsList items={result.boundaryResult.warnings} />
        </div>

        <OutputPanel result={result} />
      </div>
    </div>
  );
}

const INITIAL_STATE = {
  agentType: "resource-discovery" as AgentRunType,
  topicHint: "",
  categoryHint: "",
  result: null as AgentRunResult | null
};

export function AgentRunnerPreview() {
  const [state, setState] = useState(INITIAL_STATE);

  const handleRun = useCallback(() => {
    const result = runMockAgent({
      agentType: state.agentType,
      topicHint: state.topicHint || undefined,
      categoryHint: state.categoryHint || undefined
    });
    setState((prev) => ({ ...prev, result }));
  }, [state.agentType, state.topicHint, state.categoryHint]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-indigo-700">Phase 8E — Dry-Run Agent Runner</p>
        <h2 className="mt-1 text-lg font-semibold">Mock Agent Runner</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Select a mock agent type, optionally provide hints, and run a dry-run simulation. The runner generates mock output, runs boundary assertions, and reports gate status. All runs are session-only — no writes, no persistence.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-lg border bg-white p-4">
        <div className="min-w-[200px] flex-1">
          <label htmlFor="agent-type-select" className="block text-xs font-medium text-gray-600">Agent type</label>
          <select
            id="agent-type-select"
            value={state.agentType}
            onChange={(e) => setState((prev) => ({ ...prev, agentType: e.target.value as AgentRunType }))}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            {AGENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <p className="mt-0.5 text-xs text-gray-400">
            {AGENT_TYPE_OPTIONS.find((o) => o.value === state.agentType)?.description}
          </p>
        </div>

        <div className="min-w-[160px] flex-1">
          <label className="block text-xs font-medium text-gray-600">Topic hint (optional)</label>
          <input
            value={state.topicHint}
            onChange={(e) => setState((prev) => ({ ...prev, topicHint: e.target.value }))}
            placeholder="e.g. aws-architecture"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="min-w-[120px] flex-1">
          <label className="block text-xs font-medium text-gray-600">Category hint (optional)</label>
          <input
            value={state.categoryHint}
            onChange={(e) => setState((prev) => ({ ...prev, categoryHint: e.target.value }))}
            placeholder="e.g. aws"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <button
          onClick={handleRun}
          className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Run
        </button>
      </div>

      {state.result ? (
        <ResultCard result={state.result} />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium text-gray-500">No dry-run results yet.</p>
          <p className="mt-1 text-sm text-gray-400">Select an agent type and click Run to start a simulation.</p>
        </div>
      )}
    </div>
  );
}
