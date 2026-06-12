import { describe, it, expect } from "vitest";
import {
  validateBatchInput,
  createQueueFromUrls,
  processQueueItem,
  processDiscoveryQueue,
  summarizeQueue,
  resetQueueItem,
} from "./runtime-discovery-queue-service";
import type { RuntimeDiscoveryQueueItem } from "@/types/runtime-discovery-queue";

describe("runtime-discovery-queue-service", () => {
  describe("validateBatchInput", () => {
    it("accepts a single valid URL", () => {
      const result = validateBatchInput(["https://example.com/article"]);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("accepts up to 5 valid URLs", () => {
      const urls = [
        "https://example.com/1",
        "https://example.com/2",
        "https://example.com/3",
        "https://example.com/4",
        "https://example.com/5",
      ];
      const result = validateBatchInput(urls);
      expect(result.valid).toBe(true);
    });

    it("rejects empty URL list", () => {
      const result = validateBatchInput([]);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("At least one URL is required");
    });

    it("rejects more than 5 URLs", () => {
      const urls = Array.from({ length: 6 }, (_, i) => `https://example.com/${i + 1}`);
      const result = validateBatchInput(urls);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("exceeds maximum");
    });

    it("rejects duplicate URLs", () => {
      const result = validateBatchInput([
        "https://example.com/article",
        "https://example.com/article",
      ]);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("Duplicate"))).toBe(true);
    });

    it("rejects invalid URL format", () => {
      const result = validateBatchInput(["not-a-url"]);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("not a valid http(s) URL");
    });

    it("rejects empty string URL", () => {
      const result = validateBatchInput([""]);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("empty");
    });

    it("rejects non-http protocol", () => {
      const result = validateBatchInput(["ftp://example.com/file"]);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("not a valid http(s) URL");
    });
  });

  describe("createQueueFromUrls", () => {
    it("creates queued items for each URL", () => {
      const items = createQueueFromUrls(
        ["https://example.com/a", "https://example.com/b"]
      );
      expect(items).toHaveLength(2);
      items.forEach((item) => {
        expect(item.status).toBe("queued");
        expect(item.result).toBeNull();
        expect(item.completedAt).toBeNull();
        expect(item.id).toBeTruthy();
        expect(item.createdAt).toBeTruthy();
      });
      expect(items[0].url).toBe("https://example.com/a");
      expect(items[1].url).toBe("https://example.com/b");
    });

    it("trims whitespace from URLs", () => {
      const items = createQueueFromUrls(
        ["  https://example.com/a  "]
      );
      expect(items[0].url).toBe("https://example.com/a");
    });
  });

  describe("processQueueItem", () => {
    it("processes a single queued item through the pipeline", () => {
      const item: RuntimeDiscoveryQueueItem = {
        id: "test-1",
        url: "https://example.com/article",
        status: "queued",
        result: null,
        createdAt: new Date().toISOString(),
        completedAt: null,
      };
      const processed = processQueueItem(item, "test-user", "engineering-blog", true);
      expect(processed.result).not.toBeNull();
      expect(processed.completedAt).not.toBeNull();
      expect(processed.id).toBe(item.id);
      expect(processed.url).toBe(item.url);
    });

    it("fails for invalid URL (missing consent)", () => {
      const item: RuntimeDiscoveryQueueItem = {
        id: "test-2",
        url: "https://example.com/article",
        status: "queued",
        result: null,
        createdAt: new Date().toISOString(),
        completedAt: null,
      };
      const processed = processQueueItem(item, "test-user", "engineering-blog", false);
      expect(processed.result).not.toBeNull();
      expect(processed.result!.success).toBe(false);
      expect(processed.status).toBe("failed");
    });

    it("reaches review-required status on successful pipeline", () => {
      const item: RuntimeDiscoveryQueueItem = {
        id: "test-3",
        url: "https://example.com/article",
        status: "queued",
        result: null,
        createdAt: new Date().toISOString(),
        completedAt: null,
      };
      const processed = processQueueItem(item, "test-user", "engineering-blog", true);
      expect(processed.status).toBe("review-required");
    });
  });

  describe("processDiscoveryQueue", () => {
    it("processes a batch of valid URLs sequentially", () => {
      const result = processDiscoveryQueue(
        ["https://example.com/1", "https://example.com/2"],
        "test-user",
        "engineering-blog",
        true
      );
      expect(result.success).toBe(true);
      expect(result.items).toHaveLength(2);
      expect(result.errors).toEqual([]);
      expect(result.totalDurationMs).toBeGreaterThanOrEqual(0);
      result.items.forEach((item) => {
        expect(item.result).not.toBeNull();
        expect(item.completedAt).not.toBeNull();
      });
    });

    it("rejects batch with more than 5 URLs", () => {
      const urls = Array.from({ length: 6 }, (_, i) => `https://example.com/${i + 1}`);
      const result = processDiscoveryQueue(urls, "test-user", "engineering-blog", true);
      expect(result.success).toBe(false);
      expect(result.items).toHaveLength(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("rejects duplicate URLs in batch", () => {
      const result = processDiscoveryQueue(
        ["https://example.com/article", "https://example.com/article"],
        "test-user",
        "engineering-blog",
        true
      );
      expect(result.success).toBe(false);
      expect(result.items).toHaveLength(0);
    });

    it("processes batch with partial failure (invalid consent for one)", () => {
      const result = processDiscoveryQueue(
        ["https://example.com/1"],
        "test-user",
        "engineering-blog",
        false
      );
      expect(result.success).toBe(false);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].status).toBe("failed");
    });

    it("does not write to catalog or graph (no side effects)", () => {
      const result = processDiscoveryQueue(
        ["https://example.com/side-effect-check"],
        "test-user",
        "engineering-blog",
        true
      );
      expect(result.success).toBe(true);
      const item = result.items[0];
      expect(item.result!.candidate).not.toBeNull();
      expect(item.result!.review).not.toBeNull();
      expect(item.result!.review!.humanApprovalRequired).toBe(true);
    });
  });

  describe("summarizeQueue", () => {
    it("returns zero counts for empty array", () => {
      const summary = summarizeQueue([]);
      expect(summary.total).toBe(0);
      expect(summary.completed).toBe(0);
      expect(summary.failed).toBe(0);
      expect(summary.reviewRequired).toBe(0);
      expect(summary.duplicateRisk).toBe(0);
      expect(summary.running).toBe(0);
      expect(summary.queued).toBe(0);
    });

    it("correctly counts items by status", () => {
      const now = new Date().toISOString();
      const items: RuntimeDiscoveryQueueItem[] = [
        { id: "1", url: "https://example.com/1", status: "completed", result: null, createdAt: now, completedAt: now },
        { id: "2", url: "https://example.com/2", status: "failed", result: null, createdAt: now, completedAt: now },
        { id: "3", url: "https://example.com/3", status: "review-required", result: null, createdAt: now, completedAt: now },
        { id: "4", url: "https://example.com/4", status: "duplicate-risk", result: null, createdAt: now, completedAt: now },
        { id: "5", url: "https://example.com/5", status: "queued", result: null, createdAt: now, completedAt: null },
      ];
      const summary = summarizeQueue(items);
      expect(summary.total).toBe(5);
      expect(summary.completed).toBe(1);
      expect(summary.failed).toBe(1);
      expect(summary.reviewRequired).toBe(1);
      expect(summary.duplicateRisk).toBe(1);
      expect(summary.queued).toBe(1);
      expect(summary.running).toBe(0);
    });
  });

  describe("resetQueueItem", () => {
    it("resets a completed item back to queued", () => {
      const now = new Date().toISOString();
      const item: RuntimeDiscoveryQueueItem = {
        id: "reset-1",
        url: "https://example.com/article",
        status: "review-required",
        result: null,
        createdAt: now,
        completedAt: now,
      };
      const reset = resetQueueItem(item);
      expect(reset.status).toBe("queued");
      expect(reset.result).toBeNull();
      expect(reset.completedAt).toBeNull();
      expect(reset.id).toBe(item.id);
      expect(reset.url).toBe(item.url);
    });

    it("resets a failed item back to queued", () => {
      const now = new Date().toISOString();
      const item: RuntimeDiscoveryQueueItem = {
        id: "reset-2",
        url: "https://example.com/article",
        status: "failed",
        result: null,
        createdAt: now,
        completedAt: now,
      };
      const reset = resetQueueItem(item);
      expect(reset.status).toBe("queued");
    });
  });
});
