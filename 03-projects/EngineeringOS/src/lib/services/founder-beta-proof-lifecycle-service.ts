import type { ProofLifecycleState, ProofRecord, ProofScore, ProofType } from "@/types/founder-beta";

export const VALID_PROOF_STATES: ProofLifecycleState[] = ["not_started", "attempted", "submitted", "completed", "validated"];

export const ALLOWED_TRANSITIONS: Map<string, ProofLifecycleState[]> = new Map([
  ["not_started", ["attempted"]],
  ["attempted", ["not_started", "submitted"]],
  ["submitted", ["not_started", "completed"]],
  ["completed", ["not_started", "validated"]],
  ["validated", ["not_started", "completed"]]
]);

export const VALID_PROOF_TYPES: ProofType[] = [
  "knowledge", "coding-solution", "complexity-analysis", "pattern-explanation",
  "implementation-task", "interview-answer", "behavioral-answer",
  "architecture-review", "hld", "lld", "aws-design", "resume-review", "case-study",
  "dsa-interview", "lld-interview", "hld-interview", "behavioral-interview"
];

export class ProofLifecycleService {
  createProofRecord(
    id: string,
    proofType: ProofType,
    capabilityId: string,
    skillId: string,
    topicId: string
  ): ProofRecord {
    return {
      id,
      proofType,
      capabilityId,
      skillId,
      topicId,
      state: "not_started",
      score: null,
      artifactRef: null,
      submittedAt: null,
      completedAt: null,
      validatedAt: null,
      attemptCount: 0
    };
  }

  transition(record: ProofRecord, to: ProofLifecycleState): { record: ProofRecord; allowed: boolean } {
    const allowed = this.isTransitionAllowed(record.state, to);
    if (!allowed) {
      return { record, allowed: false };
    }

    const now = new Date().toISOString();
    const updated: ProofRecord = {
      ...record,
      state: to,
      attemptCount: to === "attempted" || to === "submitted" ? record.attemptCount + 1 : record.attemptCount,
      submittedAt: to === "submitted" ? now : to === "not_started" ? null : record.submittedAt,
      completedAt: to === "completed" ? now : to === "not_started" ? null : record.completedAt,
      validatedAt: to === "validated" ? now : to === "not_started" ? null : record.validatedAt
    };

    return { record: updated, allowed: true };
  }

  score(record: ProofRecord, score: ProofScore): ProofRecord {
    return { ...record, score };
  }

  attachArtifact(record: ProofRecord, artifactRef: string): ProofRecord {
    return { ...record, artifactRef };
  }

  isTransitionAllowed(current: ProofLifecycleState, target: ProofLifecycleState): boolean {
    const allowed = ALLOWED_TRANSITIONS.get(current);
    return allowed?.includes(target) ?? false;
  }

  getProofsByState(records: ProofRecord[], state: ProofLifecycleState): ProofRecord[] {
    return records.filter((r) => r.state === state);
  }

  getProofsByCapability(records: ProofRecord[], capabilityId: string): ProofRecord[] {
    return records.filter((r) => r.capabilityId === capabilityId);
  }

  getProofCompletionRatio(records: ProofRecord[]): number {
    if (records.length === 0) return 0;
    const completed = records.filter((r) => r.state === "completed" || r.state === "validated").length;
    return completed / records.length;
  }

  getCapabilityProofScore(records: ProofRecord[], capabilityId: string): number {
    const capProofs = this.getProofsByCapability(records, capabilityId);
    const completed = capProofs.filter((r) => r.state === "completed" || r.state === "validated");
    if (completed.length === 0) return 0;
    const total = completed.reduce((sum, r) => sum + (r.score ?? 0), 0);
    return Math.round((total / completed.length / 5) * 100);
  }

  validateTransitionSequence(transitions: Array<{ from: ProofLifecycleState; to: ProofLifecycleState }>): string[] {
    const errors: string[] = [];
    for (const t of transitions) {
      if (!this.isTransitionAllowed(t.from, t.to)) {
        errors.push(`Transition ${t.from} → ${t.to} is not allowed`);
      }
    }
    return errors;
  }
}

export const founderBetaProofLifecycleService = new ProofLifecycleService();
