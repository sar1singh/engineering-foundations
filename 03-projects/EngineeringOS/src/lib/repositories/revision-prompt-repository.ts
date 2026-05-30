import type { RevisionPrompt } from "@/types/topic";

export interface RevisionPromptRepository {
  getPromptsByTopicId(topicId: string): Promise<RevisionPrompt[]>;
  getPromptsForTopics(topicIds: string[]): Promise<RevisionPrompt[]>;
}
