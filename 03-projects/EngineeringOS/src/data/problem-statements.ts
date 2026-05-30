import type { ProblemStatement } from "@/types/problem";
import { topics } from "@/data/topics";

export const problemStatements: ProblemStatement[] = topics.map((topic) => ({
  id: `problem-${topic.id}-core`,
  title: `${topic.title} Core Problem`,
  slug: `${topic.slug}-core-problem`,
  source: "internal",
  difficulty: topic.difficulty === "expert" ? "hard" : topic.difficulty,
  topicIds: [topic.id],
  statement: `Solve a representative problem that demonstrates ${topic.title}.`,
  examples: [
    {
      input: "core case",
      output: "expected result",
      explanation: `The output follows from the core behavior of ${topic.title}.`
    }
  ],
  constraints: ["Explain assumptions", "Cover at least one edge case"],
  expectedOutput: "A correct implementation or design explanation.",
  testCases: [
    {
      input: "core case",
      expectedOutput: "expected result",
      isHidden: false
    }
  ]
}));
