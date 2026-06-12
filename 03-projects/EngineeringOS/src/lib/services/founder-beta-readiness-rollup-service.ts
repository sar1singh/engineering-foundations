import { founderBetaCapabilities } from "@/data/founder-beta/capabilities";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { dsaProblemBank } from "@/data/founder-beta/dsa-problem-bank";
import { founderBetaSkills } from "@/data/founder-beta/capabilities";
import { topicReadinessWeights } from "@/data/founder-beta/readiness-rules";
import { ProofLifecycleService } from "@/lib/services/founder-beta-proof-lifecycle-service";
import type {
  Capability,
  CapabilityReadinessDetail,
  ProofRecord,
  ReadinessBand,
  ReadinessRollupInput,
  RoleReadinessDetail,
  Skill,
  SkillReadinessDetail,
  TopicReadinessDetail
} from "@/types/founder-beta";

const allTopics = [...founderBetaMasterTopics, ...dsaProblemBank];
const topicMap = new Map(allTopics.map((t) => [t.id, t]));

const proofLifecycleService = new ProofLifecycleService();

const SOLUTION_ARCHITECT_WEIGHTS: Record<string, number> = {
  "cap-system-design-hld": 16,
  "cap-aws-cloud-architecture": 18,
  "cap-distributed-systems": 11,
  "cap-databases": 9,
  "cap-security": 8,
  "cap-reliability-observability": 9,
  "cap-node-backend": 8,
  "cap-low-level-design": 5,
  "cap-dsa-problem-solving": 5,
  "cap-behavioral-communication": 7,
  "cap-technical-leadership": 5,
  "cap-delivery-leadership": 4,
  "cap-architecture-case-studies": 10,
  "cap-career-assets": 5,
  "cap-offer-readiness": 3
};

export class ReadinessRollupService {
  rollup(input: ReadinessRollupInput = {}): RoleReadinessDetail {
    const proofRecords = input.proofRecords ?? [];
    const topicOverrides = input.topicReadinessOverride ?? {};
    const capOverrides = input.capabilityReadinessOverride ?? {};
    const completedTopics = new Set(input.completedTopicIds ?? []);
    const roleWeights = input.roleWeights ?? SOLUTION_ARCHITECT_WEIGHTS;

    const capReadiness = founderBetaCapabilities
      .map((cap) => this.rollupCapability(cap, proofRecords, topicOverrides, capOverrides, completedTopics))
      .filter((c) => c.skillReadiness.length > 0 || c.overall > 0);

    const overall = this.computeRoleOverall(capReadiness, roleWeights);

    return {
      role: "solution-architect",
      capabilityReadiness: capReadiness,
      overall,
      band: this.getBand(overall)
    };
  }

  rollupCapability(
    cap: Capability,
    proofRecords: ProofRecord[],
    topicOverrides: ReadinessRollupInput["topicReadinessOverride"] = {},
    capOverrides: ReadinessRollupInput["capabilityReadinessOverride"] = {},
    completedTopics: Set<string>
  ): CapabilityReadinessDetail {
    const override = capOverrides[cap.id];
    if (override !== undefined) {
      return {
        capabilityId: cap.id,
        capabilityName: cap.name,
        category: cap.category,
        skillReadiness: [],
        overall: override,
        band: this.getBand(override),
        blockers: []
      };
    }

    const skills = founderBetaSkills.filter((s) => s.capabilityId === cap.id);
    const skillReadiness = skills
      .map((skill) => this.rollupSkill(skill, proofRecords, topicOverrides, completedTopics))
      .filter((s) => s.topicReadiness.length > 0);

    const topicReadinessScores = skillReadiness.flatMap((s) => s.topicReadiness.map((t) => t.overall));
    const topicAvg = topicReadinessScores.length > 0
      ? topicReadinessScores.reduce((a, b) => a + b, 0) / topicReadinessScores.length
      : 0;

    const proofScore = proofLifecycleService.getCapabilityProofScore(proofRecords, cap.id);

    const blockers = this.findBlockers(cap, proofRecords, proofScore);
    const blockerPenalty = blockers.length > 0 ? 15 : 0;

    const overall = this.clamp(
      topicAvg * 0.5 + proofScore * 0.25 + 0.15 * Math.min(proofScore, 70) + 0.1 * Math.min(proofScore, 50) - blockerPenalty
    );

    return {
      capabilityId: cap.id,
      capabilityName: cap.name,
      category: cap.category,
      skillReadiness,
      overall,
      band: this.getBand(overall),
      blockers
    };
  }

  rollupSkill(
    skill: Skill,
    proofRecords: ProofRecord[],
    topicOverrides: ReadinessRollupInput["topicReadinessOverride"] = {},
    completedTopics: Set<string>
  ): SkillReadinessDetail {
    const topicReadiness = skill.topicIds
      .map((tid) => this.rollupTopic(tid, proofRecords, topicOverrides, completedTopics))
      .filter((t) => t.overall > 0);

    const overall = topicReadiness.length > 0
      ? topicReadiness.reduce((sum, t) => sum + t.overall, 0) / topicReadiness.length
      : 0;

    return {
      skillId: skill.id,
      skillName: skill.name,
      topicReadiness,
      overall: this.clamp(overall),
      band: this.getBand(overall)
    };
  }

  rollupTopic(
    topicId: string,
    proofRecords: ProofRecord[],
    topicOverrides: ReadinessRollupInput["topicReadinessOverride"] = {},
    completedTopics: Set<string>
  ): TopicReadinessDetail {
    const topic = topicMap.get(topicId);
    const topicName = topic?.name ?? topicId;

    if (completedTopics.has(topicId)) {
      return {
        topicId,
        topicName,
        knowledge: 100,
        practice: 100,
        interview: 100,
        implementation: 100,
        overall: 100,
        band: "ready"
      };
    }

    const override = topicOverrides[topicId];
    if (override) {
      const k = override.knowledge ?? 0;
      const p = override.practice ?? 0;
      const i = override.interview ?? 0;
      const im = override.implementation ?? 0;
      const overall = this.clamp(
        k * topicReadinessWeights.knowledge +
        p * topicReadinessWeights.practice +
        i * topicReadinessWeights.interview +
        im * topicReadinessWeights.implementation
      );
      return { topicId, topicName, knowledge: k, practice: p, interview: i, implementation: im, overall, band: this.getBand(overall) };
    }

    const topicProofs = proofRecords.filter((r) => r.topicId === topicId);
    const completedProofs = topicProofs.filter((r) => r.state === "completed" || r.state === "validated");

    if (completedProofs.length === 0 && topic) {
      return this.defaultTopicReadiness(topicId, topicName);
    }

    const dimensions = this.computeDimensions(completedProofs);

    const overall = this.clamp(
      dimensions.knowledge * topicReadinessWeights.knowledge +
      dimensions.practice * topicReadinessWeights.practice +
      dimensions.interview * topicReadinessWeights.interview +
      dimensions.implementation * topicReadinessWeights.implementation
    );

    return {
      topicId,
      topicName,
      ...dimensions,
      overall,
      band: this.getBand(overall)
    };
  }

  computeRoleOverall(capReadiness: CapabilityReadinessDetail[], weights: Record<string, number>): number {
    const totalWeight = capReadiness.reduce((sum, c) => sum + (weights[c.capabilityId] ?? 0), 0);
    if (totalWeight === 0) return 0;
    const weighted = capReadiness.reduce((sum, c) => sum + c.overall * (weights[c.capabilityId] ?? 0), 0);
    return this.clamp(weighted / totalWeight);
  }

  getBand(score: number): ReadinessBand {
    const s = this.clamp(score);
    if (s === 0) return "not-started";
    if (s < 50) return "blocked";
    if (s < 75) return "in-progress";
    if (s < 90) return "ready";
    return "strong";
  }

  private defaultTopicReadiness(topicId: string, topicName: string): TopicReadinessDetail {
    return {
      topicId,
      topicName,
      knowledge: 0,
      practice: 0,
      interview: 0,
      implementation: 0,
      overall: 0,
      band: "not-started"
    };
  }

  private computeDimensions(completedProofs: ProofRecord[]): { knowledge: number; practice: number; interview: number; implementation: number } {
    const scores = completedProofs.map((r) => r.score ?? 0);

    const typeMap = new Map<string, number[]>();
    for (const p of completedProofs) {
      const key = p.proofType;
      if (!typeMap.has(key)) typeMap.set(key, []);
      typeMap.get(key)!.push(p.score ?? 0);
    }

    const knowledge = this.averageScore(typeMap.get("knowledge") ?? scores);
    const practice = this.averageScore(typeMap.get("coding-solution") ?? typeMap.get("implementation-task") ?? scores);
    const interviewProofTypes = ["interview-answer", "behavioral-answer", "dsa-interview", "lld-interview", "hld-interview", "behavioral-interview"];
    const interviewScores: number[] = [];
    for (const pt of interviewProofTypes) {
      const s = typeMap.get(pt);
      if (s) interviewScores.push(...s);
    }
    const interview = this.averageScore(interviewScores.length > 0 ? interviewScores : scores);
    const implementation = this.averageScore(typeMap.get("hld") ?? typeMap.get("lld") ?? typeMap.get("aws-design") ?? typeMap.get("architecture-review") ?? typeMap.get("case-study") ?? scores);

    return {
      knowledge: this.proofToPercent(knowledge),
      practice: this.proofToPercent(practice),
      interview: this.proofToPercent(interview),
      implementation: this.proofToPercent(implementation)
    };
  }

  private findBlockers(cap: Capability, proofRecords: ProofRecord[], proofScore: number): string[] {
    const blockers: string[] = [];
    const capProofs = proofLifecycleService.getProofsByCapability(proofRecords, cap.id);
    const completedProofs = capProofs.filter((r) => r.state === "completed" || r.state === "validated");

    for (const pt of cap.proofTypes) {
      const hasProof = completedProofs.some((r) => r.proofType === pt);
      if (!hasProof) {
        blockers.push(`Missing required proof: ${pt}`);
      }
    }

    if (proofScore < 40 && capProofs.length > 0) {
      blockers.push("Proof scores are below acceptable threshold");
    }

    return blockers;
  }

  private clamp(v: number): number {
    if (!Number.isFinite(v)) return 0;
    return Math.max(0, Math.min(100, Math.round(v)));
  }

  private proofToPercent(score: number): number {
    return this.clamp((score / 5) * 100);
  }

  private averageScore(scores: number[]): number {
    if (scores.length === 0) return 0;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }
}

export const founderBetaReadinessRollupService = new ReadinessRollupService();
