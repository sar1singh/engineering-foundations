import type { SourceTopicMapping } from "@/types/enriched-content";

export const sourceTopicMap = [
  {
    sourceId: "neetcode-roadmap",
    topicSlugs: [
      "hashmap-frequency",
      "linear-search",
      "sorting",
      "two-pointers",
      "sliding-window",
      "prefix-sum",
      "binary-search",
      "tree-dfs",
      "tree-bfs",
      "graph-dfs",
      "graph-bfs",
      "topological-sort",
      "dijkstra",
      "union-find",
      "recursion-backtracking",
      "dynamic-programming-core",
      "intervals",
      "bit-manipulation",
      "matrix"
    ],
    usage: "Pattern order and high-frequency problem-name mapping for 80/20 DSA practice.",
    priority: "primary"
  },
  {
    sourceId: "leetcode-problemset",
    topicSlugs: [
      "hashmap-frequency",
      "linear-search",
      "sorting",
      "binary-search",
      "tree-dfs",
      "tree-bfs",
      "graph-dfs",
      "graph-bfs",
      "topological-sort",
      "dijkstra",
      "union-find",
      "recursion-backtracking",
      "dynamic-programming-core",
      "intervals",
      "bit-manipulation",
      "matrix"
    ],
    usage: "Practice destination for source-mapped coding drills.",
    priority: "primary"
  },
  {
    sourceId: "the-algorithms-javascript",
    topicSlugs: ["linear-search", "binary-search", "sorting", "tree-dfs", "tree-bfs", "graph-dfs", "graph-bfs", "dijkstra", "union-find", "dynamic-programming-core", "bit-manipulation"],
    usage: "Implementation reference for JavaScript algorithm structure.",
    priority: "verification"
  },
  {
    sourceId: "tech-interview-handbook",
    topicSlugs: [
      "resume-linkedin-github",
      "mock-interview-calibration",
      "system-design-round-strategy",
      "behavioral-star-stories",
      "architecture-review",
      "technical-strategy",
      "roadmap-execution",
      "hiring-interview-calibration",
      "stakeholder-communication",
      "performance-management-basics",
      "incident-leadership"
    ],
    usage: "Interview process, resume, behavioral, and calibration coverage.",
    priority: "primary"
  },
  {
    sourceId: "coding-interview-university",
    topicSlugs: ["computer-science-foundations", "networking-foundations", "operating-systems-foundations", "databases-foundations", "graph-bfs", "dynamic-programming-core"],
    usage: "Foundation gap validation so the roadmap works for junior-to-senior growth.",
    priority: "supporting"
  },
  {
    sourceId: "system-design-primer",
    topicSlugs: [
      "scalability",
      "availability",
      "reliability",
      "latency",
      "caching",
      "queues",
      "hld-url-shortener",
      "hld-chat-system",
      "hld-feed-system",
      "hld-booking-system",
      "hld-payment-system",
      "hld-notification-system",
      "hld-search-autocomplete",
      "hld-file-storage",
      "hld-metrics-observability",
      "hld-ecommerce-checkout",
      "hld-ride-sharing",
      "hld-video-streaming",
      "hld-distributed-rate-limiter"
    ],
    usage: "System-design concept and case-study coverage verification.",
    priority: "primary"
  },
  {
    sourceId: "checkcheckzz-system-design-interview",
    topicSlugs: ["hld-url-shortener", "hld-chat-system", "hld-feed-system", "hld-booking-system", "hld-payment-system", "hld-notification-system", "hld-search-autocomplete", "hld-file-storage", "hld-ride-sharing", "hld-video-streaming", "hld-distributed-rate-limiter"],
    usage: "Additional case-study prompt validation for interview mocks.",
    priority: "supporting"
  },
  {
    sourceId: "awesome-scalability",
    topicSlugs: ["multi-az", "autoscaling", "backup-dr", "observability", "hld-feed-system", "hld-metrics-observability", "hld-ecommerce-checkout", "hld-ride-sharing", "hld-video-streaming", "hld-distributed-rate-limiter", "incident-leadership", "architecture-review", "technical-strategy", "roadmap-execution"],
    usage: "Senior production architecture, reliability, and operational judgment reading path.",
    priority: "supporting"
  },
  {
    sourceId: "awesome-system-design-resources",
    topicSlugs: [
      "hld-payment-system",
      "hld-booking-system",
      "hld-search-autocomplete",
      "hld-file-storage",
      "hld-metrics-observability",
      "hld-ecommerce-checkout",
      "hld-ride-sharing",
      "hld-video-streaming",
      "hld-distributed-rate-limiter",
      "parking-lot",
      "elevator-system",
      "rate-limiter-lld",
      "cache-lld",
      "notification-service-lld",
      "splitwise-expense-sharing",
      "workflow-engine-lld",
      "pub-sub-lld",
      "task-scheduler-lld",
      "feature-flag-service-lld",
      "logger-lld",
      "inventory-order-system-lld"
    ],
    usage: "HLD and LLD exercise discovery.",
    priority: "supporting"
  },
  {
    sourceId: "low-level-design-primer",
    topicSlugs: ["parking-lot", "elevator-system", "splitwise-expense-sharing", "rate-limiter-lld", "cache-lld", "notification-service-lld", "workflow-engine-lld", "pub-sub-lld", "task-scheduler-lld", "feature-flag-service-lld", "logger-lld", "inventory-order-system-lld"],
    usage: "LLD exercise sequencing and machine-coding prompt coverage.",
    priority: "primary"
  },
  {
    sourceId: "roadmap-sh",
    topicSlugs: [
      "aws-well-architected",
      "vpc",
      "iam",
      "multi-az",
      "route-53",
      "cloudfront",
      "api-gateway",
      "step-functions",
      "ecs-eks",
      "elasticache",
      "kms",
      "cloudtrail",
      "backup-dr",
      "cost-optimization",
      "resume-linkedin-github",
      "technical-strategy",
      "ai-assisted-learning-evaluator",
      "agentic-ai-foundations"
    ],
    usage: "Role roadmap validation for AWS, DevOps basics, and AI expansion.",
    priority: "supporting"
  },
  {
    sourceId: "aws-docs",
    topicSlugs: [
      "vpc",
      "iam",
      "route-53",
      "cloudfront",
      "alb-nlb",
      "ecs-eks",
      "lambda-api-gateway",
      "sqs-sns-eventbridge",
      "step-functions",
      "rds-dynamodb-elasticache",
      "s3-kms-cloudtrail-cloudwatch",
      "backup-dr",
      "autoscaling-cost-optimization",
      "security-baseline",
      "ci-cd-blue-green-canary"
    ],
    usage: "Primary verification source for AWS service behavior, security boundaries, observability primitives, and production operating constraints.",
    priority: "primary"
  },
  {
    sourceId: "aws-well-architected-framework",
    topicSlugs: [
      "vpc",
      "iam",
      "multi-az",
      "backup-dr",
      "autoscaling-cost-optimization",
      "security-baseline",
      "ci-cd-blue-green-canary",
      "s3-kms-cloudtrail-cloudwatch"
    ],
    usage: "AWS-native architecture review frame for reliability, security, operational excellence, performance, and cost tradeoffs.",
    priority: "primary"
  },
  {
    sourceId: "aws-architecture-center",
    topicSlugs: ["vpc", "route-53", "cloudfront", "alb-nlb", "ecs-eks", "lambda-api-gateway", "backup-dr", "ci-cd-blue-green-canary"],
    usage: "Reference architecture discovery for AWS-first HLD patterns and service combinations.",
    priority: "supporting"
  }
] satisfies SourceTopicMapping[];
