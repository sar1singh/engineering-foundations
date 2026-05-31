import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const asyncReferences = [
  {
    id: "reference-js-async-mdn-promises",
    title: "MDN Promise reference",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
    sourceType: "docs" as const,
    usage: "Reference for Promise states, chaining, rejection handling, and static helpers."
  },
  {
    id: "reference-js-async-mdn-async-function",
    title: "MDN async function reference",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
    sourceType: "docs" as const,
    usage: "Reference for async function return values, await behavior, and error handling."
  },
  {
    id: "reference-js-async-javascript-info-event-loop",
    title: "javascript.info Event loop",
    url: "https://javascript.info/event-loop",
    sourceType: "article" as const,
    usage: "Reference for task queue, rendering checkpoints, and microtask ordering."
  }
];

function makeAsyncProblemSet(slug: string, topicTitle: string): SyllabusPracticeProblem[] {
  return [
    {
      id: `problem-${slug}-easy-trace`,
      title: `${topicTitle} output trace`,
      difficulty: "easy",
      tags: [slug, "output-prediction", "javascript", "async"],
      prompt: `Trace a small JavaScript snippet involving ${topicTitle}. Write the exact output order and explain why each line runs there.`,
      starterCode:
        "console.log('A');\n" +
        "Promise.resolve().then(() => console.log('B'));\n" +
        "console.log('C');\n",
      expectedSignals: ["Predicts output order", "Separates synchronous work from queued async work"]
    },
    {
      id: `problem-${slug}-medium-wrapper`,
      title: `${topicTitle} async wrapper`,
      difficulty: "medium",
      tags: [slug, "implementation", "error-handling", "javascript"],
      prompt: `Write a small utility that uses ${topicTitle} to run async work and return either a value or a structured error.`,
      starterCode: "async function toResult(operation) {\n  // your code\n}\n",
      expectedSignals: ["Handles fulfillment and rejection", "Explains error propagation"]
    },
    {
      id: `problem-${slug}-hard-scheduler`,
      title: `${topicTitle} scheduling bug`,
      difficulty: "hard",
      tags: [slug, "event-loop", "debugging", "scheduling"],
      prompt: `Debug a snippet where timers, promises, and async functions run in a surprising order. Explain the queue behavior and propose a clearer rewrite.`,
      expectedSignals: ["Identifies microtask vs macrotask order", "Explains how await resumes", "Suggests readable async flow"]
    }
  ];
}

function makeAsyncTopic(input: {
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
      `${input.title} is part of JavaScript Phase 2 Async. Backend JavaScript relies on these rules for reliable API handlers, database calls, retries, timers, and production debugging.`,
    mentalModel: input.mentalModel,
    theory: `${input.theory}\n\nVisual model: ${input.visual}`,
    codeExamples: [
      {
        id: `example-js-${input.slug}-core`,
        title: `${input.title} runnable trace`,
        language: "javascript",
        code: input.code,
        explanation: `Runnable JavaScript example for tracing ${input.title} behavior.`,
        runnable: true
      }
    ],
    practiceProblems: makeAsyncProblemSet(input.slug, input.title),
    interviewQuestions: input.interviewQuestions,
    commonMistakes: input.commonMistakes,
    productionUseCases: input.productionUseCases,
    revisionPrompts: [
      `Explain ${input.title} in 60 seconds using one code trace.`,
      `Write one fresh ${input.title} example and predict every log before running it.`,
      `Name one production bug caused by misunderstanding ${input.title}.`
    ],
    reviewPrompts: [
      {
        id: `review-js-${input.slug}-self`,
        reviewerRole: "self",
        prompt: `Review your ${input.title} answer for precise queue/state language, output order, and error-handling details.`,
        rubric: ["Definition is precise", "Output order is correct", "Error path is explained", "Production example is concrete"]
      },
      {
        id: `review-js-${input.slug}-mentor`,
        reviewerRole: "mentor",
        prompt: `Review the learner's ${input.title} explanation like a backend JavaScript interviewer.`,
        rubric: ["Mental model is correct", "Code trace is accurate", "Misconceptions are flagged", "Next practice step is clear"]
      }
    ],
    references: [
      ...asyncReferences,
      {
        id: `reference-js-${input.slug}-local-roadmap`,
        title: "EngineeringOS JavaScript master roadmap",
        url: "00-control/master-roadmap/02-javascript/INDEX.md",
        sourceType: "roadmap",
        usage: "Local source of truth for JavaScript Phase 2 ordering and pass criteria."
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

export const jsPhaseTwoAsyncTopics: SyllabusTopic[] = [
  makeAsyncTopic({
    order: 6,
    slug: "promises",
    title: "Promises",
    definition: "A Promise is an object representing the eventual fulfillment or rejection of an asynchronous operation.",
    mentalModel: "A promise is a receipt for future work: it is pending now, then settles once as fulfilled or rejected.",
    visual: "pending -> fulfilled(value) or rejected(reason); then/catch/finally schedule reactions.",
    theory:
      "Promises standardize async completion. A promise settles only once, chains return new promises, thrown errors become rejections inside promise callbacks, and promise reactions run as microtasks after the current call stack completes.",
    code:
      "console.log('start');\n" +
      "Promise.resolve('data')\n" +
      "  .then((value) => {\n" +
      "    console.log(value);\n" +
      "    return 'next';\n" +
      "  })\n" +
      "  .then(console.log)\n" +
      "  .catch(console.error);\n" +
      "console.log('end');\n",
    interviewQuestions: [
      "What are the possible states of a Promise?",
      "Why does then return a new Promise?",
      "How do thrown errors move through a promise chain?"
    ],
    commonMistakes: ["Forgetting to return a promise from a chain", "Mixing nested then calls unnecessarily", "Handling only fulfillment and losing rejection paths"],
    productionUseCases: ["Database calls", "HTTP clients", "Retry flows", "Parallel API orchestration"]
  }),
  makeAsyncTopic({
    order: 7,
    slug: "async-await",
    title: "Async Await",
    definition: "async/await is syntax over Promises that lets asynchronous code read like sequential code while preserving promise-based scheduling.",
    mentalModel: "await pauses the async function, not the whole thread. The rest of the function resumes later as a microtask.",
    visual: "async function starts -> await promise -> caller gets promise -> function resumes after settlement.",
    theory:
      "An async function always returns a Promise. await unwraps a fulfilled value or throws a rejection inside the async function, so try/catch can handle async failures. Sequential awaits wait one after another; Promise.all is needed for intentional parallelism.",
    code:
      "async function loadUser(fetchUser, fetchPosts) {\n" +
      "  try {\n" +
      "    const user = await fetchUser();\n" +
      "    const posts = await fetchPosts(user.id);\n" +
      "    return { user, posts };\n" +
      "  } catch (error) {\n" +
      "    return { error: error.message };\n" +
      "  }\n" +
      "}\n",
    interviewQuestions: [
      "What does an async function return?",
      "How does await handle rejection?",
      "When should you replace sequential awaits with Promise.all?"
    ],
    commonMistakes: ["Assuming await blocks the process", "Forgetting try/catch around awaited failures", "Accidentally making independent work sequential"],
    productionUseCases: ["Readable API handlers", "Service orchestration", "Transactional workflows", "Error-normalized async utilities"]
  }),
  makeAsyncTopic({
    order: 8,
    slug: "event-loop",
    title: "Event Loop",
    definition: "The event loop coordinates the call stack, task queues, microtasks, and rendering or I/O checkpoints so JavaScript can run asynchronous work on a single main execution thread.",
    mentalModel: "Run the current stack to empty, drain microtasks, then take the next task and repeat.",
    visual: "call stack -> microtask queue drain -> next macrotask -> microtask queue drain.",
    theory:
      "JavaScript executes synchronous code on the call stack. Async APIs schedule callbacks for later. Promise reactions and await continuations use the microtask queue, while timers and many external callbacks use task queues. This ordering explains most output-prediction questions.",
    code:
      "console.log('sync 1');\n" +
      "setTimeout(() => console.log('timer'), 0);\n" +
      "Promise.resolve().then(() => console.log('promise'));\n" +
      "console.log('sync 2');\n",
    interviewQuestions: [
      "Why do promises usually run before setTimeout callbacks?",
      "What must happen before the event loop takes another task?",
      "How can long synchronous work affect timers and I/O?"
    ],
    commonMistakes: ["Thinking setTimeout with 0ms runs immediately", "Ignoring that synchronous code blocks everything", "Forgetting microtasks drain before the next task"],
    productionUseCases: ["Debugging latency spikes", "Understanding API throughput", "Avoiding CPU-bound blocking", "Scheduling background work"]
  }),
  makeAsyncTopic({
    order: 9,
    slug: "microtask-vs-macrotask",
    title: "Microtask vs Macrotask",
    definition: "Microtasks are high-priority queued jobs such as promise reactions, while macrotasks are broader event-loop tasks such as timers, events, and I/O callbacks.",
    mentalModel: "After each macrotask, JavaScript drains every queued microtask before moving to the next macrotask.",
    visual: "macrotask runs -> all microtasks drain -> render/I/O checkpoint -> next macrotask.",
    theory:
      "Microtasks are used for promise continuations and must be drained before the event loop advances. Macrotasks represent scheduled work such as timers and events. Excessive recursive microtasks can starve timers, so production code should avoid unbounded microtask loops.",
    code:
      "setTimeout(() => console.log('macrotask'), 0);\n" +
      "queueMicrotask(() => console.log('microtask 1'));\n" +
      "Promise.resolve().then(() => console.log('microtask 2'));\n" +
      "console.log('sync');\n",
    interviewQuestions: [
      "What is the ordering between microtasks and timers?",
      "Why can recursive microtasks starve macrotasks?",
      "Where do Promise.then and queueMicrotask fit?"
    ],
    commonMistakes: ["Calling every async callback a macrotask", "Forgetting that microtasks drain fully", "Using queueMicrotask for heavy repeated work"],
    productionUseCases: ["Fine-grained scheduling", "Framework state flushes", "Timer debugging", "Avoiding starvation in async loops"]
  })
];
