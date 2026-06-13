import type { NormalizedContent, ExtractedMetadata, MetadataExtractionResult } from "@/types/runtime-fetch-agent";

const PARSER_VERSION = "1.0.0";

const READING_SPEED_WPM = 200;

function extractTopicHints(headings: string[], paragraphs: string[]): string[] {
  const hintKeywords = [
    "api", "sdk", "cli", "tutorial", "guide", "reference", "overview",
    "getting started", "installation", "configuration", "deployment",
    "architecture", "security", "authentication", "authorization",
    "monitoring", "logging", "scaling", "performance", "optimization",
    "database", "storage", "networking", "compute", "serverless",
    "container", "kubernetes", "docker", "ci/cd", "pipeline",
  ];
  const hints = new Set<string>();
  const allText = [...headings, ...paragraphs.slice(0, 5)].join(" ").toLowerCase();
  for (const keyword of hintKeywords) {
    if (allText.includes(keyword)) {
      hints.add(keyword);
    }
  }
  return [...hints].slice(0, 10);
}

function inferSourceType(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes("docs.") || lower.includes("/docs/") || lower.includes("/documentation/")) return "official-docs";
  if (lower.includes("/guide") || lower.includes("/tutorial") || lower.includes("/how-to")) return "guide";
  if (lower.includes("/blog") || lower.includes("/articles") || lower.includes("/news")) return "engineering-blog";
  if (lower.includes("/reference") || lower.includes("/api/")) return "reference";
  if (lower.includes("/learn") || lower.includes("/courses")) return "learning-resource";
  return "web";
}

export function runMetadataExtractionAgent(
  normalized: NormalizedContent,
  sourceUrl: string
): MetadataExtractionResult {
  const startedAt = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!normalized || !normalized.title) {
    return {
      success: false,
      metadata: null,
      errors: ["Normalized content missing title"],
      warnings: [],
      elapsedMs: Date.now() - startedAt,
    };
  }

  const wordCount = normalized.paragraphs.reduce((sum, p) => sum + p.split(/\s+/).length, 0);
  const estimatedReadingTimeMinutes = Math.max(1, Math.round(wordCount / READING_SPEED_WPM));
  const topicHints = extractTopicHints(normalized.headings, normalized.paragraphs);
  const sourceType = inferSourceType(sourceUrl);
  const hasStructure = normalized.headings.length >= 2 && normalized.paragraphs.length >= 3;

  if (normalized.paragraphs.length === 0) {
    warnings.push("No paragraphs extracted from content");
  }
  if (normalized.headings.length === 0) {
    warnings.push("No headings found in content");
  }
  if (topicHints.length === 0) {
    warnings.push("No topic hints could be inferred");
  }

  const metadata: ExtractedMetadata = {
    title: normalized.title,
    description: normalized.metaDescription,
    keywords: normalized.keywords,
    topicHints,
    sourceType,
    estimatedReadingTimeMinutes,
    wordCount,
    codeBlockCount: normalized.codeBlocks.length,
    hasStructure,
  };

  return {
    success: true,
    metadata,
    errors,
    warnings,
    elapsedMs: Date.now() - startedAt,
  };
}

export { PARSER_VERSION };
