import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const performanceReferences = [
  { id: "reference-performance-web-vitals", title: "web.dev Core Web Vitals", url: "https://web.dev/articles/vitals", sourceType: "docs" as const, usage: "User-experience performance metrics for loading, interactivity, and visual stability." },
  { id: "reference-performance-node-diagnostics", title: "Node.js Diagnostics", url: "https://nodejs.org/en/learn/diagnostics", sourceType: "docs" as const, usage: "Official Node.js guidance for profiling, memory, debugging, flame graphs, and production diagnostics." },
  { id: "reference-performance-google-sre-monitoring", title: "Google SRE Monitoring Distributed Systems", url: "https://sre.google/sre-book/monitoring-distributed-systems/", sourceType: "article" as const, usage: "SRE reference for metrics, monitoring, alerting, symptoms, causes, and user-impact signals." },
  { id: "reference-performance-aws-perf", title: "AWS Well-Architected Performance Efficiency Pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html", sourceType: "docs" as const, usage: "AWS-first performance architecture reference for compute, storage, database, network, and monitoring choices." }
];

function performanceProblems(slug: string, title: string): SyllabusPracticeProblem[] {
  return [
    { id: `problem-performance-${slug}-easy`, title: `${title} metric map`, difficulty: "easy", tags: ["performance", slug, "metrics"], prompt: `Define the user-facing symptom, one metric, one log, and one trace/span that would prove ${title}.`, expectedSignals: ["User symptom", "Metric", "Log", "Trace"] },
    { id: `problem-performance-${slug}-medium`, title: `${title} bottleneck diagnosis`, difficulty: "medium", tags: ["performance", slug, "profiling"], prompt: `Diagnose a slow backend endpoint. Include hypothesis, profiling data, bottleneck, fix, and verification plan.`, expectedSignals: ["Hypothesis", "Evidence", "Fix", "Verification"] },
    { id: `problem-performance-${slug}-hard`, title: `${title} scale review`, difficulty: "hard", tags: ["performance", slug, "load-testing"], prompt: `Prepare a performance review for a launch expected to 10x traffic. Include load testing, SLO, capacity, autoscaling, cache, database, and rollback decisions.`, expectedSignals: ["Load test", "SLO", "Capacity", "Rollback"] }
  ];
}

function performanceTopic(input: {
  order: number;
  slug: string;
  title: string;
  definition: string;
  mentalModel: string;
  theory: string;
  example: string;
  interviewQuestions: string[];
  commonMistakes: string[];
  productionUseCases: string[];
}): SyllabusTopic {
  return {
    id: `syllabus-performance-${input.slug}`,
    slug: input.slug,
    title: input.title,
    order: input.order,
    sourcePath: "00-control/master-roadmap/11-performance/INDEX.md",
    definition: input.definition,
    whyItMatters: `${input.title} connects backend skill, system design, production ownership, and solution architecture readiness.`,
    mentalModel: input.mentalModel,
    theory: `${input.theory}\n\nPerformance loop: define SLO -> measure symptom -> isolate bottleneck -> change one lever -> verify -> prevent regression.`,
    codeExamples: [{ id: `example-performance-${input.slug}`, title: `${input.title} runbook`, language: "text", code: input.example, explanation: `Operational checklist for ${input.title}.`, runnable: false }],
    practiceProblems: performanceProblems(input.slug, input.title),
    interviewQuestions: input.interviewQuestions,
    commonMistakes: input.commonMistakes,
    productionUseCases: input.productionUseCases,
    revisionPrompts: [`Explain ${input.title} with an SLO.`, `Name one metric/log/trace for ${input.title}.`, `Write one load-testing or profiling question.`],
    reviewPrompts: [{ id: `review-performance-${input.slug}`, reviewerRole: "mentor", prompt: `Review ${input.title} like a senior production-readiness answer.`, rubric: ["User impact is clear", "Evidence comes before optimization", "Trade-off is named", "Verification is measurable"] }],
    references: [...performanceReferences, { id: `reference-performance-${input.slug}-roadmap`, title: "EngineeringOS Performance master roadmap", url: "00-control/master-roadmap/11-performance/INDEX.md", sourceType: "roadmap", usage: "Local source path for first-class performance coverage." }],
    progressSignals: ["read_definition", "read_theory", "studied_code_example", "ran_code_example", "solved_easy_problem", "solved_medium_problem", "solved_hard_problem", "submitted_explain_back", "completed_mock_review", "scheduled_revision"]
  };
}

export const performanceEngineeringTopics: SyllabusTopic[] = [
  performanceTopic({
    order: 1,
    slug: "profiling-bottlenecks",
    title: "Profiling and Bottlenecks",
    definition: "Profiling measures where time, CPU, memory, I/O, or lock contention is spent so optimization targets evidence instead of guesses.",
    mentalModel: "Do not optimize the loudest opinion; optimize the measured bottleneck that affects users.",
    theory: "Use latency percentiles, CPU profiles, heap snapshots, database explain plans, event-loop delay, and traces. A senior answer separates client latency, network latency, app CPU, DB time, queue wait, and downstream service time.",
    example: "Runbook:\n1. Confirm p95/p99 regression\n2. Split latency by service, DB, cache, downstream\n3. Capture CPU/heap/profile data\n4. Identify top bottleneck\n5. Apply one change\n6. Compare before/after and watch error rate",
    interviewQuestions: ["How do you debug a slow API?", "Average latency vs p95?", "How do heap snapshots help?", "What is event-loop delay?"],
    commonMistakes: ["Optimizing without baseline", "Only checking average latency", "Ignoring database time", "No rollback plan"],
    productionUseCases: ["Slow API triage", "Node.js CPU issues", "Database hotspots", "Launch readiness"]
  }),
  performanceTopic({
    order: 2,
    slug: "load-testing-capacity",
    title: "Load Testing and Capacity",
    definition: "Load testing and capacity planning verify that a system can handle expected traffic, peak traffic, and failure-mode traffic within its SLOs.",
    mentalModel: "Capacity is a promise backed by measurements, limits, and a plan for what happens at the edge.",
    theory: "Know baseline, stress, spike, soak, and failover tests. Include arrival rate, concurrency, data shape, cache warmth, downstream limits, autoscaling lag, and cost boundaries. A good test reflects real user behavior, not only synthetic happy paths.",
    example: "Launch test plan:\n- Target: 500 RPS steady, 1500 RPS peak\n- SLO: p95 < 300ms, error < 0.5%\n- Scenarios: login, search, checkout, retry storm\n- Watch: CPU, memory, DB connections, queue depth, cache hit rate\n- Exit: pass, tune, or rollback launch",
    interviewQuestions: ["Stress vs soak test?", "What metrics prove capacity?", "How do retries distort load?", "How do you test failover?"],
    commonMistakes: ["Unrealistic test data", "Ignoring downstream quotas", "No warm/cold cache distinction", "No cost guardrail"],
    productionUseCases: ["Launch planning", "Autoscaling validation", "Incident prevention", "AWS architecture review"]
  }),
  performanceTopic({
    order: 3,
    slug: "observability-slo-tracing",
    title: "Observability SLOs and Tracing",
    definition: "Observability combines metrics, logs, traces, and SLOs so teams can understand system behavior and user impact from production signals.",
    mentalModel: "Metrics tell what changed, traces show where time went, logs explain why, and SLOs say whether users are hurt.",
    theory: "Design golden signals: latency, traffic, errors, saturation. Add business metrics where technical success can still fail the user. Tracing matters for distributed systems because bottlenecks cross service boundaries. Alerts should page on symptoms, not every possible cause.",
    example: "Service dashboard:\n- SLO: 99.9% successful checkout under 800ms\n- Metrics: p95 latency, error rate, throughput, saturation\n- Logs: structured request/payment/provider IDs\n- Traces: API -> inventory -> payment -> ledger\n- Alerts: burn-rate alert on user-impacting failures",
    interviewQuestions: ["Metrics vs logs vs traces?", "What is an SLO?", "What should page a human?", "How do you trace payment latency?"],
    commonMistakes: ["No correlation IDs", "Alerting on noisy causes", "No business metric", "Logs without structure"],
    productionUseCases: ["Distributed tracing", "Incident response", "SRE reviews", "Payment/booking HLD"]
  }),
  performanceTopic({
    order: 4,
    slug: "caching-performance",
    title: "Caching for Performance",
    definition: "Caching stores expensive or frequently read data closer to the caller to reduce latency, cost, and backend load.",
    mentalModel: "A cache is a speed lever with a correctness bill attached.",
    theory: "Know cache-aside, write-through, write-behind, TTL, invalidation, stampede protection, hot keys, freshness, and eviction. In interviews, always name what can be stale, for how long, and what happens on cache failure.",
    example: "Cache-aside checklist:\n1. Read Redis by key\n2. On miss, read DB\n3. Store with TTL and jitter\n4. Protect hot keys with request coalescing\n5. Define stale-data tolerance\n6. Monitor hit rate, evictions, memory, and DB fallback load",
    interviewQuestions: ["Cache-aside vs write-through?", "How do you prevent cache stampede?", "What is a hot key?", "When is stale data acceptable?"],
    commonMistakes: ["No TTL", "No invalidation story", "Caching sensitive data unsafely", "Ignoring fallback load"],
    productionUseCases: ["Feed systems", "Product catalogs", "Rate limits", "Read-heavy APIs"]
  })
];
