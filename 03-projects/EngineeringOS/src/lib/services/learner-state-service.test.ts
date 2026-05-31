import { describe, expect, it } from "vitest";

import type { AuthService } from "@/lib/auth";
import { MockLearnerPreferencesRepository } from "@/lib/repositories/mock-learner-preferences-repository";
import { LearnerStateService } from "@/lib/services/learner-state-service";
import { defaultLearningPreferences } from "@/types/learning-preferences";

const authService: AuthService = {
  async getCurrentUser() {
    return { id: "test-user", name: "Test User", role: "local-user" };
  },
  async isAuthenticated() {
    return true;
  },
  async signIn() {
    return { ok: true, user: { id: "test-user", name: "Test User", role: "local-user" }, message: "ok" };
  },
  async signOut() {
    return { ok: true, message: "ok" };
  }
};

describe("LearnerStateService", () => {
  it("uses fallback preferences until repository preferences exist", async () => {
    const repository = new MockLearnerPreferencesRepository();
    const service = new LearnerStateService(authService, repository);
    const state = await service.getLearnerState(defaultLearningPreferences);

    expect(state.preferenceSource).toBe("fallback");
    expect(state.preferences.targetRole).toBe(defaultLearningPreferences.targetRole);
    expect(state.isAuthenticated).toBe(true);
  });

  it("saves and reads learner preferences through the repository boundary", async () => {
    const repository = new MockLearnerPreferencesRepository();
    const service = new LearnerStateService(authService, repository);
    const saved = await service.savePreferences({ ...defaultLearningPreferences, targetRole: "senior-backend-engineer", hoursPerWeek: 12 });
    const state = await service.getLearnerState(defaultLearningPreferences);

    expect(saved.targetRole).toBe("senior-backend-engineer");
    expect(state.preferenceSource).toBe("repository");
    expect(state.preferences.hoursPerWeek).toBe(12);
  });
});
