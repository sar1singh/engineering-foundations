import { describe, expect, it } from "vitest";
import {
  mockEvaluationResultRepository,
  mockExplainBackRepository,
  mockRevisionQueueRepository
} from "@/lib/repositories/mock-support-repositories";

describe("mock persistence repositories", () => {
  it("saves and retrieves explain-back attempts by topic", async () => {
    const attempt = await mockExplainBackRepository.saveExplainBackAttempt({
      topicId: "js-fundamentals",
      answer: "A closure keeps access to its lexical scope."
    });

    const latest = await mockExplainBackRepository.getLatestExplainBackAttempt("js-fundamentals");
    const attempts = await mockExplainBackRepository.getExplainBackAttemptsByTopicId("js-fundamentals");

    expect(latest?.id).toBe(attempt.id);
    expect(attempts.map((item) => item.id)).toContain(attempt.id);
  });

  it("saves and retrieves evaluation results by task", async () => {
    const result = await mockEvaluationResultRepository.saveEvaluationResult({
      taskId: "task-js-fundamentals-core",
      topicId: "js-fundamentals",
      score: 7,
      maxScore: 10,
      summary: "Good self-review.",
      strengths: ["Clear explanation"],
      improvements: ["Add edge cases"],
      evaluationSource: "mock"
    });

    const taskResults = await mockEvaluationResultRepository.getEvaluationResultsByTaskId("task-js-fundamentals-core");

    expect(taskResults.map((item) => item.id)).toContain(result.id);
  });

  it("updates, completes, and defers revision queue items", async () => {
    const [item] = await mockRevisionQueueRepository.updateRevisionQueue([
      {
        id: "queue-js-fundamentals",
        userId: "engineeringos-local-user",
        topicId: "js-fundamentals",
        status: "queued",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    expect(item.status).toBe("queued");

    const completed = await mockRevisionQueueRepository.markRevisionItemComplete(item.id);

    expect(completed?.status).toBe("completed");

    const deferred = await mockRevisionQueueRepository.deferRevisionItem(item.id, new Date().toISOString());

    expect(deferred?.status).toBe("deferred");
  });
});
