import type { RawContentCandidate } from "@/types/content-ingestion";
import type { ManualUrlSubmission, FetchValidationResult } from "@/lib/services/manual-url-fetch-contracts";
import type { CatalogDuplicateInfo } from "@/lib/services/manual-url-candidate-bridge";

export type DiscoveryAgentStep =
  | "validate-url"
  | "fetch"
  | "extract-metadata"
  | "generate-candidate"
  | "duplicate-detection"
  | "prepare-review";

export type DiscoveryAgentStatus = "running" | "completed" | "failed";

export type DiscoveryAgentTrace = {
  traceId: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  status: DiscoveryAgentStatus;
  steps: DiscoveryAgentTraceStep[];
};

export type DiscoveryAgentTraceStep = {
  step: DiscoveryAgentStep;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  status: "completed" | "failed";
  details: string;
  warnings: string[];
  errors: string[];
};

export type DiscoveryMetadata = {
  title: string;
  description: string;
  keywords: string[];
  contentType: string;
  url: string;
  domain: string;
};

export type DiscoveryCandidateResult = {
  candidate: RawContentCandidate;
  duplicateInfo: CatalogDuplicateInfo;
  metadata: DiscoveryMetadata;
  validation: FetchValidationResult;
  trace: DiscoveryAgentTrace;
  humanApprovalRequired: boolean;
};

export type DiscoveryAgentInput = ManualUrlSubmission;

export type DiscoveryAgentOutput = {
  success: boolean;
  result: DiscoveryCandidateResult | null;
  errors: string[];
  warnings: string[];
  trace: DiscoveryAgentTrace | null;
};
