import { describe, expect, it } from "vitest";
import {
  validateAgentDiscoveryOutput,
  validateDuplicateRisk,
  validateHumanApprovalRequired,
  validateAttribution,
  validateAgentCannotPublishDirectly,
  validateContentCandidate,
  assertHumanApprovalRequired,
  assertAgentCannotPublish,
  assertNoAutonomousWrite,
  assertValidAgentBoundary
} from "@/lib/services/content-ingestion-contracts";
import type { RawContentCandidate, DuplicateRiskAssessment, AgentAttribution, ContentSourceType, IngestionDiscoveryMethod, ContentTier } from "@/types/content-ingestion";

function agentCandidate(overrides: Partial<RawContentCandidate> = {}): RawContentCandidate {
  return {
    id: "agent-cand-001",
    title: "New Blog Post on Distributed Systems",
    url: "https://example.com/distributed-systems-guide",
    sourceType: "engineering-blog",
    tier: "tier-3",
    category: "distributed-systems",
    description: "A blog post about distributed systems concepts.",
    discoveryMethod: "agent-discovery",
    discoveredAt: "2026-06-10T08:00:00Z",
    discoveredBy: "discovery-agent-v1",
    tags: ["distributed-systems", "consensus", "raft"],
    estimatedConfidence: 0.75,
    attribution: {
      agentId: "discovery-agent-v1",
      agentVersion: "1.0.0",
      agentTraceId: "trace-abc-123",
      discoveredAt: "2026-06-10T08:00:00Z",
      sourceUrl: "https://example.com/distributed-systems-guide",
      extractionMethod: "scrape",
      rawMetadata: '{"content-type": "blog", "word-count": 2500}'
    },
    agentTraceId: "trace-abc-123",
    ...overrides
  };
}

describe("validateAgentDiscoveryOutput", () => {
  it("passes a valid agent-discovered candidate with attribution", () => {
    const result = validateAgentDiscoveryOutput(agentCandidate());
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("passes a manual candidate without attribution", () => {
    const candidate = agentCandidate({ discoveryMethod: "manual", attribution: undefined, agentTraceId: undefined });
    const result = validateAgentDiscoveryOutput(candidate);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects agent-discovered candidate missing attribution", () => {
    const candidate = agentCandidate({ attribution: undefined });
    const result = validateAgentDiscoveryOutput(candidate);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Agent-discovered candidates must include attribution metadata");
  });

  it("rejects agent-discovered candidate with empty attribution agentId", () => {
    const candidate = agentCandidate({
      attribution: {
        ...agentCandidate().attribution!,
        agentId: ""
      }
    });
    const result = validateAgentDiscoveryOutput(candidate);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Agent attribution agentId is required");
  });

  it("inherits base validation errors from validateContentCandidate", () => {
    const candidate = agentCandidate({ id: "", title: "" });
    const result = validateAgentDiscoveryOutput(candidate);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Candidate id is required");
    expect(result.errors).toContain("Candidate title is required");
  });
});

describe("validateDuplicateRisk", () => {
  const validRisk: DuplicateRiskAssessment = {
    similarCandidateIds: ["cand-001"],
    similarNormalizedIds: [],
    similarityScore: 0.85,
    overlappingTopicIds: ["topic-distributed-systems"],
    assessedBy: "duplicate-detection-agent-v1",
    assessedAt: "2026-06-10T08:05:00Z",
    notes: "High overlap with existing distributed systems content"
  };

  it("passes a valid duplicate risk assessment", () => {
    const result = validateDuplicateRisk(validRisk);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects duplicate risk with invalid similarity score", () => {
    const result = validateDuplicateRisk({ ...validRisk, similarityScore: 1.5 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Duplicate risk similarityScore must be a number between 0 and 1");
  });

  it("rejects duplicate risk with missing assessedBy", () => {
    const result = validateDuplicateRisk({ ...validRisk, assessedBy: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Duplicate risk assessedBy is required");
  });

  it("warns when high similarity overlaps with topics", () => {
    const result = validateDuplicateRisk({ ...validRisk, similarityScore: 0.9, overlappingTopicIds: ["topic-existing"] });
    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.includes("likely duplicate"))).toBe(true);
  });
});

describe("validateHumanApprovalRequired", () => {
  it("returns true for low-confidence candidate", () => {
    const candidate = agentCandidate({ estimatedConfidence: 0.3 });
    expect(validateHumanApprovalRequired(candidate)).toBe(true);
  });

  it("returns true for candidate with high duplicate risk", () => {
    const candidate = agentCandidate({
      estimatedConfidence: 0.7,
      duplicateRisk: {
        similarCandidateIds: ["cand-001"],
        similarNormalizedIds: [],
        similarityScore: 0.85,
        overlappingTopicIds: ["topic-existing"],
        assessedBy: "agent-v1",
        assessedAt: "2026-06-10T08:00:00Z",
        notes: ""
      }
    });
    expect(validateHumanApprovalRequired(candidate)).toBe(true);
  });

  it("returns true for candidate with no tags", () => {
    const candidate = agentCandidate({ tags: [], estimatedConfidence: 0.7 });
    expect(validateHumanApprovalRequired(candidate)).toBe(true);
  });

  it("returns false for high-confidence, low-risk candidate with tags", () => {
    const candidate = agentCandidate({ estimatedConfidence: 0.85, tags: ["distributed-systems"] });
    expect(validateHumanApprovalRequired(candidate)).toBe(false);
  });
});

describe("validateAttribution", () => {
  it("passes valid attribution", () => {
    const result = validateAttribution(agentCandidate());
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("warns when candidate has no attribution", () => {
    const candidate = agentCandidate({ attribution: undefined });
    const result = validateAttribution(candidate);
    expect(result.valid).toBe(true);
    expect(result.warnings).toContain("Candidate has no attribution metadata");
  });
});

describe("validateAgentCannotPublishDirectly", () => {
  it("blocks direct transition from discovered to published", () => {
    const result = validateAgentCannotPublishDirectly("discovered", "published");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("cannot transition directly"))).toBe(true);
  });

  it("blocks direct transition from discovered to approved", () => {
    const result = validateAgentCannotPublishDirectly("discovered", "approved");
    expect(result.valid).toBe(false);
  });

  it("blocks direct transition from normalized to published", () => {
    const result = validateAgentCannotPublishDirectly("normalized", "published");
    expect(result.valid).toBe(false);
  });

  it("blocks direct transition from mapped to published", () => {
    const result = validateAgentCannotPublishDirectly("mapped", "published");
    expect(result.valid).toBe(false);
  });

  it("allows agent output to transition normally through the workflow", () => {
    const result = validateAgentCannotPublishDirectly("discovered", "normalized");
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });
});

describe("assertHumanApprovalRequired", () => {
  it("rejects low-confidence candidate with error explaining threshold", () => {
    const candidate = agentCandidate({ estimatedConfidence: 0.3 });
    const result = assertHumanApprovalRequired(candidate);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("below threshold 0.4"))).toBe(true);
  });

  it("rejects high duplicate risk candidate", () => {
    const candidate = agentCandidate({
      estimatedConfidence: 0.7,
      duplicateRisk: {
        similarCandidateIds: ["cand-001"],
        similarNormalizedIds: [],
        similarityScore: 0.85,
        overlappingTopicIds: ["topic-existing"],
        assessedBy: "agent-v1",
        assessedAt: "2026-06-10T08:00:00Z",
        notes: ""
      }
    });
    const result = assertHumanApprovalRequired(candidate);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("above threshold 0.7"))).toBe(true);
  });

  it("rejects candidate with no tags", () => {
    const candidate = agentCandidate({ tags: [], estimatedConfidence: 0.7 });
    const result = assertHumanApprovalRequired(candidate);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("no tags"))).toBe(true);
  });

  it("passes high-confidence, low-risk candidate with tags", () => {
    const candidate = agentCandidate({ estimatedConfidence: 0.85, tags: ["distributed-systems"] });
    const result = assertHumanApprovalRequired(candidate);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("reports all violation reasons when multiple conditions fail", () => {
    const candidate = agentCandidate({
      estimatedConfidence: 0.3,
      tags: [],
      duplicateRisk: {
        similarCandidateIds: ["cand-001"],
        similarNormalizedIds: [],
        similarityScore: 0.9,
        overlappingTopicIds: ["topic-existing"],
        assessedBy: "agent-v1",
        assessedAt: "2026-06-10T08:00:00Z",
        notes: ""
      }
    });
    const result = assertHumanApprovalRequired(candidate);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });
});

describe("assertAgentCannotPublish", () => {
  it("delegates to validateAgentCannotPublishDirectly and returns same result", () => {
    const direct = validateAgentCannotPublishDirectly("discovered", "published");
    const assert = assertAgentCannotPublish("discovered", "published");
    expect(assert.valid).toBe(direct.valid);
    expect(assert.errors).toEqual(direct.errors);
  });

  it("blocks discovered -> published", () => {
    const result = assertAgentCannotPublish("discovered", "published");
    expect(result.valid).toBe(false);
  });

  it("blocks normalized -> published", () => {
    const result = assertAgentCannotPublish("normalized", "published");
    expect(result.valid).toBe(false);
  });

  it("allows discovered -> normalized", () => {
    const result = assertAgentCannotPublish("discovered", "normalized");
    expect(result.valid).toBe(true);
  });
});

describe("assertNoAutonomousWrite", () => {
  it("passes when no ContentApprovalDecision exists", () => {
    const result = assertNoAutonomousWrite(null);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects when ContentApprovalDecision exists", () => {
    const decision = {
      id: "dec-001",
      normalizedItemId: "norm-001",
      decision: "approved" as const,
      decidedBy: "agent-v1",
      decidedAt: "2026-06-10T08:00:00Z",
      reason: "Looks good",
      nextStatus: "published" as const
    };
    const result = assertNoAutonomousWrite(decision);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("autonomous write"))).toBe(true);
  });
});

describe("assertValidAgentBoundary", () => {
  it("passes for a valid agent candidate moving through normal workflow", () => {
    const candidate = agentCandidate();
    const result = assertValidAgentBoundary(candidate, "discovered", "normalized");
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects when agent candidate tries to publish directly", () => {
    const candidate = agentCandidate();
    const result = assertValidAgentBoundary(candidate, "discovered", "published");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("cannot transition"))).toBe(true);
  });

  it("rejects when agent candidate lacks attribution", () => {
    const candidate = agentCandidate({ attribution: undefined });
    const result = assertValidAgentBoundary(candidate, "discovered", "normalized");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("attribution"))).toBe(true);
  });

  it("rejects when human approval is required (low confidence)", () => {
    const candidate = agentCandidate({ estimatedConfidence: 0.3 });
    const result = assertValidAgentBoundary(candidate, "discovered", "normalized");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e: string) => e.includes("Boundary violation"))).toBe(true);
  });

  it("reports multiple violations when several boundary rules fail", () => {
    const candidate = agentCandidate({
      attribution: undefined,
      estimatedConfidence: 0.3,
      tags: []
    });
    const result = assertValidAgentBoundary(candidate, "discovered", "published");
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });
});
