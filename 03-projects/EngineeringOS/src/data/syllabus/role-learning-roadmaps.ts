export type RoleRoadmapLevel = "foundation" | "basic" | "advanced" | "expert";
export type RoleRoadmapPriority = "core-80-20" | "depth" | "expert";

export type RoleLearningRoadmap = {
  slug: string;
  title: string;
  outcome: string;
  audience: string;
  topicSlugs: string[];
  focus: Array<{
    level: RoleRoadmapLevel;
    priority: RoleRoadmapPriority;
    title: string;
    topicSlugs: string[];
  }>;
};

export const roleLearningRoadmaps: RoleLearningRoadmap[] = [
  {
    slug: "backend-senior-engineer",
    title: "Senior Backend Engineer",
    audience: "Backend engineers moving from implementation ownership to system ownership.",
    outcome: "Build reliable JavaScript and Node.js services, solve DSA interviews, reason about database and system design trade-offs, own API design, and pass senior backend interviews.",
    topicSlugs: [
      "closures",
      "promises",
      "node-event-loop",
      "error-handling",
      "validation",
      "logging",
      "hashmap-frequency",
      "binary-search",
      "graph-bfs",
      "dynamic-programming-core",
      "indexes",
      "query-tuning",
      "redis-cache-patterns",
      "queue",
      "api-design-contracts",
      "security-threat-modeling",
      "oauth-oidc-jwt",
      "profiling-bottlenecks",
      "observability-slo-tracing",
      "coding-round-strategy",
      "system-design-round-strategy"
    ],
    focus: [
      {
        level: "foundation",
        priority: "core-80-20",
        title: "Language, runtime, and debugging base",
        topicSlugs: ["closures", "promises", "async-await", "node-event-loop", "error-handling"]
      },
      {
        level: "basic",
        priority: "core-80-20",
        title: "Interview coding patterns",
        topicSlugs: ["hashmap-frequency", "binary-search", "tree-dfs", "graph-bfs", "dynamic-programming-core"]
      },
      {
        level: "advanced",
        priority: "depth",
        title: "Production backend decisions",
        topicSlugs: ["validation", "logging", "config-management", "indexes", "query-tuning", "redis-cache-patterns", "profiling-bottlenecks", "observability-slo-tracing"]
      },
      {
        level: "expert",
        priority: "expert",
        title: "Senior ownership",
        topicSlugs: ["api-design-contracts", "module-boundaries", "reliability-patterns", "security-threat-modeling", "coding-round-strategy", "incident-leadership"]
      }
    ]
  },
  {
    slug: "solution-architect",
    title: "AWS Solution Architect",
    audience: "Engineers targeting AWS Solution Architect, HLD rounds, and architecture review ownership.",
    outcome: "Design AWS-first systems with clear security, reliability, performance, cost, and operations trade-offs.",
    topicSlugs: [
      "iam",
      "vpc",
      "ec2",
      "s3",
      "rds",
      "lambda",
      "sqs-sns",
      "dynamodb",
      "multi-az",
      "autoscaling",
      "route-53",
      "cloudfront",
      "elasticache",
      "api-gateway",
      "step-functions",
      "ecs-eks",
      "kms",
      "cloudtrail",
      "backup-dr",
      "cost-optimization",
      "security-threat-modeling",
      "oauth-oidc-jwt",
      "observability-slo-tracing",
      "load-testing-capacity",
      "hld-payment-system",
      "hld-booking-system"
    ],
    focus: [
      {
        level: "foundation",
        priority: "core-80-20",
        title: "Core AWS primitives",
        topicSlugs: ["iam", "vpc", "ec2", "s3", "rds", "lambda", "sqs-sns", "dynamodb"]
      },
      {
        level: "basic",
        priority: "core-80-20",
        title: "Well-Architected HLD building blocks",
        topicSlugs: ["multi-az", "autoscaling", "route-53", "cloudfront", "elasticache", "api-gateway"]
      },
      {
        level: "advanced",
        priority: "depth",
        title: "Workflow, security, and operations",
        topicSlugs: ["step-functions", "ecs-eks", "kms", "cloudtrail", "backup-dr", "cost-optimization", "security-threat-modeling", "observability-slo-tracing"]
      },
      {
        level: "expert",
        priority: "expert",
        title: "Architecture case studies",
        topicSlugs: ["hld-url-shortener", "hld-chat-system", "hld-booking-system", "hld-payment-system", "system-design-round-strategy", "architecture-review"]
      }
    ]
  },
  {
    slug: "staff-principal-engineer",
    title: "Staff Principal Engineer",
    audience: "Senior engineers growing into cross-team architecture and technical strategy scope.",
    outcome: "Lead architecture reviews, technical strategy, reliability decisions, incident learning, and cross-team execution.",
    topicSlugs: [
      "architecture-review",
      "technical-strategy",
      "incident-leadership",
      "roadmap-execution",
      "stakeholder-communication",
      "hld-feed-system",
      "hld-payment-system",
      "multi-region",
      "eventual-consistency",
      "idempotency",
      "disaster-recovery",
      "reliability-patterns",
      "module-boundaries",
      "extensibility-tradeoffs",
      "system-design-round-strategy",
      "behavioral-star-stories",
      "mock-interview-calibration"
    ],
    focus: [
      {
        level: "foundation",
        priority: "core-80-20",
        title: "Design-review fundamentals",
        topicSlugs: ["scalability", "availability", "reliability", "latency", "architecture-review"]
      },
      {
        level: "basic",
        priority: "core-80-20",
        title: "Distributed-system judgment",
        topicSlugs: ["multi-region", "eventual-consistency", "idempotency", "disaster-recovery", "reliability-patterns"]
      },
      {
        level: "advanced",
        priority: "depth",
        title: "Staff execution scope",
        topicSlugs: ["technical-strategy", "roadmap-execution", "incident-leadership", "stakeholder-communication", "behavioral-star-stories"]
      },
      {
        level: "expert",
        priority: "expert",
        title: "Principal-level case reviews",
        topicSlugs: ["hld-payment-system", "hld-booking-system", "hld-feed-system", "extensibility-tradeoffs", "mock-interview-calibration"]
      }
    ]
  },
  {
    slug: "engineering-manager",
    title: "Engineering Manager",
    audience: "Engineers or leads moving toward EM responsibilities while preserving technical judgment.",
    outcome: "Run execution, hiring, incident communication, stakeholder alignment, and architecture trade-off discussions.",
    topicSlugs: [
      "roadmap-execution",
      "hiring-interview-calibration",
      "stakeholder-communication",
      "incident-leadership",
      "architecture-review",
      "technical-strategy",
      "reliability",
      "availability",
      "cost-optimization",
      "behavioral-star-stories",
      "mock-interview-calibration",
      "system-design-round-strategy",
      "observability-slo-tracing",
      "security-threat-modeling"
    ],
    focus: [
      {
        level: "foundation",
        priority: "core-80-20",
        title: "Technical fluency",
        topicSlugs: ["reliability", "availability", "latency", "architecture-review", "system-design-round-strategy"]
      },
      {
        level: "basic",
        priority: "core-80-20",
        title: "Execution systems",
        topicSlugs: ["roadmap-execution", "stakeholder-communication", "incident-leadership", "behavioral-star-stories"]
      },
      {
        level: "advanced",
        priority: "depth",
        title: "People and process signal",
        topicSlugs: ["hiring-interview-calibration", "technical-strategy", "cost-optimization", "mock-interview-calibration", "observability-slo-tracing"]
      },
      {
        level: "expert",
        priority: "expert",
        title: "Org-level judgment",
        topicSlugs: ["hld-payment-system", "disaster-recovery", "roadmap-execution", "security-threat-modeling"]
      }
    ]
  }
];
