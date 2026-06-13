import { contentRegistry } from "./content-registry";
import { founderBetaSourceCatalog } from "@/data/founder-beta";
import { discoverySeeds } from "@/data/discovery-seeds";
import type { CoverageGap, GapAnalysisResult } from "@/types/content-registry";
import type { DiscoverySeed } from "@/data/discovery-seeds/system-design-seeds";

export type GapCategory =
  | "low-source-topics"
  | "weak-skills"
  | "weak-capabilities"
  | "missing-interview-coverage"
  | "missing-proof-coverage"
  | "underrepresented-domains";

export type RankedGap = {
  gap: CoverageGap;
  category: GapCategory;
  rankScore: number;
};

export type GapSeedMatch = {
  seed: DiscoverySeed;
  matchedGaps: CoverageGap[];
  matchReasons: string[];
  matchScore: number;
  bestFitCapabilityId: string | null;
  bestFitSkillId: string | null;
  domain: string;
};

export type GapDrivenImportPlanEntry = {
  seedId: string;
  title: string;
  url: string;
  proposedSourceId: string;
  proposedTopicId: string;
  gapReason: string;
  matchedGapIds: string[];
  priority: "high" | "medium" | "low";
};

export type GapDrivenImportPlan = {
  planId: string;
  generatedAt: string;
  totalGapsFound: number;
  totalSeedsEvaluated: number;
  highPriorityCandidates: GapDrivenImportPlanEntry[];
  mediumPriorityCandidates: GapDrivenImportPlanEntry[];
  lowPriorityCandidates: GapDrivenImportPlanEntry[];
  deferredCandidates: GapDrivenImportPlanEntry[];
  uncoveredGaps: CoverageGap[];
};

export type GapDiscoverySummary = {
  totalGaps: number;
  byCategory: Record<string, number>;
  topGaps: string[];
  matchableCandidates: number;
  highPriorityCount: number;
  recommendedAction: string;
};

function categorizeGap(gap: CoverageGap): GapCategory {
  if (gap.type === "weakly-sourced") return "low-source-topics";
  if (gap.type === "low-topic-coverage") {
    if (gap.entityId.startsWith("cap-")) return "weak-capabilities";
    if (gap.entityId.startsWith("skill-")) return "weak-skills";
    return "weak-capabilities";
  }
  if (gap.type === "no-proof-types") return "missing-proof-coverage";
  if (gap.type === "low-confidence") return "weak-skills";
  return "weak-capabilities";
}

function isCandidateImported(seed: DiscoverySeed, existingSourceIds: Set<string>): boolean {
  if (!seed.proposedSourceId) return false;
  return existingSourceIds.has(seed.proposedSourceId);
}

function findBestFitCapability(seed: DiscoverySeed): string | null {
  const capabilityMap: Record<string, string[]> = {
    "aws": ["cap-aws-cloud-architecture"],
    "system-design": ["cap-system-design-hld", "cap-distributed-systems", "cap-low-level-design"],
    "backend": ["cap-node-backend", "cap-databases", "cap-security", "cap-reliability-observability"],
    "career": ["cap-career-assets", "cap-delivery-leadership", "cap-behavioral-communication", "cap-offer-readiness"],
  };

  const candidates = capabilityMap[seed.category] ?? [];
  if (candidates.length === 0) return null;

  const existingTags = seed.tags.map((t) => t.toLowerCase());
  const capKeywords: Record<string, string[]> = {
    "cap-aws-cloud-architecture": ["aws", "cloud", "serverless", "lambda", "ecs", "eventbridge", "sqs", "cloudwatch", "step-functions", "well-architected", "rds", "dynamodb", "s3"],
    "cap-system-design-hld": ["hld", "architecture", "scalability", "load-balancing", "microservices", "distributed", "availability", "high-availability"],
    "cap-low-level-design": ["lld", "api", "design", "contract", "aggregate", "ddd", "grpc", "openapi"],
    "cap-distributed-systems": ["distributed", "consistency", "messaging", "queues", "event", "streaming", "real-time"],
    "cap-node-backend": ["nodejs", "node", "backend", "api", "fastify", "grpc", "testing", "openapi"],
    "cap-databases": ["database", "postgres", "redis", "dynamodb", "sql", "nosql", "data-modeling", "caching"],
    "cap-security": ["security", "oauth", "authentication", "authorization", "threat"],
    "cap-reliability-observability": ["observability", "monitoring", "reliability", "cloudwatch", "diagnostics", "incident"],
    "cap-career-assets": ["career", "writing", "communication", "promotion", "interview", "resume", "mentoring"],
    "cap-delivery-leadership": ["leadership", "strategy", "delivery", "incident", "mentoring"],
    "cap-behavioral-communication": ["behavioral", "interview", "communication", "story", "leadership"],
    "cap-offer-readiness": ["offer", "negotiation", "application", "pipeline"],
  };

  let bestCap = candidates[0];
  let bestScore = 0;

  for (const capId of candidates) {
    const keywords = capKeywords[capId] ?? [];
    let score = 0;
    for (const tag of existingTags) {
      if (keywords.some((kw) => tag.includes(kw) || kw.includes(tag))) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCap = capId;
    }
  }

  return bestCap;
}

export class AutonomousCoverageGapDiscoveryService {
  detectAutonomousCoverageGaps(): GapAnalysisResult & { additionalGaps: CoverageGap[] } {
    const baseGaps = contentRegistry.detectGaps();
    const additionalGaps: CoverageGap[] = [];

    const categorySourceCounts: Record<string, number> = {};
    for (const source of founderBetaSourceCatalog) {
      categorySourceCounts[source.category] = (categorySourceCounts[source.category] ?? 0) + 1;
    }
    const lowSourceCategories = Object.entries(categorySourceCounts)
      .filter(([, c]) => c < 5)
      .map(([cat]) => cat);

    if (lowSourceCategories.length > 0) {
      additionalGaps.push({
        type: "low-topic-coverage",
        severity: "medium",
        entityId: "underrepresented-domains",
        entityName: "Underrepresented Source Categories",
        detail: `Categories with <5 sources: ${lowSourceCategories.join(", ")}`
      });
    }

    return { ...baseGaps, additionalGaps };
  }

  rankCoverageGaps(gaps: CoverageGap[]): RankedGap[] {
    const severityScore = { high: 3, medium: 2, low: 1 };
    const typeBonus: Record<string, number> = {
      "weakly-sourced": 2,
      "low-topic-coverage": 1,
      "low-confidence": 0,
      "no-proof-types": 1,
    };

    const ranked = gaps.map((gap) => {
      const category = categorizeGap(gap);
      const baseScore = severityScore[gap.severity] ?? 1;
      const bonus = typeBonus[gap.type] ?? 0;

      let activityBonus = 0;
      if (gap.entityId.startsWith("cap-")) activityBonus = 3;
      else if (gap.entityId.startsWith("skill-")) activityBonus = 1;

      return { gap, category, rankScore: baseScore * 10 + bonus + activityBonus };
    });

    return ranked.sort((a, b) => b.rankScore - a.rankScore);
  }

  matchSeedsToCoverageGaps(rankedGaps: RankedGap[]): GapSeedMatch[] {
    const existingSourceIds = new Set(founderBetaSourceCatalog.map((s) => s.id));
    const matches: GapSeedMatch[] = [];

    const unimportedSeeds = discoverySeeds.filter((s) => !isCandidateImported(s, existingSourceIds));

    for (const seed of unimportedSeeds) {
      if (!seed.proposedSourceId) continue;

      const matchedGaps: CoverageGap[] = [];
      const matchReasons: string[] = [];
      const seedTags = new Set(seed.tags.map((t) => t.toLowerCase()));

      for (const ranked of rankedGaps) {
        const gap = ranked.gap;
        const entityName = gap.entityName.toLowerCase();
        const entityId = gap.entityId.toLowerCase();

        let tagMatch = false;
        for (const tag of seedTags) {
          if (entityName.includes(tag) || entityId.includes(tag) || tag.includes(entityName)) {
            tagMatch = true;
            break;
          }
        }

        if (tagMatch) {
          matchedGaps.push(gap);
          matchReasons.push(`Tags match gap entity "${gap.entityName}" (${gap.type})`);
        }
      }

      const bestFitCapability = findBestFitCapability(seed);
      const tagScore = matchedGaps.length * 3;
      const capScore = bestFitCapability ? 2 : 0;
      const matchScore = tagScore + capScore;

      if (matchedGaps.length > 0 || matchScore > 0) {
        const domainMap: Record<string, string> = {
          "aws": "AWS / Cloud Architecture",
          "system-design": "System Design",
          "backend": "Backend Engineering",
          "career": "Career / Staff+ Engineering",
        };

        matches.push({
          seed,
          matchedGaps,
          matchReasons,
          matchScore,
          bestFitCapabilityId: bestFitCapability,
          bestFitSkillId: null,
          domain: domainMap[seed.category] ?? seed.category,
        });
      }
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  createGapDrivenImportPlan(seedMatches: GapSeedMatch[]): GapDrivenImportPlan {
    const highPriority: GapDrivenImportPlanEntry[] = [];
    const mediumPriority: GapDrivenImportPlanEntry[] = [];
    const lowPriority: GapDrivenImportPlanEntry[] = [];
    const deferred: GapDrivenImportPlanEntry[] = [];

    const allGaps = this.detectAutonomousCoverageGaps();
    const existingSourceIds = new Set(founderBetaSourceCatalog.map((s) => s.id));

    for (const match of seedMatches) {
      if (!match.seed.proposedSourceId || !match.seed.proposedTopicId) continue;

      const entry: GapDrivenImportPlanEntry = {
        seedId: match.seed.id,
        title: match.seed.title,
        url: match.seed.url,
        proposedSourceId: match.seed.proposedSourceId,
        proposedTopicId: match.seed.proposedTopicId,
        gapReason: match.matchReasons.join("; ") || "General domain coverage",
        matchedGapIds: match.matchedGaps.map((g) => g.entityId),
        priority: match.matchScore >= 8 ? "high" : match.matchScore >= 4 ? "medium" : "low",
      };

      if (existingSourceIds.has(match.seed.proposedSourceId)) {
        deferred.push({ ...entry, gapReason: "Already in catalog - deferred" });
      } else if (match.seed.sourceType === "book" && match.matchScore < 5) {
        deferred.push({ ...entry, gapReason: "Book source without strong gap match - deferred" });
      } else if (match.matchScore >= 8) {
        highPriority.push(entry);
      } else if (match.matchScore >= 4) {
        mediumPriority.push(entry);
      } else {
        lowPriority.push(entry);
      }
    }

    return {
      planId: "autonomous-gap-driven-wave-2",
      generatedAt: new Date().toISOString(),
      totalGapsFound: allGaps.gaps.length + allGaps.additionalGaps.length,
      totalSeedsEvaluated: seedMatches.length,
      highPriorityCandidates: highPriority,
      mediumPriorityCandidates: mediumPriority,
      lowPriorityCandidates: lowPriority,
      deferredCandidates: deferred,
      uncoveredGaps: allGaps.gaps.filter((g) =>
        !highPriority.some((e) => e.matchedGapIds.includes(g.entityId)) &&
        !mediumPriority.some((e) => e.matchedGapIds.includes(g.entityId))
      ),
    };
  }

  summarizeGapDrivenPlan(plan: GapDrivenImportPlan): GapDiscoverySummary {
    const byCategory: Record<string, number> = {};
    const totalCandidates = plan.highPriorityCandidates.length + plan.mediumPriorityCandidates.length + plan.lowPriorityCandidates.length;
    byCategory["gap-driven"] = totalCandidates;

    const topGaps = plan.highPriorityCandidates
      .slice(0, 5)
      .map((e) => e.gapReason.split(";")[0]?.trim() ?? e.title);

    return {
      totalGaps: plan.totalGapsFound,
      byCategory,
      topGaps,
      matchableCandidates: plan.highPriorityCandidates.length + plan.mediumPriorityCandidates.length + plan.lowPriorityCandidates.length,
      highPriorityCount: plan.highPriorityCandidates.length,
      recommendedAction: plan.highPriorityCandidates.length > 0
        ? `Import ${plan.highPriorityCandidates.length} high-priority gap-driven candidates`
        : "No high-priority gap-driven candidates found",
    };
  }

  getSeedsForCategory(category: string): DiscoverySeed[] {
    return discoverySeeds.filter((s) => s.category === category);
  }
}

export const autonomousCoverageGapDiscovery = new AutonomousCoverageGapDiscoveryService();
