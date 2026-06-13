"use client";

import { useCallback, useMemo, useState } from "react";
import { runIngestionAgent } from "@/lib/services/ingestion-agent-service";
import type { IngestionAgentResult, IngestionSubAgentStep } from "@/types/ingestion-agent";
import type { ContentSourceType } from "@/types/content-ingestion";
import {
  createInitialReviewState,
  computeQueueSummary,
  approveCandidate,
  rejectCandidate,
  markDuplicateRisk,
  needsChangesCandidate,
  resetDecision,
} from "@/lib/services/runtime-fetch-review-service";
import type { RuntimeFetchReviewState } from "@/lib/services/runtime-fetch-review-service";
import { founderBetaCapabilities, founderBetaSkills } from "@/data/founder-beta";
import { generatePatchFromApprovedCandidates, summarizePatch, serializePatch, validatePatch } from "@/lib/services/approved-import-patch-generator";
import type { ApprovedImportCandidate } from "@/types/ingestion-patch";

const SOURCE_TYPES: ContentSourceType[] = [
  "official-docs", "engineering-blog", "book", "interview-guide",
  "github-repository", "career-framework", "roadmap", "job-description", "practice-platform",
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
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

function StepIcon({ step }: { step: IngestionSubAgentStep }) {
  const colors: Record<string, string> = {
    fetch: "bg-blue-100 text-blue-700",
    validate: "bg-amber-100 text-amber-700",
    bridge: "bg-purple-100 text-purple-700",
    "duplicate-detection": "bg-pink-100 text-pink-700",
    "prepare-review": "bg-indigo-100 text-indigo-700",
  };
  const icons: Record<string, string> = {
    fetch: "F",
    validate: "V",
    bridge: "B",
    "duplicate-detection": "D",
    "prepare-review": "R",
  };
  return (
    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${colors[step.type] || "bg-gray-200 text-gray-500"}`}>
      {icons[step.type] || "?"}
    </div>
  );
}

function AgentTrace({ result }: { result: IngestionAgentResult }) {
  return (
    <div className="rounded border border-gray-200 bg-gray-50 p-4">
      <p className="mb-2 text-sm font-semibold text-gray-700">Agent trace</p>
      <div className="space-y-1 text-xs text-gray-600">
        <div className="flex flex-wrap items-baseline gap-2 text-sm">
          <span className="font-medium text-gray-500">Trace ID:</span>
          <span className="text-gray-900">{result.traceId}</span>
        </div>
        <div className="flex flex-wrap items-baseline gap-2 text-sm">
          <span className="font-medium text-gray-500">Duration:</span>
          <span className="text-gray-900">{result.durationMs}ms</span>
        </div>
        <div className="pt-2">
          <p className="mb-1.5 text-xs font-medium text-gray-500">Pipeline steps ({result.steps.length})</p>
          <div className="space-y-0">
            {result.steps.map((step, i) => {
              const stepElapsed = i === 0 ? step.durationMs : result.steps.slice(0, i + 1).reduce((acc, s) => acc + s.durationMs, 0);
              return (
                <div key={step.type} className="flex items-start gap-2">
                  <div className="flex flex-col items-center pt-0.5">
                    <StepIcon step={step} />
                    {i < result.steps.length - 1 && <div className="mt-0.5 h-3 w-px bg-gray-300" />}
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <span className={`text-xs ${step.hasError ? "font-medium text-red-700" : "font-medium text-gray-900"}`}>
                      {step.label}
                    </span>
                    <p className="truncate text-[11px] text-gray-500">{step.details}</p>
                  </div>
                  <span className="shrink-0 pt-0.5 text-[10px] text-gray-400">+{stepElapsed}ms</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function FetchResultCard({ result }: { result: IngestionAgentResult }) {
  if (!result.fetchStatus) return null;
  return (
    <div className="rounded border border-gray-200 p-4">
      <p className="mb-2 text-sm font-semibold text-gray-700">Fetch result</p>
      <div className="space-y-1 text-xs text-gray-600">
        <div className="flex flex-wrap items-baseline gap-2 text-sm">
          <span className="font-medium text-gray-500">Status:</span>
          <span className={`font-medium ${result.fetchStatus === "success" ? "text-green-700" : "text-red-700"}`}>
            {result.fetchStatus}
          </span>
        </div>
        <div className="flex flex-wrap items-baseline gap-2 text-sm">
          <span className="font-medium text-gray-500">URL:</span>
          <span className="text-gray-900">{result.candidateUrl}</span>
        </div>
        <div className="flex flex-wrap items-baseline gap-2 text-sm">
          <span className="font-medium text-gray-500">Gate:</span>
          <GateBadge gateStatus={result.gateStatus} />
        </div>
      </div>
    </div>
  );
}

function ValidationSection({ result }: { result: IngestionAgentResult }) {
  if (result.errors.length === 0 && result.warnings.length === 0) {
    return (
      <div className="rounded border border-green-200 bg-green-50 p-3">
        <p className="text-sm font-semibold text-green-800">All validations passed</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {result.errors.length > 0 && (
        <div className="rounded border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-semibold text-red-800">Errors ({result.errors.length})</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-red-700">
            {result.errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}
      {result.warnings.length > 0 && (
        <div className="rounded border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm font-semibold text-amber-800">Warnings ({result.warnings.length})</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-amber-700">
            {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function PatchPreviewSection({ patch }: { patch: NonNullable<ReturnType<typeof generatePatchFromApprovedCandidates>> }) {
  const report = summarizePatch(patch);
  const validation = validatePatch(patch);
  const jsonPreview = useMemo(() => serializePatch(patch), [patch]);
  const [showJson, setShowJson] = useState(false);

  return (
    <div className="rounded-lg border bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-indigo-700">Pack 10G — Approved Import Patch Generator</h3>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800">
          Processed: {report.candidatesProcessed}
        </span>
        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
          Skipped: {report.candidatesSkipped}
        </span>
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
          Entries: {report.entriesGenerated}
        </span>
        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
          Conflicts: {report.conflicts.length}
        </span>
      </div>

      <div className="mb-4 space-y-2 text-xs text-gray-600">
        <p><span className="font-medium text-gray-700">Sources:</span> {report.sourceEntries}</p>
        <p><span className="font-medium text-gray-700">Topics:</span> {report.topicEntries}</p>
        {validation.warnings.length > 0 && (
          <div className="rounded border border-amber-200 bg-amber-50 p-2">
            <p className="font-medium text-amber-800">Warnings ({validation.warnings.length})</p>
            <ul className="mt-1 list-inside list-disc text-amber-700">
              {validation.warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}
      </div>

      {report.conflicts.length > 0 && (
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-medium text-gray-700">Conflicts</p>
          <div className="space-y-1">
            {report.conflicts.map((c, i) => (
              <div key={i} className={`rounded border px-3 py-2 text-xs ${
                c.severity === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800"
              }`}>
                <span className="font-medium">{c.severity === "error" ? "✗" : "⚠"} [{c.entryType}]</span> {c.message}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4 space-y-1">
        <p className="text-xs font-medium text-gray-700">Patch entries</p>
        {patch.entries.slice(0, 10).map((entry, i) => (
          <div key={i} className="rounded border border-gray-200 px-3 py-2 text-xs text-gray-600">
            <span className="font-medium text-gray-800">{entry.operation === "add" ? "+" : "~"} {entry.type}</span>
            : {entry.type === "source" ? entry.sourceId : entry.type === "topic" ? entry.topicId : ""}
          </div>
        ))}
        {patch.entries.length > 10 && (
          <p className="text-[11px] text-gray-400">...and {patch.entries.length - 10} more entries</p>
        )}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => setShowJson((v) => !v)}
          className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100"
        >
          {showJson ? "Hide JSON preview" : "Show JSON preview"}
        </button>
        <p className="text-[11px] text-gray-400">
          Path: data/ingestion/generated/approved-import-patch.preview.json
        </p>
      </div>

      {showJson && (
        <pre className="max-h-96 overflow-auto rounded border border-gray-200 bg-gray-50 p-3 text-[11px] text-gray-700">
          {jsonPreview}
        </pre>
      )}

      <div className="rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        <p className="font-semibold">Preview only — no apply button.</p>
        <p className="mt-0.5">This patch preview shows what would be added to canonical data files. No files have been modified.</p>
      </div>
    </div>
  );
}

function ReviewQueueSection({
  reviewStates,
  onApprove,
  onReject,
  onDuplicateRisk,
  onNeedsChanges,
  onReset,
  rejectionInputs,
  changesInputs,
  onRejectionInputChange,
  onChangesInputChange,
}: {
  reviewStates: RuntimeFetchReviewState[];
  onApprove: (url: string) => void;
  onReject: (url: string, reason: string) => void;
  onDuplicateRisk: (url: string, warning: string) => void;
  onNeedsChanges: (url: string, notes: string) => void;
  onReset: (url: string) => void;
  rejectionInputs: Record<string, string>;
  changesInputs: Record<string, string>;
  onRejectionInputChange: (url: string, value: string) => void;
  onChangesInputChange: (url: string, value: string) => void;
}) {
  const summary = computeQueueSummary(reviewStates);

  if (reviewStates.length === 0) {
    return (
      <div className="rounded border border-gray-200 p-4 text-center">
        <p className="text-sm text-gray-500">No candidates in review queue.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
          Total: {summary.total}
        </span>
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
          Pending: {summary.pending}
        </span>
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
          Approved: {summary.approved}
        </span>
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
          Rejected: {summary.rejected}
        </span>
        <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-800">
          Duplicate: {summary.duplicateRisk}
        </span>
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
          Changes: {summary.needsChanges}
        </span>
      </div>

      {reviewStates.map((rs) => (
        <div key={rs.candidateUrl} className="rounded border border-gray-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{rs.candidateUrl}</p>
              <p className="text-xs text-gray-500">ID: {rs.candidateId}</p>
            </div>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
              rs.decision === "pending" ? "bg-yellow-100 text-yellow-800" :
              rs.decision === "approved" ? "bg-green-100 text-green-800" :
              rs.decision === "rejected" ? "bg-red-100 text-red-800" :
              rs.decision === "duplicate-risk" ? "bg-orange-100 text-orange-800" :
              "bg-blue-100 text-blue-800"
            }`}>
              {rs.decision}
            </span>
          </div>

          {rs.duplicateWarning && (
            <div className="mt-2 rounded border border-orange-200 bg-orange-50 p-2">
              <p className="text-xs font-medium text-orange-800">⚠ Duplicate: {rs.duplicateWarning}</p>
            </div>
          )}

          {rs.rejectionReason && (
            <div className="mt-2 rounded border border-red-200 bg-red-50 p-2">
              <p className="text-xs font-medium text-red-800">Rejection reason: {rs.rejectionReason}</p>
            </div>
          )}

          {rs.needsChangesNotes && (
            <div className="mt-2 rounded border border-blue-200 bg-blue-50 p-2">
              <p className="text-xs font-medium text-blue-800">Changes requested: {rs.needsChangesNotes}</p>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {rs.decision === "pending" ? (
              <>
                <button
                  onClick={() => onApprove(rs.candidateUrl)}
                  className="rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
                >
                  Approve
                </button>
                <div className="flex items-center gap-1">
                  <input
                    value={rejectionInputs[rs.candidateUrl] || ""}
                    onChange={(e) => onRejectionInputChange(rs.candidateUrl, e.target.value)}
                    placeholder="Reason..."
                    className="w-32 rounded border border-gray-300 px-2 py-1 text-xs"
                  />
                  <button
                    onClick={() => onReject(rs.candidateUrl, rejectionInputs[rs.candidateUrl] || "No reason given")}
                    disabled={!rejectionInputs[rs.candidateUrl]?.trim()}
                    className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
                <button
                  onClick={() => onDuplicateRisk(rs.candidateUrl, rs.duplicateWarning || "Potential duplicate")}
                  className="rounded bg-orange-600 px-3 py-1 text-xs font-semibold text-white hover:bg-orange-700"
                >
                  Mark Duplicate
                </button>
                <div className="flex items-center gap-1">
                  <input
                    value={changesInputs[rs.candidateUrl] || ""}
                    onChange={(e) => onChangesInputChange(rs.candidateUrl, e.target.value)}
                    placeholder="Notes..."
                    className="w-32 rounded border border-gray-300 px-2 py-1 text-xs"
                  />
                  <button
                    onClick={() => onNeedsChanges(rs.candidateUrl, changesInputs[rs.candidateUrl] || "Needs changes")}
                    disabled={!changesInputs[rs.candidateUrl]?.trim()}
                    className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Needs Changes
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => onReset(rs.candidateUrl)}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      ))}

      {summary.approved > 0 && (
        <div className="rounded border border-green-200 bg-green-50 p-4 text-center">
          <p className="text-sm font-semibold text-green-800">
            Publish Preview (read-only) — {summary.approved} candidate(s) approved.
          </p>
          <p className="text-xs text-green-600">No real publishing — session-only preview.</p>
        </div>
      )}
    </div>
  );
}

export function IngestionAgentPreview() {
  const [url, setUrl] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [sourceType, setSourceType] = useState<ContentSourceType>("official-docs");
  const [capabilityId, setCapabilityId] = useState("");
  const [skillId, setSkillId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<IngestionAgentResult | null>(null);
  const [ran, setRan] = useState(false);
  const [reviewStates, setReviewStates] = useState<RuntimeFetchReviewState[]>([]);
  const [rejectionInputs, setRejectionInputs] = useState<Record<string, string>>({});
  const [changesInputs, setChangesInputs] = useState<Record<string, string>>({});
  const [candidateInfoByUrl, setCandidateInfoByUrl] = useState<Record<string, { title: string; sourceType: string; category: string; description: string }>>({});

  const capabilitiesList = founderBetaCapabilities ?? [];
  const skillsList = founderBetaSkills ?? [];
  const filteredSkills = skillsList.filter((s) => !capabilityId || s.capabilityId === capabilityId);

  const approvedCandidates = useMemo((): ApprovedImportCandidate[] => {
    return reviewStates
      .filter((rs) => rs.decision === "approved")
      .map((rs) => {
        const info = candidateInfoByUrl[rs.candidateUrl];
        return {
          candidateUrl: rs.candidateUrl,
          candidateId: rs.candidateId,
          title: info?.title || "Untitled",
          sourceType: (info?.sourceType || "engineering-blog") as ApprovedImportCandidate["sourceType"],
          category: info?.category || "General",
          description: info?.description || "Approved import candidate.",
          tier: "tier-2" as const,
          reliability: "medium" as const,
          overrideDuplicateRisk: rs.duplicateWarning ? true : false,
        };
      });
  }, [candidateInfoByUrl, reviewStates]);

  const patch = useMemo(() => {
    if (approvedCandidates.length === 0) return null;
    return generatePatchFromApprovedCandidates(approvedCandidates);
  }, [approvedCandidates]);

  const handleRun = useCallback(() => {
    const agentResult = runIngestionAgent({
      url: url.trim(),
      submittedBy: submittedBy.trim() || "anonymous",
      sourceType,
      capabilityId: capabilityId || undefined,
      skillId: skillId || undefined,
      topicId: topicId || undefined,
      notes: notes.trim() || undefined,
    });
    setResult(agentResult);
    setRan(true);

    setCandidateInfoByUrl((prev) => ({
      ...prev,
      [agentResult.candidateUrl]: {
        title: agentResult.candidateUrl.split("/").pop()?.replace(/[-_]/g, " ") || "Untitled",
        sourceType: sourceType,
        category: "General",
        description: notes.trim() || "Imported via ingestion agent.",
      },
    }));

    const duplicateWarning = agentResult.duplicateWarning;
    const newState = createInitialReviewState(agentResult.candidateUrl, {
      duplicateWarning: duplicateWarning || undefined,
      candidateId: agentResult.candidateId,
    });
    setReviewStates((prev) => {
      const exists = prev.some((s) => s.candidateUrl === agentResult.candidateUrl);
      if (exists) return prev;
      return [...prev, newState];
    });
  }, [url, submittedBy, sourceType, capabilityId, skillId, topicId, notes]);

  const handleApprove = useCallback((candidateUrl: string) => {
    setReviewStates((prev) => approveCandidate(prev, candidateUrl));
  }, []);

  const handleReject = useCallback((candidateUrl: string, reason: string) => {
    setReviewStates((prev) => rejectCandidate(prev, candidateUrl, reason));
  }, []);

  const handleDuplicateRisk = useCallback((candidateUrl: string, warning: string) => {
    setReviewStates((prev) => markDuplicateRisk(prev, candidateUrl, warning));
  }, []);

  const handleNeedsChanges = useCallback((candidateUrl: string, notes: string) => {
    setReviewStates((prev) => needsChangesCandidate(prev, candidateUrl, notes));
  }, []);

  const handleReset = useCallback((candidateUrl: string) => {
    setReviewStates((prev) => resetDecision(prev, candidateUrl));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-indigo-700">Pack 10F — Sub-Agent Ingestion Pipeline V1</p>
        <h2 className="mt-1 text-lg font-semibold">Ingestion Agent (Sub-Agent Pipeline)</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Runs five explicit sub-agents in sequence: fetch → validate → bridge → duplicate detection → review preparation. Each sub-agent is traced independently with status and timing. Session-only — no writes, no persistence.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ingestion-url" className="block text-xs font-medium text-gray-600">URL</label>
            <input
              id="ingestion-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="ingestion-submitted-by" className="block text-xs font-medium text-gray-600">Submitted by</label>
            <input
              id="ingestion-submitted-by"
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
              placeholder="e.g. sar1s"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="ingestion-source-type" className="block text-xs font-medium text-gray-600">Source type</label>
            <select
              id="ingestion-source-type"
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value as ContentSourceType)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              {SOURCE_TYPES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ingestion-capability" className="block text-xs font-medium text-gray-600">Capability (optional)</label>
            <select
              id="ingestion-capability"
              value={capabilityId}
              onChange={(e) => setCapabilityId(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">-- None --</option>
              {capabilitiesList.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ingestion-skill" className="block text-xs font-medium text-gray-600">Skill (optional)</label>
            <select
              id="ingestion-skill"
              value={skillId}
              onChange={(e) => setSkillId(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">-- None --</option>
              {filteredSkills.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ingestion-topic" className="block text-xs font-medium text-gray-600">Topic (optional)</label>
            <select
              id="ingestion-topic"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">-- None --</option>
              <option value="topic-aws-well-architected">AWS Well-Architected</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="ingestion-notes" className="block text-xs font-medium text-gray-600">Notes (optional)</label>
            <input
              id="ingestion-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional context"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleRun}
            disabled={!url.trim()}
            className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Run Ingestion Agent
          </button>
          <p className="text-xs text-gray-400">Dry-run only — no real HTTP fetch.</p>
        </div>
      </div>

      {ran && result ? (
        <div className="space-y-6">
          <div className="rounded-lg border bg-white shadow-sm">
            <div className={`rounded-t-lg border-b px-5 py-3 ${
              result.status === "completed" && result.errors.length === 0 ? "bg-green-50" : "bg-red-50"
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-gray-900">Ingestion Agent Result</p>
                <div className="flex items-center gap-2">
                  <StatusBadge status={result.status} />
                  <GateBadge gateStatus={result.gateStatus} />
                </div>
              </div>
            </div>
            <div className="space-y-4 p-5">
              <AgentTrace result={result} />
              <FetchResultCard result={result} />
              <ValidationSection result={result} />
            </div>
          </div>

          <div className="rounded-lg border bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Review Queue</h3>
            <ReviewQueueSection
              reviewStates={reviewStates}
              onApprove={handleApprove}
              onReject={handleReject}
              onDuplicateRisk={handleDuplicateRisk}
              onNeedsChanges={handleNeedsChanges}
              onReset={handleReset}
              rejectionInputs={rejectionInputs}
              changesInputs={changesInputs}
              onRejectionInputChange={(url, value) => setRejectionInputs((prev) => ({ ...prev, [url]: value }))}
              onChangesInputChange={(url, value) => setChangesInputs((prev) => ({ ...prev, [url]: value }))}
            />
          </div>

          {patch && (
            <PatchPreviewSection patch={patch} />
          )}
        </div>
      ) : ran ? null : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium text-gray-500">No ingestion results yet.</p>
          <p className="mt-1 text-sm text-gray-400">Enter a URL and click Run Ingestion Agent to start the pipeline.</p>
        </div>
      )}
    </div>
  );
}
