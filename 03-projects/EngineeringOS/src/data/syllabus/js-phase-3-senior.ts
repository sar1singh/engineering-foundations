import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const seniorReferences = [
  {
    id: "reference-js-senior-mdn-memory-management",
    title: "MDN Memory management",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management",
    sourceType: "docs" as const,
    usage: "Reference for reachability, garbage collection, and memory-management terminology."
  },
  {
    id: "reference-js-senior-mdn-modules",
    title: "MDN JavaScript modules",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",
    sourceType: "docs" as const,
    usage: "Reference for module syntax, exports, imports, and modular code organization."
  },
  {
    id: "reference-js-senior-web-dev-performance",
    title: "web.dev JavaScript performance",
    url: "https://web.dev/learn/performance/optimize-javascript",
    sourceType: "article" as const,
    usage: "Reference for practical JavaScript performance trade-offs."
  }
];

function makeSeniorProblemSet(slug: string, topicTitle: string): SyllabusPracticeProblem[] {
  return [
    {
      id: `problem-${slug}-easy-diagnose`,
      title: `${topicTitle} diagnosis`,
      difficulty: "easy",
      tags: [slug, "debugging", "javascript"],
      prompt: `Given a short JavaScript snippet, identify the ${topicTitle} issue and explain the runtime behavior.`,
      expectedSignals: ["Names the issue", "Explains the runtime cause"]
    },
    {
      id: `problem-${slug}-medium-refactor`,
      title: `${topicTitle} refactor`,
      difficulty: "medium",
      tags: [slug, "refactor", "production-code"],
      prompt: `Refactor a small module or function to improve ${topicTitle} while preserving behavior.`,
      starterCode: "function processItems(items) {\n  // refactor this safely\n}\n",
      expectedSignals: ["Preserves behavior", "Explains trade-off", "Names one test case"]
    },
    {
      id: `problem-${slug}-hard-investigation`,
      title: `${topicTitle} production investigation`,
      difficulty: "hard",
      tags: [slug, "observability", "tradeoffs", "senior"],
      prompt: `Write an investigation plan for a production issue involving ${topicTitle}. Include symptoms, likely causes, measurements, and the safest fix path.`,
      expectedSignals: ["Uses evidence before changing code", "Considers rollback risk", "Defines verification signals"]
    }
  ];
}

function makeSeniorTopic(input: {
  order: number;
  slug: string;
  title: string;
  definition: string;
  mentalModel: string;
  theory: string;
  visual: string;
  code: string;
  interviewQuestions: string[];
  commonMistakes: string[];
  productionUseCases: string[];
}): SyllabusTopic {
  return {
    id: `syllabus-js-${input.slug}`,
    slug: input.slug,
    title: input.title,
    order: input.order,
    sourcePath: "00-control/master-roadmap/02-javascript/INDEX.md",
    definition: input.definition,
    whyItMatters:
      `${input.title} is part of JavaScript Phase 3 Senior Topics. These topics test production judgment beyond syntax: debugging, performance, ownership boundaries, and trade-offs.`,
    mentalModel: input.mentalModel,
    theory: `${input.theory}\n\nVisual model: ${input.visual}`,
    codeExamples: [
      {
        id: `example-js-${input.slug}-core`,
        title: `${input.title} production-style example`,
        language: "javascript",
        code: input.code,
        explanation: `Runnable or reviewable JavaScript example for reasoning about ${input.title}.`,
        runnable: true
      }
    ],
    practiceProblems: makeSeniorProblemSet(input.slug, input.title),
    interviewQuestions: input.interviewQuestions,
    commonMistakes: input.commonMistakes,
    productionUseCases: input.productionUseCases,
    revisionPrompts: [
      `Explain ${input.title} with one production incident example.`,
      `Name one metric or test that would prove a ${input.title} fix worked.`,
      `Describe one trade-off involved in improving ${input.title}.`
    ],
    reviewPrompts: [
      {
        id: `review-js-${input.slug}-self`,
        reviewerRole: "self",
        prompt: `Review your ${input.title} answer for evidence, trade-off clarity, and production verification.`,
        rubric: ["Root cause is plausible", "Trade-off is explicit", "Verification signal is measurable", "Code example is grounded"]
      },
      {
        id: `review-js-${input.slug}-mentor`,
        reviewerRole: "mentor",
        prompt: `Review the learner's ${input.title} answer like a senior backend JavaScript interviewer.`,
        rubric: ["Uses production vocabulary", "Avoids premature optimization", "Mentions risk control", "Explains code-level impact"]
      }
    ],
    references: [
      ...seniorReferences,
      {
        id: `reference-js-${input.slug}-local-roadmap`,
        title: "EngineeringOS JavaScript master roadmap",
        url: "00-control/master-roadmap/02-javascript/INDEX.md",
        sourceType: "roadmap",
        usage: "Local source of truth for JavaScript Phase 3 ordering and pass criteria."
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

export const jsPhaseThreeSeniorTopics: SyllabusTopic[] = [
  makeSeniorTopic({
    order: 10,
    slug: "memory-leaks",
    title: "Memory Leaks",
    definition: "A memory leak happens when memory that is no longer useful remains reachable, so the garbage collector cannot reclaim it.",
    mentalModel: "Garbage collection follows reachability. If something is still connected to a live root, it stays alive.",
    visual: "root object -> listener/cache/closure -> large object; remove the edge to make cleanup possible.",
    theory:
      "JavaScript leaks commonly come from long-lived listeners, global caches, timers, retained closures, and unbounded maps. The senior skill is proving retention with measurements, removing references at lifecycle boundaries, and guarding caches with limits or weak references when appropriate.",
    code:
      "function attachTracker(button, payload) {\n" +
      "  function onClick() {\n" +
      "    console.log(payload.id);\n" +
      "  }\n" +
      "  button.addEventListener('click', onClick);\n" +
      "  return () => button.removeEventListener('click', onClick);\n" +
      "}\n",
    interviewQuestions: [
      "Why can event listeners cause memory leaks?",
      "How would you investigate growing memory in a Node.js service?",
      "When would a WeakMap help with memory retention?"
    ],
    commonMistakes: ["Assuming garbage collection prevents all leaks", "Keeping unbounded global caches", "Forgetting to clear listeners or timers"],
    productionUseCases: ["Node.js service memory growth", "Browser listener cleanup", "Cache design", "Long-lived worker processes"]
  }),
  makeSeniorTopic({
    order: 11,
    slug: "garbage-collection",
    title: "Garbage Collection",
    definition: "Garbage collection automatically reclaims memory for objects that are no longer reachable by running JavaScript code.",
    mentalModel: "The collector asks what can still be reached, not what the programmer intended to stop using.",
    visual: "roots -> reachable graph stays; unreachable graph is eligible for collection.",
    theory:
      "Modern JavaScript engines use reachability-based collectors with generational optimizations. Developers do not manually free objects, but they shape reachability through references, closures, caches, and lifecycle cleanup. GC pauses and allocation patterns can affect latency-sensitive code.",
    code:
      "function buildReport(rows) {\n" +
      "  const summary = rows.map((row) => ({ id: row.id, score: row.score }));\n" +
      "  return summary;\n" +
      "}\n" +
      "// The original rows can be collected later if no live reference keeps them reachable.\n",
    interviewQuestions: [
      "What makes an object eligible for garbage collection?",
      "Why can closures keep objects reachable?",
      "How can allocation-heavy code affect performance?"
    ],
    commonMistakes: ["Saying GC is based on scope alone", "Ignoring retained references", "Creating avoidable allocations inside hot paths"],
    productionUseCases: ["Latency tuning", "Heap snapshot analysis", "Worker process health", "Memory-aware cache design"]
  }),
  makeSeniorTopic({
    order: 12,
    slug: "performance",
    title: "Performance",
    definition: "JavaScript performance is the practice of making code meet latency, throughput, and resource goals with measured changes.",
    mentalModel: "Measure first, change the bottleneck, then measure again.",
    visual: "baseline -> profile -> bottleneck -> targeted fix -> verification.",
    theory:
      "Performance work starts with a user or system symptom, not a guess. In JavaScript, common bottlenecks include blocking synchronous work, repeated allocations, unnecessary network waterfalls, inefficient loops over large data, and excessive rendering or serialization. Correctness and maintainability still matter.",
    code:
      "function groupByStatus(items) {\n" +
      "  const groups = new Map();\n" +
      "  for (const item of items) {\n" +
      "    const group = groups.get(item.status) ?? [];\n" +
      "    group.push(item);\n" +
      "    groups.set(item.status, group);\n" +
      "  }\n" +
      "  return groups;\n" +
      "}\n",
    interviewQuestions: [
      "How do you decide what to optimize?",
      "What is the risk of optimizing without measurements?",
      "How would you improve a slow JavaScript API handler?"
    ],
    commonMistakes: ["Optimizing code that is not the bottleneck", "Trading clarity for tiny gains", "Ignoring I/O and serialization costs"],
    productionUseCases: ["API latency reduction", "Batch processing", "Frontend interaction responsiveness", "Node.js throughput tuning"]
  }),
  makeSeniorTopic({
    order: 13,
    slug: "modular-architecture",
    title: "Modular Architecture",
    definition: "Modular architecture organizes code into clear units with explicit responsibilities, dependencies, and public boundaries.",
    mentalModel: "A module should hide decisions internally and expose a small contract externally.",
    visual: "feature module -> public API -> consumers; internals stay replaceable.",
    theory:
      "Good modules reduce coupling and make changes safer. In JavaScript and TypeScript, this means stable exports, clear ownership, dependency direction, narrow interfaces, and avoiding shared mutable global state. Senior interviews often test whether you can scale code organization without creating heavy abstractions.",
    code:
      "export function createUserService({ userRepository, logger }) {\n" +
      "  return {\n" +
      "    async getUser(id) {\n" +
      "      logger.info('loading user');\n" +
      "      return userRepository.findById(id);\n" +
      "    }\n" +
      "  };\n" +
      "}\n",
    interviewQuestions: [
      "What makes a module boundary good?",
      "How do you avoid circular dependencies?",
      "When is an abstraction worth adding?"
    ],
    commonMistakes: ["Exporting every internal helper", "Creating circular dependencies", "Adding abstractions before duplication or volatility exists"],
    productionUseCases: ["Service-layer design", "Repository boundaries", "Feature ownership", "Testable backend modules"]
  })
];
