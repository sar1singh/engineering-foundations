import type { LearningPreferences } from "@/types/learning-preferences";

export interface LearnerPreferencesRepository {
  getPreferences(userId: string): Promise<LearningPreferences | null>;
  savePreferences(userId: string, preferences: LearningPreferences): Promise<LearningPreferences>;
}
