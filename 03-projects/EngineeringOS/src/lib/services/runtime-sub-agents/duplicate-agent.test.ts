import { describe, it, expect } from "vitest";
import { runDuplicateAgent } from "./duplicate-agent";
import type { RawContentCandidate } from "@/types/content-ingestion";

function makeCandidate(overrides?: Partial<RawContentCandidate>): RawContentCandidate {
  return {
    id: "cand-test-001",
    title: "Test Article",
    url: "https://example.com/article",
    sourceType: "engineering-blog",
    tier: "tier-2",
    category: "engineering",
    description: "A test article",
    discoveryMethod: "manual",
    discoveredAt: "2026-06-12T12:00:00Z",
    discoveredBy: "test-user",
    tags: [],
    estimatedConfidence: 0.75,
    ...overrides,
  };
}

describe("duplicate-agent", () => {
  it("returns no duplicates for a new URL", () => {
    const result = runDuplicateAgent(makeCandidate());
    expect(result.success).toBe(true);
    expect(result.output).not.toBeNull();
    expect(result.output!.duplicateInfo.isDuplicate).toBe(false);
    expect(result.output!.duplicateInfo.matches).toEqual([]);
  });

  it("detects duplicate for an existing catalog URL", () => {
    const candidate = makeCandidate({ url: "https://aws.amazon.com/well-architected/" });
    const result = runDuplicateAgent(candidate);
    expect(result.success).toBe(true);
    expect(result.output!.duplicateInfo.isDuplicate).toBe(true);
    expect(result.output!.duplicateInfo.matches.length).toBeGreaterThan(0);
  });

  it("adds warning when duplicate detected", () => {
    const candidate = makeCandidate({ url: "https://aws.amazon.com/well-architected/" });
    const result = runDuplicateAgent(candidate);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings.some((w) => w.toLowerCase().includes("duplicate"))).toBe(true);
  });

  it("returns failure when candidate has no URL", () => {
    const candidate = makeCandidate({ url: "" });
    const result = runDuplicateAgent(candidate);
    expect(result.success).toBe(false);
    expect(result.output).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("includes elapsedMs in result", () => {
    const result = runDuplicateAgent(makeCandidate());
    expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
  });
});
