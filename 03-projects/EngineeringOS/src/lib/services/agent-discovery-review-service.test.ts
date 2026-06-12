import { describe, it, expect } from "vitest";
import {
  createInitialReviewStates,
  computeQueueSummary,
  filterResultsByQueue,
  getQueueFilterLabel,
  updateReviewDecision,
  addMappingOverride,
  removeMappingOverride
} from "./agent-discovery-review-service";
import type { AgentDiscoveryPreviewResult } from "./agent-discovery-simulator";
import type { CandidateReviewState } from "./agent-discovery-review-service";

function makeMockResult(
  scenarioId: string,
  finalGateStatus: "pass" | "blocked"
): AgentDiscoveryPreviewResult {
  return {
    scenarioId,
    agentName: "Mock Agent",
    label: "mock",
    description: "Mock",
    confidence: 0.8,
    discoveryMethod: "mock",
    agentDiscoveryValidation: { valid: true, errors: [], warnings: [] },
    attributionValidation: { valid: true, errors: [], warnings: [] },
    duplicateRiskValidation: null,
    requiresHumanApproval: false,
    humanApprovalRationale: [],
    candidatePreview: {
      id: "mock-id",
      rawCandidateId: "raw-mock",
      normalizedTitle: "Mock",
      normalizedUrl: "http://example.com",
      sourceType: "engineering-blog",
      tier: "tier-1",
      category: "mock",
      description: "Mock candidate",
      tags: ["mock"],
      confidenceScore: 0.8,
      normalizedAt: "2026-06-10T00:00:00Z",
      normalizedBy: "mock-agent",
      checksum: "abc123"
    },
    qualityResult: null,
    topicMappingResults: [],
    sourceMappingResults: [],
    finalGateStatus,
    publishGateResult: { valid: false, errors: ["Agents cannot publish directly"], warnings: [] }
  };
}

function state(overrides: Partial<CandidateReviewState> & { scenarioId: string }): CandidateReviewState {
  return {
    decision: "pending",
    qualityNotes: "",
    rejectionReason: "",
    needsChangesNotes: "",
    mappingOverrides: [],
    ...overrides
  };
}

const MOCK_RESULTS: AgentDiscoveryPreviewResult[] = [
  makeMockResult("scenario-1", "pass"),
  makeMockResult("scenario-2", "blocked"),
  makeMockResult("scenario-3", "pass")
];

describe("agent-discovery-review-service", () => {
  describe("createInitialReviewStates", () => {
    it("creates a map with pending state for each id", () => {
      const map = createInitialReviewStates(["s1", "s2", "s3"]);
      expect(map.size).toBe(3);
      for (const [id, s] of map) {
        expect(s.scenarioId).toBe(id);
        expect(s.decision).toBe("pending");
        expect(s.qualityNotes).toBe("");
        expect(s.rejectionReason).toBe("");
        expect(s.needsChangesNotes).toBe("");
        expect(s.mappingOverrides).toEqual([]);
      }
    });

    it("returns empty map for empty input", () => {
      const map = createInitialReviewStates([]);
      expect(map.size).toBe(0);
    });
  });

  describe("computeQueueSummary", () => {
    it("computes correct counts from review states and results", () => {
      const states: CandidateReviewState[] = [
        state({ scenarioId: "s1", decision: "pending" }),
        state({ scenarioId: "s2", decision: "approved" }),
        state({ scenarioId: "s3", decision: "rejected" }),
        state({ scenarioId: "s4", decision: "needs-changes" }),
        state({ scenarioId: "s5", decision: "pending" })
      ];
      const results = [
        makeMockResult("s1", "pass"),
        makeMockResult("s2", "pass"),
        makeMockResult("s3", "pass"),
        makeMockResult("s4", "pass"),
        makeMockResult("s5", "blocked")
      ];

      const summary = computeQueueSummary(states, results);
      expect(summary.total).toBe(5);
      expect(summary.pending).toBe(2);
      expect(summary.approved).toBe(1);
      expect(summary.rejected).toBe(1);
      expect(summary.needsChanges).toBe(1);
      expect(summary.blocked).toBe(1);
      expect(summary.passable).toBe(3);
    });

    it("returns zero counts for empty input", () => {
      const summary = computeQueueSummary([], []);
      expect(summary.total).toBe(0);
      expect(summary.pending).toBe(0);
      expect(summary.approved).toBe(0);
      expect(summary.rejected).toBe(0);
      expect(summary.needsChanges).toBe(0);
      expect(summary.blocked).toBe(0);
      expect(summary.passable).toBe(0);
    });
  });

  describe("filterResultsByQueue", () => {
    it("returns all results for 'all' filter", () => {
      const states = MOCK_RESULTS.map((r) => state({ scenarioId: r.scenarioId }));
      const filtered = filterResultsByQueue("all", MOCK_RESULTS, states);
      expect(filtered).toHaveLength(3);
    });

    it("returns blocked results for 'blocked' filter", () => {
      const states = MOCK_RESULTS.map((r) => state({ scenarioId: r.scenarioId }));
      const filtered = filterResultsByQueue("blocked", MOCK_RESULTS, states);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].scenarioId).toBe("scenario-2");
    });

    it("filters by review decision", () => {
      const states: CandidateReviewState[] = [
        state({ scenarioId: "scenario-1", decision: "approved" }),
        state({ scenarioId: "scenario-2", decision: "rejected" }),
        state({ scenarioId: "scenario-3", decision: "pending" })
      ];
      const approved = filterResultsByQueue("approved", MOCK_RESULTS, states);
      expect(approved).toHaveLength(1);
      expect(approved[0].scenarioId).toBe("scenario-1");
    });
  });

  describe("getQueueFilterLabel", () => {
    it("returns correct labels for all filters", () => {
      expect(getQueueFilterLabel("all")).toBe("All");
      expect(getQueueFilterLabel("pending")).toBe("Pending");
      expect(getQueueFilterLabel("approved")).toBe("Approved");
      expect(getQueueFilterLabel("rejected")).toBe("Rejected");
      expect(getQueueFilterLabel("needs-changes")).toBe("Needs Changes");
      expect(getQueueFilterLabel("blocked")).toBe("Blocked");
    });
  });

  describe("updateReviewDecision", () => {
    it("updates decision to approved", () => {
      const s = state({ scenarioId: "s1" });
      const updated = updateReviewDecision(s, "approved");
      expect(updated.decision).toBe("approved");
      expect(updated.rejectionReason).toBe("");
    });

    it("updates decision with rejection reason", () => {
      const s = state({ scenarioId: "s1" });
      const updated = updateReviewDecision(s, "rejected", { rejectionReason: "Low quality" });
      expect(updated.decision).toBe("rejected");
      expect(updated.rejectionReason).toBe("Low quality");
    });

    it("updates decision with needs-changes notes", () => {
      const s = state({ scenarioId: "s1" });
      const updated = updateReviewDecision(s, "needs-changes", { needsChangesNotes: "Add more sources" });
      expect(updated.decision).toBe("needs-changes");
      expect(updated.needsChangesNotes).toBe("Add more sources");
    });

    it("preserves existing rejection reason when not provided", () => {
      const s = state({ scenarioId: "s1", decision: "rejected", rejectionReason: "Duplicate" });
      const updated = updateReviewDecision(s, "pending");
      expect(updated.decision).toBe("pending");
      expect(updated.rejectionReason).toBe("Duplicate");
    });
  });

  describe("addMappingOverride", () => {
    it("adds a mapping override with generated id", () => {
      const s = state({ scenarioId: "s1" });
      const override = { mappingType: "topic" as const, field: "topicId", originalValue: "", overriddenValue: "new-topic", notes: "Re-categorized" };
      const updated = addMappingOverride(s, override);
      expect(updated.mappingOverrides).toHaveLength(1);
      expect(updated.mappingOverrides[0].field).toBe("topicId");
      expect(updated.mappingOverrides[0].overriddenValue).toBe("new-topic");
      expect(updated.mappingOverrides[0].id).toMatch(/^override-/);
    });

    it("appends to existing overrides", () => {
      const s = state({
        scenarioId: "s1",
        mappingOverrides: [{ id: "existing", mappingType: "source" as const, field: "sourceId", originalValue: "", overriddenValue: "new-source", notes: "" }]
      });
      const updated = addMappingOverride(s, { mappingType: "topic" as const, field: "topicId", originalValue: "", overriddenValue: "new-topic", notes: "Updated" });
      expect(updated.mappingOverrides).toHaveLength(2);
    });
  });

  describe("removeMappingOverride", () => {
    it("removes an existing override by id", () => {
      const s = state({
        scenarioId: "s1",
        mappingOverrides: [{ id: "o1", mappingType: "topic" as const, field: "topicId", originalValue: "", overriddenValue: "new-topic", notes: "" }]
      });
      const updated = removeMappingOverride(s, "o1");
      expect(updated.mappingOverrides).toHaveLength(0);
    });

    it("does nothing when id does not match", () => {
      const s = state({
        scenarioId: "s1",
        mappingOverrides: [{ id: "o1", mappingType: "topic" as const, field: "topicId", originalValue: "", overriddenValue: "new-topic", notes: "" }]
      });
      const updated = removeMappingOverride(s, "nonexistent");
      expect(updated.mappingOverrides).toHaveLength(1);
    });
  });
});
