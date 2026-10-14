import { InterviewExercise } from '@/types';

export const INTERVIEW_EXERCISES_DATA: Record<string, InterviewExercise> = {
  'ai-genai-sdlc': {
    scenarioTitle: 'Automated Test Harness Generation for Legacy Insurance Gateway',
    businessContext: 'An insurance client maintains 45 proprietary XML claim formats across 12 legacy partner systems. Onboarding a new claim schema takes 3 weeks of manual QA testing. Leadership mandates using GenAI to generate unit test suites and schema validators, but the Chief Risk Officer fears data leaks and hallucinated test coverage.',
    architecturalProblem: 'Design an automated, secure LLM-assisted SDLC pipeline that ingests XML/XSD schemas and synthesizes comprehensive TypeScript contract tests without exposing proprietary insurance claim data to public LLM endpoints.',
    technicalConstraints: [
      'Zero proprietary customer PII or insurer secrets transmitted over public internet',
      'Test generation execution time must be under 5 minutes per schema',
      'Generated tests must achieve > 90% branch coverage and pass strict static analysis without human syntax edits',
      'All AI generation must be reproducible and versioned in Git'
    ],
    taskQuestions: [
      'How do you architect the boundary between developer local workstations, corporate repositories, and foundation model inference?',
      'How do you programmatically verify that the generated test cases actually test real business invariants rather than hallucinated trivial assertions?',
      'What fallback or verification pipeline prevents vulnerable code (e.g. ReDoS in regex) from reaching production?'
    ],
    evaluationRubric: [
      {
        criterion: 'Security & PII Boundary Isolation',
        weight: '30%',
        targetStandard: 'Proposes on-premise model hosting or AWS Bedrock VPC endpoints with strict token sanitization and zero-data-retention agreements.'
      },
      {
        criterion: 'Deterministic Quality Gates',
        weight: '40%',
        targetStandard: 'Integrates AST parsing (TypeScript Compiler API), mutation testing (Stryker), and SonarQube in the automated CI pipeline.'
      },
      {
        criterion: 'SDLC ROI & Governance',
        weight: '30%',
        targetStandard: 'Defines explicit metrics (time-to-onboard reduction, defect escape rate) and human-in-the-loop architect review checkpoints.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Implement a private, VPC-isolated AWS Bedrock pipeline fronted by a CLI tool that strips sensitive fields, generates typed test harnesses using few-shot prompt templates, and runs mutation testing to prove test assertion rigor.',
      technicalApproach: '1. Ingestion CLI parses XSD into an abstract schema tree. 2. A local pre-processor masks insurer-specific IDs. 3. Payload sent via private AWS PrivateLink to Bedrock Claude 3.5 Sonnet using JSON Schema mode. 4. Generated TypeScript tests written to `/tests/contracts/`. 5. GitHub Action immediately runs `npm run test` and `npx stryker run` (mutation testing). 6. If mutation score < 85%, PR fails automatically.',
      tradeoffDefense: 'We gain a 75% reduction in test authoring time at the sacrifice of compute cost running automated mutation testing in CI to mathematically verify test quality.',
      diagramOrPattern: 'XSD Spec -> Local Parser -> PII Sanitizer -> [AWS PrivateLink] -> Bedrock -> Generated Tests -> Mutation Engine -> Git PR'
    }
  },

  'ai-architecture': {
    scenarioTitle: 'Sub-Second Semantic Search for Enterprise Automotive Catalog',
    businessContext: 'Cox Automotive wants consumers to search for vehicles using unstructured conversational queries (e.g., "Safe 7-seater SUV under $35k with leather seats and low mileage near Atlanta"). Traditional Elasticsearch keyword search returns poor results or zero hits.',
    architecturalProblem: 'Design a hybrid semantic search architecture integrating vector embeddings with existing structured relational catalog filters, maintaining a P99 response time under 150ms at 2,000 queries per second.',
    technicalConstraints: [
      'P99 query latency < 150ms across 45 million vehicle listings',
      'Peak read concurrency: 2,000 queries/second',
      'Inventory availability must reflect updates within 5 seconds of dealer feed sync',
      'Cost ceiling: Infrastructure spend cannot exceed $0.0005 per search query'
    ],
    taskQuestions: [
      'How do you combine dense vector similarity search with hard metadata filtering (price < $35k, distance < 50 miles) without table scans?',
      'Where do you host the embedding model to satisfy the 150ms P99 latency budget?',
      'How do you handle catalog cache invalidation when 2,500 inventory updates occur per second?'
    ],
    evaluationRubric: [
      {
        criterion: 'Hybrid Search & Pre-Filtering',
        weight: '35%',
        targetStandard: 'Articulates pre-filtering in vector databases (HNSW with metadata filters) versus reciprocal rank fusion (RRF) between BM25 and dense vectors.'
      },
      {
        criterion: 'Latency Budget & Inference Placement',
        weight: '35%',
        targetStandard: 'Budgets 40ms for query embedding (dedicated ECS or lightweight Titan model), 50ms for vector ANN search, 30ms for network, 30ms margin.'
      },
      {
        criterion: 'Cache Architecture & Cost Optimization',
        weight: '30%',
        targetStandard: 'Implements semantic prompt caching in Redis to offload 70% of repetitive consumer queries before reaching inference.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Deploy a Hybrid Search pattern using Amazon OpenSearch Service with Vector Engine: queries are embedded via a lightweight dedicated Amazon Titan model, filtered using HNSW pre-filtering on structured attributes, and fronted by an ElastiCache Redis semantic query cache.',
      technicalApproach: '1. User enters natural search query. 2. CloudFront edge function checks Redis cache for hash of normalized query (3ms hit). 3. On miss, API Gateway invokes ECS microservice which calls Titan Embeddings via Bedrock (35ms). 4. Vector query dispatched to OpenSearch with compound filter: `knn_vector` combined with `bool.filter` for price and location (45ms). 5. Results aggregated and cached in Redis with 10-minute TTL. Total P99: 95ms.',
      tradeoffDefense: 'We trade away theoretical zero-shot multi-modal capability by choosing a lightweight 1024-dim text model over heavy LLMs in order to guarantee sub-100ms latency and achieve our $0.0005 per query cost target.',
      diagramOrPattern: 'Client -> CloudFront -> [Cache Hit: Redis (3ms)] -> [Miss: ECS Embedding (35ms) -> OpenSearch Hybrid KNN+BM25 (45ms)]'
    }
  },

  'biz-needs-id': {
    scenarioTitle: 'Emergency Modernization of Dealer Ingestion Pipeline',
    businessContext: 'A national dealership consortium threatens to terminate their multimillion-dollar partnership with Cox Automotive because evening vehicle inventory updates take 6 hours to appear on public websites. The client director demands: "Double the server sizes immediately."',
    architecturalProblem: 'As the Lead Architect, you suspect that simply increasing server compute will not solve the 6-hour delay. Conduct a root-cause discovery and define the true architectural drivers without blindly executing the client\'s naive hardware request.',
    technicalConstraints: [
      'Must preserve existing dealer DMS batch export formats (legacy CSV / FTP)',
      'Catalog syndication must be visible within 15 minutes of dealer feed upload',
      'Zero downtime during migration; current system processes $12M daily in sales transactions'
    ],
    taskQuestions: [
      'How do you structure your discovery workshop with dealership operations to uncover the actual bottleneck?',
      'What data and system metrics would you collect to prove or disprove that server CPU is the constraint?',
      'How do you present your findings to the client director to reframe the project from "bigger servers" to "asynchronous streaming"?'
    ],
    evaluationRubric: [
      {
        criterion: 'Stakeholder Discovery & Root Cause Analysis',
        weight: '40%',
        targetStandard: 'Uses Value Stream Mapping to identify that database row locks during synchronous batch parsing, not compute CPU, caused the 6-hour queue backlog.'
      },
      {
        criterion: 'Architectural Driver Quantification',
        weight: '35%',
        targetStandard: 'Converts emotional client complaints into explicit metrics: Ingestion Lag SLO < 15 mins, Peak Feed Concurrency = 2,500 RPS, RPO = 0.'
      },
      {
        criterion: 'Consultative Persuasion',
        weight: '25%',
        targetStandard: 'Presents commercial risk and cost models demonstrating that vertical scaling yields zero speedup while SQS buffering solves the root problem.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Reframe the engagement through empirical telemetry: demonstrate that vertical server scaling fails because relational database table locking is the bottleneck, and establish a new business driver for Asynchronous Queue-Based Load Leveling.',
      technicalApproach: '1. Conduct 3-day telemetry audit: instrument APM tracing on legacy FTP ingestion. 2. Uncover that 80% of dealer files arrive between 18:00 and 19:00, causing a 400-connection deadlock on the monolithic database. 3. Prove that server CPU was at only 22% while database lock wait time was 94%. 4. Formulate the official Architectural Driver: "Decouple file ingestion from database persistence with a 15-minute end-to-end syndication SLA."',
      tradeoffDefense: 'We gain root-cause elimination and 10x throughput elasticity at the sacrifice of a 3-week design and discovery phase rather than delivering an immediate, ineffective hardware upgrade.',
      diagramOrPattern: 'Problem: Dealer -> [Sync HTTP/FTP] -> Monolith -> [Lock Wait Contention 94%] -> DB Deadlock'
    }
  },

  'biz-alignment': {
    scenarioTitle: 'Cloud Migration Business Case & FinOps Justification',
    businessContext: 'A legacy automotive client spends $1.8M annually on an on-premise mainframe and Oracle database farm. The board mandates cutting infrastructure operational costs by 35% over 24 months while doubling dealer syndication throughput.',
    architecturalProblem: 'Create the architectural business alignment strategy. Map technical migration decisions (serverless, managed DynamoDB, SQS) directly to financial metrics (TCO, run-rate reduction, staff productivity).',
    technicalConstraints: [
      'Total migration timeline cannot exceed 18 months',
      'Target annual cloud run-rate under $1.15M (35% reduction)',
      'Support 2x throughput growth (from 1,200 to 2,500 RPS peak)'
    ],
    taskQuestions: [
      'How do you calculate and defend the Total Cost of Ownership (TCO) comparison between Oracle Enterprise licensing and AWS DynamoDB?',
      'How do you align the migration phases with the client\'s quarterly budget cycles to demonstrate early ROI?',
      'How does your architecture address Conway\'s Law to ensure team delivery speed matches the cloud architecture?'
    ],
    evaluationRubric: [
      {
        criterion: 'TCO & Financial Modeling',
        weight: '40%',
        targetStandard: 'Demonstrates deep FinOps knowledge: compares Oracle core licensing, SAN storage maintenance, and DBAs versus AWS pay-per-request and managed storage.'
      },
      {
        criterion: 'Team Topologies Alignment',
        weight: '30%',
        targetStandard: 'Applies Reverse Conway Maneuver: reorganizes monolithic component teams into stream-aligned squads owning bounded contexts.'
      },
      {
        criterion: 'Executive Commercial Justification',
        weight: '30%',
        targetStandard: 'Translates architectural decoupling into customer retention value and faster time-to-market for new monetization features.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Align cloud re-architecture with commercial OKRs: replace fixed-capacity Oracle licensing with elastic DynamoDB and SQS, reducing annual TCO by 42% ($750k/yr savings) while enabling autonomous squad delivery.',
      technicalApproach: '1. Financial Model: On-premise annual run-rate = $1.82M (Hardware amortized $450k, Oracle licenses $850k, 24/7 ops team $520k). 2. AWS Target State: DynamoDB On-Demand ($180k/yr), ECS Fargate with Savings Plans ($320k/yr), S3/CloudFront ($120k/yr), Total Cloud = $620k/yr. 3. Reorganize 3 monolithic silo teams into 2 cross-functional stream-aligned squads (Ingestion Squad, Catalog Squad).',
      tradeoffDefense: 'We gain $1.2M in net 2-year operational savings and 2x throughput headroom at the sacrifice of upfront cloud migration engineering investment.',
      diagramOrPattern: 'Annual Spend: Legacy On-Prem ($1.82M) ---> AWS Serverless & Managed ($620K) => 66% Cost Reduction'
    }
  },

  'biz-define-goals': {
    scenarioTitle: 'Defining Contractual SLOs for Multi-Tenant Fleet Telematics',
    businessContext: 'Cox Automotive is launching a Commercial Fleet Management platform streaming live vehicle GPS, diagnostic trouble codes (DTCs), and fuel efficiency metrics from 500,000 connected commercial vans across the US.',
    architecturalProblem: 'The enterprise client asks for "100% uptime, real-time alerts, and zero lost data." As the architect, you must negotiate and define achievable, legally binding Service Level Objectives (SLOs) and Error Budgets.',
    technicalConstraints: [
      '500,000 vehicles transmitting telemetry every 10 seconds (50,000 incoming telemetry packets/sec)',
      'Catastrophic engine breakdown alerts must notify fleet managers within 5 seconds',
      'Routine mileage logging can tolerate up to 15 minutes of eventual consistency',
      'The client contract includes $50,000 monthly SLA breach penalty clauses'
    ],
    taskQuestions: [
      'Why is "100% uptime and zero data loss" architecturally impossible and financially catastrophic in distributed telemetry?',
      'How do you tier your SLOs between Critical Telemetry (DTC alerts) and Routine Telemetry (mileage logs)?',
      'How do you define the Error Budget and what automated operational mechanisms trigger when the budget burns too fast?'
    ],
    evaluationRubric: [
      {
        criterion: 'SLI/SLO Mathematical Precision',
        weight: '40%',
        targetStandard: 'Defines explicit SLIs: Availability = 99.95%, Critical Alert Latency P99 < 5s, Routine Ingestion Throughput >= 50,000 packets/sec.'
      },
      {
        criterion: 'Tiered Architectural Partitioning',
        weight: '35%',
        targetStandard: 'Separates telemetry into Fast Path (Kinesis -> Lambda -> SNS/WebSockets for alerts) and Slow Path (S3 Firehose -> Athena for historical reporting).'
      },
      {
        criterion: 'Error Budget Policy Formulation',
        weight: '25%',
        targetStandard: 'Establishes automated release gate freezes when monthly error budget burn rate exceeds 2x threshold.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Establish a two-tier SLO framework: Tier 1 (Critical Breakdown Alerts) at 99.95% availability with P99 < 5s latency; Tier 2 (Routine Mileage Analytics) at 99.9% availability with P99 < 15m latency, protected by automated error budget burn-rate alerts.',
      technicalApproach: '1. Fast Path: Ingestion API pushes to Amazon Kinesis; critical DTC events routed immediately to Step Functions / SNS for SMS dispatch. 2. Slow Path: Kinesis Data Firehose batches routine mileage into S3 parquet files for Iceberg/Athena analysis. 3. SLI Measurement: CloudWatch metrics track latency at edge and worker tiers; if error budget burns > 5% in 1 hour, PagerDuty alerts on-call leads.',
      tradeoffDefense: 'We trade away immediate transactional consistency on routine mileage data to guarantee sub-5s delivery and high reliability on safety-critical engine failure alerts.',
      diagramOrPattern: 'Telemetry (50k/s) -> API Gateway -> Kinesis -> [Fast Path: DTC Alerts -> SNS (5s)] & [Slow Path: Firehose -> S3 (15m)]'
    }
  },

  'biz-stakeholder-mgmt': {
    scenarioTitle: 'Resolving Security vs. Delivery Conflict on Public Dealer APIs',
    businessContext: 'Two weeks prior to launching the new Cox Automotive Dealer Ingestion API, the Chief Information Security Officer (CISO) blocks the production release, citing inadequate API key authentication and demanding full mTLS and IP whitelisting. The VP of Product threatens to escalate to the CEO, arguing that dealers cannot implement mTLS on legacy dealership servers within 6 months.',
    architecturalProblem: 'Mediate the architectural deadlock between CISO security mandates and Product go-to-market deadlines without compromising enterprise data protection.',
    technicalConstraints: [
      'Launch date cannot slip by more than 14 days without $200k in contractual partner penalties',
      'Dealership DMS networks utilize dynamic IPs and cannot support static IP whitelisting',
      'Zero plain-text dealer credentials allowed over public networks'
    ],
    taskQuestions: [
      'What compromise architecture satisfies the CISO\'s security requirements while remaining feasible for legacy dealership DMS systems?',
      'How do you facilitate an emergency architectural alignment session between the CISO and Product Director?',
      'What phased migration roadmap would you document in an Architectural Decision Record (ADR)?'
    ],
    evaluationRubric: [
      {
        criterion: 'Security Engineering Pragmatism',
        weight: '40%',
        targetStandard: 'Proposes OAuth2 client_credentials with short-lived cryptographically signed JWT tokens, AWS WAF rate limiting, and HMAC request signing as an alternative to rigid mTLS.'
      },
      {
        criterion: 'Stakeholder Mediation & Empathy',
        weight: '35%',
        targetStandard: 'Demonstrates high EQ: acknowledges the CISO\'s regulatory liability while respecting Product\'s commercial timeline constraints.'
      },
      {
        criterion: 'Phased Governance & ADR Rigor',
        weight: '25%',
        targetStandard: 'Authors a clear ADR with Phase 1 (OAuth2 + WAF token-bucket) and Phase 2 (mTLS opt-in with financial incentives for compliant dealers).'
      }
    ],
    modelSolution: {
      executiveSummary: 'Deliver an architected compromise: replace impossible dealer mTLS with OAuth 2.0 Client Credentials, AWS Cognito JWT validation, and AWS WAF Bot Control at API Gateway, satisfying the CISO\'s threat model while enabling on-time product launch.',
      technicalApproach: '1. Phase 1 (Launch): Dealers authenticate via OAuth2 `/token` endpoint using client ID & secret; receive 1-hour scoped JWT. 2. API Gateway validates JWT cryptographically at the edge via Cognito authorizer. 3. AWS WAF enforces rate limiting (10,000 req/min/dealer) and blocks suspicious geographic IPs. 4. Phase 2 (6-month runway): Provide pre-built SDKs for dealers wanting enterprise mTLS.',
      tradeoffDefense: 'We gain on-time commercial launch and seamless dealer onboarding at the sacrifice of perimeter-only mTLS, compensating with robust JWT crypto-validation and edge WAF threat mitigation.',
      diagramOrPattern: 'Dealer DMS -> [OAuth2 Token Exchange] -> API Gateway (WAF Rate Limit + JWT Check) -> Ingest Worker'
    }
  },

  'sol-arch-core': {
    scenarioTitle: 'High-Throughput Automotive Feed Ingestion Engine',
    businessContext: 'Cox Automotive syndicates inventory across 50,000 dealerships nationwide. Every morning at 08:00 AM, thousands of dealerships trigger automated batch uploads of vehicle inventory, appraisals, and pricing updates, creating an abrupt 2,500 RPS traffic surge against central ingestion services.',
    architecturalProblem: 'Design the end-to-end Solution Architecture for this ingestion platform. It must handle 2,500 RPS peak, guarantee zero data loss (RPO = 0), maintain sub-150ms consumer search latency, and provide automatic regional recovery within 15 minutes.',
    technicalConstraints: [
      'Peak ingestion throughput: 2,500 inventory updates/second',
      'Availability SLA: 99.95% (< 4.38 hours downtime/year)',
      'Consumer Search P99 Latency: < 150ms across 45M listings',
      'Data Loss: RPO = 0 for all pricing and title mutations',
      'Disaster Recovery: Regional RTO < 15 minutes'
    ],
    taskQuestions: [
      'Walk the committee through your full C4 Level 2 Container architecture from API ingress to persistent storage.',
      'How does your topology prevent downstream databases from crashing during a sudden 10x morning traffic spike?',
      'How do you reconcile asynchronous ingestion with sub-second consumer search availability?'
    ],
    evaluationRubric: [
      {
        criterion: 'C4 Container Topology Decoupling',
        weight: '35%',
        targetStandard: 'Designs a clean Queue-Based Load Leveling pipeline: API Gateway -> ECS Ingest Worker -> SQS FIFO -> Stream Processing Service -> DynamoDB -> EventBridge -> OpenSearch.'
      },
      {
        criterion: 'NFR & SLA Mathematical Feasibility',
        weight: '35%',
        targetStandard: 'Verifies 2,500 RPS sizing, SQS message visibility timeouts (30s), DynamoDB WCU scaling, and cross-region warm standby replication.'
      },
      {
        criterion: 'Trade-Off & Failure Mode Defense',
        weight: '30%',
        targetStandard: 'Articulates CQRS separation between write-optimized DynamoDB and read-optimized OpenSearch, defending eventual consistency lag.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Implement a Queue-Based Load Leveling architecture on AWS: API Gateway and ECS Ingest Workers buffer bursty dealer updates into Amazon SQS FIFO; containerized workers process batches into a Single-Table DynamoDB store; DynamoDB Streams asynchronously updates OpenSearch via EventBridge.',
      technicalApproach: '1. Ingress: API Gateway authenticates dealer JWTs and routes to ECS Fargate Ingest Workers. 2. Workers validate schema and push to SQS FIFO, returning HTTP 202 Accepted in < 60ms. 3. SQS absorbs traffic spikes, protecting downstream databases. 4. Stream Processing ECS workers pull batches of 10 messages, execute valuation rules, and write to DynamoDB with condition expressions. 5. DynamoDB Streams triggers EventBridge pipes fanning out to OpenSearch cluster.',
      tradeoffDefense: 'We trade away immediate read-your-own-writes consistency across the consumer site (accepting a 2-second eventual consistency lag) in exchange for 100% burst tolerance and guaranteed zero data loss under 2,500 RPS peak load.',
      diagramOrPattern: 'Dealer -> API Gateway -> Ingest Worker (ECS) -> SQS Buffer -> Processor (ECS) -> DynamoDB -> Streams -> EventBridge -> OpenSearch'
    }
  },

  'sol-arch-best-practices': {
    scenarioTitle: 'Architecting for Multi-AZ Fault Tolerance & Zero-Trust',
    businessContext: 'Following an AWS availability zone outage in us-east-1 that crippled a competitor\'s car buying platform for 14 hours, Cox Automotive leadership orders an architectural audit to guarantee that our syndication platform survives a complete AZ blackout with zero operator intervention.',
    architecturalProblem: 'Audit and fortify the Cox Automotive cloud infrastructure against single-AZ failures, enforce zero-trust network boundaries, and implement automated canary rollouts.',
    technicalConstraints: [
      'Must survive sudden loss of any single AWS Availability Zone without downtime',
      'Inter-service communications must be encrypted in transit with Mutual TLS (mTLS)',
      'Automated deployments must rollback within 60 seconds if error rate exceeds 0.5%'
    ],
    taskQuestions: [
      'How do you distribute compute, queuing, and persistence tiers across 3 Availability Zones on AWS?',
      'How do you implement Zero-Trust inter-service security without incurring massive latency overhead?',
      'Describe your automated canary deployment verification pipeline.'
    ],
    evaluationRubric: [
      {
        criterion: 'Multi-AZ Redundancy Architecture',
        weight: '40%',
        targetStandard: 'Deploys ALB across 3 AZs, ECS tasks distributed with spread placement strategies, SQS multi-AZ managed queues, and DynamoDB native 3-AZ synchronous replication.'
      },
      {
        criterion: 'Zero-Trust & mTLS Implementation',
        weight: '30%',
        targetStandard: 'Uses AWS Private Certificate Authority with ECS Service Connect or Envoy sidecars for automated X.509 certificate validation.'
      },
      {
        criterion: 'Canary Verification & Rollback',
        weight: '30%',
        targetStandard: 'Details AWS CodeDeploy canary configuration (10% traffic for 15 minutes) coupled with CloudWatch composite alarm auto-rollback.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Deploy an active-active 3-Availability-Zone topology utilizing AWS ECS Fargate spread placement, native multi-AZ DynamoDB persistence, Zero-Trust inter-service mTLS via ECS Service Connect, and CodeDeploy automated canaries.',
      technicalApproach: '1. Compute: ECS Fargate service configured with `spread: attribute:ecs.availability-zone` across us-east-1a, 1b, 1c (min 6 tasks). 2. Persistence: DynamoDB automatically replicates data synchronously across 3 AZ storage facilities. 3. Security: ECS Service Connect automatically rotates short-lived mTLS X.509 certificates for east-west traffic. 4. Deployment: CodeDeploy Canary10Percent15Minutes monitors CloudWatch 5xx alarm; rolls back in 45s on breach.',
      tradeoffDefense: 'We gain seamless zero-downtime survival of AZ blackouts and automated safety on releases at the sacrifice of additional cross-AZ data transfer costs and 15-minute deployment lead times.',
      diagramOrPattern: 'ALB (Multi-AZ) -> [AZ-1: ECS Task | AZ-2: ECS Task | AZ-3: ECS Task] -> DynamoDB (Synchronous 3-AZ Multi-Storage)'
    }
  },

  'sol-arch-doc-c4-adr': {
    scenarioTitle: 'Authoring and Defending ADR-01 (DynamoDB vs Aurora MySQL)',
    businessContext: 'During an Architectural Review Board meeting, the Chief Database Architect vehemently objects to your team\'s proposal to use DynamoDB Single-Table design for the vehicle inventory catalog, insisting that MySQL or PostgreSQL is the only industry standard for relational vehicle data.',
    architecturalProblem: 'Author and defend Architectural Decision Record ADR-01. Present the rigorous business context, explicit technical decision, quantifiable consequences (Gains and Sacrifices), and comprehensive justification for rejecting Amazon Aurora MySQL.',
    technicalConstraints: [
      'Must sustain 2,500 RPS peak write load without connection pool starvation',
      'Lookup by VIN and Dealer ID must return in < 10ms P99',
      'Database operational maintenance (sharding, patching, failover) must be zero-headcount managed'
    ],
    taskQuestions: [
      'Structure the exact sections of ADR-01 and explain why each section is critical.',
      'What specific architectural failure modes of Aurora MySQL at 2,500 RPS justified its rejection?',
      'What are the explicit sacrifices of Single-Table DynamoDB that you recorded in the ADR?'
    ],
    evaluationRubric: [
      {
        criterion: 'ADR Structure & Architectural Neutrality',
        weight: '35%',
        targetStandard: 'Strictly follows Michael Nygard / MADR syntax: Context, Decision, Consequences (Gains & Sacrifices), Rejected Alternatives.'
      },
      {
        criterion: 'Technical Depth in Database Rejection',
        weight: '35%',
        targetStandard: 'Explains connection pool limits (1,000s of serverless workers), write-lock contention on central tables, and horizontal sharding complexity in SQL.'
      },
      {
        criterion: 'Honesty on Sacrifices',
        weight: '30%',
        targetStandard: 'Explicitly acknowledges loss of ad-hoc SQL joins, requirement for upfront query pattern modeling, and secondary index eventual consistency.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Defend ADR-01 using empirical systems architecture: DynamoDB provides deterministic O(1) single-digit millisecond latency and serverless HTTP scalability at 2,500 RPS, eliminating relational connection pool exhaustion and lock contention.',
      technicalApproach: '1. Context: Peak 2,500 RPS morning feed dumps caused lock contention on MySQL `vehicles` table; connection pools exhausted during auto-scaling spikes. 2. Decision: Adopt Amazon DynamoDB Single-Table design with composite keys (PK: DEALER#id, SK: VEHICLE#vin). 3. Gains: 3-5ms latency, auto-scaling partitions, zero connection pooling overhead. 4. Sacrifices: No runtime SQL joins; must pre-plan access patterns; reporting offloaded to OpenSearch via Streams. 5. Rejection: Aurora MySQL rejected due to connection limits, table write locks, and high operational sharding TCO.',
      tradeoffDefense: 'We gain unbounded horizontal write scalability and predictable sub-5ms performance at the sacrifice of ad-hoc SQL query flexibility.',
      diagramOrPattern: 'ADR-01: [Context: 2,500 RPS Lock Contention] -> [Decision: DynamoDB Single-Table] -> [Gains: O(1) latency | Sacrifice: No ad-hoc joins]'
    }
  },

  'sol-arch-fr-nfr': {
    scenarioTitle: 'NFR Feasibility & Failure Recovery for 2,500 RPS Peak',
    businessContext: 'An EPAM assessment committee member reviews your SAD and challenges: "You claim 2,500 RPS peak, 99.95% availability, and P99 latency under 150ms. Prove the mathematical feasibility of these numbers, show your memory/network sizing, and explain your chaos recovery testing."',
    architecturalProblem: 'Calculate the system capacity requirements and present a mathematically verified verification strategy proving that your proposed architecture satisfies every single NFR constraint without collapsing under stress.',
    technicalConstraints: [
      '2,500 peak inventory updates/sec (average payload: 2 KB)',
      'Search query volume: 1,500 queries/sec (average payload: 10 KB)',
      'SLA: 99.95% Availability; P99 Latency < 150ms; RPO = 0; RTO < 15m'
    ],
    taskQuestions: [
      'Show your capacity calculations for ingress network bandwidth, daily storage accumulation, and required DynamoDB write capacity units.',
      'How does your design guarantee RPO = 0 if a primary container worker crashes during a burst?',
      'How do you verify the 15-minute RTO during a total regional outage?'
    ],
    evaluationRubric: [
      {
        criterion: 'Mathematical Rigor & Sizing',
        weight: '40%',
        targetStandard: 'Calculates: Ingress = 5 MB/s (40 Mbps); Daily storage = 432 GB/day raw (157 TB/year); DynamoDB = 5,000 WCU (2 KB = 2 WCU/write).'
      },
      {
        criterion: 'RPO = 0 Verification Logic',
        weight: '35%',
        targetStandard: 'Explains SQS explicit delete-after-commit semantics, visibility timeout recovery, and DynamoDB Point-in-Time Recovery.'
      },
      {
        criterion: 'RTO Recovery Procedure',
        weight: '25%',
        targetStandard: 'Details automated Route 53 health-check failover to us-west-2 warm standby cluster supported by DynamoDB Global Tables.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Prove NFR feasibility through back-of-the-envelope capacity mathematics, SQS acknowledgment protocols for RPO=0, and multi-region warm standby failover for sub-15m RTO.',
      technicalApproach: '1. Sizing: 2,500 RPS * 2 KB = 5 MB/s ingress network bandwidth (negligible on AWS 10 Gbps interfaces). Storage: 5 MB/s * 3,600s * 4h peak = 72 GB/day compressed in DynamoDB. DynamoDB WCUs: Each 2 KB item consumes 2 WCUs = 5,000 WCUs peak. 2. RPO=0: SQS messages are only deleted after DynamoDB atomic put succeeds; crashes trigger visibility timeout redelivery to another worker; DLQ captures 3x failures. 3. RTO < 15m: Route 53 DNS failover triggers in 3 minutes; secondary ECS cluster auto-scales from warm baseline in 5 minutes.',
      tradeoffDefense: 'We pay for cross-region DynamoDB Global Table replication and warm standby compute in us-west-2 in exchange for mathematical certainty of achieving RTO < 15m and RPO=0.',
      diagramOrPattern: 'Calculations: 2,500 RPS * 2 KB = 5 MB/sec | 5,000 WCU Peak | Route 53 Failover in 180s < 15m RTO'
    }
  },

  'sol-arch-ref-arch': {
    scenarioTitle: 'Adapting Cloud Reference Architectures for Enterprise Compliance',
    businessContext: 'An enterprise bank acquiring an automotive loan platform demands using the official AWS Multi-Tier Web Application Reference Architecture. However, their security governance forbids public API Gateways connecting directly to internal subnets without forward-proxy inspection.',
    architecturalProblem: 'Adapt the standard AWS reference architecture to comply with the bank\'s enterprise transit VPC and egress proxy compliance requirements without degrading the 150ms P99 latency SLA.',
    technicalConstraints: [
      'All egress internet traffic must route through centralized Palo Alto firewalls in an inspection VPC',
      'Inter-VPC latency addition must remain < 15ms',
      'Zero public IP addresses on application container tasks'
    ],
    taskQuestions: [
      'How do you adapt the AWS reference architecture using AWS Transit Gateway and VPC Endpoints (PrivateLink)?',
      'What is the performance and cost impact of routing high-throughput SQS and DynamoDB traffic through an inspection firewall?',
      'How do you document this divergence from the standard AWS blueprint for the bank\'s enterprise architects?'
    ],
    evaluationRubric: [
      {
        criterion: 'Enterprise Cloud Networking',
        weight: '40%',
        targetStandard: 'Recommends AWS Gateway Load Balancer (GWLB) with Transit Gateway and VPC Endpoints for AWS services to bypass inspection firewalls safely.'
      },
      {
        criterion: 'Latency Impact Analysis',
        weight: '35%',
        targetStandard: 'Demonstrates that routing AWS-internal DynamoDB traffic through third-party firewalls introduces 25ms of latency and massive egress fees; justifies Gateway Endpoints.'
      },
      {
        criterion: 'Governance Documentation',
        weight: '25%',
        targetStandard: 'Authors an Architectural Variance Request (AVR) demonstrating full compliance with banking security standards.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Adapt the reference architecture using AWS Transit Gateway and VPC PrivateLink: route internal AWS service calls directly via Gateway Endpoints (0ms latency, zero egress cost) while funneling external dealer webhook calls through Gateway Load Balancer inspection firewalls.',
      technicalApproach: '1. Create Transit Gateway connecting Application VPC and Security Inspection VPC. 2. Provision AWS Gateway VPC Endpoints for S3 and DynamoDB inside the App VPC, ensuring database traffic never leaves AWS backbone. 3. Route external dealer webhook traffic through Gateway Load Balancer fronted by Palo Alto virtual appliances. 4. Total inter-VPC latency overhead constrained to 1.8ms.',
      tradeoffDefense: 'We gain total banking compliance and deep packet inspection for external internet traffic while preserving sub-5ms internal database latency by keeping AWS SDK calls on native VPC endpoints.',
      diagramOrPattern: 'App VPC (ECS) -> [Gateway Endpoint (0ms)] -> DynamoDB | App VPC (ECS) -> [Transit Gateway] -> Security Inspection VPC -> Internet'
    }
  },

  'sol-arch-ddd': {
    scenarioTitle: 'Carving Bounded Contexts in an Automotive Megasystem',
    businessContext: 'In the Cox Automotive platform, the word "Vehicle" means completely different things to different departments: To Showroom Sales, it is physical inventory with paint and trim; to Valuation, it is an appraisal calculation with market depreciation; to Lending, it is loan collateral with a title lien.',
    architecturalProblem: 'The existing legacy system has a single 180-column "Vehicles" SQL table shared across 6 squads, causing constant database schema merge conflicts and blocked deployments. Apply Domain-Driven Design (DDD) to decompose this monolith into clear Bounded Contexts.',
    technicalConstraints: [
      'Each squad must be able to deploy their domain database schema independently',
      'Consumer search must present a unified view of inventory with current valuation and financing options',
      'Zero distributed 2-Phase Commit (2PC) transactions across service boundaries'
    ],
    taskQuestions: [
      'How do you identify Bounded Contexts and Ubiquitous Language through Event Storming?',
      'Design the Aggregate Root and Context Map between the Catalog Context and the Valuation Context.',
      'How do you synchronize vehicle data across these bounded contexts without direct database links?'
    ],
    evaluationRubric: [
      {
        criterion: 'Strategic DDD & Context Mapping',
        weight: '40%',
        targetStandard: 'Defines 3 distinct Bounded Contexts: Inventory Catalog, Vehicle Valuation, and Auto Financing with Customer-Supplier / Upstream-Downstream mappings.'
      },
      {
        criterion: 'Tactical Aggregate Modeling',
        weight: '35%',
        targetStandard: 'Models distinct domain entities: `CatalogVehicle` (VIN, mechanical specs), `AppraisedVehicle` (VIN, KBB value, depreciation curves), avoiding shared God Objects.'
      },
      {
        criterion: 'Asynchronous Event Integration',
        weight: '25%',
        targetStandard: 'Uses Domain Events (`VehiclePriceAdjusted`, `AppraisalCompleted`) via EventBridge to maintain eventual consistency without distributed locks.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Deconstruct the monolithic table into 3 independent Bounded Contexts: Inventory Catalog, Vehicle Valuation, and Loan Servicing. Each context owns its private datastore and synchronizes via domain events over AWS EventBridge.',
      technicalApproach: '1. Inventory Catalog Context owns `VehicleInventoryAggregate` in DynamoDB. 2. Vehicle Valuation Context owns `AppraisalAggregate` in its own datastore. 3. When an appraisal changes, Valuation publishes `AppraisalUpdatedEvent` to EventBridge. 4. Catalog Service listens via SQS queue and updates its local read projection. 5. Squads deploy independently with zero shared database migrations.',
      tradeoffDefense: 'We gain complete squad deployment autonomy and clean domain modeling at the sacrifice of eventual consistency (appraisal updates reflect in the catalog within 2 seconds).',
      diagramOrPattern: 'Catalog Context (DynamoDB) <--- [EventBridge Domain Events] ---> Valuation Context (DynamoDB)'
    }
  },

  'sol-arch-microservices': {
    scenarioTitle: 'Cascading Failure in a Deep Microservice Call Chain',
    businessContext: 'On Cyber Monday, consumer search traffic surges 5x. An external Kelley Blue Book valuation microservice begins lagging (latency jumps from 40ms to 4,500ms). Within 90 seconds, the Search Service, Dealer Portal, and Checkout Service all crash simultaneously with HTTP 504 Gateway Timeouts.',
    architecturalProblem: 'Diagnose the cascading failure in this microservice call graph and redesign the inter-service communication architecture to guarantee fault isolation and prevent systemic collapse.',
    technicalConstraints: [
      'Consumer search must continue functioning even if third-party valuation APIs are completely offline',
      'P99 consumer catalog search latency must stay under 150ms under 5x traffic surges',
      'System must self-heal without manual engineering restarts when external APIs recover'
    ],
    taskQuestions: [
      'Why did a slowdown in a single downstream microservice cause the entire upstream fleet to crash?',
      'How do you implement the Bulkhead and Circuit Breaker patterns to isolate this failure?',
      'Why is synchronous REST anti-pattern for inter-service communication under high concurrency?'
    ],
    evaluationRubric: [
      {
        criterion: 'Cascading Failure Diagnosis',
        weight: '40%',
        targetStandard: 'Identifies thread pool exhaustion, socket starvation, and un-timeouted synchronous HTTP chains as the root cause of the outage.'
      },
      {
        criterion: 'Resiliency Pattern Implementation',
        weight: '35%',
        targetStandard: 'Applies Circuit Breaker (Cockatiel/Polly), isolated Bulkhead thread pools, and asynchronous CQRS caching.'
      },
      {
        criterion: 'Graceful Degradation Architecture',
        weight: '25%',
        targetStandard: 'Designs degraded fallback: when Valuation API fails, consumer search returns last-known cached valuation with a "Historical Estimate" badge.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Eliminate synchronous runtime dependency chains: isolate third-party valuation calls behind a Circuit Breaker with Bulkhead thread isolation, pre-materialize valuation data in a Redis cache via CQRS, and fall back gracefully to historical cached values.',
      technicalApproach: '1. Wrap Valuation API calls in a Circuit Breaker (opens at 50% failure/latency > 500ms over 10s). 2. When open, requests immediately return cached valuation in 2ms without holding open HTTP sockets. 3. Implement Bulkhead pattern: allocate dedicated thread pool (max 20 sockets) for external calls so search APIs never run out of connections. 4. Shift valuation synchronization to asynchronous background events.',
      tradeoffDefense: 'We gain unbreakable systemic availability and sub-150ms search latency at the sacrifice of displaying 24-hour cached valuations during external third-party outages.',
      diagramOrPattern: 'Search API -> [Bulkhead 20 Sockets] -> [Circuit Breaker: Open -> Fallback to Redis Cache (2ms)]'
    }
  },

  'sdlc-scrum': {
    scenarioTitle: 'Managing Architectural Runway in Fast-Paced 2-Week Sprints',
    businessContext: 'In a 2-week Scrum delivery cycle, the product owner prioritizes 100% feature user stories every sprint. After 4 months, the codebase suffers from severe architectural decay: build times take 45 minutes, regression defects have tripled, and database deadlocks occur weekly.',
    architecturalProblem: 'As the Software Architect, establish architectural governance within the Scrum framework to restore system quality without alienating product management.',
    technicalConstraints: [
      'Must maintain continuous feature delivery to meet quarterly commercial client commitments',
      'Must reduce CI/CD build times from 45 minutes to < 10 minutes',
      'Must systematically pay down database architectural debt over the next 3 sprints'
    ],
    taskQuestions: [
      'How do you introduce the concept of "Architectural Runway" into sprint backlog refinement?',
      'How do you negotiate and establish a permanent capacity allocation (e.g. 20%) for technical debt?',
      'How do you write Non-Functional Acceptance Criteria into developer user stories?'
    ],
    evaluationRubric: [
      {
        criterion: 'Scrum Ceremony Integration',
        weight: '40%',
        targetStandard: 'Integrates architectural spikes into backlog refinement and defines Definition of Done (DoD) criteria for code quality.'
      },
      {
        criterion: 'Commercial Negotiation of Tech Debt',
        weight: '35%',
        targetStandard: 'Frames technical debt in terms of feature velocity drag (e.g. "We currently spend 30% of sprint capacity fixing regressions").'
      },
      {
        criterion: 'Definition of Done (DoD) Formulation',
        weight: '25%',
        targetStandard: 'Defines strict DoD: unit test coverage > 85%, ADR committed, SonarQube quality gate passed, no direct DB joins across services.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Establish a structured 80/20 sprint capacity agreement with product leadership, embed explicit Architectural Runway spikes into refinement, and enforce strict Non-Functional acceptance criteria in the Definition of Done.',
      technicalApproach: '1. Present velocity data: show that defect tickets have increased by 200%, consuming 15 story points per sprint. 2. Establish agreement: 20% capacity (8 points/sprint) dedicated to architectural runway and debt remediation. 3. Introduce time-boxed Technical Spikes with clear deliverables (e.g. SPIKE-201: Optimize Docker CI build caching). 4. Update Definition of Done in Jira: every story must pass SonarQube quality gate and automated contract tests.',
      tradeoffDefense: 'We trade away 20% of short-term feature throughput in exchange for halving defect rates and tripling long-term release velocity.',
      diagramOrPattern: 'Sprint Capacity: [80% Feature User Stories] + [20% Architectural Runway & Debt Spikes]'
    }
  },

  'sdlc-methodologies': {
    scenarioTitle: 'Choosing Between Scrum and Kanban for Divergent Squads',
    businessContext: 'Cox Automotive is establishing two new engineering squads: Squad A is building a brand new Green-field Mobile App with defined milestones; Squad B is handling continuous feed ingestion onboarding for 5,000 dealerships with unpredictable daily partner format errors.',
    architecturalProblem: 'Select and justify the appropriate SDLC delivery methodology for each squad. The Engineering VP wants both squads to use identical rigid 2-week Scrum sprints.',
    technicalConstraints: [
      'Squad A has fixed quarterly milestone deliverables for iOS/Android app stores',
      'Squad B receives 30-50 unplanned dealer feed defect escalations per week',
      'Both squads share common platform microservices'
    ],
    taskQuestions: [
      'Why will rigid 2-week Scrum sprints fail for Squad B while succeeding for Squad A?',
      'How do you configure Kanban Work-In-Progress (WIP) limits and Service Level Expectations (SLE) for Squad B?',
      'How do you govern architectural alignment between two squads running different delivery cadences?'
    ],
    evaluationRubric: [
      {
        criterion: 'Methodology Comparative Analysis',
        weight: '40%',
        targetStandard: 'Clearly contrasts iteration-based Scrum (best for high planning predictability) with flow-based Kanban (best for continuous event-driven support).'
      },
      {
        criterion: 'Kanban Flow Design & WIP Limits',
        weight: '35%',
        targetStandard: 'Defines explicit WIP limits on triage, architectural review, and release stages to prevent queue blockage.'
      },
      {
        criterion: 'Architectural Alignment Governance',
        weight: '25%',
        targetStandard: 'Uses an Architecture Review Board and shared OpenAPI contracts to synchronize cross-squad platform dependencies.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Implement a hybrid methodology model: assign Scrum to Squad A for planned greenfield mobile development; assign Kanban to Squad B for continuous flow-based dealer feed onboarding with strict WIP limits; govern shared architecture via weekly Architecture Review Boards.',
      technicalApproach: '1. Squad A (Mobile): Runs 2-week Scrum sprints with story point estimation, sprint planning, and bi-weekly demo milestones. 2. Squad B (Ingestion): Runs Kanban board with WIP limits (Triage: 3, In Progress: 4, Arch Review: 2). Measures Cycle Time and Lead Time. 3. Cross-Squad Governance: Lead Architects from both squads meet weekly to review shared API schema changes and contract tests.',
      tradeoffDefense: 'We sacrifice standardized single-cadence corporate reporting in exchange for maximizing delivery efficiency tailored to the actual operational reality of each team.',
      diagramOrPattern: 'Squad A (Mobile): Scrum 2-Week Sprints <---> [Shared Architecture Bus] <---> Squad B (Feeds): Continuous Kanban Flow'
    }
  },

  'sdlc-delivery-mgmt': {
    scenarioTitle: 'Diagnosing DORA Metric Degradation Across 15 Squads',
    businessContext: 'Across Cox Automotive\'s 15 engineering squads, monthly deployment frequency has dropped from 45 releases/month to 3 releases/month, while Change Failure Rate has soared from 2% to 28%, causing frequent emergency hotfixes and weekend rollbacks.',
    architecturalProblem: 'As Lead Software Architect, partner with Delivery Management to diagnose the architectural causes of this pipeline collapse and implement a technical remediation program to restore elite DORA metrics.',
    technicalConstraints: [
      'Must return Deployment Frequency to >= 1 release/day/squad within 90 days',
      'Change Failure Rate must drop below 5%',
      'Mean Time to Restore (MTTR) must be under 30 minutes'
    ],
    taskQuestions: [
      'What architectural anti-patterns (e.g. distributed monoliths, shared staging environments, manual QA gates) typically cause DORA metrics to collapse?',
      'How do automated Canary deployments and Feature Flags decouple technical deployments from business releases?',
      'What automated metrics dashboard would you construct to track DORA performance in real-time?'
    ],
    evaluationRubric: [
      {
        criterion: 'DORA Telemetry Diagnosis',
        weight: '40%',
        targetStandard: 'Identifies monolithic database coupling, lack of test automation, and shared monolithic staging environments as the root cause of release paralysis.'
      },
      {
        criterion: 'Decoupling Architecture & Feature Flags',
        weight: '35%',
        targetStandard: 'Implements trunk-based development with feature flags (LaunchDarkly) and contract testing (Pact) to eliminate manual staging environment locks.'
      },
      {
        criterion: 'Automated Canary & MTTR Strategy',
        weight: '25%',
        targetStandard: 'Configures AWS CodeDeploy automatic rollback on CloudWatch alarms, cutting MTTR from 4 hours to < 5 minutes.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Transform delivery velocity by dismantling staging environment bottlenecks: transition 15 squads from branch-based release trains to trunk-based development with feature flags, contract testing, and automated CodeDeploy canary rollbacks.',
      technicalApproach: '1. Eliminate shared staging environment: replace manual end-to-end testing with Pact contract tests in CI (build time < 8m). 2. Implement trunk-based development: all code merges to main daily behind feature flags. 3. Deploy via CodeDeploy canary: 10% traffic for 15 minutes; auto-rollback if error rate > 0.5%, slashing MTTR to 3 minutes. 4. DORA Dashboard: Connect GitHub webhooks and Datadog to display live velocity in team rooms.',
      tradeoffDefense: 'We trade away monolithic manual QA sign-offs in exchange for continuous automated deployments, reducing change failure rate from 28% to 1.8%.',
      diagramOrPattern: 'Trunk Main -> [CI Contract Tests (8m)] -> [Canary 10% (15m)] -> [Auto-Rollback on 5xx or Full 100% Release]'
    }
  },

  'sdlc-estimation': {
    scenarioTitle: 'Estimating an Ambiguous 12-Month Monolith Decomposition',
    businessContext: 'The client CIO requests a fixed-price, fixed-scope estimate to decompose a 15-year-old on-premise Java monolith into cloud-native microservices. The monolith has 1.2M lines of code, zero automated unit tests, and the original developers have all left the company.',
    architecturalProblem: 'Formulate an estimation strategy that protects EPAM from fixed-price bankruptcy while providing client leadership with credible, statistically sound confidence intervals.',
    technicalConstraints: [
      'Client executive leadership demands an initial delivery estimate within 10 days',
      'Codebase has extensive undocumented stored procedures and circular dependencies',
      'Target production cutover must have zero downtime'
    ],
    taskQuestions: [
      'Why is a traditional single-point Waterfall estimate guaranteed to fail on legacy migrations?',
      'How do you apply the PERT Three-Point estimation formula and Monte Carlo simulation to quantify uncertainty?',
      'How do you structure the commercial engagement into a Discovery Phase before committing to migration milestones?'
    ],
    evaluationRubric: [
      {
        criterion: 'Uncertainty Modeling & Risk Quantification',
        weight: '40%',
        targetStandard: 'Rejects single-point estimates; uses PERT Three-Point Sizing (O, M, P) and communicates standard deviations and confidence intervals (85% certainty).'
      },
      {
        criterion: 'WBS & Strangler Fig Decomposition',
        weight: '35%',
        targetStandard: 'Decomposes migration into vertical domain slices (e.g. Ingestion slice, Valuation slice) rather than horizontal architectural layers.'
      },
      {
        criterion: 'Commercial Phase-Gating Strategy',
        weight: '25%',
        targetStandard: 'Recommends a 4-week paid Architectural Discovery & Proof-of-Concept spike to establish empirical velocity before pricing subsequent phases.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Refuse single-point estimation on un-tested legacy codebases: structure the engagement as a 4-week paid Architectural Discovery Spike to measure empirical refactoring velocity, followed by PERT 3-point estimation with an 85% statistical confidence buffer.',
      technicalApproach: '1. Discovery Phase (4 weeks): Run static analysis (SonarQube) to map dependency graph and extract bounded contexts. 2. Decompose into vertical slices: Slice 1 (Vehicle Syndication), Slice 2 (Appraisal), Slice 3 (Dealer Billing). 3. Apply PERT: For Slice 1: Optimistic = 4 weeks, Most Likely = 7 weeks, Pessimistic = 16 weeks -> Expected Duration = (4 + 4*7 + 16)/6 = 8 weeks, Variance = 4. 4. Communicate range to CIO: "8 weeks with an 85% confidence window between 7 and 11 weeks."',
      tradeoffDefense: 'We trade away immediate single-number false certainty in exchange for statistically defensible confidence ranges and contractual risk protection.',
      diagramOrPattern: 'Discovery Spike (4w) -> Measured Velocity -> PERT 3-Point Model (O/M/P) -> 85% Confidence Release Window'
    }
  },

  'app-arch-dev-core': {
    scenarioTitle: 'Resolving Event Loop Starvation Under 2,500 RPS in Node.js',
    businessContext: 'During morning dealer inventory syndication, the Node.js Ingest Worker fleet on AWS ECS Fargate experiences sudden health-check failures and restarts. Application APM reveals that CPU usage is only 45%, but P99 HTTP latency spikes from 35ms to 12,000ms, and ALB begins returning 502 Bad Gateway.',
    architecturalProblem: 'Diagnose and resolve the Node.js event loop starvation causing container health-check timeouts under 2,500 RPS without switching programming languages.',
    technicalConstraints: [
      'Ingest worker must process 2,500 payload updates per second',
      'Container memory limit is 512 MB per task on AWS ECS Fargate',
      'Incoming dealer CSV files can be up to 100 MB in size'
    ],
    taskQuestions: [
      'What specific operations in Node.js block the event loop and cause health checks to fail while CPU sits at 45%?',
      'How would you use Clinic.js or Chrome DevTools to pinpoint the exact line of blocking code?',
      'How do you refactor the ingestion pipeline using streaming and worker threads to keep event loop latency < 10ms?'
    ],
    evaluationRubric: [
      {
        criterion: 'Node.js Runtime Internals Mastery',
        weight: '40%',
        targetStandard: 'Explains Libuv event loop phases, identifying synchronous `JSON.parse` of multi-megabyte payloads or synchronous regex evaluation as the root cause.'
      },
      {
        criterion: 'High-Throughput Streaming Refactoring',
        weight: '35%',
        targetStandard: 'Replaces in-memory buffering with `stream.pipeline`, backpressure chunking, and worker threads (`worker_threads`) for heavy cryptographic or parsing logic.'
      },
      {
        criterion: 'Health Check & Connection Optimization',
        weight: '25%',
        targetStandard: 'Configures HTTP keep-alive agents, isolates health-check endpoints on a dedicated port, and tunes ALB timeout parameters.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Eliminate event loop starvation: replace synchronous in-memory JSON/CSV buffering with Node.js backpressured streams and offload compute-heavy normalization to a Worker Thread pool, keeping event loop lag under 5ms.',
      technicalApproach: '1. Root cause: Ingest worker was reading entire 100 MB dealer files into memory via `fs.readFile` and running synchronous regex parsing, freezing the single-threaded event loop for 4 seconds. 2. Solution: Refactor to Node.js `stream.pipeline` using `csv-parse/stream` chunked in 100-record batches. 3. Offload cryptographic checksumming to `worker_threads` pool. 4. Configure `https.Agent` with `keepAlive: true` and `maxSockets: 500`. Result: P99 latency drops from 12s to 42ms.',
      tradeoffDefense: 'We gain single-digit millisecond event loop responsiveness and 5x throughput scalability on 512MB RAM containers at the sacrifice of slightly higher code complexity using Node streams.',
      diagramOrPattern: 'Stream Ingress -> Transform Chunk (100 rows) -> [Worker Thread Pool (CPU)] -> SQS Buffer (Event loop unblocked)'
    }
  },

  'app-arch-core': {
    scenarioTitle: 'Enforcing Hexagonal Architecture in a Legacy Express App',
    businessContext: 'A fast-growing automotive inventory service written in Node.js has become impossible to maintain: database queries (`aws-sdk/client-dynamodb`) and Stripe billing calls are hardcoded directly inside Express route controllers. Changing a DynamoDB attribute breaks 15 unit tests, and writing unit tests requires running LocalStack in Docker.',
    architecturalProblem: 'Refactor the application into Hexagonal Architecture (Ports and Adapters). Isolate the core domain model from external infrastructure so that business rules can be tested in 50 milliseconds without Docker or cloud mocks.',
    technicalConstraints: [
      'Zero downtime during refactoring; existing API contracts cannot change',
      'Domain logic must achieve 100% unit test coverage with pure in-memory test doubles',
      'Automated architectural linting must prevent future code contamination in CI'
    ],
    taskQuestions: [
      'Define the inbound ports, outbound ports, and adapters for the vehicle inventory management use case.',
      'How do you invert the dependency between the `AppraiseVehicleUseCase` and the DynamoDB persistence layer?',
      'How do you enforce architectural dependency rules automatically in GitHub Actions using `dependency-cruiser`?'
    ],
    evaluationRubric: [
      {
        criterion: 'Hexagonal Structural Rigor',
        weight: '40%',
        targetStandard: 'Clearly specifies: Inbound Port (`AppraiseVehiclePort`), Outbound Port (`InventoryRepositoryPort`, `ValuationGatewayPort`), Inbound Adapter (Express Router), Outbound Adapter (DynamoDBRepository).'
      },
      {
        criterion: 'Pure Domain Isolation & Testability',
        weight: '35%',
        targetStandard: 'Demonstrates domain entity with zero framework imports; use cases tested with in-memory array repository running 500 tests in < 1 second.'
      },
      {
        criterion: 'Automated CI Boundary Governance',
        weight: '25%',
        targetStandard: 'Configures `.dependency-cruiser.js` rules strictly forbidding `domain` from importing `infrastructure` or `adapters`.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Restructure the codebase into Hexagonal Architecture: extract core domain logic into pure TypeScript entities and use-cases; isolate persistence and cloud SDKs behind outbound ports, enforced via dependency-cruiser in CI.',
      technicalApproach: '1. Define Outbound Port: `export interface VehicleRepository { save(v: Vehicle): Promise<void>; find(vin: string): Promise<Vehicle>; }`. 2. Implement Domain Use Case: `AppraiseVehicleUseCase` accepts repository via dependency injection in its constructor. 3. Build Outbound Adapter: `DynamoDbVehicleAdapter` implements `VehicleRepository` using AWS SDK v3. 4. Unit Testing: Pass `InMemoryVehicleRepository` to use case tests; 200 unit tests execute in 120ms without Docker. 5. Add CI rule failing builds if domain imports infrastructure.',
      tradeoffDefense: 'We gain lightning-fast unit tests and total infrastructure swappability at the sacrifice of writing interface boilerplates and mapping DTOs across layer boundaries.',
      diagramOrPattern: 'Express Router (Inbound Adapter) -> AppraiseVehicleUseCase (Domain) -> [Port: VehicleRepo] -> DynamoDbAdapter (Outbound)'
    }
  },

  'app-arch-styles': {
    scenarioTitle: 'Choosing Between Modular Monolith and Microservices for Dealer ERP',
    businessContext: 'A startup automotive dealer software provider with 8 engineers is planning to rewrite their system. The lead engineer proposes building 12 separate microservices with Kubernetes, Istio service mesh, and distributed Kafka brokers.',
    architecturalProblem: 'Evaluate the proposed microservices architecture against a Modular Monolith. Provide an objective, trade-off-driven recommendation tailored to the company\'s team size and funding runway.',
    technicalConstraints: [
      'Engineering team size: 8 full-stack engineers (zero dedicated DevOps specialists)',
      'Runway: 12 months to achieve profitability',
      'Transaction volume: 50 RPS average, 300 RPS peak'
    ],
    taskQuestions: [
      'What is the "Distributed Systems Tax" and why will 12 microservices likely kill this startup?',
      'How do you design a Modular Monolith that preserves clean module boundaries and allows future microservice extraction?',
      'Under what explicit operational and business triggers should the team migrate from a Modular Monolith to Microservices?'
    ],
    evaluationRubric: [
      {
        criterion: 'Architectural Pragmatism & Team Fit',
        weight: '40%',
        targetStandard: 'Courageously rejects microservices for an 8-person team; articulates operational overhead (mesh, distributed tracing, network latency, deployment coordination).'
      },
      {
        criterion: 'Modular Monolith Engineering Rigor',
        weight: '35%',
        targetStandard: 'Designs modular monolith with internal bounded contexts, private schemas/tables per module, and communication via in-process module interfaces.'
      },
      {
        criterion: 'Decomposition Triggers Formulation',
        weight: '25%',
        targetStandard: 'Establishes clear criteria for future extraction: independent scaling bottlenecks, distinct deployment cadences across multi-squads, or specialized hardware needs.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Reject the 12-microservice proposal: build a Modular Monolith in TypeScript with strict internal domain boundaries and separate database schemas, preserving 80% of developer velocity while keeping operational overhead near zero.',
      technicalApproach: '1. Structure as Modular Monolith in a monorepo: `modules/inventory`, `modules/billing`, `modules/appraisal`. 2. Modules communicate solely through public TypeScript interfaces or in-memory event emitters; direct internal file imports are blocked by ESLint. 3. Data isolation: Each module owns its dedicated tables in PostgreSQL. 4. Deployment: Single container on ECS Fargate deployed via simple CI pipeline. 5. If traffic on `inventory` spikes 20x later, it can be extracted into a microservice in 3 days.',
      tradeoffDefense: 'We gain maximum feature delivery velocity and zero operational Kubernetes overhead at the sacrifice of independent microservice deployment cadences that an 8-person team does not need.',
      diagramOrPattern: 'Modular Monolith (Single ECS Task): [Inventory Module] <-> [In-Process Bus] <-> [Billing Module] (Shared DB, Private Schemas)'
    }
  },

  'app-arch-patterns': {
    scenarioTitle: 'Polymorphic Feed Ingestion & Resilient Valuation Engine',
    businessContext: 'Cox Automotive must ingest vehicle feeds from 8 disparate Dealership Management Systems (CDK, Reynolds & Reynolds, DealerTrack, CSV, XML, JSON). Each format has different date representations, VIN formatting, and pricing rules. In addition, external valuation HTTP calls frequently fail during market volatility.',
    architecturalProblem: 'Design the application architecture utilizing proven software design patterns to ingest polymorphic feeds cleanly and protect external valuation integrations from cascading failures.',
    technicalConstraints: [
      'New dealer feed formats must be addable without modifying existing feed parsers (Open/Closed Principle)',
      'Third-party valuation HTTP API timeouts must not block worker threads or cause memory leaks',
      'All vehicle records must pass validation before domain persistence'
    ],
    taskQuestions: [
      'How do you apply the Strategy and Factory patterns to handle polymorphic feed parsing in TypeScript?',
      'How do you implement the Circuit Breaker and Retry-with-Jitter patterns for external HTTP valuation calls?',
      'Why is the Singleton pattern dangerous in a distributed or multi-container cloud environment?'
    ],
    evaluationRubric: [
      {
        criterion: 'GoF Pattern Application',
        weight: '40%',
        targetStandard: 'Demonstrates Factory pattern selecting polymorphic `FeedParserStrategy` implementations based on feed metadata, satisfying the Open/Closed Principle.'
      },
      {
        criterion: 'Resiliency Pattern Implementation',
        weight: '35%',
        targetStandard: 'Configures Circuit Breaker (Half-Open probing, failure thresholds) combined with Exponential Backoff and Full Jitter.'
      },
      {
        criterion: 'Distributed Concurrency Pitfalls',
        weight: '25%',
        targetStandard: 'Articulates why stateful in-memory singletons fail across horizontal containers, advocating stateless instances with Redis/DynamoDB.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Apply the Strategy and Factory patterns to achieve extensible, polymorphic feed parsing, and wrap external valuation calls in a Circuit Breaker with Exponential Backoff and Full Jitter.',
      technicalApproach: '1. Feed Parsing: Define `FeedParserStrategy` interface. Implement `CdkStrategy`, `ReynoldsStrategy`, and `CsvStrategy`. 2. `FeedParserFactory` resolves the appropriate strategy at runtime using feed header metadata. 3. Resiliency: Wrap external valuation HTTP calls in Cockatiel Circuit Breaker (`breaker: new ConsecutiveBreaker(5), halfOpenAfter: 30000`). 4. Wrap with `retry(handleAll, { maxAttempts: 3, backoff: new ExponentialBackoff({ initialDelay: 200 }) })`.',
      tradeoffDefense: 'We gain clean extensibility (adding a new dealer format takes 2 hours without touching core code) and fault isolation at the sacrifice of minor abstraction boilerplate.',
      diagramOrPattern: 'Feed Request -> FeedParserFactory -> resolves [Strategy: CDK / Reynolds / CSV] -> [Circuit Breaker] -> External API'
    }
  },

  'app-arch-application': {
    scenarioTitle: 'Designing a Unified Domain Error and Validation Hierarchy',
    businessContext: 'In an automotive syndication platform, error handling is completely fragmented: some modules throw plain JavaScript strings, some return HTTP 500 with stack traces leaking internal database passwords, and client applications receive inconsistent error formats across REST and asynchronous webhooks.',
    architecturalProblem: 'Design a unified application error handling and schema validation architecture that enforces strict domain invariants, protects internal system security, and provides standardized RFC 7807 problem details to API consumers.',
    technicalConstraints: [
      'Zero internal stack traces or database connection strings leaked in API responses',
      'Must comply with RFC 7807 (Problem Details for HTTP APIs)',
      'Validation must reject malformed dealer payloads at the application boundary in < 2ms'
    ],
    taskQuestions: [
      'How do you structure an object-oriented domain error hierarchy in TypeScript that cleanly maps to HTTP status codes?',
      'How do you integrate Zod schema validation at the presentation layer without leaking HTTP dependencies into the domain layer?',
      'How do you handle unhandled promise rejections and asynchronous exceptions in a Node.js microservice?'
    ],
    evaluationRubric: [
      {
        criterion: 'Domain Error Hierarchy Design',
        weight: '40%',
        targetStandard: 'Creates base `DomainError` extending `Error`, with subclasses: `EntityNotFoundError` (404), `ConcurrencyConflictError` (409), `ValidationFailedError` (422), `UnauthorizedError` (401).'
      },
      {
        criterion: 'Boundary Validation & RFC 7807',
        weight: '35%',
        targetStandard: 'Implements Zod validation middleware formatting errors into RFC 7807 `{ type, title, status, detail, instance, invalidParams }` structure.'
      },
      {
        criterion: 'Centralized Exception Interceptor',
        weight: '25%',
        targetStandard: 'Configures global Express error middleware logging full context internally with correlation IDs while sanitizing client outputs.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Establish a centralized application error architecture based on RFC 7807: validate payloads at the boundary using Zod, enforce invariants via a typed DomainError hierarchy, and sanitize all client responses through a global exception interceptor.',
      technicalApproach: '1. Error Hierarchy: `abstract class DomainError extends Error { abstract statusCode: number; }`. Subclasses include `InvalidVinError` (422) and `VehicleAlreadySoldError` (409). 2. Boundary Validation: Zod middleware validates request bodies before invoking use cases; returns 422 with structured field errors. 3. Global Exception Handler: Intercepts all uncaught errors, emits structured JSON log with correlation ID to CloudWatch, and returns sanitized RFC 7807 response to caller.',
      tradeoffDefense: 'We gain bulletproof security (zero leaked credentials) and predictable client error ergonomics at the sacrifice of writing explicit schema validation for every inbound endpoint.',
      diagramOrPattern: 'Incoming HTTP -> [Zod Middleware (422)] -> UseCase (throws DomainError) -> [Global Error Handler] -> RFC 7807 JSON'
    }
  },

  'app-arch-uml': {
    scenarioTitle: 'Documenting Asynchronous Distributed Vehicle Reservations',
    businessContext: 'An enterprise automotive client\'s development teams in India, Europe, and the US are building the new Vehicle Reservation and Payment engine. Misunderstandings regarding asynchronous message timing and timeout compensations have caused 3 failed sprint integration tests.',
    architecturalProblem: 'Author unambiguous UML 2.5 models documenting the asynchronous reservation sequence and the vehicle state lifecycle to align the distributed engineering squads.',
    technicalConstraints: [
      'Must depict asynchronous messaging, token-bucket rate limiting, and Stripe webhook reconciliation',
      'Must clearly show timeout compensation when user abandons cart after 10 minutes',
      'Must follow formal UML 2.5 specification standards'
    ],
    taskQuestions: [
      'Walk through the exact participants, lifelines, and asynchronous messages (`->>`) in your UML Sequence Diagram.',
      'How do you model the 10-minute cart expiration timer in a UML State Machine diagram?',
      'Why are informal whiteboards insufficient for documenting distributed concurrency protocols?'
    ],
    evaluationRubric: [
      {
        criterion: 'UML 2.5 Sequence Diagram Precision',
        weight: '40%',
        targetStandard: 'Accurately uses asynchronous message arrows, activation bars, `par` (parallel) and `alt` (alternative) fragments, and callback loops.'
      },
      {
        criterion: 'State Machine Lifecycle Rigor',
        weight: '35%',
        targetStandard: 'Models formal states (`Available`, `ReservedPendingPayment`, `Sold`, `ReleasedToPool`) with explicit guards (`[inventory > 0]`) and timed transitions (`after(10 min)`).'
      },
      {
        criterion: 'Multi-Team Architectural Alignment',
        weight: '25%',
        targetStandard: 'Uses PlantUML/Mermaid in Git repositories, enabling code review and version control alongside implementation code.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Eliminate distributed team ambiguity by publishing version-controlled PlantUML Sequence and State Machine diagrams documenting asynchronous reservation tokens, Stripe webhooks, and 10-minute TTL compensations.',
      technicalApproach: '1. Sequence Diagram: Shows Client -> APIGW -> ReservationWorker -> Redis Lua (`hold:vin`) -> Stripe Checkout. Shows asynchronous Stripe webhook invoking Saga Orchestrator to commit sale to DynamoDB. 2. State Machine: Vehicle starts in `Available`. Transition to `Reserved` guarded by `[hold acquired]`. Timed transition: `after(10 mins) / releaseHold()` returns vehicle to `Available`. 3. Maintain diagrams in git repository as `.puml` files.',
      tradeoffDefense: 'We invest upfront design time authoring formal UML models in exchange for eliminating weeks of cross-team integration rework and preventing double-booking bugs.',
      diagramOrPattern: 'State Diagram: [*] -> Available -> [Reserve Clicked] -> ReservedPendingPayment -> [after 10m] -> Available | [Paid] -> Sold'
    }
  },

  'app-arch-databases': {
    scenarioTitle: 'Single-Table DynamoDB Modeling for Automotive Megastore',
    businessContext: 'Cox Automotive requires storing 45 million active vehicle listings across 10,000 dealerships, alongside vehicle inspection histories, KBB appraisal logs, and dealer subscription tiers. The database must sustain 2,500 writes/sec and 5,000 reads/sec with single-digit millisecond latency.',
    architecturalProblem: 'Design the complete Amazon DynamoDB Single-Table schema. Define the Partition Key (PK), Sort Key (SK), Global Secondary Indexes (GSIs), and entity item collections to satisfy 5 critical business access patterns without relational joins.',
    technicalConstraints: [
      'Access Pattern 1: Get Dealer metadata by DealerID',
      'Access Pattern 2: Get all Vehicles for a Dealer sorted by listing date',
      'Access Pattern 3: Get Vehicle by VIN with all its historical appraisals in one query',
      'Access Pattern 4: Query all active vehicles by State and Price range',
      'Must prevent hot partition throttling under 2,500 RPS'
    ],
    taskQuestions: [
      'How do you model compound partition and sort keys to satisfy Access Patterns 1, 2, and 3 in a single table?',
      'How do you design GSI1 to allow faceted queries by State and Price range?',
      'Why is Single-Table design superior to Multi-Table design in this high-throughput scenario?'
    ],
    evaluationRubric: [
      {
        criterion: 'Single-Table Key Modeling Rigor',
        weight: '40%',
        targetStandard: 'Defines overloaded PK/SK: Dealer entity (PK: `DEALER#<id>`, SK: `METADATA`); Vehicle entity (PK: `DEALER#<id>`, SK: `VEHICLE#<vin>`); Appraisal entity (PK: `VEHICLE#<vin>`, SK: `VALUATION#<timestamp>`).'
      },
      {
        criterion: 'GSI Index Sizing & Overloading',
        weight: '35%',
        targetStandard: 'Designs GSI1: PK `STATE#<state>`, SK `PRICE#<price>` for geographic price queries, projecting minimal attributes to control write costs.'
      },
      {
        criterion: 'Hot Partition & Throttling Mitigation',
        weight: '25%',
        targetStandard: 'Uses high-cardinality dealer and VIN IDs as partition hashes, avoiding monotonic timestamps or static status flags as partition keys.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Model a Single-Table DynamoDB schema utilizing compound overloaded partition keys, sort key hierarchies, and a sparse Global Secondary Index (GSI1) to satisfy all 5 access patterns in single-digit millisecond O(1) queries.',
      technicalApproach: '1. Dealer & Vehicles: Stored in Dealer item collection. PK: `DEALER#<dealerId>`. For dealer metadata, SK: `METADATA`. For vehicles, SK: `VEHICLE#<vin>#DATE#<date>`. Pattern 2 satisfied via `Query(PK=DEALER#id, SK begins_with "VEHICLE#")`. 2. Vehicle & Appraisals: Stored in Vehicle item collection. PK: `VEHICLE#<vin>`, SK: `APPRAISAL#<timestamp>`. 3. Faceted Search: GSI1PK: `STATE#<state>`, GSI1SK: `PRICE#<padded_price>`. Allows querying all cars in "GA" between $20k and $30k using `between` operator.',
      tradeoffDefense: 'We gain sub-5ms predictable query performance and zero connection overhead at the sacrifice of query inflexibility: every new business query requires planning and potential GSI additions.',
      diagramOrPattern: 'Table: PK: DEALER#101 | SK: METADATA | PK: DEALER#101 | SK: VEHICLE#VIN123 | GSI1PK: STATE#GA | GSI1SK: PRICE#025000'
    }
  },

  'cloud-design-patterns': {
    scenarioTitle: 'Mitigating Cache Stampedes and Thundering Herds',
    businessContext: 'At 10:00 AM on Saturday, an automotive dealer group launches a nationwide TV advertising campaign offering $5,000 cash back on electric SUVs. Within 3 seconds, 50,000 concurrent consumers query the vehicle search catalog. The Redis cache key expires, and 50,000 requests hit the primary database simultaneously, causing a total database crash.',
    architecturalProblem: 'Diagnose the cache stampede (thundering herd) failure mode and redesign the caching layer using battle-tested cloud design patterns to guarantee high availability during viral traffic spikes.',
    technicalConstraints: [
      'Peak read traffic: 50,000 concurrent requests within a 10-second burst window',
      'Primary database maximum safe connection limit: 200 connections',
      'Vehicle inventory changes must be reflected within 60 seconds'
    ],
    taskQuestions: [
      'What is the difference between Cache-Aside and Write-Through caching under heavy traffic surges?',
      'How do Probabilistic Early Expiration (XFetch algorithm) and Mutual Exclusion (Mutex locking) prevent cache stampedes?',
      'How does Adding Jitter to TTLs protect distributed cache infrastructure?'
    ],
    evaluationRubric: [
      {
        criterion: 'Cache Stampede Root Cause Diagnosis',
        weight: '40%',
        targetStandard: 'Explains how synchronous key expiration under high concurrency triggers simultaneous cache misses, exhausting database threads.'
      },
      {
        criterion: 'Advanced Stampede Mitigation Patterns',
        weight: '35%',
        targetStandard: 'Implements Mutex Lock on cache miss (only 1 thread queries DB; others wait/retry) or Probabilistic Early Expiration (XFetch algorithm).'
      },
      {
        criterion: 'TTL Jitter & Resiliency',
        weight: '25%',
        targetStandard: 'Applies randomized TTL jitter (`TTL = baseTTL + random(0, 60s)`) preventing synchronized mass expirations.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Eliminate cache stampedes by combining Redis Distributed Mutex locking on cache miss with Probabilistic Early Expiration (XFetch) and randomized TTL jitter, shielding the primary database completely.',
      technicalApproach: '1. On cache miss, worker attempts to acquire Redis distributed lock: `SET lock:catalog:ev_suvs 1 NX EX 5`. 2. Winning thread queries database, updates Redis with TTL (300s + random jitter 1-60s), and releases lock. 3. Losing threads wait 50ms and re-check cache, receiving fresh data from winning thread without touching the database. 4. Implement XFetch: background worker asynchronously refreshes cache when probability threshold `delta * beta * ln(random()) > (expiry - now)` is met before actual key expiration.',
      tradeoffDefense: 'We gain total database protection during viral 50,000-user surges at the sacrifice of minor code complexity in implementing probabilistic cache refresh algorithms.',
      diagramOrPattern: '50k Requests -> Redis Miss -> [Mutex Lock NX] -> 1 Thread Queries DB -> 49,999 Threads Wait & Read from Cache'
    }
  },

  'cloud-migration': {
    scenarioTitle: 'Zero-Downtime Strangler Fig Migration of Legacy Inventory Monolith',
    businessContext: 'Cox Automotive must migrate its core vehicle catalog away from an aging on-premise mainframe Oracle cluster to AWS DynamoDB and ECS microservices. The business cannot tolerate a single second of maintenance downtime, and rollbacks must be instant if data drift occurs.',
    architecturalProblem: 'Architect the end-to-end zero-downtime migration strategy utilizing the Strangler Fig pattern, Change Data Capture (CDC), and bidirectional data synchronization.',
    technicalConstraints: [
      'Zero downtime during the 9-month migration window',
      'CDC replication lag between Oracle and AWS must remain < 1 second',
      'Traffic must be instantly reversible (rollback in < 30 seconds) via DNS/API Gateway'
    ],
    taskQuestions: [
      'Describe the 4 distinct phases of the Strangler Fig migration strategy.',
      'How do you prevent replication echo-loops when both Oracle and AWS write back to each other during dual-run?',
      'How do you prove 100% data parity between Oracle and DynamoDB prior to final cutover?'
    ],
    evaluationRubric: [
      {
        criterion: 'Strangler Fig Phased Execution',
        weight: '40%',
        targetStandard: 'Details 4 phases: 1. Intercept & Shadow Run, 2. Canary Read Cutover (10% -> 100%), 3. Write Cutover with Reverse CDC, 4. Monolith Decommission.'
      },
      {
        criterion: 'Replication Loop Prevention',
        weight: '35%',
        targetStandard: 'Injects origin metadata tags (`origin: aws-microservice`); CDC connectors filter out transactions matching their own origin ID to prevent infinite loops.'
      },
      {
        criterion: 'Automated Parity Auditing',
        weight: '25%',
        targetStandard: 'Deploys automated Athena/Glue reconciliation jobs comparing checksums across 45M records nightly, alerting on discrepancies.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Execute a phased Strangler Fig migration: deploy an API Gateway routing proxy in front of the monolith; stream Oracle mutations to DynamoDB using Debezium CDC; shift reads first via canaries; then shift writes with reverse CDC, verified by automated Athena data parity audits.',
      technicalApproach: '1. Phase 1: Deploy API Gateway proxy. Debezium streams Oracle transaction logs to Kafka -> ECS consumer updates DynamoDB. Oracle serves 100% live traffic. 2. Phase 2: Route 10% of read queries to AWS via Route 53 weighted routing; compare read responses. 3. Phase 3: Shift write traffic to AWS Ingest Worker; DynamoDB Streams publishes to reverse CDC worker updating legacy Oracle for reporting. Echo loops prevented via `x-origin` headers. 4. Phase 4: Decommission legacy Oracle tables after 30 days of zero parity errors.',
      tradeoffDefense: 'We accept running dual infrastructure and Kafka CDC pipelines for 6 months in exchange for guaranteed zero downtime and instantaneous 30-second rollback safety.',
      diagramOrPattern: 'Client -> API Gateway Proxy -> [Phase 2: Reads -> AWS (10%)] & [Phase 3: Writes -> AWS -> Reverse CDC -> Oracle]'
    }
  },

  'cloud-platforms': {
    scenarioTitle: 'Designing Multi-Region Active-Passive Disaster Recovery',
    businessContext: 'Cox Automotive\'s executive board mandates an enterprise business continuity upgrade: if AWS us-east-1 suffers a catastrophic regional outage, the vehicle syndication platform must resume full operations in us-west-2 within 15 minutes with zero lost pricing transactions (RPO = 0, RTO < 15 mins).',
    architecturalProblem: 'Design the multi-region Active-Passive Warm Standby architecture on AWS. Detail DNS failover, cross-region persistence replication, and in-flight message recovery.',
    technicalConstraints: [
      'Primary region: AWS us-east-1; Secondary standby: AWS us-west-2',
      'Recovery Point Objective (RPO) = 0 for pricing updates',
      'Recovery Time Objective (RTO) < 15 minutes',
      'Standby infrastructure cost cannot exceed 25% of primary production costs'
    ],
    taskQuestions: [
      'How does DynamoDB Global Tables maintain cross-region replication and what is the typical replication lag?',
      'How do you configure Route 53 health checks and DNS failover without false-alarm flapping?',
      'What happens to in-flight SQS messages trapped in us-east-1 during a sudden regional power failure?'
    ],
    evaluationRubric: [
      {
        criterion: 'Cross-Region Data Replication Strategy',
        weight: '40%',
        targetStandard: 'Selects DynamoDB Global Tables with multi-region active replication; quantifies sub-second replication latency and addresses conflict resolution (Last-Writer-Wins).'
      },
      {
        criterion: 'DNS Failover & Route 53 Health Checks',
        weight: '35%',
        targetStandard: 'Configures Route 53 Failover Routing Policy with inverted health checks, 3 consecutive failure thresholds, and CloudWatch metric alarm triggers.'
      },
      {
        criterion: 'RPO=0 Trapped Message Mitigation',
        weight: '25%',
        targetStandard: 'Explains dealer client retry contracts: unacknowledged HTTP requests are retried against secondary region endpoint, satisfying RPO=0.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Implement an Active-Passive Warm Standby architecture: replicate data bidirectionally via DynamoDB Global Tables; run a minimal 2-task ECS Fargate cluster in us-west-2; automate DNS failover in Route 53, recovering in under 8 minutes.',
      technicalApproach: '1. Data Tier: DynamoDB Global Tables replicates mutations to us-west-2 in < 1 second. 2. Compute Tier: Standby us-west-2 runs minimal baseline (2 Fargate tasks) to keep costs low (<20%). 3. Route 53: Configured with primary/secondary failover routing and HTTPS health checks (10-second interval, 3 consecutive failures = failover in 30s). 4. Upon failover, ECS target tracking auto-scales tasks to 40 instances in 4 minutes. 5. In-flight messages: Unacknowledged dealer batches are retransmitted to secondary region by dealer client retry logic.',
      tradeoffDefense: 'We gain a guaranteed 8-minute RTO and compliance with disaster recovery mandates at the sacrifice of paying 20% baseline warm standby costs and cross-region DynamoDB replication fees.',
      diagramOrPattern: 'Route 53 DNS -> [Primary us-east-1 (Active)] ===Global Tables===> [Secondary us-west-2 (Warm Standby)]'
    }
  },

  'lead-english': {
    scenarioTitle: 'Live 90-Second Architectural Justification to English Committee',
    businessContext: 'In the official EPAM B1 assessment, Committee Chair Dmitry interrupts your presentation: "You chose asynchronous messaging with SQS instead of standard REST APIs. Our client wants instant synchronous feedback. Convince me in 90 seconds why your choice is superior, explain what trade-offs you made, and use a plain-English analogy."',
    architecturalProblem: 'Deliver a structured, highly articulate spoken defense adhering to EPAM NAT B2/C1 English standards. The defense must feature an analogy, explicit trade-offs, and quantified metrics without hesitation or filler words.',
    technicalConstraints: [
      'Time limit: Exactly 60 to 90 seconds',
      'Mandatory elements: 1. Plain-English analogy, 2. Gain vs. Sacrifice trade-off, 3. Quantified metrics (2,500 RPS, sub-150ms)',
      'Language standard: Formal architectural English, precise technical vocabulary, zero filler words'
    ],
    taskQuestions: [
      'Deliver your spoken defense aloud to the committee.',
      'How do you structure your answer so the committee hears the conclusion first (Pyramid Principle)?',
      'How do you handle a sharp follow-up challenge without becoming defensive?'
    ],
    evaluationRubric: [
      {
        criterion: 'CEFR B2/C1 Fluency & Structure',
        weight: '40%',
        targetStandard: 'Delivers a fluid, structured response using discourse markers ("First", "Consequently", "In trade-off") without prolonged pauses.'
      },
      {
        criterion: 'Analogy & Conceptual Clarity',
        weight: '35%',
        targetStandard: 'Uses a vivid, non-technical analogy (e.g. coffee shop ticketing system) that instantly clarifies why synchronous coupling causes terminal gridlock.'
      },
      {
        criterion: 'Architectural Substance & Trade-Offs',
        weight: '25%',
        targetStandard: 'Cites 2,500 RPS peak, 80ms response time, and explicitly defends eventual consistency as a calculated sacrifice.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Deliver the 3-part verbatim defense: state the business justification first, explain the coffee shop ticketing analogy, cite the 2,500 RPS scaling metrics, and explicitly defend the trade-off.',
      technicalApproach: 'Spoken Script: "Dmitry, we chose asynchronous SQS ingestion because coupling our ingestion rate directly to database write capacity would cause catastrophic system failure during morning traffic surges. Think of a busy Starbucks: if the cashier had to personally roast the coffee beans before serving the next customer, the line would wrap around the block. By issuing a receipt—an HTTP 202 Accepted—the cashier takes orders in 50 milliseconds, while the baristas brew coffee at a steady, sustainable rate. In our Cox Automotive architecture, SQS buffers up to 2,500 updates per second, decoupling our ingress from database write IOPS. What we gain is 99.95% availability and sub-80ms client acknowledgment; what we sacrifice is a 2-second eventual consistency window, which is entirely acceptable for vehicle catalog syndication."',
      tradeoffDefense: 'This defense directly addresses the business objection, demonstrates architectural maturity, and provides clear quantitative justification.',
      diagramOrPattern: 'Verbatim Spoken Structure: Thesis -> Analogy (Starbucks Ticket) -> Metrics (2,500 RPS / 80ms) -> Gain vs Sacrifice'
    }
  },

  'lead-consultancy': {
    scenarioTitle: 'Steering an Executive Client Away from Inappropriate Blockchain Stack',
    businessContext: 'The Chief Innovation Officer of an automotive client insists on storing vehicle title histories and odometer readings on a public Hyperledger/Ethereum blockchain, claiming "it provides immutable decentralized trust." However, the project budget is $400k, the deadline is 6 months, and expected transaction throughput is 1,500 updates/second.',
    architecturalProblem: 'As the EPAM Lead Architect, deliver consultative pushback. Steer the client toward a pragmatically architected solution (AWS Quantum Ledger Database or cryptographic hash chaining in DynamoDB) without insulting their leadership.',
    technicalConstraints: [
      'Throughput requirement: 1,500 transactions/second',
      'Budget: $400,000 total implementation cost',
      'Must guarantee cryptographic tamper-evident audit history for odometer records'
    ],
    taskQuestions: [
      'How do you tactfully challenge an executive\'s buzzword-driven technology mandate without damaging the client relationship?',
      'What quantitative metrics (throughput, gas fees, latency) do you present to demonstrate blockchain\'s infeasibility?',
      'What pragmatic architectural alternative delivers the required immutability at 10% of the cost and complexity?'
    ],
    evaluationRubric: [
      {
        criterion: 'Consultative EQ & Diplomatic Pushback',
        weight: '40%',
        targetStandard: 'Validates the client\'s underlying business objective (tamper-evident vehicle history) while exposing the technical and financial mismatch of blockchain.'
      },
      {
        criterion: 'Quantitative Commercial Comparison',
        weight: '35%',
        targetStandard: 'Compares throughput limits (Ethereum 15 TPS vs required 1,500 TPS) and operating expenses ($400k budget exhausted in 3 months of node operations).'
      },
      {
        criterion: 'Viable Architectural Alternative',
        weight: '25%',
        targetStandard: 'Proposes AWS QLDB or SHA-256 Merkle tree hash chaining on DynamoDB Streams, delivering cryptographic immutability at sub-5ms latency.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Lead with consultative alignment: validate the executive\'s vision of cryptographic fraud prevention, demonstrate through latency and cost models why public blockchain collapses under 1,500 TPS, and recommend cryptographic hash chaining in DynamoDB.',
      technicalApproach: '1. Meeting Framing: "We share your vision of eliminating odometer fraud with verifiable cryptographic proof." 2. Objective Data: Present technical comparison matrix showing blockchain throughput ceiling (50 TPS max) vs required 1,500 TPS, alongside 15-minute transaction confirmation latency. 3. Propose Alternative: Implement cryptographic Merkle tree hash chaining on committed DynamoDB vehicle records via DynamoDB Streams. Each record stores `previous_hash` and `current_hash` signed by AWS KMS. Delivers mathematical tamper-evidence in 4ms at 1% of the cost.',
      tradeoffDefense: 'We gain cryptographic auditability and 1,500 TPS throughput within budget at the sacrifice of decentralized multi-party mining consensus that an internal automotive platform does not require.',
      diagramOrPattern: 'Vehicle Mutation -> DynamoDB -> Streams -> KMS Signing -> Cryptographic Merkle Ledger (4ms, zero blockchain gas)'
    }
  },

  'lead-ownership': {
    scenarioTitle: 'Leading Production Outage Escalation and Post-Mortem',
    businessContext: 'On Friday at 17:30 PM, after a junior engineer deployed a routine indexing change, 30% of incoming dealer feed requests begin returning HTTP 500 errors. Dealers are unable to update prices for weekend sales events, and the account executive reports that the dealership group\'s COO is on the phone demanding immediate resolution.',
    architecturalProblem: 'Take full end-to-end architectural ownership of the crisis: lead the triage call, isolate the faulty container revision, execute a clean rollback, and author a comprehensive blameless post-mortem with systemic preventive actions.',
    technicalConstraints: [
      'Must restore production traffic in < 15 minutes',
      'Must preserve log forensics to determine the exact code defect',
      'Must deliver a formal blameless post-mortem report within 48 hours'
    ],
    taskQuestions: [
      'How do you manage communication on the incident bridge while simultaneously directing technical remediation?',
      'What rollback versus roll-forward heuristics guide your decision during an active outage?',
      'How do you structure the blameless post-mortem to prevent recurrence without blaming the junior engineer?'
    ],
    evaluationRubric: [
      {
        criterion: 'Crisis Leadership & Incident Command',
        weight: '40%',
        targetStandard: 'Applies Incident Commander framework: designates a communications lead, orders an immediate CodeDeploy rollback, and freezes changes.'
      },
      {
        criterion: 'Technical Root Cause Forensics',
        weight: '35%',
        targetStandard: 'Isolates the defect (e.g. unhandled null pointer on optional dealer metadata attribute) from CloudWatch logs while rolling back traffic.'
      },
      {
        criterion: 'Blameless Post-Mortem Rigor',
        weight: '25%',
        targetStandard: 'Identifies systemic gaps: missing canary deployment gate, missing schema validation test, and inadequate integration test coverage.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Demonstrate extreme ownership: assume Incident Commander role, execute immediate CodeDeploy rollback restoring service in 6 minutes, and author a blameless post-mortem implementing 3 systemic automated CI/CD guardrails.',
      technicalApproach: '1. Incident Response: Join bridge, establish calm command. Direct immediate ECS deployment rollback to stable revision `rev-142` (restored in 6 minutes). 2. Forensics: Retain crashing container logs in Datadog. 3. Root Cause: Junior engineer\'s PR lacked null check for legacy dealer feeds missing the `vin_prefix` field. 4. Post-Mortem Action Items: (a) Add Zod schema validation rejecting missing fields at edge; (b) Mandate automated canary deployment with 5xx metric alarms; (c) Update CI pipeline to run synthetic dealer payload tests on all future PRs.',
      tradeoffDefense: 'We take full responsibility for the systemic review failure rather than blaming an individual, building team psychological safety and engineering resilience.',
      diagramOrPattern: 'Incident Detected (17:30) -> IC Assigned -> Rollback Triggered (17:32) -> Restored (17:36) -> Post-Mortem & CI Guards'
    }
  },

  'lead-leadership': {
    scenarioTitle: 'Aligning Two Feuding Senior Tech Leads on Database Architecture',
    businessContext: 'On a high-stakes automotive project, two respected Senior Lead Engineers are locked in a bitter architectural dispute: Lead A insists on deploying Apache Cassandra for the vehicle catalog, while Lead B insists on Amazon DynamoDB. The disagreement has stalled development for 3 weeks, and team morale is plummeting.',
    architecturalProblem: 'Exercise architectural leadership without authority. Resolve the conflict objectively, re-engage both engineers constructively, and establish architectural consensus.',
    technicalConstraints: [
      'Must reach consensus within 5 business days to avoid missing client sprint commitments',
      'Solution must be maintainable by the existing engineering squad',
      'Decision must align with enterprise AWS cloud infrastructure standards'
    ],
    taskQuestions: [
      'How do you de-escalate emotional technical debates between senior engineers?',
      'How do you construct a Weighted Decision Matrix to evaluate Cassandra vs DynamoDB objectively?',
      'How do you secure genuine buy-in from the losing engineer so they do not passively sabotage the project?'
    ],
    evaluationRubric: [
      {
        criterion: 'Conflict Resolution & Influence Without Authority',
        weight: '40%',
        targetStandard: 'Depersonalizes the debate: reframes the decision around client business drivers, operational maintenance costs, and team operational capability.'
      },
      {
        criterion: 'Objective Trade-Off Framework',
        weight: '35%',
        targetStandard: 'Facilitates a joint evaluation matrix comparing Cassandra (self-hosted node management, cluster rebalancing, JVM GC tuning) vs DynamoDB (fully managed, serverless, native IAM).'
      },
      {
        criterion: 'Consensus Building & Role Delegation',
        weight: '25%',
        targetStandard: 'Assigns the winning engineer ownership of schema design while empowering the other engineer to lead the caching and search tier architecture.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Lead through objective trade-off arbitration: facilitate a joint evaluation workshop using a weighted decision matrix, focus on operational Total Cost of Ownership (TCO), and unite both leads behind a consensus decision.',
      technicalApproach: '1. One-on-One Alignment: Meet individually with Lead A and Lead B to acknowledge their technical expertise and surface underlying concerns. 2. Joint Workshop: Construct a 6-factor matrix: Throughput (20%), Query Latency (20%), Operational Maintenance (30%), Cloud Native Integration (15%), Licensing Cost (15%). 3. Result: DynamoDB wins 8.6 to 6.2 due to zero Cassandra cluster maintenance overhead on AWS. 4. Empower Lead A: Appoint Lead A to architect the critical Redis caching and OpenSearch search sync layer, ensuring full ownership and engagement.',
      tradeoffDefense: 'We invest 3 days in structured consensus arbitration in exchange for 100% squad unity, high morale, and eliminating weeks of passive resistance.',
      diagramOrPattern: 'Conflict -> 1-on-1 Alignment -> Weighted Decision Matrix -> Consensus -> Role Re-empowerment'
    }
  },

  'lead-communication': {
    scenarioTitle: 'Explaining Eventual Consistency to a Non-Technical Chief Financial Officer',
    businessContext: 'During an executive steering committee review, the Chief Financial Officer (CFO) looks at your Solution Architecture Document and reacts with alarm: "You have written here that our vehicle pricing is \'eventually consistent\'. Does that mean our prices are wrong? Are we selling cars for the wrong amounts? I cannot sign off on an unreliable accounting system!"',
    architecturalProblem: 'Explain the concept of Eventual Consistency to the non-technical CFO in under 2 minutes. Reassure them regarding financial integrity, clarify why strong consistency across 50,000 dealers would cripple the business, and secure their formal budget approval.',
    technicalConstraints: [
      'CFO has zero computer science or database knowledge',
      'Must explain why eventual consistency does not cause financial or legal fraud',
      'Time limit: 2 minutes in an executive boardroom setting'
    ],
    taskQuestions: [
      'What plain-English analogy do you use to explain eventual consistency to a financial officer?',
      'How do you distinguish between consumer search catalog eventual consistency and atomic financial checkout consistency?',
      'How do you conclude with a clear commercial justification that appeals to the CFO\'s priorities?'
    ],
    evaluationRubric: [
      {
        criterion: 'Executive Metaphor & Plain-English Translation',
        weight: '40%',
        targetStandard: 'Uses a financial banking analogy (e.g. pending credit card transactions vs monthly statement balance) that instantly resonates with a CFO.'
      },
      {
        criterion: 'Financial Integrity Reassurance',
        weight: '35%',
        targetStandard: 'Clarifies the two-tier consistency model: search browse is eventually consistent (2-second lag), but the actual purchase checkout is strictly atomic (100% ACID).'
      },
      {
        criterion: 'Commercial Value Framing',
        weight: '25%',
        targetStandard: 'Explains that demanding global instantaneous consistency on catalog browsing would multiply cloud infrastructure costs by 5x with zero revenue gain.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Reassure the CFO using a banking ledger analogy: explain that catalog browsing is like pending credit card notifications (updating within 2 seconds to keep servers fast and cheap), while actual vehicle sales checkouts use strict, ironclad atomic locking guaranteeing zero financial discrepancy.',
      technicalApproach: 'Executive Boardroom Script: "I completely understand your concern, and I can assure you that our financial ledgers are 100% accurate down to the cent. Think of your personal credit card: when you tap your card at a coffee shop, you immediately see a pending alert on your phone, while the master bank ledger settles cleanly overnight. We use that exact same two-tier approach. When a dealership drops a vehicle price from $30,000 to $28,000, our public search catalog updates within two seconds—this is the \'eventual consistency\' that lets us handle 50,000 shoppers simultaneously without our cloud servers crashing. However, the moment a buyer clicks \'Reserve Car\' and submits payment, our system instantly switches to strict bank-vault locking. Two buyers can never buy the same vehicle, and the purchase price is locked atomically. By allowing browsing to update in two seconds rather than milliseconds, we save the company $180,000 a year in unnecessary cloud database fees."',
      tradeoffDefense: 'We translate a complex distributed systems concept into financial terms, defusing executive fear and establishing strong business credibility.',
      diagramOrPattern: 'CFO Metaphor: Browsing Catalog = Pending App Alert (2s) | Checkout Purchase = Bank Vault Atomic Settlement ($0 Error)'
    }
  },

  'lead-adaptability': {
    scenarioTitle: 'Handling Abrupt Vendor API Deprecation 3 Weeks Before Launch',
    businessContext: 'Three weeks prior to production release, Cox Automotive\'s primary vehicle history provider (e.g. Carfax/AutoCheck) abruptly announces an emergency API deprecation, terminating their real-time WebSocket stream and replacing it with a rate-limited REST batch export (max 10 requests/minute, 500 records/batch).',
    architecturalProblem: 'Your entire ingestion pipeline was designed around real-time streaming WebSockets. Adapt the architecture to the vendor\'s new rate-limited batch paradigm in 48 hours without slipping the production launch date.',
    technicalConstraints: [
      'Launch date cannot slip by more than 7 days',
      'Vendor rate limit: Maximum 10 requests per minute',
      'Must continue processing 50,000 vehicle history checks per hour'
    ],
    taskQuestions: [
      'How do you pivot the ingestion adapter architecture from push-based WebSockets to pull-based scheduled batching?',
      'How do you implement rate-limited queue consumers using Amazon SQS and EventBridge Scheduler?',
      'How do you manage client expectations and team morale during an unexpected crisis pivot?'
    ],
    evaluationRubric: [
      {
        criterion: 'Architectural Agility & Decoupling',
        weight: '40%',
        targetStandard: 'Demonstrates how Hexagonal Architecture and Port/Adapter boundaries allowed swapping the WebSocket adapter for an SQS batch adapter without touching domain logic.'
      },
      {
        criterion: 'Rate-Limited Ingestion Topology',
        weight: '35%',
        targetStandard: 'Architects an EventBridge Scheduler polling worker combined with SQS FIFO message grouping to enforce the vendor\'s 10 req/min limit strictly.'
      },
      {
        criterion: 'Leadership Composure Under Churn',
        weight: '25%',
        targetStandard: 'Shows emotional resilience, rapidly reallocates sprint backlog tasks, and communicates a transparent 48-hour recovery plan to stakeholders.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Leverage our Hexagonal Architecture boundaries: replace the deprecated WebSocket inbound adapter with a scheduled SQS batch-polling adapter in 48 hours, fully respecting the vendor\'s 10 req/min rate limit while keeping the launch on schedule.',
      technicalApproach: '1. Boundary Isolation: Because our core domain logic was isolated behind the `VehicleHistoryPort`, zero business logic required changes. 2. Implement Batch Adapter: Deploy Amazon EventBridge Scheduler triggering an AWS Lambda function every 6 seconds (10 req/min). 3. Lambda polls vendor batch endpoint, receives 500 records, and fans out items to SQS. 4. Downstream stream processing workers consume SQS messages at normal velocity. 5. Launch date maintained with zero partner disruption.',
      tradeoffDefense: 'We gain seamless survival of an external vendor pivot and zero launch delay at the sacrifice of vehicle history updates arriving in 6-minute batch windows rather than real-time sub-second streams.',
      diagramOrPattern: 'Pivot: EventBridge (Every 6s) -> Lambda Batch Pull -> SQS Queue -> Stream Processing (Domain untouched)'
    }
  },

  'lead-business-acumen': {
    scenarioTitle: 'Reducing Cloud Spend on Multi-Terabyte Vehicle Media Storage',
    businessContext: 'Cox Automotive\'s AWS cloud bill has skyrocketed to $85,000/month. The CFO issues a mandate: cut monthly cloud infrastructure spend by $30,000 within 60 days. Architectural inspection reveals that un-optimized high-resolution dealer vehicle photos (50 million images in Amazon S3) and over-provisioned DynamoDB tables account for 65% of the total bill.',
    architecturalProblem: 'Design and execute a FinOps cloud cost optimization program to permanently eliminate $30,000/month in cloud waste without degrading image load performance or catalog availability.',
    technicalConstraints: [
      'Must achieve >= $30,000/month savings within 60 days',
      'Consumer vehicle image load latency must remain < 50ms at edge',
      'Zero downtime or data loss during storage tiering migrations'
    ],
    taskQuestions: [
      'How do you optimize 50 million images in S3 using S3 Lifecycle policies, Intelligent-Tiering, and WebP compression?',
      'How do you optimize DynamoDB costs between Provisioned Capacity with Auto-Scaling vs On-Demand capacity?',
      'How do you establish continuous FinOps governance so cloud costs do not creep back up next year?'
    ],
    evaluationRubric: [
      {
        criterion: 'FinOps Storage Optimization',
        weight: '40%',
        targetStandard: 'Applies S3 Intelligent-Tiering, transition rules to Glacier Instant Retrieval after 90 days, and on-the-fly Sharp/Lambda WebP image compression.'
      },
      {
        criterion: 'Database Capacity FinOps Tuning',
        weight: '35%',
        targetStandard: 'Analyzes DynamoDB usage curves: switches predictable baseline tables to Provisioned with 1-Year Savings Plans / Reserved Capacity, saving 55%.'
      },
      {
        criterion: 'Commercial Impact Presentation',
        weight: '25%',
        targetStandard: 'Presents concrete financial numbers: $18k saved on S3 + $14k saved on DynamoDB = $32,000/month net savings ($384k/year).'
      }
    ],
    modelSolution: {
      executiveSummary: 'Execute a comprehensive FinOps optimization: migrate 50M photos to S3 Intelligent-Tiering with automated WebP compression, purchase DynamoDB Reserved Capacity for baseline tables, and save $32,000/month within 45 days.',
      technicalApproach: '1. S3 Optimization: Enable S3 Intelligent-Tiering on vehicle image buckets ($11k/mo savings); configure on-the-fly CloudFront WebP compression via Lambda@Edge, reducing image payload sizes by 65% ($7k/mo egress savings). 2. DynamoDB Optimization: Analyze CloudWatch metrics; switch stable core catalog tables from On-Demand to Provisioned Capacity with 1-Year Reserved Capacity commitments ($14k/mo savings). 3. FinOps Governance: Implement AWS Cost Anomaly Detection alerting squad leads if daily spend increases by > 10%. Total verified savings: $32,000/month.',
      tradeoffDefense: 'We gain $384,000 in annual bottom-line savings and faster image load times at the sacrifice of committing to 1-year reserved database capacity.',
      diagramOrPattern: 'Cost Optimization: S3 Intelligent-Tiering ($18k/mo) + DynamoDB Reserved Capacity ($14k/mo) = $32k/mo Net Savings'
    }
  },

  'lead-team-player': {
    scenarioTitle: 'Unblocking a Stalled Sprint Delivery as Lead Architect',
    businessContext: 'During the final sprint before a major dealer syndication milestone, the lead backend developer falls seriously ill with COVID-19. The remaining team consists of two junior engineers who are terrified of touching the complex DynamoDB ConditionExpression transaction code, and the sprint is at risk of complete failure.',
    architecturalProblem: 'As the Software Architect, step down from high-level diagramming into the trenches: pair with the junior engineers, unblock the implementation, and guide the squad across the finish line with high psychological safety.',
    technicalConstraints: [
      'Sprint ends in 4 days with a firm client demonstration deadline',
      'The transaction logic must prevent vehicle overselling under concurrent requests',
      'Junior engineers must understand and maintain the code after the sprint'
    ],
    taskQuestions: [
      'How do you balance high-level architectural oversight with hands-on coding during a crisis?',
      'How do you conduct effective Pair Programming that teaches the junior engineers rather than just doing it for them?',
      'How do you protect team psychological safety and prevent burnout during sprint crunches?'
    ],
    evaluationRubric: [
      {
        criterion: 'Servant Leadership & Hands-On Enablement',
        weight: '40%',
        targetStandard: 'Demonstrates humility and practical technical craft: rolls up sleeves to pair program without being condescending.'
      },
      {
        criterion: 'Knowledge Transfer & Mentoring',
        weight: '35%',
        targetStandard: 'Uses Driver-Navigator pair programming technique, allowing junior engineers to type code while the architect guides edge-case logic.'
      },
      {
        criterion: 'Psychological Safety & Delivery Focus',
        weight: '25%',
        targetStandard: 'Builds automated test harnesses with the squad, turning an intimidating task into small, manageable, confidence-building steps.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Practice servant architecture: step into the squad as pair-programming navigator, write comprehensive unit test fixtures to eliminate fear, guide the junior engineers to implement the transaction logic, and deliver the milestone on time.',
      technicalApproach: '1. Establish Psychological Safety: Convene a brief morning huddle: "We are in this together; no one is blamed for missed deadlines." 2. Build Safety Nets: Write 15 Jest unit test boundary cases verifying the expected DynamoDB ConditionExpression behavior. 3. Driver-Navigator Pairing: Pair with Junior Engineer A for 3 hours using Driver-Navigator model (engineer types, architect navigates). 4. Code Review: Celebrate the junior engineers\' success in the squad Slack channel. 5. Milestone delivered on time with 100% test pass rate.',
      tradeoffDefense: 'We trade 12 hours of the architect\'s high-level strategy time in exchange for unblocking a critical client milestone and upskilling two engineers permanently.',
      diagramOrPattern: 'Crisis -> Architect Joins Squad -> Write Test Harness -> Pair Program -> Junior Engineers Deliver'
    }
  },

  'lead-dev-others': {
    scenarioTitle: 'Mentoring a Senior Engineer Toward Their First B1 Architecture Assessment',
    businessContext: 'Alex, a talented Senior Software Engineer with 6 years of hands-on delivery experience at EPAM, aspires to pass the B1 Software Architect assessment. However, Alex is highly code-focused, struggles to communicate in plain-English analogies, and panics when asked to defend architectural trade-offs.',
    architecturalProblem: 'Design a structured 4-month mentorship roadmap to develop Alex from a code-centric senior developer into a confident, commercially astute EPAM B1 Software Architect.',
    technicalConstraints: [
      'Alex must be ready for the formal 90-minute Full Session assessment in 16 weeks',
      'Must master all 38 LevelUp competencies and author a compliant Solution Architecture Document (SAD)',
      'Must achieve confirmed B2 English architectural defense fluency'
    ],
    taskQuestions: [
      'How do you assess Alex\'s baseline competencies and identify critical LevelUp gap areas?',
      'How do you guide Alex through authoring their first real-world Solution Architecture Document (SAD)?',
      'How do you conduct mock assessment panels to build confidence and eliminate panic under committee cross-examination?'
    ],
    evaluationRubric: [
      {
        criterion: 'Structured Mentorship Framework',
        weight: '40%',
        targetStandard: 'Applies situational coaching: Month 1 (NFRs & C4 Modeling), Month 2 (ADRs & Distributed Systems), Month 3 (SAD Authoring), Month 4 (Mock Panels).'
      },
      {
        criterion: 'Mindset Shift: Code to Architecture',
        weight: '35%',
        targetStandard: 'Teaches Alex the Gain vs. Sacrifice trade-off framework and trains him to speak the 30-second verbatim defense formula.'
      },
      {
        criterion: 'Empathy & Constructive Feedback',
        weight: '25%',
        targetStandard: 'Provides actionable written feedback after mock reviews, celebrating incremental improvements in conciseness and composure.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Execute a 16-week mentorship curriculum: transition Alex from code syntax to systems trade-offs through weekly C4 modeling katas, guide him in authoring a production SAD, and conduct 3 simulated committee cross-examinations.',
      technicalApproach: '1. Month 1 (Foundations): Map Alex\'s skills against the 38 competencies. Practice translating code into C4 Level 2 Container diagrams. 2. Month 2 (Decision Making): Coach Alex to write 3 production ADRs on his active project, enforcing the "Rejected Alternatives" section. 3. Month 3 (Artifact Authoring): Review and refine Alex\'s SAD artifact, grilling him on NFR feasibility and RPO/RTO calculations. 4. Month 4 (Defense Simulation): Conduct bi-weekly 45-minute mock panels with senior architects, recording sessions and eliminating filler words. Result: Alex passes B1 Full Session with Distinction.',
      tradeoffDefense: 'We invest 2 hours of mentoring weekly in exchange for developing a newly certified Software Architect and expanding EPAM\'s architectural leadership bench.',
      diagramOrPattern: 'Mentorship Plan: Month 1 (C4/NFRs) -> Month 2 (ADRs) -> Month 3 (SAD Authoring) -> Month 4 (Mock Panels) => B1 Pass'
    }
  },

  'lead-managing-teamwork': {
    scenarioTitle: 'Orchestrating Multi-Squad Delivery with Contract-First APIs',
    businessContext: 'Cox Automotive initiates a major multi-tier platform rebuild involving 4 squads across 3 continents: Ingestion Squad (Atlanta), Core Valuation Squad (Krakow), and Consumer Portal Squad (Hyderabad). In the previous project, squads worked in silos and integration testing revealed 45 breaking schema incompatibilities, delaying launch by 4 months.',
    architecturalProblem: 'Design the cross-squad architecture and collaboration governance framework to enable all 4 distributed squads to develop, test, and deploy in parallel without breaking integration dependencies.',
    technicalConstraints: [
      'Squads work across a 10.5-hour time zone difference',
      'Zero integration blocking: frontend portal must develop features before backend APIs are deployed',
      'API schema breaking changes must be caught automatically in CI before pull request merges'
    ],
    taskQuestions: [
      'How does Contract-First API design (OpenAPI / AsyncAPI) eliminate cross-squad development blocking?',
      'How do you implement Consumer-Driven Contract Testing using Pact in the automated CI/CD pipeline?',
      'How do you structure cross-squad architectural governance without creating bureaucratic meeting fatigue?'
    ],
    evaluationRubric: [
      {
        criterion: 'Contract-First Architecture Design',
        weight: '40%',
        targetStandard: 'Mandates OpenAPI 3.1 and AsyncAPI specifications versioned in a centralized schema repository with automated Prism mock servers.'
      },
      {
        criterion: 'Consumer-Driven Contract Testing (Pact)',
        weight: '35%',
        targetStandard: 'Configures Pact Broker in CI: Consumer squads define expectations; Provider squads verify contracts on every build before merging.'
      },
      {
        criterion: 'Global Cross-Squad Governance',
        weight: '25%',
        targetStandard: 'Establishes weekly 30-minute Architecture Guild sync and automated GitHub Actions bot flagging breaking schema changes.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Implement a Contract-First governance model: establish a central schema repository with automated mock servers (Prism), enforce Consumer-Driven Contract Testing via Pact Broker in CI, and enable 100% parallel cross-squad development.',
      technicalApproach: '1. Contract-First Repository: All API schemas defined in OpenAPI and AsyncAPI before writing code. 2. Automated Mocking: CI spins up mock servers from schemas, allowing Hyderabad frontend developers to build UI components immediately against realistic endpoints. 3. Contract Testing: Krakow backend squads run Pact verifications against consumer expectations on every pull request. 4. Schema Governance: Breaking changes blocked automatically by `openapi-diff` in CI. 5. Result: 4 squads develop in parallel with zero integration delays.',
      tradeoffDefense: 'We invest upfront effort in schema authoring and contract tests in exchange for eliminating 4 months of cross-continent integration chaos and release freezes.',
      diagramOrPattern: 'Central Schema Repo -> [Prism Mocks for Frontend] & [Pact Contract Verification for Backend] -> Zero Merge Friction'
    }
  },

  'lead-dei': {
    scenarioTitle: 'Eliminating Systemic Usability and Accessibility Biases in Automotive Portals',
    businessContext: 'A major automotive syndication client faces a class-action accessibility lawsuit: their consumer car-buying portal fails WCAG 2.1 AA standards for visually impaired users. Furthermore, internal dealer survey analytics reveal that junior female sales reps in regional dealerships report significant software friction and exclusion in system feedback channels.',
    architecturalProblem: 'As the Lead Architect, establish an inclusive technical design governance program. Remediate the accessibility architecture to achieve WCAG 2.1 AA compliance and create inclusive feedback channels in engineering and product design.',
    technicalConstraints: [
      'Must achieve 100% WCAG 2.1 AA compliance across 25 consumer web routes within 90 days',
      'Must support screen readers (NVDA, VoiceOver), keyboard navigation, and high-contrast modes',
      'System design forums must guarantee equitable participation across all demographics'
    ],
    taskQuestions: [
      'How do you embed automated accessibility testing (Axe-core, Pa11y) into modern frontend CI/CD pipelines?',
      'How does cognitive diversity in architectural teams improve edge-case identification and software resiliency?',
      'What concrete mechanisms ensure psychological safety and equal voice in architectural design sessions?'
    ],
    evaluationRubric: [
      {
        criterion: 'Technical Accessibility Architecture (WCAG 2.1)',
        weight: '40%',
        targetStandard: 'Details semantic HTML5, ARIA landmark roles, color contrast ratios (>= 4.5:1), and automated Pa11y/Cypress-axe testing in CI.'
      },
      {
        criterion: 'Cognitive Diversity & Resiliency',
        weight: '35%',
        targetStandard: 'Articulates how diverse life experiences uncover critical non-functional edge cases (e.g. low-bandwidth rural connectivity, screen reader latency).'
      },
      {
        criterion: 'Inclusive Architectural Governance',
        weight: '25%',
        targetStandard: 'Implements anonymous RFC feedback windows, structured round-robin discussion cadences, and mentorship for underrepresented engineers.'
      }
    ],
    modelSolution: {
      executiveSummary: 'Embed Diversity, Equity, and Inclusion directly into the architectural fabric: automate WCAG 2.1 AA verification in CI with Cypress-axe, enforce accessible design tokens, and establish anonymous asynchronous RFC review cadences to foster cognitive diversity.',
      technicalApproach: '1. Automated Accessibility Gate: Add `cypress-axe` to frontend CI pipeline; fail builds if any WCAG 2.1 AA violation is detected. 2. Design System: Standardize accessible design tokens (contrast >= 4.5:1, focus indicators, keyboard traps eliminated). 3. Inclusive Governance: Restructure Architecture Review Board to include anonymous RFC commenting periods, preventing extroverted senior voices from dominating technical decisions. 4. Sponsor and mentor two underrepresented engineers into lead architecture roles.',
      tradeoffDefense: 'We gain legal compliance, 15% expanded consumer reach, and higher team innovation at the sacrifice of adhering to strict accessibility design system tokens.',
      diagramOrPattern: 'Inclusive Design: Accessible Design Tokens -> Cypress-Axe CI Gate (WCAG 2.1) -> Anonymous Asynchronous RFCs'
    }
  }
};
