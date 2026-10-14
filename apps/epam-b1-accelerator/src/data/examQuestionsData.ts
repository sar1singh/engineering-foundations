export interface ExamQuestion {
  id: string;
  domain: 'Solution Arch' | 'Application Arch' | 'Cloud' | 'SDLC Processes' | 'Leadership & Soft' | 'AI' | 'Business';
  targetBar: 'Novice' | 'Intermediate' | 'Advanced';
  competencyId: string;
  scenario: string;
  question: string;
  options: {
    id: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  b1Relevance: string;
}

export const EXAM_QUESTIONS: ExamQuestion[] = [
  // --- DOMAIN 1: SOLUTION ARCHITECTURE (Box 3 - Advanced) ---
  {
    id: 'EX-01',
    domain: 'Solution Arch',
    targetBar: 'Advanced',
    competencyId: 'comp-1',
    scenario: 'You are architecting the vehicle catalog persistence tier for Cox Automotive. The system handles 2,500 RPS peak writes and 15,000 RPS reads. Automotive inventory has complex 1:N relations (Dealer -> Showrooms -> Vehicles -> Inspections).',
    question: 'Why does an EPAM B1 Senior Architect defend a DynamoDB Single-Table Design over Aurora PostgreSQL in this high-scale scenario?',
    options: [
      { id: 'A', text: 'DynamoDB has lower total AWS hosting cost regardless of traffic patterns or schema access requirements.' },
      { id: 'B', text: 'Single-Table Design eliminates SQL query planner overhead and complex joins, providing predictable O(1) single-digit millisecond latency at 2,500 RPS by pre-joining data via composite Partition (PK) and Sort (SK) keys.' },
      { id: 'C', text: 'DynamoDB natively supports ACID multi-table cross-region distributed joins without any sort key indexing.' },
      { id: 'D', text: 'PostgreSQL cannot scale beyond 500 RPS even with read replicas and connection pooling.' }
    ],
    correctAnswer: 'B',
    explanation: 'Single-Table Design in DynamoDB pre-computes data adjacency by co-locating related entity collections (Dealer + Vehicles) under the same Partition Key. At 2,500 RPS, relational SQL engines suffer from lock contention and join query-planner degradation. DynamoDB guarantees deterministic P99 < 15ms latency at scale by sacrificing ad-hoc querying flexibility.',
    b1Relevance: 'Box 3 Advanced: Directly matches ADR-01 defense requirement where candidate must explain why relational models were rejected.'
  },
  {
    id: 'EX-02',
    domain: 'Solution Arch',
    targetBar: 'Advanced',
    competencyId: 'comp-2',
    scenario: 'During national dealer promotions, third-party dealership management systems (DMS) fire bursts of 2,500 vehicle updates per second. Downstream search indexing services take 80ms per vehicle.',
    question: 'How should you decouple the API Gateway ingestion layer from the indexing pipeline to prevent cascading HTTP 504 Gateway Timeouts?',
    options: [
      { id: 'A', text: 'Increase the API Gateway HTTP connection timeout to 120 seconds and scale downstream ECS tasks horizontally.' },
      { id: 'B', text: 'Place Amazon SQS as an asynchronous backpressure buffer directly behind the API Gateway; return an HTTP 202 Accepted with a correlation tracking ID, allowing ECS Fargate workers to drain messages at their sustained throughput.' },
      { id: 'C', text: 'Deploy an in-memory Redis cluster to hold the active HTTP connections until the search indexing service catches up.' },
      { id: 'D', text: 'Reject writes exceeding 500 RPS with HTTP 429 Too Many Requests and require dealers to implement client-side retries.' }
    ],
    correctAnswer: 'B',
    explanation: 'Placing SQS between API Gateway and downstream workers decouples ingestion rate from processing capacity (ADR-02). Returning HTTP 202 Accepted gives clients instantaneous confirmation (< 50ms) while protecting downstream clusters from exhaustion.',
    b1Relevance: 'Box 3 Advanced: Demonstrates asynchronous backpressure buffering and eventual consistency defense.'
  },
  {
    id: 'EX-03',
    domain: 'Solution Arch',
    targetBar: 'Advanced',
    competencyId: 'comp-3',
    scenario: 'In an exclusive vehicle flash-sale, 500 buyers attempt to reserve the same VIN simultaneously. Over-allocation is unacceptable (Strict Single-Inventory Invariant).',
    question: 'Which concurrency control mechanism should the B1 Architect implement in Amazon DynamoDB to prevent race conditions without introducing distributed lock manager bottlenecks?',
    options: [
      { id: 'A', text: 'A centralized Redis Redlock cluster with a 5-second TTL on the vehicle VIN.' },
      { id: 'B', text: 'Optimistic Locking via DynamoDB ConditionExpression: "attribute_exists(VIN) AND reservationStatus = :AVAILABLE", atomically setting status to RESERVED.' },
      { id: 'C', text: 'Two-Phase Locking (2PL) by pausing incoming HTTP requests at the AWS Application Load Balancer.' },
      { id: 'D', text: 'Pessimistic table-level read locks across all DynamoDB partitions during the reservation window.' }
    ],
    correctAnswer: 'B',
    explanation: 'DynamoDB conditional writes (`ConditionExpression`) provide hardware-level atomic compare-and-swap operations on the item partition. Exactly one transaction succeeds; the other 499 fail safely with HTTP 409 Conflict. This eliminates the operational overhead, split-brain risk, and latency of external distributed lock managers like Redis Redlock.',
    b1Relevance: 'Box 3 Advanced: Directly tests ADR-03 concurrency control invariant.'
  },
  {
    id: 'EX-04',
    domain: 'Solution Arch',
    targetBar: 'Advanced',
    competencyId: 'comp-4',
    scenario: 'You need to update vehicle price records in DynamoDB and simultaneously publish an event to Amazon OpenSearch and external syndication partners.',
    question: 'Which architectural pattern guarantees dual-write consistency without risking distributed two-phase commit (2PC) failure or orphaned state?',
    options: [
      { id: 'A', text: 'Write synchronously to DynamoDB; if successful, perform a synchronous HTTP POST to OpenSearch in the same API handler.' },
      { id: 'B', text: 'Transactional Outbox with Change Data Capture (CDC): Write the entity and event record to DynamoDB atomically in a TransactWriteItems call, then use DynamoDB Streams to reliably stream events to EventBridge/OpenSearch asynchronously.' },
      { id: 'C', text: 'Publish first to an Amazon SNS topic; subscribe both DynamoDB and OpenSearch as HTTP push endpoints.' },
      { id: 'D', text: 'Schedule a cron job every 5 minutes to scan DynamoDB for modified records and bulk-upsert to OpenSearch.' }
    ],
    correctAnswer: 'B',
    explanation: 'The Transactional Outbox pattern with CDC (via DynamoDB Streams) avoids the dual-write anti-pattern. If the application crashes midway through separate writes, state diverges. With CDC, the database transaction log itself guarantees that every committed write produces exactly one stream event.',
    b1Relevance: 'Box 3 Advanced: Core distributed transactions pattern required in B1 assessments.'
  },
  {
    id: 'EX-05',
    domain: 'Solution Arch',
    targetBar: 'Advanced',
    competencyId: 'comp-5',
    scenario: 'An external loan calculation provider API is experiencing intermittent 5-second timeouts, causing your customer checkout threads to block and consume container memory.',
    question: 'Which resiliency strategy should be implemented to prevent this external outage from cascading into your primary inventory service?',
    options: [
      { id: 'A', text: 'Increase worker thread pools from 200 to 2,000 to absorb the waiting requests.' },
      { id: 'B', text: 'A Circuit Breaker with Bulkhead isolation: Allocate a bounded connection pool for the loan provider; trip the circuit to open after 5 consecutive timeouts, immediately failing fast or serving an estimated rate fallback.' },
      { id: 'C', text: 'Queue all checkout requests indefinitely until the lender API resumes normal response times.' },
      { id: 'D', text: 'Retry every failed request 10 times with exponential backoff on the synchronous user thread.' }
    ],
    correctAnswer: 'B',
    explanation: 'The Bulkhead pattern restricts thread/connection allocation so slow third parties cannot exhaust server resources. The Circuit Breaker prevents thundering-herd retry storms against degraded downstream systems and fails fast to preserve user responsiveness.',
    b1Relevance: 'Box 3 Advanced: Essential resiliency pattern for high-availability systems.'
  },

  // --- DOMAIN 2: APPLICATION ARCHITECTURE (Box 3 - Advanced) ---
  {
    id: 'EX-06',
    domain: 'Application Arch',
    targetBar: 'Advanced',
    competencyId: 'comp-8',
    scenario: 'You are leading a microservices modernization where the core domain logic (Pricing & Valuation Rules) must remain stable for 5+ years despite frequent changes in AWS cloud SDKs, messaging protocols, and third-party APIs.',
    question: 'Which architectural style should you enforce to protect core business rules from infrastructure churn?',
    options: [
      { id: 'A', text: 'Layered 3-tier architecture with direct SQL annotations inside domain entities.' },
      { id: 'B', text: 'Hexagonal Architecture (Ports and Adapters): Pure domain models and use-case ports reside in the core, isolated from external drivers (REST/GraphQL controllers) and driven adapters (DynamoDB/SQS) via dependency inversion.' },
      { id: 'C', text: 'Serverless Nano-services where every business calculation is an isolated AWS Lambda function with embedded SDK clients.' },
      { id: 'D', text: 'Event-driven Choreography with all logic embedded in API Gateway request mapping templates.' }
    ],
    correctAnswer: 'B',
    explanation: 'Hexagonal Architecture strictly enforces the Dependency Inversion Principle: business rules depend on pure domain interfaces (Ports), while database and cloud transport mechanisms implement these interfaces (Adapters). Cloud migrations or library upgrades never touch domain business rules.',
    b1Relevance: 'Box 3 Advanced: Demonstrates long-term maintainability and software engineering discipline.'
  },
  {
    id: 'EX-07',
    domain: 'Application Arch',
    targetBar: 'Advanced',
    competencyId: 'comp-9',
    scenario: 'A multi-step vehicle purchase workflow spans 4 independent microservices: Inventory Reservation, Financing Approval, Insurance Verification, and Payment Processing.',
    question: 'How should you manage distributed transactions across these services to ensure eventual consistency without distributed 2PC locking?',
    options: [
      { id: 'A', text: 'A distributed Two-Phase Commit (2PC) protocol managed by an XA transaction coordinator across all 4 databases.' },
      { id: 'B', text: 'The Saga Pattern (Orchestration-based via AWS Step Functions or Kafka): Each step executes a local transaction; if a step fails, compensating transactions are executed in reverse order to rollback prior actions.' },
      { id: 'C', text: 'Merge all 4 microservices back into a single monolithic database to use standard SQL transactions.' },
      { id: 'D', text: 'Fire-and-forget asynchronous messaging with manual operational database patching when failures occur.' }
    ],
    correctAnswer: 'B',
    explanation: 'Sagas replace distributed locks with a sequence of local transactions coordinated via events or an orchestrator (Step Functions). If Financing fails, compensating transactions release the inventory hold and cancel insurance quotes automatically.',
    b1Relevance: 'Box 3 Advanced: Required answer for distributed consistency questions.'
  },
  {
    id: 'EX-08',
    domain: 'Application Arch',
    targetBar: 'Advanced',
    competencyId: 'comp-10',
    scenario: 'The vehicle inventory system experiences an extreme 95:5 Read-to-Write asymmetry (15,000 read queries/sec vs 750 updates/sec). Complex filtering queries (by trim, mileage, zip code, price range) degrade write throughput.',
    question: 'How should the B1 Architect separate the write and read data pipelines?',
    options: [
      { id: 'A', text: 'Add 20 relational read replicas to the primary write database.' },
      { id: 'B', text: 'Command Query Responsibility Segregation (CQRS): Direct state-modifying Commands to a normalized write store (DynamoDB), and stream projection events to a search-optimized Read model (Amazon OpenSearch) for lightning-fast multi-faceted filtering.' },
      { id: 'C', text: 'Store all data in an in-memory Redis cache with daily backups to S3.' },
      { id: 'D', text: 'Require the mobile and web clients to perform client-side filtering on raw vehicle arrays.' }
    ],
    correctAnswer: 'B',
    explanation: 'CQRS decouples the write model (optimized for atomic single-key transactions and high-throughput ingestion) from the read model (denormalized, indexed, and optimized for complex user search filters).',
    b1Relevance: 'Box 3 Advanced: Core architectural pattern in enterprise syndication systems.'
  },
  {
    id: 'EX-09',
    domain: 'Application Arch',
    targetBar: 'Advanced',
    competencyId: 'comp-11',
    scenario: 'An Amazon SQS standard queue delivers pricing update messages to your consumer workers. Due to network retries, the same pricing update ($25,000 for VIN 12345) is delivered 3 times.',
    question: 'How must consumer workers be architected to guarantee data integrity under at-least-once message delivery?',
    options: [
      { id: 'A', text: 'Switch to Amazon SQS FIFO queues, which guarantee exactly-once processing with zero chance of duplication regardless of consumer crashes.' },
      { id: 'B', text: 'Design consumers for Idempotency: Store a unique idempotency key or event version in the database; if a duplicate message arrives with an equal or older version, ignore it or execute an idempotent upsert.' },
      { id: 'C', text: 'Add an in-memory JavaScript Set in the worker to track processed message IDs.' },
      { id: 'D', text: 'Configure SQS Visibility Timeout to 0 seconds so messages are deleted immediately upon retrieval.' }
    ],
    correctAnswer: 'B',
    explanation: 'Distributed message brokers (even FIFO under failure retries) only guarantee at-least-once delivery at the consumer boundary. True exactly-once processing requires application-level idempotency using version checks or unique idempotency tokens.',
    b1Relevance: 'Box 3 Advanced: Essential distributed systems concept.'
  },

  // --- DOMAIN 3: CLOUD ARCHITECTURE (Box 2 - Intermediate) ---
  {
    id: 'EX-10',
    domain: 'Cloud',
    targetBar: 'Intermediate',
    competencyId: 'comp-15',
    scenario: 'Your production NFR requires 99.95% Availability, RTO < 15 minutes, and RPO = 0 for vehicle pricing records. AWS us-east-1 experiences an entire regional control plane failure.',
    question: 'Which disaster recovery topology satisfies these strict NFR constraints while remaining cost-effective?',
    options: [
      { id: 'A', text: 'Backup and Restore: Nightly S3 snapshots restored to us-west-2 during a disaster.' },
      { id: 'B', text: 'Warm Standby (Active-Passive with Pilot Light / Multi-Region Global Tables): Amazon DynamoDB Global Tables replicating multi-region (RPO=0), with scaled-down ECS Fargate workers in us-west-2 and Route 53 health-check automated DNS failover (RTO < 15 min).' },
      { id: 'C', text: 'Single-AZ deployment in us-east-1 with automated EC2 instance auto-recovery.' },
      { id: 'D', text: 'Active-Active synchronous cross-region distributed database transactions across 3 continents.' }
    ],
    correctAnswer: 'B',
    explanation: 'Warm Standby using DynamoDB Global Tables provides asynchronous replication with RPO=0 for committed database records. Route 53 health checks trigger DNS cutover within 2-3 minutes, while autoscaling ECS Fargate tasks in the secondary region ramp up to full capacity in under 15 minutes.',
    b1Relevance: 'Box 2 Intermediate: Demonstrates cloud disaster recovery design and NFR alignment.'
  },
  {
    id: 'EX-11',
    domain: 'Cloud',
    targetBar: 'Intermediate',
    competencyId: 'comp-16',
    scenario: 'You need to choose the compute runtime for the Cox Automotive stream ingestion workers processing 2,500 RPS sustained message bursts from SQS.',
    question: 'Why does an Architect choose AWS ECS Fargate container tasks over AWS Lambda in this high-throughput scenario?',
    options: [
      { id: 'A', text: 'Lambda cannot read messages from Amazon SQS.' },
      { id: 'B', text: 'ECS Fargate provides long-lived persistent container processes that avoid cold starts, maintain warm database connection pools, and are significantly more cost-effective under sustained 24/7 high-RPS loads than pay-per-millisecond Lambda invocations.' },
      { id: 'C', text: 'ECS Fargate has zero security configuration requirements compared to Lambda.' },
      { id: 'D', text: 'Lambda functions are limited to a maximum execution timeout of 30 seconds.' }
    ],
    correctAnswer: 'B',
    explanation: 'Lambda is cost-effective for spiky, unpredictable, or low-frequency traffic. For sustained, 24/7 high-RPS workloads (2,500 RPS), continuous Lambda invocations become exponentially more expensive than dedicated ECS Fargate container tasks with warm DB connections.',
    b1Relevance: 'Box 2 Intermediate: Tests compute runtime evaluation and cost-performance trade-offs.'
  },
  {
    id: 'EX-12',
    domain: 'Cloud',
    targetBar: 'Intermediate',
    competencyId: 'comp-17',
    scenario: 'Your microservices running in a private AWS VPC need to access Amazon DynamoDB and AWS S3 without routing traffic over the public internet.',
    question: 'Which networking mechanism should you configure to ensure zero internet transit and lower AWS data transfer egress costs?',
    options: [
      { id: 'A', text: 'Configure an AWS NAT Gateway in a public subnet with an Elastic IP.' },
      { id: 'B', text: 'Deploy VPC Gateway Endpoints for DynamoDB and S3 directly in your VPC route tables.' },
      { id: 'C', text: 'Establish an IPSec VPN tunnel from the container back to an on-premise datacenter.' },
      { id: 'D', text: 'Assign public IPv4 addresses to all ECS Fargate task network interfaces.' }
    ],
    correctAnswer: 'B',
    explanation: 'VPC Gateway Endpoints for DynamoDB and S3 route traffic across the private AWS backbone network directly, bypassing NAT Gateways and the public internet. This enhances security and eliminates NAT Gateway hourly and data processing fees.',
    b1Relevance: 'Box 2 Intermediate: Cloud networking and cost-optimization standard.'
  },

  // --- DOMAIN 4: SDLC PROCESSES & DEVOPS (Box 3 - Advanced) ---
  {
    id: 'EX-13',
    domain: 'SDLC Processes',
    targetBar: 'Advanced',
    competencyId: 'comp-18',
    scenario: 'Before deploying a major release of the pricing engine to production, you must prove the system can withstand 2,500 RPS peak with P99 latency < 150ms under chaos conditions.',
    question: 'How should the B1 Architect structure non-functional testing (NFT) in the delivery lifecycle?',
    options: [
      { id: 'A', text: 'Conduct manual smoke testing in the staging environment for 15 minutes before the release window.' },
      { id: 'B', text: 'Automated performance pipelines in a production-identical staging environment: Run k6/Gatling load tests simulating 2,500 RPS with stepped ramp-ups, coupled with chaos injection (e.g. killing 20% of worker nodes) to verify SLA compliance and auto-recovery.' },
      { id: 'C', text: 'Release directly to production on Sunday night and monitor user complaints on Monday morning.' },
      { id: 'D', text: 'Rely solely on unit test code coverage metrics (> 90%) to guarantee runtime performance.' }
    ],
    correctAnswer: 'B',
    explanation: 'EPAM B1 architects must ensure measurable NFR verification. Automated performance and chaos engineering testing against production-parity environments validates latency budgets, auto-scaling thresholds, and fault-tolerance boundaries before customer traffic is exposed.',
    b1Relevance: 'Box 3 Advanced: Directly matches NFR verification requirements in the SAD specification.'
  },
  {
    id: 'EX-14',
    domain: 'SDLC Processes',
    targetBar: 'Advanced',
    competencyId: 'comp-19',
    scenario: 'A breaking schema change is required for the vehicle syndication payload consumed by 50+ external dealer web portals.',
    question: 'Which release strategy ensures zero downtime and prevents breaking external client integrations?',
    options: [
      { id: 'A', text: 'Deprecate the existing API endpoint immediately and send an email notifying dealers to update their software.' },
      { id: 'B', text: 'Parallel Run / Expand & Contract (Tolerant Reader Pattern): Introduce the new fields in API v2 while maintaining backward compatibility in v1; utilize contract testing (Pact) and monitor v1 usage deprecation before eventual decommissioning.' },
      { id: 'C', text: 'Update the database schema on Friday evening and force all clients to update over the weekend.' },
      { id: 'D', text: 'Deploy an automated proxy that rewrites all legacy client JSON payloads into the new format on the fly.' }
    ],
    correctAnswer: 'B',
    explanation: 'The Expand and Contract pattern allows multiple API and schema versions to coexist. Upstream systems expand functionality with backward compatibility; clients migrate at their own pace; and legacy paths are contracted only after zero-traffic verification.',
    b1Relevance: 'Box 3 Advanced: API governance and zero-downtime evolution.'
  },
  {
    id: 'EX-15',
    domain: 'SDLC Processes',
    targetBar: 'Advanced',
    competencyId: 'comp-20',
    scenario: 'When an order fails in an asynchronous microservice pipeline (e.g. SQS -> Lambda -> EventBridge), debugging requires tracing the request across 6 distinct service boundaries.',
    question: 'Which observability standard must be enforced across all service boundaries?',
    options: [
      { id: 'A', text: 'SSH into each server and grep syslog files during an incident.' },
      { id: 'B', text: 'Distributed Tracing with W3C Trace Context / OpenTelemetry: Inject a correlation TraceID at API Gateway; propagate it across message headers, SQS metadata, and structured JSON logs to reconstruct the complete execution timeline in AWS X-Ray/Datadog.' },
      { id: 'C', text: 'Increase log verbosity to DEBUG level across all production microservices permanently.' },
      { id: 'D', text: 'Store full request payloads in a shared database table before and after each service execution.' }
    ],
    correctAnswer: 'B',
    explanation: 'In asynchronous distributed architectures, synchronous request-response logs are insufficient. Propagating a correlation trace ID across asynchronous message attributes allows APM tools to visualize end-to-end latency and isolate failure root causes instantly.',
    b1Relevance: 'Box 3 Advanced: Observability and distributed troubleshooting standard.'
  },

  // --- DOMAIN 5: LEADERSHIP & SOFT SKILLS (Box 3 - Advanced / NAT B2) ---
  {
    id: 'EX-16',
    domain: 'Leadership & Soft',
    targetBar: 'Advanced',
    competencyId: 'comp-22',
    scenario: 'A powerful business stakeholder insists on synchronous REST updates for all vehicle inventory across all 1,200 dealerships, stating: "I want prices updated everywhere the exact second I click save, no matter what."',
    question: 'How does an EPAM B1 Software Architect professionally push back and align the stakeholder on an asynchronous model?',
    options: [
      { id: 'A', text: 'Tell the stakeholder that their requirement is technically impossible and refuse to implement it.' },
      { id: 'B', text: 'Acknowledge the business desire for speed; present quantified trade-offs showing that synchronous writes under 2,500 RPS peak will cause HTTP 504 timeouts and website crashes; propose Read-Your-Own-Writes UI optimism with asynchronous SQS processing guaranteeing 99.95% uptime and sub-2-second global convergence.' },
      { id: 'C', text: 'Agree to the synchronous design, implement it, and let it fail in production to prove your point.' },
      { id: 'D', text: 'Escalate immediately to the EPAM Delivery Manager and request that the stakeholder be removed from the project.' }
    ],
    correctAnswer: 'B',
    explanation: 'A B1 Architect never rejects requirements without proposing a superior architectural solution backed by commercial trade-offs. Explaining the system failure modes of synchronous writes and offering "Read-Your-Own-Writes" client optimism achieves the stakeholder\'s UX goal while preserving system resiliency.',
    b1Relevance: 'Box 3 Advanced: Core EPAM B1 behavioral requirement—stakeholder communication & trade-off navigation.'
  },
  {
    id: 'EX-17',
    domain: 'Leadership & Soft',
    targetBar: 'Advanced',
    competencyId: 'comp-23',
    scenario: 'Four separate engineering squads are building vehicle syndication features using contradictory database access and messaging patterns, leading to integration chaos.',
    question: 'How should you establish architectural alignment and governance across the teams?',
    options: [
      { id: 'A', text: 'Write a 200-page architecture document and mandate that every engineer read and sign it before writing code.' },
      { id: 'B', text: 'Establish lightweight Architectural Decision Records (ADRs) stored in Git; institute an Architecture Review Board (ARB) with squad tech leads; and publish reusable archetype starter kits with automated linting and CI/CD policy gates.' },
      { id: 'C', text: 'Take away write permissions from the engineers and write all the core architecture code yourself.' },
      { id: 'D', text: 'Hold daily 3-hour architecture alignment meetings with all 40 engineers.' }
    ],
    correctAnswer: 'B',
    explanation: 'Scalable architecture governance relies on versioned ADRs in Git, collaborative architecture forums with squad leads, and automated guardrails (CI/CD linters and archetypes) rather than bureaucratic manual oversight.',
    b1Relevance: 'Box 3 Advanced: Architectural governance and engineering enablement.'
  },
  {
    id: 'EX-18',
    domain: 'Leadership & Soft',
    targetBar: 'Advanced',
    competencyId: 'comp-24',
    scenario: 'The engineering team has accumulated 4 months of critical technical debt (brittle legacy code, lack of automated tests, obsolete database drivers), but executive leadership demands only new revenue features.',
    question: 'How should the B1 Architect justify and secure funding for architectural debt remediation?',
    options: [
      { id: 'A', text: 'Complain to leadership that the code is "ugly" and "bad quality".' },
      { id: 'B', text: 'Translate technical debt into commercial and business metrics: Demonstrate how refactoring reduces Mean Time To Recovery (MTTR) by 40%, decreases cloud infrastructure spend by 25%, and accelerates future feature delivery velocity by 2x; negotiate a 20% capacity allocation per sprint.' },
      { id: 'C', text: 'Secretly refactor the codebase during the night without telling product management.' },
      { id: 'D', text: 'Quit the project and tell the client that the codebase is unsalvageable.' }
    ],
    correctAnswer: 'B',
    explanation: 'Executive leaders think in terms of risk, cost, and revenue. Expressing technical debt as financial risk, MTTR exposure, and delivery drag enables stakeholders to make informed business decisions to fund architectural modernization.',
    b1Relevance: 'Box 3 Advanced: Translating technical concerns into commercial business impact.'
  },

  // --- DOMAIN 6: ARTIFICIAL INTELLIGENCE & GENAI (Box 1 / 2 - Novice/Intermediate) ---
  {
    id: 'EX-19',
    domain: 'AI',
    targetBar: 'Intermediate',
    competencyId: 'comp-33',
    scenario: 'Cox Automotive wants to deploy a conversational AI assistant for 50,000 dealership technicians to diagnose mechanical vehicle faults based on 100,000 proprietary PDF service manuals updated weekly.',
    question: 'Which AI architecture pattern provides accurate, source-cited responses while preventing hallucination and high retraining costs?',
    options: [
      { id: 'A', text: 'Fine-tune an open-source LLM (e.g. Llama-3) from scratch every week with the PDF text.' },
      { id: 'B', text: 'Retrieval-Augmented Generation (RAG): Chunk and embed service manuals into an Amazon OpenSearch vector database; on user query, retrieve relevant chunks via semantic search and inject them into the LLM context prompt (Amazon Bedrock) with source citations.' },
      { id: 'C', text: 'Paste all 100,000 PDF documents directly into a single massive LLM prompt window.' },
      { id: 'D', text: 'Build a rule-based regex decision tree without any LLM integration.' }
    ],
    correctAnswer: 'B',
    explanation: 'RAG decouples knowledge retrieval from model parameters. Proprietary manuals can be indexed dynamically in a vector database without expensive model retraining, and citations prevent hallucinations.',
    b1Relevance: 'Box 2 Intermediate: GenAI enterprise architecture pattern.'
  },
  {
    id: 'EX-20',
    domain: 'AI',
    targetBar: 'Novice',
    competencyId: 'comp-34',
    scenario: 'Your conversational AI endpoint is experiencing sudden cost spikes due to redundant user questions (e.g. 5,000 users asking "What is the recommended tire pressure for 2024 RAV4?").',
    question: 'Which cost and performance guardrail should the architect implement in front of the LLM?',
    options: [
      { id: 'A', text: 'Rate limit users to 1 question per day.' },
      { id: 'B', text: 'Semantic Caching (e.g. Redis vector cache): Cache embedding similarities of incoming queries; if a new query is semantically identical to a previous one, return the cached answer with zero LLM inference cost and < 20ms latency.' },
      { id: 'C', text: 'Switch to a smaller, lower-accuracy model that hallucinates frequently.' },
      { id: 'D', text: 'Block external web traffic during business hours.' }
    ],
    correctAnswer: 'B',
    explanation: 'Semantic caching detects when a new question has identical semantic intent to a previous query, bypassing expensive LLM inference tokens entirely and providing sub-second response times.',
    b1Relevance: 'Box 1 Novice / Box 2 Intermediate: Cost governance in modern AI applications.'
  },

  // --- DOMAIN 7: BUSINESS ANALYSIS & COMMERCIAL ACUMEN (Box 1 - Novice) ---
  {
    id: 'EX-21',
    domain: 'Business',
    targetBar: 'Novice',
    competencyId: 'comp-35',
    scenario: 'Cox Automotive leadership asks you to justify the cloud infrastructure budget for the vehicle syndication pipeline handling 2,500 RPS peak.',
    question: 'How should an Architect calculate and present Total Cost of Ownership (TCO)?',
    options: [
      { id: 'A', text: 'Estimate the cost of EC2 instances only and ignore network transfer, database, and storage fees.' },
      { id: 'B', text: 'Unit Economics & Full-Lifecycle TCO: Calculate compute (ECS Fargate task-hours), database (DynamoDB provisioned/on-demand capacity units), messaging (SQS API requests), network egress, multi-region replication, and operational support staffing costs expressed as "Cost Per 1,000 Vehicle Syndications".' },
      { id: 'C', text: 'Tell leadership that cloud costs are unpredictable and cannot be estimated in advance.' },
      { id: 'D', text: 'Recommend on-premise hardware purchasing because servers are a one-time capital expense.' }
    ],
    correctAnswer: 'B',
    explanation: 'TCO must encompass compute, database, network egress, data replication, and operational maintenance. Framing costs as unit economics (e.g., "$0.004 per 1,000 syndications") enables business stakeholders to evaluate profitability against subscription pricing.',
    b1Relevance: 'Box 1 Novice: Financial awareness and cloud cost modeling.'
  },
  {
    id: 'EX-22',
    domain: 'Business',
    targetBar: 'Novice',
    competencyId: 'comp-36',
    scenario: 'The enterprise needs vehicle VIN optical character recognition (OCR) scanner capabilities. Management asks whether to build a custom computer vision model or buy a managed SaaS API (e.g. AWS Rekognition).',
    question: 'Which factor is most decisive in a Buy vs. Build architectural evaluation?',
    options: [
      { id: 'A', text: 'Always build in-house because engineering teams should control 100% of the code.' },
      { id: 'B', text: 'Core Differentiator vs. Commodity Capability: VIN OCR is a commodity utility; building in-house incurs high data science staffing, ongoing model drift maintenance, and delayed time-to-market. Utilizing a managed SaaS API allows engineering focus on the core automotive syndication differentiator.' },
      { id: 'C', text: 'Always buy SaaS products regardless of data sovereignty, compliance, or recurring costs.' },
      { id: 'D', text: 'Flip a coin during the sprint planning meeting.' }
    ],
    correctAnswer: 'B',
    explanation: 'The Buy vs. Build decision centers on core business differentiation. Proprietary pricing and syndication algorithms are core competitive advantages (Build). Optical character recognition of VIN numbers is a commodity capability (Buy).',
    b1Relevance: 'Box 1 Novice: Strategic business alignment and vendor assessment.'
  },
  {
    id: 'EX-23',
    domain: 'Solution Arch',
    targetBar: 'Advanced',
    competencyId: 'comp-6',
    scenario: 'Your system syndicates inventory to 15 different third-party marketplaces. One partner marketplace goes down completely for 4 hours, rejecting all incoming HTTP payloads.',
    question: 'How does your event delivery architecture prevent this partner failure from blocking syndication to the remaining 14 healthy marketplaces?',
    options: [
      { id: 'A', text: 'Broadcast writes in a synchronous loop; catch the error and stop processing all partners until the downed partner recovers.' },
      { id: 'B', text: 'Partitioned Fan-out with Dead Letter Queues (DLQ): Amazon EventBridge routes syndication events to dedicated per-partner SQS queues; each partner worker pool operates independently with exponential backoff and a 14-day DLQ, isolating the blast radius.' },
      { id: 'C', text: 'Drop all messages intended for the offline partner permanently.' },
      { id: 'D', text: 'Restart the entire ECS Fargate cluster every 10 minutes.' }
    ],
    correctAnswer: 'B',
    explanation: 'The Fan-out pattern with isolated per-partner queues ensures that a single partner\'s outage never blocks or starves message processing for other healthy destinations. DLQs allow reprocessing once the partner recovers.',
    b1Relevance: 'Box 3 Advanced: Blast radius isolation in B2B syndication.'
  },
  {
    id: 'EX-24',
    domain: 'Application Arch',
    targetBar: 'Advanced',
    competencyId: 'comp-12',
    scenario: 'You are modernizing a 15-year-old monolithic Java vehicle appraisal application into microservices without stopping ongoing business operations.',
    question: 'Which migration pattern should the architect execute to incrementally replace legacy monolith functionality with minimal risk?',
    options: [
      { id: 'A', text: 'Big Bang Rewrite: Freeze monolith development for 18 months, build the new microservices in secret, and cut over all traffic overnight.' },
      { id: 'B', text: 'Strangler Fig Pattern: Place an API Gateway/Reverse Proxy in front of the monolith; carve out bounded contexts (e.g. Appraisal Valuation) into new microservices one by one, intercepting traffic at the proxy until the legacy monolith is decommissioned.' },
      { id: 'C', text: 'Run both systems simultaneously and duplicate manual data entry across both systems.' },
      { id: 'D', text: 'Refactor the monolith into microservices directly within the existing codebase without deploying separate services.' }
    ],
    correctAnswer: 'B',
    explanation: 'The Strangler Fig pattern replaces monolithic components incrementally around the edges while keeping the system continuously operational, reducing risk compared to high-failure Big Bang rewrites.',
    b1Relevance: 'Box 3 Advanced: Legacy modernization strategy.'
  },
  {
    id: 'EX-25',
    domain: 'Leadership & Soft',
    targetBar: 'Advanced',
    competencyId: 'comp-25',
    scenario: 'During your EPAM B1 assessment session, Chief Architect Elena challenges your ADR-01 decision: "DynamoDB Single-Table is overly complex. Why didn\'t you just use Aurora PostgreSQL with read replicas?"',
    question: 'What is the Gold Standard structural approach for defending your decision to the committee?',
    options: [
      { id: 'A', text: 'Say that PostgreSQL is old legacy technology and DynamoDB is modern cloud-native.' },
      { id: 'B', text: 'Execute the 3-part Architect Defense: (1) State the plain-English analogy; (2) Cite the hard quantitative NFR constraint (2,500 RPS peak, P99 < 150ms); (3) Explicitly acknowledge the trade-off—gaining deterministic single-digit millisecond latency at scale while accepting the sacrifice of ad-hoc querying flexibility.' },
      { id: 'C', text: 'Back down immediately, apologize, and change your architecture to PostgreSQL to appease the committee.' },
      { id: 'D', text: 'Argue aggressively with Elena and tell her that Amazon documentation says DynamoDB is always better.' }
    ],
    correctAnswer: 'B',
    explanation: 'EPAM B1 examiners intentionally challenge candidates to evaluate conviction, structured communication, and trade-off defense. Backing down shows lack of authorship; arguing shows lack of executive maturity. A structured analogy + quantitative NFR + explicit trade-off (Gain vs. Sacrifice) is the Gold Standard passing formula.',
    b1Relevance: 'Box 3 Advanced / B2: The core committee cross-examination defense framework.'
  }
];
