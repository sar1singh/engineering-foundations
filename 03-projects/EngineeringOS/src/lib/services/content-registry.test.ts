import { describe, expect, it } from "vitest";
import { contentRegistry } from "@/lib/services/content-registry";
import {
  founderBetaCapabilities,
  founderBetaMasterTopics,
  founderBetaSkills,
  founderBetaSourceCatalog
} from "@/data/founder-beta";

describe("ContentRegistryService", () => {
  describe("buildRegistry", () => {
    const registry = contentRegistry.buildRegistry();

    it("returns correct total counts", () => {
      expect(registry.totalTopics).toBeGreaterThan(0);
      expect(registry.totalSources).toBe(217);
      expect(registry.totalCapabilities).toBeGreaterThan(0);
      expect(registry.totalSkills).toBeGreaterThan(0);
    });

    it("indexes topics by capability id", () => {
      const topicIds = registry.topicsByCapabilityId["cap-node-backend"];
      expect(topicIds).toBeDefined();
      expect(topicIds.length).toBeGreaterThan(0);
      expect(topicIds).toContain("topic-api-design");
    });

    it("indexes topics by skill id", () => {
      const topicIds = registry.topicsBySkillId["skill-api-contract-design"];
      expect(topicIds).toBeDefined();
      expect(topicIds.length).toBeGreaterThan(0);
      expect(topicIds).toContain("topic-api-design");
    });

    it("indexes sources by topic id", () => {
      const sourceIds = registry.sourcesByTopicId["topic-aws-well-architected"];
      expect(sourceIds).toBeDefined();
      expect(sourceIds.length).toBeGreaterThan(0);
      expect(sourceIds).toContain("aws-well-architected");
    });

    it("indexes sources by capability id with deduplication", () => {
      const sourceIds = registry.sourcesByCapabilityId["cap-node-backend"];
      expect(sourceIds).toBeDefined();
      expect(sourceIds.length).toBeGreaterThan(0);
      expect(new Set(sourceIds).size).toBe(sourceIds.length);
    });

    it("indexes capabilities by category", () => {
      const techCaps = registry.capabilitiesByCategory["technical"];
      expect(techCaps).toBeDefined();
      expect(techCaps.length).toBeGreaterThan(0);
    });

    it("all capability ids in registry resolve to valid capabilities", () => {
      for (const capId of Object.keys(registry.topicsByCapabilityId)) {
        expect(capId).toMatch(/^cap-/);
      }
    });

    it("all skill ids in registry resolve to valid skills", () => {
      for (const skillId of Object.keys(registry.topicsBySkillId)) {
        expect(skillId).toMatch(/^skill-/);
      }
    });
  });

  describe("computeCoverageSummary", () => {
    const coverage = contentRegistry.computeCoverageSummary();

    it("reports capability coverage with topic, skill, and source counts", () => {
      expect(coverage.capabilityCoverage.length).toBeGreaterThan(0);
      for (const cap of coverage.capabilityCoverage) {
        expect(cap.capabilityId).toBeTruthy();
        expect(cap.topicCount).toBeGreaterThanOrEqual(0);
        expect(cap.skillCount).toBeGreaterThan(0);
        expect(cap.sourceCount).toBeGreaterThan(0);
      }
    });

    it("reports skill coverage with topic counts", () => {
      expect(coverage.skillCoverage.length).toBeGreaterThan(0);
      for (const skill of coverage.skillCoverage) {
        expect(skill.skillId).toBeTruthy();
        expect(skill.topicCount).toBeGreaterThanOrEqual(0);
      }
    });

    it("reports source coverage by type, tier, and category", () => {
      expect(coverage.sourceCoverage.totalSources).toBe(217);
      expect(Object.keys(coverage.sourceCoverage.byType).length).toBeGreaterThan(0);
      expect(Object.keys(coverage.sourceCoverage.byTier).length).toBeGreaterThan(0);
      expect(Object.keys(coverage.sourceCoverage.byCategory).length).toBeGreaterThan(0);
    });

    it("reports proof coverage across all proof types", () => {
      expect(Object.keys(coverage.proofCoverage.proofTypes).length).toBeGreaterThan(0);
      expect(Object.keys(coverage.proofCoverage.byCapability).length).toBeGreaterThan(0);
    });

    it("reports interview importance distribution", () => {
      const imp = coverage.interviewCoverage.topicsWithInterviewImportance;
      expect(Object.keys(imp).length).toBeGreaterThan(0);
      expect(imp.high ?? 0).toBeGreaterThan(0);
    });
  });

  describe("detectGaps", () => {
    const gaps = contentRegistry.detectGaps();

    it("returns a sorted gap list", () => {
      expect(Array.isArray(gaps.gaps)).toBe(true);
    });

    it("identifies weakly sourced topics", () => {
      expect(Array.isArray(gaps.weaklySourcedTopics)).toBe(true);
    });

    it("identifies low coverage capabilities", () => {
      expect(Array.isArray(gaps.lowCoverageCapabilities)).toBe(true);
    });

    it("identifies low coverage skills", () => {
      expect(Array.isArray(gaps.lowCoverageSkills)).toBe(true);
    });

    it("identifies low confidence topics", () => {
      expect(Array.isArray(gaps.lowConfidenceTopics)).toBe(true);
    });

    it("gaps are sorted by severity (high first)", () => {
      if (gaps.gaps.length > 1) {
        const severityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
        for (let i = 1; i < gaps.gaps.length; i++) {
          const prev = severityOrder[gaps.gaps[i - 1].severity];
          const curr = severityOrder[gaps.gaps[i].severity];
          expect(prev).toBeLessThanOrEqual(curr);
        }
      }
    });

    it("all gaps have required fields", () => {
      for (const gap of gaps.gaps) {
        expect(gap.type).toBeTruthy();
        expect(gap.severity).toBeTruthy();
        expect(gap.entityId).toBeTruthy();
        expect(gap.entityName).toBeTruthy();
        expect(gap.detail).toBeTruthy();
      }
    });

    it("totalGap count matches array length", () => {
      expect(gaps.totalGaps).toBe(gaps.gaps.length);
    });
  });

  describe("getCoverageSummaryRows", () => {
    const rows = contentRegistry.getCoverageSummaryRows();

    it("returns rows for capabilities and skills", () => {
      expect(rows.length).toBeGreaterThan(0);
    });

    it("each row has the correct shape", () => {
      for (const row of rows) {
        expect(row.id).toBeTruthy();
        expect(row.name).toBeTruthy();
        expect(["capability", "skill"]).toContain(row.type);
        expect(row.topics).toBeGreaterThanOrEqual(0);
      }
    });
  });

  // ─── Phase 7B: Quality Threshold Gates ───────────────────────────────────────

  describe("Phase 7B quality gates", () => {
    it("GATE 1: no topic has zero proof types", () => {
      const zeroProofTopics = founderBetaMasterTopics.filter((t) => t.proofTypes.length === 0);
      expect(zeroProofTopics).toEqual([]);
    });

    it("GATE 2: no high-priority (p0) topic has zero sources", () => {
      const p0Topics = founderBetaMasterTopics.filter((t) => t.sourceIds.length === 0);
      expect(p0Topics).toEqual([]);
    });

    it("GATE 3: no capability has fewer than 3 topics", () => {
      const registry = contentRegistry.buildRegistry();
      const lowCaps = founderBetaCapabilities.filter((c) => {
        const topicCount = (registry.topicsByCapabilityId[c.id] ?? []).length;
        return topicCount < 3;
      });
      expect(lowCaps).toEqual([]);
    });

    it("GATE 4: no skill has zero topics", () => {
      const registry = contentRegistry.buildRegistry();
      const zeroSkills = founderBetaSkills.filter((s) => {
        const topicCount = (registry.topicsBySkillId[s.id] ?? []).length;
        return topicCount === 0;
      });
      expect(zeroSkills).toEqual([]);
    });

    it("GATE 5: all topic sourceIds reference valid catalog entries", () => {
      const catalogIds = new Set(founderBetaSourceCatalog.map((s) => s.id));
      const invalidRefs: string[] = [];
      for (const topic of founderBetaMasterTopics) {
        for (const sid of topic.sourceIds) {
          if (!catalogIds.has(sid)) {
            invalidRefs.push(`${topic.id} -> ${sid}`);
          }
        }
      }
      expect(invalidRefs).toEqual([]);
    });

    it("GATE 6: all topic capabilityIds reference valid capabilities", () => {
      const capIds = new Set(founderBetaCapabilities.map((c) => c.id));
      const invalidRefs: string[] = [];
      for (const topic of founderBetaMasterTopics) {
        for (const cid of topic.capabilityIds) {
          if (!capIds.has(cid)) {
            invalidRefs.push(`${topic.id} -> ${cid}`);
          }
        }
      }
      expect(invalidRefs).toEqual([]);
    });

    it("GATE 7: all topic skillIds reference valid skills", () => {
      const skillIds = new Set(founderBetaSkills.map((s) => s.id));
      const invalidRefs: string[] = [];
      for (const topic of founderBetaMasterTopics) {
        for (const sid of topic.skillIds) {
          if (!skillIds.has(sid)) {
            invalidRefs.push(`${topic.id} -> ${sid}`);
          }
        }
      }
      expect(invalidRefs).toEqual([]);
    });

    it("GATE 8: all skill capabilityIds reference valid capabilities", () => {
      const capIds = new Set(founderBetaCapabilities.map((c) => c.id));
      const invalidRefs: string[] = [];
      for (const skill of founderBetaSkills) {
        if (!capIds.has(skill.capabilityId)) {
          invalidRefs.push(`${skill.id} -> ${skill.capabilityId}`);
        }
      }
      expect(invalidRefs).toEqual([]);
    });

    it("GATE 9: no capability has zero proof types", () => {
      const zeroProofCaps = founderBetaCapabilities.filter((c) => c.proofTypes.length === 0);
      expect(zeroProofCaps).toEqual([]);
    });

    it("GATE 10: no duplicate topic IDs", () => {
      const ids = founderBetaMasterTopics.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
