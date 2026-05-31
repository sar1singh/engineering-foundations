export const linearLearningRoadmap = [
  {
    stage: "Junior to Strong Foundation",
    goal: "Become reliable with JavaScript, DSA foundations, SQL basics, and local debugging.",
    topicSlugs: ["scope", "hoisting", "closures", "promises", "hashmap-frequency", "binary-search", "tree-dfs", "select", "joins"]
  },
  {
    stage: "Mid-Level Backend Engineer",
    goal: "Build and debug production backend flows with Node.js, databases, queues, caches, and observability.",
    topicSlugs: ["node-event-loop", "error-handling", "validation", "logging", "streams", "indexes", "query-tuning", "redis-cache-patterns", "queue"]
  },
  {
    stage: "Senior Engineer",
    goal: "Design scalable systems, solve harder algorithms, and make module/API trade-offs.",
    topicSlugs: ["graph-bfs", "dijkstra", "dynamic-programming-core", "api-design-contracts", "module-boundaries", "scalability", "availability", "latency", "payment-system"]
  },
  {
    stage: "Solution Architect",
    goal: "Design AWS-first HLDs with security, resilience, performance, cost, and operations in mind.",
    topicSlugs: ["iam", "vpc", "rds", "lambda", "dynamodb", "multi-az", "autoscaling", "route-53", "backup-dr", "cost-optimization"]
  },
  {
    stage: "Staff Principal EM",
    goal: "Lead architecture, incidents, technical strategy, execution, hiring calibration, and stakeholder communication.",
    topicSlugs: ["hld-payment-system", "hld-booking-system", "architecture-review", "technical-strategy", "incident-leadership", "roadmap-execution", "hiring-interview-calibration", "stakeholder-communication"]
  }
] as const;
