import type { Capability, DailyMission, MasterTopic, SourceReference, Skill } from "./founder-beta";
import type { PatchEntry } from "./ingestion-patch";
import type { ApprovedImportPackage } from "./import-review";

export type CanonicalGraphPatchEntry =
  | {
      type: "source";
      operation: "add";
      entryId: string;
      source: SourceReference;
      duplicateChecks: {
        duplicateId: boolean;
        duplicateUrl: boolean;
      };
    }
  | {
      type: "topic";
      operation: "add";
      entryId: string;
      topic: MasterTopic;
      capabilityReferences: Capability[];
      skillReferences: Skill[];
      sourceIds: string[];
      affectedMissions: DailyMission[];
      duplicateChecks: {
        duplicateId: boolean;
      };
    };

export type CanonicalGraphConflict = {
  entryType: PatchEntry["type"];
  entryId: string;
  field: string;
  severity: "error" | "warning";
  message: string;
};

export type CanonicalGraphPatchSummary = {
  packageId: string;
  totalApprovedEntries: number;
  sourceAdds: number;
  topicAdds: number;
  conflictCount: number;
  warningCount: number;
  affectedCapabilityIds: string[];
  affectedSkillIds: string[];
  affectedMissionIds: string[];
  hasBlockingConflicts: boolean;
};

export type CanonicalGraphPatchReview = {
  reviewRequired: true;
  approvalStatus: "pending" | "approved" | "rejected";
  reviewer: string | null;
  reviewedAt: string | null;
  notes: string[];
};

export type CanonicalGraphPatchProposal = {
  id: string;
  packageId: ApprovedImportPackage["id"];
  patchId: string;
  title: string;
  entries: CanonicalGraphPatchEntry[];
  conflicts: CanonicalGraphConflict[];
  warnings: string[];
  summary: CanonicalGraphPatchSummary;
  review: CanonicalGraphPatchReview;
  generatedAt: string;
};
