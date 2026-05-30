import { prisma } from "@/lib/db/prisma";
import type { ExplainBackRepository, SaveExplainBackAttemptInput } from "@/lib/repositories/explain-back-repository";
import { ENGINEERINGOS_LOCAL_USER_ID } from "@/lib/repositories/local-user";
import type { ExplainBackAttempt } from "@/types/progress";

function toExplainBackAttempt(record: {
  id: string;
  userId: string;
  topicId: string;
  taskId: string | null;
  answer: string;
  createdAt: Date;
}): ExplainBackAttempt {
  return {
    id: record.id,
    userId: record.userId,
    topicId: record.topicId,
    taskId: record.taskId ?? undefined,
    answer: record.answer,
    createdAt: record.createdAt.toISOString()
  };
}

export const prismaExplainBackRepository: ExplainBackRepository = {
  async saveExplainBackAttempt(input: SaveExplainBackAttemptInput) {
    const record = await prisma.explainBackAttempt.create({
      data: {
        id: `explain-back-${ENGINEERINGOS_LOCAL_USER_ID}-${Date.now()}`,
        userId: ENGINEERINGOS_LOCAL_USER_ID,
        topicId: input.topicId,
        taskId: input.taskId,
        answer: input.answer
      }
    });

    return toExplainBackAttempt(record);
  },
  async getExplainBackAttemptsByTopicId(topicId) {
    const records = await prisma.explainBackAttempt.findMany({
      where: {
        userId: ENGINEERINGOS_LOCAL_USER_ID,
        topicId
      },
      orderBy: { createdAt: "desc" }
    });

    return records.map(toExplainBackAttempt);
  },
  async getLatestExplainBackAttempt(topicId) {
    const record = await prisma.explainBackAttempt.findFirst({
      where: {
        userId: ENGINEERINGOS_LOCAL_USER_ID,
        topicId
      },
      orderBy: { createdAt: "desc" }
    });

    return record ? toExplainBackAttempt(record) : null;
  }
};
