import { NormalizedDocument } from './multi-document-ingestion/types';

export interface SyllabusTrack {
  trackId: string;
  name: string;
  prerequisites: string[];
  topics: string[];
}

export interface SyllabusExtractionResult {
  success: boolean;
  tracks: SyllabusTrack[];
  elapsedMs: number;
}

export async function extractSyllabusFamily(docs: NormalizedDocument[]): Promise<SyllabusExtractionResult> {
  const startedAt = Date.now();
  const tracks: SyllabusTrack[] = [];

  for (const doc of docs) {
    const headings = doc.normalizedContent.headings;
    if (headings.length > 0) {
      tracks.push({
        trackId: `track-${doc.normalizedContent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: doc.normalizedContent.title,
        prerequisites: headings.slice(0, 1).map(h => `prereq-${h.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`),
        topics: headings
      });
    }
  }

  return {
    success: true,
    tracks,
    elapsedMs: Date.now() - startedAt
  };
}
