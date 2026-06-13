import type { SyllabusGap } from "@/types/gap-driven-ingestion";
import type { GapCluster, AdaptiveDiscoveryCandidate } from "@/types/adaptive-discovery";
import type { DiscoverySeed } from "@/data/discovery-seeds";
import { discoveryPacksByDomain } from "@/data/discovery-packs";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";

export function scoreAdaptiveSeed(
  seed: { title: string; tags: string[]; domain: string },
  gap: SyllabusGap,
  existingTopicIds: Set<string>,
  existingSourceIds: Set<string>
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const gapText = (gap.target.entityName + " " + gap.detail + " " + gap.reason).toLowerCase();
  const seedText = (seed.title + " " + seed.tags.join(" ")).toLowerCase();

  const gapWords = gapText.split(/\s+/);
  for (const word of seedText.split(/\s+/)) {
    if (word.length > 3 && gapWords.some((gw) => gw.includes(word) || word.includes(gw))) {
      score += 3;
    }
  }

  if (gapText.includes(seed.domain) || seed.domain === gap.category || seed.domain === "general") {
    score += 5;
    reasons.push(`Domain "${seed.domain}" matches gap context`);
  }

  if (seed.tags.some((tag) => gapText.includes(tag))) {
    score += 4;
    reasons.push("Seed tags overlap with gap description");
  }

  if (seed.title.split(/\s+/).some((word) => gap.target.entityName.toLowerCase().includes(word))) {
    score += 6;
    reasons.push("Seed title matches gap target entity");
  }

  if (gap.severity === "critical" || gap.severity === "high") {
    score += 3;
    reasons.push("Gap is high/critical priority");
  }

  return { score, reasons };
}

function deriveSourceId(title: string, url: string, prefix: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${prefix}-${slug}`;
}

function deriveTopicId(title: string, prefix: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `topic-${prefix}-${slug}`;
}

export function expandGapIntoDiscoveryCandidates(
  gap: SyllabusGap,
  existingTopicIds: Set<string>,
  existingSourceIds: Set<string>
): AdaptiveDiscoveryCandidate[] {
  const candidates: AdaptiveDiscoveryCandidate[] = [];
  const domain = gap.category || gap.target.entityId.split("-")[1] || "general";
  const pack = discoveryPacksByDomain[domain] || discoveryPacksByDomain["backend"];

  if (!pack) return [];

  const gapText = (gap.target.entityName + " " + gap.detail + " " + gap.reason).toLowerCase();

  for (const seed of pack.seeds) {
    if (existingSourceIds.has(seed.proposedSourceId)) continue;
    if (existingTopicIds.has(seed.proposedTopicId)) continue;

    const { score, reasons } = scoreAdaptiveSeed(
      { title: seed.title, tags: seed.tags, domain: seed.domain },
      gap,
      existingTopicIds,
      existingSourceIds
    );

    if (score >= 5) {
      candidates.push({
        id: `adaptive-${seed.seedId}`,
        clusterId: "",
        title: seed.title,
        url: seed.url,
        sourceType: seed.sourceType,
        category: pack.domain,
        tags: seed.tags,
        proposedSourceId: seed.proposedSourceId,
        proposedTopicId: seed.proposedTopicId,
        rationale: reasons.join("; ") || `Covers gap: ${gap.reason}`,
        confidenceScore: Math.min(Math.round((score / 30) * 100) / 100, 0.95),
        domain: pack.domain,
        matchReasons: reasons,
        reviewRequired: true,
      });
    }
  }

  return candidates.sort((a, b) => b.confidenceScore - a.confidenceScore);
}

export function generateAdaptiveDiscoverySeeds(
  gaps: SyllabusGap[],
  clusters: { clusterId: string; gapIds: string[] }[],
  importedSourceIds: Set<string>
): AdaptiveDiscoveryCandidate[] {
  const existingTopicIds = new Set(founderBetaMasterTopics.map((t) => t.id));
  const existingSourceIds = new Set([
    ...founderBetaSourceCatalog.map((s) => s.id),
    ...importedSourceIds,
  ]);

  const candidates: AdaptiveDiscoveryCandidate[] = [];
  const seenUrlKeys = new Set<string>();

  const prioritizedGaps = [...gaps].sort((a, b) => b.score - a.score);

  for (const gap of prioritizedGaps) {
    const gapCandidates = expandGapIntoDiscoveryCandidates(gap, existingTopicIds, existingSourceIds);

    for (const candidate of gapCandidates) {
      const urlKey = candidate.url.trim().replace(/\/+$/, "").toLowerCase();
      if (seenUrlKeys.has(urlKey)) continue;
      seenUrlKeys.add(urlKey);

      const matchedCluster = clusters.find((c) => c.gapIds.includes(gap.id));
      if (matchedCluster) {
        candidate.clusterId = matchedCluster.clusterId;
      }

      candidates.push(candidate);
    }
  }

  return candidates.sort((a, b) => b.confidenceScore - a.confidenceScore);
}

export function summarizeAdaptiveSeedExpansion(
  candidates: AdaptiveDiscoveryCandidate[],
  clusters: { id: string; label: string; gapCount: number }[]
): {
  totalCandidates: number;
  candidatesByDomain: Record<string, number>;
  avgConfidence: number;
  clustersUsed: number;
  clusterCoverage: { clusterLabel: string; candidateCount: number }[];
  warnings: string[];
} {
  const byDomain: Record<string, number> = {};
  let totalConfidence = 0;

  for (const c of candidates) {
    byDomain[c.domain] = (byDomain[c.domain] ?? 0) + 1;
    totalConfidence += c.confidenceScore;
  }

  const clusterCandidates = new Map<string, { label: string; count: number }>();
  for (const cluster of clusters) {
    const count = candidates.filter((c) => c.clusterId === cluster.id).length;
    if (count > 0) {
      clusterCandidates.set(cluster.id, { label: cluster.label, count });
    }
  }

  return {
    totalCandidates: candidates.length,
    candidatesByDomain: byDomain,
    avgConfidence: candidates.length > 0 ? Math.round((totalConfidence / candidates.length) * 100) / 100 : 0,
    clustersUsed: clusterCandidates.size,
    clusterCoverage: [...clusterCandidates.values()].map(({ label, count }) => ({
      clusterLabel: label,
      candidateCount: count,
    })),
    warnings: [
      "Adaptive seed expansion does not modify the graph.",
      "All candidates require human review before import.",
      candidates.length === 0 ? "No adaptive candidates generated. Consider expanding discovery packs." : "",
    ].filter(Boolean),
  };
}
