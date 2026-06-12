import type { FetchBoundary, ManualUrlFetchResult } from "./manual-url-fetch-contracts";
import type {
  DiscoveryAgentInput,
  DiscoveryAgentOutput,
  DiscoveryAgentTrace,
  DiscoveryAgentTraceStep,
  DiscoveryAgentStep,
  DiscoveryAgentStatus,
  DiscoveryMetadata,
} from "@/types/discovery-agent";
import { validateManualUrlInput, assertNoBulkCrawl, validateFetchBoundary, validateFetchOutput } from "./manual-url-fetch-validation";
import { dryRunManualUrlFetch, DEFAULT_FETCH_BOUNDARY } from "./manual-url-dry-run";
import { buildCandidateFromFetchResult, checkDuplicateInCatalog } from "./manual-url-candidate-bridge";
import { validateContentCandidate } from "./content-ingestion-contracts";

function now(): string {
  return new Date().toISOString();
}

function elapsedMs(start: string): number {
  return Math.max(0, Date.now() - new Date(start).getTime());
}

function makeTraceStep(
  step: DiscoveryAgentStep,
  startedAt: string,
  status: "completed" | "failed",
  details: string,
  warnings: string[] = [],
  errors: string[] = []
): DiscoveryAgentTraceStep {
  return {
    step,
    startedAt,
    completedAt: now(),
    durationMs: elapsedMs(startedAt),
    status,
    details,
    warnings,
    errors,
  };
}

function buildTrace(
  traceId: string,
  startedAt: string,
  status: DiscoveryAgentStatus,
  steps: DiscoveryAgentTraceStep[]
): DiscoveryAgentTrace {
  return {
    traceId,
    startedAt,
    completedAt: now(),
    durationMs: elapsedMs(startedAt),
    status,
    steps,
  };
}

function extractMetadata(
  fetchResult: ManualUrlFetchResult,
  url: string
): DiscoveryMetadata {
  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = "";
  }

  const rawMeta = fetchResult.extractedMetadata || {};
  const title = fetchResult.title || url;

  let description = "";
  if (typeof rawMeta.description === "string") {
    description = rawMeta.description;
  } else if (fetchResult.title) {
    description = `Content fetched from ${url}`;
  } else {
    description = `URL fetched: ${url}`;
  }

  const keywords: string[] = [];
  if (typeof rawMeta.keywords === "string") {
    keywords.push(...rawMeta.keywords.split(",").map((k: string) => k.trim()).filter(Boolean));
  } else if (Array.isArray(rawMeta.keywords)) {
    keywords.push(...rawMeta.keywords.map(String));
  }

  return {
    title,
    description,
    keywords,
    contentType: fetchResult.contentType || "unknown",
    url: fetchResult.finalUrl || url,
    domain,
  };
}

function prepareReviewItem(): { humanApprovalRequired: boolean } {
  return {
    humanApprovalRequired: true,
  };
}

export function runDiscoveryAgent(input: DiscoveryAgentInput, boundary: FetchBoundary = DEFAULT_FETCH_BOUNDARY): DiscoveryAgentOutput {
  const traceId = `disc-${crypto.randomUUID().slice(0, 8)}`;
  const startedAt = now();
  const steps: DiscoveryAgentTraceStep[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Step 1: Validate URL
  const step1Start = now();
  const inputVal = validateManualUrlInput(input);
  if (!inputVal.valid) {
    steps.push(makeTraceStep("validate-url", step1Start, "failed", `URL validation failed: ${inputVal.errors.join("; ")}`, inputVal.warnings, inputVal.errors));
    errors.push(...inputVal.errors);
    return { success: false, result: null, errors, warnings, trace: buildTrace(traceId, startedAt, "failed", steps) };
  }

  const bulkVal = assertNoBulkCrawl(input);
  if (!bulkVal.valid) {
    steps.push(makeTraceStep("validate-url", step1Start, "failed", `Bulk crawl check failed: ${bulkVal.errors.join("; ")}`, bulkVal.warnings, bulkVal.errors));
    errors.push(...bulkVal.errors);
    return { success: false, result: null, errors, warnings, trace: buildTrace(traceId, startedAt, "failed", steps) };
  }

  const boundaryVal = validateFetchBoundary(boundary, input);
  if (!boundaryVal.valid) {
    steps.push(makeTraceStep("validate-url", step1Start, "failed", `Boundary validation failed: ${boundaryVal.errors.join("; ")}`, boundaryVal.warnings, boundaryVal.errors));
    errors.push(...boundaryVal.errors);
    return { success: false, result: null, errors, warnings, trace: buildTrace(traceId, startedAt, "failed", steps) };
  }

  steps.push(makeTraceStep("validate-url", step1Start, "completed", "URL validation passed"));

  // Step 2: Run fetch (uses existing dry-run adapter — real fetch deferred)
  const step2Start = now();
  const { result: fetchResult, validation: fetchValidation } = dryRunManualUrlFetch(input, boundary);

  if (!fetchResult || fetchResult.fetchStatus !== "success") {
    const errMsg = fetchResult?.errors?.join("; ") || fetchValidation?.errors?.join("; ") || "Fetch failed";
    steps.push(makeTraceStep("fetch", step2Start, "failed", errMsg, fetchValidation?.warnings || [], fetchValidation?.errors || []));
    errors.push(errMsg);
    return { success: false, result: null, errors, warnings, trace: buildTrace(traceId, startedAt, "failed", steps) };
  }

  const fetchOutputVal = validateFetchOutput(fetchResult);
  if (!fetchOutputVal.valid) {
    steps.push(makeTraceStep("fetch", step2Start, "failed", `Fetch output validation failed: ${fetchOutputVal.errors.join("; ")}`, fetchOutputVal.warnings, fetchOutputVal.errors));
    errors.push(...fetchOutputVal.errors);
    return { success: false, result: null, errors, warnings, trace: buildTrace(traceId, startedAt, "failed", steps) };
  }

  steps.push(makeTraceStep("fetch", step2Start, "completed", "Fetch succeeded"));

  // Step 3: Extract metadata
  const step3Start = now();
  const metadata = extractMetadata(fetchResult, input.url);
  if (!metadata.title) {
    warnings.push("No title could be extracted from fetched content");
  }
  if (!metadata.description) {
    warnings.push("No description could be extracted from fetched content");
  }
  steps.push(makeTraceStep("extract-metadata", step3Start, "completed", `Extracted: title="${metadata.title}", domain="${metadata.domain}", contentType="${metadata.contentType}"`));

  // Step 4: Generate RawContentCandidate
  const step4Start = now();
  const submission = {
    url: input.url,
    submittedBy: input.submittedBy,
    sourceType: input.sourceType,
    capabilityId: input.intendedCapabilityId,
    skillId: input.intendedSkillId,
    topicId: input.intendedTopicId,
    notes: input.notes,
  };
  const candidate = buildCandidateFromFetchResult(fetchResult, submission);
  const candidateVal = validateContentCandidate(candidate);
  if (!candidateVal.valid) {
    steps.push(makeTraceStep("generate-candidate", step4Start, "failed", `Candidate validation failed: ${candidateVal.errors.join("; ")}`, candidateVal.warnings, candidateVal.errors));
    errors.push(...candidateVal.errors);
    return { success: false, result: null, errors, warnings, trace: buildTrace(traceId, startedAt, "failed", steps) };
  }

  steps.push(makeTraceStep("generate-candidate", step4Start, "completed", `Candidate generated: id="${candidate.id}", title="${candidate.title}"`));

  // Step 5: Duplicate detection
  const step5Start = now();
  const duplicateInfo = checkDuplicateInCatalog(candidate.url, candidate.title);
  if (duplicateInfo.isDuplicate) {
    warnings.push(`Duplicate detected: ${duplicateInfo.matches.length} match(es) in source catalog`);
  }
  steps.push(makeTraceStep("duplicate-detection", step5Start, "completed", duplicateInfo.isDuplicate ? `Duplicate risk: ${duplicateInfo.matches.length} match(es)` : "No duplicates detected"));

  // Step 6: Prepare review queue item
  const step6Start = now();
  const { humanApprovalRequired } = prepareReviewItem();
  steps.push(makeTraceStep("prepare-review", step6Start, "completed", `Review item ready: humanApprovalRequired=${humanApprovalRequired}`));

  const allWarnings = [...inputVal.warnings, ...boundaryVal.warnings, ...fetchOutputVal.warnings, ...candidateVal.warnings, ...warnings];

  return {
    success: true,
    result: {
      candidate,
      duplicateInfo,
      metadata,
      validation: inputVal,
      trace: buildTrace(traceId, startedAt, "completed", steps),
      humanApprovalRequired,
    },
    errors,
    warnings: allWarnings,
    trace: buildTrace(traceId, startedAt, "completed", steps),
  };
}
