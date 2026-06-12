import type { InterviewQuestion } from "@/types/founder-beta";

const DSA_TOPICS = [
  "topic-dsa-arrays-hashing", "topic-dsa-arrays-hashing", "topic-dsa-arrays-hashing",
  "topic-dsa-two-pointers-sliding-window", "topic-dsa-two-pointers-sliding-window",
  "topic-dsa-arrays-hashing",
  "topic-dsa-heaps-greedy-dp", "topic-dsa-heaps-greedy-dp", "topic-dsa-heaps-greedy-dp",
  "topic-dsa-heaps-greedy-dp",
  "topic-dsa-trees-graphs",
  "topic-dsa-trees-graphs", "topic-dsa-trees-graphs",
  "topic-dsa-heaps-greedy-dp",
  "topic-dsa-heaps-greedy-dp",
  "topic-dsa-trees-graphs",
  "topic-dsa-trees-graphs",
  "topic-dsa-heaps-greedy-dp",
  "topic-dsa-complexity-analysis",
  "topic-dsa-heaps-greedy-dp"
];

const DSA_SKILLS = [
  "skill-dsa-array-techniques", "skill-dsa-string-techniques", "skill-dsa-hashing-techniques",
  "skill-dsa-two-pointer-techniques", "skill-dsa-sliding-window-techniques",
  "skill-dsa-binary-search-techniques",
  "skill-dsa-linked-list-techniques", "skill-dsa-stack-techniques", "skill-dsa-queue-techniques",
  "skill-dsa-sorting-techniques",
  "skill-dsa-recursion-techniques",
  "skill-dsa-tree-techniques", "skill-dsa-bst-techniques",
  "skill-dsa-heap-techniques",
  "skill-dsa-greedy-techniques",
  "skill-dsa-backtracking-techniques",
  "skill-dsa-graph-techniques",
  "skill-dsa-dp-techniques",
  "skill-dsa-complexity-analysis",
  "skill-dsa-dp-techniques"
];

const LLD_TOPICS = [
  "topic-lld-api-contracts", "topic-lld-api-contracts", "topic-lld-rate-limiter",
  "topic-lld-workflow-engine", "topic-lld-cache-design",
  "topic-lld-api-contracts", "topic-lld-api-contracts", "topic-lld-rate-limiter",
  "topic-lld-workflow-engine", "topic-lld-cache-design",
  "topic-lld-api-contracts", "topic-lld-api-contracts", "topic-lld-rate-limiter",
  "topic-lld-workflow-engine", "topic-lld-cache-design",
  "topic-lld-api-contracts", "topic-lld-api-contracts", "topic-lld-rate-limiter",
  "topic-lld-workflow-engine", "topic-lld-cache-design"
];

const HLD_CAP_IDS = [
  "cap-system-design-hld", "cap-system-design-hld", "cap-system-design-hld",
  "cap-system-design-hld", "cap-system-design-hld",
  "cap-system-design-hld", "cap-system-design-hld", "cap-system-design-hld",
  "cap-system-design-hld", "cap-system-design-hld",
  "cap-distributed-systems", "cap-distributed-systems", "cap-distributed-systems",
  "cap-distributed-systems", "cap-distributed-systems",
  "cap-distributed-systems", "cap-distributed-systems", "cap-distributed-systems",
  "cap-distributed-systems", "cap-distributed-systems"
];

const HLD_SKILLS = [
  "skill-hld-requirements", "skill-hld-tradeoffs", "skill-hld-requirements",
  "skill-distributed-consistency", "skill-hld-tradeoffs",
  "skill-hld-requirements", "skill-hld-tradeoffs", "skill-hld-interview-execution",
  "skill-async-architecture", "skill-hld-interview-execution",
  "skill-distributed-consistency", "skill-distributed-consistency",
  "skill-distributed-consistency", "skill-distributed-consistency",
  "skill-distributed-consistency",
  "skill-distributed-consistency", "skill-async-architecture",
  "skill-async-architecture", "skill-async-architecture",
  "skill-distributed-consistency"
];

const HLD_TOPICS = [
  "topic-hld-capacity-estimation", "topic-notification-system-design",
  "topic-architecture-tradeoffs", "topic-consistency-models",
  "topic-caching", "topic-caching",
  "topic-load-balancing", "topic-queues",
  "topic-event-driven-architecture", "topic-architecture-tradeoffs",
  "topic-queues", "topic-consistency-models",
  "topic-replication-partitioning", "topic-data-partitioning",
  "topic-observability-logs-metrics-traces",
  "topic-consistency-models", "topic-saga-workflows",
  "topic-event-driven-architecture", "topic-event-driven-architecture",
  "topic-consistency-models"
];

const AWS_SKILLS = [
  "skill-aws-foundations", "skill-aws-foundations", "skill-aws-data-messaging",
  "skill-aws-foundations", "skill-aws-foundations",
  "skill-aws-data-messaging", "skill-aws-architecture-review",
  "skill-aws-architecture-review", "skill-aws-foundations",
  "skill-aws-architecture-review"
];

const AWS_TOPICS = [
  "topic-aws-compute-options", "topic-aws-s3-basics", "topic-aws-rds-basics",
  "topic-aws-vpc-networking", "topic-aws-iam-basics",
  "topic-aws-sqs-sns-eventbridge", "topic-aws-multi-az-design",
  "topic-aws-cost-performance-tradeoffs", "topic-aws-vpc-networking",
  "topic-aws-well-architected"
];

const BEHAVIORAL_TOPICS = [
  "topic-behavioral-star-stories", "topic-behavioral-star-stories",
  "topic-behavioral-star-stories", "topic-ownership-story",
  "topic-ownership-story",
  "topic-behavioral-star-stories", "topic-incident-story",
  "topic-communication-tradeoffs", "topic-stakeholder-update",
  "topic-delivery-risk-communication",
  "topic-cross-team-dependency-management", "topic-behavioral-star-stories",
  "topic-incident-story", "topic-ownership-story",
  "topic-behavioral-star-stories"
];

const LEADERSHIP_TOPICS = [
  "topic-delivery-risk-communication", "topic-communication-tradeoffs",
  "topic-cross-team-dependency-management", "topic-mentoring-senior-engineers",
  "topic-technical-excellence-tradeoffs",
  "topic-delivery-risk-communication", "topic-cross-team-dependency-management",
  "topic-communication-tradeoffs", "topic-stakeholder-update",
  "topic-cross-team-dependency-management"
];

export const founderBetaInterviewQuestions: InterviewQuestion[] = [
  // DSA (20 questions)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `iq-dsa-${i + 1}`,
    category: "dsa" as const,
    capabilityId: "cap-dsa-problem-solving",
    skillId: DSA_SKILLS[i],
    topicId: DSA_TOPICS[i],
    difficulty: (i < 7 ? "easy" : i < 14 ? "medium" : "hard") as "easy" | "medium" | "hard",
    estimatedMinutes: 15 + (i % 3) * 10,
    tags: [["arrays", "hash-map"], ["strings", "two-pointers"], ["hash-map", "counting"], ["two-pointers", "sorting"], ["sliding-window", "optimization"], ["binary-search", "search"], ["linked-list", "pointers"], ["stack", "parsing"], ["queue", "simulation"], ["sorting", "comparators"], ["recursion", "divide-conquer"], ["trees", "traversal"], ["bst", "search"], ["heap", "priority"], ["greedy", "optimization"], ["backtracking", "enumeration"], ["graphs", "bfs-dfs"], ["dp", "optimization"], ["complexity", "analysis"], ["dp", "advanced"]][i],
    rubricIds: ["rubric-dsa-correctness", "rubric-dsa-complexity", "rubric-dsa-communication"],
    prompt: [
      "Solve a problem using array/hash-map techniques and explain your approach.",
      "Implement string manipulation with two-pointer technique and analyze time complexity.",
      "Use a hash map to solve a frequency counting problem and discuss collision handling.",
      "Apply the two-pointer technique to a sorted array problem and explain edge cases.",
      "Solve a sliding window maximum problem and analyze the optimal approach.",
      "Implement binary search on a rotated sorted array and discuss invariants.",
      "Reverse a linked list recursively and iteratively — compare approaches.",
      "Use a stack to implement a browser back/forward navigation and discuss tradeoffs.",
      "Implement a queue using two stacks and analyze amortized complexity.",
      "Sort a list of objects by multiple criteria and discuss stable vs unstable sort.",
      "Solve a recursion problem (e.g. generate all permutations) and analyze the recursion tree.",
      "Traverse a binary tree in level order and discuss BFS vs DFS memory tradeoffs.",
      "Implement a BST with search, insert, and delete operations. Discuss balancing strategies.",
      "Find the kth largest element using a heap and compare with quickselect.",
      "Solve a greedy interval scheduling problem and prove optimal substructure.",
      "Find all subsets of a set using backtracking and discuss pruning strategies.",
      "Implement BFS and DFS on a graph. Compare use cases for traversal strategies.",
      "Solve a classic DP problem (e.g. knapsack, edit distance) and derive recurrence relation.",
      "Analyze the time and space complexity of a given algorithm — walk through each operation.",
      "Implement a solution to a complex DP problem and optimize space complexity."
    ][i],
    context: [
      undefined, undefined, undefined, undefined,
      "Example: Given an array of integers, find the maximum sum of any contiguous subarray of size k.",
      "The array is sorted in ascending order, then rotated at an unknown pivot.",
      undefined, undefined, undefined, undefined, undefined,
      "Consider both recursive and iterative approaches.",
      undefined, undefined,
      "Given a set of intervals [start, end], find the maximum number of non-overlapping intervals.",
      undefined,
      "The graph is undirected and may contain cycles.",
      undefined,
      "Present a function and analyze its Big O time and space complexity.",
      undefined
    ][i]
  })),

  // LLD (20 questions)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `iq-lld-${i + 1}`,
    category: "lld" as const,
    capabilityId: "cap-low-level-design",
    skillId: "skill-lld-api-modeling",
    topicId: LLD_TOPICS[i],
    difficulty: (i < 7 ? "easy" : i < 14 ? "medium" : "hard") as "easy" | "medium" | "hard",
    estimatedMinutes: 20 + (i % 3) * 10,
    tags: [["design", "classes"], ["api", "contracts"], ["patterns", "design"], ["modules", "boundaries"], ["extensibility", "solid"], ["composition", "inheritance"], ["interface", "contract"], ["singleton", "factory"], ["separation", "concerns"], ["open-closed", "principle"], ["dependency", "injection"], ["rest", "api-design"], ["observer", "pattern"], ["strategy", "pattern"], ["encapsulation", "solid"], ["state", "management"], ["error-handling", "design"], ["adapter", "pattern"], ["coupling", "cohesion"], ["polymorphism", "design"]][i],
    rubricIds: ["rubric-lld-requirements", "rubric-lld-design-quality", "rubric-lld-extensibility"],
    prompt: [
      "Design a parking lot system. Identify the key classes, objects, and relationships.",
      "Design an API for a URL shortener service. Define endpoints, request/response shapes, and error handling.",
      "Implement the Observer pattern for a notification system. Discuss when to use publishing vs callbacks.",
      "Design the module boundaries for a payment processing system. Define interfaces and separation of concerns.",
      "Design a logging framework that supports multiple output targets. How do you make it extensible?",
      "Model a library management system. Compare composition vs inheritance in your class design.",
      "Define a REST API contract for a booking system. Include versioning strategy and backward compatibility.",
      "Design a rate limiter using appropriate design patterns. Compare token bucket vs sliding window.",
      "Design the module structure for a microservice-based ecommerce platform. Define service boundaries.",
      "Design a plugin system for a code editor. How do you ensure new plugins can be added without modifying core code?",
      "Design a dependency injection container. Discuss constructor injection vs setter injection tradeoffs.",
      "Design a RESTful API for a task management system with validation, pagination, and error responses.",
      "Design an event-driven notification system using the Observer pattern. Discuss memory management.",
      "Implement the Strategy pattern for a shipping cost calculator. How do you add new shipping providers?",
      "Design a configuration management system with extensible backends (env, file, remote).",
      "Design a state machine for an order processing system. Model states, transitions, and actions.",
      "Design an error handling strategy for a distributed system. Define error types, retry logic, and fallbacks.",
      "Design an adapter layer to integrate a legacy CRM with a modern API. Discuss abstraction and testing.",
      "Analyze the coupling and cohesion of a given class design and refactor for better separation of concerns.",
      "Design a shape hierarchy (Circle, Rectangle, Triangle) with polymorphism. Discuss the Liskov Substitution Principle."
    ][i],
    context: [
      "The parking lot has multiple levels, different vehicle types, and an entry/exit system.",
      undefined, undefined,
      "The system processes payments via credit card, PayPal, and wire transfer.",
      undefined, undefined,
      "The API must support both JSON and XML responses.",
      undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
      "A given class violates the Single Responsibility Principle.",
      undefined
    ][i]
  })),

  // HLD / System Design (20 questions)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `iq-hld-${i + 1}`,
    category: (i < 15 ? "hld" : "system-design") as "hld" | "system-design",
    capabilityId: HLD_CAP_IDS[i],
    skillId: HLD_SKILLS[i],
    topicId: HLD_TOPICS[i],
    difficulty: (i < 7 ? "easy" : i < 14 ? "medium" : "hard") as "easy" | "medium" | "hard",
    estimatedMinutes: 25 + (i % 3) * 10,
    tags: [["architecture", "system-design"], ["scalability", "horizontal-scaling"], ["availability", "failover"], ["consistency", "cap-theorem"], ["database", "sharding"], ["caching", "cdn"], ["load-balancing", "routing"], ["microservices", "decomposition"], ["messaging", "async"], ["security", "auth"],
           ["fault-tolerance", "resilience"], ["consensus", "raft"], ["replication", "leader-election"], ["partitioning", "sharding"], ["monitoring", "observability"],
           ["consistency-models", "cap"], ["distributed-transactions", "saga"], ["event-sourcing", "events"], ["cqrs", "read-write-separation"], ["cap-theorem", "tradeoffs"]][i],
    rubricIds: ["rubric-hld-scalability", "rubric-hld-tradeoffs", "rubric-hld-reliability"],
    prompt: [
      "Design a URL shortener like TinyURL. Cover the data model, API, and scaling strategy.",
      "Design a scalable chat system. Discuss how to handle 10M concurrent connections.",
      "Design a highly available key-value store. Discuss replication, failover, and consistency tradeoffs.",
      "Design a distributed transaction system for a booking platform. Discuss consistency guarantees.",
      "Design the database schema for a social media platform. Discuss sharding and indexing strategy.",
      "Design a caching layer for a news feed system. Discuss cache invalidation and write-through strategies.",
      "Design a load balancing strategy for a global e-commerce platform. Discuss routing algorithms.",
      "Design a microservices decomposition for an ecommerce platform. Discuss service boundaries and inter-service communication.",
      "Design an event-driven architecture for a real-time analytics pipeline.",
      "Design the authentication and authorization system for an enterprise SaaS platform.",
      "Design a fault-tolerant message queue. Discuss durability, replication, and exactly-once semantics.",
      "Design a consensus-based configuration service. Compare Paxos and Raft tradeoffs.",
      "Design a multi-region database replication strategy. Discuss conflict resolution.",
      "Design a data partitioning strategy for a time-series database. Discuss hot partition mitigation.",
      "Design a distributed monitoring and alerting system. Discuss metrics collection, aggregation, and alert routing.",
      "Design a system that needs strong consistency and high availability. Discuss CAP tradeoffs.",
      "Design a saga-based distributed transaction for a travel booking system.",
      "Design an event sourcing system for an audit log. Discuss event versioning and replay.",
      "Design a CQRS-based read model for a reporting system. Discuss eventual consistency.",
      "Design a system and analyze its CAP theorem tradeoffs. Justify your consistency choice."
    ][i],
    context: [
      undefined, undefined, undefined, undefined,
      "Handle 100M users with 1B daily interactions.",
      undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined,
      "The system processes financial transactions.",
      "The booking involves flight, hotel, and car rental services.",
      undefined,
      "The reporting system needs to handle complex aggregations without impacting write performance.",
      undefined
    ][i]
  })),

  // AWS (10 questions)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `iq-aws-${i + 1}`,
    category: "aws" as const,
    capabilityId: "cap-aws-cloud-architecture",
    skillId: AWS_SKILLS[i],
    topicId: AWS_TOPICS[i],
    difficulty: (i < 4 ? "easy" : i < 8 ? "medium" : "hard") as "easy" | "medium" | "hard",
    estimatedMinutes: 15 + (i % 3) * 10,
    tags: [["ec2", "compute"], ["s3", "storage"], ["rds", "dynamodb"], ["vpc", "networking"], ["iam", "security"], ["lambda", "serverless"], ["multi-az", "ha"], ["cost", "optimization"], ["migration", "strategy"], ["well-architected", "review"]][i],
    rubricIds: ["rubric-hld-scalability", "rubric-hld-reliability", "rubric-hld-tradeoffs"],
    prompt: [
      "Design an EC2-based auto-scaling architecture for a web application. Discuss instance types and scaling policies.",
      "Design a data lake architecture using S3. Discuss storage classes, lifecycle policies, and access control.",
      "Compare RDS vs DynamoDB for a social media application. Discuss read/write patterns and scaling.",
      "Design a VPC architecture with public and private subnets across multiple AZs. Discuss NAT gateway vs instance.",
      "Design an IAM policy for a multi-account AWS organization. Discuss roles, policies, and permission boundaries.",
      "Design a serverless event-processing pipeline using Lambda, SQS, and S3. Discuss cold start mitigation.",
      "Design a multi-region active-active architecture. Discuss Route 53, DynamoDB Global Tables, and failover strategy.",
      "Design a cost-optimized architecture for a data processing workload. Discuss reserved instances and spot fleet.",
      "Design a migration strategy from on-premises to AWS. Discuss the 7 Rs and phased approach.",
      "Conduct a Well-Architected review of a given architecture. Identify risks and recommend improvements."
    ][i],
    context: [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
      "The architecture is a legacy monolith running on a single EC2 instance."
    ][i]
  })),

  // Behavioral (15 questions)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `iq-behavioral-${i + 1}`,
    category: "behavioral" as const,
    capabilityId: "cap-behavioral-communication",
    skillId: "skill-senior-storytelling",
    topicId: BEHAVIORAL_TOPICS[i],
    difficulty: (i < 5 ? "easy" : i < 10 ? "medium" : "hard") as "easy" | "medium" | "hard",
    estimatedMinutes: 10 + (i % 3) * 5,
    tags: [["star", "conflict"], ["star", "failure"], ["star", "success"], ["star", "leadership"], ["star", "initiative"],
           ["star", "collaboration"], ["star", "mentorship"], ["star", "technical-decision"], ["star", "ambiguity"], ["star", "deadline"],
           ["star", "cross-functional"], ["star", "difficult-conversation"], ["star", "innovation"], ["star", "ownership"], ["star", "growth"]][i],
    rubricIds: ["rubric-behavioral-star", "rubric-behavioral-ownership", "rubric-behavioral-impact"],
    prompt: [
      "Tell me about a time you had a disagreement with a team member. How did you resolve it?",
      "Describe a project that failed. What went wrong and what did you learn?",
      "Tell me about your biggest professional achievement. What was your specific contribution?",
      "Describe a time you led a team through a difficult technical challenge.",
      "Tell me about a time you took initiative beyond your defined role.",
      "Describe a situation where you had to collaborate across multiple teams to deliver a result.",
      "Tell me about a time you mentored a junior engineer. What was the outcome?",
      "Describe a technical decision you made that had significant impact. How did you arrive at it?",
      "Tell me about a time you worked on a project with ambiguous requirements. How did you handle it?",
      "Describe a situation where you had to deliver under a tight deadline. What tradeoffs did you make?",
      "Tell me about a time you worked with a cross-functional team (product, design, business).",
      "Describe a difficult conversation you had with a stakeholder or peer. How did you handle it?",
      "Tell me about a time you introduced a new process or technology that improved team efficiency.",
      "Describe a situation where you took ownership of a problem outside your area of responsibility.",
      "Tell me about a time you received constructive criticism. How did you respond and grow from it?"
    ][i],
    context: undefined
  })),

  // Leadership (10 questions)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `iq-leadership-${i + 1}`,
    category: "leadership" as const,
    capabilityId: "cap-delivery-leadership",
    skillId: "skill-delivery-leadership",
    topicId: LEADERSHIP_TOPICS[i],
    difficulty: (i < 3 ? "easy" : i < 7 ? "medium" : "hard") as "easy" | "medium" | "hard",
    estimatedMinutes: 10 + (i % 3) * 5,
    tags: [["vision", "strategy"], ["decision-making", "tradeoffs"], ["team-building", "hiring"], ["coaching", "growth"],
           ["technical", "excellence"], ["delivery", "execution"], ["planning", "roadmap"], ["risk", "management"],
           ["communication", "alignment"], ["culture", "standards"]][i],
    rubricIds: ["rubric-behavioral-star", "rubric-behavioral-ownership", "rubric-behavioral-impact"],
    prompt: [
      "Describe your approach to setting a technical vision for a team or organization.",
      "Tell me about a high-stakes technical decision you made. How did you evaluate tradeoffs?",
      "Describe your approach to hiring and building a strong engineering team.",
      "Tell me about a time you coached an engineer to reach the next level in their career.",
      "How do you maintain technical excellence while delivering at speed? Describe a real example.",
      "Describe a time you delivered a complex project on time despite significant challenges.",
      "Tell me about your approach to roadmap planning and prioritization across multiple stakeholders.",
      "Describe a time you identified and mitigated a significant project risk before it became a problem.",
      "How do you ensure alignment between engineering, product, and business teams?",
      "Describe how you established engineering standards and practices on a team that lacked them."
    ][i],
    context: undefined
  })),

  // Resume / Project Deep Dive (10 questions)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `iq-resume-${i + 1}`,
    category: (i < 5 ? "resume-deep-dive" : "project-deep-dive") as "resume-deep-dive" | "project-deep-dive",
    capabilityId: "cap-career-assets",
    skillId: "skill-architect-positioning",
    topicId: i < 5 ? "topic-resume-positioning" : "topic-portfolio-case-study-packaging",
    difficulty: (i < 3 ? "easy" : i < 7 ? "medium" : "hard") as "easy" | "medium" | "hard",
    estimatedMinutes: 10 + (i % 3) * 5,
    tags: [["resume", "impact"], ["resume", "metrics"], ["resume", "narrative"], ["resume", "gap"], ["resume", "target-role"],
           ["project", "architecture"], ["project", "challenge"], ["project", "contribution"], ["project", "leadership"], ["project", "outcome"]][i],
    rubricIds: ["rubric-behavioral-impact", "rubric-behavioral-ownership"],
    prompt: [
      "Walk me through your resume. Choose one role and explain the impact you made.",
      "Describe a specific metric or outcome from your resume. How was it measured?",
      "Tell the story of your career progression. Why did you make each transition?",
      "Explain a gap in your resume. What were you doing during that time and what did you learn?",
      "How does your experience map to this target role? What are your strongest transferable skills?",
      "Walk me through the architecture of a project you're proud of. What would you do differently?",
      "Describe the hardest technical challenge you faced in a past project and how you solved it.",
      "Tell me about a specific contribution you made to a project. What was your exact role?",
      "Describe a time you led a project from concept to delivery. How did you organize the work?",
      "Describe a project's business impact. How did your technical decisions affect the outcome?"
    ][i],
    context: undefined
  }))
];

export const interviewQuestionsByCategory = (category: string): InterviewQuestion[] =>
  founderBetaInterviewQuestions.filter((q) => q.category === category);

export const interviewQuestionsByCapability = (capabilityId: string): InterviewQuestion[] =>
  founderBetaInterviewQuestions.filter((q) => q.capabilityId === capabilityId);

export const interviewQuestionsBySkill = (skillId: string): InterviewQuestion[] =>
  founderBetaInterviewQuestions.filter((q) => q.skillId === skillId);

export const getInterviewQuestionById = (id: string): InterviewQuestion | undefined =>
  founderBetaInterviewQuestions.find((q) => q.id === id);
