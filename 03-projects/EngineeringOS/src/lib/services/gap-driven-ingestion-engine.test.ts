import { describe, it, expect } from "vitest";
import {
  runGapSubAgents,
  discoverKnowledgeGraphGaps,
  scoreKnowledgeGraphGap,
  prioritizeKnowledgeGraphGaps,
  routeGapToDiscoveryAgent,
  matchSeedsToGap,
  buildGapDrivenIngestionPlan,
  summarizeGapDrivenPlan,
} from "./gap-driven-ingestion-engine";
import { founderBetaSourceCatalog } from "@/data/founder-beta";
import { discoverySeeds } from "@/data/discovery-seeds";
import type { SyllabusGap } from "@/types/gap-driven-ingestion";

describe("GapDrivenIngestionEngine", () => {
  describe("runGapSubAgents", () => {
    it("returns results from all 6 sub-agents", () => {
      const result = runGapSubAgents();
      expect(result.results).toHaveLength(6);
    });

    it("each result has agentId, agentName, gaps, and trace", () => {
      const result = runGapSubAgents();
      for (const r of result.results) {
        expect(r.agentId).toBeTruthy();
        expect(r.agentName).toBeTruthy();
        expect(Array.isArray(r.gaps)).toBe(true);
        expect(r.trace.status).toBe("success");
      }
    });

    it("trace timestamps are non-negative", () => {
      const result = runGapSubAgents();
      for (const t of result.traces) {
        expect(t.elapsedMs).toBeGreaterThanOrEqual(0);
      }
    });

    it("allGaps contains gaps from all sub-agents", () => {
      const result = runGapSubAgents();
      const totalGaps = result.results.reduce((sum, r) => sum + r.gaps.length, 0);
      expect(result.allGaps.length).toBe(totalGaps);
    });

    it("produces deterministic output on repeated calls", () => {
      const a = runGapSubAgents();
      const b = runGapSubAgents();
      expect(a.allGaps.length).toBe(b.allGaps.length);
    });
  });

  describe("discoverKnowledgeGraphGaps", () => {
    it("returns an array of syllabus gaps", () => {
      const gaps = discoverKnowledgeGraphGaps();
      expect(Array.isArray(gaps)).toBe(true);
      if (gaps.length > 0) {
        expect(gaps[0].id).toBeTruthy();
        expect(gaps[0].target.entityId).toBeTruthy();
      }
    });
  });

  describe("scoreKnowledgeGraphGap", () => {
    it("returns higher scores for critical severity", () => {
      const criticalGap: SyllabusGap = {
        id: "test", type: "low-source-topic", severity: "critical",
        target: { entityType: "topic", entityId: "t1", entityName: "Test" },
        reason: "", detail: "", score: 0,
      };
      const lowGap: SyllabusGap = {
        id: "test2", type: "low-source-topic", severity: "low",
        target: { entityType: "topic", entityId: "t2", entityName: "Test" },
        reason: "", detail: "", score: 0,
      };
      expect(scoreKnowledgeGraphGap(criticalGap)).toBeGreaterThan(scoreKnowledgeGraphGap(lowGap));
    });

    it("returns positive score for any gap", () => {
      const gap: SyllabusGap = {
        id: "test", type: "missing-proof-path", severity: "medium",
        target: { entityType: "topic", entityId: "t1", entityName: "Test" },
        reason: "", detail: "", score: 0,
      };
      expect(scoreKnowledgeGraphGap(gap)).toBeGreaterThan(0);
    });
  });

  describe("prioritizeKnowledgeGraphGaps", () => {
    it("returns gaps sorted by priority score descending", () => {
      const gaps = discoverKnowledgeGraphGaps();
      const prioritized = prioritizeKnowledgeGraphGaps(gaps);
      expect(prioritized.length).toBe(gaps.length);
      for (let i = 1; i < prioritized.length; i++) {
        expect(prioritized[i - 1].priorityScore).toBeGreaterThanOrEqual(prioritized[i].priorityScore);
      }
    });

    it("each entry has gap and priorityScore", () => {
      const gaps = discoverKnowledgeGraphGaps();
      const prioritized = prioritizeKnowledgeGraphGaps(gaps);
      for (const p of prioritized) {
        expect(p.gap).toBeDefined();
        expect(p.priorityScore).toBeGreaterThan(0);
      }
    });
  });

  describe("routeGapToDiscoveryAgent", () => {
    it("routes by entity name keywords", () => {
      const awsGap: SyllabusGap = { id: "1", type: "low-source-topic", severity: "medium", target: { entityType: "capability", entityId: "cap-aws-cloud-architecture", entityName: "AWS Cloud Architecture" }, reason: "", detail: "", score: 0 };
      const sysDesignGap: SyllabusGap = { id: "2", type: "low-source-topic", severity: "medium", target: { entityType: "capability", entityId: "cap-system-design-hld", entityName: "System Design HLD" }, reason: "", detail: "", score: 0 };
      const backendGap: SyllabusGap = { id: "3", type: "low-source-topic", severity: "medium", target: { entityType: "skill", entityId: "skill-node-backend", entityName: "Node.js Backend" }, reason: "", detail: "", score: 0 };
      const careerGap: SyllabusGap = { id: "4", type: "low-source-topic", severity: "medium", target: { entityType: "capability", entityId: "cap-career-assets", entityName: "Career Assets" }, reason: "", detail: "", score: 0 };

      expect(routeGapToDiscoveryAgent(awsGap)).toBe("AWS Discovery Agent");
      expect(routeGapToDiscoveryAgent(sysDesignGap)).toBe("System Design Discovery Agent");
      expect(routeGapToDiscoveryAgent(backendGap)).toBe("Backend Discovery Agent");
      expect(routeGapToDiscoveryAgent(careerGap)).toBe("Career Discovery Agent");
    });

    it("falls back to Backend Discovery Agent for unknown categories", () => {
      const gap: SyllabusGap = { id: "5", type: "low-source-topic", severity: "medium", target: { entityType: "topic", entityId: "unknown", entityName: "Unknown Topic" }, reason: "", detail: "", score: 0 };
      expect(routeGapToDiscoveryAgent(gap)).toBe("Backend Discovery Agent");
    });

    it("routes security gaps to Security Discovery Agent", () => {
      const gap: SyllabusGap = { id: "6", type: "low-source-topic", severity: "medium", target: { entityType: "capability", entityId: "cap-security", entityName: "Security" }, reason: "", detail: "", score: 0 };
      expect(routeGapToDiscoveryAgent(gap)).toBe("Security Discovery Agent (Backend fallback)");
    });
  });

  describe("matchSeedsToGap", () => {
    it("returns matches with score >= 5", () => {
      const gaps = discoverKnowledgeGraphGaps();
      const importedIds = new Set(founderBetaSourceCatalog.map((s) => s.id));
      if (gaps.length > 0) {
        const matches = matchSeedsToGap(gaps[0], discoverySeeds, importedIds);
        for (const m of matches) {
          expect(m.matchScore).toBeGreaterThanOrEqual(5);
          expect(m.matchReasons.length).toBeGreaterThan(0);
        }
      }
    });

    it("excludes already-imported seeds", () => {
      const importedIds = new Set(founderBetaSourceCatalog.map((s) => s.id));
      const allImported = importedIds.size > 0;
      const gaps = discoverKnowledgeGraphGaps();
      if (gaps.length > 0 && allImported) {
        const matches = matchSeedsToGap(gaps[0], discoverySeeds, importedIds);
        for (const m of matches) {
          if (m.seed.proposedSourceId) {
            expect(importedIds.has(m.seed.proposedSourceId)).toBe(false);
          }
        }
      }
    });

    it("returns empty array when no seeds match", () => {
      const gap: SyllabusGap = {
        id: "test", type: "missing-proof-path", severity: "medium",
        target: { entityType: "topic", entityId: "nonexistent", entityName: "ZZ_Nonexistent_Topic_999" },
        reason: "Test", detail: "Test", score: 0,
      };
      const matches = matchSeedsToGap(gap, [], new Set());
      expect(matches).toHaveLength(0);
    });
  });

  describe("buildGapDrivenIngestionPlan", () => {
    it("returns a complete GapDrivenIngestionPlan", () => {
      const gaps = discoverKnowledgeGraphGaps();
      const prioritized = prioritizeKnowledgeGraphGaps(gaps);
      const importedIds = new Set(founderBetaSourceCatalog.map((s) => s.id));
      const plan = buildGapDrivenIngestionPlan(prioritized, discoverySeeds, importedIds);

      expect(plan.planId).toBeTruthy();
      expect(plan.generatedAt).toBeTruthy();
      expect(plan.totalGaps).toBe(gaps.length);
      expect(Array.isArray(plan.highPriorityCandidates)).toBe(true);
      expect(Array.isArray(plan.mediumPriorityCandidates)).toBe(true);
      expect(Array.isArray(plan.lowPriorityCandidates)).toBe(true);
      expect(Array.isArray(plan.uncoveredGaps)).toBe(true);
    });

    it("candidates have reviewRequired set to true", () => {
      const gaps = discoverKnowledgeGraphGaps();
      const prioritized = prioritizeKnowledgeGraphGaps(gaps);
      const importedIds = new Set(founderBetaSourceCatalog.map((s) => s.id));
      const plan = buildGapDrivenIngestionPlan(prioritized, discoverySeeds, importedIds);

      const allCandidates = [...plan.highPriorityCandidates, ...plan.mediumPriorityCandidates, ...plan.lowPriorityCandidates];
      for (const c of allCandidates) {
        expect(c.reviewRequired).toBe(true);
      }
    });

    it("candidates have required fields", () => {
      const gaps = discoverKnowledgeGraphGaps();
      const prioritized = prioritizeKnowledgeGraphGaps(gaps);
      const importedIds = new Set(founderBetaSourceCatalog.map((s) => s.id));
      const plan = buildGapDrivenIngestionPlan(prioritized, discoverySeeds, importedIds);

      const allCandidates = [...plan.highPriorityCandidates, ...plan.mediumPriorityCandidates, ...plan.lowPriorityCandidates];
      for (const c of allCandidates) {
        expect(c.candidateId).toBeTruthy();
        expect(c.seedId).toBeTruthy();
        expect(c.title).toBeTruthy();
        expect(c.url).toBeTruthy();
        expect(c.proposedSourceId).toBeTruthy();
        expect(c.proposedTopicId).toBeTruthy();
        expect(c.recommendedAgent).toBeTruthy();
        expect(c.matchReasons.length).toBeGreaterThan(0);
      }
    });

    it("gapsByType and gapsBySeverity are populated", () => {
      const gaps = discoverKnowledgeGraphGaps();
      const prioritized = prioritizeKnowledgeGraphGaps(gaps);
      const importedIds = new Set(founderBetaSourceCatalog.map((s) => s.id));
      const plan = buildGapDrivenIngestionPlan(prioritized, discoverySeeds, importedIds);

      expect(Object.keys(plan.gapsByType).length).toBeGreaterThan(0);
      expect(Object.keys(plan.gapsBySeverity).length).toBeGreaterThan(0);
    });

    it("produces deterministic output", () => {
      const gaps = discoverKnowledgeGraphGaps();
      const prioritized = prioritizeKnowledgeGraphGaps(gaps);
      const importedIds = new Set(founderBetaSourceCatalog.map((s) => s.id));

      const planA = buildGapDrivenIngestionPlan(prioritized, discoverySeeds, importedIds);
      const planB = buildGapDrivenIngestionPlan(prioritized, discoverySeeds, importedIds);

      expect(planA.totalCandidates).toBe(planB.totalCandidates);
      expect(planA.highPriorityCandidates.length).toBe(planB.highPriorityCandidates.length);
    });
  });

  describe("summarizeGapDrivenPlan", () => {
    it("returns summary with all required fields", () => {
      const gaps = discoverKnowledgeGraphGaps();
      const prioritized = prioritizeKnowledgeGraphGaps(gaps);
      const importedIds = new Set(founderBetaSourceCatalog.map((s) => s.id));
      const plan = buildGapDrivenIngestionPlan(prioritized, discoverySeeds, importedIds);
      const summary = summarizeGapDrivenPlan(plan);

      expect(summary.totalGaps).toBe(plan.totalGaps);
      expect(summary.totalCandidates).toBe(plan.totalCandidates);
      expect(summary.highPriorityCount).toBe(plan.highPriorityCandidates.length);
      expect(Array.isArray(summary.topGapTypes)).toBe(true);
      expect(Array.isArray(summary.topAgentNeeds)).toBe(true);
      expect(summary.uncoveredGapCount).toBe(plan.uncoveredGaps.length);
      expect(summary.recommendedAction).toBeTruthy();
    });
  });

  describe("no graph writes", () => {
    it("discoverKnowledgeGraphGaps does not modify source catalog", () => {
      const beforeCount = founderBetaSourceCatalog.length;
      discoverKnowledgeGraphGaps();
      expect(founderBetaSourceCatalog.length).toBe(beforeCount);
    });

    it("buildGapDrivenIngestionPlan does not import candidates", () => {
      const gaps = discoverKnowledgeGraphGaps();
      const prioritized = prioritizeKnowledgeGraphGaps(gaps);
      const importedIds = new Set(founderBetaSourceCatalog.map((s) => s.id));
      const beforeCount = founderBetaSourceCatalog.length;
      buildGapDrivenIngestionPlan(prioritized, discoverySeeds, importedIds);
      expect(founderBetaSourceCatalog.length).toBe(beforeCount);
    });
  });
});
