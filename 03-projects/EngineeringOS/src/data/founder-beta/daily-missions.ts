import type { DailyMission } from "@/types/founder-beta";

export const founderBetaDailyMissions: DailyMission[] = [
  {
    id: "mission-learn-aws-well-architected",
    missionType: "learn",
    objective: "Understand the AWS Well-Architected pillars and map them to Solution Architect interview expectations.",
    capabilityId: "cap-aws-cloud-architecture",
    topicId: "topic-aws-well-architected",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-load-balancing"],
    tasks: [
      {
        id: "task-read-pillars",
        description: "Review the pillars and write one founder-beta use case for each.",
        expectedOutput: "Five short pillar notes tied to EngineeringOS."
      }
    ],
    proofRequirements: [
      {
        id: "proof-aws-pillar-summary",
        proofType: "aws-design",
        title: "AWS Well-Architected pillar summary",
        requiredScore: 3,
        rubric: ["Covers all pillars", "Uses original wording", "Connects to a real architecture decision"]
      }
    ],
    readinessImpact: ["AWS Readiness", "Architect Readiness", "Knowledge"]
  },
  {
    id: "mission-practice-api-design",
    missionType: "practice",
    objective: "Draft an API contract for a roadmap projection endpoint.",
    capabilityId: "cap-node-backend",
    topicId: "topic-api-design",
    estimatedMinutes: 75,
    mode: "weekday",
    prerequisiteTopicIds: [],
    tasks: [
      {
        id: "task-api-contract",
        description: "Define request, response, error states, pagination, and versioning for a projection API.",
        expectedOutput: "API contract with edge cases and error handling."
      }
    ],
    proofRequirements: [
      {
        id: "proof-api-contract",
        proofType: "lld",
        title: "Roadmap projection API contract",
        requiredScore: 3,
        rubric: ["Clear inputs", "Clear response shape", "Failure states included", "Versioning considered"]
      }
    ],
    readinessImpact: ["Node.js Backend", "System Design Readiness", "Practice"]
  },
  {
    id: "mission-implement-rate-limiter",
    missionType: "implement",
    objective: "Design a rate limiter for a mission generation API.",
    capabilityId: "cap-system-design-hld",
    topicId: "topic-rate-limiting",
    estimatedMinutes: 90,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-api-design", "topic-redis-caching"],
    tasks: [
      {
        id: "task-rate-limiter-design",
        description: "Choose an algorithm, define keys/windows, and explain Redis failure handling.",
        expectedOutput: "LLD/HLD hybrid note with tradeoffs."
      }
    ],
    proofRequirements: [
      {
        id: "proof-rate-limiter",
        proofType: "lld",
        title: "Rate limiter design note",
        requiredScore: 3,
        rubric: ["Algorithm selected", "Redis tradeoffs covered", "Failure behavior explained", "Abuse cases considered"]
      }
    ],
    readinessImpact: ["System Design Readiness", "Implementation", "Interview Readiness"]
  },
  {
    id: "mission-interview-caching-tradeoffs",
    missionType: "interview",
    objective: "Answer a senior system-design prompt on cache placement, invalidation, and failure modes.",
    capabilityId: "cap-system-design-hld",
    topicId: "topic-caching",
    estimatedMinutes: 45,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-redis-caching"],
    tasks: [
      {
        id: "task-cache-answer",
        description: "Write or speak a concise answer covering cache-aside, TTL, invalidation, stampede, and fallback.",
        expectedOutput: "Interview-style answer with follow-up tradeoffs."
      }
    ],
    proofRequirements: [
      {
        id: "proof-caching-interview",
        proofType: "hld",
        title: "Caching tradeoff interview answer",
        requiredScore: 4,
        rubric: ["Structured answer", "Failure modes included", "Tradeoffs explicit", "Follow-ups handled"]
      }
    ],
    readinessImpact: ["Interview Readiness", "System Design Readiness", "Communication Readiness"]
  },
  {
    id: "mission-behavioral-star-ownership",
    missionType: "behavioral",
    objective: "Create an ownership STAR story from EngineeringOS or prior backend work.",
    capabilityId: "cap-behavioral-communication",
    topicId: "topic-behavioral-star-stories",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: [],
    tasks: [
      {
        id: "task-star-story",
        description: "Write context, personal role, action, tradeoffs, result, metrics, and two follow-up answers.",
        expectedOutput: "One interview-ready STAR story draft."
      }
    ],
    proofRequirements: [
      {
        id: "proof-ownership-story",
        proofType: "behavioral-answer",
        title: "Ownership STAR story",
        requiredScore: 4,
        rubric: ["Real experience", "Personal action clear", "Metrics included", "Reflection included", "Follow-ups ready"]
      }
    ],
    readinessImpact: ["Behavioral Readiness", "Communication Readiness", "Offer Readiness"]
  },
  {
    id: "mission-career-resume-positioning",
    missionType: "career-asset",
    objective: "Rewrite the top resume summary and three bullets for Solution Architect positioning.",
    capabilityId: "cap-career-assets",
    topicId: "topic-resume-positioning",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: [],
    tasks: [
      {
        id: "task-resume-bullets",
        description: "Draft one target-role summary and three architecture/impact bullets.",
        expectedOutput: "Resume summary plus three measurable senior-impact bullets."
      }
    ],
    proofRequirements: [
      {
        id: "proof-resume-positioning",
        proofType: "resume-review",
        title: "Solution Architect resume positioning",
        requiredScore: 4,
        rubric: ["Target role clear", "Architecture impact visible", "Metrics included", "No generic claims"]
      }
    ],
    readinessImpact: ["Resume Readiness", "Offer Readiness"]
  },
  {
    id: "mission-case-study-engineeringos-hld",
    missionType: "architecture-case-study",
    objective: "Create the first HLD artifact for the EngineeringOS Architecture case study.",
    capabilityId: "cap-career-assets",
    topicId: "topic-engineeringos-architecture-case-study",
    estimatedMinutes: 180,
    mode: "weekend",
    prerequisiteTopicIds: ["topic-api-design", "topic-load-balancing", "topic-aws-well-architected"],
    tasks: [
      {
        id: "task-engineeringos-hld",
        description: "Define requirements, modules, APIs, storage, scaling path, AWS deployment, and failure modes.",
        expectedOutput: "HLD artifact for EngineeringOS Architecture."
      },
      {
        id: "task-engineeringos-review",
        description: "Add a Well-Architected review with reliability, security, cost, operations, and performance notes.",
        expectedOutput: "Architecture review section attached to the case study."
      }
    ],
    proofRequirements: [
      {
        id: "proof-engineeringos-case-study",
        proofType: "case-study",
        title: "EngineeringOS Architecture case study HLD",
        requiredScore: 4,
        rubric: ["Requirements clear", "Architecture coherent", "AWS tradeoffs included", "Failure modes covered", "Interview narrative usable"]
      }
    ],
    readinessImpact: ["Architect Readiness", "AWS Readiness", "Communication Readiness", "Architecture Case Study Readiness"]
  },

  // ── Roadmap Pack 1: JS / Node Depth Missions ─────────────────────────
  {
    id: "mission-practice-js-closures-scope",
    missionType: "practice",
    objective: "Complete a series of closure and scope exercises to internalise lexical scoping, hoisting, and the module pattern.",
    capabilityId: "cap-node-backend",
    topicId: "topic-js-closures-scope",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: [],
    tasks: [
      {
        id: "task-js-closure-exercises",
        description: "Solve 5 closure/scope problems covering module pattern, loop closures, and block scoping.",
        expectedOutput: "Working solutions with explanations of scope chain resolution."
      }
    ],
    proofRequirements: [
      {
        id: "proof-js-closure-solutions",
        proofType: "coding-solution",
        title: "Closure and scope exercise solutions",
        requiredScore: 3,
        rubric: ["Correct output", "Scope explanation included", "All 5 problems attempted"]
      }
    ],
    readinessImpact: ["Node.js Backend", "Knowledge", "Practice"]
  },
  {
    id: "mission-practice-js-event-loop",
    missionType: "practice",
    objective: "Trace event loop execution order with mixed microtasks, macrotasks, and async/await to build mental model accuracy.",
    capabilityId: "cap-node-backend",
    topicId: "topic-js-event-loop",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-node-async-event-loop"],
    tasks: [
      {
        id: "task-event-loop-trace",
        description: "Trace 3 code snippets showing promise, setTimeout, and process.nextTick interleaving.",
        expectedOutput: "Correct execution order with phase-by-phase breakdown."
      }
    ],
    proofRequirements: [
      {
        id: "proof-event-loop-trace",
        proofType: "coding-solution",
        title: "Event loop trace answers",
        requiredScore: 4,
        rubric: ["Order matches V8/Node behaviour", "Phase labels correct", "Microtask vs macrotask distinction clear"]
      }
    ],
    readinessImpact: ["Node.js Backend", "Knowledge", "Interview Readiness"]
  },
  {
    id: "mission-implement-worker-threads",
    missionType: "implement",
    objective: "Design and implement a worker thread pool for CPU-bound task offloading in a Node.js service.",
    capabilityId: "cap-node-backend",
    topicId: "topic-node-worker-threads",
    estimatedMinutes: 90,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-node-runtime", "topic-node-streams-backpressure"],
    tasks: [
      {
        id: "task-worker-pool-design",
        description: "Define the worker pool interface, message protocol, error handling, and graceful shutdown.",
        expectedOutput: "LLD note with worker pool architecture and a proof-of-concept implementation sketch."
      }
    ],
    proofRequirements: [
      {
        id: "proof-worker-pool",
        proofType: "lld",
        title: "Worker thread pool design",
        requiredScore: 3,
        rubric: ["Pool interface defined", "Message protocol specified", "Error handling covered", "Graceful shutdown included"]
      }
    ],
    readinessImpact: ["Node.js Backend", "Implementation", "System Design Readiness"]
  },

  // ── Roadmap Pack 2: System Design / LLD Missions ─────────────────────
  {
    id: "mission-practice-domain-modeling",
    missionType: "practice",
    objective: "Model a payment billing bounded context using DDD aggregates, entities, and value objects.",
    capabilityId: "cap-low-level-design",
    topicId: "topic-ddd-aggregates-entities",
    estimatedMinutes: 75,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-ddd-bounded-contexts"],
    tasks: [
      {
        id: "task-domain-model",
        description: "Define the aggregate root, entities, value objects, and repository interfaces for a billing context.",
        expectedOutput: "Domain model sketch with aggregate boundaries, invariants, and Ubiquitous Language glossary."
      }
    ],
    proofRequirements: [
      {
        id: "proof-domain-model",
        proofType: "lld",
        title: "Billing bounded context domain model",
        requiredScore: 3,
        rubric: ["Aggregate root identified", "Entity vs value object distinction clear", "Ubiquitous Language defined", "Invariants documented"]
      }
    ],
    readinessImpact: ["System Design Readiness", "LLD Readiness", "Practice"]
  },
  {
    id: "mission-implement-circuit-breaker",
    missionType: "implement",
    objective: "Implement a circuit breaker wrapper for an external API call with fallback logic.",
    capabilityId: "cap-reliability-observability",
    topicId: "topic-circuit-breaker-pattern",
    estimatedMinutes: 90,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-retries-backoff"],
    tasks: [
      {
        id: "task-circuit-breaker-code",
        description: "Write a circuit breaker with closed/open/half-open states, failure threshold, timeout, and fallback handler.",
        expectedOutput: "Working circuit breaker implementation with unit tests and state transition logging."
      }
    ],
    proofRequirements: [
      {
        id: "proof-circuit-breaker",
        proofType: "coding-solution",
        title: "Circuit breaker implementation",
        requiredScore: 3,
        rubric: ["All three states implemented", "Failure threshold configurable", "Fallback handler provided", "Unit tests cover transitions"]
      }
    ],
    readinessImpact: ["Reliability Readiness", "Implementation", "System Design Readiness"]
  },
  {
    id: "mission-practice-hld-url-shortener",
    missionType: "practice",
    objective: "Design a URL shortener system covering write/read ratio, hashing strategy, caching, and database sharding.",
    capabilityId: "cap-system-design-hld",
    topicId: "topic-hld-url-shortener",
    estimatedMinutes: 75,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-hld-requirements", "topic-hld-capacity-estimation"],
    tasks: [
      {
        id: "task-url-shortener-hld",
        description: "Frame requirements, estimate scale, choose hash strategy, design read/write paths, and propose storage.",
        expectedOutput: "HLD note with capacity numbers, API contract, storage schema, and cache strategy."
      }
    ],
    proofRequirements: [
      {
        id: "proof-url-shortener",
        proofType: "hld",
        title: "URL shortener HLD",
        requiredScore: 3,
        rubric: ["Requirements framed", "Capacity estimated", "Hash strategy explained", "Read/write path clear", "Storage tradeoffs covered"]
      }
    ],
    readinessImpact: ["System Design Readiness", "HLD Readiness", "Interview Readiness"]
  },
  {
    id: "mission-design-hld-monitoring",
    missionType: "architecture-case-study",
    objective: "Design a distributed metrics and monitoring system covering collection, aggregation, storage, and alerting.",
    capabilityId: "cap-architecture-case-studies",
    topicId: "topic-hld-metrics-monitoring",
    estimatedMinutes: 120,
    mode: "weekend",
    prerequisiteTopicIds: ["topic-hld-requirements", "topic-observability-logs-metrics-traces"],
    tasks: [
      {
        id: "task-monitoring-hld",
        description: "Design the metrics pipeline: agents, aggregation tier, time-series storage, query layer, and alerting.",
        expectedOutput: "HLD artifact with data model, ingestion path, retention strategy, and alert routing."
      },
      {
        id: "task-monitoring-tradeoffs",
        description: "Document cardinality tradeoffs, sampling strategies, and failure modes for the monitoring pipeline.",
        expectedOutput: "Tradeoff analysis section attached to the case study."
      }
    ],
    proofRequirements: [
      {
        id: "proof-monitoring-hld",
        proofType: "hld",
        title: "Metrics and monitoring system HLD",
        requiredScore: 3,
        rubric: ["Pipeline stages defined", "Storage tradeoffs explained", "Cardinality addressed", "Alert routing designed", "Failure modes considered"]
      }
    ],
    readinessImpact: ["Architect Readiness", "System Design Readiness", "Observability Readiness", "Architecture Case Study Readiness"]
  },

  // ════════════════════════════════════════════════════════════
  // Roadmap Pack 3 — Missions
  // ════════════════════════════════════════════════════════════
  {
    id: "mission-practice-threat-model-exercise",
    missionType: "practice",
    objective: "Perform a threat model exercise for a multi-service backend feature.",
    capabilityId: "cap-security",
    topicId: "topic-security-architecture-review",
    estimatedMinutes: 75,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-threat-modeling", "topic-owasp-top-10"],
    tasks: [
      {
        id: "task-threat-model",
        description: "Choose a real or hypothetical feature (e.g., user file upload) and identify threats across STRIDE categories.",
        expectedOutput: "Threat model document with assets, threats, controls, and residual risks."
      }
    ],
    proofRequirements: [
      {
        id: "proof-threat-model",
        proofType: "architecture-review",
        title: "Feature threat model",
        requiredScore: 3,
        rubric: ["Assets identified", "Threats per STRIDE category", "Controls documented", "Residual risk assessed"]
      }
    ],
    readinessImpact: ["Security Readiness", "Architect Readiness", "Knowledge", "Practice"]
  },
  {
    id: "mission-practice-secure-api-review",
    missionType: "practice",
    objective: "Review an API design for common web vulnerabilities and document mitigations.",
    capabilityId: "cap-security",
    topicId: "topic-security-architecture-review",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-xss-protection", "topic-csrf-protection", "topic-sql-injection-prevention", "topic-ssrf-prevention"],
    tasks: [
      {
        id: "task-api-review",
        description: "Pick an existing API endpoint and evaluate it against XSS, CSRF, SQLi, SSRF, rate limiting, and authn/authz threats.",
        expectedOutput: "Security review checklist with findings and mitigation recommendations."
      }
    ],
    proofRequirements: [
      {
        id: "proof-api-review",
        proofType: "architecture-review",
        title: "API security review",
        requiredScore: 3,
        rubric: ["Covers OWASP categories", "Specific findings identified", "Mitigations actionable", "Auth boundaries considered"]
      }
    ],
    readinessImpact: ["Security Readiness", "Architect Readiness", "Practice"]
  },
  {
    id: "mission-implement-docker-compose",
    missionType: "implement",
    objective: "Dockerize a multi-service application with Compose for local development.",
    capabilityId: "cap-aws-cloud-architecture",
    topicId: "topic-docker-compose",
    estimatedMinutes: 90,
    mode: "weekend",
    prerequisiteTopicIds: ["topic-docker-fundamentals", "topic-docker-networking"],
    tasks: [
      {
        id: "task-compose-setup",
        description: "Create a Docker Compose file for a web app, API, database, and cache service with networking and volumes.",
        expectedOutput: "docker-compose.yml with at least 3 services, custom network, and persistent volumes."
      }
    ],
    proofRequirements: [
      {
        id: "proof-compose-file",
        proofType: "aws-design",
        title: "Docker Compose multi-service setup",
        requiredScore: 3,
        rubric: ["At least 3 services", "Network isolation configured", "Volumes for persistence", "Health checks included"]
      }
    ],
    readinessImpact: ["AWS Readiness", "Implementation", "Practice"]
  },
  {
    id: "mission-implement-load-testing",
    missionType: "implement",
    objective: "Run a load test against a backend endpoint, analyze results, and document findings.",
    capabilityId: "cap-reliability-observability",
    topicId: "topic-testing-load",
    estimatedMinutes: 75,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-testing-performance", "topic-node-testing-strategy"],
    tasks: [
      {
        id: "task-load-test",
        description: "Write a k6 script that simulates 100 concurrent users hitting an endpoint, collect latency and error metrics.",
        expectedOutput: "k6 test script plus results summary with p50/p95/p99 latency and bottleneck analysis."
      }
    ],
    proofRequirements: [
      {
        id: "proof-load-test",
        proofType: "incident-analysis",
        title: "Load test results and analysis",
        requiredScore: 3,
        rubric: ["Test script runs", "Latency percentiles reported", "Bottlenecks identified", "Improvement recommendations"]
      }
    ],
    readinessImpact: ["Reliability Readiness", "Implementation", "Practice"]
  },
  {
    id: "mission-implement-contract-testing",
    missionType: "implement",
    objective: "Set up a contract test between two microservices using Pact.",
    capabilityId: "cap-reliability-observability",
    topicId: "topic-testing-contract",
    estimatedMinutes: 90,
    mode: "weekend",
    prerequisiteTopicIds: ["topic-testing-unit-integration", "topic-api-design"],
    tasks: [
      {
        id: "task-contract-test",
        description: "Define a consumer-driven contract for an API interaction, write Pact tests, and verify against the provider.",
        expectedOutput: "Pact contract file plus consumer/provider test code with verification output."
      }
    ],
    proofRequirements: [
      {
        id: "proof-contract-test",
        proofType: "lld",
        title: "Contract test setup",
        requiredScore: 3,
        rubric: ["Consumer test written", "Contract generated", "Provider verified against contract", "Interaction states defined"]
      }
    ],
    readinessImpact: ["Reliability Readiness", "Implementation", "LLD Readiness"]
  },
  {
    id: "mission-hld-websocket-chat",
    missionType: "implement",
    objective: "Design a WebSocket-based chat system with presence, ordering, and scaling.",
    capabilityId: "cap-distributed-systems",
    topicId: "topic-chat-architecture",
    estimatedMinutes: 90,
    mode: "weekend",
    prerequisiteTopicIds: ["topic-websocket-deep", "topic-message-ordering-guarantees", "topic-presence-systems"],
    tasks: [
      {
        id: "task-chat-hld",
        description: "Design the architecture: WebSocket gateway, message broker, presence service, history store, and horizontal scaling strategy.",
        expectedOutput: "HLD artifact with component diagram, data flow, ordering guarantees, and scaling tradeoffs."
      }
    ],
    proofRequirements: [
      {
        id: "proof-chat-hld",
        proofType: "hld",
        title: "WebSocket chat system HLD",
        requiredScore: 4,
        rubric: ["Component diagram included", "Message ordering explained", "Presence model defined", "Scaling strategy covered", "Failure modes addressed"]
      }
    ],
    readinessImpact: ["Architect Readiness", "System Design Readiness", "HLD Readiness", "Interview Readiness"]
  },
  {
    id: "mission-learn-container-security-review",
    missionType: "learn",
    objective: "Review container security best practices and audit a Dockerfile for vulnerabilities.",
    capabilityId: "cap-aws-cloud-architecture",
    topicId: "topic-container-security",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-docker-fundamentals", "topic-owasp-top-10"],
    tasks: [
      {
        id: "task-container-audit",
        description: "Audit an existing Dockerfile for security issues: base image, layer count, secrets, user context, and network exposure.",
        expectedOutput: "Audit report with findings and a hardened Dockerfile."
      }
    ],
    proofRequirements: [
      {
        id: "proof-container-audit",
        proofType: "aws-design",
        title: "Container security audit",
        requiredScore: 3,
        rubric: ["Base image chosen appropriately", "Secrets not baked in", "Least-privilege user configured", "Layer caching optimized", "Network exposure minimized"]
      }
    ],
    readinessImpact: ["AWS Readiness", "Security Readiness", "Knowledge"]
  },

  // ════════════════════════════════════════════════════════════
  // Roadmap Pack 4 — Missions
  // ════════════════════════════════════════════════════════════
  {
    id: "mission-practice-multi-account-aws",
    missionType: "practice",
    objective: "Design a multi-account AWS organization with security, network, and workload accounts.",
    capabilityId: "cap-aws-cloud-architecture",
    topicId: "topic-multi-account-organization",
    estimatedMinutes: 75,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-aws-iam-basics", "topic-aws-vpc-networking"],
    tasks: [
      {
        id: "task-multi-account",
        description: "Design an AWS multi-account strategy: management, security, shared-services, dev, staging, and prod accounts with SCP boundaries.",
        expectedOutput: "Account structure diagram with SCP policies and network topology."
      }
    ],
    proofRequirements: [
      {
        id: "proof-multi-account",
        proofType: "aws-design",
        title: "Multi-account AWS organization design",
        requiredScore: 3,
        rubric: ["Account structure defined", "SCP boundaries modeled", "Network peering strategy covered", "Logging and audit account included"]
      }
    ],
    readinessImpact: ["AWS Readiness", "Architect Readiness", "Practice"]
  },
  {
    id: "mission-arch-vpc-tgw-review",
    missionType: "architecture-case-study",
    objective: "Review a VPC and Transit Gateway architecture for multi-region connectivity.",
    capabilityId: "cap-aws-cloud-architecture",
    topicId: "topic-vpc-advanced-architecture",
    estimatedMinutes: 90,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-aws-vpc-networking", "topic-transit-gateway-design"],
    tasks: [
      {
        id: "task-vpc-tgw",
        description: "Design a multi-region VPC architecture with Transit Gateway, VPN, and Direct Connect fallback.",
        expectedOutput: "Network architecture with TGW routing, cross-region peering, and failover paths."
      }
    ],
    proofRequirements: [
      {
        id: "proof-vpc-tgw",
        proofType: "aws-design",
        title: "VPC/TGW architecture review",
        requiredScore: 4,
        rubric: ["TGW route tables designed", "Cross-region connectivity modeled", "VPN/DX fallback included", "Security group and NACL strategy defined"]
      }
    ],
    readinessImpact: ["AWS Readiness", "Architect Readiness", "System Design Readiness"]
  },
  {
    id: "mission-practice-slo-error-budget",
    missionType: "practice",
    objective: "Define SLOs and calculate error budget for a production service.",
    capabilityId: "cap-reliability-observability",
    topicId: "topic-error-budgets",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-slos-slas"],
    tasks: [
      {
        id: "task-slo-eb",
        description: "Define SLI indicators, set SLO targets, calculate monthly error budget, and model budget burn scenarios.",
        expectedOutput: "SLO document with SLIs, targets, error budget calculation, and burn-rate policy."
      }
    ],
    proofRequirements: [
      {
        id: "proof-slo-eb",
        proofType: "architecture-review",
        title: "SLO and error budget design",
        requiredScore: 3,
        rubric: ["SLIs defined with measurement approach", "SLO targets justified", "Error budget calculated correctly", "Burn-rate policy defined"]
      }
    ],
    readinessImpact: ["Reliability Readiness", "Architect Readiness", "Practice"]
  },
  {
    id: "mission-practice-incident-review",
    missionType: "practice",
    objective: "Conduct a blameless postmortem and incident review exercise.",
    capabilityId: "cap-reliability-observability",
    topicId: "topic-incident-management-process",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-incident-response", "topic-postmortem-writing"],
    tasks: [
      {
        id: "task-postmortem",
        description: "Write a blameless postmortem for a simulated incident: timeline, root cause, action items, and follow-up tracking.",
        expectedOutput: "Postmortem document with timeline, RCA, action items, and owner assignments."
      }
    ],
    proofRequirements: [
      {
        id: "proof-postmortem",
        proofType: "incident-analysis",
        title: "Postmortem and incident review",
        requiredScore: 3,
        rubric: ["Incident timeline documented", "Root cause identified", "Blameless language used", "Action items prioritized with owners"]
      }
    ],
    readinessImpact: ["Reliability Readiness", "Incident Readiness", "Practice"]
  },
  {
    id: "mission-arch-production-readiness",
    missionType: "architecture-case-study",
    objective: "Perform a production readiness review for a new service launch.",
    capabilityId: "cap-reliability-observability",
    topicId: "topic-production-readiness-reviews",
    estimatedMinutes: 90,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-slos-slas", "topic-failure-modes", "topic-aws-well-architected"],
    tasks: [
      {
        id: "task-prr",
        description: "Complete a PRR checklist: SLOs, monitoring, runbooks, dependency mapping, capacity plan, and failure mode analysis.",
        expectedOutput: "PRR document with readiness score, gaps, and remediation plan."
      }
    ],
    proofRequirements: [
      {
        id: "proof-prr",
        proofType: "architecture-review",
        title: "Production readiness review",
        requiredScore: 4,
        rubric: ["SLOs and SLIs defined", "Monitoring and alerting covered", "Runbooks documented", "Dependencies mapped", "Failure modes analyzed", "Capacity plan included"]
      }
    ],
    readinessImpact: ["Reliability Readiness", "Architect Readiness", "System Design Readiness"]
  },
  {
    id: "mission-implement-terraform-module",
    missionType: "implement",
    objective: "Design a reusable Terraform module for a platform service.",
    capabilityId: "cap-platform-engineering",
    topicId: "topic-terraform-fundamentals",
    estimatedMinutes: 120,
    mode: "weekend",
    prerequisiteTopicIds: ["topic-infrastructure-as-code"],
    tasks: [
      {
        id: "task-terraform-module",
        description: "Create a Terraform module for an ECS service with VPC, ALB, task definition, and autoscaling. Include variable validation, outputs, and remote state configuration.",
        expectedOutput: "Terraform module with variables, outputs, main.tf, and a usage example."
      }
    ],
    proofRequirements: [
      {
        id: "proof-terraform-module",
        proofType: "aws-design",
        title: "Terraform platform module",
        requiredScore: 3,
        rubric: ["Module structure follows best practices", "Variables validated with types", "Remote state configured", "Outputs exposed for composition", "Usage example provided"]
      }
    ],
    readinessImpact: ["Platform Readiness", "Implementation", "AWS Readiness"]
  },
  {
    id: "mission-arch-ci-cd-pipeline",
    missionType: "architecture-case-study",
    objective: "Design a CI/CD pipeline architecture with deployment gates and promotion strategies.",
    capabilityId: "cap-platform-engineering",
    topicId: "topic-ci-cd-architecture",
    estimatedMinutes: 90,
    mode: "weekend",
    prerequisiteTopicIds: ["topic-container-deployment-tradeoffs", "topic-load-balancing"],
    tasks: [
      {
        id: "task-cicd-arch",
        description: "Design a CI/CD pipeline: source, build, test, staging, approval gate, production promotion, and rollback strategy.",
        expectedOutput: "Pipeline architecture diagram with stages, gates, environments, and approval workflows."
      }
    ],
    proofRequirements: [
      {
        id: "proof-cicd-arch",
        proofType: "architecture-review",
        title: "CI/CD pipeline architecture",
        requiredScore: 4,
        rubric: ["Pipeline stages defined", "Approval gates included", "Environment strategy clear", "Rollback mechanism designed", "Secrets management covered"]
      }
    ],
    readinessImpact: ["Platform Readiness", "Architect Readiness", "System Design Readiness"]
  },
  {
    id: "mission-arch-blue-green-canary",
    missionType: "implement",
    objective: "Design a blue-green or canary deployment strategy for a critical service.",
    capabilityId: "cap-platform-engineering",
    topicId: "topic-blue-green-deployment",
    estimatedMinutes: 75,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-deployment-pipelines", "topic-load-balancing"],
    tasks: [
      {
        id: "task-deploy-strategy",
        description: "Design a deployment strategy: choose blue-green vs canary, define traffic shifting, health checks, rollback trigger, and observability during rollout.",
        expectedOutput: "Deployment strategy document with traffic shifting, health gates, and rollback criteria."
      }
    ],
    proofRequirements: [
      {
        id: "proof-deploy-strategy",
        proofType: "architecture-review",
        title: "Blue-green/canary deployment design",
        requiredScore: 3,
        rubric: ["Strategy choice justified", "Traffic shifting mechanism defined", "Health gates and rollback triggers specified", "Observability during rollout included"]
      }
    ],
    readinessImpact: ["Platform Readiness", "AWS Readiness", "Implementation"]
  },
  {
    id: "mission-arch-golden-path-review",
    missionType: "architecture-case-study",
    objective: "Review and propose a golden path for a platform service deployment.",
    capabilityId: "cap-platform-engineering",
    topicId: "topic-golden-paths",
    estimatedMinutes: 90,
    mode: "weekend",
    prerequisiteTopicIds: ["topic-infrastructure-as-code", "topic-internal-developer-platforms"],
    tasks: [
      {
        id: "task-golden-path",
        description: "Design a golden path for deploying a new microservice: scaffolding, CI/CD, monitoring, and compliance checks included.",
        expectedOutput: "Golden path design with scaffold template, pipeline template, and onboarding checklist."
      }
    ],
    proofRequirements: [
      {
        id: "proof-golden-path",
        proofType: "architecture-review",
        title: "Golden path design",
        requiredScore: 3,
        rubric: ["Scaffolding template defined", "CI/CD pipeline template included", "Observability defaults configured", "Compliance and security checks integrated"]
      }
    ],
    readinessImpact: ["Platform Readiness", "Architect Readiness", "System Design Readiness"]
  },
  {
    id: "mission-practice-cost-optimization",
    missionType: "practice",
    objective: "Perform an AWS cost optimization review for an existing architecture.",
    capabilityId: "cap-aws-cloud-architecture",
    topicId: "topic-aws-cost-optimization",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-aws-cost-performance-tradeoffs", "topic-aws-compute-options"],
    tasks: [
      {
        id: "task-cost-review",
        description: "Analyze compute, storage, and data transfer costs for a multi-service architecture. Identify right-sizing opportunities, savings plans, and lifecycle policies.",
        expectedOutput: "Cost optimization report with savings opportunities, recommendations, and estimated impact."
      }
    ],
    proofRequirements: [
      {
        id: "proof-cost-optimization",
        proofType: "aws-design",
        title: "AWS cost optimization review",
        requiredScore: 3,
        rubric: ["Compute costs analyzed with right-sizing recommendations", "Storage lifecycle policies proposed", "Data transfer costs reviewed", "Savings Plans or RIs considered"]
      }
    ],
    readinessImpact: ["AWS Readiness", "Architect Readiness", "Practice"]
  },

  // ════════════════════════════════════════════════════════════
  // Roadmap Pack 5 — Missions
  // ════════════════════════════════════════════════════════════
  {
    id: "mission-behavioral-conflict-resolution",
    missionType: "behavioral",
    objective: "Prepare a conflict resolution STAR story based on a real experience.",
    capabilityId: "cap-behavioral-communication",
    topicId: "topic-conflict-resolution",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-behavioral-star-stories"],
    tasks: [
      {
        id: "task-conflict-story",
        description: "Write a STAR story about a technical disagreement, how you resolved it, and what you learned.",
        expectedOutput: "One interview-ready conflict resolution STAR story covering context, action, tradeoffs, and outcome."
      }
    ],
    proofRequirements: [
      {
        id: "proof-conflict-story",
        proofType: "behavioral-answer",
        title: "Conflict resolution STAR story",
        requiredScore: 3,
        rubric: ["Real experience described", "Conflict clearly framed", "Personal action detailed", "Outcome with metrics included", "Follow-up answers ready"]
      }
    ],
    readinessImpact: ["Behavioral Readiness", "Communication Readiness", "Interview Readiness"]
  },
  {
    id: "mission-behavioral-story-inventory",
    missionType: "behavioral",
    objective: "Build a catalog of 10-15 interview-ready stories covering all key behavioral categories.",
    capabilityId: "cap-behavioral-communication",
    topicId: "topic-story-inventory",
    estimatedMinutes: 90,
    mode: "weekend",
    prerequisiteTopicIds: ["topic-behavioral-star-stories"],
    tasks: [
      {
        id: "task-story-inventory",
        description: "List out 10-15 experiences. Categorize them: ownership, conflict, failure, leadership, technical depth, delivery risk, mentoring, incident, tradeoff, cross-team.",
        expectedOutput: "Story inventory spreadsheet or doc with categories, brief context, and which companies/loops each maps to."
      }
    ],
    proofRequirements: [
      {
        id: "proof-story-inventory",
        proofType: "behavioral-answer",
        title: "Interview story inventory",
        requiredScore: 3,
        rubric: ["At least 10 stories listed", "All key categories covered", "Each has brief context", "Company/loop mapping noted"]
      }
    ],
    readinessImpact: ["Behavioral Readiness", "Interview Readiness", "Offer Readiness"]
  },
  {
    id: "mission-behavioral-leadership-story",
    missionType: "behavioral",
    objective: "Prepare a staff/architect-level leadership story demonstrating cross-org influence.",
    capabilityId: "cap-delivery-leadership",
    topicId: "topic-leadership-story",
    estimatedMinutes: 75,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-story-inventory", "topic-staff-engineer-scope"],
    tasks: [
      {
        id: "task-leadership-story",
        description: "Write a STAR story at staff/architect scope: cross-team initiative, org-level impact, technical strategy, or culture change.",
        expectedOutput: "Leadership story with scope, influence, metrics, and follow-up depth."
      }
    ],
    proofRequirements: [
      {
        id: "proof-leadership-story",
        proofType: "behavioral-answer",
        title: "Staff/architect leadership story",
        requiredScore: 4,
        rubric: ["Staff-level scope demonstrated", "Cross-team influence visible", "Metrics included", "Follow-up depth prepared"]
      }
    ],
    readinessImpact: ["Behavioral Readiness", "Leadership Readiness", "Interview Readiness"]
  },
  {
    id: "mission-behavioral-story-tailoring",
    missionType: "behavioral",
    objective: "Tailor three stories from your inventory to specific company loops (FAANG, Product, GCC).",
    capabilityId: "cap-behavioral-communication",
    topicId: "topic-story-tailoring",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-story-inventory"],
    tasks: [
      {
        id: "task-story-tailoring",
        description: "Take 3 stories and adapt each for a FAANG, Product/GCC, and Architect-focused loop. Adjust emphasis, metrics, and framing.",
        expectedOutput: "Three story variants per original story, with company-specific framing notes."
      }
    ],
    proofRequirements: [
      {
        id: "proof-story-tailoring",
        proofType: "behavioral-answer",
        title: "Tailored interview stories",
        requiredScore: 3,
        rubric: ["Three variants per story", "Framing matches company culture", "Metrics adjusted per audience", "Delivery notes included"]
      }
    ],
    readinessImpact: ["Behavioral Readiness", "Interview Readiness", "Communication Readiness"]
  },
  {
    id: "mission-behavioral-follow-up-prep",
    missionType: "behavioral",
    objective: "Prepare follow-up answers for three behavioral stories covering depth questions.",
    capabilityId: "cap-behavioral-communication",
    topicId: "topic-follow-up-answer-preparation",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-story-inventory"],
    tasks: [
      {
        id: "task-follow-up",
        description: "For each story, write 3-5 follow-up answers: 'What would you do differently?', 'What was the hardest part?', 'How did you measure impact?'",
        expectedOutput: "Story set with 3-5 follow-up answers each, covering tradeoffs, learnings, and alternatives."
      }
    ],
    proofRequirements: [
      {
        id: "proof-follow-up",
        proofType: "behavioral-answer",
        title: "Follow-up answer preparation",
        requiredScore: 3,
        rubric: ["3+ follow-ups per story", "Answers show reflection", "Tradeoffs addressed", "Learning demonstrated"]
      }
    ],
    readinessImpact: ["Behavioral Readiness", "Interview Readiness", "Communication Readiness"]
  },
  {
    id: "mission-behavioral-failure-story",
    missionType: "behavioral",
    objective: "Prepare a failure STAR story that shows ownership and growth.",
    capabilityId: "cap-behavioral-communication",
    topicId: "topic-failure-story",
    estimatedMinutes: 45,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-story-inventory"],
    tasks: [
      {
        id: "task-failure-story",
        description: "Write a failure story: what went wrong, your role, how you fixed it, and systemic changes made.",
        expectedOutput: "Failure STAR story with honest reflection, action, and systemic improvement outcome."
      }
    ],
    proofRequirements: [
      {
        id: "proof-failure-story",
        proofType: "behavioral-answer",
        title: "Failure STAR story",
        requiredScore: 3,
        rubric: ["Real failure described", "Personal accountability clear", "Action taken to fix", "Systemic improvement included"]
      }
    ],
    readinessImpact: ["Behavioral Readiness", "Interview Readiness"]
  },
  {
    id: "mission-behavioral-technical-strategy",
    missionType: "behavioral",
    objective: "Prepare a staff-level technical strategy story demonstrating architectural thinking.",
    capabilityId: "cap-delivery-leadership",
    topicId: "topic-technical-strategy",
    estimatedMinutes: 90,
    mode: "weekend",
    prerequisiteTopicIds: ["topic-staff-engineer-scope", "topic-story-inventory"],
    tasks: [
      {
        id: "task-tech-strategy",
        description: "Write a story about defining technical strategy: RFC process, roadmap creation, cross-team alignment, or architecture decision.",
        expectedOutput: "Technical strategy story with scope, stakeholders, decision rationale, and measurable outcome."
      }
    ],
    proofRequirements: [
      {
        id: "proof-tech-strategy",
        proofType: "behavioral-answer",
        title: "Technical strategy story",
        requiredScore: 4,
        rubric: ["Strategic scope demonstrated", "Stakeholders identified", "Decision rationale clear", "Measurable outcome included", "Tradeoffs documented"]
      }
    ],
    readinessImpact: ["Leadership Readiness", "Architect Readiness", "Interview Readiness"]
  },
  {
    id: "mission-career-personal-brand-audit",
    missionType: "career-asset",
    objective: "Audit existing personal brand assets and identify gaps for Solution Architect positioning.",
    capabilityId: "cap-career-assets",
    topicId: "topic-personal-brand-building",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: [],
    tasks: [
      {
        id: "task-brand-audit",
        description: "Audit LinkedIn, GitHub, blog presence, and speaking history. Identify gaps vs architect-level expectations.",
        expectedOutput: "Brand audit with current state, gaps, and a 30-day action plan."
      }
    ],
    proofRequirements: [
      {
        id: "proof-brand-audit",
        proofType: "resume-review",
        title: "Personal brand audit",
        requiredScore: 3,
        rubric: ["All channels audited", "Gaps identified vs target role", "Action plan with priorities", "Timeline defined"]
      }
    ],
    readinessImpact: ["Resume Readiness", "Offer Readiness"]
  },
  {
    id: "mission-career-technical-content",
    missionType: "career-asset",
    objective: "Create a technical content piece (blog post, case study, or demo) for portfolio visibility.",
    capabilityId: "cap-career-assets",
    topicId: "topic-content-creation-technical",
    estimatedMinutes: 120,
    mode: "weekend",
    prerequisiteTopicIds: ["topic-personal-brand-building"],
    tasks: [
      {
        id: "task-content-creation",
        description: "Write a technical blog post or case study about an architecture decision, EngineeringOS design, or backend pattern.",
        expectedOutput: "Published or draft technical article with architecture focus, code snippets, and tradeoff analysis."
      }
    ],
    proofRequirements: [
      {
        id: "proof-content-creation",
        proofType: "case-study",
        title: "Technical content piece",
        requiredScore: 3,
        rubric: ["Technical depth demonstrated", "Architecture focus", "Code or design included", "Published or publication-ready"]
      }
    ],
    readinessImpact: ["Resume Readiness", "Offer Readiness"]
  },
  {
    id: "mission-behavioral-staff-scope",
    missionType: "behavioral",
    objective: "Map existing experience to staff engineer archetypes and identify scope gaps.",
    capabilityId: "cap-delivery-leadership",
    topicId: "topic-staff-engineer-scope",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: [],
    tasks: [
      {
        id: "task-staff-scope",
        description: "Review staff engineer archetypes (Tech Lead, Architect, Solver, Right Hand). Map own experience to each and identify gaps.",
        expectedOutput: "Staff scope self-assessment with current archetype match, gap analysis, and story mapping opportunities."
      }
    ],
    proofRequirements: [
      {
        id: "proof-staff-scope",
        proofType: "behavioral-answer",
        title: "Staff scope self-assessment",
        requiredScore: 3,
        rubric: ["Archetypes understood", "Self-mapping completed", "Gaps identified", "Story inventory update noted"]
      }
    ],
    readinessImpact: ["Leadership Readiness", "Behavioral Readiness", "Interview Readiness"]
  },
  {
    id: "mission-architecture-presentation-review",
    missionType: "interview",
    objective: "Prepare and record a 10-minute architecture presentation that walks through a real system design decision.",
    capabilityId: "cap-system-design-hld",
    topicId: "topic-hld-interview-structure",
    estimatedMinutes: 90,
    mode: "weekend",
    prerequisiteTopicIds: ["topic-api-design", "topic-load-balancing"],
    tasks: [
      {
        id: "task-arch-presentation",
        description: "Choose a past architecture decision, prepare slides or whiteboard plan, record a 10-min walkthrough covering context, constraints, tradeoffs, and decision rationale.",
        expectedOutput: "Recording or detailed presentation outline with tradeoff matrix and stakeholder justification."
      }
    ],
    proofRequirements: [
      {
        id: "proof-arch-presentation",
        proofType: "behavioral-answer",
        title: "Architecture presentation recording",
        requiredScore: 4,
        rubric: ["Clear problem statement", "Constraints identified", "Options compared with tradeoffs", "Decision rationale explained", "Stakeholder perspective included"]
      }
    ],
    readinessImpact: ["Architecture Readiness", "Communication Readiness", "Interview Readiness"]
  },
  {
    id: "mission-resume-impact-review",
    missionType: "career-asset",
    objective: "Refine resume bullet points using achievement templates and framing rules for measurable impact.",
    capabilityId: "cap-career-assets",
    topicId: "topic-resume-positioning",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-personal-brand-building"],
    tasks: [
      {
        id: "task-resume-impact",
        description: "Select 5 past achievements. For each, apply an achievement template (impact/ownership/technical-depth/architecture/leadership) and a framing rule. Rewrite bullets with quantified outcomes.",
        expectedOutput: "5 rewritten resume bullets with before/after comparison and template and rule references."
      }
    ],
    proofRequirements: [
      {
        id: "proof-resume-impact",
        proofType: "resume-review",
        title: "Resume impact rewrite",
        requiredScore: 3,
        rubric: ["Templates applied correctly", "Framing rules used", "Quantified outcomes included", "Before/after comparison shown"]
      }
    ],
    readinessImpact: ["Resume Readiness", "Offer Readiness", "Interview Readiness"]
  },
  {
    id: "mission-leadership-story-depth",
    missionType: "behavioral",
    objective: "Develop a deep leadership story covering influence without authority, mentoring, and org-wide technical strategy.",
    capabilityId: "cap-delivery-leadership",
    topicId: "topic-influence-without-authority",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-staff-engineer-scope"],
    tasks: [
      {
        id: "task-leadership-story",
        description: "Choose one leadership experience and write a full STAR story. Include context, actions taken across teams, measurable outcome, and what you would do differently.",
        expectedOutput: "Complete STAR leadership story with influence scope, stakeholder mapping, and retrospective notes."
      }
    ],
    proofRequirements: [
      {
        id: "proof-leadership-story",
        proofType: "behavioral-answer",
        title: "Leadership STAR story",
        requiredScore: 4,
        rubric: ["STAR structure complete", "Influence without authority demonstrated", "Org-wide scope shown", "Measurable outcome included", "Retrospective insight present"]
      }
    ],
    readinessImpact: ["Leadership Readiness", "Behavioral Readiness", "Interview Readiness"]
  },
  {
    id: "mission-staff-design-review",
    missionType: "implement",
    objective: "Conduct a structured design review of a recent system change as if preparing a staff-level RFC.",
    capabilityId: "cap-system-design-hld",
    topicId: "topic-case-study-tradeoff-review",
    estimatedMinutes: 75,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-api-design", "topic-idempotency-keys"],
    tasks: [
      {
        id: "task-staff-design-review",
        description: "Pick a recent system change or PR. Write a staff-level design review covering correctness, scalability, failure modes, operational load, and team impact. Suggest improvements with tradeoffs.",
        expectedOutput: "Structured design review document with findings, improvement suggestions, and tradeoff analysis."
      }
    ],
    proofRequirements: [
      {
        id: "proof-staff-design-review",
        proofType: "lld",
        title: "Staff-level design review",
        requiredScore: 4,
        rubric: ["System change understood", "Scalability and failure analyzed", "Operational impact considered", "Suggestions with tradeoffs", "Team impact assessed"]
      }
    ],
    readinessImpact: ["Architecture Readiness", "Technical Readiness", "Leadership Readiness"]
  },
  {
    id: "mission-solution-architect-mock-loop",
    missionType: "interview",
    objective: "Complete a self-administered Solution Architect mock interview loop covering system design, behavioral, and communication rounds.",
    capabilityId: "cap-system-design-hld",
    topicId: "topic-hld-interview-structure",
    estimatedMinutes: 120,
    mode: "weekend",
    prerequisiteTopicIds: ["topic-api-design", "topic-influence-without-authority"],
    tasks: [
      {
        id: "task-mock-system-design",
        description: "Pick an architect-level system design prompt. Whiteboard the solution with 30-min timebox covering requirements, data model, API, components, and tradeoffs.",
        expectedOutput: "Recorded or written system design walkthrough with all standard sections."
      },
      {
        id: "task-mock-behavioral",
        description: "Answer 3 staff-level behavioral questions (conflict, influence, failure) with STAR format under 5 min each.",
        expectedOutput: "3 STAR behavioral answers with follow-up readiness notes."
      },
      {
        id: "task-mock-communication",
        description: "Write a 1-page stakeholder memo proposing an architecture change with cost-benefit analysis and risk assessment.",
        expectedOutput: "Stakeholder memo with clear recommendation, data support, and risk mitigation plan."
      }
    ],
    proofRequirements: [
      {
        id: "proof-mock-system-design",
        proofType: "hld",
        title: "Mock system design walkthrough",
        requiredScore: 4,
        rubric: ["Requirements clarified", "Data model defined", "Components identified", "Tradeoffs discussed", "Timebox respected"]
      },
      {
        id: "proof-mock-behavioral",
        proofType: "behavioral-answer",
        title: "Mock behavioral answers",
        requiredScore: 3,
        rubric: ["STAR structure followed", "Answers within timebox", "Follow-up ready"]
      },
      {
        id: "proof-mock-communication",
        proofType: "case-study",
        title: "Stakeholder communication memo",
        requiredScore: 3,
        rubric: ["Clear recommendation", "Data supported", "Risk assessment included", "Professional tone"]
      }
    ],
    readinessImpact: ["Interview Readiness", "Communication Readiness", "Architecture Readiness", "Behavioral Readiness"]
  },
  {
    id: "mission-stakeholder-communication",
    missionType: "learn",
    objective: "Learn and practice stakeholder communication patterns for architect-level presentations and proposals.",
    capabilityId: "cap-behavioral-communication",
    topicId: "topic-stakeholder-update",
    estimatedMinutes: 45,
    mode: "weekday",
    prerequisiteTopicIds: [],
    tasks: [
      {
        id: "task-stakeholder-comm",
        description: "Review stakeholder communication patterns (executive summary, tradeoff presentation, risk memo). Draft one example for a recent architecture decision.",
        expectedOutput: "Drafted stakeholder communication piece with audience identification, key message, and supporting data."
      }
    ],
    proofRequirements: [
      {
        id: "proof-stakeholder-comm",
        proofType: "behavioral-answer",
        title: "Stakeholder communication draft",
        requiredScore: 3,
        rubric: ["Audience identified", "Key message clear", "Supporting data included", "Tone appropriate for audience"]
      }
    ],
    readinessImpact: ["Communication Readiness", "Interview Readiness", "Leadership Readiness"]
  },
  {
    id: "mission-project-depth-narrative",
    missionType: "behavioral",
    objective: "Develop a deep project narrative that showcases domain expertise, technical scope, and measurable business impact.",
    capabilityId: "cap-delivery-leadership",
    topicId: "topic-story-tailoring",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-resume-positioning"],
    tasks: [
      {
        id: "task-project-narrative",
        description: "Pick one significant project. Write a comprehensive narrative covering: business context, technical challenge, architecture decisions, team coordination, operational impact, and lessons learned.",
        expectedOutput: "Project deep-dive narrative suitable for interview project deep-dive rounds."
      }
    ],
    proofRequirements: [
      {
        id: "proof-project-narrative",
        proofType: "behavioral-answer",
        title: "Project depth narrative",
        requiredScore: 4,
        rubric: ["Business context clear", "Technical depth shown", "Architecture decisions explained", "Team and operational impact covered", "Lessons learned included"]
      }
    ],
    readinessImpact: ["Project Depth Readiness", "Interview Readiness", "Behavioral Readiness"]
  },
  {
    id: "mission-technical-deep-dive",
    missionType: "learn",
    objective: "Deep-dive into a distributed systems pattern and prepare to explain it at staff-engineer depth.",
    capabilityId: "cap-distributed-systems",
    topicId: "topic-consistency-models",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-idempotency-keys"],
    tasks: [
      {
        id: "task-tech-deep-dive",
        description: "Study one distributed systems pattern (consensus, replication, partitioning, or consistency model). Write a concise explainer covering the problem, solution, tradeoffs, and real-world examples.",
        expectedOutput: "Technical explainer with problem statement, solution overview, tradeoff analysis, and real-world references."
      }
    ],
    proofRequirements: [
      {
        id: "proof-tech-deep-dive",
        proofType: "lld",
        title: "Technical deep-dive explainer",
        requiredScore: 3,
        rubric: ["Pattern correctly explained", "Tradeoffs covered", "Real-world examples cited", "Staff-level depth demonstrated"]
      }
    ],
    readinessImpact: ["Technical Readiness", "Architecture Readiness", "Interview Readiness"]
  },
  {
    id: "mission-architecture-tradeoff-analysis",
    missionType: "practice",
    objective: "Write a structured architecture tradeoff analysis comparing two design approaches for a given problem.",
    capabilityId: "cap-system-design-hld",
    topicId: "topic-architecture-tradeoffs",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-failure-modes", "topic-api-design"],
    tasks: [
      {
        id: "task-tradeoff-analysis",
        description: "Choose a common architecture decision (e.g., monolith vs microservices, sync vs async, SQL vs NoSQL, cache strategy). Write a tradeoff analysis with context, options evaluated, decision criteria, recommendation, and risk assessment.",
        expectedOutput: "Tradeoff analysis document suitable for architecture interview discussion."
      }
    ],
    proofRequirements: [
      {
        id: "proof-tradeoff-analysis",
        proofType: "hld",
        title: "Architecture tradeoff analysis",
        requiredScore: 3,
        rubric: ["Context established", "Multiple options compared", "Decision criteria defined", "Recommendation with rationale", "Risks and mitigations included"]
      }
    ],
    readinessImpact: ["Architecture Readiness", "Technical Readiness", "Interview Readiness"]
  },

  // ── Pack 10I: First Real Import — Approved Missions ────────────────────
  {
    id: "mission-event-driven-system-design",
    missionType: "architecture-case-study",
    objective: "Design an event-driven notification system combining event sourcing, CQRS, and saga orchestration patterns.",
    capabilityId: "cap-architecture-case-studies",
    topicId: "topic-event-driven-architecture",
    estimatedMinutes: 90,
    mode: "weekend",
    prerequisiteTopicIds: ["topic-queues", "topic-event-driven-architecture"],
    tasks: [
      {
        id: "task-event-driven-architecture",
        description: "Design an event-driven system that uses event sourcing for state management, CQRS for read/write separation, and saga orchestration for multi-service transactions. Include component diagram, event flow, consistency boundary analysis, and failure handling strategy.",
        expectedOutput: "Architecture case study document with diagrams, event catalog, and tradeoff analysis."
      }
    ],
    proofRequirements: [
      {
        id: "proof-event-driven-architecture",
        proofType: "hld",
        title: "Event-driven architecture case study",
        requiredScore: 3,
        rubric: ["Event sourcing model correctly applied", "CQRS read/write separation justified", "Saga orchestration with compensation steps", "Consistency boundaries identified", "Failure modes and retry strategy documented"]
      }
    ],
    readinessImpact: ["Architecture Readiness", "Technical Readiness", "Distributed Systems Readiness"]
  },
  {
    id: "mission-cloud-security-review",
    missionType: "implement",
    objective: "Conduct a cloud security foundations review using Google Cloud security best practices as reference.",
    capabilityId: "cap-security",
    topicId: "topic-cloud-security-foundations",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-aws-iam-basics", "topic-authentication-authorization"],
    tasks: [
      {
        id: "task-cloud-security-review",
        description: "Review a cloud architecture against Google Cloud security foundations: identity, network security, data protection, and compliance. Identify gaps and propose remediations with architecture justifications.",
        expectedOutput: "Security review document with findings, risk ratings, and remediation recommendations."
      }
    ],
    proofRequirements: [
      {
        id: "proof-cloud-security",
        proofType: "aws-design",
        title: "Cloud security foundations review",
        requiredScore: 3,
        rubric: ["Identity and access controls reviewed", "Network security posture assessed", "Data protection mechanisms evaluated", "Compliance requirements identified", "Remediation priorities with architecture impact"]
      }
    ],
    readinessImpact: ["Security Readiness", "Architecture Readiness", "Cloud Readiness"]
  }
];
