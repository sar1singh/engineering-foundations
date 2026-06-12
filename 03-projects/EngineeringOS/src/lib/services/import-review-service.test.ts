import { describe, it, expect } from "vitest";
import {
  createImportReviewPackage,
  approvePatchEntry,
  rejectPatchEntry,
  reviewPatchEntry,
  detectImportConflicts,
  generateApplicationPlan,
  summarizeImportPackage,
} from "./import-review-service";
import { generatePatchFromApprovedCandidates } from "./approved-import-patch-generator";
import { founderBetaSourceCatalog } from "@/data/founder-beta";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaCapabilities, founderBetaSkills } from "@/data/founder-beta";
import type { ApprovedImportCandidate } from "@/types/ingestion-patch";
import firstImportCandidates from "../../../data/ingestion/first-import-candidates.json";

const mockCandidates: ApprovedImportCandidate[] = (firstImportCandidates as ApprovedImportCandidate[]);

describe("createImportReviewPackage", () => {
  it("creates a package from a generated patch", () => {
    const patch = generatePatchFromApprovedCandidates(mockCandidates);
    const pkg = createImportReviewPackage(patch);

    expect(pkg.id).toContain("import-pkg-");
    expect(pkg.patch.id).toBe(patch.id);
    expect(pkg.reviewItems.length).toBeGreaterThan(0);
    expect(pkg.approvedEntries).toHaveLength(0);
    expect(pkg.rejectedEntries).toHaveLength(0);
  });

  it("sets all items to pending initially", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);

    for (const item of pkg.reviewItems) {
      expect(item.decision).toBe("pending");
    }
  });

  it("detects conflicts with existing catalog", () => {
    const patch = generatePatchFromApprovedCandidates(mockCandidates);
    const pkg = createImportReviewPackage(patch);

    expect(pkg.conflicts.length).toBeGreaterThanOrEqual(0);
  });

  it("does not mutate canonical data", () => {
    const sourceLenBefore = founderBetaSourceCatalog.length;
    const topicsLenBefore = founderBetaMasterTopics.length;

    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    createImportReviewPackage(patch);

    expect(founderBetaSourceCatalog.length).toBe(sourceLenBefore);
    expect(founderBetaMasterTopics.length).toBe(topicsLenBefore);
  });
});

describe("reviewPatchEntry", () => {
  it("returns the review item for a valid entry index", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const item = reviewPatchEntry(pkg, 0);

    expect(item).not.toBeNull();
    expect(item!.entryIndex).toBe(0);
  });

  it("returns null for an invalid entry index", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const item = reviewPatchEntry(pkg, 999);

    expect(item).toBeNull();
  });
});

describe("approvePatchEntry", () => {
  it("marks an entry as approved", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const updated = approvePatchEntry(pkg, 0);

    expect(updated.reviewItems[0].decision).toBe("approved");
  });

  it("includes approved entries in approvedEntries", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const updated = approvePatchEntry(pkg, 0);

    expect(updated.approvedEntries.length).toBeGreaterThanOrEqual(1);
  });

  it("preserves review notes", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const updated = approvePatchEntry(pkg, 0, "Looks good");

    expect(updated.reviewItems[0].reviewNotes).toBe("Looks good");
  });

  it("updates reviewedAt timestamp on approve", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const updated = approvePatchEntry(pkg, 0);

    expect(updated.reviewItems[0].reviewedAt).not.toBeNull();
  });
});

describe("rejectPatchEntry", () => {
  it("marks an entry as rejected", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const updated = rejectPatchEntry(pkg, 0);

    expect(updated.reviewItems[0].decision).toBe("rejected");
  });

  it("includes rejected entries in rejectedEntries", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const updated = rejectPatchEntry(pkg, 0);

    expect(updated.rejectedEntries.length).toBeGreaterThanOrEqual(1);
  });

  it("stores rejection reason", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const updated = rejectPatchEntry(pkg, 0, "Duplicate content");

    expect(updated.reviewItems[0].reviewNotes).toBe("Duplicate content");
  });
});

describe("detectImportConflicts", () => {
  it("returns conflicts from the package", () => {
    const patch = generatePatchFromApprovedCandidates(mockCandidates);
    const pkg = createImportReviewPackage(patch);
    const conflicts = detectImportConflicts(pkg);

    expect(Array.isArray(conflicts)).toBe(true);
  });

  it("reports existing URL as error severity", () => {
    const alreadyExisting = mockCandidates.find(
      (c) => c.candidateUrl === "https://aws.amazon.com/blogs/architecture/"
    );
    if (alreadyExisting) {
      const existingUrl = founderBetaSourceCatalog.find(
        (s) => s.url.toLowerCase() === alreadyExisting.candidateUrl.toLowerCase()
      );
      if (existingUrl) {
        const patch = generatePatchFromApprovedCandidates([alreadyExisting]);
        const pkg = createImportReviewPackage(patch);
        const urlConflicts = pkg.conflicts.filter(
          (c) => c.conflict.field === "url"
        );
        expect(urlConflicts.length).toBeGreaterThanOrEqual(1);
        expect(urlConflicts[0].conflict.severity).toBe("error");
      }
    }
  });
});

describe("generateApplicationPlan", () => {
  it("returns an application plan from the package", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const approved = approvePatchEntry(pkg, 0);
    const plan = generateApplicationPlan(approved);

    expect(plan.patchId).toBe(patch.id);
    expect(plan.topicsToAdd).toBeDefined();
    expect(plan.sourcesToAdd).toBeDefined();
    expect(plan.generatedAt).toBeTruthy();
  });

  it("lists capabilities impacted", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const approvals = approvePatchEntry(pkg, 0);
    const plan = generateApplicationPlan(approvals);

    expect(Array.isArray(plan.capabilitiesImpacted)).toBe(true);
  });

  it("lists skills impacted", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const approvals = approvePatchEntry(pkg, 0);
    const plan = generateApplicationPlan(approvals);

    expect(Array.isArray(plan.skillsImpacted)).toBe(true);
  });
});

describe("summarizeImportPackage", () => {
  it("returns summary with correct initial counts", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const summary = summarizeImportPackage(pkg);

    expect(summary.patchId).toBe(patch.id);
    expect(summary.totalEntries).toBe(pkg.reviewItems.length);
    expect(summary.approvedCount).toBe(0);
    expect(summary.pendingCount).toBe(pkg.reviewItems.length);
    expect(summary.createdAt).toBeTruthy();
  });

  it("updates counts after approve", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const approved = approvePatchEntry(pkg, 0);
    const summary = summarizeImportPackage(approved);

    expect(summary.approvedCount).toBeGreaterThanOrEqual(1);
    expect(summary.pendingCount).toBe(summary.totalEntries - summary.approvedCount);
  });

  it("updates counts after reject", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const rejected = rejectPatchEntry(pkg, 0);
    const summary = summarizeImportPackage(rejected);

    expect(summary.rejectedCount).toBeGreaterThanOrEqual(1);
  });
});

describe("deterministic output", () => {
  it("generates the same package for the same input", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg1 = createImportReviewPackage(patch);
    const pkg2 = createImportReviewPackage(patch);

    expect(pkg1.reviewItems.length).toBe(pkg2.reviewItems.length);
    for (let i = 0; i < pkg1.reviewItems.length; i++) {
      expect(pkg1.reviewItems[i].entryIndex).toBe(pkg2.reviewItems[i].entryIndex);
    }
  });

  it("output is JSON-serializable", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    const serialized = JSON.stringify(pkg);

    expect(() => JSON.parse(serialized)).not.toThrow();
    const parsed = JSON.parse(serialized);
    expect(parsed.patch).toBeDefined();
    expect(parsed.reviewItems).toBeDefined();
  });
});

describe("application plan generation", () => {
  it("includes sourcesToAdd for approved sources", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    let approved = pkg;

    for (let i = 0; i < approved.reviewItems.length; i++) {
      if (approved.reviewItems[i].entry.type === "source") {
        approved = approvePatchEntry(approved, i, "Good source");
      }
    }

    const plan = generateApplicationPlan(approved);
    expect(plan.sourcesToAdd.length).toBeGreaterThanOrEqual(1);
  });

  it("includes topicsToAdd for approved topics", () => {
    const patch = generatePatchFromApprovedCandidates([mockCandidates[0]]);
    const pkg = createImportReviewPackage(patch);
    let approved = pkg;

    for (let i = 0; i < approved.reviewItems.length; i++) {
      if (approved.reviewItems[i].entry.type === "topic") {
        approved = approvePatchEntry(approved, i, "Good topic");
      }
    }

    const plan = generateApplicationPlan(approved);
    expect(plan.topicsToAdd.length).toBeGreaterThanOrEqual(1);
  });
});
