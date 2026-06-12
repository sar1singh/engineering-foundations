import { describe, expect, it } from "vitest";
import {
  buildCandidateFromFetchResult,
  checkDuplicateInCatalog,
  previewCandidateImport,
} from "./manual-url-candidate-bridge";
import type { ManualUrlFetchResult } from "./manual-url-fetch-contracts";
import type { ContentSourceType } from "@/types/content-ingestion";

function successResult(overrides: Partial<ManualUrlFetchResult> = {}): ManualUrlFetchResult {
  return {
    fetchStatus: "success",
    httpStatus: 200,
    finalUrl: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
    contentType: "text/html",
    title: "AWS Well-Architected Framework",
    rawTextPreview: "<html>...content...</html>",
    extractedMetadata: { description: "A test page" },
    attribution: {
      agentId: "founder-beta-real-fetch-agent",
      agentVersion: "1.0.0",
      agentTraceId: "trace-abc12345",
      discoveredAt: "2026-06-11T00:00:00Z",
      sourceUrl: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
      extractionMethod: "manual",
      rawMetadata: "{}",
    },
    ...overrides,
  };
}

function errorResult(overrides: Partial<ManualUrlFetchResult> = {}): ManualUrlFetchResult {
  return {
    fetchStatus: "error",
    errors: ["network-error: Failed to fetch"],
    attribution: {
      agentId: "founder-beta-real-fetch-agent",
      agentVersion: "1.0.0",
      agentTraceId: "trace-error-001",
      discoveredAt: "2026-06-11T00:00:00Z",
      sourceUrl: "https://example.com/broken",
      extractionMethod: "manual",
      rawMetadata: "{}",
    },
    ...overrides,
  };
}

const validSubmission = {
  url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
  submittedBy: "sarwan",
  sourceType: "official-docs" as ContentSourceType,
};

describe("buildCandidateFromFetchResult", () => {
  it("builds a RawContentCandidate from a successful fetch result", () => {
    const result = successResult();
    const candidate = buildCandidateFromFetchResult(result, validSubmission);

    expect(candidate.id).toBeTruthy();
    expect(candidate.title).toBe("AWS Well-Architected Framework");
    expect(candidate.url).toBe(
      "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html"
    );
    expect(candidate.sourceType).toBe("official-docs");
    expect(candidate.tier).toBe("tier-2");
    expect(candidate.category).toBe("official-docs");
    expect(candidate.discoveryMethod).toBe("manual");
    expect(candidate.discoveredBy).toBe("sarwan");
    expect(candidate.tags).toEqual([]);
    expect(candidate.estimatedConfidence).toBe(0.7);
    expect(candidate.attribution).toBeDefined();
    expect(candidate.attribution!.agentId).toBe("founder-beta-real-fetch-agent");
    expect(candidate.agentTraceId).toBe("trace-abc12345");
  });

  it("falls back to URL for title when fetchResult has no title", () => {
    const result = successResult({ title: undefined });
    const candidate = buildCandidateFromFetchResult(result, validSubmission);
    expect(candidate.title).toBe(validSubmission.url);
  });

  it("falls back to submission URL for url when fetchResult has no finalUrl", () => {
    const result = successResult({ finalUrl: undefined });
    const candidate = buildCandidateFromFetchResult(result, validSubmission);
    expect(candidate.url).toBe(validSubmission.url);
  });

  it("sets low confidence for error fetch status", () => {
    const result = errorResult();
    const candidate = buildCandidateFromFetchResult(result, {
      ...validSubmission,
      url: "https://example.com/broken",
    });
    expect(candidate.estimatedConfidence).toBe(0.3);
  });

  it("preserves custom candidateId when provided", () => {
    const result = successResult();
    const candidate = buildCandidateFromFetchResult(result, validSubmission, "my-custom-id");
    expect(candidate.id).toBe("my-custom-id");
  });

  it("does not include attribution when fetchResult has none", () => {
    const result: ManualUrlFetchResult = {
      ...successResult(),
      attribution: undefined as unknown as ManualUrlFetchResult["attribution"],
    };
    const candidate = buildCandidateFromFetchResult(result, validSubmission);
    expect(candidate.attribution).toBeUndefined();
  });
});

describe("checkDuplicateInCatalog", () => {
  it("detects exact URL match against source catalog", () => {
    const result = checkDuplicateInCatalog(
      "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html"
    );
    expect(result.isDuplicate).toBe(true);
    expect(result.matches.some((m) => m.field === "url")).toBe(true);
    expect(result.matches.some((m) => m.source.id === "aws-well-architected")).toBe(true);
  });

  it("detects domain match against source catalog", () => {
    const result = checkDuplicateInCatalog(
      "https://docs.aws.amazon.com/some/new/path"
    );
    expect(result.isDuplicate).toBe(true);
    expect(result.matches.some((m) => m.field === "domain")).toBe(true);
  });

  it("detects title match against source catalog", () => {
    const result = checkDuplicateInCatalog(
      "https://unknown.example.com/page",
      "AWS Well-Architected Framework"
    );
    expect(result.isDuplicate).toBe(true);
    expect(result.matches.some((m) => m.field === "title")).toBe(true);
  });

  it("returns no duplicates for unknown URL", () => {
    const result = checkDuplicateInCatalog(
      "https://totally-new-source.example.com/docs"
    );
    expect(result.isDuplicate).toBe(false);
    expect(result.matches).toEqual([]);
  });

  it("is case-insensitive for URL matching", () => {
    const result = checkDuplicateInCatalog(
      "HTTPS://DOCS.AWS.AMAZON.COM/WELLARCHITECTED/LATEST/FRAMEWORK/WELCOME.HTML"
    );
    expect(result.isDuplicate).toBe(true);
    expect(result.matches.some((m) => m.field === "url")).toBe(true);
  });
});

describe("previewCandidateImport", () => {
  it("returns full preview with validation and duplicate info for a known URL", () => {
    const result = successResult();
    const preview = previewCandidateImport(result, validSubmission);

    expect(preview.candidate).toBeDefined();
    expect(preview.validation).toBeDefined();
    expect(preview.duplicateInfo.isDuplicate).toBe(true);
    expect(preview.humanApprovalRequired).toBe(true);
  });

  it("validation passes for well-formed candidate", () => {
    const result = successResult();
    const preview = previewCandidateImport(result, validSubmission);

    expect(preview.validation.valid).toBe(true);
    expect(preview.validation.errors).toEqual([]);
  });

  it("validation fails when sourceType is missing", () => {
    const result = successResult();
    const preview = previewCandidateImport(result, {
      ...validSubmission,
      sourceType: "" as ContentSourceType,
    });

    expect(preview.validation.valid).toBe(false);
    expect(preview.validation.errors.length).toBeGreaterThan(0);
  });

  it("human approval is required due to empty tags and known duplicate", () => {
    const result = successResult();
    const preview = previewCandidateImport(result, validSubmission);

    expect(preview.humanApprovalRequired).toBe(true);
  });

  it("returns no duplicates for an unknown URL", () => {
    const result = successResult({
      finalUrl: "https://brand-new-resource.example.com/guide",
      title: "Brand New Resource",
      attribution: {
        agentId: "founder-beta-real-fetch-agent",
        agentVersion: "1.0.0",
        agentTraceId: "trace-new-001",
        discoveredAt: "2026-06-11T00:00:00Z",
        sourceUrl: "https://brand-new-resource.example.com/guide",
        extractionMethod: "manual",
        rawMetadata: "{}",
      },
    });
    const preview = previewCandidateImport(result, {
      ...validSubmission,
      url: "https://brand-new-resource.example.com/guide",
    });

    expect(preview.duplicateInfo.isDuplicate).toBe(false);
    expect(preview.humanApprovalRequired).toBe(true);
  });

  it("includes the candidate description from fetch URL", () => {
    const result = successResult();
    const preview = previewCandidateImport(result, validSubmission);
    expect(preview.candidate.description).toContain("Content fetched from");
  });
});
