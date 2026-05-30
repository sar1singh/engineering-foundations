import type { InterviewQuestion } from "@/types/topic";
import { topics } from "@/data/topics";

export const interviewQuestions: InterviewQuestion[] = topics.map((topic) => ({
  id: `question-${topic.id}-core`,
  topicId: topic.id,
  question: `How would you explain ${topic.title}, and where can it fail in production?`,
  answer: `Cover definition, mental model, example, edge case, and production trade-off for ${topic.title}.`,
  level: topic.difficulty === "easy" ? "easy" : "medium"
}));
