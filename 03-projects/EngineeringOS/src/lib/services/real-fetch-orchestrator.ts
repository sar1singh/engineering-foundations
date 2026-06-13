// src/lib/services/real-fetch-orchestrator.ts
import { SourceFamilyProfile } from './runtime-fetch-source-profiles';
import { fetchDocumentContent } from './document-fetcher';
import { normalizeDocumentContent } from './normalization-engine';
import { runBatchDuplicateCollapseAgent } from './batch-duplicate-collapse-agent';
import { runEducationalClusteringAgent } from './educational-clustering-agent';
import { runTopicOverlapAnalysis } from './topic-overlap-agent';
import { extractSyllabusFamily } from './syllabus-family-agent';
import { buildReviewBatchPackage } from './review-batch-builder';

export async function realFetchOrchestrator(sourceFamily: string): Promise<void> {
  // 1. Load source family profile
  const profile = SourceFamilyProfile[sourceFamily];
  if (!profile) throw new Error(`No source family profile for ${sourceFamily}`);

  // 2. Deterministic discovery & controlled fetch
  const rawDocuments = await fetchDocumentContent(profile);

  // 3. Content normalization
  const normalizedDocs = await normalizeDocumentContent(rawDocuments);

  // 4. Metadata extraction
  // (already handled in normalization step)

  // 5. Duplicate collapse
  const duplicateResult = await runBatchDuplicateCollapseAgent(normalizedDocs);

  // 6. Educational clustering
  const clusterResult = await runEducationalClusteringAgent(normalizedDocs);

  // 7. Topic overlap analysis
  const overlapResult = await runTopicOverlapAnalysis(normalizedDocs);

  // 8. Syllabus extraction
  const syllabusResult = await extractSyllabusFamily(normalizedDocs);

  // 9. Review batch generation
  const reviewBatch = await buildReviewBatchPackage({
    sourceFamily,
    rawDocuments,
    normalizedDocs,
    duplicateResult,
    clusterResult,
    overlapResult,
    syllabusResult
  });

  console.log(`✅ Ingestion pipeline completed for ${sourceFamily}`);
  console.log(`Duplicates collapsed: ${duplicateResult.collapsedDocuments.length}`);
  console.log(`Review batch generated: ${reviewBatch.reviewRequired}`);
}
