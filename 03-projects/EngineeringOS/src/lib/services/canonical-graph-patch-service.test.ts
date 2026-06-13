import { describe, expect, it } from "vitest";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";
import type { PatchEntry } from "@/types/ingestion-patch";
import type { ApprovedImportPackage } from "@/types/import-review";
import {
  detectCanonicalPatchConflicts,
  generateCanonicalPatchProposal,
  serializeCanonicalPatchProposal,
  summarizeCanonicalPatchProposal,
  validateCanonicalPatchProposal,
} from "./canonical-graph-patch-service";

const sourceEntry = {
  type: "source",
  operation: "add",
  sourceId: "pack-11g-source",
  title: "Pack 11G Source",
  url: "https://example.com/pack-11g-source",
  sourceType: "engineering-blog",
  category: "System Design",
  tier: "tier-2",
  reliability: "high",
  founderBetaRelevance: "Pack 11G canonical patch proposal test source.",
} satisfies PatchEntry;

const topicEntry = {
  type: "topic",
  operation: "add",
  topicId: "topic-pack-11g-canonical-proposal",
  topicName: "Pack 11G Canonical Proposal",
  domainId: "domain-system-design",
  capabilityIds: ["cap-system-design-hld"],
  skillIds: ["skill-hld-requirements"],
  sourceIds: ["pack-11g-source"],
  description: "Pack 11G canonical patch proposal test topic.",
} satisfies PatchEntry;

function createPackage(entries: PatchEntry[]): ApprovedImportPackage {
  return {
    id: "import-pkg-pack-11g",
    patch: {
      id: "patch-pack-11g",
      title: "Pack 11G Patch",
      description: "Pack 11G test patch",
      entries,
      conflicts: [],
      report: {
        totalCandidates: 1,
        candidatesProcessed: 1,
        candidatesSkipped: 0,
        entriesGenerated: entries.length,
        topicEntries: entries.filter((entry) => entry.type === "topic").length,
        sourceEntries: entries.filter((entry) => entry.type === "source").length,
        capabilityEntries: entries.filter((entry) => entry.type === "capability").length,
        conflicts: [],
        generatedAt: "2026-06-13T00:00:00.000Z",
      },
      generatedAt: "2026-06-13T00:00:00.000Z",
    },
    reviewItems: entries.map((entry, index) => ({
      patchId: "patch-pack-11g",
      entryIndex: index,
      entry,
      decision: "approved",
      reviewNotes: "Approved for proposal",
      reviewedAt: "2026-06-13T00:00:00.000Z",
    })),
    approvedEntries: entries,
    rejectedEntries: [],
    conflicts: [],
    summary: {
      patchId: "patch-pack-11g",
      totalEntries: entries.length,
      approvedCount: entries.length,
      rejectedCount: 0,
      needsReviewCount: 0,
      pendingCount: 0,
      conflicts: [],
      createdAt: "2026-06-13T00:00:00.000Z",
    },
    applicationPlan: {
      patchId: "patch-pack-11g",
      patchTitle: "Pack 11G Patch",
      topicsToAdd: [],
      sourcesToAdd: [],
      capabilitiesImpacted: [],
      skillsImpacted: [],
      duplicateRisks: [],
      reviewNotes: [],
      generatedAt: "2026-06-13T00:00:00.000Z",
    },
    createdAt: "2026-06-13T00:00:00.000Z",
  };
}

describe("canonical graph patch proposal service", () => {
  it("generates a valid proposal from approved entries", () => {
    const proposal = generateCanonicalPatchProposal(createPackage([sourceEntry, topicEntry]));

    expect(proposal.entries).toHaveLength(2);
    expect(proposal.summary.sourceAdds).toBe(1);
    expect(proposal.summary.topicAdds).toBe(1);
    expect(proposal.summary.affectedCapabilityIds).toContain("cap-system-design-hld");
    expect(proposal.summary.affectedSkillIds).toContain("skill-hld-requirements");
    expect(proposal.review.reviewRequired).toBe(true);
    expect(proposal.review.approvalStatus).toBe("pending");
  });

  it("detects duplicate conflicts", () => {
    const duplicateSource = {
      ...sourceEntry,
      sourceId: founderBetaSourceCatalog[0].id,
      url: founderBetaSourceCatalog[0].url,
    } satisfies PatchEntry;
    const duplicateTopic = {
      ...topicEntry,
      topicId: founderBetaMasterTopics[0].id,
    } satisfies PatchEntry;

    const conflicts = detectCanonicalPatchConflicts(createPackage([duplicateSource, duplicateTopic]));

    expect(conflicts.some((item) => item.field === "sourceId")).toBe(true);
    expect(conflicts.some((item) => item.field === "url")).toBe(true);
    expect(conflicts.some((item) => item.field === "topicId")).toBe(true);
  });

  it("reports missing capability references", () => {
    const invalidTopic = {
      ...topicEntry,
      capabilityIds: ["cap-missing"],
    } satisfies PatchEntry;

    const proposal = generateCanonicalPatchProposal(createPackage([sourceEntry, invalidTopic]));

    expect(proposal.conflicts.some((item) => item.field === "capabilityIds")).toBe(true);
    expect(validateCanonicalPatchProposal(proposal).valid).toBe(false);
  });

  it("reports missing skill references", () => {
    const invalidTopic = {
      ...topicEntry,
      skillIds: ["skill-missing"],
    } satisfies PatchEntry;

    const proposal = generateCanonicalPatchProposal(createPackage([sourceEntry, invalidTopic]));

    expect(proposal.conflicts.some((item) => item.field === "skillIds")).toBe(true);
    expect(validateCanonicalPatchProposal(proposal).valid).toBe(false);
  });

  it("generates a deterministic summary", () => {
    const proposal = generateCanonicalPatchProposal(createPackage([sourceEntry, topicEntry]));
    const summary = summarizeCanonicalPatchProposal(proposal);

    expect(summary.totalApprovedEntries).toBe(2);
    expect(summary.conflictCount).toBe(0);
    expect(summary.warningCount).toBe(1);
    expect(summary.hasBlockingConflicts).toBe(false);
  });

  it("serializes proposal JSON", () => {
    const proposal = generateCanonicalPatchProposal(createPackage([sourceEntry, topicEntry]));
    const serialized = serializeCanonicalPatchProposal(proposal);

    expect(() => JSON.parse(serialized)).not.toThrow();
    expect(JSON.parse(serialized).review.reviewRequired).toBe(true);
  });

  it("always requires pending human review", () => {
    const proposal = generateCanonicalPatchProposal(createPackage([sourceEntry, topicEntry]));

    expect(proposal.review).toEqual({
      reviewRequired: true,
      approvalStatus: "pending",
      reviewer: null,
      reviewedAt: null,
      notes: ["Human review required before graph update."],
    });
  });

  it("does not mutate canonical graph arrays", () => {
    const beforeSources = founderBetaSourceCatalog.length;
    const beforeTopics = founderBetaMasterTopics.length;

    generateCanonicalPatchProposal(createPackage([sourceEntry, topicEntry]));

    expect(founderBetaSourceCatalog).toHaveLength(beforeSources);
    expect(founderBetaMasterTopics).toHaveLength(beforeTopics);
  });
});
