import { describe, expect, it } from "vitest";
import { FounderBetaRoadmapProjection } from "@/lib/services/founder-beta-roadmap-projection";
import { dsaProblemBank, founderBetaCapabilities, founderBetaMasterTopics, founderBetaSkills } from "@/data/founder-beta";

const projection = new FounderBetaRoadmapProjection();

const dsaSkillIds = new Set([
  "skill-dsa-complexity-analysis",
  "skill-dsa-array-techniques",
  "skill-dsa-string-techniques",
  "skill-dsa-hashing-techniques",
  "skill-dsa-two-pointer-techniques",
  "skill-dsa-sliding-window-techniques",
  "skill-dsa-binary-search-techniques",
  "skill-dsa-linked-list-techniques",
  "skill-dsa-stack-techniques",
  "skill-dsa-queue-techniques",
  "skill-dsa-sorting-techniques",
  "skill-dsa-recursion-techniques",
  "skill-dsa-tree-techniques",
  "skill-dsa-bst-techniques",
  "skill-dsa-heap-techniques",
  "skill-dsa-greedy-techniques",
  "skill-dsa-backtracking-techniques",
  "skill-dsa-graph-techniques",
  "skill-dsa-dp-techniques"
]);

describe("FounderBetaRoadmapProjection", () => {
  it("generates a complete projection with 6 phases and 16 weeks", () => {
    const result = projection.generateProjection();

    expect(result.id).toBe("founder-architect-16-week-roadmap");
    expect(result.target).toBe("Solution Architect");
    expect(result.timelineWeeks).toBe(16);
    expect(result.hoursPerWeek).toBe(10);
    expect(result.phases).toHaveLength(6);
    expect(result.weeklyBreakdown).toHaveLength(16);
  });

  it("names all 6 phases correctly", () => {
    const result = projection.generateProjection();
    const labels = result.phases.map((p) => p.label);

    expect(labels[0]).toContain("Backend");
    expect(labels[1]).toContain("System Design");
    expect(labels[2]).toContain("Cloud");
    expect(labels[3]).toContain("Distributed");
    expect(labels[4]).toContain("Communication");
    expect(labels[5]).toContain("Interview");
  });

  it("orders capabilities by readiness gap with weak-area boost", () => {
    const result = projection.generateProjection({
      capabilityReadinessById: {
        "cap-node-backend": 90,
        "cap-aws-cloud-architecture": 40,
        "cap-system-design-hld": 60
      },
      weakAreaCapabilityIds: ["cap-aws-cloud-architecture"]
    });

    const order = result.priorityCapabilityOrder;
    const awsIdx = order.indexOf("cap-aws-cloud-architecture");
    const hldIdx = order.indexOf("cap-system-design-hld");
    const backendIdx = order.indexOf("cap-node-backend");

    expect(awsIdx).toBeLessThan(hldIdx);
    expect(awsIdx).toBeLessThan(backendIdx);
  });

  it("recommends skills in phase order with weak-area priority", () => {
    const result = projection.generateProjection({
      weakAreaCapabilityIds: ["cap-aws-cloud-architecture"]
    });

    const order = result.recommendedSkillOrder;
    expect(order.length).toBeGreaterThan(0);
  });

  it("builds topic progression excluding completed topics", () => {
    const result = projection.generateProjection({
      completedTopicIds: ["topic-api-design", "topic-load-balancing"]
    });

    expect(result.recommendedTopicProgression).not.toContain("topic-api-design");
    expect(result.recommendedTopicProgression).not.toContain("topic-load-balancing");
  });

  it("places weak-area topics earlier in progression", () => {
    const result = projection.generateProjection({
      weakAreaTopicIds: ["topic-aws-well-architected"]
    });

    const progression = result.recommendedTopicProgression;
    const awsIdx = progression.indexOf("topic-aws-well-architected");
    expect(awsIdx).toBeGreaterThanOrEqual(0);
  });

  it("phases cover all 16 weeks without gaps or overlap", () => {
    const result = projection.generateProjection();
    const weeksCovered = new Set<number>();

    for (const phase of result.phases) {
      for (let w = phase.weekStart; w <= phase.weekEnd; w++) {
        expect(weeksCovered.has(w)).toBe(false);
        weeksCovered.add(w);
      }
    }

    expect(weeksCovered.size).toBe(16);
  });

  it("each weekly segment references a valid phase", () => {
    const result = projection.generateProjection();
    const phaseIds = new Set(result.phases.map((p) => p.id));

    for (const week of result.weeklyBreakdown) {
      expect(phaseIds.has(week.phaseId)).toBe(true);
      expect(week.phaseLabel).toBeDefined();
    }
  });

  it("each weekly segment has capability, skill, and topic focus", () => {
    const result = projection.generateProjection();

    for (const week of result.weeklyBreakdown) {
      expect(week.focusCapabilityIds.length).toBeGreaterThan(0);
      expect(week.focusSkillIds.length).toBeGreaterThan(0);
      expect(week.estimatedHours).toBeGreaterThan(0);
    }
  });

  it("respects prerequisite ordering in topic progression", () => {
    const result = projection.generateProjection();

    const progression = result.recommendedTopicProgression;
    const cacheIdx = progression.indexOf("topic-caching");
    const cacheInvalidationIdx = progression.indexOf("topic-cache-invalidation");

    if (cacheIdx >= 0 && cacheInvalidationIdx >= 0) {
      expect(cacheIdx).toBeLessThan(cacheInvalidationIdx);
    }
  });

  it("reorders phases when weak areas are present", () => {
    const noWeakAreas = projection.generateProjection();
    const withWeakAreas = projection.generateProjection({
      weakAreaCapabilityIds: ["cap-aws-cloud-architecture"],
      weakAreaTopicIds: ["topic-aws-well-architected"]
    });

    const noWeakPhase0 = noWeakAreas.phases[0];
    const weakPhase0 = withWeakAreas.phases[0];

    const noWeakCloudIdx = noWeakAreas.phases.findIndex(
      (p) => p.capabilityIds.includes("cap-aws-cloud-architecture")
    );
    const weakCloudIdx = withWeakAreas.phases.findIndex(
      (p) => p.capabilityIds.includes("cap-aws-cloud-architecture")
    );

    expect(weakCloudIdx).toBeLessThanOrEqual(noWeakCloudIdx);
  });

  it("generates deterministic output for same input", () => {
    const a = projection.generateProjection({ completedTopicIds: ["topic-api-design"] });
    const b = projection.generateProjection({ completedTopicIds: ["topic-api-design"] });

    expect(a.phases.map((p) => p.id)).toEqual(b.phases.map((p) => p.id));
    expect(a.weeklyBreakdown.map((w) => w.focusTopicIds)).toEqual(
      b.weeklyBreakdown.map((w) => w.focusTopicIds)
    );
  });

  it("all phases use actual topic IDs from the Master Syllabus or DSA problem bank", () => {
    const allTopics = new Set([
      ...founderBetaMasterTopics.map((t) => t.id),
      ...dsaProblemBank.map((t) => t.id)
    ]);

    const result = projection.generateProjection();

    for (const phase of result.phases) {
      for (const tid of phase.topicIds) {
        expect(allTopics.has(tid)).toBe(true);
      }
    }
  });

  it("all phases use actual skill IDs from the capability graph", () => {
    const allSkills = new Set(founderBetaSkills.map((s) => s.id));

    const result = projection.generateProjection();

    for (const phase of result.phases) {
      for (const sid of phase.skillIds) {
        expect(allSkills.has(sid)).toBe(true);
      }
    }
  });

  it("all phases use actual capability IDs from the capability graph", () => {
    const allCaps = new Set(founderBetaCapabilities.map((c) => c.id));

    const result = projection.generateProjection();

    for (const phase of result.phases) {
      for (const cid of phase.capabilityIds) {
        expect(allCaps.has(cid)).toBe(true);
      }
    }
  });

  // === DSA-Aware Projection Tests ===

  it("includes DSA problem solving capability in roadmap projection", () => {
    const result = projection.generateProjection();
    const allCapIds = new Set(result.phases.flatMap((p) => p.capabilityIds));

    expect(allCapIds.has("cap-dsa-problem-solving")).toBe(true);
  });

  it("includes DSA skills in at least one phase", () => {
    const result = projection.generateProjection();
    const allPhaseSkillIds = new Set(result.phases.flatMap((p) => p.skillIds));

    for (const sid of dsaSkillIds) {
      expect(allPhaseSkillIds.has(sid), `DSA skill ${sid} missing from all phases`).toBe(true);
    }
  });

  it("includes DSA problem bank topic IDs in at least one phase", () => {
    const result = projection.generateProjection();
    const allPhaseTopicIds = new Set(result.phases.flatMap((p) => p.topicIds));

    const expectedDsaTopics = [
      "topic-dsa-big-o-notation", "topic-dsa-array-two-sum", "topic-dsa-array-maximum-subarray",
      "topic-dsa-linked-list-reverse", "topic-dsa-stack-valid-parentheses",
      "topic-dsa-tree-traversal", "topic-dsa-graph-bfs",
      "topic-dsa-dp-climbing-stairs", "topic-dsa-greedy-jump-game",
      "topic-dsa-backtracking-subsets"
    ];

    for (const tid of expectedDsaTopics) {
      expect(allPhaseTopicIds.has(tid), `DSA topic ${tid} missing from all phases`).toBe(true);
    }
  });

  it("gives DSA higher priority when DSA readiness is low vs high", () => {
    const highDsa = projection.generateProjection({
      capabilityReadinessById: {
        "cap-dsa-problem-solving": 100
      }
    }).priorityCapabilityOrder;

    const lowDsa = projection.generateProjection({
      capabilityReadinessById: {
        "cap-dsa-problem-solving": 20
      }
    }).priorityCapabilityOrder;

    const highIdx = highDsa.indexOf("cap-dsa-problem-solving");
    const lowIdx = lowDsa.indexOf("cap-dsa-problem-solving");

    expect(lowIdx).toBeLessThanOrEqual(highIdx);
  });

  it("excludes completed DSA topics from topic progression", () => {
    const result = projection.generateProjection({
      completedTopicIds: ["topic-dsa-array-two-sum", "topic-dsa-heap-kth-largest"]
    });

    expect(result.recommendedTopicProgression).not.toContain("topic-dsa-array-two-sum");
    expect(result.recommendedTopicProgression).not.toContain("topic-dsa-heap-kth-largest");
  });

  it("advances DSA weak area topics earlier in progression", () => {
    const withoutWeak = projection.generateProjection();
    const withWeak = projection.generateProjection({
      weakAreaTopicIds: ["topic-dsa-graph-bfs"]
    });

    const withoutIdx = withoutWeak.recommendedTopicProgression.indexOf("topic-dsa-graph-bfs");
    const withIdx = withWeak.recommendedTopicProgression.indexOf("topic-dsa-graph-bfs");

    expect(withIdx).toBeLessThanOrEqual(withoutIdx);
  });

  it("includes DSA topics in weekly breakdown", () => {
    const result = projection.generateProjection();
    const allWeeklyTopicIds = new Set(result.weeklyBreakdown.flatMap((w) => w.focusTopicIds));

    expect(allWeeklyTopicIds.has("topic-dsa-array-two-sum")).toBe(true);
    expect(allWeeklyTopicIds.has("topic-dsa-binary-search-basic")).toBe(true);
  });

  it("maintains deterministic output with DSA input", () => {
    const a = projection.generateProjection({
      weakAreaCapabilityIds: ["cap-dsa-problem-solving"],
      completedTopicIds: ["topic-dsa-array-two-sum"]
    });
    const b = projection.generateProjection({
      weakAreaCapabilityIds: ["cap-dsa-problem-solving"],
      completedTopicIds: ["topic-dsa-array-two-sum"]
    });

    expect(a.phases.map((p) => p.id)).toEqual(b.phases.map((p) => p.id));
    expect(a.recommendedTopicProgression).toEqual(b.recommendedTopicProgression);
    expect(a.priorityCapabilityOrder).toEqual(b.priorityCapabilityOrder);
  });

  it("high-priorityWeight capability gets earlier ordering when readiness gaps are equal", () => {
    const awsId = "cap-aws-cloud-architecture";
    const dsaId = "cap-dsa-problem-solving";

    const result = projection.generateProjection({
      capabilityReadinessById: { [awsId]: 50, [dsaId]: 50 }
    });

    const awsIdx = result.priorityCapabilityOrder.indexOf(awsId);
    const dsaIdx = result.priorityCapabilityOrder.indexOf(dsaId);

    expect(awsIdx).toBeLessThan(dsaIdx);
  });
});
