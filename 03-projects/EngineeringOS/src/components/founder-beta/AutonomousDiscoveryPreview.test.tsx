import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MultiSourceDiscoveryRunResult } from "@/lib/services/multi-source-discovery-orchestrator";
import type { RuntimeSubAgentTrace } from "@/types/runtime-sub-agent";

const runSelectedDiscoveryAgents = vi.hoisted(() => vi.fn());
const createAutonomousImportReviewPackage = vi.hoisted(() => vi.fn());

vi.mock("@/lib/services/multi-source-discovery-orchestrator", async () => {
  const actual = await vi.importActual<typeof import("@/lib/services/multi-source-discovery-orchestrator")>(
    "@/lib/services/multi-source-discovery-orchestrator"
  );
  return {
    ...actual,
    runSelectedDiscoveryAgents,
  };
});

vi.mock("@/lib/services/autonomous-discovery-review-bridge", () => ({
  createAutonomousImportReviewPackage,
}));

import AutonomousDiscoveryPreview from "./AutonomousDiscoveryPreview";

function trace(): RuntimeSubAgentTrace[] {
  return [
    { agentType: "validation-agent", startedAt: "2026-06-13T00:00:00.000Z", completedAt: "2026-06-13T00:00:00.001Z", elapsedMs: 1, success: true, warnings: [], errors: [] },
    { agentType: "metadata-agent", startedAt: "2026-06-13T00:00:00.001Z", completedAt: "2026-06-13T00:00:00.002Z", elapsedMs: 1, success: true, warnings: [], errors: [] },
    { agentType: "candidate-agent", startedAt: "2026-06-13T00:00:00.002Z", completedAt: "2026-06-13T00:00:00.003Z", elapsedMs: 1, success: true, warnings: [], errors: [] },
    { agentType: "duplicate-agent", startedAt: "2026-06-13T00:00:00.003Z", completedAt: "2026-06-13T00:00:00.004Z", elapsedMs: 1, success: true, warnings: [], errors: [] },
    { agentType: "review-agent", startedAt: "2026-06-13T00:00:00.004Z", completedAt: "2026-06-13T00:00:00.005Z", elapsedMs: 1, success: true, warnings: [], errors: [] },
  ];
}

function result(): MultiSourceDiscoveryRunResult {
  return {
    warnings: ["Multi-source discovery does not modify the graph."],
    crossAgentDuplicateWarnings: [
      {
        normalizedUrl: "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html",
        agentTypes: ["aws-discovery-agent", "system-design-discovery-agent"],
        seedIds: ["seed-1", "seed-2"],
        titles: ["AWS Step Functions Developer Guide"],
      },
    ],
    summary: {
      selectedAgents: ["aws-discovery-agent", "system-design-discovery-agent"],
      totalSeeds: 2,
      totalCandidates: 2,
      reviewRequired: 2,
      duplicateRisk: 1,
      failed: 0,
      crossAgentDuplicateWarnings: 1,
      graphWrites: 0,
      publishActions: 0,
    },
    agentResults: [
      {
        agentType: "aws-discovery-agent",
        warnings: [],
        seeds: [],
        trace: {
          agentType: "aws-discovery-agent",
          startedAt: "2026-06-13T00:00:00.000Z",
          completedAt: "2026-06-13T00:00:00.001Z",
          elapsedMs: 1,
          seedCount: 1,
          candidateCount: 1,
          reviewRequiredCount: 1,
          duplicateRiskCount: 0,
          graphWrites: 0,
          warnings: ["aws-discovery-agent is seed-backed and cannot publish, approve, or write graph data."],
        },
        candidates: [
          {
            seed: {
              id: "seed-1",
              title: "AWS Step Functions Developer Guide",
              url: "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html",
              sourceType: "official-docs",
              category: "aws",
              tags: ["workflow", "orchestration"],
            },
            status: "review-required",
            reviewRequired: true,
            duplicate: false,
            duplicateMatchCount: 0,
            pipelineResult: {
              success: true,
              trace: trace(),
              validation: null,
              metadata: null,
              candidate: null,
              duplicate: null,
              review: { agentType: "review-agent", humanApprovalRequired: true },
              errors: [],
              warnings: [],
              startedAt: "2026-06-13T00:00:00.000Z",
              completedAt: "2026-06-13T00:00:00.005Z",
              durationMs: 5,
            },
          },
        ],
      },
      {
        agentType: "system-design-discovery-agent",
        warnings: [],
        seeds: [],
        trace: {
          agentType: "system-design-discovery-agent",
          startedAt: "2026-06-13T00:00:00.000Z",
          completedAt: "2026-06-13T00:00:00.001Z",
          elapsedMs: 1,
          seedCount: 1,
          candidateCount: 1,
          reviewRequiredCount: 1,
          duplicateRiskCount: 1,
          graphWrites: 0,
          warnings: ["system-design-discovery-agent is seed-backed and cannot publish, approve, or write graph data."],
        },
        candidates: [
          {
            seed: {
              id: "seed-2",
              title: "Microservices Patterns",
              url: "https://microservices.io/patterns/index.html",
              sourceType: "engineering-blog",
              category: "system-design",
              tags: ["microservices", "patterns"],
            },
            status: "duplicate-risk",
            reviewRequired: true,
            duplicate: true,
            duplicateMatchCount: 1,
            pipelineResult: {
              success: true,
              trace: trace(),
              validation: null,
              metadata: null,
              candidate: null,
              duplicate: null,
              review: { agentType: "review-agent", humanApprovalRequired: true },
              errors: [],
              warnings: [],
              startedAt: "2026-06-13T00:00:00.000Z",
              completedAt: "2026-06-13T00:00:00.005Z",
              durationMs: 5,
            },
          },
        ],
      },
    ],
  };
}

describe("AutonomousDiscoveryPreview", () => {
  beforeEach(() => {
    runSelectedDiscoveryAgents.mockReset();
    createAutonomousImportReviewPackage.mockReset();
    runSelectedDiscoveryAgents.mockReturnValue(result());
    createAutonomousImportReviewPackage.mockReturnValue(bridgeResult());
  });

  it("renders heading and safety copy", () => {
    render(<AutonomousDiscoveryPreview />);

    expect(screen.getByText("Adaptive Discovery Agents")).toBeInTheDocument();
    expect(screen.getByText("Adaptive discovery does not modify the graph.")).toBeInTheDocument();
  });

  it("renders source-specific agent controls", () => {
    render(<AutonomousDiscoveryPreview />);

    expect(screen.getByText("AWS Discovery Agent")).toBeInTheDocument();
    expect(screen.getByText("System Design Discovery Agent")).toBeInTheDocument();
    expect(screen.getByText("Backend Discovery Agent")).toBeInTheDocument();
    expect(screen.getByText("Career/Staff Engineering Discovery Agent")).toBeInTheDocument();
  });

  it("runs selected discovery agents", () => {
    render(<AutonomousDiscoveryPreview />);

    fireEvent.click(screen.getByText("AWS Discovery Agent"));
    fireEvent.click(screen.getByRole("button", { name: "Run Selected Agents" }));

    expect(runSelectedDiscoveryAgents).toHaveBeenCalledWith({
      agents: ["aws-discovery-agent", "system-design-discovery-agent"],
      limitPerAgent: 4,
    });
  });

  it("shows queue summary after run", () => {
    render(<AutonomousDiscoveryPreview />);

    fireEvent.click(screen.getByRole("button", { name: "Run Selected Agents" }));

    expect(screen.getByText("Candidates")).toBeInTheDocument();
    expect(screen.getByText("Review Required")).toBeInTheDocument();
    expect(screen.getByText("Duplicate Risk")).toBeInTheDocument();
    expect(screen.getByText("Graph Writes")).toBeInTheDocument();
    expect(screen.getAllByText("0").length).toBeGreaterThanOrEqual(1);
  });

  it("shows per-agent traces and candidate counts", () => {
    render(<AutonomousDiscoveryPreview />);

    fireEvent.click(screen.getByRole("button", { name: "Run Selected Agents" }));

    expect(screen.getAllByText("AWS Discovery Agent").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("1 candidates · 1 review required")).toHaveLength(2);
    expect(screen.getAllByText("independent trace").length).toBe(2);
  });

  it("shows review bridge preview after running agents", () => {
    render(<AutonomousDiscoveryPreview />);

    fireEvent.click(screen.getByRole("button", { name: "Run Selected Agents" }));

    expect(screen.getByText("Review bridge preview")).toBeInTheDocument();
    expect(screen.getByText("Send to Review Queue")).toBeInTheDocument();
  });

  it("shows discovered candidates and review status", () => {
    render(<AutonomousDiscoveryPreview />);

    fireEvent.click(screen.getByRole("button", { name: "Run Selected Agents" }));

    expect(screen.getByText("AWS Step Functions Developer Guide")).toBeInTheDocument();
    expect(screen.getByText("Microservices Patterns")).toBeInTheDocument();
    expect(screen.getAllByText("review-required").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("duplicate-risk")).toBeInTheDocument();
  });

  it("shows pipeline trace", () => {
    render(<AutonomousDiscoveryPreview />);

    fireEvent.click(screen.getByRole("button", { name: "Run Selected Agents" }));

    expect(screen.getAllByText("validation-agent").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("review-agent").length).toBeGreaterThanOrEqual(1);
  });

  it("sends agent candidates to review queue preview", () => {
    render(<AutonomousDiscoveryPreview />);

    fireEvent.click(screen.getByRole("button", { name: "Run Selected Agents" }));
    fireEvent.click(screen.getByRole("button", { name: "Send to Review Queue" }));

    expect(createAutonomousImportReviewPackage).toHaveBeenCalledWith(result());
    expect(screen.getByText("Review package preview")).toBeInTheDocument();
    expect(screen.getByText("In-memory import preview")).toBeInTheDocument();
    expect(screen.getByText("No canonical graph files are written.")).toBeInTheDocument();
  });
});

function bridgeResult() {
  return {
    warnings: ["Autonomous discovery review bridge does not approve, apply, publish, persist, or write graph data."],
    reviewableCandidates: [],
    importCandidates: [],
    summary: {
      totalAgentCandidates: 2,
      reviewableCount: 2,
      excludedFailed: 0,
      excludedDuplicateRisk: 0,
      duplicateRiskFlagged: 1,
      reviewPackageEntries: 4,
      patchEntries: 4,
      patchConflicts: 1,
      inMemoryAddedSources: 0,
      inMemoryAddedTopics: 0,
      graphWrites: 0,
      hasReviewPackage: true,
      hasPatchPreview: true,
      hasInMemoryPreview: true,
    },
    reviewPackage: {
      id: "pkg",
      patch: { id: "patch", title: "Patch", description: "", entries: [], conflicts: [], report: { totalCandidates: 0, candidatesProcessed: 0, candidatesSkipped: 0, entriesGenerated: 0, topicEntries: 0, sourceEntries: 0, capabilityEntries: 0, conflicts: [], generatedAt: "" }, generatedAt: "" },
      reviewItems: [
        { patchId: "patch", entryIndex: 0, entry: { type: "source", operation: "add", sourceId: "source-a", title: "Source A", url: "https://example.com/a", sourceType: "official-docs", category: "AWS", tier: "primary", reliability: "high", founderBetaRelevance: "Relevant" }, decision: "pending", reviewNotes: "", reviewedAt: null },
      ],
      approvedEntries: [],
      rejectedEntries: [],
      conflicts: [],
      summary: { patchId: "patch", totalEntries: 4, approvedCount: 0, rejectedCount: 0, needsReviewCount: 0, pendingCount: 4, conflicts: [], createdAt: "" },
      applicationPlan: { patchId: "patch", patchTitle: "Patch", topicsToAdd: [], sourcesToAdd: [], capabilitiesImpacted: [], skillsImpacted: [], duplicateRisks: [], reviewNotes: [], generatedAt: "" },
      createdAt: "",
    },
    patchPreview: { id: "patch", title: "Patch", description: "", entries: [], conflicts: [{}], report: { totalCandidates: 2, candidatesProcessed: 2, candidatesSkipped: 0, entriesGenerated: 4, topicEntries: 2, sourceEntries: 2, capabilityEntries: 0, conflicts: [], generatedAt: "" }, generatedAt: "" },
    batchPatchPreview: null,
    inMemoryImportPreview: {
      addedTopics: [],
      addedSources: [],
      updatedTopics: [],
      skippedEntries: [],
      conflicts: [],
      warnings: [],
      rollbackPlan: { removeTopicIds: [], removeSourceIds: [], restoreTopicIds: [], restoreSourceIds: [], notes: [] },
      beforeCounts: { sources: 222, topics: 257, capabilities: 15, skills: 70 },
      afterCounts: { sources: 222, topics: 257, capabilities: 15, skills: 70 },
      graph: { sources: [], topics: [], capabilities: [], skills: [] },
    },
  };
}
