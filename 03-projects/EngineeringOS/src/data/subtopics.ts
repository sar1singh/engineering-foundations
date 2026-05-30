import type { Subtopic } from "@/types/subtopic";
import { topics } from "@/data/topics";

export const subtopics: Subtopic[] = topics.map((topic) => {
  const subtopic: Subtopic = {
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
  };

  if (topic.id !== "js-closures") {
    return subtopic;
  }

  return {
    ...subtopic,
    title: "Closures Core Mechanics",
    summary: "How JavaScript keeps lexical environments alive for returned or stored functions.",
    theory:
      "To reason about closures, trace three things: where the function was created, which outer variables it reads or writes, and how long the returned or stored function remains reachable. The retained variables behave like live bindings, so changes persist between calls. This makes closures useful for private state and configuration, but it also means callbacks can keep references alive longer than expected.",
    completionCriteria: [
      "Can identify the outer variable captured by a closure",
      "Can explain why repeated calls share retained state",
      "Can explain why separate factory calls do not share retained state"
    ]
  };
});
