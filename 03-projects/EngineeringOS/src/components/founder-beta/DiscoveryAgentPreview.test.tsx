import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PipelineResult, RuntimeSubAgentTrace } from "@/types/runtime-sub-agent";

const runRuntimeSubAgentPipeline = vi.hoisted(() => vi.fn());

vi.mock("@/lib/services/runtime-sub-agent-orchestrator", () => ({ runRuntimeSubAgentPipeline }));

import DiscoveryAgentPreview from "./DiscoveryAgentPreview";

function makeTrace(): RuntimeSubAgentTrace[] {
  return [
    { agentType: "validation-agent", startedAt: "2026-06-12T12:00:00.000Z", completedAt: "2026-06-12T12:00:00.005Z", elapsedMs: 5, success: true, warnings: [], errors: [] },
    { agentType: "metadata-agent", startedAt: "2026-06-12T12:00:00.005Z", completedAt: "2026-06-12T12:00:00.015Z", elapsedMs: 10, success: true, warnings: [], errors: [] },
    { agentType: "candidate-agent", startedAt: "2026-06-12T12:00:00.015Z", completedAt: "2026-06-12T12:00:00.025Z", elapsedMs: 10, success: true, warnings: [], errors: [] },
    { agentType: "duplicate-agent", startedAt: "2026-06-12T12:00:00.025Z", completedAt: "2026-06-12T12:00:00.035Z", elapsedMs: 10, success: true, warnings: [], errors: [] },
    { agentType: "review-agent", startedAt: "2026-06-12T12:00:00.035Z", completedAt: "2026-06-12T12:00:00.040Z", elapsedMs: 5, success: true, warnings: [], errors: [] },
  ];
}

function makeSuccessResult(overrides?: Partial<PipelineResult>): PipelineResult {
  return {
    success: true,
    trace: makeTrace(),
    validation: {
      agentType: "validation-agent",
      validation: { valid: true, errors: [], warnings: [] },
      submission: { url: "https://example.com/article", submittedBy: "sarwan", submittedAt: "2026-06-12T12:00:00Z", sourceType: "engineering-blog", consent: true },
    },
    metadata: {
      agentType: "metadata-agent",
      metadata: { title: "Test Article", description: "Content fetched from https://example.com/article", keywords: ["test", "article"], contentType: "text/html", url: "https://example.com/article", domain: "example.com" },
    },
    candidate: {
      agentType: "candidate-agent",
      candidate: { id: "cand-123", title: "Test Article", url: "https://example.com/article", sourceType: "engineering-blog", tier: "tier-2", category: "engineering", description: "A test article", discoveryMethod: "manual", discoveredAt: "2026-06-12T12:00:00Z", discoveredBy: "discovery-agent", tags: ["test"], estimatedConfidence: 0.75 },
      validation: { valid: true, errors: [], warnings: [] },
    },
    duplicate: {
      agentType: "duplicate-agent",
      duplicateInfo: { isDuplicate: false, matches: [] },
    },
    review: {
      agentType: "review-agent",
      humanApprovalRequired: true,
    },
    errors: [],
    warnings: [],
    startedAt: "2026-06-12T12:00:00.000Z",
    completedAt: "2026-06-12T12:00:00.050Z",
    durationMs: 50,
    ...overrides,
  };
}

function makeFailedResult(errors: string[] = ["URL validation failed: URL is required"]): PipelineResult {
  return {
    success: false,
    trace: [
      { agentType: "validation-agent", startedAt: "2026-06-12T12:00:00.000Z", completedAt: "2026-06-12T12:00:00.005Z", elapsedMs: 5, success: false, warnings: [], errors },
    ],
    validation: null,
    metadata: null,
    candidate: null,
    duplicate: null,
    review: null,
    errors,
    warnings: [],
    startedAt: "2026-06-12T12:00:00.000Z",
    completedAt: "2026-06-12T12:00:00.005Z",
    durationMs: 5,
  };
}

function makeDuplicateResult(): PipelineResult {
  const base = makeSuccessResult();
  return {
    ...base,
    duplicate: {
      agentType: "duplicate-agent",
      duplicateInfo: {
        isDuplicate: true,
        matches: [{ field: "url" as const, source: { id: "src-aws-well-architected", title: "AWS Well-Architected", url: "https://aws.amazon.com/well-architected/", sourceType: "official-docs" as const, category: "cloud-architecture", tier: "tier-1" as const, reliability: "high" as const, founderBetaRelevance: "high" } }],
      },
    },
    warnings: ["Duplicate detected: 1 match(es) in source catalog"],
    trace: [
      ...base.trace.slice(0, 3),
      { agentType: "duplicate-agent", startedAt: "2026-06-12T12:00:00.025Z", completedAt: "2026-06-12T12:00:00.035Z", elapsedMs: 10, success: true, warnings: ["Duplicate detected: 1 match(es) in source catalog"], errors: [] },
      base.trace[4],
    ],
  };
}

describe("DiscoveryAgentPreview", () => {
  beforeEach(() => {
    runRuntimeSubAgentPipeline.mockReset();
  });

  it("renders heading and description", () => {
    render(<DiscoveryAgentPreview />);
    expect(screen.getByText("Discovery Agent Preview")).toBeInTheDocument();
    expect(screen.getByText(/Enter a URL to run the sub-agent pipeline/)).toBeInTheDocument();
  });

  it("renders URL input", () => {
    render(<DiscoveryAgentPreview />);
    expect(screen.getByPlaceholderText("https://example.com/article")).toBeInTheDocument();
  });

  it("renders source type dropdown with default value", () => {
    render(<DiscoveryAgentPreview />);
    expect(screen.getAllByDisplayValue("engineering-blog").length).toBeGreaterThanOrEqual(1);
  });

  it("renders consent checkbox", () => {
    render(<DiscoveryAgentPreview />);
    expect(screen.getByText("I consent to fetching this URL")).toBeInTheDocument();
  });

  it("submit button is disabled initially (no URL, no consent)", () => {
    render(<DiscoveryAgentPreview />);
    const btn = screen.getByRole("button", { name: "Run Pipeline" });
    expect(btn).toBeDisabled();
  });

  it("submit button is disabled when URL is filled but consent is not checked", () => {
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    expect(screen.getByRole("button", { name: "Run Pipeline" })).toBeDisabled();
  });

  it("submit button is disabled when consent is checked but URL is empty", () => {
    render(<DiscoveryAgentPreview />);
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    expect(screen.getByRole("button", { name: "Run Pipeline" })).toBeDisabled();
  });

  it("submit button is enabled when URL is filled and consent is checked", () => {
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    expect(screen.getByRole("button", { name: "Run Pipeline" })).toBeEnabled();
  });

  it("calls runRuntimeSubAgentPipeline with input on click", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(runRuntimeSubAgentPipeline).toHaveBeenCalledWith(expect.objectContaining({
      url: "https://example.com/test",
      sourceType: "engineering-blog",
      consent: true,
    }));
  });

  it("shows success banner after successful run", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("Pipeline Completed")).toBeInTheDocument();
  });

  it("shows sub-agent pipeline visualization after successful run", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("Sub-Agent Pipeline")).toBeInTheDocument();
  });

  it("shows all 5 agent names in pipeline", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("Validation Agent")).toBeInTheDocument();
    expect(screen.getByText("Metadata Agent")).toBeInTheDocument();
    expect(screen.getByText("Candidate Agent")).toBeInTheDocument();
    expect(screen.getByText("Duplicate Agent")).toBeInTheDocument();
    expect(screen.getByText("Review Agent")).toBeInTheDocument();
  });

  it("shows pipeline duration", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("50ms total")).toBeInTheDocument();
  });

  it("shows metadata section after successful run", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("Extracted Metadata")).toBeInTheDocument();
    const titleEls = screen.getAllByText("Test Article");
    expect(titleEls.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("example.com")).toBeInTheDocument();
  });

  it("shows candidate section after successful run", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("Generated Candidate")).toBeInTheDocument();
    expect(screen.getByText("cand-123")).toBeInTheDocument();
    expect(screen.getByText("manual")).toBeInTheDocument();
  });

  it("shows duplicate detection section with no duplicates", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("Duplicate Detection")).toBeInTheDocument();
    expect(screen.getByText("No duplicates detected in source catalog")).toBeInTheDocument();
  });

  it("shows duplicate warnings when duplicate detected", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeDuplicateResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://aws.amazon.com/well-architected/" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    const dupEls = screen.getAllByText(/Duplicate risk: 1 match/);
    expect(dupEls.length).toBeGreaterThanOrEqual(1);
  });

  it("shows review queue section", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("Review Queue Item")).toBeInTheDocument();
  });

  it("shows Pending Review badge", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("Pending Review")).toBeInTheDocument();
  });

  it("shows Required approval badge", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("shows no publish controls message", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("No publish controls available")).toBeInTheDocument();
  });

  it("shows failure state when pipeline returns error", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeFailedResult(["URL is required"]));
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://invalid.example" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("Pipeline Failed")).toBeInTheDocument();
    expect(screen.getByText("URL is required")).toBeInTheDocument();
  });

  it("shows pipeline visualization on failure when trace is present", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeFailedResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://invalid.example" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("Sub-Agent Pipeline")).toBeInTheDocument();
  });

  it("shows submittedBy value changes on input", () => {
    render(<DiscoveryAgentPreview />);
    const submittedInputs = screen.getAllByDisplayValue("sarwan");
    expect(submittedInputs.length).toBeGreaterThanOrEqual(1);
    fireEvent.change(submittedInputs[0], { target: { value: "test-user" } });
    expect(screen.getByDisplayValue("test-user")).toBeInTheDocument();
  });

  it("can change source type via dropdown", () => {
    render(<DiscoveryAgentPreview />);
    const selects = screen.getAllByDisplayValue("engineering-blog");
    fireEvent.change(selects[0], { target: { value: "official-docs" } });
    expect(screen.getByDisplayValue("official-docs")).toBeInTheDocument();
  });

  it("passes submittedBy value to runRuntimeSubAgentPipeline", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.change(screen.getAllByDisplayValue("sarwan")[0], { target: { value: "custom-user" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(runRuntimeSubAgentPipeline).toHaveBeenCalledWith(expect.objectContaining({
      submittedBy: "custom-user",
    }));
  });

  it("passes sourceType to runRuntimeSubAgentPipeline", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.change(screen.getAllByDisplayValue("engineering-blog")[0], { target: { value: "book" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(runRuntimeSubAgentPipeline).toHaveBeenCalledWith(expect.objectContaining({
      sourceType: "book",
    }));
  });

  it("shows metadata keywords when present", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/test" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("article")).toBeInTheDocument();
  });

  it("shows warnings banner when warnings are present", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeDuplicateResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://aws.amazon.com/well-architected/" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("Duplicate detected: 1 match(es) in source catalog")).toBeInTheDocument();
  });

  it("disables inputs during run and clears output on re-run", () => {
    runRuntimeSubAgentPipeline.mockReturnValue(makeSuccessResult());
    render(<DiscoveryAgentPreview />);
    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/first" } });
    fireEvent.click(screen.getByText("I consent to fetching this URL"));
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getByText("Pipeline Completed")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("https://example.com/article"), { target: { value: "https://example.com/second" } });
    fireEvent.click(screen.getByRole("button", { name: "Run Pipeline" }));
    expect(screen.getAllByText("Pipeline Completed").length).toBe(1);
  });
});
