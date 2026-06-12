import { describe, it, expect } from "vitest";
import { ProofLifecycleService } from "./founder-beta-proof-lifecycle-service";

const service = new ProofLifecycleService();

describe("ProofLifecycleService", () => {
  it("creates a proof record in not_started state", () => {
    const record = service.createProofRecord("p1", "knowledge", "cap-aws-cloud-architecture", "skill-aws-core", "topic-iam");
    expect(record.id).toBe("p1");
    expect(record.state).toBe("not_started");
    expect(record.score).toBeNull();
    expect(record.attemptCount).toBe(0);
  });

  it("allows valid transition not_started → attempted", () => {
    const record = service.createProofRecord("p2", "coding-solution", "cap-dsa-problem-solving", "skill-dsa-arrays", "topic-array-two-sum");
    const { record: updated, allowed } = service.transition(record, "attempted");
    expect(allowed).toBe(true);
    expect(updated.state).toBe("attempted");
    expect(updated.attemptCount).toBe(1);
  });

  it("rejects invalid transition not_started → completed", () => {
    const record = service.createProofRecord("p3", "hld", "cap-system-design-hld", "skill-hld", "topic-hld-payment");
    const { allowed } = service.transition(record, "completed");
    expect(allowed).toBe(false);
  });

  it("allows valid transition chain to validated", () => {
    let r = service.createProofRecord("p4", "behavioral-answer", "cap-behavioral-communication", "skill-behavioral", "topic-star-stories");
    r = service.score(r, 4);
    let result = service.transition(r, "attempted");
    r = result.record;
    expect(result.allowed).toBe(true);
    result = service.transition(r, "submitted");
    r = result.record;
    expect(result.allowed).toBe(true);
    expect(r.submittedAt).not.toBeNull();
    result = service.transition(r, "completed");
    r = result.record;
    expect(result.allowed).toBe(true);
    expect(r.completedAt).not.toBeNull();
    result = service.transition(r, "validated");
    r = result.record;
    expect(result.allowed).toBe(true);
    expect(r.validatedAt).not.toBeNull();
    expect(r.state).toBe("validated");
  });

  it("rejects invalid transition attempted → validated", () => {
    let r = service.createProofRecord("p5", "case-study", "cap-architecture-case-studies", "skill-case-study", "topic-netflix-case-study");
    r = service.score(r, 3);
    const { record: attempted } = service.transition(r, "attempted");
    const { allowed } = service.transition(attempted, "validated");
    expect(allowed).toBe(false);
  });

  it("score updates the proof score value", () => {
    const r = service.createProofRecord("p6", "lld", "cap-low-level-design", "skill-lld", "topic-lld-parking-lot");
    const scored = service.score(r, 4);
    expect(scored.score).toBe(4);
  });

  it("attachArtifact sets artifactRef", () => {
    const r = service.createProofRecord("p7", "aws-design", "cap-aws-cloud-architecture", "skill-aws-design", "topic-aws-high-availability");
    const attached = service.attachArtifact(r, "/artifacts/aws-ha-design.md");
    expect(attached.artifactRef).toBe("/artifacts/aws-ha-design.md");
  });

  it("isTransitionAllowed returns false for invalid transitions", () => {
    expect(service.isTransitionAllowed("not_started", "validated")).toBe(false);
    expect(service.isTransitionAllowed("submitted", "validated")).toBe(false);
    expect(service.isTransitionAllowed("completed", "submitted")).toBe(false);
  });

  it("getProofsByState filters correctly", () => {
    const r1 = service.createProofRecord("r1", "knowledge", "cap-behavioral-communication", "skill-behavioral", "topic-star-stories");
    const r2 = service.createProofRecord("r2", "coding-solution", "cap-dsa-problem-solving", "skill-dsa-arrays", "topic-array-two-sum");
    const completed = service.transition(r1, "attempted");
    const records = [completed.record, r2];
    const result = service.getProofsByState(records, "not_started");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("r2");
  });

  it("getProofsByCapability filters correctly", () => {
    const r1 = service.createProofRecord("c1", "knowledge", "cap-aws-cloud-architecture", "skill-aws-core", "topic-iam");
    const r2 = service.createProofRecord("c2", "hld", "cap-system-design-hld", "skill-hld", "topic-hld-chat");
    const result = service.getProofsByCapability([r1, r2], "cap-aws-cloud-architecture");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("c1");
  });

  it("getCapabilityProofScore returns correct percentage", () => {
    let r1 = service.createProofRecord("s1", "hld", "cap-system-design-hld", "skill-hld", "topic-hld-chat");
    let r2 = service.createProofRecord("s2", "hld", "cap-system-design-hld", "skill-hld", "topic-hld-payment");
    r1 = service.score(r1, 4);
    r2 = service.score(r2, 3);
    let result = service.transition(r1, "attempted");
    r1 = result.record;
    result = service.transition(r1, "submitted");
    r1 = result.record;
    result = service.transition(r1, "completed");
    r1 = result.record;
    result = service.transition(r2, "attempted");
    r2 = result.record;
    result = service.transition(r2, "submitted");
    r2 = result.record;
    result = service.transition(r2, "completed");
    r2 = result.record;
    const score = service.getCapabilityProofScore([r1, r2], "cap-system-design-hld");
    expect(score).toBe(70);
  });

  it("getProofCompletionRatio returns correct fraction", () => {
    const r1 = service.createProofRecord("t1", "knowledge", "cap-node-backend", "skill-node", "topic-node-event-loop");
    const r2 = service.createProofRecord("t2", "knowledge", "cap-node-backend", "skill-node", "topic-node-streams");
    const r3 = service.createProofRecord("t3", "knowledge", "cap-node-backend", "skill-node", "topic-node-buffers");
    let result = service.transition(r1, "attempted");
    const attempted = result.record;
    result = service.transition(attempted, "submitted");
    const submitted = result.record;
    result = service.transition(submitted, "completed");
    const completed = result.record;
    const attemptedOnly = service.transition(r2, "attempted").record;
    const ratio = service.getProofCompletionRatio([completed, attemptedOnly, r3]);
    expect(ratio).toBeCloseTo(0.333, 2);
  });

  it("validateTransitionSequence reports errors", () => {
    const errors = service.validateTransitionSequence([
      { from: "not_started", to: "validated" },
      { from: "completed", to: "submitted" }
    ]);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain("not_started → validated");
    expect(errors[1]).toContain("completed → submitted");
  });

  it("validateTransitionSequence passes valid transitions", () => {
    const errors = service.validateTransitionSequence([
      { from: "not_started", to: "attempted" },
      { from: "submitted", to: "completed" },
      { from: "completed", to: "validated" }
    ]);
    expect(errors).toHaveLength(0);
  });

  it("rejection returns to not_started", () => {
    let r = service.createProofRecord("rej1", "case-study", "cap-architecture-case-studies", "skill-case-study", "topic-chat-case-study");
    r = service.score(r, 1);
    let result = service.transition(r, "attempted");
    r = result.record;
    result = service.transition(r, "submitted");
    r = result.record;
    result = service.transition(r, "not_started");
    expect(result.allowed).toBe(true);
    expect(result.record.state).toBe("not_started");
    expect(result.record.completedAt).toBeNull();
  });
});
