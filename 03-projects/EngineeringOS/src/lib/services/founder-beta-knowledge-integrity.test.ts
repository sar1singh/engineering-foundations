import { describe, expect, it } from "vitest";
import {
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

const validProofTypes = new Set([
  "coding-solution",
  "hld",
  "lld",
  "architecture-review",
  "aws-design",
  "incident-analysis",
  "behavioral-answer",
  "resume-review",
  "github-project",
  "case-study"
]);

const expectUnique = (ids: string[]) => {
  expect(new Set(ids).size).toBe(ids.length);
};

describe("founder beta knowledge integrity", () => {
  const capabilityIds = new Set(founderBetaCapabilities.map((capability) => capability.id));
  const skillIds = new Set(founderBetaSkills.map((skill) => skill.id));
  const topicIds = new Set(founderBetaMasterTopics.map((topic) => topic.id));
  const sourceIds = new Set(founderBetaSourceCatalog.map((source) => source.id));
  const missionIds = new Set(founderBetaDailyMissions.map((mission) => mission.id));
  const ruleIds = new Set(founderBetaReadinessRules.map((rule) => rule.id));

  it("keeps Founder Architect V2 static coverage within locked Phase 1 ranges", () => {
    expect(founderBetaCapabilities.length).toBeGreaterThanOrEqual(10);
    expect(founderBetaCapabilities.length).toBeLessThanOrEqual(14);
    expect(founderBetaSkills.length).toBeGreaterThanOrEqual(25);
    expect(founderBetaMasterTopics.length).toBeGreaterThanOrEqual(60);
    expect(founderBetaMasterTopics.length).toBeLessThanOrEqual(100);
    expect(founderBetaSourceCatalog.length).toBeGreaterThanOrEqual(50);
    expect(founderBetaDailyMissions.length).toBeGreaterThanOrEqual(7);
  });

  it("has globally unique IDs across the static knowledge primitives", () => {
    expectUnique(founderBetaCapabilities.map((capability) => capability.id));
    expectUnique(founderBetaSkills.map((skill) => skill.id));
    expectUnique(founderBetaMasterTopics.map((topic) => topic.id));
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

    for (const topic of founderBetaMasterTopics) {
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
        expect(validProofTypes.has(proof.proofType), `${mission.id} has invalid proof type ${proof.proofType}`).toBe(true);
        expect(proof.requiredScore).toBeGreaterThanOrEqual(0);
        expect(proof.requiredScore).toBeLessThanOrEqual(5);
      }
    }
  });
});
