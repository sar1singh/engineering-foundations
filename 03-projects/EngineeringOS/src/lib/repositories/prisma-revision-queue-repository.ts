import { prisma } from "@/lib/db/prisma";
import { getRepositoryUserId } from "@/lib/repositories/local-user";
import type { RevisionQueueRepository } from "@/lib/repositories/revision-queue-repository";
import type { RevisionQueueItem } from "@/types/progress";

function toRevisionQueueItem(record: {
  id: string;
  userId: string;
  topicId: string;
  revisionPromptId: string | null;
  status: string;
  nextReviewAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): RevisionQueueItem {
  return {
    id: record.id,
    userId: record.userId,
    topicId: record.topicId,
    revisionPromptId: record.revisionPromptId ?? undefined,
    status: record.status as RevisionQueueItem["status"],
    nextReviewAt: record.nextReviewAt?.toISOString(),
    completedAt: record.completedAt?.toISOString(),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}

export const prismaRevisionQueueRepository: RevisionQueueRepository = {
  async getRevisionQueue() {
    const userId = getRepositoryUserId();
    const records = await prisma.revisionQueueItem.findMany({
      where: { userId },
      orderBy: [{ nextReviewAt: "asc" }, { createdAt: "desc" }]
    });

    return records.map(toRevisionQueueItem);
  },
  async updateRevisionQueue(items) {
    const userId = getRepositoryUserId();
    await Promise.all(
      items.map((item) =>
        prisma.revisionQueueItem.upsert({
          where: { id: item.id },
          create: {
            id: item.id,
            userId,
            topicId: item.topicId,
            revisionPromptId: item.revisionPromptId,
            status: item.status,
            nextReviewAt: item.nextReviewAt ? new Date(item.nextReviewAt) : null,
            completedAt: item.completedAt ? new Date(item.completedAt) : null
          },
          update: {
            status: item.status,
            nextReviewAt: item.nextReviewAt ? new Date(item.nextReviewAt) : null,
            completedAt: item.completedAt ? new Date(item.completedAt) : null
          }
        })
      )
    );

    return this.getRevisionQueue();
  },
  async markRevisionItemComplete(itemId) {
    const userId = getRepositoryUserId();
    const existing = await prisma.revisionQueueItem.findFirst({
      where: {
        id: itemId,
        userId
      }
    });

    if (!existing) {
      return null;
    }

    const record = await prisma.revisionQueueItem.update({
      where: { id: itemId },
      data: {
        status: "completed",
        completedAt: new Date()
      }
    });

    return toRevisionQueueItem(record);
  },
  async deferRevisionItem(itemId, nextReviewAt) {
    const userId = getRepositoryUserId();
    const existing = await prisma.revisionQueueItem.findFirst({
      where: {
        id: itemId,
        userId
      }
    });

    if (!existing) {
      return null;
    }

    const record = await prisma.revisionQueueItem.update({
      where: { id: itemId },
      data: {
        status: "deferred",
        nextReviewAt: new Date(nextReviewAt)
      }
    });

    return toRevisionQueueItem(record);
  }
};
