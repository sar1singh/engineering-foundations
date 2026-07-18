import { NormalizedDocument } from './multi-document-ingestion/types';

export interface TopicOverlapReport {
  success: boolean;
  overlapScore: number;
  warnings: string[];
  elapsedMs: number;
}

export async function runTopicOverlapAnalysis(docs: NormalizedDocument[]): Promise<TopicOverlapReport> {
  const startedAt = Date.now();
  const warnings: string[] = [];

  const headingMap = new Map<string, string[]>();
  for (const doc of docs) {
    for (const h of doc.normalizedContent.headings) {
      const normalizedH = h.toLowerCase().trim();
      if (!headingMap.has(normalizedH)) {
        headingMap.set(normalizedH, []);
      }
      headingMap.get(normalizedH)!.push(doc.url);
    }
  }

  let totalOverlaps = 0;
  headingMap.forEach((urls, heading) => {
    if (urls.length > 1) {
      totalOverlaps++;
      warnings.push(`Heading "${heading}" overlaps between: ${urls.join(', ')}`);
    }
  });

  return {
    success: true,
    overlapScore: docs.length > 0 ? Math.min((totalOverlaps / docs.length) * 100, 100) : 0,
    warnings,
    elapsedMs: Date.now() - startedAt
  };
}
