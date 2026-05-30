import type { MockSyllabusCatalog, SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";
import { dsaPhaseFourTopics } from "@/data/syllabus/dsa-phase-4";

const defaultProgressSignals = [
  "read_definition",
  "read_theory",
  "studied_code_example",
  "submitted_explain_back",
  "scheduled_revision"
] as const;

const basicProblemSet = (topicSlug: string, topicTitle: string): SyllabusPracticeProblem[] => [
  {
    id: `problem-${topicSlug}-easy`,
    title: `${topicTitle} output trace`,
    difficulty: "easy",
    tags: [topicSlug, "output-prediction", "javascript"],
    prompt: `Trace a small JavaScript snippet that demonstrates ${topicTitle}. Explain each line before giving the output.`,
    expectedSignals: ["Can predict output", "Can explain the runtime rule used"]
  },
  {
    id: `problem-${topicSlug}-medium`,
    title: `${topicTitle} implementation drill`,
    difficulty: "medium",
    tags: [topicSlug, "implementation", "javascript"],
    prompt: `Write a small function that uses ${topicTitle} intentionally, then explain one edge case.`,
    expectedSignals: ["Can implement from scratch", "Can name one edge case"]
  }
];

const makeJavaScriptFundamentalTopic = (
  order: number,
  slug: string,
  title: string,
  definition: string,
  mentalModel: string
): SyllabusTopic => ({
  id: `syllabus-js-${slug}`,
  slug,
  title,
  order,
  sourcePath: "00-control/master-roadmap/02-javascript/INDEX.md",
  definition,
  whyItMatters: `${title} is part of the JavaScript fundamentals sequence required to clear deep-dive interviews and reason about backend JavaScript behavior.`,
  mentalModel,
  theory: `Study ${title} through definition, execution behavior, output prediction, one working code example, common mistakes, and an explain-back answer.`,
  codeExamples: [
    {
      id: `example-${slug}-core`,
      title: `${title} minimal example`,
      language: "javascript",
      code: `// ${title}\nconsole.log("${slug}");`,
      explanation: `Replace this with a runnable ${title} example during the topic-depth pass.`,
      runnable: true
    }
  ],
  practiceProblems: basicProblemSet(slug, title),
  interviewQuestions: [
    `Explain ${title} from first principles.`,
    `Show one code example where misunderstanding ${title} changes the output.`
  ],
  commonMistakes: ["Memorizing a rule without tracing execution", "Skipping output prediction practice"],
  productionUseCases: ["Debugging JavaScript behavior", "Reviewing backend Node.js code", "Interview explanation rounds"],
  revisionPrompts: [`Explain ${title} without notes and write one fresh code example.`],
  reviewPrompts: [
    {
      id: `review-${slug}-self`,
      reviewerRole: "self",
      prompt: `Review your ${title} answer for precision, example quality, and missing edge cases.`,
      rubric: ["Definition is precise", "Code example is correct", "Edge case is named"]
    },
    {
      id: `review-${slug}-mock-ai`,
      reviewerRole: "mock-ai-auditor",
      prompt: `Mock-audit the learner response for ${title} using the rubric. Do not call a real AI service.`,
      rubric: ["Flags vague explanations", "Checks code correctness", "Suggests one next practice step"]
    }
  ],
  references: [
    {
      id: `reference-${slug}-roadmap`,
      title: "EngineeringOS JavaScript master roadmap",
      url: "00-control/master-roadmap/02-javascript/INDEX.md",
      sourceType: "roadmap",
      usage: "Local source of truth for the JavaScript fundamentals sequence."
    }
  ],
  progressSignals: [...defaultProgressSignals]
});

const closureTopic: SyllabusTopic = {
  id: "syllabus-js-closures",
  slug: "closures",
  title: "Closures",
  order: 3,
  sourcePath: "00-control/master-roadmap/02-javascript/INDEX.md",
  definition: "A closure is a function that keeps access to variables from its outer lexical scope after that outer function has returned.",
  whyItMatters:
    "Closures power private state, callbacks, memoization, factories, and many interview tasks where state must persist without becoming global.",
  mentalModel:
    "Think of a closure as a function carrying a small backpack of live references to the outer variables it uses.",
  theory:
    "A closure appears when an inner function references variables from an outer lexical environment. The referenced bindings stay reachable as long as the inner function is reachable. Each factory call creates a separate environment, so two counters can keep independent state.",
  codeExamples: [
    {
      id: "example-closures-counter",
      title: "Counter factory",
      language: "javascript",
      code:
        "function createCounter(start = 0) {\n" +
        "  let count = start;\n" +
        "  return {\n" +
        "    increment() {\n" +
        "      count += 1;\n" +
        "      return count;\n" +
        "    },\n" +
        "    current() {\n" +
        "      return count;\n" +
        "    }\n" +
        "  };\n" +
        "}\n",
      explanation: "The returned methods retain access to count, but callers cannot mutate count directly.",
      runnable: true
    }
  ],
  practiceProblems: [
    {
      id: "problem-closures-easy-once",
      title: "Implement once",
      difficulty: "easy",
      tags: ["closures", "state", "functions"],
      prompt: "Implement once(fn), returning a function that calls fn only the first time and returns the first result afterward.",
      starterCode: "function once(fn) {\n  // your code\n}\n",
      expectedSignals: ["Uses private closure state", "Handles repeated calls"]
    },
    {
      id: "problem-closures-medium-memoize",
      title: "Implement memoize",
      difficulty: "medium",
      tags: ["closures", "memoization", "cache"],
      prompt: "Implement memoize(fn) for single-argument functions using a closure-scoped Map.",
      starterCode: "function memoize(fn) {\n  // your code\n}\n",
      expectedSignals: ["Uses closure-scoped cache", "Explains cache key limitations"]
    },
    {
      id: "problem-closures-hard-stale-callback",
      title: "Explain stale callback state",
      difficulty: "hard",
      tags: ["closures", "async", "debugging"],
      prompt: "Given an async callback that reads old state, explain the stale closure and propose a fix.",
      expectedSignals: ["Identifies retained binding", "Explains why callback sees stale data", "Suggests a safer state flow"]
    }
  ],
  interviewQuestions: [
    "Implement createCounter using closure state.",
    "Why do two counters created by the same factory not share state?",
    "What memory issue can closures cause in long-lived callbacks?"
  ],
  commonMistakes: [
    "Saying closures copy values instead of retaining live bindings",
    "Using a global variable for private state",
    "Forgetting that long-lived callbacks can retain large objects"
  ],
  productionUseCases: [
    "Private factory state",
    "Memoization caches",
    "Configured callbacks and middleware",
    "Debugging stale async state"
  ],
  revisionPrompts: [
    "Explain closures using createCounter without notes.",
    "Compare closure state with object instance state.",
    "Name one stale closure bug and one memory-retention risk."
  ],
  reviewPrompts: [
    {
      id: "review-closures-self",
      reviewerRole: "self",
      prompt: "Check whether your closure answer defines lexical scope, retained bindings, and independent factory calls.",
      rubric: ["Definition is accurate", "Counter example works", "Pitfall is concrete"]
    },
    {
      id: "review-closures-mentor",
      reviewerRole: "mentor",
      prompt: "Review the learner's closure solution like a senior interviewer. Focus on correctness, clarity, and edge cases.",
      rubric: ["No global state", "Explains independent counters", "Mentions stale or retained state risk"]
    }
  ],
  references: [
    {
      id: "reference-closures-mdn",
      title: "MDN JavaScript closures guide",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures",
      sourceType: "docs",
      usage: "Primary reference for closure definition, lexical scope, and examples."
    },
    {
      id: "reference-closures-roadmap",
      title: "EngineeringOS JavaScript master roadmap",
      url: "00-control/master-roadmap/02-javascript/INDEX.md",
      sourceType: "roadmap",
      usage: "Local source of truth for ordering closures inside JavaScript fundamentals."
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

const dsaPhaseOneTopics: SyllabusTopic[] = [
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

const dsaPhaseTwoTopics: SyllabusTopic[] = [
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

const makeDsaStructureTopic = (input: {
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
    `${input.title} is part of DSA Phase 3 Structures. These structures expand interview coverage from linear patterns into pointer-heavy, hierarchical, priority-based, prefix-tree, and graph traversal problems.`,
  mentalModel: input.mentalModel,
  theory: `${input.theory}\n\nVisual model: ${input.visual}`,
  codeExamples: [
    {
      id: `example-dsa-${input.slug}-js`,
      title: `${input.title} JavaScript interview example`,
      language: "javascript",
      code: input.code,
      explanation: `Runnable JavaScript example for the ${input.title} structure.`,
      runnable: true
    }
  ],
  practiceProblems: input.problems,
  interviewQuestions: input.interviewQuestions,
  commonMistakes: input.commonMistakes,
  productionUseCases: input.productionUseCases,
  revisionPrompts: [
    `Explain ${input.title} with operations, complexity, and one drawing.`,
    `Solve one easy and one medium ${input.title} problem under the DSA pass criteria.`,
    `Name one bug-prone edge case for ${input.title}.`
  ],
  reviewPrompts: [
    {
      id: `review-dsa-${input.slug}-self`,
      reviewerRole: "self",
      prompt: `Review your ${input.title} solution for structure invariants, traversal state, complexity, and edge cases.`,
      rubric: ["Structure invariant is clear", "Traversal or update state is correct", "Complexity is stated", "Null/empty cases are handled"]
    },
    {
      id: `review-dsa-${input.slug}-mentor`,
      reviewerRole: "mentor",
      prompt: `Review the learner's ${input.title} solution like an interviewer. Focus on state management and correctness under edge cases.`,
      rubric: ["Representation is appropriate", "State transitions are correct", "Edge cases are covered", "Trade-off is explained"]
    }
  ],
  references: [
    ...dsaPatternReferences,
    {
      id: `reference-dsa-${input.slug}-local-roadmap`,
      title: "EngineeringOS DSA master roadmap",
      url: "00-control/master-roadmap/04-dsa/INDEX.md",
      sourceType: "roadmap",
      usage: "Local source of truth for DSA Phase 3 ordering and pass criteria."
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

const dsaPhaseThreeTopics: SyllabusTopic[] = [
  makeDsaStructureTopic({
    order: 10,
    slug: "linked-list",
    title: "Linked List",
    definition: "A linked list is a chain of nodes where each node stores a value and a pointer to the next node.",
    mentalModel: "Think in links, not indexes. You move by following next pointers and update structure by rewiring pointers.",
    visual: "head -> [value|next] -> [value|next] -> null.",
    theory:
      "Linked list problems test pointer discipline. Common patterns include slow/fast pointers, reversal, dummy head nodes, cycle detection, and merging sorted lists. The critical skill is preserving references before rewiring next pointers.",
    code:
      "function reverseList(head) {\n" +
      "  let prev = null;\n" +
      "  let current = head;\n" +
      "  while (current) {\n" +
      "    const next = current.next;\n" +
      "    current.next = prev;\n" +
      "    prev = current;\n" +
      "    current = next;\n" +
      "  }\n" +
      "  return prev;\n" +
      "}\n",
    problems: [
      {
        id: "problem-linked-list-easy-reverse",
        title: "Reverse Linked List",
        difficulty: "easy",
        tags: ["linked-list", "pointers"],
        prompt: "Reverse a singly linked list iteratively.",
        expectedSignals: ["Stores next before rewiring", "Returns new head"]
      },
      {
        id: "problem-linked-list-medium-cycle",
        title: "Linked List Cycle II",
        difficulty: "medium",
        tags: ["linked-list", "slow-fast"],
        prompt: "Detect the node where a cycle begins.",
        expectedSignals: ["Uses slow/fast pointers", "Explains meeting point reset"]
      },
      {
        id: "problem-linked-list-hard-merge-k",
        title: "Merge k Sorted Lists",
        difficulty: "hard",
        tags: ["linked-list", "heap", "divide-and-conquer"],
        prompt: "Merge k sorted linked lists into one sorted list.",
        expectedSignals: ["Compares heap and divide-and-conquer approaches", "Handles empty lists"]
      }
    ],
    interviewQuestions: [
      "Why do linked list reversals need a saved next pointer?",
      "When does a dummy head simplify list code?",
      "How does Floyd cycle detection work?"
    ],
    commonMistakes: ["Losing the rest of the list while rewiring", "Forgetting null head cases", "Returning the old head after reversal"],
    productionUseCases: ["LRU cache internals", "Streaming node chains", "Memory-efficient insert/delete models"]
  }),
  makeDsaStructureTopic({
    order: 11,
    slug: "trees",
    title: "Trees",
    definition: "A tree is a hierarchical structure of nodes connected by parent-child relationships without cycles.",
    mentalModel: "Think recursively: solve the left subtree, solve the right subtree, then combine at the current node.",
    visual: "root branches into children; each child is itself the root of a smaller tree.",
    theory:
      "Tree problems test recursion, DFS, BFS, height/depth reasoning, and state carried across branches. Binary tree interviews often ask for traversal, validation, path sums, lowest common ancestor, and serialization.",
    code:
      "function maxDepth(root) {\n" +
      "  if (!root) return 0;\n" +
      "  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n" +
      "}\n",
    problems: [
      {
        id: "problem-trees-easy-max-depth",
        title: "Maximum Depth of Binary Tree",
        difficulty: "easy",
        tags: ["tree", "dfs", "recursion"],
        prompt: "Return the maximum depth of a binary tree.",
        expectedSignals: ["Uses base case", "Combines left and right depths"]
      },
      {
        id: "problem-trees-medium-validate-bst",
        title: "Validate Binary Search Tree",
        difficulty: "medium",
        tags: ["tree", "dfs", "bst"],
        prompt: "Return whether a binary tree satisfies BST ordering constraints.",
        expectedSignals: ["Carries min/max bounds", "Handles deep invalid nodes"]
      },
      {
        id: "problem-trees-hard-serialize",
        title: "Serialize and Deserialize Binary Tree",
        difficulty: "hard",
        tags: ["tree", "design", "dfs"],
        prompt: "Encode and decode a binary tree.",
        expectedSignals: ["Preserves null markers", "Explains traversal choice"]
      }
    ],
    interviewQuestions: [
      "When do you choose DFS vs BFS for a tree?",
      "Why is local parent comparison insufficient for validating a BST?",
      "What is the base case in a recursive tree problem?"
    ],
    commonMistakes: ["Missing null base cases", "Using only immediate child comparisons for BST validation", "Sharing mutable state across branches accidentally"],
    productionUseCases: ["DOM-like hierarchies", "Org charts", "Nested comments", "Query planners and parsers"]
  }),
  makeDsaStructureTopic({
    order: 12,
    slug: "heap",
    title: "Heap",
    definition: "A heap is a priority-based tree structure where the min or max element can be retrieved efficiently.",
    mentalModel: "A heap is a priority queue: the most urgent item is always at the top, while full sorting is avoided.",
    visual: "top priority at root; children obey heap order but siblings are not globally sorted.",
    theory:
      "Heap problems fit top-k, kth element, merging streams, scheduling, and priority simulation. JavaScript does not include a built-in heap, so interviews often require implementing push/pop or explaining use of a priority queue abstraction.",
    code:
      "class MinHeap {\n" +
      "  constructor() { this.data = []; }\n" +
      "  push(value) {\n" +
      "    this.data.push(value);\n" +
      "    let i = this.data.length - 1;\n" +
      "    while (i > 0) {\n" +
      "      const p = Math.floor((i - 1) / 2);\n" +
      "      if (this.data[p] <= this.data[i]) break;\n" +
      "      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];\n" +
      "      i = p;\n" +
      "    }\n" +
      "  }\n" +
      "}\n",
    problems: [
      {
        id: "problem-heap-easy-last-stone",
        title: "Last Stone Weight",
        difficulty: "easy",
        tags: ["heap", "simulation"],
        prompt: "Repeatedly smash the two heaviest stones and return the final weight.",
        expectedSignals: ["Uses max heap", "Explains repeated priority extraction"]
      },
      {
        id: "problem-heap-medium-top-k",
        title: "Top K Frequent Elements",
        difficulty: "medium",
        tags: ["heap", "hash-map", "top-k"],
        prompt: "Return the k most frequent elements.",
        expectedSignals: ["Builds frequency map", "Compares heap and bucket sort"]
      },
      {
        id: "problem-heap-hard-median-stream",
        title: "Find Median from Data Stream",
        difficulty: "hard",
        tags: ["heap", "stream", "design"],
        prompt: "Maintain the median as numbers arrive.",
        expectedSignals: ["Uses two heaps", "Balances heap sizes"]
      }
    ],
    interviewQuestions: [
      "When is heap better than sorting?",
      "How do push and pop maintain heap order?",
      "Why do median streams use two heaps?"
    ],
    commonMistakes: ["Assuming a heap is fully sorted", "Forgetting to rebalance two heaps", "Using repeated full sort for top-k"],
    productionUseCases: ["Job priority queues", "Schedulers", "Top-k analytics", "Streaming medians"]
  }),
  makeDsaStructureTopic({
    order: 13,
    slug: "trie",
    title: "Trie",
    definition: "A trie is a prefix tree where each path from the root represents characters or tokens in a key.",
    mentalModel: "A trie is a branching autocomplete tree: shared prefixes share nodes.",
    visual: "root -> c -> a -> t and root -> c -> a -> r share the c-a prefix.",
    theory:
      "Trie problems fit prefix lookup, word search, autocomplete, dictionary matching, and replacing words. Each node stores child edges and often a terminal marker. Complexity depends on word length rather than number of stored words for lookup.",
    code:
      "class TrieNode {\n" +
      "  constructor() { this.children = new Map(); this.isWord = false; }\n" +
      "}\n" +
      "class Trie {\n" +
      "  constructor() { this.root = new TrieNode(); }\n" +
      "  insert(word) {\n" +
      "    let node = this.root;\n" +
      "    for (const ch of word) {\n" +
      "      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());\n" +
      "      node = node.children.get(ch);\n" +
      "    }\n" +
      "    node.isWord = true;\n" +
      "  }\n" +
      "}\n",
    problems: [
      {
        id: "problem-trie-easy-implement",
        title: "Implement Trie",
        difficulty: "easy",
        tags: ["trie", "design"],
        prompt: "Implement insert, search, and startsWith.",
        expectedSignals: ["Uses child map", "Tracks terminal words"]
      },
      {
        id: "problem-trie-medium-word-search",
        title: "Word Search II",
        difficulty: "medium",
        tags: ["trie", "backtracking", "grid"],
        prompt: "Find dictionary words in a character grid.",
        expectedSignals: ["Combines trie with DFS", "Prunes invalid prefixes"]
      },
      {
        id: "problem-trie-hard-stream-checker",
        title: "Stream of Characters",
        difficulty: "hard",
        tags: ["trie", "stream", "suffix"],
        prompt: "Answer whether the current character stream ends with any dictionary word.",
        expectedSignals: ["Uses reversed trie", "Limits stream search length"]
      }
    ],
    interviewQuestions: [
      "Why is trie good for prefix search?",
      "What does the terminal marker represent?",
      "When is trie memory usage a concern?"
    ],
    commonMistakes: ["Forgetting isWord markers", "Not pruning DFS paths", "Assuming trie is always more memory efficient than a hash set"],
    productionUseCases: ["Autocomplete", "Dictionary lookup", "Prefix routing", "Search suggestions"]
  }),
  makeDsaStructureTopic({
    order: 14,
    slug: "graphs",
    title: "Graphs",
    definition: "A graph is a set of nodes connected by edges, representing arbitrary relationships.",
    mentalModel: "A graph is a network. Track visited nodes so exploration does not loop forever.",
    visual: "A -- B -- C with edges as relationships; traversal moves along edges.",
    theory:
      "Graph interviews test representation, traversal, cycle detection, connected components, shortest paths, topological ordering, and grid-as-graph modeling. Choose adjacency list, matrix, or implicit neighbors based on input shape. Always define visited state clearly.",
    code:
      "function dfs(start, graph) {\n" +
      "  const visited = new Set();\n" +
      "  function visit(node) {\n" +
      "    if (visited.has(node)) return;\n" +
      "    visited.add(node);\n" +
      "    for (const next of graph.get(node) ?? []) visit(next);\n" +
      "  }\n" +
      "  visit(start);\n" +
      "  return visited;\n" +
      "}\n",
    problems: [
      {
        id: "problem-graphs-easy-find-center",
        title: "Find Center of Star Graph",
        difficulty: "easy",
        tags: ["graph", "degree"],
        prompt: "Find the center node of a star graph.",
        expectedSignals: ["Uses edge inspection", "Explains degree intuition"]
      },
      {
        id: "problem-graphs-medium-number-islands",
        title: "Number of Islands",
        difficulty: "medium",
        tags: ["graph", "dfs", "grid"],
        prompt: "Count connected land components in a grid.",
        expectedSignals: ["Models grid as graph", "Marks visited cells"]
      },
      {
        id: "problem-graphs-hard-word-ladder",
        title: "Word Ladder",
        difficulty: "hard",
        tags: ["graph", "bfs", "shortest-path"],
        prompt: "Find the shortest transformation sequence length between words.",
        expectedSignals: ["Uses BFS for shortest path", "Builds neighbor strategy"]
      }
    ],
    interviewQuestions: [
      "When do you use DFS vs BFS in graphs?",
      "How do you represent a graph from edge lists?",
      "Why does BFS give shortest path in unweighted graphs?"
    ],
    commonMistakes: ["Forgetting visited state", "Mixing directed and undirected edge handling", "Using DFS for shortest path in unweighted graphs without care"],
    productionUseCases: ["Dependency graphs", "Social connections", "Routing", "Workflow state transitions"]
  })
];

export const mockSyllabusCatalog: MockSyllabusCatalog = {
  id: "mock-syllabus-master-roadmap-v1",
  title: "EngineeringOS Master Roadmap Mock Syllabus",
  sourceRoots: ["00-control/master-roadmap", "01-learning"],
  importNotes: [
    "00-control/master-roadmap is available and provides domain ordering plus JavaScript and DSA sequences.",
    "01-learning currently has no importable files in this workspace.",
    "This mock catalog is intentionally local-only and does not change Prisma or production schema."
  ],
  domains: [
    {
      id: "syllabus-domain-javascript",
      slug: "javascript",
      title: "JavaScript",
      order: 2,
      sourcePath: "00-control/master-roadmap/02-javascript/INDEX.md",
      goal: "Clear JS deep-dive rounds and become strong backend JS engineer.",
      modules: [
        {
          id: "syllabus-module-js-fundamentals",
          slug: "javascript-fundamentals",
          title: "Phase 1 Fundamentals",
          order: 1,
          sourcePath: "00-control/master-roadmap/02-javascript/INDEX.md",
          goal: "Explain concept plus code from scratch.",
          topics: [
            makeJavaScriptFundamentalTopic(
              1,
              "scope",
              "Scope",
              "Scope defines where variables are visible and how identifiers resolve in nested JavaScript code.",
              "Read code as nested rooms; inner rooms can look outward, but outer rooms cannot look inward."
            ),
            makeJavaScriptFundamentalTopic(
              2,
              "hoisting",
              "Hoisting",
              "Hoisting describes how declarations are registered before code execution begins.",
              "Separate declaration registration from line-by-line execution."
            ),
            closureTopic,
            makeJavaScriptFundamentalTopic(
              4,
              "this",
              "this",
              "this is a runtime binding determined by call-site rules for normal functions and lexical capture for arrow functions.",
              "Do not ask where the function is written first; ask how it is called."
            ),
            makeJavaScriptFundamentalTopic(
              5,
              "prototype-chain",
              "Prototype Chain",
              "The prototype chain is JavaScript's object delegation path for property lookup.",
              "When a property is missing, JavaScript walks the object's linked prototype chain."
            )
          ]
        }
      ]
    },
    {
      id: "syllabus-domain-dsa",
      slug: "dsa",
      title: "DSA",
      order: 1,
      sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
      goal: "Crack coding rounds with pattern recognition and speed.",
      modules: [
        {
          id: "syllabus-module-dsa-foundations",
          slug: "dsa-foundations",
          title: "Phase 1 Foundations",
          order: 1,
          sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
          goal: "Build easy-problem speed and explain approaches clearly.",
          topics: dsaPhaseOneTopics
        },
        {
          id: "syllabus-module-dsa-core-patterns",
          slug: "dsa-core-patterns",
          title: "Phase 2 Core Patterns",
          order: 2,
          sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
          goal: "Recognize and apply reusable array/string interview patterns under time pressure.",
          topics: dsaPhaseTwoTopics
        },
        {
          id: "syllabus-module-dsa-structures",
          slug: "dsa-structures",
          title: "Phase 3 Structures",
          order: 3,
          sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
          goal: "Master pointer, hierarchical, priority, prefix, and graph structures for coding interviews.",
          topics: dsaPhaseThreeTopics
        },
        {
          id: "syllabus-module-dsa-advanced",
          slug: "dsa-advanced",
          title: "Phase 4 Advanced",
          order: 4,
          sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
          goal: "Choose and justify advanced strategies for optimization, search, and recurrence-heavy problems.",
          topics: dsaPhaseFourTopics
        }
      ]
    }
  ]
};
