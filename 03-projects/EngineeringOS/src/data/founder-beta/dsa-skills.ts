import type { Skill } from "@/types/founder-beta";

const dsaSkill = (
  id: string,
  name: string,
  description: string,
  topicIds: string[],
  proofTypes: Skill["proofTypes"]
): Skill => ({
  id,
  name,
  capabilityId: "cap-dsa-problem-solving",
  description,
  topicIds,
  proofTypes
});

export const dsaSkills: Skill[] = [
  dsaSkill(
    "skill-dsa-complexity-analysis",
    "Complexity Analysis",
    "Analyze time and space complexity of algorithms and data structures.",
    ["topic-dsa-complexity-analysis", "topic-dsa-big-o-notation", "topic-dsa-time-complexity", "topic-dsa-space-complexity"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-array-techniques",
    "Array Techniques",
    "Solve array manipulation patterns including prefix sums, in-place modifications, and traversal.",
    ["topic-dsa-array-two-sum", "topic-dsa-array-maximum-subarray", "topic-dsa-array-product-except-self", "topic-dsa-array-rotate-array", "topic-dsa-array-move-zeroes", "topic-dsa-array-next-permutation", "topic-dsa-array-merge-intervals", "topic-dsa-array-best-time-stock"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-string-techniques",
    "String Techniques",
    "Solve string manipulation patterns including palindromes, anagrams, and substring problems.",
    ["topic-dsa-string-valid-palindrome", "topic-dsa-string-longest-substring", "topic-dsa-string-group-anagrams", "topic-dsa-string-longest-palindrome", "topic-dsa-string-reverse-words"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-hashing-techniques",
    "Hashing Techniques",
    "Apply hash map and hash set patterns for lookup, counting, and sequence problems.",
    ["topic-dsa-hash-two-sum", "topic-dsa-hash-group-anagrams", "topic-dsa-hash-longest-consecutive", "topic-dsa-hash-subarray-sum"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-two-pointer-techniques",
    "Two Pointer Techniques",
    "Use two-pointer patterns for sorted arrays, partitioning, and comparison problems.",
    ["topic-dsa-two-pointer-container-water", "topic-dsa-two-pointer-three-sum", "topic-dsa-two-pointer-trapping-rain"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-sliding-window-techniques",
    "Sliding Window Techniques",
    "Apply fixed and variable-size sliding window patterns for substring and subarray problems.",
    ["topic-dsa-sliding-maximum", "topic-dsa-sliding-minimum-window", "topic-dsa-sliding-longest-repeating"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-binary-search-techniques",
    "Binary Search Techniques",
    "Apply binary search to sorted arrays, rotated arrays, and search-space problems.",
    ["topic-dsa-binary-search-basic", "topic-dsa-binary-search-first-last", "topic-dsa-binary-search-rotated", "topic-dsa-binary-search-median"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-linked-list-techniques",
    "Linked List Techniques",
    "Solve linked list problems including reversal, cycle detection, merging, and fast-slow pointers.",
    ["topic-dsa-linked-list-reverse", "topic-dsa-linked-list-cycle", "topic-dsa-linked-list-merge-sorted", "topic-dsa-linked-list-middle", "topic-dsa-linked-list-remove-nth"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-stack-techniques",
    "Stack Techniques",
    "Apply stack patterns for parentheses, monotonic stacks, and parsing problems.",
    ["topic-dsa-stack-valid-parentheses", "topic-dsa-stack-min-stack", "topic-dsa-stack-next-greater", "topic-dsa-stack-daily-temperatures"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-queue-techniques",
    "Queue Techniques",
    "Apply queue patterns including implementation, BFS, and sliding window problems.",
    ["topic-dsa-queue-implement", "topic-dsa-queue-sliding-window"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-sorting-techniques",
    "Sorting Algorithms",
    "Understand and implement sorting algorithms including quicksort, mergesort, and basic sorts.",
    ["topic-dsa-sorting-quicksort", "topic-dsa-sorting-mergesort", "topic-dsa-sorting-basic"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-recursion-techniques",
    "Recursion Techniques",
    "Apply recursive thinking patterns for divide-and-conquer and tree-based problems.",
    ["topic-dsa-recursion-basics", "topic-dsa-recursion-fibonacci"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-tree-techniques",
    "Tree Techniques",
    "Solve binary tree problems including traversals, depth, diameter, LCA, and serialization.",
    ["topic-dsa-tree-traversal", "topic-dsa-tree-max-depth", "topic-dsa-tree-balanced", "topic-dsa-tree-diameter", "topic-dsa-tree-lca", "topic-dsa-tree-level-order", "topic-dsa-tree-serialize"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-bst-techniques",
    "BST Techniques",
    "Solve binary search tree problems including validation, search, and construction.",
    ["topic-dsa-bst-validate", "topic-dsa-bst-kth-smallest", "topic-dsa-bst-array-to-bst"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-heap-techniques",
    "Heap / Priority Queue Techniques",
    "Apply heap patterns for kth-element, top-k, merging, and streaming problems.",
    ["topic-dsa-heap-kth-largest", "topic-dsa-heap-top-k-frequent", "topic-dsa-heap-merge-k-sorted", "topic-dsa-heap-find-median"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-greedy-techniques",
    "Greedy Techniques",
    "Apply greedy algorithm patterns for scheduling, jumps, and optimization problems.",
    ["topic-dsa-greedy-jump-game", "topic-dsa-greedy-interval-scheduling", "topic-dsa-greedy-gas-station"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-backtracking-techniques",
    "Backtracking Techniques",
    "Apply backtracking patterns for subsets, permutations, combinations, and constraint satisfaction.",
    ["topic-dsa-backtracking-subsets", "topic-dsa-backtracking-permutations", "topic-dsa-backtracking-combinations", "topic-dsa-backtracking-word-search"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-graph-techniques",
    "Graph Techniques",
    "Solve graph problems including BFS, DFS, connectivity, topological sort, and shortest paths.",
    ["topic-dsa-graph-bfs", "topic-dsa-graph-dfs", "topic-dsa-graph-number-islands", "topic-dsa-graph-valid-tree", "topic-dsa-graph-course-schedule", "topic-dsa-graph-alien-dictionary", "topic-dsa-graph-clone-graph"],
    ["coding-solution"]
  ),
  dsaSkill(
    "skill-dsa-dp-techniques",
    "Dynamic Programming Techniques",
    "Apply DP patterns for sequences, grids, knapsack, and optimization problems.",
    ["topic-dsa-dp-climbing-stairs", "topic-dsa-dp-coin-change", "topic-dsa-dp-longest-increasing", "topic-dsa-dp-longest-common", "topic-dsa-dp-knapsack", "topic-dsa-dp-house-robber", "topic-dsa-dp-palindromic-substrings", "topic-dsa-dp-edit-distance", "topic-dsa-dp-max-square", "topic-dsa-dp-word-break"],
    ["coding-solution"]
  )
];
