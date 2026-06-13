import {
  founderBetaCapabilities,
  founderBetaMasterTopics as founderBetaMasterTopicsData,
  founderBetaSkills,
  founderBetaSourceCatalog,
  founderBetaDailyMissions,
} from "@/data/founder-beta";
import type { DiscoverySeed } from "@/data/discovery-seeds/system-design-seeds";
import type { SyllabusGap, SyllabusGapSeverity, GapDrivenCandidate, GapDrivenIngestionPlan, GapSubAgentTrace, GapSubAgentResult } from "@/types/gap-driven-ingestion";

import { detectCoverageGaps } from "./gap-agents/coverage-gap-agent";
import { detectSourceDiversityGaps } from "./gap-agents/source-diversity-agent";
import { detectProofCoverageGaps } from "./gap-agents/proof-coverage-agent";
import { detectMissionCoverageGaps } from "./gap-agents/mission-coverage-agent";
import { detectInterviewCoverageGaps } from "./gap-agents/interview-coverage-agent";
import { detectReadinessCoverageGaps } from "./gap-agents/readiness-coverage-agent";

export function runGapSubAgents(): {
  results: GapSubAgentResult[];
  traces: GapSubAgentTrace[];
  allGaps: SyllabusGap[];
} {
  const topics = [...founderBetaMasterTopicsData];
  const skills = [...founderBetaSkills];
  const capabilities = [...founderBetaCapabilities];
  const sources = [...founderBetaSourceCatalog];
  const missions = [...founderBetaDailyMissions];

  const results: GapSubAgentResult[] = [
    detectCoverageGaps(topics, skills, capabilities),
    detectSourceDiversityGaps(topics, sources),
    detectProofCoverageGaps(topics, capabilities),
    detectMissionCoverageGaps(topics, skills, capabilities, missions),
    detectInterviewCoverageGaps(topics),
    detectReadinessCoverageGaps(topics),
  ];

  return {
    results,
    traces: results.map((r) => r.trace),
    allGaps: results.flatMap((r) => r.gaps),
  };
}

export function discoverKnowledgeGraphGaps(): SyllabusGap[] {
  return runGapSubAgents().allGaps;
}

export function scoreKnowledgeGraphGap(gap: SyllabusGap): number {
  const severityWeight: Record<SyllabusGapSeverity, number> = {
    critical: 10,
    high: 8,
    medium: 5,
    low: 2,
  };
  const typePriority: Record<string, number> = {
    "weak-capability-coverage": 3,
    "weak-skill-coverage": 2,
    "no-source-topic": 3,
    "low-source-topic": 2,
    "missing-proof-path": 1,
    "weak-interview-coverage": 2,
    "missing-mission-path": 1,
    "weak-readiness-coverage": 1,
    "weak-source-diversity": 1,
    "stale-or-low-confidence-topic": 2,
  };
  return (severityWeight[gap.severity] ?? 5) * 10 + (typePriority[gap.type] ?? 1) * 5;
}

export function prioritizeKnowledgeGraphGaps(
  gaps: SyllabusGap[]
): { gap: SyllabusGap; priorityScore: number }[] {
  return gaps
    .map((gap) => ({ gap, priorityScore: scoreKnowledgeGraphGap(gap) }))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

export function routeGapToDiscoveryAgent(gap: SyllabusGap): string {
  const name = gap.target.entityName.toLowerCase();
  const id = gap.target.entityId.toLowerCase();

  if (name.includes("aws") || id.includes("cap-aws") || gap.category === "aws") return "AWS Discovery Agent";
  if (name.includes("system") || name.includes("hld") || name.includes("architecture") || gap.category === "system-design" || id.includes("cap-system-design")) return "System Design Discovery Agent";
  if (name.includes("backend") || name.includes("node") || name.includes("database") || gap.category === "backend" || id.includes("cap-node") || id.includes("cap-database")) return "Backend Discovery Agent";
  if (name.includes("career") || name.includes("behavioral") || name.includes("leadership") || gap.category === "career" || id.includes("cap-career") || id.includes("cap-behavioral")) return "Career Discovery Agent";
  if (name.includes("security") || id.includes("cap-security")) return "Security Discovery Agent (Backend fallback)";

  return "Backend Discovery Agent";
}

export function matchSeedsToGap(
  gap: SyllabusGap,
  seeds: DiscoverySeed[],
  importedSourceIds: Set<string>
): { seed: DiscoverySeed; matchScore: number; matchReasons: string[] }[] {
  const matches: { seed: DiscoverySeed; matchScore: number; matchReasons: string[] }[] = [];
  const gapKeywords = (gap.target.entityName + " " + gap.detail + " " + gap.reason).toLowerCase().split(/\s+/);

  for (const seed of seeds) {
    if (seed.proposedSourceId && importedSourceIds.has(seed.proposedSourceId)) continue;

    const seedTags = seed.tags.map((t) => t.toLowerCase());
    const seedTitle = seed.title.toLowerCase();
    let score = 0;
    const reasons: string[] = [];

    for (const tag of seedTags) {
      if (gapKeywords.some((kw) => kw.includes(tag) || tag.includes(kw))) {
        score += 5;
        reasons.push(`Seed tag "${tag}" matches gap`);
      }
    }

    if (gapKeywords.some((kw) => seedTitle.includes(kw) || kw.includes(seedTitle))) {
      score += 8;
      reasons.push("Seed title overlaps with gap context");
    }

    if (seed.category === "aws" && (gap.target.entityId.includes("aws") || gap.target.entityName.toLowerCase().includes("aws"))) {
      score += 10;
      reasons.push("Seed category AWS matches gap domain");
    }
    if (seed.category === "system-design" && (gap.target.entityId.includes("design") || gap.target.entityName.toLowerCase().includes("architecture") || gap.target.entityName.toLowerCase().includes("system"))) {
      score += 10;
      reasons.push("Seed category System Design matches gap domain");
    }
    if (seed.category === "backend" && (gap.target.entityId.includes("node") || gap.target.entityName.toLowerCase().includes("backend") || gap.target.entityName.toLowerCase().includes("database"))) {
      score += 10;
      reasons.push("Seed category Backend matches gap domain");
    }
    if (seed.category === "career" && (gap.target.entityId.includes("career") || gap.target.entityName.toLowerCase().includes("behavioral") || gap.target.entityName.toLowerCase().includes("leadership"))) {
      score += 10;
      reasons.push("Seed category Career matches gap domain");
    }

    if (score >= 5) {
      matches.push({ seed, matchScore: score, matchReasons: reasons });
    }
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

export function buildGapDrivenIngestionPlan(
  prioritizedGaps: { gap: SyllabusGap; priorityScore: number }[],
  seeds: DiscoverySeed[],
  importedSourceIds: Set<string>
): GapDrivenIngestionPlan {
  const candidates: GapDrivenCandidate[] = [];
  const matchedGapIds = new Set<string>();
  let candidateCounter = 0;

  for (const { gap } of prioritizedGaps) {
    const matches = matchSeedsToGap(gap, seeds, importedSourceIds);
    const topMatch = matches[0];
    if (topMatch && topMatch.matchScore >= 5) {
      const agent = routeGapToDiscoveryAgent(gap);
      matchedGapIds.add(gap.id);
      candidates.push({
        candidateId: `candidate-${candidateCounter++}`,
        gapId: gap.id,
        seedId: topMatch.seed.id,
        title: topMatch.seed.title,
        url: topMatch.seed.url,
        sourceType: topMatch.seed.sourceType,
        category: topMatch.seed.category,
        tags: topMatch.seed.tags,
        matchScore: topMatch.matchScore,
        matchReasons: topMatch.matchReasons,
        proposedSourceId: topMatch.seed.proposedSourceId ?? `source-${topMatch.seed.id}`,
        proposedTopicId: topMatch.seed.proposedTopicId ?? `topic-${topMatch.seed.id}`,
        reviewRequired: true,
        recommendedAgent: agent,
      });
    }
  }

  const highPriority = candidates.filter((c) => c.matchScore >= 15);
  const mediumPriority = candidates.filter((c) => c.matchScore >= 10 && c.matchScore < 15);
  const lowPriority = candidates.filter((c) => c.matchScore < 10);

  const uncoveredGaps = prioritizedGaps
    .filter(({ gap }) => !matchedGapIds.has(gap.id))
    .map(({ gap }) => gap);

  const gapsByType: Record<string, number> = {};
  const gapsBySeverity: Record<string, number> = {};
  for (const { gap } of prioritizedGaps) {
    gapsByType[gap.type] = (gapsByType[gap.type] ?? 0) + 1;
    gapsBySeverity[gap.severity] = (gapsBySeverity[gap.severity] ?? 0) + 1;
  }

  const candidateByCategory: Record<string, number> = {};
  for (const c of candidates) {
    candidateByCategory[c.category] = (candidateByCategory[c.category] ?? 0) + 1;
  }

  const { traces } = runGapSubAgents();

  return {
    planId: `gap-driven-plan-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    totalGaps: prioritizedGaps.length,
    totalCandidates: candidates.length,
    gapsByType,
    gapsBySeverity,
    candidateByCategory,
    highPriorityCandidates: highPriority,
    mediumPriorityCandidates: mediumPriority,
    lowPriorityCandidates: lowPriority,
    uncoveredGaps,
    trace: traces,
  };
}

export function summarizeGapDrivenPlan(
  plan: GapDrivenIngestionPlan
): {
  totalGaps: number;
  totalCandidates: number;
  highPriorityCount: number;
  topGapTypes: string[];
  topAgentNeeds: string[];
  uncoveredGapCount: number;
  recommendedAction: string;
} {
  const topGapTypes = Object.entries(plan.gapsByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, count]) => `${type} (${count})`);

  const agentCounts: Record<string, number> = {};
  for (const c of [...plan.highPriorityCandidates, ...plan.mediumPriorityCandidates, ...plan.lowPriorityCandidates]) {
    agentCounts[c.recommendedAgent] = (agentCounts[c.recommendedAgent] ?? 0) + 1;
  }
  const topAgentNeeds = Object.entries(agentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([agent, count]) => `${agent} (${count})`);

  return {
    totalGaps: plan.totalGaps,
    totalCandidates: plan.totalCandidates,
    highPriorityCount: plan.highPriorityCandidates.length,
    topGapTypes,
    topAgentNeeds,
    uncoveredGapCount: plan.uncoveredGaps.length,
    recommendedAction: plan.highPriorityCandidates.length > 0
      ? `Generate import plan for ${plan.highPriorityCandidates.length} high-priority gap-driven candidates`
      : "No high-priority candidates found. Review gap coverage and seed availability.",
  };
}
