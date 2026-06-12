import type { SourceType, SourceTier, SourceReliability } from "./founder-beta";

export type PatchOperation = "add" | "update";

export type PatchEntryType = "topic" | "source" | "capability";

export type ApprovedImportCandidate = {
  candidateUrl: string;
  candidateId: string;
  title: string;
  sourceType: SourceType;
  category: string;
  description: string;
  tier: SourceTier;
  reliability: SourceReliability;
  overrideDuplicateRisk: boolean;
};

export type TopicPatchEntry = {
  type: "topic";
  operation: PatchOperation;
  topicId: string;
  topicName: string;
  domainId: string;
  capabilityIds: string[];
  skillIds: string[];
  sourceIds: string[];
  description: string;
};

export type SourcePatchEntry = {
  type: "source";
  operation: PatchOperation;
  sourceId: string;
  title: string;
  url: string;
  sourceType: SourceType;
  category: string;
  tier: SourceTier;
  reliability: SourceReliability;
  founderBetaRelevance: string;
};

export type CapabilityPatchEntry = {
  type: "capability";
  operation: PatchOperation;
  capabilityId: string;
  name: string;
  category: string;
  sourceIds: string[];
  skillIds: string[];
  description: string;
};

export type PatchEntry = TopicPatchEntry | SourcePatchEntry | CapabilityPatchEntry;

export type PatchConflict = {
  entryType: PatchEntryType;
  field: string;
  existingValue: unknown;
  incomingValue: unknown;
  severity: "info" | "warning" | "error";
  message: string;
};

export type PatchValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export type PatchGenerationReport = {
  totalCandidates: number;
  candidatesProcessed: number;
  candidatesSkipped: number;
  entriesGenerated: number;
  topicEntries: number;
  sourceEntries: number;
  capabilityEntries: number;
  conflicts: PatchConflict[];
  generatedAt: string;
};

export type ImportPatch = {
  id: string;
  title: string;
  description: string;
  entries: PatchEntry[];
  conflicts: PatchConflict[];
  report: PatchGenerationReport;
  generatedAt: string;
};
