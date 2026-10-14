import { LearningRoadmap } from '@/types';

export const LEARNING_ROADMAPS_DATA: Record<string, LearningRoadmap> = {
  'ai-genai-sdlc': {
    coreTheory: [
      'Prompt Engineering for deterministic code generation (few-shot prompting, system role isolation, JSON schema mode)',
      'Security risks in LLM-assisted SDLC: OWASP Top 10 for LLMs (prompt injection, sensitive data leakage, insecure output handling)',
      'Verification pipelines: combining LLM generation with AST parsing (TypeScript Compiler API, ESLint custom rules)'
    ],
    recommendedReading: [
      'OWASP Top 10 for Large Language Models (LLM01-LLM10)',
      'AWS Generative AI Security Scoping Matrix & IAM Guidance',
      'Martin Fowler: "Harnessing LLMs in Software Delivery Teams"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Establish Developer Guardrail Gateway',
        description: 'Set up an internal proxy or CLI hook that masks PII and proprietary API keys before developer prompts leave the corporate perimeter.',
        codeOrConfigPattern: 'export const sanitizePrompt = (raw: string) => raw.replace(/(dealer_id|vin|api_key)=([A-Z0-9]+)/gi, "$1=[REDACTED]");'
      },
      {
        step: 2,
        title: 'Automated OpenAPI Schema & Test Harness Synthesis',
        description: 'Configure an LLM workflow inside GitHub Actions to generate synthetic dealer payloads and Jest contract boundary test fixtures from OpenAPI 3.1 YAML specifications.',
        codeOrConfigPattern: 'npx ts-node ./scripts/generate-synthetic-fixtures.ts --spec api/dealer-feed.yaml --count 50'
      },
      {
        step: 3,
        title: 'CI Quality Gate & Hallucination Filter',
        description: 'Enforce SonarQube quality gate and TypeScript strict compilation on all AI-assisted code merges, requiring human architect review on any generated ADR.',
        codeOrConfigPattern: 'npm run lint && tsc --noEmit && npm run test:coverage -- --fail-under=85'
      }
    ],
    proofArtifact: 'GitHub repository with a CLI tool that ingests OpenAPI specs, safely generates TypeScript contract tests using an LLM, and enforces automated validation.'
  },

  'ai-architecture': {
    coreTheory: [
      'Model Hosting & Inference Topology: Serverless (AWS Bedrock) vs. Dedicated Provisioned (SageMaker Endpoints)',
      'Latency budgeting & cold-start management for foundation models in synchronous vs asynchronous pipelines',
      'Embedding vectors, dimensional reduction, and semantic distance metrics (Cosine similarity, Dot product, Euclidean distance)'
    ],
    recommendedReading: [
      'AWS Whitepaper: Architecting for Generative AI on AWS',
      'Chip Huyen: "Designing Machine Learning Systems"',
      'Anthropic: Claude Model Context & Latency Optimization Guidelines'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Inference Layer Abstraction & Circuit Breaker',
        description: 'Implement a provider-agnostic adapter interface in TypeScript wrapping AWS Bedrock Claude 3.5 and Titan with exponential backoff and timeout fallbacks.',
        codeOrConfigPattern: 'export interface LLMProvider { complete(prompt: string, options: InferOptions): Promise<string>; }'
      },
      {
        step: 2,
        title: 'Prompt-Completion Semantic Caching',
        description: 'Integrate Amazon ElastiCache Redis with vector similarity (or deterministic hashing) to serve identical high-frequency prompt requests in under 20ms.',
        codeOrConfigPattern: 'const cacheKey = `prompt:${crypto.createHash("sha256").update(prompt).digest("hex")}`;'
      },
      {
        step: 3,
        title: 'Asynchronous Ingestion Worker for Batch Embeddings',
        description: 'Build an SQS-driven batch consumer worker that generates embeddings via Amazon Titan Embeddings v2 with throttled concurrency to avoid rate limits.',
        codeOrConfigPattern: 'const command = new InvokeModelCommand({ modelId: "amazon.titan-embed-text-v2:0", body: JSON.stringify({ inputText }) });'
      }
    ],
    proofArtifact: 'A deployed serverless microservice on AWS utilizing API Gateway, Bedrock, and ElastiCache Redis with fallback routing.'
  },

  'biz-needs-id': {
    coreTheory: [
      'Root Cause Analysis: The 5 Whys framework and Ishikawa (Fishbone) diagrams in systems architecture',
      'Value Stream Mapping: Identifying lead time vs process time bottlenecks in operational business flows',
      'Translating ambiguous business pain into quantifiable Architectural Drivers'
    ],
    recommendedReading: [
      'Gojko Adzic: "Impact Mapping"',
      'Mark Richards & Neal Ford: "Fundamentals of Software Architecture" (Chapter 2: Architectural Characteristics)',
      'EPAM Software Architecture Training: "Business Architecture for Lead Engineers"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Conduct Stakeholder Discovery Workshop',
        description: 'Interview business sponsors, operations leads, and dealer representatives to construct a Problem Statement canvas isolating business symptoms from core causes.',
        codeOrConfigPattern: 'Artifact: Business Problem Canvas (Current Pain -> Impacted Revenue -> Constraint -> Target State)'
      },
      {
        step: 2,
        title: 'Formulate Quantified Architectural Drivers',
        description: 'Transform qualitative stakeholder statements ("Our dealer sync is too slow and drops data") into a validated Architectural Drivers Matrix.',
        codeOrConfigPattern: 'Driver: Peak Feed Ingestion | Metric: 2,500 RPS | Business Value: Eliminates 12% dealer onboarding churn'
      },
      {
        step: 3,
        title: 'Author Business Impact Assessment (BIA)',
        description: 'Deliver an executive one-page BIA documenting cost-of-inaction versus proposed architectural remediation ROI.',
        codeOrConfigPattern: 'Deliverable: BIA document linking technical failure modes to contractual dealer SLA penalties.'
      }
    ],
    proofArtifact: 'Complete Architectural Drivers & Business Needs Discovery dossier for an enterprise automotive syndication feed.'
  },

  'biz-alignment': {
    coreTheory: [
      'Conway\'s Law and Reverse Conway Maneuvers in enterprise team topologies',
      'Total Cost of Ownership (TCO) modeling: Capex vs Opex, idle capacity vs elastic serverless pricing',
      'Mapping technical architecture roadmaps to corporate Objectives and Key Results (OKRs)'
    ],
    recommendedReading: [
      'Matthew Skelton & Manuel Pais: "Team Topologies"',
      'Gregor Hohpe: "The Software Architect Elevator"',
      'AWS FinOps Foundation Framework'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Build Cloud FinOps TCO Model',
        description: 'Develop a financial projection spreadsheet comparing 3-year TCO for Provisioned Aurora MySQL clusters vs DynamoDB On-Demand capacity under fluctuating dealer seasonal traffic.',
        codeOrConfigPattern: 'TCO Formula: (Read_IOPS_Cost + Write_IOPS_Cost + Storage_Cost + Operational_Headcount_Tiers)'
      },
      {
        step: 2,
        title: 'Align Service Boundaries to Team Topologies',
        description: 'Define microservice ownership boundaries matching autonomous stream-aligned squads, eliminating cross-squad release synchronization locks.',
        codeOrConfigPattern: 'Team Mapping: Squad A owns Dealer Ingestion Bounded Context; Squad B owns Consumer Search Bounded Context'
      },
      {
        step: 3,
        title: 'Create Executive Architecture Roadmap',
        description: 'Author a 4-quarter roadmap linking technical capability releases (e.g. SQS load leveling) directly to client commercial OKRs (e.g. 99.95% dealer catalog uptime).',
        codeOrConfigPattern: 'Milestone Q1: Asynchronous Ingestion -> Unlocks 50 new enterprise dealer groups without infrastructure upgrade'
      }
    ],
    proofArtifact: 'Business Alignment Presentation Deck & FinOps TCO Model justifying a major cloud re-architecture.'
  },

  'biz-define-goals': {
    coreTheory: [
      'SMART architectural criteria (Specific, Measurable, Achievable, Relevant, Time-bound)',
      'Service Level Indicators (SLIs), Service Level Objectives (SLOs), and Error Budgets',
      'Risk-driven goal setting (identifying catastrophic tail risks before writing code)'
    ],
    recommendedReading: [
      'Google Site Reliability Engineering (SRE) Book: Chapters on SLIs, SLOs, and Error Budgets',
      'Alex Xu: "System Design Interview - An Insider\'s Guide"',
      'EPAM LevelUp Guide: "Translating Client Strategy to Technical Goals"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Establish SLI/SLO Contract with Product Ownership',
        description: 'Draft the formal Service Level Agreement specifying P50, P95, and P99 response times and availability thresholds.',
        codeOrConfigPattern: 'SLI: (Successful HTTP 200/202 requests within 150ms) / (Total Requests) >= 99.95% over 30 days'
      },
      {
        step: 2,
        title: 'Define Error Budget Policy & Release Freezes',
        description: 'Establish the operational rules for what happens when the 0.05% error budget is consumed by unexpected dealer feed bursts.',
        codeOrConfigPattern: 'Policy: If monthly error budget < 10%, halt feature deployments; dedicate next sprint 100% to reliability'
      },
      {
        step: 3,
        title: 'Implement Synthetic Canaries & SLO Dashboards',
        description: 'Deploy AWS CloudWatch Synthetics canary scripts that simulate 24/7 dealer inventory submissions, tracking actual SLIs against target business goals.',
        codeOrConfigPattern: 'const canary = new synthetics.Canary(this, "DealerIngestionCanary", { schedule: Schedule.rate(Duration.minutes(1)) });'
      }
    ],
    proofArtifact: 'A formal SLO Specification Document & CloudWatch Synthetic Canary CDK stack monitoring production business goals.'
  },

  'biz-stakeholder-mgmt': {
    coreTheory: [
      'Stakeholder Power-Interest Matrix (Mendelow\'s Matrix) for technical architects',
      'The Pyramid Principle (Barbara Minto): Executive communication starting with Answer/Recommendation First',
      'Negotiation techniques for contentious non-functional requirements (Security vs Speed)'
    ],
    recommendedReading: [
      'Barbara Minto: "The Pyramid Principle: Logic in Writing and Thinking"',
      'Dale Carnegie: "How to Win Friends and Influence People in Technology"',
      'EPAM Consultancy Practice Guidelines'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Create Stakeholder Landscape Map',
        description: 'Classify project stakeholders into Mendelow\'s 4 quadrants (Key Players, Keep Satisfied, Keep Informed, Minimal Effort) with designated communication channels.',
        codeOrConfigPattern: 'Mapping: VP Engineering (High Power/High Interest) -> Bi-weekly ADR reviews; Dealer Admins -> Monthly release notes'
      },
      {
        step: 2,
        title: 'Structure Architectural RFC (Request for Comments)',
        description: 'Author a structured RFC template designed for multi-stakeholder feedback with explicit sections for Business Context, Trade-Off Matrix, and Open Questions.',
        codeOrConfigPattern: 'Template: RFC-042-asynchronous-dealer-ingestion.md (Problem -> Proposed Topology -> Trade-Offs -> FAQ)'
      },
      {
        step: 3,
        title: 'Facilitate Architecture Review Board (ARB) Defense',
        description: 'Lead a mock ARB meeting presenting an ADR, addressing security objections, and driving consensus without technical defensiveness.',
        codeOrConfigPattern: 'Script: "Elena raised a valid concern regarding DynamoDB GSI write costs. Here is our mitigation and financial projection."'
      }
    ],
    proofArtifact: 'Comprehensive Stakeholder Engagement Strategy & Completed Architecture Review Board (ARB) Dossier.'
  },

  'sol-arch-core': {
    coreTheory: [
      'End-to-End System Decomposition: Decomposing enterprise domains into scalable computational tiers',
      'Decoupled Ingestion & Backpressure architectures (Queue-Based Load Leveling, Reactive Streams)',
      'System boundary definition, blast radius containment, and data flow synchronization'
    ],
    recommendedReading: [
      'Martin Kleppmann: "Designing Data-Intensive Applications" (Chapters 1, 11, 12)',
      'Len Bass, Paul Clements, Rick Kazman: "Software Architecture in Practice"',
      'AWS Well-Architected Framework: Reliability and Performance Pillars'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Architect Decoupled Ingestion Topology',
        description: 'Design the full 6-hop container architecture: API Gateway -> ECS Ingest Worker -> SQS FIFO -> ECS Processor -> DynamoDB -> EventBridge -> OpenSearch.',
        codeOrConfigPattern: 'Flow: Ingest Worker validates schema and returns HTTP 202; Processor consumes SQS in batches of 10'
      },
      {
        step: 2,
        title: 'Implement High-Throughput Worker in TypeScript',
        description: 'Build the Node.js batch consumer worker utilizing the AWS SDK v3 `@aws-sdk/client-sqs` and `@aws-sdk/lib-dynamodb` with connection keep-alive.',
        codeOrConfigPattern: 'const response = await sqsClient.send(new ReceiveMessageCommand({ QueueUrl, MaxNumberOfMessages: 10, WaitTimeSeconds: 20 }));'
      },
      {
        step: 3,
        title: 'Simulate 2,500 RPS Peak Load Test',
        description: 'Run a distributed load test using k6 / Gatling simulating 10,000 concurrent dealer feed bursts, validating queue buffering and sub-150ms search latency.',
        codeOrConfigPattern: 'k6 run --vus 2500 --duration 10m ./load-tests/dealer-ingestion.js'
      }
    ],
    proofArtifact: 'Complete production-grade Solution Architecture Document (SAD) with verified k6 benchmark telemetry.'
  },

  'sol-arch-best-practices': {
    coreTheory: [
      'AWS Well-Architected 6 Pillars: Operational Excellence, Security, Reliability, Performance, Cost Optimization, Sustainability',
      'Zero-trust security boundaries: defense-in-depth, least-privilege IAM, envelope encryption with KMS',
      'Observability triad: Structured JSON logging, distributed OpenTelemetry tracing, and percentile metric alarms'
    ],
    recommendedReading: [
      'AWS Well-Architected Framework Official Whitepaper',
      'Charity Majors, Liz Fong-Jones: "Observability Engineering"',
      'Michael Nygard: "Release It! Design and Deploy Production-Ready Software"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Implement Structured Logging & Correlation IDs',
        description: 'Build a centralized logging middleware in Node.js that injects W3C `traceparent` headers into all log lines and AWS SDK calls.',
        codeOrConfigPattern: 'logger.info({ message: "Vehicle ingested", vin, dealerId, correlationId: req.headers["x-correlation-id"] });'
      },
      {
        step: 2,
        title: 'Configure Least-Privilege IAM Policies with CDK',
        description: 'Define AWS IAM roles restricting ECS worker permissions strictly to specific DynamoDB table ARNs and SQS queue actions.',
        codeOrConfigPattern: 'role.addToPolicy(new iam.PolicyStatement({ actions: ["dynamodb:PutItem", "dynamodb:UpdateItem"], resources: [table.tableArn] }));'
      },
      {
        step: 3,
        title: 'Automate Canary Deployments with CodeDeploy',
        description: 'Configure AWS ECS CodeDeploy blue-green canary routing (10% traffic for 15 minutes, auto-rollback on CloudWatch 5xx alarm).',
        codeOrConfigPattern: 'deploymentConfig: DeploymentConfig.CANARY_10PERCENT_15MINUTES'
      }
    ],
    proofArtifact: 'AWS CDK infrastructure repository demonstrating full compliance with all 6 Well-Architected pillars.'
  },

  'sol-arch-doc-c4-adr': {
    coreTheory: [
      'The C4 Model (Simon Brown): Context (L1), Container (L2), Component (L3), Code (L4)',
      'Architectural Decision Records (ADR) syntax and anatomy (Context, Decision, Consequences Gain/Sacrifice, Rejected Alternatives)',
      'Architecture as Code: Structurizr DSL and automated Markdown doc generation in CI/CD'
    ],
    recommendedReading: [
      'Simon Brown: "Software Architecture for Developers" (Vols 1 & 2)',
      'Michael Nygard: "Documenting Architecture Decisions"',
      'Structurizr DSL Documentation & Examples'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Model C4 Diagrams in Structurizr DSL',
        description: 'Author a complete `workspace.dsl` file defining Context, Container, and Component views for the Cox Automotive vehicle syndication platform.',
        codeOrConfigPattern: 'workspace { model { dealer = person "Dealer" ; system = softwareSystem "Cox Inventory Platform" { ... } } }'
      },
      {
        step: 2,
        title: 'Author 3 Production ADRs (ADR-01, 02, 03)',
        description: 'Write complete, publication-grade ADRs in markdown detailing DynamoDB vs MySQL, SQS vs REST, and Optimistic Concurrency Control.',
        codeOrConfigPattern: 'adr-template: # ADR-01: DynamoDB Single-Table vs. Aurora MySQL (Context, Decision, Consequences, Rejection)'
      },
      {
        step: 3,
        title: 'Automate Architecture Doc Generation in CI',
        description: 'Set up GitHub Actions to render Structurizr DSL into SVG/PNG diagrams and publish them alongside ADR markdown files to internal GitHub Pages.',
        codeOrConfigPattern: 'npx @structurizr/cli export -workspace workspace.dsl -format plantuml'
      }
    ],
    proofArtifact: 'Complete C4 Model diagrams (Levels 1-3) and Git-versioned ADR directory containing 3 production decisions.'
  },

  'sol-arch-fr-nfr': {
    coreTheory: [
      'NFR Taxonomy: FURPS+ framework (Functionality, Usability, Reliability, Performance, Supportability)',
      'Calculating Back-of-the-Envelope Capacity: Bandwidth, Storage growth per year, IOPS, and memory sizing',
      'The Fallacy of Infinite Scale: Designing for 10x current peak while maintaining economic viability'
    ],
    recommendedReading: [
      'Alex Xu: "System Design Interview - Volume 1" (Chapter 2: Back-of-the-envelope Estimation)',
      'Brendan Gregg: "Systems Performance: Enterprise and the Cloud"',
      'Martin Kleppmann: "Designing Data-Intensive Applications"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Execute Back-of-the-Envelope Capacity Sizing',
        description: 'Calculate daily storage intake, network ingress bandwidth, and required DynamoDB write capacity units (WCU) for 2,500 RPS.',
        codeOrConfigPattern: 'Calculation: 2,500 RPS * 2 KB/record = 5 MB/sec ingress = 432 GB/day; 2,500 WCU required'
      },
      {
        step: 2,
        title: 'Construct Comprehensive NFR Verification Matrix',
        description: 'Build a matrix documenting each NFR metric, its test environment verification method (Gatling/Chaos Mesh), and architectural mitigation.',
        codeOrConfigPattern: 'Deliverable: Matrix covering 2,500 RPS Ingestion, 99.95% Availability, P99 < 150ms Search, RPO=0, RTO < 15m'
      },
      {
        step: 3,
        title: 'Run Chaos Engineering Resilience Drill',
        description: 'Use AWS Fault Injection Simulator (FIS) to inject 30% packet loss and terminate ECS tasks, verifying that system recovers without violating NFRs.',
        codeOrConfigPattern: 'aws fis start-experiment --experiment-template-id EXT-ECS-KILL-TASKS'
      }
    ],
    proofArtifact: 'A rigorous NFR Specification & Chaos Engineering Verification Report with Gatling test scripts.'
  },

  'sol-arch-ref-arch': {
    coreTheory: [
      'Vendor Cloud Reference Architectures: AWS Serverless Application Model, Azure Architecture Center, GCP Architecture Framework',
      'Enterprise Architecture Patterns: Hub-and-Spoke networking, Landing Zones, Transit Gateways',
      'Evaluation criteria for knowing when to adopt vs when to diverge from reference blueprints'
    ],
    recommendedReading: [
      'AWS Solutions Architecture Reference Library (Serverless & Microservices)',
      'Enterprise Integration Patterns by Gregor Hohpe & Bobby Woolf',
      'Microsoft Azure Architecture Center Reference Architectures'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Audit AWS Serverless Reference Architecture',
        description: 'Analyze the official AWS reference design for asynchronous batch event processing, identifying gap areas for custom automotive domain logic.',
        codeOrConfigPattern: 'Analysis: AWS standard uses S3 -> Lambda; Cox Automotive requires API Gateway -> ECS Fargate for continuous heavy streaming'
      },
      {
        step: 2,
        title: 'Customize Blueprint with Multi-Account Landing Zone',
        description: 'Adapt the reference architecture into AWS Control Tower accounts (Dev, Staging, Prod, Security, Shared Services) with VPC Peering.',
        codeOrConfigPattern: 'Terraform: module "landing_zone" { source = "aws-samples/landing-zone" }'
      },
      {
        step: 3,
        title: 'Document Architectural Divergence Rationale',
        description: 'Author an architecture note explaining why standard serverless Lambda was replaced with ECS Fargate for long-lived backpressured streaming.',
        codeOrConfigPattern: 'Deliverable: Rationale memo detailing cost parity thresholds between Lambda invocations and Fargate vCPU hours'
      }
    ],
    proofArtifact: 'An Enterprise Reference Architecture Adaptation Blueprint customized for vehicle syndication pipelines.'
  },

  'sol-arch-ddd': {
    coreTheory: [
      'Strategic DDD: Bounded Contexts, Ubiquitous Language, Context Mapping (Shared Kernel, Customer-Supplier, Anti-Corruption Layer)',
      'Tactical DDD: Entities, Value Objects, Aggregate Roots, Domain Services, Domain Events',
      'Event Storming methodology for domain discovery with domain experts'
    ],
    recommendedReading: [
      'Eric Evans: "Domain-Driven Design: Tackling Complexity in the Heart of Software"',
      'Vaughn Vernon: "Implementing Domain-Driven Design"',
      'Alberto Brandolini: "Introducing EventStorming"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Execute Domain Context Map for Automotive Platform',
        description: 'Delineate boundaries between Dealer Management, Vehicle Catalog, Appraisal Valuation, and Consumer Syndication bounded contexts.',
        codeOrConfigPattern: 'Context Map: Catalog (Upstream) -> Syndication (Downstream Customer-Supplier with ACL)'
      },
      {
        step: 2,
        title: 'Implement Vehicle Aggregate Root in TypeScript',
        description: 'Code a pure domain entity adhering to tactical DDD rules: invariants enforced within constructor, immutable state mutations returning Domain Events.',
        codeOrConfigPattern: 'export class VehicleAggregate { private _price: Money; updatePrice(newPrice: Money): PriceUpdatedEvent { ... } }'
      },
      {
        step: 3,
        title: 'Build Anti-Corruption Layer (ACL) Adapter',
        description: 'Implement an adapter translating raw external dealer DMS JSON schemas into pure internal domain Value Objects without domain contamination.',
        codeOrConfigPattern: 'export class DealerFeedACL { toDomain(rawDmsPayload: any): VehicleSpecification { ... } }'
      }
    ],
    proofArtifact: 'A working TypeScript repository showcasing pure DDD Aggregates, Value Objects, Domain Events, and an Anti-Corruption Layer.'
  },

  'sol-arch-microservices': {
    coreTheory: [
      'Microservice characteristics: Independent deployability, decentralized data ownership, polyglot capability',
      'Distributed systems challenges: Eventual consistency, network latency, distributed transactions, partial failures',
      'Inter-service communication: Asynchronous Event-Driven vs Synchronous gRPC/REST, Choreography vs Orchestration'
    ],
    recommendedReading: [
      'Sam Newman: "Building Microservices: Designing Fine-Grained Systems" (2nd Edition)',
      'Chris Richardson: "Microservices Patterns: With examples in Java"',
      'Martin Fowler: "Microservices Guide"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Design Microservice Service Boundaries & Contracts',
        description: 'Decompose the inventory domain into Ingestion Service, Catalog Service, Valuation Service, and Alert Service with OpenAPI/AsyncAPI contracts.',
        codeOrConfigPattern: 'AsyncAPI Spec: asyncapi: 2.6.0; channels: vehicle/updated: publish: message: VehicleUpdatedPayload'
      },
      {
        step: 2,
        title: 'Implement Event Choreography via EventBridge',
        description: 'Configure AWS EventBridge bus rules routing `VehicleAppraised` events asynchronously to Catalog and Search microservices.',
        codeOrConfigPattern: 'const rule = new Rule(this, "VehicleAppraisedRule", { eventPattern: { source: ["cox.valuation"] } });'
      },
      {
        step: 3,
        title: 'Implement Distributed Tracing across Services',
        description: 'Inject OpenTelemetry trace contexts across HTTP boundaries and SQS message attributes, visualizing latency waterfall in AWS X-Ray.',
        codeOrConfigPattern: 'const tracer = trace.getTracer("inventory-service"); const span = tracer.startSpan("process-batch");'
      }
    ],
    proofArtifact: 'A Docker Compose / LocalStack testbed running 3 decoupled microservices communicating via asynchronous messaging.'
  },

  'sdlc-scrum': {
    coreTheory: [
      'Scrum Framework in Architecture: Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective, Backlog Refinement',
      'Architectural Runway and Technical Spikes in Agile Delivery',
      'Definition of Done (DoD) for architectural deliverables and Non-Functional Acceptance Criteria'
    ],
    recommendedReading: [
      'Ken Schwaber & Jeff Sutherland: "The Scrum Guide"',
      'SAFe Framework: "Architectural Runway Guidance"',
      'EPAM Delivery Excellence Practice: "Agile Architecture in Scrum Teams"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Define Architectural Spikes for Sprints',
        description: 'Format a time-boxed technical spike ticket with clear acceptance criteria (e.g., "Benchmark DynamoDB GSI write latency under 2,500 RPS").',
        codeOrConfigPattern: 'Spike Ticket: SPIKE-104: Measure DynamoDB BatchWriteItem latency across 3 AZs (Timebox: 3 days, Deliverable: Benchmark report)'
      },
      {
        step: 2,
        title: 'Embed NFR Acceptance Criteria in User Stories',
        description: 'Incorporate strict architectural criteria into Jira user stories: P99 latency limits, unit test coverage minimums, and ADR sign-offs.',
        codeOrConfigPattern: 'Acceptance Criteria: 1. Passes unit tests (>85%). 2. P99 latency < 150ms in staging. 3. Zero new SonarQube blocker vulnerabilities.'
      },
      {
        step: 3,
        title: 'Lead Backlog Refinement & Technical Debt Cadence',
        description: 'Establish a recurring 15-20% sprint capacity allocation dedicated exclusively to paying down architectural technical debt.',
        codeOrConfigPattern: 'Sprint Board: 4 Story points reserved per sprint for database connection pool refactoring'
      }
    ],
    proofArtifact: 'A complete Sprint Backlog & Definition of Done playbook incorporating architectural runway and NFR gates.'
  },

  'sdlc-methodologies': {
    coreTheory: [
      'Comparative methodology analysis: Scrum, Kanban, Extreme Programming (XP), Hybrid Water-Scrum-Fall',
      'Work in Progress (WIP) limits, Cycle Time, Lead Time, and Throughput in Kanban flow',
      'Selecting the appropriate SDLC model based on requirements volatility and regulatory compliance constraints'
    ],
    recommendedReading: [
      'David J. Anderson: "Kanban: Successful Evolutionary Change for Your Technology Business"',
      'Kent Beck: "Extreme Programming Explained: Embrace Change"',
      'EPAM Software Engineering Methodologies Handbook'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Design Kanban Flow for Continuous Ingestion Support',
        description: 'Configure a Kanban board for feed ingestion maintenance squads with explicit WIP limits on "In Analysis", "Architectural Review", and "Canary Validation".',
        codeOrConfigPattern: 'Kanban Config: WIP Limit on [Architecture Review] = 2 items max to prevent design review bottlenecks'
      },
      {
        step: 2,
        title: 'Integrate XP Technical Practices',
        description: 'Establish Pair Programming, Test-Driven Development (TDD), and Continuous Integration cadences for core domain modules.',
        codeOrConfigPattern: 'CI Configuration: GitHub Action runs lint, type-check, unit tests, and security scan on every pull request commit'
      },
      {
        step: 3,
        title: 'Author Methodology Selection Matrix',
        description: 'Create an advisory matrix for delivery managers guiding when new squads should adopt Kanban vs Scrum based on team size and dependency coupling.',
        codeOrConfigPattern: 'Deliverable: Decision tree comparing Scrum sprint cadence vs Kanban pull-based delivery'
      }
    ],
    proofArtifact: 'An Engineering Delivery Methodology Playbook detailing Kanban WIP guidelines and XP engineering standards.'
  },

  'sdlc-delivery-mgmt': {
    coreTheory: [
      'DORA Metrics (DevOps Research and Assessment): Deployment Frequency, Lead Time for Changes, Change Failure Rate, Time to Restore Service',
      'Dependency mapping and critical path analysis across multi-team releases',
      'Technical risk management and release blocker mitigation strategies'
    ],
    recommendedReading: [
      'Nicole Forsgren, Jez Humble, Gene Kim: "Accelerate: The Science of Lean Software and DevOps"',
      'DORA State of DevOps Annual Reports',
      'EPAM Delivery Management Competency Framework'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Instrument DORA Metrics Dashboard',
        description: 'Connect GitHub Actions and Datadog to track weekly Deployment Frequency, Lead Time, and Change Failure Rate.',
        codeOrConfigPattern: 'Metrics: Deployment Frequency >= 2/day; Lead Time < 4 hours; Change Failure Rate < 5%; MTTR < 15 mins'
      },
      {
        step: 2,
        title: 'Create Cross-Team Dependency Map',
        description: 'Build a dependency graph identifying when frontend dealer portals require backend ingestion API schema freeze.',
        codeOrConfigPattern: 'Tool: Dependency Matrix linking Ingestion Squad to Consumer Search Squad with mock contract dates'
      },
      {
        step: 3,
        title: 'Implement Feature Flag De-risking Strategy',
        description: 'Deploy LaunchDarkly or AWS AppConfig feature flags to decouple technical code deployment from business release dates.',
        codeOrConfigPattern: 'if (await appConfig.isEnabled("new_valuation_engine", { dealerId })) { ... } else { ... }'
      }
    ],
    proofArtifact: 'A DORA Telemetry Dashboard implementation and Feature Flag Release Governance Document.'
  },

  'sdlc-estimation': {
    coreTheory: [
      'Estimation models: Story Points (Fibonacci), T-Shirt sizing, Wideband Delphi, Planning Poker',
      'PERT Three-Point Estimation: Expected Duration = (Optimistic + 4*Most_Likely + Pessimistic) / 6',
      'Distinction between Accuracy and Precision; communicating confidence intervals to client executives'
    ],
    recommendedReading: [
      'Steve McConnell: "Software Estimation: Demystifying the Black Art"',
      'Mike Cohn: "Agile Estimating and Planning"',
      'EPAM Estimation and Sizing Practice Guidelines'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Deconstruct Architectural Migration into Work Breakdown Structure',
        description: 'Break down a 3-month DynamoDB single-table migration into atomic, estimable engineering work packages.',
        codeOrConfigPattern: 'WBS: Schema design (3d), Ingestion adapter (5d), CDC pipeline (8d), Dual-run verification (10d), Cutover (2d)'
      },
      {
        step: 2,
        title: 'Execute PERT Three-Point Calculation',
        description: 'Calculate statistical standard deviations and 85% confidence buffers for high-uncertainty cloud database cutover milestones.',
        codeOrConfigPattern: 'O=10 days, M=15 days, P=30 days -> Expected = 16.6 days, Variance = ((30-10)/6)^2 = 11.1'
      },
      {
        step: 3,
        title: 'Conduct Wideband Delphi Team Estimation Session',
        description: 'Facilitate a consensus-driven estimation workshop with senior engineers, resolving divergent assumptions on third-party API latency.',
        codeOrConfigPattern: 'Deliverable: Estimation consensus sheet with documented technical assumptions and risk contingency buffers'
      }
    ],
    proofArtifact: 'A formal Architectural Migration Estimation Model with PERT calculations and risk contingency models.'
  },

  'app-arch-dev-core': {
    coreTheory: [
      'Node.js V8 Runtime Internals: Event loop phases (Timers, Pending Callbacks, Poll, Check, Close), Libuv thread pool',
      'Memory Management: V8 heap structure (New Space, Old Space), garbage collection pauses (Scavenge, Mark-Sweep), memory leak diagnosis',
      'High-throughput I/O: Backpressured streams, asynchronous non-blocking patterns, avoiding event-loop starvation'
    ],
    recommendedReading: [
      'Bert Belder & Colin Ihrig: "Node.js Design Patterns" (3rd Edition)',
      'Matteo Collina: "High-Performance Node.js"',
      'Official V8 Blog: Memory Management and Garbage Collection'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Implement Backpressured Streaming Pipeline in Node.js',
        description: 'Write a Node.js streaming parser using `stream.Transform` that parses 500 MB dealer CSV feeds line-by-line without exceeding 128 MB RAM.',
        codeOrConfigPattern: 'const pipeline = promisify(stream.pipeline); await pipeline(fs.createReadStream(file), csvParser(), batchStream(100), s3Uploader);'
      },
      {
        step: 2,
        title: 'Diagnose Event Loop Starvation with Clinic.js',
        description: 'Profile a high-load service using `clinic doctor` and `clinic bubbleprof`, identifying CPU-blocking synchronous regex or JSON parsing.',
        codeOrConfigPattern: 'npx clinic doctor --on-port "autocannon -c 100 -d 30 http://localhost:3000" -- node server.js'
      },
      {
        step: 3,
        title: 'Optimize HTTP Keep-Alive & Socket Reuse',
        description: 'Configure custom Node.js `https.Agent` with `keepAlive: true` and maximum sockets configured to avoid TCP connection churn to AWS endpoints.',
        codeOrConfigPattern: 'const agent = new https.Agent({ keepAlive: true, maxSockets: 500, keepAliveMsecs: 60000 });'
      }
    ],
    proofArtifact: 'A high-performance Node.js benchmark repo processing 2,500 RPS with Clinic.js profiling charts demonstrating zero event loop delay.'
  },

  'app-arch-core': {
    coreTheory: [
      'Hexagonal Architecture (Ports and Adapters) by Alistair Cockburn',
      'Clean Architecture (Robert C. Martin): Dependency Rule (inner domain layers know nothing of outer frameworks)',
      'Onion Architecture (Jeffrey Palermo): Core Domain -> Domain Services -> Application Services -> Infrastructure'
    ],
    recommendedReading: [
      'Robert C. Martin: "Clean Architecture: A Craftsman\'s Guide to Software Structure and Design"',
      'Alistair Cockburn: "Hexagonal Architecture (Ports and Adapters)"',
      'Mark Richards: "Software Architecture Patterns"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Structure Hexagonal Codebase Folders',
        description: 'Establish directory boundaries: `core/domain`, `core/ports/inbound`, `core/ports/outbound`, `adapters/inbound/http`, `adapters/outbound/dynamo`.',
        codeOrConfigPattern: 'Folder structure: src/{domain, application/ports, infrastructure/adapters}'
      },
      {
        step: 2,
        title: 'Implement Inbound & Outbound Ports in TypeScript',
        description: 'Define interface contracts for primary and secondary ports, ensuring domain use cases invoke interfaces rather than direct AWS SDKs.',
        codeOrConfigPattern: 'export interface InventoryRepositoryPort { save(vehicle: Vehicle): Promise<void>; findByVin(vin: string): Promise<Vehicle | null>; }'
      },
      {
        step: 3,
        title: 'Enforce Architectural Boundaries with Dependency-Cruiser',
        description: 'Configure automated CI linter checking that `core/domain` has zero imports from `infrastructure` or `node_modules` (except core utils).',
        codeOrConfigPattern: 'npx depcruise --config .dependency-cruiser.js src'
      }
    ],
    proofArtifact: 'A fully decoupled TypeScript Hexagonal Architecture project with dependency-cruiser validation in CI.'
  },

  'app-arch-styles': {
    coreTheory: [
      'Comparative Architectural Styles: Modular Monolith vs Event-Driven Architecture vs Pipe-and-Filter vs Microservices vs Serverless',
      'Coupling Dimensions: Operational Coupling, Deployment Coupling, Data Coupling',
      'Heuristics for architectural style selection based on team size, transaction rate, and latency SLAs'
    ],
    recommendedReading: [
      'Neal Ford, Mark Richards: "Software Architecture: The Hard Parts"',
      'Gregor Hohpe: "Cloud Strategy"',
      'Martin Fowler: "MonolithFirst"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Author Architectural Style Trade-Off Matrix',
        description: 'Construct a formal decision matrix evaluating Modular Monolith vs Event-Driven Microservices against 8 criteria (Throughput, Simplicity, Cost, etc.).',
        codeOrConfigPattern: 'Matrix: Event-Driven scores 5/5 on Ingestion Elasticity, but 2/5 on Consistency Complexity'
      },
      {
        step: 2,
        title: 'Build a Modular Monolith with Strict Module Boundaries',
        description: 'Implement a modular monolith in TypeScript using npm workspaces / project references where each module communicates only via public interfaces.',
        codeOrConfigPattern: 'packages/{dealer-module, inventory-module, pricing-module}'
      },
      {
        step: 3,
        title: 'Transition Pipe-and-Filter Style for Feed Ingestion',
        description: 'Implement a Pipe-and-Filter ingestion pipeline with discrete stages: Ingest Filter -> Normalization Filter -> Valuation Filter -> Storage Sink.',
        codeOrConfigPattern: 'export class Pipeline { use(filter: Filter): this; execute(payload: any): Promise<void>; }'
      }
    ],
    proofArtifact: 'An Architectural Style Trade-Off Evaluation Dossier and working Pipe-and-Filter implementation repository.'
  },

  'app-arch-patterns': {
    coreTheory: [
      'Gang of Four (GoF) Behavioral & Structural Patterns: Strategy, Factory, Decorator, Observer, Adapter',
      'Enterprise Application Patterns (Fowler): Unit of Work, Repository, Data Mapper, Identity Map',
      'Cloud Resiliency Patterns: Circuit Breaker, Retry with Jitter, Bulkhead, Cache-Aside'
    ],
    recommendedReading: [
      'Erich Gamma et al.: "Design Patterns: Elements of Reusable Object-Oriented Software"',
      'Martin Fowler: "Patterns of Enterprise Application Architecture"',
      'Alexander Shvets: "Dive Into Design Patterns"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Implement Strategy Pattern for Polymorphic Feed Parsing',
        description: 'Build a feed ingestion engine that dynamically delegates parsing to `CdkFeedStrategy`, `ReynoldsFeedStrategy`, or `CsvFeedStrategy` based on feed headers.',
        codeOrConfigPattern: 'export interface FeedParserStrategy { parse(raw: Buffer): NormalizedVehicle[]; }'
      },
      {
        step: 2,
        title: 'Implement Circuit Breaker with Cockatiel in TypeScript',
        description: 'Wrap third-party valuation HTTP calls in a Circuit Breaker configured with 50% failure threshold over 10 seconds and 30-second reset timeout.',
        codeOrConfigPattern: 'const breaker = circuitBreaker(handleAll, { halfOpenAfter: 30000, breaker: new ConsecutiveBreaker(5) });'
      },
      {
        step: 3,
        title: 'Implement Repository & Unit of Work Patterns',
        description: 'Build an abstracted repository pattern wrapping DynamoDB with optimistic concurrency control version checks.',
        codeOrConfigPattern: 'export class DynamoVehicleRepository implements VehicleRepository { ... }'
      }
    ],
    proofArtifact: 'A TypeScript design patterns reference implementation featuring Strategy, Circuit Breaker, and Repository patterns.'
  },

  'app-arch-application': {
    coreTheory: [
      'Layered Architecture: Presentation, Application (Use Cases), Domain, Infrastructure',
      'Cross-Cutting Concerns: Unified error handling hierarchies, distributed context propagation, input validation schemas (Zod/Joi)',
      'Transaction Boundaries: Managing transactions across aggregates and ensuring domain invariants'
    ],
    recommendedReading: [
      'Vaughn Vernon: "Domain-Driven Design Distilled"',
      'Mark Richards: "Software Architecture Patterns: Layered Architecture"',
      'Node.js Best Practices Repository (Gold Standard GitHub)'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Implement Domain Error Hierarchy',
        description: 'Construct a unified error hierarchy distinguishing between DomainValidationError, ConcurrencyConflictError, and InfrastructureUnavailableError.',
        codeOrConfigPattern: 'export class DomainError extends Error { constructor(public readonly code: string, message: string) { super(message); } }'
      },
      {
        step: 2,
        title: 'Build Zod Schema Validation Middleware',
        description: 'Create an application boundary validation layer that sanitizes incoming dealer JSON payloads before passing data to domain use-cases.',
        codeOrConfigPattern: 'export const VehicleSchema = z.object({ vin: z.string().length(17), price: z.number().positive() });'
      },
      {
        step: 3,
        title: 'Implement Use Case Interactor Orchestrator',
        description: 'Build the `AppraiseVehicleUseCase` orchestrating domain rules, repository lookups, and event publishing.',
        codeOrConfigPattern: 'export class AppraiseVehicleUseCase { execute(dto: AppraiseDto): Promise<AppraisalResult> { ... } }'
      }
    ],
    proofArtifact: 'A complete application layer template with strict validation, error handling, and test-isolated use cases.'
  },

  'app-arch-uml': {
    coreTheory: [
      'UML 2.5 Standard: Behavioral diagrams (Sequence, State Machine, Activity) vs Structural diagrams (Class, Component, Package)',
      'High-yield UML for Architects: Sequence diagrams for asynchronous event flows; State machines for entity lifecycle transitions',
      'Anti-patterns in UML: Over-specifying private implementation details instead of system interactions'
    ],
    recommendedReading: [
      'Martin Fowler: "UML Distilled: A Brief Guide to the Standard Object Modeling Language" (3rd Edition)',
      'PlantUML & Mermaid.js Syntax Guides',
      'EPAM Software Architecture Modeling Standards'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Author Asynchronous Sequence Diagram in PlantUML',
        description: 'Model the 6-hop dealer ingestion flow showing asynchronous acknowledgment (HTTP 202), SQS buffering, and EventBridge dispatch.',
        codeOrConfigPattern: 'PlantUML: Dealer -> APIGW : POST /inventory; APIGW -> SQS : SendMessage; APIGW -> Dealer : 202 Accepted'
      },
      {
        step: 2,
        title: 'Author Vehicle State Machine Diagram',
        description: 'Model the vehicle lifecycle transitions: `Ingested` -> `ValuationPending` -> `Available` -> `HoldReserved` -> `Sold` / `Released`.',
        codeOrConfigPattern: 'PlantUML: [*] --> Ingested; Ingested --> Available : PriceValidated; Available --> HoldReserved : HoldAcquired'
      },
      {
        step: 3,
        title: 'Embed UML Diagrams into Markdown Pipeline',
        description: 'Configure automated rendering of Mermaid.js or PlantUML diagrams inside GitHub README and documentation artifacts.',
        codeOrConfigPattern: '```mermaid\nsequenceDiagram\n  Dealer->>API: Submit Feed\n  API-->>Dealer: 202 Accepted\n```'
      }
    ],
    proofArtifact: 'A verified architectural specification document containing 3 formal PlantUML/Mermaid diagrams.'
  },

  'app-arch-databases': {
    coreTheory: [
      'Relational (ACID, B-Trees, 3NF, Connection Pooling) vs NoSQL (BASE, LSM-Trees, Single-Table Design, Horizontal Partitioning)',
      'DynamoDB Single-Table Design: Partition Key (PK), Sort Key (SK), Global Secondary Indexes (GSIs), Overloaded Keys',
      'ACID Isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and Distributed Concurrency'
    ],
    recommendedReading: [
      'Alex DeBrie: "The DynamoDB Book" (The definitive guide to Single-Table Design)',
      'Martin Kleppmann: "Designing Data-Intensive Applications" (Chapters 3, 7)',
      'AWS DynamoDB Documentation: Best Practices for DynamoDB'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Model Cox Automotive Single-Table Schema',
        description: 'Design the single table storing Dealers, Vehicles, Appraisals, and Holds using overloaded PK/SK and GSIs.',
        codeOrConfigPattern: 'PK: DEALER#<id>, SK: VEHICLE#<vin>; GSI1PK: STATUS#<status>, GSI1SK: PRICE#<price>'
      },
      {
        step: 2,
        title: 'Implement DynamoDB ConditionExpression in TypeScript',
        description: 'Write an atomic hold reservation query using DynamoDB `UpdateItem` with conditional expressions preventing race conditions.',
        codeOrConfigPattern: 'ConditionExpression: "attribute_not_exists(holdStatus) OR holdStatus = :available"'
      },
      {
        step: 3,
        title: 'Benchmark Query vs Scan Performance',
        description: 'Run benchmark comparisons showing single-digit millisecond latency on indexed queries versus table scans under 100,000 items.',
        codeOrConfigPattern: 'Benchmark: Query by PK+SK = 4.2ms; Scan across 100k records = 450ms (and 120 RCU consumed)'
      }
    ],
    proofArtifact: 'A complete NoSQL Workbench DynamoDB schema model and accompanying TypeScript test suite verifying O(1) queries.'
  },

  'cloud-design-patterns': {
    coreTheory: [
      'Queue-Based Load Leveling and Competing Consumers patterns',
      'Cache-Aside vs Write-Through vs Write-Behind caching strategies and cache stampede protection',
      'Circuit Breaker, Retry with Jitter, and Compensating Transactions (Sagas)'
    ],
    recommendedReading: [
      'Microsoft Azure Architecture Center: Cloud Design Patterns Catalog',
      'AWS Prescriptive Guidance: Cloud Architecture Patterns',
      'Michael Nygard: "Release It!"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Implement Queue-Based Load Leveling on AWS',
        description: 'Deploy AWS SQS FIFO queue buffering bursty API Gateway requests, draining to ECS Fargate workers at a controlled 1,000 RPS rate.',
        codeOrConfigPattern: 'SQS: VisibilityTimeout = 30s, MaxReceiveCount = 3, DeadLetterTargetArn = dlq.arn'
      },
      {
        step: 2,
        title: 'Implement Cache-Aside with Redis and Full Jitter',
        description: 'Build a caching utility in TypeScript that retrieves from Redis on hit, queries OpenSearch on miss, and writes back with TTL + random jitter.',
        codeOrConfigPattern: 'const ttl = 300 + Math.floor(Math.random() * 60); await redis.set(key, JSON.stringify(data), "EX", ttl);'
      },
      {
        step: 3,
        title: 'Implement Compensating Transaction Workflow',
        description: 'Code a multi-step saga compensating rollback in TypeScript when vehicle payment fails after inventory reservation.',
        codeOrConfigPattern: 'try { await chargePayment(); } catch (err) { await releaseInventoryReservation(vin); throw err; }'
      }
    ],
    proofArtifact: 'An end-to-end cloud pattern repository demonstrating Queue-Based Load Leveling and Cache-Aside with TTL jitter.'
  },

  'cloud-migration': {
    coreTheory: [
      'The 6 R\'s of Cloud Migration: Rehost (Lift & Shift), Replatform, Refactor/Re-architect, Repurchase, Retain, Retire',
      'Strangler Fig Application pattern for incremental monolith decomposition',
      'Change Data Capture (CDC) with Debezium and Kafka for dual-run data synchronization'
    ],
    recommendedReading: [
      'Martin Fowler: "StranglerFigApplication"',
      'AWS Whitepaper: "Migration Strategy: The 6 Rs"',
      'Gunnar Morling: "Debezium in Action: Change Data Capture for Microservices"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Configure Strangler Fig Proxy at Edge Boundary',
        description: 'Set up AWS API Gateway routing `/api/v2/inventory/*` to cloud microservices while proxying `/api/v1/*` to the on-premise monolith.',
        codeOrConfigPattern: 'API Gateway Routes: /api/v2/* -> VPC Link -> ECS Fargate; /* -> HTTP Proxy -> On-Premise Monolith'
      },
      {
        step: 2,
        title: 'Deploy Change Data Capture (CDC) Pipeline',
        description: 'Configure Debezium on Apache Kafka to tail Oracle/MySQL database transaction logs, streaming mutations into AWS DynamoDB in under 500ms.',
        codeOrConfigPattern: 'Debezium Config: connector.class=io.debezium.connector.oracle.OracleConnector; table.include.list=DEALER.VEHICLES'
      },
      {
        step: 3,
        title: 'Implement Automated Data Reconciliation Auditing',
        description: 'Deploy an automated Athena/Glue job running checksum comparisons across legacy and cloud tables to detect and heal data drift.',
        codeOrConfigPattern: 'Athena Query: SELECT vin, count(*) FROM (SELECT vin, price FROM legacy UNION ALL SELECT vin, price FROM cloud) GROUP BY vin HAVING count(*) = 1'
      }
    ],
    proofArtifact: 'A Strangler Fig Migration Playbook including CDC dual-run topology diagrams and Athena data reconciliation scripts.'
  },

  'cloud-platforms': {
    coreTheory: [
      'AWS Well-Architected Platform Services: ECS Fargate, Lambda, API Gateway, SQS, SNS, EventBridge, DynamoDB, OpenSearch',
      'High-Availability Topology: Multi-AZ architectures, ALB path-based routing, Route 53 health-check failover',
      'Cloud FinOps & Capacity Optimization: Compute Savings Plans, DynamoDB On-Demand vs Provisioned, S3 Lifecycle policies'
    ],
    recommendedReading: [
      'AWS Certified Solutions Architect Professional Exam Guide',
      'AWS Architecture Center: High Availability and Disaster Recovery',
      'Terraform AWS Provider Documentation'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Provision Multi-AZ ECS Fargate Infrastructure with CDK',
        description: 'Author AWS CDK / Terraform templates provisioning an Application Load Balancer across 3 public subnets routing to Fargate tasks in private subnets.',
        codeOrConfigPattern: 'const cluster = new ecs.Cluster(this, "CoxCluster", { vpc }); const service = new ApplicationLoadBalancedFargateService(...);'
      },
      {
        step: 2,
        title: 'Configure Cross-Region Warm Standby Disaster Recovery',
        description: 'Set up DynamoDB Global Tables replicating between us-east-1 and us-west-2 with Route 53 latency-based routing and health checks.',
        codeOrConfigPattern: 'const table = new dynamodb.Table(this, "InventoryTable", { replicationRegions: ["us-west-2"] });'
      },
      {
        step: 3,
        title: 'Implement AWS CloudWatch Alarms & Auto-Scaling',
        description: 'Create Target Tracking Scaling policies on ECS Fargate scaling tasks out when SQS queue backlog exceeds 500 visible messages.',
        codeOrConfigPattern: 'scalableTarget.scaleOnCustomMetric("QueueScaling", { metric: sqsApproximateMessages, targetValue: 500 });'
      }
    ],
    proofArtifact: 'A complete, deployable AWS CDK TypeScript repository establishing a resilient multi-AZ microservice cluster.'
  },

  'lead-english': {
    coreTheory: [
      'CEFR B2/C1 Assessment Standards: Fluency, Coherence, Lexical Resource, Grammatical Range, Phonological Control',
      'Structuring spoken technical defense: Context -> Thesis -> Two Supporting Points -> Trade-Off (Gain vs Sacrifice) -> Concluding Recommendation',
      'Active listening and clarifying questions during interrogation by non-native and native English panel chairs'
    ],
    recommendedReading: [
      'EPAM Language Excellence: B2 Technical Assessment Guidelines',
      'Geoff Petty: "Structuring Arguments for Professional Presentations"',
      'TED Talks: Effective Technical Communication'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Master the 30-Second Elevator Defense Framework',
        description: 'Practice speaking the 3-part formula aloud with a digital timer: 1. Thesis & Plain-English Analogy (10s), 2. Cloud Mechanics (10s), 3. Trade-off (10s).',
        codeOrConfigPattern: 'Formula: "We chose DynamoDB because... It is like a high-speed conveyor belt... We gain sub-5ms latency at the sacrifice of ad-hoc SQL joins."'
      },
      {
        step: 2,
        title: 'Record & Audit 5 Spoken Technical Defenses',
        description: 'Use audio recording tools to record answers to Q1-Q5, auditing for filler words ("um", "like"), pacing, and structured clarity.',
        codeOrConfigPattern: 'Audit Checklist: Clear pronunciation of acronyms (SQS, ACID, P99); structured sentence transitions.'
      },
      {
        step: 3,
        title: 'Conduct Mock English Technical Interview',
        description: 'Complete a full 30-minute mock technical defense speaking entirely in English with a peer or mentor focusing on professional architectural discourse.',
        codeOrConfigPattern: 'Deliverable: Mentor assessment rubric confirming NAT B2 / C1 English interview proficiency.'
      }
    ],
    proofArtifact: 'A collection of 10 recorded 30-second technical defenses audited against EPAM B2 proficiency criteria.'
  },

  'lead-consultancy': {
    coreTheory: [
      'The Trusted Advisor Model (David Maister): Credibility + Reliability + Intimacy / Self-Orientation',
      'Challenging Client Assumptions: Constructive confrontation, Framing trade-offs commercially rather than dogmatically',
      'Facilitating Architectural Trade-Off Analysis Method (ATAM) workshops with client executives'
    ],
    recommendedReading: [
      'David H. Maister, Charles H. Green: "The Trusted Advisor"',
      'Gerald M. Weinberg: "The Secrets of Consulting"',
      'SEI / Carnegie Mellon: "Architecture Tradeoff Analysis Method (ATAM)"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Formulate ATAM Trade-Off Workshop Template',
        description: 'Design a 2-hour client workshop agenda for evaluating architecture trade-offs between Multi-Region Active-Active vs Warm Standby.',
        codeOrConfigPattern: 'Agenda: 1. Business Drivers (20m) 2. Scenario Generation (30m) 3. Architectural Analysis (40m) 4. Risk Matrix (30m)'
      },
      {
        step: 2,
        title: 'Draft Constructive Pushback Memo',
        description: 'Write a persuasive technical advisory memo guiding a client CTO away from an expensive, fragile multi-region relational cluster toward DynamoDB Global Tables.',
        codeOrConfigPattern: 'Memo: "Why Active-Active MySQL increases operational risk by 300% for Cox Automotive while DynamoDB achieves your 99.95% SLA."'
      },
      {
        step: 3,
        title: 'Deliver Client Executive Presentation',
        description: 'Present the architecture recommendations to non-technical client stakeholders focusing purely on business risk, delivery timelines, and cloud TCO.',
        codeOrConfigPattern: 'Deliverable: 10-slide executive presentation condensing complex cloud mechanics into commercial decision points.'
      }
    ],
    proofArtifact: 'A Client Consulting Advisory Dossier featuring an ATAM workshop template and constructive pushback memo.'
  },

  'lead-ownership': {
    coreTheory: [
      'Extreme Ownership principles (Jocko Willink): Taking responsibility for systemic failures, lack of documentation, and production outages',
      'Production Readiness Reviews (PRRs): Operational runbooks, alerting thresholds, on-call handover protocols',
      'Post-Incident Blameless Post-Mortems: Root cause analysis, systemic remediations, preventing recurrence'
    ],
    recommendedReading: [
      'Jocko Willink & Leif Babin: "Extreme Ownership: How U.S. Navy SEALs Lead and Win"',
      'Google SRE Book: "Postmortem Culture: Learning from Failure"',
      'EPAM Software Engineering Quality Standards'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Author Production Readiness Review (PRR) Checklist',
        description: 'Create an exhaustive 25-point PRR covering health checks, circuit breakers, CloudWatch alarms, backup frequency, and PagerDuty escalations.',
        codeOrConfigPattern: 'Checklist: [ ] DLQ alarms configured; [ ] PITR enabled; [ ] Multi-AZ deployed; [ ] Runbooks documented'
      },
      {
        step: 2,
        title: 'Conduct Blameless Post-Mortem on Production Outage',
        description: 'Author a comprehensive post-mortem detailing a simulated inventory feed outage, timeline of events, root cause, and 4 systemic preventive actions.',
        codeOrConfigPattern: 'Post-Mortem: INC-402: Feed Parser Memory Leak (Trigger -> Detection -> Containment -> Root Cause -> Action Items)'
      },
      {
        step: 3,
        title: 'Write On-Call Operational Runbook',
        description: 'Deliver step-by-step troubleshooting instructions for L2/L3 engineers responding to PagerDuty alerts on SQS queue backlog spikes.',
        codeOrConfigPattern: 'Runbook: "If SQS backlog > 10,000 items: 1. Verify ECS task health; 2. Check DLQ messages; 3. Trigger manual worker scale-out."'
      }
    ],
    proofArtifact: 'A complete Production Operational Readiness Review (PRR) & Blameless Post-Mortem Case Study.'
  },

  'lead-leadership': {
    coreTheory: [
      'Influence without authority in matrixed engineering organizations',
      'Establishing Architectural Guardrails vs Micromanaging: Giving squads autonomy within safe boundaries',
      'Running effective Engineering Communities of Practice (CoP) and Architecture Katas'
    ],
    recommendedReading: [
      'Camille Fournier: "The Manager\'s Path: A Guide for Tech Leaders"',
      'Will Larson: "Staff Engineer: Leadership beyond the management track"',
      'Ted Neward: "Architectural Katas"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Establish Architectural Guardrails Document',
        description: 'Author a "Ten Commandments of Engineering" document for delivery squads defining non-negotiable standards (e.g. no DB joins across services).',
        codeOrConfigPattern: 'Guardrail #1: No service may read directly from another service\'s database. All integration occurs via APIs or events.'
      },
      {
        step: 2,
        title: 'Facilitate Weekly Architecture Kata',
        description: 'Host a 1-hour workshop guiding 5 lead engineers through designing an ambiguous system (e.g. Real-Time Vehicle Valuation) and providing constructive feedback.',
        codeOrConfigPattern: 'Kata Scenario: "Design a sub-second vehicle auction bidding system for 50,000 concurrent dealers"'
      },
      {
        step: 3,
        title: 'Conduct Architectural PR Review Workshop',
        description: 'Create a guide for lead engineers on reviewing architectural pull requests, focusing on cohesion, coupling, and security over code syntax.',
        codeOrConfigPattern: 'Review Template: [ ] Does this PR violate bounded context boundaries? [ ] Are external API calls timeout-protected?'
      }
    ],
    proofArtifact: 'An Architectural Governance & Community of Practice Charter with documented Architecture Kata workshops.'
  },

  'lead-communication': {
    coreTheory: [
      'Tailoring architectural fidelity to audience: Executives (Business ROI/Risk), PMs (Features/Milestones), Developers (Components/APIs)',
      'The Rule of Three: Limiting options and key arguments to 3 easily digestible pillars',
      'Visual storytelling: Using clear, non-overloaded diagrams to convey complex distributed state flows'
    ],
    recommendedReading: [
      'Garr Reynolds: "Presentation Zen: Simple Ideas on Presentation Design and Delivery"',
      'Chip Heath & Dan Heath: "Made to Stick: Why Some Ideas Survive and Others Die"',
      'EPAM Technical Communication Mastery'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Create Multi-Tier Architecture One-Pager',
        description: 'Condense a complex 50-page Solution Architecture Document into a 1-page executive briefing using the Rule of Three.',
        codeOrConfigPattern: 'One-Pager: 1. Core Problem 2. Recommended Solution 3. Three Pillars of Value (Reliability, Speed, Cost)'
      },
      {
        step: 2,
        title: 'Present Live Technical Walkthrough to Mixed Audience',
        description: 'Deliver a 15-minute recorded presentation explaining the Cox Automotive C4 topology, handling live questions from product and security personas.',
        codeOrConfigPattern: 'Slide Structure: 1. Executive Context (2m) 2. C4 Container Flow (8m) 3. Risk & Mitigation (5m)'
      },
      {
        step: 3,
        title: 'Refactor Confusing Technical Documentation',
        description: 'Take a dense, jargon-laden legacy technical document and rewrite it into clean, accessible developer documentation.',
        codeOrConfigPattern: 'Deliverable: Before-and-After documentation refactoring showing 50% reduction in word count with 2x clarity.'
      }
    ],
    proofArtifact: 'An Executive Architectural One-Pager & 15-minute recorded architecture presentation.'
  },

  'lead-adaptability': {
    coreTheory: [
      'Managing requirements churn: Designing software systems for change (Parnas Modularization)',
      'Gracefully deprecating sunk costs when technical parameters or market realities pivot',
      'Decoupling business rules from infrastructure mechanisms to enable rapid technology swaps'
    ],
    recommendedReading: [
      'David Parnas: "On the Criteria To Be Used in Decomposing Systems into Modules"',
      'Nassim Nicholas Taleb: "Antifragile: Things That Gain from Disorder"',
      'EPAM Agility in Complex Engagements'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Design Port/Adapter Swappability Layer',
        description: 'Implement an abstract persistence adapter allowing the system to swap from DynamoDB to MongoDB without altering a single line of domain code.',
        codeOrConfigPattern: 'export class MongoVehicleRepository implements VehicleRepositoryPort { ... }'
      },
      {
        step: 2,
        title: 'Execute Architectural Pivot Case Study',
        description: 'Document an architectural pivot where sudden vendor rate-limiting required redesigning a synchronous API into SQS batching in 48 hours.',
        codeOrConfigPattern: 'Case Study: Pivot from WebSocket feed stream to SQS batch polling under vendor bandwidth constraints'
      },
      {
        step: 3,
        title: 'Conduct Technical Risk Simulation',
        description: 'Run a tabletop exercise with engineering squads simulating the deprecation of a core cloud service (e.g. third-party search cluster).',
        codeOrConfigPattern: 'Tabletop Scenario: What happens if OpenSearch licensing changes? How quickly can we switch to Algolia/Postgres?'
      }
    ],
    proofArtifact: 'An Architectural Adaptability & Modular Swappability Repository demonstrating zero-impact datastore migration.'
  },

  'lead-business-acumen': {
    coreTheory: [
      'SaaS Business Models: Customer Acquisition Cost (CAC), Lifetime Value (LTV), Churn Rate, Gross Margins',
      'FinOps: Cloud cost optimization, spot instances, provisioned concurrency budgets, storage class tiering',
      'Linking architectural performance (P99 latency) to customer conversion rates and dealer retention'
    ],
    recommendedReading: [
      'J.R. Storment & Mike Fuller: "Cloud FinOps: Collaborative, Real-Time Cloud Value Decision Making"',
      'Eric Ries: "The Lean Startup"',
      'EPAM Business Architecture & Commercial Strategy'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Build Unit Cost per Ingestion Transaction Model',
        description: 'Calculate the exact AWS infrastructure cost per vehicle inventory record ingested across compute, storage, and networking.',
        codeOrConfigPattern: 'Formula: Total Monthly AWS Spend ($12,400) / Monthly Ingested Records (6.2M) = $0.002 per vehicle'
      },
      {
        step: 2,
        title: 'Execute S3 Tiered Storage Lifecycle Optimization',
        description: 'Configure AWS S3 lifecycle rules transitioning raw dealer CSV uploads to Infrequent Access after 30 days and Glacier after 90 days.',
        codeOrConfigPattern: 'LifecycleRule: Transition to GLACIER after 90 days; delete non-current versions after 365 days'
      },
      {
        step: 3,
        title: 'Demonstrate Latency-to-Revenue Impact',
        description: 'Author a whitepaper citing industry empirical research correlating our sub-150ms catalog search response to a 4.5% boost in consumer vehicle inquiries.',
        codeOrConfigPattern: 'Deliverable: Executive ROI paper linking P99 latency reduction to dealer lead generation revenue'
      }
    ],
    proofArtifact: 'A Cloud Unit Economics Model & FinOps Infrastructure Optimization Case Study.'
  },

  'lead-team-player': {
    coreTheory: [
      'Servant Leadership in Software Architecture: The architect as an unblocker, not an ivory-tower gatekeeper',
      'Pair Programming & Mob Programming: Accelerating squad delivery while transferring architectural context',
      'Building Psychological Safety (Amy Edmondson): Creating an environment where failure is treated as a learning opportunity'
    ],
    recommendedReading: [
      'Amy C. Edmondson: "The Fearless Organization"',
      'Robert K. Greenleaf: "Servant Leadership"',
      'Patrick Lencioni: "The Five Dysfunctions of a Team"'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Establish "Architect Office Hours" Cadence',
        description: 'Host bi-weekly open drop-in sessions for developers to review difficult PRs, debug production issues, and brainstorm local designs.',
        codeOrConfigPattern: 'Calendar: Twice-weekly 1-hour open office hours for unblocking squad engineering challenges'
      },
      {
        step: 2,
        title: 'Pair on Critical Integration Spikes',
        description: 'Pair program with a senior engineer on implementing the complex DynamoDB ConditionExpression retry loop with exponential jitter.',
        codeOrConfigPattern: 'Pairing Session: Co-authoring unit test harnesses and load testing scripts in TypeScript'
      },
      {
        step: 3,
        title: 'Facilitate Blameless Squad Retrospective',
        description: 'Lead a team retrospective following a stressful release crunch, focusing on process improvements and celebrating team contributions.',
        codeOrConfigPattern: 'Retrospective Format: What went well? What caused friction? What will we commit to changing next sprint?'
      }
    ],
    proofArtifact: 'A Servant Architecture Charter & Peer Feedback Portfolio demonstrating hands-on squad enablement.'
  },

  'lead-dev-others': {
    coreTheory: [
      'The Situational Leadership Model (Hersey-Blanchard): Directing, Coaching, Supporting, Delegating',
      'The Dreyfus Model of Skill Acquisition: Novice -> Advanced Beginner -> Competent -> Proficient -> Expert',
      'Structuring Individual Development Plans (IDPs) and mentoring senior engineers toward the B1 Software Architect gate'
    ],
    recommendedReading: [
      'Ken Blanchard: "Leadership and the One Minute Manager"',
      'Stuart Dreyfus: "The Five-Stage Model of Adult Skill Acquisition"',
      'EPAM Mentoring & LevelUp Competency Framework'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Design Architect Mentorship Curriculum',
        description: 'Build a structured 6-month roadmap guiding a Senior Software Engineer through authoring ADRs, C4 modeling, and NFR quantification.',
        codeOrConfigPattern: 'Curriculum: Month 1-2: NFRs & C4; Month 3-4: Distributed Systems & ADRs; Month 5-6: Mock Interview Defense'
      },
      {
        step: 2,
        title: 'Conduct Mock Architectural Review Defense',
        description: 'Run a 45-minute mock assessment for a mentee, asking tough questions on database locking and providing actionable written feedback.',
        codeOrConfigPattern: 'Feedback Rubric: Scored mentee on Plain-English Analogy (3/4), Trade-off (2/4), Cloud Mechanics (4/4)'
      },
      {
        step: 3,
        title: 'Delegate Ownership of Subsystem Architecture',
        description: 'Delegate full architectural design ownership of the new Price Alert Webhook subsystem to a mentee, acting solely as coach and reviewer.',
        codeOrConfigPattern: 'Milestone: Mentee authored ADR-04 and successfully defended it before the Architecture Review Board'
      }
    ],
    proofArtifact: 'A 6-Month Architecture Mentorship Plan & Mentee Promotion Portfolio detailing candidate growth.'
  },

  'lead-managing-teamwork': {
    coreTheory: [
      'Tuckman\'s Stages of Group Development: Forming, Storming, Norming, Performing, Adjourning',
      'Managing cognitive load across distributed engineering teams (Team Topologies: Stream-aligned, Complicated-subsystem, Platform, Enabling)',
      'Resolving contentious technical disputes between senior engineers through objective trade-off evaluation'
    ],
    recommendedReading: [
      'Bruce Tuckman: "Developmental Sequence in Small Groups"',
      'Matthew Skelton: "Team Topologies" (Chapter 4: Cognitive Load)',
      'Ray Dalio: "Principles: Life and Work" (Idea Meritocracy)'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Establish Contract-First Development Cadence',
        description: 'Publish OpenAPI schemas and mock event payloads upfront, allowing frontend and backend squads to develop in parallel without blocking.',
        codeOrConfigPattern: 'Mock Server: Prism or WireMock running mock dealer API endpoints based on openapi.yaml'
      },
      {
        step: 2,
        title: 'Facilitate Objective Technical Arbitration',
        description: 'Mediate an architectural disagreement between two senior engineers advocating Redis vs DynamoDB using a weighted Decision Matrix.',
        codeOrConfigPattern: 'Weighted Matrix: Operational TCO (30%), Latency SLA (40%), Data Durability (30%) -> DynamoDB wins 8.4 vs 7.1'
      },
      {
        step: 3,
        title: 'Conduct Cross-Squad Synchronization Review',
        description: 'Host bi-weekly sync between Ingestion and Search squads, reviewing interface versioning and preventing breaking schema changes.',
        codeOrConfigPattern: 'Governance: Enforce semantic versioning (SemVer) on all shared domain event schemas'
      }
    ],
    proofArtifact: 'A Cross-Squad Team Collaboration Charter & Technical Arbitration Case Study.'
  },

  'lead-dei': {
    coreTheory: [
      'Cognitive Diversity in Architecture: Leveraging varied backgrounds to uncover systemic blind spots and edge-case failure modes',
      'Mitigating Unconscious Bias in hiring, promotion, code reviews, and architectural decision-making',
      'Designing inclusive user experiences and accessible digital architectures (WCAG 2.1 AA standards)'
    ],
    recommendedReading: [
      'Matthew Syed: "Rebel Ideas: The Power of Diverse Thinking"',
      'W3C Web Content Accessibility Guidelines (WCAG) 2.1',
      'EPAM Diversity, Equity & Inclusion Global Charter'
    ],
    implementationMilestones: [
      {
        step: 1,
        title: 'Implement Inclusive RFC Review Process',
        description: 'Establish anonymous commenting and asynchronous feedback windows for architectural RFCs, ensuring introverted team members have equal voice.',
        codeOrConfigPattern: 'RFC Process: 5-day asynchronous review window before any synchronous meeting, soliciting input from all time zones'
      },
      {
        step: 2,
        title: 'Audit System for Accessibility & Internationalization',
        description: 'Audit the dealer portal architecture against WCAG 2.1 AA standards and internationalization requirements (multi-currency, multi-timezone).',
        codeOrConfigPattern: 'Audit: Automated Pa11y accessibility testing integrated into frontend CI/CD pipeline'
      },
      {
        step: 3,
        title: 'Lead Inclusive Technical Brainstorming Workshop',
        description: 'Facilitate a round-robin technical discovery session where every engineer is explicitly invited to propose solutions without interruption.',
        codeOrConfigPattern: 'Workshop Rule: "No idea may be critiqued until all participants have presented their initial concept."'
      }
    ],
    proofArtifact: 'An Inclusive Architectural Governance Framework & WCAG 2.1 Accessibility Audit Report.'
  }
};
