import type { SyllabusGap } from "@/types/gap-driven-ingestion";
import type { GapCluster, GapClusterCategory } from "@/types/adaptive-discovery";

const CLUSTER_DEFINITIONS: Record<GapClusterCategory, { label: string; domain: string; keywords: string[]; primaryGapType: string; recommendation: string }> = {
  observability: {
    label: "Observability",
    domain: "system-design",
    keywords: ["observability", "monitoring", "logging", "tracing", "metrics", "cloudwatch", "opentelemetry"],
    primaryGapType: "low-source-topic",
    recommendation: "Add sources for observability topics (logging, metrics, tracing, CloudWatch).",
  },
  "distributed-systems": {
    label: "Distributed Systems",
    domain: "system-design",
    keywords: ["distributed", "consistency", "replication", "partition", "consensus", "cap-theorem"],
    primaryGapType: "weak-skill-coverage",
    recommendation: "Expand distributed systems skill and topic coverage with additional sources.",
  },
  "aws-networking": {
    label: "AWS Networking",
    domain: "aws",
    keywords: ["vpc", "networking", "subnet", "dns", "route53", "direct-connect", "vpn"],
    primaryGapType: "low-source-topic",
    recommendation: "Add AWS networking sources (VPC, Route53, Direct Connect, VPN).",
  },
  reliability: {
    label: "Reliability & Resilience",
    domain: "system-design",
    keywords: ["reliability", "resilience", "circuit-breaker", "bulkhead", "retry", "timeout", "high-avail", "availability"],
    primaryGapType: "missing-proof-path",
    recommendation: "Add proof types and mission coverage for reliability patterns.",
  },
  "security-hardening": {
    label: "Security Hardening",
    domain: "backend",
    keywords: ["security", "oauth", "authentication", "authorization", "encryption", "vulnerability", "threat"],
    primaryGapType: "low-source-topic",
    recommendation: "Expand security topic sources and proof paths.",
  },
  "interview-readiness": {
    label: "Interview Readiness",
    domain: "career",
    keywords: ["interview", "behavioral", "leadership", "communication", "story", "offer"],
    primaryGapType: "weak-interview-coverage",
    recommendation: "Add interview preparation sources and practice missions.",
  },
  "proof-gaps": {
    label: "Proof Type Gaps",
    domain: "general",
    keywords: [],
    primaryGapType: "missing-proof-path",
    recommendation: "Add missing proof types to topics and capabilities.",
  },
  "backend-depth": {
    label: "Backend Depth",
    domain: "backend",
    keywords: ["backend", "node", "api", "database", "cache", "queue", "grpc", "rest"],
    primaryGapType: "low-source-topic",
    recommendation: "Add backend-depth sources for weakly-covered topics.",
  },
  "system-design-depth": {
    label: "System Design Depth",
    domain: "system-design",
    keywords: ["architecture", "hld", "design", "pattern", "microservice", "event", "cqrs"],
    primaryGapType: "low-source-topic",
    recommendation: "Add system design resources for weakly-covered architecture topics.",
  },
  "career-growth": {
    label: "Career Growth",
    domain: "career",
    keywords: ["career", "promotion", "staff", "principal", "leadership", "mentor", "influence"],
    primaryGapType: "missing-mission-path",
    recommendation: "Add career growth missions and sources for staff/principal topics.",
  },
  "mission-coverage": {
    label: "Mission Coverage",
    domain: "general",
    keywords: [],
    primaryGapType: "missing-mission-path",
    recommendation: "Add daily missions for topics missing mission coverage.",
  },
  "source-diversity": {
    label: "Source Diversity",
    domain: "general",
    keywords: [],
    primaryGapType: "weak-source-diversity",
    recommendation: "Add diverse source types (blogs, books, official docs) for single-source-type topics.",
  },
};

function classifyGapToCluster(gap: SyllabusGap): GapClusterCategory | null {
  const text = (gap.target.entityName + " " + gap.detail + " " + gap.reason).toLowerCase();

  for (const [category, def] of Object.entries(CLUSTER_DEFINITIONS)) {
    if (gap.type === def.primaryGapType && def.keywords.length > 0) {
      if (def.keywords.some((kw) => text.includes(kw))) {
        return category as GapClusterCategory;
      }
    }
  }

  if (gap.type === "missing-proof-path") return "proof-gaps";
  if (gap.type === "missing-mission-path") return "mission-coverage";
  if (gap.type === "weak-source-diversity") return "source-diversity";
  if (gap.type === "weak-interview-coverage") return "interview-readiness";

  const domain = gap.category || gap.target.entityId.split("-")[1] || "";
  if (domain.includes("aws")) return "aws-networking";
  if (domain.includes("node") || domain.includes("backend")) return "backend-depth";
  if (domain.includes("design") || domain.includes("arch")) return "system-design-depth";
  if (domain.includes("career") || domain.includes("behavioral")) return "career-growth";

  return null;
}

export function clusterKnowledgeGraphGaps(gaps: SyllabusGap[]): GapCluster[] {
  const clusterMap = new Map<GapClusterCategory, { gapIds: string[]; scores: number[] }>();

  for (const gap of gaps) {
    const category = classifyGapToCluster(gap);
    if (!category) continue;
    if (!clusterMap.has(category)) {
      clusterMap.set(category, { gapIds: [], scores: [] });
    }
    const cluster = clusterMap.get(category)!;
    cluster.gapIds.push(gap.id);
    cluster.scores.push(gap.score);
  }

  return [...clusterMap.entries()]
    .filter(([, data]) => data.gapIds.length > 0)
    .map(([category, data]) => {
      const def = CLUSTER_DEFINITIONS[category];
      const avgScore = data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length;
      return {
        id: `cluster-${category}`,
        category,
        label: def.label,
        gapIds: [...data.gapIds],
        gapCount: data.gapIds.length,
        avgSeverityScore: Math.round(avgScore * 10) / 10,
        domain: def.domain,
        primaryGapType: def.primaryGapType,
        recommendation: def.recommendation,
      };
    })
    .sort((a, b) => b.avgSeverityScore - a.avgSeverityScore);
}

export function scoreGapCluster(cluster: GapCluster): number {
  let score = cluster.avgSeverityScore;
  score += cluster.gapCount * 2;
  if (cluster.domain !== "general") score += 5;
  return Math.round(score);
}

export function prioritizeGapClusters(clusters: GapCluster[]): { cluster: GapCluster; priorityScore: number }[] {
  return clusters
    .map((cluster) => ({ cluster, priorityScore: scoreGapCluster(cluster) }))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}
