import { describe, expect, it } from "vitest";
import { MOCK_INGESTION_CANDIDATES } from "@/data/founder-beta/ingestion-mock-candidates";
import { simulateIngestion, simulateAllCandidates } from "@/lib/services/content-ingestion-simulator";

describe("simulateIngestion", () => {
  it("produces a simulation result for each mock candidate", () => {
    const allResults = simulateAllCandidates(MOCK_INGESTION_CANDIDATES);
    expect(allResults).toHaveLength(MOCK_INGESTION_CANDIDATES.length);
  });

  it("includes lifecycle steps for every candidate", () => {
    for (const scenario of MOCK_INGESTION_CANDIDATES) {
      const result = simulateIngestion(scenario);
      expect(result.lifecycleSteps.length).toBeGreaterThan(0);
      expect(result.candidateId).toBeTruthy();
    }
  });

  it("labels are preserved from scenario metadata", () => {
    const allResults = simulateAllCandidates(MOCK_INGESTION_CANDIDATES);
    const labels = allResults.map((r) => r.label);
    expect(labels).toContain("publish-ready");
    expect(labels).toContain("valid");
    expect(labels).toContain("invalid");
    expect(labels).toContain("weak");
    expect(labels).toContain("duplicate-risk");
  });
});

describe("publish-ready candidate simulation", () => {
  const scenario = MOCK_INGESTION_CANDIDATES.find((s) => s.label === "publish-ready")!;
  const result = simulateIngestion(scenario);

  it("passes validation", () => {
    expect(result.validationResult.valid).toBe(true);
    expect(result.validationResult.errors).toEqual([]);
  });

  it("creates a normalized item", () => {
    expect(result.normalizedItem).not.toBeNull();
    expect(result.normalizedItem!.id).toBe(scenario.applyPreview.normalizedItemId);
  });

  it("has valid topic and source mappings", () => {
    expect(result.topicMappingResults.every((r) => r.valid)).toBe(true);
    expect(result.sourceMappingResults.every((r) => r.valid)).toBe(true);
  });

  it("passes quality review", () => {
    expect(result.qualityResult).not.toBeNull();
    expect(result.qualityResult!.valid).toBe(true);
  });

  it("is approval-ready", () => {
    expect(result.approvalResult).not.toBeNull();
    expect(result.approvalResult!.valid).toBe(true);
    expect(result.approvalResult!.errors).toEqual([]);
  });

  it("reaches published status", () => {
    expect(result.finalStatus).toBe("published");
  });

  it("has all lifecycle steps in correct order", () => {
    const statuses = result.lifecycleSteps.map((s) => s.status);
    expect(statuses).toContain("discovered");
    expect(statuses).toContain("normalized");
    expect(statuses).toContain("mapped");
    expect(statuses).toContain("reviewed");
    expect(statuses).toContain("approved");
    expect(statuses).toContain("published");
    expect(statuses).not.toContain("rejected");
  });

  it("marks all lifecycle steps as passed", () => {
    const allPassed = result.lifecycleSteps.every((s) => s.passed);
    expect(allPassed).toBe(true);
  });
});

describe("invalid candidate simulation", () => {
  const scenario = MOCK_INGESTION_CANDIDATES.find((s) => s.label === "invalid")!;
  const result = simulateIngestion(scenario);

  it("fails validation", () => {
    expect(result.validationResult.valid).toBe(false);
    expect(result.validationResult.errors.length).toBeGreaterThan(0);
  });

  it("does not create a normalized item", () => {
    expect(result.normalizedItem).toBeNull();
  });

  it("reaches rejected status", () => {
    expect(result.finalStatus).toBe("rejected");
  });

  it("has a rejection reason", () => {
    expect(result.rejectionReason).toBeTruthy();
  });

  it("marks discovered step appropriately", () => {
    const discovered = result.lifecycleSteps.find((s) => s.status === "discovered")!;
    expect(discovered).toBeDefined();
    expect(discovered.passed).toBe(false);
  });

  it("marks normalized step as not passed", () => {
    const normalized = result.lifecycleSteps.find((s) => s.status === "normalized")!;
    expect(normalized).toBeDefined();
    expect(normalized.passed).toBe(false);
  });
});

describe("weak candidate simulation", () => {
  const scenario = MOCK_INGESTION_CANDIDATES.find((s) => s.label === "weak")!;
  const result = simulateIngestion(scenario);

  it("passes structural validation (has all fields)", () => {
    expect(result.validationResult.valid).toBe(true);
  });

  it("creates a normalized item", () => {
    expect(result.normalizedItem).not.toBeNull();
  });

  it("passes structural validation but fails approval readiness", () => {
    expect(result.qualityResult).not.toBeNull();
    expect(result.qualityResult!.valid).toBe(true);
    expect(result.qualityResult!.warnings.length).toBeGreaterThanOrEqual(0);
  });

  it("is not approval-ready", () => {
    expect(result.approvalResult).not.toBeNull();
    expect(result.approvalResult!.valid).toBe(false);
    expect(result.approvalResult!.errors.length).toBeGreaterThan(0);
  });

  it("reaches rejected status", () => {
    expect(result.finalStatus).toBe("rejected");
  });

  it("has meaningful rejection reason", () => {
    expect(result.rejectionReason).toContain("failed");
  });

  it("marks reviewed step detail with score", () => {
    const reviewed = result.lifecycleSteps.find((s) => s.status === "reviewed")!;
    expect(reviewed).toBeDefined();
    expect(reviewed.detail).toContain("0.38");
  });
});

describe("duplicate-risk candidate simulation", () => {
  const scenario = MOCK_INGESTION_CANDIDATES.find((s) => s.label === "duplicate-risk")!;
  const result = simulateIngestion(scenario);

  it("passes validation", () => {
    expect(result.validationResult.valid).toBe(true);
  });

  it("passes quality review", () => {
    expect(result.qualityResult).not.toBeNull();
    expect(result.qualityResult!.valid).toBe(true);
  });

  it("is approval-ready", () => {
    expect(result.approvalResult).not.toBeNull();
    expect(result.approvalResult!.valid).toBe(true);
  });

  it("reaches published status (approved with warnings)", () => {
    expect(result.finalStatus).toBe("published");
  });

  it("has warnings about potential duplicate in reviewed step", () => {
    const reviewed = result.lifecycleSteps.find((s) => s.status === "reviewed")!;
    expect(reviewed).toBeDefined();
    expect(reviewed.detail).toContain("0.72");
  });
});

describe("state transitions", () => {
  it("all lifecycle steps use valid transition statuses", () => {
    const validStatuses = ["discovered", "normalized", "mapped", "reviewed", "approved", "published", "rejected"];
    for (const scenario of MOCK_INGESTION_CANDIDATES) {
      const result = simulateIngestion(scenario);
      for (const step of result.lifecycleSteps) {
        expect(validStatuses).toContain(step.status);
      }
    }
  });

  it("every lifecycle step has a label and detail", () => {
    for (const scenario of MOCK_INGESTION_CANDIDATES) {
      const result = simulateIngestion(scenario);
      for (const step of result.lifecycleSteps) {
        expect(step.label).toBeTruthy();
        expect(step.detail).toBeTruthy();
      }
    }
  });
});
