import type { UserProgress } from "@/types/progress";

export interface ProgressRepository {
  getCurrentProgress(): Promise<UserProgress>;
  getCompletedTopicIds(): Promise<string[]>;
  getCompletedTaskIds(): Promise<string[]>;
  getWeakAreas(): Promise<string[]>;
}
