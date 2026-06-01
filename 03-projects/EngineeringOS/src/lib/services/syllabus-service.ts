import { mockSyllabusCatalog } from "@/data/mock-syllabus";
import { enrichedTopicContentBySlug } from "@/data/content/enriched-content";
import { topicDepthOverrides } from "@/data/syllabus/topic-depth-overrides";
import type { MockSyllabusCatalog, SyllabusDomain, SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

export class SyllabusService {
  getCatalog(): MockSyllabusCatalog {
    return {
      ...mockSyllabusCatalog,
      domains: this.getDomains()
    };
  }

  getDomains(): SyllabusDomain[] {
    return mockSyllabusCatalog.domains.map((domain) => ({
      ...domain,
      modules: domain.modules.map((syllabusModule) => ({
        ...syllabusModule,
        topics: syllabusModule.topics.map((topic) => enrichTopicForLearning(topic))
      }))
    }));
  }

  getTopicBySlug(slug: string): SyllabusTopic | null {
    for (const domain of this.getDomains()) {
      for (const syllabusModule of domain.modules) {
        const topic = syllabusModule.topics.find((item) => item.slug === slug || item.id === slug);

        if (topic) {
          return topic;
        }
      }
    }

    return null;
  }

  getPracticeProblemsByTopicSlug(slug: string): SyllabusPracticeProblem[] {
    return this.getTopicBySlug(slug)?.practiceProblems ?? [];
  }

  getPracticeProblemsByDifficulty(difficulty: SyllabusPracticeProblem["difficulty"]): SyllabusPracticeProblem[] {
    return this.getDomains().flatMap((domain) =>
      domain.modules.flatMap((syllabusModule) =>
        syllabusModule.topics.flatMap((topic) => topic.practiceProblems.filter((problem) => problem.difficulty === difficulty))
      )
    );
  }
}

export const syllabusService = new SyllabusService();

const minimumPracticeProblemCount = 8;
const minimumInterviewQuestionCount = 8;

function enrichTopicForLearning(topic: SyllabusTopic): SyllabusTopic {
  const topicWithDepthOverride = applyTopicDepthOverride(topic);
  const topicWithSourceBackedDsa = applyDsaSourceBackedPractice(topicWithDepthOverride);

  return {
    ...topicWithSourceBackedDsa,
    enrichedContent: enrichedTopicContentBySlug[topicWithSourceBackedDsa.slug],
    practiceProblems: ensurePracticeProblemDepth(topicWithSourceBackedDsa),
    interviewQuestions: ensureInterviewQuestionDepth(topicWithSourceBackedDsa),
    commonMistakes: ensureCommonMistakeDepth(topicWithSourceBackedDsa),
    productionUseCases: ensureProductionUseCaseDepth(topicWithSourceBackedDsa)
  };
}

function applyTopicDepthOverride(topic: SyllabusTopic): SyllabusTopic {
  const override = topicDepthOverrides[topic.slug];

  if (!override) {
    return topic;
  }

  return {
    ...topic,
    theory: `${topic.theory}\n\n${override.theoryAppendix}`,
    codeExamples: mergeById(topic.codeExamples, override.codeExamples ?? []),
    practiceProblems: mergeById(topic.practiceProblems, override.practiceProblems ?? []),
    interviewQuestions: mergeUnique(topic.interviewQuestions, override.interviewQuestions ?? []),
    reviewPrompts: mergeById(topic.reviewPrompts, override.reviewPrompts ?? []),
    references: mergeById(topic.references, override.references ?? [])
  };
}

function mergeById<T extends { id: string }>(base: T[], additions: T[]): T[] {
  const existingIds = new Set(base.map((item) => item.id));
  return [...base, ...additions.filter((item) => !existingIds.has(item.id))];
}

function mergeUnique(base: string[], additions: string[]): string[] {
  return Array.from(new Set([...base, ...additions]));
}

function applyDsaSourceBackedPractice(topic: SyllabusTopic): SyllabusTopic {
  if (!topic.sourcePath.includes("04-dsa")) {
    return topic;
  }

  const existingIds = new Set(topic.practiceProblems.map((problem) => problem.id));
  const sourceBackedProblems = sourceBackedDsaProblems(topic)
    .filter((problem) => !existingIds.has(problem.id))
    .slice(0, 10);

  const sourceReferences = [
    {
      id: `reference-${topic.slug}-neetcode`,
      title: "NeetCode Roadmap",
      url: "https://neetcode.io/roadmap",
      sourceType: "roadmap" as const,
      usage: "Source-backed interview pattern mapping for high-ROI coding practice."
    },
    {
      id: `reference-${topic.slug}-leetcode`,
      title: "LeetCode Problem Set",
      url: "https://leetcode.com/problemset/",
      sourceType: "practice" as const,
      usage: "Practice source for easy/medium/hard coding interview drills."
    },
    {
      id: `reference-${topic.slug}-the-algorithms-js`,
      title: "The Algorithms JavaScript",
      url: "https://github.com/TheAlgorithms/JavaScript",
      sourceType: "practice" as const,
      usage: "Public JavaScript implementations for algorithms and data structures."
    }
  ];

  return {
    ...topic,
    practiceProblems: [...sourceBackedProblems, ...topic.practiceProblems].slice(0, 10),
    references: mergeById(topic.references, sourceReferences)
  };
}

function sourceBackedDsaProblems(topic: SyllabusTopic): SyllabusPracticeProblem[] {
  const problemTitles = dsaProblemCatalog[topic.slug] ?? inferDsaProblems(topic.title);

  return problemTitles.map((title, index) => ({
    id: `phase58-dsa-${topic.slug}-${index + 1}`,
    title,
    difficulty: index < 3 ? "easy" : index < 7 ? "medium" : "hard",
    tags: [topic.slug, "dsa", "source-neetcode", "source-leetcode", "source-the-algorithms-js"],
    prompt: `Solve ${title} as a ${topic.title} drill. Explain the pattern trigger, state/invariant, complexity, and one edge case.`,
    expectedSignals: ["Pattern trigger", "State or invariant", "Complexity", "Edge case"]
  }));
}

const dsaProblemCatalog: Record<string, string[]> = {
  array: ["Two Sum", "Best Time to Buy and Sell Stock", "Contains Duplicate", "Product of Array Except Self", "Maximum Subarray", "Move Zeroes", "Rotate Array", "Merge Sorted Array"],
  string: ["Valid Anagram", "Valid Palindrome", "Longest Substring Without Repeating Characters", "Group Anagrams", "Encode and Decode Strings", "Minimum Window Substring", "Longest Repeating Character Replacement", "Find All Anagrams in a String"],
  hashing: ["Two Sum", "Contains Duplicate", "Valid Anagram", "Group Anagrams", "Top K Frequent Elements", "Longest Consecutive Sequence", "Subarray Sum Equals K", "Find Duplicate File in System"],
  stack: ["Valid Parentheses", "Min Stack", "Evaluate Reverse Polish Notation", "Daily Temperatures", "Car Fleet", "Largest Rectangle in Histogram", "Asteroid Collision", "Decode String"],
  queue: ["Implement Queue using Stacks", "Number of Recent Calls", "Moving Average from Data Stream", "Rotting Oranges", "Walls and Gates", "Sliding Window Maximum", "Design Circular Queue", "Task Scheduler"],
  "two-pointers": ["Valid Palindrome", "Two Sum II", "3Sum", "Container With Most Water", "Trapping Rain Water", "Remove Duplicates from Sorted Array", "Sort Colors", "Backspace String Compare"],
  "sliding-window": ["Best Time to Buy and Sell Stock", "Longest Substring Without Repeating Characters", "Longest Repeating Character Replacement", "Permutation in String", "Minimum Window Substring", "Sliding Window Maximum", "Find All Anagrams in a String", "Minimum Size Subarray Sum"],
  "prefix-sum": ["Range Sum Query Immutable", "Subarray Sum Equals K", "Find Pivot Index", "Product of Array Except Self", "Continuous Subarray Sum", "Maximum Size Subarray Sum Equals K", "Corporate Flight Bookings", "Car Pooling"],
  "binary-search": ["Binary Search", "Search Insert Position", "Search in Rotated Sorted Array", "Find Minimum in Rotated Sorted Array", "Koko Eating Bananas", "Time Based Key-Value Store", "Median of Two Sorted Arrays", "Capacity To Ship Packages"],
  "linked-list": ["Reverse Linked List", "Merge Two Sorted Lists", "Linked List Cycle", "Reorder List", "Remove Nth Node From End", "Copy List with Random Pointer", "Add Two Numbers", "LRU Cache"],
  tree: ["Invert Binary Tree", "Maximum Depth of Binary Tree", "Diameter of Binary Tree", "Balanced Binary Tree", "Validate Binary Search Tree", "Lowest Common Ancestor", "Binary Tree Level Order Traversal", "Serialize and Deserialize Binary Tree"],
  heap: ["Kth Largest Element", "Top K Frequent Elements", "Find Median from Data Stream", "Merge K Sorted Lists", "Task Scheduler", "K Closest Points to Origin", "Last Stone Weight", "Design Twitter"],
  trie: ["Implement Trie", "Design Add and Search Words", "Word Search II", "Longest Word in Dictionary", "Replace Words", "Map Sum Pairs", "Search Suggestions System", "Concatenated Words"],
  graph: ["Number of Islands", "Clone Graph", "Pacific Atlantic Water Flow", "Course Schedule", "Rotting Oranges", "Word Ladder", "Network Delay Time", "Redundant Connection"],
  "dynamic-programming": ["Climbing Stairs", "House Robber", "Coin Change", "Longest Increasing Subsequence", "Longest Common Subsequence", "Decode Ways", "Unique Paths", "Edit Distance"],
  greedy: ["Jump Game", "Gas Station", "Hand of Straights", "Merge Triplets", "Partition Labels", "Valid Parenthesis String", "Non-overlapping Intervals", "Candy"],
  intervals: ["Merge Intervals", "Insert Interval", "Non-overlapping Intervals", "Meeting Rooms", "Meeting Rooms II", "Minimum Interval to Include Each Query", "Employee Free Time", "Remove Covered Intervals"],
  "bit-manipulation": ["Single Number", "Number of 1 Bits", "Counting Bits", "Reverse Bits", "Missing Number", "Sum of Two Integers", "Power of Two", "Bitwise AND of Numbers Range"],
  matrix: ["Set Matrix Zeroes", "Spiral Matrix", "Rotate Image", "Word Search", "Number of Islands", "Pacific Atlantic Water Flow", "Shortest Path in Binary Matrix", "Search a 2D Matrix"]
};

function inferDsaProblems(title: string): string[] {
  const normalizedTitle = title.toLowerCase();
  const matchedKey = Object.keys(dsaProblemCatalog).find((key) => normalizedTitle.includes(key.replace("-", " ")) || normalizedTitle.includes(key));
  return dsaProblemCatalog[matchedKey ?? "array"];
}

function ensurePracticeProblemDepth(topic: SyllabusTopic): SyllabusPracticeProblem[] {
  if (topic.practiceProblems.length >= minimumPracticeProblemCount) {
    return topic.practiceProblems;
  }

  const generatedProblems: SyllabusPracticeProblem[] = [
    {
      id: `generated-${topic.slug}-definition-drill`,
      title: `${topic.title} definition drill`,
      difficulty: "easy",
      tags: [topic.slug, "definition", "80-20"],
      prompt: `Explain ${topic.title} in your own words, then name one real backend or interview scenario where it matters.`,
      expectedSignals: ["Clear definition", "Concrete use case", "No memorized jargon"]
    },
    {
      id: `generated-${topic.slug}-trace-code`,
      title: `${topic.title} code or design trace`,
      difficulty: "easy",
      tags: [topic.slug, "trace", "practice"],
      prompt: `Trace the provided ${topic.title} code or design example step by step. Identify the key state changes and final result.`,
      expectedSignals: ["Step-by-step trace", "Important state identified", "Final output or decision is correct"]
    },
    {
      id: `generated-${topic.slug}-edge-cases`,
      title: `${topic.title} edge cases`,
      difficulty: "medium",
      tags: [topic.slug, "edge-cases", "interview"],
      prompt: `List five edge cases for ${topic.title}. For each one, explain how your implementation or design should behave.`,
      expectedSignals: ["Five edge cases", "Expected behavior", "Failure mode awareness"]
    },
    {
      id: `generated-${topic.slug}-implementation`,
      title: `${topic.title} implementation task`,
      difficulty: "medium",
      tags: [topic.slug, "implementation", "hands-on"],
      prompt: `Implement or sketch the smallest working version of ${topic.title}. Include inputs, outputs, and one validation step.`,
      expectedSignals: ["Runnable or reviewable solution", "Input/output contract", "Validation step"]
    },
    {
      id: `generated-${topic.slug}-tradeoff`,
      title: `${topic.title} trade-off analysis`,
      difficulty: "medium",
      tags: [topic.slug, "tradeoffs", "senior"],
      prompt: `Compare ${topic.title} with one alternative. Explain when each option wins and what cost or risk it introduces.`,
      expectedSignals: ["Alternative named", "Decision criteria", "Cost or risk explained"]
    },
    {
      id: `generated-${topic.slug}-debugging`,
      title: `${topic.title} debugging scenario`,
      difficulty: "hard",
      tags: [topic.slug, "debugging", "production"],
      prompt: `A production issue is suspected to involve ${topic.title}. Write the investigation plan, evidence to collect, safest fix, and verification signal.`,
      expectedSignals: ["Investigation plan", "Evidence before fix", "Verification signal"]
    },
    {
      id: `generated-${topic.slug}-system-design`,
      title: `${topic.title} system design application`,
      difficulty: "hard",
      tags: [topic.slug, "system-design", "architecture"],
      prompt: `Apply ${topic.title} inside a realistic system design. Describe where it fits, how it scales, and how it fails.`,
      expectedSignals: ["Placement in design", "Scale implication", "Failure handling"]
    },
    {
      id: `generated-${topic.slug}-interview-mock`,
      title: `${topic.title} interview mock`,
      difficulty: "hard",
      tags: [topic.slug, "mock-interview", "explain-back"],
      prompt: `Answer a mock interview question on ${topic.title}. Include definition, example, complexity or trade-off, and follow-up risk.`,
      expectedSignals: ["Structured answer", "Example included", "Trade-off or complexity", "Follow-up risk"]
    }
  ];

  const existingIds = new Set(topic.practiceProblems.map((problem) => problem.id));
  const additions = generatedProblems.filter((problem) => !existingIds.has(problem.id));
  return [...topic.practiceProblems, ...additions].slice(0, Math.max(minimumPracticeProblemCount, topic.practiceProblems.length));
}

function ensureInterviewQuestionDepth(topic: SyllabusTopic): string[] {
  if (topic.interviewQuestions.length >= minimumInterviewQuestionCount) {
    return topic.interviewQuestions;
  }

  const generatedQuestions = [
    `Explain ${topic.title} from first principles.`,
    `What problem does ${topic.title} solve?`,
    `Show a practical example of ${topic.title}.`,
    `What are the most common mistakes with ${topic.title}?`,
    `How would you debug a failure involving ${topic.title}?`,
    `What trade-off does ${topic.title} introduce?`,
    `How does ${topic.title} behave at scale or under edge cases?`,
    `How would you teach ${topic.title} to a junior engineer?`,
    `What follow-up question would you expect after explaining ${topic.title}?`
  ];

  return Array.from(new Set([...topic.interviewQuestions, ...generatedQuestions])).slice(
    0,
    Math.max(minimumInterviewQuestionCount, topic.interviewQuestions.length)
  );
}

function ensureCommonMistakeDepth(topic: SyllabusTopic): string[] {
  if (topic.commonMistakes.length >= 3) {
    return topic.commonMistakes;
  }

  return Array.from(
    new Set([
      ...topic.commonMistakes,
      `Explaining ${topic.title} with memorized jargon instead of a concrete example.`,
      `Skipping edge cases or failure modes when applying ${topic.title}.`,
      `Not connecting ${topic.title} to complexity, trade-offs, or production behavior.`
    ])
  ).slice(0, 3);
}

function ensureProductionUseCaseDepth(topic: SyllabusTopic): string[] {
  if (topic.productionUseCases.length >= 3) {
    return topic.productionUseCases;
  }

  return Array.from(
    new Set([
      ...topic.productionUseCases,
      `Interview explain-back and mentoring for ${topic.title}.`,
      `Production debugging or design review involving ${topic.title}.`,
      `Architecture, API, data, or operational decision-making where ${topic.title} changes the trade-off.`
    ])
  ).slice(0, 3);
}
