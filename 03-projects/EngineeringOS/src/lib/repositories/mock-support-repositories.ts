import { evaluationRubrics } from "@/data/evaluation-rubrics";
import { interviewQuestions } from "@/data/interview-questions";
import { userProgress } from "@/data/progress";
import { ENGINEERINGOS_LOCAL_USER_ID } from "@/lib/repositories/local-user";
import { revisionPrompts } from "@/data/revision-prompts";
import { subtopics } from "@/data/subtopics";
import type { SaveEvaluationResultInput } from "@/lib/repositories/evaluation-result-repository";
import type { SaveExplainBackAttemptInput } from "@/lib/repositories/explain-back-repository";
import type { EvaluationResultRepository } from "@/lib/repositories/evaluation-result-repository";
import type { EvaluationRubricRepository } from "@/lib/repositories/evaluation-rubric-repository";
import type { ExplainBackRepository } from "@/lib/repositories/explain-back-repository";
import type { InterviewQuestionRepository } from "@/lib/repositories/interview-question-repository";
import type { ProgressRepository } from "@/lib/repositories/progress-repository";
import type { RevisionQueueRepository } from "@/lib/repositories/revision-queue-repository";
import type { RevisionPromptRepository } from "@/lib/repositories/revision-prompt-repository";
import type { SubtopicRepository } from "@/lib/repositories/subtopic-repository";
import type { ExplainBackAttempt, RevisionQueueItem, SavedEvaluationResult, UserProgress } from "@/types/progress";

const mutableProgress: UserProgress = {
  ...userProgress,
  completedTopicIds: [...userProgress.completedTopicIds],
  completedTaskIds: [...userProgress.completedTaskIds],
  weakAreas: [...userProgress.weakAreas]
};

let mockExplainBackAttempts: ExplainBackAttempt[] = [];
let mockEvaluationResults: SavedEvaluationResult[] = [];
let mockRevisionQueueItems: RevisionQueueItem[] = [];

function nowIso() {
  return new Date().toISOString();
}

function completeProgressUpdate(message: string) {
  mutableProgress.updatedAt = nowIso();
  mutableProgress.lastActiveDate = mutableProgress.updatedAt;

  return {
    ok: true,
    progress: mutableProgress,
    message
  };
}

export const mockSubtopicRepository: SubtopicRepository = {
  async getAllSubtopics() {
    return subtopics;
  },
  async getSubtopicById(id) {
    return subtopics.find((subtopic) => subtopic.id === id) ?? null;
  },
  async getSubtopicsByTopicId(topicId) {
    return subtopics.filter((subtopic) => subtopic.topicId === topicId);
  }
};

export const mockInterviewQuestionRepository: InterviewQuestionRepository = {
  async getQuestionsByTopicId(topicId) {
    return interviewQuestions.filter((question) => question.topicId === topicId);
  }
};

export const mockRevisionPromptRepository: RevisionPromptRepository = {
  async getPromptsByTopicId(topicId) {
    return revisionPrompts.filter((prompt) => prompt.topicId === topicId);
  },
  async getPromptsForTopics(topicIds) {
    return revisionPrompts.filter((prompt) => topicIds.includes(prompt.topicId));
  }
};

export const mockEvaluationRubricRepository: EvaluationRubricRepository = {
  async getRubricById(id) {
    return evaluationRubrics.find((rubric) => rubric.id === id) ?? null;
  },
  async getRubricByTopicId(topicId) {
    return evaluationRubrics.find((rubric) => rubric.topicId === topicId) ?? null;
  },
  async getRubricByTaskId(taskId) {
    return evaluationRubrics.find((rubric) => rubric.taskId === taskId) ?? null;
  }
};

export const mockProgressRepository: ProgressRepository = {
  async getCurrentProgress() {
    return mutableProgress;
  },
  async getProgress() {
    return mutableProgress;
  },
  async getCompletedTopicIds() {
    return mutableProgress.completedTopicIds;
  },
  async getCompletedTaskIds() {
    return mutableProgress.completedTaskIds;
  },
  async getWeakAreas() {
    return mutableProgress.weakAreas;
  },
  async markTopicComplete(topicId) {
    if (!mutableProgress.completedTopicIds.includes(topicId)) {
      mutableProgress.completedTopicIds.push(topicId);
    }

    return completeProgressUpdate(`Topic ${topicId} marked complete.`);
  },
  async markTaskComplete(taskId) {
    if (!mutableProgress.completedTaskIds.includes(taskId)) {
      mutableProgress.completedTaskIds.push(taskId);
    }

    return completeProgressUpdate(`Task ${taskId} marked complete.`);
  },
  async updateWeakAreas(weakAreas) {
    mutableProgress.weakAreas = weakAreas.filter((item) => item.isActive).map((item) => item.topicId);
    return completeProgressUpdate("Weak areas updated.");
  },
  async updateRevisionQueue(items) {
    mockRevisionQueueItems = items;
    return completeProgressUpdate("Revision queue updated.");
  },
  async resetLocalProgress() {
    mutableProgress.completedTopicIds = [];
    mutableProgress.completedTaskIds = [];
    mutableProgress.weakAreas = [];
    mutableProgress.streakCount = 0;
    mutableProgress.readinessScore = 0;
    mutableProgress.interviewReadinessPercent = 0;
    mutableProgress.lastActiveDate = nowIso();
    return completeProgressUpdate("Local progress reset.");
  }
};

export const mockExplainBackRepository: ExplainBackRepository = {
  async saveExplainBackAttempt(input: SaveExplainBackAttemptInput) {
    const createdAt = nowIso();
    const attempt: ExplainBackAttempt = {
      id: `mock-explain-back-${mockExplainBackAttempts.length + 1}`,
      userId: ENGINEERINGOS_LOCAL_USER_ID,
      topicId: input.topicId,
      taskId: input.taskId,
      answer: input.answer,
      createdAt
    };

    mockExplainBackAttempts = [attempt, ...mockExplainBackAttempts];
    return attempt;
  },
  async getExplainBackAttemptsByTopicId(topicId) {
    return mockExplainBackAttempts.filter((attempt) => attempt.topicId === topicId);
  },
  async getLatestExplainBackAttempt(topicId) {
    return mockExplainBackAttempts.find((attempt) => attempt.topicId === topicId) ?? null;
  }
};

export const mockEvaluationResultRepository: EvaluationResultRepository = {
  async saveEvaluationResult(input: SaveEvaluationResultInput) {
    const result: SavedEvaluationResult = {
      id: `mock-evaluation-${mockEvaluationResults.length + 1}`,
      userId: ENGINEERINGOS_LOCAL_USER_ID,
      ...input,
      createdAt: nowIso()
    };

    mockEvaluationResults = [result, ...mockEvaluationResults];
    return result;
  },
  async getEvaluationResultsByTopicId(topicId) {
    return mockEvaluationResults.filter((result) => result.topicId === topicId);
  },
  async getEvaluationResultsByTaskId(taskId) {
    return mockEvaluationResults.filter((result) => result.taskId === taskId);
  }
};

export const mockRevisionQueueRepository: RevisionQueueRepository = {
  async getRevisionQueue() {
    return mockRevisionQueueItems;
  },
  async updateRevisionQueue(items) {
    mockRevisionQueueItems = items;
    return mockRevisionQueueItems;
  },
  async markRevisionItemComplete(itemId) {
    const item = mockRevisionQueueItems.find((queueItem) => queueItem.id === itemId);

    if (!item) {
      return null;
    }

    item.status = "completed";
    item.completedAt = nowIso();
    item.updatedAt = item.completedAt;
    return item;
  },
  async deferRevisionItem(itemId, nextReviewAt) {
    const item = mockRevisionQueueItems.find((queueItem) => queueItem.id === itemId);

    if (!item) {
      return null;
    }

    item.status = "deferred";
    item.nextReviewAt = nextReviewAt;
    item.updatedAt = nowIso();
    return item;
  }
};
