import { prisma } from "@/lib/db/prisma";
import type { LearnerPreferencesRepository } from "@/lib/repositories/learner-preferences-repository";
import { getRepositoryUserId } from "@/lib/repositories/local-user";
import { parseJson } from "@/lib/repositories/prisma-mappers";
import type { LearningPreferences } from "@/types/learning-preferences";

function profileId(userId: string) {
  return `learner-profile-${userId}`;
}

function toPreferences(record: {
  targetRole: string;
  currentLevel: string;
  hoursPerWeek: number;
  deadlineWeeks: number;
  weakAreas: string;
  learningMode: string;
}): LearningPreferences {
  return {
    targetRole: record.targetRole,
    currentLevel: record.currentLevel as LearningPreferences["currentLevel"],
    hoursPerWeek: record.hoursPerWeek,
    deadlineWeeks: record.deadlineWeeks,
    weakAreas: parseJson<string[]>(record.weakAreas, []),
    learningMode: record.learningMode as LearningPreferences["learningMode"]
  };
}

export const prismaLearnerPreferencesRepository: LearnerPreferencesRepository = {
  async getPreferences(userId) {
    getRepositoryUserId();
    const profile = await prisma.learnerProfile.findUnique({ where: { userId } });
    return profile ? toPreferences(profile) : null;
  },

  async savePreferences(userId, preferences) {
    getRepositoryUserId();
    const profile = await prisma.learnerProfile.upsert({
      where: { userId },
      create: {
        id: profileId(userId),
        userId,
        targetRole: preferences.targetRole,
        currentLevel: preferences.currentLevel,
        hoursPerWeek: preferences.hoursPerWeek,
        deadlineWeeks: preferences.deadlineWeeks,
        weakAreas: JSON.stringify(preferences.weakAreas),
        learningMode: preferences.learningMode
      },
      update: {
        targetRole: preferences.targetRole,
        currentLevel: preferences.currentLevel,
        hoursPerWeek: preferences.hoursPerWeek,
        deadlineWeeks: preferences.deadlineWeeks,
        weakAreas: JSON.stringify(preferences.weakAreas),
        learningMode: preferences.learningMode
      }
    });

    return toPreferences(profile);
  }
};
