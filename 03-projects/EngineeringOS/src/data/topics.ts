import type { Topic } from "@/types/topic";
import { modules } from "@/data/modules";

const now = "2026-05-30T00:00:00.000Z";

const moduleByTopicId = new Map(
  modules.flatMap((module) => module.topicIds.map((topicId) => [topicId, module.id] as const))
);

const topicSpecs = [
  ["js-fundamentals", "JavaScript Fundamentals", "javascript", "easy"],
  ["js-scope", "Scope", "scope", "easy"],
  ["js-execution-context", "Execution Context", "execution-context", "medium"],
  ["js-lexical-environment", "Lexical Environment", "lexical-environment", "medium"],
  ["js-closures", "Closures", "closures", "medium"],
  ["js-hoisting", "Hoisting", "hoisting", "easy"],
  ["js-this-binding", "this binding", "this-binding", "medium"],
  ["js-prototypes", "Prototypes", "prototypes", "medium"],
  ["js-event-loop", "Event Loop", "event-loop", "medium"],
  ["js-callbacks", "Callbacks", "callbacks", "easy"],
  ["js-promises", "Promises", "promises", "medium"],
  ["js-async-await", "Async/Await", "async-await", "medium"],
  ["node-runtime", "Node.js Runtime", "node-runtime", "medium"],
  ["node-event-loop", "Event Loop in Node.js", "node-event-loop", "medium"],
  ["node-streams", "Streams", "streams", "medium"],
  ["node-express-basics", "Express Basics", "express-basics", "easy"],
  ["dsa-arrays", "Arrays", "arrays", "easy"],
  ["dsa-strings", "Strings", "strings", "easy"],
  ["dsa-hash-maps", "Hash Maps", "hash-maps", "easy"],
  ["dsa-two-pointers", "Two Pointers", "two-pointers", "medium"],
  ["system-design-caching", "Caching", "caching", "medium"],
  ["system-design-load-balancing", "Load Balancing", "load-balancing", "medium"],
  ["system-design-queues", "Queues", "queues", "medium"],
  ["db-sql-basics", "SQL Basics", "sql-basics", "easy"],
  ["db-indexes", "Indexes", "indexes", "medium"],
  ["db-transactions", "Transactions", "transactions", "medium"],
  ["aws-iam", "IAM", "iam", "easy"],
  ["aws-s3", "S3", "s3", "easy"],
  ["aws-sqs", "SQS", "sqs", "medium"]
] as const;

export const topics: Topic[] = topicSpecs.map(([id, title, slug, difficulty], index) => {
  const previousTopicId = index > 0 ? topicSpecs[index - 1][0] : undefined;
  const nextTopicId = index < topicSpecs.length - 1 ? topicSpecs[index + 1][0] : undefined;

  const topic: Topic = {
    id,
    moduleId: moduleByTopicId.get(id) ?? "module-interview-preparation-foundations",
    title,
    slug,
    summary: `${title} is a core EngineeringOS topic for interview readiness and production engineering judgment.`,
    whyItMatters: `${title} helps engineers connect theory, code, trade-offs, and interview signals.`,
    difficulty,
    estimatedMinutes: difficulty === "easy" ? 45 : 75,
    tags: [slug, "interview", "engineering"],
    prerequisites: previousTopicId ? [previousTopicId] : [],
    relatedTopics: nextTopicId ? [nextTopicId] : [],
    advancedTopics: nextTopicId ? [nextTopicId] : [],
    roleRelevance: ["Senior Engineer", "Lead Engineer"],
    companyRelevance: ["FAANG", "GCC", "Indian Product Companies", "Well-funded Startups"],
    interviewRelevance: difficulty === "easy" ? 7 : 9,
    learningModes: {
      fastTrack: {
        summary: `Learn the interview-critical shape of ${title}.`,
        mustKnow: ["Definition", "Common interview pattern", "One working example"],
        skipForNow: ["Rare edge cases", "Historical details"],
        practiceFocus: ["Explain the concept", "Solve one focused task"],
        passCriteria: ["Can explain clearly", "Can apply in a small example"]
      },
      deepMastery: {
        summary: `Build production-level understanding of ${title}.`,
        mustKnow: ["Mental model", "Runtime behavior", "Trade-offs", "Failure modes"],
        skipForNow: [],
        practiceFocus: ["Edge cases", "Debugging", "Production use cases"],
        passCriteria: ["Can teach it", "Can identify pitfalls", "Can connect to adjacent topics"]
      }
    },
    theory: `${title} should be understood through behavior, constraints, use cases, and failure modes.`,
    mentalModel: `Treat ${title} as a tool with explicit inputs, outputs, constraints, and trade-offs.`,
    codeExamples: [
      {
        title: `${title} minimal example`,
        language: "javascript",
        code: `// ${title}\nconsole.log("${slug}");`,
        explanation: `A small placeholder example for ${title}.`
      }
    ],
    productionUseCases: ["Feature implementation", "Debugging", "System design conversations"],
    commonMistakes: ["Memorizing without practice", "Skipping edge cases", "Not explaining trade-offs"],
    subtopicIds: [`subtopic-${id}-core`],
    practiceTaskIds: [`task-${id}-core`],
    interviewQuestionIds: [`question-${id}-core`],
    referenceLinkIds: [`reference-${id}-core`],
    revisionPromptIds: [`revision-${id}-core`],
    explainBackPrompt: `Explain ${title} to a junior engineer with one example and one pitfall.`,
    evaluationRubricId: `rubric-${id}-core`,
    completionCriteria: ["Summary understood", "Practice task complete", "Explain-back prompt answered"],
    createdAt: now,
    updatedAt: now
  };

  if (id !== "js-closures") {
    return topic;
  }

  return {
    ...topic,
    summary:
      "Closures are functions that keep access to variables from their lexical scope even after the outer function has finished running.",
    whyItMatters:
      "Closures explain callbacks, factories, hooks, module privacy, memoization, and many interview tasks where state must live without becoming global.",
    estimatedMinutes: 90,
    tags: ["closures", "lexical-scope", "state", "callbacks", "interview", "javascript"],
    prerequisites: ["js-scope", "js-lexical-environment"],
    relatedTopics: ["js-callbacks", "js-promises"],
    advancedTopics: ["js-event-loop", "js-this-binding"],
    learningModes: {
      fastTrack: {
        summary: "Learn the interview-critical shape: inner function plus remembered lexical environment.",
        mustKnow: [
          "A closure is created when a function references variables from an outer lexical scope",
          "The closed-over variables are live bindings, not copied snapshots",
          "Each factory call can create an independent private state"
        ],
        skipForNow: ["Engine optimization details", "Memory profiling internals"],
        practiceFocus: ["Implement a counter factory", "Explain why two counters do not share state"],
        passCriteria: ["Can define closure without hand-waving", "Can trace one variable across calls"]
      },
      deepMastery: {
        summary: "Connect closures to runtime behavior, memory retention, async callbacks, and production failure modes.",
        mustKnow: [
          "Lexical environment lifetime",
          "Live bindings across repeated calls",
          "Loop capture behavior with let and var",
          "Memory leaks caused by retained references"
        ],
        skipForNow: [],
        practiceFocus: ["Debug stale state", "Design private module state", "Explain closure behavior in callbacks"],
        passCriteria: [
          "Can predict output for nested closures",
          "Can identify when a closure retains too much data",
          "Can compare closure state with object instance state"
        ]
      }
    },
    theory:
      "A closure is not a special syntax feature. It is the normal result of lexical scoping: when an inner function uses a variable from an outer scope, the runtime keeps the referenced lexical environment reachable for that function. The outer function may return, but the variables needed by the returned or stored inner function remain available. This is why a counter factory can keep private count state, why callbacks can remember configuration, and why careless closures can retain memory longer than expected.",
    mentalModel:
      "Think of a closure as a function plus a backpack of live references to the outer variables it actually uses. Calling the function later opens that same backpack, so updates persist across calls. Calling the outer factory again creates a new backpack.",
    codeExamples: [
      {
        title: "Counter factory with private state",
        language: "javascript",
        code:
          "function createCounter(start = 0) {\n" +
          "  let count = start;\n\n" +
          "  return {\n" +
          "    increment() {\n" +
          "      count += 1;\n" +
          "      return count;\n" +
          "    },\n" +
          "    current() {\n" +
          "      return count;\n" +
          "    }\n" +
          "  };\n" +
          "}\n\n" +
          "const a = createCounter();\n" +
          "const b = createCounter(10);\n" +
          "a.increment(); // 1\n" +
          "b.increment(); // 11",
        explanation:
          "Each createCounter call creates a separate lexical environment, so a and b keep independent count values without exposing count globally."
      },
      {
        title: "Callback remembers configuration",
        language: "javascript",
        code:
          "function makePrefixLogger(prefix) {\n" +
          "  return function log(message) {\n" +
          "    return `${prefix}: ${message}`;\n" +
          "  };\n" +
          "}\n\n" +
          "const warn = makePrefixLogger(\"WARN\");\n" +
          "warn(\"cache miss\"); // WARN: cache miss",
        explanation:
          "The returned log function still has access to prefix after makePrefixLogger has returned."
      }
    ],
    productionUseCases: [
      "Creating small factories that keep private state without global variables",
      "Binding configuration into callbacks, middleware, and event handlers",
      "Implementing memoization caches scoped to one function instance",
      "Understanding React hook callbacks and stale closure bugs",
      "Avoiding memory leaks from closures that retain large objects unnecessarily"
    ],
    commonMistakes: [
      "Saying a closure copies values instead of retaining live bindings",
      "Forgetting that every factory invocation creates a separate lexical environment",
      "Capturing changing loop variables incorrectly in older var-based code",
      "Retaining large objects through callbacks long after they are needed",
      "Using closures for hidden state when a simple object or parameter would be clearer"
    ],
    explainBackPrompt:
      "Explain closures using a counter factory. Include what variable is retained, why two counters are independent, and one memory or stale-state pitfall.",
    completionCriteria: [
      "Can define closure as function plus retained lexical environment",
      "Can implement and trace a counter factory",
      "Can explain independent state across factory calls",
      "Can name one production pitfall"
    ]
  };
});
