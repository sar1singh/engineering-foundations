import type { LearningPreferences } from "@/types/learning-preferences";
import { defaultLearningPreferences } from "@/types/learning-preferences";

export const learningPreferencesCookieName = "engineeringos_learning_preferences";

export function parseLearningPreferences(value?: string): LearningPreferences {
  if (!value) {
    return defaultLearningPreferences;
  }

  try {
    const parsed = JSON.parse(value) as Partial<LearningPreferences>;
    return {
      targetRole: parsed.targetRole ?? defaultLearningPreferences.targetRole,
      currentLevel: parsed.currentLevel ?? defaultLearningPreferences.currentLevel,
      hoursPerWeek: Number(parsed.hoursPerWeek ?? defaultLearningPreferences.hoursPerWeek),
      deadlineWeeks: Number(parsed.deadlineWeeks ?? defaultLearningPreferences.deadlineWeeks),
      weakAreas: Array.isArray(parsed.weakAreas) ? parsed.weakAreas : defaultLearningPreferences.weakAreas,
      learningMode: parsed.learningMode ?? defaultLearningPreferences.learningMode
    };
  } catch {
    return defaultLearningPreferences;
  }
}

export function serializeLearningPreferences(input: LearningPreferences) {
  return JSON.stringify(input);
}
