import type { ApprovedBatchPatchOutput } from "./approved-batch-patch-output-service";
import type {
  CanonicalGraphPatchEntry,
  CanonicalGraphPatchProposal,
  CanonicalGraphPatchSummary,
} from "@/types/canonical-graph-patch";
import type { MasterTopic, SourceReference } from "@/types/founder-beta";
import type { SourcePatchEntry, TopicPatchEntry } from "@/types/ingestion-patch";
import {
  applyCanonicalGraphPatchInMemory,
  type CanonicalApplyResult,
} from "./canonical-graph-apply-service";

function convertSourceEntry(entry: SourcePatchEntry): CanonicalGraphPatchEntry & { type: "source" } {
  const source: SourceReference = {
    id: entry.sourceId,
    title: entry.title,
    url: entry.url,
    sourceType: entry.sourceType,
    category: entry.category,
    tier: entry.tier,
    reliability: entry.reliability,
    founderBetaRelevance: entry.founderBetaRelevance,
  };
  return {
    type: "source",
    operation: "add",
    entryId: entry.sourceId,
    source,
    duplicateChecks: { duplicateId: false, duplicateUrl: false },
  };
}

function convertTopicEntry(entry: TopicPatchEntry): CanonicalGraphPatchEntry & { type: "topic" } {
  const topic: MasterTopic = {
    id: entry.topicId,
    name: entry.topicName,
    domainId: entry.domainId,
    capabilityIds: [...entry.capabilityIds],
    skillIds: [...entry.skillIds],
    sourceIds: [...entry.sourceIds],
    prerequisiteTopicIds: [],
    relatedTopicIds: [],
    successorTopicIds: [],
    alternativeTopicIds: [],
    interviewImportance: "medium",
    roadmapPriority: "p2",
    estimatedStudyMinutes: 30,
    estimatedPracticeMinutes: 60,
    proofTypes: ["architecture-review"],
    readinessMetrics: ["knowledge"],
    missionTypes: ["learn"],
    confidenceScore: 0.5,
  };
  return {
    type: "topic",
    operation: "add",
    entryId: entry.topicId,
    topic,
    capabilityReferences: [],
    skillReferences: [],
    sourceIds: [...entry.sourceIds],
    affectedMissions: [],
    duplicateChecks: { duplicateId: false },
  };
}

function computeSummary(
  sourceEntries: number,
  topicEntries: number,
  warnings: string[],
  packageId: string
): CanonicalGraphPatchSummary {
  return {
    packageId,
    totalApprovedEntries: sourceEntries + topicEntries,
    sourceAdds: sourceEntries,
    topicAdds: topicEntries,
    conflictCount: 0,
    warningCount: warnings.length,
    affectedCapabilityIds: [],
    affectedSkillIds: [],
    affectedMissionIds: [],
    hasBlockingConflicts: false,
  };
}

export function convertBatchPatchOutputToProposal(
  output: ApprovedBatchPatchOutput,
  reviewer: string = "sarwan"
): CanonicalGraphPatchProposal {
  const sourceEntries: CanonicalGraphPatchEntry[] = output.approvedEntries
    .filter((entry): entry is SourcePatchEntry => entry.type === "source")
    .map(convertSourceEntry);

  const topicEntries: CanonicalGraphPatchEntry[] = output.approvedEntries
    .filter((entry): entry is TopicPatchEntry => entry.type === "topic")
    .map(convertTopicEntry);

  const entries: CanonicalGraphPatchEntry[] = [...sourceEntries, ...topicEntries];
  const warnings = [...output.warnings];

  return {
    id: `batch-import-${output.id}`,
    packageId: output.id,
    patchId: output.sourcePatch.id,
    title: output.title,
    entries,
    conflicts: [],
    warnings,
    summary: computeSummary(sourceEntries.length, topicEntries.length, warnings, output.id),
    review: {
      reviewRequired: true,
      approvalStatus: "approved",
      reviewer,
      reviewedAt: new Date().toISOString(),
      notes: [
        "Auto-approved batch patch from approved batch import pipeline.",
        `${output.approvedEntries.length} entries approved for graph import.`,
      ],
    },
    generatedAt: new Date().toISOString(),
  };
}

export function applyApprovedBatchGraphImport(
  output: ApprovedBatchPatchOutput,
  baseGraph?: Parameters<typeof applyCanonicalGraphPatchInMemory>[1]
): CanonicalApplyResult {
  const proposal = convertBatchPatchOutputToProposal(output);
  return applyCanonicalGraphPatchInMemory(proposal, baseGraph);
}
