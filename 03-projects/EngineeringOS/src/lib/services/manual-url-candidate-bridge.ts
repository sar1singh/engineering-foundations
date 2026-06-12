import type { ManualUrlFetchResult } from "./manual-url-fetch-contracts";
import type {
  RawContentCandidate,
  ContentSourceType,
  ContentTier,
  IngestionDiscoveryMethod,
  AgentAttribution,
} from "@/types/content-ingestion";
import { validateContentCandidate } from "./content-ingestion-contracts";
import type { ValidationResult } from "./content-ingestion-contracts";
import { founderBetaSourceCatalog } from "@/data/founder-beta";
import type { SourceReference } from "@/types/founder-beta";

export type CatalogDuplicateMatch = {
  source: SourceReference;
  field: "url" | "domain" | "title";
};

export type CatalogDuplicateInfo = {
  isDuplicate: boolean;
  matches: CatalogDuplicateMatch[];
};

export type CandidateImportPreview = {
  candidate: RawContentCandidate;
  validation: ValidationResult;
  duplicateInfo: CatalogDuplicateInfo;
  humanApprovalRequired: boolean;
};

function randomId(): string {
  return `cand-${crypto.randomUUID().slice(0, 8)}`;
}

function parseDomain(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function buildCandidateFromFetchResult(
  fetchResult: ManualUrlFetchResult,
  submission: {
    url: string;
    submittedBy: string;
    sourceType: ContentSourceType;
    capabilityId?: string;
    skillId?: string;
    topicId?: string;
    notes?: string;
  },
  candidateId?: string
): RawContentCandidate {
  const now = new Date().toISOString();
  const isSuccess = fetchResult.fetchStatus === "success";
  const attribution: AgentAttribution | undefined = fetchResult.attribution
    ? {
        agentId: fetchResult.attribution.agentId,
        agentVersion: fetchResult.attribution.agentVersion,
        agentTraceId: fetchResult.attribution.agentTraceId,
        discoveredAt: fetchResult.attribution.discoveredAt,
        sourceUrl: fetchResult.attribution.sourceUrl,
        extractionMethod: "manual" as const,
        rawMetadata: JSON.stringify({
          fetchStatus: fetchResult.fetchStatus,
          httpStatus: fetchResult.httpStatus,
          contentType: fetchResult.contentType,
          ...(fetchResult.extractedMetadata || {}),
        }),
      }
    : undefined;

  return {
    id: candidateId || randomId(),
    title: fetchResult.title || submission.url,
    url: fetchResult.finalUrl || submission.url,
    sourceType: submission.sourceType,
    tier: "tier-2" as ContentTier,
    category: submission.sourceType,
    description: fetchResult.title
      ? `Content fetched from ${fetchResult.finalUrl || submission.url}`
      : `URL fetched: ${submission.url}`,
    discoveryMethod: "manual" as IngestionDiscoveryMethod,
    discoveredAt: now,
    discoveredBy: submission.submittedBy,
    tags: [],
    estimatedConfidence: isSuccess ? 0.7 : 0.3,
    attribution,
    agentTraceId: fetchResult.attribution?.agentTraceId,
  };
}

export function checkDuplicateInCatalog(
  url: string,
  title?: string
): CatalogDuplicateInfo {
  const matches: CatalogDuplicateMatch[] = [];
  const inputDomain = parseDomain(url);

  for (const source of founderBetaSourceCatalog) {
    if (source.url.toLowerCase() === url.toLowerCase()) {
      matches.push({ source, field: "url" });
      continue;
    }
    if (inputDomain) {
      const sourceDomain = parseDomain(source.url);
      if (sourceDomain && inputDomain === sourceDomain) {
        const alreadyHasDomain = matches.some(
          (m) => m.field === "domain" && m.source.id === source.id
        );
        if (!alreadyHasDomain) {
          matches.push({ source, field: "domain" });
        }
      }
    }
    if (
      title &&
      source.title.toLowerCase() === title.toLowerCase()
    ) {
      matches.push({ source, field: "title" });
    }
  }

  return {
    isDuplicate: matches.length > 0,
    matches,
  };
}

export function previewCandidateImport(
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
): CandidateImportPreview {
  const candidate = buildCandidateFromFetchResult(fetchResult, submission);
  const validation = validateContentCandidate(candidate);
  const duplicateInfo = checkDuplicateInCatalog(candidate.url, candidate.title);

  const tagsEmpty = !candidate.tags || candidate.tags.length === 0;
  const confidenceLow =
    typeof candidate.estimatedConfidence !== "number" ||
    candidate.estimatedConfidence < 0.4;
  const humanApprovalRequired = tagsEmpty || confidenceLow || duplicateInfo.isDuplicate;

  return {
    candidate,
    validation,
    duplicateInfo,
    humanApprovalRequired,
  };
}
