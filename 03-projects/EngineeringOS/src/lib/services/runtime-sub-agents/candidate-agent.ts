import type { ManualUrlFetchResult, ManualUrlSubmission } from "../manual-url-fetch-contracts";
import type { CandidateAgentOutput } from "@/types/runtime-sub-agent";
import { buildCandidateFromFetchResult } from "../manual-url-candidate-bridge";
import { validateContentCandidate } from "../content-ingestion-contracts";

export type CandidateAgentResult = {
  success: boolean;
  warnings: string[];
  errors: string[];
  elapsedMs: number;
  output: CandidateAgentOutput | null;
};

export function runCandidateAgent(
  fetchResult: ManualUrlFetchResult,
  submission: ManualUrlSubmission
): CandidateAgentResult {
  const startedAt = Date.now();
  const warnings: string[] = [];
  const errors: string[] = [];

  if (fetchResult.fetchStatus !== "success") {
    return {
      success: false,
      warnings: [],
      errors: ["Cannot generate candidate from unsuccessful fetch"],
      elapsedMs: Date.now() - startedAt,
      output: null,
    };
  }

  const bridgeSubmission = {
    url: submission.url,
    submittedBy: submission.submittedBy,
    sourceType: submission.sourceType,
    capabilityId: submission.intendedCapabilityId,
    skillId: submission.intendedSkillId,
    topicId: submission.intendedTopicId,
    notes: submission.notes,
  };

  const candidate = buildCandidateFromFetchResult(fetchResult, bridgeSubmission);
  const validation = validateContentCandidate(candidate);

  if (!validation.valid) {
    return {
      success: false,
      warnings: [...validation.warnings],
      errors: [...validation.errors],
      elapsedMs: Date.now() - startedAt,
      output: null,
    };
  }

  warnings.push(...validation.warnings);

  return {
    success: true,
    warnings: [...warnings],
    errors,
    elapsedMs: Date.now() - startedAt,
    output: {
      agentType: "candidate-agent",
      candidate,
      validation,
    },
  };
}
