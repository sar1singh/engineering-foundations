import { describe, expect, it } from "vitest";
import {
  mockProgressRepository,
  mockRevisionPromptRepository,
  mockRevisionQueueRepository
} from "@/lib/repositories/mock-support-repositories";
import { RevisionService } from "@/lib/services/revision-service";

describe("RevisionService", () => {
  it("returns persisted revision queue items", async () => {
    const service = new RevisionService(mockRevisionPromptRepository, mockProgressRepository, mockRevisionQueueRepository);

    await service.updateRevisionQueue([
      {
        id: "revision-queue-js-scope",
        userId: "engineeringos-local-user",
        topicId: "js-scope",
        status: "queued",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    const queue = await service.getPersistedRevisionQueue();

    expect(queue.map((item) => item.id)).toContain("revision-queue-js-scope");
  });

  it("safely returns null when completing missing queue items", async () => {
    const service = new RevisionService(mockRevisionPromptRepository, mockProgressRepository, mockRevisionQueueRepository);

    await expect(service.completeRevisionItem("missing")).resolves.toBeNull();
  });
});
