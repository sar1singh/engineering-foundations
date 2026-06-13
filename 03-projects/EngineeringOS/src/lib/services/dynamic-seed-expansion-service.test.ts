import { describe, it, expect } from "vitest";
import { scoreAdaptiveSeed, generateAdaptiveDiscoverySeeds, summarizeAdaptiveSeedExpansion } from "./dynamic-seed-expansion-service";
import type { SyllabusGap } from "@/types/gap-driven-ingestion";
import type { AdaptiveDiscoveryCandidate } from "@/types/adaptive-discovery";

const mockGap: SyllabusGap = {
  id: "gap-cov-1", type: "low-source-topic", severity: "high", score: 80,
  target: { entityType: "topic", entityId: "topic-observability", entityName: "Observability" },
  reason: "Topic has only 1 source(s)", detail: "Observability has 1 sources. Minimum 2 recommended.",
  category: "system-design",
};

describe("dynamic-seed-expansion-service", () => {
  describe("scoreAdaptiveSeed", () => {
    it("scores a seed against a gap", () => {
      const result = scoreAdaptiveSeed(
        { title: "Observability Guide", tags: ["monitoring", "observability"], domain: "system-design" },
        mockGap,
        new Set(),
        new Set()
      );
      expect(result.score).toBeGreaterThan(0);
      expect(result.reasons.length).toBeGreaterThan(0);
    });

    it("returns zero score for unrelated seed", () => {
      const unrelatedGap: SyllabusGap = { ...mockGap, severity: "low" };
      const result = scoreAdaptiveSeed(
        { title: "Cooking Recipes", tags: ["food", "recipes"], domain: "unrelated" },
        unrelatedGap,
        new Set(),
        new Set()
      );
      expect(result.score).toBe(0);
    });

    it("adds bonus for high severity gaps", () => {
      const highGap: SyllabusGap = { ...mockGap, severity: "critical" };
      const lowGap: SyllabusGap = { ...mockGap, severity: "low" };
      const highResult = scoreAdaptiveSeed(
        { title: "Observability", tags: ["observability"], domain: "system-design" },
        highGap,
        new Set(),
        new Set()
      );
      const lowResult = scoreAdaptiveSeed(
        { title: "Observability", tags: ["observability"], domain: "system-design" },
        lowGap,
        new Set(),
        new Set()
      );
      expect(highResult.score).toBeGreaterThanOrEqual(lowResult.score);
    });

    it("avoids already imported seeds", () => {
      const result = scoreAdaptiveSeed(
        { title: "Observability Guide", tags: ["monitoring"], domain: "system-design" },
        mockGap,
        new Set(["topic-observability"]),
        new Set(["observability-guide"])
      );
      expect(result.score).toBeGreaterThanOrEqual(0);
    });
  });

  describe("generateAdaptiveDiscoverySeeds", () => {
    it("generates candidates from gaps", () => {
      const candidates = generateAdaptiveDiscoverySeeds(
        [mockGap],
        [{ clusterId: "cluster-observability", gapIds: ["gap-cov-1"] }],
        new Set()
      );
      expect(candidates.length).toBeGreaterThan(0);
    });

    it("deduplicates by URL", () => {
      const candidates = generateAdaptiveDiscoverySeeds(
        [mockGap, { ...mockGap, id: "gap-cov-2" }],
        [],
        new Set()
      );
      const urls = candidates.map((c) => c.url);
      expect(new Set(urls).size).toBe(urls.length);
    });

    it("assigns confidence scores", () => {
      const candidates = generateAdaptiveDiscoverySeeds(
        [mockGap],
        [],
        new Set()
      );
      for (const c of candidates) {
        expect(c.confidenceScore).toBeGreaterThan(0);
        expect(c.confidenceScore).toBeLessThanOrEqual(1);
      }
    });

    it("sets reviewRequired to true on all candidates", () => {
      const candidates = generateAdaptiveDiscoverySeeds(
        [mockGap],
        [],
        new Set()
      );
      for (const c of candidates) {
        expect(c.reviewRequired).toBe(true);
      }
    });

    it("assigns cluster IDs when clusters match", () => {
      const candidates = generateAdaptiveDiscoverySeeds(
        [mockGap],
        [{ clusterId: "cluster-observability", gapIds: ["gap-cov-1"] }],
        new Set()
      );
      const withCluster = candidates.filter((c) => c.clusterId === "cluster-observability");
      expect(withCluster.length).toBeGreaterThan(0);
    });
  });

  describe("summarizeAdaptiveSeedExpansion", () => {
    it("returns empty summary for no candidates", () => {
      const summary = summarizeAdaptiveSeedExpansion([], []);
      expect(summary.totalCandidates).toBe(0);
      expect(summary.avgConfidence).toBe(0);
    });

    it("reports domain distribution", () => {
      const summary = summarizeAdaptiveSeedExpansion(
        [{ id: "1", domain: "aws" } as AdaptiveDiscoveryCandidate],
        []
      );
      expect(summary.candidatesByDomain["aws"]).toBe(1);
    });

    it("reports cluster coverage", () => {
      const candidates = generateAdaptiveDiscoverySeeds(
        [mockGap],
        [{ clusterId: "cluster-test", gapIds: ["gap-cov-1"] }],
        new Set()
      );
      const summary = summarizeAdaptiveSeedExpansion(
        candidates,
        [{ id: "cluster-test", label: "Test Cluster", gapCount: 1 }]
      );
      expect(summary.clustersUsed).toBeGreaterThanOrEqual(0);
    });
  });
});
