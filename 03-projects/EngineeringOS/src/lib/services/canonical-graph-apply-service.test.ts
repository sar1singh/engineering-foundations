import { describe, expect, it } from "vitest";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";
import type { CanonicalGraphPatchProposal } from "@/types/canonical-graph-patch";
import approvedPatch from "../../../data/ingestion/approved-canonical-graph-patch.json";
import {
  applyCanonicalGraphPatchInMemory,
  generateCanonicalApplyPlan,
  summarizeCanonicalApply,
  validateHumanApprovedPatch,
  validatePostApplyGraph,
} from "./canonical-graph-apply-service";

const fixture = approvedPatch as CanonicalGraphPatchProposal;
const fixtureSourceId = "aws-prescriptive-guidance-saga";
const fixtureTopicId = "topic-cloud-saga-orchestration";

function cloneFixture(): CanonicalGraphPatchProposal {
  return JSON.parse(JSON.stringify(fixture));
}

function preApplyGraph() {
  return {
    sources: founderBetaSourceCatalog.filter((source) => source.id !== fixtureSourceId),
    topics: founderBetaMasterTopics.filter((topic) => topic.id !== fixtureTopicId),
  };
}

describe("canonical graph apply service", () => {
  it("requires human approval", () => {
    const patch = cloneFixture();
    patch.review.approvalStatus = "pending";

    const validation = validateHumanApprovedPatch(patch);

    expect(validation.valid).toBe(false);
    expect(validation.errors.some((error) => error.includes("approved"))).toBe(true);
  });

  it("rejects a pending patch during in-memory apply", () => {
    const patch = cloneFixture();
    patch.review.approvalStatus = "pending";

    const result = applyCanonicalGraphPatchInMemory(patch);

    expect(result.appliedSources).toHaveLength(0);
    expect(result.appliedTopics).toHaveLength(0);
    expect(result.skippedEntries).toHaveLength(patch.entries.length);
  });

  it("validates an approved patch", () => {
    const validation = validateHumanApprovedPatch(cloneFixture());

    expect(validation.valid).toBe(true);
    expect(validation.errors).toEqual([]);
  });

  it("applies the approved patch in memory", () => {
    const result = applyCanonicalGraphPatchInMemory(cloneFixture(), preApplyGraph());

    expect(result.appliedSources).toHaveLength(1);
    expect(result.appliedTopics).toHaveLength(1);
    expect(result.afterCounts.sources).toBe(result.beforeCounts.sources + 1);
    expect(result.afterCounts.topics).toBe(result.beforeCounts.topics + 1);
  });

  it("blocks duplicate topic IDs", () => {
    const patch = cloneFixture();
    const topicEntry = patch.entries.find((entry) => entry.type === "topic");
    if (topicEntry?.type === "topic") {
      topicEntry.topic.id = founderBetaMasterTopics[0].id;
      topicEntry.entryId = founderBetaMasterTopics[0].id;
    }

    const result = applyCanonicalGraphPatchInMemory(patch);

    expect(result.appliedTopics).toHaveLength(0);
    expect(result.conflicts.some((conflict) => conflict.includes("Duplicate topic ID"))).toBe(true);
  });

  it("blocks duplicate source IDs", () => {
    const patch = cloneFixture();
    const sourceEntry = patch.entries.find((entry) => entry.type === "source");
    if (sourceEntry?.type === "source") {
      sourceEntry.source.id = founderBetaSourceCatalog[0].id;
      sourceEntry.entryId = founderBetaSourceCatalog[0].id;
    }

    const result = applyCanonicalGraphPatchInMemory(patch);

    expect(result.appliedSources).toHaveLength(0);
    expect(result.conflicts.some((conflict) => conflict.includes("Duplicate source ID"))).toBe(true);
  });

  it("validates post-apply graph", () => {
    const result = applyCanonicalGraphPatchInMemory(cloneFixture(), preApplyGraph());
    const validation = validatePostApplyGraph(result.graph);

    expect(validation.valid).toBe(true);
    expect(validation.errors).toEqual([]);
  });

  it("generates a deterministic summary", () => {
    const first = summarizeCanonicalApply(applyCanonicalGraphPatchInMemory(cloneFixture(), preApplyGraph()));
    const second = summarizeCanonicalApply(applyCanonicalGraphPatchInMemory(cloneFixture(), preApplyGraph()));

    expect(first).toBe("sources:+1 | topics:+1 | skipped:0 | conflicts:0 | files:2");
    expect(second).toBe(first);
  });

  it("generates an auditable apply plan", () => {
    const plan = generateCanonicalApplyPlan(cloneFixture());

    expect(plan.filesToUpdate).toEqual([
      "src/data/founder-beta/source-catalog.ts",
      "src/data/founder-beta/master-topics.ts",
    ]);
    expect(plan.humanApprovalEvidence.some((item) => item.includes("approvalStatus=approved"))).toBe(true);
    expect(plan.rollbackNotes.length).toBeGreaterThan(0);
  });

  it("does not mutate canonical arrays", () => {
    const beforeSources = founderBetaSourceCatalog.length;
    const beforeTopics = founderBetaMasterTopics.length;

    applyCanonicalGraphPatchInMemory(cloneFixture());

    expect(founderBetaSourceCatalog).toHaveLength(beforeSources);
    expect(founderBetaMasterTopics).toHaveLength(beforeTopics);
  });
});
