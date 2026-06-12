import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AgentDiscoveryReview } from "./AgentDiscoveryReview";
import type { AgentDiscoveryPreviewResult } from "@/lib/services/agent-discovery-simulator";

function makeResult(
  overrides: Partial<AgentDiscoveryPreviewResult> & { scenarioId: string }
): AgentDiscoveryPreviewResult {
  return {
    agentName: "Mock Agent",
    label: "mock",
    description: "Mock description",
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
      normalizedTitle: "Mock Title",
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
    finalGateStatus: "pass",
    publishGateResult: { valid: false, errors: ["Agents cannot publish directly"], warnings: [] },
    ...overrides
  };
}

const PASSING_RESULTS: AgentDiscoveryPreviewResult[] = [
  makeResult({ scenarioId: "s1", agentName: "Agent Alpha" }),
  makeResult({ scenarioId: "s2", agentName: "Agent Beta" }),
  makeResult({ scenarioId: "s3", agentName: "Agent Gamma", finalGateStatus: "blocked" })
];

describe("AgentDiscoveryReview", () => {
  it("renders queue summary cards", () => {
    render(<AgentDiscoveryReview results={PASSING_RESULTS} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Pending (3)")).toBeInTheDocument();
    expect(screen.getByText("Gate blocked")).toBeInTheDocument();
  });

  it("renders filter tabs with counts", () => {
    render(<AgentDiscoveryReview results={PASSING_RESULTS} />);
    expect(screen.getByText("All (3)")).toBeInTheDocument();
    expect(screen.getByText("Pending (3)")).toBeInTheDocument();
    expect(screen.getByText("Approved (0)")).toBeInTheDocument();
    expect(screen.getByText("Blocked (1)")).toBeInTheDocument();
  });

  it("renders all candidate cards by default", () => {
    render(<AgentDiscoveryReview results={PASSING_RESULTS} />);
    expect(screen.getByText("Agent Alpha")).toBeInTheDocument();
    expect(screen.getByText("Agent Beta")).toBeInTheDocument();
    expect(screen.getByText("Agent Gamma")).toBeInTheDocument();
  });

  it("filters to blocked when clicking Blocked tab", () => {
    render(<AgentDiscoveryReview results={PASSING_RESULTS} />);
    fireEvent.click(screen.getByText("Blocked (1)"));
    expect(screen.queryByText("Agent Alpha")).not.toBeInTheDocument();
    expect(screen.queryByText("Agent Beta")).not.toBeInTheDocument();
    expect(screen.getByText("Agent Gamma")).toBeInTheDocument();
  });

  it("shows empty state when no results match filter", () => {
    render(<AgentDiscoveryReview results={PASSING_RESULTS} />);
    fireEvent.click(screen.getByText("Approved (0)"));
    expect(screen.getByText(/No candidates match/i)).toBeInTheDocument();
  });

  it("renders review action buttons for each candidate", () => {
    render(<AgentDiscoveryReview results={PASSING_RESULTS} />);
    const approveButtons = screen.getAllByRole("button", { name: "Approve" });
    expect(approveButtons.length).toBe(3);
  });

  it("allows approving a candidate", () => {
    render(<AgentDiscoveryReview results={PASSING_RESULTS} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Approve" })[0]);
    expect(screen.getAllByText("Approved").length).toBeGreaterThanOrEqual(2);
  });

  it("allows rejecting a candidate with reason", () => {
    render(<AgentDiscoveryReview results={PASSING_RESULTS} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Reject" })[0]);
    expect(screen.getByText(/Rejection reason/i)).toBeInTheDocument();
    expect(screen.getAllByText("Rejected").length).toBeGreaterThanOrEqual(2);
  });

  it("allows needs-changes with notes", () => {
    render(<AgentDiscoveryReview results={PASSING_RESULTS} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Needs changes" })[0]);
    expect(screen.getByText(/What changes are needed/i)).toBeInTheDocument();
  });

  it("allows resetting a decision back to pending", () => {
    render(<AgentDiscoveryReview results={PASSING_RESULTS} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Approve" })[0]);
    expect(screen.getAllByText("Approved").length).toBeGreaterThanOrEqual(2);
    fireEvent.click(screen.getAllByRole("button", { name: "Reset" })[0]);
    expect(screen.getByText("Pending (3)")).toBeInTheDocument();
  });

  it("renders publish-block explanation for each candidate", () => {
    render(<AgentDiscoveryReview results={PASSING_RESULTS} />);
    const explanations = screen.getAllByText(/Agent cannot publish directly/i);
    expect(explanations.length).toBe(3);
  });

  it("renders mapping override section for each candidate", () => {
    render(<AgentDiscoveryReview results={PASSING_RESULTS} />);
    const overrideSections = screen.getAllByText(/Mapping override preview/i);
    expect(overrideSections.length).toBe(3);
  });

  it("shows human approval rationale when required", () => {
    const resultsWithHumanApproval = [
      makeResult({
        scenarioId: "s1",
        agentName: "Low Conf Agent",
        requiresHumanApproval: true,
        confidence: 0.3,
        humanApprovalRationale: ["Low confidence (0.30 < 0.4)"]
      })
    ];
    render(<AgentDiscoveryReview results={resultsWithHumanApproval} />);
    expect(screen.getByText(/Human approval required/i)).toBeInTheDocument();
  });

  it("renders empty state when no results provided", () => {
    render(<AgentDiscoveryReview results={[]} />);
    expect(screen.getByText(/No agent discovery scenarios to review/i)).toBeInTheDocument();
  });

  it("updates queue summary after review actions", () => {
    render(<AgentDiscoveryReview results={PASSING_RESULTS} />);
    expect(screen.getByText("Pending (3)")).toBeInTheDocument();
    expect(screen.getByText("Approved (0)")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Approve" })[0]);

    expect(screen.getByText("Pending (2)")).toBeInTheDocument();
    expect(screen.getByText("Approved (1)")).toBeInTheDocument();
  });

  it("allows adding a mapping override", () => {
    render(<AgentDiscoveryReview results={[PASSING_RESULTS[0]]} />);
    const fieldInputs = screen.getAllByPlaceholderText(/Field/i);
    const valueInputs = screen.getAllByPlaceholderText(/Override value/i);
    fireEvent.change(fieldInputs[0], { target: { value: "topicId" } });
    fireEvent.change(valueInputs[0], { target: { value: "new-topic" } });
    fireEvent.click(screen.getByText("Add override"));
    expect(screen.getByText(/topicId/)).toBeInTheDocument();
    expect(screen.getByText(/new-topic/)).toBeInTheDocument();
  });

  it("allows removing a mapping override", () => {
    render(<AgentDiscoveryReview results={[PASSING_RESULTS[0]]} />);
    const fieldInputs = screen.getAllByPlaceholderText(/Field/i);
    const valueInputs = screen.getAllByPlaceholderText(/Override value/i);
    fireEvent.change(fieldInputs[0], { target: { value: "topicId" } });
    fireEvent.change(valueInputs[0], { target: { value: "new-topic" } });
    fireEvent.click(screen.getByText("Add override"));
    expect(screen.getByText("new-topic")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Remove"));
    expect(screen.queryByText("new-topic")).not.toBeInTheDocument();
  });
});
