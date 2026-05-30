import { describe, expect, it } from "vitest";
import { mockPracticeRepository } from "@/lib/repositories/mock-practice-repository";
import { mockProgressRepository } from "@/lib/repositories/mock-support-repositories";
import { mockTopicRepository } from "@/lib/repositories/mock-topic-repository";
import { ProgressSummaryService } from "@/lib/services/progress-summary-service";

describe("ProgressSummaryService", () => {
  it("reflects completed topic and task updates", async () => {
    const service = new ProgressSummaryService(mockProgressRepository, mockTopicRepository, mockPracticeRepository);

    await service.resetLocalProgress();
    await service.markTopicComplete("js-fundamentals");
    await service.markTaskComplete("task-js-fundamentals-core");

    const summary = await service.getProgressSummary();

    expect(summary.completedTopics.map((topic) => topic.id)).toContain("js-fundamentals");
    expect(summary.completedTasks.map((task) => task.id)).toContain("task-js-fundamentals-core");
  });
});
