import type { NormalizedContent, SemanticDuplicateInfo, SemanticDuplicateResult } from "@/types/runtime-fetch-agent";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";

function normalizeUrlForComparison(url: string): string {
  return url.trim().replace(/\/+$/, "").replace(/^https?:\/\//, "").replace(/^www\./, "").toLowerCase();
}

function computeTitleSimilarity(title1: string, title2: string): number {
  const words1 = title1.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const words2 = title2.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  if (words1.length === 0 || words2.length === 0) return 0;
  const intersection = words1.filter((w) => words2.includes(w));
  return Math.round((intersection.length / Math.max(words1.length, words2.length)) * 100);
}

function computeContentHash(raw: string): string {
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

function computeContentHashSimilarity(hash1: string, hash2: string): number {
  if (hash1 === hash2) return 100;
  let matches = 0;
  const len = Math.min(hash1.length, hash2.length);
  for (let i = 0; i < len; i++) {
    if (hash1[i] === hash2[i]) matches++;
  }
  return Math.round((matches / Math.max(hash1.length, hash2.length)) * 100);
}

function findExistingSourceFamily(url: string): string | null {
  const normalized = normalizeUrlForComparison(url);
  const domain = normalized.split("/")[0];
  for (const source of founderBetaSourceCatalog) {
    try {
      const sourceDomain = normalizeUrlForComparison(source.url).split("/")[0];
      if (sourceDomain === domain) return source.id;
    } catch {
      continue;
    }
  }
  return null;
}

function findExistingTopicOverlap(
  title: string,
  keywords: string[],
  headings: string[]
): string[] {
  const overlapping: string[] = [];
  const searchText = (title + " " + keywords.join(" ") + " " + headings.join(" ")).toLowerCase();
  for (const topic of founderBetaMasterTopics) {
    const topicWords = topic.name.toLowerCase().split(/\s+/);
    if (topicWords.some((word) => word.length > 3 && searchText.includes(word))) {
      overlapping.push(topic.name);
    }
  }
  return overlapping.slice(0, 5);
}

export function runSemanticDuplicateAgent(
  normalized: NormalizedContent,
  sourceUrl: string,
  existingContentHash?: string
): SemanticDuplicateResult {
  const startedAt = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!normalized) {
    return {
      success: false,
      duplicateInfo: null,
      errors: ["No normalized content provided"],
      warnings: [],
      elapsedMs: Date.now() - startedAt,
    };
  }

  const normalizedUrl = normalizeUrlForComparison(sourceUrl);
  const contentHash = computeContentHash(
    normalized.title + " " + normalized.paragraphs.join(" ") + " " + normalized.codeBlocks.join(" ")
  );
  const sourceFamily = findExistingSourceFamily(sourceUrl);
  const topicOverlap = findExistingTopicOverlap(normalized.title, normalized.keywords, normalized.headings);

  let titleSimilarity = 0;
  if (existingContentHash) {
    titleSimilarity = computeContentHashSimilarity(contentHash, existingContentHash);
  }

  const isDuplicate = sourceFamily !== null && topicOverlap.length > 0;
  const duplicateProbability = isDuplicate
    ? Math.min(100, 30 + topicOverlap.length * 15 + (titleSimilarity > 50 ? 20 : 0))
    : Math.min(30, topicOverlap.length * 5);

  const conflictWarnings: string[] = [];
  if (sourceFamily) {
    conflictWarnings.push(`Source family exists in catalog (source ID: ${sourceFamily})`);
  }
  if (topicOverlap.length > 0) {
    conflictWarnings.push(`Content overlaps with existing topics: ${topicOverlap.join(", ")}`);
  }
  if (titleSimilarity > 60) {
    conflictWarnings.push("High title similarity with existing content");
  }
  if (duplicateProbability > 70) {
    warnings.push("High duplicate probability — review recommended before proceeding");
  }

  const duplicateInfo: SemanticDuplicateInfo = {
    duplicateProbability,
    conflictWarnings,
    existingTopicOverlap: topicOverlap,
    normalizedUrl,
    titleSimilarity,
    contentHashSimilarity: existingContentHash ? titleSimilarity : 0,
    sourceFamilyMatch: sourceFamily !== null,
  };

  return {
    success: true,
    duplicateInfo,
    errors,
    warnings,
    elapsedMs: Date.now() - startedAt,
  };
}

export { computeContentHash, normalizeUrlForComparison, computeTitleSimilarity };
