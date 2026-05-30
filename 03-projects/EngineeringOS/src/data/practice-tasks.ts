import type { PracticeTask } from "@/types/practice";
import { topics } from "@/data/topics";

export const practiceTasks: PracticeTask[] = topics.map((topic) => {
  const task: PracticeTask = {
    id: `task-${topic.id}-core`,
    topicId: topic.id,
    subtopicId: `subtopic-${topic.id}-core`,
    title: topic.id === "js-closures" ? "Implement counter with closure" : `Practice ${topic.title}`,
    slug: topic.id === "js-closures" ? "implement-counter-with-closure" : `practice-${topic.slug}`,
    difficulty: topic.difficulty === "expert" ? "hard" : topic.difficulty,
    estimatedMinutes: 30,
    taskType: topic.id.startsWith("system-design") ? "design" : "coding",
    statement: `Complete a focused EngineeringOS practice task for ${topic.title}.`,
    subtasks: [
      {
        id: `subtask-${topic.id}-explain`,
        title: "Explain the approach",
        description: `Describe how ${topic.title} works before solving.`,
        order: 1,
        isRequired: true
      },
      {
        id: `subtask-${topic.id}-implement`,
        title: "Complete the task",
        description: `Apply ${topic.title} in a small implementation or design answer.`,
        order: 2,
        isRequired: true
      }
    ],
    problemStatementId: `problem-${topic.id}-core`,
    starterCode: `function solve() {\n  // Practice ${topic.title}\n}\n`,
    solutionApproach: `Start from the mental model, handle the core case, then check edge cases for ${topic.title}.`,
    hints: ["Restate the inputs and outputs first.", "Name one edge case before coding."],
    edgeCases: ["Empty input", "Unexpected ordering", "Large input"],
    completionCriteria: ["Approach explained", "Core task complete", "Edge case reviewed"]
  };

  if (topic.id !== "js-closures") {
    return task;
  }

  return {
    ...task,
    estimatedMinutes: 45,
    statement:
      "Implement createCounter(start = 0). It should return an object with increment(), decrement(), reset(), and current() methods. The count must be private closure state, not a global variable or public property. Two counters created from separate calls must not share state.",
    subtasks: [
      {
        id: "subtask-js-closures-trace",
        title: "Trace the closure state",
        description: "Write down which variable is captured and why it remains available after createCounter returns.",
        order: 1,
        isRequired: true
      },
      {
        id: "subtask-js-closures-implement",
        title: "Implement the counter factory",
        description: "Return increment, decrement, reset, and current methods that all use the same private count binding.",
        order: 2,
        isRequired: true
      },
      {
        id: "subtask-js-closures-independence",
        title: "Prove independent counters",
        description: "Show that createCounter() and createCounter(10) update separate retained lexical environments.",
        order: 3,
        isRequired: true
      }
    ],
    starterCode:
      "export function createCounter(start = 0) {\n" +
      "  // Keep count private inside this factory.\n" +
      "  // Return increment, decrement, reset, and current methods.\n" +
      "}\n",
    solutionApproach:
      "Declare let count = start inside createCounter, then return methods that read or update count. The returned methods close over the same count binding, while each createCounter call creates a new binding.",
    hints: [
      "The count variable should live inside createCounter, not on the returned object.",
      "Use function calls to prove that two counters have separate retained state.",
      "reset() should restore the original start value, so keep that value in the same lexical environment."
    ],
    edgeCases: [
      "Multiple counters created with different start values",
      "Calling current() before any increment or decrement",
      "Calling reset() after several updates",
      "Avoiding a public count property that callers can mutate directly"
    ],
    completionCriteria: [
      "Counter methods share one private count binding",
      "Separate counters keep independent state",
      "reset() restores the initial start value",
      "Explain-back identifies the retained lexical environment"
    ]
  };
});
