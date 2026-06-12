import type { InterviewEvaluationResult, InterviewCategory, InterviewSessionType } from "@/types/founder-beta";

export type InterviewAnalyticsSummary = {
  totalSessions: number;
  averageScore: number;
  scoreByCategory: Record<InterviewCategory, { average: number; count: number }>;
  weakCategories: InterviewCategory[];
  strongCategories: InterviewCategory[];
  recommendedPracticeFocus: string[];
};

export type InterviewCategoryBreakdown = {
  category: InterviewCategory;
  averageScore: number;
  maxScore: number;
  minScore: number;
  sessionCount: number;
  trend: "improving" | "declining" | "stable";
};

export class InterviewAnalyticsService {
  computeSummary(evaluations: InterviewEvaluationResult[]): InterviewAnalyticsSummary {
    const totalSessions = evaluations.length;
    const averageScore = totalSessions > 0
      ? Math.round(evaluations.reduce((s, e) => s + e.percentage, 0) / totalSessions)
      : 0;

    const scoreByCategory = this.computeScoreByCategory(evaluations);
    const weakCategories = this.findWeakCategories(scoreByCategory);
    const strongCategories = this.findStrongCategories(scoreByCategory);
    const recommendedPracticeFocus = this.buildPracticeFocus(weakCategories, scoreByCategory);

    return { totalSessions, averageScore, scoreByCategory, weakCategories, strongCategories, recommendedPracticeFocus };
  }

  computeCategoryBreakdown(evaluations: InterviewEvaluationResult[]): InterviewCategoryBreakdown[] {
    const byCategory = new Map<InterviewCategory, number[]>();

    for (const evalResult of evaluations) {
      for (const cs of evalResult.categoryScores) {
        if (!byCategory.has(cs.category)) byCategory.set(cs.category, []);
        byCategory.get(cs.category)!.push(cs.percentage);
      }
    }

    return [...byCategory.entries()]
      .map(([category, scores]) => {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return {
          category,
          averageScore: Math.round(avg),
          maxScore: Math.round(Math.max(...scores)),
          minScore: Math.round(Math.min(...scores)),
          sessionCount: scores.length,
          trend: this.computeTrend(scores)
        };
      })
      .sort((a, b) => a.averageScore - b.averageScore);
  }

  computeAverageScore(sessionType: InterviewSessionType, evaluations: InterviewEvaluationResult[]): number {
    const filtered = evaluations.filter((e) => e.sessionType === sessionType);
    if (filtered.length === 0) return 0;
    return Math.round(filtered.reduce((s, e) => s + e.percentage, 0) / filtered.length);
  }

  private computeScoreByCategory(
    evaluations: InterviewEvaluationResult[]
  ): Record<InterviewCategory, { average: number; count: number }> {
    const categoryMap = new Map<InterviewCategory, { total: number; count: number }>();

    for (const evalResult of evaluations) {
      for (const cs of evalResult.categoryScores) {
        const existing = categoryMap.get(cs.category) ?? { total: 0, count: 0 };
        existing.total += cs.percentage;
        existing.count += 1;
        categoryMap.set(cs.category, existing);
      }
    }

    const result = {} as Record<InterviewCategory, { average: number; count: number }>;
    for (const [category, { total, count }] of categoryMap) {
      result[category] = { average: Math.round(total / count), count };
    }
    return result;
  }

  private findWeakCategories(
    scoreByCategory: Record<string, { average: number; count: number }>
  ): InterviewCategory[] {
    return (Object.entries(scoreByCategory) as [InterviewCategory, { average: number; count: number }][])
      .filter(([, { average }]) => average < 60)
      .map(([category]) => category);
  }

  private findStrongCategories(
    scoreByCategory: Record<string, { average: number; count: number }>
  ): InterviewCategory[] {
    return (Object.entries(scoreByCategory) as [InterviewCategory, { average: number; count: number }][])
      .filter(([, { average }]) => average >= 80)
      .map(([category]) => category);
  }

  private buildPracticeFocus(
    weakCategories: InterviewCategory[],
    scoreByCategory: Record<string, { average: number; count: number }>
  ): string[] {
    const focus: string[] = [];
    for (const cat of weakCategories) {
      const info = scoreByCategory[cat];
      if (info) {
        focus.push(`Practice ${cat} (average ${info.average}% across ${info.count} session(s))`);
      }
    }
    if (focus.length === 0) {
      focus.push("All categories are at or above target — maintain through regular practice");
    }
    return focus;
  }

  private computeTrend(scores: number[]): "improving" | "declining" | "stable" {
    if (scores.length < 3) return "stable";
    const recent = scores.slice(-3);
    const diffs = recent.slice(1).map((v, i) => v - recent[i]);
    const avgDiff = diffs.reduce((s, d) => s + d, 0) / diffs.length;
    if (avgDiff > 5) return "improving";
    if (avgDiff < -5) return "declining";
    return "stable";
  }
}

export const founderBetaInterviewAnalyticsService = new InterviewAnalyticsService();
