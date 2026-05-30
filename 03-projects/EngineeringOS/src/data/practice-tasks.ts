import type { PracticeTask } from "@/types/practice";
import { topics } from "@/data/topics";

export const practiceTasks: PracticeTask[] = topics.map((topic) => ({
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
}));
