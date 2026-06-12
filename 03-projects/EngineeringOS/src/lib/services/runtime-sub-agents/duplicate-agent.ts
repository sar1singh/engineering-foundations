import type { RawContentCandidate } from "@/types/content-ingestion";
import type { CatalogDuplicateInfo } from "../manual-url-candidate-bridge";
import type { DuplicateAgentOutput } from "@/types/runtime-sub-agent";
import { checkDuplicateInCatalog } from "../manual-url-candidate-bridge";

export type DuplicateAgentResult = {
  success: boolean;
  warnings: string[];
  errors: string[];
  elapsedMs: number;
  output: DuplicateAgentOutput | null;
};

export function runDuplicateAgent(
  candidate: RawContentCandidate
): DuplicateAgentResult {
  const startedAt = Date.now();
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!candidate.url) {
    return {
      success: false,
      warnings: [],
      errors: ["Candidate has no URL for duplicate detection"],
      elapsedMs: Date.now() - startedAt,
      output: null,
    };
  }

  const duplicateInfo: CatalogDuplicateInfo = checkDuplicateInCatalog(
    candidate.url,
    candidate.title
  );

  if (duplicateInfo.isDuplicate) {
    warnings.push(
      `Duplicate detected: ${duplicateInfo.matches.length} match(es) in source catalog`
    );
  }

  return {
    success: true,
    warnings,
    errors,
    elapsedMs: Date.now() - startedAt,
    output: {
      agentType: "duplicate-agent",
      duplicateInfo,
    },
  };
}
