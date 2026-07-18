import { SourceFamilyProfile } from './runtime-fetch-source-profiles';
import { fetchDocumentContent } from './document-fetcher';
import { normalizeDocumentContent } from './normalization-engine';
import { runBatchDuplicateCollapseAgent } from './multi-document-ingestion/batch-duplicate-collapse-agent';
import { runEducationalClusteringAgent } from './educational-clustering-agent';
import { runTopicOverlapAnalysis } from './topic-overlap-agent';
import { extractSyllabusFamily } from './syllabus-family-agent';
import { buildReviewBatchPackage, ReviewBatchPackage } from './review-batch-builder';
import fs from 'fs';
import path from 'path';

export async function realFetchOrchestrator(sourceFamily: string): Promise<ReviewBatchPackage> {
  console.log(`🚀 Starting real ingestion for family: ${sourceFamily}`);
  const profile = SourceFamilyProfile[sourceFamily];
  if (!profile) throw new Error(`No source family profile for ${sourceFamily}`);

  const rawDocuments = await fetchDocumentContent(profile);
  console.log(`Fetched ${rawDocuments.length} raw documents.`);

  const normalizedDocs = await normalizeDocumentContent(rawDocuments);
  console.log(`Normalized ${normalizedDocs.length} documents.`);

  const duplicateResult = await runBatchDuplicateCollapseAgent(normalizedDocs);
  console.log(`Duplicates collapsed: ${duplicateResult.collapsedDocuments.length}`);

  const clusterResult = await runEducationalClusteringAgent(normalizedDocs);
  console.log(`Educational clustering found ${clusterResult.clusters.length} clusters.`);

  const overlapResult = await runTopicOverlapAnalysis(normalizedDocs);
  console.log(`Topic overlap score: ${overlapResult.overlapScore}`);

  const syllabusResult = await extractSyllabusFamily(normalizedDocs);
  console.log(`Syllabus tracks extracted: ${syllabusResult.tracks.length}`);

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

  const dir = path.join(__dirname, '../../../../data/review_packages');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const file = path.join(dir, `${sourceFamily}-batch.json`);
  fs.writeFileSync(file, JSON.stringify(reviewBatch, null, 2));
  console.log(`Saved review package to: ${file}`);

  return reviewBatch;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const sourceFamilyArg = args.find(arg => arg.startsWith('--source-family='));
  const sourceFamily = sourceFamilyArg ? sourceFamilyArg.split('=')[1] : 'system-design-primer';
  realFetchOrchestrator(sourceFamily).catch(err => {
    console.error(`Fatal error in orchestrator:`, err);
    process.exit(1);
  });
}
