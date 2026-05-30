import type { InterviewQuestion } from "@/types/topic";
import { topics } from "@/data/topics";

export const interviewQuestions: InterviewQuestion[] = topics.map((topic) => ({
  id: `question-${topic.id}-core`,
  topicId: topic.id,
  question:
    topic.id === "js-closures"
      ? "Implement createCounter with closures, then explain why two counters created from separate calls do not share state."
      : `How would you explain ${topic.title}, and where can it fail in production?`,
  answer:
    topic.id === "js-closures"
      ? "Use a local count binding inside createCounter and return methods that close over it. Each createCounter call creates a new lexical environment, so separate counters retain separate count bindings. Mention live bindings and a pitfall such as stale closures or retained memory."
      : `Cover definition, mental model, example, edge case, and production trade-off for ${topic.title}.`,
  level: topic.difficulty === "easy" ? "easy" : "medium"
}));
