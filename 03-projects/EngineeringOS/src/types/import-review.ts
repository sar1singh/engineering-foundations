import type { PatchEntry, PatchConflict, ImportPatch } from "./ingestion-patch";

export type ImportReviewDecision = "pending" | "approved" | "rejected" | "needs-review";

export type ImportReviewItem = {
  patchId: string;
  entryIndex: number;
  entry: PatchEntry;
  decision: ImportReviewDecision;
  reviewNotes: string;
  reviewedAt: string | null;
};

export type ImportConflict = {
  entryIndex: number;
  entryType: PatchEntry["type"];
  entryId: string;
  conflict: PatchConflict;
};

export type ImportReviewSummary = {
  patchId: string;
  totalEntries: number;
  approvedCount: number;
  rejectedCount: number;
  needsReviewCount: number;
  pendingCount: number;
  conflicts: ImportConflict[];
  createdAt: string;
};

export type ApplicationPlanEntry = {
  action: "add-topic" | "add-source";
  entryId: string;
  entryName: string;
  conflicts: string[];
  notes: string;
};

export type ImportApplicationPlan = {
  patchId: string;
  patchTitle: string;
  topicsToAdd: ApplicationPlanEntry[];
  sourcesToAdd: ApplicationPlanEntry[];
  capabilitiesImpacted: string[];
  skillsImpacted: string[];
  duplicateRisks: string[];
  reviewNotes: string[];
  generatedAt: string;
};

export type ApprovedImportPackage = {
  id: string;
  patch: ImportPatch;
  reviewItems: ImportReviewItem[];
  approvedEntries: PatchEntry[];
  rejectedEntries: PatchEntry[];
  conflicts: ImportConflict[];
  summary: ImportReviewSummary;
  applicationPlan: ImportApplicationPlan;
  createdAt: string;
};
