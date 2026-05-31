import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const dsaPatternReferences = [
  {
    id: "reference-dsa-structures-neetcode",
    title: "NeetCode roadmap",
    url: "https://neetcode.io/roadmap",
    sourceType: "roadmap" as const,
    usage: "Interview-oriented sequencing reference for DSA structure practice."
  },
  {
    id: "reference-dsa-structures-leetcode",
    title: "LeetCode problem lists",
    url: "https://leetcode.com/problem-list/",
    sourceType: "practice" as const,
    usage: "Practice source for easy, medium, and hard DSA structure problems."
  }
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

export const dsaPhaseThreeTopics: SyllabusTopic[] = [
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
