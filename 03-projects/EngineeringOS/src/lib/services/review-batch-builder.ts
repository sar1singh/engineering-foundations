import { RawDocument } from './document-fetcher';
import { NormalizedDocument, BatchDuplicateCollapseResult, EducationalCollision } from './multi-document-ingestion/types';
import { EducationalClusteringResult } from './educational-clustering-agent';
import { TopicOverlapReport } from './topic-overlap-agent';
import { SyllabusExtractionResult } from './syllabus-family-agent';
import { createHash } from 'crypto';

export interface ReviewBatchPackage {
  sourceFamily: string;
  reviewRequired: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rawDocumentsCount: number;
  normalizedDocsCount: number;
  duplicateSummary: {
    totalGroups: number;
    totalCollapsed: number;
  };
  educationalCollisions: EducationalCollision[];
  trustSummary: Record<string, string>;
  syllabusSummary: {
    totalTracks: number;
  };
  clusterSummary: {
    totalClusters: number;
    clusters: { id: string; name: string; docCount: number }[];
  };
  overlapWarnings: string[];
  replayTrace: {
    timestamp: string;
    replayHash: string;
  };
}

export async function buildReviewBatchPackage(params: {
  sourceFamily: string;
  rawDocuments: RawDocument[];
  normalizedDocs: NormalizedDocument[];
  duplicateResult: BatchDuplicateCollapseResult;
  clusterResult: EducationalClusteringResult;
  overlapResult: TopicOverlapReport;
  syllabusResult: SyllabusExtractionResult;
}): Promise<ReviewBatchPackage> {
  const trustSummary: Record<string, string> = {};
  params.normalizedDocs.forEach(d => {
    trustSummary[d.url] = d.sourceProfile.trustLevel;
  });

  const replayHashInput = JSON.stringify({
    sourceFamily: params.sourceFamily,
    urls: params.normalizedDocs.map(d => d.url).sort(),
    dupHash: params.duplicateResult.deterministicReplayHash
  });
  const replayHash = createHash('sha256').update(replayHashInput).digest('hex');

  return {
    sourceFamily: params.sourceFamily,
    reviewRequired: true,
    approvalStatus: 'pending',
    rawDocumentsCount: params.rawDocuments.length,
    normalizedDocsCount: params.normalizedDocs.length,
    duplicateSummary: {
      totalGroups: params.duplicateResult.duplicateGroups.length,
      totalCollapsed: params.duplicateResult.collapsedDocuments.length
    },
    educationalCollisions: params.duplicateResult.educationalCollisions,
    trustSummary,
    syllabusSummary: {
      totalTracks: params.syllabusResult.tracks.length
    },
    clusterSummary: {
      totalClusters: params.clusterResult.clusters.length,
      clusters: params.clusterResult.clusters.map(c => ({
        id: c.clusterId,
        name: c.name,
        docCount: c.documents.length
      }))
    },
    overlapWarnings: params.overlapResult.warnings,
    replayTrace: {
      timestamp: new Date().toISOString(),
      replayHash
    }
  };
}
