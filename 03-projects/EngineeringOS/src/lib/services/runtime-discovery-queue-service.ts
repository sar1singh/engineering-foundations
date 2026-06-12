import type {
  RuntimeDiscoveryQueueItem,
  RuntimeDiscoveryQueueStatus,
  RuntimeDiscoveryBatchResult,
  RuntimeDiscoveryQueueSummary,
} from "@/types/runtime-discovery-queue";
import type { PipelineResult } from "@/types/runtime-sub-agent";
import type { ManualUrlSubmission } from "./manual-url-fetch-contracts";
import { runRuntimeSubAgentPipeline } from "./runtime-sub-agent-orchestrator";

const MAX_BATCH_SIZE = 5;

function randomId(): string {
  return `queue-${crypto.randomUUID().slice(0, 8)}`;
}

function now(): string {
  return new Date().toISOString();
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export type BatchValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateBatchInput(urls: string[]): BatchValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(urls) || urls.length === 0) {
    return { valid: false, errors: ["At least one URL is required"] };
  }

  if (urls.length > MAX_BATCH_SIZE) {
    errors.push(`Batch exceeds maximum of ${MAX_BATCH_SIZE} URLs (got ${urls.length})`);
  }

  const trimmed = urls.map((u) => u.trim());
  const seen = new Set<string>();
  for (let i = 0; i < trimmed.length; i++) {
    const u = trimmed[i];
    if (!u) {
      errors.push(`URL at index ${i} is empty`);
      continue;
    }
    if (!isValidUrl(u)) {
      errors.push(`URL at index ${i} is not a valid http(s) URL: ${u}`);
      continue;
    }
    const lower = u.toLowerCase();
    if (seen.has(lower)) {
      errors.push(`Duplicate URL at index ${i}: ${u}`);
    }
    seen.add(lower);
  }

  return { valid: errors.length === 0, errors };
}

export function createQueueFromUrls(
  urls: string[]
): RuntimeDiscoveryQueueItem[] {
  const trimmed = urls.map((u) => u.trim());
  const nowStr = now();
  return trimmed.map((url) => ({
    id: randomId(),
    url,
    status: "queued" as RuntimeDiscoveryQueueStatus,
    result: null,
    createdAt: nowStr,
    completedAt: null,
  }));
}

function determineStatus(result: PipelineResult): RuntimeDiscoveryQueueStatus {
  if (!result.success) {
    return "failed";
  }
  if (
    result.duplicate &&
    result.duplicate.duplicateInfo.isDuplicate
  ) {
    return "duplicate-risk";
  }
  return "review-required";
}

export function processQueueItem(
  item: RuntimeDiscoveryQueueItem,
  submittedBy: string,
  sourceType: string,
  consent: boolean
): RuntimeDiscoveryQueueItem {
  const submission: ManualUrlSubmission = {
    url: item.url,
    submittedBy,
    submittedAt: now(),
    sourceType: sourceType as ManualUrlSubmission["sourceType"],
    consent,
  };

  const result = runRuntimeSubAgentPipeline(submission);
  const status = determineStatus(result);

  return {
    ...item,
    status,
    result,
    completedAt: now(),
  };
}

export function processDiscoveryQueue(
  urls: string[],
  submittedBy: string,
  sourceType: string,
  consent: boolean
): RuntimeDiscoveryBatchResult {
  const validation = validateBatchInput(urls);
  if (!validation.valid) {
    return {
      success: false,
      items: [],
      errors: validation.errors,
      totalDurationMs: 0,
    };
  }

  const items = createQueueFromUrls(urls);
  const overallStartedAt = Date.now();
  const batchErrors: string[] = [];

  const processedItems: RuntimeDiscoveryQueueItem[] = items.map((item) => {
    const processed = processQueueItem(item, submittedBy, sourceType, consent);
    if (processed.result && !processed.result.success) {
      batchErrors.push(...processed.result.errors.map((e) => `[${item.url}] ${e}`));
    }
    return processed;
  });

  return {
    success: batchErrors.length === 0,
    items: processedItems,
    errors: batchErrors,
    totalDurationMs: Date.now() - overallStartedAt,
  };
}

export function summarizeQueue(
  items: RuntimeDiscoveryQueueItem[]
): RuntimeDiscoveryQueueSummary {
  let completed = 0;
  let failed = 0;
  let reviewRequired = 0;
  let duplicateRisk = 0;
  let running = 0;
  let queued = 0;

  for (const item of items) {
    switch (item.status) {
      case "completed":
        completed++;
        break;
      case "failed":
        failed++;
        break;
      case "review-required":
        reviewRequired++;
        break;
      case "duplicate-risk":
        duplicateRisk++;
        break;
      case "running":
        running++;
        break;
      case "queued":
        queued++;
        break;
    }
  }

  return {
    total: items.length,
    completed,
    failed,
    reviewRequired,
    duplicateRisk,
    running,
    queued,
  };
}

export function resetQueueItem(
  item: RuntimeDiscoveryQueueItem
): RuntimeDiscoveryQueueItem {
  return {
    ...item,
    status: "queued",
    result: null,
    completedAt: null,
  };
}
