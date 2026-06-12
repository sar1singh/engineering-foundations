import { describe, it, expect } from "vitest";
import {
  generatePatchFromApprovedCandidates,
  validatePatch,
  detectPatchConflicts,
  summarizePatch,
  serializePatch,
  buildSourceEntry,
  checkForConflict,
  getPatchOutputPath,
} from "./approved-import-patch-generator";
import type { ApprovedImportCandidate } from "@/types/ingestion-patch";
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

describe("getPatchOutputPath", () => {
  it("returns the canonical output path", () => {
    expect(getPatchOutputPath()).toBe("data/ingestion/generated/approved-import-patch.preview.json");
  });
});

describe("buildSourceEntry", () => {
  it("produces a source entry with derived ID from URL", () => {
    const entry = buildSourceEntry(validCandidate);
    expect(entry.type).toBe("source");
    expect(entry.operation).toBe("add");
    expect(entry.sourceId).toBeTruthy();
    expect(entry.url).toBe(validCandidate.candidateUrl);
    expect(entry.sourceType).toBe("engineering-blog");
    expect(entry.tier).toBe("tier-1");
    expect(entry.reliability).toBe("high");
  });

  it("derives title from candidate title", () => {
    const entry = buildSourceEntry(validCandidate);
    expect(entry.title).toBe("New Architecture Patterns");
  });

  it("derives title from URL when title is Untitled", () => {
    const untitledCandidate: ApprovedImportCandidate = {
      ...validCandidate,
      title: "Untitled",
    };
    const entry = buildSourceEntry(untitledCandidate);
    expect(entry.title).not.toBe("Untitled");
    expect(entry.title.length).toBeGreaterThan(0);
  });

  it("reduces unknown sourceType to engineering-blog", () => {
    const badTypeCandidate: ApprovedImportCandidate = {
      ...validCandidate,
      sourceType: "unknown-type" as ApprovedImportCandidate["sourceType"],
    };
    const entry = buildSourceEntry(badTypeCandidate);
    expect(entry.sourceType).toBe("engineering-blog");
  });
});

describe("checkForConflict", () => {
  it("returns null for a unique source URL", () => {
    const result = checkForConflict("totally-new-source", "https://unique.example.com/doc");
    expect(result).toBeNull();
  });

  it("returns conflict for existing source ID", () => {
    const existing = founderBetaSourceCatalog[0];
    const result = checkForConflict(existing.id, "https://some-new-url.example.com");
    expect(result).not.toBeNull();
    expect(result!.entryType).toBe("source");
    expect(result!.severity).toBe("warning");
  });

  it("returns conflict for existing URL", () => {
    const result = checkForConflict("new-source", KNOWN_CATALOG_URL);
    expect(result).not.toBeNull();
    expect(result!.entryType).toBe("source");
    expect(result!.field).toBe("url");
    expect(result!.severity).toBe("error");
  });
});

describe("generatePatchFromApprovedCandidates", () => {
  it("approved candidate creates topic and source patch entries", () => {
    const patch = generatePatchFromApprovedCandidates([validCandidate]);
    expect(patch.entries.length).toBeGreaterThanOrEqual(1);
    expect(patch.report.totalCandidates).toBe(1);
    expect(patch.report.candidatesProcessed).toBe(1);
    expect(patch.report.candidatesSkipped).toBe(0);

    const sourceEntries = patch.entries.filter((e) => e.type === "source");
    const topicEntries = patch.entries.filter((e) => e.type === "topic");
    expect(sourceEntries.length).toBe(1);
    expect(topicEntries.length).toBe(1);

    expect(sourceEntries[0].url).toBe(validCandidate.candidateUrl);
  });

  it("pending/rejected/needs-changes excluded (filtered at caller level)", () => {
    const patch = generatePatchFromApprovedCandidates([validCandidate]);
    expect(patch.report.candidatesProcessed).toBe(1);
    expect(patch.report.candidatesSkipped).toBe(0);
  });

  it("duplicate-risk requires override — skipped without override", () => {
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
    const patch = generatePatchFromApprovedCandidates([dupCandidate]);
    expect(patch.report.candidatesSkipped).toBe(1);
    expect(patch.report.candidatesProcessed).toBe(0);
    expect(patch.report.entriesGenerated).toBe(0);
  });

  it("duplicate-risk with override flag generates entries", () => {
    const dupCandidate: ApprovedImportCandidate = {
      candidateUrl: KNOWN_CATALOG_URL,
      candidateId: "trace-dup-override",
      title: "AWS Well-Architected Framework",
      sourceType: "official-docs",
      category: "AWS / Cloud Architecture",
      description: "Existing AWS doc with override.",
      tier: "tier-1",
      reliability: "high",
      overrideDuplicateRisk: true,
    };
    const patch = generatePatchFromApprovedCandidates([dupCandidate]);
    expect(patch.report.candidatesSkipped).toBe(0);
    expect(patch.report.candidatesProcessed).toBe(1);
    expect(patch.report.entriesGenerated).toBeGreaterThanOrEqual(1);
  });

  it("generates correct report counts for multiple candidates", () => {
    const patch = generatePatchFromApprovedCandidates([validCandidate, validCandidate2]);
    expect(patch.report.totalCandidates).toBe(2);
    expect(patch.report.candidatesProcessed).toBe(2);
    expect(patch.report.entriesGenerated).toBeGreaterThanOrEqual(2);
    expect(patch.report.sourceEntries).toBe(2);
  });

  it("deduplicates same source URL across candidates", () => {
    const sameUrl: ApprovedImportCandidate = {
      ...validCandidate2,
      candidateUrl: validCandidate.candidateUrl,
    };
    const patch = generatePatchFromApprovedCandidates([validCandidate, sameUrl]);
    expect(patch.report.sourceEntries).toBe(1);
  });

  it("detects conflicts and includes them in the report", () => {
    const dupCandidate: ApprovedImportCandidate = {
      candidateUrl: KNOWN_CATALOG_URL,
      candidateId: "trace-conflict",
      title: "AWS Well-Architected Framework",
      sourceType: "official-docs",
      category: "AWS / Cloud Architecture",
      description: "Conflict test.",
      tier: "tier-1",
      reliability: "high",
      overrideDuplicateRisk: true,
    };
    const patch = generatePatchFromApprovedCandidates([dupCandidate]);
    expect(patch.conflicts.length).toBeGreaterThanOrEqual(1);
    const urlConflict = patch.conflicts.find((c) => c.field === "url");
    expect(urlConflict).toBeDefined();
  });
});

describe("validatePatch", () => {
  it("returns valid for a well-formed patch", () => {
    const patch = generatePatchFromApprovedCandidates([validCandidate]);
    const result = validatePatch(patch);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns errors for patch with missing ID", () => {
    const patch = generatePatchFromApprovedCandidates([validCandidate]);
    const invalidPatch = { ...patch, id: "" };
    const result = validatePatch(invalidPatch);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Patch ID"))).toBe(true);
  });

  it("warns when patch has no entries", () => {
    const patch = generatePatchFromApprovedCandidates([]);
    const result = validatePatch(patch);
    expect(result.warnings.some((w) => w.includes("no entries"))).toBe(true);
  });

  it("includes conflict errors in validation", () => {
    const dupCandidate: ApprovedImportCandidate = {
      candidateUrl: KNOWN_CATALOG_URL,
      candidateId: "trace-dup",
      title: "Duplicate",
      sourceType: "official-docs",
      category: "AWS",
      description: "Description",
      tier: "tier-1",
      reliability: "high",
      overrideDuplicateRisk: false,
    };
    const patch = generatePatchFromApprovedCandidates([dupCandidate]);
    const result = validatePatch(patch);
    expect(result.errors.some((e) => e.includes("Conflict"))).toBe(true);
  });
});

describe("detectPatchConflicts", () => {
  it("returns conflicts from the patch", () => {
    const patch = generatePatchFromApprovedCandidates([validCandidate]);
    const conflicts = detectPatchConflicts(patch);
    expect(Array.isArray(conflicts)).toBe(true);
  });
});

describe("summarizePatch", () => {
  it("returns the generation report", () => {
    const patch = generatePatchFromApprovedCandidates([validCandidate]);
    const summary = summarizePatch(patch);
    expect(summary.totalCandidates).toBe(1);
    expect(summary.entriesGenerated).toBe(patch.entries.length);
    expect(summary.generatedAt).toBeTruthy();
  });
});

describe("serializePatch", () => {
  it("produces stable JSON output", () => {
    const patch = generatePatchFromApprovedCandidates([validCandidate]);
    const json1 = serializePatch(patch);
    const json2 = serializePatch(patch);
    expect(json1).toBe(json2);
  });

  it("contains all expected top-level keys", () => {
    const patch = generatePatchFromApprovedCandidates([validCandidate]);
    const json = serializePatch(patch);
    const parsed = JSON.parse(json);
    expect(parsed).toHaveProperty("id");
    expect(parsed).toHaveProperty("title");
    expect(parsed).toHaveProperty("description");
    expect(parsed).toHaveProperty("entries");
    expect(parsed).toHaveProperty("conflicts");
    expect(parsed).toHaveProperty("report");
    expect(parsed).toHaveProperty("generatedAt");
  });

  it("is valid JSON", () => {
    const patch = generatePatchFromApprovedCandidates([validCandidate]);
    const json = serializePatch(patch);
    expect(() => JSON.parse(json)).not.toThrow();
  });
});

describe("canonical files not modified", () => {
  it("does not modify founderBetaSourceCatalog", () => {
    const beforeCount = founderBetaSourceCatalog.length;
    generatePatchFromApprovedCandidates([validCandidate]);
    expect(founderBetaSourceCatalog.length).toBe(beforeCount);
  });

  it("does not modify founderBetaMasterTopics", () => {
    const beforeCount = founderBetaMasterTopics.length;
    generatePatchFromApprovedCandidates([validCandidate]);
    expect(founderBetaMasterTopics.length).toBe(beforeCount);
  });
});
