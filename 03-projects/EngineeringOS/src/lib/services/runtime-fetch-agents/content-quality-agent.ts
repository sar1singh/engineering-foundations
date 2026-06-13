import type { NormalizedContent, ExtractedMetadata, QualityScoreDetail, ContentQualityResult } from "@/types/runtime-fetch-agent";
import type { SemanticDuplicateInfo } from "@/types/runtime-fetch-agent";

function scoreTechnicalDensity(codeBlocks: string[], paragraphs: string[]): number {
  if (paragraphs.length === 0) return 0;
  const codeRatio = codeBlocks.length / paragraphs.length;
  if (codeRatio > 0.5) return 90;
  if (codeRatio > 0.3) return 75;
  if (codeRatio > 0.1) return 55;
  return 30;
}

function scoreStructureQuality(headings: string[], paragraphs: string[], codeBlocks: string[]): number {
  let score = 0;
  if (headings.length >= 5) score += 30;
  else if (headings.length >= 3) score += 20;
  else if (headings.length >= 1) score += 10;

  if (paragraphs.length >= 10) score += 30;
  else if (paragraphs.length >= 5) score += 20;
  else if (paragraphs.length >= 2) score += 10;

  if (codeBlocks.length >= 3) score += 40;
  else if (codeBlocks.length >= 1) score += 25;

  return Math.min(100, score);
}

function scoreEducationalUsefulness(
  headings: string[],
  codeBlocks: string[],
  wordCount: number
): number {
  let score = 0;
  const educationalTerms = ["example", "tutorial", "guide", "how-to", "walkthrough", "best practice", "reference"];
  const allText = headings.join(" ").toLowerCase();
  const termsFound = educationalTerms.filter((t) => allText.includes(t));
  score += termsFound.length * 10;

  if (codeBlocks.length >= 2) score += 20;
  if (wordCount >= 500) score += 20;
  if (wordCount >= 2000) score += 15;
  if (headings.length >= 3) score += 15;

  return Math.min(100, score);
}

function scoreSyllabusRelevance(
  topicHints: string[],
  keywords: string[]
): number {
  if (topicHints.length >= 5) return 90;
  if (topicHints.length >= 3) return 70;
  if (topicHints.length >= 1) return 45;
  if (keywords.length >= 3) return 30;
  return 10;
}

function scoreExtractionCompleteness(metadata: ExtractedMetadata): number {
  let score = 0;
  if (metadata.title && metadata.title !== "Untitled") score += 20;
  if (metadata.description) score += 15;
  if (metadata.keywords.length > 0) score += 10;
  if (metadata.topicHints.length > 0) score += 15;
  if (metadata.hasStructure) score += 20;
  if (metadata.codeBlockCount > 0) score += 10;
  if (metadata.wordCount > 100) score += 10;
  return Math.min(100, score);
}

function scoreDuplicateRisk(duplicate: SemanticDuplicateInfo | undefined): number {
  if (!duplicate) return 0;
  return duplicate.duplicateProbability;
}

function scoreMissionUsefulness(codeBlocks: string[], wordCount: number): number {
  let score = 0;
  if (codeBlocks.length >= 1) score += 30;
  if (wordCount >= 300) score += 25;
  if (codeBlocks.length >= 3) score += 25;
  if (wordCount >= 1000) score += 20;
  return Math.min(100, score);
}

function scoreInterviewUsefulness(
  headings: string[],
  codeBlocks: string[],
  topicHints: string[]
): number {
  let score = 0;
  const interviewTerms = ["architecture", "design", "trade-off", "comparison", "scenario", "problem", "solution"];
  const allText = headings.join(" ").toLowerCase();
  const termsFound = interviewTerms.filter((t) => allText.includes(t));
  score += termsFound.length * 10;
  if (codeBlocks.length >= 1) score += 15;
  if (topicHints.includes("architecture") || topicHints.includes("security")) score += 15;
  return Math.min(100, score);
}

export function runContentQualityAgent(
  normalized: NormalizedContent,
  metadata: ExtractedMetadata,
  duplicate?: SemanticDuplicateInfo
): ContentQualityResult {
  const startedAt = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!normalized || !metadata) {
    return {
      success: false,
      quality: null,
      errors: ["Missing normalized content or metadata"],
      warnings: [],
      elapsedMs: Date.now() - startedAt,
    };
  }

  const technicalDensity = scoreTechnicalDensity(normalized.codeBlocks, normalized.paragraphs);
  const structureQuality = scoreStructureQuality(normalized.headings, normalized.paragraphs, normalized.codeBlocks);
  const educationalUsefulness = scoreEducationalUsefulness(normalized.headings, normalized.codeBlocks, metadata.wordCount);
  const syllabusRelevance = scoreSyllabusRelevance(metadata.topicHints, metadata.keywords);
  const extractionCompleteness = scoreExtractionCompleteness(metadata);
  const duplicateRisk = scoreDuplicateRisk(duplicate);
  const missionUsefulness = scoreMissionUsefulness(normalized.codeBlocks, metadata.wordCount);
  const interviewUsefulness = scoreInterviewUsefulness(normalized.headings, normalized.codeBlocks, metadata.topicHints);

  const rawScore = (
    technicalDensity * 0.15 +
    structureQuality * 0.15 +
    educationalUsefulness * 0.20 +
    syllabusRelevance * 0.15 +
    extractionCompleteness * 0.10 +
    (100 - duplicateRisk) * 0.10 +
    missionUsefulness * 0.05 +
    interviewUsefulness * 0.10
  );

  const normalizedScore = Math.round(rawScore);
  const rejectionWarnings: string[] = [];

  if (technicalDensity < 20) rejectionWarnings.push("Low technical density");
  if (structureQuality < 20) rejectionWarnings.push("Poor structure quality");
  if (educationalUsefulness < 20) rejectionWarnings.push("Low educational usefulness");
  if (syllabusRelevance < 10) rejectionWarnings.push("Low syllabus relevance");
  if (duplicateRisk > 70) rejectionWarnings.push("High duplicate risk");
  if (extractionCompleteness < 20) rejectionWarnings.push("Incomplete extraction");

  if (rejectionWarnings.length > 0) {
    warnings.push(...rejectionWarnings);
  }

  const quality: QualityScoreDetail = {
    technicalDensity,
    structureQuality,
    educationalUsefulness,
    syllabusRelevance,
    extractionCompleteness,
    duplicateRisk,
    missionUsefulness,
    interviewUsefulness,
    normalizedScore,
    rejectionWarnings,
  };

  return {
    success: true,
    quality,
    errors,
    warnings,
    elapsedMs: Date.now() - startedAt,
  };
}
