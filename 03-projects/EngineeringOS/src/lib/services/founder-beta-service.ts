import {
  founderArchitectBetaRoadmapProjection,
  founderBetaCapabilities,
  founderBetaDailyMissions,
  founderBetaMasterTopics,
  founderBetaOfferReadinessSignals,
  founderBetaPath,
  founderBetaReadinessRules,
  founderBetaSkills,
  founderBetaSourceCatalog,
  founderBetaTopicSourceMappings
} from "@/data/founder-beta";
import type { MissionType } from "@/types/founder-beta";

export class FounderBetaService {
  getFounderBetaPath() {
    return founderBetaPath;
  }

  getFounderBetaCapabilities() {
    return founderBetaCapabilities;
  }

  getCapabilityById(id: string) {
    return founderBetaCapabilities.find((capability) => capability.id === id) ?? null;
  }

  getSkillsByCapabilityId(capabilityId: string) {
    return founderBetaSkills.filter((skill) => skill.capabilityId === capabilityId);
  }

  getFounderBetaTopics() {
    return founderBetaMasterTopics;
  }

  getTopicById(id: string) {
    return founderBetaMasterTopics.find((topic) => topic.id === id) ?? null;
  }

  getTopicsByCapabilityId(capabilityId: string) {
    return founderBetaMasterTopics.filter((topic) => topic.capabilityIds.includes(capabilityId));
  }

  getSourcesForTopic(topicId: string) {
    const mapping = founderBetaTopicSourceMappings.find((topicSourceMapping) => topicSourceMapping.topicId === topicId);

    if (!mapping) {
      return [];
    }

    return mapping.sourceIds
      .map((sourceId) => founderBetaSourceCatalog.find((source) => source.id === sourceId))
      .filter((source) => source !== undefined);
  }

  getFounderBetaRoadmapProjection() {
    return founderArchitectBetaRoadmapProjection;
  }

  getFounderBetaDailyMissions() {
    return founderBetaDailyMissions;
  }

  getMissionById(id: string) {
    return founderBetaDailyMissions.find((mission) => mission.id === id) ?? null;
  }

  getMissionsByType(type: MissionType) {
    return founderBetaDailyMissions.filter((mission) => mission.missionType === type);
  }

  getReadinessRules() {
    return founderBetaReadinessRules;
  }

  getHardGates() {
    return founderBetaReadinessRules.filter((rule) =>
      [
        "rule-architect-readiness",
        "rule-aws-readiness",
        "rule-behavioral-readiness",
        "rule-communication-readiness",
        "rule-resume-readiness",
        "rule-architecture-case-studies"
      ].includes(rule.id)
    );
  }

  getOfferReadinessSignals() {
    return founderBetaOfferReadinessSignals;
  }
}

export const founderBetaService = new FounderBetaService();
