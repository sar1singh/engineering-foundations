import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const backendReferences = [
  {
    id: "reference-node-backend-errors",
    title: "Node.js Errors API",
    url: "https://nodejs.org/api/errors.html",
    sourceType: "docs" as const,
    usage: "Official reference for Node.js error propagation, operational errors, and error object details."
  },
  {
    id: "reference-node-backend-owasp-validation",
    title: "OWASP Input Validation Cheat Sheet",
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html",
    sourceType: "docs" as const,
    usage: "Security reference for syntactic and semantic validation at trust boundaries."
  },
  {
    id: "reference-node-backend-owasp-logging",
    title: "OWASP Logging Cheat Sheet",
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html",
    sourceType: "docs" as const,
    usage: "Security reference for useful, safe, and injection-resistant application logging."
  },
  {
    id: "reference-node-backend-process",
    title: "Node.js process API",
    url: "https://nodejs.org/api/process.html",
    sourceType: "docs" as const,
    usage: "Official reference for environment variables, process state, signals, and runtime configuration."
  }
];

function problems(slug: string, title: string): SyllabusPracticeProblem[] {
  return [
    {
      id: `problem-node-${slug}-easy`,
      title: `${title} local lab`,
      difficulty: "easy",
      tags: ["nodejs", slug, "local-lab"],
      prompt: `Write a small Node.js handler that demonstrates ${title}. Include the happy path and one failure path.`,
      expectedSignals: ["Implements the core pattern", "Explains failure behavior"]
    },
    {
      id: `problem-node-${slug}-medium`,
      title: `${title} mini backend project`,
      difficulty: "medium",
      tags: ["nodejs", slug, "mini-backend-project"],
      prompt: `Add ${title} to a small backend endpoint. Show request input, response shape, and operational behavior.`,
      expectedSignals: ["Uses production-safe defaults", "Explains API contract", "Names one edge case"]
    },
    {
      id: `problem-node-${slug}-hard`,
      title: `${title} incident review`,
      difficulty: "hard",
      tags: ["nodejs", slug, "incident-review"],
      prompt: `Analyze an incident caused by weak ${title}. Write root cause, blast radius, fix, and prevention.`,
      expectedSignals: ["Connects code to incident impact", "Defines prevention", "Includes verification"]
    }
  ];
}

function topic(input: {
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
    whyItMatters: `${input.title} is a Node.js backend engineering skill that prevents fragile APIs and makes services operable.`,
    mentalModel: input.mentalModel,
    theory: `${input.theory}\n\nVisual model: ${input.visual}`,
    codeExamples: [{ id: `example-node-${input.slug}`, title: `${input.title} example`, language: "javascript", code: input.code, explanation: `Minimal Node.js backend example for ${input.title}.`, runnable: true }],
    practiceProblems: problems(input.slug, input.title),
    interviewQuestions: input.interviewQuestions,
    commonMistakes: input.commonMistakes,
    productionUseCases: input.productionUseCases,
    revisionPrompts: [`Explain ${input.title} with one backend failure mode.`, `Build one local lab for ${input.title}.`, `Name the verification signal for a good ${input.title} implementation.`],
    reviewPrompts: [
      { id: `review-node-${input.slug}-self`, reviewerRole: "self", prompt: `Review ${input.title} for correctness, security, and operability.`, rubric: ["Contract is clear", "Failure path is handled", "Security implication is named", "Verification exists"] },
      { id: `review-node-${input.slug}-mentor`, reviewerRole: "mentor", prompt: `Review this ${input.title} answer like a senior Node.js interviewer.`, rubric: ["Production-ready reasoning", "No hidden failure path", "Clear trade-off", "Measurable outcome"] }
    ],
    references: [...backendReferences, { id: `reference-node-${input.slug}-roadmap`, title: "EngineeringOS Node.js master roadmap", url: "00-control/master-roadmap/03-nodejs/INDEX.md", sourceType: "roadmap", usage: "Local source of truth for Node.js Phase 2 ordering." }],
    progressSignals: ["read_definition", "read_theory", "studied_code_example", "ran_code_example", "solved_easy_problem", "solved_medium_problem", "solved_hard_problem", "submitted_explain_back", "completed_mock_review", "scheduled_revision"]
  };
}

export const nodejsPhaseTwoBackendEngineeringTopics: SyllabusTopic[] = [
  topic({
    order: 5,
    slug: "error-handling",
    title: "Error Handling",
    definition: "Error handling is the design of predictable failure paths for synchronous errors, rejected promises, callback errors, and operational failures.",
    mentalModel: "Every backend path has a success contract and a failure contract.",
    visual: "operation -> expected failure -> typed/known response; unexpected failure -> log, contain, alert.",
    theory: "Node.js services must distinguish programmer bugs from operational errors. Good handlers preserve stack/context for logs while returning safe client responses.",
    code: "async function handler(req, res) {\n  try {\n    const user = await loadUser(req.params.id);\n    res.json(user);\n  } catch (error) {\n    console.error({ error, userId: req.params.id });\n    res.status(500).json({ error: 'Internal error' });\n  }\n}\n",
    interviewQuestions: ["How do you handle async errors in Node?", "What should be logged but not returned to clients?", "When should a process crash instead of continuing?"],
    commonMistakes: ["Swallowing errors", "Returning stack traces to clients", "Treating all errors as retryable"],
    productionUseCases: ["API handlers", "Job workers", "Database calls", "Third-party integrations"]
  }),
  topic({
    order: 6,
    slug: "validation",
    title: "Validation",
    definition: "Validation ensures incoming data is syntactically and semantically acceptable before business logic uses it.",
    mentalModel: "Do not let untrusted data cross the boundary uninspected.",
    visual: "request -> parse -> validate shape -> validate business rule -> handler.",
    theory: "Strong validation combines type/shape checks, length/range limits, allowlists, and business invariants. Client validation improves UX; server validation protects the system.",
    code: "function validateCreateUser(input) {\n  if (typeof input.email !== 'string' || !input.email.includes('@')) {\n    return { ok: false, error: 'Valid email is required' };\n  }\n  return { ok: true, value: { email: input.email.trim().toLowerCase() } };\n}\n",
    interviewQuestions: ["What is syntactic vs semantic validation?", "Why is client-side validation insufficient?", "Where should validation live in a backend service?"],
    commonMistakes: ["Trusting client validation", "Only checking types but not business rules", "Logging raw malicious input"],
    productionUseCases: ["Public APIs", "Form submissions", "Webhook ingestion", "Queue payloads"]
  }),
  topic({
    order: 7,
    slug: "logging",
    title: "Logging",
    definition: "Logging records structured runtime events so engineers can understand behavior, diagnose incidents, and audit important actions.",
    mentalModel: "Logs are evidence for future debugging, not a place to dump everything.",
    visual: "event -> structured fields -> sanitized log -> search/alert/dashboard.",
    theory: "Useful backend logs include event name, correlation/request id, actor, outcome, latency, and safe error context. Avoid secrets, personal data, and log injection.",
    code: "function logRequest(req, status, durationMs) {\n  console.log(JSON.stringify({ event: 'http_request', requestId: req.id, method: req.method, status, durationMs }));\n}\n",
    interviewQuestions: ["What should every request log include?", "What must never be logged?", "How do logs help during incidents?"],
    commonMistakes: ["Logging secrets", "Unstructured string-only logs", "No correlation id", "Too much noisy logging"],
    productionUseCases: ["Incident debugging", "Audit trails", "Latency analysis", "Security monitoring"]
  }),
  topic({
    order: 8,
    slug: "config-management",
    title: "Config Management",
    definition: "Config management separates environment-specific values from code and validates required runtime settings at startup.",
    mentalModel: "Config is part of the application contract; fail fast when required config is missing.",
    visual: "environment -> config loader -> validation -> typed app config.",
    theory: "Backend services should centralize config access, validate required values, provide safe defaults where appropriate, and avoid scattering process.env throughout business logic.",
    code: "function loadConfig(env = process.env) {\n  const port = Number(env.PORT ?? 3000);\n  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required');\n  return { port, databaseUrl: env.DATABASE_URL };\n}\n",
    interviewQuestions: ["Why validate config at startup?", "How do you handle secrets safely?", "Why avoid reading process.env everywhere?"],
    commonMistakes: ["Missing startup validation", "Committing secrets", "Using different config names across modules"],
    productionUseCases: ["Deployment environments", "Feature flags", "Database connections", "Service credentials"]
  })
];
