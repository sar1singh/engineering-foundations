import type { ProgressRepository } from "@/lib/repositories/progress-repository";
import type { RevisionQueueRepository } from "@/lib/repositories/revision-queue-repository";
import type { RevisionPromptRepository } from "@/lib/repositories/revision-prompt-repository";
import type { RevisionQueueItem } from "@/types/progress";
import type { RevisionPrompt } from "@/types/topic";

export class RevisionService {
  constructor(
    private readonly revisionPromptRepository: RevisionPromptRepository,
    private readonly progressRepository: ProgressRepository,
    private readonly revisionQueueRepository?: RevisionQueueRepository
  ) {}

  async getRevisionQueue(): Promise<RevisionPrompt[]> {
    const weakAreas = await this.progressRepository.getWeakAreas();
    return this.revisionPromptRepository.getPromptsForTopics(weakAreas);
  }

  async getPersistedRevisionQueue(): Promise<RevisionQueueItem[]> {
    return this.revisionQueueRepository?.getRevisionQueue() ?? [];
  }

  async updateRevisionQueue(items: RevisionQueueItem[]): Promise<RevisionQueueItem[]> {
    await this.progressRepository.updateRevisionQueue(items);
    return this.revisionQueueRepository?.updateRevisionQueue(items) ?? items;
  }

  async completeRevisionItem(itemId: string): Promise<RevisionQueueItem | null> {
    return this.revisionQueueRepository?.markRevisionItemComplete(itemId) ?? null;
  }

  async deferRevisionItem(itemId: string, nextReviewAt: string): Promise<RevisionQueueItem | null> {
    return this.revisionQueueRepository?.deferRevisionItem(itemId, nextReviewAt) ?? null;
  }
}
