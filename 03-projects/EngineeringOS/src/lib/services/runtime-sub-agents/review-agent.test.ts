import { describe, it, expect } from "vitest";
import { runReviewAgent } from "./review-agent";

describe("review-agent", () => {
  it("returns success", () => {
    const result = runReviewAgent();
    expect(result.success).toBe(true);
  });

  it("always requires human approval", () => {
    const result = runReviewAgent();
    expect(result.output).not.toBeNull();
    expect(result.output!.humanApprovalRequired).toBe(true);
  });

  it("returns no warnings", () => {
    const result = runReviewAgent();
    expect(result.warnings).toEqual([]);
  });

  it("returns no errors", () => {
    const result = runReviewAgent();
    expect(result.errors).toEqual([]);
  });

  it("includes elapsedMs in result", () => {
    const result = runReviewAgent();
    expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
  });

  it("returns deterministic result on repeated calls", () => {
    const r1 = runReviewAgent();
    const r2 = runReviewAgent();
    expect(r1.success).toBe(r2.success);
    expect(r1.output!.humanApprovalRequired).toBe(r2.output!.humanApprovalRequired);
  });
});
