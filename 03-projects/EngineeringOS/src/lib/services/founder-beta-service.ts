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
import type { MissionType, SourceReference, SourceTier } from "@/types/founder-beta";

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

  getFounderBetaSkills() {
    return founderBetaSkills;
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

  getMissionsByTopicId(topicId: string) {
    return founderBetaDailyMissions.filter((mission) => mission.topicId === topicId);
  }

  getSkillById(id: string) {
    return founderBetaSkills.find((skill) => skill.id === id) ?? null;
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

  // ── Phase 6B: Resource / Source Navigation Helpers ──

  getTopicsForSource(sourceId: string) {
    return founderBetaMasterTopics.filter((topic) => topic.sourceIds.includes(sourceId));
  }

  getSourcesByCapability(capabilityId: string): SourceReference[] {
    const topicIds = founderBetaMasterTopics
      .filter((topic) => topic.capabilityIds.includes(capabilityId))
      .flatMap((topic) => topic.sourceIds);
    const uniqueSourceIds = [...new Set(topicIds)];
    return uniqueSourceIds
      .map((id) => founderBetaSourceCatalog.find((s) => s.id === id))
      .filter((s): s is SourceReference => s !== undefined);
  }

  getSourcesByCategory(category: string): SourceReference[] {
    return founderBetaSourceCatalog.filter((source) => source.category === category);
  }

  getHighPrioritySources(tier?: SourceTier): SourceReference[] {
    const targetTier = tier ?? "tier-1";
    return founderBetaSourceCatalog.filter((source) => source.tier === targetTier);
  }

  getSourceCategories(): string[] {
    return [...new Set(founderBetaSourceCatalog.map((s) => s.category))].sort();
  }

  getAllSources(): SourceReference[] {
    return founderBetaSourceCatalog;
  }
}

export const founderBetaService = new FounderBetaService();
