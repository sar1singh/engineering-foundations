// src/lib/services/multi-document-ingestion/types.ts
export interface NormalizedDocument {
  url: string;
  normalizedContent: {
    title: string;
    headings: string[]; // normalized headings strings
    paragraphs: string[];
    codeBlocks: string[];
    contentHash: string;
    // other fields omitted for brevity
  };
  sourceProfile: {
    trustLevel: 'high' | 'medium' | 'low';
    sourceType: string;
    educationalCategory: string;
    sourceFamily?: string;
  };
}

export interface DuplicateGroup {
  groupId: string;
  reason: 'content-match' | 'topic-overlap' | 'roadmap-overlap' | 'awesome-list-overlap' | 'educational-collision';
  sourceDocuments: string[]; // URLs
  canonicalRepresentative: string; // URL
  confidenceScore: number; // 0-100
  overlappingTopics: string[];
}

export interface CollapsedDocument {
  originalUrl: string;
  collapsedToUrl: string; // canonical URL
}

export interface OverlapWarning {
  warningId: string;
  message: string;
  involvedDocuments: string[];
}

export interface EducationalCollision {
  collisionId: string;
  topic: string;
  involvedDocuments: string[];
  overlapScore: number;
  collisionType: 'duplicate-learning-path' | 'duplicate-topic' | 'redundant-resource' | 'conflicting-prerequisite';
  recommendation: 'merge' | 'review' | 'keep-separate';
}

export interface BatchDuplicateCollapseResult {
  success: boolean;
  duplicateGroups: DuplicateGroup[];
  collapsedDocuments: CollapsedDocument[];
  overlapWarnings: OverlapWarning[];
  educationalCollisions: EducationalCollision[];
  deterministicReplayHash: string;
  warnings: string[];
  errors: string[];
  elapsedMs: number;
}
