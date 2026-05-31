import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const dsaSourceReferences = {
  arrays: [
    {
      id: "reference-arrays-gfg",
      title: "GeeksforGeeks Array Data Structure",
      url: "https://www.geeksforgeeks.org/dsa/array-data-structure/",
      sourceType: "article" as const,
      usage: "Used for array definition, random access, contiguous storage, and interview topic coverage."
    },
    {
      id: "reference-arrays-leetcode",
      title: "LeetCode Array problem list",
      url: "https://leetcode.com/problem-list/array/",
      sourceType: "practice" as const,
      usage: "Practice source for easy, medium, and hard array problems."
    },
    {
      id: "reference-arrays-neetcode",
      title: "NeetCode roadmap",
      url: "https://neetcode.io/roadmap",
      sourceType: "roadmap" as const,
      usage: "Interview-oriented sequencing reference for arrays and hashing practice."
    }
  ],
  strings: [
    {
      id: "reference-strings-gfg",
      title: "GeeksforGeeks String Data Structure",
      url: "https://www.geeksforgeeks.org/dsa/string-data-structure/",
      sourceType: "article" as const,
      usage: "Used for string definition, character-set constraints, immutability notes, and problem families."
    },
    {
      id: "reference-strings-leetcode",
      title: "LeetCode String problem list",
      url: "https://leetcode.com/problem-list/string/",
      sourceType: "practice" as const,
      usage: "Practice source for string problems across difficulty levels."
    }
  ],
  hashing: [
    {
      id: "reference-hashing-gfg",
      title: "GeeksforGeeks Hash Table Data Structure",
      url: "https://www.geeksforgeeks.org/hash-table-data-structure/",
      sourceType: "article" as const,
      usage: "Used for hash table definition, key-value lookup, hash functions, and collision discussion."
    },
    {
      id: "reference-hashing-leetcode",
      title: "LeetCode Hash Table problem list",
      url: "https://leetcode.com/problem-list/hash-table/",
      sourceType: "practice" as const,
      usage: "Practice source for membership, frequency-map, and grouping problems."
    },
    {
      id: "reference-hashing-neetcode",
      title: "NeetCode Arrays and Hashing",
      url: "https://neetcode.io/roadmap",
      sourceType: "roadmap" as const,
      usage: "Interview practice reference for arrays and hashing patterns."
    }
  ],
  stack: [
    {
      id: "reference-stack-gfg",
      title: "GeeksforGeeks Stack Data Structure",
      url: "https://www.geeksforgeeks.org/stack",
      sourceType: "article" as const,
      usage: "Used for LIFO definition, push/pop/peek operations, and stack applications."
    },
    {
      id: "reference-stack-leetcode",
      title: "LeetCode Stack problem list",
      url: "https://leetcode.com/problem-list/stack/",
      sourceType: "practice" as const,
      usage: "Practice source for parentheses, monotonic stack, and expression problems."
    }
  ],
  queue: [
    {
      id: "reference-queue-gfg",
      title: "GeeksforGeeks Queue Data Structure",
      url: "https://www.geeksforgeeks.org/dsa/queue-data-structure/",
      sourceType: "article" as const,
      usage: "Used for FIFO definition, enqueue/dequeue/front operations, and queue applications."
    },
    {
      id: "reference-queue-leetcode",
      title: "LeetCode Queue problem list",
      url: "https://leetcode.com/problem-list/queue/",
      sourceType: "practice" as const,
      usage: "Practice source for BFS-style and queue simulation problems."
    }
  ]
};

const makeDsaTopic = (input: {
  order: number;
  slug: "arrays" | "strings" | "hashing" | "stack" | "queue";
  title: string;
  definition: string;
  mentalModel: string;
  theory: string;
  code: string;
  visual: string;
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
    `${input.title} is part of DSA Phase 1 Foundations. It builds interview speed, pattern recognition, and the vocabulary needed for later two-pointer, sliding-window, tree, graph, and dynamic-programming topics.`,
  mentalModel: input.mentalModel,
  theory: `${input.theory}\n\nVisual model: ${input.visual}`,
  codeExamples: [
    {
      id: `example-dsa-${input.slug}-js`,
      title: `${input.title} JavaScript interview example`,
      language: "javascript",
      code: input.code,
      explanation: `Runnable JavaScript example for the core ${input.title} operation and interview pattern.`,
      runnable: true
    }
  ],
  practiceProblems: input.problems,
  interviewQuestions: input.interviewQuestions,
  commonMistakes: input.commonMistakes,
  productionUseCases: input.productionUseCases,
  revisionPrompts: [
    `Explain ${input.title} in 60 seconds with time and space complexity.`,
    `Draw the visual model for ${input.title}, then solve one easy problem without notes.`,
    `Name one easy, one medium, and one hard ${input.title} problem pattern.`
  ],
  reviewPrompts: [
    {
      id: `review-dsa-${input.slug}-self`,
      reviewerRole: "self",
      prompt: `Review your ${input.title} solution for brute-force vs optimized approach, complexity, and edge cases.`,
      rubric: ["States complexity", "Explains why the data structure fits", "Handles edge cases"]
    },
    {
      id: `review-dsa-${input.slug}-mentor`,
      reviewerRole: "mentor",
      prompt: `Review the learner's ${input.title} answer like an interviewer. Check pattern recognition, dry run quality, and code clarity.`,
      rubric: ["Pattern chosen correctly", "Dry run is clear", "Code is readable", "Trade-off is explained"]
    }
  ],
  references: [
    ...dsaSourceReferences[input.slug],
    {
      id: `reference-dsa-${input.slug}-local-roadmap`,
      title: "EngineeringOS DSA master roadmap",
      url: "00-control/master-roadmap/04-dsa/INDEX.md",
      sourceType: "roadmap",
      usage: "Local source of truth for DSA Phase 1 ordering and pass criteria."
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

export const dsaPhaseOneTopics: SyllabusTopic[] = [
  makeDsaTopic({
    order: 1,
    slug: "arrays",
    title: "Arrays",
    definition: "An array is a linear data structure that stores ordered elements and supports index-based access.",
    mentalModel: "Think of an array as numbered slots in a row. Direct index lookup is fast; inserting in the middle shifts neighbors.",
    visual: "[0] -> [1] -> [2] -> [3], with each index pointing to one value.",
    theory:
      "Arrays are the base structure behind many interview patterns. In JavaScript, arrays are dynamic objects with ordered indices, but the interview model still focuses on indexing, traversal, prefixes, suffixes, frequency counting, and in-place updates. Core operations: read by index, scan, update, append, slice, sort, and use auxiliary arrays for prefix/suffix computations.",
    code:
      "function twoSum(nums, target) {\n" +
      "  const seen = new Map();\n" +
      "  for (let i = 0; i < nums.length; i += 1) {\n" +
      "    const need = target - nums[i];\n" +
      "    if (seen.has(need)) return [seen.get(need), i];\n" +
      "    seen.set(nums[i], i);\n" +
      "  }\n" +
      "  return [];\n" +
      "}\n",
    problems: [
      {
        id: "problem-arrays-easy-two-sum",
        title: "Two Sum",
        difficulty: "easy",
        tags: ["array", "hash-map", "lookup"],
        prompt: "Return indices of two numbers that add to target.",
        starterCode: "function twoSum(nums, target) {\n  // your code\n}\n",
        expectedSignals: ["Uses one-pass lookup", "Explains O(n) time and O(n) space"]
      },
      {
        id: "problem-arrays-medium-product-except-self",
        title: "Product of Array Except Self",
        difficulty: "medium",
        tags: ["array", "prefix", "suffix"],
        prompt: "Return an array where each position is the product of all other positions without division.",
        expectedSignals: ["Uses prefix/suffix products", "Handles zeros"]
      },
      {
        id: "problem-arrays-hard-trapping-rain-water",
        title: "Trapping Rain Water",
        difficulty: "hard",
        tags: ["array", "two-pointers", "prefix-max"],
        prompt: "Compute how much water can be trapped between bars.",
        expectedSignals: ["Explains boundary maxima", "Compares prefix-array and two-pointer approaches"]
      }
    ],
    interviewQuestions: [
      "When is an auxiliary array worth the space?",
      "Explain prefix and suffix arrays using Product of Array Except Self.",
      "What array edge cases do you check before coding?"
    ],
    commonMistakes: ["Skipping empty/single-element cases", "Using nested loops when a map or prefix pass is enough", "Mutating input when not allowed"],
    productionUseCases: ["Batch processing ordered records", "Building prefix metrics", "Representing queues, stacks, heaps, and matrices"]
  }),
  makeDsaTopic({
    order: 2,
    slug: "strings",
    title: "Strings",
    definition: "A string is an ordered sequence of characters used for text, tokens, identifiers, and encoded state.",
    mentalModel: "Treat a string like an array of characters with extra constraints: immutability in JS operations and a limited alphabet in many problems.",
    visual: "\"code\" -> c(0), o(1), d(2), e(3).",
    theory:
      "String interview problems often reduce to character counting, two pointers, substring windows, normalization, or pattern matching. In JavaScript, string operations create new strings, so repeated concatenation and slicing choices can matter. Always identify alphabet size, case sensitivity, Unicode assumptions, and whether order matters.",
    code:
      "function isAnagram(a, b) {\n" +
      "  if (a.length !== b.length) return false;\n" +
      "  const counts = new Map();\n" +
      "  for (const ch of a) counts.set(ch, (counts.get(ch) ?? 0) + 1);\n" +
      "  for (const ch of b) {\n" +
      "    const next = (counts.get(ch) ?? 0) - 1;\n" +
      "    if (next < 0) return false;\n" +
      "    counts.set(ch, next);\n" +
      "  }\n" +
      "  return true;\n" +
      "}\n",
    problems: [
      {
        id: "problem-strings-easy-valid-anagram",
        title: "Valid Anagram",
        difficulty: "easy",
        tags: ["string", "hash-map", "frequency"],
        prompt: "Return whether two strings contain the same characters with the same counts.",
        expectedSignals: ["Uses frequency counts", "Handles length mismatch"]
      },
      {
        id: "problem-strings-medium-longest-substring",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "medium",
        tags: ["string", "sliding-window", "set"],
        prompt: "Find the length of the longest substring without duplicate characters.",
        expectedSignals: ["Uses sliding window", "Moves left pointer correctly"]
      },
      {
        id: "problem-strings-hard-min-window",
        title: "Minimum Window Substring",
        difficulty: "hard",
        tags: ["string", "sliding-window", "frequency"],
        prompt: "Find the smallest substring containing all characters from another string.",
        expectedSignals: ["Maintains required counts", "Shrinks window safely"]
      }
    ],
    interviewQuestions: [
      "When do you use sorting vs frequency maps for string comparison?",
      "What makes substring and subsequence different?",
      "How does alphabet size affect complexity?"
    ],
    commonMistakes: ["Confusing substring with subsequence", "Ignoring case/Unicode assumptions", "Rebuilding strings in a tight loop unnecessarily"],
    productionUseCases: ["Input validation", "Search and autocomplete", "Parsing logs, URLs, and identifiers"]
  }),
  makeDsaTopic({
    order: 3,
    slug: "hashing",
    title: "Hashing",
    definition: "Hashing maps keys to bucket positions so lookup, insert, and delete can be fast on average.",
    mentalModel: "A hash table is a labeled cabinet: compute the drawer from the key, then store or find the value there.",
    visual: "key -> hash(key) -> bucket -> value, with collisions handled by the table implementation.",
    theory:
      "Hashing is the workhorse behind frequency maps, membership sets, grouping, deduplication, and complement lookup. Interview solutions often turn O(n^2) scans into O(n) passes by storing what has already been seen. Discuss average-case O(1), collision caveats, key normalization, and memory trade-offs.",
    code:
      "function groupAnagrams(words) {\n" +
      "  const groups = new Map();\n" +
      "  for (const word of words) {\n" +
      "    const key = word.split('').sort().join('');\n" +
      "    const bucket = groups.get(key) ?? [];\n" +
      "    bucket.push(word);\n" +
      "    groups.set(key, bucket);\n" +
      "  }\n" +
      "  return [...groups.values()];\n" +
      "}\n",
    problems: [
      {
        id: "problem-hashing-easy-contains-duplicate",
        title: "Contains Duplicate",
        difficulty: "easy",
        tags: ["hash-set", "array", "membership"],
        prompt: "Return true if any value appears at least twice.",
        expectedSignals: ["Uses Set", "Explains early return"]
      },
      {
        id: "problem-hashing-medium-group-anagrams",
        title: "Group Anagrams",
        difficulty: "medium",
        tags: ["hash-map", "string", "grouping"],
        prompt: "Group words that are anagrams of each other.",
        expectedSignals: ["Builds stable key", "Explains sort-key vs count-key trade-off"]
      },
      {
        id: "problem-hashing-hard-longest-consecutive",
        title: "Longest Consecutive Sequence",
        difficulty: "hard",
        tags: ["hash-set", "sequence", "array"],
        prompt: "Find the length of the longest consecutive integer sequence in O(n).",
        expectedSignals: ["Starts only at sequence heads", "Avoids sorting"]
      }
    ],
    interviewQuestions: [
      "Why does a hash map often reduce nested loops?",
      "What is the trade-off between sorting and hashing?",
      "What can go wrong with poorly chosen hash keys?"
    ],
    commonMistakes: ["Forgetting to update counts", "Using objects when keys can collide with inherited names", "Claiming worst-case O(1) without caveat"],
    productionUseCases: ["Caching", "Deduplication", "Indexing by ID", "Frequency analytics"]
  }),
  makeDsaTopic({
    order: 4,
    slug: "stack",
    title: "Stack",
    definition: "A stack is a last-in, first-out structure where the newest item is removed first.",
    mentalModel: "A stack is a vertical pile: push onto the top, pop from the top, peek at the top.",
    visual: "top -> [latest] [older] [oldest].",
    theory:
      "Stacks are ideal when the most recent unresolved item matters. They show up in parentheses validation, expression parsing, undo behavior, DFS, monotonic-stack problems, and next-greater-element patterns. In JavaScript, push and pop on the end of an array model stack operations well.",
    code:
      "function isValidParentheses(s) {\n" +
      "  const stack = [];\n" +
      "  const pairs = new Map([[')', '('], [']', '['], ['}', '{']]);\n" +
      "  for (const ch of s) {\n" +
      "    if (!pairs.has(ch)) stack.push(ch);\n" +
      "    else if (stack.pop() !== pairs.get(ch)) return false;\n" +
      "  }\n" +
      "  return stack.length === 0;\n" +
      "}\n",
    problems: [
      {
        id: "problem-stack-easy-valid-parentheses",
        title: "Valid Parentheses",
        difficulty: "easy",
        tags: ["stack", "string"],
        prompt: "Return whether brackets close in the correct order.",
        expectedSignals: ["Uses stack", "Handles unmatched closing brackets"]
      },
      {
        id: "problem-stack-medium-daily-temperatures",
        title: "Daily Temperatures",
        difficulty: "medium",
        tags: ["stack", "monotonic-stack", "array"],
        prompt: "For each day, return how many days until a warmer temperature.",
        expectedSignals: ["Uses monotonic decreasing stack", "Stores indices"]
      },
      {
        id: "problem-stack-hard-largest-rectangle",
        title: "Largest Rectangle in Histogram",
        difficulty: "hard",
        tags: ["stack", "monotonic-stack"],
        prompt: "Find the largest rectangle area in a histogram.",
        expectedSignals: ["Uses sentinel idea", "Explains width when popping"]
      }
    ],
    interviewQuestions: [
      "Why does valid parentheses need a stack?",
      "What makes a stack monotonic?",
      "How do push/pop operations map to recursion?"
    ],
    commonMistakes: ["Using shift instead of pop for stack behavior", "Forgetting leftover open brackets", "Storing values when indices are needed"],
    productionUseCases: ["Undo stacks", "Call stack reasoning", "Parsing expressions", "DFS traversal"]
  }),
  makeDsaTopic({
    order: 5,
    slug: "queue",
    title: "Queue",
    definition: "A queue is a first-in, first-out structure where the oldest item is removed first.",
    mentalModel: "A queue is a line: enqueue at the back, dequeue from the front.",
    visual: "front <- [oldest] [middle] [newest] <- back.",
    theory:
      "Queues are used when work must be processed in arrival order. Interview use cases include BFS, level-order traversal, sliding windows, simulations, and task scheduling. In JavaScript, avoid repeated Array.shift for large queues; track a head index or use a deque abstraction.",
    code:
      "function bfs(start, graph) {\n" +
      "  const queue = [start];\n" +
      "  let head = 0;\n" +
      "  const seen = new Set([start]);\n" +
      "  while (head < queue.length) {\n" +
      "    const node = queue[head];\n" +
      "    head += 1;\n" +
      "    for (const next of graph.get(node) ?? []) {\n" +
      "      if (!seen.has(next)) {\n" +
      "        seen.add(next);\n" +
      "        queue.push(next);\n" +
      "      }\n" +
      "    }\n" +
      "  }\n" +
      "  return seen;\n" +
      "}\n",
    problems: [
      {
        id: "problem-queue-easy-moving-average",
        title: "Moving Average from Data Stream",
        difficulty: "easy",
        tags: ["queue", "stream", "sliding-window"],
        prompt: "Maintain the average of the last k values in a stream.",
        expectedSignals: ["Uses FIFO eviction", "Maintains running sum"]
      },
      {
        id: "problem-queue-medium-rotting-oranges",
        title: "Rotting Oranges",
        difficulty: "medium",
        tags: ["queue", "bfs", "grid"],
        prompt: "Use BFS levels to compute minutes until all reachable oranges rot.",
        expectedSignals: ["Uses multi-source BFS", "Tracks levels/minutes"]
      },
      {
        id: "problem-queue-hard-sliding-window-maximum",
        title: "Sliding Window Maximum",
        difficulty: "hard",
        tags: ["queue", "deque", "monotonic-queue"],
        prompt: "Return the maximum value in every window of size k.",
        expectedSignals: ["Uses monotonic deque", "Evicts stale indices"]
      }
    ],
    interviewQuestions: [
      "Why is BFS naturally queue-based?",
      "Why can Array.shift be problematic in JavaScript queues?",
      "When do you need a monotonic queue instead of a normal queue?"
    ],
    commonMistakes: ["Using stack behavior by accident", "Using Array.shift in large loops", "Not separating BFS levels"],
    productionUseCases: ["Job queues", "Event processing", "Rate limiting windows", "Breadth-first crawling"]
  })
];
