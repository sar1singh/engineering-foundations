import { founderBetaCapabilities, founderBetaSkills } from "@/data/founder-beta";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";
import type { Capability, MasterTopic, ProofType, SourceReference } from "@/types/founder-beta";
import type { PatchEntry, SourcePatchEntry, TopicPatchEntry } from "@/types/ingestion-patch";
import type { ApprovedBatchPatchOutput } from "./approved-batch-patch-output-service";

export type InMemoryGraphImportCounts = {
  topics: number;
  sources: number;
  capabilities: number;
  skills: number;
};

export type GraphImportConflict = {
  entryType: PatchEntry["type"];
  entryId: string;
  field: string;
  severity: "error" | "warning";
  message: string;
};

export type SkippedGraphImportEntry = {
  entryType: PatchEntry["type"];
  entryId: string;
  reason: string;
};

export type GraphRollbackPlan = {
  removeTopicIds: string[];
  removeSourceIds: string[];
  restoreTopicIds: string[];
  restoreSourceIds: string[];
  notes: string[];
};

export type InMemoryGraphSnapshot = {
  topics: MasterTopic[];
  sources: SourceReference[];
  capabilities: Capability[];
  skills: typeof founderBetaSkills;
};

export type GraphImportResult = {
  addedTopics: MasterTopic[];
  addedSources: SourceReference[];
  updatedTopics: MasterTopic[];
  skippedEntries: SkippedGraphImportEntry[];
  conflicts: GraphImportConflict[];
  warnings: string[];
  rollbackPlan: GraphRollbackPlan;
  beforeCounts: InMemoryGraphImportCounts;
  afterCounts: InMemoryGraphImportCounts;
  graph: InMemoryGraphSnapshot;
};

export type InMemoryGraphImportOptions = {
  allowDuplicateSourceUrls?: boolean;
  baseGraph?: InMemoryGraphSnapshot;
};

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

function cloneGraph(baseGraph?: InMemoryGraphSnapshot): InMemoryGraphSnapshot {
  return {
    topics: (baseGraph?.topics ?? founderBetaMasterTopics).map((topic) => ({ ...topic, capabilityIds: [...topic.capabilityIds], skillIds: [...topic.skillIds], sourceIds: [...topic.sourceIds], prerequisiteTopicIds: [...topic.prerequisiteTopicIds], relatedTopicIds: [...topic.relatedTopicIds], successorTopicIds: [...topic.successorTopicIds], alternativeTopicIds: [...topic.alternativeTopicIds], proofTypes: [...topic.proofTypes], readinessMetrics: [...topic.readinessMetrics], missionTypes: [...topic.missionTypes] })),
    sources: (baseGraph?.sources ?? founderBetaSourceCatalog).map((source) => ({ ...source })),
    capabilities: (baseGraph?.capabilities ?? founderBetaCapabilities).map((capability) => ({ ...capability, targetRoles: [...capability.targetRoles], sourceCategories: [...capability.sourceCategories], sourceIds: [...capability.sourceIds], roadmapDependencies: [...capability.roadmapDependencies], missionTypes: [...capability.missionTypes], proofTypes: [...capability.proofTypes], skillIds: [...capability.skillIds] })),
    skills: (baseGraph?.skills ?? founderBetaSkills).map((skill) => ({ ...skill, topicIds: [...skill.topicIds], proofTypes: [...skill.proofTypes] })),
  };
}

function counts(graph: InMemoryGraphSnapshot): InMemoryGraphImportCounts {
  return {
    topics: graph.topics.length,
    sources: graph.sources.length,
    capabilities: graph.capabilities.length,
    skills: graph.skills.length,
  };
}

function entryId(entry: PatchEntry): string {
  if (entry.type === "source") return entry.sourceId;
  if (entry.type === "topic") return entry.topicId;
  return entry.capabilityId;
}

function skip(entry: PatchEntry, reason: string): SkippedGraphImportEntry {
  return { entryType: entry.type, entryId: entryId(entry), reason };
}

function conflict(
  entry: PatchEntry,
  field: string,
  message: string,
  severity: GraphImportConflict["severity"] = "error"
): GraphImportConflict {
  return { entryType: entry.type, entryId: entryId(entry), field, severity, message };
}

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, "").toLowerCase();
}

function deriveProofTypes(entry: TopicPatchEntry, graph: InMemoryGraphSnapshot): ProofType[] {
  const explicitProofTypes = (entry as TopicPatchEntry & { proofTypes?: ProofType[] }).proofTypes ?? [];
  const proofTypes = new Set<ProofType>(explicitProofTypes);

  for (const skillId of entry.skillIds) {
    const skill = graph.skills.find((item) => item.id === skillId);
    for (const proofType of skill?.proofTypes ?? []) proofTypes.add(proofType);
  }
  for (const capabilityId of entry.capabilityIds) {
    const capability = graph.capabilities.find((item) => item.id === capabilityId);
    for (const proofType of capability?.proofTypes ?? []) proofTypes.add(proofType);
  }

  if (proofTypes.size === 0) proofTypes.add("architecture-review");
  return [...proofTypes].sort();
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

function topicFromEntry(entry: TopicPatchEntry, graph: InMemoryGraphSnapshot): MasterTopic {
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
    proofTypes: deriveProofTypes(entry, graph),
    readinessMetrics: DEFAULT_READINESS_METRICS,
    missionTypes: DEFAULT_MISSION_TYPES,
    confidenceScore: 0.7,
  };
}

function validateEntry(
  entry: PatchEntry,
  graph: InMemoryGraphSnapshot,
  options: InMemoryGraphImportOptions
): GraphImportConflict[] {
  const conflicts: GraphImportConflict[] = [];

  if (entry.operation !== "add" && entry.operation !== "update") {
    conflicts.push(conflict(entry, "operation", `Unsupported operation "${entry.operation}".`));
  }

  if (entry.type === "source") {
    if (graph.sources.some((source) => source.id === entry.sourceId)) {
      conflicts.push(conflict(entry, "sourceId", `Duplicate source ID "${entry.sourceId}" is blocked.`));
    }
    if (!options.allowDuplicateSourceUrls && graph.sources.some((source) => normalizeUrl(source.url) === normalizeUrl(entry.url))) {
      conflicts.push(conflict(entry, "url", `Duplicate source URL "${entry.url}" is blocked.`));
    }
    if (!entry.url || !entry.title) {
      conflicts.push(conflict(entry, "source", "Source entries require title and URL."));
    }
  }

  if (entry.type === "topic") {
    if (entry.operation === "add" && graph.topics.some((topic) => topic.id === entry.topicId)) {
      conflicts.push(conflict(entry, "topicId", `Duplicate topic ID "${entry.topicId}" is blocked.`));
    }
    if (entry.sourceIds.length === 0) {
      conflicts.push(conflict(entry, "sourceIds", `Topic "${entry.topicId}" must reference at least one source.`));
    }
    for (const sourceId of entry.sourceIds) {
      if (!graph.sources.some((source) => source.id === sourceId)) {
        conflicts.push(conflict(entry, "sourceIds", `Topic "${entry.topicId}" references missing source "${sourceId}".`));
      }
    }
    for (const capabilityId of entry.capabilityIds) {
      if (!graph.capabilities.some((capability) => capability.id === capabilityId)) {
        conflicts.push(conflict(entry, "capabilityIds", `Topic "${entry.topicId}" references invalid capability "${capabilityId}".`));
      }
    }
    for (const skillId of entry.skillIds) {
      if (!graph.skills.some((skill) => skill.id === skillId)) {
        conflicts.push(conflict(entry, "skillIds", `Topic "${entry.topicId}" references invalid skill "${skillId}".`));
      }
    }
    if (deriveProofTypes(entry, graph).length === 0) {
      conflicts.push(conflict(entry, "proofTypes", `Topic "${entry.topicId}" requires at least one proof type.`));
    }
  }

  if (entry.type === "capability") {
    conflicts.push(conflict(entry, "type", "Capability import is not enabled for Pack 11F in-memory preview.", "warning"));
  }

  return conflicts;
}

export function applyPatchToInMemoryGraph(
  output: ApprovedBatchPatchOutput,
  options: InMemoryGraphImportOptions = {}
): GraphImportResult {
  const graph = cloneGraph(options.baseGraph);
  const beforeCounts = counts(graph);
  const addedTopics: MasterTopic[] = [];
  const addedSources: SourceReference[] = [];
  const updatedTopics: MasterTopic[] = [];
  const skippedEntries: SkippedGraphImportEntry[] = [];
  const conflicts: GraphImportConflict[] = [];
  const warnings: string[] = ["In-memory preview only. No canonical graph files are written."];

  for (const entry of output.approvedEntries) {
    const entryConflicts = validateEntry(entry, graph, options);
    conflicts.push(...entryConflicts);
    const blockingConflicts = entryConflicts.filter((item) => item.severity === "error");
    if (blockingConflicts.length > 0) {
      skippedEntries.push(skip(entry, blockingConflicts.map((item) => item.message).join(" ")));
      continue;
    }

    if (entry.type === "source") {
      const source = sourceFromEntry(entry);
      graph.sources.push(source);
      addedSources.push(source);
      continue;
    }

    if (entry.type === "topic") {
      if (entry.operation === "update") {
        const existing = graph.topics.find((topic) => topic.id === entry.topicId);
        if (!existing) {
          skippedEntries.push(skip(entry, `Topic "${entry.topicId}" cannot be updated because it does not exist.`));
          continue;
        }
        Object.assign(existing, topicFromEntry(entry, graph));
        updatedTopics.push({ ...existing });
      } else {
        const topic = topicFromEntry(entry, graph);
        graph.topics.push(topic);
        addedTopics.push(topic);
      }
      continue;
    }

    skippedEntries.push(skip(entry, "Capability entries are previewed as conflicts and not imported in Pack 11F."));
  }

  const afterCounts = counts(graph);
  const rollbackPlan: GraphRollbackPlan = {
    removeTopicIds: addedTopics.map((topic) => topic.id).sort(),
    removeSourceIds: addedSources.map((source) => source.id).sort(),
    restoreTopicIds: updatedTopics.map((topic) => topic.id).sort(),
    restoreSourceIds: [],
    notes: [
      "Rollback preview only. Discard the in-memory graph snapshot to restore canonical counts.",
      ...addedTopics.map((topic) => `Remove in-memory topic "${topic.id}".`),
      ...addedSources.map((source) => `Remove in-memory source "${source.id}".`),
    ],
  };

  return {
    addedTopics,
    addedSources,
    updatedTopics,
    skippedEntries,
    conflicts,
    warnings,
    rollbackPlan,
    beforeCounts,
    afterCounts,
    graph,
  };
}

export function validateInMemoryGraphImport(result: GraphImportResult): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors = result.conflicts
    .filter((conflictItem) => conflictItem.severity === "error")
    .map((conflictItem) => conflictItem.message);
  return {
    valid: errors.length === 0,
    errors,
    warnings: [...result.warnings, ...result.conflicts.filter((conflictItem) => conflictItem.severity === "warning").map((conflictItem) => conflictItem.message)],
  };
}

export function rollbackInMemoryGraphImport(result: GraphImportResult): InMemoryGraphSnapshot {
  const removeTopicIds = new Set(result.rollbackPlan.removeTopicIds);
  const removeSourceIds = new Set(result.rollbackPlan.removeSourceIds);
  return {
    topics: result.graph.topics.filter((topic) => !removeTopicIds.has(topic.id)),
    sources: result.graph.sources.filter((source) => !removeSourceIds.has(source.id)),
    capabilities: result.graph.capabilities,
    skills: result.graph.skills,
  };
}

export function compareGraphBeforeAfter(result: GraphImportResult): InMemoryGraphImportCounts {
  return {
    topics: result.afterCounts.topics - result.beforeCounts.topics,
    sources: result.afterCounts.sources - result.beforeCounts.sources,
    capabilities: result.afterCounts.capabilities - result.beforeCounts.capabilities,
    skills: result.afterCounts.skills - result.beforeCounts.skills,
  };
}

export function summarizeGraphImport(result: GraphImportResult): string {
  const delta = compareGraphBeforeAfter(result);
  return [
    `topics:+${delta.topics}`,
    `sources:+${delta.sources}`,
    `updatedTopics:${result.updatedTopics.length}`,
    `skipped:${result.skippedEntries.length}`,
    `conflicts:${result.conflicts.length}`,
    `rollbackTopics:${result.rollbackPlan.removeTopicIds.length}`,
    `rollbackSources:${result.rollbackPlan.removeSourceIds.length}`,
  ].join(" | ");
}
