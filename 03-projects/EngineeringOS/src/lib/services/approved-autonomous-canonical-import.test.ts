import { describe, it, expect } from "vitest";
import type { ApprovedImportCandidate } from "@/types/ingestion-patch";
import type { ApprovedImportPackage } from "@/types/import-review";
import type { CanonicalGraphPatchProposal } from "@/types/canonical-graph-patch";
import approvedFixture from "../../../data/ingestion/approved-autonomous-canonical-import.json";
import { generatePatchFromApprovedCandidates } from "./approved-import-patch-generator";
import { createImportReviewPackage, approvePatchEntry } from "./import-review-service";
import { createApprovedBatchPatch } from "./approved-batch-patch-output-service";
import { convertBatchPatchOutputToProposal, applyApprovedBatchGraphImport } from "./approved-batch-graph-import-service";
import { founderBetaSourceCatalog } from "@/data/founder-beta";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaCapabilities } from "@/data/founder-beta";

const fixture = approvedFixture as typeof approvedFixture;
const SOURCE_IDS = ["aws-eventbridge-pipes", "grpc-core-concepts", "nodejs-diagnostics-guide"];
const TOPIC_IDS = ["topic-aws-eventbridge-pipes", "topic-grpc-core-concepts", "topic-nodejs-diagnostics"];

function buildCandidates(): ApprovedImportCandidate[] {
  return fixture.candidates.map((c) => ({
    candidateUrl: c.url,
    candidateId: c.candidateId,
    title: c.title,
    sourceType: c.sourceType as ApprovedImportCandidate["sourceType"],
    category: c.category,
    description: c.reasonForAcceptance,
    tier: c.tier as ApprovedImportCandidate["tier"],
    reliability: c.reliability as ApprovedImportCandidate["reliability"],
    overrideDuplicateRisk: true,
    proposedSourceId: c.proposedSourceId,
    proposedTopicId: c.proposedTopicId,
  }));
}

function approveAll(pkg: ApprovedImportPackage): ApprovedImportPackage {
  let updated = pkg;
  for (let i = 0; i < pkg.reviewItems.length; i++) {
    updated = approvePatchEntry(updated, i, "Approved for Pack 12D autonomous import");
  }
  return updated;
}

describe("approved autonomous import fixture", () => {
  it("fixture has 3 candidates", () => {
    expect(fixture.candidates).toHaveLength(3);
  });

  it("fixture has 3 source entries", () => {
    expect(fixture.entries.sources).toHaveLength(3);
  });

  it("fixture has 3 topic entries", () => {
    expect(fixture.entries.topics).toHaveLength(3);
  });

  it("proposed source IDs are present in catalog after manual apply", () => {
    const existingIds = new Set(founderBetaSourceCatalog.map((s) => s.id));
    for (const id of SOURCE_IDS) {
      expect(existingIds.has(id)).toBe(true);
    }
  });

  it("proposed topic IDs are present in master topics after manual apply", () => {
    const existingIds = new Set(founderBetaMasterTopics.map((t) => t.id));
    for (const id of TOPIC_IDS) {
      expect(existingIds.has(id)).toBe(true);
    }
  });

  it("proposed URLs are present in catalog after manual apply", () => {
    const existingUrls = new Set(founderBetaSourceCatalog.map((s) => s.url.toLowerCase().replace(/\/+$/, "")));
    for (const entry of fixture.entries.sources) {
      const normalized = entry.url.toLowerCase().replace(/\/+$/, "");
      expect(existingUrls.has(normalized)).toBe(true);
    }
  });

  it("all capability IDs are valid", () => {
    const validIds = new Set(founderBetaCapabilities.map((c) => c.id));
    for (const topic of fixture.entries.topics) {
      for (const capId of topic.capabilityIds) {
        expect(validIds.has(capId)).toBe(true);
      }
    }
  });

  it("source IDs referenced in topics include the new source", () => {
    for (const topic of fixture.entries.topics) {
      const matchingSource = fixture.entries.sources.find(
        (s) => topic.sourceIds.includes(s.sourceId)
      );
      expect(matchingSource).toBeDefined();
    }
  });
});

describe("approved autonomous import pipeline validation", () => {
  it("generates patch from approved candidates", () => {
    const candidates = buildCandidates();
    const patch = generatePatchFromApprovedCandidates(candidates);
    expect(patch.entries.length).toBeGreaterThan(0);
    expect(patch.report.entriesGenerated).toBe(patch.entries.length);
  });

  it("creates review package with correct entry count", () => {
    const candidates = buildCandidates();
    const patch = generatePatchFromApprovedCandidates(candidates);
    const pkg = createImportReviewPackage(patch);
    expect(pkg.reviewItems.length).toBeGreaterThan(0);
    expect(pkg.summary.totalEntries).toBe(pkg.reviewItems.length);
  });

  it("approves all entries and produces batch output", () => {
    const candidates = buildCandidates();
    const patch = generatePatchFromApprovedCandidates(candidates);
    const pkg = approveAll(createImportReviewPackage(patch));
    const output = createApprovedBatchPatch(pkg);
    expect(output.approvedEntries.length).toBeGreaterThan(0);
    expect(output.summary.approvedCount).toBe(output.approvedEntries.length);
  });

  it("converts batch output to canonical proposal", () => {
    const candidates = buildCandidates();
    const patch = generatePatchFromApprovedCandidates(candidates);
    const pkg = approveAll(createImportReviewPackage(patch));
    const output = createApprovedBatchPatch(pkg);
    const proposal = convertBatchPatchOutputToProposal(output);
    expect(proposal.entries.length).toBeGreaterThan(0);
    expect(proposal.review.approvalStatus).toBe("approved");
  });

  it("apply produces correct result shape", () => {
    const candidates = buildCandidates();
    const patch = generatePatchFromApprovedCandidates(candidates);
    const pkg = approveAll(createImportReviewPackage(patch));
    const output = createApprovedBatchPatch(pkg);
    const result = applyApprovedBatchGraphImport(output);

    expect(result).toHaveProperty("proposalId");
    expect(result).toHaveProperty("appliedSources");
    expect(result).toHaveProperty("appliedTopics");
    expect(result).toHaveProperty("skippedEntries");
    expect(result).toHaveProperty("conflicts");
    expect(result).toHaveProperty("beforeCounts");
    expect(result).toHaveProperty("afterCounts");
    expect(result).toHaveProperty("plan");
  });

  it("apply plan references expected files", () => {
    const candidates = buildCandidates();
    const patch = generatePatchFromApprovedCandidates(candidates);
    const pkg = approveAll(createImportReviewPackage(patch));
    const output = createApprovedBatchPatch(pkg);
    const result = applyApprovedBatchGraphImport(output);

    expect(result.plan.sourceIdsToAdd).toHaveLength(3);
    expect(result.plan.topicIdsToAdd).toHaveLength(3);
    expect(result.plan.filesToUpdate).toContain("src/data/founder-beta/source-catalog.ts");
    expect(result.plan.filesToUpdate).toContain("src/data/founder-beta/master-topics.ts");
  });

  it("does not modify canonical arrays", () => {
    const beforeSources = founderBetaSourceCatalog.length;
    const beforeTopics = founderBetaMasterTopics.length;
    const candidates = buildCandidates();
    const patch = generatePatchFromApprovedCandidates(candidates);
    const pkg = approveAll(createImportReviewPackage(patch));
    const output = createApprovedBatchPatch(pkg);
    applyApprovedBatchGraphImport(output);

    expect(founderBetaSourceCatalog.length).toBe(beforeSources);
    expect(founderBetaMasterTopics.length).toBe(beforeTopics);
  });

  it("produces deterministic results for same input", () => {
    const candidates = buildCandidates();
    const patch = generatePatchFromApprovedCandidates(candidates);
    const pkg = approveAll(createImportReviewPackage(patch));
    const output = createApprovedBatchPatch(pkg);
    const first = applyApprovedBatchGraphImport(output);
    const second = applyApprovedBatchGraphImport(output);

    expect(first.appliedSources).toEqual(second.appliedSources);
    expect(first.appliedTopics).toEqual(second.appliedTopics);
  });
});
