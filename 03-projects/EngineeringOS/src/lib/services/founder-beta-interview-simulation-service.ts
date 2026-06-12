import type {
  InterviewSession,
  InterviewSessionType,
  InterviewQuestion,
  InterviewResponse
} from "@/types/founder-beta";
import { founderBetaInterviewQuestions } from "@/data/founder-beta/interview-questions";

const SESSION_TIME_LIMITS: Record<InterviewSessionType, number> = {
  dsa: 45,
  lld: 60,
  hld: 75,
  behavioral: 30,
  "mixed-architect": 90
};

const DEFAULT_QUESTIONS_PER_SESSION: Record<InterviewSessionType, number> = {
  dsa: 3,
  lld: 2,
  hld: 2,
  behavioral: 3,
  "mixed-architect": 3
};

function generateId(): string {
  return `is-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export class InterviewSimulationService {
  createSession(
    sessionType: InterviewSessionType,
    overrides?: {
      id?: string;
      questionIds?: string[];
      timeLimitMinutes?: number;
    }
  ): InterviewSession {
    const questionIds = overrides?.questionIds ?? this.selectQuestions(sessionType);
    const timeLimitMinutes = overrides?.timeLimitMinutes ?? SESSION_TIME_LIMITS[sessionType];

    return {
      id: overrides?.id ?? generateId(),
      sessionType,
      status: "pending",
      questionIds,
      currentQuestionIndex: 0,
      startedAt: null,
      completedAt: null,
      timeLimitMinutes,
      responses: []
    };
  }

  startSession(session: InterviewSession): InterviewSession {
    if (session.status !== "pending") return session;
    return {
      ...session,
      status: "in-progress",
      startedAt: new Date().toISOString()
    };
  }

  addResponse(
    session: InterviewSession,
    questionId: string,
    responseText: string,
    timeSpentSeconds: number
  ): InterviewSession {
    if (session.status !== "in-progress") return session;
    if (!session.questionIds.includes(questionId)) return session;
    if (session.responses.some((r) => r.questionId === questionId)) return session;

    const response: InterviewResponse = {
      questionId,
      responseText,
      timeSpentSeconds,
      submittedAt: new Date().toISOString()
    };

    const nextIndex = session.questionIds.indexOf(questionId) + 1;

    return {
      ...session,
      currentQuestionIndex: Math.min(nextIndex, session.questionIds.length),
      responses: [...session.responses, response]
    };
  }

  completeSession(session: InterviewSession): InterviewSession {
    if (session.status !== "in-progress") return session;
    return {
      ...session,
      status: "completed",
      completedAt: new Date().toISOString()
    };
  }

  timeoutSession(session: InterviewSession): InterviewSession {
    if (session.status !== "in-progress") return session;
    return {
      ...session,
      status: "timed-out",
      completedAt: new Date().toISOString()
    };
  }

  selectQuestions(
    sessionType: InterviewSessionType,
    count?: number,
    difficultyFilter?: "easy" | "medium" | "hard",
    tagFilter?: string[]
  ): string[] {
    const desiredCount = count ?? DEFAULT_QUESTIONS_PER_SESSION[sessionType];
    const pool = this.getQuestionPool(sessionType);
    const filtered = pool.filter((q) => {
      if (difficultyFilter && q.difficulty !== difficultyFilter) return false;
      if (tagFilter && !tagFilter.some((t) => q.tags.includes(t))) return false;
      return true;
    });
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, desiredCount).map((q) => q.id);
  }

  getSessionProgress(session: InterviewSession): {
    totalQuestions: number;
    answeredQuestions: number;
    remainingQuestions: number;
    isComplete: boolean;
    currentQuestionId: string | null;
  } {
    const answeredQuestions = session.responses.length;
    const totalQuestions = session.questionIds.length;
    return {
      totalQuestions,
      answeredQuestions,
      remainingQuestions: totalQuestions - answeredQuestions,
      isComplete: session.status === "completed" || session.status === "timed-out",
      currentQuestionId:
        session.currentQuestionIndex < session.questionIds.length
          ? session.questionIds[session.currentQuestionIndex]
          : null
    };
  }

  private getQuestionPool(sessionType: InterviewSessionType): InterviewQuestion[] {
    switch (sessionType) {
      case "dsa":
        return founderBetaInterviewQuestions.filter(
          (q) => q.category === "dsa" || q.category === "problem-solving"
        );
      case "lld":
        return founderBetaInterviewQuestions.filter((q) => q.category === "lld");
      case "hld":
        return founderBetaInterviewQuestions.filter(
          (q) => q.category === "hld" || q.category === "system-design"
        );
      case "behavioral":
        return founderBetaInterviewQuestions.filter(
          (q) => q.category === "behavioral" || q.category === "leadership"
        );
      case "mixed-architect":
        return founderBetaInterviewQuestions.filter(
          (q) =>
            q.category === "lld" ||
            q.category === "hld" ||
            q.category === "system-design" ||
            q.category === "aws"
        );
    }
  }
}

export const founderBetaInterviewSimulationService = new InterviewSimulationService();
