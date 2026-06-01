import { prisma } from "@/lib/db/prisma";
import { getRepositoryUserId } from "@/lib/repositories/local-user";
import { parseJson } from "@/lib/repositories/prisma-mappers";
import type { ProgressRepository } from "@/lib/repositories/progress-repository";
import type { ProgressOperationResult, RevisionQueueItem, UserProgress, UserWeakArea } from "@/types/progress";

function progressId(userId: string) {
  return `progress-${userId}`;
}

function now() {
  return new Date();
}

function toUserProgress(record: {
  id: string;
  userId: string;
  completedTopicIds: string;
  completedTaskIds: string;
  weakAreas: string;
  streakCount: number;
  lastActiveDate: Date | null;
  readinessScore: number;
  interviewReadinessPercent: number;
  createdAt: Date;
  updatedAt: Date;
}): UserProgress {
  return {
    id: record.id,
    userId: record.userId,
    completedTopicIds: parseJson<string[]>(record.completedTopicIds, []),
    completedTaskIds: parseJson<string[]>(record.completedTaskIds, []),
    weakAreas: parseJson<string[]>(record.weakAreas, []),
    streakCount: record.streakCount,
    lastActiveDate: record.lastActiveDate?.toISOString(),
    readinessScore: record.readinessScore,
    interviewReadinessPercent: record.interviewReadinessPercent,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}

function emptyProgress(): UserProgress {
  const createdAt = new Date(0).toISOString();
  const userId = getRepositoryUserId();

  return {
    id: progressId(userId),
    userId,
    completedTopicIds: [],
    completedTaskIds: [],
    weakAreas: [],
    streakCount: 0,
    readinessScore: 0,
    interviewReadinessPercent: 0,
    createdAt,
    updatedAt: createdAt
  };
}

async function getExistingProgress(): Promise<UserProgress> {
  const userId = getRepositoryUserId();
  const record = await prisma.userProgress.findUnique({
    where: { userId }
  });

  return record ? toUserProgress(record) : emptyProgress();
}

async function upsertProgress(input: {
  completedTopicIds?: string[];
  completedTaskIds?: string[];
  weakAreas?: string[];
  streakCount?: number;
  readinessScore?: number;
  interviewReadinessPercent?: number;
}): Promise<UserProgress> {
  const current = await getExistingProgress();
  const userId = getRepositoryUserId();
  const lastActiveDate = now();
  const record = await prisma.userProgress.upsert({
    where: { userId },
    create: {
      id: progressId(userId),
      userId,
      completedTopicIds: JSON.stringify(input.completedTopicIds ?? current.completedTopicIds),
      completedTaskIds: JSON.stringify(input.completedTaskIds ?? current.completedTaskIds),
      weakAreas: JSON.stringify(input.weakAreas ?? current.weakAreas),
      streakCount: input.streakCount ?? current.streakCount,
      lastActiveDate,
      readinessScore: input.readinessScore ?? current.readinessScore,
      interviewReadinessPercent: input.interviewReadinessPercent ?? current.interviewReadinessPercent
    },
    update: {
      completedTopicIds: JSON.stringify(input.completedTopicIds ?? current.completedTopicIds),
      completedTaskIds: JSON.stringify(input.completedTaskIds ?? current.completedTaskIds),
      weakAreas: JSON.stringify(input.weakAreas ?? current.weakAreas),
      streakCount: input.streakCount ?? current.streakCount,
      lastActiveDate,
      readinessScore: input.readinessScore ?? current.readinessScore,
      interviewReadinessPercent: input.interviewReadinessPercent ?? current.interviewReadinessPercent
    }
  });

  return toUserProgress(record);
}

function result(progress: UserProgress, message: string): ProgressOperationResult {
  return {
    ok: true,
    progress,
    message
  };
}

export const prismaProgressRepository: ProgressRepository = {
  async getCurrentProgress() {
    return getExistingProgress();
  },
  async getProgress() {
    return getExistingProgress();
  },
  async getCompletedTopicIds() {
    return (await getExistingProgress()).completedTopicIds;
  },
  async getCompletedTaskIds() {
    return (await getExistingProgress()).completedTaskIds;
  },
  async getWeakAreas() {
    return (await getExistingProgress()).weakAreas;
  },
  async markTopicComplete(topicId) {
    const current = await getExistingProgress();
    const userId = getRepositoryUserId();
    const completedTopicIds = Array.from(new Set([...current.completedTopicIds, topicId]));

    await prisma.userTopicProgress.upsert({
      where: {
          userId_topicId: {
          userId,
          topicId
        }
      },
      create: {
        id: `topic-progress-${userId}-${topicId}`,
        userId,
        topicId,
        status: "completed",
        completedAt: now()
      },
      update: {
        status: "completed",
        completedAt: now()
      }
    });

    return result(await upsertProgress({ completedTopicIds }), `Topic ${topicId} marked complete.`);
  },
  async markTaskComplete(taskId) {
    const current = await getExistingProgress();
    const userId = getRepositoryUserId();
    const completedTaskIds = Array.from(new Set([...current.completedTaskIds, taskId]));

    await prisma.userTaskProgress.upsert({
      where: {
          userId_taskId: {
          userId,
          taskId
        }
      },
      create: {
        id: `task-progress-${userId}-${taskId}`,
        userId,
        taskId,
        status: "completed",
        completedAt: now()
      },
      update: {
        status: "completed",
        completedAt: now()
      }
    });

    return result(await upsertProgress({ completedTaskIds }), `Task ${taskId} marked complete.`);
  },
  async updateWeakAreas(weakAreas: UserWeakArea[]) {
    const userId = getRepositoryUserId();
    await Promise.all(
      weakAreas.map((weakArea) =>
        prisma.userWeakArea.upsert({
          where: {
            userId_topicId_source: {
              userId,
              topicId: weakArea.topicId,
              source: weakArea.source
            }
          },
          create: {
            id: weakArea.id,
            userId,
            topicId: weakArea.topicId,
            reason: weakArea.reason,
            source: weakArea.source,
            isActive: weakArea.isActive
          },
          update: {
            reason: weakArea.reason,
            isActive: weakArea.isActive
          }
        })
      )
    );

    const activeWeakAreas = weakAreas.filter((weakArea) => weakArea.isActive).map((weakArea) => weakArea.topicId);
    return result(await upsertProgress({ weakAreas: activeWeakAreas }), "Weak areas updated.");
  },
  async updateRevisionQueue(items: RevisionQueueItem[]) {
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

    return result(await upsertProgress({}), "Revision queue updated.");
  },
  async resetLocalProgress() {
    const userId = getRepositoryUserId();
    await prisma.userTopicProgress.deleteMany({ where: { userId } });
    await prisma.userTaskProgress.deleteMany({ where: { userId } });
    await prisma.explainBackAttempt.deleteMany({ where: { userId } });
    await prisma.aIEvaluationResult.deleteMany({ where: { userId } });
    await prisma.revisionQueueItem.deleteMany({ where: { userId } });
    await prisma.userWeakArea.deleteMany({ where: { userId } });

    return result(
      await upsertProgress({
        completedTopicIds: [],
        completedTaskIds: [],
        weakAreas: [],
        streakCount: 0,
        readinessScore: 0,
        interviewReadinessPercent: 0
      }),
      "Local progress reset."
    );
  }
};
