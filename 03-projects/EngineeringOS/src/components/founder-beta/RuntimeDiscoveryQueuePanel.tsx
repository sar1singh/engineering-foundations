"use client";

import { useState, useCallback } from "react";
import { processDiscoveryQueue, validateBatchInput, summarizeQueue } from "@/lib/services/runtime-discovery-queue-service";
import type { RuntimeDiscoveryQueueItem, RuntimeDiscoveryQueueSummary } from "@/types/runtime-discovery-queue";
import type { RuntimeSubAgentTrace, RuntimeSubAgentType, PipelineResult } from "@/types/runtime-sub-agent";
import type { ContentSourceType } from "@/types/content-ingestion";
import { createBatchImportReviewPackage, generateBatchPatchPreview, summarizeBatchReviewBridge, summarizeBatchReviewPackage } from "@/lib/services/runtime-discovery-review-bridge";
import type { BatchReviewSummary } from "@/lib/services/runtime-discovery-review-bridge";
import { approvePatchEntry, rejectPatchEntry } from "@/lib/services/import-review-service";
import { createApprovedBatchPatch, serializeApprovedBatchPatch } from "@/lib/services/approved-batch-patch-output-service";
import type { ApprovedBatchPatchOutput } from "@/lib/services/approved-batch-patch-output-service";
import { applyPatchToInMemoryGraph, summarizeGraphImport } from "@/lib/services/in-memory-graph-import-service";
import type { GraphImportResult } from "@/lib/services/in-memory-graph-import-service";
import { generateCanonicalPatchProposal, serializeCanonicalPatchProposal } from "@/lib/services/canonical-graph-patch-service";
import type { CanonicalGraphPatchProposal } from "@/types/canonical-graph-patch";
import type { ApprovedImportPackage } from "@/types/import-review";
import type { ImportPatch } from "@/types/ingestion-patch";

const AGENT_LABELS: Record<RuntimeSubAgentType, string> = {
  "validation-agent": "Validation Agent",
  "metadata-agent": "Metadata Agent",
  "candidate-agent": "Candidate Agent",
  "duplicate-agent": "Duplicate Agent",
  "review-agent": "Review Agent",
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    running: "bg-blue-100 text-blue-800",
    failed: "bg-red-100 text-red-800",
    "duplicate-risk": "bg-orange-100 text-orange-800",
    "review-required": "bg-purple-100 text-purple-800",
    queued: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status === "duplicate-risk" ? "Duplicate Risk" : status === "review-required" ? "Review Required" : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function AgentStepCard({ entry, index }: { entry: RuntimeSubAgentTrace; index: number }) {
  const isLast = index === 4;
  return (
    <div className="flex items-start gap-2">
      <div className="flex flex-col items-center">
        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${entry.success ? "bg-green-500" : "bg-red-500"}`}>
          {index + 1}
        </div>
        {!isLast && <div className="mt-0.5 h-4 w-0.5 bg-gray-300" />}
      </div>
      <div className={`flex-1 rounded border p-2 ${entry.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-800">{AGENT_LABELS[entry.agentType]}</span>
          <StatusBadge status={entry.success ? "completed" : "failed"} />
        </div>
        <div className="mt-0.5 text-[10px] text-gray-500">{entry.elapsedMs}ms</div>
        {entry.warnings.length > 0 && (
          <div className="mt-0.5 space-y-0.5">
            {entry.warnings.map((w, j) => (
              <p key={j} className="text-[10px] text-amber-600">warn: {w}</p>
            ))}
          </div>
        )}
        {entry.errors.length > 0 && (
          <div className="mt-0.5 space-y-0.5">
            {entry.errors.map((e, j) => (
              <p key={j} className="text-[10px] text-red-600">error: {e}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PipelineMiniView({ trace }: { trace: RuntimeSubAgentTrace[] }) {
  return (
    <div className="rounded border border-gray-200 bg-gray-50 p-3">
      <p className="mb-2 text-xs font-semibold text-gray-700">Sub-Agent Pipeline</p>
      <div className="space-y-0.5">
        {trace.map((entry, i) => (
          <AgentStepCard key={entry.agentType} entry={entry} index={i} />
        ))}
      </div>
    </div>
  );
}

function ResultDetails({ result }: { result: PipelineResult }) {
  return (
    <div className="mt-2 space-y-2">
      {result.metadata && (
        <div className="rounded border border-gray-200 bg-white p-2">
          <p className="text-xs font-semibold text-gray-700 mb-1">Metadata</p>
          <div className="space-y-0.5 text-[10px]">
            <p><span className="font-medium text-gray-500">Title:</span> {result.metadata.metadata.title}</p>
            <p><span className="font-medium text-gray-500">Description:</span> {result.metadata.metadata.description}</p>
            <p><span className="font-medium text-gray-500">Domain:</span> {result.metadata.metadata.domain}</p>
          </div>
        </div>
      )}
      {result.candidate && (
        <div className="rounded border border-gray-200 bg-white p-2">
          <p className="text-xs font-semibold text-gray-700 mb-1">Candidate</p>
          <div className="space-y-0.5 text-[10px]">
            <p><span className="font-medium text-gray-500">ID:</span> <span className="font-mono">{result.candidate.candidate.id}</span></p>
            <p><span className="font-medium text-gray-500">Title:</span> {result.candidate.candidate.title}</p>
            <p><span className="font-medium text-gray-500">Confidence:</span> {result.candidate.candidate.estimatedConfidence}</p>
          </div>
        </div>
      )}
      {result.duplicate && (
        <div className="rounded border border-gray-200 bg-white p-2">
          <p className="text-xs font-semibold text-gray-700 mb-1">Duplicate Detection</p>
          <p className="text-[10px]">{result.duplicate.duplicateInfo.isDuplicate ? `${result.duplicate.duplicateInfo.matches.length} match(es) found` : "No duplicates"}</p>
        </div>
      )}
      {result.review && (
        <div className="rounded border border-gray-200 bg-white p-2">
          <p className="text-xs font-semibold text-gray-700 mb-1">Review</p>
          <p className="text-[10px]">Approval required: {result.review.humanApprovalRequired ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}

function QueueItemCard({
  item,
  expanded,
  onToggle,
}: {
  item: RuntimeDiscoveryQueueItem;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded border border-gray-200 bg-white">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-3 text-left hover:bg-gray-50"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-gray-900">{item.url}</span>
            <StatusBadge status={item.status} />
          </div>
          {item.completedAt && (
            <p className="mt-0.5 text-[10px] text-gray-400">
              Completed: {new Date(item.completedAt).toLocaleTimeString()}
            </p>
          )}
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && item.result && (
        <div className="border-t border-gray-100 p-3 space-y-2">
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span>{item.result.durationMs}ms total</span>
            <span className="text-gray-300">|</span>
            <span>{item.result.trace.length} agent steps</span>
            {item.result.warnings.length > 0 && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-amber-600">{item.result.warnings.length} warning(s)</span>
              </>
            )}
          </div>
          <PipelineMiniView trace={item.result.trace} />
          <ResultDetails result={item.result} />
        </div>
      )}
    </div>
  );
}

export default function RuntimeDiscoveryQueuePanel() {
  const [urlText, setUrlText] = useState("");
  const [items, setItems] = useState<RuntimeDiscoveryQueueItem[]>([]);
  const [summary, setSummary] = useState<RuntimeDiscoveryQueueSummary | null>(null);
  const [running, setRunning] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [submittedBy, setSubmittedBy] = useState("sarwan");
  const [sourceType, setSourceType] = useState<ContentSourceType>("engineering-blog");
  const [consent, setConsent] = useState(false);
  const [reviewPackage, setReviewPackage] = useState<ApprovedImportPackage | null>(null);
  const [patchPreview, setPatchPreview] = useState<ImportPatch | null>(null);
  const [bridgeSummary, setBridgeSummary] = useState<BatchReviewSummary | null>(null);
  const [showReviewSection, setShowReviewSection] = useState(false);
  const [overrideDuplicateRisk, setOverrideDuplicateRisk] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<ApprovedImportPackage | null>(null);
  const [batchPatchOutput, setBatchPatchOutput] = useState<ApprovedBatchPatchOutput | null>(null);
  const [showPatchOutput, setShowPatchOutput] = useState(false);
  const [graphImportPreview, setGraphImportPreview] = useState<GraphImportResult | null>(null);
  const [canonicalPatchProposal, setCanonicalPatchProposal] = useState<CanonicalGraphPatchProposal | null>(null);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleRunBatch = useCallback(() => {
    setBatchError(null);
    const urls = urlText
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    const validation = validateBatchInput(urls);
    if (!validation.valid) {
      setBatchError(validation.errors.join("; "));
      return;
    }

    setRunning(true);
    const result = processDiscoveryQueue(urls, submittedBy, sourceType, consent);
    setItems(result.items);
    setSummary(summarizeQueue(result.items));
    setRunning(false);
  }, [urlText, submittedBy, sourceType, consent]);

  const handleSendToImportReview = useCallback(() => {
    const result = createBatchImportReviewPackage(items, overrideDuplicateRisk);
    setReviewPackage(result.package);
    setCurrentPackage(result.package);
    setBridgeSummary(result.summary);

    const patchResult = generateBatchPatchPreview(items, overrideDuplicateRisk);
    setPatchPreview(patchResult.patch);

    setShowReviewSection(true);
    setShowPatchOutput(false);
    setBatchPatchOutput(null);
    setGraphImportPreview(null);
    setCanonicalPatchProposal(null);
  }, [items, overrideDuplicateRisk]);

  const handleApproveEntry = useCallback((entryIndex: number) => {
    setCurrentPackage((prev) => {
      if (!prev) return prev;
      return approvePatchEntry(prev, entryIndex, "Approved for batch patch output");
    });
  }, []);

  const handleRejectEntry = useCallback((entryIndex: number) => {
    setCurrentPackage((prev) => {
      if (!prev) return prev;
      return rejectPatchEntry(prev, entryIndex, "Rejected from batch patch output");
    });
  }, []);

  const handleGeneratePatchOutput = useCallback(() => {
    if (!currentPackage) return;
    const output = createApprovedBatchPatch(currentPackage);
    setBatchPatchOutput(output);
    setShowPatchOutput(true);
    setGraphImportPreview(null);
    setCanonicalPatchProposal(null);
  }, [currentPackage]);

  const handleGenerateGraphImportPreview = useCallback(() => {
    if (!batchPatchOutput) return;
    setGraphImportPreview(applyPatchToInMemoryGraph(batchPatchOutput));
  }, [batchPatchOutput]);

  const handleGenerateCanonicalPatchProposal = useCallback(() => {
    if (!currentPackage) return;
    setCanonicalPatchProposal(generateCanonicalPatchProposal(currentPackage));
  }, [currentPackage]);

  const handleReset = useCallback(() => {
    setItems([]);
    setSummary(null);
    setBatchError(null);
    setExpandedIds(new Set());
    setReviewPackage(null);
    setPatchPreview(null);
    setBridgeSummary(null);
    setShowReviewSection(false);
    setOverrideDuplicateRisk(false);
    setCurrentPackage(null);
    setBatchPatchOutput(null);
    setShowPatchOutput(false);
    setGraphImportPreview(null);
    setCanonicalPatchProposal(null);
  }, []);

  const canRun = urlText.trim().length > 0 && consent && !running;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Multi-URL Batch Queue</h2>
        <p className="mt-1 text-xs text-gray-500">
          Enter up to 5 URLs (one per line) to run through the sub-agent pipeline.
        </p>
      </div>

      <div className="rounded border border-gray-200 bg-white p-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">URLs (one per line, max 5)</label>
            <textarea
              value={urlText}
              onChange={(e) => setUrlText(e.target.value)}
              placeholder="https://example.com/article1&#10;https://example.com/article2&#10;https://example.com/article3"
              rows={4}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
              disabled={running}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Submitted By</label>
              <input
                type="text"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                disabled={running}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Source Type</label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as ContentSourceType)}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                disabled={running}
              >
                {(["official-docs", "engineering-blog", "book", "interview-guide", "github-repository", "career-framework", "roadmap", "job-description", "practice-platform"] as ContentSourceType[]).map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="rounded border-gray-300"
              disabled={running}
            />
            <span className="text-gray-700">I consent to fetching these URLs</span>
          </label>

          <div className="flex gap-2">
            <button
              onClick={handleRunBatch}
              disabled={!canRun}
              className={`rounded px-4 py-2 text-sm font-medium text-white ${
                canRun ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-gray-300"
              }`}
            >
              {running ? "Processing..." : "Run Batch"}
            </button>
            {items.length > 0 && (
              <button
                onClick={handleReset}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
            )}
          </div>

          {batchError && (
            <div className="rounded border border-red-200 bg-red-50 p-2 text-xs text-red-600">
              {batchError}
            </div>
          )}
        </div>
      </div>

      {summary && summary.total > 0 && (
        <div className="rounded border border-gray-200 bg-gray-50 p-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-gray-700">Summary: {summary.total} total</span>
            {summary.reviewRequired > 0 && (
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-purple-700">{summary.reviewRequired} review-required</span>
            )}
            {summary.duplicateRisk > 0 && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-orange-700">{summary.duplicateRisk} duplicate-risk</span>
            )}
            {summary.failed > 0 && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-700">{summary.failed} failed</span>
            )}
            {summary.completed > 0 && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">{summary.completed} completed</span>
            )}
            {summary.queued > 0 && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">{summary.queued} queued</span>
            )}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <QueueItemCard
              key={item.id}
              item={item}
              expanded={expandedIds.has(item.id)}
              onToggle={() => toggleExpanded(item.id)}
            />
          ))}
        </div>
      )}

      {(items.length > 0 || showReviewSection) && (
        <BatchReviewSection
          items={items}
          bridgeSummary={bridgeSummary}
          reviewPackage={reviewPackage}
          currentPackage={currentPackage}
          patchPreview={patchPreview}
          batchPatchOutput={batchPatchOutput}
          graphImportPreview={graphImportPreview}
          canonicalPatchProposal={canonicalPatchProposal}
          showReviewSection={showReviewSection}
          showPatchOutput={showPatchOutput}
          overrideDuplicateRisk={overrideDuplicateRisk}
          onOverrideChange={setOverrideDuplicateRisk}
          onSendToImportReview={handleSendToImportReview}
          onApproveEntry={handleApproveEntry}
          onRejectEntry={handleRejectEntry}
          onGeneratePatchOutput={handleGeneratePatchOutput}
          onGenerateGraphImportPreview={handleGenerateGraphImportPreview}
          onGenerateCanonicalPatchProposal={handleGenerateCanonicalPatchProposal}
        />
      )}
    </div>
  );
}

function BatchReviewSection({
  items,
  bridgeSummary,
  reviewPackage,
  currentPackage,
  patchPreview,
  batchPatchOutput,
  graphImportPreview,
  canonicalPatchProposal,
  showReviewSection,
  showPatchOutput,
  overrideDuplicateRisk,
  onOverrideChange,
  onSendToImportReview,
  onApproveEntry,
  onRejectEntry,
  onGeneratePatchOutput,
  onGenerateGraphImportPreview,
  onGenerateCanonicalPatchProposal,
}: {
  items: RuntimeDiscoveryQueueItem[];
  bridgeSummary: BatchReviewSummary | null;
  reviewPackage: ApprovedImportPackage | null;
  currentPackage: ApprovedImportPackage | null;
  patchPreview: ImportPatch | null;
  batchPatchOutput: ApprovedBatchPatchOutput | null;
  graphImportPreview: GraphImportResult | null;
  canonicalPatchProposal: CanonicalGraphPatchProposal | null;
  showReviewSection: boolean;
  showPatchOutput: boolean;
  overrideDuplicateRisk: boolean;
  onOverrideChange: (v: boolean) => void;
  onSendToImportReview: () => void;
  onApproveEntry: (index: number) => void;
  onRejectEntry: (index: number) => void;
  onGeneratePatchOutput: () => void;
  onGenerateGraphImportPreview: () => void;
  onGenerateCanonicalPatchProposal: () => void;
}) {
  const bridgeSummaryLocal = bridgeSummary || summarizeBatchReviewBridge(items, overrideDuplicateRisk);
  const hasReviewable = bridgeSummaryLocal.hasReviewableItems;
  const pkg = currentPackage || reviewPackage;

  if (showReviewSection && pkg) {
    const summary = summarizeBatchReviewPackage(pkg);
    const pendingCount = pkg.reviewItems.filter((i) => i.decision === "pending").length;
    const approvedCount = pkg.reviewItems.filter((i) => i.decision === "approved").length;
    const hasConflicts = pkg.conflicts.length > 0;

    return (
      <div className="rounded border border-gray-200 bg-white p-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-900">Import Review Package</h3>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-700">{summary?.totalEntries || 0} total entries</span>
          <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">{pendingCount} pending</span>
          <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">{approvedCount} approved</span>
          {hasConflicts && (
            <span className="rounded bg-red-100 px-2 py-0.5 text-red-700">{pkg.conflicts.length} conflict(s)</span>
          )}
        </div>

        <div className="space-y-1">
          {pkg.reviewItems.map((item, index) => (
            <div key={item.patchId + "-" + item.entryIndex} className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 p-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">
                  [{item.entry.type}] {item.entry.type === "source" ? (item.entry as { title: string }).title : (item.entry as { topicName: string }).topicName}
                </p>
                <p className="text-[10px] text-gray-500">
                  {item.decision === "approved" ? "Approved" : item.decision === "rejected" ? "Rejected" : "Pending"}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {item.decision !== "approved" && (
                  <button
                    onClick={() => onApproveEntry(index)}
                    className="rounded bg-green-500 px-2 py-0.5 text-[10px] text-white hover:bg-green-600"
                  >
                    Approve
                  </button>
                )}
                {item.decision !== "rejected" && (
                  <button
                    onClick={() => onRejectEntry(index)}
                    className="rounded bg-red-500 px-2 py-0.5 text-[10px] text-white hover:bg-red-600"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {pkg.conflicts.length > 0 && (
          <div className="rounded border border-red-200 bg-red-50 p-2">
            <p className="text-xs font-semibold text-red-700 mb-1">Conflicts</p>
            <div className="space-y-1">
              {pkg.conflicts.map((c, i) => (
                <p key={i} className="text-[10px] text-red-600">
                  [{c.conflict.severity.toUpperCase()}] {c.conflict.message}
                </p>
              ))}
            </div>
          </div>
        )}

        {patchPreview && !showPatchOutput && (
          <div className="rounded border border-gray-200 bg-gray-50 p-2">
            <p className="text-xs font-semibold text-gray-700 mb-1">Patch Preview</p>
            <p className="text-[10px] text-gray-500 mb-1">
              {patchPreview.entries.length} entries ({patchPreview.report.sourceEntries} sources, {patchPreview.report.topicEntries} topics)
            </p>
            <pre className="max-h-40 overflow-auto rounded bg-gray-900 p-2 text-[10px] text-green-300">
              {JSON.stringify(patchPreview, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onGeneratePatchOutput}
            disabled={approvedCount === 0}
            className={`rounded px-4 py-2 text-sm font-medium text-white ${
              approvedCount > 0 ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-gray-300"
            }`}
          >
            {approvedCount > 0 ? "Generate Batch Patch Preview" : "Approve entries first"}
          </button>
        </div>

        {showPatchOutput && batchPatchOutput && (
          <div className="rounded border border-gray-200 bg-white p-3 space-y-2">
            <h4 className="text-xs font-bold text-gray-900">Batch Patch Output Preview</h4>

            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">{batchPatchOutput.summary.approvedCount} approved entries</span>
              {batchPatchOutput.summary.pendingCount > 0 && (
                <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">{batchPatchOutput.summary.pendingCount} pending (excluded)</span>
              )}
              {batchPatchOutput.summary.rejectedCount > 0 && (
                <span className="rounded bg-red-100 px-2 py-0.5 text-red-600">{batchPatchOutput.summary.rejectedCount} rejected (excluded)</span>
              )}
              {batchPatchOutput.summary.hasConflicts && (
                <span className="rounded bg-red-100 px-2 py-0.5 text-red-700">{batchPatchOutput.conflicts.length} conflict(s)</span>
              )}
            </div>

            {batchPatchOutput.warnings.length > 0 && (
              <div className="rounded border border-amber-200 bg-amber-50 p-2">
                <p className="text-xs font-semibold text-amber-700 mb-1">Warnings</p>
                <div className="space-y-0.5">
                  {batchPatchOutput.warnings.map((w, i) => (
                    <p key={i} className="text-[10px] text-amber-600">{w}</p>
                  ))}
                </div>
              </div>
            )}

            {batchPatchOutput.rollbackNotes.length > 0 && (
              <div className="rounded border border-gray-200 bg-gray-50 p-2">
                <p className="text-xs font-semibold text-gray-700 mb-1">Rollback Notes</p>
                <div className="space-y-0.5">
                  {batchPatchOutput.rollbackNotes.map((n, i) => (
                    <p key={i} className="text-[10px] text-gray-600">{n}</p>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[10px] text-gray-500">
              Output path: {batchPatchOutput.outputPath}
            </p>

            <pre className="max-h-60 overflow-auto rounded bg-gray-900 p-2 text-[10px] text-green-300">
              {serializeApprovedBatchPatch(batchPatchOutput)}
            </pre>

            <button
              onClick={onGenerateGraphImportPreview}
              className="rounded border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              In-memory Import Preview
            </button>

            {graphImportPreview && (
              <div className="rounded border border-blue-200 bg-blue-50 p-2">
                <p className="text-xs font-semibold text-blue-800 mb-1">In-memory Import Preview</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-blue-700">
                  <p>Topics: {graphImportPreview.beforeCounts.topics} -&gt; {graphImportPreview.afterCounts.topics}</p>
                  <p>Sources: {graphImportPreview.beforeCounts.sources} -&gt; {graphImportPreview.afterCounts.sources}</p>
                  <p>Conflicts: {graphImportPreview.conflicts.length}</p>
                  <p>Skipped: {graphImportPreview.skippedEntries.length}</p>
                </div>
                <p className="mt-1 text-[10px] text-blue-700">{summarizeGraphImport(graphImportPreview)}</p>
                {graphImportPreview.conflicts.length > 0 && (
                  <div className="mt-2 space-y-0.5">
                    {graphImportPreview.conflicts.map((item, index) => (
                      <p key={`${item.entryId}-${item.field}-${index}`} className="text-[10px] text-red-600">
                        [{item.severity}] {item.message}
                      </p>
                    ))}
                  </div>
                )}
                <div className="mt-2 space-y-0.5">
                  {graphImportPreview.rollbackPlan.notes.slice(0, 5).map((note, index) => (
                    <p key={index} className="text-[10px] text-blue-700">{note}</p>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onGenerateCanonicalPatchProposal}
              className="rounded border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
            >
              Canonical Patch Proposal
            </button>

            {canonicalPatchProposal && (
              <div className="rounded border border-indigo-200 bg-indigo-50 p-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-indigo-800">Canonical Patch Proposal</p>
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                    {canonicalPatchProposal.review.approvalStatus}
                  </span>
                </div>
                <p className="mt-1 text-[10px] font-medium text-amber-700">
                  Human review required before graph update.
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-indigo-700">
                  <p>Sources: {canonicalPatchProposal.summary.sourceAdds}</p>
                  <p>Topics: {canonicalPatchProposal.summary.topicAdds}</p>
                  <p>Conflicts: {canonicalPatchProposal.summary.conflictCount}</p>
                  <p>Missions: {canonicalPatchProposal.summary.affectedMissionIds.length}</p>
                </div>
                {canonicalPatchProposal.conflicts.length > 0 && (
                  <div className="mt-2 space-y-0.5">
                    {canonicalPatchProposal.conflicts.map((item, index) => (
                      <p key={`${item.entryId}-${item.field}-${index}`} className="text-[10px] text-red-600">
                        [{item.severity}] {item.message}
                      </p>
                    ))}
                  </div>
                )}
                <pre className="mt-2 max-h-52 overflow-auto rounded bg-gray-900 p-2 text-[10px] text-green-300">
                  {serializeCanonicalPatchProposal(canonicalPatchProposal)}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          <p className="font-medium">This does not modify the graph</p>
          <p className="mt-0.5">Preview only — no canonical file writes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border border-gray-200 bg-white p-4 space-y-3">
      <h3 className="text-sm font-bold text-gray-900">Import Review Bridge</h3>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-600">{bridgeSummaryLocal.reviewableCount} reviewable</span>
        {bridgeSummaryLocal.excludedFailed > 0 && (
          <span className="text-red-600">{bridgeSummaryLocal.excludedFailed} failed (excluded)</span>
        )}
        {bridgeSummaryLocal.excludedDuplicateRisk > 0 && (
          <span className="text-orange-600">{bridgeSummaryLocal.excludedDuplicateRisk} duplicate-risk (excluded without override)</span>
        )}
        {bridgeSummaryLocal.excludedQueuedRunning > 0 && (
          <span className="text-gray-400">{bridgeSummaryLocal.excludedQueuedRunning} not processed</span>
        )}
      </div>

      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={overrideDuplicateRisk}
          onChange={(e) => onOverrideChange(e.target.checked)}
          className="rounded border-gray-300"
        />
        <span className="text-gray-600">Override duplicate-risk — include items with detected duplicates</span>
      </label>

      <button
        onClick={onSendToImportReview}
        disabled={!hasReviewable}
        className={`rounded px-4 py-2 text-sm font-medium text-white ${
          hasReviewable ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-gray-300"
        }`}
      >
        {hasReviewable ? "Send Completed to Import Review" : "No reviewable items"}
      </button>
    </div>
  );
}
