import { prisma } from "@/lib/db/prisma";
import { ENGINEERINGOS_LOCAL_USER_ID } from "@/lib/repositories/local-user";
import { parseJson } from "@/lib/repositories/prisma-mappers";
import type { ProgressRepository } from "@/lib/repositories/progress-repository";
import type { ProgressOperationResult, RevisionQueueItem, UserProgress, UserWeakArea } from "@/types/progress";

const localProgressId = `progress-${ENGINEERINGOS_LOCAL_USER_ID}`;

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

  return {
    id: localProgressId,
    userId: ENGINEERINGOS_LOCAL_USER_ID,
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
  const record = await prisma.userProgress.findUnique({
    where: { userId: ENGINEERINGOS_LOCAL_USER_ID }
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
  const lastActiveDate = now();
  const record = await prisma.userProgress.upsert({
    where: { userId: ENGINEERINGOS_LOCAL_USER_ID },
    create: {
      id: localProgressId,
      userId: ENGINEERINGOS_LOCAL_USER_ID,
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
    const completedTopicIds = Array.from(new Set([...current.completedTopicIds, topicId]));

    await prisma.userTopicProgress.upsert({
      where: {
        userId_topicId: {
          userId: ENGINEERINGOS_LOCAL_USER_ID,
          topicId
        }
      },
      create: {
        id: `topic-progress-${ENGINEERINGOS_LOCAL_USER_ID}-${topicId}`,
        userId: ENGINEERINGOS_LOCAL_USER_ID,
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
    const completedTaskIds = Array.from(new Set([...current.completedTaskIds, taskId]));

    await prisma.userTaskProgress.upsert({
      where: {
        userId_taskId: {
          userId: ENGINEERINGOS_LOCAL_USER_ID,
          taskId
        }
      },
      create: {
        id: `task-progress-${ENGINEERINGOS_LOCAL_USER_ID}-${taskId}`,
        userId: ENGINEERINGOS_LOCAL_USER_ID,
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
    await Promise.all(
      weakAreas.map((weakArea) =>
        prisma.userWeakArea.upsert({
          where: {
            userId_topicId_source: {
              userId: ENGINEERINGOS_LOCAL_USER_ID,
              topicId: weakArea.topicId,
              source: weakArea.source
            }
          },
          create: {
            id: weakArea.id,
            userId: ENGINEERINGOS_LOCAL_USER_ID,
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
    await Promise.all(
      items.map((item) =>
        prisma.revisionQueueItem.upsert({
          where: { id: item.id },
          create: {
            id: item.id,
            userId: ENGINEERINGOS_LOCAL_USER_ID,
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
    await prisma.userTopicProgress.deleteMany({ where: { userId: ENGINEERINGOS_LOCAL_USER_ID } });
    await prisma.userTaskProgress.deleteMany({ where: { userId: ENGINEERINGOS_LOCAL_USER_ID } });
    await prisma.explainBackAttempt.deleteMany({ where: { userId: ENGINEERINGOS_LOCAL_USER_ID } });
    await prisma.aIEvaluationResult.deleteMany({ where: { userId: ENGINEERINGOS_LOCAL_USER_ID } });
    await prisma.revisionQueueItem.deleteMany({ where: { userId: ENGINEERINGOS_LOCAL_USER_ID } });
    await prisma.userWeakArea.deleteMany({ where: { userId: ENGINEERINGOS_LOCAL_USER_ID } });

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
