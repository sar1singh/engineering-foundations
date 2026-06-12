import type { InterviewEvaluationResult, InterviewSessionType } from "@/types/founder-beta";

export type DecayWeightedResult = {
  sessionType: InterviewSessionType;
  weightedAverage: number;
  simpleAverage: number;
  sessionCount: number;
  decayMultiplier: number;
};

export class InterviewScoreDecayService {
  private readonly DECAY_FACTOR = 0.85;

  computeWeightedAverage(evaluations: InterviewEvaluationResult[]): number {
    if (evaluations.length === 0) return 0;
    const sorted = [...evaluations].sort(
      (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );

    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (let i = 0; i < sorted.length; i++) {
      const weight = Math.pow(this.DECAY_FACTOR, sorted.length - 1 - i);
      totalWeightedScore += sorted[i].percentage * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
  }

  computeWeightedAverageByType(
    sessionType: InterviewSessionType,
    evaluations: InterviewEvaluationResult[]
  ): DecayWeightedResult {
    const filtered = evaluations.filter((e) => e.sessionType === sessionType);
    const simpleAverage = filtered.length > 0
      ? Math.round(filtered.reduce((s, e) => s + e.percentage, 0) / filtered.length)
      : 0;
    const weightedAverage = this.computeWeightedAverage(filtered);
    const decayMultiplier = this.computeDecayMultiplier(filtered);

    return {
      sessionType,
      weightedAverage,
      simpleAverage,
      sessionCount: filtered.length,
      decayMultiplier
    };
  }

  computeDecayMultiplier(evaluations: InterviewEvaluationResult[]): number {
    if (evaluations.length <= 1) return 1;
    const sorted = [...evaluations].sort(
      (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );
    let totalWeight = 0;
    for (let i = 0; i < sorted.length; i++) {
      totalWeight += Math.pow(this.DECAY_FACTOR, sorted.length - 1 - i);
    }
    const equalWeightTotal = sorted.length;
    return equalWeightTotal > 0 ? Math.round((totalWeight / equalWeightTotal) * 100) / 100 : 1;
  }

  computeAllWeightedAverages(evaluations: InterviewEvaluationResult[]): DecayWeightedResult[] {
    const types = [...new Set(evaluations.map((e) => e.sessionType))] as InterviewSessionType[];
    return types.map((t) => this.computeWeightedAverageByType(t, evaluations));
  }
}

export const founderBetaInterviewScoreDecayService = new InterviewScoreDecayService();
