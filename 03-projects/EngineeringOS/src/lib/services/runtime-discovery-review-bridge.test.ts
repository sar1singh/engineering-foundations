import { describe, it, expect } from "vitest";
import type { RuntimeDiscoveryQueueItem } from "@/types/runtime-discovery-queue";
import type { PipelineResult } from "@/types/runtime-sub-agent";
import {
  extractReviewableCandidatesFromBatch,
  convertQueueItemToImportReviewItem,
  createBatchImportReviewPackage,
  generateBatchPatchPreview,
  summarizeBatchReviewBridge,
  summarizeBatchReviewPackage,
} from "./runtime-discovery-review-bridge";

function makeCandidateResult(
  title: string,
  url: string,
  overrides?: Partial<PipelineResult>
): PipelineResult {
  return {
    success: true,
    trace: [],
    validation: {
      agentType: "validation-agent",
      validation: { valid: true, errors: [], warnings: [] },
      submission: { url, submittedBy: "test", submittedAt: new Date().toISOString(), sourceType: "engineering-blog", consent: true },
    },
    metadata: {
      agentType: "metadata-agent",
      metadata: { title, description: `Content from ${url}`, keywords: [], contentType: "text/html", url, domain: new URL(url).hostname },
    },
    candidate: {
      agentType: "candidate-agent",
      candidate: {
        id: `cand-${Math.random().toString(36).slice(2, 10)}`,
        title,
        url,
        sourceType: "engineering-blog",
        tier: "tier-2",
        category: "engineering-blog",
        description: `Content fetched from ${url}`,
        discoveryMethod: "manual",
        discoveredAt: new Date().toISOString(),
        discoveredBy: "test",
        tags: [],
        estimatedConfidence: 0.75,
      },
      validation: { valid: true, errors: [], warnings: [] },
    },
    duplicate: {
      agentType: "duplicate-agent",
      duplicateInfo: { isDuplicate: false, matches: [] },
    },
    review: {
      agentType: "review-agent",
      humanApprovalRequired: true,
    },
    errors: [],
    warnings: [],
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    durationMs: 50,
    ...overrides,
  };
}

function makeItem(
  url: string,
  status: RuntimeDiscoveryQueueItem["status"],
  result: PipelineResult | null
): RuntimeDiscoveryQueueItem {
  return {
    id: `item-${Math.random().toString(36).slice(2, 8)}`,
    url,
    status,
    result,
    createdAt: new Date().toISOString(),
    completedAt: result ? new Date().toISOString() : null,
  };
}

describe("runtime-discovery-review-bridge", () => {
  describe("extractReviewableCandidatesFromBatch", () => {
    it("extracts review-required items with results", () => {
      const items = [
        makeItem("https://example.com/a", "review-required", makeCandidateResult("A", "https://example.com/a")),
        makeItem("https://example.com/b", "review-required", makeCandidateResult("B", "https://example.com/b")),
      ];
      const result = extractReviewableCandidatesFromBatch(items);
      expect(result).toHaveLength(2);
    });

    it("excludes failed items", () => {
      const items = [
        makeItem("https://example.com/a", "review-required", makeCandidateResult("A", "https://example.com/a")),
        makeItem("https://example.com/b", "failed", null),
      ];
      const result = extractReviewableCandidatesFromBatch(items);
      expect(result).toHaveLength(1);
      expect(result[0].url).toBe("https://example.com/a");
    });

    it("excludes duplicate-risk items", () => {
      const items = [
        makeItem("https://example.com/a", "duplicate-risk", makeCandidateResult("A", "https://example.com/a")),
        makeItem("https://example.com/b", "review-required", makeCandidateResult("B", "https://example.com/b")),
      ];
      const result = extractReviewableCandidatesFromBatch(items);
      expect(result).toHaveLength(1);
      expect(result[0].url).toBe("https://example.com/b");
    });

    it("excludes queued and running items", () => {
      const items = [
        makeItem("https://example.com/a", "queued", null),
        makeItem("https://example.com/b", "running", null),
        makeItem("https://example.com/c", "review-required", makeCandidateResult("C", "https://example.com/c")),
      ];
      const result = extractReviewableCandidatesFromBatch(items);
      expect(result).toHaveLength(1);
      expect(result[0].url).toBe("https://example.com/c");
    });

    it("returns empty when no reviewable items", () => {
      const items = [
        makeItem("https://example.com/a", "failed", null),
        makeItem("https://example.com/b", "queued", null),
      ];
      const result = extractReviewableCandidatesFromBatch(items);
      expect(result).toHaveLength(0);
    });
  });

  describe("convertQueueItemToImportReviewItem", () => {
    it("converts a review-required item to an ApprovedImportCandidate", () => {
      const item = makeItem("https://example.com/article", "review-required", makeCandidateResult("Test Article", "https://example.com/article"));
      const result = convertQueueItemToImportReviewItem(item, false);
      expect(result).not.toBeNull();
      expect(result!.candidateUrl).toBe("https://example.com/article");
      expect(result!.title).toBe("Test Article");
      expect(result!.sourceType).toBe("engineering-blog");
      expect(result!.overrideDuplicateRisk).toBe(false);
    });

    it("returns null when item has no result", () => {
      const item = makeItem("https://example.com/article", "queued", null);
      const result = convertQueueItemToImportReviewItem(item, false);
      expect(result).toBeNull();
    });

    it("returns null when item has no candidate", () => {
      const item = makeItem("https://example.com/article", "review-required", { success: true, trace: [], validation: null, metadata: null, candidate: null, duplicate: null, review: null, errors: [], warnings: [], startedAt: "", completedAt: "", durationMs: 0 });
      const result = convertQueueItemToImportReviewItem(item, true);
      expect(result).toBeNull();
    });

    it("sets overrideDuplicateRisk from parameter", () => {
      const item = makeItem("https://example.com/article", "review-required", makeCandidateResult("Test", "https://example.com/article"));
      const result = convertQueueItemToImportReviewItem(item, true);
      expect(result!.overrideDuplicateRisk).toBe(true);
    });
  });

  describe("summarizeBatchReviewBridge", () => {
    it("counts reviewable items correctly", () => {
      const items = [
        makeItem("https://example.com/1", "review-required", makeCandidateResult("1", "https://example.com/1")),
        makeItem("https://example.com/2", "failed", null),
        makeItem("https://example.com/3", "duplicate-risk", null),
        makeItem("https://example.com/4", "queued", null),
      ];
      const result = summarizeBatchReviewBridge(items, false);
      expect(result.totalQueueItems).toBe(4);
      expect(result.reviewableCount).toBe(1);
      expect(result.excludedFailed).toBe(1);
      expect(result.excludedDuplicateRisk).toBe(1);
      expect(result.excludedQueuedRunning).toBe(1);
      expect(result.hasReviewableItems).toBe(true);
    });

    it("returns hasReviewableItems false when no reviewable items", () => {
      const items = [
        makeItem("https://example.com/1", "failed", null),
        makeItem("https://example.com/2", "queued", null),
      ];
      const result = summarizeBatchReviewBridge(items, false);
      expect(result.hasReviewableItems).toBe(false);
    });

    it("counts duplicate-risk items when override is enabled", () => {
      const items = [
        makeItem("https://example.com/1", "review-required", makeCandidateResult("1", "https://example.com/1")),
        makeItem("https://example.com/2", "duplicate-risk", null),
      ];
      const result = summarizeBatchReviewBridge(items, true);
      expect(result.duplicateRiskWithOverride).toBe(1);
    });

    it("does not count duplicate-risk override when flag is false", () => {
      const items = [
        makeItem("https://example.com/1", "duplicate-risk", null),
      ];
      const result = summarizeBatchReviewBridge(items, false);
      expect(result.duplicateRiskWithOverride).toBe(0);
    });
  });

  describe("createBatchImportReviewPackage", () => {
    it("creates a review package from reviewable items", () => {
      const items = [
        makeItem("https://example.com/a", "review-required", makeCandidateResult("A", "https://example.com/a")),
        makeItem("https://example.com/b", "review-required", makeCandidateResult("B", "https://example.com/b")),
      ];
      const result = createBatchImportReviewPackage(items, false);
      expect(result.package).not.toBeNull();
      expect(result.package!.reviewItems.length).toBeGreaterThan(0);
      expect(result.summary.hasReviewableItems).toBe(true);
    });

    it("returns null package when no reviewable items", () => {
      const items = [
        makeItem("https://example.com/a", "failed", null),
      ];
      const result = createBatchImportReviewPackage(items, false);
      expect(result.package).toBeNull();
    });

    it("marks all items as pending initially", () => {
      const items = [
        makeItem("https://example.com/a", "review-required", makeCandidateResult("A", "https://example.com/a")),
      ];
      const result = createBatchImportReviewPackage(items, false);
      expect(result.package).not.toBeNull();
      for (const reviewItem of result.package!.reviewItems) {
        expect(reviewItem.decision).toBe("pending");
      }
    });

    it("does not write to catalog or graph", () => {
      const items = [
        makeItem("https://example.com/a", "review-required", makeCandidateResult("A", "https://example.com/a")),
      ];
      const result = createBatchImportReviewPackage(items, false);
      expect(result.package).not.toBeNull();
      expect(result.package!.patch).toBeDefined();
    });
  });

  describe("generateBatchPatchPreview", () => {
    it("generates a patch from reviewable items", () => {
      const items = [
        makeItem("https://example.com/a", "review-required", makeCandidateResult("A", "https://example.com/a")),
      ];
      const result = generateBatchPatchPreview(items, false);
      expect(result.patch).not.toBeNull();
      expect(result.patch!.entries.length).toBeGreaterThan(0);
    });

    it("returns null patch when no reviewable items", () => {
      const items = [
        makeItem("https://example.com/a", "failed", null),
      ];
      const result = generateBatchPatchPreview(items, false);
      expect(result.patch).toBeNull();
    });

    it("patch report includes correct counts", () => {
      const items = [
        makeItem("https://example.com/a", "review-required", makeCandidateResult("A", "https://example.com/a")),
        makeItem("https://example.com/b", "review-required", makeCandidateResult("B", "https://example.com/b")),
      ];
      const result = generateBatchPatchPreview(items, false);
      expect(result.patch).not.toBeNull();
      expect(result.patch!.report.candidatesProcessed).toBe(2);
    });

    it("output is deterministic for same input", () => {
      const items = [
        makeItem("https://example.com/a", "review-required", makeCandidateResult("A", "https://example.com/a")),
      ];
      const r1 = generateBatchPatchPreview(items, false);
      const r2 = generateBatchPatchPreview(items, false);
      expect(r1.patch).not.toBeNull();
      expect(r2.patch).not.toBeNull();
      expect(r1.patch!.entries).toEqual(r2.patch!.entries);
    });
  });

  describe("summarizeBatchReviewPackage", () => {
    it("returns null for null package", () => {
      const result = summarizeBatchReviewPackage(null);
      expect(result).toBeNull();
    });

    it("returns summary for valid package", () => {
      const items = [
        makeItem("https://example.com/a", "review-required", makeCandidateResult("A", "https://example.com/a")),
      ];
      const { package: pkg } = createBatchImportReviewPackage(items, false);
      const result = summarizeBatchReviewPackage(pkg);
      expect(result).not.toBeNull();
      expect(result!.totalEntries).toBeGreaterThan(0);
    });
  });
});
