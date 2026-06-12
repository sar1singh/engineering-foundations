import { describe, it, expect } from "vitest";
import { runIngestionAgent } from "./ingestion-agent-service";

describe("runIngestionAgent", () => {
  const validInput = {
    url: "https://example.com/article",
    submittedBy: "test-user",
    sourceType: "engineering-blog" as const,
  };

  it("returns completed status for valid input", () => {
    const result = runIngestionAgent(validInput);
    expect(result.status).toBe("completed");
    expect(result.traceId).toMatch(/^pipe-/);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
    expect(result.errors).toHaveLength(0);
  });

  it("returns all five pipeline steps", () => {
    const result = runIngestionAgent(validInput);
    const stepTypes = result.steps.map((s) => s.type);
    expect(stepTypes).toEqual(["fetch", "validate", "bridge", "duplicate-detection", "prepare-review"]);
  });

  it("marks fetch status as success for valid URL", () => {
    const result = runIngestionAgent(validInput);
    expect(result.fetchStatus).toBe("success");
  });

  it("marks candidate as valid for successful fetch", () => {
    const result = runIngestionAgent(validInput);
    expect(result.candidateValid).toBe(true);
  });

  it("returns gate blocked when human approval required", () => {
    const result = runIngestionAgent(validInput);
    expect(result.gateStatus).toBe("blocked");
  });

  it("assigns a candidate ID", () => {
    const result = runIngestionAgent(validInput);
    expect(result.candidateId).toMatch(/^cand-/);
    expect(result.candidateUrl).toBe("https://example.com/article");
  });

  it("returns no duplicate warning for new URLs", () => {
    const result = runIngestionAgent({
      url: "https://example.com/unique-path-12345",
      submittedBy: "test",
      sourceType: "official-docs",
    });
    expect(result.duplicateWarning).toBe("");
  });

  it("all pipeline steps are completed (no failures)", () => {
    const result = runIngestionAgent(validInput);
    const allCompleted = result.steps.every((s) => s.status === "completed");
    expect(allCompleted).toBe(true);
  });

  it("includes trace metadata in each step", () => {
    const result = runIngestionAgent(validInput);
    for (const step of result.steps) {
      expect(step.label).toBeTruthy();
      expect(step.details).toBeTruthy();
      expect(step.startedAt).toBeTruthy();
      expect(step.completedAt).toBeTruthy();
      expect(step.durationMs).toBeGreaterThanOrEqual(0);
    }
  });

  it("step timestamps are ordered", () => {
    const result = runIngestionAgent(validInput);
    const sorted = [...result.steps].sort(
      (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
    );
    expect(sorted.map((s) => s.type)).toEqual(result.steps.map((s) => s.type));
  });

  it("accepts optional fields without error", () => {
    const result = runIngestionAgent({
      ...validInput,
      capabilityId: "cap-1",
      skillId: "skill-1",
      topicId: "topic-1",
      notes: "test notes",
    });
    expect(result.status).toBe("completed");
  });
});
