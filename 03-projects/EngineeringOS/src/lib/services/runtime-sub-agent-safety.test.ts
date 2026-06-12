import { describe, it, expect } from "vitest";
import { runRuntimeSubAgentPipeline } from "./runtime-sub-agent-orchestrator";
import { runReviewAgent } from "./runtime-sub-agents/review-agent";
import type { ManualUrlSubmission } from "./manual-url-fetch-contracts";
import { founderBetaSourceCatalog, founderBetaMasterTopics as founderBetaTopics } from "@/data/founder-beta";

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

describe("sub-agent pipeline safety assertions", () => {
  it("does not write to source catalog", () => {
    const initialCount = founderBetaSourceCatalog.length;
    runRuntimeSubAgentPipeline(validSubmission());
    expect(founderBetaSourceCatalog.length).toBe(initialCount);
  });

  it("does not write to topics", () => {
    const initialCount = founderBetaTopics.length;
    runRuntimeSubAgentPipeline(validSubmission());
    expect(founderBetaTopics.length).toBe(initialCount);
  });

  it("review agent always requires human approval", () => {
    const result = runReviewAgent();
    expect(result.output!.humanApprovalRequired).toBe(true);
  });

  it("pipeline result requires human approval via review agent", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission());
    expect(result.review).not.toBeNull();
    expect(result.review!.humanApprovalRequired).toBe(true);
  });

  it("pipeline does not publish autonomously", () => {
    const result = runRuntimeSubAgentPipeline(validSubmission());
    expect(result.success).toBe(true);
    expect(result.candidate).not.toBeNull();
    expect(result.duplicate).not.toBeNull();
    expect(result.review).not.toBeNull();
    expect(result.review!.humanApprovalRequired).toBe(true);
  });

  it("pipeline does not bypass approval", () => {
    for (let i = 0; i < 5; i++) {
      const result = runRuntimeSubAgentPipeline(validSubmission());
      expect(result.review!.humanApprovalRequired).toBe(true);
    }
  });

  it("does not mutate any input object", () => {
    const submission = validSubmission();
    const submissionCopy = { ...submission };
    runRuntimeSubAgentPipeline(submission);
    expect(submission).toEqual(submissionCopy);
  });
});
