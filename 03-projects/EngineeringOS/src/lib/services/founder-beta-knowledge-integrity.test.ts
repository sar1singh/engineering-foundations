import { describe, expect, it } from "vitest";
import {
  dsaProblemBank,
  founderArchitectBetaRoadmapProjection,
  founderBetaCapabilities,
  founderBetaDailyMissions,
  founderBetaMasterTopics,
  founderBetaPath,
  founderBetaReadinessRules,
  founderBetaSkills,
  founderBetaSourceCatalog,
  founderBetaTopicSourceMappings
} from "@/data/founder-beta";
import { validateAllProofTypes, proofRegistry, validProofTypes } from "./founder-beta-proof-registry";
import type {
  Capability,
  MasterTopic,
  ProofType,
  SourceReference,
  ReadinessDimension,
  MissionType
} from "@/types/founder-beta";

const validProofTypeSet = new Set<ProofType>(validProofTypes);

const validReadinessDimensions: ReadinessDimension[] = [
  "knowledge", "practice", "interview", "implementation"
];
const validReadinessDimensionSet = new Set<ReadinessDimension>(validReadinessDimensions);

const validMissionTypes: MissionType[] = [
  "learn", "practice", "implement", "interview", "behavioral",
  "career-asset", "revision", "weak-area-repair", "architecture-case-study"
];
const validMissionTypeSet = new Set<MissionType>(validMissionTypes);

const validInterviewImportance = new Set(["low", "medium", "high"]);
const validRoadmapPriority = new Set(["p0", "p1", "p2"]);
const validSourceTiers = new Set(["tier-1", "tier-2", "tier-3", "tier-4"]);
const validSourceReliabilities = new Set(["high", "medium", "low"]);
const validSourceTypes = new Set([
  "official-docs", "github-repository", "roadmap", "book",
  "interview-guide", "engineering-blog", "career-framework", "job-description",
  "security-guides"
]);

const expectUnique = (ids: string[]) => {
  expect(new Set(ids).size).toBe(ids.length);
};

const hasCircularPath = (
  nodeId: string,
  successors: (id: string) => string[],
  visited: Set<string>,
  path: Set<string>
): boolean => {
  if (path.has(nodeId)) return true;
  if (visited.has(nodeId)) return false;
  visited.add(nodeId);
  path.add(nodeId);
  for (const nextId of successors(nodeId)) {
    if (hasCircularPath(nextId, successors, visited, path)) return true;
  }
  path.delete(nodeId);
  return false;
};

describe("founder beta knowledge integrity", () => {
  const allTopics = founderBetaMasterTopics;
  const capabilityMap = new Map(founderBetaCapabilities.map((c) => [c.id, c]));
  const capabilityIds = new Set(founderBetaCapabilities.map((capability) => capability.id));
  const skillIds = new Set(founderBetaSkills.map((skill) => skill.id));
  const topicIds = new Set(allTopics.map((topic) => topic.id));
  const sourceIds = new Set(founderBetaSourceCatalog.map((source) => source.id));
  const missionIds = new Set(founderBetaDailyMissions.map((mission) => mission.id));
  const ruleIds = new Set(founderBetaReadinessRules.map((rule) => rule.id));
  const topicMap = new Map(allTopics.map((t) => [t.id, t]));

  it("keeps Founder Architect V2 static coverage within Phase 2A / Phase 6A ranges", () => {
    expect(founderBetaCapabilities.length).toBeGreaterThanOrEqual(10);
    expect(founderBetaCapabilities.length).toBeLessThanOrEqual(16);
    expect(founderBetaSkills.length).toBeGreaterThanOrEqual(40);
    expect(founderBetaSkills.length).toBeLessThanOrEqual(80);
    expect(founderBetaMasterTopics.length).toBeGreaterThanOrEqual(150);
    expect(founderBetaMasterTopics.length).toBeLessThanOrEqual(340);
    expect(allTopics.length).toBeGreaterThanOrEqual(150);
    expect(allTopics.length).toBeLessThanOrEqual(340);
    expect(founderBetaSourceCatalog.length).toBeGreaterThanOrEqual(140);
    expect(founderBetaDailyMissions.length).toBeGreaterThanOrEqual(10);
  });

  it("has globally unique IDs across the static knowledge primitives", () => {
    expectUnique(founderBetaCapabilities.map((capability) => capability.id));
    expectUnique(founderBetaSkills.map((skill) => skill.id));
    expectUnique(founderBetaMasterTopics.map((topic) => topic.id));
    expectUnique(dsaProblemBank.map((topic) => topic.id));
    expectUnique(founderBetaSourceCatalog.map((source) => source.id));
    expectUnique(founderBetaDailyMissions.map((mission) => mission.id));
  });

  it("keeps capability, skill, topic, source, and topic-source mappings consistent", () => {
    for (const capability of founderBetaCapabilities) {
      for (const skillId of capability.skillIds) {
        expect(skillIds.has(skillId), `${capability.id} references missing skill ${skillId}`).toBe(true);
      }

      for (const sourceId of capability.sourceIds) {
        expect(sourceIds.has(sourceId), `${capability.id} references missing source ${sourceId}`).toBe(true);
      }

      for (const dependencyId of capability.roadmapDependencies) {
        expect(capabilityIds.has(dependencyId), `${capability.id} references missing dependency ${dependencyId}`).toBe(true);
      }
    }

    for (const skill of founderBetaSkills) {
      expect(capabilityIds.has(skill.capabilityId), `${skill.id} references missing capability ${skill.capabilityId}`).toBe(true);

      for (const topicId of skill.topicIds) {
        expect(topicIds.has(topicId), `${skill.id} references missing topic ${topicId}`).toBe(true);
      }
    }

    for (const topic of allTopics) {
      for (const capabilityId of topic.capabilityIds) {
        expect(capabilityIds.has(capabilityId), `${topic.id} references missing capability ${capabilityId}`).toBe(true);
      }

      for (const skillId of topic.skillIds) {
        expect(skillIds.has(skillId), `${topic.id} references missing skill ${skillId}`).toBe(true);
      }

      for (const sourceId of topic.sourceIds) {
        expect(sourceIds.has(sourceId), `${topic.id} references missing source ${sourceId}`).toBe(true);
      }

      for (const relatedTopicId of [
        ...topic.prerequisiteTopicIds,
        ...topic.relatedTopicIds,
        ...topic.successorTopicIds,
        ...topic.alternativeTopicIds
      ]) {
        expect(topicIds.has(relatedTopicId), `${topic.id} references missing related topic ${relatedTopicId}`).toBe(true);
      }
    }

    for (const mapping of founderBetaTopicSourceMappings) {
      expect(topicIds.has(mapping.topicId), `mapping references missing topic ${mapping.topicId}`).toBe(true);

      for (const sourceId of mapping.sourceIds) {
        expect(sourceIds.has(sourceId), `${mapping.topicId} mapping references missing source ${sourceId}`).toBe(true);
      }
    }
  });

  it("keeps roadmap, path, mission, and hard-gate references resolvable", () => {
    for (const capabilityId of founderArchitectBetaRoadmapProjection.capabilityIds) {
      expect(capabilityIds.has(capabilityId), `roadmap references missing capability ${capabilityId}`).toBe(true);
    }

    for (const topicId of founderArchitectBetaRoadmapProjection.topicIds) {
      expect(topicIds.has(topicId), `roadmap references missing topic ${topicId}`).toBe(true);
    }

    for (const missionId of founderArchitectBetaRoadmapProjection.missionIds) {
      expect(missionIds.has(missionId), `roadmap references missing mission ${missionId}`).toBe(true);
    }

    for (const ruleId of founderArchitectBetaRoadmapProjection.hardGateIds) {
      expect(ruleIds.has(ruleId), `roadmap references missing hard gate ${ruleId}`).toBe(true);
    }

    for (const capabilityId of founderBetaPath.capabilityIds) {
      expect(capabilityIds.has(capabilityId), `path references missing capability ${capabilityId}`).toBe(true);
    }

    for (const topicId of founderBetaPath.caseStudyTopicIds) {
      expect(topicIds.has(topicId), `path references missing case study topic ${topicId}`).toBe(true);
    }
  });

  it("keeps mission proof requirements and prerequisites valid", () => {
    for (const mission of founderBetaDailyMissions) {
      expect(capabilityIds.has(mission.capabilityId), `${mission.id} references missing capability ${mission.capabilityId}`).toBe(true);
      expect(topicIds.has(mission.topicId), `${mission.id} references missing topic ${mission.topicId}`).toBe(true);

      for (const topicId of mission.prerequisiteTopicIds) {
        expect(topicIds.has(topicId), `${mission.id} references missing prerequisite ${topicId}`).toBe(true);
      }

      for (const proof of mission.proofRequirements) {
        expect(validProofTypeSet.has(proof.proofType), `${mission.id} has invalid proof type ${proof.proofType}`).toBe(true);
        expect(proof.requiredScore).toBeGreaterThanOrEqual(0);
        expect(proof.requiredScore).toBeLessThanOrEqual(5);
      }
    }
  });

  it("ensures every capability has at least one skill and every skill has at least one topic", () => {
    for (const cap of founderBetaCapabilities) {
      const capSkills = founderBetaSkills.filter((s) => s.capabilityId === cap.id);
      expect(
        capSkills.length,
        `${cap.id} has ${capSkills.length} skills; expected >= 1`
      ).toBeGreaterThanOrEqual(1);
    }

    for (const skill of founderBetaSkills) {
      expect(
        skill.topicIds.length,
        `${skill.id} has ${skill.topicIds.length} topics; expected >= 1`
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it("ensures every topic has at least one capability, one skill, one source, and one proof type", () => {
    for (const topic of allTopics) {
      expect(
        topic.capabilityIds.length,
        `${topic.id} has ${topic.capabilityIds.length} capabilityIds; expected >= 1`
      ).toBeGreaterThanOrEqual(1);

      expect(
        topic.skillIds.length,
        `${topic.id} has ${topic.skillIds.length} skillIds; expected >= 1`
      ).toBeGreaterThanOrEqual(1);

      expect(
        topic.sourceIds.length,
        `${topic.id} has ${topic.sourceIds.length} sourceIds; expected >= 1`
      ).toBeGreaterThanOrEqual(1);

      expect(
        topic.proofTypes.length,
        `${topic.id} has ${topic.proofTypes.length} proofTypes; expected >= 1`
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it("ensures every source is referenced by at least one topic", () => {
    const referencedSourceIds = new Set<string>();
    for (const topic of allTopics) {
      for (const sid of topic.sourceIds) {
        referencedSourceIds.add(sid);
      }
    }
    for (const sid of sourceIds) {
      expect(
        referencedSourceIds.has(sid),
        `source ${sid} is not referenced by any topic`
      ).toBe(true);
    }
  });

  it("has no circular prerequisite chains in topics", () => {
    const getPrereqs = (id: string): string[] => {
      const topic = topicMap.get(id);
      return topic ? topic.prerequisiteTopicIds : [];
    };

    for (const topic of allTopics) {
      const visited = new Set<string>();
      const path = new Set<string>();
      const hasCycle = hasCircularPath(topic.id, getPrereqs, visited, path);
      expect(hasCycle, `${topic.id} has a circular prerequisite chain: ${[...path].join(" -> ")}`).toBe(false);
    }
  });

  it("has no circular dependency chains in capability roadmapDependencies", () => {
    const getDeps = (id: string): string[] => {
      const cap = capabilityMap.get(id);
      return cap ? cap.roadmapDependencies : [];
    };

    for (const cap of founderBetaCapabilities) {
      const visited = new Set<string>();
      const path = new Set<string>();
      const hasCycle = hasCircularPath(cap.id, getDeps, visited, path);
      expect(hasCycle, `${cap.id} has a circular dependency chain: ${[...path].join(" -> ")}`).toBe(false);
    }
  });

  it("has valid proof types and readiness dimensions on every entity", () => {
    const validation = validateAllProofTypes();
    expect(validation.valid, validation.errors.join("; ")).toBe(true);

    for (const topic of allTopics) {
      for (const dim of topic.readinessMetrics) {
        expect(
          validReadinessDimensionSet.has(dim),
          `${topic.id} has invalid readiness dimension: ${dim}`
        ).toBe(true);
      }
    }
  });

  it("has valid mission types on all entities and valid interview/roadmap metadata", () => {
    for (const topic of allTopics) {
      for (const mt of topic.missionTypes) {
        expect(
          validMissionTypeSet.has(mt),
          `${topic.id} has invalid mission type: ${mt}`
        ).toBe(true);
      }

      expect(
        validInterviewImportance.has(topic.interviewImportance),
        `${topic.id} has invalid interviewImportance: ${topic.interviewImportance}`
      ).toBe(true);

      expect(
        validRoadmapPriority.has(topic.roadmapPriority),
        `${topic.id} has invalid roadmapPriority: ${topic.roadmapPriority}`
      ).toBe(true);
    }

    for (const cap of founderBetaCapabilities) {
      for (const mt of cap.missionTypes) {
        expect(
          validMissionTypeSet.has(mt),
          `${cap.id} has invalid mission type: ${mt}`
        ).toBe(true);
      }
    }
  });

  it("has valid confidence scores and positive estimated times on topics", () => {
    for (const topic of allTopics) {
      expect(
        topic.confidenceScore >= 0 && topic.confidenceScore <= 1,
        `${topic.id} confidenceScore ${topic.confidenceScore} not in [0, 1]`
      ).toBe(true);

      expect(
        topic.estimatedStudyMinutes > 0,
        `${topic.id} estimatedStudyMinutes ${topic.estimatedStudyMinutes} is not positive`
      ).toBe(true);

      expect(
        topic.estimatedPracticeMinutes > 0,
        `${topic.id} estimatedPracticeMinutes ${topic.estimatedPracticeMinutes} is not positive`
      ).toBe(true);
    }
  });

  it("has valid source metadata: URLs, tiers, reliability, and types", () => {
    for (const source of founderBetaSourceCatalog) {
      expect(
        source.url.startsWith("http"),
        `${source.id} url "${source.url}" does not start with http`
      ).toBe(true);

      expect(
        validSourceTiers.has(source.tier),
        `${source.id} has invalid tier: ${source.tier}`
      ).toBe(true);

      expect(
        validSourceReliabilities.has(source.reliability),
        `${source.id} has invalid reliability: ${source.reliability}`
      ).toBe(true);

      expect(
        validSourceTypes.has(source.sourceType),
        `${source.id} has invalid sourceType: ${source.sourceType}`
      ).toBe(true);
    }
  });

  it("meets Phase 6A per-category minimum source counts (DSA >= 20, AWS >= 15, HLD >= 15, LLD >= 10, Backend >= 12, Behavioral/Career >= 15)", () => {
    const categoryCounts: Record<string, number> = {};
    for (const source of founderBetaSourceCatalog) {
      const cat = source.category;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }

    const dsaCount = Object.entries(categoryCounts)
      .filter(([k]) => k === "DSA")
      .reduce((sum, [, v]) => sum + v, 0);
    expect(dsaCount, `DSA sources: ${dsaCount} >= 20`).toBeGreaterThanOrEqual(20);

    const awsCount = Object.entries(categoryCounts)
      .filter(([k]) => k.startsWith("AWS"))
      .reduce((sum, [, v]) => sum + v, 0);
    expect(awsCount, `AWS sources: ${awsCount} >= 15`).toBeGreaterThanOrEqual(15);

    const hldCount = Object.entries(categoryCounts)
      .filter(([k]) => k.includes("System Design") || k.includes("HLD"))
      .reduce((sum, [, v]) => sum + v, 0);
    expect(hldCount, `HLD sources: ${hldCount} >= 15`).toBeGreaterThanOrEqual(15);

    const lldCount = Object.entries(categoryCounts)
      .filter(([k]) => k.includes("LLD") || k.includes("Design Patterns"))
      .reduce((sum, [, v]) => sum + v, 0);
    expect(lldCount, `LLD sources: ${lldCount} >= 10`).toBeGreaterThanOrEqual(10);

    const backendCount = Object.entries(categoryCounts)
      .filter(([k]) => k === "Backend Engineering" || k.includes("Node.js") || k === "Databases")
      .reduce((sum, [, v]) => sum + v, 0);
    expect(backendCount, `Backend sources: ${backendCount} >= 12`).toBeGreaterThanOrEqual(12);

    const behavioralCareerCount = Object.entries(categoryCounts)
      .filter(([k]) => k.includes("Behavioral") || k.includes("Career") || k.includes("Resume") || k.includes("Negotiation") || k.includes("Compensation"))
      .reduce((sum, [, v]) => sum + v, 0);
    expect(behavioralCareerCount, `Behavioral/Career sources: ${behavioralCareerCount} >= 15`).toBeGreaterThanOrEqual(15);
  });

  it("has valid proof scores on all mission proof requirements", () => {
    for (const mission of founderBetaDailyMissions) {
      for (const proof of mission.proofRequirements) {
        expect(
          Number.isInteger(proof.requiredScore),
          `${mission.id} proof ${proof.id} requiredScore ${proof.requiredScore} is not an integer`
        ).toBe(true);
      }
    }
  });

  it("ensures all capability skills are listed in the capability's skillIds", () => {
    for (const cap of founderBetaCapabilities) {
      const capSkillIds = new Set(cap.skillIds);
      const skillsByParent = founderBetaSkills.filter((s) => s.capabilityId === cap.id);
      for (const skill of skillsByParent) {
        expect(
          capSkillIds.has(skill.id),
          `${cap.id} references skill ${skill.id} via capabilityId but skill is not in capability.skillIds`
        ).toBe(true);
      }
    }
  });

  it("has valid proof registry with topic counts and proof types", () => {
    expect(proofRegistry.length).toBe(founderBetaCapabilities.length);

    for (const entry of proofRegistry) {
      expect(entry.skills.length).toBeGreaterThanOrEqual(1);
      expect(entry.topicCount).toBeGreaterThanOrEqual(1);
      expect(entry.capabilityProofTypes.length).toBeGreaterThanOrEqual(1);

      for (const skill of entry.skills) {
        expect(skill.proofTypes.length).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
