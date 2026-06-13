import { describe, expect, it } from "vitest";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";
import type { MultiSourceDiscoveryRunResult } from "./multi-source-discovery-orchestrator";
import {
  createAutonomousImportReviewPackage,
  extractReviewableCandidatesFromAgents,
  generateAutonomousBatchPatchPreview,
  summarizeAutonomousReviewBridge,
} from "./autonomous-discovery-review-bridge";
import { runSelectedDiscoveryAgents } from "./multi-source-discovery-orchestrator";

describe("autonomous-discovery-review-bridge", () => {
  it("moves AWS agent candidates into review", () => {
    const result = runSelectedDiscoveryAgents({ agents: ["aws-discovery-agent"], submittedBy: "test", limitPerAgent: 2 });
    const bridge = createAutonomousImportReviewPackage(result);

    expect(bridge.reviewableCandidates.every((candidate) => candidate.agentType === "aws-discovery-agent")).toBe(true);
    expect(bridge.reviewPackage?.reviewItems.length).toBeGreaterThan(0);
    expect(bridge.reviewPackage?.summary.pendingCount).toBe(bridge.reviewPackage?.reviewItems.length);
  });

  it("moves system design agent candidates into review", () => {
    const result = runSelectedDiscoveryAgents({ agents: ["system-design-discovery-agent"], submittedBy: "test", limitPerAgent: 2 });
    const bridge = createAutonomousImportReviewPackage(result);

    expect(bridge.reviewableCandidates.every((candidate) => candidate.agentType === "system-design-discovery-agent")).toBe(true);
    expect(bridge.importCandidates.length).toBe(2);
  });

  it("moves backend agent candidates into review", () => {
    const result = runSelectedDiscoveryAgents({ agents: ["backend-discovery-agent"], submittedBy: "test", limitPerAgent: 2 });
    const bridge = createAutonomousImportReviewPackage(result);

    expect(bridge.reviewableCandidates.every((candidate) => candidate.agentType === "backend-discovery-agent")).toBe(true);
    expect(bridge.summary.reviewableCount).toBe(2);
  });

  it("moves career agent candidates into review", () => {
    const result = runSelectedDiscoveryAgents({ agents: ["career-discovery-agent"], submittedBy: "test", limitPerAgent: 2 });
    const bridge = createAutonomousImportReviewPackage(result);

    expect(bridge.reviewableCandidates.every((candidate) => candidate.agentType === "career-discovery-agent")).toBe(true);
    expect(bridge.reviewPackage).not.toBeNull();
  });

  it("flags duplicate-risk candidates and keeps them review-visible", () => {
    const result = withCandidateStatus(
      runSelectedDiscoveryAgents({ agents: ["aws-discovery-agent"], submittedBy: "test", limitPerAgent: 2 }),
      0,
      "duplicate-risk",
      true
    );
    const bridge = createAutonomousImportReviewPackage(result);

    expect(bridge.summary.duplicateRiskFlagged).toBeGreaterThanOrEqual(1);
    expect(bridge.summary.excludedDuplicateRisk).toBe(0);
    expect(bridge.reviewableCandidates).toHaveLength(2);
  });

  it("excludes failed candidates", () => {
    const result = withCandidateStatus(
      runSelectedDiscoveryAgents({ agents: ["backend-discovery-agent"], submittedBy: "test", limitPerAgent: 2 }),
      0,
      "failed",
      false
    );
    const reviewable = extractReviewableCandidatesFromAgents(result);
    const summary = summarizeAutonomousReviewBridge(result);

    expect(reviewable).toHaveLength(1);
    expect(summary.excludedFailed).toBe(1);
  });

  it("generates patch preview", () => {
    const result = runSelectedDiscoveryAgents({ agents: ["career-discovery-agent"], submittedBy: "test", limitPerAgent: 1 });
    const preview = generateAutonomousBatchPatchPreview(result);

    expect(preview.patchPreview).not.toBeNull();
    expect(preview.patchPreview?.entries.length).toBeGreaterThan(0);
    expect(preview.reviewPackage?.reviewItems.length).toBe(preview.patchPreview?.entries.length);
  });

  it("generates in-memory import preview", () => {
    const result = runSelectedDiscoveryAgents({ agents: ["aws-discovery-agent"], submittedBy: "test", limitPerAgent: 1 });
    const preview = generateAutonomousBatchPatchPreview(result);

    expect(preview.inMemoryImportPreview).not.toBeNull();
    expect(preview.inMemoryImportPreview?.beforeCounts.sources).toBe(founderBetaSourceCatalog.length);
    expect(preview.inMemoryImportPreview?.afterCounts.sources).toBe(founderBetaSourceCatalog.length);
    expect(preview.summary.hasInMemoryPreview).toBe(true);
  });

  it("does not write graph or catalog data", () => {
    const beforeSources = founderBetaSourceCatalog.length;
    const beforeTopics = founderBetaMasterTopics.length;
    const result = runSelectedDiscoveryAgents({
      agents: ["aws-discovery-agent", "system-design-discovery-agent", "backend-discovery-agent", "career-discovery-agent"],
      submittedBy: "test",
      limitPerAgent: 1,
    });

    createAutonomousImportReviewPackage(result);

    expect(founderBetaSourceCatalog.length).toBe(beforeSources);
    expect(founderBetaMasterTopics.length).toBe(beforeTopics);
  });

  it("returns deterministic output", () => {
    const input = { agents: ["aws-discovery-agent", "career-discovery-agent"] as const, submittedBy: "test", limitPerAgent: 2 };
    const first = createAutonomousImportReviewPackage(runSelectedDiscoveryAgents(input));
    const second = createAutonomousImportReviewPackage(runSelectedDiscoveryAgents(input));

    expect(first.importCandidates.map((candidate) => candidate.candidateId)).toEqual(
      second.importCandidates.map((candidate) => candidate.candidateId)
    );
    expect(first.summary.reviewableCount).toBe(second.summary.reviewableCount);
    expect(first.summary.patchEntries).toBe(second.summary.patchEntries);
  });
});

function withCandidateStatus(
  result: MultiSourceDiscoveryRunResult,
  candidateIndex: number,
  status: "review-required" | "duplicate-risk" | "failed",
  duplicate: boolean
): MultiSourceDiscoveryRunResult {
  return {
    ...result,
    agentResults: result.agentResults.map((agentResult) => ({
      ...agentResult,
      candidates: agentResult.candidates.map((candidate, index) =>
        index === candidateIndex
          ? {
              ...candidate,
              status,
              duplicate,
              reviewRequired: status !== "failed",
            }
          : candidate
      ),
    })),
  };
}
