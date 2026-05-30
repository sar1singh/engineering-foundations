import type { InterviewQuestion } from "@/types/topic";

export interface InterviewQuestionRepository {
  getQuestionsByTopicId(topicId: string): Promise<InterviewQuestion[]>;
}
