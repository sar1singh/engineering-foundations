import type { ProblemStatement } from "@/types/problem";
import { topics } from "@/data/topics";

export const problemStatements: ProblemStatement[] = topics.map((topic) => {
  const problem: ProblemStatement = {
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
  };

  if (topic.id !== "js-closures") {
    return problem;
  }

  return {
    ...problem,
    title: "Closure Counter Factory",
    slug: "closure-counter-factory",
    statement:
      "Build createCounter(start = 0) so callers can increment, decrement, reset, and read the current value. The implementation must rely on closure state scoped to each factory call.",
    examples: [
      {
        input: "const a = createCounter(); a.increment(); a.increment(); a.current();",
        output: "2",
        explanation: "Both increment calls update the count binding retained by a's closure methods."
      },
      {
        input: "const a = createCounter(); const b = createCounter(10); a.increment(); b.decrement(); [a.current(), b.current()]",
        output: "[1, 9]",
        explanation: "Separate factory calls create separate lexical environments, so a and b do not share count."
      }
    ],
    constraints: [
      "Do not use a global count variable",
      "Do not expose count as a writable public property",
      "reset() must restore the initial start value",
      "Each factory call must create independent state"
    ],
    expectedOutput: "A createCounter implementation plus a short explanation of the retained lexical environment.",
    testCases: [
      {
        input: "createCounter().current()",
        expectedOutput: "0",
        isHidden: false
      },
      {
        input: "createCounter(5).increment()",
        expectedOutput: "6",
        isHidden: false
      },
      {
        input: "two independent counters",
        expectedOutput: "updates do not affect each other",
        isHidden: true
      }
    ]
  };
});
