import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AgentRunResult, AgentRunType } from "@/types/agent-runner";

const runMockAgent = vi.hoisted(() => vi.fn());

vi.mock("@/lib/services/agent-runner-service", () => ({ runMockAgent }));

import { AgentRunnerPreview } from "./AgentRunnerPreview";

function makeResult(agentType: AgentRunType, overrides?: Partial<AgentRunResult>): AgentRunResult {
  return {
    trace: {
      traceId: `trace-${agentType}`,
      agentType,
      startedAt: "2026-06-10T00:00:00.000Z",
      completedAt: "2026-06-10T00:00:00.050Z",
      durationMs: 50,
      steps: ["Starting dry-run...", "Generating mock data...", "Boundary assertions complete"]
    },
    status: "completed",
    boundaryResult: { valid: true, errors: [], warnings: [] },
    gateStatus: "pass",
    output: {
      candidates: [],
      topicMappings: [],
      reviews: [],
      duplicateAssessments: [],
      normalizedItems: [],
      warnings: []
    },
    ...overrides
  };
}

function resourceDiscoveryResult(): AgentRunResult {
  return makeResult("resource-discovery", {
    gateStatus: "blocked",
    output: {
      candidates: [
        { id: "c1", title: "Best Practices Guide", url: "https://example.com/1", sourceType: "engineering-blog", tier: "tier-2", category: "aws", description: "Guide to best practices", discoveryMethod: "agent-discovery", discoveredAt: "2026-06-10T00:00:00Z", discoveredBy: "mock-agent", tags: ["aws", "best-practices"], estimatedConfidence: 0.78, attribution: { agentId: "mock-agent", agentVersion: "1.0", agentTraceId: "mt1", discoveredAt: "2026-06-10T00:00:00Z", sourceUrl: "https://example.com/", extractionMethod: "rss", rawMetadata: "{}" }, agentTraceId: "mt1" },
        { id: "c2", title: "Architecture at Scale", url: "https://example.com/2", sourceType: "official-docs", tier: "tier-1", category: "aws", description: "Architecture reference", discoveryMethod: "agent-discovery", discoveredAt: "2026-06-10T00:00:00Z", discoveredBy: "mock-agent", tags: ["aws", "architecture"], estimatedConfidence: 0.85, attribution: { agentId: "mock-agent", agentVersion: "1.0", agentTraceId: "mt1", discoveredAt: "2026-06-10T00:00:00Z", sourceUrl: "https://example.com/", extractionMethod: "api", rawMetadata: "{}" }, agentTraceId: "mt1" }
      ],
      topicMappings: [],
      reviews: [],
      duplicateAssessments: [],
      normalizedItems: [
        { id: "n1", rawCandidateId: "c1", normalizedTitle: "Best Practices Guide", normalizedUrl: "https://example.com/1", sourceType: "engineering-blog", tier: "tier-2", category: "aws", description: "Guide to best practices", tags: ["aws", "best-practices"], confidenceScore: 0.78, normalizedAt: "2026-06-10T00:00:00Z", normalizedBy: "system", checksum: "abc" },
        { id: "n2", rawCandidateId: "c2", normalizedTitle: "Architecture at Scale", normalizedUrl: "https://example.com/2", sourceType: "official-docs", tier: "tier-1", category: "aws", description: "Architecture reference", tags: ["aws", "architecture"], confidenceScore: 0.85, normalizedAt: "2026-06-10T00:00:00Z", normalizedBy: "system", checksum: "def" }
      ],
      warnings: []
    }
  });
}

function topicMappingResult(): AgentRunResult {
  return makeResult("topic-mapping", {
    output: {
      candidates: [],
      topicMappings: [
        { id: "tm1", normalizedItemId: "n1", topicId: "topic-hld", topicName: "HLD Fundamentals", capabilityIds: ["cap-system-design-hld"], skillIds: ["skill-hld-req"], relevanceScore: 0.82, mappedBy: "mock-topic-mapper", mappedAt: "2026-06-10T00:00:00Z", notes: "Strong relevance" }
      ],
      reviews: [],
      duplicateAssessments: [],
      normalizedItems: [],
      warnings: []
    }
  });
}

function qualityReviewResult(): AgentRunResult {
  return makeResult("quality-review", {
    output: {
      candidates: [],
      topicMappings: [],
      reviews: [
        { id: "qr1", normalizedItemId: "n1", reviewerId: "mock-quality-agent", reviewedAt: "2026-06-10T00:00:00Z", urlReachable: true, contentFreshnessScore: 0.8, technicalAccuracyScore: 0.85, relevanceScore: 0.82, authorityScore: 0.75, overallScore: 0.81, issues: [], recommendations: ["Verify accuracy"], passed: true }
      ],
      duplicateAssessments: [],
      normalizedItems: [],
      warnings: []
    }
  });
}

function duplicateDetectionResult(): AgentRunResult {
  return makeResult("duplicate-detection", {
    output: {
      candidates: [],
      topicMappings: [],
      reviews: [],
      duplicateAssessments: [
        { similarCandidateIds: [], similarNormalizedIds: [], similarityScore: 0.15, overlappingTopicIds: [], assessedBy: "mock-dup-detector", assessedAt: "2026-06-10T00:00:00Z", notes: "No significant overlap" }
      ],
      normalizedItems: [],
      warnings: []
    }
  });
}

const ALL_AGENT_LABELS = ["Resource Discovery", "Topic Mapping", "Quality Review", "Duplicate Detection"];

describe("AgentRunnerPreview", () => {
  beforeEach(() => {
    runMockAgent.mockReset();
  });

  it("renders the heading and phase label", () => {
    render(<AgentRunnerPreview />);
    expect(screen.getByText("Phase 8E — Dry-Run Agent Runner")).toBeInTheDocument();
    expect(screen.getByText("Mock Agent Runner")).toBeInTheDocument();
  });

  it("shows empty state when no run has been performed", () => {
    render(<AgentRunnerPreview />);
    expect(screen.getByText("No dry-run results yet.")).toBeInTheDocument();
    expect(screen.getByText(/Select an agent type and click Run/)).toBeInTheDocument();
  });

  it("renders all four agent type options in the select", () => {
    render(<AgentRunnerPreview />);
    const select = screen.getByRole("combobox", { name: /agent type/i });
    expect(select).toBeInTheDocument();
    for (const label of ALL_AGENT_LABELS) {
      expect(screen.getByRole("option", { name: label })).toBeInTheDocument();
    }
  });

  it("shows description for the currently selected agent type", () => {
    render(<AgentRunnerPreview />);
    expect(screen.getByText(/Discovers content candidates from web sources/)).toBeInTheDocument();
  });

  it("renders topic hint and category hint inputs", () => {
    render(<AgentRunnerPreview />);
    expect(screen.getByPlaceholderText("e.g. aws-architecture")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. aws")).toBeInTheDocument();
  });

  it("renders the Run button", () => {
    render(<AgentRunnerPreview />);
    expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
  });

  it("calls runMockAgent with selected agent type on Run click", () => {
    runMockAgent.mockReturnValue(resourceDiscoveryResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(runMockAgent).toHaveBeenCalledWith({
      agentType: "resource-discovery",
      topicHint: undefined,
      categoryHint: undefined
    });
  });

  it("passes topic hint and category hint values when provided", () => {
    runMockAgent.mockReturnValue(resourceDiscoveryResult());
    render(<AgentRunnerPreview />);
    fireEvent.change(screen.getByPlaceholderText("e.g. aws-architecture"), { target: { value: "testing-topic" } });
    fireEvent.change(screen.getByPlaceholderText("e.g. aws"), { target: { value: "testing-cat" } });
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(runMockAgent).toHaveBeenCalledWith({
      agentType: "resource-discovery",
      topicHint: "testing-topic",
      categoryHint: "testing-cat"
    });
  });

  it("displays trace information after running", () => {
    runMockAgent.mockReturnValue(resourceDiscoveryResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText("trace-resource-discovery")).toBeInTheDocument();
    expect(screen.getByText("resource-discovery")).toBeInTheDocument();
    expect(screen.getByText("50ms")).toBeInTheDocument();
  });

  it("displays completed status badge", () => {
    runMockAgent.mockReturnValue(resourceDiscoveryResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("displays blocked gate badge for resource-discovery", () => {
    runMockAgent.mockReturnValue(resourceDiscoveryResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText("Publish gate: Blocked")).toBeInTheDocument();
  });

  it("displays pass gate badge for topic-mapping", () => {
    runMockAgent.mockReturnValue(topicMappingResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText("Publish gate: Pass")).toBeInTheDocument();
  });

  it("displays pass gate badge for quality-review", () => {
    runMockAgent.mockReturnValue(qualityReviewResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText("Publish gate: Pass")).toBeInTheDocument();
  });

  it("displays pass gate badge for duplicate-detection", () => {
    runMockAgent.mockReturnValue(duplicateDetectionResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText("Publish gate: Pass")).toBeInTheDocument();
  });

  it("shows boundary / structure validation section with all checks passed", () => {
    runMockAgent.mockReturnValue(resourceDiscoveryResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText("Boundary / Structure validation")).toBeInTheDocument();
    expect(screen.getByText("All structural checks passed")).toBeInTheDocument();
  });

  it("shows structure errors when boundary validation fails", () => {
    const result = makeResult("resource-discovery", {
      boundaryResult: { valid: false, errors: ["Candidate id is required", "Candidate title is required"], warnings: [] }
    });
    runMockAgent.mockReturnValue(result);
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText("Structure validation failed")).toBeInTheDocument();
    expect(screen.getByText("Structure errors")).toBeInTheDocument();
    expect(screen.getByText("Candidate id is required")).toBeInTheDocument();
    expect(screen.getByText("Candidate title is required")).toBeInTheDocument();
  });

  it("shows structure warnings from boundary validation", () => {
    const result = makeResult("resource-discovery", {
      boundaryResult: { valid: true, errors: [], warnings: ["Candidate has no tags; consider adding at least one"] }
    });
    runMockAgent.mockReturnValue(result);
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText("Warnings")).toBeInTheDocument();
    expect(screen.getByText("Candidate has no tags; consider adding at least one")).toBeInTheDocument();
  });

  it("shows output warnings", () => {
    const result = makeResult("resource-discovery", {
      output: {
        candidates: [],
        topicMappings: [],
        reviews: [],
        duplicateAssessments: [],
        normalizedItems: [],
        warnings: ["No topic hint provided; using default"]
      }
    });
    runMockAgent.mockReturnValue(result);
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText("No topic hint provided; using default")).toBeInTheDocument();
  });

  it("renders candidates section for resource-discovery output", () => {
    runMockAgent.mockReturnValue(resourceDiscoveryResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText(/Candidates \(2\)/)).toBeInTheDocument();
    const guides = screen.getAllByText("Best Practices Guide");
    expect(guides.length).toBeGreaterThanOrEqual(1);
  });

  it("renders normalized items section for resource-discovery output", () => {
    runMockAgent.mockReturnValue(resourceDiscoveryResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText(/Normalized items \(2\)/)).toBeInTheDocument();
  });

  it("renders topic mappings section for topic-mapping output", () => {
    runMockAgent.mockReturnValue(topicMappingResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText(/Topic mappings \(1\)/)).toBeInTheDocument();
    expect(screen.getByText(/HLD Fundamentals/)).toBeInTheDocument();
  });

  it("renders quality review section for quality-review output", () => {
    runMockAgent.mockReturnValue(qualityReviewResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText("Quality review")).toBeInTheDocument();
    expect(screen.getByText("0.81")).toBeInTheDocument();
  });

  it("renders duplicate assessment section for duplicate-detection output", () => {
    runMockAgent.mockReturnValue(duplicateDetectionResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText("Duplicate assessment")).toBeInTheDocument();
    expect(screen.getByText("0.15")).toBeInTheDocument();
    expect(screen.getByText("No significant overlap")).toBeInTheDocument();
  });

  it("renders trace timeline with step numbers", () => {
    runMockAgent.mockReturnValue(resourceDiscoveryResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText(/Timeline \(3 steps\)/)).toBeInTheDocument();
    expect(screen.getByText("Starting dry-run...")).toBeInTheDocument();
    expect(screen.getByText("Generating mock data...")).toBeInTheDocument();
    expect(screen.getByText("Boundary assertions complete")).toBeInTheDocument();
  });

  it("changes displayed description when selecting a different agent type", () => {
    render(<AgentRunnerPreview />);
    const select = screen.getByRole("combobox", { name: /agent type/i });
    fireEvent.change(select, { target: { value: "duplicate-detection" } });
    expect(screen.getByText(/Assesses duplicate risk against existing content/)).toBeInTheDocument();
  });

  it("replaces empty state with result after running", () => {
    runMockAgent.mockReturnValue(resourceDiscoveryResult());
    render(<AgentRunnerPreview />);
    expect(screen.getByText("No dry-run results yet.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.queryByText("No dry-run results yet.")).not.toBeInTheDocument();
    expect(screen.getByText("Result")).toBeInTheDocument();
  });

  it("re-runs when clicking Run a second time with a different agent type", () => {
    runMockAgent.mockReturnValue(resourceDiscoveryResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    runMockAgent.mockReturnValue(topicMappingResult());
    const select = screen.getByRole("combobox", { name: /agent type/i });
    fireEvent.change(select, { target: { value: "topic-mapping" } });
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(runMockAgent).toHaveBeenLastCalledWith({
      agentType: "topic-mapping",
      topicHint: undefined,
      categoryHint: undefined
    });
    expect(screen.getByText(/Topic mappings \(1\)/)).toBeInTheDocument();
  });

  it("shows failed status badge when status is failed", () => {
    const result = makeResult("resource-discovery", { status: "failed" });
    runMockAgent.mockReturnValue(result);
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("shows no candidates section when output has zero candidates", () => {
    runMockAgent.mockReturnValue(topicMappingResult());
    render(<AgentRunnerPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.queryByText(/Candidates \(/)).not.toBeInTheDocument();
  });
});
