import { describe, expect, it } from "vitest";
import {
  founderBetaCapabilities,
  founderBetaSkills
} from "@/data/founder-beta/capabilities";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import {
  founderBetaReadinessRules,
  founderBetaOfferReadinessSignals
} from "@/data/founder-beta/readiness-rules";
import { founderBetaDailyMissions } from "@/data/founder-beta/daily-missions";
import { founderArchitectBetaRoadmapProjection } from "@/data/founder-beta/roadmap-projection";
import { founderBetaPath } from "@/data/founder-beta/capabilities";
import type { ReadinessDimension } from "@/types/founder-beta";

const validReadinessDimensions: ReadinessDimension[] = [
  "knowledge", "practice", "interview", "implementation"
];
const validReadinessDimensionSet = new Set<ReadinessDimension>(validReadinessDimensions);

describe("founder beta readiness chain", () => {
  const capabilityIds = new Set(founderBetaCapabilities.map((c) => c.id));

  it("has valid readiness thresholds on all capabilities", () => {
    for (const cap of founderBetaCapabilities) {
      expect(
        cap.readinessThreshold >= 0 && cap.readinessThreshold <= 100,
        `${cap.id} readinessThreshold ${cap.readinessThreshold} not in [0, 100]`
      ).toBe(true);
    }
  });

  it("has valid readiness metrics on all topics", () => {
    for (const topic of founderBetaMasterTopics) {
      expect(
        topic.readinessMetrics.length,
        `${topic.id} has ${topic.readinessMetrics.length} readinessMetrics; expected >= 1`
      ).toBeGreaterThanOrEqual(1);

      for (const dim of topic.readinessMetrics) {
        expect(
          validReadinessDimensionSet.has(dim),
          `${topic.id} has invalid readiness dimension: ${dim}`
        ).toBe(true);
      }
    }
  });

  it("has valid readiness thresholds on all readiness rules", () => {
    for (const rule of founderBetaReadinessRules) {
      expect(
        rule.threshold >= 0,
        `${rule.id} threshold ${rule.threshold} is negative`
      ).toBe(true);

      expect(
        ["topic", "capability", "role", "interview", "offer"].includes(rule.appliesTo),
        `${rule.id} has invalid appliesTo: ${rule.appliesTo}`
      ).toBe(true);
    }
  });

  it("has valid offer readiness signals with correct areas", () => {
    const validAreas = new Set([
      "resume", "linkedin", "github", "portfolio", "behavioral",
      "interview", "case-studies", "applications", "referrals", "compensation",
      "technical", "leadership", "communication", "architecture", "project-depth"
    ]);

    for (const signal of founderBetaOfferReadinessSignals) {
      expect(
        validAreas.has(signal.readinessArea),
        `${signal.id} has invalid readinessArea: ${signal.readinessArea}`
      ).toBe(true);

      expect(
        ["not-started", "blocked", "in-progress", "ready"].includes(signal.status),
        `${signal.id} has invalid status: ${signal.status}`
      ).toBe(true);
    }
  });

  it("connects every topic readiness dimension back through skills to capabilities", () => {
    const topicMap = new Map(founderBetaMasterTopics.map((t) => [t.id, t]));
    const skillMap = new Map(founderBetaSkills.map((s) => [s.id, s]));

    for (const topic of founderBetaMasterTopics) {
      for (const skillId of topic.skillIds) {
        const skill = skillMap.get(skillId);
        expect(
          skill,
          `${topic.id} references skill ${skillId} that does not exist`
        ).toBeDefined();

        if (skill) {
          expect(
            capabilityIds.has(skill.capabilityId),
            `${topic.id} -> skill ${skillId} -> capability ${skill.capabilityId} does not exist`
          ).toBe(true);
        }
      }
    }
  });

  it("has valid readiness impacts on all missions", () => {
    for (const mission of founderBetaDailyMissions) {
      expect(
        mission.readinessImpact.length,
        `${mission.id} has ${mission.readinessImpact.length} readinessImpact entries; expected >= 1`
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it("has hard gates that reference valid readiness rules", () => {
    const ruleIds = new Set(founderBetaReadinessRules.map((r) => r.id));

    for (const gateId of founderArchitectBetaRoadmapProjection.hardGateIds) {
      expect(
        ruleIds.has(gateId),
        `hard gate ${gateId} references unknown readiness rule`
      ).toBe(true);
    }

    for (const gateId of founderBetaPath.hardGateIds) {
      expect(
        ruleIds.has(gateId),
        `path hard gate ${gateId} references unknown readiness rule`
      ).toBe(true);
    }
  });

  it("has capability priority weights and readiness thresholds sorted by priority", () => {
    const sorted = [...founderBetaCapabilities].sort(
      (a, b) => b.priorityWeight - a.priorityWeight
    );

    expect(sorted.length).toBe(founderBetaCapabilities.length);

    for (let i = 1; i < sorted.length; i++) {
      expect(
        sorted[i - 1].priorityWeight >= sorted[i].priorityWeight,
        `capabilities not sorted by priorityWeight: ${sorted[i - 1].id}(${sorted[i - 1].priorityWeight}) vs ${sorted[i].id}(${sorted[i].priorityWeight})`
      ).toBe(true);
    }
  });
});
