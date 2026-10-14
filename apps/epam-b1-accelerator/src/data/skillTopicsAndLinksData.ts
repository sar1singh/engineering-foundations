import { TopicItem, ExternalResourceLink } from '@/types';

export interface SkillStudyGuide {
  topicsToCover: TopicItem[];
  externalLinks: ExternalResourceLink[];
}

export const SKILL_TOPICS_AND_LINKS_DATA: Record<string, SkillStudyGuide> = {
  // ==========================================
  // DOMAIN 1: SOLUTION ARCHITECTURE (7 Skills)
  // ==========================================
  'sa-fundamentals': {
    topicsToCover: [
      {
        id: 'sa-fund-1',
        title: 'Architectural Thinking & NFR Quantification',
        keyConcepts: ['Quantifying ambiguity into measurable SLAs', 'Latency budgets (P95 vs P99)', 'Availability calculation (99.9% vs 99.95%)', 'RPO=0 vs RTO<15m disaster boundaries']
      },
      {
        id: 'sa-fund-2',
        title: 'Gain vs. Sacrifice Trade-Off Defense',
        keyConcepts: ['Why every architectural choice is a trade-off', 'CAP Theorem implications in practice', 'Cost vs. Availability Pareto curves', 'Avoiding premature optimization']
      },
      {
        id: 'sa-fund-3',
        title: 'C4 Model Visual Communication',
        keyConcepts: ['Context diagram (System boundary & actors)', 'Container diagram (Services, DBs, queues)', 'Component diagram (Internal module coupling)', 'Code diagram (When and when NOT to use)']
      }
    ],
    externalLinks: [
      {
        title: 'AWS Well-Architected Framework: Reliability Pillar',
        url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html',
        provider: 'AWS Architecture',
        description: 'Official AWS guide on calculating failure domains, fault isolation, and RTO/RPO trade-offs.'
      },
      {
        title: 'The C4 Model for Visualising Software Architecture',
        url: 'https://c4model.com/',
        provider: 'Distributed Systems / DDIA',
        description: 'Simon Brown’s canonical specification for Context, Container, and Component diagrams.'
      },
      {
        title: 'Martin Fowler: "Architecture is about the Important Stuff"',
        url: 'https://martinfowler.com/architecture/',
        provider: 'Martin Fowler',
        description: 'Foundational architectural essay on defining architectural significance and avoiding hand-waving.'
      }
    ]
  },

  'sa-system-analysis': {
    topicsToCover: [
      {
        id: 'sa-sys-1',
        title: 'Reverse Engineering & Monolith Deconstruction',
        keyConcepts: ['Static code analysis & dependency graphing', 'Database schema reverse engineering', 'Identifying hidden temporal coupling', 'Extracting domain models from legacy SQL']
      },
      {
        id: 'sa-sys-2',
        title: 'Domain-Driven Design (DDD) Bounded Contexts',
        keyConcepts: ['Context mapping (Upstream/Downstream, Partnership, Shared Kernel)', 'Aggregate root identification', 'Ubiquitous Language enforcement', 'Anticorruption Layers (ACL)']
      }
    ],
    externalLinks: [
      {
        title: 'Martin Fowler: Bounded Context in Domain-Driven Design',
        url: 'https://martinfowler.com/bliki/BoundedContext.html',
        provider: 'Martin Fowler',
        description: 'Clear architectural explanation of identifying service boundaries without creating distributed monoliths.'
      },
      {
        title: 'Microsoft Cloud Design Patterns: Anti-Corruption Layer',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer',
        provider: 'Microsoft Learn',
        description: 'Pattern for mediating communication between modern microservices and legacy monolithic subsystems.'
      }
    ]
  },

  'sa-tech-concepts': {
    topicsToCover: [
      {
        id: 'sa-tech-1',
        title: 'Distributed Transactions & Sagas',
        keyConcepts: ['Why 2-Phase Commit (2PC) fails in modern cloud', 'Orchestration vs Choreography Sagas', 'Compensating transactions & idempotency', 'Semantic locking and pivot transactions']
      },
      {
        id: 'sa-tech-2',
        title: 'Event-Driven Architectures & Backpressure',
        keyConcepts: ['Asynchronous decoupled messaging (SQS/Kafka)', 'Backpressure buffering against burst traffic', 'Eventual consistency latency defense', 'Dead Letter Queue (DLQ) triage']
      }
    ],
    externalLinks: [
      {
        title: 'AWS Architecture Blog: Building a Serverless Saga Pattern',
        url: 'https://aws.amazon.com/blogs/compute/building-a-serverless-distributed-application-using-a-saga-pattern/',
        provider: 'AWS Architecture',
        description: 'Implementing distributed transaction orchestration with AWS Step Functions and Lambda.'
      },
      {
        title: 'Martin Fowler: Event-Driven Architecture Patterns',
        url: 'https://martinfowler.com/articles/201701-event-driven.html',
        provider: 'Martin Fowler',
        description: 'Detailed analysis of Event Sourcing, Event-Carried State Transfer, and CQRS.'
      }
    ]
  },

  'sa-design': {
    topicsToCover: [
      {
        id: 'sa-des-1',
        title: 'DynamoDB Single-Table Design Architecture',
        keyConcepts: ['Pre-computing data adjacency', 'Composite Partition (PK) and Sort (SK) keys', 'Global Secondary Index (GSI) overloading', 'Sparse indexes and one-to-many lookups']
      },
      {
        id: 'sa-des-2',
        title: 'Transactional Outbox & Change Data Capture (CDC)',
        keyConcepts: ['Avoiding dual-write inconsistency', 'DynamoDB Streams & EventBridge ingestion', 'At-least-once to exactly-once filtering', 'Asynchronous projection updates']
      }
    ],
    externalLinks: [
      {
        title: 'Alex DeBrie: The What, Why, and When of DynamoDB Single-Table Design',
        url: 'https://www.alexdebrie.com/posts/dynamodb-single-table/',
        provider: 'AWS Architecture',
        description: 'The definitive architectural guide on high-scale DynamoDB Single-Table modeling.'
      },
      {
        title: 'Microservices.io: Transactional Outbox Pattern',
        url: 'https://microservices.io/patterns/data/transactional-outbox.html',
        provider: 'Distributed Systems / DDIA',
        description: 'Chris Richardson’s pattern for transactional data mutation and event streaming without distributed locks.'
      }
    ]
  },

  'sa-delivery-sup': {
    topicsToCover: [
      {
        id: 'sa-del-1',
        title: 'Architectural Spikes & Risk Retirement',
        keyConcepts: ['Time-boxed architectural prototyping', 'Benchmarking peak RPS capacity', 'Validating third-party integration constraints', 'Proving non-functional feasibility before sprint planning']
      },
      {
        id: 'sa-del-2',
        title: 'Definition of Architectural Done & Tech Debt',
        keyConcepts: ['Establishing architecture acceptance criteria', 'Tracking debt on the backlog', 'Sprint capacity allocation for refactoring (15-20%)', 'Automated architectural compliance linting']
      }
    ],
    externalLinks: [
      {
        title: 'Martin Fowler: Technical Debt Quadrant',
        url: 'https://martinfowler.com/bliki/TechnicalDebtQuadrant.html',
        provider: 'Martin Fowler',
        description: 'Framework for categorizing prudent vs reckless and deliberate vs inadvertent architectural debt.'
      }
    ]
  },

  'sa-tech-stack': {
    topicsToCover: [
      {
        id: 'sa-stack-1',
        title: 'Polyglot Persistence Evaluation',
        keyConcepts: ['Matching storage engine to access pattern', 'Document vs Key-Value vs Relational vs Graph', 'Memory caching (Redis/Memcached) eviction policies', 'Write amplification vs Read throughput']
      },
      {
        id: 'sa-stack-2',
        title: 'Compute Runtime Selection (Fargate vs Lambda vs EC2)',
        keyConcepts: ['Cold start latency budgeting', 'Connection pooling mechanics under high concurrency', 'Unit economics at sustained vs spiky RPS', 'Operational patching overhead']
      }
    ],
    externalLinks: [
      {
        title: 'AWS Whitepaper: Selecting the Right Database for Your Workload',
        url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-database-migration-service-best-practices/selecting-the-right-database.html',
        provider: 'AWS Architecture',
        description: 'Evaluating Aurora vs DynamoDB vs DocumentDB vs OpenSearch against workload characteristics.'
      }
    ]
  },

  'sa-governance': {
    topicsToCover: [
      {
        id: 'sa-gov-1',
        title: 'Architectural Decision Records (ADRs) in Git',
        keyConcepts: ['MADR template structure (Context, Decision, Consequences, Rejected Alternatives)', 'Peer review workflow for architecture changes', 'Living documentation in code repositories', 'Retiring obsolete ADRs']
      },
      {
        id: 'sa-gov-2',
        title: 'Architecture Review Board (ARB) Leadership',
        keyConcepts: ['Scaling governance across 4+ squads', 'Guiding instead of gatekeeping', 'Automated architectural fitness functions (ArchUnit)', 'Handling architecture exceptions']
      }
    ],
    externalLinks: [
      {
        title: 'Michael Nygard: Documenting Architecture Decisions',
        url: 'https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions',
        provider: 'Distributed Systems / DDIA',
        description: 'The foundational essay on ADR structure, immutability, and lightweight governance.'
      }
    ]
  },

  // ==========================================
  // DOMAIN 2: APPLICATION ARCHITECTURE (7 Skills)
  // ==========================================
  'aa-fundamentals': {
    topicsToCover: [
      {
        id: 'aa-fund-1',
        title: 'Hexagonal / Ports and Adapters Architecture',
        keyConcepts: ['Inverting dependencies away from cloud SDKs', 'Domain entities and Use Case Ports', 'Inbound Driving Adapters (REST/GraphQL)', 'Outbound Driven Adapters (DynamoDB/SQS)']
      },
      {
        id: 'aa-fund-2',
        title: 'Cohesion, Coupling & Component Boundaries',
        keyConcepts: ['Afferent vs Efferent coupling metrics', 'Single Responsibility at the package level', 'Package-by-Feature vs Package-by-Layer', 'Preventing cyclic dependencies']
      }
    ],
    externalLinks: [
      {
        title: 'Alistair Cockburn: Hexagonal Architecture (Ports and Adapters)',
        url: 'https://alistair.cockburn.us/hexagonal-architecture/',
        provider: 'Distributed Systems / DDIA',
        description: 'Original creator’s guide on isolating application core logic from databases and user interfaces.'
      }
    ]
  },

  'aa-patterns': {
    topicsToCover: [
      {
        id: 'aa-pat-1',
        title: 'Resiliency Patterns (Circuit Breaker, Bulkhead, Retry)',
        keyConcepts: ['Circuit states (Closed, Open, Half-Open)', 'Thread and connection pool isolation (Bulkhead)', 'Jittered exponential backoff retries', 'Fallback strategies & degraded mode']
      },
      {
        id: 'aa-pat-2',
        title: 'Command Query Responsibility Segregation (CQRS)',
        keyConcepts: ['Decoupling command write models from query read models', 'Projection synchronization latency', 'Optimizing reads for complex UI filtering', 'Handling read-your-own-writes in UI']
      }
    ],
    externalLinks: [
      {
        title: 'Martin Fowler: Circuit Breaker Pattern',
        url: 'https://martinfowler.com/bliki/CircuitBreaker.html',
        provider: 'Martin Fowler',
        description: 'Canonical explanation of avoiding cascading failures in distributed inter-service calls.'
      },
      {
        title: 'Microsoft Cloud Design Patterns: CQRS Pattern',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs',
        provider: 'Microsoft Learn',
        description: 'Practical cloud implementation of separate read and write stores.'
      }
    ]
  },

  'aa-data-arch': {
    topicsToCover: [
      {
        id: 'aa-data-1',
        title: 'Optimistic Concurrency & Versioning',
        keyConcepts: ['ConditionExpression in DynamoDB', 'Atomic Compare-And-Swap (CAS)', 'Handling 409 Conflict gracefully', 'Preventing phantom overwrites without distributed locks']
      },
      {
        id: 'aa-data-2',
        title: 'Database Sharding & Partition Key Design',
        keyConcepts: ['Consistent hashing algorithms', 'Avoiding hot partitions under skewed load', 'Synthetic partition key prefixes (salt)', 'Global Secondary Index throttling']
      }
    ],
    externalLinks: [
      {
        title: 'AWS DynamoDB Guide: Optimistic Locking with Version Numbers',
        url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/OptimisticLocking.html',
        provider: 'AWS Architecture',
        description: 'Official AWS pattern for safe concurrency control using conditional checks.'
      }
    ]
  },

  'aa-integration': {
    topicsToCover: [
      {
        id: 'aa-int-1',
        title: 'Idempotent Consumer Architecture',
        keyConcepts: ['Handling at-least-once SQS delivery', 'Idempotency keys & database deduplication tables', 'Event version comparison', 'Side-effect isolation']
      },
      {
        id: 'aa-int-2',
        title: 'API Versioning & Consumer-Driven Contracts',
        keyConcepts: ['Expand and Contract migration pattern', 'Contract testing with Pact', 'Deprecation headers & lifecycle monitoring', 'Semantic versioning for microservice schemas']
      }
    ],
    externalLinks: [
      {
        title: 'Pact Docs: Introduction to Consumer-Driven Contract Testing',
        url: 'https://docs.pact.io/',
        provider: 'Distributed Systems / DDIA',
        description: 'Industry standard for microservice contract testing without relying on fragile integration environments.'
      }
    ]
  },

  'aa-security': {
    topicsToCover: [
      {
        id: 'aa-sec-1',
        title: 'Zero Trust & Secret-Less Cloud Workloads',
        keyConcepts: ['IAM Role assumption (IRSA on Kubernetes/ECS)', 'Short-lived ephemeral tokens via STS', 'VPC PrivateLink and Gateway Endpoints', 'Least-privilege policy scoping']
      },
      {
        id: 'aa-sec-2',
        title: 'OWASP API Security Top 10',
        keyConcepts: ['Broken Object Level Authorization (BOLA)', 'Broken Function Level Authorization (BFLA)', 'Mass assignment vulnerabilities', 'Unrestricted resource consumption rate-limiting']
      }
    ],
    externalLinks: [
      {
        title: 'OWASP API Security Top 10 (Latest Edition)',
        url: 'https://owasp.org/www-project-api-security/',
        provider: 'OWASP',
        description: 'Essential security guidelines for API architecture, focusing on BOLA and authorization flaw mitigation.'
      }
    ]
  },

  'aa-performance': {
    topicsToCover: [
      {
        id: 'aa-perf-1',
        title: 'Latency Budgeting & P99 Optimization',
        keyConcepts: ['Eliminating N+1 network queries', 'Non-blocking I/O event loops (Node.js/Go)', 'Connection pool tuning (TCP keepalive & HTTP/2)', 'Garbage collection pause minimization']
      },
      {
        id: 'aa-perf-2',
        title: 'Caching Strategies & Cache Invalidation',
        keyConcepts: ['Cache-aside vs Read-through vs Write-through', 'Cache stampede mitigation (probabilistic early expiration / mutex)', 'TTL expiration vs Event-driven invalidation', 'Memory fragmentation in Redis']
      }
    ],
    externalLinks: [
      {
        title: 'AWS Caching Best Practices: Amazon ElastiCache',
        url: 'https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-strategies.html',
        provider: 'AWS Architecture',
        description: 'Comprehensive guide to caching patterns, write policies, and avoiding stampede failures.'
      }
    ]
  },

  'aa-maintainability': {
    topicsToCover: [
      {
        id: 'aa-maint-1',
        title: 'Architectural Fitness Functions',
        keyConcepts: ['Automated code structure verification (ArchUnit/ts-arch)', 'Detecting circular dependency violations in CI', 'Enforcing hexagonal boundary rules', 'Tracking technical debt trends']
      },
      {
        id: 'aa-maint-2',
        title: 'Legacy Modernization with the Strangler Fig Pattern',
        keyConcepts: ['Reverse proxy interception at the perimeter', 'Incremental feature migration by bounded context', 'Data synchronization during coexistence', 'Decommissioning legacy monolith paths']
      }
    ],
    externalLinks: [
      {
        title: 'Martin Fowler: Strangler Fig Application Pattern',
        url: 'https://martinfowler.com/bliki/StranglerFigApplication.html',
        provider: 'Martin Fowler',
        description: 'The definitive pattern for incrementally migrating legacy enterprise applications to microservices.'
      }
    ]
  },

  // ==========================================
  // DOMAIN 3: CLOUD ARCHITECTURE (3 Skills)
  // ==========================================
  'cloud-patterns': {
    topicsToCover: [
      {
        id: 'cp-1',
        title: 'Disaster Recovery (Active-Passive vs Active-Active)',
        keyConcepts: ['Backup & Restore vs Pilot Light vs Warm Standby vs Multi-Site Active-Active', 'Route 53 health-checked DNS failover', 'Cross-region data replication lag (RPO)', 'Automated regional evacuation runbooks']
      },
      {
        id: 'cp-2',
        title: 'Cell-Based Architecture & Blast Radius Reduction',
        keyConcepts: ['Partitioning customers into independent isolated cells', 'Preventing global control-plane cascading outages', 'Routing layer shuffle sharding', 'Cellular deployment rollout order']
      }
    ],
    externalLinks: [
      {
        title: 'AWS Well-Architected: Disaster Recovery of Workloads on AWS',
        url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html',
        provider: 'AWS Architecture',
        description: 'Comparing Backup, Pilot Light, Warm Standby, and Active-Active architectures.'
      },
      {
        title: 'AWS Builder’s Library: Cell-based Architecture',
        url: 'https://aws.amazon.com/builders-library/workload-isolation-using-cell-based-architecture/',
        provider: 'AWS Architecture',
        description: 'How AWS builds fault-isolated, cell-based services to eliminate cross-region blast radius.'
      }
    ]
  },

  'cloud-native-aws': {
    topicsToCover: [
      {
        id: 'cna-1',
        title: 'AWS Serverless vs Containerized Ingestion',
        keyConcepts: ['API Gateway -> SQS -> ECS Fargate topology', 'Auto-scaling policies on SQS queue depth (Target Tracking)', 'Fargate Spot vs On-Demand cost optimization', 'Graceful SIGTERM shutdown handling']
      },
      {
        id: 'cna-2',
        title: 'VPC Peering, Transit Gateway & PrivateLink',
        keyConcepts: ['Hub-and-spoke multi-VPC topology', 'VPC Gateway Endpoints for zero-cost S3/DynamoDB traffic', 'Cross-account IAM role assumption', 'Security group least privilege']
      }
    ],
    externalLinks: [
      {
        title: 'AWS ECS Best Practices: Auto Scaling on Queue Depth',
        url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-autoscaling.html',
        provider: 'AWS Architecture',
        description: 'Configuring Amazon ECS service autoscaling based on Amazon SQS backlog per task.'
      }
    ]
  },

  'cloud-migration': {
    topicsToCover: [
      {
        id: 'cm-1',
        title: 'The 7 Rs of Cloud Migration Strategy',
        keyConcepts: ['Rehost, Replatform, Refactor, Repurchase, Retain, Retire, Relocate', 'Total Cost of Ownership (TCO) calculation', 'Business case formulation for cloud modernization', 'Data migration wave planning']
      },
      {
        id: 'cm-2',
        title: 'Database Migration Service (DMS) & Cutover Mechanics',
        keyConcepts: ['Full load + Continuous CDC replication', 'Handling schema divergence & data type mappings', 'Cutover dry runs and fallback rollback plan', 'Minimizing cutover downtime to under 5 minutes']
      }
    ],
    externalLinks: [
      {
        title: 'AWS Migration Hub: The 7 Migration Strategies (7 Rs)',
        url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-strategies/welcome.html',
        provider: 'AWS Architecture',
        description: 'Official methodology for categorizing enterprise workloads during cloud migration.'
      }
    ]
  },

  // ==========================================
  // DOMAIN 4: SDLC PROCESSES & DEVOPS (4 Skills)
  // ==========================================
  'sdlc-methodologies': {
    topicsToCover: [
      {
        id: 'sdlc-m-1',
        title: 'DORA Metrics & Engineering Velocity',
        keyConcepts: ['Deployment Frequency (DF)', 'Lead Time for Changes (LTTC)', 'Change Failure Rate (CFR)', 'Time to Restore Service (TRSV / MTTR)']
      },
      {
        id: 'sdlc-m-2',
        title: 'Trunk-Based Development & Feature Flags',
        keyConcepts: ['Decoupling deployment from release', 'Short-lived feature branches (< 24 hours)', 'Progressive dark launching with LaunchDarkly/custom flags', 'Feature flag hygiene and tech debt retirement']
      }
    ],
    externalLinks: [
      {
        title: 'Google Cloud DORA: DevOps Research & Assessment Research',
        url: 'https://dora.dev/research/',
        provider: 'Distributed Systems / DDIA',
        description: 'The science behind high-performing software engineering teams and DORA metrics.'
      }
    ]
  },

  'sdlc-ci-cd': {
    topicsToCover: [
      {
        id: 'sdlc-ci-1',
        title: 'Canary & Blue-Green Deployment Topologies',
        keyConcepts: ['Progressive traffic shifting via AWS CodeDeploy / ALB', 'Automated CloudWatch alarm rollback triggers', 'Database schema backward compatibility during rollout', 'Zero-downtime deployment pipelines']
      },
      {
        id: 'sdlc-ci-2',
        title: 'Pipeline as Code & Immutable Artifacts',
        keyConcepts: ['Deterministic container image builds (Docker digest pinning)', 'Provenance tracking & SBOM generation', 'Build once, deploy to all environments', 'Secret management in CI (OIDC tokens)']
      }
    ],
    externalLinks: [
      {
        title: 'AWS Well-Architected: Safe Deployment Strategies',
        url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_implement_safe_deployment_practices.html',
        provider: 'AWS Architecture',
        description: 'Implementing canary deployments, synthetic monitoring, and automated alarm-based rollback.'
      }
    ]
  },

  'sdlc-quality-eng': {
    topicsToCover: [
      {
        id: 'sdlc-qe-1',
        title: 'Automated Non-Functional Testing (NFT) in CI',
        keyConcepts: ['Load testing at 2,500 RPS with k6 / Gatling', 'Soak and endurance testing for memory leaks', 'Stress testing to find breaking points', 'Chaos engineering with AWS Fault Injection Simulator']
      },
      {
        id: 'sdlc-qe-2',
        title: 'Test Pyramid & Shift-Left Architecture',
        keyConcepts: ['Unit vs Integration vs Contract vs E2E test distribution', 'Static code analysis quality gates (SonarQube/Checkov)', 'Shift-left security scanning in pull requests', 'Flaky test eradication']
      }
    ],
    externalLinks: [
      {
        title: 'k6 Documentation: Automated Load Testing in CI/CD',
        url: 'https://k6.io/docs/testing-guides/automated-performance-testing/',
        provider: 'Distributed Systems / DDIA',
        description: 'Implementing high-concurrency performance and stress testing in GitHub Actions.'
      }
    ]
  },

  'sdlc-devops-infra': {
    topicsToCover: [
      {
        id: 'sdlc-do-1',
        title: 'Infrastructure as Code (Terraform / AWS CDK)',
        keyConcepts: ['Declarative cloud resource modeling', 'State file locking and remote backends (S3 + DynamoDB)', 'Modular reusable infrastructure modules', 'Policy as code with OPA (Open Policy Agent)']
      },
      {
        id: 'sdlc-do-2',
        title: 'Distributed Tracing & OpenTelemetry',
        keyConcepts: ['W3C Trace Context header propagation', 'AWS X-Ray and OpenTelemetry collector setup', 'Structured JSON logging with correlation IDs', 'Metric thresholds & P99 alert configuration']
      }
    ],
    externalLinks: [
      {
        title: 'OpenTelemetry Architecture & Specification',
        url: 'https://opentelemetry.io/docs/concepts/',
        provider: 'Distributed Systems / DDIA',
        description: 'The universal vendor-agnostic standard for distributed tracing, metrics, and logs.'
      }
    ]
  },

  // ==========================================
  // DOMAIN 5: LEADERSHIP & SOFT SKILLS (11 Skills)
  // ==========================================
  'lead-tech-leadership': {
    topicsToCover: [
      {
        id: 'ltl-1',
        title: 'Technical Vision & Architectural Roadmapping',
        keyConcepts: ['Authoring 12-to-24 month technical roadmaps', 'Balancing innovation with operational stability', 'Technology radar curation', 'Inspiring engineering squads without formal authority']
      }
    ],
    externalLinks: [
      {
        title: 'Thoughtworks Technology Radar FAQ & Methodology',
        url: 'https://www.thoughtworks.com/radar',
        provider: 'Distributed Systems / DDIA',
        description: 'Framework for tracking and adopting emerging technologies across enterprise teams.'
      }
    ]
  },

  'lead-communication': {
    topicsToCover: [
      {
        id: 'lc-1',
        title: 'Executive Communication & Analogy Formulation',
        keyConcepts: ['The 30-Second Verbatim Defense Formula', 'Using plain-English analogies for non-technical stakeholders', 'Pyramid Principle (Answer first, supporting details second)', 'Tailoring message to audience (CTO vs PM vs Lead Dev)']
      }
    ],
    externalLinks: [
      {
        title: 'Barbara Minto: The Minto Pyramid Principle Overview',
        url: 'https://www.mckinsey.com/alumni/news-and-insights/news/center-for-inspiring-minds/barbara-minto',
        provider: 'EPAM Systems',
        description: 'The executive communication structure taught in EPAM Software Architecture workshops.'
      }
    ]
  },

  'lead-stakeholder-mgmt': {
    topicsToCover: [
      {
        id: 'lsm-1',
        title: 'Trade-off Negotiation & Constructive Pushback',
        keyConcepts: ['Handling unreasonable synchronous performance demands', 'Demonstrating commercial consequences of requirements', 'Read-Your-Own-Writes UI optimism as a compromise', 'Establishing trust and partnership']
      }
    ],
    externalLinks: [
      {
        title: 'Harvard Business Review: How to Say No to Key Stakeholders',
        url: 'https://hbr.org/2016/03/how-to-say-no-to-someone-who-outranks-you',
        provider: 'EPAM Systems',
        description: 'Techniques for pushback using objective evidence and alternative proposals.'
      }
    ]
  },

  'lead-consulting': {
    topicsToCover: [
      {
        id: 'lcon-1',
        title: 'Trusted Advisor & Client Value Delivery',
        keyConcepts: ['Framing technology as an enabler of business KPIs', 'Diagnostic discovery workshops', 'Client maturity modeling', 'Navigating corporate politics and organizational inertia']
      }
    ],
    externalLinks: [
      {
        title: 'EPAM Software Architecture Training: The Architect as Consultant',
        url: 'https://www.epam.com/services/consult-and-design',
        provider: 'EPAM Systems',
        description: 'EPAM’s perspective on consultative solution architecture and value creation.'
      }
    ]
  },

  'lead-mentorship': {
    topicsToCover: [
      {
        id: 'lmen-1',
        title: 'Architectural Mentorship & Talent Multiplication',
        keyConcepts: ['Pair architecture design sessions', 'Mentoring senior developers into lead roles', 'Conducting constructive architecture peer reviews', 'Creating learning pathways for squads']
      }
    ],
    externalLinks: [
      {
        title: 'Will Larson: Mentoring and Growing Staff+ Engineers',
        url: 'https://staffeng.com/guides/mentoring/',
        provider: 'Distributed Systems / DDIA',
        description: 'Practical guide to developing senior technical talent.'
      }
    ]
  },

  'lead-negotiation': {
    topicsToCover: [
      {
        id: 'lneg-1',
        title: 'Scope, Budget & Timeline Negotiation',
        keyConcepts: ['Iron Triangle of project management (Scope, Time, Cost, Quality)', 'Phase 1 MVP scope trimming', 'Contractual SLA negotiation', 'Vendor SaaS contract review']
      }
    ],
    externalLinks: [
      {
        title: 'Chris Voss: Never Split the Difference Architectural Applications',
        url: 'https://www.blackswanltd.com/blog',
        provider: 'EPAM Systems',
        description: 'Tactical empathy and structured negotiation in technical consulting.'
      }
    ]
  },

  'lead-conflict-res': {
    topicsToCover: [
      {
        id: 'lcr-1',
        title: 'Resolving Architectural Deadlocks & Holy Wars',
        keyConcepts: ['Objective evaluation matrices vs emotional debate', 'Time-boxed proof-of-concept bake-offs', 'Disagree and commit alignment', 'Depersonalizing technical disputes']
      }
    ],
    externalLinks: [
      {
        title: 'Amazon Leadership Principle: Have Backbone; Disagree and Commit',
        url: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles',
        provider: 'AWS Architecture',
        description: 'How senior leaders challenge assumptions with data and unite behind the final decision.'
      }
    ]
  },

  'lead-decision-making': {
    topicsToCover: [
      {
        id: 'ldm-1',
        title: 'Type 1 vs Type 2 Decisions & Bias for Action',
        keyConcepts: ['Two-way door (reversible) vs One-way door (irreversible) decisions', 'Combating analysis paralysis', 'Deciding under incomplete information', 'Post-decision monitoring']
      }
    ],
    externalLinks: [
      {
        title: 'Jeff Bezos: Type 1 and Type 2 Decisions in Enterprise Architecture',
        url: 'https://www.sec.gov/Archives/edgar/data/1018724/000119312516530910/d168744dex991.htm',
        provider: 'AWS Architecture',
        description: 'The 1997 Amazon shareholder letter framework for fast, high-quality decision making.'
      }
    ]
  },

  'lead-strategic-thinking': {
    topicsToCover: [
      {
        id: 'lst-1',
        title: 'Wardley Mapping & Commoditization Cycles',
        keyConcepts: ['Mapping user needs through Genesis, Custom, Product, Commodity', 'Anticipating industry shifts', 'Directing R&D investment to core differentiators', 'Avoiding building commodity utilities']
      }
    ],
    externalLinks: [
      {
        title: 'Simon Wardley: Introduction to Wardley Mapping',
        url: 'https://learnwardleymapping.com/',
        provider: 'Distributed Systems / DDIA',
        description: 'Top strategic tool used by Chief Architects to visualize landscape and strategic moves.'
      }
    ]
  },

  'lead-collaboration': {
    topicsToCover: [
      {
        id: 'lcol-1',
        title: 'Cross-Functional Team Topologies',
        keyConcepts: ['Stream-aligned teams vs Platform teams vs Enabling teams', 'Managing cognitive load on squads', 'Collaboration vs Facilitation interaction modes', 'Breaking organizational silos']
      }
    ],
    externalLinks: [
      {
        title: 'Team Topologies: Organizing Business and Technology Teams for Fast Flow',
        url: 'https://teamtopologies.com/key-concepts',
        provider: 'Distributed Systems / DDIA',
        description: 'Matthew Skelton & Manuel Pais’s framework for team interactions and software architecture alignment.'
      }
    ]
  },

  'lead-dei': {
    topicsToCover: [
      {
        id: 'ldei-1',
        title: 'Psychological Safety & Inclusive Architectural Forums',
        keyConcepts: ['Amy Edmondson’s psychological safety framework', 'Soliciting silent voices during design reviews', 'Anonymous RFC commenting to remove hierarchy bias', 'Equitable distributed team practices']
      }
    ],
    externalLinks: [
      {
        title: 'Amy Edmondson: The Fearless Organization Summary',
        url: 'https://hbr.org/2019/01/the-fearless-organization',
        provider: 'EPAM Systems',
        description: 'Why psychological safety is the foundation of innovation and defect mitigation.'
      }
    ]
  },

  // ==========================================
  // DOMAIN 6: ARTIFICIAL INTELLIGENCE & GENAI (2 Skills)
  // ==========================================
  'ai-genai-sdlc': {
    topicsToCover: [
      {
        id: 'aig-1',
        title: 'Prompt Engineering & Deterministic Tool Scaffolding',
        keyConcepts: ['Few-shot prompting & system instruction isolation', 'JSON schema output enforcement', 'Scaffolding OpenAPI test fixtures from YAML', 'Security guardrails against PII leakage']
      },
      {
        id: 'aig-2',
        title: 'OWASP Top 10 for LLMs in Engineering Delivery',
        keyConcepts: ['Prompt injection mitigation', 'Insecure output handling in compiler pipelines', 'Model denial of service & token budgeting', 'Human-in-the-loop review gates for generated ADRs']
      }
    ],
    externalLinks: [
      {
        title: 'OWASP Top 10 for Large Language Model Applications',
        url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
        provider: 'OWASP',
        description: 'The official security benchmark for evaluating generative AI systems and LLM pipelines.'
      }
    ]
  },

  'ai-architecture': {
    topicsToCover: [
      {
        id: 'aia-1',
        title: 'Retrieval-Augmented Generation (RAG) Systems',
        keyConcepts: ['Document chunking strategies & semantic overlap', 'Vector databases (OpenSearch vs pgvector vs Pinecone)', 'Embedding model latency & dimensionality', 'Hybrid keyword (BM25) + dense vector re-ranking']
      },
      {
        id: 'aia-2',
        title: 'Semantic Caching & LLM Latency Budgeting',
        keyConcepts: ['Redis vector caching for high-frequency queries', 'Token throughput limits and concurrency throttling', 'Fallback routing across model tiers (Claude 3.5 Sonnet to Haiku)', 'Evaluating RAG output grounding & hallucinations']
      }
    ],
    externalLinks: [
      {
        title: 'AWS Architecture: Generative AI Application Architecture Patterns',
        url: 'https://docs.aws.amazon.com/wellarchitected/latest/generative-ai-lens/welcome.html',
        provider: 'AWS Architecture',
        description: 'Official AWS Well-Architected Generative AI Lens covering RAG, model selection, and security.'
      }
    ]
  },

  // ==========================================
  // DOMAIN 7: BUSINESS ANALYSIS (4 Skills)
  // ==========================================
  'biz-needs-id': {
    topicsToCover: [
      {
        id: 'bni-1',
        title: 'Root Cause Discovery & Impact Mapping',
        keyConcepts: ['5 Whys discovery methodology', 'Distinguishing business symptoms from core architectural drivers', 'Value stream mapping to locate throughput constraints', 'Formulating problem statement canvases']
      }
    ],
    externalLinks: [
      {
        title: 'Impact Mapping: A Quick Guide',
        url: 'https://www.impactmapping.org/',
        provider: 'Distributed Systems / DDIA',
        description: 'Gojko Adzic’s strategic visual mapping technique linking business goals to software delivery.'
      }
    ]
  },

  'biz-alignment': {
    topicsToCover: [
      {
        id: 'ba-1',
        title: 'Aligning Architectural Strategy with Corporate KPIs',
        keyConcepts: ['Mapping technical SLAs to business revenue impact', 'Stakeholder engagement across executive tiers', 'Cost of delay vs delivery velocity', 'Commercial contract SLA liability management']
      }
    ],
    externalLinks: [
      {
        title: 'EPAM Insights: Aligning Technology Architecture with Business Outcomes',
        url: 'https://www.epam.com/insights',
        provider: 'EPAM Systems',
        description: 'Consultative methodologies for software architects working with global enterprise clients.'
      }
    ]
  },

  'biz-cost-modelling': {
    topicsToCover: [
      {
        id: 'bcm-1',
        title: 'Cloud Unit Economics & Total Cost of Ownership (TCO)',
        keyConcepts: ['Cost per 1,000 transactions calculation', 'Compute (ECS Fargate) + DB (DynamoDB) + SQS egress modeling', 'FinOps principles & cost allocation tagging', 'Reserved instances vs Savings Plans vs Spot instances']
      }
    ],
    externalLinks: [
      {
        title: 'FinOps Foundation: Cloud Cost Management Framework',
        url: 'https://www.finops.org/framework/overview/',
        provider: 'Distributed Systems / DDIA',
        description: 'Industry standard for cloud financial operations and architectural cost governance.'
      }
    ]
  },

  'biz-tech-innovation': {
    topicsToCover: [
      {
        id: 'bti-1',
        title: 'Commercial Buy vs. Build Evaluation',
        keyConcepts: ['Core business differentiator vs commodity capability', 'Calculating total lifecycle maintenance cost for custom software', 'Vendor lock-in risk assessment and exit strategy', 'Evaluating SaaS SLAs and compliance']
      }
    ],
    externalLinks: [
      {
        title: 'Martin Fowler: Commoditizing the Core and Buy vs. Build',
        url: 'https://martinfowler.com/articles/commodity-hardware.html',
        provider: 'Martin Fowler',
        description: 'Architectural evaluation of when to custom-build software versus adopting managed commercial platforms.'
      }
    ]
  }
};

export const TOTAL_TOPICS_COUNT = Object.values(SKILL_TOPICS_AND_LINKS_DATA).reduce(
  (sum, item) => sum + item.topicsToCover.length,
  0
);

export const TOTAL_EXTERNAL_LINKS_COUNT = Object.values(SKILL_TOPICS_AND_LINKS_DATA).reduce(
  (sum, item) => sum + item.externalLinks.length,
  0
);

