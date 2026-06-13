import { describe, expect, it } from "vitest";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";
import type { MultiSourceDiscoveryAgentResult } from "@/types/multi-source-discovery-agent";
import {
  deduplicateAcrossAgents,
  runSelectedDiscoveryAgents,
  runSingleSourceDiscoveryAgent,
  summarizeMultiSourceDiscovery,
} from "./multi-source-discovery-orchestrator";

describe("multi-source-discovery-orchestrator", () => {
  it("runs each source-specific agent independently", () => {
    const aws = runSingleSourceDiscoveryAgent("aws-discovery-agent", "test", 2);
    const systemDesign = runSingleSourceDiscoveryAgent("system-design-discovery-agent", "test", 2);
    const backend = runSingleSourceDiscoveryAgent("backend-discovery-agent", "test", 2);
    const career = runSingleSourceDiscoveryAgent("career-discovery-agent", "test", 2);

    expect(aws.agentType).toBe("aws-discovery-agent");
    expect(systemDesign.agentType).toBe("system-design-discovery-agent");
    expect(backend.agentType).toBe("backend-discovery-agent");
    expect(career.agentType).toBe("career-discovery-agent");
    expect(aws.trace.candidateCount).toBe(2);
    expect(systemDesign.trace.candidateCount).toBe(2);
    expect(backend.trace.candidateCount).toBe(2);
    expect(career.trace.candidateCount).toBe(2);
  });

  it("filters by selected agents", () => {
    const result = runSelectedDiscoveryAgents({
      agents: ["aws-discovery-agent", "backend-discovery-agent"],
      submittedBy: "test",
      limitPerAgent: 1,
    });

    expect(result.agentResults.map((agentResult) => agentResult.agentType)).toEqual([
      "aws-discovery-agent",
      "backend-discovery-agent",
    ]);
    expect(result.summary.totalCandidates).toBe(2);
  });

  it("detects cross-agent duplicate URLs", () => {
    const duplicateUrl = "https://example.com/shared";
    const agentResults = [
      makeAgentResult("aws-discovery-agent", "seed-a", duplicateUrl),
      makeAgentResult("backend-discovery-agent", "seed-b", `${duplicateUrl}/`),
    ];

    const warnings = deduplicateAcrossAgents(agentResults);

    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatchObject({
      normalizedUrl: duplicateUrl,
      agentTypes: ["aws-discovery-agent", "backend-discovery-agent"],
      seedIds: ["seed-a", "seed-b"],
    });
  });

  it("keeps candidates review-required", () => {
    const result = runSelectedDiscoveryAgents({
      agents: ["career-discovery-agent"],
      submittedBy: "test",
      limitPerAgent: 3,
    });

    expect(result.summary.reviewRequired).toBe(3);
    expect(result.agentResults[0].candidates.every((candidate) => candidate.reviewRequired)).toBe(true);
    expect(
      result.agentResults[0].candidates.every(
        (candidate) => candidate.pipelineResult.review?.humanApprovalRequired === true
      )
    ).toBe(true);
  });

  it("does not mutate graph data", () => {
    const beforeSources = founderBetaSourceCatalog.length;
    const beforeTopics = founderBetaMasterTopics.length;

    const result = runSelectedDiscoveryAgents({
      agents: ["aws-discovery-agent", "system-design-discovery-agent", "backend-discovery-agent"],
      submittedBy: "test",
      limitPerAgent: 2,
    });

    expect(founderBetaSourceCatalog.length).toBe(beforeSources);
    expect(founderBetaMasterTopics.length).toBe(beforeTopics);
    expect(result.summary.graphWrites).toBe(0);
  });

  it("has no publish path", () => {
    const result = runSelectedDiscoveryAgents({
      agents: ["aws-discovery-agent"],
      submittedBy: "test",
      limitPerAgent: 1,
    });

    expect(result.summary.publishActions).toBe(0);
    expect(JSON.stringify(result)).not.toMatch(/apply|publishToGraph|writeFile/);
  });

  it("returns deterministic output", () => {
    const input = {
      agents: ["backend-discovery-agent", "aws-discovery-agent"] as const,
      submittedBy: "test",
      limitPerAgent: 2,
    };

    const first = runSelectedDiscoveryAgents(input);
    const second = runSelectedDiscoveryAgents(input);

    expect(JSON.stringify(first.summary)).toBe(JSON.stringify(second.summary));
    expect(first.agentResults.map((result) => result.agentType)).toEqual(
      second.agentResults.map((result) => result.agentType)
    );
    expect(first.agentResults.flatMap((result) => result.candidates.map((candidate) => candidate.seed.id))).toEqual(
      second.agentResults.flatMap((result) => result.candidates.map((candidate) => candidate.seed.id))
    );
  });

  it("summarizes counts", () => {
    const result = runSelectedDiscoveryAgents({
      agents: ["aws-discovery-agent", "career-discovery-agent"],
      submittedBy: "test",
      limitPerAgent: 2,
    });
    const summary = summarizeMultiSourceDiscovery(result.agentResults, result.crossAgentDuplicateWarnings);

    expect(summary.selectedAgents).toEqual(["aws-discovery-agent", "career-discovery-agent"]);
    expect(summary.totalSeeds).toBe(4);
    expect(summary.totalCandidates).toBe(4);
    expect(summary.reviewRequired).toBe(4);
    expect(summary.graphWrites).toBe(0);
  });
});

function makeAgentResult(
  agentType: MultiSourceDiscoveryAgentResult["agentType"],
  seedId: string,
  url: string
): MultiSourceDiscoveryAgentResult {
  return {
    agentType,
    warnings: [],
    seeds: [],
    trace: {
      agentType,
      startedAt: "2026-06-13T00:00:00.000Z",
      completedAt: "2026-06-13T00:00:00.001Z",
      elapsedMs: 1,
      seedCount: 1,
      candidateCount: 1,
      reviewRequiredCount: 1,
      duplicateRiskCount: 0,
      graphWrites: 0,
      warnings: [],
    },
    candidates: [
      {
        seed: {
          id: seedId,
          title: seedId,
          url,
          sourceType: "official-docs",
          category: "aws",
          tags: ["duplicate"],
        },
        status: "review-required",
        reviewRequired: true,
        duplicate: false,
        duplicateMatchCount: 0,
        pipelineResult: {
          success: true,
          trace: [],
          validation: null,
          metadata: null,
          candidate: null,
          duplicate: null,
          review: { agentType: "review-agent", humanApprovalRequired: true },
          errors: [],
          warnings: [],
          startedAt: "2026-06-13T00:00:00.000Z",
          completedAt: "2026-06-13T00:00:00.001Z",
          durationMs: 1,
        },
      },
    ],
  };
}
