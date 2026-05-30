import type { Subtopic } from "@/types/subtopic";
import { topics } from "@/data/topics";

export const subtopics: Subtopic[] = topics.map((topic) => ({
  id: `subtopic-${topic.id}-core`,
  topicId: topic.id,
  title: `${topic.title} Core Mechanics`,
  slug: `${topic.slug}-core-mechanics`,
  summary: `Core mechanics and mental model for ${topic.title}.`,
  order: 1,
  theory: `Understand ${topic.title} through definition, behavior, examples, and trade-offs.`,
  examples: topic.codeExamples,
  practiceTaskIds: [`task-${topic.id}-core`],
  completionCriteria: ["Can explain the mechanic", "Can solve the core practice task"]
}));
