import type { IngestionAgentResult } from "@/types/ingestion-agent";
import type { ContentSourceType } from "@/types/content-ingestion";
import { runSubAgentIngestionPipeline } from "./ingestion-sub-agent-pipeline";

export type IngestionAgentInput = {
  url: string;
  submittedBy: string;
  sourceType: ContentSourceType;
  capabilityId?: string;
  skillId?: string;
  topicId?: string;
  notes?: string;
};

export function runIngestionAgent(input: IngestionAgentInput): IngestionAgentResult {
  const pipelineResult = runSubAgentIngestionPipeline(input);

  const fetchStatus = (() => {
    if (!pipelineResult.fetchResult) return null;
    return (pipelineResult.fetchResult as { fetchStatus: "success" | "error" }).fetchStatus;
  })() as "success" | "error" | null;

  return {
    traceId: pipelineResult.traceId,
    status: pipelineResult.gateStatus === "blocked" && pipelineResult.errors.length > 0 ? "failed" : "completed",
    startedAt: pipelineResult.startedAt,
    completedAt: pipelineResult.completedAt,
    durationMs: pipelineResult.durationMs,
    steps: pipelineResult.steps,
    fetchStatus,
    candidateValid: pipelineResult.candidateValidation ? (pipelineResult.candidateValidation as { valid: boolean }).valid : false,
    gateStatus: pipelineResult.gateStatus,
    duplicateWarning: pipelineResult.reviewItem?.duplicateWarning ?? "",
    candidateId: pipelineResult.reviewItem?.candidateId ?? "",
    candidateUrl: pipelineResult.reviewItem?.candidateUrl ?? input.url,
    errors: pipelineResult.errors,
    warnings: pipelineResult.warnings,
  };
}
