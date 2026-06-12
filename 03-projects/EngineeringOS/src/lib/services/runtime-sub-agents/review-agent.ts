import type { ReviewAgentOutput } from "@/types/runtime-sub-agent";

export type ReviewAgentResult = {
  success: boolean;
  warnings: string[];
  errors: string[];
  elapsedMs: number;
  output: ReviewAgentOutput | null;
};

export function runReviewAgent(): ReviewAgentResult {
  const startedAt = Date.now();

  return {
    success: true,
    warnings: [],
    errors: [],
    elapsedMs: Date.now() - startedAt,
    output: {
      agentType: "review-agent",
      humanApprovalRequired: true,
    },
  };
}
