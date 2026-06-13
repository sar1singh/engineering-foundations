import type { SyllabusGap } from "@/types/gap-driven-ingestion";
import type { GapCluster, AdaptiveDiscoveryCandidate, ConfidenceScoreDetail } from "@/types/adaptive-discovery";
import type { DiscoveryPack } from "@/types/adaptive-discovery";
import { generateAdaptiveDiscoverySeeds, summarizeAdaptiveSeedExpansion } from "./dynamic-seed-expansion-service";
import { computeConfidenceScore } from "./discovery-confidence-service";

export type AdaptiveAgentTrace = {
  agentType: string;
  domain: string;
  startedAt: string;
  completedAt: string;
  elapsedMs: number;
  gapsConsidered: number;
  candidatesGenerated: number;
  avgConfidence: number;
  packUsed: string;
  graphWrites: 0;
  warnings: string[];
};

export type AdaptiveAgentResult = {
  agentType: string;
  domain: string;
  candidates: AdaptiveDiscoveryCandidate[];
  confidenceScores: Record<string, ConfidenceScoreDetail>;
  trace: AdaptiveAgentTrace;
  warnings: string[];
};

export function runAdaptiveDomainAgent(
  agentType: string,
  domain: string,
  gaps: SyllabusGap[],
  clusters: GapCluster[],
  pack: DiscoveryPack | null,
  importedSourceIds: Set<string>
): AdaptiveAgentResult {
  const startedAt = new Date().toISOString();
  const domainGaps = gaps.filter(
    (g) => g.category === domain || g.target.entityId.includes(domain) || domain === "general"
  );
  const domainClusters = clusters.filter((c) => c.domain === domain || domain === "general");
  const clusterRefs = domainClusters.map((c) => ({ clusterId: c.id, gapIds: c.gapIds }));

  const candidates = generateAdaptiveDiscoverySeeds(domainGaps, clusterRefs, importedSourceIds);
  const confidenceScores: Record<string, ConfidenceScoreDetail> = {};

  for (const candidate of candidates) {
    const gap = domainGaps.find((g) => candidate.matchReasons.some((r) => r.includes(g.id)) || candidate.tags.some((t) => g.target.entityName.toLowerCase().includes(t))) || null;
    confidenceScores[candidate.id] = computeConfidenceScore(
      candidate.title,
      candidate.url,
      candidate.sourceType,
      candidate.tags,
      candidate.domain,
      gap
    );
  }

  const summary = summarizeAdaptiveSeedExpansion(candidates, clusters.map((c) => ({ id: c.id, label: c.label, gapCount: c.gapCount })));
  const completedAt = new Date().toISOString();

  return {
    agentType,
    domain,
    candidates,
    confidenceScores,
    trace: {
      agentType,
      domain,
      startedAt,
      completedAt,
      elapsedMs: 1,
      gapsConsidered: domainGaps.length,
      candidatesGenerated: candidates.length,
      avgConfidence: summary.avgConfidence,
      packUsed: pack?.packId ?? "none",
      graphWrites: 0,
      warnings: [
        `${agentType} is adaptive — uses gap clusters and discovery packs.`,
        "No graph writes, no autonomous approval, no persistence.",
        candidates.length === 0 ? "No candidates generated. Gaps may lack matching pack seeds." : "",
      ].filter(Boolean),
    },
    warnings: [
      "Adaptive domain agents do not modify the graph.",
      "All candidates require human review before import.",
    ],
  };
}

export function runMultiDomainAdaptiveDiscovery(
  gaps: SyllabusGap[],
  clusters: GapCluster[],
  packs: { domain: string; pack: DiscoveryPack | null }[],
  importedSourceIds: Set<string>
): {
  results: AdaptiveAgentResult[];
  allCandidates: AdaptiveDiscoveryCandidate[];
  allConfidenceScores: Record<string, ConfidenceScoreDetail>;
  totalGapsConsidered: number;
} {
  const results: AdaptiveAgentResult[] = [];
  const allCandidates: AdaptiveDiscoveryCandidate[] = [];
  const allConfidenceScores: Record<string, ConfidenceScoreDetail> = {};
  const seenUrls = new Set<string>();

  for (const { domain, pack } of packs) {
    const agentType = `${domain}-adaptive-agent`;
    const result = runAdaptiveDomainAgent(agentType, domain, gaps, clusters, pack, importedSourceIds);

    for (const candidate of result.candidates) {
      const urlKey = candidate.url.trim().replace(/\/+$/, "").toLowerCase();
      if (seenUrls.has(urlKey)) continue;
      seenUrls.add(urlKey);
      allCandidates.push(candidate);
      if (result.confidenceScores[candidate.id]) {
        allConfidenceScores[candidate.id] = result.confidenceScores[candidate.id];
      }
    }

    results.push(result);
  }

  return {
    results,
    allCandidates: allCandidates.sort((a, b) => b.confidenceScore - a.confidenceScore),
    allConfidenceScores,
    totalGapsConsidered: gaps.length,
  };
}
