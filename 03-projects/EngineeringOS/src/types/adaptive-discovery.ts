export type GapClusterCategory =
  | "observability"
  | "distributed-systems"
  | "aws-networking"
  | "reliability"
  | "security-hardening"
  | "interview-readiness"
  | "proof-gaps"
  | "backend-depth"
  | "system-design-depth"
  | "career-growth"
  | "mission-coverage"
  | "source-diversity";

export type GapCluster = {
  id: string;
  category: GapClusterCategory;
  label: string;
  gapIds: string[];
  gapCount: number;
  avgSeverityScore: number;
  domain: string;
  primaryGapType: string;
  recommendation: string;
};

export type AdaptiveDiscoveryCandidate = {
  id: string;
  clusterId: string;
  title: string;
  url: string;
  sourceType: string;
  category: string;
  tags: string[];
  proposedSourceId: string;
  proposedTopicId: string;
  rationale: string;
  confidenceScore: number;
  domain: string;
  matchReasons: string[];
  reviewRequired: true;
};

export type DiscoveryPackFamily = {
  familyId: string;
  name: string;
  description: string;
  sourceType: string;
  baseUrl: string;
  urlPatterns: string[];
};

export type DiscoveryPackEntry = {
  seedId: string;
  title: string;
  url: string;
  sourceType: string;
  tags: string[];
  proposedSourceId: string;
  proposedTopicId: string;
  expectedTopicName: string;
  domain: string;
};

export type DiscoveryPack = {
  packId: string;
  domain: string;
  families: DiscoveryPackFamily[];
  seeds: DiscoveryPackEntry[];
  domainPatterns: string[];
  topicHeuristics: string[];
  topicStructure: Record<string, string[]>;
};

export type ConfidenceScoreDetail = {
  graphFit: number;
  duplicateProbability: number;
  syllabusRelevance: number;
  sourceQuality: number;
  interviewValue: number;
  missionValue: number;
  readinessValue: number;
  normalizedScore: number;
};

export type CoverageHeatmapEntry = {
  label: string;
  currentCount: number;
  targetCount: number;
  coveragePercent: number;
  gapCount: number;
  items: { id: string; name: string; covered: boolean; gap?: string }[];
};

export type CoverageHeatmap = {
  capabilityCoverage: CoverageHeatmapEntry[];
  skillCoverage: CoverageHeatmapEntry[];
  sourceDiversity: CoverageHeatmapEntry[];
  proofCoverage: CoverageHeatmapEntry[];
  missionCoverage: CoverageHeatmapEntry[];
  interviewCoverage: CoverageHeatmapEntry[];
  readinessCoverage: CoverageHeatmapEntry[];
  generatedAt: string;
  totalTopics: number;
  totalSources: number;
  overallCoveragePercent: number;
};

export type AdaptiveDiscoveryResult = {
  candidates: AdaptiveDiscoveryCandidate[];
  clusters: GapCluster[];
  confidenceScores: Record<string, ConfidenceScoreDetail>;
  coverage: CoverageHeatmap | null;
  packUsage: Record<string, number>;
  totalGapsConsidered: number;
  uncoveredGapCount: number;
  warnings: string[];
};
