import { founderBetaCapabilities, founderBetaSkills } from "@/data/founder-beta";
import { founderBetaDailyMissions } from "@/data/founder-beta/daily-missions";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";
import type { CanonicalGraphPatchEntry, CanonicalGraphPatchProposal } from "@/types/canonical-graph-patch";
import type { Capability, DailyMission, MasterTopic, SourceReference, Skill } from "@/types/founder-beta";

export type CanonicalApplyGraph = {
  sources: SourceReference[];
  topics: MasterTopic[];
  capabilities: Capability[];
  skills: Skill[];
  missions: DailyMission[];
};

export type CanonicalApplyPlan = {
  proposalId: string;
  sourceIdsToAdd: string[];
  topicIdsToAdd: string[];
  filesToUpdate: string[];
  rollbackNotes: string[];
  humanApprovalEvidence: string[];
};

export type CanonicalApplyResult = {
  proposalId: string;
  appliedSources: SourceReference[];
  appliedTopics: MasterTopic[];
  skippedEntries: Array<{ entryId: string; reason: string }>;
  conflicts: string[];
  beforeCounts: {
    sources: number;
    topics: number;
    capabilities: number;
    skills: number;
    missions: number;
  };
  afterCounts: {
    sources: number;
    topics: number;
    capabilities: number;
    skills: number;
    missions: number;
  };
  plan: CanonicalApplyPlan;
  graph: CanonicalApplyGraph;
};

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, "").toLowerCase();
}

function cloneGraph(baseGraph?: Partial<CanonicalApplyGraph>): CanonicalApplyGraph {
  return {
    sources: (baseGraph?.sources ?? founderBetaSourceCatalog).map((source) => ({ ...source })),
    topics: (baseGraph?.topics ?? founderBetaMasterTopics).map((topic) => ({
      ...topic,
      capabilityIds: [...topic.capabilityIds],
      skillIds: [...topic.skillIds],
      sourceIds: [...topic.sourceIds],
      prerequisiteTopicIds: [...topic.prerequisiteTopicIds],
      relatedTopicIds: [...topic.relatedTopicIds],
      successorTopicIds: [...topic.successorTopicIds],
      alternativeTopicIds: [...topic.alternativeTopicIds],
      proofTypes: [...topic.proofTypes],
      readinessMetrics: [...topic.readinessMetrics],
      missionTypes: [...topic.missionTypes],
    })),
    capabilities: (baseGraph?.capabilities ?? founderBetaCapabilities).map((capability) => ({
      ...capability,
      targetRoles: [...capability.targetRoles],
      sourceCategories: [...capability.sourceCategories],
      sourceIds: [...capability.sourceIds],
      roadmapDependencies: [...capability.roadmapDependencies],
      missionTypes: [...capability.missionTypes],
      proofTypes: [...capability.proofTypes],
      skillIds: [...capability.skillIds],
    })),
    skills: (baseGraph?.skills ?? founderBetaSkills).map((skill) => ({
      ...skill,
      topicIds: [...skill.topicIds],
      proofTypes: [...skill.proofTypes],
    })),
    missions: (baseGraph?.missions ?? founderBetaDailyMissions).map((mission) => ({
      ...mission,
      prerequisiteTopicIds: [...mission.prerequisiteTopicIds],
      tasks: mission.tasks.map((task) => ({ ...task })),
      proofRequirements: mission.proofRequirements.map((proof) => ({ ...proof, rubric: [...proof.rubric] })),
      readinessImpact: [...mission.readinessImpact],
    })),
  };
}

function counts(graph: CanonicalApplyGraph): CanonicalApplyResult["beforeCounts"] {
  return {
    sources: graph.sources.length,
    topics: graph.topics.length,
    capabilities: graph.capabilities.length,
    skills: graph.skills.length,
    missions: graph.missions.length,
  };
}

function sourceEntries(proposal: CanonicalGraphPatchProposal): Extract<CanonicalGraphPatchEntry, { type: "source" }>[] {
  return proposal.entries.filter((entry): entry is Extract<CanonicalGraphPatchEntry, { type: "source" }> => entry.type === "source");
}

function topicEntries(proposal: CanonicalGraphPatchProposal): Extract<CanonicalGraphPatchEntry, { type: "topic" }>[] {
  return proposal.entries.filter((entry): entry is Extract<CanonicalGraphPatchEntry, { type: "topic" }> => entry.type === "topic");
}

export function validateHumanApprovedPatch(
  proposal: CanonicalGraphPatchProposal
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings = [...proposal.warnings];

  if (!proposal.review.reviewRequired) {
    errors.push("Human review gate is required.");
  }
  if (proposal.review.approvalStatus !== "approved") {
    errors.push(`Patch approval status must be approved, received "${proposal.review.approvalStatus}".`);
  }
  if (!proposal.review.reviewer) {
    errors.push("Approved patch requires reviewer identity.");
  }
  if (!proposal.review.reviewedAt) {
    errors.push("Approved patch requires reviewedAt timestamp.");
  }
  if (proposal.conflicts.some((conflict) => conflict.severity === "error")) {
    errors.push("Approved patch contains blocking conflicts.");
  }
  if (proposal.entries.length === 0) {
    errors.push("Approved patch contains no entries.");
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function generateCanonicalApplyPlan(
  proposal: CanonicalGraphPatchProposal
): CanonicalApplyPlan {
  const sourceIdsToAdd = sourceEntries(proposal).map((entry) => entry.source.id).sort();
  const topicIdsToAdd = topicEntries(proposal).map((entry) => entry.topic.id).sort();
  const filesToUpdate = [
    ...(sourceIdsToAdd.length > 0 ? ["src/data/founder-beta/source-catalog.ts"] : []),
    ...(topicIdsToAdd.length > 0 ? ["src/data/founder-beta/master-topics.ts"] : []),
  ];

  return {
    proposalId: proposal.id,
    sourceIdsToAdd,
    topicIdsToAdd,
    filesToUpdate,
    rollbackNotes: [
      ...topicIdsToAdd.map((topicId) => `Remove topic "${topicId}" from master topics.`),
      ...sourceIdsToAdd.map((sourceId) => `Remove source "${sourceId}" from source catalog.`),
      "Re-run graph integrity tests after rollback.",
    ],
    humanApprovalEvidence: [
      `reviewRequired=${proposal.review.reviewRequired}`,
      `approvalStatus=${proposal.review.approvalStatus}`,
      `reviewer=${proposal.review.reviewer ?? "none"}`,
      `reviewedAt=${proposal.review.reviewedAt ?? "none"}`,
      ...proposal.review.notes,
    ],
  };
}

export function applyCanonicalGraphPatchInMemory(
  proposal: CanonicalGraphPatchProposal,
  baseGraph?: Partial<CanonicalApplyGraph>
): CanonicalApplyResult {
  const validation = validateHumanApprovedPatch(proposal);
  const graph = cloneGraph(baseGraph);
  const beforeCounts = counts(graph);
  const appliedSources: SourceReference[] = [];
  const appliedTopics: MasterTopic[] = [];
  const skippedEntries: CanonicalApplyResult["skippedEntries"] = [];
  const conflicts: string[] = [...validation.errors];

  if (!validation.valid) {
    return {
      proposalId: proposal.id,
      appliedSources,
      appliedTopics,
      skippedEntries: proposal.entries.map((entry) => ({ entryId: entry.entryId, reason: "Patch is not human-approved." })),
      conflicts,
      beforeCounts,
      afterCounts: beforeCounts,
      plan: generateCanonicalApplyPlan(proposal),
      graph,
    };
  }

  for (const entry of sourceEntries(proposal)) {
    const duplicateId = graph.sources.some((source) => source.id === entry.source.id);
    const duplicateUrl = graph.sources.some((source) => normalizeUrl(source.url) === normalizeUrl(entry.source.url));
    if (duplicateId || duplicateUrl) {
      skippedEntries.push({ entryId: entry.entryId, reason: duplicateId ? "Duplicate source ID." : "Duplicate source URL." });
      conflicts.push(`${entry.entryId}: ${duplicateId ? "Duplicate source ID." : "Duplicate source URL."}`);
      continue;
    }
    graph.sources.push({ ...entry.source });
    appliedSources.push({ ...entry.source });
  }

  for (const entry of topicEntries(proposal)) {
    const duplicateTopic = graph.topics.some((topic) => topic.id === entry.topic.id);
    if (duplicateTopic) {
      skippedEntries.push({ entryId: entry.entryId, reason: "Duplicate topic ID." });
      conflicts.push(`${entry.entryId}: Duplicate topic ID.`);
      continue;
    }

    const missingSources = entry.topic.sourceIds.filter((sourceId) => !graph.sources.some((source) => source.id === sourceId));
    const missingCapabilities = entry.topic.capabilityIds.filter((capabilityId) => !graph.capabilities.some((capability) => capability.id === capabilityId));
    const missingSkills = entry.topic.skillIds.filter((skillId) => !graph.skills.some((skill) => skill.id === skillId));
    if (missingSources.length > 0 || missingCapabilities.length > 0 || missingSkills.length > 0) {
      const reason = [
        missingSources.length > 0 ? `Missing sources: ${missingSources.join(", ")}` : "",
        missingCapabilities.length > 0 ? `Missing capabilities: ${missingCapabilities.join(", ")}` : "",
        missingSkills.length > 0 ? `Missing skills: ${missingSkills.join(", ")}` : "",
      ].filter(Boolean).join("; ");
      skippedEntries.push({ entryId: entry.entryId, reason });
      conflicts.push(`${entry.entryId}: ${reason}`);
      continue;
    }

    const topic = {
      ...entry.topic,
      capabilityIds: [...entry.topic.capabilityIds],
      skillIds: [...entry.topic.skillIds],
      sourceIds: [...entry.topic.sourceIds],
      prerequisiteTopicIds: [...entry.topic.prerequisiteTopicIds],
      relatedTopicIds: [...entry.topic.relatedTopicIds],
      successorTopicIds: [...entry.topic.successorTopicIds],
      alternativeTopicIds: [...entry.topic.alternativeTopicIds],
      proofTypes: [...entry.topic.proofTypes],
      readinessMetrics: [...entry.topic.readinessMetrics],
      missionTypes: [...entry.topic.missionTypes],
    };
    graph.topics.push(topic);
    appliedTopics.push(topic);
  }

  return {
    proposalId: proposal.id,
    appliedSources,
    appliedTopics,
    skippedEntries,
    conflicts,
    beforeCounts,
    afterCounts: counts(graph),
    plan: generateCanonicalApplyPlan(proposal),
    graph,
  };
}

export function summarizeCanonicalApply(result: CanonicalApplyResult): string {
  return [
    `sources:+${result.afterCounts.sources - result.beforeCounts.sources}`,
    `topics:+${result.afterCounts.topics - result.beforeCounts.topics}`,
    `skipped:${result.skippedEntries.length}`,
    `conflicts:${result.conflicts.length}`,
    `files:${result.plan.filesToUpdate.length}`,
  ].join(" | ");
}

export function validatePostApplyGraph(
  graph: CanonicalApplyGraph
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const sourceIds = new Set(graph.sources.map((source) => source.id));
  const sourceUrls = new Set<string>();
  const topicIds = new Set<string>();
  const capabilityIds = new Set(graph.capabilities.map((capability) => capability.id));
  const skillIds = new Set(graph.skills.map((skill) => skill.id));

  for (const source of graph.sources) {
    const url = normalizeUrl(source.url);
    if (sourceUrls.has(url)) warnings.push(`Duplicate source URL already present: ${source.url}`);
    sourceUrls.add(url);
  }

  for (const topic of graph.topics) {
    if (topicIds.has(topic.id)) errors.push(`Duplicate topic ID: ${topic.id}`);
    topicIds.add(topic.id);
    if (topic.sourceIds.length === 0) errors.push(`Topic has no sources: ${topic.id}`);
    if (topic.proofTypes.length === 0) errors.push(`Topic has no proof types: ${topic.id}`);
    for (const sourceId of topic.sourceIds) {
      if (!sourceIds.has(sourceId)) errors.push(`${topic.id} references missing source ${sourceId}`);
    }
    for (const capabilityId of topic.capabilityIds) {
      if (!capabilityIds.has(capabilityId)) errors.push(`${topic.id} references missing capability ${capabilityId}`);
    }
    for (const skillId of topic.skillIds) {
      if (!skillIds.has(skillId)) errors.push(`${topic.id} references missing skill ${skillId}`);
    }
  }

  if (graph.sources.length === 0) warnings.push("Graph has no sources.");
  if (graph.topics.length === 0) warnings.push("Graph has no topics.");

  return { valid: errors.length === 0, errors, warnings };
}
