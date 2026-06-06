import type { Capability, FounderBetaPath, MissionType, ProofType, Skill } from "@/types/founder-beta";

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
  skill("skill-observability-design", "cap-reliability-observability", "Observability design", "Design logs, metrics, traces, dashboards, alerts, and runbooks.", ["topic-observability-logs-metrics-traces", "topic-alerting-runbooks", "topic-cloudwatch-observability"], ["incident-analysis", "aws-design"]),
  skill("skill-aws-foundations", "cap-aws-cloud-architecture", "AWS foundations", "Explain IAM, VPC, compute, storage, networking, and managed service boundaries.", ["topic-aws-iam-basics", "topic-aws-vpc-networking", "topic-aws-compute-options", "topic-aws-s3-basics"], ["aws-design", "architecture-review"]),
  skill("skill-aws-architecture-review", "cap-aws-cloud-architecture", "AWS architecture review", "Review cloud architecture using reliability, security, operations, cost, and performance lenses.", ["topic-aws-well-architected", "topic-aws-multi-az-design", "topic-aws-cost-performance-tradeoffs"], ["aws-design", "architecture-review"]),
  skill("skill-aws-data-messaging", "cap-aws-cloud-architecture", "AWS data and messaging architecture", "Choose RDS, DynamoDB, S3, SQS, SNS, EventBridge, and cache services for workloads.", ["topic-aws-rds-basics", "topic-aws-dynamodb-basics", "topic-aws-sqs-sns-eventbridge", "topic-aws-cloudfront-cdn"], ["aws-design", "hld"]),
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
  skill("skill-interview-pipeline", "cap-offer-readiness", "Interview pipeline readiness", "Prepare application, referral, pipeline, follow-up, and negotiation workflow.", ["topic-application-tracker", "topic-interview-pipeline-management", "topic-negotiation-awareness"], ["resume-review", "behavioral-answer"])
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
    sourceIds: ["backend-roadmap", "node-docs", "node-learn", "express-docs", "nodebestpractices"],
    roadmapDependencies: [],
    missionTypes: technicalMissions,
    proofTypes: ["lld", "architecture-review", "incident-analysis"],
    skillIds: ["skill-api-contract-design", "skill-backend-service-structure", "skill-node-production-backend", "skill-node-observability"]
  }),
  capability({
    id: "cap-security",
    name: "Security",
    category: "technical",
    whyItMatters: "Solution Architects must reason about auth, authorization, threat models, IAM, secrets, and abuse cases.",
    priorityWeight: 8,
    readinessThreshold: 70,
    sourceCategories: ["official-docs", "security-guides"],
    sourceIds: ["owasp-cheat-sheets", "oauth-docs", "aws-iam-docs", "aws-well-architected"],
    roadmapDependencies: ["cap-node-backend"],
    missionTypes: technicalMissions,
    proofTypes: ["architecture-review", "aws-design", "case-study"],
    skillIds: ["skill-auth-boundaries", "skill-threat-modeling"]
  }),
  capability({
    id: "cap-system-design-hld",
    name: "System Design / HLD",
    category: "technical",
    whyItMatters: "Architect readiness depends on structured HLD, scaling, failure modes, and tradeoff communication.",
    priorityWeight: 18,
    readinessThreshold: 75,
    sourceCategories: ["github-repository", "roadmap", "engineering-blog"],
    sourceIds: ["hld-system-design-primer", "hld-bytebytego", "hld-awesome-system-design", "hld-roadmap-system-design"],
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
    sourceIds: ["dist-google-sre-book", "aws-builders-library", "hld-system-design-primer"],
    roadmapDependencies: ["cap-node-backend", "cap-databases"],
    missionTypes: technicalMissions,
    proofTypes: ["hld", "architecture-review", "aws-design"],
    skillIds: ["skill-distributed-consistency", "skill-async-architecture"]
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
    sourceIds: ["dist-google-sre-book", "google-sre-workbook", "opentelemetry-docs", "aws-cloudwatch-docs"],
    roadmapDependencies: ["cap-node-backend", "cap-distributed-systems"],
    missionTypes: technicalMissions,
    proofTypes: ["incident-analysis", "architecture-review", "aws-design"],
    skillIds: ["skill-reliability-engineering", "skill-observability-design"]
  }),
  capability({
    id: "cap-aws-cloud-architecture",
    name: "AWS / Cloud Architecture",
    category: "technical",
    whyItMatters: "AWS architecture is the primary differentiator for the founder Solution Architect path.",
    priorityWeight: 20,
    readinessThreshold: 70,
    sourceCategories: ["official-docs", "roadmap", "engineering-blog"],
    sourceIds: ["aws-well-architected", "aws-docs", "aws-architecture-center", "aws-builders-library", "sa-roadmap-aws"],
    roadmapDependencies: ["cap-system-design-hld", "cap-security", "cap-reliability-observability"],
    missionTypes: proofBackedMissions,
    proofTypes: ["aws-design", "architecture-review", "case-study"],
    skillIds: ["skill-aws-foundations", "skill-aws-architecture-review", "skill-aws-data-messaging"]
  }),
  capability({
    id: "cap-low-level-design",
    name: "Low Level Design / API Contracts",
    category: "technical",
    whyItMatters: "Lead Backend and Architect interviews often test API, class, workflow, and extensibility design.",
    priorityWeight: 7,
    readinessThreshold: 68,
    sourceCategories: ["official-docs", "interview-guide"],
    sourceIds: ["ts-handbook", "nodebestpractices", "lld-grokking-oop"],
    roadmapDependencies: ["cap-node-backend"],
    missionTypes: ["practice", "implement", "interview", "revision"],
    proofTypes: ["lld", "coding-solution", "case-study"],
    skillIds: ["skill-lld-api-modeling", "skill-lld-workflow-modeling"]
  }),
  capability({
    id: "cap-dsa-problem-solving",
    name: "DSA / Problem Solving",
    category: "technical",
    whyItMatters: "Senior backend interviews still require pattern fluency, complexity analysis, and clear coding communication.",
    priorityWeight: 5,
    readinessThreshold: 65,
    sourceCategories: ["interview-guide", "roadmap"],
    sourceIds: ["leetcode-patterns", "neetcode-roadmap"],
    roadmapDependencies: [],
    missionTypes: ["practice", "interview", "revision", "weak-area-repair"],
    proofTypes: ["coding-solution"],
    skillIds: ["skill-dsa-patterns", "skill-dsa-communication"]
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
    skillIds: ["skill-senior-storytelling", "skill-communication-tradeoffs"]
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
    skillIds: ["skill-delivery-risk", "skill-incident-leadership"]
  }),
  capability({
    id: "cap-architecture-case-studies",
    name: "Architecture Case Studies",
    category: "career-assets",
    whyItMatters: "Case studies convert founder and prior work into reusable HLD, LLD, tradeoff, review, and behavioral proof.",
    priorityWeight: 15,
    readinessThreshold: 80,
    sourceCategories: ["official-docs", "github-repository", "career-framework"],
    sourceIds: ["aws-well-architected", "aws-architecture-center", "hld-system-design-primer", "staff-staffeng"],
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
    skillIds: ["skill-architect-positioning", "skill-proof-of-work-packaging"]
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
