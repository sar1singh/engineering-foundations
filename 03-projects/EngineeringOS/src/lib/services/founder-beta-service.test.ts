import { describe, expect, it } from "vitest";
import { founderBetaService } from "@/lib/services/founder-beta-service";

describe("FounderBetaService", () => {
  it("returns the founder beta path and default roadmap projection", () => {
    const path = founderBetaService.getFounderBetaPath();
    const roadmap = founderBetaService.getFounderBetaRoadmapProjection();

    expect(path.primaryRole).toBe("solution-architect");
    expect(path.secondaryRole).toBe("em-aware-lead-backend");
    expect(roadmap.id).toBe("founder-architect-beta-16-week");
    expect(roadmap.timelineWeeks).toBe(16);
    expect(roadmap.hoursPerWeek).toBe(10);
  });

  it("looks up capabilities, skills, and mapped topics", () => {
    const capability = founderBetaService.getCapabilityById("cap-aws-cloud-architecture");
    const skills = founderBetaService.getSkillsByCapabilityId("cap-aws-cloud-architecture");
    const topics = founderBetaService.getTopicsByCapabilityId("cap-aws-cloud-architecture");

    expect(capability?.name).toBe("AWS / Cloud Architecture");
    expect(skills.map((skill) => skill.id)).toContain("skill-aws-architecture-review");
    expect(topics.map((topic) => topic.id)).toContain("topic-aws-well-architected");
    expect(topics.map((topic) => topic.id)).toContain("topic-engineeringos-architecture-case-study");
  });

  it("returns canonical topics and source references for a topic", () => {
    const topic = founderBetaService.getTopicById("topic-aws-well-architected");
    const sources = founderBetaService.getSourcesForTopic("topic-aws-well-architected");

    expect(topic?.confidenceScore).toBe(1);
    expect(sources.map((source) => source.id)).toEqual(["aws-well-architected", "aws-docs", "aws-architecture-center", "aws-cdk-docs", "aws-cloudformation-docs", "aws-elasticache-docs", "aws-api-gateway-docs"]);
    expect(sources.every((source) => source.reliability === "high")).toBe(true);
  });

  it("filters daily missions by id and type", () => {
    const mission = founderBetaService.getMissionById("mission-case-study-engineeringos-hld");
    const behavioralMissions = founderBetaService.getMissionsByType("behavioral");
    const caseStudyMissions = founderBetaService.getMissionsByType("architecture-case-study");

    expect(mission?.mode).toBe("weekend");
    expect(behavioralMissions).toHaveLength(11);
    expect(behavioralMissions[0]?.topicId).toBe("topic-behavioral-star-stories");
    expect(caseStudyMissions).toHaveLength(7);
    expect(caseStudyMissions[0]?.estimatedMinutes).toBe(180);
    expect(caseStudyMissions[1]?.estimatedMinutes).toBe(120);
  });

  it("exposes readiness rules, hard gates, and offer readiness signals", () => {
    const rules = founderBetaService.getReadinessRules();
    const hardGates = founderBetaService.getHardGates();
    const offerSignals = founderBetaService.getOfferReadinessSignals();

    expect(rules).toHaveLength(6);
    expect(hardGates.map((gate) => gate.id)).toContain("rule-architect-readiness");
    expect(hardGates.map((gate) => gate.id)).toContain("rule-architecture-case-studies");
    expect(offerSignals.map((signal) => signal.readinessArea)).toContain("referrals");
  });

  it("returns null or an empty list for unknown ids", () => {
    expect(founderBetaService.getCapabilityById("missing")).toBeNull();
    expect(founderBetaService.getTopicById("missing")).toBeNull();
    expect(founderBetaService.getMissionById("missing")).toBeNull();
    expect(founderBetaService.getSourcesForTopic("missing")).toEqual([]);
  });

  // ── Phase 6B: Resource / Source Navigation Helpers ──

  it("getTopicsForSource returns topics that reference a given source id", () => {
    const topics = founderBetaService.getTopicsForSource("aws-well-architected");

    expect(topics.length).toBeGreaterThan(0);
    expect(topics.map((t) => t.id)).toContain("topic-aws-well-architected");
    expect(topics.map((t) => t.id)).toContain("topic-load-balancing");
    expect(topics.every((t) => t.sourceIds.includes("aws-well-architected"))).toBe(true);
  });

  it("getSourcesByCapability returns all sources referenced by topics in a capability", () => {
    const sources = founderBetaService.getSourcesByCapability("cap-dsa-problem-solving");

    expect(sources.length).toBeGreaterThan(0);
    expect(sources.map((s) => s.id)).toContain("leetcode-patterns");
    expect(sources.map((s) => s.id)).toContain("neetcode-roadmap");
    expect(new Set(sources.map((s) => s.id)).size).toBe(sources.length);
  });

  it("getSourcesByCategory filters sources by category", () => {
    const dsaSources = founderBetaService.getSourcesByCategory("DSA");

    expect(dsaSources.length).toBeGreaterThan(0);
    expect(dsaSources.every((s) => s.category === "DSA")).toBe(true);
  });

  it("getHighPrioritySources returns tier-1 sources by default", () => {
    const tier1 = founderBetaService.getHighPrioritySources();

    expect(tier1.length).toBeGreaterThan(0);
    expect(tier1.every((s) => s.tier === "tier-1")).toBe(true);
  });

  it("getHighPrioritySources accepts an explicit tier parameter", () => {
    const tier3 = founderBetaService.getHighPrioritySources("tier-3");

    expect(tier3.length).toBeGreaterThan(0);
    expect(tier3.every((s) => s.tier === "tier-3")).toBe(true);
  });

  it("getSourceCategories returns sorted unique categories", () => {
    const categories = founderBetaService.getSourceCategories();

    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toEqual([...categories].sort());
    expect(new Set(categories).size).toBe(categories.length);
    expect(categories).toContain("DSA");
    expect(categories).toContain("AWS / Cloud Architecture");
  });

  it("getAllSources returns the full source catalog", () => {
    const all = founderBetaService.getAllSources();

    expect(all.length).toBe(221);
    expect(all[0].id).toBe("aws-well-architected");
  });

  it("getTopicsForSource returns empty array for unknown source", () => {
    const topics = founderBetaService.getTopicsForSource("unknown-source");

    expect(topics).toEqual([]);
  });

  it("getSourcesByCapability returns empty array for unknown capability", () => {
    const sources = founderBetaService.getSourcesByCapability("unknown-capability");

    expect(sources).toEqual([]);
  });

  // ── Phase 6C: Topic & Mission Navigation Helpers ──

  it("getMissionsByTopicId returns all missions for a topic", () => {
    const missions = founderBetaService.getMissionsByTopicId("topic-aws-well-architected");

    expect(missions.length).toBeGreaterThan(0);
    expect(missions.every((m) => m.topicId === "topic-aws-well-architected")).toBe(true);
  });

  it("getMissionsByTopicId returns missions with correct structure", () => {
    const missions = founderBetaService.getMissionsByTopicId("topic-api-design");

    for (const mission of missions) {
      expect(mission.id).toBeTruthy();
      expect(mission.missionType).toBeTruthy();
      expect(mission.objective).toBeTruthy();
      expect(mission.tasks.length).toBeGreaterThan(0);
      expect(mission.proofRequirements.length).toBeGreaterThan(0);
    }
  });

  it("getMissionsByTopicId returns empty array for unknown topic", () => {
    const missions = founderBetaService.getMissionsByTopicId("unknown-topic");

    expect(missions).toEqual([]);
  });

  it("getSkillById returns a skill for a valid id", () => {
    const skill = founderBetaService.getSkillById("skill-api-contract-design");

    expect(skill).not.toBeNull();
    expect(skill?.name).toBe("API contract design");
    expect(skill?.capabilityId).toBe("cap-node-backend");
  });

  it("getSkillById returns null for unknown id", () => {
    const skill = founderBetaService.getSkillById("unknown-skill");

    expect(skill).toBeNull();
  });

  it("topic has valid capability ids that resolve to capabilities", () => {
    const topic = founderBetaService.getTopicById("topic-api-design");

    expect(topic).not.toBeNull();
    for (const cid of topic!.capabilityIds) {
      const cap = founderBetaService.getCapabilityById(cid);
      expect(cap).not.toBeNull();
    }
  });

  it("topic has valid skill ids that resolve to skills", () => {
    const topic = founderBetaService.getTopicById("topic-rate-limiting");

    expect(topic).not.toBeNull();
    for (const sid of topic!.skillIds) {
      const skill = founderBetaService.getSkillById(sid);
      expect(skill).not.toBeNull();
    }
  });

  it("missions reference topics that exist in master topics", () => {
    const allMissions = founderBetaService.getFounderBetaDailyMissions();

    for (const mission of allMissions) {
      const topic = founderBetaService.getTopicById(mission.topicId);
      expect(topic, `Mission ${mission.id} references missing topic ${mission.topicId}`).not.toBeNull();
    }
  });
});
