import { describe, it, expect } from "vitest";
import { runMetadataAgent } from "./metadata-agent";
import type { ManualUrlFetchResult } from "../manual-url-fetch-contracts";

function successFetchResult(overrides?: Partial<ManualUrlFetchResult>): ManualUrlFetchResult {
  return {
    fetchStatus: "success",
    httpStatus: 200,
    finalUrl: "https://example.com/article",
    contentType: "text/html",
    title: "Test Article",
    extractedMetadata: { description: "A test article", keywords: "test, article, example" },
    attribution: {
      agentId: "test-agent",
      agentVersion: "1.0",
      agentTraceId: "trace-123",
      discoveredAt: "2026-06-12T12:00:00Z",
      sourceUrl: "https://example.com/article",
      extractionMethod: "manual",
      rawMetadata: "{}",
    },
    ...overrides,
  };
}

describe("metadata-agent", () => {
  it("extracts metadata from successful fetch result", () => {
    const result = runMetadataAgent(successFetchResult(), "https://example.com/article");
    expect(result.success).toBe(true);
    expect(result.output).not.toBeNull();
    expect(result.output!.metadata.title).toBe("Test Article");
    expect(result.output!.metadata.domain).toBe("example.com");
    expect(result.output!.metadata.contentType).toBe("text/html");
  });

  it("extracts keywords from comma-separated string", () => {
    const result = runMetadataAgent(successFetchResult(), "https://example.com/article");
    expect(result.output!.metadata.keywords).toContain("test");
    expect(result.output!.metadata.keywords).toContain("article");
  });

  it("extracts keywords from array", () => {
    const fetchResult = successFetchResult({ extractedMetadata: { keywords: ["foo", "bar"] } });
    const result = runMetadataAgent(fetchResult, "https://example.com/article");
    expect(result.output!.metadata.keywords).toContain("foo");
    expect(result.output!.metadata.keywords).toContain("bar");
  });

  it("returns empty keywords when none present", () => {
    const fetchResult = successFetchResult({ extractedMetadata: {} });
    const result = runMetadataAgent(fetchResult, "https://example.com/article");
    expect(result.output!.metadata.keywords).toEqual([]);
  });

  it("extracts domain from URL", () => {
    const result = runMetadataAgent(successFetchResult(), "https://blog.example.com/path");
    expect(result.output!.metadata.domain).toBe("blog.example.com");
  });

  it("falls back to empty domain for invalid URL", () => {
    const result = runMetadataAgent(successFetchResult(), "not-a-url");
    expect(result.output!.metadata.domain).toBe("");
  });

  it("returns failure when fetch did not succeed", () => {
    const fetchResult = successFetchResult({ fetchStatus: "error", errors: ["Fetch failed"] });
    const result = runMetadataAgent(fetchResult, "https://example.com/article");
    expect(result.success).toBe(false);
    expect(result.output).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("adds warning when no title is present", () => {
    const fetchResult = successFetchResult({ title: undefined });
    const result = runMetadataAgent(fetchResult, "https://example.com/article");
    expect(result.success).toBe(true);
    expect(result.warnings.some((w) => w.toLowerCase().includes("title"))).toBe(true);
  });

  it("includes elapsedMs in result", () => {
    const result = runMetadataAgent(successFetchResult(), "https://example.com/article");
    expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
  });
});
