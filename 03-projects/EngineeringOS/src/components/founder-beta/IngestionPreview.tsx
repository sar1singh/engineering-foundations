"use client";

import { useState, useMemo } from "react";
import type { SimulationResult, LifecycleStep } from "@/lib/services/content-ingestion-simulator";
import {
  type ReviewDecision,
  type CandidateReviewState,
  type ReviewSessionState,
  type ReviewSummary,
  createInitialReviewState,
  approveCandidate,
  rejectCandidate,
  needsChangesCandidate,
  resetDecision,
  computeReviewSummary
} from "@/lib/services/content-ingestion-review-session";

type IngestionPreviewProps = {
  results: SimulationResult[];
};

const STATUS_COLORS: Record<string, string> = {
  discovered: "bg-blue-100 text-blue-800",
  normalized: "bg-indigo-100 text-indigo-800",
  mapped: "bg-purple-100 text-purple-800",
  reviewed: "bg-orange-100 text-orange-800",
  approved: "bg-green-100 text-green-800",
  published: "bg-teal-100 text-teal-800",
  rejected: "bg-red-100 text-red-800"
};

const LABEL_COLORS: Record<string, string> = {
  "publish-ready": "border-teal-300 bg-teal-50",
  valid: "border-blue-300 bg-blue-50",
  invalid: "border-red-300 bg-red-50",
  weak: "border-yellow-300 bg-yellow-50",
  "duplicate-risk": "border-orange-300 bg-orange-50"
};

function LifecycleBar({ steps }: { steps: LifecycleStep[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map((step, i) => {
        const isRejected = step.status === "rejected";
        const isTerminal = step.status === "published" || step.status === "rejected";
        return (
          <div key={step.status} className="flex items-center gap-1.5">
            <span
              className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                step.passed ? STATUS_COLORS[step.status] || "bg-gray-100 text-gray-600"
                : isRejected ? STATUS_COLORS.rejected
                : "bg-gray-100 text-gray-400"
              }`}
              title={step.detail}
            >
              {isRejected && !step.passed ? "✕ " : step.passed ? "✓ " : "○ "}
              {step.label}
            </span>
            {!isTerminal && i < steps.length - 1 && (
              <span className="text-xs text-[var(--muted)]">&rarr;</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2 text-sm">
      <span className="w-32 shrink-0 font-medium text-[var(--muted)]">{label}</span>
      <span>{children}</span>
    </div>
  );
}

function BatchSummary({ summary }: { summary: ReviewSummary }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-gray-50 p-3 text-sm">
      <span className="font-medium text-[var(--foreground)]">Batch Summary</span>
      <span className="text-[var(--muted)]">&middot;</span>
      <span>Total: <strong>{summary.total}</strong></span>
      <span className="text-green-700">Approved: <strong>{summary.approved}</strong></span>
      <span className="text-red-700">Rejected: <strong>{summary.rejected}</strong></span>
      <span className="text-yellow-700">Needs Changes: <strong>{summary.needsChanges}</strong></span>
      <span className="text-gray-500">Pending: <strong>{summary.pending}</strong></span>
    </div>
  );
}

function PublishPreviewSection({ result }: { result: SimulationResult }) {
  return (
    <div className="mt-3 space-y-2 rounded-md border border-teal-200 bg-teal-50 p-3">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal-800">
        Publish Preview
      </p>
      <DetailRow label="Final status">
        <span className="font-medium text-teal-700">published</span>
      </DetailRow>
      {result.normalizedItem && (
        <>
          <DetailRow label="Item ID">
            <code className="rounded bg-white px-1 text-xs">{result.normalizedItem.id}</code>
          </DetailRow>
          <DetailRow label="Checksum">
            <code className="rounded bg-white px-1 text-xs">{result.normalizedItem.checksum.slice(0, 24)}...</code>
          </DetailRow>
          <DetailRow label="Title">{result.normalizedItem.normalizedTitle}</DetailRow>
          <DetailRow label="URL">
            <span className="break-all text-blue-700">{result.normalizedItem.normalizedUrl}</span>
          </DetailRow>
        </>
      )}
      <DetailRow label="Topic mappings">{result.topicMappingResults.length}</DetailRow>
      <DetailRow label="Source mappings">{result.sourceMappingResults.length}</DetailRow>
      {result.qualityResult && (
        <DetailRow label="Quality score">
          {result.qualityResult.valid ? "Pass" : "Fail"}
        </DetailRow>
      )}
    </div>
  );
}

function ReviewControls({
  reviewState,
  canApprove,
  onApprove,
  onReject,
  onReset,
  onNeedsChanges
}: {
  reviewState: CandidateReviewState;
  canApprove: boolean;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onReset: () => void;
  onNeedsChanges: () => void;
}) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const decision = reviewState.decision;

  if (decision === "approved") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
          ✓ Approved
        </span>
        <button
          className="rounded bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    );
  }

  if (decision === "rejected") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
          ✕ Rejected
        </span>
        {reviewState.rejectionReason && (
          <span className="text-xs text-red-600">({reviewState.rejectionReason})</span>
        )}
        <button
          className="rounded bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    );
  }

  if (decision === "needs-changes") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-block rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
          △ Needs Changes
        </span>
        <button
          className="rounded bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    );
  }

  if (showRejectInput) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="w-48 rounded border px-2 py-1 text-xs"
          placeholder="Reason for rejection..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          autoFocus
        />
        <button
          className="rounded bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
          disabled={!rejectReason.trim()}
          onClick={() => { onReject(rejectReason.trim()); setShowRejectInput(false); setRejectReason(""); }}
        >
          Confirm Reject
        </button>
        <button
          className="rounded bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
          onClick={() => { setShowRejectInput(false); setRejectReason(""); }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className={`rounded px-2.5 py-1 text-xs font-medium text-white ${
          canApprove ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!canApprove}
        title={!canApprove ? "Candidate does not meet approval gates" : "Approve for publication"}
        onClick={onApprove}
      >
        Approve
      </button>
      <button
        className="rounded bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
        onClick={() => setShowRejectInput(true)}
      >
        Reject
      </button>
      <button
        className="rounded bg-yellow-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-yellow-600"
        onClick={onNeedsChanges}
      >
        Needs Changes
      </button>
    </div>
  );
}

function CandidateCard({
  result,
  reviewState,
  onApprove,
  onReject,
  onReset,
  onNeedsChanges
}: {
  result: SimulationResult;
  reviewState: CandidateReviewState;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onReset: () => void;
  onNeedsChanges: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const vr = result.validationResult;
  const canApprove = result.approvalResult?.valid === true;

  const displayStatus = reviewState.decision === "approved"
    ? "published"
    : reviewState.decision === "rejected"
    ? "rejected"
    : result.finalStatus;

  return (
    <div className={`rounded-lg border p-4 ${LABEL_COLORS[result.label] || "border-gray-200 bg-white"}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{result.candidate.title || "(untitled)"}</h3>
            <span className="inline-block rounded bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-700">
              {result.label}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-[var(--muted)]">{result.description}</p>
        </div>
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
            displayStatus === "published" ? "bg-teal-100 text-teal-800"
            : displayStatus === "rejected" ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-600"
          }`}
        >
          {displayStatus}
        </span>
      </div>

      <div className="mt-3">
        <LifecycleBar steps={result.lifecycleSteps} />
      </div>

      <div className="mt-2 border-t pt-2">
        <ReviewControls
          reviewState={reviewState}
          canApprove={canApprove}
          onApprove={onApprove}
          onReject={onReject}
          onReset={onReset}
          onNeedsChanges={onNeedsChanges}
        />
      </div>

      <button
        className="mt-2 text-xs font-medium text-teal-700 hover:text-teal-800"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Hide details" : "Show details"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 border-t pt-3">
          {reviewState.decision === "approved" && (
            <PublishPreviewSection result={result} />
          )}

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Validation Result
            </p>
            <DetailRow label="Valid">
              <span className={vr.valid ? "text-green-700" : "text-red-700"}>
                {vr.valid ? "Yes" : "No"}
              </span>
            </DetailRow>
            {vr.errors.length > 0 && (
              <DetailRow label="Errors">
                <ul className="list-inside list-disc text-red-700">
                  {vr.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </DetailRow>
            )}
            {vr.warnings.length > 0 && (
              <DetailRow label="Warnings">
                <ul className="list-inside list-disc text-yellow-700">
                  {vr.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </DetailRow>
            )}
          </div>

          {result.qualityResult && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Quality Review
              </p>
              <DetailRow label="Overall score">
                {result.candidate.id ? result.qualityResult.valid ? "Valid" : "Invalid" : "—"}
                {result.qualityResult.valid && result.candidate.id ? ` (${result.candidate.estimatedConfidence})` : ""}
              </DetailRow>
              <DetailRow label="Review passed">
                {result.qualityResult.valid ? "Yes" : "No"}
              </DetailRow>
            </div>
          )}

          {result.topicMappingResults.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Topic Mappings ({result.topicMappingResults.length})
              </p>
              {result.topicMappingResults.map((tm, i) => (
                <DetailRow key={i} label={`Mapping ${i + 1}`}>
                  {tm.valid ? "Valid" : "Invalid"}
                  {tm.warnings.length > 0 && ` — ${tm.warnings.join("; ")}`}
                </DetailRow>
              ))}
            </div>
          )}

          {result.sourceMappingResults.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Source Mappings ({result.sourceMappingResults.length})
              </p>
              {result.sourceMappingResults.map((sm, i) => (
                <DetailRow key={i} label={`Mapping ${i + 1}`}>
                  {sm.valid ? "Valid" : "Invalid"}
                  {sm.warnings.length > 0 && ` — ${sm.warnings.join("; ")}`}
                </DetailRow>
              ))}
            </div>
          )}

          {result.approvalResult && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Approval Readiness
              </p>
              <DetailRow label="Ready">
                <span className={result.approvalResult.valid ? "text-green-700" : "text-red-700"}>
                  {result.approvalResult.valid ? "Yes" : "No"}
                </span>
              </DetailRow>
              {result.approvalResult.errors.length > 0 && (
                <DetailRow label="Blockers">
                  <ul className="list-inside list-disc text-red-700">
                    {result.approvalResult.errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </DetailRow>
              )}
            </div>
          )}

          {result.rejectionReason && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Rejection Reason
              </p>
              <p className="text-sm text-red-700">{result.rejectionReason}</p>
            </div>
          )}

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Candidate Metadata
            </p>
            <DetailRow label="URL">
              <span className="break-all text-blue-700">{result.candidate.url}</span>
            </DetailRow>
            <DetailRow label="Source type">{result.candidate.sourceType}</DetailRow>
            <DetailRow label="Tier">{result.candidate.tier}</DetailRow>
            <DetailRow label="Category">{result.candidate.category}</DetailRow>
            <DetailRow label="Confidence">{result.candidate.estimatedConfidence}</DetailRow>
            <DetailRow label="Discovered by">{result.candidate.discoveredBy}</DetailRow>
            <DetailRow label="Method">{result.candidate.discoveryMethod}</DetailRow>
            {result.candidate.tags.length > 0 && (
              <DetailRow label="Tags">
                {result.candidate.tags.map((t) => (
                  <span key={t} className="mr-1 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                    {t}
                  </span>
                ))}
              </DetailRow>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function useReviewSession(candidateIds: string[]) {
  const [reviews, setReviews] = useState<ReviewSessionState>(() =>
    createInitialReviewState(candidateIds)
  );

  const summary = useMemo(() => computeReviewSummary(reviews), [reviews]);

  const approve = (candidateId: string) =>
    setReviews((prev) => approveCandidate(prev, candidateId));

  const reject = (candidateId: string, reason: string) =>
    setReviews((prev) => rejectCandidate(prev, candidateId, reason));

  const needsChanges = (candidateId: string) =>
    setReviews((prev) => needsChangesCandidate(prev, candidateId));

  const reset = (candidateId: string) =>
    setReviews((prev) => resetDecision(prev, candidateId));

  return { reviews, summary, approve, reject, needsChanges, reset };
}

export function IngestionPreview({ results }: IngestionPreviewProps) {
  const [filter, setFilter] = useState<string>("all");
  const { reviews, summary, approve, reject, needsChanges, reset } = useReviewSession(
    results.map((r) => r.candidateId)
  );

  const filtered = filter === "all" ? results : results.filter((r) => r.label === filter || r.finalStatus === filter);

  const labels = [...new Set(results.map((r) => r.label))];
  const statuses = [...new Set(results.map((r) => r.finalStatus))];

  return (
    <div className="space-y-4">
      <BatchSummary summary={summary} />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-[var(--muted)]">Filter:</span>
        <button
          className={`rounded px-2.5 py-1 text-xs font-medium ${filter === "all" ? "bg-teal-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          onClick={() => setFilter("all")}
        >
          All ({results.length})
        </button>
        {labels.map((l) => (
          <button
            key={l}
            className={`rounded px-2.5 py-1 text-xs font-medium ${filter === l ? "bg-teal-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => setFilter(l)}
          >
            {l}
          </button>
        ))}
        <span className="mx-1 text-[var(--muted)]">|</span>
        {statuses.map((s) => (
          <button
            key={s}
            className={`rounded px-2.5 py-1 text-xs font-medium ${filter === s ? "bg-teal-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((result) => (
          <CandidateCard
            key={result.candidateId}
            result={result}
            reviewState={reviews[result.candidateId]}
            onApprove={() => approve(result.candidateId)}
            onReject={(reason) => reject(result.candidateId, reason)}
            onReset={() => reset(result.candidateId)}
            onNeedsChanges={() => needsChanges(result.candidateId)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--muted)]">No candidates match the selected filter.</p>
      )}
    </div>
  );
}
