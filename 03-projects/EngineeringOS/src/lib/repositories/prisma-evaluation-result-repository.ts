import { prisma } from "@/lib/db/prisma";
import type { EvaluationResultRepository, SaveEvaluationResultInput } from "@/lib/repositories/evaluation-result-repository";
import { getRepositoryUserId } from "@/lib/repositories/local-user";
import { parseJson } from "@/lib/repositories/prisma-mappers";
import type { SavedEvaluationResult } from "@/types/progress";

function toSavedEvaluationResult(record: {
  id: string;
  userId: string;
  topicId: string | null;
  taskId: string | null;
  explainBackId: string | null;
  score: number;
  maxScore: number;
  summary: string;
  strengths: string;
  improvements: string;
  evaluationSource: string;
  createdAt: Date;
}): SavedEvaluationResult {
  return {
    id: record.id,
    userId: record.userId,
    topicId: record.topicId ?? undefined,
    taskId: record.taskId ?? undefined,
    explainBackAttemptId: record.explainBackId ?? undefined,
    score: record.score,
    maxScore: record.maxScore,
    summary: record.summary,
    strengths: parseJson<string[]>(record.strengths, []),
    improvements: parseJson<string[]>(record.improvements, []),
    evaluationSource: record.evaluationSource as SavedEvaluationResult["evaluationSource"],
    createdAt: record.createdAt.toISOString()
  };
}

export const prismaEvaluationResultRepository: EvaluationResultRepository = {
  async saveEvaluationResult(input: SaveEvaluationResultInput) {
    const userId = getRepositoryUserId();
    const record = await prisma.aIEvaluationResult.create({
      data: {
        id: `evaluation-${userId}-${Date.now()}`,
        userId,
        topicId: input.topicId,
        taskId: input.taskId,
        explainBackId: input.explainBackAttemptId,
        score: input.score,
        maxScore: input.maxScore,
        summary: input.summary,
        strengths: JSON.stringify(input.strengths),
        improvements: JSON.stringify(input.improvements),
        evaluationSource: input.evaluationSource
      }
    });

    return toSavedEvaluationResult(record);
  },
  async getEvaluationResultsByTopicId(topicId) {
    const userId = getRepositoryUserId();
    const records = await prisma.aIEvaluationResult.findMany({
      where: {
        userId,
        topicId
      },
      orderBy: { createdAt: "desc" }
    });

    return records.map(toSavedEvaluationResult);
  },
  async getEvaluationResultsByTaskId(taskId) {
    const userId = getRepositoryUserId();
    const records = await prisma.aIEvaluationResult.findMany({
      where: {
        userId,
        taskId
      },
      orderBy: { createdAt: "desc" }
    });

    return records.map(toSavedEvaluationResult);
  }
};
