import { founderBetaCapabilities, founderBetaSkills } from "@/data/founder-beta";
import { founderBetaDailyMissions } from "@/data/founder-beta/daily-missions";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";
import type {
  CanonicalGraphConflict,
  CanonicalGraphPatchEntry,
  CanonicalGraphPatchProposal,
  CanonicalGraphPatchSummary,
} from "@/types/canonical-graph-patch";
import type { MasterTopic, ProofType, SourceReference } from "@/types/founder-beta";
import type { PatchEntry, SourcePatchEntry, TopicPatchEntry } from "@/types/ingestion-patch";
import type { ApprovedImportPackage } from "@/types/import-review";

const DEFAULT_READINESS_METRICS: MasterTopic["readinessMetrics"] = [
  "knowledge",
  "practice",
  "interview",
  "implementation",
];

const DEFAULT_MISSION_TYPES: MasterTopic["missionTypes"] = [
  "learn",
  "practice",
  "interview",
  "revision",
];

function stableNow(): string {
  return new Date().toISOString();
}

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, "").toLowerCase();
}

function entryId(entry: PatchEntry): string {
  if (entry.type === "source") return entry.sourceId;
  if (entry.type === "topic") return entry.topicId;
  return entry.capabilityId;
}

function conflict(
  entry: PatchEntry,
  field: string,
  message: string,
  severity: CanonicalGraphConflict["severity"] = "error"
): CanonicalGraphConflict {
  return {
    entryType: entry.type,
    entryId: entryId(entry),
    field,
    message,
    severity,
  };
}

function sourceFromEntry(entry: SourcePatchEntry): SourceReference {
  return {
    id: entry.sourceId,
    title: entry.title,
    url: entry.url,
    sourceType: entry.sourceType,
    category: entry.category,
    tier: entry.tier,
    reliability: entry.reliability,
    founderBetaRelevance: entry.founderBetaRelevance,
  };
}

function deriveProofTypes(entry: TopicPatchEntry): ProofType[] {
  const explicitProofTypes = (entry as TopicPatchEntry & { proofTypes?: ProofType[] }).proofTypes ?? [];
  const proofTypes = new Set<ProofType>(explicitProofTypes);

  for (const skillId of entry.skillIds) {
    const skill = founderBetaSkills.find((item) => item.id === skillId);
    for (const proofType of skill?.proofTypes ?? []) proofTypes.add(proofType);
  }
  for (const capabilityId of entry.capabilityIds) {
    const capability = founderBetaCapabilities.find((item) => item.id === capabilityId);
    for (const proofType of capability?.proofTypes ?? []) proofTypes.add(proofType);
  }

  if (proofTypes.size === 0) proofTypes.add("architecture-review");
  return [...proofTypes].sort();
}

function topicFromEntry(entry: TopicPatchEntry): MasterTopic {
  return {
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
    estimatedStudyMinutes: 60,
    estimatedPracticeMinutes: 90,
    proofTypes: deriveProofTypes(entry),
    readinessMetrics: DEFAULT_READINESS_METRICS,
    missionTypes: DEFAULT_MISSION_TYPES,
    confidenceScore: 0.7,
  };
}

function validateEntry(
  entry: PatchEntry,
  proposedSourceIds: Set<string>
): CanonicalGraphConflict[] {
  const conflicts: CanonicalGraphConflict[] = [];

  if (entry.operation !== "add") {
    conflicts.push(conflict(entry, "operation", "Pack 11G supports add-only canonical patch proposals."));
  }

  if (entry.type === "source") {
    if (founderBetaSourceCatalog.some((source) => source.id === entry.sourceId)) {
      conflicts.push(conflict(entry, "sourceId", `Source ID "${entry.sourceId}" already exists.`));
    }
    if (founderBetaSourceCatalog.some((source) => normalizeUrl(source.url) === normalizeUrl(entry.url))) {
      conflicts.push(conflict(entry, "url", `Source URL "${entry.url}" already exists.`));
    }
    if (!entry.title || !entry.url) {
      conflicts.push(conflict(entry, "source", "Source entries require title and URL."));
    }
  }

  if (entry.type === "topic") {
    if (founderBetaMasterTopics.some((topic) => topic.id === entry.topicId)) {
      conflicts.push(conflict(entry, "topicId", `Topic ID "${entry.topicId}" already exists.`));
    }
    if (entry.sourceIds.length === 0) {
      conflicts.push(conflict(entry, "sourceIds", `Topic "${entry.topicId}" must reference at least one source.`));
    }
    for (const sourceId of entry.sourceIds) {
      const canonicalExists = founderBetaSourceCatalog.some((source) => source.id === sourceId);
      if (!canonicalExists && !proposedSourceIds.has(sourceId)) {
        conflicts.push(conflict(entry, "sourceIds", `Topic "${entry.topicId}" references missing source "${sourceId}".`));
      }
    }
    for (const capabilityId of entry.capabilityIds) {
      if (!founderBetaCapabilities.some((capability) => capability.id === capabilityId)) {
        conflicts.push(conflict(entry, "capabilityIds", `Topic "${entry.topicId}" references missing capability "${capabilityId}".`));
      }
    }
    for (const skillId of entry.skillIds) {
      if (!founderBetaSkills.some((skill) => skill.id === skillId)) {
        conflicts.push(conflict(entry, "skillIds", `Topic "${entry.topicId}" references missing skill "${skillId}".`));
      }
    }
    if (deriveProofTypes(entry).length === 0) {
      conflicts.push(conflict(entry, "proofTypes", `Topic "${entry.topicId}" requires at least one proof type.`));
    }
  }

  if (entry.type === "capability") {
    conflicts.push(conflict(entry, "type", "Capability canonical patch proposals are not enabled in Pack 11G.", "warning"));
  }

  return conflicts;
}

function createPatchEntries(pkg: ApprovedImportPackage): CanonicalGraphPatchEntry[] {
  const entries: CanonicalGraphPatchEntry[] = [];

  for (const entry of pkg.approvedEntries) {
    if (entry.type === "source" && entry.operation === "add") {
      entries.push({
        type: "source",
        operation: "add",
        entryId: entry.sourceId,
        source: sourceFromEntry(entry),
        duplicateChecks: {
          duplicateId: founderBetaSourceCatalog.some((source) => source.id === entry.sourceId),
          duplicateUrl: founderBetaSourceCatalog.some((source) => normalizeUrl(source.url) === normalizeUrl(entry.url)),
        },
      });
    }

    if (entry.type === "topic" && entry.operation === "add") {
      const affectedMissions = founderBetaDailyMissions
        .filter(
          (mission) =>
            mission.topicId === entry.topicId ||
            entry.capabilityIds.includes(mission.capabilityId) ||
            mission.prerequisiteTopicIds.includes(entry.topicId)
        )
        .sort((a, b) => a.id.localeCompare(b.id));

      entries.push({
        type: "topic",
        operation: "add",
        entryId: entry.topicId,
        topic: topicFromEntry(entry),
        capabilityReferences: founderBetaCapabilities
          .filter((capability) => entry.capabilityIds.includes(capability.id))
          .sort((a, b) => a.id.localeCompare(b.id)),
        skillReferences: founderBetaSkills
          .filter((skill) => entry.skillIds.includes(skill.id))
          .sort((a, b) => a.id.localeCompare(b.id)),
        sourceIds: [...entry.sourceIds].sort(),
        affectedMissions,
        duplicateChecks: {
          duplicateId: founderBetaMasterTopics.some((topic) => topic.id === entry.topicId),
        },
      });
    }
  }

  return entries.sort((a, b) => `${a.type}:${a.entryId}`.localeCompare(`${b.type}:${b.entryId}`));
}

export function detectCanonicalPatchConflicts(
  pkg: ApprovedImportPackage
): CanonicalGraphConflict[] {
  const proposedSourceIds = new Set(
    pkg.approvedEntries
      .filter((entry): entry is SourcePatchEntry => entry.type === "source")
      .map((entry) => entry.sourceId)
  );

  return pkg.approvedEntries.flatMap((entry) => validateEntry(entry, proposedSourceIds));
}

export function summarizeCanonicalPatchProposal(
  proposal: CanonicalGraphPatchProposal
): CanonicalGraphPatchSummary {
  return proposal.summary;
}

function buildSummary(
  pkg: ApprovedImportPackage,
  entries: CanonicalGraphPatchEntry[],
  conflicts: CanonicalGraphConflict[],
  warnings: string[]
): CanonicalGraphPatchSummary {
  const topicEntries = entries.filter((entry) => entry.type === "topic");
  const affectedCapabilityIds = new Set<string>();
  const affectedSkillIds = new Set<string>();
  const affectedMissionIds = new Set<string>();

  for (const entry of topicEntries) {
    for (const capability of entry.capabilityReferences) affectedCapabilityIds.add(capability.id);
    for (const skill of entry.skillReferences) affectedSkillIds.add(skill.id);
    for (const mission of entry.affectedMissions) affectedMissionIds.add(mission.id);
  }

  return {
    packageId: pkg.id,
    totalApprovedEntries: pkg.approvedEntries.length,
    sourceAdds: entries.filter((entry) => entry.type === "source").length,
    topicAdds: topicEntries.length,
    conflictCount: conflicts.length,
    warningCount: warnings.length,
    affectedCapabilityIds: [...affectedCapabilityIds].sort(),
    affectedSkillIds: [...affectedSkillIds].sort(),
    affectedMissionIds: [...affectedMissionIds].sort(),
    hasBlockingConflicts: conflicts.some((item) => item.severity === "error"),
  };
}

export function generateCanonicalPatchProposal(
  pkg: ApprovedImportPackage
): CanonicalGraphPatchProposal {
  const entries = createPatchEntries(pkg);
  const conflicts = detectCanonicalPatchConflicts(pkg);
  const warnings = [
    "Canonical graph patch proposal only. Human review is required before any graph update.",
    ...(pkg.approvedEntries.length === 0 ? ["No approved entries are available for proposal generation."] : []),
  ];
  const generatedAt = stableNow();

  const proposal: CanonicalGraphPatchProposal = {
    id: `canonical-graph-patch-${pkg.id}`,
    packageId: pkg.id,
    patchId: pkg.patch.id,
    title: `Canonical Graph Patch Proposal for ${pkg.patch.title}`,
    entries,
    conflicts,
    warnings,
    summary: buildSummary(pkg, entries, conflicts, warnings),
    review: {
      reviewRequired: true,
      approvalStatus: "pending",
      reviewer: null,
      reviewedAt: null,
      notes: ["Human review required before graph update."],
    },
    generatedAt,
  };

  return proposal;
}

export function validateCanonicalPatchProposal(
  proposal: CanonicalGraphPatchProposal
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings = [...proposal.warnings];

  if (!proposal.review.reviewRequired) {
    errors.push("Canonical patch proposals must require human review.");
  }
  if (proposal.review.approvalStatus !== "pending") {
    errors.push("Canonical patch proposal approval status must start as pending.");
  }
  if (proposal.summary.totalApprovedEntries === 0) {
    warnings.push("Proposal contains no approved entries.");
  }
  for (const conflictItem of proposal.conflicts) {
    if (conflictItem.severity === "error") {
      errors.push(conflictItem.message);
    } else {
      warnings.push(conflictItem.message);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function serializeCanonicalPatchProposal(
  proposal: CanonicalGraphPatchProposal
): string {
  return JSON.stringify(proposal, null, 2);
}
