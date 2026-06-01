import { describe, expect, it } from "vitest";

import { prismaLearnerPreferencesRepository } from "@/lib/repositories/prisma-learner-preferences-repository";
import { defaultLearningPreferences } from "@/types/learning-preferences";

describe("prisma learner preferences repository", () => {
  it("exports a repository with read and write methods for Prisma-backed learner preferences", () => {
    expect(prismaLearnerPreferencesRepository.getPreferences).toBeTypeOf("function");
    expect(prismaLearnerPreferencesRepository.savePreferences).toBeTypeOf("function");
    expect({ ...defaultLearningPreferences, targetRole: "staff-principal-engineer" }.targetRole).toBe("staff-principal-engineer");
  });
});
