import type {
  InterviewCategory,
  InterviewEvaluationResult,
  InterviewSession,
  Rubric,
  RubricScore
} from "@/types/founder-beta";
import { getRubricsByIds } from "@/data/founder-beta/interview-rubrics";
import { founderBetaInterviewQuestions } from "@/data/founder-beta/interview-questions";

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  dsa: "Data Structures & Algorithms",
  "problem-solving": "Problem Solving",
  lld: "Low-Level Design",
  hld: "High-Level Design",
  "system-design": "System Design",
  aws: "AWS Cloud Architecture",
  behavioral: "Behavioral",
  leadership: "Leadership",
  "resume-deep-dive": "Resume Deep Dive",
  "project-deep-dive": "Project Deep Dive"
};

export class InterviewEvaluationService {
  evaluate(
    session: InterviewSession,
    rubricScores: RubricScore[]
  ): InterviewEvaluationResult {
    if (session.status !== "completed" && session.status !== "timed-out") {
      throw new Error("Cannot evaluate a session that is not completed or timed-out");
    }

    const usedRubricIds = this.collectUsedRubricIds(session);
    const rubrics = getRubricsByIds(usedRubricIds);
    const allCriteria = rubrics.flatMap((r) => r.criteria);
    const criteriaMap = new Map(allCriteria.map((c) => [c.id, c]));

    const validScores = rubricScores.filter((rs) => criteriaMap.has(rs.criterionId));
    const categoryScores = this.computeCategoryScores(rubrics, validScores);
    const { totalScore, maxScore } = this.computeTotal(rubrics, validScores);
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    return {
      sessionId: session.id,
      sessionType: session.sessionType,
      totalScore,
      maxScore,
      percentage,
      categoryScores,
      rubricScores: validScores,
      strengths: this.computeStrengths(rubrics, validScores),
      weaknesses: this.computeWeaknesses(rubrics, validScores),
      improvementAreas: this.computeImprovementAreas(rubrics, validScores, categoryScores),
      completedAt: session.completedAt ?? new Date().toISOString()
    };
  }

  private collectUsedRubricIds(session: InterviewSession): string[] {
    const ids = new Set<string>();
    for (const qid of session.questionIds) {
      const q = founderBetaInterviewQuestions.find((qi) => qi.id === qid);
      if (q) {
        for (const rid of q.rubricIds) {
          ids.add(rid);
        }
      }
    }
    return [...ids];
  }

  private computeCategoryScores(
    rubrics: Rubric[],
    rubricScores: RubricScore[]
  ): InterviewEvaluationResult["categoryScores"] {
    const categoryMap = new Map<InterviewCategory, { score: number; maxScore: number }>();

    for (const rubric of rubrics) {
      const criteriaScores = rubricScores.filter((rs) =>
        rubric.criteria.some((c) => c.id === rs.criterionId)
      );

      let rubricScore = 0;
      let rubricMax = 0;
      for (const criterion of rubric.criteria) {
        const score = criteriaScores.find((cs) => cs.criterionId === criterion.id);
        const actualScore = score?.score ?? 0;
        rubricScore += actualScore * criterion.weight;
        rubricMax += criterion.maxScore * criterion.weight;
      }

      const existing = categoryMap.get(rubric.category);
      if (existing) {
        existing.score += rubricScore;
        existing.maxScore += rubricMax;
      } else {
        categoryMap.set(rubric.category, { score: rubricScore, maxScore: rubricMax });
      }
    }

    return [...categoryMap.entries()].map(([category, { score, maxScore }]) => ({
      category,
      score,
      maxScore,
      percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
    }));
  }

  private computeTotal(
    rubrics: Rubric[],
    rubricScores: RubricScore[]
  ): { totalScore: number; maxScore: number } {
    let totalScore = 0;
    let maxScore = 0;
    for (const rubric of rubrics) {
      for (const criterion of rubric.criteria) {
        const score = rubricScores.find((rs) => rs.criterionId === criterion.id);
        totalScore += (score?.score ?? 0) * criterion.weight;
        maxScore += criterion.maxScore * criterion.weight;
      }
    }
    return { totalScore, maxScore };
  }

  private computeStrengths(rubrics: Rubric[], rubricScores: RubricScore[]): string[] {
    const strengths: string[] = [];
    for (const rubric of rubrics) {
      for (const criterion of rubric.criteria) {
        const score = rubricScores.find((rs) => rs.criterionId === criterion.id);
        if (score && score.score >= 4) {
          const pct = Math.round((score.score / criterion.maxScore) * 100);
          strengths.push(`${criterion.label}: ${pct}% — ${criterion.description}`);
        }
      }
    }
    return strengths.slice(0, 5);
  }

  private computeWeaknesses(rubrics: Rubric[], rubricScores: RubricScore[]): string[] {
    const weaknesses: string[] = [];
    for (const rubric of rubrics) {
      for (const criterion of rubric.criteria) {
        const score = rubricScores.find((rs) => rs.criterionId === criterion.id);
        if (score && score.score <= 2) {
          const pct = Math.round((score.score / criterion.maxScore) * 100);
          weaknesses.push(`${criterion.label}: ${pct}% — needs improvement in ${criterion.description.toLowerCase()}`);
        }
      }
    }
    return weaknesses.slice(0, 5);
  }

  private computeImprovementAreas(
    rubrics: Rubric[],
    rubricScores: RubricScore[],
    categoryScores: InterviewEvaluationResult["categoryScores"]
  ): string[] {
    const areas: string[] = [];

    for (const cs of categoryScores) {
      const displayName = CATEGORY_DISPLAY_NAMES[cs.category] ?? cs.category;
      if (cs.percentage < 50) {
        areas.push(`Focus on improving ${displayName} (currently ${cs.percentage}% — significantly below target)`);
      } else if (cs.percentage < 75) {
        areas.push(`Continue building ${displayName} skills (currently ${cs.percentage}% — approaching target)`);
      }
    }

    for (const rubric of rubrics) {
      for (const criterion of rubric.criteria) {
        const score = rubricScores.find((rs) => rs.criterionId === criterion.id);
        if (score && score.score === 3) {
          areas.push(`Strengthen ${criterion.label.toLowerCase()} — currently at adequate level`);
        }
      }
    }

    return [...new Set(areas)].slice(0, 5);
  }
}

export const founderBetaInterviewEvaluationService = new InterviewEvaluationService();
