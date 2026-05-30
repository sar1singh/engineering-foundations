import { describe, expect, it } from "vitest";
import { mockProgressRepository } from "@/lib/repositories/mock-support-repositories";

describe("mockProgressRepository", () => {
  it("marks topics and tasks complete idempotently", async () => {
    await mockProgressRepository.resetLocalProgress();
    await mockProgressRepository.markTopicComplete("js-fundamentals");
    await mockProgressRepository.markTopicComplete("js-fundamentals");
    await mockProgressRepository.markTaskComplete("task-js-fundamentals-core");
    await mockProgressRepository.markTaskComplete("task-js-fundamentals-core");

    const progress = await mockProgressRepository.getCurrentProgress();

    expect(progress.completedTopicIds).toEqual(["js-fundamentals"]);
    expect(progress.completedTaskIds).toEqual(["task-js-fundamentals-core"]);
  });

  it("tracks weak areas and reset state locally", async () => {
    await mockProgressRepository.updateWeakAreas([
      {
        id: "weak-area-js-fundamentals",
        userId: "engineeringos-local-user",
        topicId: "js-fundamentals",
        reason: "Needs review",
        source: "manual",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    expect(await mockProgressRepository.getWeakAreas()).toEqual(["js-fundamentals"]);

    await mockProgressRepository.resetLocalProgress();

    expect(await mockProgressRepository.getWeakAreas()).toEqual([]);
  });
});
