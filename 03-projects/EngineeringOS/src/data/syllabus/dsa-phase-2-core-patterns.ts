import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const dsaPatternReferences = [
  {
    id: "reference-dsa-patterns-neetcode",
    title: "NeetCode roadmap",
    url: "https://neetcode.io/roadmap",
    sourceType: "roadmap" as const,
    usage: "Interview-oriented sequencing reference for DSA pattern practice."
  },
  {
    id: "reference-dsa-patterns-leetcode",
    title: "LeetCode problem lists",
    url: "https://leetcode.com/problem-list/",
    sourceType: "practice" as const,
    usage: "Practice source for easy, medium, and hard pattern problems."
  }
];

const makeDsaPatternTopic = (input: {
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
}): SyllabusTopic => ({
  id: `syllabus-dsa-${input.slug}`,
  slug: input.slug,
  title: input.title,
  order: input.order,
  sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
  definition: input.definition,
  whyItMatters:
    `${input.title} is part of DSA Phase 2 Core Patterns. It turns foundational arrays, strings, hashing, stacks, and queues into reusable interview strategies.`,
  mentalModel: input.mentalModel,
  theory: `${input.theory}\n\nVisual model: ${input.visual}`,
  codeExamples: [
    {
      id: `example-dsa-${input.slug}-js`,
      title: `${input.title} JavaScript interview example`,
      language: "javascript",
      code: input.code,
      explanation: `Runnable JavaScript example for the ${input.title} pattern.`,
      runnable: true
    }
  ],
  practiceProblems: input.problems,
  interviewQuestions: input.interviewQuestions,
  commonMistakes: input.commonMistakes,
  productionUseCases: input.productionUseCases,
  revisionPrompts: [
    `Explain when to use ${input.title} and when not to use it.`,
    `Draw the pointer/window/range movement for one ${input.title} problem.`,
    `Solve one easy and one medium ${input.title} problem under the DSA pass criteria.`
  ],
  reviewPrompts: [
    {
      id: `review-dsa-${input.slug}-self`,
      reviewerRole: "self",
      prompt: `Review your ${input.title} solution for invariant, movement rule, complexity, and edge cases.`,
      rubric: ["Invariant is explicit", "Movement rule is correct", "Complexity is stated", "Edge cases are covered"]
    },
    {
      id: `review-dsa-${input.slug}-mentor`,
      reviewerRole: "mentor",
      prompt: `Review the learner's ${input.title} answer like an interviewer. Look for pattern recognition and a clean dry run.`,
      rubric: ["Pattern chosen correctly", "Dry run explains state changes", "Code matches the invariant", "Trade-off is explained"]
    }
  ],
  references: [
    ...dsaPatternReferences,
    {
      id: `reference-dsa-${input.slug}-local-roadmap`,
      title: "EngineeringOS DSA master roadmap",
      url: "00-control/master-roadmap/04-dsa/INDEX.md",
      sourceType: "roadmap",
      usage: "Local source of truth for DSA Phase 2 ordering and pass criteria."
    }
  ],
  progressSignals: [
    "read_definition",
    "read_theory",
    "studied_code_example",
    "ran_code_example",
    "solved_easy_problem",
    "solved_medium_problem",
    "submitted_explain_back",
    "completed_mock_review",
    "scheduled_revision"
  ]
});

export const dsaPhaseTwoTopics: SyllabusTopic[] = [
  makeDsaPatternTopic({
    order: 6,
    slug: "two-pointers",
    title: "Two Pointers",
    definition: "Two pointers is a pattern that uses two indexes moving through a sequence to shrink search space or compare positions.",
    mentalModel: "Imagine two fingers on an array. Move the finger that helps restore the invariant or discard impossible answers.",
    visual: "left -> [ ... candidate window ... ] <- right, with one pointer moving after each comparison.",
    theory:
      "Two pointers works when the input order or sorted property lets you discard a side safely. Typical cases include pair sums in sorted arrays, palindrome checks, partitioning, merging, and removing duplicates. The key is naming the invariant: what remains possible between left and right after each move.",
    code:
      "function twoSumSorted(nums, target) {\n" +
      "  let left = 0;\n" +
      "  let right = nums.length - 1;\n" +
      "  while (left < right) {\n" +
      "    const sum = nums[left] + nums[right];\n" +
      "    if (sum === target) return [left, right];\n" +
      "    if (sum < target) left += 1;\n" +
      "    else right -= 1;\n" +
      "  }\n" +
      "  return [];\n" +
      "}\n",
    problems: [
      {
        id: "problem-two-pointers-easy-valid-palindrome",
        title: "Valid Palindrome",
        difficulty: "easy",
        tags: ["two-pointers", "string"],
        prompt: "Return whether a normalized string reads the same from both ends.",
        starterCode: "function isPalindrome(s) {\n  // your code\n}\n",
        expectedSignals: ["Uses left/right pointers", "Skips or normalizes non-alphanumeric characters"]
      },
      {
        id: "problem-two-pointers-medium-three-sum",
        title: "3Sum",
        difficulty: "medium",
        tags: ["two-pointers", "array", "sorting"],
        prompt: "Return unique triplets that sum to zero.",
        expectedSignals: ["Sorts first", "Skips duplicates", "Moves pointers by sum comparison"]
      },
      {
        id: "problem-two-pointers-hard-trapping-rain-water",
        title: "Trapping Rain Water",
        difficulty: "hard",
        tags: ["two-pointers", "array"],
        prompt: "Compute trapped water using left/right boundaries.",
        expectedSignals: ["Tracks max boundaries", "Moves lower boundary pointer"]
      }
    ],
    interviewQuestions: [
      "What condition lets two pointers safely discard one side?",
      "Why does 3Sum usually sort before using two pointers?",
      "How do you avoid duplicate answers?"
    ],
    commonMistakes: ["Using two pointers on unsorted data without a valid invariant", "Forgetting duplicate skipping", "Moving both pointers when only one side should move"],
    productionUseCases: ["Deduping sorted streams", "Merging ordered inputs", "Range validation in ordered data"]
  }),
  makeDsaPatternTopic({
    order: 7,
    slug: "sliding-window",
    title: "Sliding Window",
    definition: "Sliding window maintains a contiguous range while expanding and shrinking it according to a condition.",
    mentalModel: "A window is a movable spotlight over a sequence. Expand to include signal; shrink when the window violates the rule.",
    visual: "[outside] left -> [ active window ] <- right [outside], with tracked state inside.",
    theory:
      "Sliding window fits contiguous subarray or substring problems where you need best length, count, sum, or frequency under a constraint. Fixed windows move both ends together. Variable windows expand right and shrink left until the invariant is restored. The hard part is tracking exactly enough state to know when the window is valid.",
    code:
      "function maxSumFixedWindow(nums, k) {\n" +
      "  let sum = 0;\n" +
      "  let best = -Infinity;\n" +
      "  for (let right = 0; right < nums.length; right += 1) {\n" +
      "    sum += nums[right];\n" +
      "    if (right >= k) sum -= nums[right - k];\n" +
      "    if (right >= k - 1) best = Math.max(best, sum);\n" +
      "  }\n" +
      "  return best;\n" +
      "}\n",
    problems: [
      {
        id: "problem-sliding-window-easy-max-average",
        title: "Maximum Average Subarray I",
        difficulty: "easy",
        tags: ["sliding-window", "array", "fixed-window"],
        prompt: "Find the maximum average over every contiguous window of size k.",
        expectedSignals: ["Uses running sum", "Removes outgoing value"]
      },
      {
        id: "problem-sliding-window-medium-longest-substring",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "medium",
        tags: ["sliding-window", "string", "set"],
        prompt: "Find the longest substring with no repeated characters.",
        expectedSignals: ["Tracks seen chars", "Shrinks until valid"]
      },
      {
        id: "problem-sliding-window-hard-minimum-window",
        title: "Minimum Window Substring",
        difficulty: "hard",
        tags: ["sliding-window", "string", "frequency"],
        prompt: "Find the smallest substring that covers all required characters.",
        expectedSignals: ["Maintains required counts", "Shrinks only while valid"]
      }
    ],
    interviewQuestions: [
      "How do you distinguish fixed and variable sliding windows?",
      "What state must the window maintain?",
      "When should the left pointer move?"
    ],
    commonMistakes: ["Shrinking too early", "Forgetting to remove outgoing state", "Using sliding window when the target range is not contiguous"],
    productionUseCases: ["Rate limiting windows", "Streaming metrics", "Text scanning and analytics"]
  }),
  makeDsaPatternTopic({
    order: 8,
    slug: "prefix-sum",
    title: "Prefix Sum",
    definition: "Prefix sum stores cumulative totals so range sums can be answered by subtracting two prefixes.",
    mentalModel: "Precompute checkpoints. A range total is the distance between two cumulative checkpoints.",
    visual: "prefix[i] = sum before i, so sum(l..r) = prefix[r + 1] - prefix[l].",
    theory:
      "Prefix sum is useful when repeated range totals or subarray-sum conditions would otherwise require repeated scanning. One-dimensional prefix arrays answer static range sums. Prefix plus a hash map solves subarray-sum counting by remembering previously seen cumulative totals. The invariant is that currentPrefix - oldPrefix equals the range sum between them.",
    code:
      "function rangeSumQuery(nums) {\n" +
      "  const prefix = [0];\n" +
      "  for (const num of nums) prefix.push(prefix[prefix.length - 1] + num);\n" +
      "  return function sumRange(left, right) {\n" +
      "    return prefix[right + 1] - prefix[left];\n" +
      "  };\n" +
      "}\n",
    problems: [
      {
        id: "problem-prefix-sum-easy-running-sum",
        title: "Running Sum of 1d Array",
        difficulty: "easy",
        tags: ["prefix-sum", "array"],
        prompt: "Return the running sum at every index.",
        expectedSignals: ["Builds cumulative total", "Explains O(n) time"]
      },
      {
        id: "problem-prefix-sum-medium-subarray-sum-k",
        title: "Subarray Sum Equals K",
        difficulty: "medium",
        tags: ["prefix-sum", "hash-map", "array"],
        prompt: "Count subarrays whose sum equals k.",
        expectedSignals: ["Uses prefix frequencies", "Handles negative numbers"]
      },
      {
        id: "problem-prefix-sum-hard-max-subarray-min-product",
        title: "Maximum Subarray Min-Product",
        difficulty: "hard",
        tags: ["prefix-sum", "stack", "array"],
        prompt: "Use prefix sums with boundaries to evaluate subarray products efficiently.",
        expectedSignals: ["Combines prefix sums with monotonic boundaries", "Explains range sum lookup"]
      }
    ],
    interviewQuestions: [
      "Why does prefix sum turn range queries into O(1)?",
      "Why does Subarray Sum Equals K need a hash map with prefix sums?",
      "How do negative numbers affect sliding window vs prefix sum choices?"
    ],
    commonMistakes: ["Off-by-one errors in prefix indexes", "Using sliding window when negatives break monotonicity", "Forgetting initial prefix 0"],
    productionUseCases: ["Analytics rollups", "Range metrics", "Time-series cumulative counters"]
  }),
  makeDsaPatternTopic({
    order: 9,
    slug: "binary-search",
    title: "Binary Search",
    definition: "Binary search repeatedly halves an ordered search space by using a monotonic condition.",
    mentalModel: "Ask a yes/no question where answers switch once. Move toward the boundary where the answer changes.",
    visual: "low ---- mid ---- high, discard the half that cannot contain the answer.",
    theory:
      "Binary search is not only for finding an element in a sorted array. It applies whenever a monotonic predicate lets you discard half the search space, including answer-space problems like capacity, speed, minimum day, or threshold. The interview-critical skill is defining the predicate and choosing inclusive/exclusive boundaries consistently.",
    code:
      "function lowerBound(nums, target) {\n" +
      "  let left = 0;\n" +
      "  let right = nums.length;\n" +
      "  while (left < right) {\n" +
      "    const mid = Math.floor((left + right) / 2);\n" +
      "    if (nums[mid] < target) left = mid + 1;\n" +
      "    else right = mid;\n" +
      "  }\n" +
      "  return left;\n" +
      "}\n",
    problems: [
      {
        id: "problem-binary-search-easy-search-insert",
        title: "Search Insert Position",
        difficulty: "easy",
        tags: ["binary-search", "array"],
        prompt: "Return the index where target exists or should be inserted in sorted order.",
        expectedSignals: ["Uses lower-bound logic", "Handles target beyond ends"]
      },
      {
        id: "problem-binary-search-medium-search-rotated",
        title: "Search in Rotated Sorted Array",
        difficulty: "medium",
        tags: ["binary-search", "array"],
        prompt: "Find target in a rotated sorted array in O(log n).",
        expectedSignals: ["Identifies sorted half", "Discards invalid half"]
      },
      {
        id: "problem-binary-search-hard-koko",
        title: "Koko Eating Bananas",
        difficulty: "hard",
        tags: ["binary-search", "answer-space"],
        prompt: "Find the minimum eating speed that finishes within h hours.",
        expectedSignals: ["Defines feasible(speed)", "Searches answer space"]
      }
    ],
    interviewQuestions: [
      "What makes a predicate monotonic?",
      "How do you avoid infinite loops in binary search?",
      "When do you binary-search the answer instead of the array?"
    ],
    commonMistakes: ["Mixing inclusive and exclusive boundaries", "Using binary search without monotonicity", "Forgetting to prove which half is impossible"],
    productionUseCases: ["Threshold tuning", "Sorted index lookup", "Capacity planning calculations"]
  })
];
