export type RuntimeFetchReviewDecision =
  | "pending"
  | "approved"
  | "rejected"
  | "duplicate-risk"
  | "needs-changes";

export type RuntimeFetchReviewState = {
  candidateUrl: string;
  decision: RuntimeFetchReviewDecision;
  rejectionReason: string;
  needsChangesNotes: string;
  duplicateWarning: string;
  candidateId: string;
};

export type RuntimeFetchQueueSummary = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  duplicateRisk: number;
  needsChanges: number;
};

export function createInitialReviewState(
  candidateUrl: string,
  opts?: { duplicateWarning?: string; candidateId?: string }
): RuntimeFetchReviewState {
  return {
    candidateUrl,
    decision: "pending",
    rejectionReason: "",
    needsChangesNotes: "",
    duplicateWarning: opts?.duplicateWarning ?? "",
    candidateId: opts?.candidateId ?? "",
  };
}

export function computeQueueSummary(
  states: RuntimeFetchReviewState[]
): RuntimeFetchQueueSummary {
  return {
    total: states.length,
    pending: states.filter((s) => s.decision === "pending").length,
    approved: states.filter((s) => s.decision === "approved").length,
    rejected: states.filter((s) => s.decision === "rejected").length,
    duplicateRisk: states.filter((s) => s.decision === "duplicate-risk").length,
    needsChanges: states.filter((s) => s.decision === "needs-changes").length,
  };
}

export function approveCandidate(
  states: RuntimeFetchReviewState[],
  candidateUrl: string
): RuntimeFetchReviewState[] {
  return states.map((s) =>
    s.candidateUrl === candidateUrl
      ? { ...s, decision: "approved" as const, rejectionReason: "" }
      : s
  );
}

export function rejectCandidate(
  states: RuntimeFetchReviewState[],
  candidateUrl: string,
  reason: string
): RuntimeFetchReviewState[] {
  return states.map((s) =>
    s.candidateUrl === candidateUrl
      ? { ...s, decision: "rejected" as const, rejectionReason: reason }
      : s
  );
}

export function markDuplicateRisk(
  states: RuntimeFetchReviewState[],
  candidateUrl: string,
  warning: string
): RuntimeFetchReviewState[] {
  return states.map((s) =>
    s.candidateUrl === candidateUrl
      ? { ...s, decision: "duplicate-risk" as const, duplicateWarning: warning }
      : s
  );
}

export function needsChangesCandidate(
  states: RuntimeFetchReviewState[],
  candidateUrl: string,
  notes: string
): RuntimeFetchReviewState[] {
  return states.map((s) =>
    s.candidateUrl === candidateUrl
      ? { ...s, decision: "needs-changes" as const, needsChangesNotes: notes }
      : s
  );
}

export function resetDecision(
  states: RuntimeFetchReviewState[],
  candidateUrl: string
): RuntimeFetchReviewState[] {
  return states.map((s) =>
    s.candidateUrl === candidateUrl
      ? {
          ...s,
          decision: "pending" as const,
          rejectionReason: "",
          needsChangesNotes: "",
        }
      : s
  );
}
