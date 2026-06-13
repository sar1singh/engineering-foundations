import type { NormalizedContent, NormalizationResult } from "@/types/runtime-fetch-agent";

const NORMALIZATION_VERSION = "1.0.0";

function stripHtmlTags(raw: string): string {
  return raw.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#\d+;/g, " ");
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function extractHeadings(raw: string): string[] {
  const headingRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
  const headings: string[] = [];
  let match;
  while ((match = headingRegex.exec(raw)) !== null) {
    const text = normalizeWhitespace(stripHtmlTags(match[0]));
    if (text && !headings.includes(text)) {
      headings.push(text);
    }
  }
  return headings;
}

function extractParagraphs(raw: string): string[] {
  const paraRegex = /<p[^>]*>(.*?)<\/p>/gi;
  const paragraphs: string[] = [];
  let match;
  while ((match = paraRegex.exec(raw)) !== null) {
    const text = normalizeWhitespace(stripHtmlTags(match[0]));
    if (text && text.length > 20 && !paragraphs.includes(text)) {
      paragraphs.push(text);
    }
  }
  return paragraphs;
}

function extractCodeBlocks(raw: string): string[] {
  const codeRegex = /<(?:pre|code)[^>]*>(.*?)<\/(?:pre|code)>/gi;
  const blocks: string[] = [];
  let match;
  while ((match = codeRegex.exec(raw)) !== null) {
    const code = match[1].replace(/<[^>]+>/g, "").trim();
    if (code && code.length > 10 && !blocks.includes(code)) {
      blocks.push(code);
    }
  }
  return blocks;
}

function extractTitle(raw: string): string {
  const titleMatch = /<title[^>]*>(.*?)<\/title>/i.exec(raw);
  if (titleMatch) {
    return normalizeWhitespace(stripHtmlTags(titleMatch[0]));
  }
  const h1Match = /<h1[^>]*>(.*?)<\/h1>/i.exec(raw);
  if (h1Match) {
    return normalizeWhitespace(stripHtmlTags(h1Match[0]));
  }
  return "Untitled";
}

function extractCanonicalUrl(raw: string): string {
  const canonicalMatch = /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*\/?>/i.exec(raw);
  if (canonicalMatch) return canonicalMatch[1];
  const ogUrlMatch = /<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["'][^>]*\/?>/i.exec(raw);
  if (ogUrlMatch) return ogUrlMatch[1];
  return "";
}

function extractMetaDescription(raw: string): string {
  const descMatch = /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*\/?>/i.exec(raw);
  if (descMatch) return descMatch[1];
  const ogDescMatch = /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*\/?>/i.exec(raw);
  if (ogDescMatch) return ogDescMatch[1];
  return "";
}

function extractKeywords(raw: string): string[] {
  const kwMatch = /<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["'][^>]*\/?>/i.exec(raw);
  if (kwMatch) {
    return kwMatch[1].split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
  }
  return [];
}

function removeDuplicateBlocks(blocks: string[]): string[] {
  const seen = new Set<string>();
  return blocks.filter((block) => {
    const normalized = normalizeWhitespace(block.toLowerCase());
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

export function runHtmlNormalizationAgent(rawHtml: string): NormalizationResult {
  const startedAt = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rawHtml || rawHtml.trim().length === 0) {
    return {
      success: false,
      content: null,
      errors: ["Empty HTML content provided"],
      warnings: [],
      elapsedMs: Date.now() - startedAt,
    };
  }

  const originalLength = rawHtml.length;
  const headings = removeDuplicateBlocks(extractHeadings(rawHtml));
  const paragraphs = removeDuplicateBlocks(extractParagraphs(rawHtml));
  const codeBlocksRaw = extractCodeBlocks(rawHtml);
  const codeBlocks = removeDuplicateBlocks(codeBlocksRaw);
  const title = extractTitle(rawHtml);
  const canonicalUrl = extractCanonicalUrl(rawHtml);
  const metaDescription = extractMetaDescription(rawHtml);
  const keywords = extractKeywords(rawHtml);

  const blocksRemoved = codeBlocksRaw.length - codeBlocks.length;

  const content: NormalizedContent = {
    title,
    headings,
    paragraphs,
    codeBlocks,
    canonicalUrl,
    metaDescription,
    keywords,
    originalLength,
    normalizedLength: originalLength,
    blocksRemoved,
  };

  return {
    success: true,
    content,
    errors,
    warnings,
    elapsedMs: Date.now() - startedAt,
  };
}

export { NORMALIZATION_VERSION };
