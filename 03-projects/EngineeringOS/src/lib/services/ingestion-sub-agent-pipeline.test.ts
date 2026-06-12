import { describe, it, expect } from "vitest";
import {
  runFetchSubAgent,
  runValidationSubAgent,
  runCandidateBridgeSubAgent,
  runDuplicateDetectionSubAgent,
  runReviewPreparationSubAgent,
  runSubAgentIngestionPipeline,
} from "./ingestion-sub-agent-pipeline";
import type { ManualUrlFetchResult, FetchBoundary } from "./manual-url-fetch-contracts";
import type { RawContentCandidate } from "@/types/content-ingestion";
import type { CatalogDuplicateInfo } from "./manual-url-candidate-bridge";
import { DEFAULT_FETCH_BOUNDARY } from "./manual-url-dry-run";

function makeSampleFetchResult(overrides?: Partial<ManualUrlFetchResult>): ManualUrlFetchResult {
  return {
    fetchStatus: "success",
    httpStatus: 200,
    finalUrl: "https://example.com/article",
    contentType: "text/html",
    title: "Test Article",
    rawTextPreview: "<html>test</html>",
    extractedMetadata: { description: "A test" },
    attribution: {
      agentId: "test-agent",
      agentVersion: "1.0.0",
      agentTraceId: "trace-abc123",
      discoveredAt: new Date().toISOString(),
      sourceUrl: "https://example.com/article",
      extractionMethod: "manual",
      rawMetadata: "{}",
    },
    errors: [],
    ...overrides,
  };
}

const sampleSubmission = {
  url: "https://example.com/article",
  submittedBy: "test-user",
  sourceType: "engineering-blog" as const,
};

const baseInput = {
  url: "https://example.com/article",
  submittedBy: "test-user",
  sourceType: "engineering-blog" as const,
};

describe("runFetchSubAgent", () => {
  it("returns success for valid HTTPS URL", () => {
    const { result, validation, step } = runFetchSubAgent({
      url: "https://example.com/article",
      submittedBy: "test",
      submittedAt: new Date().toISOString(),
      sourceType: "engineering-blog",
      consent: true,
    });
    expect(result).not.toBeNull();
    expect(result?.fetchStatus).toBe("success");
    expect(validation.valid).toBe(true);
    expect(step.type).toBe("fetch");
    expect(step.status).toBe("completed");
    expect(step.hasError).toBe(false);
  });

  it("fails for missing URL", () => {
    const { result, validation, step } = runFetchSubAgent({
      url: "",
      submittedBy: "test",
      submittedAt: new Date().toISOString(),
      sourceType: "engineering-blog",
      consent: true,
    });
    expect(result).toBeNull();
    expect(validation.valid).toBe(false);
    expect(step.status).toBe("failed");
    expect(step.hasError).toBe(true);
  });

  it("fails for private network URL", () => {
    const { result, validation, step } = runFetchSubAgent({
      url: "http://localhost:3000/test",
      submittedBy: "test",
      submittedAt: new Date().toISOString(),
      sourceType: "engineering-blog",
      consent: true,
    });
    expect(result).toBeNull();
    expect(validation.valid).toBe(false);
    expect(step.hasError).toBe(true);
  });
});

describe("runValidationSubAgent", () => {
  it("passes valid fetch result", () => {
    const { valid, errors, step } = runValidationSubAgent(makeSampleFetchResult());
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
    expect(step.status).toBe("completed");
    expect(step.type).toBe("validate");
  });

  it("fails when attribution missing", () => {
    const { valid, errors, step } = runValidationSubAgent({
      ...makeSampleFetchResult(),
      attribution: undefined as unknown as ManualUrlFetchResult["attribution"],
    });
    expect(valid).toBe(false);
    expect(errors.length).toBeGreaterThan(0);
    expect(step.hasError).toBe(true);
  });

  it("fails when fetchStatus missing", () => {
    const { valid, errors, step } = runValidationSubAgent({
      ...makeSampleFetchResult(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fetchStatus: undefined as any,
    });
    expect(valid).toBe(false);
    expect(step.hasError).toBe(true);
  });
});

describe("runCandidateBridgeSubAgent", () => {
  it("builds candidate from valid fetch result", () => {
    const { candidate, validation, error, step } = runCandidateBridgeSubAgent(
      makeSampleFetchResult(),
      sampleSubmission
    );
    expect(candidate).not.toBeNull();
    expect(candidate?.title).toBe("Test Article");
    expect(validation?.valid).toBe(true);
    expect(error).toBeNull();
    expect(step.status).toBe("completed");
  });

  it("produces a candidate with attribution", () => {
    const { candidate } = runCandidateBridgeSubAgent(
      makeSampleFetchResult(),
      sampleSubmission
    );
    expect(candidate?.attribution).toBeDefined();
    expect(candidate?.attribution?.agentId).toBe("test-agent");
  });

  it("step has bridge type", () => {
    const { step } = runCandidateBridgeSubAgent(
      makeSampleFetchResult(),
      sampleSubmission
    );
    expect(step.type).toBe("bridge");
  });
});

describe("runDuplicateDetectionSubAgent", () => {
  const sampleCandidate: RawContentCandidate = {
    id: "cand-test-1",
    title: "Test Article",
    url: "https://example.com/unique-article",
    sourceType: "engineering-blog",
    tier: "tier-2",
    category: "engineering-blog",
    description: "A test",
    discoveryMethod: "manual",
    discoveredAt: new Date().toISOString(),
    discoveredBy: "test",
    tags: [],
    estimatedConfidence: 0.7,
  };

  it("returns no duplicates for unique URL", () => {
    const { duplicateInfo, step } = runDuplicateDetectionSubAgent(sampleCandidate);
    expect(duplicateInfo.isDuplicate).toBe(false);
    expect(duplicateInfo.matches).toHaveLength(0);
    expect(step.type).toBe("duplicate-detection");
    expect(step.status).toBe("completed");
  });

  it("detects duplicate by exact URL", () => {
    const { duplicateInfo } = runDuplicateDetectionSubAgent({
      ...sampleCandidate,
      url: "https://github.com/leonardomso/33-js-concepts",
    });
    expect(duplicateInfo.isDuplicate).toBe(true);
    expect(duplicateInfo.matches.some((m) => m.field === "url")).toBe(true);
  });

  it("detects duplicate by domain", () => {
    const { duplicateInfo } = runDuplicateDetectionSubAgent({
      ...sampleCandidate,
      url: "https://github.com/some-repo",
    });
    expect(duplicateInfo.isDuplicate).toBe(true);
  });

  it("step has correct elapsed metadata", () => {
    const { step } = runDuplicateDetectionSubAgent(sampleCandidate);
    expect(step.durationMs).toBeGreaterThanOrEqual(0);
    expect(step.startedAt).toBeTruthy();
    expect(step.completedAt).toBeTruthy();
  });
});

describe("runReviewPreparationSubAgent", () => {
  const sampleCandidate: RawContentCandidate = {
    id: "cand-review-1",
    title: "Review Test",
    url: "https://example.com/review-test",
    sourceType: "engineering-blog",
    tier: "tier-2",
    category: "engineering-blog",
    description: "Review item",
    discoveryMethod: "manual",
    discoveredAt: new Date().toISOString(),
    discoveredBy: "test",
    tags: [],
    estimatedConfidence: 0.7,
  };

  const validValidation = { valid: true, errors: [], warnings: [] };
  const noDupInfo = { isDuplicate: false, matches: [] };

  it("returns review item with candidate metadata", () => {
    const { reviewItem, step } = runReviewPreparationSubAgent(sampleCandidate, validValidation, noDupInfo);
    expect(reviewItem.candidateUrl).toBe("https://example.com/review-test");
    expect(reviewItem.candidateId).toBe("cand-review-1");
    expect(step.type).toBe("prepare-review");
  });

  it("marks human approval required when tags empty and confidence low", () => {
    const { reviewItem } = runReviewPreparationSubAgent(
      { ...sampleCandidate, tags: [], estimatedConfidence: 0.3 },
      validValidation,
      noDupInfo
    );
    expect(reviewItem.humanApprovalRequired).toBe(true);
  });

  it("marks human approval not required when tags present and high confidence", () => {
    const { reviewItem } = runReviewPreparationSubAgent(
      { ...sampleCandidate, tags: ["test-tag"], estimatedConfidence: 0.9 },
      validValidation,
      noDupInfo
    );
    expect(reviewItem.humanApprovalRequired).toBe(false);
  });

  it("marks human approval required when duplicate detected", () => {
    const dupInfo: CatalogDuplicateInfo = { isDuplicate: true, matches: [{ source: { id: "s1", url: "http://x", title: "X", sourceType: "engineering-blog", category: "test", tier: "tier-2", reliability: "medium", founderBetaRelevance: "0.5" }, field: "url" }] };
    const { reviewItem } = runReviewPreparationSubAgent(sampleCandidate, validValidation, dupInfo);
    expect(reviewItem.humanApprovalRequired).toBe(true);
    expect(reviewItem.duplicateWarning).toContain("1 existing source(s)");
  });

  it("never publishes autonomously", () => {
    const { reviewItem } = runReviewPreparationSubAgent(sampleCandidate, validValidation, noDupInfo);
    expect(reviewItem.humanApprovalRequired).toBeDefined();
    expect(reviewItem).not.toHaveProperty("publishAutomatically");
  });
});

describe("runSubAgentIngestionPipeline", () => {
  it("completes full pipeline for valid input", () => {
    const result = runSubAgentIngestionPipeline(baseInput);
    expect(result.status).toBe("completed");
    expect(result.traceId).toMatch(/^pipe-/);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
    expect(result.errors).toHaveLength(0);
  });

  it("produces all five sub-agent steps in order", () => {
    const result = runSubAgentIngestionPipeline(baseInput);
    expect(result.steps.map((s) => s.type)).toEqual([
      "fetch", "validate", "bridge", "duplicate-detection", "prepare-review",
    ]);
  });

  it("returns fetch result on success", () => {
    const result = runSubAgentIngestionPipeline(baseInput);
    expect(result.fetchResult).not.toBeNull();
  });

  it("returns candidate on success", () => {
    const result = runSubAgentIngestionPipeline(baseInput);
    expect(result.candidate).not.toBeNull();
  });

  it("returns duplicate info", () => {
    const result = runSubAgentIngestionPipeline(baseInput);
    expect(result.duplicateInfo).not.toBeNull();
  });

  it("returns review item", () => {
    const result = runSubAgentIngestionPipeline(baseInput);
    expect(result.reviewItem).not.toBeNull();
    expect(result.reviewItem?.candidateUrl).toBe("https://example.com/article");
  });

  it("gate is blocked (human approval required) for untagged candidate", () => {
    const result = runSubAgentIngestionPipeline(baseInput);
    expect(result.gateStatus).toBe("blocked");
  });

  it("fails the pipeline for an invalid URL", () => {
    const result = runSubAgentIngestionPipeline({ ...baseInput, url: "" });
    expect(result.status).toBe("failed");
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("fails the pipeline for a blocked URL", () => {
    const result = runSubAgentIngestionPipeline({ ...baseInput, url: "http://localhost:3000/test" });
    expect(result.status).toBe("failed");
    expect(result.gateStatus).toBe("blocked");
  });

  it("trace steps are ordered by start time", () => {
    const result = runSubAgentIngestionPipeline(baseInput);
    const sorted = [...result.steps].sort(
      (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
    );
    expect(sorted.map((s) => s.type)).toEqual(result.steps.map((s) => s.type));
  });

  it("each step has valid metadata", () => {
    const result = runSubAgentIngestionPipeline(baseInput);
    for (const step of result.steps) {
      expect(step.label).toBeTruthy();
      expect(step.details).toBeTruthy();
      expect(step.durationMs).toBeGreaterThanOrEqual(0);
      expect(step.startedAt).toBeTruthy();
      expect(step.completedAt).toBeTruthy();
    }
  });

  it("accepts optional fields", () => {
    const result = runSubAgentIngestionPipeline({
      ...baseInput,
      capabilityId: "cap-1",
      skillId: "skill-1",
      topicId: "topic-1",
      notes: "test",
    });
    expect(result.status).toBe("completed");
  });

  it("deterministic output shape for same input", () => {
    const r1 = runSubAgentIngestionPipeline(baseInput);
    const r2 = runSubAgentIngestionPipeline(baseInput);
    expect(r1.steps.map((s) => s.type)).toEqual(r2.steps.map((s) => s.type));
    expect(r1.gateStatus).toBe(r2.gateStatus);
  });
});
