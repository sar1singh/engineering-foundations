import { describe, expect, it } from "vitest";
import type { ApprovedBatchPatchOutput } from "./approved-batch-patch-output-service";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";
import {
  applyPatchToInMemoryGraph,
  compareGraphBeforeAfter,
  rollbackInMemoryGraphImport,
  summarizeGraphImport,
  validateInMemoryGraphImport,
} from "./in-memory-graph-import-service";

const baseSource = {
  type: "source" as const,
  operation: "add" as const,
  sourceId: "pack-11f-source",
  title: "Pack 11F Source",
  url: "https://example.com/pack-11f-source",
  sourceType: "engineering-blog" as const,
  category: "System Design",
  tier: "tier-2" as const,
  reliability: "high" as const,
  founderBetaRelevance: "Import preview source.",
};

const baseTopic = {
  type: "topic" as const,
  operation: "add" as const,
  topicId: "topic-pack-11f-import-preview",
  topicName: "Pack 11F Import Preview",
  domainId: "domain-system-design",
  capabilityIds: ["cap-system-design-hld"],
  skillIds: ["skill-hld-requirements"],
  sourceIds: ["pack-11f-source"],
  description: "Import preview topic.",
};

function output(entries: ApprovedBatchPatchOutput["approvedEntries"]): ApprovedBatchPatchOutput {
  return {
    id: "batch-patch-test",
    title: "Approved Batch Import Patch",
    description: "Test output",
    sourcePatch: {
      id: "patch-test",
      title: "Patch",
      description: "Patch",
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
    approvedEntries: entries,
    rejectedEntries: [],
    pendingEntries: [],
    conflicts: [],
    warnings: [],
    rollbackNotes: [],
    summary: {
      totalEntries: entries.length,
      approvedCount: entries.length,
      rejectedCount: 0,
      pendingCount: 0,
      hasConflicts: false,
      hasWarnings: false,
      hasApprovedEntries: entries.length > 0,
    },
    generatedAt: "2026-06-13T00:00:00.000Z",
    outputPath: "data/ingestion/generated/approved-import-patch.preview.json",
  };
}

describe("applyPatchToInMemoryGraph", () => {
  it("applies approved patch entries in memory", () => {
    const result = applyPatchToInMemoryGraph(output([baseSource, baseTopic]));

    expect(result.addedSources).toHaveLength(1);
    expect(result.addedTopics).toHaveLength(1);
    expect(result.afterCounts.sources).toBe(result.beforeCounts.sources + 1);
    expect(result.afterCounts.topics).toBe(result.beforeCounts.topics + 1);
  });

  it("does not mutate canonical data", () => {
    const beforeSourceCount = founderBetaSourceCatalog.length;
    const beforeTopicCount = founderBetaMasterTopics.length;

    applyPatchToInMemoryGraph(output([baseSource, baseTopic]));

    expect(founderBetaSourceCatalog).toHaveLength(beforeSourceCount);
    expect(founderBetaMasterTopics).toHaveLength(beforeTopicCount);
  });

  it("blocks duplicate topic IDs", () => {
    const duplicateTopic = {
      ...baseTopic,
      topicId: founderBetaMasterTopics[0].id,
      sourceIds: [baseSource.sourceId],
    };

    const result = applyPatchToInMemoryGraph(output([baseSource, duplicateTopic]));

    expect(result.addedTopics).toHaveLength(0);
    expect(result.skippedEntries.some((entry) => entry.entryId === duplicateTopic.topicId)).toBe(true);
    expect(result.conflicts.some((item) => item.field === "topicId")).toBe(true);
  });

  it("blocks duplicate source URLs unless override is enabled", () => {
    const duplicateSource = {
      ...baseSource,
      sourceId: "pack-11f-duplicate-url",
      url: founderBetaSourceCatalog[0].url,
    };

    const blocked = applyPatchToInMemoryGraph(output([duplicateSource]));
    const allowed = applyPatchToInMemoryGraph(output([duplicateSource]), {
      allowDuplicateSourceUrls: true,
    });

    expect(blocked.addedSources).toHaveLength(0);
    expect(blocked.conflicts.some((item) => item.field === "url")).toBe(true);
    expect(allowed.addedSources).toHaveLength(1);
  });

  it("blocks invalid skill and capability IDs", () => {
    const invalidTopic = {
      ...baseTopic,
      capabilityIds: ["cap-does-not-exist"],
      skillIds: ["skill-does-not-exist"],
    };

    const result = applyPatchToInMemoryGraph(output([baseSource, invalidTopic]));

    expect(result.addedTopics).toHaveLength(0);
    expect(result.conflicts.some((item) => item.field === "capabilityIds")).toBe(true);
    expect(result.conflicts.some((item) => item.field === "skillIds")).toBe(true);
  });

  it("rolls back preview counts", () => {
    const result = applyPatchToInMemoryGraph(output([baseSource, baseTopic]));
    const rolledBack = rollbackInMemoryGraphImport(result);

    expect(rolledBack.sources).toHaveLength(result.beforeCounts.sources);
    expect(rolledBack.topics).toHaveLength(result.beforeCounts.topics);
  });

  it("returns a deterministic before and after summary", () => {
    const first = applyPatchToInMemoryGraph(output([baseSource, baseTopic]));
    const second = applyPatchToInMemoryGraph(output([baseSource, baseTopic]));

    expect(compareGraphBeforeAfter(first)).toEqual(compareGraphBeforeAfter(second));
    expect(summarizeGraphImport(first)).toBe(summarizeGraphImport(second));
  });

  it("reports conflicts in validation", () => {
    const duplicateSource = {
      ...baseSource,
      sourceId: founderBetaSourceCatalog[0].id,
    };
    const result = applyPatchToInMemoryGraph(output([duplicateSource]));
    const validation = validateInMemoryGraphImport(result);

    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
});
