import { describe, it, expect } from "vitest";
import { runCandidateAgent } from "./candidate-agent";
import type { ManualUrlFetchResult, ManualUrlSubmission } from "../manual-url-fetch-contracts";

function successFetchResult(overrides?: Partial<ManualUrlFetchResult>): ManualUrlFetchResult {
  return {
    fetchStatus: "success",
    httpStatus: 200,
    finalUrl: "https://example.com/article",
    contentType: "text/html",
    title: "Test Article",
    extractedMetadata: { description: "A test article" },
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

function validSubmission(overrides?: Partial<ManualUrlSubmission>): ManualUrlSubmission {
  return {
    url: "https://example.com/article",
    submittedBy: "test-user",
    submittedAt: new Date("2026-06-12T12:00:00Z").toISOString(),
    sourceType: "engineering-blog",
    consent: true,
    ...overrides,
  };
}

describe("candidate-agent", () => {
  it("generates candidate from successful fetch", () => {
    const result = runCandidateAgent(successFetchResult(), validSubmission());
    expect(result.success).toBe(true);
    expect(result.output).not.toBeNull();
    expect(result.output!.agentType).toBe("candidate-agent");
    expect(result.output!.candidate.title).toBe("Test Article");
    expect(result.output!.candidate.url).toBe("https://example.com/article");
    expect(result.output!.candidate.sourceType).toBe("engineering-blog");
  });

  it("returns failure when fetch did not succeed", () => {
    const fetchResult = successFetchResult({ fetchStatus: "error", errors: ["Fetch failed"] });
    const result = runCandidateAgent(fetchResult, validSubmission());
    expect(result.success).toBe(false);
    expect(result.output).toBeNull();
  });

  it("sets discoveryMethod to manual", () => {
    const result = runCandidateAgent(successFetchResult(), validSubmission());
    expect(result.output!.candidate.discoveryMethod).toBe("manual");
  });

  it("includes elapsedMs in result", () => {
    const result = runCandidateAgent(successFetchResult(), validSubmission());
    expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
  });
});
