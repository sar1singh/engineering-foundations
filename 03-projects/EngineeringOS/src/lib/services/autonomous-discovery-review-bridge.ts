import type { MultiSourceDiscoveryRunResult } from "./multi-source-discovery-orchestrator";
import type { MultiSourceDiscoveryAgentType } from "@/types/multi-source-discovery-agent";
import type { AutonomousDiscoveryCandidate } from "./autonomous-discovery-agent";
import type { ApprovedImportCandidate, ImportPatch } from "@/types/ingestion-patch";
import type { ApprovedImportPackage } from "@/types/import-review";
import type { SourceReliability, SourceTier } from "@/types/founder-beta";
import type { ApprovedBatchPatchOutput } from "./approved-batch-patch-output-service";
import type { GraphImportResult } from "./in-memory-graph-import-service";
import { generatePatchFromApprovedCandidates } from "./approved-import-patch-generator";
import { createImportReviewPackage } from "./import-review-service";
import { createApprovedBatchPatch } from "./approved-batch-patch-output-service";
import { applyPatchToInMemoryGraph } from "./in-memory-graph-import-service";

export type AutonomousReviewableCandidate = {
  agentType: MultiSourceDiscoveryAgentType;
  candidate: AutonomousDiscoveryCandidate;
};

export type AutonomousReviewBridgeSummary = {
  totalAgentCandidates: number;
  reviewableCount: number;
  excludedFailed: number;
  excludedDuplicateRisk: number;
  duplicateRiskFlagged: number;
  reviewPackageEntries: number;
  patchEntries: number;
  patchConflicts: number;
  inMemoryAddedSources: number;
  inMemoryAddedTopics: number;
  graphWrites: 0;
  hasReviewPackage: boolean;
  hasPatchPreview: boolean;
  hasInMemoryPreview: boolean;
};

export type AutonomousReviewBridgeResult = {
  reviewableCandidates: AutonomousReviewableCandidate[];
  importCandidates: ApprovedImportCandidate[];
  reviewPackage: ApprovedImportPackage | null;
  patchPreview: ImportPatch | null;
  batchPatchPreview: ApprovedBatchPatchOutput | null;
  inMemoryImportPreview: GraphImportResult | null;
  summary: AutonomousReviewBridgeSummary;
  warnings: string[];
};

function reliabilityFromConfidence(confidence: number): SourceReliability {
  if (confidence >= 0.7) return "high";
  if (confidence >= 0.4) return "medium";
  return "low";
}

function allAgentCandidates(result: MultiSourceDiscoveryRunResult): AutonomousReviewableCandidate[] {
  return result.agentResults.flatMap((agentResult) =>
    agentResult.candidates.map((candidate) => ({
      agentType: agentResult.agentType,
      candidate,
    }))
  );
}

export function extractReviewableCandidatesFromAgents(
  result: MultiSourceDiscoveryRunResult
): AutonomousReviewableCandidate[] {
  return allAgentCandidates(result)
    .filter(
      (item) =>
        (item.candidate.status === "review-required" || item.candidate.status === "duplicate-risk") &&
        item.candidate.reviewRequired &&
        item.candidate.pipelineResult.success &&
        item.candidate.pipelineResult.candidate !== null
    )
    .sort((a, b) => `${a.agentType}:${a.candidate.seed.id}`.localeCompare(`${b.agentType}:${b.candidate.seed.id}`));
}

export function convertAgentCandidateToReviewItem(
  item: AutonomousReviewableCandidate,
  overrideDuplicateRisk = false
): ApprovedImportCandidate | null {
  const candidate = item.candidate.pipelineResult.candidate?.candidate;
  if (!candidate) return null;

  const estimatedConfidence = candidate.estimatedConfidence ?? 0.6;

  return {
    candidateUrl: item.candidate.seed.url,
    candidateId: `${item.agentType}:${item.candidate.seed.id}`,
    title: candidate.title || item.candidate.seed.title || "Untitled",
    sourceType: candidate.sourceType as ApprovedImportCandidate["sourceType"],
    category: candidate.category || item.candidate.seed.category,
    description:
      candidate.description ||
      `Autonomous discovery candidate from ${item.agentType}: ${item.candidate.seed.title}`,
    tier: candidate.tier as SourceTier,
    reliability: reliabilityFromConfidence(estimatedConfidence),
    overrideDuplicateRisk,
    proposedSourceId: item.candidate.seed.proposedSourceId,
    proposedTopicId: item.candidate.seed.proposedTopicId,
  };
}

export function createAutonomousImportReviewPackage(
  result: MultiSourceDiscoveryRunResult,
  overrideDuplicateRisk = true
): AutonomousReviewBridgeResult {
  const reviewableCandidates = extractReviewableCandidatesFromAgents(result);
  const importCandidates = reviewableCandidates
    .map((candidate) => convertAgentCandidateToReviewItem(candidate, overrideDuplicateRisk))
    .filter((candidate): candidate is ApprovedImportCandidate => candidate !== null);
  const patchPreview = importCandidates.length > 0 ? generatePatchFromApprovedCandidates(importCandidates) : null;
  const reviewPackage = patchPreview ? createImportReviewPackage(patchPreview) : null;
  const batchPatchPreview = reviewPackage ? createApprovedBatchPatch(reviewPackage) : null;
  const inMemoryImportPreview = batchPatchPreview ? applyPatchToInMemoryGraph(batchPatchPreview) : null;

  return {
    reviewableCandidates,
    importCandidates,
    reviewPackage,
    patchPreview,
    batchPatchPreview,
    inMemoryImportPreview,
    summary: summarizeAutonomousReviewBridge(result, reviewPackage, patchPreview, inMemoryImportPreview),
    warnings: [
      "Autonomous discovery review bridge does not approve, apply, publish, persist, or write graph data.",
      "Patch and in-memory import previews remain review-gated; approved batch output is empty until human approval.",
    ],
  };
}

export function generateAutonomousBatchPatchPreview(
  result: MultiSourceDiscoveryRunResult,
  overrideDuplicateRisk = true
): {
  patchPreview: ImportPatch | null;
  reviewPackage: ApprovedImportPackage | null;
  batchPatchPreview: ApprovedBatchPatchOutput | null;
  inMemoryImportPreview: GraphImportResult | null;
  summary: AutonomousReviewBridgeSummary;
} {
  const bridge = createAutonomousImportReviewPackage(result, overrideDuplicateRisk);
  return {
    patchPreview: bridge.patchPreview,
    reviewPackage: bridge.reviewPackage,
    batchPatchPreview: bridge.batchPatchPreview,
    inMemoryImportPreview: bridge.inMemoryImportPreview,
    summary: bridge.summary,
  };
}

export function summarizeAutonomousReviewBridge(
  result: MultiSourceDiscoveryRunResult,
  reviewPackage: ApprovedImportPackage | null = null,
  patchPreview: ImportPatch | null = null,
  inMemoryImportPreview: GraphImportResult | null = null
): AutonomousReviewBridgeSummary {
  const candidates = allAgentCandidates(result);
  const reviewableCandidates = extractReviewableCandidatesFromAgents(result);

  return {
    totalAgentCandidates: candidates.length,
    reviewableCount: reviewableCandidates.length,
    excludedFailed: candidates.filter((item) => item.candidate.status === "failed").length,
    excludedDuplicateRisk: candidates.filter(
      (item) => item.candidate.status === "duplicate-risk" && !item.candidate.reviewRequired
    ).length,
    duplicateRiskFlagged: candidates.filter((item) => item.candidate.duplicate).length,
    reviewPackageEntries: reviewPackage?.reviewItems.length ?? 0,
    patchEntries: patchPreview?.entries.length ?? 0,
    patchConflicts: patchPreview?.conflicts.length ?? 0,
    inMemoryAddedSources: inMemoryImportPreview?.addedSources.length ?? 0,
    inMemoryAddedTopics: inMemoryImportPreview?.addedTopics.length ?? 0,
    graphWrites: 0,
    hasReviewPackage: reviewPackage !== null,
    hasPatchPreview: patchPreview !== null,
    hasInMemoryPreview: inMemoryImportPreview !== null,
  };
}
