import type { SyllabusGap } from "@/types/gap-driven-ingestion";
import type { GapCluster, AdaptiveDiscoveryCandidate, ConfidenceScoreDetail, CoverageHeatmap, AdaptiveDiscoveryResult } from "@/types/adaptive-discovery";
import type { DiscoveryPack } from "@/types/adaptive-discovery";
import { discoverKnowledgeGraphGaps } from "./gap-driven-ingestion-engine";
import { clusterKnowledgeGraphGaps, prioritizeGapClusters } from "./gap-cluster-agent";
import { discoveryPacks, discoveryPacksByDomain } from "@/data/discovery-packs";
import { runMultiDomainAdaptiveDiscovery } from "./adaptive-domain-agent-runner";
import { generateCoverageHeatmap, summarizeCoverageHeatmap } from "./coverage-heatmap-service";
import { founderBetaSourceCatalog } from "@/data/founder-beta";

export function runAdaptiveDiscoveryPipeline(): AdaptiveDiscoveryResult {
  const gaps = discoverKnowledgeGraphGaps();
  const clusters = clusterKnowledgeGraphGaps(gaps);
  const prioritizedClusters = prioritizeGapClusters(clusters).map((pc) => pc.cluster);
  const importedSourceIds = new Set(founderBetaSourceCatalog.map((s) => s.id));
  const packs = discoveryPacks.map((pack) => ({
    domain: pack.domain,
    pack,
  }));

  const { allCandidates, allConfidenceScores } = runMultiDomainAdaptiveDiscovery(
    gaps,
    prioritizedClusters,
    packs,
    importedSourceIds
  );

  const coverage = generateCoverageHeatmap();
  const uncoveredGapIds = new Set(gaps.map((g) => g.id));
  for (const c of allCandidates) {
    const gapMatch = gaps.find((g) => c.matchReasons.some((r) => r.includes(g.id)));
    if (gapMatch) uncoveredGapIds.delete(gapMatch.id);
  }

  const packCounts: Record<string, number> = {};
  for (const c of allCandidates) {
    const pack = discoveryPacks.find((p) => p.seeds.some((s) => s.seedId === c.id.replace("adaptive-", "")));
    if (pack) {
      packCounts[pack.packId] = (packCounts[pack.packId] ?? 0) + 1;
    } else {
      packCounts["fallback"] = (packCounts["fallback"] ?? 0) + 1;
    }
  }

  return {
    candidates: allCandidates,
    clusters: prioritizedClusters,
    confidenceScores: allConfidenceScores,
    coverage,
    packUsage: packCounts,
    totalGapsConsidered: gaps.length,
    uncoveredGapCount: gaps.length - allCandidates.length,
    warnings: [
      "Adaptive discovery pipeline does not modify the graph.",
      "All candidates require human review before import.",
      "Coverage heatmap reflects current graph state and is read-only.",
    ],
  };
}

export function summarizeAdaptivePipeline(
  result: AdaptiveDiscoveryResult
): {
  totalGaps: number;
  totalClusters: number;
  totalCandidates: number;
  avgConfidence: number;
  overallCoverage: number;
  packUsageSummary: string[];
  topClusters: string[];
  topCandidates: string[];
  uncoveredGaps: number;
} {
  const avgConfidence = result.candidates.length > 0
    ? Math.round(
        result.candidates.reduce((sum, c) => sum + c.confidenceScore, 0) / result.candidates.length * 100
      ) / 100
    : 0;

  const packUsageSummary = Object.entries(result.packUsage)
    .sort((a, b) => b[1] - a[1])
    .map(([packId, count]) => `${packId.replace(/-/g, " ")}: ${count} candidates`);

  const coverageSummary = result.coverage
    ? summarizeCoverageHeatmap(result.coverage)
    : null;

  return {
    totalGaps: result.totalGapsConsidered,
    totalClusters: result.clusters.length,
    totalCandidates: result.candidates.length,
    avgConfidence,
    overallCoverage: coverageSummary?.overallCoveragePercent ?? 0,
    packUsageSummary,
    topClusters: result.clusters.slice(0, 5).map((c) => `${c.label} (${c.gapCount} gaps, score: ${c.avgSeverityScore})`),
    topCandidates: result.candidates.slice(0, 5).map((c) => `${c.title} (confidence: ${c.confidenceScore})`),
    uncoveredGaps: result.uncoveredGapCount,
  };
}
