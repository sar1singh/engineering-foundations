import type {
  NormalizedContent,
  ExtractedMetadata,
  QualityScoreDetail,
  SemanticDuplicateInfo,
  FetchAttribution,
  CandidateGenerationResult,
} from "@/types/runtime-fetch-agent";
import type { RawContentCandidate, ContentSourceType, ContentTier } from "@/types/content-ingestion";
import { computeContentHash } from "./semantic-duplicate-agent";

const AGENT_VERSION = "1.0.0";

function buildSourceType(sourceType: string): ContentSourceType {
  const validTypes: ContentSourceType[] = ["official-docs", "engineering-blog", "book", "interview-guide", "github-repository", "career-framework", "roadmap", "job-description", "practice-platform"];
  return validTypes.includes(sourceType as ContentSourceType) ? (sourceType as ContentSourceType) : "official-docs";
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function runCandidateGenerationAgent(
  normalized: NormalizedContent,
  metadata: ExtractedMetadata,
  quality: QualityScoreDetail,
  duplicate: SemanticDuplicateInfo | undefined,
  sourceUrl: string
): CandidateGenerationResult {
  const startedAt = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!normalized || !metadata) {
    return {
      success: false,
      candidate: null,
      attribution: null,
      errors: ["Missing normalized content or metadata"],
      warnings: [],
      elapsedMs: Date.now() - startedAt,
    };
  }

  const contentHash = computeContentHash(
    normalized.title + " " + normalized.paragraphs.join(" ") + " " + normalized.codeBlocks.join(" ")
  );

  const candidateId = `fetch-${generateSlug(normalized.title)}-${Date.now()}`;
  const tier: ContentTier = quality.normalizedScore >= 70 ? "tier-1" : quality.normalizedScore >= 40 ? "tier-2" : "tier-3";

  const candidate: RawContentCandidate = {
    id: candidateId,
    title: normalized.title,
    url: sourceUrl,
    sourceType: buildSourceType(metadata.sourceType),
    tier,
    category: metadata.topicHints[0] || "general",
    description: normalized.metaDescription || normalized.paragraphs[0]?.slice(0, 200) || "",
    discoveryMethod: "agent-discovery",
    discoveredAt: new Date().toISOString(),
    discoveredBy: "real-fetch-agent",
    tags: [...metadata.keywords, ...metadata.topicHints.slice(0, 5)],
    estimatedConfidence: quality.normalizedScore,
  };

  if (quality.normalizedScore < 30) {
    warnings.push("Low quality score — candidate may need manual review");
  }
  if (duplicate && duplicate.duplicateProbability > 70) {
    warnings.push("High duplicate probability — verify before importing");
  }

  const attribution: FetchAttribution = {
    sourceUrl,
    fetchedAt: new Date().toISOString(),
    fetchAgentVersion: AGENT_VERSION,
    parserVersion: "1.0.0",
    normalizationVersion: "1.0.0",
    contentHash,
    extractionMethod: "controlled-real-fetch",
    reviewStatus: "pending",
  };

  return {
    success: true,
    candidate,
    attribution,
    errors,
    warnings,
    elapsedMs: Date.now() - startedAt,
  };
}
