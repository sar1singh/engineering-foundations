import { enrichedTopicContentBySlug } from "@/data/content/enriched-content";
import type { EnrichedPracticeProblem } from "@/types/enriched-content";
import type { PracticeTask } from "@/types/practice";

type RunnableProblemRef = {
  problemId: string;
  functionName: string;
  assertion: string;
};

const runnableProblemRefs: RunnableProblemRef[] = [
  { problemId: "enriched-hashmap-two-sum-frequency", functionName: "twoSum", assertion: 'JSON.stringify(twoSum([2, 7, 11, 15], 9)) === JSON.stringify([0, 1])' },
  { problemId: "enriched-hashmap-top-k-frequent", functionName: "topKFrequent", assertion: 'JSON.stringify(topKFrequent([1, 1, 1, 2, 2, 3], 2).sort()) === JSON.stringify([1, 2])' },
  { problemId: "enriched-graph-bfs-shortest-path-grid", functionName: "shortestPathGrid", assertion: "shortestPathGrid([[0, 0], [1, 0]]) === 2" },
  { problemId: "enriched-binary-search-min-capacity", functionName: "minShipCapacity", assertion: "minShipCapacity([3, 2, 2, 4, 1, 4], 3) === 6" },
  { problemId: "enriched-dp-coin-change", functionName: "coinChange", assertion: "coinChange([1, 2, 5], 11) === 3" },
  { problemId: "enriched-arrays-strings-product-except-self", functionName: "productExceptSelf", assertion: "JSON.stringify(productExceptSelf([1, 2, 3, 4])) === JSON.stringify([24, 12, 8, 6])" },
  { problemId: "enriched-stack-valid-brackets", functionName: "isValidBrackets", assertion: 'isValidBrackets("([{}])") === true' },
  { problemId: "enriched-queue-rotting-oranges-grid", functionName: "minutesToSpread", assertion: "minutesToSpread([[2,1,1],[1,1,0],[0,1,1]]) === 4" },
  { problemId: "enriched-two-pointers-container-water", functionName: "maxWaterArea", assertion: "maxWaterArea([1,8,6,2,5,4,8,3,7]) === 49" },
  { problemId: "enriched-sliding-window-longest-unique-substring", functionName: "longestUniqueSubstring", assertion: 'longestUniqueSubstring("abcabcbb") === 3' }
];

export const enrichedDsaPracticeTasks: PracticeTask[] = runnableProblemRefs
  .map((ref): PracticeTask | null => {
    const match = findEnrichedProblem(ref.problemId);
    if (!match) return null;
    const { problem, topicSlug } = match;

    return {
      id: `task-runnable-${problem.id}`,
      topicId: `syllabus-${topicSlug}`,
      title: `Runnable DSA: ${problem.title}`,
      slug: `runnable-${problem.id.replace(/^enriched-/, "")}`,
      difficulty: problem.difficulty,
      estimatedMinutes: 45,
      taskType: "coding",
      statement: problem.originalStatement,
      subtasks: [
        {
          id: `subtask-${problem.id}-approach`,
          title: "Explain the pattern",
          description: `Explain why this is a ${problem.pattern} problem before coding.`,
          order: 1,
          isRequired: true
        },
        {
          id: `subtask-${problem.id}-implement`,
          title: "Implement the function",
          description: `Implement ${ref.functionName} and keep the exported function name unchanged so the harness can run.`,
          order: 2,
          isRequired: true
        },
        {
          id: `subtask-${problem.id}-test`,
          title: "Run the harness mentally or locally",
          description: "Use the provided assertions to validate the core case and boundary behavior.",
          order: 3,
          isRequired: true
        }
      ],
      starterCode: toStarterCode(problem.solution),
      solutionCode: problem.solution,
      testHarness: runnableHarness(ref.functionName, ref.assertion),
      sourceProblemId: problem.id,
      solutionApproach: problem.approach.join(" "),
      hints: problem.hints,
      edgeCases: problem.commonMistakes,
      completionCriteria: [
        "Function name and export are unchanged",
        "Provided visible assertions pass",
        "Complexity matches the expected target",
        "Interview narration explains the invariant"
      ]
    };
  })
  .filter((task): task is PracticeTask => task !== null);

function findEnrichedProblem(problemId: string): { problem: EnrichedPracticeProblem; topicSlug: string } | null {
  for (const content of Object.values(enrichedTopicContentBySlug)) {
    const problem = content.enrichedProblems.find((item) => item.id === problemId);
    if (problem) return { problem, topicSlug: content.topicSlug };
  }

  return null;
}

function toStarterCode(solution: string): string {
  return solution.replace(/\{[\s\S]*\}$/, "{\n  // Implement your solution here.\n}\n");
}

function runnableHarness(functionName: string, assertion: string): string {
  return `// Paste below your implementation and run with Node/TS runner.\nconsole.assert(${assertion}, "${functionName} core case");\nconsole.log("visible harness passed");`;
}
