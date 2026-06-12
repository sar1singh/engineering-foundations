import type { AgentDiscoveryPreviewResult } from "@/lib/services/agent-discovery-simulator";

export type ReviewDecision = "pending" | "approved" | "rejected" | "needs-changes";

export type MappingOverride = {
  id: string;
  mappingType: "topic" | "source";
  field: string;
  originalValue: string;
  overriddenValue: string;
  notes: string;
};

export type CandidateReviewState = {
  scenarioId: string;
  decision: ReviewDecision;
  qualityNotes: string;
  rejectionReason: string;
  needsChangesNotes: string;
  mappingOverrides: MappingOverride[];
};

export type QueueFilter = "all" | "pending" | "approved" | "rejected" | "needs-changes" | "blocked";

export type QueueSummary = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  needsChanges: number;
  blocked: number;
  passable: number;
};

export function createInitialReviewStates(scenarioIds: string[]): Map<string, CandidateReviewState> {
  const map = new Map<string, CandidateReviewState>();
  for (const id of scenarioIds) {
    map.set(id, {
      scenarioId: id,
      decision: "pending",
      qualityNotes: "",
      rejectionReason: "",
      needsChangesNotes: "",
      mappingOverrides: []
    });
  }
  return map;
}

export function computeQueueSummary(
  reviewStates: CandidateReviewState[],
  results: AgentDiscoveryPreviewResult[]
): QueueSummary {
  const blockedCount = results.filter((r) => r.finalGateStatus === "blocked").length;
  return {
    total: reviewStates.length,
    pending: reviewStates.filter((s) => s.decision === "pending").length,
    approved: reviewStates.filter((s) => s.decision === "approved").length,
    rejected: reviewStates.filter((s) => s.decision === "rejected").length,
    needsChanges: reviewStates.filter((s) => s.decision === "needs-changes").length,
    blocked: blockedCount,
    passable: reviewStates.filter(
      (s) => s.decision === "pending" || s.decision === "needs-changes"
    ).length
  };
}

export function filterResultsByQueue(
  filter: QueueFilter,
  results: AgentDiscoveryPreviewResult[],
  reviewStates: CandidateReviewState[]
): AgentDiscoveryPreviewResult[] {
  if (filter === "all") return results;
  if (filter === "blocked") {
    return results.filter((r) => r.finalGateStatus === "blocked");
  }
  const reviewedIds = new Set(
    reviewStates
      .filter((s) => s.decision === filter)
      .map((s) => s.scenarioId)
  );
  return results.filter((r) => reviewedIds.has(r.scenarioId));
}

export function getQueueFilterLabel(filter: QueueFilter): string {
  const labels: Record<QueueFilter, string> = {
    all: "All",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    "needs-changes": "Needs Changes",
    blocked: "Blocked"
  };
  return labels[filter];
}

export function updateReviewDecision(
  state: CandidateReviewState,
  decision: ReviewDecision,
  extra?: { rejectionReason?: string; needsChangesNotes?: string }
): CandidateReviewState {
  return {
    ...state,
    decision,
    rejectionReason: extra?.rejectionReason ?? state.rejectionReason,
    needsChangesNotes: extra?.needsChangesNotes ?? state.needsChangesNotes
  };
}

export function addMappingOverride(
  state: CandidateReviewState,
  override: Omit<MappingOverride, "id">
): CandidateReviewState {
  const id = `override-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    ...state,
    mappingOverrides: [...state.mappingOverrides, { ...override, id }]
  };
}

export function removeMappingOverride(
  state: CandidateReviewState,
  overrideId: string
): CandidateReviewState {
  return {
    ...state,
    mappingOverrides: state.mappingOverrides.filter((o) => o.id !== overrideId)
  };
}
