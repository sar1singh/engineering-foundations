import type { DiscoverySeed } from "@/data/discovery-seeds";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";
import type {
  MultiSourceDiscoveryAgentResult,
  MultiSourceDiscoveryAgentType,
} from "@/types/multi-source-discovery-agent";
import {
  buildDiscoverySummary,
  deduplicateDiscoveryCandidates,
  discoverCandidatesFromSeeds,
  runAutonomousDiscovery,
} from "../autonomous-discovery-agent";

export function runSeedBackedDiscoveryAgent(
  agentType: MultiSourceDiscoveryAgentType,
  seeds: DiscoverySeed[],
  submittedBy: string,
  limit?: number
): MultiSourceDiscoveryAgentResult {
  const startedAt = "2026-06-13T00:00:00.000Z";
  const beforeSources = founderBetaSourceCatalog.length;
  const beforeTopics = founderBetaMasterTopics.length;
  const selectedSeeds = deduplicateDiscoveryCandidates(
    discoverCandidatesFromSeeds([seeds[0]?.category ?? "system-design"], seeds).slice(0, limit ?? seeds.length)
  );
  const result = runAutonomousDiscovery({
    categories: selectedSeeds.length > 0 ? [selectedSeeds[0].category] : [],
    submittedBy,
    limit: selectedSeeds.length,
  });
  const selectedIds = new Set(selectedSeeds.map((seed) => seed.id));
  const candidates = result.candidates.filter((candidate) => selectedIds.has(candidate.seed.id));
  const summary = buildDiscoverySummary(candidates, selectedSeeds.map((seed) => seed.category), selectedSeeds.length);
  const graphMutated = founderBetaSourceCatalog.length !== beforeSources || founderBetaMasterTopics.length !== beforeTopics;

  return {
    agentType,
    seeds: selectedSeeds,
    candidates,
    trace: {
      agentType,
      startedAt,
      completedAt: "2026-06-13T00:00:00.001Z",
      elapsedMs: 1,
      seedCount: selectedSeeds.length,
      candidateCount: candidates.length,
      reviewRequiredCount: summary.reviewRequired,
      duplicateRiskCount: summary.duplicateRisk,
      graphWrites: 0,
      warnings: [
        `${agentType} is seed-backed and cannot publish, approve, or write graph data.`,
        ...(graphMutated ? ["Graph mutation detected during source discovery."] : []),
      ],
    },
    warnings: result.warnings,
  };
}
