import { CompetencyItem } from '@/types';

export const SYLLABUS_DATA: CompetencyItem[] = [
  // --- AI (2 competencies) ---
  {
    id: 'ai-genai-sdlc',
    domain: 'AI',
    title: 'Applied GenAI for SDLC Efficiency',
    targetBar: 'Intermediate',
    visualBox: 2,
    analogy: 'Using an F1 pit crew power tool instead of a manual wrench: it accelerates tire changes tenfold, but the chief mechanic must inspect every lug nut before the car leaves pit lane.',
    gainVsSacrifice: 'Gain: 35-50% acceleration in boilerplate code, unit test harnesses, and draft ADR generation. Sacrifice: Risk of subtle hallucinations, security vulnerabilities, or copyright leaks if outputs are not validated with deterministic linting and peer review.',
    defenseScript30s: 'In our Cox Automotive ecosystem, I leverage GenAI as an amplified developer co-pilot strictly bound by prompt engineering templates. For example, we use LLMs to scaffold OpenAPI schemas, synthesize synthetic dealer payload fixtures, and generate unit test boundary cases. However, no AI-generated code enters production without passing automated SonarQube static analysis, OWASP scanning, and human architect review.',
    pitfalls: ['Blindly trusting LLM regular expressions', 'Pasting proprietary dealer PII into unvetted public LLM endpoints', 'Treating synthetic tests as proof of business edge-case coverage'],
    keyQuestions: ['How do you safeguard IP and dealer data when integrating GenAI in developer workflows?', 'What metrics do you use to measure real engineering velocity improvements versus code churn?']
  },
  {
    id: 'ai-architecture',
    domain: 'AI',
    title: 'AI Architecture',
    targetBar: 'Novice',
    visualBox: 1,
    analogy: 'A modular sound-system amplifier plugged into your home theater: you do not need to invent the transistor, but you must know how input impedances, latency, and power ratings connect to your existing TV.',
    gainVsSacrifice: 'Gain: Ability to evaluate RAG pipelines, model inference hosting, and vector search embeddings without needing a PhD in neural training. Sacrifice: Abstracting away low-level tensor optimizations in favor of API-level consumption and latency budgeting.',
    defenseScript30s: 'At the B1 Software Architect level, my AI Architecture focus is on reliable integration patterns: embedding model inference via managed endpoints like AWS Bedrock or SageMaker, establishing caching layers using Redis for prompt-completion pairs, and isolating non-deterministic model behavior behind strict API contracts and fallback fall-throughs.',
    pitfalls: ['Underestimating p99 inference latency in synchronous user request paths', 'Ignoring vector database cold starts and indexing costs'],
    keyQuestions: ['When would you choose a vector search pattern over Elasticsearch keyword BM25 scoring?', 'How do you structure fallback mechanisms when an AI inference endpoint throttles?']
  },

  // --- Business (4 competencies) ---
  {
    id: 'biz-needs-id',
    domain: 'Business',
    title: 'Business Needs Identification',
    targetBar: 'Novice',
    visualBox: 1,
    analogy: 'A physician asking about symptoms and daily habits rather than immediately writing a prescription for whatever drug the patient saw on a billboard.',
    gainVsSacrifice: 'Gain: Designing solutions that solve root revenue or operational friction. Sacrifice: Taking time to probe business stakeholders rather than jumping straight into code or cloud diagrams.',
    defenseScript30s: 'When Cox Automotive dealer syndication feeds showed high dropout rates, the initial request was "increase server capacity". Through stakeholder discovery, I identified the true business need: dealers needed immediate acknowledgment that their CSV was queued, with downstream asynchronous validation, not a synchronous 30-second blocking HTTP call.',
    pitfalls: ['Confusing a stakeholder-requested feature with the underlying business objective', 'Translating vague desires directly into architectural complexity'],
    keyQuestions: ['How do you uncover hidden business constraints behind a feature ticket?', 'Can you describe a time when you reframed a technical request into a business capability?']
  },
  {
    id: 'biz-alignment',
    domain: 'Business',
    title: 'Business Alignment',
    targetBar: 'Novice',
    visualBox: 1,
    analogy: 'Adjusting ship sails to match the commercial trade wind rather than fighting the current to show off complex nautical maneuvers.',
    gainVsSacrifice: 'Gain: Architectural investments directly accelerate business OKRs (time-to-market, cost-per-listing). Sacrifice: Postponing purely theoretical refactorings that lack measurable business ROI.',
    defenseScript30s: 'Every architectural decision I document in an ADR directly ties back to business drivers. On our syndication platform, adopting DynamoDB on-demand capacity was aligned directly with seasonal dealer surge cycles: it reduced idle AWS spend by 42% during overnight troughs while flawlessly handling morning inventory dumps.',
    pitfalls: ['Over-engineering microservices without considering team delivery topology (Conway’s Law)', 'Prioritizing tech trends over client fiscal constraints'],
    keyQuestions: ['How do you justify technical debt payoff to a non-technical product manager?', 'How do you measure cloud infrastructure ROI against revenue metrics?']
  },
  {
    id: 'biz-define-goals',
    domain: 'Business',
    title: 'Define Business Goals',
    targetBar: 'Novice',
    visualBox: 1,
    analogy: 'Setting a clear race finish line with a digital stopwatch instead of saying "let’s just run fast somewhere".',
    gainVsSacrifice: 'Gain: Measurable, testable success criteria that prevent scope creep. Sacrifice: Forcing product owners to commit to explicit numbers early.',
    defenseScript30s: 'I collaborate with product managers to transform qualitative desires like "fast inventory updates" into quantified business metrics: "95% of dealer price updates syndicated to consumer portals within 10 seconds of feed ingestion at an operational cost under $0.002 per vehicle record".',
    pitfalls: ['Accepting vague SLAs without error budget definitions', 'Failing to establish baseline metrics before kicking off re-architecture'],
    keyQuestions: ['How do you translate a vague business requirement into quantifiable non-functional constraints?', 'What is your process for establishing service level objectives (SLOs)?']
  },
  {
    id: 'biz-stakeholder-mgmt',
    domain: 'Business',
    title: 'Stakeholder Management',
    targetBar: 'Novice',
    visualBox: 1,
    analogy: 'A translator who speaks fluent engineering to the dev team, financial risk to the CFO, and user experience to the product director.',
    gainVsSacrifice: 'Gain: Cross-functional consensus, minimal mid-project churn, and transparent trade-offs. Sacrifice: Extra time invested in tailoring architectural documentation for disparate audiences.',
    defenseScript30s: 'I practice targeted communication across three tiers: For engineering, I provide C4 Component models and sequence diagrams; for product owners, I present user story impact and release milestones; for executive stakeholders, I condense decisions into cost, risk, and delivery timelines within our ADR summaries.',
    pitfalls: ['Using heavy technical jargon in business committee presentations', 'Surprising stakeholders with breaking trade-offs at launch'],
    keyQuestions: ['How do you resolve conflicting priorities between Security and Product Delivery timelines?', 'How do you communicate a critical architectural risk to a non-technical client executive?']
  },

  // --- Solution Arch (7 competencies) ---
  {
    id: 'sol-arch-core',
    domain: 'Solution Arch',
    title: 'Solution Architecture (Core)',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'Designing the structural blueprint of an airport: orchestrating how luggage (data), passengers (requests), security (auth), and fuel (compute) flow without terminal gridlock.',
    gainVsSacrifice: 'Gain: Cohesive, scalable end-to-end topology meeting all functional and non-functional requirements. Sacrifice: High upfront design effort and vigilance against accidental coupling.',
    defenseScript30s: 'As a B1 Software Architect, my core solution architecture responsibility is translating complex domain requirements into robust, decoupled technical systems. In our Cox Automotive project, I designed the event-driven ingestion pipeline handling 2,500 RPS peak by decoupling ingestion from processing via Amazon SQS and ECS Fargate workers, delivering a sub-150ms search latency SLA.',
    pitfalls: ['Designing an architecture without quantifying data volumes and peak rates', 'Ignoring deployment, observability, and rollback mechanisms in the initial topology'],
    keyQuestions: ['Walk us through your end-to-end design for high-throughput batch ingestion.', 'How do you validate that an architectural solution satisfies both availability and consistency SLAs?']
  },
  {
    id: 'sol-arch-best-practices',
    domain: 'Solution Arch',
    title: 'Solution architecture Best practices',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'Adhering to municipal building codes: every electrical outlet is grounded, fire exits are unobstructed, and load-bearing walls are documented.',
    gainVsSacrifice: 'Gain: High system reliability, secure zero-trust boundaries, automated auditability. Sacrifice: Strict adherence requires rigorous CI/CD gates and team discipline.',
    defenseScript30s: 'I enforce EPAM and AWS Well-Architected Framework pillars across all components: loose coupling via asynchronous messaging, automated blue-green deployments, centralized structured logging via OpenTelemetry, and least-privilege IAM roles. Every database connection is pooled, and every external HTTP call is wrapped in circuit breakers with defined timeouts.',
    pitfalls: ['Relying on tribal knowledge instead of formalized architectural patterns', 'Treating non-functional testing as an afterthought before release'],
    keyQuestions: ['How do you implement the Reliability Pillar of the AWS Well-Architected Framework in a serverless application?', 'What architectural review checkpoints do you embed in your team’s delivery lifecycle?']
  },
  {
    id: 'sol-arch-doc-c4-adr',
    domain: 'Solution Arch',
    title: 'Documenting architecture (C4/ADR)',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'Google Maps zoom levels (World -> Country -> City -> Street View) combined with a judicial record explaining why a legal precedent was set.',
    gainVsSacrifice: 'Gain: Immediate architectural comprehension for developers and stakeholders; historical transparency that prevents endless circular debates. Sacrifice: Maintenance effort to keep diagrams and ADRs synchronized with code.',
    defenseScript30s: 'I document systems using the C4 model: Level 1 System Context for business stakeholders, Level 2 Container for infrastructure teams, and Level 3 Component for day-to-day developers. Concurrently, every consequential decision is committed to git as an ADR detailing Context, Decision, Consequences (Gain vs. Sacrifice), and Rejected Alternatives—such as our ADR-01 choosing DynamoDB over Aurora MySQL.',
    pitfalls: ['Creating monolithic 80-page Word documents that become stale within two weeks', 'Writing ADRs that list decisions without recording rejected alternatives or trade-offs'],
    keyQuestions: ['Why do you use the C4 model over classic unstructured Visio diagrams?', 'What criteria determine whether a technical decision warrants an ADR?']
  },
  {
    id: 'sol-arch-fr-nfr',
    domain: 'Solution Arch',
    title: 'Design and develop for FR/NFR',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'Building a sports car: Functional requirements define that it turns, accelerates, and brakes; Non-functional requirements dictate that it must survive 150 mph without overheating and achieve 5-star crash safety.',
    gainVsSacrifice: 'Gain: Eliminates production outages and performance bottlenecks by designing for stress from day one. Sacrifice: Additional engineering complexity upfront in caching, retries, and partitioning.',
    defenseScript30s: 'I treat NFRs as first-class architectural constraints. For our vehicle syndication engine, functional delivery of price updates meant nothing if P99 search latency exceeded 150ms or availability dipped below 99.95%. I satisfied these NFRs through asynchronous SQS ingestion, DynamoDB single-table design with sub-10ms key lookups, and Algolia/OpenSearch read replicas.',
    pitfalls: ['Accepting unquantified NFRs like "the system must be fast"', 'Designing for peak throughput without budgeting for cost or network bandwidth'],
    keyQuestions: ['How do you calculate required IOPS and storage capacity from incoming RPS projections?', 'How do you design for zero data loss (RPO = 0) in an event-driven system?']
  },
  {
    id: 'sol-arch-ref-arch',
    domain: 'Solution Arch',
    title: 'Reference Architectures',
    targetBar: 'Novice',
    visualBox: 1,
    analogy: 'Using a proven architectural blueprint from a master builder rather than improvising roof truss angles on the construction site.',
    gainVsSacrifice: 'Gain: Drastically reduced risk, standardized enterprise governance, proven battle-tested patterns. Sacrifice: Requires adapting proprietary domain quirks to the standardized template.',
    defenseScript30s: 'I leverage proven cloud reference architectures—such as the AWS Serverless Web Application and Microservices Event-Driven Ingestion templates—as our starting baseline. This standardizes our API Gateway, VPC peering, and KMS encryption patterns, allowing our team to focus architectural innovation strictly on our proprietary automotive syndication logic.',
    pitfalls: ['Blindly copying a cloud vendor reference diagram without evaluating team operational readiness', 'Failing to customize reference patterns for project-specific compliance requirements'],
    keyQuestions: ['When would you diverge from an enterprise reference architecture?', 'How do you evaluate whether a cloud vendor quickstart is production-grade?']
  },
  {
    id: 'sol-arch-ddd',
    domain: 'Solution Arch',
    title: 'Domain-Driven Design (DDD)',
    targetBar: 'Intermediate',
    visualBox: 2,
    analogy: 'A company directory where Sales, Legal, and Engineering each have their own glossary: "Contract" means something different to an attorney than to an HR manager, so they keep separate filing cabinets.',
    gainVsSacrifice: 'Gain: Eliminates semantic confusion, defines clear microservice boundaries along Bounded Contexts, prevents big-ball-of-mud databases. Sacrifice: Significant cognitive effort in domain modeling and event storming.',
    defenseScript30s: 'In our Cox Automotive platform, I established distinct Bounded Contexts for Dealer Management, Vehicle Catalog, and Pricing Syndication. A "Vehicle" in the Catalog represents mechanical attributes (VIN, trim, engine), while in the Pricing context it represents financial appraisals and margin rules. This segregation ensures services evolve independently with their own aggregate roots and separate schemas.',
    pitfalls: ['Creating a single universal "God Object" entity shared across every database', 'Designing microservice boundaries around database tables instead of business subdomains'],
    keyQuestions: ['How do you identify Bounded Contexts during an Event Storming workshop?', 'What is the role of an Anti-Corruption Layer (ACL) when integrating legacy systems into a DDD architecture?']
  },
  {
    id: 'sol-arch-microservices',
    domain: 'Solution Arch',
    title: 'Microservice Architecture Style',
    targetBar: 'Intermediate',
    visualBox: 2,
    analogy: 'A fleet of independent naval tugboats rather than a single massive ocean liner: each can maneuver, refuel, and be repaired without docking the entire fleet.',
    gainVsSacrifice: 'Gain: Independent deployability, localized scaling, organizational fault isolation. Sacrifice: Distributed systems tax: eventual consistency, network latency, distributed tracing complexity, partial failure modes.',
    defenseScript30s: 'I advocate for microservices only when domain complexity and team topologies demand independent deployability. In our architecture, ingestion, catalog search, and dealer billing are isolated microservices communicating via asynchronous EventBridge events. Each service owns its database completely, eliminating direct database sharing and coupling.',
    pitfalls: ['Creating a "distributed monolith" where services synchronously call each other in tight chains', 'Adopting microservices for small teams without dedicated DevOps and observability automation'],
    keyQuestions: ['How do you prevent cascade failures in a deep microservice call graph?', 'How do you manage transactions that span across multiple microservices without 2-phase commit?']
  },

  // --- SDLC Processes (4 competencies) ---
  {
    id: 'sdlc-scrum',
    domain: 'SDLC Processes',
    title: 'Scrum',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'A sprint relay team with daily check-ins on baton passing, pacing, and track conditions, refining technique every two laps.',
    gainVsSacrifice: 'Gain: Rapid feedback loops, predictable velocity, transparent stakeholder inspection. Sacrifice: Requires disciplined backlog refinement and continuous architectural runway preparation.',
    defenseScript30s: 'As a Software Architect, I actively drive technical excellence inside Scrum ceremonies. During backlog refinement, I break down high-level architectural spikes into measurable vertical slices with explicit Definition of Done criteria (unit test coverage, ADR approval, SonarQube quality gate). I prevent architectural drift by reserving 15-20% capacity for debt remediation.',
    pitfalls: ['Allowing architects to work in an ivory tower detached from sprint cadences', 'Neglecting non-functional requirements in sprint acceptance criteria'],
    keyQuestions: ['How do you incorporate architectural spikes into two-week sprints?', 'How do you handle emergent technical debt during high-pressure sprint deliveries?']
  },
  {
    id: 'sdlc-methodologies',
    domain: 'SDLC Processes',
    title: 'SDLC Methodologies',
    targetBar: 'Intermediate',
    visualBox: 2,
    analogy: 'Selecting the right vehicle for the terrain: an off-road 4x4 (Agile/Kanban) for uncharted jungle terrain, versus a freight train (Plan-driven/Waterfall) for laying straight heavy track with fixed regulatory boundaries.',
    gainVsSacrifice: 'Gain: Aligning delivery process to project risk and stakeholder constraints. Sacrifice: Must actively resist dogmatism when requirements demand hybrid approaches.',
    defenseScript30s: 'I adapt delivery methodologies based on the uncertainty profile of the system. For our core vehicle syndication platform with shifting vendor feed formats, we run Kanban for continuous flow and fast cycle times. Conversely, for major payment gateway compliance cutovers, we implement strict stage-gated validation phases prior to production rollout.',
    pitfalls: ['Enforcing rigid Waterfall documentation in fast-moving innovation initiatives', 'Running pure cowboy agile without baseline architectural governance'],
    keyQuestions: ['When would you recommend Kanban over Scrum for an engineering team?', 'How do you govern architectural compliance in a multi-team Agile release train?']
  },
  {
    id: 'sdlc-delivery-mgmt',
    domain: 'SDLC Processes',
    title: 'Delivery Management',
    targetBar: 'Novice',
    visualBox: 1,
    analogy: 'Air traffic control monitoring runway queues, fuel reserves, and incoming storms to ensure flights land safely without holding pattern delays.',
    gainVsSacrifice: 'Gain: Transparent milestone tracking, early blocker identification, on-time client releases. Sacrifice: Time spent compiling telemetry and delivery metrics.',
    defenseScript30s: 'At the B1 level, I partner closely with Delivery Managers to monitor DORA metrics—specifically Deployment Frequency and Lead Time for Changes. When a release blocker emerges around third-party API dependencies, I architect circuit breaker mocks and feature flags that allow internal team delivery to proceed unhindered.',
    pitfalls: ['Ignoring dependency bottlenecks until release week', 'Failing to communicate technical blockers in terms of milestone slippage'],
    keyQuestions: ['How do you track and mitigate technical dependencies between distributed delivery teams?', 'What DORA metrics do you monitor to detect delivery pipeline degradation?']
  },
  {
    id: 'sdlc-estimation',
    domain: 'SDLC Processes',
    title: 'Estimation and Work Planning',
    targetBar: 'Intermediate',
    visualBox: 2,
    analogy: 'A construction estimator calculating concrete volume, steel reinforcement, and labor hours based on structural blueprints and soil test data.',
    gainVsSacrifice: 'Gain: Realistic project commitments, defensible budget allocations, reduced crunch time. Sacrifice: Requires decomposing complex architectures into atomic technical tasks before estimating.',
    defenseScript30s: 'I use a hybrid estimation model: Wideband Delphi and Planning Poker for team user stories, backed by PERT three-point estimation (Optimistic, Most Likely, Pessimistic) for high-uncertainty architectural migrations. This allows me to communicate confidence intervals—such as our 4-week DynamoDB schema migration with an 85% probability buffer.',
    pitfalls: ['Providing single-point estimates for complex, uncharted migrations', 'Omitting testing, deployment automation, and observability from task estimations'],
    keyQuestions: ['How do you estimate an architectural migration when the legacy codebase has zero documentation?', 'How do you explain the difference between accuracy and precision in engineering estimates?']
  },

  // --- Application Arch (7 competencies) ---
  {
    id: 'app-arch-dev-core',
    domain: 'Application Arch',
    title: 'Software Development (Core)',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'Mastering the physical craft of woodworking: knowing wood grain, chisel sharpness, and joinery tolerances before designing a palace.',
    gainVsSacrifice: 'Gain: High-performance code, memory efficiency, clean modularity, credible technical leadership. Sacrifice: Continual investment in staying current with modern language runtimes and asynchronous execution models.',
    defenseScript30s: 'My architectural decisions are grounded in hands-on mastery of modern TypeScript and Node.js runtimes. In our Cox Automotive ingestion engine, I architected the asynchronous pipeline using Node event loops, backpressured streams, and non-blocking I/O, ensuring zero event-loop starvation while processing 2,500 payload updates per second.',
    pitfalls: ['Architects who design systems without understanding runtime concurrency and memory overhead', 'Blocking the Node.js event loop with CPU-heavy cryptographic or JSON operations'],
    keyQuestions: ['How do you diagnose and prevent event loop lag in high-throughput Node.js services?', 'What memory leak profiling techniques do you use in containerized V8 applications?']
  },
  {
    id: 'app-arch-core',
    domain: 'Application Arch',
    title: 'Software Architecture (Core)',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'Designing the internal skeletal framework of a skyscraper: beams and trusses engineered to distribute weight and absorb earthquake vibrations.',
    gainVsSacrifice: 'Gain: Software components with high cohesion, low coupling, and clear boundaries that withstand rapid feature evolution. Sacrifice: Requires disciplined architectural reviews and refactoring vigilance.',
    defenseScript30s: 'I structure application codebases using Hexagonal Architecture (Ports and Adapters). Core domain logic—such as vehicle valuation algorithms and inventory validation—is kept pure and isolated from external dependencies like AWS SDKs, DynamoDB clients, or HTTP frameworks. This ensures 100% unit-testability without spinning up mock cloud containers.',
    pitfalls: ['Allowing infrastructure frameworks (e.g., ORMs, AWS libraries) to bleed into core domain entities', 'Circular dependencies between internal application modules'],
    keyQuestions: ['How does Hexagonal Architecture differ from traditional 3-tier layered architecture?', 'How do you enforce architectural dependency rules automatically in CI/CD?']
  },
  {
    id: 'app-arch-styles',
    domain: 'Application Arch',
    title: 'Software Architectural Styles',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'Choosing an architectural style for a building: Gothic Cathedral with towering arches vs. Modernist Steel Cube vs. Modular Pods—each fits a distinct environment and purpose.',
    gainVsSacrifice: 'Gain: Selecting the exact structural paradigm (Event-Driven, Monolithic, Microservices, CQRS, Pipe-and-Filter) suited to performance and business drivers. Sacrifice: Avoiding one-size-fits-all architectural trends.',
    defenseScript30s: 'I select architectural styles strictly based on system trade-offs: We chose an Event-Driven, Pipe-and-Filter style for the Cox Automotive ingestion pipeline to maximize throughput and allow independent worker scaling. Conversely, for our internal administrative dealer dashboard, we maintained a Modular Monolith to optimize developer ergonomics and instant ACID consistency.',
    pitfalls: ['Defaulting to microservices for simple CRUD business applications', 'Using synchronous REST requests inside an event-driven data streaming pipeline'],
    keyQuestions: ['Compare the trade-offs between Event-Driven Architecture and Request-Driven REST.', 'When is a Modular Monolith superior to Microservices for an enterprise team?']
  },
  {
    id: 'app-arch-patterns',
    domain: 'Application Arch',
    title: 'Design patterns [Software Engineering]',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'Standardized mechanical gears, cams, and ratchets: interchangeable mechanical components proven over centuries to solve specific rotational problems.',
    gainVsSacrifice: 'Gain: Reusable, battle-tested solutions to recurring software design challenges; shared technical vocabulary across engineering squads. Sacrifice: Risk of pattern overuse leading to unnecessary abstraction layers.',
    defenseScript30s: 'I apply classic GoF and enterprise patterns pragmatically: Factory and Strategy patterns encapsulate disparate third-party dealer syndication formats; the Circuit Breaker and Retry-with-Jitter patterns protect external valuation APIs; and the Unit of Work pattern guarantees atomic state transitions in our local repositories.',
    pitfalls: ['Over-engineering simple logic with 5 layers of factories and singletons', 'Misusing the Singleton pattern in multi-threaded or distributed container environments'],
    keyQuestions: ['How do you implement the Strategy pattern to handle polymorphic payload ingestion in TypeScript?', 'What is the danger of using the Singleton pattern in a serverless AWS Lambda environment?']
  },
  {
    id: 'app-arch-application',
    domain: 'Application Arch',
    title: 'Application Architecture',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'The internal plumbing, HVAC ducting, and electrical wiring plan for an individual apartment building floor.',
    gainVsSacrifice: 'Gain: Predictable data flow, modular state management, maintainable component lifecycle. Sacrifice: Requires establishing and enforcing code structure conventions across squads.',
    defenseScript30s: 'In our application architecture, I establish strict layer isolation: presentation controllers handle HTTP serialization and authentication; application services orchestrate use-cases and transactions; domain services execute business invariants; and infrastructure adapters manage persistence and cloud SDKs. This separation guarantees that our core business logic remains independent of AWS infrastructure changes.',
    pitfalls: ['Allowing database queries to be written directly inside UI controllers or Lambda handlers', 'Inconsistent error handling and validation logic scattered across multiple layers'],
    keyQuestions: ['How do you prevent business logic leakage into API Gateway Lambda handlers?', 'How do you design a unified domain error handling hierarchy across all application layers?']
  },
  {
    id: 'app-arch-uml',
    domain: 'Application Arch',
    title: 'UML',
    targetBar: 'Intermediate',
    visualBox: 2,
    analogy: 'Standardized electrical engineering schematics: an engineer anywhere in the world knows what a capacitor, diode, and resistor symbol means without explanation.',
    gainVsSacrifice: 'Gain: Unambiguous communication of complex interaction flows, state machines, and class hierarchies. Sacrifice: Time required to author formal diagrams; must avoid pedantic over-specification.',
    defenseScript30s: 'I utilize UML pragmatically for high-value architectural communication: Sequence diagrams to illustrate complex asynchronous token handshakes and SQS backpressure retry flows; State Machine diagrams to model the vehicle lifecycle from "Pending Appraisal" to "Syndicated" and "Sold"; and Class diagrams for critical domain aggregates.',
    pitfalls: ['Spending weeks creating exhaustive UML models that are never maintained', 'Using non-standard custom shapes that confuse external review committees'],
    keyQuestions: ['How do you model an asynchronous event-driven workflow using UML Sequence Diagrams?', 'When is a UML State Machine diagram essential for documenting business logic?']
  },
  {
    id: 'app-arch-databases',
    domain: 'Application Arch',
    title: 'Databases',
    targetBar: 'Intermediate',
    visualBox: 2,
    analogy: 'A specialized warehouse inventory system: a high-speed conveyor belt (NoSQL key-value) for millions of identical boxes vs. a bank vault with meticulous double-entry ledgers (Relational ACID).',
    gainVsSacrifice: 'Gain: Sub-second query performance and horizontal scalability aligned to access patterns. Sacrifice: Loss of ad-hoc SQL joins in NoSQL; must design tables strictly around predefined queries.',
    defenseScript30s: 'Database selection is governed by query patterns and consistency requirements. For Cox Automotive catalog lookups at 2,500 RPS, I implemented DynamoDB single-table design with compound keys (PK: DEALER#id, SK: VEHICLE#vin), achieving single-digit millisecond latency. For financial ledger transactions requiring multi-row ACID guarantees, I integrate AWS Aurora PostgreSQL.',
    pitfalls: ['Attempting to use DynamoDB like a relational database with scan operations', 'Ignoring database connection limits in serverless Lambda environments'],
    keyQuestions: ['Explain the trade-offs of Single-Table Design in DynamoDB versus Multi-Table Relational modeling.', 'How do you handle schema evolution and index backfills in a production DynamoDB table with 50M records?']
  },

  // --- Cloud (3 competencies) ---
  {
    id: 'cloud-design-patterns',
    domain: 'Cloud',
    title: 'Cloud Design Patterns',
    targetBar: 'Intermediate',
    visualBox: 2,
    analogy: 'Installing automated shock absorbers, surge protectors, and water reservoirs in a house built in an earthquake zone.',
    gainVsSacrifice: 'Gain: High fault tolerance, zero-downtime elasticity, graceful degradation under failure. Sacrifice: Operational overhead of configuring distributed monitoring and retry budgets.',
    defenseScript30s: 'I routinely architect with cloud patterns: the Queue-Based Load Leveling pattern using SQS buffers sudden 5x dealer syndication spikes; the Cache-Aside pattern with Redis shields primary databases; the Circuit Breaker pattern isolates third-party valuation APIs; and the Compensating Transaction pattern safely rolls back distributed multi-step reservations.',
    pitfalls: ['Implementing retries without exponential backoff and jitter, creating thundering herd outages', 'Omitting Dead Letter Queues (DLQ) in asynchronous messaging topologies'],
    keyQuestions: ['How does Queue-Based Load Leveling protect downstream databases during traffic spikes?', 'Describe how you implement the Cache-Aside pattern to prevent cache stampedes.']
  },
  {
    id: 'cloud-migration',
    domain: 'Cloud',
    title: 'Cloud Migration',
    targetBar: 'Novice',
    visualBox: 1,
    analogy: 'Moving a bustling restaurant to a modern building across the street without missing a single lunch order: cooking in both kitchens during the transition.',
    gainVsSacrifice: 'Gain: Modernized infrastructure, cloud elasticity, reduced on-premise hardware maintenance. Sacrifice: Dual-run operational costs and data synchronization complexity during migration windows.',
    defenseScript30s: 'For legacy systems, I implement the Strangler Fig pattern paired with Change Data Capture (CDC). In our inventory migration, we attached Debezium to the legacy on-premise SQL database, streaming transaction logs via Kafka into our AWS DynamoDB ingestion pipeline, verifying data parity for two weeks before flipping DNS traffic.',
    pitfalls: ['Attempting a "Big Bang" cutover over a weekend without a tested rollback plan', 'Underestimating cloud data transfer and egress costs during dual-run phases'],
    keyQuestions: ['What are the 6 Rs of cloud migration (Rehost, Replatform, Refactor, Repurchase, Retain, Retire)?', 'How do you validate zero data loss when migrating from an on-premise SQL database to AWS cloud?']
  },
  {
    id: 'cloud-platforms',
    domain: 'Cloud',
    title: 'Cloud Platforms',
    targetBar: 'Intermediate',
    visualBox: 2,
    analogy: 'A commercial industrial park providing power grids, water lines, physical security, and waste management so factories can focus purely on manufacturing goods.',
    gainVsSacrifice: 'Gain: Massive operational velocity, global availability, fully managed auto-scaling infrastructure. Sacrifice: Cloud provider lock-in and potential bill shock if cost governance is absent.',
    defenseScript30s: 'My primary platform is AWS, where I architect solutions leveraging ECS Fargate for containerized microservices, API Gateway for throttling and JWT validation, SQS and EventBridge for messaging, DynamoDB for high-throughput persistence, and CloudWatch with AWS X-Ray for distributed tracing and alarm thresholds.',
    pitfalls: ['Over-reliance on vendor-specific proprietary features without abstraction layers', 'Neglecting AWS FinOps: leaving unattached EBS volumes or un-configured S3 lifecycle rules'],
    keyQuestions: ['How do you architect for multi-AZ high availability with a 99.95% uptime SLA on AWS?', 'What criteria guide your choice between AWS Lambda and AWS ECS Fargate for containerized workloads?']
  },

  // --- Leadership & Soft (11 competencies) ---
  {
    id: 'lead-english',
    domain: 'Leadership & Soft',
    title: 'English Proficiency',
    targetBar: 'NAT B2',
    visualBox: 2,
    analogy: 'Speaking with clarity, precision, and confidence in a global control room where ambiguity can lead to misunderstood orders.',
    gainVsSacrifice: 'Gain: Effortless collaboration with international clients, clear committee defense, persuasive architectural reasoning. Sacrifice: Daily practice in structuring technical arguments concisely.',
    defenseScript30s: 'I communicate architectural decisions using structured B2/C1 English frameworks: stating the context, presenting quantifiable options, highlighting trade-offs (Gain vs. Sacrifice), and concluding with a clear, defensible recommendation. This ensures unambiguous alignment across global engineering squads and client stakeholders.',
    pitfalls: ['Rambling without a structured framework', 'Failing to define technical acronyms when speaking to cross-cultural panels'],
    keyQuestions: ['Can you summarize your architectural philosophy in three concise sentences?', 'How do you structure an argument when challenging an executive client’s technical assumption?']
  },
  {
    id: 'lead-consultancy',
    domain: 'Leadership & Soft',
    title: 'Consultancy',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'A trusted legal counsel: understanding the client’s commercial interests, evaluating legal exposure, and offering options with transparent risk assessments rather than just saying "yes" to everything.',
    gainVsSacrifice: 'Gain: High client trust, strategic partnership, proactive risk avoidance. Sacrifice: Must courageously challenge client misconceptions and navigate difficult commercial conversations.',
    defenseScript30s: 'In client engagements, I operate as a trusted technical advisor. When Cox Automotive leadership contemplated a multi-region active-active relational database setup, I demonstrated through latency models and licensing math that the operational complexity and split-brain risk outweighed their business needs, successfully steering them toward an active-passive pilot with DynamoDB global tables.',
    pitfalls: ['Acting as an order-taker who implements flawed client requests without professional pushback', 'Recommending bleeding-edge technologies that the client’s team cannot operate'],
    keyQuestions: ['How do you handle a client who insists on an inappropriate technology choice?', 'How do you conduct an architectural discovery workshop with resistant client stakeholders?']
  },
  {
    id: 'lead-ownership',
    domain: 'Leadership & Soft',
    title: 'Ownership',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'A homeowner who fixes a leaking roof immediately rather than a tenant who ignores the drip because "it’s not my problem".',
    gainVsSacrifice: 'Gain: End-to-end accountability, zero production blind spots, high engineering squad morale. Sacrifice: Personal accountability for outages and architecture shortcomings.',
    defenseScript30s: 'I take full lifecycle ownership of systems I design—from the initial ADR and threat model to production observability and on-call escalation runbooks. When our syndication worker experienced memory spikes under unannounced vendor feed formatting changes, I stayed with the squad, diagnosed the V8 JSON parser bottleneck, and deployed streaming chunking within four hours.',
    pitfalls: ['Handing off diagrams to developers and disappearing before production deployment', 'Blaming third-party vendors or junior engineers when outages occur'],
    keyQuestions: ['Tell me about a time an architecture you designed failed in production. How did you take ownership?', 'How do you ensure operational supportability is designed into systems from day one?']
  },
  {
    id: 'lead-leadership',
    domain: 'Leadership & Soft',
    title: 'Leadership',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'A mountain expedition guide: carving the trail, setting the pace, ensuring everyone has proper gear, and keeping the team focused on the summit through blizzards.',
    gainVsSacrifice: 'Gain: Unified architectural direction, motivated engineering teams, high technical velocity. Sacrifice: Shifting time away from solo coding to mentoring, code reviews, and alignment.',
    defenseScript30s: 'True architectural leadership is influence without authority. I guide 15+ distributed engineers by establishing clear architectural guardrails, authoring RFC design proposals, running weekly architecture katas, and championing peer reviews. This empowers developers to make sound local decisions while maintaining global system cohesion.',
    pitfalls: ['Dictating architectural mandates top-down without team buy-in', 'Creating an environment where engineers fear asking questions or proposing alternative designs'],
    keyQuestions: ['How do you align multiple disagreeing senior engineers on a contentious architectural choice?', 'How do you foster a culture of quality and architectural vigilance within delivery squads?']
  },
  {
    id: 'lead-communication',
    domain: 'Leadership & Soft',
    title: 'Communication',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'An audio mixing console: adjusting frequencies and volume levels so the melody is crisp and appealing whether played on studio monitors or phone speakers.',
    gainVsSacrifice: 'Gain: Eliminates misunderstandings, aligns diverse teams, builds executive confidence. Sacrifice: Requires deliberate preparation and empathy for different listener perspectives.',
    defenseScript30s: 'I tailor architectural communication using the Rule of Three and Pyramid Principle: starting with the executive conclusion or recommendation, followed by three supporting arguments (Cost, Reliability, Velocity), and drilling into technical specifications only when prompted by technical leads.',
    pitfalls: ['Drowning senior leadership in low-level code implementation details', 'Writing vague documentation that leaves critical integration requirements open to interpretation'],
    keyQuestions: ['How do you explain the trade-offs of microservices to a non-technical Chief Financial Officer?', 'How do you run an effective Architectural Review Board (ARB) presentation?']
  },
  {
    id: 'lead-adaptability',
    domain: 'Leadership & Soft',
    title: 'Adaptability',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'A martial artist shifting stance seamlessly when an opponent shifts from a strike to a grapple: fluid, balanced, and responsive.',
    gainVsSacrifice: 'Gain: Rapid pivot capability in shifting market conditions or cloud disruptions. Sacrifice: Must gracefully discard sunk-cost architectural investments when parameters change.',
    defenseScript30s: 'When third-party automotive data providers abruptly announced rate limits and websocket deprecations, our initial synchronous ingestion architecture was invalidated. Within 48 hours, I re-architected the ingestion boundary using SQS buffering and scheduled batch consumers, preventing project milestone slippage.',
    pitfalls: ['Clinging to an outdated design due to sunk cost fallacy', 'Panicking when client requirements pivot midway through development'],
    keyQuestions: ['Describe an occasion where a sudden business pivot broke your architectural design. How did you adapt?', 'How do you build modularity into architectures to absorb future unknowns?']
  },
  {
    id: 'lead-business-acumen',
    domain: 'Leadership & Soft',
    title: 'Business Acumen',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'Understanding that a Formula 1 racing team’s goal is not merely to build the fastest car, but to win championships and maximize sponsorship revenue within cost-cap regulations.',
    gainVsSacrifice: 'Gain: Architectures that directly maximize revenue, protect margins, and optimize cloud run-rates. Sacrifice: Restraining the urge to adopt expensive, fashionable tech stacks that yield negative business value.',
    defenseScript30s: 'I connect technical decisions directly to P&L impacts. In Cox Automotive, optimizing our DynamoDB access patterns and S3 tiered storage lifecycle reduced monthly AWS syndication expenses by $18,000, while lowering dealer onboarding turnaround from 4 days to 20 minutes, directly contributing to customer retention.',
    pitfalls: ['Evaluating architectural success purely on code elegance while cloud bills escalate uncontrollably', 'Failing to understand the client’s business revenue model and customer acquisition cost'],
    keyQuestions: ['How do you calculate Total Cost of Ownership (TCO) for a cloud-native architecture?', 'How do architectural decisions impact customer churn and lifetime value?']
  },
  {
    id: 'lead-team-player',
    domain: 'Leadership & Soft',
    title: 'Being a Team Player',
    targetBar: 'Intermediate',
    visualBox: 2,
    analogy: 'A basketball point guard: setting screens, making assists, and passing the ball to the open shooter rather than trying to shoot every basket.',
    gainVsSacrifice: 'Gain: High squad trust, frictionless collaboration, collective velocity. Sacrifice: Subordinating personal pride to collective squad success.',
    defenseScript30s: 'As an architect, I am an active enabler of the squad. I roll up my sleeves to write critical test harnesses, pair with junior engineers on difficult bug investigations, and unblock PR reviews during sprint crunches. I view my success as a direct function of the squad’s ability to deliver with confidence.',
    pitfalls: ['Refusing to engage with routine development or debugging tasks ("that’s below an architect")', 'Creating architectural bottlenecks by requiring personal sign-off on every trivial code change'],
    keyQuestions: ['How do you balance high-level architectural design with supporting day-to-day squad delivery?', 'Describe a situation where you compromised your ideal architectural preference for the good of the team.']
  },
  {
    id: 'lead-dev-others',
    domain: 'Leadership & Soft',
    title: 'Developing Others',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'A master craftsman taking on apprentices: guiding their hands on the lathe until they can carve intricate furniture independently.',
    gainVsSacrifice: 'Gain: Multiplied engineering capacity, internal talent retention, reduced architectural bus factor. Sacrifice: Significant time investment in mentoring and feedback.',
    defenseScript30s: 'I actively mentor Senior and Lead Engineers toward B1 architecture readiness: I conduct mock architectural reviews, guide them through writing their first ADRs, and delegate ownership of subsystem designs. Over the past two years, I have mentored three engineers who successfully stepped up to lead roles within EPAM.',
    pitfalls: ['Hoarding architectural knowledge and decision-making power', 'Providing vague feedback instead of actionable technical coaching'],
    keyQuestions: ['How do you mentor a senior engineer who wants to transition into an architect role?', 'How do you conduct an architectural code review that teaches rather than criticizes?']
  },
  {
    id: 'lead-managing-teamwork',
    domain: 'Leadership & Soft',
    title: 'Managing Teamwork',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'An orchestra conductor: ensuring the percussion, strings, and brass enter at the exact right bar and tempo to produce harmony rather than noise.',
    gainVsSacrifice: 'Gain: Synchronized multi-stream delivery, clear work decomposition, minimized merge conflicts. Sacrifice: Constant communication and proactive dependency synchronization.',
    defenseScript30s: 'I orchestrate engineering teamwork by establishing clear interface contracts and mocks early. By defining OpenAPI schemas and mock event payloads upfront, frontend, backend, and data engineering teams work in parallel without blocking each other, shortening feature integration cycles from weeks to days.',
    pitfalls: ['Allowing teams to work in silos without agreed integration contracts', 'Failing to notice interpersonal friction that impedes technical collaboration'],
    keyQuestions: ['How do you organize work across front-end, back-end, and QA to enable parallel development?', 'How do you resolve architectural disputes between two strong technical leads?']
  },
  {
    id: 'lead-dei',
    domain: 'Leadership & Soft',
    title: 'Diversity, Equity, and Inclusion',
    targetBar: 'Advanced',
    visualBox: 3,
    analogy: 'A diverse investment portfolio: investing across varied asset classes creates resilience, mitigates systemic blind spots, and produces higher long-term returns than a monolithic bet.',
    gainVsSacrifice: 'Gain: Varied perspectives that catch usability and architectural edge cases, higher innovation, psychological safety. Sacrifice: Requires intentional effort to ensure all voices are solicited and respected.',
    defenseScript30s: 'In my architectural governance, I deliberately cultivate psychological safety so engineers of all backgrounds, geographic zones, and tenures actively voice concerns. In our architecture forums, we use anonymous RFC commenting and round-robin retrospectives to ensure introverted or junior team members critique designs without fear of hierarchy.',
    pitfalls: ['Allowing loud or aggressive personalities to dominate technical discussions', 'Assuming that silence in architectural meetings indicates unanimous agreement'],
    keyQuestions: ['How do you ensure equitable participation during technical design sessions in distributed global teams?', 'How does cognitive diversity improve the resiliency and usability of software architectures?']
  }
];
