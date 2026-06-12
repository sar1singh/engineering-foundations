import type {
  InterviewCategory,
  InterviewEvaluationResult,
  InterviewProofType,
  InterviewSession,
  InterviewSessionType,
  InterviewReadinessSnapshot,
  ProofRecord
} from "@/types/founder-beta";

const SESSION_TYPE_TO_PROOF_TYPE: Record<InterviewSessionType, InterviewProofType> = {
  dsa: "dsa-interview",
  lld: "lld-interview",
  hld: "hld-interview",
  behavioral: "behavioral-interview",
  "mixed-architect": "hld-interview"
};

const SESSION_TYPE_TO_CAPABILITY: Record<InterviewSessionType, string> = {
  dsa: "cap-dsa-problem-solving",
  lld: "cap-low-level-design",
  hld: "cap-system-design-hld",
  behavioral: "cap-behavioral-communication",
  "mixed-architect": "cap-system-design-hld"
};

function generateId(): string {
  return `ip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export class InterviewReadinessIntegrationService {
  sessionTypeToProofType(sessionType: InterviewSessionType): InterviewProofType {
    return SESSION_TYPE_TO_PROOF_TYPE[sessionType];
  }

  sessionTypeToCapabilityId(sessionType: InterviewSessionType): string {
    return SESSION_TYPE_TO_CAPABILITY[sessionType];
  }

  createProofRecord(
    evaluation: InterviewEvaluationResult,
    session: InterviewSession,
    overrides?: {
      id?: string;
      skillId?: string;
      topicId?: string;
    }
  ): ProofRecord {
    const proofType = this.sessionTypeToProofType(session.sessionType);
    const capabilityId = this.sessionTypeToCapabilityId(session.sessionType);

    const score = this.evaluationToProofScore(evaluation.percentage);

    return {
      id: overrides?.id ?? generateId(),
      proofType,
      capabilityId,
      skillId: overrides?.skillId ?? "",
      topicId: overrides?.topicId ?? "",
      state: "completed",
      score,
      artifactRef: `evaluation:${evaluation.sessionId}`,
      submittedAt: evaluation.completedAt,
      completedAt: evaluation.completedAt,
      validatedAt: null,
      attemptCount: 1
    };
  }

  createProofRecordsByCategory(evaluation: InterviewEvaluationResult): ProofRecord[] {
    const records: ProofRecord[] = [];

    for (const cs of evaluation.categoryScores) {
      const proofType = this.categoryToProofType(cs.category);
      if (!proofType) continue;

      const capabilityId = this.categoryToCapabilityId(cs.category);
      if (!capabilityId) continue;

      const score = this.evaluationToProofScore(cs.percentage);

      records.push({
        id: generateId(),
        proofType,
        capabilityId,
        skillId: "",
        topicId: "",
        state: "completed",
        score,
        artifactRef: `evaluation:${evaluation.sessionId}`,
        submittedAt: evaluation.completedAt,
        completedAt: evaluation.completedAt,
        validatedAt: null,
        attemptCount: 1
      });
    }

    return records;
  }

  buildReadinessSnapshot(evaluations: InterviewEvaluationResult[]): InterviewReadinessSnapshot {
    const dsaScores = evaluations
      .filter((e) => e.sessionType === "dsa")
      .map((e) => e.percentage);
    const lldScores = evaluations
      .filter((e) => e.sessionType === "lld")
      .map((e) => e.percentage);
    const hldScores = evaluations
      .filter((e) => e.sessionType === "hld" || e.sessionType === "mixed-architect")
      .map((e) => e.percentage);
    const behavioralScores = evaluations
      .filter((e) => e.sessionType === "behavioral")
      .map((e) => e.percentage);

    const dsaInterviewScore = dsaScores.length > 0
      ? Math.round(dsaScores.reduce((a, b) => a + b, 0) / dsaScores.length)
      : 0;
    const lldInterviewScore = lldScores.length > 0
      ? Math.round(lldScores.reduce((a, b) => a + b, 0) / lldScores.length)
      : 0;
    const hldInterviewScore = hldScores.length > 0
      ? Math.round(hldScores.reduce((a, b) => a + b, 0) / hldScores.length)
      : 0;
    const behavioralInterviewScore = behavioralScores.length > 0
      ? Math.round(behavioralScores.reduce((a, b) => a + b, 0) / behavioralScores.length)
      : 0;

    const overallInterviewReadiness = Math.round(
      (dsaInterviewScore * 0.25 +
        lldInterviewScore * 0.2 +
        hldInterviewScore * 0.3 +
        behavioralInterviewScore * 0.25)
    );

    const weakCategories: InterviewCategory[] = [];
    if (dsaInterviewScore < 60) weakCategories.push("dsa");
    if (lldInterviewScore < 60) weakCategories.push("lld");
    if (hldInterviewScore < 60) weakCategories.push("hld");
    if (behavioralInterviewScore < 60) weakCategories.push("behavioral");

    const recommendedPracticeAreas: string[] = [];
    if (dsaInterviewScore < 60) recommendedPracticeAreas.push("DSA problem-solving — focus on arrays, strings, and dynamic programming");
    if (lldInterviewScore < 60) recommendedPracticeAreas.push("Low-level design — practice class design and design patterns");
    if (hldInterviewScore < 60) recommendedPracticeAreas.push("System design — practice scalability, tradeoffs, and reliability");
    if (behavioralInterviewScore < 60) recommendedPracticeAreas.push("Behavioral storytelling — strengthen STAR structure and impact articulation");

    return {
      dsaInterviewScore,
      lldInterviewScore,
      hldInterviewScore,
      behavioralInterviewScore,
      overallInterviewReadiness,
      recentEvaluationIds: evaluations.map((e) => e.sessionId),
      weakCategories,
      recommendedPracticeAreas
    };
  }

  private categoryToProofType(category: InterviewCategory): InterviewProofType | null {
    switch (category) {
      case "dsa":
      case "problem-solving":
        return "dsa-interview";
      case "lld":
        return "lld-interview";
      case "hld":
      case "system-design":
      case "aws":
        return "hld-interview";
      case "behavioral":
      case "leadership":
      case "resume-deep-dive":
      case "project-deep-dive":
        return "behavioral-interview";
    }
  }

  private categoryToCapabilityId(category: InterviewCategory): string | null {
    switch (category) {
      case "dsa":
      case "problem-solving":
        return "cap-dsa-problem-solving";
      case "lld":
        return "cap-low-level-design";
      case "hld":
      case "system-design":
        return "cap-system-design-hld";
      case "aws":
        return "cap-aws-cloud-architecture";
      case "behavioral":
        return "cap-behavioral-communication";
      case "leadership":
        return "cap-technical-leadership";
      case "resume-deep-dive":
      case "project-deep-dive":
        return "cap-career-assets";
    }
  }

  private evaluationToProofScore(percentage: number): 0 | 1 | 2 | 3 | 4 | 5 {
    if (percentage >= 90) return 5;
    if (percentage >= 75) return 4;
    if (percentage >= 50) return 3;
    if (percentage >= 30) return 2;
    if (percentage >= 10) return 1;
    return 0;
  }
}

export const founderBetaInterviewReadinessIntegration = new InterviewReadinessIntegrationService();
