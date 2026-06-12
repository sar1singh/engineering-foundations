import type { IngestionSubAgentStep, IngestionSubAgentType, IngestionPipelineResult, ReviewItem } from "@/types/ingestion-agent";
import type { ContentSourceType, RawContentCandidate } from "@/types/content-ingestion";
import { dryRunManualUrlFetch, DEFAULT_FETCH_BOUNDARY } from "./manual-url-dry-run";
import type { ManualUrlSubmission, FetchBoundary, ManualUrlFetchResult, FetchValidationResult } from "./manual-url-fetch-contracts";
import { validateManualUrlInput, assertNoBulkCrawl, validateFetchBoundary, validateFetchOutput } from "./manual-url-fetch-validation";
import { buildCandidateFromFetchResult, checkDuplicateInCatalog, previewCandidateImport } from "./manual-url-candidate-bridge";
import type { CatalogDuplicateInfo, CatalogDuplicateMatch, CandidateImportPreview } from "./manual-url-candidate-bridge";
import { validateContentCandidate } from "./content-ingestion-contracts";
import type { ValidationResult } from "./content-ingestion-contracts";

function traceId(): string {
  return `pipe-${crypto.randomUUID().slice(0, 8)}`;
}

function nowISO(): string {
  return new Date().toISOString();
}

function elapsedMs(from: string, to: string): number {
  return Math.round(new Date(to).getTime() - new Date(from).getTime());
}

function makeStep(
  type: IngestionSubAgentType,
  label: string,
  startedAt: string,
  completedAt: string,
  details: string,
  hasError: boolean
): IngestionSubAgentStep {
  return {
    type,
    status: hasError ? "failed" : "completed",
    label,
    startedAt,
    completedAt,
    durationMs: elapsedMs(startedAt, completedAt),
    details,
    hasError,
  };
}

export function runFetchSubAgent(
  input: ManualUrlSubmission,
  boundary: FetchBoundary = DEFAULT_FETCH_BOUNDARY
): { result: ManualUrlFetchResult | null; validation: FetchValidationResult; step: IngestionSubAgentStep } {
  const start = nowISO();
  const { result, validation } = dryRunManualUrlFetch(input, boundary);
  const end = nowISO();
  return {
    result,
    validation,
    step: makeStep("fetch", "Fetch URL content", start, end,
      !result || !validation.valid
        ? `Fetch failed: ${validation.errors.join("; ")}`
        : `Fetched ${result.contentType || "unknown"} from ${result.finalUrl || input.url}`,
      !result || !validation.valid
    ),
  };
}

export function runValidationSubAgent(
  fetchResult: ManualUrlFetchResult
): { valid: boolean; errors: string[]; warnings: string[]; step: IngestionSubAgentStep } {
  const start = nowISO();
  const outVal = validateFetchOutput(fetchResult);
  const end = nowISO();
  return {
    valid: outVal.valid,
    errors: outVal.errors,
    warnings: outVal.warnings,
    step: makeStep("validate", "Validate fetch output", start, end,
      outVal.valid
        ? "Fetch output validated successfully"
        : `Validation failed: ${outVal.errors.join("; ")}`,
      !outVal.valid
    ),
  };
}

export function runCandidateBridgeSubAgent(
  fetchResult: ManualUrlFetchResult,
  submission: {
    url: string;
    submittedBy: string;
    sourceType: ContentSourceType;
    capabilityId?: string;
    skillId?: string;
    topicId?: string;
    notes?: string;
  }
): { candidate: RawContentCandidate | null; validation: ValidationResult | null; error: string | null; step: IngestionSubAgentStep } {
  const start = nowISO();
  try {
    const preview = previewCandidateImport(fetchResult, submission);
    const end = nowISO();
    return {
      candidate: preview.candidate,
      validation: preview.validation,
      error: preview.validation.valid ? null : preview.validation.errors.join("; "),
      step: makeStep("bridge", "Bridge to candidate catalog", start, end,
        preview.validation.valid
          ? `Candidate "${preview.candidate.title}" built successfully`
          : `Candidate validation failed: ${preview.validation.errors.join("; ")}`,
        !preview.validation.valid
      ),
    };
  } catch (e) {
    const end = nowISO();
    return {
      candidate: null,
      validation: null,
      error: String(e),
      step: makeStep("bridge", "Bridge to candidate catalog", start, end,
        `Bridge failed: ${e}`, true
      ),
    };
  }
}

export function runDuplicateDetectionSubAgent(
  candidate: RawContentCandidate
): { duplicateInfo: CatalogDuplicateInfo; step: IngestionSubAgentStep } {
  const start = nowISO();
  const duplicateInfo = checkDuplicateInCatalog(candidate.url, candidate.title);
  const end = nowISO();
  return {
    duplicateInfo,
    step: makeStep("duplicate-detection", "Detect catalog duplicates", start, end,
      duplicateInfo.isDuplicate
        ? `Found ${duplicateInfo.matches.length} duplicate match(es)`
        : "No duplicates detected",
      false
    ),
  };
}

export function runReviewPreparationSubAgent(
  candidate: RawContentCandidate,
  validation: ValidationResult,
  duplicateInfo: CatalogDuplicateInfo
): { reviewItem: ReviewItem; step: IngestionSubAgentStep } {
  const start = nowISO();
  const tagsEmpty = !candidate.tags || candidate.tags.length === 0;
  const confidenceLow = typeof candidate.estimatedConfidence !== "number" || candidate.estimatedConfidence < 0.4;
  const humanApprovalRequired = tagsEmpty || confidenceLow || duplicateInfo.isDuplicate;
  const duplicateWarning = duplicateInfo.isDuplicate
    ? `Matches ${duplicateInfo.matches.length} existing source(s)`
    : "";
  const end = nowISO();
  return {
    reviewItem: {
      candidateUrl: candidate.url,
      candidateId: candidate.id,
      duplicateWarning,
      humanApprovalRequired,
    },
    step: makeStep("prepare-review", "Prepare review queue entry", start, end,
      humanApprovalRequired
        ? "Human approval required — gate blocked"
        : "Gate passed — ready for review",
      false
    ),
  };
}

export function runSubAgentIngestionPipeline(
  input: {
    url: string;
    submittedBy: string;
    sourceType: ContentSourceType;
    capabilityId?: string;
    skillId?: string;
    topicId?: string;
    notes?: string;
  }
): IngestionPipelineResult {
  const startedAt = nowISO();
  const tid = traceId();
  const errors: string[] = [];
  const warnings: string[] = [];
  const steps: IngestionSubAgentStep[] = [];
  const submission: ManualUrlSubmission = {
    url: input.url,
    submittedBy: input.submittedBy,
    submittedAt: startedAt,
    intendedCapabilityId: input.capabilityId,
    intendedSkillId: input.skillId,
    intendedTopicId: input.topicId,
    sourceType: input.sourceType,
    notes: input.notes,
    consent: true,
  };

  let fetchResult: ManualUrlFetchResult | null = null;
  let fetchValidation: FetchValidationResult | null = null;
  let candidate: RawContentCandidate | null = null;
  let candidateValidation: ValidationResult | null = null;
  let duplicateInfo: CatalogDuplicateInfo | null = null;
  let reviewItem: ReviewItem | null = null;
  let gateStatus: "pass" | "blocked" = "pass";

  const fetchOut = runFetchSubAgent(submission);
  fetchResult = fetchOut.result;
  fetchValidation = fetchOut.validation;
  steps.push(fetchOut.step);
  if (!fetchOut.validation.valid) {
    errors.push(...fetchOut.validation.errors);
    warnings.push(...fetchOut.validation.warnings);
    const completedAt = nowISO();
    return {
      traceId: tid, status: "failed", startedAt, completedAt, durationMs: elapsedMs(startedAt, completedAt),
      steps, fetchResult, fetchValidation, candidate, candidateValidation, duplicateInfo, reviewItem,
      gateStatus: "blocked", errors, warnings,
    };
  }
  warnings.push(...fetchOut.validation.warnings);

  if (!fetchResult) {
    const completedAt = nowISO();
    return {
      traceId: tid, status: "failed", startedAt, completedAt, durationMs: elapsedMs(startedAt, completedAt),
      steps, fetchResult, fetchValidation, candidate, candidateValidation, duplicateInfo, reviewItem,
      gateStatus: "blocked", errors: [...errors, "No fetch result returned"], warnings,
    };
  }

  const valOut = runValidationSubAgent(fetchResult);
  steps.push(valOut.step);
  if (!valOut.valid) {
    errors.push(...valOut.errors);
    warnings.push(...valOut.warnings);
    const completedAt = nowISO();
    return {
      traceId: tid, status: "failed", startedAt, completedAt, durationMs: elapsedMs(startedAt, completedAt),
      steps, fetchResult, fetchValidation, candidate, candidateValidation, duplicateInfo, reviewItem,
      gateStatus: "blocked", errors, warnings,
    };
  }
  warnings.push(...valOut.warnings);

  const bridgeOut = runCandidateBridgeSubAgent(fetchResult, input);
  steps.push(bridgeOut.step);
  if (!bridgeOut.candidate || bridgeOut.error) {
    if (bridgeOut.error) errors.push(bridgeOut.error);
    const completedAt = nowISO();
    return {
      traceId: tid, status: "failed", startedAt, completedAt, durationMs: elapsedMs(startedAt, completedAt),
      steps, fetchResult, fetchValidation, candidate, candidateValidation, duplicateInfo, reviewItem,
      gateStatus: "blocked", errors, warnings,
    };
  }
  candidate = bridgeOut.candidate;
  candidateValidation = bridgeOut.validation;

  const dupOut = runDuplicateDetectionSubAgent(candidate);
  steps.push(dupOut.step);
  duplicateInfo = dupOut.duplicateInfo;

  const reviewOut = runReviewPreparationSubAgent(candidate, candidateValidation ?? { valid: true, errors: [], warnings: [] }, duplicateInfo);
  steps.push(reviewOut.step);
  reviewItem = reviewOut.reviewItem;
  gateStatus = reviewOut.reviewItem.humanApprovalRequired ? "blocked" : "pass";

  const completedAt = nowISO();
  return {
    traceId: tid,
    status: errors.length > 0 && gateStatus === "blocked" ? "failed" : "completed",
    startedAt,
    completedAt,
    durationMs: elapsedMs(startedAt, completedAt),
    steps,
    fetchResult,
    fetchValidation,
    candidate,
    candidateValidation,
    duplicateInfo,
    reviewItem,
    gateStatus,
    errors,
    warnings,
  };
}
