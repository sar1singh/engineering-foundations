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
    expect(sources.map((source) => source.id)).toEqual(["aws-well-architected", "aws-docs", "aws-architecture-center"]);
    expect(sources.every((source) => source.reliability === "high")).toBe(true);
  });

  it("filters daily missions by id and type", () => {
    const mission = founderBetaService.getMissionById("mission-case-study-engineeringos-hld");
    const behavioralMissions = founderBetaService.getMissionsByType("behavioral");
    const caseStudyMissions = founderBetaService.getMissionsByType("architecture-case-study");

    expect(mission?.mode).toBe("weekend");
    expect(behavioralMissions).toHaveLength(1);
    expect(behavioralMissions[0]?.topicId).toBe("topic-behavioral-star-stories");
    expect(caseStudyMissions).toHaveLength(1);
    expect(caseStudyMissions[0]?.estimatedMinutes).toBe(180);
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
});
