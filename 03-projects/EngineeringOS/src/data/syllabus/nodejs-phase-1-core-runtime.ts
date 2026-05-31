import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const nodeCoreReferences = [
  {
    id: "reference-node-core-event-loop-docs",
    title: "Node.js Event Loop guide",
    url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick",
    sourceType: "docs" as const,
    usage: "Official Node.js guide for event-loop phases, timers, setImmediate, and process.nextTick."
  },
  {
    id: "reference-node-core-process-docs",
    title: "Node.js process API",
    url: "https://nodejs.org/api/process.html",
    sourceType: "docs" as const,
    usage: "Official Node.js reference for process events, exit behavior, signals, environment, and runtime metadata."
  },
  {
    id: "reference-node-core-buffer-docs",
    title: "Node.js Buffer API",
    url: "https://nodejs.org/api/buffer.html",
    sourceType: "docs" as const,
    usage: "Official Node.js reference for binary data, encoding, Buffer allocation, and conversion."
  },
  {
    id: "reference-node-core-stream-docs",
    title: "Node.js Stream API",
    url: "https://nodejs.org/api/stream.html",
    sourceType: "docs" as const,
    usage: "Official Node.js reference for Readable, Writable, Transform, pipeline, backpressure, and stream lifecycle."
  }
];

function makeNodeCoreProblems(slug: string, topicTitle: string): SyllabusPracticeProblem[] {
  return [
    {
      id: `problem-node-${slug}-easy-local-lab`,
      title: `${topicTitle} local lab`,
      difficulty: "easy",
      tags: ["nodejs", slug, "local-lab"],
      prompt: `Create a small local Node.js file that demonstrates ${topicTitle}. Run it, capture the output, and explain each line.`,
      starterCode: "node ./lab.js\n",
      expectedSignals: ["Runs a local Node lab", "Explains observed output", "Links behavior to Node runtime rules"]
    },
    {
      id: `problem-node-${slug}-medium-mini-backend`,
      title: `${topicTitle} mini backend task`,
      difficulty: "medium",
      tags: ["nodejs", slug, "mini-backend-project"],
      prompt: `Build or modify a tiny backend script that uses ${topicTitle} in a realistic request, file, or process flow.`,
      expectedSignals: ["Uses Node API correctly", "Handles errors or lifecycle state", "Explains production implication"]
    },
    {
      id: `problem-node-${slug}-hard-production-debug`,
      title: `${topicTitle} production debugging scenario`,
      difficulty: "hard",
      tags: ["nodejs", slug, "debugging", "production"],
      prompt: `Given a production symptom involving ${topicTitle}, write the investigation plan, likely root causes, safe fix, and verification signals.`,
      expectedSignals: ["Uses Node docs terminology", "Defines measurements", "Considers failure modes and rollback"]
    }
  ];
}

function makeNodeCoreTopic(input: {
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
    id: `syllabus-nodejs-${input.slug}`,
    slug: input.slug,
    title: input.title,
    order: input.order,
    sourcePath: "00-control/master-roadmap/03-nodejs/INDEX.md",
    definition: input.definition,
    whyItMatters:
      `${input.title} is part of Node.js Phase 1 Core Runtime. It builds the runtime understanding needed to explain production backend flows.`,
    mentalModel: input.mentalModel,
    theory: `${input.theory}\n\nVisual model: ${input.visual}`,
    codeExamples: [
      {
        id: `example-nodejs-${input.slug}-core`,
        title: `${input.title} Node.js local lab`,
        language: "javascript",
        code: input.code,
        explanation: `Run this as a local Node.js lab and connect the output to the runtime concept.`,
        runnable: true
      }
    ],
    practiceProblems: makeNodeCoreProblems(input.slug, input.title),
    interviewQuestions: input.interviewQuestions,
    commonMistakes: input.commonMistakes,
    productionUseCases: input.productionUseCases,
    revisionPrompts: [
      `Explain ${input.title} as a backend runtime concept, not just an API name.`,
      `Build one local lab for ${input.title} and save the observed output.`,
      `Name one production failure that can happen when ${input.title} is misunderstood.`
    ],
    reviewPrompts: [
      {
        id: `review-nodejs-${input.slug}-self`,
        reviewerRole: "self",
        prompt: `Review your ${input.title} answer for Node-specific runtime accuracy, code behavior, and production implications.`,
        rubric: ["Node-specific behavior is correct", "Code output is explained", "Error/lifecycle path is covered", "Production use is concrete"]
      },
      {
        id: `review-nodejs-${input.slug}-mentor`,
        reviewerRole: "mentor",
        prompt: `Review the learner's ${input.title} answer like a senior Node.js backend interviewer.`,
        rubric: ["Uses official Node terminology", "Understands runtime boundary", "Names failure modes", "Explains verification"]
      }
    ],
    references: [
      ...nodeCoreReferences,
      {
        id: `reference-nodejs-${input.slug}-local-roadmap`,
        title: "EngineeringOS Node.js master roadmap",
        url: "00-control/master-roadmap/03-nodejs/INDEX.md",
        sourceType: "roadmap",
        usage: "Local source of truth for Node.js Phase 1 ordering, practice platforms, and pass criteria."
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

export const nodejsPhaseOneCoreRuntimeTopics: SyllabusTopic[] = [
  makeNodeCoreTopic({
    order: 1,
    slug: "node-event-loop",
    title: "Event Loop in Node",
    definition: "The Node.js event loop coordinates JavaScript execution with libuv-managed async work such as timers, I/O callbacks, immediates, and close events.",
    mentalModel: "Node runs your stack, then moves through event-loop phases while also honoring nextTick and promise microtask queues.",
    visual: "timers -> pending callbacks -> poll -> check(setImmediate) -> close callbacks, with nextTick/microtasks between turns.",
    theory:
      "Node's event loop enables non-blocking I/O, but synchronous JavaScript still blocks the process. Timers, I/O, setImmediate, process.nextTick, and Promise callbacks have distinct scheduling behavior. Backend engineers must know this to debug latency, starvation, and surprising log order.",
    code:
      "console.log('sync');\n" +
      "setTimeout(() => console.log('timeout'), 0);\n" +
      "setImmediate(() => console.log('immediate'));\n" +
      "process.nextTick(() => console.log('nextTick'));\n" +
      "Promise.resolve().then(() => console.log('promise'));\n",
    interviewQuestions: [
      "How is the Node.js event loop different from browser event-loop explanations?",
      "Where do process.nextTick, promises, setTimeout, and setImmediate fit?",
      "How can CPU-heavy synchronous work affect a Node.js API?"
    ],
    commonMistakes: ["Assuming zero-delay timers run immediately", "Ignoring process.nextTick starvation", "Blocking the event loop with CPU-heavy work"],
    productionUseCases: ["API latency debugging", "Timer and retry behavior", "I/O scheduling", "Event-loop lag investigation"]
  }),
  makeNodeCoreTopic({
    order: 2,
    slug: "process-lifecycle",
    title: "Process Lifecycle",
    definition: "The Node.js process lifecycle covers startup, runtime state, signals, exit behavior, and events such as beforeExit, exit, uncaughtException, and unhandledRejection.",
    mentalModel: "A Node service is a process with lifecycle hooks; production safety depends on knowing when work can still be scheduled and when shutdown is final.",
    visual: "start -> run event loop -> receive signal/error -> cleanup/drain -> exit code.",
    theory:
      "Backend Node services must handle lifecycle intentionally. Environment variables configure runtime behavior, signals trigger shutdown flows, and exit events have strict limits. Good lifecycle handling avoids dropped requests, corrupted work, and silent failures.",
    code:
      "process.on('SIGTERM', () => {\n" +
      "  console.log('shutdown requested');\n" +
      "  process.exitCode = 0;\n" +
      "});\n" +
      "process.on('beforeExit', (code) => {\n" +
      "  console.log('before exit', code);\n" +
      "});\n",
    interviewQuestions: [
      "What is the difference between beforeExit and exit?",
      "How should a backend service respond to SIGTERM?",
      "Why are uncaughtException and unhandledRejection dangerous in production?"
    ],
    commonMistakes: ["Doing async cleanup in the exit event", "Swallowing fatal errors without restart strategy", "Ignoring signal handling in containers"],
    productionUseCases: ["Graceful shutdown", "Container lifecycle", "Crash diagnostics", "Runtime configuration"]
  }),
  makeNodeCoreTopic({
    order: 3,
    slug: "buffers",
    title: "Buffers",
    definition: "A Buffer is Node.js's binary data container for working with bytes from files, networks, streams, and encoded text.",
    mentalModel: "Strings are text; Buffers are bytes. Encoding is the bridge between them.",
    visual: "bytes <-> Buffer <-> encoding conversion <-> string or protocol payload.",
    theory:
      "Node uses Buffers when data is not naturally JavaScript text. Buffers matter for file I/O, TCP, HTTP bodies, crypto, uploads, and protocol parsing. Correct encoding, safe allocation, and size awareness prevent corrupted data and memory issues.",
    code:
      "const payload = Buffer.from('hello', 'utf8');\n" +
      "console.log(payload.length);\n" +
      "console.log(payload.toString('hex'));\n" +
      "console.log(payload.toString('utf8'));\n",
    interviewQuestions: [
      "When would Node return a Buffer instead of a string?",
      "Why does encoding matter when converting Buffers?",
      "What is the difference between Buffer.alloc and unsafe allocation?"
    ],
    commonMistakes: ["Confusing character length with byte length", "Using the wrong encoding", "Allocating large buffers unnecessarily"],
    productionUseCases: ["File uploads", "HTTP payloads", "Crypto", "Binary protocols", "Stream chunks"]
  }),
  makeNodeCoreTopic({
    order: 4,
    slug: "streams",
    title: "Streams",
    definition: "Streams are Node.js abstractions for reading, writing, or transforming data piece by piece instead of loading it all into memory.",
    mentalModel: "Streams are conveyor belts for chunks; backpressure tells producers not to outrun consumers.",
    visual: "Readable -> Transform -> Writable, with backpressure flowing backward.",
    theory:
      "Streams are essential for large files, network responses, compression, logging, and data pipelines. The key concepts are Readable, Writable, Duplex, Transform, piping, errors, lifecycle, and backpressure. stream.pipeline is the safer default for connecting streams because it coordinates errors and completion.",
    code:
      "import { createReadStream, createWriteStream } from 'node:fs';\n" +
      "import { pipeline } from 'node:stream/promises';\n" +
      "\n" +
      "await pipeline(\n" +
      "  createReadStream('input.txt'),\n" +
      "  createWriteStream('output.txt')\n" +
      ");\n",
    interviewQuestions: [
      "Why use streams instead of reading a whole file into memory?",
      "What is backpressure?",
      "Why is pipeline safer than manually chaining pipe calls?"
    ],
    commonMistakes: ["Ignoring stream errors", "Loading huge files fully into memory", "Forgetting backpressure and lifecycle handling"],
    productionUseCases: ["Large file processing", "HTTP uploads/downloads", "Compression pipelines", "Log processing"]
  })
];
