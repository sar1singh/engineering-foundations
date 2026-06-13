import type { DiscoverySeed } from "@/data/discovery-seeds";
import type { AutonomousDiscoveryCandidate } from "@/lib/services/autonomous-discovery-agent";

export type MultiSourceDiscoveryAgentType =
  | "aws-discovery-agent"
  | "system-design-discovery-agent"
  | "backend-discovery-agent"
  | "career-discovery-agent";

export type MultiSourceDiscoveryAgentInput = {
  agentType: MultiSourceDiscoveryAgentType;
  submittedBy?: string;
  limit?: number;
};

export type MultiSourceDiscoveryTrace = {
  agentType: MultiSourceDiscoveryAgentType;
  startedAt: string;
  completedAt: string;
  elapsedMs: number;
  seedCount: number;
  candidateCount: number;
  reviewRequiredCount: number;
  duplicateRiskCount: number;
  graphWrites: 0;
  warnings: string[];
};

export type MultiSourceDiscoveryAgentResult = {
  agentType: MultiSourceDiscoveryAgentType;
  seeds: DiscoverySeed[];
  candidates: AutonomousDiscoveryCandidate[];
  trace: MultiSourceDiscoveryTrace;
  warnings: string[];
};

export type MultiSourceDuplicateWarning = {
  normalizedUrl: string;
  agentTypes: MultiSourceDiscoveryAgentType[];
  seedIds: string[];
  titles: string[];
};

export type MultiSourceDiscoverySummary = {
  selectedAgents: MultiSourceDiscoveryAgentType[];
  totalSeeds: number;
  totalCandidates: number;
  reviewRequired: number;
  duplicateRisk: number;
  failed: number;
  crossAgentDuplicateWarnings: number;
  graphWrites: 0;
  publishActions: 0;
};
