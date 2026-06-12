import type { RuntimeDiscoveryQueueItem } from "@/types/runtime-discovery-queue";
import type { ApprovedImportCandidate, ImportPatch } from "@/types/ingestion-patch";
import type { ApprovedImportPackage } from "@/types/import-review";
import type { SourceTier, SourceReliability } from "@/types/founder-beta";
import { generatePatchFromApprovedCandidates } from "./approved-import-patch-generator";
import { createImportReviewPackage, summarizeImportPackage } from "./import-review-service";
import type { ImportReviewSummary } from "@/types/import-review";

export type BatchReviewSummary = {
  totalQueueItems: number;
  reviewableCount: number;
  excludedFailed: number;
  excludedDuplicateRisk: number;
  excludedQueuedRunning: number;
  duplicateRiskWithOverride: number;
  hasReviewableItems: boolean;
};

export function extractReviewableCandidatesFromBatch(
  items: RuntimeDiscoveryQueueItem[]
): RuntimeDiscoveryQueueItem[] {
  return items.filter(
    (item) =>
      item.status === "review-required" &&
      item.result !== null &&
      item.result.candidate !== null
  );
}

export function convertQueueItemToImportReviewItem(
  item: RuntimeDiscoveryQueueItem,
  overrideDuplicateRisk: boolean
): ApprovedImportCandidate | null {
  if (!item.result || !item.result.candidate) return null;

  const candidate = item.result.candidate.candidate;
  const reliability: SourceReliability =
    candidate.estimatedConfidence >= 0.7 ? "high" :
    candidate.estimatedConfidence >= 0.4 ? "medium" : "low";

  return {
    candidateUrl: item.url,
    candidateId: candidate.id,
    title: candidate.title || "Untitled",
    sourceType: candidate.sourceType as ApprovedImportCandidate["sourceType"],
    category: candidate.category || candidate.sourceType,
    description: candidate.description || "",
    tier: candidate.tier as SourceTier,
    reliability,
    overrideDuplicateRisk,
  };
}

export function createBatchImportReviewPackage(
  items: RuntimeDiscoveryQueueItem[],
  overrideDuplicateRisk: boolean
): { package: ApprovedImportPackage | null; summary: BatchReviewSummary } {
  const summary = summarizeBatchReviewBridge(items, overrideDuplicateRisk);

  if (!summary.hasReviewableItems) {
    return { package: null, summary };
  }

  const reviewableItems = extractReviewableCandidatesFromBatch(items);
  const candidates: ApprovedImportCandidate[] = [];

  for (const item of reviewableItems) {
    const candidate = convertQueueItemToImportReviewItem(item, overrideDuplicateRisk);
    if (candidate) {
      candidates.push(candidate);
    }
  }

  if (candidates.length === 0) {
    return { package: null, summary };
  }

  const patch = generatePatchFromApprovedCandidates(candidates);
  const pkg = createImportReviewPackage(patch);

  return { package: pkg, summary };
}

export function generateBatchPatchPreview(
  items: RuntimeDiscoveryQueueItem[],
  overrideDuplicateRisk: boolean
): { patch: ImportPatch | null; summary: BatchReviewSummary } {
  const summary = summarizeBatchReviewBridge(items, overrideDuplicateRisk);

  if (!summary.hasReviewableItems) {
    return { patch: null, summary };
  }

  const reviewableItems = extractReviewableCandidatesFromBatch(items);
  const candidates: ApprovedImportCandidate[] = [];

  for (const item of reviewableItems) {
    const candidate = convertQueueItemToImportReviewItem(item, overrideDuplicateRisk);
    if (candidate) {
      candidates.push(candidate);
    }
  }

  if (candidates.length === 0) {
    return { patch: null, summary };
  }

  const patch = generatePatchFromApprovedCandidates(candidates);
  return { patch, summary };
}

export function summarizeBatchReviewBridge(
  items: RuntimeDiscoveryQueueItem[],
  overrideDuplicateRisk: boolean
): BatchReviewSummary {
  const totalQueueItems = items.length;
  let reviewableCount = 0;
  let excludedFailed = 0;
  let excludedDuplicateRisk = 0;
  let excludedQueuedRunning = 0;
  let duplicateRiskWithOverride = 0;

  for (const item of items) {
    switch (item.status) {
      case "review-required":
        reviewableCount++;
        break;
      case "failed":
        excludedFailed++;
        break;
      case "duplicate-risk":
        excludedDuplicateRisk++;
        if (overrideDuplicateRisk) {
          duplicateRiskWithOverride++;
        }
        break;
      case "completed":
        reviewableCount++;
        break;
      case "queued":
      case "running":
        excludedQueuedRunning++;
        break;
    }
  }

  const hasReviewableItems =
    reviewableCount > 0 &&
    items.some(
      (item) =>
        item.status === "review-required" &&
        item.result !== null &&
        item.result.candidate !== null
    );

  return {
    totalQueueItems,
    reviewableCount,
    excludedFailed,
    excludedDuplicateRisk,
    excludedQueuedRunning,
    duplicateRiskWithOverride,
    hasReviewableItems,
  };
}

export function summarizeBatchReviewPackage(
  pkg: ApprovedImportPackage | null
): ImportReviewSummary | null {
  if (!pkg) return null;
  return summarizeImportPackage(pkg);
}
