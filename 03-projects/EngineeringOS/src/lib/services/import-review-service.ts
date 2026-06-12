import type {
  ImportPatch,
  PatchEntry,
  PatchConflict,
} from "@/types/ingestion-patch";
import type {
  ImportReviewDecision,
  ImportReviewItem,
  ApprovedImportPackage,
  ImportReviewSummary,
  ImportConflict,
  ImportApplicationPlan,
  ApplicationPlanEntry,
} from "@/types/import-review";
import { founderBetaCapabilities, founderBetaSkills } from "@/data/founder-beta";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta";

function now(): string {
  return new Date().toISOString();
}

function deriveReviewItems(patch: ImportPatch): ImportReviewItem[] {
  return patch.entries.map((entry, index) => ({
    patchId: patch.id,
    entryIndex: index,
    entry,
    decision: "pending" as const,
    reviewNotes: "",
    reviewedAt: null,
  }));
}

function collectConflicts(patch: ImportPatch): ImportConflict[] {
  const results: ImportConflict[] = [];
  for (let index = 0; index < patch.entries.length; index++) {
    const entry = patch.entries[index];
    if ("sourceId" in entry) {
      const sourceId = (entry as { sourceId: string }).sourceId;
      const url = "url" in entry ? (entry as { url: string }).url : "";
      const urlConflict = url
        ? founderBetaSourceCatalog.find(
            (s) => s.url.toLowerCase() === url.toLowerCase()
          )
        : undefined;
      const idConflict = founderBetaSourceCatalog.find(
        (s) => s.id === sourceId
      );
      const conflict: PatchConflict | null = idConflict
        ? {
            entryType: "source",
            field: "id",
            existingValue: idConflict.id,
            incomingValue: sourceId,
            severity: "warning",
            message: `Source ID "${sourceId}" already exists in catalog: "${idConflict.title}"`,
          }
        : urlConflict
        ? {
            entryType: "source",
            field: "url",
            existingValue: urlConflict.url,
            incomingValue: url,
            severity: "error",
            message: `URL already exists in catalog as "${urlConflict.id}": ${url}`,
          }
        : null;
      if (conflict) {
        results.push({
          entryIndex: index,
          entryType: "source" as const,
          entryId: sourceId,
          conflict,
        });
      }
    }
    if ("topicId" in entry) {
      const topicId = (entry as { topicId: string }).topicId;
      const existingTopic = founderBetaMasterTopics.find(
        (t) => t.id === topicId
      );
      if (existingTopic) {
        results.push({
          entryIndex: index,
          entryType: "topic" as const,
          entryId: topicId,
          conflict: {
            entryType: "topic",
            field: "id",
            existingValue: existingTopic.id,
            incomingValue: topicId,
            severity: "warning",
            message: `Topic ID "${topicId}" already exists in master topics: "${existingTopic.name}"`,
          },
        });
      }
    }
  }
  return results;
}

function computeSummary(
  patch: ImportPatch,
  items: ImportReviewItem[],
  conflicts: ImportConflict[]
): ImportReviewSummary {
  const approvedCount = items.filter((i) => i.decision === "approved").length;
  const rejectedCount = items.filter((i) => i.decision === "rejected").length;
  const needsReviewCount = items.filter(
    (i) => i.decision === "needs-review"
  ).length;
  const pendingCount = items.filter((i) => i.decision === "pending").length;
  return {
    patchId: patch.id,
    totalEntries: items.length,
    approvedCount,
    rejectedCount,
    needsReviewCount,
    pendingCount,
    conflicts,
    createdAt: now(),
  };
}

function generatePlan(
  patch: ImportPatch,
  approvedEntries: PatchEntry[],
  conflicts: ImportConflict[]
): ImportApplicationPlan {
  const topicsToAdd: ApplicationPlanEntry[] = [];
  const sourcesToAdd: ApplicationPlanEntry[] = [];
  const duplicateRisks: string[] = [];
  const reviewNotes: string[] = [];

  for (const entry of approvedEntries) {
    if (entry.type === "source") {
      const entryConflicts = conflicts.filter(
        (c) =>
          c.entryType === "source" && c.entryId === entry.sourceId
      );
      sourcesToAdd.push({
        action: "add-source",
        entryId: entry.sourceId,
        entryName: entry.title,
        conflicts: entryConflicts.map((c) => c.conflict.message),
        notes: "",
      });
      if (entryConflicts.length > 0) {
        duplicateRisks.push(
          `Source "${entry.sourceId}" has ${entryConflicts.length} conflict(s)`
        );
      }
    }
    if (entry.type === "topic") {
      const entryConflicts = conflicts.filter(
        (c) => c.entryType === "topic" && c.entryId === entry.topicId
      );
      topicsToAdd.push({
        action: "add-topic",
        entryId: entry.topicId,
        entryName: entry.topicName,
        conflicts: entryConflicts.map((c) => c.conflict.message),
        notes: "",
      });
      if (entryConflicts.length > 0) {
        duplicateRisks.push(
          `Topic "${entry.topicId}" has ${entryConflicts.length} conflict(s)`
        );
      }
    }
  }

  const capabilitiesImpacted = founderBetaCapabilities
    .filter((cap) =>
      approvedEntries.some(
        (e) =>
          (e.type === "topic" && e.capabilityIds.includes(cap.id)) ||
          (e.type === "source" && e.category === cap.name)
      )
    )
    .map((c) => `${c.id} (${c.name})`);

  const skillsImpacted = founderBetaSkills
    .filter((skill) =>
      approvedEntries.some(
        (e) =>
          (e.type === "topic" &&
            "skillIds" in e &&
            e.skillIds.includes(skill.id)) ||
          (e.type === "source" && skill.name.includes(e.category))
      )
    )
    .map((s) => `${s.id} (${s.name})`);

  if (conflicts.length > 0) {
    for (const c of conflicts) {
      reviewNotes.push(
        `[${c.conflict.severity.toUpperCase()}] ${c.entryType} "${
          c.entryId
        }": ${c.conflict.message}`
      );
    }
  }

  return {
    patchId: patch.id,
    patchTitle: patch.title,
    topicsToAdd,
    sourcesToAdd,
    capabilitiesImpacted,
    skillsImpacted,
    duplicateRisks,
    reviewNotes,
    generatedAt: now(),
  };
}

export function createImportReviewPackage(
  patch: ImportPatch
): ApprovedImportPackage {
  const reviewItems = deriveReviewItems(patch);
  const conflicts = collectConflicts(patch);

  return {
    id: `import-pkg-${patch.id}`,
    patch,
    reviewItems,
    approvedEntries: [],
    rejectedEntries: [],
    conflicts,
    summary: computeSummary(patch, reviewItems, conflicts),
    applicationPlan: generatePlan(patch, [], conflicts),
    createdAt: now(),
  };
}

export function reviewPatchEntry(
  pkg: ApprovedImportPackage,
  entryIndex: number
): ImportReviewItem | null {
  const item = pkg.reviewItems[entryIndex];
  return item || null;
}

export function approvePatchEntry(
  pkg: ApprovedImportPackage,
  entryIndex: number,
  notes?: string
): ApprovedImportPackage {
  const updatedItems = pkg.reviewItems.map((item, i) => {
    if (i !== entryIndex) return item;
    return { ...item, decision: "approved" as const, reviewNotes: notes || "", reviewedAt: now() };
  });
  const approved = updatedItems.filter((i) => i.decision === "approved").map((i) => i.entry);
  const rejected = updatedItems.filter((i) => i.decision === "rejected").map((i) => i.entry);
  return {
    ...pkg,
    reviewItems: updatedItems,
    approvedEntries: approved,
    rejectedEntries: rejected,
    summary: computeSummary(pkg.patch, updatedItems, pkg.conflicts),
    applicationPlan: generatePlan(pkg.patch, approved, pkg.conflicts),
  };
}

export function rejectPatchEntry(
  pkg: ApprovedImportPackage,
  entryIndex: number,
  notes?: string
): ApprovedImportPackage {
  const updatedItems = pkg.reviewItems.map((item, i) => {
    if (i !== entryIndex) return item;
    return { ...item, decision: "rejected" as const, reviewNotes: notes || "", reviewedAt: now() };
  });
  const approved = updatedItems.filter((i) => i.decision === "approved").map((i) => i.entry);
  const rejected = updatedItems.filter((i) => i.decision === "rejected").map((i) => i.entry);
  return {
    ...pkg,
    reviewItems: updatedItems,
    approvedEntries: approved,
    rejectedEntries: rejected,
    summary: computeSummary(pkg.patch, updatedItems, pkg.conflicts),
    applicationPlan: generatePlan(pkg.patch, approved, pkg.conflicts),
  };
}

export function detectImportConflicts(
  pkg: ApprovedImportPackage
): ImportConflict[] {
  return pkg.conflicts;
}

export function generateApplicationPlan(
  pkg: ApprovedImportPackage
): ImportApplicationPlan {
  return pkg.applicationPlan;
}

export function summarizeImportPackage(
  pkg: ApprovedImportPackage
): ImportReviewSummary {
  return pkg.summary;
}
