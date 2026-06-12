import { describe, it, expect } from "vitest";
import { runValidationAgent } from "./validation-agent";
import { DEFAULT_FETCH_BOUNDARY } from "../manual-url-dry-run";
import type { ManualUrlSubmission } from "../manual-url-fetch-contracts";

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

describe("validation-agent", () => {
  it("returns success for valid submission", () => {
    const result = runValidationAgent(validSubmission(), DEFAULT_FETCH_BOUNDARY);
    expect(result.success).toBe(true);
    expect(result.output).not.toBeNull();
    expect(result.output!.agentType).toBe("validation-agent");
    expect(result.output!.validation.valid).toBe(true);
  });

  it("returns failure for missing URL", () => {
    const result = runValidationAgent(validSubmission({ url: "" }), DEFAULT_FETCH_BOUNDARY);
    expect(result.success).toBe(false);
    expect(result.output).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("returns failure when consent is false", () => {
    const result = runValidationAgent(validSubmission({ consent: false }), DEFAULT_FETCH_BOUNDARY);
    expect(result.success).toBe(false);
    expect(result.output).toBeNull();
    expect(result.errors.some((e) => e.toLowerCase().includes("consent"))).toBe(true);
  });

  it("returns failure for bulk URL", () => {
    const result = runValidationAgent(validSubmission({ url: "https://a.com, https://b.com" }), DEFAULT_FETCH_BOUNDARY);
    expect(result.success).toBe(false);
    expect(result.output).toBeNull();
  });

  it("returns failure for missing submittedBy", () => {
    const result = runValidationAgent(validSubmission({ submittedBy: "" }), DEFAULT_FETCH_BOUNDARY);
    expect(result.success).toBe(false);
  });

  it("returns failure for disallowed protocol", () => {
    const result = runValidationAgent(validSubmission({ url: "ftp://example.com/file" }), DEFAULT_FETCH_BOUNDARY);
    expect(result.success).toBe(false);
  });

  it("includes elapsedMs in result", () => {
    const result = runValidationAgent(validSubmission(), DEFAULT_FETCH_BOUNDARY);
    expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
  });

  it("has no side effects on submission", () => {
    const submission = validSubmission();
    const submissionCopy = { ...submission };
    runValidationAgent(submission, DEFAULT_FETCH_BOUNDARY);
    expect(submission).toEqual(submissionCopy);
  });
});
