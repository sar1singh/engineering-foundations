"use client";

import { useCallback, useMemo, useState } from "react";
import type { AgentDiscoveryPreviewResult } from "@/lib/services/agent-discovery-simulator";
import {
  createInitialReviewStates,
  computeQueueSummary,
  filterResultsByQueue,
  getQueueFilterLabel,
  updateReviewDecision,
  addMappingOverride,
  removeMappingOverride
} from "@/lib/services/agent-discovery-review-service";
import type {
  ReviewDecision,
  CandidateReviewState,
  QueueFilter,
  QueueSummary,
  MappingOverride
} from "@/lib/services/agent-discovery-review-service";

const QUEUE_FILTERS: QueueFilter[] = [
  "all", "pending", "approved", "rejected", "needs-changes", "blocked"
];

function QueueSummaryCards({ summary }: { summary: QueueSummary }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <SummaryCard label="Total" value={summary.total} />
      <SummaryCard label="Pending" value={summary.pending} color="amber" />
      <SummaryCard label="Approved" value={summary.approved} color="green" />
      <SummaryCard label="Rejected" value={summary.rejected} color="red" />
      <SummaryCard label="Needs changes" value={summary.needsChanges} color="blue" />
      <SummaryCard label="Gate blocked" value={summary.blocked} color="gray" />
    </div>
  );
}

function SummaryCard({ label, value, color = "gray" }: { label: string; value: number; color?: string }) {
  const colors: Record<string, string> = {
    gray: "text-gray-700",
    green: "text-green-700",
    red: "text-red-700",
    amber: "text-amber-700",
    blue: "text-blue-700"
  };
  return (
    <div className="rounded-lg border bg-white p-3 text-center">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`mt-0.5 text-xl font-bold ${colors[color] || colors.gray}`}>{value}</p>
    </div>
  );
}

function FilterTabs({
  active,
  summary,
  onChange
}: {
  active: QueueFilter;
  summary: QueueSummary;
  onChange: (f: QueueFilter) => void;
}) {
  const counts: Record<QueueFilter, number> = {
    all: summary.total,
    pending: summary.pending,
    approved: summary.approved,
    rejected: summary.rejected,
    "needs-changes": summary.needsChanges,
    blocked: summary.blocked
  };
  return (
    <div className="flex flex-wrap gap-2">
      {QUEUE_FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            active === f
              ? "bg-teal-700 text-white"
              : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          {getQueueFilterLabel(f)} ({counts[f]})
        </button>
      ))}
    </div>
  );
}

function PublishBlockExplanation() {
  return (
    <div className="rounded border border-red-200 bg-red-50 p-3">
      <p className="text-sm font-semibold text-red-800">Agent cannot publish directly</p>
      <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-red-700">
        <li><strong>No runtime agents.</strong> This is a static simulation. All agent-discovered candidates are mock scenarios — no real discovery, scraping, or autonomous execution occurs.</li>
        <li>Agents cannot skip the human approval gate. All agent-discovered candidates must pass through manual review before reaching <code className="rounded bg-red-100 px-1">published</code> status.</li>
        <li>This is a <strong>preview-only</strong> simulation. Decisions, notes, and mapping overrides are <strong>session-only</strong> and are not persisted. No data is written to any database, file, or registry.</li>
        <li>Human approval is required when confidence is low (&lt; 0.4), duplicate risk is high (&ge; 0.7), or no tags are assigned.</li>
        <li>The publish boundary gate enforces that no agent can transition directly from <code className="rounded bg-red-100 px-1">discovered</code> or <code className="rounded bg-red-100 px-1">normalized</code> to <code className="rounded bg-red-100 px-1">published</code>.</li>
      </ul>
    </div>
  );
}

function ReviewActions({
  state,
  onDecision,
  onQualityNotesChange
}: {
  state: CandidateReviewState;
  onDecision: (scenarioId: string, decision: ReviewDecision, extra?: { rejectionReason?: string; needsChangesNotes?: string }) => void;
  onQualityNotesChange: (scenarioId: string, notes: string) => void;
}) {
  const [localRejectionReason, setLocalRejectionReason] = useState(state.rejectionReason);
  const [localNeedsChangesNotes, setLocalNeedsChangesNotes] = useState(state.needsChangesNotes);

  const handleApprove = () => onDecision(state.scenarioId, "approved");
  const handleReject = () => onDecision(state.scenarioId, "rejected", { rejectionReason: localRejectionReason });
  const handleNeedsChanges = () => onDecision(state.scenarioId, "needs-changes", { needsChangesNotes: localNeedsChangesNotes });
  const handleReset = () => {
    setLocalRejectionReason("");
    setLocalNeedsChangesNotes("");
    onDecision(state.scenarioId, "pending", { rejectionReason: "", needsChangesNotes: "" });
  };

  const decisionColors: Record<ReviewDecision, string> = {
    pending: "bg-gray-100 text-gray-600 border-gray-300",
    approved: "bg-green-100 text-green-700 border-green-300",
    rejected: "bg-red-100 text-red-700 border-red-300",
    "needs-changes": "bg-blue-100 text-blue-700 border-blue-300"
  };

  return (
    <div className="rounded border border-gray-200 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-semibold text-gray-700">Review decision:</span>
        <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${decisionColors[state.decision]}`}>
          {state.decision === "needs-changes" ? "Needs changes" : state.decision.charAt(0).toUpperCase() + state.decision.slice(1)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={handleApprove}
          disabled={state.decision === "approved"}
          className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Approve
        </button>
        <button
          onClick={handleReject}
          disabled={state.decision === "rejected"}
          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reject
        </button>
        <button
          onClick={handleNeedsChanges}
          disabled={state.decision === "needs-changes"}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Needs changes
        </button>
        <button
          onClick={handleReset}
          disabled={state.decision === "pending"}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset
        </button>
      </div>

      {state.decision === "rejected" && (
        <div className="mt-3">
          <label className="text-xs font-medium text-gray-600">Rejection reason</label>
          <textarea
            value={localRejectionReason}
            onChange={(e) => {
              setLocalRejectionReason(e.target.value);
              onDecision(state.scenarioId, "rejected", { rejectionReason: e.target.value, needsChangesNotes: state.needsChangesNotes });
            }}
            className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
            rows={2}
            placeholder="Required reason for rejection..."
          />
        </div>
      )}

      {state.decision === "needs-changes" && (
        <div className="mt-3">
          <label className="text-xs font-medium text-gray-600">What changes are needed</label>
          <textarea
            value={localNeedsChangesNotes}
            onChange={(e) => {
              setLocalNeedsChangesNotes(e.target.value);
              onDecision(state.scenarioId, "needs-changes", { needsChangesNotes: e.target.value });
            }}
            className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
            rows={2}
            placeholder="Describe required changes..."
          />
        </div>
      )}

      <div className="mt-3">
        <label className="text-xs font-medium text-gray-600">Quality notes</label>
        <textarea
          value={state.qualityNotes}
          onChange={(e) => onQualityNotesChange(state.scenarioId, e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
          rows={2}
          placeholder="Optional quality review notes..."
        />
      </div>
    </div>
  );
}

function MappingOverrideSection({
  state,
  result,
  onAddOverride,
  onRemoveOverride
}: {
  state: CandidateReviewState;
  result: AgentDiscoveryPreviewResult;
  onAddOverride: (scenarioId: string, override: Omit<MappingOverride, "id">) => void;
  onRemoveOverride: (scenarioId: string, overrideId: string) => void;
}) {
  const [overrideField, setOverrideField] = useState("");
  const [overrideValue, setOverrideValue] = useState("");
  const [overrideType, setOverrideType] = useState<"topic" | "source">("topic");
  const [overrideNotes, setOverrideNotes] = useState("");

  const handleAdd = useCallback(() => {
    if (!overrideField.trim() || !overrideValue.trim()) return;
    onAddOverride(state.scenarioId, {
      mappingType: overrideType,
      field: overrideField.trim(),
      originalValue: "",
      overriddenValue: overrideValue.trim(),
      notes: overrideNotes.trim()
    });
    setOverrideField("");
    setOverrideValue("");
    setOverrideNotes("");
  }, [state.scenarioId, overrideType, overrideField, overrideValue, overrideNotes, onAddOverride]);

  return (
    <div className="rounded border border-gray-200 p-4">
      <p className="mb-3 text-sm font-semibold text-gray-700">
        Mapping override preview <span className="font-normal text-gray-400">(session-only, not persisted)</span>
      </p>

      {state.mappingOverrides.length > 0 && (
        <div className="mb-3 space-y-1">
          {state.mappingOverrides.map((o) => (
            <div key={o.id} className="flex items-center justify-between rounded bg-gray-50 px-3 py-1.5 text-sm">
              <span>
                <span className="font-medium">{o.mappingType}</span>:{" "}
                <span className="text-gray-500">{o.field}</span> →{" "}
                <span className="font-medium text-blue-700">{o.overriddenValue}</span>
                {o.notes && <span className="ml-1 text-gray-400">({o.notes})</span>}
              </span>
              <button
                onClick={() => onRemoveOverride(state.scenarioId, o.id)}
                className="ml-2 text-xs font-semibold text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">Type:</label>
          <select
            value={overrideType}
            onChange={(e) => setOverrideType(e.target.value as "topic" | "source")}
            className="rounded border border-gray-300 px-2 py-1 text-xs"
          >
            <option value="topic">Topic</option>
            <option value="source">Source</option>
          </select>
        </div>
        <input
          value={overrideField}
          onChange={(e) => setOverrideField(e.target.value)}
          placeholder="Field (e.g. topicId)"
          className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
        />
        <input
          value={overrideValue}
          onChange={(e) => setOverrideValue(e.target.value)}
          placeholder="Override value"
          className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
        />
        <input
          value={overrideNotes}
          onChange={(e) => setOverrideNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="hidden flex-1 rounded border border-gray-300 px-2 py-1 text-xs sm:block"
        />
        <button
          onClick={handleAdd}
          disabled={!overrideField.trim() || !overrideValue.trim()}
          className="rounded bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add override
        </button>
      </div>

      {result.topicMappingResults.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium text-gray-500">Proposed topic mappings:</p>
          <div className="space-y-1">
            {result.topicMappingResults.map((r, i) => (
              <div
                key={i}
                className={`rounded px-2 py-1 text-xs ${
                  r.valid ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {r.valid ? "Valid" : r.errors.join("; ")}
              </div>
            ))}
          </div>
        </div>
      )}

      {result.sourceMappingResults.length > 0 && (
        <div className="mt-2">
          <p className="mb-1 text-xs font-medium text-gray-500">Proposed source mappings:</p>
          <div className="space-y-1">
            {result.sourceMappingResults.map((r, i) => (
              <div
                key={i}
                className={`rounded px-2 py-1 text-xs ${
                  r.valid ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {r.valid ? "Valid" : r.errors.join("; ")}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CandidateCard({
  result,
  reviewState,
  onDecision,
  onQualityNotesChange,
  onAddOverride,
  onRemoveOverride
}: {
  result: AgentDiscoveryPreviewResult;
  reviewState: CandidateReviewState;
  onDecision: (scenarioId: string, decision: ReviewDecision, extra?: { rejectionReason?: string; needsChangesNotes?: string }) => void;
  onQualityNotesChange: (scenarioId: string, notes: string) => void;
  onAddOverride: (scenarioId: string, override: Omit<MappingOverride, "id">) => void;
  onRemoveOverride: (scenarioId: string, overrideId: string) => void;
}) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className={`rounded-t-lg border-b px-5 py-3 ${
        result.finalGateStatus === "pass" ? "bg-green-50" : "bg-red-50"
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900">{result.agentName}</p>
            <p className="text-sm text-gray-500">{result.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                result.finalGateStatus === "pass"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${result.finalGateStatus === "pass" ? "bg-green-600" : "bg-red-600"}`} />
              {result.finalGateStatus === "pass" ? "Agent gate passed" : "Agent gate blocked"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <DetailRow label="Discovery method">{result.discoveryMethod}</DetailRow>
          <DetailRow label="Confidence">{result.confidence.toFixed(2)}</DetailRow>
          <DetailRow label="Attribution">
            {result.candidatePreview
              ? <span className="text-green-700">Present</span>
              : <span className="text-red-700">Missing</span>}
          </DetailRow>
          <DetailRow label="Duplicate risk">
            {result.duplicateRiskValidation
              ? <span className={result.duplicateRiskValidation.valid ? "text-green-700" : "text-red-700"}>
                  {result.duplicateRiskValidation.valid ? "None" : "High"}
                </span>
              : <span className="text-gray-400">Not assessed</span>}
          </DetailRow>
          <DetailRow label="Human approval">
            {result.requiresHumanApproval
              ? <span className="text-amber-700">Required</span>
              : <span className="text-green-700">Not required</span>}
          </DetailRow>
          <DetailRow label="Publish gate">
            {result.publishGateResult.valid
              ? <span className="text-green-700">Can proceed</span>
              : <span className="text-red-700">Blocked — {result.publishGateResult.errors[0]}</span>}
          </DetailRow>
        </div>

        {result.requiresHumanApproval && result.humanApprovalRationale.length > 0 && (
          <div className="rounded border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm font-semibold text-amber-800">Human approval required</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-amber-700">
              {result.humanApprovalRationale.map((reason, i) => <li key={i}>{reason}</li>)}
            </ul>
          </div>
        )}

        {result.candidatePreview && (
          <div className="rounded border border-gray-200 bg-gray-50 p-4">
            <p className="mb-2 text-sm font-semibold text-gray-700">Candidate preview</p>
            <div className="space-y-1 text-sm text-gray-600">
              <DetailRow label="Title">{result.candidatePreview.normalizedTitle}</DetailRow>
              <DetailRow label="URL">{result.candidatePreview.normalizedUrl}</DetailRow>
              <DetailRow label="Category">{result.candidatePreview.category}</DetailRow>
              <DetailRow label="Tags">{result.candidatePreview.tags.join(", ")}</DetailRow>
            </div>
          </div>
        )}

        {!result.agentDiscoveryValidation.valid && (
          <ValidationIssues title="Agent discovery validation errors" items={result.agentDiscoveryValidation.errors} />
        )}
        {result.agentDiscoveryValidation.warnings.length > 0 && (
          <WarningsList items={result.agentDiscoveryValidation.warnings} />
        )}
        {result.attributionValidation.warnings.length > 0 && (
          <ValidationIssues title="Attribution warnings" items={result.attributionValidation.warnings} />
        )}
        {result.duplicateRiskValidation && !result.duplicateRiskValidation.valid && (
          <ValidationIssues title="Duplicate risk validation errors" items={result.duplicateRiskValidation.errors} />
        )}
        {result.duplicateRiskValidation && result.duplicateRiskValidation.warnings.length > 0 && (
          <WarningsList items={result.duplicateRiskValidation.warnings} />
        )}
        {result.qualityResult && !result.qualityResult.valid && (
          <ValidationIssues title="Quality validation errors" items={result.qualityResult.errors} />
        )}

        <ReviewActions
          state={reviewState}
          onDecision={onDecision}
          onQualityNotesChange={onQualityNotesChange}
        />

        <MappingOverrideSection
          state={reviewState}
          result={result}
          onAddOverride={onAddOverride}
          onRemoveOverride={onRemoveOverride}
        />

        <PublishBlockExplanation />
      </div>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2 text-sm">
      <span className="font-medium text-gray-500">{label}:</span>
      <span className="text-gray-900">{children}</span>
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

export function AgentDiscoveryReview({ results }: { results: AgentDiscoveryPreviewResult[] }) {
  const [filter, setFilter] = useState<QueueFilter>("all");
  const [reviewStates, setReviewStates] = useState<Map<string, CandidateReviewState>>(
    () => createInitialReviewStates(results.map((r) => r.scenarioId))
  );

  const summary = useMemo(
    () => computeQueueSummary(Array.from(reviewStates.values()), results),
    [reviewStates, results]
  );

  const filteredResults = useMemo(
    () => filterResultsByQueue(filter, results, Array.from(reviewStates.values())),
    [filter, results, reviewStates]
  );

  const getReviewState = useCallback(
    (scenarioId: string) => {
      const s = reviewStates.get(scenarioId);
      if (!s) {
        return { scenarioId, decision: "pending" as const, qualityNotes: "", rejectionReason: "", needsChangesNotes: "", mappingOverrides: [] };
      }
      return s;
    },
    [reviewStates]
  );

  const handleDecision = useCallback(
    (scenarioId: string, decision: ReviewDecision, extra?: { rejectionReason?: string; needsChangesNotes?: string }) => {
      setReviewStates((prev) => {
        const next = new Map(prev);
        const current = next.get(scenarioId);
        if (current) {
          next.set(scenarioId, updateReviewDecision(current, decision, extra));
        }
        return next;
      });
    },
    []
  );

  const handleQualityNotesChange = useCallback(
    (scenarioId: string, notes: string) => {
      setReviewStates((prev) => {
        const next = new Map(prev);
        const current = next.get(scenarioId);
        if (current) {
          next.set(scenarioId, { ...current, qualityNotes: notes });
        }
        return next;
      });
    },
    []
  );

  const handleAddOverride = useCallback(
    (scenarioId: string, override: Omit<MappingOverride, "id">) => {
      setReviewStates((prev) => {
        const next = new Map(prev);
        const current = next.get(scenarioId);
        if (current) {
          next.set(scenarioId, addMappingOverride(current, override));
        }
        return next;
      });
    },
    []
  );

  const handleRemoveOverride = useCallback(
    (scenarioId: string, overrideId: string) => {
      setReviewStates((prev) => {
        const next = new Map(prev);
        const current = next.get(scenarioId);
        if (current) {
          next.set(scenarioId, removeMappingOverride(current, overrideId));
        }
        return next;
      });
    },
    []
  );

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-gray-500">No agent discovery scenarios to review.</p>
        <p className="mt-1 text-sm text-gray-400">Add scenarios to begin the review queue.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <QueueSummaryCards summary={summary} />

      <FilterTabs active={filter} summary={summary} onChange={setFilter} />

      <div className="space-y-6">
        {filteredResults.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-400">No candidates match the current filter.</p>
          </div>
        ) : (
          filteredResults.map((result) => (
            <CandidateCard
              key={result.scenarioId}
              result={result}
              reviewState={getReviewState(result.scenarioId)}
              onDecision={handleDecision}
              onQualityNotesChange={handleQualityNotesChange}
              onAddOverride={handleAddOverride}
              onRemoveOverride={handleRemoveOverride}
            />
          ))
        )}
      </div>
    </div>
  );
}
