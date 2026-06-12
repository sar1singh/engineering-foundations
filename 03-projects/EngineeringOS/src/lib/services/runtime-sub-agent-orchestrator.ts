import type { ManualUrlSubmission, FetchBoundary } from "./manual-url-fetch-contracts";
import type {
  PipelineResult,
  RuntimeSubAgentTrace,
  RuntimeSubAgentType,
} from "@/types/runtime-sub-agent";
import { runValidationAgent } from "./runtime-sub-agents/validation-agent";
import { runMetadataAgent } from "./runtime-sub-agents/metadata-agent";
import { runCandidateAgent } from "./runtime-sub-agents/candidate-agent";
import { runDuplicateAgent } from "./runtime-sub-agents/duplicate-agent";
import { runReviewAgent } from "./runtime-sub-agents/review-agent";
import { dryRunManualUrlFetch, DEFAULT_FETCH_BOUNDARY } from "./manual-url-dry-run";
import { validateFetchOutput } from "./manual-url-fetch-validation";

function now(): string {
  return new Date().toISOString();
}

function elapsedMs(startedAt: number): number {
  return Date.now() - startedAt;
}

function buildTraceEntry(
  agentType: RuntimeSubAgentType,
  startedAt: string,
  success: boolean,
  warnings: string[],
  errors: string[],
  elapsed: number
): RuntimeSubAgentTrace {
  return {
    agentType,
    startedAt,
    completedAt: now(),
    elapsedMs: elapsed,
    success,
    warnings,
    errors,
  };
}

export function runRuntimeSubAgentPipeline(
  submission: ManualUrlSubmission,
  boundary: FetchBoundary = DEFAULT_FETCH_BOUNDARY
): PipelineResult {
  const pipelineStartedAt = Date.now();
  const pipelineStartedAtStr = now();
  const trace: RuntimeSubAgentTrace[] = [];
  const globalErrors: string[] = [];
  const globalWarnings: string[] = [];

  // Step 1: Validation Agent
  const valStartedAtStr = now();
  const valResult = runValidationAgent(submission, boundary);
  trace.push(
    buildTraceEntry(
      "validation-agent",
      valStartedAtStr,
      valResult.success,
      valResult.warnings,
      valResult.errors,
      valResult.elapsedMs
    )
  );
  globalWarnings.push(...valResult.warnings);
  if (!valResult.success) {
    globalErrors.push(...valResult.errors);
    return buildPipelineResult(pipelineStartedAt, pipelineStartedAtStr, trace, null, null, null, null, null, globalErrors, globalWarnings);
  }

  // Step 2: Fetch (inline — not a separate agent)
  const { result: fetchResult, validation: fetchValidation } = dryRunManualUrlFetch(submission, boundary);

  if (!fetchResult || fetchResult.fetchStatus !== "success") {
    const errMsg = fetchResult?.errors?.join("; ") || fetchValidation?.errors?.join("; ") || "Fetch failed";
    const fetchWarnings = fetchValidation?.warnings || [];
    const fetchErrors = fetchValidation?.errors || [errMsg];
    globalErrors.push(...fetchErrors);
    globalWarnings.push(...fetchWarnings);
    return buildPipelineResult(pipelineStartedAt, pipelineStartedAtStr, trace, null, null, null, null, null, globalErrors, globalWarnings);
  }

  const fetchOutputVal = validateFetchOutput(fetchResult);
  if (!fetchOutputVal.valid) {
    globalErrors.push(...fetchOutputVal.errors);
    globalWarnings.push(...fetchOutputVal.warnings);
    return buildPipelineResult(pipelineStartedAt, pipelineStartedAtStr, trace, null, null, null, null, null, globalErrors, globalWarnings);
  }
  globalWarnings.push(...fetchOutputVal.warnings);

  // Step 3: Metadata Agent
  const metaStartedAtStr = now();
  const metaResult = runMetadataAgent(fetchResult, submission.url);
  trace.push(
    buildTraceEntry(
      "metadata-agent",
      metaStartedAtStr,
      metaResult.success,
      metaResult.warnings,
      metaResult.errors,
      metaResult.elapsedMs
    )
  );
  globalWarnings.push(...metaResult.warnings);
  if (!metaResult.success) {
    globalErrors.push(...metaResult.errors);
    return buildPipelineResult(pipelineStartedAt, pipelineStartedAtStr, trace, valResult.output, null, null, null, null, globalErrors, globalWarnings);
  }

  // Step 4: Candidate Agent
  const candStartedAtStr = now();
  const candResult = runCandidateAgent(fetchResult, submission);
  trace.push(
    buildTraceEntry(
      "candidate-agent",
      candStartedAtStr,
      candResult.success,
      candResult.warnings,
      candResult.errors,
      candResult.elapsedMs
    )
  );
  globalWarnings.push(...candResult.warnings);
  if (!candResult.success) {
    globalErrors.push(...candResult.errors);
    return buildPipelineResult(pipelineStartedAt, pipelineStartedAtStr, trace, valResult.output, metaResult.output, null, null, null, globalErrors, globalWarnings);
  }

  // Step 5: Duplicate Agent
  const dupStartedAtStr = now();
  if (!candResult.output) {
    globalErrors.push("Candidate agent produced no output");
    return buildPipelineResult(pipelineStartedAt, pipelineStartedAtStr, trace, valResult.output, metaResult.output, candResult.output, null, null, globalErrors, globalWarnings);
  }
  const dupResult = runDuplicateAgent(candResult.output.candidate);
  trace.push(
    buildTraceEntry(
      "duplicate-agent",
      dupStartedAtStr,
      dupResult.success,
      dupResult.warnings,
      dupResult.errors,
      dupResult.elapsedMs
    )
  );
  globalWarnings.push(...dupResult.warnings);
  if (!dupResult.success) {
    globalErrors.push(...dupResult.errors);
    return buildPipelineResult(pipelineStartedAt, pipelineStartedAtStr, trace, valResult.output, metaResult.output, candResult.output, null, null, globalErrors, globalWarnings);
  }

  // Step 6: Review Agent
  const revStartedAtStr = now();
  const revResult = runReviewAgent();
  trace.push(
    buildTraceEntry(
      "review-agent",
      revStartedAtStr,
      revResult.success,
      revResult.warnings,
      revResult.errors,
      revResult.elapsedMs
    )
  );
  globalWarnings.push(...revResult.warnings);
  if (!revResult.success) {
    globalErrors.push(...revResult.errors);
    return buildPipelineResult(pipelineStartedAt, pipelineStartedAtStr, trace, valResult.output, metaResult.output, candResult.output, dupResult.output, null, globalErrors, globalWarnings);
  }

  return buildPipelineResult(
    pipelineStartedAt,
    pipelineStartedAtStr,
    trace,
    valResult.output,
    metaResult.output,
    candResult.output,
    dupResult.output,
    revResult.output,
    globalErrors,
    globalWarnings
  );
}

function buildPipelineResult(
  pipelineStartedAt: number,
  pipelineStartedAtStr: string,
  trace: RuntimeSubAgentTrace[],
  validation: PipelineResult["validation"],
  metadata: PipelineResult["metadata"],
  candidate: PipelineResult["candidate"],
  duplicate: PipelineResult["duplicate"],
  review: PipelineResult["review"],
  errors: string[],
  warnings: string[]
): PipelineResult {
  const success = errors.length === 0;
  return {
    success,
    trace,
    validation,
    metadata,
    candidate,
    duplicate,
    review,
    errors,
    warnings: [...new Set(warnings)],
    startedAt: pipelineStartedAtStr,
    completedAt: now(),
    durationMs: elapsedMs(pipelineStartedAt),
  };
}
