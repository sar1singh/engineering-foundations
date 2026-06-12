type AchievementCategory = "impact" | "ownership" | "technical-depth" | "architecture" | "leadership";

type AchievementTemplate = {
  id: string;
  category: AchievementCategory;
  title: string;
  prompt: string;
  examples: string[];
  skillIds: string[];
  capabilityIds: string[];
};

type ResumeFramingRule = {
  id: string;
  category: AchievementCategory;
  principle: string;
  beforeExample: string;
  afterExample: string;
  explanation: string;
};

type ResumeSection = "summary" | "experience" | "skills" | "case-studies" | "certifications";

type ResumeSectionGuide = {
  section: ResumeSection;
  purpose: string;
  contentRules: string[];
  lengthGuide: string;
};

type ResumeKeyword = {
  id: string;
  keyword: string;
  relevance: string;
  targetRoles: string[];
};

export const resumeAchievementTemplates: AchievementTemplate[] = [
  // ── Impact ──────────────────────────────────────────────────────────────
  {
    id: "achievement-impact-microservices-migration",
    category: "impact",
    title: "Microservices migration latency improvement",
    prompt: "Describe a migration from monolith to microservices with Before/After latency metrics, service count, and migration strategy.",
    examples: [
      "Led migration of 12 microservices from monolith reducing P50 latency by 40%",
      "Orchestrated 8-service decomposition cutting deployment time from 45min to 6min",
    ],
    skillIds: ["skill-api-contract-design", "skill-aws-architecture-review", "skill-hld-tradeoffs"],
    capabilityIds: ["cap-node-backend", "cap-system-design-hld", "cap-aws-cloud-architecture"],
  },
  {
    id: "achievement-impact-cost-optimization",
    category: "impact",
    title: "Cloud cost optimization",
    prompt: "Quantify cost savings through infrastructure optimization — reserved instances, right-sizing, or architecture changes.",
    examples: [
      "Reduced AWS costs by 35% through reserved instance optimization and right-sizing",
      "Cut monthly cloud spend by $12K by migrating 15 workloads to Graviton instances",
    ],
    skillIds: ["skill-aws-architecture-review", "skill-platform-cicd"],
    capabilityIds: ["cap-aws-cloud-architecture", "cap-platform-engineering"],
  },
  {
    id: "achievement-impact-scalability-throughput",
    category: "impact",
    title: "Scalability and throughput improvement",
    prompt: "Show system throughput improvement with concrete numbers — requests/sec, data volume, user growth supported.",
    examples: [
      "Scaled API gateway to handle 50K RPM with 99.9% uptime during flash sale events",
      "Designed caching layer that absorbed 80% of read traffic, supporting 3x user growth without adding DB capacity",
    ],
    skillIds: ["skill-reliability-engineering", "skill-observability-design", "skill-hld-tradeoffs"],
    capabilityIds: ["cap-reliability-observability", "cap-system-design-hld", "cap-distributed-systems"],
  },
  {
    id: "achievement-impact-reliability-slo",
    category: "impact",
    title: "Reliability and SLO improvement",
    prompt: "Describe how you improved system reliability — error budgets, SLO attainment, or incident frequency reduction.",
    examples: [
      "Improved P99 latency from 2s to 200ms by introducing connection pooling and read replicas",
      "Raised SLO attainment from 99.5% to 99.95% through chaos engineering and graceful degradation patterns",
    ],
    skillIds: ["skill-reliability-engineering", "skill-observability-design", "skill-incident-leadership"],
    capabilityIds: ["cap-reliability-observability", "cap-delivery-leadership"],
  },
  {
    id: "achievement-impact-delivery-speed",
    category: "impact",
    title: "Delivery speed and developer velocity",
    prompt: "Quantify improvements in deployment frequency, lead time, or developer productivity.",
    examples: [
      "Reduced CI pipeline from 22min to 4min via parallelization and test optimization, saving 40 engineer-hours weekly",
      "Standardized deployment workflows across 6 teams, increasing release frequency from biweekly to daily",
    ],
    skillIds: ["skill-platform-cicd", "skill-delivery-risk", "skill-personal-brand-building"],
    capabilityIds: ["cap-platform-engineering", "cap-delivery-leadership"],
  },
  // ── Ownership ───────────────────────────────────────────────────────────
  {
    id: "achievement-ownership-end-to-end-platform",
    category: "ownership",
    title: "End-to-end platform delivery",
    prompt: "Describe owning a full platform from requirements through production — scope, users, transactions, and business impact.",
    examples: [
      "Owned end-to-end delivery of payment platform serving 100K+ daily transactions",
      "Architected and delivered order management system handling $50M annual GMV across 15 countries",
    ],
    skillIds: ["skill-api-contract-design", "skill-delivery-risk", "skill-communication-tradeoffs"],
    capabilityIds: ["cap-node-backend", "cap-delivery-leadership", "cap-behavioral-communication"],
  },
  {
    id: "achievement-ownership-architecture-decisions",
    category: "ownership",
    title: "Architecture decision ownership",
    prompt: "Show ownership of architecture decisions — technology selection, tradeoff analysis, and cross-team alignment.",
    examples: [
      "Drove architecture decisions for real-time analytics pipeline handling 10TB/day across 4 data centers",
      "Owned service mesh migration across 30+ services, managing canary rollout and backward compatibility",
    ],
    skillIds: ["skill-aws-architecture-review", "skill-hld-tradeoffs", "skill-case-study-hld"],
    capabilityIds: ["cap-aws-cloud-architecture", "cap-system-design-hld", "cap-architecture-case-studies"],
  },
  {
    id: "achievement-ownership-technical-roadmap",
    category: "ownership",
    title: "Technical roadmap ownership",
    prompt: "Describe setting and driving a multi-quarter technical roadmap — prioritization, stakeholder buy-in, and delivery.",
    examples: [
      "Owned 6-month infrastructure modernization roadmap, migrating 20 services from EC2 to ECS Fargate",
      "Drove deprecation of legacy monolith, coordinating 5 teams across 3 quarters with zero downtime",
    ],
    skillIds: ["skill-delivery-risk", "skill-staff-leadership", "skill-senior-storytelling"],
    capabilityIds: ["cap-delivery-leadership", "cap-behavioral-communication", "cap-career-assets"],
  },
  // ── Technical Depth ─────────────────────────────────────────────────────
  {
    id: "achievement-technical-caching-layer",
    category: "technical-depth",
    title: "Custom caching architecture",
    prompt: "Describe designing a caching solution — technology choice, invalidation strategy, hit rates, and performance impact.",
    examples: [
      "Designed custom Redis caching layer reducing database read load by 60% and cutting API response times by 70%",
      "Built multi-tier cache (L1 in-memory + L2 Redis) with write-through invalidation, achieving 92% cache hit rate",
    ],
    skillIds: ["skill-hld-tradeoffs", "skill-data-access-performance", "skill-observability-design"],
    capabilityIds: ["cap-databases", "cap-system-design-hld", "cap-reliability-observability"],
  },
  {
    id: "achievement-technical-resilience-patterns",
    category: "technical-depth",
    title: "Resilience and circuit breaker implementation",
    prompt: "Describe applying resilience patterns — circuit breakers, bulkheads, retries, and their production impact.",
    examples: [
      "Implemented circuit breaker pattern improving system resilience during cascade failures, reducing P0 incidents by 60%",
      "Designed bulkhead isolation for multi-tenant API, preventing noisy-neighbor scenarios from affecting SLA guarantees",
    ],
    skillIds: ["skill-reliability-engineering", "skill-distributed-consistency", "skill-async-architecture"],
    capabilityIds: ["cap-reliability-observability", "cap-distributed-systems", "cap-node-backend"],
  },
  {
    id: "achievement-technical-observability-pipeline",
    category: "technical-depth",
    title: "Observability and monitoring pipeline",
    prompt: "Describe building an observability stack — metrics, traces, logs, dashboards, and alerting.",
    examples: [
      "Built centralized observability pipeline with OpenTelemetry, reducing MTTR from 45min to 8min across 25 services",
      "Designed structured logging standard and tracing instrumentation adopted by 8 teams, enabling root-cause analysis in under 5 minutes",
    ],
    skillIds: ["skill-observability-design", "skill-reliability-engineering", "skill-platform-cicd"],
    capabilityIds: ["cap-reliability-observability", "cap-platform-engineering"],
  },
  // ── Architecture ────────────────────────────────────────────────────────
  {
    id: "achievement-architecture-multi-region",
    category: "architecture",
    title: "Multi-region active-active architecture",
    prompt: "Describe designing for multi-region — failover, replication, RTO/RPO, and consistency tradeoffs.",
    examples: [
      "Architected multi-region active-active deployment on AWS with RTO < 5 minutes and RPO < 1 minute",
      "Designed cross-region DynamoDB replication with conflict resolution, supporting global user base across US, EU, and APAC",
    ],
    skillIds: ["skill-aws-architecture-review", "skill-aws-data-messaging", "skill-hld-tradeoffs"],
    capabilityIds: ["cap-aws-cloud-architecture", "cap-system-design-hld", "cap-distributed-systems"],
  },
  {
    id: "achievement-architecture-streaming-platform",
    category: "architecture",
    title: "Streaming platform evaluation and selection",
    prompt: "Describe evaluating streaming technologies — criteria, tradeoffs, POC results, and final recommendation.",
    examples: [
      "Evaluated and selected streaming platform (Kafka vs Pulsar) based on throughput, durability, and operational complexity requirements",
      "Designed event-driven architecture with Kafka, processing 1M+ events/hour with exactly-once semantics",
    ],
    skillIds: ["skill-async-architecture", "skill-hld-tradeoffs", "skill-case-study-hld"],
    capabilityIds: ["cap-distributed-systems", "cap-system-design-hld", "cap-architecture-case-studies"],
  },
  // ── Leadership ──────────────────────────────────────────────────────────
  {
    id: "achievement-leadership-mentorship",
    category: "leadership",
    title: "Structured mentorship and team growth",
    prompt: "Describe mentoring engineers — code review, design review, onboarding, and growth impact.",
    examples: [
      "Mentored 4 junior engineers through structured code review and design review process, 2 promoted within 12 months",
      "Established team onboarding program reducing ramp-up time from 6 weeks to 2 weeks for new hires",
    ],
    skillIds: ["skill-staff-leadership", "skill-senior-storytelling", "skill-personal-brand-building"],
    capabilityIds: ["cap-delivery-leadership", "cap-behavioral-communication", "cap-career-assets"],
  },
  {
    id: "achievement-leadership-incident-response",
    category: "leadership",
    title: "Incident response leadership",
    prompt: "Describe leading a major incident — scope, coordination, resolution, and postmortem improvements.",
    examples: [
      "Led incident response for P0 outage affecting 500K users — coordinated across 3 teams, resolved in 37 minutes",
      "Owned on-call rotation for 15 services, reduced mean time to acknowledge from 12min to 2min through runbook automation",
    ],
    skillIds: ["skill-incident-leadership", "skill-reliability-engineering", "skill-communication-tradeoffs"],
    capabilityIds: ["cap-delivery-leadership", "cap-reliability-observability", "cap-behavioral-communication"],
  },
  {
    id: "achievement-leadership-cross-team-strategy",
    category: "leadership",
    title: "Cross-team technical strategy",
    prompt: "Describe driving alignment across multiple teams — technical proposals, escalations, and org-wide changes.",
    examples: [
      "Drove cross-team API standardization initiative adopted by 6 squads, reducing integration errors by 45%",
      "Authored and socialized 8 architecture decision records that set org-wide standards for event-driven communication",
    ],
    skillIds: ["skill-staff-leadership", "skill-communication-tradeoffs", "skill-architect-positioning"],
    capabilityIds: ["cap-delivery-leadership", "cap-behavioral-communication", "cap-career-assets"],
  },
];

export const resumeFramingRules: ResumeFramingRule[] = [
  // ── Impact ──────────────────────────────────────────────────────────────
  {
    id: "rule-impact-replace-responsible",
    category: "impact",
    principle: "Replace 'responsible for' with 'delivered X resulting in Y'",
    beforeExample: "Responsible for maintaining the payment service",
    afterExample: "Delivered payment service improvements reducing transaction failures by 35%",
    explanation: "Recruiters scan for outcomes, not responsibilities. 'Responsible for' is passive filler that wastes the first 3-4 words of a bullet.",
  },
  {
    id: "rule-impact-quantify-before-after",
    category: "impact",
    principle: "Always include a before/after metric pair, not just a single number",
    beforeExample: "Improved API latency by 200ms",
    afterExample: "Reduced P95 latency from 950ms to 180ms by adding read-through caching layer",
    explanation: "A single number lacks context. Before/after shows the magnitude of improvement and implies your baseline understanding.",
  },
  // ── Ownership ───────────────────────────────────────────────────────────
  {
    id: "rule-ownership-action-verbs",
    category: "ownership",
    principle: "Start bullets with 'Owned', 'Led', 'Drove' instead of 'Helped', 'Involved in', 'Participated in'",
    beforeExample: "Helped with the migration to AWS",
    afterExample: "Owned AWS migration of 15 services including network re-architecture and cutover planning",
    explanation: "Weak verbs dilute ownership. 'Helped' suggests a supporting role. 'Owned' signals full accountability for outcome.",
  },
  {
    id: "rule-ownership-scope-clarity",
    category: "ownership",
    principle: "Define the scope boundary — team size, services owned, or business domain",
    beforeExample: "Worked on the recommendation engine",
    afterExample: "Owned recommendation engine serving 2M daily active users across web and mobile platforms",
    explanation: "Scope signals level. A senior engineer owns a service; a staff engineer owns a domain affecting millions of users.",
  },
  // ── Technical Depth ─────────────────────────────────────────────────────
  {
    id: "rule-technical-include-specifics",
    category: "technical-depth",
    principle: "Include specific technologies, design patterns, and performance metrics",
    beforeExample: "Optimized database queries",
    afterExample: "Redesigned DynamoDB access patterns using single-table design, reducing query latency from 120ms to 12ms",
    explanation: "Generic claims are forgettable. Specific technologies and patterns prove hands-on depth and architectural judgment.",
  },
  {
    id: "rule-technical-show-tradeoffs",
    category: "technical-depth",
    principle: "Mention why a particular approach was chosen over alternatives",
    beforeExample: "Implemented Redis caching",
    afterExample: "Selected Redis over Memcached for caching layer based on persistence and data structure requirements, achieving 90% hit rate",
    explanation: "Architects are evaluated on decision-making, not just implementation. Showing tradeoff awareness differentiates you from ICs.",
  },
  // ── Architecture ────────────────────────────────────────────────────────
  {
    id: "rule-architecture-tradeoff-decisions",
    category: "architecture",
    principle: "Highlight tradeoff decisions, not just technology lists",
    beforeExample: "Used Kafka for event streaming",
    afterExample: "Chose Kafka over RabbitMQ for event streaming based on durability guarantees, replay capability, and throughput requirements at 500K msg/sec",
    explanation: "A list of technologies shows familiarity; a decision with rationale shows architectural thinking. Solution Architect interviews probe tradeoff reasoning.",
  },
  {
    id: "rule-architecture-system-properties",
    category: "architecture",
    principle: "Reference non-functional requirements — scalability, availability, durability, consistency",
    beforeExample: "Designed order processing system",
    afterExample: "Designed order processing system with 99.99% availability, < 100ms P99 latency, and exactly-once processing guarantees",
    explanation: "NFRs define architecture quality. Including them signals you design for production constraints, not just feature delivery.",
  },
  // ── Leadership ──────────────────────────────────────────────────────────
  {
    id: "rule-leadership-scope-of-influence",
    category: "leadership",
    principle: "Show scope of influence — team size, cross-team coordination, stakeholder level",
    beforeExample: "Mentored some junior developers",
    afterExample: "Mentored 4 engineers (2 SWE1, 2 SWE2) through structured weekly design reviews; 2 promoted within 12 months",
    explanation: "Influence scope and measurable outcomes distinguish senior from staff. Promotion rates concretely prove mentorship impact.",
  },
  {
    id: "rule-leadership-incident-leadership-signal",
    category: "leadership",
    principle: "Frame incidents as leadership evidence, not operational burden",
    beforeExample: "Handled production incidents on rotation",
    afterExample: "Led P0 incident response for multi-region database failover — coordinated SRE, backend, and product teams under 30-minute SLA",
    explanation: "How you describe incidents signals whether you react to problems or lead through them. Focus on coordination and prevention.",
  },
  {
    id: "rule-leadership-cross-team-alignment",
    category: "leadership",
    principle: "Highlight org-wide impact and cross-team alignment work",
    beforeExample: "Wrote some design documents",
    afterExample: "Authored 5 architecture decision records adopted by 6 engineering teams as org-wide standards",
    explanation: "Standard-setting and org-wide influence are staff+ level signals. Adoption rate proves your proposals had real impact.",
  },
];

export const resumeSectionGuides: ResumeSectionGuide[] = [
  {
    section: "summary",
    purpose: "A 3-4 line professional summary that positions you for the target role (Solution Architect or Lead Backend) in the first 10 seconds of recruiter scan.",
    contentRules: [
      "Open with your title and YOE: 'Lead Backend Engineer with 10+ years building distributed systems'",
      "Include 2-3 core technical differentiators (e.g., AWS, microservices, system design)",
      "Mention industry or domain experience if relevant (e.g., fintech, e-commerce, SaaS)",
      "End with what you seek: 'seeking Solution Architect role designing scalable cloud-native platforms'",
      "NO buzzwords ('rockstar', 'ninja', 'passionate'). NO first-person ('I', 'my'). NO full sentences.",
    ],
    lengthGuide: "3-4 lines, 45-65 words. Shorter is harder but stronger.",
  },
  {
    section: "experience",
    purpose: "Chronological work history where each role has 4-6 achievement bullets framed using STAR-to-resume translation rules.",
    contentRules: [
      "Each bullet starts with a strong action verb: Delivered, Owned, Architected, Led, Designed, Drove, Reduced, Built",
      "Every bullet includes at least one quantified metric (%, ms, $, users, services, teams)",
      "Include technology names naturally within the achievement context, not as a comma-separated list",
      "Senior roles (last 5-7 years) get 5-6 bullets; earlier roles get 2-3 bullets",
      "Older roles (8+ years ago) can be summarized in 1-2 bullets with less detail",
      "Align bullet categories to the target role: prioritize architecture, scalability, and leadership bullets",
    ],
    lengthGuide: "Last 3 roles detailed (5-6 bullets each), earlier roles summarized. Total: 1-2 pages.",
  },
  {
    section: "skills",
    purpose: "A scannable skill section that passes ATS parsing and gives recruiters quick keyword matches for the target role.",
    contentRules: [
      "Group into categories: Architecture & Design, Cloud & Infrastructure, Backend & APIs, Databases & Storage, Leadership & Communication",
      "List specific technologies (AWS services, languages, frameworks, tools) — not generic categories",
      "Include architectural patterns: microservices, event-driven, CQRS, domain-driven design",
      "Keep to 15-25 skills across all categories — curated, not exhaustive",
      "NO proficiency bars or ratings — they waste space and are subjective",
    ],
    lengthGuide: "One compact section, 3-5 category groupings, 15-25 total skills.",
  },
  {
    section: "case-studies",
    purpose: "2-3 mini case studies that prove architecture depth — one per major project or system you designed.",
    contentRules: [
      "Each case study follows: Problem → Approach → Tradeoffs → Results (3-5 lines each)",
      "Name the system and its business context in the first sentence",
      "Describe the architecture decision (why X over Y) not just what was built",
      "Include a key metric: latency, throughput, availability, cost, team size, timeline",
      "Use technical depth to show hands-on credibility: patterns, AWS services, data models",
      "Keep to 2-3 case studies max — curated for the target role",
    ],
    lengthGuide: "2-3 case studies, 4-6 lines each. Can be on a third page or as supplemental material.",
  },
  {
    section: "certifications",
    purpose: "Relevant certifications that validate cloud, architecture, and technical expertise for the target role.",
    contentRules: [
      "List only active, relevant certifications (AWS Solutions Architect, AWS Developer, etc.)",
      "Include certification name, issuing body, and year obtained",
      "Omit expired or irrelevant certs (e.g., entry-level certs from 8+ years ago)",
      "If no certs, omit this section entirely — better absent than sparse",
    ],
    lengthGuide: "1-5 certifications. Single line per cert. Omit section if fewer than 1 relevant cert.",
  },
];

export const resumeTargetKeywords: ResumeKeyword[] = [
  {
    id: "keyword-microservices",
    keyword: "microservices",
    relevance: "Core architectural pattern for backend and architect roles — signals experience decomposing monoliths and managing service boundaries",
    targetRoles: ["solution-architect", "lead-backend", "staff-engineer"],
  },
  {
    id: "keyword-system-design",
    keyword: "system design",
    relevance: "Primary evaluation area in architect and senior backend interviews — must appear in summary and case studies",
    targetRoles: ["solution-architect", "lead-backend", "principal-engineer", "staff-engineer"],
  },
  {
    id: "keyword-aws",
    keyword: "AWS",
    relevance: "Dominant cloud platform for architect roles — specific services (ECS, DynamoDB, SQS, Lambda) are stronger than 'AWS' alone",
    targetRoles: ["solution-architect", "lead-backend", "principal-engineer"],
  },
  {
    id: "keyword-distributed-systems",
    keyword: "distributed systems",
    relevance: "Foundational knowledge area for architect interviews — signals understanding of consistency, partitioning, and failure modes",
    targetRoles: ["solution-architect", "principal-engineer", "staff-engineer"],
  },
  {
    id: "keyword-scalability",
    keyword: "scalability",
    relevance: "Key non-functional requirement — shows you design systems that grow without redesign",
    targetRoles: ["solution-architect", "lead-backend", "staff-engineer"],
  },
  {
    id: "keyword-api-design",
    keyword: "API design",
    relevance: "Core backend skill covering REST, contracts, versioning, and error handling — essential for lead and architect roles",
    targetRoles: ["lead-backend", "solution-architect"],
  },
  {
    id: "keyword-architecture",
    keyword: "architecture",
    relevance: "Broad but necessary keyword — must appear in summary and multiple experience bullets to signal role readiness",
    targetRoles: ["solution-architect", "principal-engineer", "staff-engineer"],
  },
  {
    id: "keyword-technical-strategy",
    keyword: "technical strategy",
    relevance: "Staff+ level signal — shows you think beyond individual features to multi-quarter platform direction",
    targetRoles: ["solution-architect", "staff-engineer", "principal-engineer"],
  },
  {
    id: "keyword-incident-management",
    keyword: "incident management",
    relevance: "Leadership signal for on-call and production responsibility — frame as coordination and prevention, not firefighting",
    targetRoles: ["lead-backend", "solution-architect", "staff-engineer"],
  },
  {
    id: "keyword-cost-optimization",
    keyword: "cost optimization",
    relevance: "Differentiator for architect roles — shows business awareness beyond purely technical decisions",
    targetRoles: ["solution-architect", "principal-engineer"],
  },
  {
    id: "keyword-ci-cd",
    keyword: "CI/CD",
    relevance: "Expected for senior backend and architect roles — signals DevOps maturity and deployment pipeline ownership",
    targetRoles: ["lead-backend", "solution-architect", "platform-engineer"],
  },
  {
    id: "keyword-infrastructure-as-code",
    keyword: "infrastructure as code",
    relevance: "Modern infrastructure expectation — Terraform, CloudFormation, or CDK experience is a strong signal",
    targetRoles: ["solution-architect", "platform-engineer", "lead-backend"],
  },
  {
    id: "keyword-performance-optimization",
    keyword: "performance optimization",
    relevance: "Quantifiable impact area — latency reduction, throughput improvement, and resource efficiency are strong metrics",
    targetRoles: ["lead-backend", "solution-architect"],
  },
  {
    id: "keyword-team-leadership",
    keyword: "team leadership",
    relevance: "Required for staff+ and architect roles — covers mentoring, onboarding, and cross-team coordination",
    targetRoles: ["solution-architect", "staff-engineer", "principal-engineer", "lead-backend"],
  },
  {
    id: "keyword-cross-team-collaboration",
    keyword: "cross-team collaboration",
    relevance: "Signals ability to drive alignment across org boundaries — critical for architect roles that span multiple squads",
    targetRoles: ["solution-architect", "staff-engineer", "principal-engineer"],
  },
  {
    id: "keyword-event-driven-architecture",
    keyword: "event-driven architecture",
    relevance: "Modern architectural pattern for decoupled, scalable systems — signals async design expertise",
    targetRoles: ["solution-architect", "lead-backend", "staff-engineer"],
  },
  {
    id: "keyword-resilience-patterns",
    keyword: "resilience patterns",
    relevance: "Production readiness signal — circuit breakers, bulkheads, retries, and graceful degradation are architect-level concerns",
    targetRoles: ["solution-architect", "principal-engineer", "staff-engineer"],
  },
  {
    id: "keyword-database-design",
    keyword: "database design",
    relevance: "Covers relational and NoSQL data modeling, indexing strategy, and query optimization — core for backend and architect roles",
    targetRoles: ["lead-backend", "solution-architect"],
  },
  {
    id: "keyword-security-architecture",
    keyword: "security architecture",
    relevance: "Differentiator for architect roles — IAM, encryption, authn/authz, and threat modeling knowledge is expected at senior levels",
    targetRoles: ["solution-architect", "principal-engineer"],
  },
  {
    id: "keyword-cloud-migration",
    keyword: "cloud migration",
    relevance: "Common architect responsibility — shows experience with re-platforming, re-architecting, and cutover planning",
    targetRoles: ["solution-architect", "staff-engineer"],
  },
];
