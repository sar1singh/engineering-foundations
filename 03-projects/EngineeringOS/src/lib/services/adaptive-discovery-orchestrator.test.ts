import { describe, it, expect } from "vitest";
import { runAdaptiveDiscoveryPipeline, summarizeAdaptivePipeline } from "./adaptive-discovery-orchestrator";

describe("adaptive-discovery-orchestrator", () => {
  describe("runAdaptiveDiscoveryPipeline", () => {
    it("runs full pipeline without errors", () => {
      const result = runAdaptiveDiscoveryPipeline();
      expect(result).toBeDefined();
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it("discovers gaps and clusters them", () => {
      const result = runAdaptiveDiscoveryPipeline();
      expect(result.totalGapsConsidered).toBeGreaterThan(0);
      expect(result.clusters.length).toBeGreaterThan(0);
    });

    it("generates adaptive candidates", () => {
      const result = runAdaptiveDiscoveryPipeline();
      expect(result.candidates).toBeDefined();
    });

    it("computes confidence scores", () => {
      const result = runAdaptiveDiscoveryPipeline();
      for (const candidate of result.candidates) {
        const score = result.confidenceScores[candidate.id];
        if (score) {
          expect(score.normalizedScore).toBeGreaterThanOrEqual(0);
          expect(score.normalizedScore).toBeLessThanOrEqual(100);
        }
      }
    });

    it("generates coverage heatmap", () => {
      const result = runAdaptiveDiscoveryPipeline();
      expect(result.coverage).not.toBeNull();
      if (result.coverage) {
        expect(result.coverage.totalTopics).toBeGreaterThan(0);
      }
    });

    it("reports pack usage", () => {
      const result = runAdaptiveDiscoveryPipeline();
      const packKeys = Object.keys(result.packUsage);
      expect(packKeys.length).toBeGreaterThan(0);
    });

    it("produces no graph writes or autonomous approval", () => {
      const result = runAdaptiveDiscoveryPipeline();
      for (const c of result.candidates) {
        expect(c.reviewRequired).toBe(true);
      }
    });

    it("produces deterministic output", () => {
      const r1 = runAdaptiveDiscoveryPipeline();
      const r2 = runAdaptiveDiscoveryPipeline();
      expect(r1.totalGapsConsidered).toBe(r2.totalGapsConsidered);
      expect(r1.clusters.length).toBe(r2.clusters.length);
    });
  });

  describe("summarizeAdaptivePipeline", () => {
    it("returns summary with key metrics", () => {
      const result = runAdaptiveDiscoveryPipeline();
      const summary = summarizeAdaptivePipeline(result);
      expect(summary.totalGaps).toBeGreaterThan(0);
      expect(summary.totalClusters).toBeGreaterThan(0);
      expect(summary.totalCandidates).toBeGreaterThanOrEqual(0);
      expect(summary.packUsageSummary.length).toBeGreaterThan(0);
    });

    it("identifies top clusters", () => {
      const result = runAdaptiveDiscoveryPipeline();
      const summary = summarizeAdaptivePipeline(result);
      expect(summary.topClusters.length).toBeGreaterThan(0);
    });

    it("reports uncovered gaps", () => {
      const result = runAdaptiveDiscoveryPipeline();
      const summary = summarizeAdaptivePipeline(result);
      expect(summary.uncoveredGaps).toBeGreaterThanOrEqual(0);
    });
  });
});
