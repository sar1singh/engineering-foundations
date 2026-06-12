"use client";

import { useState, useCallback } from "react";
import { runRuntimeSubAgentPipeline } from "@/lib/services/runtime-sub-agent-orchestrator";
import type { PipelineResult, RuntimeSubAgentTrace, RuntimeSubAgentType } from "@/types/runtime-sub-agent";
import type { ContentSourceType } from "@/types/content-ingestion";
import RuntimeDiscoveryQueuePanel from "./RuntimeDiscoveryQueuePanel";

const SOURCE_TYPES: ContentSourceType[] = [
  "official-docs", "engineering-blog", "book", "interview-guide",
  "github-repository", "career-framework", "roadmap", "job-description", "practice-platform",
];

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
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function AgentStepCard({ entry, index }: { entry: RuntimeSubAgentTrace; index: number }) {
  const isLast = index === 4;
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${entry.success ? "bg-green-500" : "bg-red-500"}`}>
          {index + 1}
        </div>
        {!isLast && <div className="mt-0.5 h-6 w-0.5 bg-gray-300" />}
      </div>
      <div className={`flex-1 rounded border p-3 ${entry.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">{AGENT_LABELS[entry.agentType]}</span>
          <StatusBadge status={entry.success ? "completed" : "failed"} />
        </div>
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
          <span>{entry.elapsedMs}ms</span>
        </div>
        {entry.warnings.length > 0 && (
          <div className="mt-1 space-y-0.5">
            {entry.warnings.map((w, j) => (
              <p key={j} className="text-xs text-amber-600">warn: {w}</p>
            ))}
          </div>
        )}
        {entry.errors.length > 0 && (
          <div className="mt-1 space-y-0.5">
            {entry.errors.map((e, j) => (
              <p key={j} className="text-xs text-red-600">error: {e}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PipelineVisualization({ trace }: { trace: RuntimeSubAgentTrace[] }) {
  return (
    <div className="rounded border border-gray-200 bg-gray-50 p-4">
      <p className="mb-3 text-sm font-semibold text-gray-700">Sub-Agent Pipeline</p>
      <div className="space-y-1">
        {trace.map((entry, i) => (
          <AgentStepCard key={entry.agentType} entry={entry} index={i} />
        ))}
      </div>
    </div>
  );
}

function MetadataCard({ metadata }: { metadata: NonNullable<PipelineResult["metadata"]>["metadata"] }) {
  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <p className="mb-2 text-sm font-semibold text-gray-700">Extracted Metadata</p>
      <div className="space-y-1 text-sm">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-gray-500">Title:</span>
          <span className="text-gray-900">{metadata.title}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-gray-500">Description:</span>
          <span className="text-gray-900">{metadata.description}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-gray-500">Content Type:</span>
          <span className="text-gray-900 font-mono text-xs">{metadata.contentType}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-gray-500">Domain:</span>
          <span className="text-gray-900">{metadata.domain}</span>
        </div>
        {metadata.keywords.length > 0 && (
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-gray-500">Keywords:</span>
            <div className="flex flex-wrap gap-1">
              {metadata.keywords.map((kw) => (
                <span key={kw} className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700">{kw}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CandidateCard({ candidate }: { candidate: NonNullable<PipelineResult["candidate"]>["candidate"] }) {
  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2">
        <p className="text-sm font-semibold text-gray-700">Generated Candidate</p>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-gray-500">ID:</span>
          <span className="text-gray-900 font-mono text-xs">{candidate.id}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-gray-500">Title:</span>
          <span className="text-gray-900">{candidate.title}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-gray-500">URL:</span>
          <span className="break-all text-xs text-blue-600">{candidate.url}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-gray-500">Source Type:</span>
          <span className="text-gray-900">{candidate.sourceType}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-gray-500">Tier:</span>
          <span className="text-gray-900">{candidate.tier}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-gray-500">Confidence:</span>
          <span className="text-gray-900">{candidate.estimatedConfidence}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-gray-500">Discovery Method:</span>
          <span className="text-gray-900">{candidate.discoveryMethod}</span>
        </div>
      </div>
    </div>
  );
}

function DuplicateCard({ duplicate }: { duplicate: NonNullable<PipelineResult["duplicate"]>["duplicateInfo"] }) {
  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <p className="mb-2 text-sm font-semibold text-gray-700">Duplicate Detection</p>
      {duplicate.isDuplicate ? (
        <div>
          <p className="text-xs font-medium text-red-600 mb-1">
            Duplicate risk: {duplicate.matches.length} match(es) found
          </p>
          <div className="space-y-1">
            {duplicate.matches.map((m, i) => (
              <div key={i} className="rounded border border-red-100 bg-red-50 p-2 text-xs text-red-800">
                <p><span className="font-medium">Matched by:</span> {m.field}</p>
                <p><span className="font-medium">Source ID:</span> {m.source.id}</p>
                <p><span className="font-medium">Title:</span> {m.source.title}</p>
                <p><span className="font-medium">URL:</span> {m.source.url}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-green-600">No duplicates detected in source catalog</p>
      )}
    </div>
  );
}

function ReviewQueueCard({ humanApprovalRequired }: { humanApprovalRequired: boolean }) {
  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <p className="mb-2 text-sm font-semibold text-gray-700">Review Queue Item</p>
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-500">Status:</span>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
            Pending Review
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-500">Approval:</span>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${humanApprovalRequired ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
            {humanApprovalRequired ? "Required" : "Not Required"}
          </span>
        </div>
      </div>
      <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
        <p className="font-medium">No publish controls available</p>
        <p className="mt-0.5">This candidate is in preview mode. To publish, use the Import Review workflow.</p>
      </div>
    </div>
  );
}

export default function DiscoveryAgentPreview() {
  const [url, setUrl] = useState("");
  const [sourceType, setSourceType] = useState<ContentSourceType>("engineering-blog");
  const [submittedBy, setSubmittedBy] = useState("sarwan");
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [running, setRunning] = useState(false);

  const handleRun = useCallback(() => {
    setRunning(true);
    setResult(null);

    const input = {
      url,
      submittedBy,
      submittedAt: new Date().toISOString(),
      sourceType,
      consent,
    };

    const pipelineResult = runRuntimeSubAgentPipeline(input);
    setResult(pipelineResult);
    setRunning(false);
  }, [url, submittedBy, sourceType, consent]);

  const canRun = url.trim().length > 0 && consent && !running;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Discovery Agent Preview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter a URL to run the sub-agent pipeline. Output is session-only — no writes.
        </p>
      </div>

      <div className="rounded border border-gray-200 bg-white p-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
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
                {SOURCE_TYPES.map((st) => (
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
            <span className="text-gray-700">I consent to fetching this URL</span>
          </label>

          <button
            onClick={handleRun}
            disabled={!canRun}
            className={`rounded px-4 py-2 text-sm font-medium text-white ${
              canRun ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-gray-300"
            }`}
          >
            {running ? "Running..." : "Run Pipeline"}
          </button>
        </div>
      </div>

      {result && !result.success && (
        <div className="rounded border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">Pipeline Failed</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs text-red-600">
            {result.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
          {result.warnings.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-amber-700">Warnings</p>
              <ul className="list-inside list-disc space-y-0.5 text-xs text-amber-600">
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
          {result.trace.length > 0 && (
            <div className="mt-3">
              <PipelineVisualization trace={result.trace} />
            </div>
          )}
        </div>
      )}

      {result && result.success && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded border border-green-200 bg-green-50 p-3">
            <p className="text-sm font-semibold text-green-700">Pipeline Completed</p>
            <span className="text-xs text-gray-500">{result.durationMs}ms total</span>
          </div>

          <PipelineVisualization trace={result.trace} />

          {result.metadata && <MetadataCard metadata={result.metadata.metadata} />}
          {result.candidate && <CandidateCard candidate={result.candidate.candidate} />}
          {result.duplicate && <DuplicateCard duplicate={result.duplicate.duplicateInfo} />}
          {result.review && <ReviewQueueCard humanApprovalRequired={result.review.humanApprovalRequired} />}

          {result.warnings.length > 0 && (
            <div className="rounded border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-medium text-amber-700 mb-1">Warnings</p>
              <ul className="list-inside list-disc space-y-0.5 text-xs text-amber-600">
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <hr className="border-gray-200" />

      <RuntimeDiscoveryQueuePanel />
    </div>
  );
}
