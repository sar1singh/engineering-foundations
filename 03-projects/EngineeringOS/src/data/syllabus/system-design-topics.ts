import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const systemDesignReferences = [
  { id: "reference-sd-primer", title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", sourceType: "roadmap" as const, usage: "Practice and review reference for common system design concepts and interview flows." },
  { id: "reference-sd-google-sre", title: "Google SRE Book", url: "https://sre.google/sre-book/introduction/", sourceType: "docs" as const, usage: "Reference for availability, latency, reliability, capacity planning, and operational thinking." },
  { id: "reference-sd-aws-elb", title: "AWS Elastic Load Balancing docs", url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html", sourceType: "docs" as const, usage: "Reference for load-balancing concepts and traffic distribution." },
  { id: "reference-sd-aws-well-architected", title: "AWS Well-Architected Framework", url: "https://aws.amazon.com/architecture/well-architected/", sourceType: "docs" as const, usage: "AWS-first reference for secure, reliable, efficient, cost-aware solution architecture." },
  { id: "reference-sd-aws-reliability-pillar", title: "AWS Well-Architected Reliability Pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html", sourceType: "docs" as const, usage: "AWS-first reference for availability, failure recovery, distributed-system reliability, and disaster recovery." }
];

function problems(slug: string, title: string): SyllabusPracticeProblem[] {
  return [
    { id: `problem-sd-${slug}-easy`, title: `${title} concept sketch`, difficulty: "easy", tags: ["system-design", slug, "whiteboarding"], prompt: `Explain ${title} in a 5-minute whiteboard sketch with one concrete backend example.`, expectedSignals: ["Clear definition", "Concrete example"] },
    { id: `problem-sd-${slug}-medium`, title: `${title} trade-off drill`, difficulty: "medium", tags: ["system-design", slug, "tradeoffs"], prompt: `Apply ${title} to a realistic design. Include the main trade-off, bottleneck, and failure mode.`, expectedSignals: ["Names trade-off", "Names bottleneck", "Names failure mode"] },
    { id: `problem-sd-${slug}-hard`, title: `${title} 40-minute design`, difficulty: "hard", tags: ["system-design", slug, "design-mock"], prompt: `Run a 40-minute design mock where ${title} is a key decision. Include requirements, APIs, data, scale, failure handling, and trade-offs.`, expectedSignals: ["Complete design flow", "Explicit trade-offs", "Operational concerns"] }
  ];
}

function sdTopic(order: number, slug: string, title: string, phase: string, definition: string, mentalModel: string, theory: string, code: string): SyllabusTopic {
  return {
    id: `syllabus-system-design-${slug}`,
    slug,
    title,
    order,
    sourcePath: "00-control/master-roadmap/06-system-design/INDEX.md",
    definition,
    whyItMatters: `${title} is part of System Design ${phase}. It helps answer senior backend architecture rounds with trade-offs.`,
    mentalModel,
    theory: `${theory}\n\nVisual model: requirements -> traffic/data shape -> component choice -> trade-off -> failure plan.`,
    codeExamples: [{ id: `example-sd-${slug}`, title: `${title} design note`, language: "text", code, explanation: `Compact whiteboard note for ${title}.`, runnable: false }],
    practiceProblems: problems(slug, title),
    interviewQuestions: [`How would you explain ${title} to a senior interviewer?`, `What trade-off does ${title} introduce?`, `How does ${title} fail at scale?`],
    commonMistakes: ["Jumping to technology before requirements", "Ignoring failure modes", "No capacity estimate", "No trade-off discussion"],
    productionUseCases: ["Architecture interviews", "Backend design reviews", "Incident prevention", "Scaling decisions"],
    revisionPrompts: [`Draw ${title} from memory.`, `Name one metric for ${title}.`, `Name one alternative to ${title}.`],
    reviewPrompts: [{ id: `review-sd-${slug}-mentor`, reviewerRole: "mentor", prompt: `Review ${title} as a system design interview answer.`, rubric: ["Requirements clear", "Trade-offs explicit", "Failure mode covered", "Scale signal included"] }],
    references: [...systemDesignReferences, { id: `reference-sd-${slug}-roadmap`, title: "EngineeringOS System Design master roadmap", url: "00-control/master-roadmap/06-system-design/INDEX.md", sourceType: "roadmap", usage: "Local source of truth for System Design ordering and practice platforms." }],
    progressSignals: ["read_definition", "read_theory", "studied_code_example", "ran_code_example", "solved_easy_problem", "solved_medium_problem", "solved_hard_problem", "submitted_explain_back", "completed_mock_review", "scheduled_revision"]
  };
}

export const systemDesignFoundationTopics: SyllabusTopic[] = [
  sdTopic(1, "scalability", "Scalability", "Foundations", "Scalability is a system's ability to handle increased load by adding resources or improving design.", "Scale the bottleneck, not the diagram.", "Discuss vertical vs horizontal scaling, stateless services, partitioning, caching, queues, and the operational cost of each choice.", "Scale path: stateless API -> load balancer -> replicas -> cache -> database partitioning."),
  sdTopic(2, "availability", "Availability", "Foundations", "Availability is the fraction of time a system can successfully serve user requests.", "Remove single points of failure and define what success means.", "High availability needs redundancy, health checks, failover, graceful degradation, and clear SLOs.", "Availability target: successful requests / total valid requests over a time window."),
  sdTopic(3, "reliability", "Reliability", "Foundations", "Reliability is the ability of a system to keep behaving correctly under expected and unexpected conditions.", "Correctness over time, including failures.", "Reliability adds retries, timeouts, idempotency, monitoring, runbooks, and recovery planning.", "Reliability loop: detect -> contain -> recover -> learn."),
  sdTopic(4, "cap-basics", "CAP Basics", "Foundations", "CAP describes the trade-off between consistency, availability, and partition tolerance during network partitions.", "When the network splits, choose how the system behaves.", "CAP is a partition-time framing tool, not a universal excuse. Tie it to concrete reads/writes and user expectations.", "Partition happens -> choose reject/stall for consistency or serve possibly stale data for availability."),
  sdTopic(5, "latency", "Latency", "Foundations", "Latency is the time users or services wait for a response.", "Tail latency often defines user pain.", "Reason about p50/p95/p99, network hops, queues, serialization, database time, and retries.", "Total latency = client + network + app + DB + downstream + queueing.")
];

export const systemDesignBuildingBlockTopics: SyllabusTopic[] = [
  sdTopic(6, "load-balancer", "Load Balancer", "Building Blocks", "A load balancer distributes traffic across healthy backend targets.", "One stable entry, many replaceable workers.", "Load balancers improve availability and horizontal scale through health checks, routing, and target pools.", "Client -> LB -> healthy service replicas."),
  sdTopic(7, "cache", "Cache", "Building Blocks", "A cache stores frequently used data closer to consumers to reduce latency and backend load.", "Fast copy with freshness rules.", "Discuss cache-aside, TTL, invalidation, stampede, hit ratio, and stale reads.", "read key -> cache hit return; miss -> DB -> set TTL."),
  sdTopic(8, "queue", "Queue", "Building Blocks", "A queue buffers work between producers and consumers for async processing.", "Decouple request speed from work speed.", "Queues smooth spikes but introduce retries, idempotency, ordering, and dead-letter handling.", "producer -> queue -> workers -> result/status."),
  sdTopic(9, "db-replica", "DB Replica", "Building Blocks", "A database replica copies data from a primary to support read scaling or failover.", "Scale reads with lag-aware copies.", "Replicas improve read capacity and resilience but create freshness and failover trade-offs.", "writes -> primary; stale-tolerant reads -> replica."),
  sdTopic(10, "cdn", "CDN", "Building Blocks", "A CDN caches content at edge locations close to users.", "Move bytes closer to the user.", "CDNs reduce origin load and latency for static or cacheable content, with invalidation and freshness trade-offs.", "user -> nearest edge -> cache hit or origin fetch.")
];

export const systemDesignCapacityMathTopics: SyllabusTopic[] = [
  sdTopic(11, "dau-mau", "DAU/MAU", "Capacity Math", "DAU and MAU estimate active users per day and month.", "Translate users into load assumptions.", "Use DAU/MAU to derive peak users, requests, storage, and growth estimates.", "Example: 10M DAU * 20 actions/day = 200M actions/day."),
  sdTopic(12, "rps", "RPS", "Capacity Math", "RPS is requests per second, usually estimated from daily volume and peak multiplier.", "Average hides peak; design for peak.", "RPS estimates drive service replicas, database QPS, queue throughput, and rate limits.", "avg RPS = daily requests / 86400; peak RPS = avg * peak factor."),
  sdTopic(13, "storage-estimation", "Storage Estimation", "Capacity Math", "Storage estimation predicts data size from records, media, indexes, replicas, and retention.", "Bytes per item times volume times copies.", "Include metadata, indexes, compression, replication, and retention. Storage often drives partitioning and archival design.", "storage = events/day * bytes/event * retention_days * replication_factor.")
];

export const systemDesignCommonSystemTopics: SyllabusTopic[] = [
  sdTopic(14, "url-shortener", "URL Shortener", "Common Systems", "A URL shortener maps short codes to long URLs and redirects users efficiently.", "Generate unique codes, store mapping, serve redirect fast.", "Discuss code generation, collision handling, redirect latency, analytics, abuse controls, and cache.", "POST /urls -> code; GET /:code -> lookup -> 301/302 redirect."),
  sdTopic(15, "chat-system", "Chat System", "Common Systems", "A chat system delivers messages between users with low latency and durable history.", "Realtime delivery plus durable message log.", "Discuss WebSockets, message storage, online presence, fanout, ordering, retries, and push notifications.", "sender -> gateway -> message store -> recipient fanout."),
  sdTopic(16, "feed-system", "Feed System", "Common Systems", "A feed system ranks and serves personalized lists of posts or activities.", "Precompute where possible, rank at read where needed.", "Discuss fanout-on-write vs fanout-on-read, ranking, cache, pagination, and hot users.", "write post -> fanout queues -> feed cache; read feed -> ranked page."),
  sdTopic(17, "booking-system", "Booking System", "Common Systems", "A booking system reserves scarce inventory such as seats, rooms, or slots.", "Prevent double booking under concurrency.", "Discuss inventory modeling, locks/transactions, holds, payment timeout, idempotency, and consistency.", "search -> hold inventory -> payment -> confirm or release."),
  sdTopic(18, "payment-system", "Payment System", "Common Systems", "A payment system moves money through authorized, idempotent, auditable workflows.", "Money workflows need idempotency and reconciliation.", "Discuss payment intents, idempotency keys, ledger records, retries, webhooks, fraud checks, and reconciliation.", "create intent -> authorize -> capture -> ledger -> webhook reconcile."),
  sdTopic(19, "notification-system", "Notification System", "Common Systems", "A notification system sends messages through channels such as email, SMS, push, or in-app.", "Right message, right channel, bounded retries.", "Discuss preferences, templates, queues, rate limits, provider failover, dedupe, and delivery tracking.", "event -> preference check -> queue -> provider -> delivery status.")
];

export const systemDesignAdvancedTopics: SyllabusTopic[] = [
  sdTopic(20, "multi-region", "Multi-region", "Advanced", "Multi-region architecture runs service capacity in multiple geographic regions for latency, availability, or disaster recovery.", "Regions reduce blast radius but complicate data consistency.", "Discuss active-active vs active-passive, routing, replication, failover, data residency, and operational complexity.", "traffic manager -> nearest/healthy region -> replicated data layer."),
  sdTopic(21, "eventual-consistency", "Eventual Consistency", "Advanced", "Eventual consistency means replicas or derived views may temporarily differ but converge if no new updates occur.", "Accept temporary staleness for availability or scale.", "Discuss user-visible staleness, reconciliation, conflict handling, read-your-writes needs, and compensating workflows.", "write accepted -> async propagation -> replicas converge."),
  sdTopic(22, "idempotency", "Idempotency", "Advanced", "Idempotency ensures retrying the same operation does not create duplicate side effects.", "Retries are safe when requests have identity.", "Discuss idempotency keys, dedupe stores, exactly-once myths, payment safety, and queue processing.", "request(idempotencyKey) -> check previous result -> execute once -> return same result."),
  sdTopic(23, "disaster-recovery", "Disaster Recovery", "Advanced", "Disaster recovery is the plan and architecture for restoring service after major failure.", "Know what you can lose and how fast you must return.", "Discuss RTO, RPO, backups, restore testing, failover, runbooks, and communication.", "backup/replica -> failover procedure -> validate data -> restore traffic.")
];
