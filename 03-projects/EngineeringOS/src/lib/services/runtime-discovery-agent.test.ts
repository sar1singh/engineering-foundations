import { describe, it, expect } from "vitest";
import { runDiscoveryAgent } from "./runtime-discovery-agent";
import type { ManualUrlSubmission } from "./manual-url-fetch-contracts";

function validSubmission(overrides?: Partial<ManualUrlSubmission>): ManualUrlSubmission {
  return {
    url: "https://example.com/blog/post",
    submittedBy: "test-user",
    submittedAt: new Date("2026-06-11T12:00:00Z").toISOString(),
    sourceType: "engineering-blog",
    consent: true,
    ...overrides,
  };
}

describe("runtime discovery agent", () => {
  it("returns success for a valid URL", () => {
    const output = runDiscoveryAgent(validSubmission());
    expect(output.success).toBe(true);
    expect(output.result).not.toBeNull();
    expect(output.result!.candidate.url).toBeTruthy();
    expect(output.trace).not.toBeNull();
  });

  it("returns failure for an invalid URL (missing url)", () => {
    const output = runDiscoveryAgent(validSubmission({ url: "" }));
    expect(output.success).toBe(false);
    expect(output.result).toBeNull();
    expect(output.errors.length).toBeGreaterThan(0);
  });

  it("returns failure when consent is false", () => {
    const output = runDiscoveryAgent(validSubmission({ consent: false }));
    expect(output.success).toBe(false);
    expect(output.result).toBeNull();
    expect(output.errors.some((e) => e.toLowerCase().includes("consent"))).toBe(true);
  });

  it("returns failure for bulk URL submission", () => {
    const output = runDiscoveryAgent(validSubmission({ url: "https://a.com, https://b.com" }));
    expect(output.success).toBe(false);
    expect(output.result).toBeNull();
  });

  it("returns failure for missing submittedBy", () => {
    const output = runDiscoveryAgent(validSubmission({ submittedBy: "" }));
    expect(output.success).toBe(false);
  });

  it("extracts metadata from fetch result", () => {
    const output = runDiscoveryAgent(validSubmission());
    expect(output.success).toBe(true);
    expect(output.result!.metadata.title).toBeTruthy();
    expect(output.result!.metadata.contentType).toBe("text/html");
    expect(output.result!.metadata.domain).toBeTruthy();
  });

  it("generates a valid RawContentCandidate", () => {
    const output = runDiscoveryAgent(validSubmission());
    expect(output.success).toBe(true);
    const candidate = output.result!.candidate;
    expect(candidate.id).toBeTruthy();
    expect(candidate.title).toBeTruthy();
    expect(candidate.url).toBeTruthy();
    expect(candidate.sourceType).toBe("engineering-blog");
    expect(candidate.tier).toBeTruthy();
    expect(candidate.discoveryMethod).toBe("manual");
  });

  it("runs duplicate detection against the catalog", () => {
    const output = runDiscoveryAgent(validSubmission());
    expect(output.success).toBe(true);
    expect(output.result!.duplicateInfo).toBeDefined();
    expect(typeof output.result!.duplicateInfo.isDuplicate).toBe("boolean");
    expect(Array.isArray(output.result!.duplicateInfo.matches)).toBe(true);
  });

  it("detects duplicate when URL matches existing catalog entry", () => {
    const output = runDiscoveryAgent(validSubmission({ url: "https://aws.amazon.com/well-architected/" }));
    expect(output.success).toBe(true);
    expect(output.result!.duplicateInfo.isDuplicate).toBe(true);
  });

  it("marks humanApprovalRequired as true", () => {
    const output = runDiscoveryAgent(validSubmission());
    expect(output.success).toBe(true);
    expect(output.result!.humanApprovalRequired).toBe(true);
  });

  it("produces deterministic output for the same input", () => {
    const input = validSubmission();
    const out1 = runDiscoveryAgent(input);
    const out2 = runDiscoveryAgent(input);
    expect(out1.success).toBe(out2.success);
    expect(out1.result!.candidate.title).toBe(out2.result!.candidate.title);
    expect(out1.result!.candidate.url).toBe(out2.result!.candidate.url);
    expect(out1.result!.candidate.sourceType).toBe(out2.result!.candidate.sourceType);
  });

  it("generates a full discovery trace with all steps", () => {
    const output = runDiscoveryAgent(validSubmission());
    expect(output.success).toBe(true);
    const trace = output.trace!;
    expect(trace.traceId).toMatch(/^disc-/);
    expect(trace.startedAt).toBeTruthy();
    expect(trace.completedAt).toBeTruthy();
    expect(trace.durationMs).toBeGreaterThanOrEqual(0);
    expect(trace.status).toBe("completed");

    const stepNames = trace.steps.map((s) => s.step);
    expect(stepNames).toContain("validate-url");
    expect(stepNames).toContain("fetch");
    expect(stepNames).toContain("extract-metadata");
    expect(stepNames).toContain("generate-candidate");
    expect(stepNames).toContain("duplicate-detection");
    expect(stepNames).toContain("prepare-review");
  });

  it("each trace step has timestamps, duration, and status", () => {
    const output = runDiscoveryAgent(validSubmission());
    const trace = output.trace!;
    for (const step of trace.steps) {
      expect(step.startedAt).toBeTruthy();
      expect(step.completedAt).toBeTruthy();
      expect(step.durationMs).toBeGreaterThanOrEqual(0);
      expect(["completed", "failed"]).toContain(step.status);
    }
  });

  it("fails with trace when URL fails boundary validation", () => {
    const output = runDiscoveryAgent(validSubmission({ url: "ftp://example.com/file" }));
    expect(output.success).toBe(false);
    const trace = output.trace!;
    expect(trace.status).toBe("failed");
    expect(trace.steps.length).toBeGreaterThan(0);
    expect(trace.steps[0].step).toBe("validate-url");
    expect(trace.steps[0].status).toBe("failed");
  });
});
