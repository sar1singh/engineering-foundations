"use client";

import type { AgentDiscoveryPreviewResult } from "@/lib/services/agent-discovery-simulator";

function GateBadge({ passed, label }: { passed: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        passed
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${passed ? "bg-green-600" : "bg-red-600"}`} />
      {passed ? "Pass" : "Blocked"} — {label}
    </span>
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

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2 text-sm">
      <span className="font-medium text-gray-500">{label}:</span>
      <span className="text-gray-900">{children}</span>
    </div>
  );
}

export function AgentDiscoveryPreview({ results }: { results: AgentDiscoveryPreviewResult[] }) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-gray-500">No agent discovery scenarios to preview.</p>
        <p className="mt-1 text-sm text-gray-400">Add scenarios to AGENT_DISCOVERY_SCENARIOS to populate this preview.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm font-medium text-gray-500">Total scenarios</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{results.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm font-medium text-gray-500">Gate passed</p>
          <p className="mt-1 text-2xl font-bold text-green-700">{results.filter((r) => r.finalGateStatus === "pass").length}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm font-medium text-gray-500">Gate blocked</p>
          <p className="mt-1 text-2xl font-bold text-red-700">{results.filter((r) => r.finalGateStatus === "blocked").length}</p>
        </div>
      </div>

      <div className="space-y-6">
        {results.map((result) => (
          <div key={result.scenarioId} className="rounded-lg border bg-white shadow-sm">
            <div className={`rounded-t-lg border-b px-5 py-3 ${
              result.finalGateStatus === "pass" ? "bg-green-50" : "bg-red-50"
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900">{result.agentName}</p>
                  <p className="text-sm text-gray-500">{result.description}</p>
                </div>
                <GateBadge
                  passed={result.finalGateStatus === "pass"}
                  label={result.finalGateStatus === "pass" ? "Agent gate passed" : "Agent gate blocked"}
                />
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
                    <DetailRow label="Checksum">{result.candidatePreview.checksum.slice(0, 24)}...</DetailRow>
                  </div>
                </div>
              )}

              {!result.agentDiscoveryValidation.valid && (
                <ValidationIssues
                  title="Agent discovery validation errors"
                  items={result.agentDiscoveryValidation.errors}
                />
              )}
              {result.agentDiscoveryValidation.warnings.length > 0 && (
                <WarningsList items={result.agentDiscoveryValidation.warnings} />
              )}

              {result.attributionValidation.warnings.length > 0 && (
                <ValidationIssues
                  title="Attribution warnings"
                  items={result.attributionValidation.warnings}
                />
              )}

              {result.duplicateRiskValidation && !result.duplicateRiskValidation.valid && (
                <ValidationIssues
                  title="Duplicate risk validation errors"
                  items={result.duplicateRiskValidation.errors}
                />
              )}
              {result.duplicateRiskValidation && result.duplicateRiskValidation.warnings.length > 0 && (
                <WarningsList items={result.duplicateRiskValidation.warnings} />
              )}

              {result.qualityResult && !result.qualityResult.valid && (
                <ValidationIssues
                  title="Quality validation errors"
                  items={result.qualityResult.errors}
                />
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded border border-gray-200 p-3">
                  <p className="mb-1 text-sm font-semibold text-gray-700">
                    Topic mappings ({result.topicMappingResults.length})
                  </p>
                  {result.topicMappingResults.length === 0 ? (
                    <p className="text-sm text-gray-400">No mappings</p>
                  ) : (
                    <div className="space-y-1">
                      {result.topicMappingResults.map((r, i) => (
                        <div key={i} className={`text-sm ${r.valid ? "text-gray-600" : "text-red-600"}`}>
                          {r.valid ? "Valid" : `Invalid: ${r.errors.join("; ")}`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="rounded border border-gray-200 p-3">
                  <p className="mb-1 text-sm font-semibold text-gray-700">
                    Source mappings ({result.sourceMappingResults.length})
                  </p>
                  {result.sourceMappingResults.length === 0 ? (
                    <p className="text-sm text-gray-400">No mappings</p>
                  ) : (
                    <div className="space-y-1">
                      {result.sourceMappingResults.map((r, i) => (
                        <div key={i} className={`text-sm ${r.valid ? "text-gray-600" : "text-red-600"}`}>
                          {r.valid ? "Valid" : `Invalid: ${r.errors.join("; ")}`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
