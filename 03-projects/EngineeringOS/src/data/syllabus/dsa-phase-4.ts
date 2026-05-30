import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const advancedReferences = [
  {
    id: "reference-dsa-advanced-neetcode",
    title: "NeetCode roadmap",
    url: "https://neetcode.io/roadmap",
    sourceType: "roadmap" as const,
    usage: "Interview-oriented sequencing reference for advanced DSA practice."
  },
  {
    id: "reference-dsa-advanced-leetcode",
    title: "LeetCode problem lists",
    url: "https://leetcode.com/problem-list/",
    sourceType: "practice" as const,
    usage: "Practice source for easy, medium, and hard advanced DSA problems."
  }
];

function makeAdvancedTopic(input: {
  order: number;
  slug: string;
  title: string;
  definition: string;
  mentalModel: string;
  theory: string;
  visual: string;
  code: string;
  problems: SyllabusPracticeProblem[];
  interviewQuestions: string[];
  commonMistakes: string[];
  productionUseCases: string[];
}): SyllabusTopic {
  return {
    id: `syllabus-dsa-${input.slug}`,
    slug: input.slug,
    title: input.title,
    order: input.order,
    sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
    definition: input.definition,
    whyItMatters:
      `${input.title} is part of DSA Phase 4 Advanced. These topics separate pattern memorization from real interview problem solving because they require choosing, proving, and optimizing the strategy.`,
    mentalModel: input.mentalModel,
    theory: `${input.theory}\n\nVisual model: ${input.visual}`,
    codeExamples: [
      {
        id: `example-dsa-${input.slug}-js`,
        title: `${input.title} JavaScript interview example`,
        language: "javascript",
        code: input.code,
        explanation: `Runnable JavaScript example for the ${input.title} advanced pattern.`,
        runnable: true
      }
    ],
    practiceProblems: input.problems,
    interviewQuestions: input.interviewQuestions,
    commonMistakes: input.commonMistakes,
    productionUseCases: input.productionUseCases,
    revisionPrompts: [
      `Explain the decision rule for ${input.title} without code.`,
      `Solve one medium ${input.title} problem and write the invariant or recurrence.`,
      `Name one reason a ${input.title} solution can fail on edge cases.`
    ],
    reviewPrompts: [
      {
        id: `review-dsa-${input.slug}-self`,
        reviewerRole: "self",
        prompt: `Review your ${input.title} solution for strategy choice, proof/invariant, complexity, and edge cases.`,
        rubric: ["Strategy choice is justified", "Invariant or recurrence is explicit", "Complexity is stated", "Edge cases are covered"]
      },
      {
        id: `review-dsa-${input.slug}-mentor`,
        reviewerRole: "mentor",
        prompt: `Review the learner's ${input.title} answer like a senior interviewer. Focus on why the chosen strategy is valid.`,
        rubric: ["Correct pattern selection", "Clear correctness argument", "Readable implementation", "Trade-off is explained"]
      }
    ],
    references: [
      ...advancedReferences,
      {
        id: `reference-dsa-${input.slug}-local-roadmap`,
        title: "EngineeringOS DSA master roadmap",
        url: "00-control/master-roadmap/04-dsa/INDEX.md",
        sourceType: "roadmap",
        usage: "Local source of truth for DSA Phase 4 ordering and pass criteria."
      }
    ],
    progressSignals: [
      "read_definition",
      "read_theory",
      "studied_code_example",
      "ran_code_example",
      "solved_easy_problem",
      "solved_medium_problem",
      "solved_hard_problem",
      "submitted_explain_back",
      "completed_mock_review",
      "scheduled_revision"
    ]
  };
}

export const dsaPhaseFourTopics: SyllabusTopic[] = [
  makeAdvancedTopic({
    order: 15,
    slug: "greedy",
    title: "Greedy",
    definition: "Greedy is an algorithmic strategy that repeatedly takes the locally best valid choice and relies on that choice leading to a globally optimal answer.",
    mentalModel: "At each step, choose what cannot hurt the future. The hard part is proving that the local choice is safe.",
    visual: "state -> safe local choice -> smaller state -> repeat until done.",
    theory:
      "Greedy problems require a choice rule and a correctness argument. Common proof styles include exchange arguments, staying-ahead arguments, and sorting by the right key. Greedy is fast when it applies, but dangerous when local choices can block a better future.",
    code:
      "function maxNonOverlappingIntervals(intervals) {\n" +
      "  intervals.sort((a, b) => a[1] - b[1]);\n" +
      "  let count = 0;\n" +
      "  let end = -Infinity;\n" +
      "  for (const [start, finish] of intervals) {\n" +
      "    if (start >= end) {\n" +
      "      count += 1;\n" +
      "      end = finish;\n" +
      "    }\n" +
      "  }\n" +
      "  return count;\n" +
      "}\n",
    problems: [
      {
        id: "problem-greedy-easy-assign-cookies",
        title: "Assign Cookies",
        difficulty: "easy",
        tags: ["greedy", "sorting"],
        prompt: "Maximize satisfied children by assigning cookies greedily.",
        expectedSignals: ["Sorts both arrays", "Uses smallest sufficient cookie"]
      },
      {
        id: "problem-greedy-medium-non-overlap",
        title: "Non-overlapping Intervals",
        difficulty: "medium",
        tags: ["greedy", "intervals", "sorting"],
        prompt: "Remove the minimum number of intervals so the rest do not overlap.",
        expectedSignals: ["Sorts by end time", "Explains safe choice"]
      },
      {
        id: "problem-greedy-hard-candy",
        title: "Candy",
        difficulty: "hard",
        tags: ["greedy", "two-pass"],
        prompt: "Assign minimum candies while respecting neighbor ratings.",
        expectedSignals: ["Uses two directional passes", "Explains local constraints"]
      }
    ],
    interviewQuestions: [
      "How do you prove a greedy choice is safe?",
      "When does sorting reveal the greedy order?",
      "What counterexample would break a naive greedy rule?"
    ],
    commonMistakes: ["Using greedy without proof", "Sorting by the wrong key", "Missing counterexamples where local optimum fails"],
    productionUseCases: ["Scheduling", "Resource allocation", "Interval selection", "Cost minimization heuristics"]
  }),
  makeAdvancedTopic({
    order: 16,
    slug: "backtracking",
    title: "Backtracking",
    definition: "Backtracking explores choices depth-first, undoing each choice when it cannot lead to a valid or better answer.",
    mentalModel: "Walk a decision tree: choose, explore, undo, then try the next branch.",
    visual: "root -> choice A -> deeper choices; backtrack to root -> choice B.",
    theory:
      "Backtracking fits permutations, combinations, subsets, constraint satisfaction, and board/search problems. The essential pieces are current path, remaining choices, base case, pruning rule, and undo step. Good pruning turns exponential search from impossible to interview-manageable.",
    code:
      "function subsets(nums) {\n" +
      "  const result = [];\n" +
      "  const path = [];\n" +
      "  function dfs(index) {\n" +
      "    if (index === nums.length) {\n" +
      "      result.push([...path]);\n" +
      "      return;\n" +
      "    }\n" +
      "    dfs(index + 1);\n" +
      "    path.push(nums[index]);\n" +
      "    dfs(index + 1);\n" +
      "    path.pop();\n" +
      "  }\n" +
      "  dfs(0);\n" +
      "  return result;\n" +
      "}\n",
    problems: [
      {
        id: "problem-backtracking-easy-subsets",
        title: "Subsets",
        difficulty: "easy",
        tags: ["backtracking", "subsets"],
        prompt: "Return all subsets of a list of distinct numbers.",
        expectedSignals: ["Uses include/exclude choices", "Copies path at base case"]
      },
      {
        id: "problem-backtracking-medium-combination-sum",
        title: "Combination Sum",
        difficulty: "medium",
        tags: ["backtracking", "combinations"],
        prompt: "Return all combinations that sum to target, allowing repeated candidates.",
        expectedSignals: ["Tracks remaining target", "Controls candidate index"]
      },
      {
        id: "problem-backtracking-hard-n-queens",
        title: "N-Queens",
        difficulty: "hard",
        tags: ["backtracking", "constraints"],
        prompt: "Place n queens so none attack each other.",
        expectedSignals: ["Tracks columns and diagonals", "Prunes invalid placements"]
      }
    ],
    interviewQuestions: [
      "What is the state in your backtracking recursion?",
      "When do you copy the path?",
      "What pruning rule reduces the search space?"
    ],
    commonMistakes: ["Forgetting to undo path changes", "Pushing the same mutable path reference", "Missing duplicate-handling rules"],
    productionUseCases: ["Constraint solvers", "Search over configurations", "Rule-based generation", "Combinatorial planning"]
  }),
  makeAdvancedTopic({
    order: 17,
    slug: "dynamic-programming",
    title: "Dynamic Programming",
    definition: "Dynamic programming solves problems with overlapping subproblems by storing answers to smaller states and reusing them.",
    mentalModel: "Name the state, define the transition, set base cases, then fill or memoize the state space.",
    visual: "state(i) depends on earlier states; a table/cache prevents recomputation.",
    theory:
      "Dynamic programming fits optimization, counting, and decision problems where the same subproblem appears repeatedly. The interview flow is: identify state, define recurrence, choose top-down memoization or bottom-up tabulation, initialize base cases, and reason about dimensions.",
    code:
      "function climbStairs(n) {\n" +
      "  let one = 1;\n" +
      "  let two = 1;\n" +
      "  for (let step = 2; step <= n; step += 1) {\n" +
      "    const next = one + two;\n" +
      "    two = one;\n" +
      "    one = next;\n" +
      "  }\n" +
      "  return one;\n" +
      "}\n",
    problems: [
      {
        id: "problem-dp-easy-climbing-stairs",
        title: "Climbing Stairs",
        difficulty: "easy",
        tags: ["dynamic-programming", "fibonacci"],
        prompt: "Count ways to climb n stairs taking 1 or 2 steps.",
        expectedSignals: ["Defines recurrence", "Uses O(1) optimized state"]
      },
      {
        id: "problem-dp-medium-house-robber",
        title: "House Robber",
        difficulty: "medium",
        tags: ["dynamic-programming", "array"],
        prompt: "Maximize money robbed without robbing adjacent houses.",
        expectedSignals: ["State is best up to index", "Chooses rob vs skip"]
      },
      {
        id: "problem-dp-hard-edit-distance",
        title: "Edit Distance",
        difficulty: "hard",
        tags: ["dynamic-programming", "strings", "2d-dp"],
        prompt: "Compute minimum edits to convert one word into another.",
        expectedSignals: ["Defines 2D state", "Handles insert/delete/replace transitions"]
      }
    ],
    interviewQuestions: [
      "What is the DP state?",
      "What recurrence connects the state to smaller states?",
      "Can the DP space be optimized?"
    ],
    commonMistakes: ["Starting with code before defining state", "Wrong base cases", "Using greedy where future choices interact"],
    productionUseCases: ["Optimization engines", "Text diffing", "Resource planning", "Recommendation scoring"]
  })
];
