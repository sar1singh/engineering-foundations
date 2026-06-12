import type { ManualUrlSubmission, FetchBoundary, ManualUrlFetchResult, FetchValidationResult } from "@/lib/services/manual-url-fetch-contracts";
import type { RawContentCandidate } from "@/types/content-ingestion";
import type { CatalogDuplicateInfo } from "@/lib/services/manual-url-candidate-bridge";
import type { DiscoveryMetadata } from "@/types/discovery-agent";

export type RuntimeSubAgentType =
  | "validation-agent"
  | "metadata-agent"
  | "candidate-agent"
  | "duplicate-agent"
  | "review-agent";

export type RuntimeSubAgentInput =
  | { agentType: "validation-agent"; submission: ManualUrlSubmission; boundary: FetchBoundary }
  | { agentType: "metadata-agent"; fetchResult: ManualUrlFetchResult; url: string }
  | { agentType: "candidate-agent"; fetchResult: ManualUrlFetchResult; submission: ManualUrlSubmission }
  | { agentType: "duplicate-agent"; candidate: RawContentCandidate }
  | { agentType: "review-agent"; candidate: RawContentCandidate; duplicateInfo: CatalogDuplicateInfo; metadata: DiscoveryMetadata };

export type ValidationAgentOutput = {
  agentType: "validation-agent";
  validation: FetchValidationResult;
  submission: ManualUrlSubmission;
};

export type MetadataAgentOutput = {
  agentType: "metadata-agent";
  metadata: DiscoveryMetadata;
};

export type CandidateAgentOutput = {
  agentType: "candidate-agent";
  candidate: RawContentCandidate;
  validation: { valid: boolean; errors: string[]; warnings: string[] };
};

export type DuplicateAgentOutput = {
  agentType: "duplicate-agent";
  duplicateInfo: CatalogDuplicateInfo;
};

export type ReviewAgentOutput = {
  agentType: "review-agent";
  humanApprovalRequired: boolean;
};

export type RuntimeSubAgentOutput =
  | ValidationAgentOutput
  | MetadataAgentOutput
  | CandidateAgentOutput
  | DuplicateAgentOutput
  | ReviewAgentOutput;

export type RuntimeSubAgentTrace = {
  agentType: RuntimeSubAgentType;
  startedAt: string;
  completedAt: string;
  elapsedMs: number;
  success: boolean;
  warnings: string[];
  errors: string[];
};

export type RuntimeSubAgentFailure = {
  agentType: RuntimeSubAgentType;
  errors: string[];
  warnings: string[];
  elapsedMs: number;
  step: number;
};

export type PipelineResult = {
  success: boolean;
  trace: RuntimeSubAgentTrace[];
  validation: ValidationAgentOutput | null;
  metadata: MetadataAgentOutput | null;
  candidate: CandidateAgentOutput | null;
  duplicate: DuplicateAgentOutput | null;
  review: ReviewAgentOutput | null;
  errors: string[];
  warnings: string[];
  startedAt: string;
  completedAt: string;
  durationMs: number;
};
