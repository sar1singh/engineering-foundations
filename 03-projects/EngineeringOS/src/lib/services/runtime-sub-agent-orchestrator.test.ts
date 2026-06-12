import { describe, it, expect } from "vitest";
import { runRuntimeSubAgentPipeline } from "./runtime-sub-agent-orchestrator";
import type { ManualUrlSubmission } from "./manual-url-fetch-contracts";

function validSubmission(overrides?: Partial<ManualUrlSubmission>): ManualUrlSubmission {
  return {
    url: "https://example.com/article",
    submittedBy: "test-user",
    submittedAt: new Date("2026-06-12T12:00:00Z").toISOString(),
    sourceType: "engineering-blog",
    consent: true,
    ...overrides,
  };
}

describe("runtime-sub-agent-orchestrator", () => {
  it("returns success for a valid URL (happy path)", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission());
    expect(result.success).toBe(true);
    expect(result.validation).not.toBeNull();
    expect(result.metadata).not.toBeNull();
    expect(result.candidate).not.toBeNull();
    expect(result.duplicate).not.toBeNull();
    expect(result.review).not.toBeNull();
  });

  it("returns failure for missing URL (validation failure)", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission({ url: "" }));
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.trace.length).toBe(1);
    expect(result.trace[0].agentType).toBe("validation-agent");
    expect(result.trace[0].success).toBe(false);
  });

  it("returns failure for no consent (validation failure)", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission({ consent: false }));
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("returns failure for bulk URL (validation failure)", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission({ url: "https://a.com, https://b.com" }));
    expect(result.success).toBe(false);
  });

  it("stops pipeline at validation failure — no downstream agents", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission({ url: "" }));
    expect(result.success).toBe(false);
    expect(result.metadata).toBeNull();
    expect(result.candidate).toBeNull();
    expect(result.duplicate).toBeNull();
    expect(result.review).toBeNull();
  });

  it("populates metadata from fetch result", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission());
    expect(result.metadata).not.toBeNull();
    expect(result.metadata!.metadata.title).toBeTruthy();
    expect(result.metadata!.metadata.domain).toBeTruthy();
  });

  it("generates a valid candidate", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission());
    expect(result.candidate).not.toBeNull();
    expect(result.candidate!.candidate.id).toBeTruthy();
    expect(result.candidate!.candidate.title).toBeTruthy();
    expect(result.candidate!.candidate.sourceType).toBe("engineering-blog");
  });

  it("runs duplicate detection against the catalog", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission());
    expect(result.duplicate).not.toBeNull();
    expect(typeof result.duplicate!.duplicateInfo.isDuplicate).toBe("boolean");
  });

  it("detects duplicate when URL matches existing catalog entry", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission({ url: "https://aws.amazon.com/well-architected/" }));
    expect(result.duplicate).not.toBeNull();
    expect(result.duplicate!.duplicateInfo.isDuplicate).toBe(true);
  });

  it("always requires human approval", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission());
    expect(result.review).not.toBeNull();
    expect(result.review!.humanApprovalRequired).toBe(true);
  });

  it("produces deterministic output for the same input", () => {
    const input = validSubmission();
    const r1 = runRuntimeSubAgentPipeline(input);
    const r2 = runRuntimeSubAgentPipeline(input);
    expect(r1.success).toBe(r2.success);
    expect(r1.candidate!.candidate.title).toBe(r2.candidate!.candidate.title);
    expect(r1.candidate!.candidate.url).toBe(r2.candidate!.candidate.url);
    expect(r1.candidate!.candidate.sourceType).toBe(r2.candidate!.candidate.sourceType);
  });

  it("generates a pipeline trace with 5 agent entries on success", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission());
    expect(result.trace.length).toBe(5);
    const agentTypes = result.trace.map((t) => t.agentType);
    expect(agentTypes).toEqual([
      "validation-agent",
      "metadata-agent",
      "candidate-agent",
      "duplicate-agent",
      "review-agent",
    ]);
  });

  it("each trace entry has timestamps and elapsedMs", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission());
    for (const entry of result.trace) {
      expect(entry.startedAt).toBeTruthy();
      expect(entry.completedAt).toBeTruthy();
      expect(entry.elapsedMs).toBeGreaterThanOrEqual(0);
      expect(typeof entry.success).toBe("boolean");
    }
  });

  it("includes pipeline-level timestamps and duration", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission());
    expect(result.startedAt).toBeTruthy();
    expect(result.completedAt).toBeTruthy();
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it("sets success=false on trace entry for failing agent", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission({ url: "" }));
    expect(result.trace[0].success).toBe(false);
  });

  it("collects warnings from all agents", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission());
    expect(Array.isArray(result.warnings)).toBe(true);
  });

  it("returns empty errors array on success", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission());
    expect(result.errors).toEqual([]);
  });
});
