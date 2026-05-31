import type { LearnerPreferencesRepository } from "@/lib/repositories/learner-preferences-repository";
import type { LearningPreferences } from "@/types/learning-preferences";

const preferencesByUserId = new Map<string, LearningPreferences>();

export class MockLearnerPreferencesRepository implements LearnerPreferencesRepository {
  async getPreferences(userId: string): Promise<LearningPreferences | null> {
    return preferencesByUserId.get(userId) ?? null;
  }

  async savePreferences(userId: string, preferences: LearningPreferences): Promise<LearningPreferences> {
    preferencesByUserId.set(userId, preferences);
    return preferences;
  }

  reset() {
    preferencesByUserId.clear();
  }
}

export const mockLearnerPreferencesRepository = new MockLearnerPreferencesRepository();
