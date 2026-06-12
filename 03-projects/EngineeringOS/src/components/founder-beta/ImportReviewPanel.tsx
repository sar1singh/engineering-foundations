"use client";

import { useCallback, useMemo, useState } from "react";
import { generatePatchFromApprovedCandidates } from "@/lib/services/approved-import-patch-generator";
import {
  createImportReviewPackage,
  approvePatchEntry,
  rejectPatchEntry,
  generateApplicationPlan,
  summarizeImportPackage,
} from "@/lib/services/import-review-service";
import type { ApprovedImportPackage, ImportReviewItem } from "@/types/import-review";
import type { ApprovedImportCandidate } from "@/types/ingestion-patch";
import type { PatchEntry } from "@/types/ingestion-patch";

function DecisionBadge({ decision }: { decision: string }) {
  const colors: Record<string, string> = {
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    "needs-review": "bg-amber-100 text-amber-800",
    pending: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        colors[decision] || "bg-gray-100 text-gray-600"
      }`}
    >
      {decision.charAt(0).toUpperCase() + decision.slice(1)}
    </span>
  );
}

function EntryRow({
  entry,
  index,
  item,
  onApprove,
  onReject,
}: {
  entry: PatchEntry;
  index: number;
  item: ImportReviewItem;
  onApprove: (i: number) => void;
  onReject: (i: number) => void;
}) {
  const title =
    entry.type === "source"
      ? entry.title
      : entry.type === "topic"
      ? entry.topicName
      : entry.name;
  const id =
    entry.type === "source"
      ? entry.sourceId
      : entry.type === "topic"
      ? entry.topicId
      : entry.capabilityId;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                entry.type === "source"
                  ? "bg-blue-100 text-blue-700"
                  : entry.type === "topic"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {entry.type}
            </span>
            <span className="text-sm font-medium text-gray-900">{title}</span>
            <DecisionBadge decision={item.decision} />
          </div>
          <p className="mt-1 text-xs text-gray-500">ID: {id}</p>
          {"url" in entry && entry.url ? (
            <p className="mt-0.5 text-xs text-gray-400">{entry.url}</p>
          ) : null}
          {item.reviewNotes ? (
            <p className="mt-1 text-xs italic text-gray-500">
              Notes: {item.reviewNotes}
            </p>
          ) : null}
        </div>
        <div className="ml-4 flex items-center gap-2">
          <button
            type="button"
            className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-40"
            disabled={item.decision === "approved"}
            onClick={() => onApprove(index)}
          >
            Approve
          </button>
          <button
            type="button"
            className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-40"
            disabled={item.decision === "rejected"}
            onClick={() => onReject(index)}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export function ImportReviewPanel({
  candidates,
}: {
  candidates: ApprovedImportCandidate[];
}) {
  const [pkg, setPkg] = useState<ApprovedImportPackage | null>(null);
  const [showJson, setShowJson] = useState(false);

  const handleGenerateReview = useCallback(() => {
    const patch = generatePatchFromApprovedCandidates(candidates);
    const reviewPkg = createImportReviewPackage(patch);
    setPkg(reviewPkg);
  }, [candidates]);

  const handleApprove = useCallback(
    (entryIndex: number) => {
      if (!pkg) return;
      setPkg(approvePatchEntry(pkg, entryIndex, "Approved by reviewer"));
    },
    [pkg]
  );

  const handleReject = useCallback(
    (entryIndex: number) => {
      if (!pkg) return;
      setPkg(rejectPatchEntry(pkg, entryIndex, "Rejected by reviewer"));
    },
    [pkg]
  );

  const summary = useMemo(
    () => (pkg ? summarizeImportPackage(pkg) : null),
    [pkg]
  );

  const plan = useMemo(
    () => (pkg ? generateApplicationPlan(pkg) : null),
    [pkg]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Import Review &mdash; First Approved Import
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Review patch entries, approve or reject each, and generate an
          application plan. No automatic writes.
        </p>
        <button
          type="button"
          className="mt-4 rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          onClick={handleGenerateReview}
        >
          Generate Review Package
        </button>
      </div>

      {summary ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Total Entries</p>
            <p className="text-2xl font-bold text-gray-900">
              {summary.totalEntries}
            </p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 shadow-sm">
            <p className="text-xs text-green-600">Approved</p>
            <p className="text-2xl font-bold text-green-700">
              {summary.approvedCount}
            </p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
            <p className="text-xs text-red-600">Rejected</p>
            <p className="text-2xl font-bold text-red-700">
              {summary.rejectedCount}
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <p className="text-xs text-amber-600">Pending</p>
            <p className="text-2xl font-bold text-amber-700">
              {summary.pendingCount}
            </p>
          </div>
        </div>
      ) : null}

      {pkg && pkg.conflicts.length > 0 ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-sm font-semibold text-red-800">
            Conflicts ({pkg.conflicts.length})
          </h3>
          <ul className="mt-2 space-y-1">
            {pkg.conflicts.map((c, i) => (
              <li key={i} className="text-xs text-red-700">
                <span className="font-medium uppercase">
                  [{c.conflict.severity}]
                </span>{" "}
                {c.entryType} &quot;{c.entryId}&quot;: {c.conflict.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {pkg ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Patch Entries ({pkg.reviewItems.length})
          </h3>
          {pkg.reviewItems.map((item, i) => (
            <EntryRow
              key={i}
              entry={item.entry}
              index={i}
              item={item}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      ) : null}

      {plan ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">
            Application Plan
          </h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Sources to Add ({plan.sourcesToAdd.length})
              </p>
              {plan.sourcesToAdd.length === 0 ? (
                <p className="mt-1 text-xs text-gray-400">None</p>
              ) : (
                <ul className="mt-1 space-y-1">
                  {plan.sourcesToAdd.map((s, i) => (
                    <li key={i} className="text-xs text-gray-700">
                      {s.entryName} ({s.entryId})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">
                Topics to Add ({plan.topicsToAdd.length})
              </p>
              {plan.topicsToAdd.length === 0 ? (
                <p className="mt-1 text-xs text-gray-400">None</p>
              ) : (
                <ul className="mt-1 space-y-1">
                  {plan.topicsToAdd.map((t, i) => (
                    <li key={i} className="text-xs text-gray-700">
                      {t.entryName} ({t.entryId})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {plan.capabilitiesImpacted.length > 0 ? (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-500">
                Capabilities Impacted
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {plan.capabilitiesImpacted.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {plan.duplicateRisks.length > 0 ? (
            <div className="mt-3">
              <p className="text-xs font-medium text-red-600">
                Duplicate Risks
              </p>
              <ul className="mt-1 space-y-1">
                {plan.duplicateRisks.map((r, i) => (
                  <li key={i} className="text-xs text-red-600">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {pkg ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs text-amber-700">
            Preview only &mdash; no apply button. No automatic catalog updates.
            Human approval required before applying this import.
          </p>
        </div>
      ) : null}

      {pkg ? (
        <div>
          <button
            type="button"
            className="text-sm text-indigo-600 hover:text-indigo-800"
            onClick={() => setShowJson(!showJson)}
          >
            {showJson ? "Hide" : "Show"} JSON Preview
          </button>
          {showJson ? (
            <pre className="mt-2 max-h-96 overflow-auto rounded bg-gray-900 p-4 text-xs text-green-400">
              {JSON.stringify(pkg, null, 2)}
            </pre>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
