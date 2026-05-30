import type { ProgressOperationResult, RevisionQueueItem, UserProgress, UserWeakArea } from "@/types/progress";

export interface ProgressRepository {
  getCurrentProgress(): Promise<UserProgress>;
  getProgress(): Promise<UserProgress>;
  getCompletedTopicIds(): Promise<string[]>;
  getCompletedTaskIds(): Promise<string[]>;
  getWeakAreas(): Promise<string[]>;
  markTopicComplete(topicId: string): Promise<ProgressOperationResult>;
  markTaskComplete(taskId: string): Promise<ProgressOperationResult>;
  updateWeakAreas(weakAreas: UserWeakArea[]): Promise<ProgressOperationResult>;
  updateRevisionQueue(items: RevisionQueueItem[]): Promise<ProgressOperationResult>;
  resetLocalProgress(): Promise<ProgressOperationResult>;
}
