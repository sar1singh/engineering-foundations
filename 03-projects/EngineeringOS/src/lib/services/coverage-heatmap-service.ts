import type { CoverageHeatmap, CoverageHeatmapEntry } from "@/types/adaptive-discovery";
import type { ReadinessDimension } from "@/types/founder-beta";
import { founderBetaCapabilities, founderBetaSkills } from "@/data/founder-beta/capabilities";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";
import { founderBetaDailyMissions } from "@/data/founder-beta/daily-missions";
import { discoverKnowledgeGraphGaps } from "./gap-driven-ingestion-engine";

export function computeCapabilityCoverage(): CoverageHeatmapEntry[] {
  const gaps = discoverKnowledgeGraphGaps();
  const capGaps = new Set(
    gaps.filter((g) => g.target.entityType === "capability").map((g) => g.target.entityId)
  );

  return founderBetaCapabilities.map((cap) => {
    const skillCount = cap.skillIds.length;
    return {
      label: cap.name,
      currentCount: skillCount,
      targetCount: Math.max(skillCount, 3),
      coveragePercent: Math.min(Math.round((skillCount / Math.max(skillCount, 3)) * 100), 100),
      gapCount: capGaps.has(cap.id) ? 1 : 0,
      items: cap.skillIds.map((sid) => ({
        id: sid,
        name: sid,
        covered: !capGaps.has(cap.id),
        gap: capGaps.has(cap.id) ? "weak-capability-coverage" : undefined,
      })),
    };
  });
}

export function computeSkillCoverage(): CoverageHeatmapEntry[] {
  const gaps = discoverKnowledgeGraphGaps();
  const skillGaps = new Set(
    gaps.filter((g) => g.target.entityType === "skill").map((g) => g.target.entityId)
  );
  const topicIds = new Set(founderBetaMasterTopics.map((t) => t.id));

  return founderBetaSkills.map((skill) => {
    const topicCount = skill.topicIds.filter((tid) => topicIds.has(tid)).length;
    return {
      label: skill.name,
      currentCount: topicCount,
      targetCount: Math.max(topicCount, 2),
      coveragePercent: Math.min(Math.round((topicCount / Math.max(topicCount, 2)) * 100), 100),
      gapCount: skillGaps.has(skill.id) ? 1 : 0,
      items: skill.topicIds.map((tid) => {
        const topic = founderBetaMasterTopics.find((t) => t.id === tid);
        return {
          id: tid,
          name: topic?.name ?? tid,
          covered: !skillGaps.has(skill.id),
          gap: skillGaps.has(skill.id) ? "weak-skill-coverage" : undefined,
        };
      }),
    };
  });
}

export function computeSourceDiversityCoverage(): CoverageHeatmapEntry[] {
  const topics = founderBetaMasterTopics;

  return topics.slice(0, 30).map((topic) => {
    const typeSet = new Set<string>();
    for (const sid of topic.sourceIds) {
      const src = founderBetaSourceCatalog.find((s) => s.id === sid);
      if (src) typeSet.add(src.sourceType);
    }
    return {
      label: topic.name,
      currentCount: typeSet.size,
      targetCount: 2,
      coveragePercent: Math.min(Math.round((typeSet.size / 2) * 100), 100),
      gapCount: typeSet.size < 2 ? 1 : 0,
      items: topic.sourceIds.map((sid) => {
        const src = founderBetaSourceCatalog.find((s) => s.id === sid);
        return {
          id: sid,
          name: src?.title ?? sid,
          covered: typeSet.size >= 2,
          gap: typeSet.size < 2 ? "weak-source-diversity" : undefined,
        };
      }),
    };
  });
}

export function computeProofCoverage(): CoverageHeatmapEntry[] {
  const topics = founderBetaMasterTopics;

  return topics.slice(0, 30).map((topic) => {
    const proofTypes = topic.proofTypes;
    return {
      label: topic.name,
      currentCount: proofTypes.length,
      targetCount: Math.max(proofTypes.length, 2),
      coveragePercent: Math.min(Math.round((proofTypes.length / Math.max(proofTypes.length, 2)) * 100), 100),
      gapCount: proofTypes.length < 2 ? 1 : 0,
      items: proofTypes.map((pt) => ({
        id: pt,
        name: pt,
        covered: proofTypes.length >= 2,
        gap: proofTypes.length < 2 ? "missing-proof-path" : undefined,
      })),
    };
  });
}

export function computeMissionCoverage(): CoverageHeatmapEntry[] {
  const topics = founderBetaMasterTopics;
  const missions = founderBetaDailyMissions;
  const topicIdsWithMissions = new Set(
    missions.filter((m) => m.topicId).map((m) => m.topicId)
  );

  return topics.slice(0, 30).map((topic) => {
    const hasMission = topicIdsWithMissions.has(topic.id);
    return {
      label: topic.name,
      currentCount: hasMission ? 1 : 0,
      targetCount: 1,
      coveragePercent: hasMission ? 100 : 0,
      gapCount: hasMission ? 0 : 1,
      items: [
        {
          id: topic.id,
          name: topic.name,
          covered: hasMission,
          gap: hasMission ? undefined : "missing-mission-path",
        },
      ],
    };
  });
}

export function computeInterviewCoverage(): CoverageHeatmapEntry[] {
  const topics = founderBetaMasterTopics;

  return topics.filter((t) => t.interviewImportance === "high").slice(0, 30).map((topic) => {
    const isCovered = topic.confidenceScore >= 0.75 && topic.sourceIds.length >= 2;
    return {
      label: topic.name,
      currentCount: isCovered ? 1 : 0,
      targetCount: 1,
      coveragePercent: isCovered ? 100 : 0,
      gapCount: isCovered ? 0 : 1,
      items: [
        {
          id: topic.id,
          name: topic.name,
          covered: isCovered,
          gap: isCovered ? undefined : "weak-interview-coverage",
        },
      ],
    };
  });
}

export function computeReadinessCoverage(): CoverageHeatmapEntry[] {
  const expectedDimensions: ReadinessDimension[] = ["knowledge", "practice", "interview", "implementation"];
  const topics = founderBetaMasterTopics;

  return topics.slice(0, 30).map((topic) => {
    const dimensions = new Set(topic.readinessMetrics);
    const missingCount = expectedDimensions.filter((d) => !dimensions.has(d)).length;
    return {
      label: topic.name,
      currentCount: expectedDimensions.length - missingCount,
      targetCount: 4,
      coveragePercent: Math.round(((expectedDimensions.length - missingCount) / 4) * 100),
      gapCount: missingCount,
      items: expectedDimensions.map((dim) => ({
        id: dim,
        name: dim,
        covered: dimensions.has(dim),
        gap: dimensions.has(dim) ? undefined : "weak-readiness-coverage",
      })),
    };
  });
}

export function generateCoverageHeatmap(): CoverageHeatmap {
  const capabilityCoverage = computeCapabilityCoverage();
  const skillCoverage = computeSkillCoverage();
  const sourceDiversity = computeSourceDiversityCoverage();
  const proofCoverage = computeProofCoverage();
  const missionCoverage = computeMissionCoverage();
  const interviewCoverage = computeInterviewCoverage();
  const readinessCoverage = computeReadinessCoverage();

  const allEntries = [
    ...capabilityCoverage,
    ...skillCoverage,
    ...sourceDiversity,
    ...proofCoverage,
    ...missionCoverage,
    ...interviewCoverage,
    ...readinessCoverage,
  ];

  const totalPercent = allEntries.reduce((sum, e) => sum + e.coveragePercent, 0);
  const overallCoveragePercent = allEntries.length > 0
    ? Math.round(totalPercent / allEntries.length)
    : 0;

  return {
    capabilityCoverage,
    skillCoverage,
    sourceDiversity,
    proofCoverage,
    missionCoverage,
    interviewCoverage,
    readinessCoverage,
    generatedAt: new Date().toISOString(),
    totalTopics: founderBetaMasterTopics.length,
    totalSources: founderBetaSourceCatalog.length,
    overallCoveragePercent,
  };
}

export function summarizeCoverageHeatmap(heatmap: CoverageHeatmap): {
  overallCoveragePercent: number;
  totalEntries: number;
  totalGaps: number;
  weakestAreas: { label: string; coveragePercent: number; type: string }[];
  strongestAreas: { label: string; coveragePercent: number; type: string }[];
} {
  const allEntries: { label: string; coveragePercent: number; type: string; gapCount: number }[] = [
    ...heatmap.capabilityCoverage.map((e) => ({ ...e, type: "capability" })),
    ...heatmap.skillCoverage.map((e) => ({ ...e, type: "skill" })),
    ...heatmap.sourceDiversity.map((e) => ({ ...e, type: "source-diversity" })),
    ...heatmap.proofCoverage.map((e) => ({ ...e, type: "proof" })),
    ...heatmap.missionCoverage.map((e) => ({ ...e, type: "mission" })),
    ...heatmap.interviewCoverage.map((e) => ({ ...e, type: "interview" })),
    ...heatmap.readinessCoverage.map((e) => ({ ...e, type: "readiness" })),
  ];

  const sortedByCoverage = [...allEntries].sort((a, b) => a.coveragePercent - b.coveragePercent);
  const totalGaps = allEntries.reduce((sum, e) => sum + e.gapCount, 0);

  return {
    overallCoveragePercent: heatmap.overallCoveragePercent,
    totalEntries: allEntries.length,
    totalGaps,
    weakestAreas: sortedByCoverage.slice(0, 5).map((e) => ({
      label: e.label,
      coveragePercent: e.coveragePercent,
      type: e.type,
    })),
    strongestAreas: sortedByCoverage.slice(-5).reverse().map((e) => ({
      label: e.label,
      coveragePercent: e.coveragePercent,
      type: e.type,
    })),
  };
}
