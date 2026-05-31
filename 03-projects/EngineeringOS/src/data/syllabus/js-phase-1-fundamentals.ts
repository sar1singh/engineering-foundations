import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

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

export const jsPhaseOneFundamentalsTopics: SyllabusTopic[] = [
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
];
