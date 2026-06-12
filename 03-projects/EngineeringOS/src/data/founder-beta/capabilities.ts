import type { Capability, FounderBetaPath, MissionType, ProofType, Skill } from "@/types/founder-beta";
import { dsaSkills } from "@/data/founder-beta/dsa-skills";

type CapabilitySeed = Omit<Capability, "targetRoles"> & {
  targetRoles?: Capability["targetRoles"];
};

const architectRoles: Capability["targetRoles"] = [
  "solution-architect",
  "em-aware-lead-backend",
  "lead-backend",
  "principal-engineer",
  "staff-engineer"
];

const capability = (seed: CapabilitySeed): Capability => ({
  ...seed,
  targetRoles: seed.targetRoles ?? architectRoles
});

const skill = (
  id: string,
  capabilityId: string,
  name: string,
  description: string,
  topicIds: string[],
  proofTypes: ProofType[]
): Skill => ({
  id,
  name,
  capabilityId,
  description,
  topicIds,
  proofTypes
});

const technicalMissions: MissionType[] = ["learn", "practice", "implement", "interview", "revision", "weak-area-repair"];
const proofBackedMissions: MissionType[] = ["implement", "interview", "architecture-case-study", "revision", "weak-area-repair"];

export const founderBetaSkills: Skill[] = [
  skill("skill-api-contract-design", "cap-node-backend", "API contract design", "Design REST/resource contracts, versioning, errors, pagination, and idempotent boundaries.", ["topic-api-design", "topic-api-versioning", "topic-idempotency-keys"], ["lld", "architecture-review"]),
  skill("skill-backend-service-structure", "cap-node-backend", "Backend service structure", "Structure backend services for configuration, logging, errors, validation, and maintainability.", ["topic-service-boundaries", "topic-error-handling", "topic-configuration-management"], ["lld", "case-study"]),
  skill("skill-node-production-backend", "cap-node-backend", "Production Node.js backend design", "Design Node.js APIs with runtime, reliability, security, and testing awareness.", ["topic-node-runtime", "topic-node-async-event-loop", "topic-node-streams-backpressure", "topic-node-testing-strategy"], ["lld", "architecture-review"]),
  skill("skill-node-observability", "cap-node-backend", "Node.js observability and operations", "Apply logs, metrics, tracing, process behavior, and graceful shutdown patterns to Node services.", ["topic-node-logging", "topic-node-graceful-shutdown", "topic-observability-logs-metrics-traces"], ["incident-analysis", "architecture-review"]),
  skill("skill-auth-boundaries", "cap-security", "Authentication and authorization boundaries", "Model authn/authz, sessions, tokens, RBAC, secrets, and API security tradeoffs.", ["topic-authentication-authorization", "topic-oauth2-oidc", "topic-jwt-sessions", "topic-rbac-abac"], ["architecture-review", "aws-design"]),
  skill("skill-threat-modeling", "cap-security", "Threat modeling", "Identify risks, controls, abuse cases, secrets exposure, and least-privilege requirements.", ["topic-threat-modeling", "topic-api-security", "topic-aws-iam-basics", "topic-secrets-management"], ["architecture-review", "case-study"]),
  skill("skill-hld-requirements", "cap-system-design-hld", "HLD requirements framing", "Turn ambiguous prompts into requirements, constraints, APIs, data, scale, and tradeoffs.", ["topic-hld-requirements", "topic-hld-capacity-estimation", "topic-api-design"], ["hld", "architecture-review"]),
  skill("skill-hld-tradeoffs", "cap-system-design-hld", "HLD tradeoff analysis", "Frame bottlenecks, scaling paths, storage choices, consistency, and failure modes.", ["topic-caching", "topic-load-balancing", "topic-queues", "topic-architecture-tradeoffs"], ["hld", "architecture-review"]),
  skill("skill-hld-interview-execution", "cap-system-design-hld", "HLD interview execution", "Produce structured system design answers under interview constraints.", ["topic-hld-interview-structure", "topic-notification-system-design", "topic-large-scale-learning-platform-case-study"], ["hld", "behavioral-answer"]),
  skill("skill-distributed-consistency", "cap-distributed-systems", "Distributed consistency", "Explain consistency, replication, idempotency, retries, and failure tradeoffs.", ["topic-consistency-models", "topic-replication-partitioning", "topic-idempotency-keys", "topic-retries-backoff"], ["hld", "architecture-review"]),
  skill("skill-async-architecture", "cap-distributed-systems", "Asynchronous architecture", "Use queues, events, outbox, fanout, and workflow patterns safely.", ["topic-queues", "topic-event-driven-architecture", "topic-outbox-pattern", "topic-saga-workflows"], ["hld", "aws-design"]),
  skill("skill-data-modeling", "cap-databases", "Data modeling", "Model relational and NoSQL data for access patterns, consistency, and performance.", ["topic-postgres-schema-design", "topic-dynamodb-data-modeling", "topic-data-partitioning"], ["architecture-review", "case-study"]),
  skill("skill-data-access-performance", "cap-databases", "Data access and performance", "Explain indexing, query planning, caching, transactions, and performance tradeoffs.", ["topic-database-indexing", "topic-postgres-query-planning", "topic-redis-caching", "topic-transactions-isolation"], ["architecture-review", "case-study"]),
  skill("skill-reliability-engineering", "cap-reliability-observability", "Reliability engineering", "Define SLOs, failure modes, incident response, and graceful degradation.", ["topic-slos-slas", "topic-failure-modes", "topic-incident-response", "topic-graceful-degradation"], ["incident-analysis", "architecture-review"]),
  skill("skill-observability-design", "cap-reliability-observability", "Observability design", "Design logs, metrics, traces, dashboards, alerts, and runbooks.", ["topic-observability-logs-metrics-traces", "topic-alerting-runbooks", "topic-cloudwatch-observability", "topic-cloudwatch-deep", "topic-cloudtrail-auditing"], ["incident-analysis", "aws-design"]),
  skill("skill-aws-foundations", "cap-aws-cloud-architecture", "AWS foundations", "Explain IAM, VPC, compute, storage, networking, and managed service boundaries.", ["topic-aws-iam-basics", "topic-aws-vpc-networking", "topic-aws-compute-options", "topic-aws-s3-basics"], ["aws-design", "architecture-review"]),
  skill("skill-aws-architecture-review", "cap-aws-cloud-architecture", "AWS architecture review", "Review cloud architecture using reliability, security, operations, cost, and performance lenses.", ["topic-aws-well-architected", "topic-aws-multi-az-design", "topic-aws-cost-performance-tradeoffs", "topic-aws-cost-optimization", "topic-aws-security-architecture"], ["aws-design", "architecture-review"]),
  skill("skill-aws-data-messaging", "cap-aws-cloud-architecture", "AWS data and messaging architecture", "Choose RDS, DynamoDB, S3, SQS, SNS, EventBridge, and cache services for workloads.", ["topic-aws-rds-basics", "topic-aws-dynamodb-basics", "topic-aws-sqs-sns-eventbridge", "topic-aws-cloudfront-cdn", "topic-eventbridge-deep", "topic-sqs-deep", "topic-sns-deep", "topic-step-functions-design"], ["aws-design", "hld"]),
  skill("skill-lld-api-modeling", "cap-low-level-design", "LLD API and class modeling", "Model interfaces, classes, errors, and extension points for backend systems.", ["topic-lld-api-contracts", "topic-lld-rate-limiter", "topic-lld-cache-design"], ["lld", "coding-solution"]),
  skill("skill-lld-workflow-modeling", "cap-low-level-design", "LLD workflow modeling", "Design workflow engines, schedulers, and state machines with clear boundaries.", ["topic-lld-workflow-engine", "topic-lld-scheduler", "topic-saga-workflows"], ["lld", "case-study"]),
  skill("skill-dsa-patterns", "cap-dsa-problem-solving", "Senior backend DSA patterns", "Use arrays, strings, hashing, two pointers, sliding window, trees, graphs, heaps, greedy, and selective DP.", ["topic-dsa-arrays-hashing", "topic-dsa-two-pointers-sliding-window", "topic-dsa-trees-graphs", "topic-dsa-heaps-greedy-dp"], ["coding-solution"]),
  skill("skill-dsa-communication", "cap-dsa-problem-solving", "DSA interview communication", "Explain approach, complexity, edge cases, and tradeoffs clearly.", ["topic-dsa-complexity-analysis", "topic-dsa-interview-communication"], ["coding-solution", "behavioral-answer"]),
  skill("skill-senior-storytelling", "cap-behavioral-communication", "Senior-level storytelling", "Convert real work into STAR stories with ownership, tradeoffs, metrics, and follow-ups.", ["topic-behavioral-star-stories", "topic-ownership-story", "topic-incident-story"], ["behavioral-answer", "case-study"]),
  skill("skill-communication-tradeoffs", "cap-behavioral-communication", "Architecture communication", "Communicate design decisions, tradeoffs, risks, and follow-up answers concisely.", ["topic-communication-tradeoffs", "topic-architecture-review-communication", "topic-stakeholder-update"], ["architecture-review", "behavioral-answer"]),
  skill("skill-delivery-risk", "cap-delivery-leadership", "Delivery and risk leadership", "Communicate delivery risk, coordinate dependencies, and show senior ownership.", ["topic-delivery-risk-communication", "topic-cross-team-dependency-management", "topic-mentoring-senior-engineers"], ["behavioral-answer", "incident-analysis"]),
  skill("skill-incident-leadership", "cap-delivery-leadership", "Incident leadership", "Turn production incidents into leadership, prevention, and architecture-improvement evidence.", ["topic-incident-response", "topic-incident-story", "topic-postmortem-writing"], ["incident-analysis", "behavioral-answer"]),
  skill("skill-case-study-hld", "cap-architecture-case-studies", "Architecture case study HLD", "Create HLD artifacts from EngineeringOS, Agent-OS, and learning-platform systems.", ["topic-engineeringos-architecture-case-study", "topic-agent-os-architecture-case-study", "topic-large-scale-learning-platform-case-study"], ["hld", "case-study"]),
  skill("skill-case-study-review", "cap-architecture-case-studies", "Case study architecture review", "Convert case studies into tradeoff, AWS, reliability, and behavioral proof.", ["topic-case-study-tradeoff-review", "topic-case-study-behavioral-narrative", "topic-aws-well-architected"], ["architecture-review", "aws-design", "behavioral-answer"]),
  skill("skill-architect-positioning", "cap-career-assets", "Architect positioning", "Shape resume, LinkedIn, GitHub, and portfolio artifacts toward Solution Architect readiness.", ["topic-resume-positioning", "topic-linkedin-positioning", "topic-github-portfolio-positioning"], ["resume-review", "case-study"]),
  skill("skill-proof-of-work-packaging", "cap-career-assets", "Proof-of-work packaging", "Package case studies and project evidence into recruiter/interview-ready assets.", ["topic-portfolio-case-study-packaging", "topic-github-proof-of-work", "topic-case-study-tradeoff-review"], ["github-project", "case-study"]),
  skill("skill-offer-gates", "cap-offer-readiness", "Offer readiness gates", "Track hard gates, case studies, compensation targets, and application readiness separately.", ["topic-application-readiness-gates", "topic-compensation-targeting", "topic-referral-outreach"], ["resume-review", "behavioral-answer", "case-study"]),
  skill("skill-interview-pipeline", "cap-offer-readiness", "Interview pipeline readiness", "Prepare application, referral, pipeline, follow-up, and negotiation workflow.", ["topic-application-tracker", "topic-interview-pipeline-management", "topic-negotiation-awareness"], ["resume-review", "behavioral-answer"]),

  // ── Roadmap Pack 1: JavaScript / Node.js Depth Skills ────────────────
  skill("skill-js-language-core", "cap-node-backend", "JavaScript language core", "Master closures, prototypes, scope, hoisting, this binding, modules, memory management, and type coercion.", [
    "topic-js-closures-scope", "topic-js-prototypes-inheritance", "topic-js-this-binding",
    "topic-js-hoisting-tdz", "topic-js-modules-cjs-esm", "topic-js-memory-management",
    "topic-js-type-coercion", "topic-ts-type-system", "topic-ts-generics-basics"
  ], ["coding-solution"]),
  skill("skill-js-async-programming", "cap-node-backend", "JavaScript async programming", "Deep-dive into event loop, promises, async/await, generators, iterators, and the microtask queue.", [
    "topic-js-event-loop", "topic-js-promises-async-await", "topic-js-generators-iterators"
  ], ["coding-solution"]),
  skill("skill-js-testing-frameworks", "cap-node-backend", "JavaScript testing frameworks", "Apply Vitest, jest patterns, mocking, spies, stubs, and test coverage strategies.", [
    "topic-js-unit-testing-patterns", "topic-js-mocking-techniques", "topic-js-test-coverage"
  ], ["coding-solution", "lld"]),
  skill("skill-node-advanced-runtime", "cap-node-backend", "Node.js advanced runtime", "Leverage worker threads, child processes, buffers, file system I/O, HTTP/WebSocket, cluster, and process signals.", [
    "topic-node-worker-threads", "topic-node-child-processes", "topic-node-buffer-typedarray",
    "topic-node-fs-io-deep", "topic-node-http-websocket", "topic-node-cluster", "topic-node-process-signals"
  ], ["lld", "architecture-review"]),

  // ── Roadmap Pack 3 — Security Practice ────────────────────
  skill("skill-security-practice", "cap-security", "Security practice and exploit prevention", "Identify, prevent, and remediate OWASP Top 10 vulnerabilities, dependency risks, and security architecture gaps.", [
    "topic-owasp-top-10", "topic-xss-protection", "topic-csrf-protection",
    "topic-sql-injection-prevention", "topic-ssrf-prevention",
    "topic-rate-limiting-security", "topic-dependency-vuln-management",
    "topic-security-architecture-review"
  ], ["architecture-review", "aws-design"]),

  // ── Roadmap Pack 3 — Testing & QA ─────────────────────────
  skill("skill-testing-methodology", "cap-reliability-observability", "Testing methodology and QA automation", "Design testing strategies across unit, integration, contract, E2E, and performance layers with appropriate tooling.", [
    "topic-testing-unit-integration", "topic-testing-contract",
    "topic-testing-e2e", "topic-testing-pyramid",
    "topic-testing-mocking-strategies", "topic-testing-testability",
    "topic-testing-performance", "topic-testing-load",
    "topic-testing-reliability", "topic-testing-regression",
    "topic-testing-qa-automation"
  ], ["lld", "architecture-review"]),

  // ── Roadmap Pack 3 — Containerization / Docker ────────────
  skill("skill-container-orchestration", "cap-aws-cloud-architecture", "Containerization and orchestration", "Design container-based deployments with Docker, Compose, and Kubernetes for production workloads.", [
    "topic-docker-fundamentals", "topic-docker-images-layers",
    "topic-docker-networking", "topic-docker-volumes",
    "topic-docker-compose", "topic-container-security",
    "topic-docker-production-patterns", "topic-kubernetes-intro",
    "topic-container-deployment-tradeoffs"
  ], ["aws-design", "architecture-review"]),

  // ── Roadmap Pack 3 — Real-Time Systems ────────────────────
  skill("skill-real-time-architecture", "cap-distributed-systems", "Real-time system architecture", "Design WebSocket, SSE, Pub/Sub, streaming, and event-driven notification systems with ordering and backpressure awareness.", [
    "topic-websocket-deep", "topic-sse-events",
    "topic-pub-sub-systems", "topic-event-driven-design",
    "topic-notification-systems", "topic-presence-systems",
    "topic-chat-architecture", "topic-streaming-fundamentals",
    "topic-message-ordering-guarantees", "topic-backpressure-handling"
  ], ["hld", "architecture-review"]),

  // ── Roadmap Pack 4 — AWS Architecture Deep Dive ────────────
  skill("skill-aws-advanced-networking", "cap-aws-cloud-architecture", "AWS advanced networking and security architecture", "Design advanced AWS network topologies, IAM policies, multi-account strategies, and hybrid connectivity patterns.", [
    "topic-iam-deep-dive", "topic-multi-account-organization",
    "topic-vpc-advanced-architecture", "topic-transit-gateway-design",
    "topic-route53-architecture", "topic-elb-alb-nlb-comparison",
    "topic-aws-organizations-governance"
  ], ["aws-design", "architecture-review"]),
  skill("skill-aws-data-storage-architecture", "cap-aws-cloud-architecture", "AWS data and storage architecture", "Design advanced data storage solutions with S3, RDS, Aurora, DynamoDB, Lambda, Step Functions, and backup/DR patterns.", [
    "topic-s3-advanced-patterns", "topic-rds-advanced-patterns",
    "topic-aurora-architecture", "topic-dynamodb-advanced-patterns",
    "topic-lambda-architecture-deep", "topic-step-functions-design",
    "topic-aws-backup-dr-patterns"
  ], ["aws-design", "architecture-review"]),

  // ── Roadmap Pack 4 — Reliability Engineering ───────────────
  skill("skill-slo-error-budget", "cap-reliability-observability", "SLOs, error budgets, and reliability practice", "Design error budgets, incident management, on-call systems, PRRs, DR plans, HA designs, chaos experiments, capacity plans, and reliability reviews.", [
    "topic-error-budgets", "topic-incident-management-process",
    "topic-on-call-systems", "topic-production-readiness-reviews",
    "topic-disaster-recovery-deep", "topic-high-availability-design",
    "topic-chaos-engineering-practice", "topic-capacity-planning",
    "topic-reliability-reviews", "topic-runbook-design"
  ], ["incident-analysis", "architecture-review"]),

  // ── Roadmap Pack 4 — Platform Engineering ──────────────────
  skill("skill-platform-cicd", "cap-platform-engineering", "CI/CD and deployment pipeline architecture", "Design CI/CD architecture, GitHub Actions workflows, deployment pipelines, blue-green deployments, canary releases, and GitOps patterns.", [
    "topic-ci-cd-architecture", "topic-github-actions-deep",
    "topic-deployment-pipelines", "topic-blue-green-deployment",
    "topic-canary-deployment", "topic-gitops-patterns"
  ], ["architecture-review", "aws-design"]),
  skill("skill-platform-iac", "cap-platform-engineering", "Infrastructure as Code and provisioning", "Design Infrastructure as Code solutions with Terraform, manage state, modules, and secrets for production platforms.", [
    "topic-infrastructure-as-code", "topic-terraform-fundamentals",
    "topic-platform-secrets-management"
  ], ["aws-design", "architecture-review"]),
  skill("skill-platform-developer-experience", "cap-platform-engineering", "Developer experience and platform design", "Design internal developer platforms, golden paths, platform maturity models, and developer productivity metrics.", [
    "topic-internal-developer-platforms", "topic-golden-paths",
    "topic-platform-maturity-model", "topic-platform-engineering-metrics"
  ], ["architecture-review", "case-study"]),
  skill("skill-platform-service-ownership", "cap-platform-engineering", "Service ownership and platform teams", "Design service ownership models, team topologies, and platform team interaction patterns for scalable engineering organizations.", [
    "topic-service-ownership"
  ], ["architecture-review", "behavioral-answer"]),

  // ── Roadmap Pack 5: Behavioral Leadership & Staff Engineering ────────
  skill("skill-conflict-resolution", "cap-behavioral-communication", "Conflict resolution and influence", "Handle pushback, resolve disagreements, influence without authority, and navigate difficult conversations at senior and architect level.", [
    "topic-conflict-resolution", "topic-influence-without-authority", "topic-decision-making-frameworks"
  ], ["behavioral-answer"]),
  skill("skill-staff-leadership", "cap-delivery-leadership", "Staff engineering and technical leadership", "Demonstrate staff engineer scope, technical strategy, cross-org influence, engineering culture, and architectural vision.", [
    "topic-staff-engineer-scope", "topic-technical-strategy", "topic-cross-org-influence",
    "topic-engineering-culture", "topic-architectural-vision", "topic-mentoring-vs-sponsorship"
  ], ["behavioral-answer", "case-study"]),
  skill("skill-interview-story-mapping", "cap-behavioral-communication", "Interview story system", "Build a catalog of 10-15 interview-ready stories, tailor them to company loops, quantify metrics, and prepare follow-up answers.", [
    "topic-story-inventory", "topic-story-tailoring", "topic-story-metrics-quantification",
    "topic-follow-up-answer-preparation", "topic-leadership-story", "topic-failure-story", "topic-conflict-story"
  ], ["behavioral-answer", "case-study"]),
  skill("skill-personal-brand-building", "cap-career-assets", "Personal brand building", "Build architect-level visibility through personal branding, technical content creation, and conference speaking.", [
    "topic-personal-brand-building", "topic-content-creation-technical", "topic-conference-speaking"
  ], ["case-study", "resume-review"]),
  ...dsaSkills
];

export const founderBetaCapabilities: Capability[] = [
  capability({
    id: "cap-node-backend",
    name: "Backend Engineering / Node.js Production Backend",
    category: "technical",
    whyItMatters: "The founder's strongest existing leverage is senior backend delivery, API design, and Node.js production architecture.",
    priorityWeight: 13,
    readinessThreshold: 72,
    sourceCategories: ["official-docs", "roadmap", "github-repository"],
    sourceIds: ["backend-roadmap", "node-docs", "node-learn", "express-docs", "nodebestpractices", "js-mdn-guide", "js-javascript-info", "js-you-dont-know-js", "v8-docs", "vitest-docs", "typescript-docs", "node-testing"],
    roadmapDependencies: [],
    missionTypes: technicalMissions,
    proofTypes: ["lld", "architecture-review", "incident-analysis", "coding-solution"],
    skillIds: [
      "skill-api-contract-design", "skill-backend-service-structure",
      "skill-node-production-backend", "skill-node-observability",
      "skill-js-language-core", "skill-js-async-programming",
      "skill-js-testing-frameworks", "skill-node-advanced-runtime"
    ]
  }),
  capability({
    id: "cap-security",
    name: "Security",
    category: "technical",
    whyItMatters: "Solution Architects must reason about auth, authorization, threat models, IAM, secrets, and abuse cases.",
    priorityWeight: 8,
    readinessThreshold: 70,
    sourceCategories: ["official-docs", "security-guides"],
    sourceIds: ["owasp-cheat-sheets", "oauth-docs", "aws-iam-docs", "aws-well-architected", "portswigger-web-security", "snyk-vulnerability-db", "latacora-security-practices", "security-headers-guide"],
    roadmapDependencies: ["cap-node-backend"],
    missionTypes: technicalMissions,
    proofTypes: ["architecture-review", "aws-design", "case-study"],
    skillIds: ["skill-auth-boundaries", "skill-threat-modeling", "skill-security-practice"]
  }),
  capability({
    id: "cap-system-design-hld",
    name: "System Design / HLD",
    category: "technical",
    whyItMatters: "Architect readiness depends on structured HLD, scaling, failure modes, and tradeoff communication.",
    priorityWeight: 18,
    readinessThreshold: 75,
    sourceCategories: ["github-repository", "roadmap", "engineering-blog"],
    sourceIds: ["hld-system-design-primer", "hld-bytebytego", "hld-awesome-system-design", "hld-roadmap-system-design", "ddd-strategic-design", "db-migration-patterns", "architecture-decision-records", "engineering-blog-real-time", "distributed-systems-patterns"],
    roadmapDependencies: ["cap-node-backend", "cap-databases", "cap-distributed-systems"],
    missionTypes: proofBackedMissions,
    proofTypes: ["hld", "architecture-review", "case-study"],
    skillIds: ["skill-hld-requirements", "skill-hld-tradeoffs", "skill-hld-interview-execution"]
  }),
  capability({
    id: "cap-distributed-systems",
    name: "Distributed Systems",
    category: "technical",
    whyItMatters: "Architect loops require confident tradeoffs around consistency, queues, events, retries, partitions, and failures.",
    priorityWeight: 12,
    readinessThreshold: 72,
    sourceCategories: ["book", "engineering-blog", "github-repository"],
    sourceIds: ["dist-google-sre-book", "aws-builders-library", "hld-system-design-primer", "websocket-rfc", "streaming-systems-book"],
    roadmapDependencies: ["cap-node-backend", "cap-databases"],
    missionTypes: technicalMissions,
    proofTypes: ["hld", "architecture-review", "aws-design"],
    skillIds: ["skill-distributed-consistency", "skill-async-architecture", "skill-real-time-architecture"]
  }),
  capability({
    id: "cap-databases",
    name: "Databases / Data Access",
    category: "technical",
    whyItMatters: "Architect and backend interviews require strong indexing, caching, transaction, and data modeling tradeoffs.",
    priorityWeight: 11,
    readinessThreshold: 72,
    sourceCategories: ["official-docs", "book"],
    sourceIds: ["db-postgres-docs", "postgres-indexes-docs", "db-redis-docs", "aws-rds-docs", "aws-dynamodb-docs"],
    roadmapDependencies: ["cap-node-backend"],
    missionTypes: technicalMissions,
    proofTypes: ["architecture-review", "case-study", "aws-design"],
    skillIds: ["skill-data-modeling", "skill-data-access-performance"]
  }),
  capability({
    id: "cap-reliability-observability",
    name: "Reliability / Observability",
    category: "technical",
    whyItMatters: "Senior architect readiness requires SLOs, monitoring, incident response, and production diagnostic judgment.",
    priorityWeight: 10,
    readinessThreshold: 70,
    sourceCategories: ["book", "official-docs"],
    sourceIds: ["dist-google-sre-book", "google-sre-workbook", "opentelemetry-docs", "aws-cloudwatch-docs", "resilience4j-patterns", "martin-fowler-testing", "pact-docs", "k6-docs", "testing-library-docs", "cypress-docs", "google-testing-blog"],
    roadmapDependencies: ["cap-node-backend", "cap-distributed-systems"],
    missionTypes: technicalMissions,
    proofTypes: ["incident-analysis", "architecture-review", "aws-design"],
    skillIds: ["skill-reliability-engineering", "skill-observability-design", "skill-testing-methodology", "skill-slo-error-budget"]
  }),
  capability({
    id: "cap-aws-cloud-architecture",
    name: "AWS / Cloud Architecture",
    category: "technical",
    whyItMatters: "AWS architecture is the primary differentiator for the founder Solution Architect path.",
    priorityWeight: 20,
    readinessThreshold: 70,
    sourceCategories: ["official-docs", "roadmap", "engineering-blog"],
    sourceIds: ["aws-well-architected", "aws-docs", "aws-architecture-center", "aws-builders-library", "sa-roadmap-aws", "docker-docs", "kubernetes-docs"],
    roadmapDependencies: ["cap-system-design-hld", "cap-security", "cap-reliability-observability"],
    missionTypes: proofBackedMissions,
    proofTypes: ["aws-design", "architecture-review", "case-study"],
    skillIds: ["skill-aws-foundations", "skill-aws-architecture-review", "skill-aws-data-messaging", "skill-container-orchestration", "skill-aws-advanced-networking", "skill-aws-data-storage-architecture"]
  }),
  capability({
    id: "cap-low-level-design",
    name: "Low Level Design / API Contracts",
    category: "technical",
    whyItMatters: "Lead Backend and Architect interviews often test API, class, workflow, and extensibility design.",
    priorityWeight: 7,
    readinessThreshold: 68,
    sourceCategories: ["official-docs", "interview-guide"],
    sourceIds: ["ts-handbook", "nodebestpractices", "lld-grokking-oop", "ddd-strategic-design"],
    roadmapDependencies: ["cap-node-backend"],
    missionTypes: ["practice", "implement", "interview", "revision"],
    proofTypes: ["lld", "coding-solution", "case-study"],
    skillIds: ["skill-lld-api-modeling", "skill-lld-workflow-modeling"]
  }),
  capability({
    id: "cap-dsa-problem-solving",
    name: "DSA / Problem Solving",
    category: "technical",
    whyItMatters: "Senior backend interviews require pattern fluency, complexity analysis, and clear coding communication - now expanded with granular skills across 19 pattern categories and 75+ individual problem topics.",
    priorityWeight: 7,
    readinessThreshold: 68,
    sourceCategories: ["interview-guide", "roadmap", "github-repository", "practice-platform"],
    sourceIds: ["leetcode-patterns", "neetcode-roadmap", "geeksforgeeks-dsa", "educative-grokking-coding"],
    roadmapDependencies: [],
    missionTypes: ["practice", "interview", "revision", "weak-area-repair"],
    proofTypes: ["coding-solution"],
    skillIds: [
      "skill-dsa-patterns",
      "skill-dsa-communication",
      "skill-dsa-complexity-analysis",
      "skill-dsa-array-techniques",
      "skill-dsa-string-techniques",
      "skill-dsa-hashing-techniques",
      "skill-dsa-two-pointer-techniques",
      "skill-dsa-sliding-window-techniques",
      "skill-dsa-binary-search-techniques",
      "skill-dsa-linked-list-techniques",
      "skill-dsa-stack-techniques",
      "skill-dsa-queue-techniques",
      "skill-dsa-sorting-techniques",
      "skill-dsa-recursion-techniques",
      "skill-dsa-tree-techniques",
      "skill-dsa-bst-techniques",
      "skill-dsa-heap-techniques",
      "skill-dsa-greedy-techniques",
      "skill-dsa-backtracking-techniques",
      "skill-dsa-graph-techniques",
      "skill-dsa-dp-techniques"
    ]
  }),
  capability({
    id: "cap-behavioral-communication",
    name: "Behavioral & Communication",
    category: "behavioral-communication",
    whyItMatters: "Senior and architect loops require clear stories, ownership, conflict handling, and tradeoff communication.",
    priorityWeight: 9,
    readinessThreshold: 70,
    sourceCategories: ["interview-guide", "career-framework"],
    sourceIds: ["beh-tech-handbook", "beh-amazon-lp", "beh-mit-star", "staff-staffeng"],
    roadmapDependencies: [],
    missionTypes: ["behavioral", "interview", "revision", "career-asset", "weak-area-repair"],
    proofTypes: ["behavioral-answer", "case-study", "architecture-review"],
    skillIds: ["skill-senior-storytelling", "skill-communication-tradeoffs", "skill-conflict-resolution", "skill-interview-story-mapping"]
  }),
  capability({
    id: "cap-delivery-leadership",
    name: "Delivery & Leadership",
    category: "leadership",
    whyItMatters: "EM-aware architect positioning needs delivery risk, incident leadership, mentoring, and cross-team influence evidence.",
    priorityWeight: 8,
    readinessThreshold: 68,
    sourceCategories: ["career-framework", "engineering-blog"],
    sourceIds: ["staff-staffeng", "staff-engineers-path", "will-larson-staff", "dist-google-sre-book"],
    roadmapDependencies: ["cap-behavioral-communication"],
    missionTypes: ["behavioral", "interview", "career-asset", "revision"],
    proofTypes: ["behavioral-answer", "incident-analysis", "case-study"],
    skillIds: ["skill-delivery-risk", "skill-incident-leadership", "skill-staff-leadership"]
  }),
  capability({
    id: "cap-architecture-case-studies",
    name: "Architecture Case Studies",
    category: "career-assets",
    whyItMatters: "Case studies convert founder and prior work into reusable HLD, LLD, tradeoff, review, and behavioral proof.",
    priorityWeight: 15,
    readinessThreshold: 80,
    sourceCategories: ["official-docs", "github-repository", "career-framework"],
    sourceIds: ["aws-well-architected", "aws-architecture-center", "hld-system-design-primer", "staff-staffeng", "architecture-decision-records"],
    roadmapDependencies: ["cap-system-design-hld", "cap-aws-cloud-architecture", "cap-behavioral-communication"],
    missionTypes: ["architecture-case-study", "implement", "interview", "behavioral", "career-asset", "revision"],
    proofTypes: ["hld", "lld", "architecture-review", "aws-design", "behavioral-answer", "case-study"],
    skillIds: ["skill-case-study-hld", "skill-case-study-review"]
  }),
  capability({
    id: "cap-career-assets",
    name: "Career Assets",
    category: "career-assets",
    whyItMatters: "Resume, LinkedIn, GitHub, and portfolio assets turn readiness into visible offer-readiness proof.",
    priorityWeight: 8,
    readinessThreshold: 80,
    sourceCategories: ["interview-guide", "career-framework"],
    sourceIds: ["profile-tech-handbook-resume", "profile-google-resume", "github-profile-readme", "staff-staffeng"],
    roadmapDependencies: ["cap-architecture-case-studies", "cap-behavioral-communication"],
    missionTypes: ["career-asset", "architecture-case-study", "revision"],
    proofTypes: ["resume-review", "github-project", "case-study"],
    skillIds: ["skill-architect-positioning", "skill-proof-of-work-packaging", "skill-personal-brand-building"]
  }),
  capability({
    id: "cap-offer-readiness",
    name: "Offer Readiness",
    category: "offer-readiness",
    whyItMatters: "The founder beta succeeds only when readiness translates into credible applications, referrals, and offer strategy.",
    priorityWeight: 8,
    readinessThreshold: 75,
    sourceCategories: ["job-description", "career-framework"],
    sourceIds: ["career-linkedin-solution-architect-jobs", "career-linkedin-lead-backend-jobs", "career-levels", "career-ambitionbox", "career-haseeb-negotiation"],
    roadmapDependencies: ["cap-career-assets", "cap-behavioral-communication"],
    missionTypes: ["career-asset", "revision"],
    proofTypes: ["resume-review", "behavioral-answer", "case-study"],
    skillIds: ["skill-offer-gates", "skill-interview-pipeline"]
  }),
  capability({
    id: "cap-platform-engineering",
    name: "Platform Engineering",
    category: "technical",
    whyItMatters: "Solution Architects must design platforms, CI/CD pipelines, IaC, and developer experiences that enable engineering teams to ship reliably at scale.",
    priorityWeight: 9,
    readinessThreshold: 68,
    sourceCategories: ["official-docs", "engineering-blog"],
    sourceIds: ["terraform-docs", "github-actions-docs", "platform-engineering-guide", "backstage-docs", "accelerate-book", "gitops-patterns", "ci-cd-best-practices", "service-ownership-guide", "golden-paths-guide", "platform-maturity-model"],
    roadmapDependencies: ["cap-aws-cloud-architecture", "cap-system-design-hld"],
    missionTypes: technicalMissions,
    proofTypes: ["architecture-review", "aws-design", "case-study"],
    skillIds: ["skill-platform-cicd", "skill-platform-iac", "skill-platform-developer-experience", "skill-platform-service-ownership"]
  })
];

export const founderBetaPath: FounderBetaPath = {
  id: "founder-beta-solution-architect",
  name: "Founder Beta Solution Architect Path",
  currentProfile: "10+ YOE Senior / Lead Backend Engineer at approximately 40 LPA.",
  targetOutcome: "Solution Architect readiness for 70-80+ LPA Product / GCC / FAANG-level opportunities.",
  timelineWeeks: 16,
  hoursPerWeek: 10,
  primaryRole: "solution-architect",
  secondaryRole: "em-aware-lead-backend",
  capabilityIds: founderBetaCapabilities.map((item) => item.id),
  roadmapProjectionId: "founder-architect-beta-16-week",
  hardGateIds: [
    "rule-architect-readiness",
    "rule-aws-readiness",
    "rule-behavioral-readiness",
    "rule-communication-readiness",
    "rule-resume-readiness",
    "rule-architecture-case-studies"
  ],
  caseStudyTopicIds: [
    "topic-engineeringos-architecture-case-study",
    "topic-agent-os-architecture-case-study",
    "topic-large-scale-learning-platform-case-study"
  ]
};
