import type { AuthService } from "@/lib/auth";
import type { LearnerPreferencesRepository } from "@/lib/repositories/learner-preferences-repository";
import { defaultLearningPreferences, type LearningPreferences } from "@/types/learning-preferences";

export type LearnerState = {
  userId: string;
  isAuthenticated: boolean;
  preferences: LearningPreferences;
  preferenceSource: "repository" | "fallback";
};

export class LearnerStateService {
  constructor(
    private readonly authService: AuthService,
    private readonly learnerPreferencesRepository: LearnerPreferencesRepository
  ) {}

  async getLearnerState(fallbackPreferences: LearningPreferences = defaultLearningPreferences): Promise<LearnerState> {
    const user = await this.authService.getCurrentUser();
    const userId = user?.id ?? "anonymous-local-user";
    const storedPreferences = await this.learnerPreferencesRepository.getPreferences(userId);

    return {
      userId,
      isAuthenticated: await this.authService.isAuthenticated(),
      preferences: storedPreferences ?? fallbackPreferences,
      preferenceSource: storedPreferences ? "repository" : "fallback"
    };
  }

  async savePreferences(preferences: LearningPreferences): Promise<LearningPreferences> {
    const user = await this.authService.getCurrentUser();
    const userId = user?.id ?? "anonymous-local-user";
    return this.learnerPreferencesRepository.savePreferences(userId, preferences);
  }
}
