import type { Topic } from "@/types/topic";

export interface TopicRepository {
  getAllTopics(): Promise<Topic[]>;
  getTopicById(id: string): Promise<Topic | null>;
  getTopicBySlug(slug: string): Promise<Topic | null>;
  getTopicsByModuleId(moduleId: string): Promise<Topic[]>;
  searchTopics(query: string): Promise<Topic[]>;
}
