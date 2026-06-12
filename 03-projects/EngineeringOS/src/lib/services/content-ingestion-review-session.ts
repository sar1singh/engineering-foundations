export type ReviewDecision = "approved" | "rejected" | "needs-changes";

export type CandidateReviewState = {
  candidateId: string;
  decision: ReviewDecision | null;
  rejectionReason: string;
  qualityNotes: string;
};

export type ReviewSessionState = Record<string, CandidateReviewState>;

export function createInitialReviewState(candidateIds: string[]): ReviewSessionState {
  return Object.fromEntries(
    candidateIds.map((id) => [
      id,
      { candidateId: id, decision: null, rejectionReason: "", qualityNotes: "" }
    ])
  );
}

export function approveCandidate(
  state: ReviewSessionState,
  candidateId: string
): ReviewSessionState {
  return {
    ...state,
    [candidateId]: { ...state[candidateId], decision: "approved", rejectionReason: "" }
  };
}

export function rejectCandidate(
  state: ReviewSessionState,
  candidateId: string,
  reason: string
): ReviewSessionState {
  return {
    ...state,
    [candidateId]: { ...state[candidateId], decision: "rejected", rejectionReason: reason }
  };
}

export function needsChangesCandidate(
  state: ReviewSessionState,
  candidateId: string
): ReviewSessionState {
  return {
    ...state,
    [candidateId]: { ...state[candidateId], decision: "needs-changes" }
  };
}

export function resetDecision(
  state: ReviewSessionState,
  candidateId: string
): ReviewSessionState {
  return {
    ...state,
    [candidateId]: { ...state[candidateId], decision: null, rejectionReason: "" }
  };
}

export function setQualityNotes(
  state: ReviewSessionState,
  candidateId: string,
  notes: string
): ReviewSessionState {
  return {
    ...state,
    [candidateId]: { ...state[candidateId], qualityNotes: notes }
  };
}

export type ReviewSummary = {
  total: number;
  approved: number;
  rejected: number;
  needsChanges: number;
  pending: number;
};

export function computeReviewSummary(state: ReviewSessionState): ReviewSummary {
  const entries = Object.values(state);
  return {
    total: entries.length,
    approved: entries.filter((e) => e.decision === "approved").length,
    rejected: entries.filter((e) => e.decision === "rejected").length,
    needsChanges: entries.filter((e) => e.decision === "needs-changes").length,
    pending: entries.filter((e) => e.decision === null).length
  };
}
