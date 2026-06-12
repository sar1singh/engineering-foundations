import type { MasterTopic } from "@/types/founder-beta";

const dsaTopic = (seed: {
  id: string;
  name: string;
  skillId: string;
  sourceIds?: string[];
  prerequisiteTopicIds?: string[];
  relatedTopicIds?: string[];
  estimatedStudyMinutes?: number;
  estimatedPracticeMinutes?: number;
  confidenceScore?: number;
}): MasterTopic => ({
  id: seed.id,
  name: seed.name,
  domainId: "domain-dsa",
  capabilityIds: ["cap-dsa-problem-solving"],
  skillIds: [seed.skillId],
  sourceIds: seed.sourceIds ?? ["leetcode-patterns", "neetcode-roadmap", "geeksforgeeks-dsa", "educative-grokking-coding"],
  prerequisiteTopicIds: seed.prerequisiteTopicIds ?? [],
  relatedTopicIds: seed.relatedTopicIds ?? [],
  successorTopicIds: [],
  alternativeTopicIds: [],
  interviewImportance: "high",
  roadmapPriority: "p1",
  estimatedStudyMinutes: seed.estimatedStudyMinutes ?? 20,
  estimatedPracticeMinutes: seed.estimatedPracticeMinutes ?? 45,
  proofTypes: ["coding-solution"],
  readinessMetrics: ["knowledge", "practice", "interview"],
  missionTypes: ["practice", "interview", "revision"],
  confidenceScore: seed.confidenceScore ?? 0.78
});

export const dsaProblemBank: MasterTopic[] = [
  // Complexity Analysis
  dsaTopic({ id: "topic-dsa-big-o-notation", name: "Big O Notation", skillId: "skill-dsa-complexity-analysis", estimatedStudyMinutes: 30, estimatedPracticeMinutes: 30 }),
  dsaTopic({ id: "topic-dsa-time-complexity", name: "Time Complexity Analysis", skillId: "skill-dsa-complexity-analysis", prerequisiteTopicIds: ["topic-dsa-big-o-notation"] }),
  dsaTopic({ id: "topic-dsa-space-complexity", name: "Space Complexity Analysis", skillId: "skill-dsa-complexity-analysis", prerequisiteTopicIds: ["topic-dsa-big-o-notation"] }),

  // Arrays
  dsaTopic({ id: "topic-dsa-array-two-sum", name: "Two Sum", skillId: "skill-dsa-array-techniques", confidenceScore: 0.9 }),
  dsaTopic({ id: "topic-dsa-array-maximum-subarray", name: "Maximum Subarray", skillId: "skill-dsa-array-techniques" }),
  dsaTopic({ id: "topic-dsa-array-product-except-self", name: "Product of Array Except Self", skillId: "skill-dsa-array-techniques" }),
  dsaTopic({ id: "topic-dsa-array-rotate-array", name: "Rotate Array", skillId: "skill-dsa-array-techniques" }),
  dsaTopic({ id: "topic-dsa-array-move-zeroes", name: "Move Zeroes", skillId: "skill-dsa-array-techniques" }),
  dsaTopic({ id: "topic-dsa-array-next-permutation", name: "Next Permutation", skillId: "skill-dsa-array-techniques" }),
  dsaTopic({ id: "topic-dsa-array-merge-intervals", name: "Merge Intervals", skillId: "skill-dsa-array-techniques" }),
  dsaTopic({ id: "topic-dsa-array-best-time-stock", name: "Best Time to Buy and Sell Stock", skillId: "skill-dsa-array-techniques" }),

  // Strings
  dsaTopic({ id: "topic-dsa-string-valid-palindrome", name: "Valid Palindrome", skillId: "skill-dsa-string-techniques" }),
  dsaTopic({ id: "topic-dsa-string-longest-substring", name: "Longest Substring Without Repeating Characters", skillId: "skill-dsa-string-techniques" }),
  dsaTopic({ id: "topic-dsa-string-group-anagrams", name: "Group Anagrams", skillId: "skill-dsa-string-techniques" }),
  dsaTopic({ id: "topic-dsa-string-longest-palindrome", name: "Longest Palindromic Substring", skillId: "skill-dsa-string-techniques" }),
  dsaTopic({ id: "topic-dsa-string-reverse-words", name: "Reverse Words in a String", skillId: "skill-dsa-string-techniques" }),

  // Hashing
  dsaTopic({ id: "topic-dsa-hash-two-sum", name: "Two Sum (Hash Map)", skillId: "skill-dsa-hashing-techniques", relatedTopicIds: ["topic-dsa-array-two-sum"] }),
  dsaTopic({ id: "topic-dsa-hash-group-anagrams", name: "Group Anagrams (Hash Map)", skillId: "skill-dsa-hashing-techniques", relatedTopicIds: ["topic-dsa-string-group-anagrams"] }),
  dsaTopic({ id: "topic-dsa-hash-longest-consecutive", name: "Longest Consecutive Sequence", skillId: "skill-dsa-hashing-techniques" }),
  dsaTopic({ id: "topic-dsa-hash-subarray-sum", name: "Subarray Sum Equals K", skillId: "skill-dsa-hashing-techniques" }),

  // Two Pointers
  dsaTopic({ id: "topic-dsa-two-pointer-container-water", name: "Container With Most Water", skillId: "skill-dsa-two-pointer-techniques" }),
  dsaTopic({ id: "topic-dsa-two-pointer-three-sum", name: "3Sum", skillId: "skill-dsa-two-pointer-techniques" }),
  dsaTopic({ id: "topic-dsa-two-pointer-trapping-rain", name: "Trapping Rain Water", skillId: "skill-dsa-two-pointer-techniques" }),

  // Sliding Window
  dsaTopic({ id: "topic-dsa-sliding-maximum", name: "Sliding Window Maximum", skillId: "skill-dsa-sliding-window-techniques" }),
  dsaTopic({ id: "topic-dsa-sliding-minimum-window", name: "Minimum Window Substring", skillId: "skill-dsa-sliding-window-techniques" }),
  dsaTopic({ id: "topic-dsa-sliding-longest-repeating", name: "Longest Repeating Character Replacement", skillId: "skill-dsa-sliding-window-techniques" }),

  // Binary Search
  dsaTopic({ id: "topic-dsa-binary-search-basic", name: "Binary Search", skillId: "skill-dsa-binary-search-techniques", confidenceScore: 0.9 }),
  dsaTopic({ id: "topic-dsa-binary-search-first-last", name: "Find First and Last Position", skillId: "skill-dsa-binary-search-techniques", prerequisiteTopicIds: ["topic-dsa-binary-search-basic"] }),
  dsaTopic({ id: "topic-dsa-binary-search-rotated", name: "Search in Rotated Sorted Array", skillId: "skill-dsa-binary-search-techniques", prerequisiteTopicIds: ["topic-dsa-binary-search-basic"] }),
  dsaTopic({ id: "topic-dsa-binary-search-median", name: "Median of Two Sorted Arrays", skillId: "skill-dsa-binary-search-techniques", prerequisiteTopicIds: ["topic-dsa-binary-search-basic"] }),

  // Linked Lists
  dsaTopic({ id: "topic-dsa-linked-list-reverse", name: "Reverse Linked List", skillId: "skill-dsa-linked-list-techniques", confidenceScore: 0.9 }),
  dsaTopic({ id: "topic-dsa-linked-list-cycle", name: "Linked List Cycle", skillId: "skill-dsa-linked-list-techniques" }),
  dsaTopic({ id: "topic-dsa-linked-list-merge-sorted", name: "Merge Two Sorted Lists", skillId: "skill-dsa-linked-list-techniques" }),
  dsaTopic({ id: "topic-dsa-linked-list-middle", name: "Middle of Linked List", skillId: "skill-dsa-linked-list-techniques" }),
  dsaTopic({ id: "topic-dsa-linked-list-remove-nth", name: "Remove Nth Node From End", skillId: "skill-dsa-linked-list-techniques" }),

  // Stack
  dsaTopic({ id: "topic-dsa-stack-valid-parentheses", name: "Valid Parentheses", skillId: "skill-dsa-stack-techniques", confidenceScore: 0.9 }),
  dsaTopic({ id: "topic-dsa-stack-min-stack", name: "Min Stack", skillId: "skill-dsa-stack-techniques" }),
  dsaTopic({ id: "topic-dsa-stack-next-greater", name: "Next Greater Element", skillId: "skill-dsa-stack-techniques" }),
  dsaTopic({ id: "topic-dsa-stack-daily-temperatures", name: "Daily Temperatures", skillId: "skill-dsa-stack-techniques" }),

  // Queue
  dsaTopic({ id: "topic-dsa-queue-implement", name: "Implement Queue", skillId: "skill-dsa-queue-techniques" }),
  dsaTopic({ id: "topic-dsa-queue-sliding-window", name: "Queue and Sliding Window", skillId: "skill-dsa-queue-techniques" }),

  // Sorting
  dsaTopic({ id: "topic-dsa-sorting-quicksort", name: "QuickSort", skillId: "skill-dsa-sorting-techniques" }),
  dsaTopic({ id: "topic-dsa-sorting-mergesort", name: "MergeSort", skillId: "skill-dsa-sorting-techniques" }),
  dsaTopic({ id: "topic-dsa-sorting-basic", name: "Sorting Basics", skillId: "skill-dsa-sorting-techniques" }),

  // Recursion
  dsaTopic({ id: "topic-dsa-recursion-basics", name: "Recursion Basics", skillId: "skill-dsa-recursion-techniques" }),
  dsaTopic({ id: "topic-dsa-recursion-fibonacci", name: "Fibonacci with Recursion", skillId: "skill-dsa-recursion-techniques" }),

  // Trees
  dsaTopic({ id: "topic-dsa-tree-traversal", name: "Binary Tree Traversal", skillId: "skill-dsa-tree-techniques", confidenceScore: 0.9 }),
  dsaTopic({ id: "topic-dsa-tree-max-depth", name: "Maximum Depth of Binary Tree", skillId: "skill-dsa-tree-techniques", prerequisiteTopicIds: ["topic-dsa-tree-traversal"] }),
  dsaTopic({ id: "topic-dsa-tree-balanced", name: "Balanced Binary Tree", skillId: "skill-dsa-tree-techniques", prerequisiteTopicIds: ["topic-dsa-tree-traversal"] }),
  dsaTopic({ id: "topic-dsa-tree-diameter", name: "Diameter of Binary Tree", skillId: "skill-dsa-tree-techniques", prerequisiteTopicIds: ["topic-dsa-tree-max-depth"] }),
  dsaTopic({ id: "topic-dsa-tree-lca", name: "Lowest Common Ancestor", skillId: "skill-dsa-tree-techniques" }),
  dsaTopic({ id: "topic-dsa-tree-level-order", name: "Level Order Traversal", skillId: "skill-dsa-tree-techniques", prerequisiteTopicIds: ["topic-dsa-tree-traversal"] }),
  dsaTopic({ id: "topic-dsa-tree-serialize", name: "Serialize and Deserialize Binary Tree", skillId: "skill-dsa-tree-techniques" }),

  // BST
  dsaTopic({ id: "topic-dsa-bst-validate", name: "Validate BST", skillId: "skill-dsa-bst-techniques", prerequisiteTopicIds: ["topic-dsa-tree-traversal"] }),
  dsaTopic({ id: "topic-dsa-bst-kth-smallest", name: "Kth Smallest Element in BST", skillId: "skill-dsa-bst-techniques" }),
  dsaTopic({ id: "topic-dsa-bst-array-to-bst", name: "Convert Sorted Array to BST", skillId: "skill-dsa-bst-techniques" }),

  // Heap / Priority Queue
  dsaTopic({ id: "topic-dsa-heap-kth-largest", name: "Kth Largest Element in Array", skillId: "skill-dsa-heap-techniques" }),
  dsaTopic({ id: "topic-dsa-heap-top-k-frequent", name: "Top K Frequent Elements", skillId: "skill-dsa-heap-techniques" }),
  dsaTopic({ id: "topic-dsa-heap-merge-k-sorted", name: "Merge K Sorted Lists", skillId: "skill-dsa-heap-techniques" }),
  dsaTopic({ id: "topic-dsa-heap-find-median", name: "Find Median from Data Stream", skillId: "skill-dsa-heap-techniques" }),

  // Greedy
  dsaTopic({ id: "topic-dsa-greedy-jump-game", name: "Jump Game", skillId: "skill-dsa-greedy-techniques" }),
  dsaTopic({ id: "topic-dsa-greedy-interval-scheduling", name: "Interval Scheduling", skillId: "skill-dsa-greedy-techniques" }),
  dsaTopic({ id: "topic-dsa-greedy-gas-station", name: "Gas Station", skillId: "skill-dsa-greedy-techniques" }),

  // Backtracking
  dsaTopic({ id: "topic-dsa-backtracking-subsets", name: "Subsets", skillId: "skill-dsa-backtracking-techniques" }),
  dsaTopic({ id: "topic-dsa-backtracking-permutations", name: "Permutations", skillId: "skill-dsa-backtracking-techniques" }),
  dsaTopic({ id: "topic-dsa-backtracking-combinations", name: "Combinations", skillId: "skill-dsa-backtracking-techniques" }),
  dsaTopic({ id: "topic-dsa-backtracking-word-search", name: "Word Search", skillId: "skill-dsa-backtracking-techniques" }),

  // Graphs
  dsaTopic({ id: "topic-dsa-graph-bfs", name: "Graph BFS", skillId: "skill-dsa-graph-techniques", confidenceScore: 0.8 }),
  dsaTopic({ id: "topic-dsa-graph-dfs", name: "Graph DFS", skillId: "skill-dsa-graph-techniques", confidenceScore: 0.8 }),
  dsaTopic({ id: "topic-dsa-graph-number-islands", name: "Number of Islands", skillId: "skill-dsa-graph-techniques" }),
  dsaTopic({ id: "topic-dsa-graph-valid-tree", name: "Graph Valid Tree", skillId: "skill-dsa-graph-techniques" }),
  dsaTopic({ id: "topic-dsa-graph-course-schedule", name: "Course Schedule", skillId: "skill-dsa-graph-techniques" }),
  dsaTopic({ id: "topic-dsa-graph-alien-dictionary", name: "Alien Dictionary", skillId: "skill-dsa-graph-techniques" }),
  dsaTopic({ id: "topic-dsa-graph-clone-graph", name: "Clone Graph", skillId: "skill-dsa-graph-techniques" }),

  // Dynamic Programming
  dsaTopic({ id: "topic-dsa-dp-climbing-stairs", name: "Climbing Stairs", skillId: "skill-dsa-dp-techniques" }),
  dsaTopic({ id: "topic-dsa-dp-coin-change", name: "Coin Change", skillId: "skill-dsa-dp-techniques" }),
  dsaTopic({ id: "topic-dsa-dp-longest-increasing", name: "Longest Increasing Subsequence", skillId: "skill-dsa-dp-techniques" }),
  dsaTopic({ id: "topic-dsa-dp-longest-common", name: "Longest Common Subsequence", skillId: "skill-dsa-dp-techniques" }),
  dsaTopic({ id: "topic-dsa-dp-knapsack", name: "0/1 Knapsack", skillId: "skill-dsa-dp-techniques" }),
  dsaTopic({ id: "topic-dsa-dp-house-robber", name: "House Robber", skillId: "skill-dsa-dp-techniques" }),
  dsaTopic({ id: "topic-dsa-dp-palindromic-substrings", name: "Palindromic Substrings", skillId: "skill-dsa-dp-techniques" }),
  dsaTopic({ id: "topic-dsa-dp-edit-distance", name: "Edit Distance", skillId: "skill-dsa-dp-techniques" }),
  dsaTopic({ id: "topic-dsa-dp-max-square", name: "Maximal Square", skillId: "skill-dsa-dp-techniques" }),
  dsaTopic({ id: "topic-dsa-dp-word-break", name: "Word Break", skillId: "skill-dsa-dp-techniques" })
];
