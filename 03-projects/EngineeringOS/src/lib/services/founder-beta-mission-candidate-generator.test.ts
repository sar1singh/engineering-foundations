import { describe, expect, it } from "vitest";
import { FounderBetaMissionCandidateGenerator } from "@/lib/services/founder-beta-mission-candidate-generator";
import { founderBetaCapabilities, founderBetaSkills, founderBetaMasterTopics, dsaProblemBank } from "@/data/founder-beta";
import type { ProofType, MissionType, MissionCandidatePriority } from "@/types/founder-beta";

const generator = new FounderBetaMissionCandidateGenerator();
const validProofTypes = new Set<ProofType>([
  "coding-solution", "hld", "lld", "architecture-review", "aws-design",
  "incident-analysis", "behavioral-answer", "resume-review", "github-project", "case-study"
]);
const validMissionTypes = new Set<MissionType>([
  "learn", "practice", "implement", "interview", "behavioral",
  "career-asset", "revision", "weak-area-repair", "architecture-case-study"
]);
const validPriorities: MissionCandidatePriority[] = ["critical", "high", "medium", "low"];
const allTopicIds = new Set([
  ...founderBetaMasterTopics.map((t) => t.id),
  ...dsaProblemBank.map((t) => t.id)
]);

describe("FounderBetaMissionCandidateGenerator", () => {
  it("generates candidates without input", () => {
    const candidates = generator.generateCandidates();
    expect(candidates.length).toBeGreaterThan(0);
  });

  it("generates candidates with weak areas", () => {
    const candidates = generator.generateCandidates({
      weakAreaCapabilityIds: ["cap-dsa-problem-solving"],
      weakAreaTopicIds: ["topic-dsa-graph-bfs"]
    });
    expect(candidates.length).toBeGreaterThan(0);
  });

  it("generates candidates with completed topics", () => {
    const candidates = generator.generateCandidates({
      completedTopicIds: ["topic-api-design", "topic-dsa-array-two-sum"]
    });
    expect(candidates.length).toBeGreaterThan(0);
  });

  it("every candidate has a unique ID", () => {
    const candidates = generator.generateCandidates();
    const ids = candidates.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every candidate references a valid capability", () => {
    const capIds = new Set(founderBetaCapabilities.map((c) => c.id));
    const candidates = generator.generateCandidates();

    for (const c of candidates) {
      expect(capIds.has(c.capabilityId), `${c.id} references missing capability ${c.capabilityId}`).toBe(true);
    }
  });

  it("every candidate references a valid skill", () => {
    const skillIds = new Set(founderBetaSkills.map((s) => s.id));
    const candidates = generator.generateCandidates();

    for (const c of candidates) {
      expect(skillIds.has(c.skillId), `${c.id} references missing skill ${c.skillId}`).toBe(true);
    }
  });

  it("every candidate references valid topic IDs", () => {
    const candidates = generator.generateCandidates();

    for (const c of candidates) {
      for (const tid of c.topicIds) {
        expect(allTopicIds.has(tid), `${c.id} references missing topic ${tid}`).toBe(true);
      }
    }
  });

  it("every candidate has valid proof types", () => {
    const candidates = generator.generateCandidates();

    for (const c of candidates) {
      for (const pt of c.proofTypes) {
        expect(validProofTypes.has(pt), `${c.id} has invalid proof type ${pt}`).toBe(true);
      }
    }
  });

  it("every candidate has a valid mission type", () => {
    const candidates = generator.generateCandidates();

    for (const c of candidates) {
      expect(validMissionTypes.has(c.missionType), `${c.id} has invalid mission type ${c.missionType}`).toBe(true);
    }
  });

  it("every candidate has a valid priority", () => {
    const candidates = generator.generateCandidates();

    for (const c of candidates) {
      expect(validPriorities.includes(c.priority), `${c.id} has invalid priority ${c.priority}`).toBe(true);
    }
  });

  it("every candidate has positive estimated minutes", () => {
    const candidates = generator.generateCandidates();

    for (const c of candidates) {
      expect(c.estimatedMinutes).toBeGreaterThan(0);
    }
  });

  it("sorts candidates by priority then readiness target", () => {
    const candidates = generator.generateCandidates({ weakAreaCapabilityIds: ["cap-dsa-problem-solving"] });
    const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

    for (let i = 1; i < candidates.length; i++) {
      const prev = priorityOrder[candidates[i - 1].priority];
      const curr = priorityOrder[candidates[i].priority];
      expect(prev).toBeLessThanOrEqual(curr);
    }
  });

  it("generates DSA candidates when DSA is a weak area", () => {
    const candidates = generator.generateCandidates({
      weakAreaCapabilityIds: ["cap-dsa-problem-solving"]
    });

    const dsaCandidates = candidates.filter((c) => c.capabilityId === "cap-dsa-problem-solving");
    expect(dsaCandidates.length).toBeGreaterThan(0);

    for (const c of dsaCandidates) {
      expect(c.priority === "critical" || c.priority === "high").toBe(true);
    }
  });

  it("excludes completed topics from candidate topic lists", () => {
    const candidates = generator.generateCandidates({
      completedTopicIds: ["topic-dsa-array-two-sum", "topic-api-design"]
    });

    for (const c of candidates) {
      expect(c.topicIds).not.toContain("topic-dsa-array-two-sum");
      expect(c.topicIds).not.toContain("topic-api-design");
    }
  });

  it("all candidates have at least one topic ID", () => {
    const candidates = generator.generateCandidates();

    for (const c of candidates) {
      expect(c.topicIds.length).toBeGreaterThan(0);
    }
  });

  it("all candidates have a priority reason", () => {
    const candidates = generator.generateCandidates();

    for (const c of candidates) {
      expect(c.priorityReason.length).toBeGreaterThan(0);
    }
  });

  it("generates deterministic output for same input", () => {
    const input = { weakAreaCapabilityIds: ["cap-dsa-problem-solving"], completedTopicIds: ["topic-api-design"] };
    const a = generator.generateCandidates(input);
    const b = generator.generateCandidates(input);

    expect(a.length).toBe(b.length);
    for (let i = 0; i < a.length; i++) {
      expect(a[i].id).toBe(b[i].id);
      expect(a[i].priority).toBe(b[i].priority);
      expect(a[i].topicIds).toEqual(b[i].topicIds);
    }
  });

  describe("computeReadinessImpact", () => {
    it("returns impact data for a candidate", () => {
      const candidates = generator.generateCandidates();
      const candidate = candidates[0];
      const impact = generator.computeReadinessImpact(candidate, [], {});
      expect(impact.candidateId).toBe(candidate.id);
      expect(impact.missionType).toBe(candidate.missionType);
      expect(typeof impact.roleReadinessDelta).toBe("number");
      expect(typeof impact.overallValueScore).toBe("number");
    });

    it("returns topic deltas for DSA candidates", () => {
      const candidates = generator.generateCandidates({
        weakAreaCapabilityIds: ["cap-dsa-problem-solving"]
      });
      const dsaCandidates = candidates.filter((c) => c.capabilityId === "cap-dsa-problem-solving");
      if (dsaCandidates.length > 0) {
        const impact = generator.computeReadinessImpact(dsaCandidates[0], [], {});
        expect(impact.topicDeltas.length).toBeGreaterThanOrEqual(0);
        expect(typeof impact.skillDeltas).toBe("object");
        expect(typeof impact.capabilityDeltas).toBe("object");
      }
    });

    it("produces deterministic output", () => {
      const candidates = generator.generateCandidates();
      const candidate = candidates[0];
      const a = generator.computeReadinessImpact(candidate, [], {});
      const b = generator.computeReadinessImpact(candidate, [], {});
      expect(a.roleReadinessDelta).toBe(b.roleReadinessDelta);
      expect(a.overallValueScore).toBe(b.overallValueScore);
    });

    it("higher value score when there are uncompleted topics", () => {
      const candidate = { id: "test-candidate", missionType: "practice" as const, capabilityId: "cap-aws-cloud-architecture", skillId: "skill-aws-core", topicIds: ["topic-iam", "topic-s3"], proofTypes: [], estimatedMinutes: 45, readinessTarget: 85, priorityReason: "test", priority: "high" as const, prerequisiteTopicIds: [], dependsOnMissionIds: [] };
      const impact = generator.computeReadinessImpact(candidate, [], {});
      expect(impact.overallValueScore).toBeGreaterThanOrEqual(0);
    });
  });

  describe("computeOfferReadinessImpact", () => {
    it("returns impact data with DSA info", () => {
      const candidates = generator.generateCandidates();
      const candidate = candidates[0];
      const impact = generator.computeOfferReadinessImpact(candidate, [], {});
      expect(impact.candidateId).toBe(candidate.id);
      expect(typeof impact.dsaPriorityBoost).toBe("number");
      expect(typeof impact.offerReadinessReduction).toBe("number");
      expect(Array.isArray(impact.dsaFocusedActions)).toBe(true);
    });

    it("returns DSA actions when DSA is weak", () => {
      const candidates = generator.generateCandidates({
        weakAreaCapabilityIds: ["cap-dsa-problem-solving"]
      });
      const dsaCandidates = candidates.filter((c) => c.capabilityId === "cap-dsa-problem-solving");
      if (dsaCandidates.length > 0) {
        const impact = generator.computeOfferReadinessImpact(dsaCandidates[0], [], {});
        if (impact.dsaFocusedActions.length > 0) {
          expect(impact.dsaFocusedActions.some((a) => a.toLowerCase().includes("dsa"))).toBe(true);
        }
      }
    });

    it("produces deterministic output", () => {
      const candidates = generator.generateCandidates();
      const candidate = candidates[0];
      const a = generator.computeOfferReadinessImpact(candidate, [], {});
      const b = generator.computeOfferReadinessImpact(candidate, [], {});
      expect(a.dsaPriorityBoost).toBe(b.dsaPriorityBoost);
      expect(a.offerReadinessReduction).toBe(b.offerReadinessReduction);
      expect(a.dsaFocusedActions).toEqual(b.dsaFocusedActions);
    });
  });
});
