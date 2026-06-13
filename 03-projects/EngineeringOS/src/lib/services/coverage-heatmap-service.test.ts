import { describe, it, expect } from "vitest";
import {
  generateCoverageHeatmap,
  summarizeCoverageHeatmap,
  computeCapabilityCoverage,
  computeSkillCoverage,
  computeProofCoverage,
  computeMissionCoverage,
} from "./coverage-heatmap-service";

describe("coverage-heatmap-service", () => {
  describe("computeCapabilityCoverage", () => {
    it("returns capability coverage entries", () => {
      const coverage = computeCapabilityCoverage();
      expect(coverage.length).toBeGreaterThan(0);
      for (const entry of coverage) {
        expect(entry.label).toBeTruthy();
        expect(entry.coveragePercent).toBeGreaterThanOrEqual(0);
        expect(entry.coveragePercent).toBeLessThanOrEqual(100);
      }
    });
  });

  describe("computeSkillCoverage", () => {
    it("returns skill coverage entries", () => {
      const coverage = computeSkillCoverage();
      expect(coverage.length).toBeGreaterThan(0);
      for (const entry of coverage) {
        expect(entry.label).toBeTruthy();
        expect(typeof entry.currentCount).toBe("number");
      }
    });
  });

  describe("computeProofCoverage", () => {
    it("returns proof coverage entries", () => {
      const coverage = computeProofCoverage();
      expect(coverage.length).toBeGreaterThan(0);
    });
  });

  describe("computeMissionCoverage", () => {
    it("returns mission coverage entries", () => {
      const coverage = computeMissionCoverage();
      expect(coverage.length).toBeGreaterThan(0);
    });
  });

  describe("generateCoverageHeatmap", () => {
    it("generates complete coverage heatmap with all dimensions", () => {
      const heatmap = generateCoverageHeatmap();
      expect(heatmap.capabilityCoverage.length).toBeGreaterThan(0);
      expect(heatmap.skillCoverage.length).toBeGreaterThan(0);
      expect(heatmap.sourceDiversity.length).toBeGreaterThan(0);
      expect(heatmap.proofCoverage.length).toBeGreaterThan(0);
      expect(heatmap.missionCoverage.length).toBeGreaterThan(0);
      expect(heatmap.interviewCoverage.length).toBeGreaterThan(0);
      expect(heatmap.readinessCoverage.length).toBeGreaterThan(0);
    });

    it("includes graph metadata", () => {
      const heatmap = generateCoverageHeatmap();
      expect(heatmap.totalTopics).toBeGreaterThan(0);
      expect(heatmap.totalSources).toBeGreaterThan(0);
      expect(heatmap.generatedAt).toBeTruthy();
    });

    it("computes overall coverage percent", () => {
      const heatmap = generateCoverageHeatmap();
      expect(heatmap.overallCoveragePercent).toBeGreaterThanOrEqual(0);
      expect(heatmap.overallCoveragePercent).toBeLessThanOrEqual(100);
    });
  });

  describe("summarizeCoverageHeatmap", () => {
    it("summarizes coverage and identifies weakest areas", () => {
      const heatmap = generateCoverageHeatmap();
      const summary = summarizeCoverageHeatmap(heatmap);
      expect(summary.overallCoveragePercent).toBeGreaterThanOrEqual(0);
      expect(summary.totalEntries).toBeGreaterThan(0);
      expect(summary.weakestAreas.length).toBeGreaterThan(0);
      expect(summary.strongestAreas.length).toBeGreaterThan(0);
    });

    it("counts total gaps across all dimensions", () => {
      const heatmap = generateCoverageHeatmap();
      const summary = summarizeCoverageHeatmap(heatmap);
      expect(summary.totalGaps).toBeGreaterThanOrEqual(0);
    });
  });
});
