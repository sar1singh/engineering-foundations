import type {
  RawContentCandidate,
  TopicMappingCandidate,
  ContentQualityReview,
  DuplicateRiskAssessment,
  NormalizedContentItem
} from "@/types/content-ingestion";
import type { ValidationResult } from "@/lib/services/content-ingestion-contracts";

export type AgentRunType =
  | "resource-discovery"
  | "topic-mapping"
  | "quality-review"
  | "duplicate-detection";

export type AgentRunStatus = "pending" | "running" | "completed" | "failed";

export type AgentRunTrace = {
  traceId: string;
  agentType: AgentRunType;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  steps: string[];
};

export type AgentRunRequest = {
  agentType: AgentRunType;
  topicHint?: string;
  sourceUrl?: string;
  categoryHint?: string;
};

export type AgentRunResult = {
  trace: AgentRunTrace;
  status: AgentRunStatus;
  boundaryResult: ValidationResult;
  gateStatus: "pass" | "blocked";
  output: AgentRunOutput;
};

export type AgentRunOutput = {
  candidates: RawContentCandidate[];
  topicMappings: TopicMappingCandidate[];
  reviews: ContentQualityReview[];
  duplicateAssessments: DuplicateRiskAssessment[];
  normalizedItems: NormalizedContentItem[];
  warnings: string[];
};

export type AgentRunnerConfig = {
  simulateLatencyMs: number;
  failOnMissingTopicHint: boolean;
};

export const DEFAULT_AGENT_RUNNER_CONFIG: AgentRunnerConfig = {
  simulateLatencyMs: 0,
  failOnMissingTopicHint: false
};
