import type { PipelineResult } from "@/types/runtime-sub-agent";

export type RuntimeDiscoveryQueueStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "duplicate-risk"
  | "review-required";

export type RuntimeDiscoveryQueueItem = {
  id: string;
  url: string;
  status: RuntimeDiscoveryQueueStatus;
  result: PipelineResult | null;
  createdAt: string;
  completedAt: string | null;
};

export type RuntimeDiscoveryBatchRequest = {
  urls: string[];
  submittedBy: string;
  sourceType: string;
  consent: boolean;
};

export type RuntimeDiscoveryBatchResult = {
  success: boolean;
  items: RuntimeDiscoveryQueueItem[];
  errors: string[];
  totalDurationMs: number;
};

export type RuntimeDiscoveryQueueSummary = {
  total: number;
  completed: number;
  failed: number;
  reviewRequired: number;
  duplicateRisk: number;
  running: number;
  queued: number;
};
