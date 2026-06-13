import { describe, it, expect } from "vitest";
import type { ApprovedImportCandidate } from "@/types/ingestion-patch";
import type { ApprovedImportPackage } from "@/types/import-review";
import { generatePatchFromApprovedCandidates } from "./approved-import-patch-generator";
import { createImportReviewPackage, approvePatchEntry } from "./import-review-service";
import { createApprovedBatchPatch } from "./approved-batch-patch-output-service";
import {
  convertBatchPatchOutputToProposal,
  applyApprovedBatchGraphImport,
} from "./approved-batch-graph-import-service";
import { founderBetaSourceCatalog } from "@/data/founder-beta";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";

const validCandidate: ApprovedImportCandidate = {
  candidateUrl: "https://example.com/new-article",
  candidateId: "trace-001",
  title: "New Architecture Patterns",
  sourceType: "engineering-blog",
  category: "System Design",
  description: "A deep dive into modern architecture patterns for distributed systems.",
  tier: "tier-1",
  reliability: "high",
  overrideDuplicateRisk: false,
};

const secondCandidate: ApprovedImportCandidate = {
  candidateUrl: "https://blog.example.com/testing",
  candidateId: "trace-002",
  title: "Testing Microservices",
  sourceType: "engineering-blog",
  category: "Testing",
  description: "Best practices for testing microservices architectures.",
  tier: "tier-2",
  reliability: "medium",
  overrideDuplicateRisk: false,
};

function createPackage(candidates: ApprovedImportCandidate[]): ApprovedImportPackage {
  const patch = generatePatchFromApprovedCandidates(candidates);
  return createImportReviewPackage(patch);
}

function approveAllEntries(pkg: ApprovedImportPackage): ApprovedImportPackage {
  let updated = pkg;
  for (let i = 0; i < pkg.reviewItems.length; i++) {
    updated = approvePatchEntry(updated, i, `Approved entry ${i}`);
  }
  return updated;
}

describe("convertBatchPatchOutputToProposal", () => {
  it("converts approved source entries to canonical source entries", () => {
    const pkg = approveAllEntries(createPackage([validCandidate]));
    const output = createApprovedBatchPatch(pkg);
    const proposal = convertBatchPatchOutputToProposal(output);

    expect(proposal.entries.length).toBeGreaterThan(0);
    const sourceEntry = proposal.entries.find((entry): entry is Extract<typeof entry, { type: "source" }> => entry.type === "source");
    expect(sourceEntry).toBeDefined();
    if (sourceEntry) {
      expect(sourceEntry.source.id).toBeDefined();
      expect(sourceEntry.source.url).toBe(validCandidate.candidateUrl);
      expect(sourceEntry.operation).toBe("add");
    }
  });

  it("converts approved topic entries to canonical topic entries", () => {
    const pkg = approveAllEntries(createPackage([validCandidate]));
    const output = createApprovedBatchPatch(pkg);
    const proposal = convertBatchPatchOutputToProposal(output);

    const topicEntry = proposal.entries.find((entry): entry is Extract<typeof entry, { type: "topic" }> => entry.type === "topic");
    expect(topicEntry).toBeDefined();
    if (topicEntry) {
      expect(topicEntry.topic.id).toBeDefined();
      expect(topicEntry.operation).toBe("add");
      expect(topicEntry.topic.prerequisiteTopicIds).toEqual([]);
      expect(topicEntry.topic.relatedTopicIds).toEqual([]);
      expect(topicEntry.topic.confidenceScore).toBe(0.5);
    }
  });

  it("includes both source and topic entries when both are approved", () => {
    const pkg = approveAllEntries(createPackage([validCandidate, secondCandidate]));
    const output = createApprovedBatchPatch(pkg);
    const proposal = convertBatchPatchOutputToProposal(output);

    const sourceCount = proposal.entries.filter((entry) => entry.type === "source").length;
    const topicCount = proposal.entries.filter((entry) => entry.type === "topic").length;
    expect(sourceCount).toBeGreaterThan(0);
    expect(topicCount).toBeGreaterThan(0);
  });

  it("sets review to approved status", () => {
    const pkg = approveAllEntries(createPackage([validCandidate]));
    const output = createApprovedBatchPatch(pkg);
    const proposal = convertBatchPatchOutputToProposal(output);

    expect(proposal.review.reviewRequired).toBe(true);
    expect(proposal.review.approvalStatus).toBe("approved");
    expect(proposal.review.reviewer).toBe("sarwan");
    expect(proposal.review.reviewedAt).toBeTruthy();
  });

  it("copies warnings from batch output to proposal", () => {
    const pkg = createPackage([validCandidate]);
    const output = createApprovedBatchPatch(pkg);
    const proposal = convertBatchPatchOutputToProposal(output);

    expect(proposal.warnings.length).toBeGreaterThan(0);
    expect(proposal.warnings.some((w) => w.includes("No approved entries"))).toBe(true);
  });

  it("produces proposal with correct id and packageId", () => {
    const pkg = approveAllEntries(createPackage([validCandidate]));
    const output = createApprovedBatchPatch(pkg);
    const proposal = convertBatchPatchOutputToProposal(output);

    expect(proposal.id).toContain(output.id);
    expect(proposal.packageId).toBe(output.id);
    expect(proposal.patchId).toBe(output.sourcePatch.id);
  });
});

describe("applyApprovedBatchGraphImport", () => {
  it("applies approved batch entries to in-memory graph", () => {
    const pkg = approveAllEntries(createPackage([validCandidate]));
    const output = createApprovedBatchPatch(pkg);
    const result = applyApprovedBatchGraphImport(output);

    expect(result.appliedSources.length).toBeGreaterThan(0);
    expect(result.appliedTopics.length).toBeGreaterThan(0);
  });

  it("reports correct before and after counts", () => {
    const pkg = approveAllEntries(createPackage([validCandidate]));
    const output = createApprovedBatchPatch(pkg);
    const result = applyApprovedBatchGraphImport(output);

    const expectedSourceAdds = output.approvedEntries.filter((e) => e.type === "source").length;
    const expectedTopicAdds = output.approvedEntries.filter((e) => e.type === "topic").length;
    expect(result.afterCounts.sources).toBe(result.beforeCounts.sources + expectedSourceAdds);
    expect(result.afterCounts.topics).toBe(result.beforeCounts.topics + expectedTopicAdds);
  });

  it("skips entries when no approved entries exist", () => {
    const pkg = createPackage([validCandidate]);
    const output = createApprovedBatchPatch(pkg);
    const result = applyApprovedBatchGraphImport(output);

    expect(result.appliedSources).toHaveLength(0);
    expect(result.appliedTopics).toHaveLength(0);
    expect(result.skippedEntries.length).toBe(output.approvedEntries.length);
  });

  it("generates an apply plan", () => {
    const pkg = approveAllEntries(createPackage([validCandidate]));
    const output = createApprovedBatchPatch(pkg);
    const result = applyApprovedBatchGraphImport(output);

    expect(result.plan.filesToUpdate.length).toBeGreaterThan(0);
    expect(result.plan.rollbackNotes.length).toBeGreaterThan(0);
    expect(result.plan.sourceIdsToAdd.length).toBeGreaterThan(0);
  });

  it("applies without conflicts for clean batch output", () => {
    const pkg = approveAllEntries(createPackage([validCandidate]));
    const output = createApprovedBatchPatch(pkg);
    const result = applyApprovedBatchGraphImport(output);

    expect(result.conflicts.filter((c) => c.startsWith("Duplicate"))).toHaveLength(0);
  });

  it("preserves entry data in applied sources", () => {
    const pkg = approveAllEntries(createPackage([validCandidate]));
    const output = createApprovedBatchPatch(pkg);
    const result = applyApprovedBatchGraphImport(output);

    const sourceEntry = output.approvedEntries.find((e) => e.type === "source");
    if (sourceEntry?.type === "source") {
      const applied = result.graph.sources.find((s) => s.id === sourceEntry.sourceId);
      expect(applied).toBeDefined();
      expect(applied?.title).toBe(sourceEntry.title);
      expect(applied?.url).toBe(sourceEntry.url);
    }
  });

  it("does not modify canonical source catalog array", () => {
    const beforeCount = founderBetaSourceCatalog.length;
    const pkg = approveAllEntries(createPackage([validCandidate]));
    const output = createApprovedBatchPatch(pkg);
    applyApprovedBatchGraphImport(output);

    expect(founderBetaSourceCatalog.length).toBe(beforeCount);
  });

  it("does not modify canonical master topics array", () => {
    const beforeCount = founderBetaMasterTopics.length;
    const pkg = approveAllEntries(createPackage([validCandidate]));
    const output = createApprovedBatchPatch(pkg);
    applyApprovedBatchGraphImport(output);

    expect(founderBetaMasterTopics.length).toBe(beforeCount);
  });

  it("applies all entries when multiple candidates are approved", () => {
    const pkg = approveAllEntries(createPackage([validCandidate, secondCandidate]));
    const output = createApprovedBatchPatch(pkg);
    const result = applyApprovedBatchGraphImport(output);

    const approvedSourceCount = output.approvedEntries.filter((e) => e.type === "source").length;
    const approvedTopicCount = output.approvedEntries.filter((e) => e.type === "topic").length;
    expect(result.appliedSources.length).toBe(approvedSourceCount);
    expect(result.appliedTopics.length).toBe(approvedTopicCount);
  });

  it("generates deterministic summary for same input", () => {
    const pkg = approveAllEntries(createPackage([validCandidate]));
    const output = createApprovedBatchPatch(pkg);
    const first = applyApprovedBatchGraphImport(output);
    const second = applyApprovedBatchGraphImport(output);

    const summary1 = `sources:+${first.afterCounts.sources - first.beforeCounts.sources} | topics:+${first.afterCounts.topics - first.beforeCounts.topics} | skipped:${first.skippedEntries.length} | conflicts:${first.conflicts.length} | files:${first.plan.filesToUpdate.length}`;
    const summary2 = `sources:+${second.afterCounts.sources - second.beforeCounts.sources} | topics:+${second.afterCounts.topics - second.beforeCounts.topics} | skipped:${second.skippedEntries.length} | conflicts:${second.conflicts.length} | files:${second.plan.filesToUpdate.length}`;
    expect(summary1).toBe(summary2);
  });
});
