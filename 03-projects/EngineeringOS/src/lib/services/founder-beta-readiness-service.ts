import { founderBetaReadinessRules, proofScoreLabels, topicReadinessWeights } from "@/data/founder-beta";
import type { ProofScore } from "@/types/founder-beta";

export type TopicReadinessInput = Partial<Record<keyof typeof topicReadinessWeights, number>>;

export type CapabilityReadinessInput = {
  topicReadinessScores?: number[];
  proofScores?: number[];
  interviewReadinessScore?: number;
  recencyScore?: number;
  blockerPenalty?: number;
};

export type RoleReadinessInput = {
  capabilityScores?: Array<{
    score?: number;
    weight?: number;
  }>;
};

export type HardGateInput = {
  architectReadiness?: number;
  awsReadiness?: number;
  behavioralReadiness?: number;
  communicationReadiness?: number;
  resumeReadiness?: number;
  completedArchitectureCaseStudies?: number;
};

export type HardGateResult = {
  id: string;
  label: string;
  threshold: number;
  actual: number;
  passed: boolean;
};

export type OfferReadinessInput = HardGateInput & {
  linkedInReadiness?: number;
  githubReadiness?: number;
  portfolioReadiness?: number;
  interviewPipelineReadiness?: number;
  compensationReadiness?: number;
};

export type OfferReadinessResult = {
  score: number;
  band: ReadinessBand;
  hardGatesPassed: boolean;
  hardGates: HardGateResult[];
};

export type ReadinessBand = "not-started" | "blocked" | "in-progress" | "ready" | "strong";

export class FounderBetaReadinessService {
  calculateTopicReadiness(input: TopicReadinessInput): number {
    const knowledge = normalizeDimension(input.knowledge);
    const practice = normalizeDimension(input.practice);
    const interview = normalizeDimension(input.interview);
    const implementation = normalizeDimension(input.implementation);

    return clampScore(
      knowledge * topicReadinessWeights.knowledge +
        practice * topicReadinessWeights.practice +
        interview * topicReadinessWeights.interview +
        implementation * topicReadinessWeights.implementation
    );
  }

  calculateCapabilityReadiness(input: CapabilityReadinessInput): number {
    const topicReadiness = average(input.topicReadinessScores ?? []);
    const proofReadiness = average((input.proofScores ?? []).map((score) => proofScoreToPercent(score)));
    const interviewReadiness = clampScore(input.interviewReadinessScore ?? 0);
    const recency = clampScore(input.recencyScore ?? 0);
    const penalty = clampScore(input.blockerPenalty ?? 0);

    return clampScore(topicReadiness * 0.5 + proofReadiness * 0.25 + interviewReadiness * 0.15 + recency * 0.1 - penalty);
  }

  calculateRoleReadiness(input: RoleReadinessInput): number {
    const scores = input.capabilityScores ?? [];
    const totalWeight = scores.reduce((sum, item) => sum + Math.max(0, item.weight ?? 0), 0);

    if (scores.length === 0 || totalWeight === 0) {
      return 0;
    }

    const weightedScore = scores.reduce((sum, item) => sum + clampScore(item.score ?? 0) * Math.max(0, item.weight ?? 0), 0);
    return clampScore(weightedScore / totalWeight);
  }

  evaluateHardGates(input: HardGateInput): HardGateResult[] {
    return founderBetaReadinessRules.map((rule) => {
      const actual = getHardGateActual(rule.id, input);

      return {
        id: rule.id,
        label: rule.label,
        threshold: rule.threshold,
        actual,
        passed: actual >= rule.threshold
      };
    });
  }

  getReadinessBand(score: number): ReadinessBand {
    const normalized = clampScore(score);

    if (normalized === 0) {
      return "not-started";
    }

    if (normalized < 50) {
      return "blocked";
    }

    if (normalized < 75) {
      return "in-progress";
    }

    if (normalized < 90) {
      return "ready";
    }

    return "strong";
  }

  getProofScoreLabel(score: ProofScore): string {
    return proofScoreLabels[score];
  }

  calculateOfferReadiness(input: OfferReadinessInput): OfferReadinessResult {
    const hardGates = this.evaluateHardGates(input);
    const hardGatesPassed = hardGates.every((gate) => gate.passed);
    const readinessAreas = [
      input.resumeReadiness,
      input.behavioralReadiness,
      input.linkedInReadiness,
      input.githubReadiness,
      input.portfolioReadiness,
      input.interviewPipelineReadiness,
      input.compensationReadiness,
      caseStudyCountToPercent(input.completedArchitectureCaseStudies)
    ];
    const score = clampScore(average(readinessAreas.map((value) => clampScore(value ?? 0))));

    return {
      score,
      band: hardGatesPassed ? this.getReadinessBand(score) : "blocked",
      hardGatesPassed,
      hardGates
    };
  }
}

export const founderBetaReadinessService = new FounderBetaReadinessService();

function normalizeDimension(value: number | undefined): number {
  if (value === undefined) {
    return 0;
  }

  if (value <= 5) {
    return proofScoreToPercent(value);
  }

  return clampScore(value);
}

function proofScoreToPercent(score: number): number {
  return clampScore((Math.max(0, Math.min(5, score)) / 5) * 100);
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + clampScore(value), 0) / values.length;
}

function clampScore(score: number): number {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(score * 100) / 100));
}

function getHardGateActual(ruleId: string, input: HardGateInput): number {
  switch (ruleId) {
    case "rule-architect-readiness":
      return clampScore(input.architectReadiness ?? 0);
    case "rule-aws-readiness":
      return clampScore(input.awsReadiness ?? 0);
    case "rule-behavioral-readiness":
      return clampScore(input.behavioralReadiness ?? 0);
    case "rule-communication-readiness":
      return clampScore(input.communicationReadiness ?? 0);
    case "rule-resume-readiness":
      return clampScore(input.resumeReadiness ?? 0);
    case "rule-architecture-case-studies":
      return Math.max(0, input.completedArchitectureCaseStudies ?? 0);
    default:
      return 0;
  }
}

function caseStudyCountToPercent(count: number | undefined): number {
  return clampScore(((count ?? 0) / 3) * 100);
}
