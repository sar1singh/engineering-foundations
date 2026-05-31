import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const hldReferences = [
  { id: "reference-hld-system-design-primer", title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", sourceType: "roadmap" as const, usage: "Public GitHub reference for system design topics, interview flows, and sample designs." },
  { id: "reference-hld-roadmap-system-design", title: "roadmap.sh System Design", url: "https://roadmap.sh/system-design", sourceType: "roadmap" as const, usage: "External guided path for system design foundations and practice." },
  { id: "reference-hld-aws-architecture-center", title: "AWS Architecture Center", url: "https://aws.amazon.com/architecture/", sourceType: "docs" as const, usage: "AWS-first architecture patterns and reference diagrams for HLD variants." },
  { id: "reference-hld-aws-well-architected", title: "AWS Well-Architected Framework", url: "https://docs.aws.amazon.com/en_us/wellarchitected/latest/framework/welcome.html", sourceType: "docs" as const, usage: "AWS-first review lens for secure, reliable, performant, and cost-aware designs." }
];

function caseProblems(slug: string, title: string): SyllabusPracticeProblem[] {
  return [
    { id: `problem-hld-${slug}-easy`, title: `${title} requirements`, difficulty: "easy", tags: ["hld", slug, "requirements"], prompt: `Write functional and non-functional requirements for ${title}. Include APIs and core data entities.`, expectedSignals: ["Functional requirements", "NFRs", "APIs", "Data entities"] },
    { id: `problem-hld-${slug}-medium`, title: `${title} AWS HLD`, difficulty: "medium", tags: ["hld", slug, "aws"], prompt: `Design ${title} on AWS. Include compute, storage, network, cache/queue if needed, and failure handling.`, expectedSignals: ["AWS components fit", "Failure path", "Trade-off"] },
    { id: `problem-hld-${slug}-hard`, title: `${title} staff review`, difficulty: "hard", tags: ["hld", slug, "staff-engineer"], prompt: `Review a proposed ${title} design. Identify bottlenecks, risks, cost drivers, and migration/rollout plan.`, expectedSignals: ["Finds risks", "Gives alternatives", "Rollout plan"] }
  ];
}

function hldCase(input: {
  order: number;
  slug: string;
  title: string;
  definition: string;
  mentalModel: string;
  theory: string;
  awsVariant: string;
}): SyllabusTopic {
  return {
    id: `syllabus-hld-${input.slug}`,
    slug: input.slug,
    title: input.title,
    order: input.order,
    sourcePath: "00-control/master-roadmap/06-system-design/INDEX.md",
    definition: input.definition,
    whyItMatters: `${input.title} is a core HLD case study for senior/staff/architect interviews.`,
    mentalModel: input.mentalModel,
    theory: `${input.theory}\n\nAWS deployment variant: ${input.awsVariant}`,
    codeExamples: [{ id: `example-hld-${input.slug}`, title: `${input.title} whiteboard skeleton`, language: "text", code: `1. Clarify requirements\n2. Estimate traffic/storage\n3. Define APIs\n4. Choose data model\n5. Draw components\n6. Handle scale/failure\n7. Review trade-offs\n\nAWS variant:\n${input.awsVariant}`, explanation: `Reusable HLD interview skeleton for ${input.title}.`, runnable: false }],
    practiceProblems: caseProblems(input.slug, input.title),
    interviewQuestions: [`What are the core requirements for ${input.title}?`, `Where is the bottleneck?`, `How would the AWS deployment change at 10x scale?`],
    commonMistakes: ["No requirements before diagram", "No capacity estimate", "No failure handling", "No cost/security discussion"],
    productionUseCases: ["HLD interviews", "Architecture reviews", "AWS solution design", "Staff-level design docs"],
    revisionPrompts: [`Design ${input.title} in 40 minutes.`, `Add one AWS failure scenario.`, `Explain one trade-off to an EM/stakeholder.`],
    reviewPrompts: [{ id: `review-hld-${input.slug}-mentor`, reviewerRole: "mentor", prompt: `Review ${input.title} like a senior/staff system design interviewer.`, rubric: ["Requirements clear", "AWS choices justified", "Scale/failure covered", "Trade-offs explicit"] }],
    references: [...hldReferences, { id: `reference-hld-${input.slug}-local-roadmap`, title: "EngineeringOS System Design master roadmap", url: "00-control/master-roadmap/06-system-design/INDEX.md", sourceType: "roadmap", usage: "Local source for HLD case-study ordering." }],
    progressSignals: ["read_definition", "read_theory", "studied_code_example", "ran_code_example", "solved_easy_problem", "solved_medium_problem", "solved_hard_problem", "submitted_explain_back", "completed_mock_review", "scheduled_revision"]
  };
}

export const hldCaseStudyTopics: SyllabusTopic[] = [
  hldCase({ order: 1, slug: "hld-url-shortener", title: "URL Shortener HLD", definition: "Design a service that creates short links and redirects users to long URLs reliably and quickly.", mentalModel: "Write path generates mapping; read path must redirect fast.", theory: "Cover code generation, collision handling, storage, redirect latency, analytics, abuse prevention, cache, and data retention.", awsVariant: "API Gateway/ALB -> Lambda or ECS service -> DynamoDB/RDS for mappings -> ElastiCache for hot redirects -> CloudFront optional edge caching -> CloudWatch/CloudTrail." }),
  hldCase({ order: 2, slug: "hld-chat-system", title: "Chat System HLD", definition: "Design real-time messaging with durable history, presence, fanout, and notification delivery.", mentalModel: "Realtime connection plus durable message log.", theory: "Cover WebSocket gateways, message ordering, offline delivery, presence, push notifications, storage partitioning, and backpressure.", awsVariant: "API Gateway WebSocket or ALB/ECS -> message service -> DynamoDB/RDS for messages -> ElastiCache for presence -> SNS/SQS for fanout -> Lambda workers for notifications." }),
  hldCase({ order: 3, slug: "hld-feed-system", title: "Feed System HLD", definition: "Design a personalized feed that ranks and serves posts or activities at scale.", mentalModel: "Choose fanout-on-write, fanout-on-read, or hybrid based on celebrity/skew patterns.", theory: "Cover ranking, pagination, hot users, feed cache, write amplification, read latency, and freshness.", awsVariant: "ECS/Lambda APIs -> DynamoDB/RDS for posts/follows -> SQS fanout workers -> ElastiCache feed cache -> OpenSearch optional search/ranking -> CloudFront for media." }),
  hldCase({ order: 4, slug: "hld-booking-system", title: "Booking System HLD", definition: "Design scarce inventory reservation without double booking.", mentalModel: "Search is eventually consistent; booking confirmation needs strong consistency.", theory: "Cover availability search, holds, payment timeout, transactions/locks, idempotency, overbooking prevention, and reconciliation.", awsVariant: "API service on ECS/Lambda -> RDS with transactions for inventory -> ElastiCache for search availability cache -> SQS for expiry/release workers -> Step Functions for booking/payment workflow." }),
  hldCase({ order: 5, slug: "hld-payment-system", title: "Payment System HLD", definition: "Design payment workflows with idempotency, auditability, retries, and reconciliation.", mentalModel: "Money systems need a ledger, idempotency, and explicit state transitions.", theory: "Cover payment intents, idempotency keys, provider webhooks, ledger events, retries, fraud checks, settlement, and reconciliation.", awsVariant: "API -> Step Functions payment workflow -> RDS ledger -> SQS retry/DLQ -> KMS for secrets/encryption -> CloudTrail/CloudWatch audit -> private networking for providers." }),
  hldCase({ order: 6, slug: "hld-notification-system", title: "Notification System HLD", definition: "Design multi-channel notifications with preferences, templates, providers, retries, and delivery tracking.", mentalModel: "Events become channel-specific delivery attempts.", theory: "Cover template rendering, user preferences, dedupe, priority, provider failover, rate limits, retries, and analytics.", awsVariant: "EventBridge/SNS topic -> SQS per channel -> Lambda/ECS workers -> SES/SNS/push provider -> DynamoDB delivery log -> CloudWatch alarms." })
];
