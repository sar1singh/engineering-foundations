"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_MULTI_SOURCE_DISCOVERY_AGENTS,
  runSelectedDiscoveryAgents,
} from "@/lib/services/multi-source-discovery-orchestrator";
import type { MultiSourceDiscoveryRunResult } from "@/lib/services/multi-source-discovery-orchestrator";
import {
  createAutonomousImportReviewPackage,
  type AutonomousReviewBridgeResult,
} from "@/lib/services/autonomous-discovery-review-bridge";
import type { MultiSourceDiscoveryAgentType } from "@/types/multi-source-discovery-agent";
import type { RuntimeSubAgentTrace } from "@/types/runtime-sub-agent";
import { runAdaptiveDiscoveryPipeline, summarizeAdaptivePipeline } from "@/lib/services/adaptive-discovery-orchestrator";
import type { AdaptiveDiscoveryResult, GapCluster, AdaptiveDiscoveryCandidate, CoverageHeatmap, ConfidenceScoreDetail } from "@/types/adaptive-discovery";

const AGENT_LABELS: Record<MultiSourceDiscoveryAgentType, string> = {
  "aws-discovery-agent": "AWS Discovery Agent",
  "system-design-discovery-agent": "System Design Discovery Agent",
  "backend-discovery-agent": "Backend Discovery Agent",
  "career-discovery-agent": "Career/Staff Engineering Discovery Agent",
};

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "review-required"
      ? "bg-purple-100 text-purple-700"
      : status === "duplicate-risk"
      ? "bg-orange-100 text-orange-700"
      : "bg-red-100 text-red-700";
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${color}`}>
      {status}
    </span>
  );
}

function TraceView({ trace }: { trace: RuntimeSubAgentTrace[] }) {
  return (
    <div className="mt-2 rounded border border-gray-200 bg-gray-50 p-2">
      <p className="text-[10px] font-semibold text-gray-600">Trace</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {trace.map((entry) => (
          <span
            key={entry.agentType}
            className={`rounded px-1.5 py-0.5 text-[10px] ${
              entry.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {entry.agentType}
          </span>
        ))}
      </div>
    </div>
  );
}

function ClusterCard({ cluster }: { cluster: GapCluster }) {
  return (
    <div className="rounded border border-gray-200 bg-white p-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{cluster.label}</p>
          <p className="text-xs text-gray-500">{cluster.domain} · {cluster.primaryGapType}</p>
        </div>
        <div className="flex gap-1">
          <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
            {cluster.gapCount} gaps
          </span>
          <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            score {cluster.avgSeverityScore}
          </span>
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-600">{cluster.recommendation}</p>
    </div>
  );
}

function ConfidenceBar({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? "bg-green-500" : score >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-28 shrink-0 text-gray-600">{label}</span>
      <div className="h-2 flex-1 rounded-full bg-gray-200">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="w-8 text-right font-medium text-gray-700">{score}</span>
    </div>
  );
}

function AdaptiveCandidateCard({ candidate, confidence }: { candidate: AdaptiveDiscoveryCandidate; confidence?: ConfidenceScoreDetail }) {
  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{candidate.title}</span>
            <StatusBadge status="review-required" />
          </div>
          <p className="mt-0.5 text-xs text-gray-500">{candidate.url}</p>
          <p className="mt-1 text-xs text-gray-600">{candidate.rationale}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {candidate.tags.map((tag) => (
              <span key={tag} className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">{tag}</span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="rounded bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
            {candidate.domain}
          </span>
          <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
            {Math.round(candidate.confidenceScore * 100)}%
          </span>
        </div>
      </div>
      {confidence && (
        <div className="mt-3 space-y-1 border-t border-gray-100 pt-2">
          <ConfidenceBar score={confidence.graphFit} label="Graph Fit" />
          <ConfidenceBar score={100 - confidence.duplicateProbability} label="Uniqueness" />
          <ConfidenceBar score={confidence.syllabusRelevance} label="Syllabus Relevance" />
          <ConfidenceBar score={confidence.sourceQuality} label="Source Quality" />
          <ConfidenceBar score={confidence.interviewValue} label="Interview Value" />
        </div>
      )}
    </div>
  );
}

function CoverageHeatmapSection({ coverage }: { coverage: CoverageHeatmap }) {
  const sections: { label: string; data: CoverageHeatmap["capabilityCoverage"]; type: string }[] = [
    { label: "Capability Coverage", data: coverage.capabilityCoverage, type: "capability" },
    { label: "Skill Coverage", data: coverage.skillCoverage, type: "skill" },
    { label: "Source Diversity", data: coverage.sourceDiversity, type: "source-diversity" },
    { label: "Proof Coverage", data: coverage.proofCoverage, type: "proof" },
    { label: "Mission Coverage", data: coverage.missionCoverage, type: "mission" },
    { label: "Interview Coverage", data: coverage.interviewCoverage, type: "interview" },
    { label: "Readiness Coverage", data: coverage.readinessCoverage, type: "readiness" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded border border-gray-200 bg-white p-3">
          <p className="text-[10px] text-gray-500">Overall Coverage</p>
          <p className="text-xl font-bold text-gray-900">{coverage.overallCoveragePercent}%</p>
        </div>
        <div className="rounded border border-gray-200 bg-white p-3">
          <p className="text-[10px] text-gray-500">Total Topics</p>
          <p className="text-xl font-bold text-gray-900">{coverage.totalTopics}</p>
        </div>
        <div className="rounded border border-gray-200 bg-white p-3">
          <p className="text-[10px] text-gray-500">Total Sources</p>
          <p className="text-xl font-bold text-gray-900">{coverage.totalSources}</p>
        </div>
        <div className="rounded border border-gray-200 bg-white p-3">
          <p className="text-[10px] text-gray-500">Generated</p>
          <p className="text-xs font-medium text-gray-900">{new Date(coverage.generatedAt).toLocaleTimeString()}</p>
        </div>
      </div>

      {sections.map((section) => {
        const avgCoverage = section.data.length > 0
          ? Math.round(section.data.reduce((s, e) => s + e.coveragePercent, 0) / section.data.length)
          : 0;
        const gapCount = section.data.reduce((s, e) => s + e.gapCount, 0);
        return (
          <details key={section.type} className="rounded border border-gray-200 bg-white">
            <summary className="flex cursor-pointer items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">{section.label}</span>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">{avgCoverage}%</span>
                {gapCount > 0 && (
                  <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">{gapCount} gaps</span>
                )}
              </div>
            </summary>
            <div className="border-t border-gray-100 p-3">
              <div className="space-y-1">
                {section.data.map((entry) => (
                  <div key={entry.label} className="flex items-center gap-2 text-xs">
                    <span className="w-40 truncate text-gray-600" title={entry.label}>{entry.label}</span>
                    <div className="h-2 flex-1 rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full ${entry.coveragePercent >= 80 ? "bg-green-500" : entry.coveragePercent >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${entry.coveragePercent}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-gray-500">{entry.currentCount}/{entry.targetCount}</span>
                    {entry.gapCount > 0 && <span className="w-16 text-right text-orange-600">{entry.gapCount} gap(s)</span>}
                  </div>
                ))}
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}

export default function AutonomousDiscoveryPreview() {
  const [selectedAgents, setSelectedAgents] = useState<MultiSourceDiscoveryAgentType[]>([
    "system-design-discovery-agent",
  ]);
  const [result, setResult] = useState<MultiSourceDiscoveryRunResult | null>(null);
  const [reviewBridge, setReviewBridge] = useState<AutonomousReviewBridgeResult | null>(null);

  const adaptiveResult = useMemo(() => {
    try {
      return runAdaptiveDiscoveryPipeline();
    } catch {
      return null;
    }
  }, []);

  const adaptiveSummary = useMemo(() => {
    return adaptiveResult ? summarizeAdaptivePipeline(adaptiveResult) : null;
  }, [adaptiveResult]);

  const toggleAgent = useCallback((agentType: MultiSourceDiscoveryAgentType) => {
    setSelectedAgents((prev) => {
      if (prev.includes(agentType)) {
        const next = prev.filter((item) => item !== agentType);
        return next.length > 0 ? next : prev;
      }
      return [...prev, agentType].sort();
    });
  }, []);

  const handleRun = useCallback(() => {
    const nextResult = runSelectedDiscoveryAgents({ agents: selectedAgents, limitPerAgent: 4 });
    setResult(nextResult);
    setReviewBridge(null);
  }, [selectedAgents]);

  const handleSendToReview = useCallback(() => {
    if (!result) return;
    setReviewBridge(createAutonomousImportReviewPackage(result));
  }, [result]);

  return (
    <div className="space-y-5 p-5">
      <div>
        <p className="text-sm font-semibold text-teal-700">Pack 13C</p>
        <h2 className="mt-1 text-lg font-semibold text-gray-900">Adaptive Discovery Agents</h2>
        <p className="mt-1 text-sm text-gray-500">
          Gap-cluster-driven discovery with adaptive seed expansion, confidence scoring, and coverage heatmaps.
        </p>
      </div>

      <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        <p className="font-semibold">Adaptive discovery does not modify the graph.</p>
        <p className="mt-0.5 text-xs">Candidates are generated from gap clusters and discovery packs. Every item requires human review.</p>
      </div>

      {/* Adaptive Discovery Summary */}
      {adaptiveSummary && (
        <div className="rounded border border-teal-200 bg-teal-50 p-4">
          <p className="text-sm font-semibold text-teal-800">Adaptive Discovery Summary</p>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <p className="text-[10px] text-teal-600">Total Gaps</p>
              <p className="text-xl font-bold text-teal-800">{adaptiveSummary.totalGaps}</p>
            </div>
            <div>
              <p className="text-[10px] text-teal-600">Gap Clusters</p>
              <p className="text-xl font-bold text-teal-800">{adaptiveSummary.totalClusters}</p>
            </div>
            <div>
              <p className="text-[10px] text-teal-600">Adaptive Candidates</p>
              <p className="text-xl font-bold text-teal-800">{adaptiveSummary.totalCandidates}</p>
            </div>
            <div>
              <p className="text-[10px] text-teal-600">Avg Confidence</p>
              <p className="text-xl font-bold text-teal-800">{Math.round(adaptiveSummary.avgConfidence * 100)}%</p>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div>
              <p className="text-[10px] text-teal-600">Overall Coverage</p>
              <p className="text-lg font-bold text-teal-800">{adaptiveSummary.overallCoverage}%</p>
            </div>
            <div>
              <p className="text-[10px] text-teal-600">Uncovered Gaps</p>
              <p className="text-lg font-bold text-teal-800">{adaptiveSummary.uncoveredGaps}</p>
            </div>
            <div>
              <p className="text-[10px] text-teal-600">Packs Used</p>
              <p className="text-lg font-bold text-teal-800">{adaptiveSummary.packUsageSummary.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Gap Clusters */}
      {adaptiveResult && adaptiveResult.clusters.length > 0 && (
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Gap Clusters ({adaptiveResult.clusters.length})</p>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {adaptiveResult.clusters.slice(0, 8).map((cluster) => (
              <ClusterCard key={cluster.id} cluster={cluster} />
            ))}
          </div>
        </div>
      )}

      {/* Discovery Pack Attribution */}
      {adaptiveSummary && adaptiveSummary.packUsageSummary.length > 0 && (
        <div className="rounded border border-gray-200 bg-white p-4">
          <p className="text-sm font-semibold text-gray-900">Discovery Pack Usage</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {adaptiveSummary.packUsageSummary.map((usage) => (
              <span key={usage} className="rounded bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">
                {usage}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Adaptive Candidates */}
      {adaptiveResult && adaptiveResult.candidates.length > 0 && (
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Adaptive Candidates ({adaptiveResult.candidates.length})</p>
          </div>
          <p className="mt-1 text-xs text-gray-500">Generated from gap clusters and discovery packs. Sorted by confidence score.</p>
          <div className="mt-3 space-y-3">
            {adaptiveResult.candidates.map((candidate) => (
              <AdaptiveCandidateCard
                key={candidate.id}
                candidate={candidate}
                confidence={adaptiveResult.confidenceScores[candidate.id]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Coverage Heatmap */}
      {adaptiveResult && adaptiveResult.coverage && (
        <div className="rounded border border-gray-200 bg-white p-4">
          <p className="text-sm font-semibold text-gray-900">Coverage Heatmap</p>
          <p className="mt-1 text-xs text-gray-500">
            Read-only snapshot of current graph coverage across all dimensions. Gaps show where coverage is below target.
          </p>
          <div className="mt-3">
            <CoverageHeatmapSection coverage={adaptiveResult.coverage} />
          </div>
        </div>
      )}

      {/* Domain Breakdown */}
      {adaptiveResult && (
        <div className="rounded border border-gray-200 bg-white p-4">
          <p className="text-sm font-semibold text-gray-900">Domain Breakdown</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["aws", "backend", "system-design", "career"].map((domain) => {
              const domainCandidates = adaptiveResult.candidates.filter((c) => c.domain === domain);
              const domainClusters = adaptiveResult.clusters.filter((c) => c.domain === domain);
              return (
                <div key={domain} className="rounded border border-gray-200 bg-gray-50 p-3">
                  <p className="text-sm font-semibold capitalize text-gray-900">{domain.replace("-", " ")}</p>
                  <div className="mt-1 space-y-0.5 text-xs text-gray-600">
                    <p>{domainCandidates.length} candidate(s)</p>
                    <p>{domainClusters.length} cluster(s)</p>
                    <p>{domainClusters.reduce((s, c) => s + c.gapCount, 0)} gap(s)</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Existing Seed-Backed Discovery */}
      <details className="rounded border border-gray-200">
        <summary className="flex cursor-pointer items-center justify-between p-4">
          <span className="text-sm font-semibold text-gray-900">Seed-Backed Discovery (Legacy)</span>
          <span className="text-xs text-gray-500">Click to expand</span>
        </summary>
        <div className="border-t border-gray-100 p-4">
          <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <p className="font-semibold">Autonomous discovery does not modify the graph.</p>
            <p className="mt-0.5 text-xs">Every item still runs through validation, metadata, candidate, duplicate, and review agents.</p>
          </div>

          <div className="mt-4 rounded border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-gray-700">Discovery agents</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {DEFAULT_MULTI_SOURCE_DISCOVERY_AGENTS.map((agentType) => (
                <label key={agentType} className="flex items-center gap-2 rounded border border-gray-200 px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedAgents.includes(agentType)}
                    onChange={() => toggleAgent(agentType)}
                    className="rounded border-gray-300"
                  />
                  <span>{AGENT_LABELS[agentType]}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={handleRun}
              className="mt-4 rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Run Selected Agents
            </button>
          </div>

          {result ? (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <div className="rounded border border-gray-200 bg-white p-3">
                  <p className="text-[10px] text-gray-500">Candidates</p>
                  <p className="text-xl font-bold text-gray-900">{result.summary.totalCandidates}</p>
                </div>
                <div className="rounded border border-purple-200 bg-purple-50 p-3">
                  <p className="text-[10px] text-purple-600">Review Required</p>
                  <p className="text-xl font-bold text-purple-700">{result.summary.reviewRequired}</p>
                </div>
                <div className="rounded border border-orange-200 bg-orange-50 p-3">
                  <p className="text-[10px] text-orange-600">Duplicate Risk</p>
                  <p className="text-xl font-bold text-orange-700">{result.summary.duplicateRisk}</p>
                </div>
                <div className="rounded border border-red-200 bg-red-50 p-3">
                  <p className="text-[10px] text-red-600">Failed</p>
                  <p className="text-xl font-bold text-red-700">{result.summary.failed}</p>
                </div>
                <div className="rounded border border-gray-200 bg-white p-3">
                  <p className="text-[10px] text-gray-500">Graph Writes</p>
                  <p className="text-xl font-bold text-gray-900">{result.summary.graphWrites}</p>
                </div>
              </div>

              <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Review bridge preview</p>
                    <p className="mt-0.5 text-xs">Send agent candidates to review queue, patch preview, and in-memory import preview.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendToReview}
                    className="rounded bg-amber-700 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-800"
                  >
                    Send to Review Queue
                  </button>
                </div>
              </div>

              {reviewBridge && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    <div className="rounded border border-gray-200 bg-white p-3">
                      <p className="text-[10px] text-gray-500">Review Items</p>
                      <p className="text-xl font-bold text-gray-900">{reviewBridge.summary.reviewPackageEntries}</p>
                    </div>
                    <div className="rounded border border-gray-200 bg-white p-3">
                      <p className="text-[10px] text-gray-500">Patch Entries</p>
                      <p className="text-xl font-bold text-gray-900">{reviewBridge.summary.patchEntries}</p>
                    </div>
                    <div className="rounded border border-orange-200 bg-orange-50 p-3">
                      <p className="text-[10px] text-orange-600">Conflicts</p>
                      <p className="text-xl font-bold text-orange-700">{reviewBridge.summary.patchConflicts}</p>
                    </div>
                    <div className="rounded border border-purple-200 bg-purple-50 p-3">
                      <p className="text-[10px] text-purple-600">Pending</p>
                      <p className="text-xl font-bold text-purple-700">{reviewBridge.reviewPackage?.summary.pendingCount ?? 0}</p>
                    </div>
                    <div className="rounded border border-gray-200 bg-white p-3">
                      <p className="text-[10px] text-gray-500">Graph Writes</p>
                      <p className="text-xl font-bold text-gray-900">{reviewBridge.summary.graphWrites}</p>
                    </div>
                  </div>

                  <div className="rounded border border-gray-200 bg-white p-4">
                    <p className="text-sm font-semibold text-gray-900">Review package preview</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {reviewBridge.reviewPackage?.reviewItems.slice(0, 6).map((item) => (
                        <span key={`${item.patchId}:${item.entryIndex}`} className="rounded bg-purple-100 px-2 py-0.5 text-[10px] text-purple-700">
                          {item.entry.type}:{item.decision}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded border border-gray-200 bg-white p-4">
                    <p className="text-sm font-semibold text-gray-900">In-memory import preview</p>
                    {reviewBridge.inMemoryImportPreview && (
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600 sm:grid-cols-4">
                        <p>Sources: {reviewBridge.inMemoryImportPreview.beforeCounts.sources} → {reviewBridge.inMemoryImportPreview.afterCounts.sources}</p>
                        <p>Topics: {reviewBridge.inMemoryImportPreview.beforeCounts.topics} → {reviewBridge.inMemoryImportPreview.afterCounts.topics}</p>
                        <p>Skipped: {reviewBridge.inMemoryImportPreview.skippedEntries.length}</p>
                        <p>Rollback: {reviewBridge.inMemoryImportPreview.rollbackPlan.removeSourceIds.length}</p>
                      </div>
                    )}
                    <p className="mt-2 text-xs font-semibold text-amber-700">No canonical graph files are written.</p>
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {result.agentResults.map((agentResult) => (
                  <div key={agentResult.agentType} className="rounded border border-gray-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{AGENT_LABELS[agentResult.agentType]}</p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {agentResult.trace.candidateCount} candidates · {agentResult.trace.reviewRequiredCount} review required
                        </p>
                      </div>
                      <span className="rounded bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-700">independent trace</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">seeds {agentResult.trace.seedCount}</span>
                      <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] text-orange-700">duplicate risk {agentResult.trace.duplicateRiskCount}</span>
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">graph writes {agentResult.trace.graphWrites}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {result.agentResults.flatMap((agentResult) =>
                  agentResult.candidates.map((candidate) => (
                    <div key={`${agentResult.agentType}:${candidate.seed.id}`} className="rounded border border-gray-200 bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-semibold text-teal-700">{AGENT_LABELS[agentResult.agentType]}</p>
                          <p className="mt-1 text-sm font-semibold text-gray-900">{candidate.seed.title}</p>
                          <p className="mt-0.5 text-xs text-gray-500">{candidate.seed.url}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {candidate.seed.tags.map((tag) => (
                              <span key={tag} className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <StatusBadge status={candidate.status} />
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">review-required</span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-gray-600">Duplicate matches: {candidate.duplicateMatchCount}</p>
                      <TraceView trace={candidate.pipelineResult.trace} />
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>
      </details>
    </div>
  );
}
