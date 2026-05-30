import type { PracticeTask } from "@/types/practice";

export interface PracticeRepository {
  getAllTasks(): Promise<PracticeTask[]>;
  getTaskById(id: string): Promise<PracticeTask | null>;
  getTaskBySlug(slug: string): Promise<PracticeTask | null>;
  getTasksByTopicId(topicId: string): Promise<PracticeTask[]>;
  getTasksBySubtopicId(subtopicId: string): Promise<PracticeTask[]>;
}
