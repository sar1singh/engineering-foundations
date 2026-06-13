import type { SourceProfile } from '@/data/runtime-fetch-source-profiles';
import type { DocumentReference } from '@/types/multi-document-ingestion';
import { getSourceProfile } from '@/data/runtime-fetch-source-profiles';
import { normalizePath } from '@/lib/utils/path-utils';

/**
 * Deterministically expands a source family into a bounded set of document URLs.
 * Only URLs that match the profile's `allowedExpansionPaths` are emitted.
 * The ordering is lexicographic on the normalized path to guarantee replayability.
 */
export function discoverFamilyDocuments(
  baseUrl: string,
  profile: SourceProfile
): DocumentReference[] {
  const allowed = profile.allowedExpansionPaths ?? [];
  const blocked = profile.blockedExpansionPaths ?? [];
  const discovered: DocumentReference[] = [];

  // Helper to test a candidate path against allow/block globs.
  const matchesAllowed = (p: string) =>
    allowed.length === 0 || allowed.some((g) => new RegExp('^' + g.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*') + '$').test(p));
  const matchesBlocked = (p: string) =>
    blocked.some((g) => new RegExp('^' + g.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*') + '$').test(p));

  // In the current implementation we cannot crawl the repo, so we rely on a static
  // manifest that is part of the source profile. The profile provides an explicit list
  // of document URLs to include. This satisfies the "no crawling" guarantee.
  const explicitDocs = profile.explicitDocumentUrls ?? [];
  for (const rawUrl of explicitDocs) {
    const normalized = normalizePath(rawUrl);
    if (matchesAllowed(normalized) && !matchesBlocked(normalized)) {
      discovered.push({ url: normalized, sourceProfile: profile });
    }
  }

  // Deterministic ordering – lexical sort of URLs.
  discovered.sort((a, b) => (a.url < b.url ? -1 : a.url > b.url ? 1 : 0));
  return discovered;
}
