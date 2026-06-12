import { founderBetaCapabilities } from "@/data/founder-beta/capabilities";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { dsaProblemBank } from "@/data/founder-beta/dsa-problem-bank";
import { founderBetaSkills } from "@/data/founder-beta/capabilities";
import type {
  Capability,
  MasterTopic,
  MissionCandidate,
  MissionCandidatePriority,
  MissionCandidateReadinessImpact,
  MissionOfferReadinessImpact,
  MissionType,
  ProofRecord,
  ReadinessRollupInput,
  Skill
} from "@/types/founder-beta";
import { FounderBetaRoadmapProjection } from "@/lib/services/founder-beta-roadmap-projection";
import { ReadinessRollupService } from "@/lib/services/founder-beta-readiness-rollup-service";

export type CandidateGenerationInput = {
  completedTopicIds?: string[];
  weakAreaCapabilityIds?: string[];
  weakAreaTopicIds?: string[];
  capabilityReadinessById?: Record<string, number>;
  topicReadinessById?: Record<string, number>;
  availableMinutes?: number;
};

export class FounderBetaMissionCandidateGenerator {
  constructor(
    private readonly projection: FounderBetaRoadmapProjection = new FounderBetaRoadmapProjection()
  ) {}

  generateCandidates(input: CandidateGenerationInput = {}): MissionCandidate[] {
    const result = this.projection.generateProjection({
      capabilityReadinessById: input.capabilityReadinessById,
      topicReadinessById: input.topicReadinessById,
      completedTopicIds: input.completedTopicIds,
      weakAreaCapabilityIds: input.weakAreaCapabilityIds,
      weakAreaTopicIds: input.weakAreaTopicIds
    });

    const candidates: MissionCandidate[] = [];
    const skillMap = new Map(founderBetaSkills.map((s) => [s.id, s]));
    const capMap = new Map(founderBetaCapabilities.map((c) => [c.id, c]));
    const allTopics: MasterTopic[] = [...founderBetaMasterTopics, ...dsaProblemBank];
    const topicMap = new Map(allTopics.map((t) => [t.id, t]));
    const weakCapIds = new Set(input.weakAreaCapabilityIds ?? []);
    const weakTopicIds = new Set(input.weakAreaTopicIds ?? []);
    const completedTopics = new Set(input.completedTopicIds ?? []);
    const availableMinutes = input.availableMinutes ?? 60;

    for (const phase of result.phases) {
      for (const skillId of phase.skillIds) {
        const skill = skillMap.get(skillId);
        if (!skill) continue;

        const cap = capMap.get(skill.capabilityId);
        if (!cap) continue;

        const priority = this.computeCandidatePriority(skill, cap, weakCapIds, weakTopicIds, completedTopics);
        const topicIds = skill.topicIds.filter((tid) => !completedTopics.has(tid) && phase.topicIds.includes(tid));

        if (topicIds.length === 0) continue;

        const candidateMissionTypes = this.inferMissionTypes(skill, cap, priority, weakCapIds);
        const estimatedMinutes = this.estimateMinutes(topicIds.length, topicMap);
        const readinessTarget = cap.readinessThreshold;

        for (const mt of candidateMissionTypes) {
          const candidate: MissionCandidate = {
            id: `mc-${phase.id}-${skillId}-${mt}`,
            missionType: mt,
            capabilityId: skill.capabilityId,
            skillId,
            topicIds: topicIds.slice(0, 3),
            proofTypes: skill.proofTypes,
            estimatedMinutes: Math.min(estimatedMinutes, availableMinutes),
            readinessTarget,
            priorityReason: this.buildPriorityReason(priority, skill, cap, weakCapIds, weakTopicIds),
            priority,
            prerequisiteTopicIds: this.collectPrerequisites(topicIds, topicMap, completedTopics),
            dependsOnMissionIds: []
          };

          candidates.push(candidate);
        }
      }
    }

    return candidates.sort((a, b) => {
      const priorityOrder: Record<MissionCandidatePriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (pDiff !== 0) return pDiff;
      return b.readinessTarget - a.readinessTarget;
    });
  }

  computeReadinessImpact(
    candidate: MissionCandidate,
    proofRecords: ProofRecord[],
    readinessOverrides?: Partial<ReadinessRollupInput>
  ): MissionCandidateReadinessImpact {
    const rollup = new ReadinessRollupService();

    // Current readiness
    const currentInput: ReadinessRollupInput = {
      proofRecords,
      completedTopicIds: readinessOverrides?.completedTopicIds ?? [],
      topicReadinessOverride: readinessOverrides?.topicReadinessOverride ?? {},
      capabilityReadinessOverride: readinessOverrides?.capabilityReadinessOverride ?? {},
      roleWeights: readinessOverrides?.roleWeights
    };
    const current = rollup.rollup(currentInput);

    // Simulated readiness after completing the mission
    const projectedRords = proofRecords.map((r) => ({ ...r }));
    const simulatedTopicIds = candidate.topicIds.filter(
      (tid) => !(readinessOverrides?.completedTopicIds ?? []).includes(tid)
    );
    for (const tid of simulatedTopicIds) {
      const existingIdx = projectedRords.findIndex((r) => r.topicId === tid && r.state === "completed");
      if (existingIdx === -1) {
        projectedRords.push({
          id: `sim-${candidate.id}-${tid}`,
          proofType: "knowledge" as const,
          capabilityId: candidate.capabilityId,
          skillId: candidate.skillId,
          topicId: tid,
          state: "completed" as const,
          score: 3,
          artifactRef: null,
          submittedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          validatedAt: null,
          attemptCount: 1
        });
      }
    }

    const simulatedInput: ReadinessRollupInput = {
      proofRecords: projectedRords,
      completedTopicIds: [
        ...(readinessOverrides?.completedTopicIds ?? []),
        ...simulatedTopicIds
      ],
      topicReadinessOverride: readinessOverrides?.topicReadinessOverride ?? {},
      capabilityReadinessOverride: readinessOverrides?.capabilityReadinessOverride ?? {},
      roleWeights: readinessOverrides?.roleWeights
    };
    const projected = rollup.rollup(simulatedInput);

    // Compute deltas
    const topicDeltas: MissionCandidateReadinessImpact["topicDeltas"] = [];
    const skillDeltas: MissionCandidateReadinessImpact["skillDeltas"] = [];
    const capabilityDeltas: MissionCandidateReadinessImpact["capabilityDeltas"] = [];

    for (const cap of current.capabilityReadiness) {
      const projCap = projected.capabilityReadiness.find((c) => c.capabilityId === cap.capabilityId);
      if (projCap) {
        const capDelta = projCap.overall - cap.overall;
        if (capDelta !== 0 || cap.capabilityId === candidate.capabilityId) {
          capabilityDeltas.push({
            capabilityId: cap.capabilityId,
            capabilityName: cap.capabilityName,
            delta: capDelta
          });
        }

        for (const skill of cap.skillReadiness) {
          const projSkill = projCap.skillReadiness.find((s) => s.skillId === skill.skillId);
          if (projSkill) {
            const skillDelta = projSkill.overall - skill.overall;
            if (skillDelta !== 0 || skill.skillId === candidate.skillId) {
              skillDeltas.push({
                skillId: skill.skillId,
                skillName: skill.skillName,
                delta: skillDelta
              });
            }

            for (const topic of skill.topicReadiness) {
              const projTopic = projSkill.topicReadiness.find((t) => t.topicId === topic.topicId);
              if (projTopic) {
                const topicDelta = projTopic.overall - topic.overall;
                if (topicDelta !== 0 || simulatedTopicIds.includes(topic.topicId)) {
                  topicDeltas.push({
                    topicId: topic.topicId,
                    topicName: topic.topicName,
                    delta: topicDelta
                  });
                }
              }
            }
          }
        }
      }
    }

    const roleReadinessDelta = projected.overall - current.overall;

    // Overall value score: weighted sum of deltas
    const totalTopicDelta = topicDeltas.reduce((s, t) => s + Math.abs(t.delta), 0);
    const totalSkillDelta = skillDeltas.reduce((s, t) => s + Math.abs(t.delta), 0);
    const totalCapDelta = capabilityDeltas.reduce((s, t) => s + Math.abs(t.delta), 0);
    const overallValueScore = Math.round(
      totalTopicDelta * 0.3 + totalSkillDelta * 0.3 + totalCapDelta * 0.2 + Math.abs(roleReadinessDelta) * 0.2
    );

    return {
      candidateId: candidate.id,
      missionType: candidate.missionType,
      topicDeltas,
      skillDeltas,
      capabilityDeltas,
      roleReadinessDelta: Math.round(roleReadinessDelta * 10) / 10,
      overallValueScore
    };
  }

  computeOfferReadinessImpact(
    candidate: MissionCandidate,
    proofRecords: ProofRecord[],
    readinessOverrides?: Partial<ReadinessRollupInput>
  ): MissionOfferReadinessImpact {
    const skillMap = new Map(founderBetaSkills.map((s) => [s.id, s]));
    const capMap = new Map(founderBetaCapabilities.map((c) => [c.id, c]));
    const rollup = new ReadinessRollupService();

    // Current capability readiness
    const currentReadiness = rollup.rollup({
      proofRecords,
      completedTopicIds: readinessOverrides?.completedTopicIds ?? [],
      topicReadinessOverride: readinessOverrides?.topicReadinessOverride ?? {},
      capabilityReadinessOverride: readinessOverrides?.capabilityReadinessOverride ?? {}
    });

    const capReadinessById: Record<string, number> = {};
    const proofCompletionByCapId: Record<string, number> = {};
    for (const cr of currentReadiness.capabilityReadiness) {
      capReadinessById[cr.capabilityId] = cr.overall;
      const completedProofs = proofRecords.filter(
        (r) => r.capabilityId === cr.capabilityId && (r.state === "completed" || r.state === "validated")
      );
      proofCompletionByCapId[cr.capabilityId] = completedProofs.length;
    }

    const cap = capMap.get(candidate.capabilityId);
    if (cap) {
      capReadinessById[cap.id] = Math.min(100, (capReadinessById[cap.id] ?? 0) + 10);
    }
    const dsaCapId = "cap-dsa-problem-solving";
    const dsaCurrent = capReadinessById[dsaCapId] ?? 0;

    // Weak DSA check
    const isDsaWeak = dsaCurrent < 60;
    const isDsaCandidate = candidate.capabilityId === dsaCapId ||
      candidate.topicIds.some((tid) => {
        const topic = [...founderBetaMasterTopics, ...dsaProblemBank].find((t) => t.id === tid);
        return topic?.skillIds.some((sid) => {
          const s = skillMap.get(sid);
          return s?.capabilityId === dsaCapId;
        });
      });

    const dsaPriorityBoost = isDsaWeak && isDsaCandidate ? 20 : 0;
    const offerReadinessReduction = isDsaWeak ? 15 : 0;

    const dsaFocusedActions: string[] = [];
    if (isDsaWeak && isDsaCandidate) {
      dsaFocusedActions.push("DSA readiness is below 60 — prioritize DSA problem-solving missions");
      dsaFocusedActions.push("Complete at least one DSA coding-solution proof to improve interview readiness");
    } else if (isDsaWeak) {
      dsaFocusedActions.push("DSA readiness is below 60 — affects overall interview readiness");
    }

    return {
      candidateId: candidate.id,
      dsaPriorityBoost,
      offerReadinessReduction,
      dsaFocusedActions
    };
  }

  private computeCandidatePriority(
    skill: Skill,
    cap: Capability,
    weakCapIds: Set<string>,
    weakTopicIds: Set<string>,
    completedTopics: Set<string>
  ): MissionCandidatePriority {
    const isWeakCap = weakCapIds.has(skill.capabilityId);
    const hasUncompletedTopics = skill.topicIds.some((tid) => !completedTopics.has(tid));
    const hasWeakTopics = skill.topicIds.some((tid) => weakTopicIds.has(tid));

    if (isWeakCap && hasWeakTopics) return "critical";
    if (isWeakCap) return "high";
    if (hasWeakTopics) return "high";
    if (cap.priorityWeight >= 15) return "high";
    if (cap.priorityWeight >= 10) return "medium";
    if (!hasUncompletedTopics) return "low";
    return "medium";
  }

  private inferMissionTypes(
    skill: Skill,
    cap: Capability,
    priority: MissionCandidatePriority,
    weakCapIds: Set<string>
  ): MissionType[] {
    const types: MissionType[] = [];

    if (priority === "critical" || priority === "high") {
      types.push("practice");
      types.push("interview");
      if (weakCapIds.has(skill.capabilityId)) {
        types.push("weak-area-repair");
      }
    } else {
      types.push("practice");
    }

    if (skill.proofTypes.includes("lld") || skill.proofTypes.includes("hld") || skill.proofTypes.includes("aws-design")) {
      types.push("implement");
    }

    if (skill.proofTypes.includes("behavioral-answer")) {
      types.push("behavioral");
    }

    return types;
  }

  private estimateMinutes(topicCount: number, topicMap: Map<string, MasterTopic>): number {
    if (topicCount === 0) return 30;
    let total = 0;
    let count = 0;
    for (const tid of topicMap.keys()) {
      if (count >= topicCount) break;
      const topic = topicMap.get(tid);
      if (topic) {
        total += topic.estimatedStudyMinutes + topic.estimatedPracticeMinutes;
        count++;
      }
    }
    return count > 0 ? Math.ceil(total / count) : 60;
  }

  private collectPrerequisites(
    topicIds: string[],
    topicMap: Map<string, MasterTopic>,
    completedTopics: Set<string>
  ): string[] {
    const prereqs = new Set<string>();
    for (const tid of topicIds) {
      const topic = topicMap.get(tid);
      if (topic) {
        for (const prereqId of topic.prerequisiteTopicIds) {
          if (!completedTopics.has(prereqId)) {
            prereqs.add(prereqId);
          }
        }
      }
    }
    return [...prereqs];
  }

  private buildPriorityReason(
    priority: MissionCandidatePriority,
    skill: Skill,
    cap: Capability,
    weakCapIds: Set<string>,
    weakTopicIds: Set<string>
  ): string {
    const parts: string[] = [];

    if (weakCapIds.has(skill.capabilityId)) {
      parts.push(`${cap.name} is a weak area`);
    }

    const weakSkillTopics = skill.topicIds.filter((tid) => weakTopicIds.has(tid));
    if (weakSkillTopics.length > 0) {
      parts.push(`${weakSkillTopics.length} weak topic(s) in skill`);
    }

    if (cap.priorityWeight >= 15) {
      parts.push(`high-priority capability (weight ${cap.priorityWeight})`);
    }

    return parts.length > 0 ? parts.join("; ") : `Phase alignment for ${cap.name}`;
  }
}

export const founderBetaMissionCandidateGenerator = new FounderBetaMissionCandidateGenerator();
