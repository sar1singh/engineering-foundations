import { describe, it, expect } from "vitest";
import { autonomousCoverageGapDiscovery } from "./autonomous-coverage-gap-discovery-service";
import { founderBetaSourceCatalog } from "@/data/founder-beta";

describe("AutonomousCoverageGapDiscoveryService", () => {
  describe("detectAutonomousCoverageGaps", () => {
    const result = autonomousCoverageGapDiscovery.detectAutonomousCoverageGaps();

    it("returns base gaps from content registry", () => {
      expect(result.gaps.length).toBeGreaterThanOrEqual(0);
      expect(result.totalGaps).toBe(result.gaps.length);
    });

    it("includes additional gaps beyond base", () => {
      expect(Array.isArray(result.additionalGaps)).toBe(true);
    });

    it("returns categorized gap collections", () => {
      expect(Array.isArray(result.weaklySourcedTopics)).toBe(true);
      expect(Array.isArray(result.lowCoverageCapabilities)).toBe(true);
      expect(Array.isArray(result.lowCoverageSkills)).toBe(true);
      expect(Array.isArray(result.lowConfidenceTopics)).toBe(true);
    });
  });

  describe("rankCoverageGaps", () => {
    const gaps = autonomousCoverageGapDiscovery.detectAutonomousCoverageGaps();
    const ranked = autonomousCoverageGapDiscovery.rankCoverageGaps(gaps.gaps);

    it("returns ranked gaps sorted by score descending", () => {
      expect(ranked.length).toBe(gaps.gaps.length);
      for (let i = 1; i < ranked.length; i++) {
        expect(ranked[i - 1].rankScore).toBeGreaterThanOrEqual(ranked[i].rankScore);
      }
    });

    it("each ranked gap has category and rankScore", () => {
      for (const r of ranked) {
        expect(r.category).toBeTruthy();
        expect(r.rankScore).toBeGreaterThan(0);
      }
    });

    it("ranks capability gaps higher than topic gaps", () => {
      const capGaps = ranked.filter((r) => r.gap.entityId.startsWith("cap-"));
      const topicGaps = ranked.filter((r) => r.gap.entityId.startsWith("topic-"));
      if (capGaps.length > 0 && topicGaps.length > 0) {
        const maxCapScore = Math.max(...capGaps.map((r) => r.rankScore));
        const maxTopicScore = Math.max(...topicGaps.map((r) => r.rankScore));
        expect(maxCapScore).toBeGreaterThanOrEqual(maxTopicScore);
      }
    });
  });

  describe("matchSeedsToCoverageGaps", () => {
    const gaps = autonomousCoverageGapDiscovery.detectAutonomousCoverageGaps();
    const ranked = autonomousCoverageGapDiscovery.rankCoverageGaps(gaps.gaps);
    const matches = autonomousCoverageGapDiscovery.matchSeedsToCoverageGaps(ranked);

    it("returns seed matches", () => {
      expect(matches.length).toBeGreaterThan(0);
    });

    it("each match has seed, matchScore, and matchReasons", () => {
      for (const m of matches) {
        expect(m.seed).toBeDefined();
        expect(m.seed.id).toBeTruthy();
        expect(m.matchScore).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(m.matchReasons)).toBe(true);
        expect(m.domain).toBeTruthy();
      }
    });

    it("does not include already-imported seeds", () => {
      const existingIds = new Set(founderBetaSourceCatalog.map((s) => s.id));
      for (const m of matches) {
        if (m.seed.proposedSourceId) {
          expect(existingIds.has(m.seed.proposedSourceId)).toBe(false);
        }
      }
    });

    it("each match has bestFitCapabilityId", () => {
      for (const m of matches) {
        expect(m.bestFitCapabilityId).toBeTruthy();
      }
    });

    it("matches cover all 4 discovery categories", () => {
      const categories = new Set(matches.map((m) => m.seed.category));
      expect(categories.has("aws")).toBe(true);
      expect(categories.has("system-design")).toBe(true);
      expect(categories.has("backend")).toBe(true);
      expect(categories.has("career")).toBe(true);
    });
  });

  describe("createGapDrivenImportPlan", () => {
    const gaps = autonomousCoverageGapDiscovery.detectAutonomousCoverageGaps();
    const ranked = autonomousCoverageGapDiscovery.rankCoverageGaps(gaps.gaps);
    const matches = autonomousCoverageGapDiscovery.matchSeedsToCoverageGaps(ranked);
    const plan = autonomousCoverageGapDiscovery.createGapDrivenImportPlan(matches);

    it("returns a GapDrivenImportPlan with all required fields", () => {
      expect(plan.planId).toBeTruthy();
      expect(plan.generatedAt).toBeTruthy();
      expect(plan.totalGapsFound).toBeGreaterThanOrEqual(0);
      expect(plan.totalSeedsEvaluated).toBeGreaterThan(0);
    });

    it("categorizes candidates by priority", () => {
      expect(Array.isArray(plan.highPriorityCandidates)).toBe(true);
      expect(Array.isArray(plan.mediumPriorityCandidates)).toBe(true);
      expect(Array.isArray(plan.lowPriorityCandidates)).toBe(true);
      expect(Array.isArray(plan.deferredCandidates)).toBe(true);
    });

    it("each priority entry has required fields", () => {
      const allEntries = [
        ...plan.highPriorityCandidates,
        ...plan.mediumPriorityCandidates,
        ...plan.lowPriorityCandidates,
        ...plan.deferredCandidates,
      ];
      for (const e of allEntries) {
        expect(e.seedId).toBeTruthy();
        expect(e.title).toBeTruthy();
        expect(e.url).toBeTruthy();
        expect(e.proposedSourceId).toBeTruthy();
        expect(e.proposedTopicId).toBeTruthy();
        expect(e.gapReason).toBeTruthy();
      }
    });

    it("uncovered gaps are those not matched by any candidate", () => {
      expect(Array.isArray(plan.uncoveredGaps)).toBe(true);
    });
  });

  describe("summarizeGapDrivenPlan", () => {
    const gaps = autonomousCoverageGapDiscovery.detectAutonomousCoverageGaps();
    const ranked = autonomousCoverageGapDiscovery.rankCoverageGaps(gaps.gaps);
    const matches = autonomousCoverageGapDiscovery.matchSeedsToCoverageGaps(ranked);
    const plan = autonomousCoverageGapDiscovery.createGapDrivenImportPlan(matches);
    const summary = autonomousCoverageGapDiscovery.summarizeGapDrivenPlan(plan);

    it("returns summary with all required fields", () => {
      expect(summary.totalGaps).toBeGreaterThanOrEqual(0);
      expect(summary.matchableCandidates).toBeGreaterThanOrEqual(0);
      expect(summary.highPriorityCount).toBeGreaterThanOrEqual(0);
      expect(summary.recommendedAction).toBeTruthy();
    });

    it("recommended action references high-priority count", () => {
      expect(summary.recommendedAction).toContain(String(summary.highPriorityCount));
    });
  });

  describe("getSeedsForCategory", () => {
    it("returns aws seeds", () => {
      const seeds = autonomousCoverageGapDiscovery.getSeedsForCategory("aws");
      expect(seeds.length).toBeGreaterThan(0);
      expect(seeds.every((s) => s.category === "aws")).toBe(true);
    });

    it("returns system-design seeds", () => {
      const seeds = autonomousCoverageGapDiscovery.getSeedsForCategory("system-design");
      expect(seeds.length).toBeGreaterThan(0);
    });

    it("returns backend seeds", () => {
      const seeds = autonomousCoverageGapDiscovery.getSeedsForCategory("backend");
      expect(seeds.length).toBeGreaterThan(0);
    });

    it("returns career seeds", () => {
      const seeds = autonomousCoverageGapDiscovery.getSeedsForCategory("career");
      expect(seeds.length).toBeGreaterThan(0);
    });
  });
});
