export type IngestionSubAgentType =
  | "fetch"
  | "validate"
  | "bridge"
  | "duplicate-detection"
  | "prepare-review";

export type IngestionSubAgentStep = {
  type: IngestionSubAgentType;
  status: "completed" | "failed";
  label: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  details: string;
  hasError: boolean;
};

export type IngestionAgentResult = {
  traceId: string;
  status: "completed" | "failed";
  startedAt: string;
  completedAt: string;
  durationMs: number;
  steps: IngestionSubAgentStep[];
  fetchStatus: "success" | "error" | null;
  candidateValid: boolean;
  gateStatus: "pass" | "blocked";
  duplicateWarning: string;
  candidateId: string;
  candidateUrl: string;
  errors: string[];
  warnings: string[];
};

export type ReviewItem = {
  candidateUrl: string;
  candidateId: string;
  duplicateWarning: string;
  humanApprovalRequired: boolean;
};

export type IngestionPipelineResult = {
  traceId: string;
  status: "completed" | "failed";
  startedAt: string;
  completedAt: string;
  durationMs: number;
  steps: IngestionSubAgentStep[];
  fetchResult: unknown;
  fetchValidation: unknown;
  candidate: unknown;
  candidateValidation: unknown;
  duplicateInfo: unknown;
  reviewItem: ReviewItem | null;
  gateStatus: "pass" | "blocked";
  errors: string[];
  warnings: string[];
};
