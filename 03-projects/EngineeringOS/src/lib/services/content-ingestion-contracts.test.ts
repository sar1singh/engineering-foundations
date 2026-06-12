import { describe, expect, it } from "vitest";
import {
  validateContentCandidate,
  validateTopicMappingCandidate,
  validateSourceMappingCandidate,
  evaluateContentQuality,
  determineApprovalReadiness,
  canTransition,
  validateTransition,
  createNormalizedItem
} from "@/lib/services/content-ingestion-contracts";
import type {
  RawContentCandidate,
  TopicMappingCandidate,
  SourceMappingCandidate,
  ContentQualityReview,
  ContentSourceType,
  IngestionStatus
} from "@/types/content-ingestion";

function validCandidate(overrides: Partial<RawContentCandidate> = {}): RawContentCandidate {
  return {
    id: "cand-001",
    title: "AWS Well-Architected Framework Guide",
    url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
    sourceType: "official-docs",
    tier: "tier-1",
    category: "aws",
    description: "Official AWS Well-Architected Framework documentation.",
    discoveryMethod: "manual",
    discoveredAt: "2026-06-09T00:00:00Z",
    discoveredBy: "curator-sarwan",
    tags: ["aws", "well-architected", "architecture"],
    estimatedConfidence: 0.85,
    ...overrides
  };
}

function validTopicMapping(overrides: Partial<TopicMappingCandidate> = {}): TopicMappingCandidate {
  return {
    id: "map-t-001",
    normalizedItemId: "norm-001",
    topicId: "topic-aws-well-architected",
    topicName: "AWS Well-Architected Framework",
    capabilityIds: ["cap-aws-cloud-architecture"],
    skillIds: ["skill-aws-architecture-review"],
    relevanceScore: 0.9,
    mappedBy: "curator-sarwan",
    mappedAt: "2026-06-09T00:00:00Z",
    notes: "Direct match to existing topic",
    ...overrides
  };
}

function validSourceMapping(overrides: Partial<SourceMappingCandidate> = {}): SourceMappingCandidate {
  return {
    id: "map-s-001",
    normalizedItemId: "norm-001",
    sourceId: "aws-well-architected",
    sourceTitle: "AWS Well-Architected Framework",
    mappedBy: "curator-sarwan",
    mappedAt: "2026-06-09T00:00:00Z",
    notes: "Existing source match",
    ...overrides
  };
}

function validReview(overrides: Partial<ContentQualityReview> = {}): ContentQualityReview {
  return {
    id: "rev-001",
    normalizedItemId: "norm-001",
    reviewerId: "reviewer-sarwan",
    reviewedAt: "2026-06-09T00:00:00Z",
    urlReachable: true,
    contentFreshnessScore: 0.9,
    technicalAccuracyScore: 0.85,
    relevanceScore: 0.95,
    authorityScore: 0.9,
    overallScore: 0.88,
    issues: [],
    recommendations: [],
    passed: true,
    ...overrides
  };
}

describe("validateContentCandidate", () => {
  it("passes a valid candidate", () => {
    const result = validateContentCandidate(validCandidate());
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects candidate with empty id", () => {
    const result = validateContentCandidate(validCandidate({ id: "" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Candidate id is required");
  });

  it("rejects candidate with empty title", () => {
    const result = validateContentCandidate(validCandidate({ title: "" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Candidate title is required");
  });

  it("rejects candidate with invalid url", () => {
    const result = validateContentCandidate(validCandidate({ url: "ftp://bad" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Candidate url must start with http:// or https://");
  });

  it("rejects candidate with missing sourceType", () => {
    const result = validateContentCandidate(validCandidate({ sourceType: "" as ContentSourceType }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Candidate sourceType is required");
  });

  it("rejects candidate with confidence out of range", () => {
    const result = validateContentCandidate(validCandidate({ estimatedConfidence: 1.5 }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Candidate estimatedConfidence must be a number between 0 and 1");
  });

  it("warns when candidate has no tags", () => {
    const result = validateContentCandidate(validCandidate({ tags: [] }));
    expect(result.valid).toBe(true);
    expect(result.warnings).toContain("Candidate has no tags; consider adding at least one");
  });
});

describe("validateTopicMappingCandidate", () => {
  it("passes a valid topic mapping", () => {
    const result = validateTopicMappingCandidate(validTopicMapping());
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects mapping with empty topicId", () => {
    const result = validateTopicMappingCandidate(validTopicMapping({ topicId: "" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Mapping topicId is required");
  });

  it("rejects mapping with empty capabilityIds", () => {
    const result = validateTopicMappingCandidate(validTopicMapping({ capabilityIds: [] }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Mapping must include at least one capabilityId");
  });

  it("rejects mapping with invalid capabilityId", () => {
    const result = validateTopicMappingCandidate(validTopicMapping({ capabilityIds: ["cap-nonexistent"] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Invalid capabilityIds"))).toBe(true);
  });

  it("rejects mapping with invalid skillId", () => {
    const result = validateTopicMappingCandidate(validTopicMapping({ skillIds: ["skill-nonexistent"] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Invalid skillIds"))).toBe(true);
  });

  it("warns when relevanceScore is below 0.5", () => {
    const result = validateTopicMappingCandidate(validTopicMapping({ relevanceScore: 0.3 }));
    expect(result.valid).toBe(true);
    expect(result.warnings).toContain("Mapping relevanceScore is below 0.5; consider if mapping is appropriate");
  });
});

describe("validateSourceMappingCandidate", () => {
  it("passes a valid source mapping", () => {
    const result = validateSourceMappingCandidate(validSourceMapping());
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects mapping with empty sourceId", () => {
    const result = validateSourceMappingCandidate(validSourceMapping({ sourceId: "" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Mapping sourceId is required");
  });

  it("warns when sourceId is not in catalog", () => {
    const result = validateSourceMappingCandidate(validSourceMapping({ sourceId: "brand-new-source" }));
    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.includes("not yet in the catalog"))).toBe(true);
  });
});

describe("evaluateContentQuality", () => {
  it("passes a valid review", () => {
    const result = evaluateContentQuality(validReview());
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects review with missing reviewerId", () => {
    const result = evaluateContentQuality(validReview({ reviewerId: "" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Review reviewerId is required");
  });

  it("rejects review with out-of-range scores", () => {
    const result = evaluateContentQuality(validReview({ technicalAccuracyScore: 1.2 }));
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Technical accuracy"))).toBe(true);
  });

  it("warns when high score conflicts with not passed", () => {
    const result = evaluateContentQuality(validReview({ overallScore: 0.85, passed: false }));
    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.includes(">= 0.7"))).toBe(true);
  });

  it("warns when low score conflicts with passed", () => {
    const result = evaluateContentQuality(validReview({ overallScore: 0.3, passed: true }));
    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.includes("< 0.5"))).toBe(true);
  });
});

describe("determineApprovalReadiness", () => {
  it("approves when all conditions met", () => {
    const review = validReview({ passed: true, overallScore: 0.88 });
    const topicMappings = [validTopicMapping()];
    const sourceMappings = [validSourceMapping()];
    const result = determineApprovalReadiness(review, topicMappings, sourceMappings);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects when review not passed", () => {
    const review = validReview({ passed: false, overallScore: 0.88 });
    const result = determineApprovalReadiness(review, [validTopicMapping()], [validSourceMapping()]);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Content has not passed quality review");
  });

  it("rejects when no topic mappings exist", () => {
    const review = validReview({ passed: true, overallScore: 0.88 });
    const result = determineApprovalReadiness(review, [], [validSourceMapping()]);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("No topic mappings exist; at least one required for approval");
  });

  it("rejects when no source mappings exist", () => {
    const review = validReview({ passed: true, overallScore: 0.88 });
    const result = determineApprovalReadiness(review, [validTopicMapping()], []);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("No source mappings exist; at least one required for approval");
  });

  it("rejects when overall score below 0.6", () => {
    const review = validReview({ passed: true, overallScore: 0.5 });
    const result = determineApprovalReadiness(review, [validTopicMapping()], [validSourceMapping()]);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("below minimum threshold"))).toBe(true);
  });

  it("rejects when topic mappings are invalid", () => {
    const review = validReview({ passed: true, overallScore: 0.88 });
    const badMapping = validTopicMapping({ capabilityIds: ["cap-nonexistent"] });
    const result = determineApprovalReadiness(review, [badMapping], [validSourceMapping()]);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("One or more topic mappings are invalid");
  });
});

describe("canTransition", () => {
  it("allows discovered -> normalized", () => {
    expect(canTransition("discovered", "normalized")).toBe(true);
  });

  it("allows reviewed -> approved", () => {
    expect(canTransition("reviewed", "approved")).toBe(true);
  });

  it("allows approved -> published", () => {
    expect(canTransition("approved", "published")).toBe(true);
  });

  it("disallows discovered -> published (skip)", () => {
    expect(canTransition("discovered", "published")).toBe(false);
  });

  it("disallows published -> any (terminal)", () => {
    expect(canTransition("published", "rejected")).toBe(false);
  });

  it("disallows unknown status", () => {
    expect(canTransition("unknown" as IngestionStatus, "normalized")).toBe(false);
  });
});

describe("validateTransition", () => {
  it("passes a valid transition", () => {
    const result = validateTransition("discovered", "normalized", []);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects invalid transition", () => {
    const result = validateTransition("discovered", "published", []);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Cannot transition"))).toBe(true);
  });

  it("warns about unresolved errors", () => {
    const errors = [
      { id: "err-1", batchId: "b-1", candidateId: "c-1", stage: "discovered" as const, severity: "high" as const, message: "URL not reachable", details: "", timestamp: "", resolved: false }
    ];
    const result = validateTransition("discovered", "normalized", errors);
    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.includes("unresolved error"))).toBe(true);
  });
});

describe("createNormalizedItem", () => {
  it("creates a normalized item from a raw candidate", () => {
    const candidate = validCandidate();
    const item = createNormalizedItem(candidate, "norm-001");
    expect(item.id).toBe("norm-001");
    expect(item.rawCandidateId).toBe(candidate.id);
    expect(item.normalizedTitle).toBe(candidate.title);
    expect(item.normalizedUrl).toBe(candidate.url);
    expect(item.sourceType).toBe(candidate.sourceType);
    expect(item.tier).toBe(candidate.tier);
    expect(item.confidenceScore).toBe(candidate.estimatedConfidence);
    expect(item.checksum).toBeTruthy();
  });

  it("trims whitespace from title and url", () => {
    const candidate = validCandidate({ title: "  My Title  ", url: "  https://example.com  " });
    const item = createNormalizedItem(candidate, "norm-002");
    expect(item.normalizedTitle).toBe("My Title");
    expect(item.normalizedUrl).toBe("https://example.com");
  });
});
