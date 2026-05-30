import type { RevisionQueueItem } from "@/types/progress";

export interface RevisionQueueRepository {
  getRevisionQueue(): Promise<RevisionQueueItem[]>;
  updateRevisionQueue(items: RevisionQueueItem[]): Promise<RevisionQueueItem[]>;
  markRevisionItemComplete(itemId: string): Promise<RevisionQueueItem | null>;
  deferRevisionItem(itemId: string, nextReviewAt: string): Promise<RevisionQueueItem | null>;
}
