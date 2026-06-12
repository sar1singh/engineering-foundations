import { describe, expect, it } from "vitest";
import {
  createInitialReviewState,
  approveCandidate,
  rejectCandidate,
  needsChangesCandidate,
  resetDecision,
  setQualityNotes,
  computeReviewSummary
} from "@/lib/services/content-ingestion-review-session";

const CANDIDATE_IDS = ["candidate-1", "candidate-2", "candidate-3"];

describe("content-ingestion-review-session", () => {
  describe("createInitialReviewState", () => {
    it("creates a state entry for each candidate ID", () => {
      const state = createInitialReviewState(CANDIDATE_IDS);
      expect(Object.keys(state)).toEqual(CANDIDATE_IDS);
    });

    it("initialises all decisions to null", () => {
      const state = createInitialReviewState(CANDIDATE_IDS);
      for (const id of CANDIDATE_IDS) {
        expect(state[id].decision).toBeNull();
        expect(state[id].rejectionReason).toBe("");
        expect(state[id].qualityNotes).toBe("");
      }
    });
  });

  describe("approveCandidate", () => {
    it("sets decision to approved", () => {
      const state = createInitialReviewState(CANDIDATE_IDS);
      const updated = approveCandidate(state, "candidate-1");
      expect(updated["candidate-1"].decision).toBe("approved");
      expect(updated["candidate-1"].rejectionReason).toBe("");
    });

    it("does not affect other candidates", () => {
      const state = createInitialReviewState(CANDIDATE_IDS);
      const updated = approveCandidate(state, "candidate-1");
      expect(updated["candidate-2"].decision).toBeNull();
      expect(updated["candidate-3"].decision).toBeNull();
    });

    it("is immutable", () => {
      const state = createInitialReviewState(CANDIDATE_IDS);
      approveCandidate(state, "candidate-1");
      expect(state["candidate-1"].decision).toBeNull();
    });
  });

  describe("rejectCandidate", () => {
    it("sets decision to rejected with reason", () => {
      const state = createInitialReviewState(CANDIDATE_IDS);
      const updated = rejectCandidate(state, "candidate-2", "Low quality content");
      expect(updated["candidate-2"].decision).toBe("rejected");
      expect(updated["candidate-2"].rejectionReason).toBe("Low quality content");
    });

    it("is immutable", () => {
      const state = createInitialReviewState(CANDIDATE_IDS);
      rejectCandidate(state, "candidate-2", "reason");
      expect(state["candidate-2"].decision).toBeNull();
    });
  });

  describe("needsChangesCandidate", () => {
    it("sets decision to needs-changes", () => {
      const state = createInitialReviewState(CANDIDATE_IDS);
      const updated = needsChangesCandidate(state, "candidate-3");
      expect(updated["candidate-3"].decision).toBe("needs-changes");
    });
  });

  describe("resetDecision", () => {
    it("clears decision and rejection reason", () => {
      let state = createInitialReviewState(CANDIDATE_IDS);
      state = rejectCandidate(state, "candidate-1", "Not relevant");
      expect(state["candidate-1"].decision).toBe("rejected");

      const updated = resetDecision(state, "candidate-1");
      expect(updated["candidate-1"].decision).toBeNull();
      expect(updated["candidate-1"].rejectionReason).toBe("");
    });
  });

  describe("setQualityNotes", () => {
    it("updates quality notes for a candidate", () => {
      const state = createInitialReviewState(CANDIDATE_IDS);
      const updated = setQualityNotes(state, "candidate-1", "Needs better citations");
      expect(updated["candidate-1"].qualityNotes).toBe("Needs better citations");
    });
  });

  describe("computeReviewSummary", () => {
    it("returns all pending for initial state", () => {
      const state = createInitialReviewState(CANDIDATE_IDS);
      const summary = computeReviewSummary(state);
      expect(summary).toEqual({ total: 3, approved: 0, rejected: 0, needsChanges: 0, pending: 3 });
    });

    it("counts approved candidates", () => {
      let state = createInitialReviewState(CANDIDATE_IDS);
      state = approveCandidate(state, "candidate-1");
      state = approveCandidate(state, "candidate-2");
      const summary = computeReviewSummary(state);
      expect(summary.approved).toBe(2);
      expect(summary.pending).toBe(1);
    });

    it("counts rejected candidates", () => {
      let state = createInitialReviewState(CANDIDATE_IDS);
      state = rejectCandidate(state, "candidate-1", "bad");
      state = rejectCandidate(state, "candidate-2", "worse");
      const summary = computeReviewSummary(state);
      expect(summary.rejected).toBe(2);
      expect(summary.pending).toBe(1);
    });

    it("counts needs-changes candidates", () => {
      let state = createInitialReviewState(CANDIDATE_IDS);
      state = needsChangesCandidate(state, "candidate-3");
      const summary = computeReviewSummary(state);
      expect(summary.needsChanges).toBe(1);
      expect(summary.pending).toBe(2);
    });

    it("handles mixed decisions", () => {
      let state = createInitialReviewState(["a", "b", "c", "d", "e"]);
      state = approveCandidate(state, "a");
      state = rejectCandidate(state, "b", "no");
      state = needsChangesCandidate(state, "c");
      // d is pending, e is pending
      const summary = computeReviewSummary(state);
      expect(summary).toEqual({ total: 5, approved: 1, rejected: 1, needsChanges: 1, pending: 2 });
    });
  });
});
