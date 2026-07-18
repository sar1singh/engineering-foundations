import {
  NormalizedDocument,
  DuplicateGroup,
  CollapsedDocument,
  OverlapWarning,
  EducationalCollision,
  BatchDuplicateCollapseResult
} from './types';
import { createHash } from 'crypto';

function getSourceTrustScore(profile: { trustLevel: 'high' | 'medium' | 'low' }): number {
  if (profile.trustLevel === 'high') return 100;
  if (profile.trustLevel === 'medium') return 50;
  return 10;
}

function getCanonicalRepresentative(urls: string[], docs: NormalizedDocument[]): string {
  const sorted = [...urls].sort((a, b) => {
    const docA = docs.find(d => d.url === a);
    const docB = docs.find(d => d.url === b);
    const scoreA = docA ? getSourceTrustScore(docA.sourceProfile) : 0;
    const scoreB = docB ? getSourceTrustScore(docB.sourceProfile) : 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return a.length - b.length;
  });
  return sorted[0] || '';
}

function extractCommonTopics(urls: string[], docs: NormalizedDocument[]): string[] {
  const common = new Set<string>();
  for (const url of urls) {
    const doc = docs.find(d => d.url === url);
    if (doc) {
      common.add(doc.sourceProfile.educationalCategory);
    }
  }
  return Array.from(common).filter(Boolean);
}

function calculateTitleSimilarity(title1: string, title2: string): number {
  if (!title1 || !title2) return 0;
  const tokens1 = title1.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  const tokens2 = title2.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  if (tokens1.length === 0 || tokens2.length === 0) return 0;
  const common = tokens1.filter(t => tokens2.includes(t));
  return (common.length * 2) / (tokens1.length + tokens2.length);
}

function groupByTitleSimilarity(docs: NormalizedDocument[]): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];
  const processed = new Set<string>();

  const sortedDocs = [...docs].sort((a, b) => {
    return getSourceTrustScore(b.sourceProfile) - getSourceTrustScore(a.sourceProfile);
  });

  for (let i = 0; i < sortedDocs.length; i++) {
    if (processed.has(sortedDocs[i].url)) continue;

    const group: string[] = [sortedDocs[i].url];
    processed.add(sortedDocs[i].url);

    for (let j = i + 1; j < sortedDocs.length; j++) {
      if (processed.has(sortedDocs[j].url)) continue;

      const sim = calculateTitleSimilarity(sortedDocs[i].normalizedContent.title, sortedDocs[j].normalizedContent.title);
      if (sim > 0.8) {
        group.push(sortedDocs[j].url);
        processed.add(sortedDocs[j].url);
      }
    }

    if (group.length > 1) {
      groups.push({
        groupId: `title-overlap-${group.sort().join(',')}`,
        reason: 'topic-overlap',
        sourceDocuments: group,
        canonicalRepresentative: getCanonicalRepresentative(group, docs),
        confidenceScore: Math.round(80 + (group.length - 1) * 5),
        overlappingTopics: extractCommonTopics(group, docs)
      });
    }
  }

  return groups;
}

function groupByHeadingOverlap(docs: NormalizedDocument[]): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];
  const processed = new Set<string>();

  for (let i = 0; i < docs.length; i++) {
    if (processed.has(docs[i].url)) continue;
    const group: string[] = [docs[i].url];

    for (let j = i + 1; j < docs.length; j++) {
      if (processed.has(docs[j].url)) continue;
      const h1 = docs[i].normalizedContent.headings;
      const h2 = docs[j].normalizedContent.headings;
      if (h1.length > 0 && h2.length > 0) {
        const intersection = h1.filter(x => h2.includes(x));
        const overlap = intersection.length / Math.min(h1.length, h2.length);
        if (overlap > 0.7) {
          group.push(docs[j].url);
          processed.add(docs[j].url);
        }
      }
    }

    if (group.length > 1) {
      processed.add(docs[i].url);
      groups.push({
        groupId: `heading-overlap-${group.sort().join(',')}`,
        reason: 'roadmap-overlap',
        sourceDocuments: group,
        canonicalRepresentative: getCanonicalRepresentative(group, docs),
        confidenceScore: 85,
        overlappingTopics: extractCommonTopics(group, docs)
      });
    }
  }

  return groups;
}

function groupByEducationalCategory(docs: NormalizedDocument[]): DuplicateGroup[] {
  const map = new Map<string, string[]>();

  for (const doc of docs) {
    if (!map.has(doc.sourceProfile.educationalCategory)) {
      map.set(doc.sourceProfile.educationalCategory, []);
    }
    map.get(doc.sourceProfile.educationalCategory)!.push(doc.url);
  }

  return Array.from(map.entries())
    .filter(([_, urls]) => urls.length > 1)
    .map(([category, urls]) => ({
      groupId: `category-overlap-${category}`,
      reason: 'educational-collision' as const,
      sourceDocuments: urls,
      canonicalRepresentative: getCanonicalRepresentative(urls, docs),
      confidenceScore: 70,
      overlappingTopics: [category]
    }));
}

function generateCollapsedDocuments(groups: DuplicateGroup[]): CollapsedDocument[] {
  return groups.reduce((acc, group) => {
    acc.push(...group.sourceDocuments.map(url => ({
      originalUrl: url,
      collapsedToUrl: group.canonicalRepresentative
    })));
    return acc;
  }, [] as CollapsedDocument[]);
}

function generateOverlapWarnings(groups: DuplicateGroup[]): OverlapWarning[] {
  return groups.map(group => ({
    warningId: `warning-${group.groupId}`,
    message: `Detected ${group.sourceDocuments.length} overlapping documents about ${group.overlappingTopics.join(',')}`,
    involvedDocuments: group.sourceDocuments
  }));
}

function generateEducationalCollisions(groups: DuplicateGroup[]): EducationalCollision[] {
  return groups.map(group => ({
    collisionId: `collision-${group.groupId}`,
    topic: group.overlappingTopics[0] || 'unknown',
    involvedDocuments: group.sourceDocuments,
    overlapScore: group.confidenceScore,
    collisionType: 'duplicate-topic' as const,
    recommendation: group.confidenceScore > 90 ? ('merge' as const) : ('review' as const)
  }));
}

export async function runBatchDuplicateCollapseAgent(
  docs: NormalizedDocument[]
): Promise<BatchDuplicateCollapseResult> {
  const startedAt = Date.now();
  const titleGroups = groupByTitleSimilarity(docs);
  const headingGroups = groupByHeadingOverlap(docs);
  const categoryGroups = groupByEducationalCategory(docs);

  const allGroups = [...titleGroups, ...headingGroups, ...categoryGroups];

  const uniqueGroupsMap = new Map<string, DuplicateGroup>();
  allGroups.forEach(g => uniqueGroupsMap.set(g.groupId, g));
  const duplicateGroups = Array.from(uniqueGroupsMap.values());

  const collapsedDocuments = generateCollapsedDocuments(duplicateGroups);
  const overlapWarnings = generateOverlapWarnings(duplicateGroups);
  const educationalCollisions = generateEducationalCollisions(duplicateGroups);

  const hashInput = JSON.stringify({
    duplicateGroups: duplicateGroups.map(g => g.groupId).sort(),
    collapsed: collapsedDocuments.map(c => c.originalUrl).sort()
  });
  const deterministicReplayHash = createHash('sha256').update(hashInput).digest('hex');

  return {
    success: true,
    duplicateGroups,
    collapsedDocuments,
    overlapWarnings,
    educationalCollisions,
    deterministicReplayHash,
    warnings: [],
    errors: [],
    elapsedMs: Date.now() - startedAt
  };
}
