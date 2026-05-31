import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const seniorReferences = [
  { id: "reference-node-senior-perf-hooks", title: "Node.js Performance Hooks API", url: "https://nodejs.org/api/perf_hooks.html", sourceType: "docs" as const, usage: "Official reference for measuring Node.js performance timings." },
  { id: "reference-node-senior-process", title: "Node.js process API", url: "https://nodejs.org/api/process.html", sourceType: "docs" as const, usage: "Official reference for signals, process lifecycle, and shutdown state." },
  { id: "reference-node-senior-errors", title: "Node.js Errors API", url: "https://nodejs.org/api/errors.html", sourceType: "docs" as const, usage: "Official reference for runtime error handling and failure behavior." }
];

function seniorTopic(order: number, slug: string, title: string, definition: string, mentalModel: string, theory: string, code: string): SyllabusTopic {
  const practiceProblems: SyllabusPracticeProblem[] = [
    { id: `problem-node-${slug}-easy`, title: `${title} diagnosis`, difficulty: "easy", tags: ["nodejs", slug, "diagnosis"], prompt: `Given a Node.js symptom, identify whether ${title} is involved and name the first measurement.`, expectedSignals: ["Names symptom", "Chooses measurement"] },
    { id: `problem-node-${slug}-medium`, title: `${title} implementation`, difficulty: "medium", tags: ["nodejs", slug, "mini-backend-project"], prompt: `Add a minimal ${title} improvement to a mini backend service and explain the trade-off.`, expectedSignals: ["Implements safely", "Explains trade-off"] },
    { id: `problem-node-${slug}-hard`, title: `${title} incident plan`, difficulty: "hard", tags: ["nodejs", slug, "incident"], prompt: `Write an incident response plan for a production issue involving ${title}.`, expectedSignals: ["Contains blast radius", "Defines rollback", "Defines verification"] }
  ];

  return {
    id: `syllabus-nodejs-${slug}`,
    slug,
    title,
    order,
    sourcePath: "00-control/master-roadmap/03-nodejs/INDEX.md",
    definition,
    whyItMatters: `${title} is a senior Node.js topic because it connects runtime knowledge to production reliability.`,
    mentalModel,
    theory: `${theory}\n\nVisual model: symptom -> measurement -> controlled change -> verification.`,
    codeExamples: [{ id: `example-node-${slug}`, title: `${title} senior example`, language: "javascript", code, explanation: `Production-oriented Node.js example for ${title}.`, runnable: true }],
    practiceProblems,
    interviewQuestions: [`How do you approach ${title} without guessing?`, `What trade-off matters most for ${title}?`, `How do you prove the change worked?`],
    commonMistakes: ["Changing production without measurement", "Ignoring graceful failure paths", "Optimizing at the wrong layer"],
    productionUseCases: ["Incident response", "SLO improvement", "Release safety", "Operational readiness"],
    revisionPrompts: [`Explain ${title} with one metric.`, `Name one rollback plan for ${title}.`, `Describe one failure mode.`],
    reviewPrompts: [{ id: `review-node-${slug}-mentor`, reviewerRole: "mentor", prompt: `Review ${title} as a senior backend interview answer.`, rubric: ["Evidence-based", "Trade-off aware", "Operationally safe"] }],
    references: [...seniorReferences, { id: `reference-node-${slug}-roadmap`, title: "EngineeringOS Node.js master roadmap", url: "00-control/master-roadmap/03-nodejs/INDEX.md", sourceType: "roadmap", usage: "Local source of truth for Node.js Phase 4 ordering." }],
    progressSignals: ["read_definition", "read_theory", "studied_code_example", "ran_code_example", "solved_easy_problem", "solved_medium_problem", "solved_hard_problem", "submitted_explain_back", "completed_mock_review", "scheduled_revision"]
  };
}

export const nodejsPhaseFourSeniorTopics: SyllabusTopic[] = [
  seniorTopic(13, "performance-tuning", "Performance Tuning", "Performance tuning improves Node.js latency, throughput, or resource use through measurement-driven changes.", "Profile first, change the bottleneck, measure again.", "Node performance issues often come from event-loop blocking, slow I/O, serialization, memory pressure, or dependency behavior. The 80/20 skill is choosing the right measurement before changing code.", "import { performance } from 'node:perf_hooks';\nconst start = performance.now();\nawait doWork();\nconsole.log({ durationMs: performance.now() - start });\n"),
  seniorTopic(14, "graceful-shutdown", "Graceful Shutdown", "Graceful shutdown stops accepting new work, lets in-flight work finish where safe, releases resources, and exits predictably.", "Shutdown is a controlled drain, not an abrupt disappearance.", "Node services should respond to SIGTERM/SIGINT, close servers, stop workers, end database pools, and enforce a timeout so deploys and containers behave safely.", "process.on('SIGTERM', async () => {\n  console.log('draining');\n  await server.close();\n  process.exit(0);\n});\n"),
  seniorTopic(15, "reliability-patterns", "Reliability Patterns", "Reliability patterns keep services useful under failure through timeouts, retries, circuit breakers, idempotency, and fallback behavior.", "Expect failure, bound it, and make retry safe.", "Senior Node.js systems avoid infinite waits, duplicate side effects, cascading failures, and silent data loss. Reliability is designed into calls, queues, and state transitions.", "async function withTimeout(promise, ms) {\n  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));\n  return Promise.race([promise, timeout]);\n}\n")
];
