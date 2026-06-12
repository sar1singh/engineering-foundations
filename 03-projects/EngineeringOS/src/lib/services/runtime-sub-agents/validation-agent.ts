import type { ManualUrlSubmission, FetchBoundary, FetchValidationResult } from "../manual-url-fetch-contracts";
import type { ValidationAgentOutput } from "@/types/runtime-sub-agent";
import { validateManualUrlInput, assertNoBulkCrawl, validateFetchBoundary } from "../manual-url-fetch-validation";

export type ValidationAgentResult = {
  success: boolean;
  warnings: string[];
  errors: string[];
  elapsedMs: number;
  output: ValidationAgentOutput | null;
};

export function runValidationAgent(
  submission: ManualUrlSubmission,
  boundary: FetchBoundary
): ValidationAgentResult {
  const startedAt = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  const inputVal = validateManualUrlInput(submission);
  if (!inputVal.valid) {
    return {
      success: false,
      warnings: [...inputVal.warnings],
      errors: [...inputVal.errors],
      elapsedMs: Date.now() - startedAt,
      output: null,
    };
  }
  warnings.push(...inputVal.warnings);

  const bulkVal = assertNoBulkCrawl(submission);
  if (!bulkVal.valid) {
    return {
      success: false,
      warnings: [...bulkVal.warnings],
      errors: [...bulkVal.errors],
      elapsedMs: Date.now() - startedAt,
      output: null,
    };
  }

  const boundaryVal = validateFetchBoundary(boundary, submission);
  if (!boundaryVal.valid) {
    return {
      success: false,
      warnings: [...boundaryVal.warnings],
      errors: [...boundaryVal.errors],
      elapsedMs: Date.now() - startedAt,
      output: null,
    };
  }
  warnings.push(...boundaryVal.warnings);

  const validation: FetchValidationResult = {
    valid: true,
    errors: [],
    warnings: [...warnings],
  };

  return {
    success: true,
    warnings,
    errors,
    elapsedMs: Date.now() - startedAt,
    output: {
      agentType: "validation-agent",
      validation,
      submission,
    },
  };
}
