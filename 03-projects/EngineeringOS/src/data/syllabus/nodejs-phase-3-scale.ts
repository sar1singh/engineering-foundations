import type { SyllabusTopic } from "@/types/syllabus";

const scaleReferences = [
  { id: "reference-node-scale-cluster", title: "Node.js Cluster API", url: "https://nodejs.org/api/cluster.html", sourceType: "docs" as const, usage: "Official reference for multi-process Node.js workers and worker lifecycle." },
  { id: "reference-node-scale-worker-threads", title: "Node.js Worker Threads API", url: "https://nodejs.org/api/worker_threads.html", sourceType: "docs" as const, usage: "Official reference for CPU-bound work in JavaScript threads." },
  { id: "reference-node-scale-timers", title: "Node.js Timers API", url: "https://nodejs.org/api/timers.html", sourceType: "docs" as const, usage: "Official reference for scheduling worker loops and delayed retries." },
  { id: "reference-node-scale-redis-rate-limit", title: "Redis rate limiting patterns", url: "https://redis.io/redis-best-practices/basic-rate-limiting/", sourceType: "article" as const, usage: "Reference for Redis-backed rate limiting approaches in backend systems." }
];

function topic(order: number, slug: string, title: string, definition: string, mentalModel: string, theory: string, code: string): SyllabusTopic {
  return {
    id: `syllabus-nodejs-${slug}`,
    slug,
    title,
    order,
    sourcePath: "00-control/master-roadmap/03-nodejs/INDEX.md",
    definition,
    whyItMatters: `${title} is a Node.js scale topic used when one process or one request path is not enough.`,
    mentalModel,
    theory: `${theory}\n\nVisual model: input load -> scheduling/parallelism/control -> bounded resource usage.`,
    codeExamples: [{ id: `example-node-${slug}`, title: `${title} example`, language: "javascript", code, explanation: `Small Node.js example for ${title}.`, runnable: true }],
    practiceProblems: [
      { id: `problem-node-${slug}-easy`, title: `${title} concept lab`, difficulty: "easy", tags: ["nodejs", slug, "local-lab"], prompt: `Build a tiny local lab showing the core ${title} behavior.`, expectedSignals: ["Runs locally", "Explains trade-off"] },
      { id: `problem-node-${slug}-medium`, title: `${title} mini backend`, difficulty: "medium", tags: ["nodejs", slug, "mini-backend-project"], prompt: `Add ${title} to a mini backend flow with failure handling.`, expectedSignals: ["Controls resource usage", "Handles failure"] },
      { id: `problem-node-${slug}-hard`, title: `${title} scaling decision`, difficulty: "hard", tags: ["nodejs", slug, "system-design"], prompt: `Decide whether ${title} fits a production scaling problem. Include alternatives and risks.`, expectedSignals: ["Compares alternatives", "Names operational risk"] }
    ],
    interviewQuestions: [`When would you use ${title}?`, `What can go wrong with ${title}?`, `How would you monitor ${title} in production?`],
    commonMistakes: ["Scaling before measuring", "Ignoring failure handling", "Creating unbounded concurrency"],
    productionUseCases: ["Throughput scaling", "CPU isolation", "Background jobs", "Abuse protection"],
    revisionPrompts: [`Explain ${title} with one production trade-off.`, `Build one ${title} local lab.`, `Name one monitoring signal for ${title}.`],
    reviewPrompts: [{ id: `review-node-${slug}-self`, reviewerRole: "self", prompt: `Review ${title} for correctness and scale trade-offs.`, rubric: ["Use case fits", "Failure mode is named", "Monitoring is included"] }],
    references: [...scaleReferences, { id: `reference-node-${slug}-roadmap`, title: "EngineeringOS Node.js master roadmap", url: "00-control/master-roadmap/03-nodejs/INDEX.md", sourceType: "roadmap", usage: "Local source of truth for Node.js Phase 3 ordering." }],
    progressSignals: ["read_definition", "read_theory", "studied_code_example", "ran_code_example", "solved_easy_problem", "solved_medium_problem", "solved_hard_problem", "submitted_explain_back", "completed_mock_review", "scheduled_revision"]
  };
}

export const nodejsPhaseThreeScaleTopics: SyllabusTopic[] = [
  topic(9, "clustering", "Clustering", "Clustering runs multiple Node.js worker processes so a service can use multiple CPU cores.", "One primary coordinates several worker processes; each worker has its own event loop.", "Clustering helps CPU utilization for request-serving processes, but it introduces worker lifecycle, sticky session, graceful restart, and shared-state concerns.", "import cluster from 'node:cluster';\nimport os from 'node:os';\nif (cluster.isPrimary) {\n  os.cpus().forEach(() => cluster.fork());\n} else {\n  console.log(`worker ${process.pid}`);\n}\n"),
  topic(10, "worker-threads", "worker_threads", "worker_threads run JavaScript in separate threads for CPU-heavy work without blocking the main event loop.", "Move expensive computation out of the request event loop and communicate by messages.", "Worker threads fit CPU-bound tasks, not ordinary I/O. They add serialization, lifecycle, and resource-management complexity.", "import { Worker, isMainThread, parentPort } from 'node:worker_threads';\nif (isMainThread) {\n  new Worker(new URL(import.meta.url));\n} else {\n  parentPort?.postMessage('done');\n}\n"),
  topic(11, "queue-workers", "Queue Workers", "Queue workers process background jobs outside the request-response path.", "Requests enqueue durable work; workers pull, process, retry, and mark completion.", "Queues smooth traffic spikes and isolate slow work, but need idempotency, retry limits, dead-letter handling, and observability.", "async function worker(queue) {\n  for await (const job of queue) {\n    await processJob(job);\n  }\n}\n"),
  topic(12, "rate-limiting", "Rate Limiting", "Rate limiting controls how often a client, user, or key can perform an action within a time window.", "Let legitimate traffic through while bounding abuse and accidental overload.", "Common algorithms include fixed window, sliding window, token bucket, and leaky bucket. Redis is often used for shared counters and TTLs across instances.", "function allow(counter, limit) {\n  counter.count += 1;\n  return counter.count <= limit;\n}\n")
];
