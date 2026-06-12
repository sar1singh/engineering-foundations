import { describe, it, expect } from "vitest";
import type { ApprovedImportCandidate } from "@/types/ingestion-patch";
import type { ApprovedImportPackage } from "@/types/import-review";
import { generatePatchFromApprovedCandidates } from "./approved-import-patch-generator";
import { createImportReviewPackage, approvePatchEntry } from "./import-review-service";
import {
  createApprovedBatchPatch,
  validateApprovedBatchPatch,
  serializeApprovedBatchPatch,
  createPatchOutputFilename,
  summarizeApprovedBatchPatch,
} from "./approved-batch-patch-output-service";
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

const validCandidate2: ApprovedImportCandidate = {
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

const KNOWN_CATALOG_URL = "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html";

function createPackage(candidates: ApprovedImportCandidate[]): { pkg: ApprovedImportPackage } {
  const patch = generatePatchFromApprovedCandidates(candidates);
  const pkg = createImportReviewPackage(patch);
  return { pkg };
}

function approveFirstEntry(pkg: ApprovedImportPackage): ApprovedImportPackage {
  return approvePatchEntry(pkg, 0, "Approved for batch patch output");
}

describe("createApprovedBatchPatch", () => {
  it("includes approved entries in the output", () => {
    const { pkg } = createPackage([validCandidate]);
    const updatedPkg = approveFirstEntry(pkg);

    const output = createApprovedBatchPatch(updatedPkg);

    expect(output.approvedEntries.length).toBeGreaterThan(0);
    expect(output.summary.approvedCount).toBe(output.approvedEntries.length);
    expect(output.summary.hasApprovedEntries).toBe(true);
    expect(output.approvedEntries[0].type).toBe("source");
  });

  it("excludes non-approved entries from approved list", () => {
    const { pkg } = createPackage([validCandidate]);

    const output = createApprovedBatchPatch(pkg);

    expect(output.approvedEntries).toHaveLength(0);
    expect(output.summary.approvedCount).toBe(0);
    expect(output.summary.hasApprovedEntries).toBe(false);
    expect(output.summary.pendingCount).toBeGreaterThan(0);
  });

  it("excludes rejected entries from approved list", () => {
    const { pkg } = createPackage([validCandidate, validCandidate2]);
    const pkgWithApproved = approveFirstEntry(pkg);

    const output = createApprovedBatchPatch(pkgWithApproved);

    expect(output.rejectedEntries).toHaveLength(0);
    expect(output.approvedEntries.length).toBeGreaterThan(0);
  });

  it("duplicate-risk without override results in empty approved when no override", () => {
    const dupCandidate: ApprovedImportCandidate = {
      candidateUrl: KNOWN_CATALOG_URL,
      candidateId: "trace-dup",
      title: "AWS Well-Architected Framework",
      sourceType: "official-docs",
      category: "AWS / Cloud Architecture",
      description: "Existing AWS doc.",
      tier: "tier-1",
      reliability: "high",
      overrideDuplicateRisk: false,
    };
    const { pkg } = createPackage([dupCandidate]);
    const output = createApprovedBatchPatch(pkg);
    expect(output.approvedEntries).toHaveLength(0);
  });

  it("duplicate-risk with override generates entries that can be approved", () => {
    const dupCandidate: ApprovedImportCandidate = {
      candidateUrl: KNOWN_CATALOG_URL,
      candidateId: "trace-dup-override",
      title: "AWS Well-Architected Framework Override",
      sourceType: "official-docs",
      category: "AWS / Cloud Architecture",
      description: "Existing AWS doc with override.",
      tier: "tier-1",
      reliability: "high",
      overrideDuplicateRisk: true,
    };
    const { pkg } = createPackage([dupCandidate]);
    const updatedPkg = approveFirstEntry(pkg);

    const output = createApprovedBatchPatch(updatedPkg);

    expect(output.approvedEntries.length).toBeGreaterThan(0);
    expect(output.summary.hasApprovedEntries).toBe(true);
    expect(output.conflicts.length).toBeGreaterThanOrEqual(1);
  });

  it("includes conflicts from the review package", () => {
    const dupCandidate: ApprovedImportCandidate = {
      candidateUrl: KNOWN_CATALOG_URL,
      candidateId: "trace-conflict",
      title: "Duplicate With Conflict",
      sourceType: "official-docs",
      category: "AWS",
      description: "Conflict test",
      tier: "tier-1",
      reliability: "high",
      overrideDuplicateRisk: true,
    };
    const { pkg } = createPackage([dupCandidate]);
    const updatedPkg = approveFirstEntry(pkg);

    const output = createApprovedBatchPatch(updatedPkg);

    expect(output.conflicts.length).toBeGreaterThanOrEqual(1);
    expect(output.summary.hasConflicts).toBe(true);
    expect(output.warnings.some((w) => w.includes("conflict"))).toBe(true);
  });

  it("includes rollback notes for approved entries", () => {
    const { pkg } = createPackage([validCandidate]);
    const updatedPkg = approveFirstEntry(pkg);

    const output = createApprovedBatchPatch(updatedPkg);

    expect(output.rollbackNotes.length).toBeGreaterThan(0);
    expect(output.rollbackNotes.some((n) => n.startsWith("Rollback"))).toBe(true);
  });

  it("rollback notes include source and topic entries when both approved", () => {
    const { pkg } = createPackage([validCandidate]);
    let updatedPkg = approveFirstEntry(pkg);
    updatedPkg = approvePatchEntry(updatedPkg, 1, "Approved topic entry");

    const output = createApprovedBatchPatch(updatedPkg);

    const sourceNotes = output.rollbackNotes.filter((n) => n.startsWith("Rollback") && n.toLowerCase().includes("source"));
    const topicNotes = output.rollbackNotes.filter((n) => n.startsWith("Rollback") && n.toLowerCase().includes("topic"));
    expect(sourceNotes.length).toBeGreaterThanOrEqual(1);
    expect(topicNotes.length).toBeGreaterThanOrEqual(1);
  });

  it("includes warnings when no approved entries", () => {
    const { pkg } = createPackage([validCandidate]);

    const output = createApprovedBatchPatch(pkg);

    expect(output.warnings.some((w) => w.includes("No approved entries"))).toBe(true);
    expect(output.summary.hasWarnings).toBe(true);
  });

  it("output path is canonical", () => {
    const { pkg } = createPackage([validCandidate]);
    const output = createApprovedBatchPatch(pkg);
    expect(output.outputPath).toBe("data/ingestion/generated/approved-import-patch.preview.json");
  });

  it("output has stable structure", () => {
    const { pkg } = createPackage([validCandidate]);
    const updatedPkg = approveFirstEntry(pkg);

    const output = createApprovedBatchPatch(updatedPkg);

    expect(output).toHaveProperty("id");
    expect(output).toHaveProperty("title");
    expect(output).toHaveProperty("description");
    expect(output).toHaveProperty("sourcePatch");
    expect(output).toHaveProperty("approvedEntries");
    expect(output).toHaveProperty("rejectedEntries");
    expect(output).toHaveProperty("pendingEntries");
    expect(output).toHaveProperty("conflicts");
    expect(output).toHaveProperty("warnings");
    expect(output).toHaveProperty("rollbackNotes");
    expect(output).toHaveProperty("summary");
    expect(output).toHaveProperty("generatedAt");
    expect(output).toHaveProperty("outputPath");
  });

  it("summary has correct shape", () => {
    const { pkg } = createPackage([validCandidate, validCandidate2]);
    const updatedPkg = approveFirstEntry(pkg);

    const output = createApprovedBatchPatch(updatedPkg);

    expect(output.summary.totalEntries).toBeGreaterThan(0);
    expect(output.summary.approvedCount).toBe(1);
    expect(output.summary.rejectedCount).toBe(0);
    expect(output.summary.pendingCount).toBeGreaterThan(0);
    expect(typeof output.summary.hasConflicts).toBe("boolean");
    expect(typeof output.summary.hasWarnings).toBe("boolean");
    expect(typeof output.summary.hasApprovedEntries).toBe("boolean");
    expect(output.summary.approvedCount + output.summary.rejectedCount + output.summary.pendingCount).toBe(output.summary.totalEntries);
  });
});

describe("validateApprovedBatchPatch", () => {
  it("returns valid for a well-formed output with approved entries", () => {
    const { pkg } = createPackage([validCandidate]);
    const updatedPkg = approveFirstEntry(pkg);

    const output = createApprovedBatchPatch(updatedPkg);
    const result = validateApprovedBatchPatch(output);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("warns when no approved entries", () => {
    const { pkg } = createPackage([validCandidate]);

    const output = createApprovedBatchPatch(pkg);
    const result = validateApprovedBatchPatch(output);

    expect(result.warnings.some((w) => w.includes("No approved entries"))).toBe(true);
  });

  it("reports conflict errors in validation when conflicts exist", () => {
    const dupCandidate: ApprovedImportCandidate = {
      candidateUrl: KNOWN_CATALOG_URL,
      candidateId: "trace-dup",
      title: "AWS Well-Architected Framework",
      sourceType: "official-docs",
      category: "AWS / Cloud Architecture",
      description: "Existing AWS doc.",
      tier: "tier-1",
      reliability: "high",
      overrideDuplicateRisk: true,
    };
    const { pkg } = createPackage([dupCandidate]);

    const output = createApprovedBatchPatch(pkg);

    const result = validateApprovedBatchPatch(output);

    expect(result.warnings.some((w) => w.includes("conflict"))).toBe(true);
  });
});

describe("serializeApprovedBatchPatch", () => {
  it("produces valid JSON", () => {
    const { pkg } = createPackage([validCandidate]);
    const updatedPkg = approveFirstEntry(pkg);

    const output = createApprovedBatchPatch(updatedPkg);
    const json = serializeApprovedBatchPatch(output);

    expect(() => JSON.parse(json)).not.toThrow();
  });

  it("produces stable output for same input", () => {
    const { pkg } = createPackage([validCandidate]);
    const updatedPkg = approveFirstEntry(pkg);

    const output = createApprovedBatchPatch(updatedPkg);
    const json1 = serializeApprovedBatchPatch(output);
    const json2 = serializeApprovedBatchPatch(output);

    expect(json1).toBe(json2);
  });

  it("contains all expected keys in serialized output", () => {
    const { pkg } = createPackage([validCandidate]);
    const updatedPkg = approveFirstEntry(pkg);

    const output = createApprovedBatchPatch(updatedPkg);
    const json = serializeApprovedBatchPatch(output);
    const parsed = JSON.parse(json);

    expect(parsed).toHaveProperty("id");
    expect(parsed).toHaveProperty("approvedEntries");
    expect(parsed).toHaveProperty("conflicts");
    expect(parsed).toHaveProperty("warnings");
    expect(parsed).toHaveProperty("rollbackNotes");
    expect(parsed).toHaveProperty("summary");
    expect(parsed).toHaveProperty("outputPath");
    expect(parsed).toHaveProperty("generatedAt");
  });
});

describe("createPatchOutputFilename", () => {
  it("returns deterministic filename", () => {
    const name1 = createPatchOutputFilename();
    const name2 = createPatchOutputFilename();
    expect(name1).toBe(name2);
  });

  it("returns preview JSON filename", () => {
    const name = createPatchOutputFilename();
    expect(name).toBe("approved-batch-import-patch.preview.json");
  });
});

describe("summarizeApprovedBatchPatch", () => {
  it("returns summary from output", () => {
    const { pkg } = createPackage([validCandidate]);
    const updatedPkg = approveFirstEntry(pkg);

    const output = createApprovedBatchPatch(updatedPkg);
    const summary = summarizeApprovedBatchPatch(output);

    expect(summary.approvedCount).toBe(1);
    expect(summary).toEqual(output.summary);
  });
});

describe("no canonical writes", () => {
  it("does not modify founderBetaSourceCatalog", () => {
    const beforeCount = founderBetaSourceCatalog.length;
    const { pkg } = createPackage([validCandidate]);
    const updatedPkg = approveFirstEntry(pkg);
    createApprovedBatchPatch(updatedPkg);
    expect(founderBetaSourceCatalog.length).toBe(beforeCount);
  });

  it("does not modify founderBetaMasterTopics", () => {
    const beforeCount = founderBetaMasterTopics.length;
    const { pkg } = createPackage([validCandidate]);
    const updatedPkg = approveFirstEntry(pkg);
    createApprovedBatchPatch(updatedPkg);
    expect(founderBetaMasterTopics.length).toBe(beforeCount);
  });
});
