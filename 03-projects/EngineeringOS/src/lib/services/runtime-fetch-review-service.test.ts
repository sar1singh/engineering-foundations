import { describe, expect, it } from "vitest";
import {
  createInitialReviewState,
  computeQueueSummary,
  approveCandidate,
  rejectCandidate,
  markDuplicateRisk,
  needsChangesCandidate,
  resetDecision,
} from "./runtime-fetch-review-service";

describe("createInitialReviewState", () => {
  it("creates a pending review state for a candidate URL", () => {
    const state = createInitialReviewState("https://example.com/doc");
    expect(state.candidateUrl).toBe("https://example.com/doc");
    expect(state.decision).toBe("pending");
    expect(state.rejectionReason).toBe("");
    expect(state.needsChangesNotes).toBe("");
    expect(state.duplicateWarning).toBe("");
    expect(state.candidateId).toBe("");
  });

  it("accepts optional duplicateWarning and candidateId", () => {
    const state = createInitialReviewState("https://example.com/doc", {
      duplicateWarning: "URL matches 2 existing sources",
      candidateId: "cand-001",
    });
    expect(state.duplicateWarning).toBe("URL matches 2 existing sources");
    expect(state.candidateId).toBe("cand-001");
  });
});

describe("computeQueueSummary", () => {
  it("returns all zeros for empty array", () => {
    const summary = computeQueueSummary([]);
    expect(summary).toEqual({
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      duplicateRisk: 0,
      needsChanges: 0,
    });
  });

  it("counts states correctly", () => {
    const states = [
      createInitialReviewState("https://a.com"),
      createInitialReviewState("https://b.com"),
      createInitialReviewState("https://c.com"),
    ];
    const approved = approveCandidate(states, "https://a.com");
    const rejected = rejectCandidate(approved, "https://b.com", "Not relevant");
    const withChanges = needsChangesCandidate(rejected, "https://c.com", "Add tags");
    const summary = computeQueueSummary(withChanges);
    expect(summary.total).toBe(3);
    expect(summary.approved).toBe(1);
    expect(summary.rejected).toBe(1);
    expect(summary.needsChanges).toBe(1);
    expect(summary.pending).toBe(0);
    expect(summary.duplicateRisk).toBe(0);
  });
});

describe("approveCandidate", () => {
  it("approves a pending candidate", () => {
    const states = [createInitialReviewState("https://example.com/doc")];
    const updated = approveCandidate(states, "https://example.com/doc");
    expect(updated[0].decision).toBe("approved");
    expect(updated[0].rejectionReason).toBe("");
  });

  it("does not modify other candidates", () => {
    const states = [
      createInitialReviewState("https://a.com"),
      createInitialReviewState("https://b.com"),
    ];
    const updated = approveCandidate(states, "https://a.com");
    expect(updated[0].decision).toBe("approved");
    expect(updated[1].decision).toBe("pending");
  });

  it("clears rejectionReason on approval", () => {
    const initial = [createInitialReviewState("https://example.com/doc")];
    const rejected = rejectCandidate(initial, "https://example.com/doc", "Some reason");
    const updated = approveCandidate(rejected, "https://example.com/doc");
    expect(updated[0].decision).toBe("approved");
    expect(updated[0].rejectionReason).toBe("");
  });
});

describe("rejectCandidate", () => {
  it("rejects with a reason", () => {
    const states = [createInitialReviewState("https://example.com/doc")];
    const updated = rejectCandidate(states, "https://example.com/doc", "Not relevant to curriculum");
    expect(updated[0].decision).toBe("rejected");
    expect(updated[0].rejectionReason).toBe("Not relevant to curriculum");
  });
});

describe("markDuplicateRisk", () => {
  it("marks a candidate as duplicate-risk with warning", () => {
    const states = [createInitialReviewState("https://example.com/doc")];
    const updated = markDuplicateRisk(
      states,
      "https://example.com/doc",
      "URL matches 2 existing sources in catalog"
    );
    expect(updated[0].decision).toBe("duplicate-risk");
    expect(updated[0].duplicateWarning).toBe(
      "URL matches 2 existing sources in catalog"
    );
  });
});

describe("needsChangesCandidate", () => {
  it("marks a candidate as needs-changes with notes", () => {
    const states = [createInitialReviewState("https://example.com/doc")];
    const updated = needsChangesCandidate(
      states,
      "https://example.com/doc",
      "Add topic mappings"
    );
    expect(updated[0].decision).toBe("needs-changes");
    expect(updated[0].needsChangesNotes).toBe("Add topic mappings");
  });
});

describe("resetDecision", () => {
  it("resets approved candidate back to pending", () => {
    const initial = [createInitialReviewState("https://example.com/doc")];
    const approved = approveCandidate(initial, "https://example.com/doc");
    const updated = resetDecision(approved, "https://example.com/doc");
    expect(updated[0].decision).toBe("pending");
    expect(updated[0].rejectionReason).toBe("");
    expect(updated[0].needsChangesNotes).toBe("");
  });

  it("resets rejected candidate back to pending with cleared reason", () => {
    const initial = [createInitialReviewState("https://example.com/doc")];
    const rejected = rejectCandidate(initial, "https://example.com/doc", "Some reason");
    const updated = resetDecision(rejected, "https://example.com/doc");
    expect(updated[0].decision).toBe("pending");
    expect(updated[0].rejectionReason).toBe("");
  });
});
