import type { Subtopic } from "@/types/subtopic";

export interface SubtopicRepository {
  getAllSubtopics(): Promise<Subtopic[]>;
  getSubtopicById(id: string): Promise<Subtopic | null>;
  getSubtopicsByTopicId(topicId: string): Promise<Subtopic[]>;
}
