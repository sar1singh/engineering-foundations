import { mockAuthService } from "@/lib/auth";
import { mockLearnerPreferencesRepository } from "@/lib/repositories/mock-learner-preferences-repository";
import { LearnerStateService } from "@/lib/services/learner-state-service";
import { defaultLearningPreferences, type LearningPreferences } from "@/types/learning-preferences";

const learnerStateService = new LearnerStateService(mockAuthService, mockLearnerPreferencesRepository);

export async function getLearnerProfileApi() {
  return learnerStateService.getLearnerState(defaultLearningPreferences);
}

export async function updateLearnerProfileApi(input: LearningPreferences) {
  const preferences = await learnerStateService.savePreferences(input);
  return learnerStateService.getLearnerState(preferences);
}
