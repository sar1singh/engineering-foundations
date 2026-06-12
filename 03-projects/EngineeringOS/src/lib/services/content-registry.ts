import {
  founderBetaCapabilities,
  founderBetaMasterTopics,
  founderBetaSkills,
  founderBetaSourceCatalog
} from "@/data/founder-beta";
import type {
  ContentRegistry,
  CoverageSummary,
  CapabilityCoverage,
  SkillCoverage,
  CoverageGap,
  GapAnalysisResult,
  CoverageSummaryRow
} from "@/types/content-registry";

export class ContentRegistryService {
  buildRegistry(): ContentRegistry {
    const topicsByCapabilityId: Record<string, string[]> = {};
    const topicsBySkillId: Record<string, string[]> = {};
    const sourcesByTopicId: Record<string, string[]> = {};
    const sourcesByCapabilityId: Record<string, string[]> = {};
    const capabilitiesByCategory: Record<string, string[]> = {};

    for (const topic of founderBetaMasterTopics) {
      for (const cid of topic.capabilityIds) {
        if (!topicsByCapabilityId[cid]) topicsByCapabilityId[cid] = [];
        topicsByCapabilityId[cid].push(topic.id);
      }
      for (const sid of topic.skillIds) {
        if (!topicsBySkillId[sid]) topicsBySkillId[sid] = [];
        topicsBySkillId[sid].push(topic.id);
      }
      sourcesByTopicId[topic.id] = [...topic.sourceIds];
    }

    for (const cap of founderBetaCapabilities) {
      const topicIds = topicsByCapabilityId[cap.id] ?? [];
      const sourceIdSet = new Set<string>();
      for (const tid of topicIds) {
        const srcIds = sourcesByTopicId[tid] ?? [];
        for (const sid of srcIds) {
          sourceIdSet.add(sid);
        }
      }
      sourcesByCapabilityId[cap.id] = [...sourceIdSet];

      if (!capabilitiesByCategory[cap.category]) {
        capabilitiesByCategory[cap.category] = [];
      }
      capabilitiesByCategory[cap.category].push(cap.id);
    }

    return {
      topicsByCapabilityId,
      topicsBySkillId,
      sourcesByTopicId,
      sourcesByCapabilityId,
      capabilitiesByCategory,
      totalTopics: founderBetaMasterTopics.length,
      totalSources: founderBetaSourceCatalog.length,
      totalCapabilities: founderBetaCapabilities.length,
      totalSkills: founderBetaSkills.length
    };
  }

  computeCoverageSummary(): CoverageSummary {
    const registry = this.buildRegistry();
    const allTopicSourceIds = new Set(founderBetaMasterTopics.flatMap((t) => t.sourceIds));
    const allCatalogSourceIds = new Set(founderBetaSourceCatalog.map((s) => s.id));

    const byType: Record<string, number> = {};
    const byTier: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    for (const source of founderBetaSourceCatalog) {
      byType[source.sourceType] = (byType[source.sourceType] ?? 0) + 1;
      byTier[source.tier] = (byTier[source.tier] ?? 0) + 1;
      byCategory[source.category] = (byCategory[source.category] ?? 0) + 1;
    }

    const unusedSourceIds = [...allCatalogSourceIds].filter((sid) => !allTopicSourceIds.has(sid));

    const capabilityCoverage: CapabilityCoverage[] = founderBetaCapabilities.map((cap) => {
      const topicIds = registry.topicsByCapabilityId[cap.id] ?? [];
      const topics = topicIds.map((tid) => founderBetaMasterTopics.find((t) => t.id === tid)).filter(Boolean);
      const avgConf = topics.length > 0
        ? topics.reduce((sum, t) => sum + (t?.confidenceScore ?? 0), 0) / topics.length
        : 0;
      return {
        capabilityId: cap.id,
        capabilityName: cap.name,
        category: cap.category,
        topicCount: topicIds.length,
        skillCount: cap.skillIds.length,
        sourceCount: (registry.sourcesByCapabilityId[cap.id] ?? []).length,
        proofTypes: cap.proofTypes,
        averageConfidenceScore: Math.round(avgConf * 100) / 100
      };
    });

    const skillCoverage: SkillCoverage[] = founderBetaSkills.map((skill) => ({
      skillId: skill.id,
      skillName: skill.name,
      capabilityId: skill.capabilityId,
      topicCount: (registry.topicsBySkillId[skill.id] ?? []).length,
      proofTypes: skill.proofTypes
    }));

    const proofTypes: Record<string, number> = {};
    const proofByCapability: Record<string, string[]> = {};
    const proofByCategory: Record<string, string[]> = {};
    for (const topic of founderBetaMasterTopics) {
      for (const pt of topic.proofTypes) {
        proofTypes[pt] = (proofTypes[pt] ?? 0) + 1;
      }
      for (const cid of topic.capabilityIds) {
        if (!proofByCapability[cid]) proofByCapability[cid] = [];
        for (const pt of topic.proofTypes) {
          if (!proofByCapability[cid].includes(pt)) proofByCapability[cid].push(pt);
        }
      }
    }
    for (const cap of founderBetaCapabilities) {
      const cat = cap.category;
      if (!proofByCategory[cat]) proofByCategory[cat] = [];
      for (const pt of cap.proofTypes) {
        if (!proofByCategory[cat].includes(pt)) proofByCategory[cat].push(pt);
      }
    }

    const interviewImportance: Record<string, number> = {};
    for (const topic of founderBetaMasterTopics) {
      interviewImportance[topic.interviewImportance] = (interviewImportance[topic.interviewImportance] ?? 0) + 1;
    }

    return {
      capabilityCoverage,
      skillCoverage,
      sourceCoverage: { totalSources: founderBetaSourceCatalog.length, byType, byTier, byCategory: byCategory, unusedSourceIds },
      proofCoverage: { proofTypes, byCapability: proofByCapability, byCategory: proofByCategory },
      interviewCoverage: {
        interviewCategories: {},
        topicsWithInterviewImportance: interviewImportance
      }
    };
  }

  detectGaps(): GapAnalysisResult {
    const registry = this.buildRegistry();
    const gaps: CoverageGap[] = [];

    const weaklySourcedTopics: CoverageGap[] = [];
    const lowCoverageCapabilities: CoverageGap[] = [];
    const lowCoverageSkills: CoverageGap[] = [];
    const lowConfidenceTopics: CoverageGap[] = [];

    for (const topic of founderBetaMasterTopics) {
      const sourceCount = topic.sourceIds.length;

      if (sourceCount <= 1) {
        const gap: CoverageGap = {
          type: "weakly-sourced",
          severity: sourceCount === 0 ? "high" : "medium",
          entityId: topic.id,
          entityName: topic.name,
          detail: `Topic has ${sourceCount} source(s); at least 2 recommended`
        };
        gaps.push(gap);
        weaklySourcedTopics.push(gap);
      }

      if (topic.confidenceScore < 0.7) {
        const gap: CoverageGap = {
          type: "low-confidence",
          severity: topic.confidenceScore < 0.5 ? "high" : "medium",
          entityId: topic.id,
          entityName: topic.name,
          detail: `Topic confidence score is ${topic.confidenceScore}; recommended >= 0.7`
        };
        gaps.push(gap);
        lowConfidenceTopics.push(gap);
      }

      if (topic.proofTypes.length === 0) {
        const gap: CoverageGap = {
          type: "no-proof-types",
          severity: "high",
          entityId: topic.id,
          entityName: topic.name,
          detail: "Topic has no proof types defined"
        };
        gaps.push(gap);
      }
    }

    for (const cap of founderBetaCapabilities) {
      const topicCount = (registry.topicsByCapabilityId[cap.id] ?? []).length;
      if (topicCount < 3) {
        const gap: CoverageGap = {
          type: "low-topic-coverage",
          severity: topicCount === 0 ? "high" : "medium",
          entityId: cap.id,
          entityName: cap.name,
          detail: `Capability has ${topicCount} topic(s); recommended >= 3`
        };
        gaps.push(gap);
        lowCoverageCapabilities.push(gap);
      }
    }

    for (const skill of founderBetaSkills) {
      const topicCount = (registry.topicsBySkillId[skill.id] ?? []).length;
      if (topicCount < 2) {
        const gap: CoverageGap = {
          type: "low-topic-coverage",
          severity: topicCount === 0 ? "high" : "medium",
          entityId: skill.id,
          entityName: skill.name,
          detail: `Skill has ${topicCount} topic(s); recommended >= 2`
        };
        gaps.push(gap);
        lowCoverageSkills.push(gap);
      }
    }

    gaps.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

    return {
      gaps,
      weaklySourcedTopics,
      lowCoverageCapabilities,
      lowCoverageSkills,
      lowConfidenceTopics,
      totalGaps: gaps.length
    };
  }

  getCoverageSummaryRows(): CoverageSummaryRow[] {
    const registry = this.buildRegistry();
    const rows: CoverageSummaryRow[] = [];

    for (const cap of founderBetaCapabilities) {
      const topicIds = registry.topicsByCapabilityId[cap.id] ?? [];
      const topics = topicIds.map((tid) => founderBetaMasterTopics.find((t) => t.id === tid)).filter(Boolean);
      const avgConf = topics.length > 0
        ? Math.round(topics.reduce((sum, t) => sum + (t?.confidenceScore ?? 0), 0) / topics.length * 100) / 100
        : 0;
      rows.push({
        id: cap.id,
        name: cap.name,
        type: "capability",
        topics: topicIds.length,
        skills: cap.skillIds.length,
        sources: (registry.sourcesByCapabilityId[cap.id] ?? []).length,
        proofTypes: cap.proofTypes.length,
        confidence: avgConf
      });
    }

    for (const skill of founderBetaSkills) {
      rows.push({
        id: skill.id,
        name: skill.name,
        type: "skill",
        topics: (registry.topicsBySkillId[skill.id] ?? []).length,
        skills: 0,
        sources: 0,
        proofTypes: skill.proofTypes.length,
        confidence: 0
      });
    }

    return rows;
  }
}

export const contentRegistry = new ContentRegistryService();
