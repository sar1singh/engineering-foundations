import { NormalizedDocument } from './multi-document-ingestion/types';

export interface Cluster {
  clusterId: string;
  name: string;
  documents: string[];
  topics: string[];
}

export interface EducationalClusteringResult {
  success: boolean;
  clusters: Cluster[];
  elapsedMs: number;
}

export async function runEducationalClusteringAgent(docs: NormalizedDocument[]): Promise<EducationalClusteringResult> {
  const startedAt = Date.now();
  const clusters: Cluster[] = [];

  const categoryMap = new Map<string, string[]>();
  for (const doc of docs) {
    const category = doc.sourceProfile.educationalCategory || 'uncategorized';
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(doc.url);
  }

  categoryMap.forEach((urls, category) => {
    clusters.push({
      clusterId: `cluster-${category}`,
      name: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '),
      documents: urls,
      topics: [category]
    });
  });

  return {
    success: true,
    clusters,
    elapsedMs: Date.now() - startedAt
  };
}
