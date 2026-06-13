import type {
  RealFetchPipelineResult,
  FetchAgentTrace,
  FetchBoundaryResult,
  NormalizationResult,
  MetadataExtractionResult,
  SemanticDuplicateResult,
  ContentQualityResult,
  CandidateGenerationResult,
} from "@/types/runtime-fetch-agent";

import { runFetchBoundaryAgent } from "./runtime-fetch-agents/fetch-boundary-agent";
import { runHtmlNormalizationAgent } from "./runtime-fetch-agents/html-normalization-agent";
import { runMetadataExtractionAgent } from "./runtime-fetch-agents/metadata-extraction-agent";
import { runSemanticDuplicateAgent } from "./runtime-fetch-agents/semantic-duplicate-agent";
import { runContentQualityAgent } from "./runtime-fetch-agents/content-quality-agent";
import { runCandidateGenerationAgent } from "./runtime-fetch-agents/candidate-generation-agent";

function makeTrace(
  agentType: FetchAgentTrace["agentType"],
  startTime: number,
  success: boolean,
  warnings: string[],
  errors: string[]
): FetchAgentTrace {
  return {
    agentType,
    startedAt: new Date(startTime).toISOString(),
    completedAt: new Date().toISOString(),
    elapsedMs: Date.now() - startTime,
    success,
    warnings,
    errors,
  };
}

import type { ManualUrlSubmission } from "@/lib/services/manual-url-fetch-contracts";
import { runRealHttpFetch } from "./real-fetch";

async function fetchUrlContent(url: string, submission: ManualUrlSubmission): Promise<string> {
  const result = await runRealHttpFetch(url, submission);
  if (result.fetchStatus !== "success" || !result.rawTextPreview) {
    throw new Error(result.errors?.join("; ") || "Fetch failed");
  }
  return result.rawTextPreview;
}

export async function runRealFetchPipeline(url: string, submission: ManualUrlSubmission): Promise<RealFetchPipelineResult> {
  const pipelineStart = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];
  const traces: FetchAgentTrace[] = [];

  let boundary: FetchBoundaryResult | null = null;
  let normalization: NormalizationResult | null = null;
  let metadata: MetadataExtractionResult | null = null;
  let duplicate: SemanticDuplicateResult | null = null;
  let quality: ContentQualityResult | null = null;
  let candidate: CandidateGenerationResult | null = null;

  const boundaryStart = Date.now();
  boundary = runFetchBoundaryAgent(url);
  traces.push(makeTrace("fetch-boundary-agent", boundaryStart, boundary.success, boundary.warnings, boundary.errors));
  if (!boundary.success) {
    return {
      success: false, trace: traces, boundary, normalization, metadata, duplicate, quality, candidate,
      errors: boundary.errors, warnings, startedAt: new Date(pipelineStart).toISOString(),
      completedAt: new Date().toISOString(), durationMs: Date.now() - pipelineStart,
    };
  }

  const rawHtml = await fetchUrlContent(url, submission);

  const normStart = Date.now();
  normalization = runHtmlNormalizationAgent(rawHtml);
  traces.push(makeTrace("html-normalization-agent", normStart, normalization.success, normalization.warnings, normalization.errors));
  if (!normalization.success || !normalization.content) {
    return {
      success: false, trace: traces, boundary, normalization, metadata, duplicate, quality, candidate,
      errors: normalization.errors, warnings, startedAt: new Date(pipelineStart).toISOString(),
      completedAt: new Date().toISOString(), durationMs: Date.now() - pipelineStart,
    };
  }

  const metaStart = Date.now();
  metadata = runMetadataExtractionAgent(normalization.content, url);
  traces.push(makeTrace("metadata-extraction-agent", metaStart, metadata.success, metadata.warnings, metadata.errors));
  if (!metadata.success || !metadata.metadata) {
    return {
      success: false, trace: traces, boundary, normalization, metadata, duplicate, quality, candidate,
      errors: metadata.errors, warnings, startedAt: new Date(pipelineStart).toISOString(),
      completedAt: new Date().toISOString(), durationMs: Date.now() - pipelineStart,
    };
  }

  const dupStart = Date.now();
  duplicate = runSemanticDuplicateAgent(normalization.content, url);
  traces.push(makeTrace("semantic-duplicate-agent", dupStart, duplicate.success, duplicate.warnings, duplicate.errors));
  if (!duplicate.success) {
    return {
      success: false, trace: traces, boundary, normalization, metadata, duplicate, quality, candidate,
      errors: duplicate.errors, warnings, startedAt: new Date(pipelineStart).toISOString(),
      completedAt: new Date().toISOString(), durationMs: Date.now() - pipelineStart,
    };
  }

  const qualStart = Date.now();
  quality = runContentQualityAgent(normalization.content, metadata.metadata, duplicate.duplicateInfo ?? undefined);
  traces.push(makeTrace("content-quality-agent", qualStart, quality.success, quality.warnings, quality.errors));
  if (!quality.success || !quality.quality) {
    return {
      success: false, trace: traces, boundary, normalization, metadata, duplicate, quality, candidate,
      errors: quality.errors, warnings, startedAt: new Date(pipelineStart).toISOString(),
      completedAt: new Date().toISOString(), durationMs: Date.now() - pipelineStart,
    };
  }

  const candStart = Date.now();
  candidate = runCandidateGenerationAgent(
    normalization.content, metadata.metadata, quality.quality,
    duplicate.duplicateInfo ?? undefined, url
  );
  traces.push(makeTrace("candidate-generation-agent", candStart, candidate.success, candidate.warnings, candidate.errors));

  if (candidate.attribution) {
    warnings.push("Fetch attribution: fetchAgentVersion=" + candidate.attribution.fetchAgentVersion);
    warnings.push("Content hash: " + candidate.attribution.contentHash);
  }

  warnings.push("Pipeline completed successfully");
  warnings.push("All candidates require human review before import");
  warnings.push("No graph writes performed");

  return {
    success: true,
    trace: traces,
    boundary,
    normalization,
    metadata,
    duplicate,
    quality,
    candidate,
    errors,
    warnings,
    startedAt: new Date(pipelineStart).toISOString(),
    completedAt: new Date().toISOString(),
    durationMs: Date.now() - pipelineStart,
  };
}
