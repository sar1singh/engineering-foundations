import { describe, it, expect } from "vitest";
import { ReadinessRollupService } from "./founder-beta-readiness-rollup-service";
import type { Capability, CapabilityCategory, ProofRecord, ProofScore, ProofType, ReadinessRollupInput } from "@/types/founder-beta";

const service = new ReadinessRollupService();

function makeProof(
  id: string,
  proofType: ProofType,
  capabilityId: string,
  skillId: string,
  topicId: string,
  score: ProofScore,
  state: "completed" | "validated" | "not_started" | "attempted" | "submitted" = "completed"
): ProofRecord {
  return {
    id,
    proofType,
    capabilityId,
    skillId,
    topicId,
    state,
    score,
    artifactRef: null,
    submittedAt: state === "submitted" || state === "completed" || state === "validated" ? "2026-01-01" : null,
    completedAt: state === "completed" || state === "validated" ? "2026-01-01" : null,
    validatedAt: state === "validated" ? "2026-01-01" : null,
    attemptCount: 1
  };
}

describe("ReadinessRollupService", () => {
  describe("getBand", () => {
    it("returns not-started for 0", () => expect(service.getBand(0)).toBe("not-started"));
    it("returns blocked for < 50", () => expect(service.getBand(25)).toBe("blocked"));
    it("returns in-progress for 50-74", () => expect(service.getBand(60)).toBe("in-progress"));
    it("returns ready for 75-89", () => expect(service.getBand(80)).toBe("ready"));
    it("returns strong for 90+", () => expect(service.getBand(95)).toBe("strong"));
  });

  describe("rollupTopic", () => {
    it("returns not-started for topic with no proofs", () => {
      const result = service.rollupTopic("topic-iam", [], {}, new Set());
      expect(result.band).toBe("not-started");
      expect(result.overall).toBe(0);
    });

    it("returns all-100 for completed topic", () => {
      const result = service.rollupTopic("topic-iam", [], {}, new Set(["topic-iam"]));
      expect(result.overall).toBe(100);
      expect(result.band).toBe("ready");
    });

    it("uses overrides when provided", () => {
      const result = service.rollupTopic("topic-iam", [], {
        "topic-iam": { knowledge: 80, practice: 60, interview: 50, implementation: 40 }
      }, new Set());
      expect(result.knowledge).toBe(80);
      expect(result.practice).toBe(60);
      expect(result.overall).toBeGreaterThan(0);
    });

    it("computes dimensions from completed proofs", () => {
      const records = [
        makeProof("p1", "knowledge", "cap-aws-cloud-architecture", "skill-aws-core", "topic-iam", 4),
        makeProof("p2", "coding-solution", "cap-aws-cloud-architecture", "skill-aws-core", "topic-iam", 3),
        makeProof("p3", "aws-design", "cap-aws-cloud-architecture", "skill-aws-core", "topic-iam", 5),
      ];
      const result = service.rollupTopic("topic-iam", records, {}, new Set());
      expect(result.knowledge).toBe(80);
      expect(result.practice).toBe(60);
      expect(result.implementation).toBe(100);
      expect(result.overall).toBeGreaterThan(0);
    });
  });

  describe("rollupSkill", () => {
    it("averages topic readiness into skill overall", () => {
      const skill = { id: "skill-aws-core", name: "AWS Core", capabilityId: "cap-aws-cloud-architecture", description: "", topicIds: ["topic-iam", "topic-s3", "topic-ec2"], proofTypes: [] };
      const result = service.rollupSkill(skill, [], { "topic-iam": { knowledge: 80, practice: 80, interview: 80, implementation: 80 } }, new Set());
      expect(result.topicReadiness.length).toBeGreaterThan(0);
      expect(result.overall).toBeGreaterThan(0);
    });

    it("returns 0 for skill with all unknown topics", () => {
      const skill = { id: "skill-unknown", name: "Unknown", capabilityId: "cap-unknown", description: "", topicIds: ["unknown-topic-1", "unknown-topic-2"], proofTypes: [] };
      const result = service.rollupSkill(skill, [], {}, new Set());
      expect(result.overall).toBe(0);
    });
  });

  describe("rollupCapability", () => {
    function makeCap(id: string, name: string, category: CapabilityCategory, proofTypes: ProofType[] = []): Capability {
      return {
        id, name, category,
        whyItMatters: "", targetRoles: [], priorityWeight: 1, readinessThreshold: 0,
        sourceCategories: [], sourceIds: [], roadmapDependencies: [],
        missionTypes: [], proofTypes, skillIds: []
      };
    }

    it("respects capability override", () => {
      const cap = makeCap("cap-some-cap", "Some Cap", "technical");
      const result = service.rollupCapability(cap, [], {}, { "cap-some-cap": 85 }, new Set());
      expect(result.overall).toBe(85);
      expect(result.band).toBe("ready");
    });

    it("computes readiness from skills and proofs", () => {
      const cap = makeCap("cap-aws-cloud-architecture", "AWS Cloud Architecture", "technical", ["knowledge" as ProofType, "aws-design" as ProofType]);
      const proof = makeProof("pa1", "knowledge", "cap-aws-cloud-architecture", "skill-aws-core", "topic-iam", 3);
      const result = service.rollupCapability(cap, [proof], {}, {}, new Set());
      expect(result.overall).toBeGreaterThanOrEqual(0);
      expect(typeof result.band).toBe("string");
    });
  });

  describe("rollup", () => {
    it("returns a complete role-level result", () => {
      const records = [
        makeProof("r1", "knowledge", "cap-aws-cloud-architecture", "skill-aws-core", "topic-iam", 4),
        makeProof("r2", "knowledge", "cap-aws-cloud-architecture", "skill-aws-core", "topic-vpc", 3),
      ];
      const input: ReadinessRollupInput = { proofRecords: records };
      const result = service.rollup(input);
      expect(result.role).toBe("solution-architect");
      expect(result.capabilityReadiness.length).toBeGreaterThan(0);
      expect(typeof result.overall).toBe("number");
      expect(typeof result.band).toBe("string");
    });

    it("produces non-zero overall with good proofs", () => {
      const records = [
        makeProof("r1", "hld", "cap-system-design-hld", "skill-hld", "topic-hld-chat", 4),
        makeProof("r2", "knowledge", "cap-system-design-hld", "skill-hld", "topic-hld-chat", 5),
        makeProof("r3", "aws-design", "cap-aws-cloud-architecture", "skill-aws-design", "topic-aws-high-availability", 4),
      ];
      const input: ReadinessRollupInput = { proofRecords: records };
      const result = service.rollup(input);
      expect(result.overall).toBeGreaterThan(0);
      expect(result.band).not.toBe("not-started");
    });

    it("produces deterministic output", () => {
      const a = service.rollup({});
      const b = service.rollup({});
      expect(a.overall).toBe(b.overall);
      expect(a.band).toBe(b.band);
    });
  });
});
