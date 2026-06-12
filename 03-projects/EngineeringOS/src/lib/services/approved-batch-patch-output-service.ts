import type { ImportPatch, PatchEntry, PatchValidationResult } from "@/types/ingestion-patch";
import type { ApprovedImportPackage, ImportConflict, ImportReviewItem } from "@/types/import-review";
import { validatePatch, getPatchOutputPath } from "./approved-import-patch-generator";

export type ApprovedBatchPatchOutput = {
  id: string;
  title: string;
  description: string;
  sourcePatch: ImportPatch;
  approvedEntries: PatchEntry[];
  rejectedEntries: PatchEntry[];
  pendingEntries: PatchEntry[];
  conflicts: ImportConflict[];
  warnings: string[];
  rollbackNotes: string[];
  summary: {
    totalEntries: number;
    approvedCount: number;
    rejectedCount: number;
    pendingCount: number;
    hasConflicts: boolean;
    hasWarnings: boolean;
    hasApprovedEntries: boolean;
  };
  generatedAt: string;
  outputPath: string;
};

function computePendingEntries(
  reviewItems: ImportReviewItem[],
  approvedEntries: PatchEntry[],
  rejectedEntries: PatchEntry[]
): PatchEntry[] {
  const approvedSet = new Set(approvedEntries);
  const rejectedSet = new Set(rejectedEntries);
  return reviewItems
    .filter((i) => !approvedSet.has(i.entry) && !rejectedSet.has(i.entry))
    .map((i) => i.entry);
}

function generateRollbackNotes(
  entries: PatchEntry[],
  conflicts: ImportConflict[]
): string[] {
  const notes: string[] = [];
  for (const entry of entries) {
    if (entry.type === "source") {
      notes.push(`Rollback: Remove source "${entry.sourceId}" from source catalog.`);
    } else if (entry.type === "topic") {
      notes.push(`Rollback: Remove topic "${entry.topicId}" from master topics and remove all references.`);
    }
  }
  if (conflicts.length > 0) {
    notes.push(`Rollback note: ${conflicts.length} conflict(s) may require manual resolution during rollback.`);
  }
  if (entries.length === 0) {
    notes.push("Rollback: No entries to roll back — output is empty.");
  }
  return notes;
}

export function createApprovedBatchPatch(
  pkg: ApprovedImportPackage
): ApprovedBatchPatchOutput {
  const approvedEntries = pkg.approvedEntries;
  const rejectedEntries = pkg.rejectedEntries;
  const pendingEntries = computePendingEntries(pkg.reviewItems, approvedEntries, rejectedEntries);

  const validation = validatePatch(pkg.patch);

  const warnings: string[] = [...validation.warnings];
  if (pkg.conflicts.length > 0) {
    warnings.push(`${pkg.conflicts.length} conflict(s) detected — review before applying.`);
  }
  if (approvedEntries.length === 0) {
    warnings.push("No approved entries — output contains zero entries.");
  }

  const rollbackNotes = generateRollbackNotes(approvedEntries, pkg.conflicts);

  return {
    id: `batch-patch-${pkg.patch.id}`,
    title: "Approved Batch Import Patch",
    description: `Batch patch with ${approvedEntries.length} approved entry(ies) from review package ${pkg.id}`,
    sourcePatch: pkg.patch,
    approvedEntries,
    rejectedEntries,
    pendingEntries,
    conflicts: pkg.conflicts,
    warnings,
    rollbackNotes,
    summary: {
      totalEntries: pkg.summary.totalEntries,
      approvedCount: approvedEntries.length,
      rejectedCount: rejectedEntries.length,
      pendingCount: pendingEntries.length,
      hasConflicts: pkg.conflicts.length > 0,
      hasWarnings: warnings.length > 0,
      hasApprovedEntries: approvedEntries.length > 0,
    },
    generatedAt: new Date().toISOString(),
    outputPath: getPatchOutputPath(),
  };
}

export function validateApprovedBatchPatch(
  output: ApprovedBatchPatchOutput
): PatchValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!output.id) errors.push("Output ID is required");
  if (output.approvedEntries.length === 0) {
    warnings.push("No approved entries in output — patch will be empty.");
  }
  if (output.conflicts.length > 0) {
    const errorConflicts = output.conflicts.filter(
      (c) => c.conflict.severity === "error"
    );
    if (errorConflicts.length > 0) {
      errors.push(
        `${errorConflicts.length} error-level conflict(s) must be resolved before patch output.`
      );
    }
    warnings.push(`${output.conflicts.length} conflict(s) detected in output.`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function serializeApprovedBatchPatch(
  output: ApprovedBatchPatchOutput
): string {
  return JSON.stringify(output, null, 2);
}

export function createPatchOutputFilename(): string {
  return "approved-batch-import-patch.preview.json";
}

export function summarizeApprovedBatchPatch(
  output: ApprovedBatchPatchOutput
): ApprovedBatchPatchOutput["summary"] {
  return output.summary;
}
