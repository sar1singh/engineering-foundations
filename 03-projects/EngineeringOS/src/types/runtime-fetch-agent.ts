import type { FetchAllowlistEntry } from "@/data/runtime-fetch-allowlist";
import type { RawContentCandidate } from "@/types/content-ingestion";

export type FetchAgentType =
  | "fetch-boundary-agent"
  | "html-normalization-agent"
  | "metadata-extraction-agent"
  | "semantic-duplicate-agent"
  | "content-quality-agent"
  | "candidate-generation-agent";

export type FetchBoundaryCheck = {
  protocolValid: boolean;
  domainAllowed: boolean;
  allowlistEntry?: FetchAllowlistEntry;
  notPrivateNetwork: boolean;
  maxRedirectsOk: boolean;
  timeoutOk: boolean;
  contentTypeOk: boolean;
  contentLengthOk: boolean;
  noBinaryDownload: boolean;
  noCookies: boolean;
  noAuthHeaders: boolean;
};

export type FetchBoundaryResult = {
  success: boolean;
  checks: FetchBoundaryCheck;
  errors: string[];
  warnings: string[];
  elapsedMs: number;
};

export type NormalizedContent = {
  title: string;
  headings: string[];
  paragraphs: string[];
  codeBlocks: string[];
  canonicalUrl: string;
  metaDescription: string;
  keywords: string[];
  originalLength: number;
  normalizedLength: number;
  blocksRemoved: number;
};

export type NormalizationResult = {
  success: boolean;
  content: NormalizedContent | null;
  errors: string[];
  warnings: string[];
  elapsedMs: number;
};

export type ExtractedMetadata = {
  title: string;
  description: string;
  keywords: string[];
  topicHints: string[];
  sourceType: string;
  estimatedReadingTimeMinutes: number;
  wordCount: number;
  codeBlockCount: number;
  hasStructure: boolean;
};

export type MetadataExtractionResult = {
  success: boolean;
  metadata: ExtractedMetadata | null;
  errors: string[];
  warnings: string[];
  elapsedMs: number;
};

export type SemanticDuplicateInfo = {
  duplicateProbability: number;
  conflictWarnings: string[];
  existingTopicOverlap: string[];
  normalizedUrl: string;
  titleSimilarity: number;
  contentHashSimilarity: number;
  sourceFamilyMatch: boolean;
};

export type SemanticDuplicateResult = {
  success: boolean;
  duplicateInfo: SemanticDuplicateInfo | null;
  errors: string[];
  warnings: string[];
  elapsedMs: number;
};

export type QualityScoreDetail = {
  technicalDensity: number;
  structureQuality: number;
  educationalUsefulness: number;
  syllabusRelevance: number;
  extractionCompleteness: number;
  duplicateRisk: number;
  missionUsefulness: number;
  interviewUsefulness: number;
  normalizedScore: number;
  rejectionWarnings: string[];
};

export type ContentQualityResult = {
  success: boolean;
  quality: QualityScoreDetail | null;
  errors: string[];
  warnings: string[];
  elapsedMs: number;
};

export type FetchAttribution = {
  sourceUrl: string;
  fetchedAt: string;
  fetchAgentVersion: string;
  parserVersion: string;
  normalizationVersion: string;
  contentHash: string;
  extractionMethod: string;
  reviewStatus: "pending" | "approved" | "rejected";
};

export type CandidateGenerationResult = {
  success: boolean;
  candidate: RawContentCandidate | null;
  attribution: FetchAttribution | null;
  errors: string[];
  warnings: string[];
  elapsedMs: number;
};

export type FetchAgentTrace = {
  agentType: FetchAgentType;
  startedAt: string;
  completedAt: string;
  elapsedMs: number;
  success: boolean;
  warnings: string[];
  errors: string[];
};

export type RealFetchPipelineResult = {
  success: boolean;
  trace: FetchAgentTrace[];
  boundary: FetchBoundaryResult | null;
  normalization: NormalizationResult | null;
  metadata: MetadataExtractionResult | null;
  duplicate: SemanticDuplicateResult | null;
  quality: ContentQualityResult | null;
  candidate: CandidateGenerationResult | null;
  errors: string[];
  warnings: string[];
  startedAt: string;
  completedAt: string;
  durationMs: number;
};
