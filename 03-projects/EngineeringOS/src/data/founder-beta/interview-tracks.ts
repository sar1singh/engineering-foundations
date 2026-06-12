export type TrackRole = "senior-backend" | "lead-backend" | "solution-architect" | "staff-engineer";

export type TrackCapabilityRequirement = {
  capabilityId: string;
  label: string;
  readinessThreshold: number;
  weight: "critical" | "high" | "medium" | "low";
  priority: 1 | 2 | 3 | 4;
};

export type TrackSkillRequirement = {
  skillId: string;
  label: string;
  weight: "critical" | "high" | "medium" | "low";
};

export type TrackTopicRequirement = {
  topicId: string;
  label: string;
  weight: "critical" | "high" | "medium" | "low";
};

export type TrackMissionRequirement = {
  missionId: string;
  label: string;
  weight: "required" | "recommended" | "optional";
};

export type InterviewTrack = {
  role: TrackRole;
  label: string;
  description: string;
  targetOutcome: string;
  typicalCompensation: string;
  interviewStages: string[];
  requiredCapabilities: TrackCapabilityRequirement[];
  requiredSkills: TrackSkillRequirement[];
  requiredTopics: TrackTopicRequirement[];
  recommendedMissions: TrackMissionRequirement[];
  readinessThresholds: Record<string, number>;
  estimatedPrepWeeks: number;
  estimatedHoursPerWeek: number;
};

const criticalCap = (
  capabilityId: string, label: string, readinessThreshold: number
): TrackCapabilityRequirement => ({
  capabilityId, label, readinessThreshold, weight: "critical" as const, priority: 1 as const
});

const highCap = (
  capabilityId: string, label: string, readinessThreshold: number
): TrackCapabilityRequirement => ({
  capabilityId, label, readinessThreshold, weight: "high" as const, priority: 2 as const
});

const mediumCap = (
  capabilityId: string, label: string, readinessThreshold: number
): TrackCapabilityRequirement => ({
  capabilityId, label, readinessThreshold, weight: "medium" as const, priority: 3 as const
});

const criticalSkill = (skillId: string, label: string): TrackSkillRequirement => ({
  skillId, label, weight: "critical" as const
});

const highSkill = (skillId: string, label: string): TrackSkillRequirement => ({
  skillId, label, weight: "high" as const
});

const mediumSkill = (skillId: string, label: string): TrackSkillRequirement => ({
  skillId, label, weight: "medium" as const
});

const criticalTopic = (topicId: string, label: string): TrackTopicRequirement => ({
  topicId, label, weight: "critical" as const
});

const highTopic = (topicId: string, label: string): TrackTopicRequirement => ({
  topicId, label, weight: "high" as const
});

const mediumTopic = (topicId: string, label: string): TrackTopicRequirement => ({
  topicId, label, weight: "medium" as const
});

const reqMission = (missionId: string, label: string): TrackMissionRequirement => ({
  missionId, label, weight: "required" as const
});

const recMission = (missionId: string, label: string): TrackMissionRequirement => ({
  missionId, label, weight: "recommended" as const
});

export const founderBetaInterviewTracks: InterviewTrack[] = [
  {
    role: "senior-backend",
    label: "Senior Backend Engineer",
    description: "Individual contributor driving technical delivery, code quality, and system design within a team. Expected to own medium-to-large features, mentor juniors, and participate in on-call rotation.",
    targetOutcome: "Senior Backend Engineer (E5/L5/Senior) at FAANG or equivalent product/GCC company",
    typicalCompensation: "50-70 LPA (India GCC), $180-250K (US)",
    interviewStages: [
      "Recruiter screen (30 min)",
      "Technical phone screen — DSA coding (45 min)",
      "Onsite: 3x DSA coding rounds (45 min each)",
      "Onsite: 1x System Design / HLD round (60 min)",
      "Onsite: 1x Behavioral / Leadership round (45 min)",
      "Onsite: 1x Hiring Manager round (30 min)"
    ],
    requiredCapabilities: [
      criticalCap("cap-node-backend", "Backend Engineering", 75),
      criticalCap("cap-dsa-problem-solving", "DSA / Problem Solving", 72),
      highCap("cap-system-design-hld", "System Design / HLD", 68),
      highCap("cap-databases", "Databases / Data Access", 70),
      mediumCap("cap-distributed-systems", "Distributed Systems", 65),
      mediumCap("cap-reliability-observability", "Reliability / Observability", 65),
      mediumCap("cap-behavioral-communication", "Behavioral & Communication", 65),
      mediumCap("cap-low-level-design", "Low Level Design", 65)
    ],
    requiredSkills: [
      criticalSkill("skill-api-contract-design", "API contract design"),
      criticalSkill("skill-backend-service-structure", "Backend service structure"),
      criticalSkill("skill-node-production-backend", "Production Node.js backend"),
      criticalSkill("skill-dsa-patterns", "Senior backend DSA patterns"),
      criticalSkill("skill-dsa-communication", "DSA interview communication"),
      highSkill("skill-hld-requirements", "HLD requirements framing"),
      highSkill("skill-hld-tradeoffs", "HLD tradeoff analysis"),
      highSkill("skill-data-modeling", "Data modeling"),
      highSkill("skill-data-access-performance", "Data access and performance"),
      highSkill("skill-js-language-core", "JavaScript language core"),
      highSkill("skill-js-async-programming", "JavaScript async programming"),
      mediumSkill("skill-distributed-consistency", "Distributed consistency"),
      mediumSkill("skill-reliability-engineering", "Reliability engineering"),
      mediumSkill("skill-senior-storytelling", "Senior-level storytelling"),
      mediumSkill("skill-node-observability", "Node.js observability"),
      mediumSkill("skill-lld-api-modeling", "LLD API and class modeling")
    ],
    requiredTopics: [
      criticalTopic("topic-api-design", "API Design"),
      criticalTopic("topic-service-boundaries", "Service Boundaries"),
      criticalTopic("topic-node-runtime", "Node.js Runtime"),
      criticalTopic("topic-node-async-event-loop", "Node.js Event Loop"),
      criticalTopic("topic-dsa-arrays-hashing", "DSA Arrays and Hashing"),
      criticalTopic("topic-dsa-trees-graphs", "DSA Trees and Graphs"),
      criticalTopic("topic-dsa-complexity-analysis", "Complexity Analysis"),
      highTopic("topic-postgres-schema-design", "PostgreSQL Schema Design"),
      highTopic("topic-database-indexing", "Database Indexing"),
      highTopic("topic-caching", "Caching"),
      highTopic("topic-load-balancing", "Load Balancing"),
      highTopic("topic-hld-capacity-estimation", "Capacity Estimation"),
      highTopic("topic-behavioral-star-stories", "STAR Stories"),
      mediumTopic("topic-redis-caching", "Redis Caching"),
      mediumTopic("topic-queues", "Queues and Event-Driven"),
      mediumTopic("topic-incident-response", "Incident Response"),
      mediumTopic("topic-lld-rate-limiter", "Rate Limiter LLD"),
      mediumTopic("topic-observability-logs-metrics-traces", "Observability")
    ],
    recommendedMissions: [
      reqMission("mission-practice-api-design", "API design practice"),
      reqMission("mission-interview-caching-tradeoffs", "Caching interview"),
      reqMission("mission-behavioral-star-ownership", "Ownership STAR story"),
      recMission("mission-practice-js-closures-scope", "JS closures"),
      recMission("mission-practice-js-event-loop", "JS event loop"),
      recMission("mission-practice-secure-api-review", "Secure API review"),
      recMission("mission-practice-slo-error-budget", "SLO error budget")
    ],
    readinessThresholds: {
      overallReadiness: 72,
      dsaReadiness: 72,
      backendReadiness: 75,
      systemDesignReadiness: 68,
      behavioralReadiness: 65
    },
    estimatedPrepWeeks: 8,
    estimatedHoursPerWeek: 12
  },
  {
    role: "lead-backend",
    label: "Lead Backend Engineer",
    description: "Senior contributor with team lead responsibilities — technical direction, cross-team coordination, architecture decisions, and delivery ownership. Balances IC depth with leadership scope.",
    targetOutcome: "Lead Backend Engineer / Staff Backend (E5/L5-E6/L6) at GCC or product company",
    typicalCompensation: "60-80 LPA (India GCC), $200-320K (US)",
    interviewStages: [
      "Recruiter screen (30 min)",
      "Technical phone — DSA or LLD (45 min)",
      "Onsite: 2x DSA coding rounds (45 min each)",
      "Onsite: 2x System Design / HLD rounds (60 min each)",
      "Onsite: 1x LLD / API design round (45 min)",
      "Onsite: 1x Behavioral / Leadership round (60 min)"
    ],
    requiredCapabilities: [
      criticalCap("cap-node-backend", "Backend Engineering", 78),
      criticalCap("cap-system-design-hld", "System Design / HLD", 75),
      criticalCap("cap-behavioral-communication", "Behavioral & Communication", 72),
      highCap("cap-dsa-problem-solving", "DSA / Problem Solving", 68),
      highCap("cap-databases", "Databases / Data Access", 72),
      highCap("cap-distributed-systems", "Distributed Systems", 70),
      highCap("cap-delivery-leadership", "Delivery & Leadership", 68),
      highCap("cap-low-level-design", "Low Level Design", 68),
      mediumCap("cap-reliability-observability", "Reliability / Observability", 68),
      mediumCap("cap-aws-cloud-architecture", "AWS / Cloud Architecture", 65)
    ],
    requiredSkills: [
      criticalSkill("skill-api-contract-design", "API contract design"),
      criticalSkill("skill-node-production-backend", "Production Node.js backend"),
      criticalSkill("skill-hld-requirements", "HLD requirements framing"),
      criticalSkill("skill-hld-tradeoffs", "HLD tradeoff analysis"),
      criticalSkill("skill-senior-storytelling", "Senior-level storytelling"),
      criticalSkill("skill-delivery-risk", "Delivery and risk leadership"),
      highSkill("skill-distributed-consistency", "Distributed consistency"),
      highSkill("skill-async-architecture", "Asynchronous architecture"),
      highSkill("skill-data-modeling", "Data modeling"),
      highSkill("skill-data-access-performance", "Data access and performance"),
      highSkill("skill-incident-leadership", "Incident leadership"),
      highSkill("skill-communication-tradeoffs", "Architecture communication"),
      mediumSkill("skill-dsa-patterns", "Senior backend DSA patterns"),
      mediumSkill("skill-reliability-engineering", "Reliability engineering"),
      mediumSkill("skill-lld-api-modeling", "LLD API and class modeling"),
      mediumSkill("skill-lld-workflow-modeling", "LLD workflow modeling"),
      mediumSkill("skill-aws-foundations", "AWS foundations")
    ],
    requiredTopics: [
      criticalTopic("topic-api-design", "API Design"),
      criticalTopic("topic-service-boundaries", "Service Boundaries"),
      criticalTopic("topic-hld-requirements", "HLD Requirements"),
      criticalTopic("topic-hld-capacity-estimation", "Capacity Estimation"),
      criticalTopic("topic-caching", "Caching"),
      criticalTopic("topic-load-balancing", "Load Balancing"),
      criticalTopic("topic-architecture-tradeoffs", "Architecture Tradeoffs"),
      criticalTopic("topic-behavioral-star-stories", "STAR Stories"),
      criticalTopic("topic-ownership-story", "Ownership Story"),
      highTopic("topic-queues", "Queues and Event-Driven"),
      highTopic("topic-event-driven-architecture", "Event-Driven Architecture"),
      highTopic("topic-consistency-models", "Consistency Models"),
      highTopic("topic-incident-response", "Incident Response"),
      highTopic("topic-delivery-risk-communication", "Delivery Risk"),
      highTopic("topic-postgres-schema-design", "PostgreSQL Schema Design"),
      highTopic("topic-database-indexing", "Database Indexing"),
      highTopic("topic-lld-api-contracts", "LLD API Contracts"),
      mediumTopic("topic-node-runtime", "Node.js Runtime"),
      mediumTopic("topic-dsa-trees-graphs", "DSA Trees and Graphs"),
      mediumTopic("topic-incident-story", "Incident Story"),
      mediumTopic("topic-cross-team-dependency-management", "Cross-team dependencies")
    ],
    recommendedMissions: [
      reqMission("mission-practice-api-design", "API design practice"),
      reqMission("mission-interview-caching-tradeoffs", "Caching interview"),
      reqMission("mission-behavioral-star-ownership", "Ownership STAR story"),
      reqMission("mission-implement-rate-limiter", "Rate limiter design"),
      recMission("mission-practice-incident-review", "Incident review practice"),
      recMission("mission-practice-slo-error-budget", "SLO error budget practice"),
      recMission("mission-behavioral-leadership-story", "Leadership story mission"),
      recMission("mission-behavioral-follow-up-prep", "Follow-up answer prep")
    ],
    readinessThresholds: {
      overallReadiness: 75,
      dsaReadiness: 68,
      backendReadiness: 78,
      systemDesignReadiness: 75,
      behavioralReadiness: 72,
      leadershipReadiness: 68
    },
    estimatedPrepWeeks: 12,
    estimatedHoursPerWeek: 10
  },
  {
    role: "solution-architect",
    label: "Solution Architect",
    description: "Customer-facing and internal architect driving technical strategy, AWS architecture, system design, and cross-team technical direction. Combines deep technical breadth with executive communication.",
    targetOutcome: "Solution Architect (SA/CSA) at AWS, GCC, or product company at 70-80+ LPA",
    typicalCompensation: "70-90 LPA (India GCC), $220-350K (US)",
    interviewStages: [
      "Recruiter screen (30 min)",
      "Hiring Manager screen — architecture experience deep dive (45 min)",
      "Onsite: 1x HLD / System Design round (75 min)",
      "Onsite: 1x AWS Architecture / Well-Architected round (60 min)",
      "Onsite: 1x Behavioral / Leadership / Stakeholder round (60 min)",
      "Onsite: 1x Case Study presentation (60 min + Q&A)",
      "Onsite: 1x Whiteboarding / Problem-solving round (45 min)"
    ],
    requiredCapabilities: [
      criticalCap("cap-aws-cloud-architecture", "AWS / Cloud Architecture", 75),
      criticalCap("cap-system-design-hld", "System Design / HLD", 78),
      criticalCap("cap-architecture-case-studies", "Architecture Case Studies", 80),
      criticalCap("cap-behavioral-communication", "Behavioral & Communication", 75),
      criticalCap("cap-offer-readiness", "Offer Readiness", 75),
      highCap("cap-node-backend", "Backend Engineering", 70),
      highCap("cap-distributed-systems", "Distributed Systems", 72),
      highCap("cap-databases", "Databases / Data Access", 72),
      highCap("cap-delivery-leadership", "Delivery & Leadership", 72),
      highCap("cap-career-assets", "Career Assets", 80),
      mediumCap("cap-security", "Security", 68),
      mediumCap("cap-reliability-observability", "Reliability / Observability", 70),
      mediumCap("cap-platform-engineering", "Platform Engineering", 65),
      mediumCap("cap-dsa-problem-solving", "DSA / Problem Solving", 60)
    ],
    requiredSkills: [
      criticalSkill("skill-aws-architecture-review", "AWS architecture review"),
      criticalSkill("skill-aws-foundations", "AWS foundations"),
      criticalSkill("skill-hld-requirements", "HLD requirements framing"),
      criticalSkill("skill-hld-tradeoffs", "HLD tradeoff analysis"),
      criticalSkill("skill-hld-interview-execution", "HLD interview execution"),
      criticalSkill("skill-case-study-hld", "Architecture case study HLD"),
      criticalSkill("skill-case-study-review", "Case study architecture review"),
      criticalSkill("skill-senior-storytelling", "Senior-level storytelling"),
      criticalSkill("skill-communication-tradeoffs", "Architecture communication"),
      criticalSkill("skill-architect-positioning", "Architect positioning"),
      criticalSkill("skill-offer-gates", "Offer readiness gates"),
      highSkill("skill-aws-data-messaging", "AWS data and messaging"),
      highSkill("skill-async-architecture", "Asynchronous architecture"),
      highSkill("skill-distributed-consistency", "Distributed consistency"),
      highSkill("skill-data-modeling", "Data modeling"),
      highSkill("skill-reliability-engineering", "Reliability engineering"),
      highSkill("skill-observability-design", "Observability design"),
      highSkill("skill-interview-pipeline", "Interview pipeline readiness"),
      mediumSkill("skill-security-practice", "Security practice"),
      mediumSkill("skill-threat-modeling", "Threat modeling"),
      mediumSkill("skill-conflict-resolution", "Conflict resolution"),
      mediumSkill("skill-staff-leadership", "Staff engineering leadership"),
      mediumSkill("skill-platform-cicd", "CI/CD pipeline architecture"),
      mediumSkill("skill-personal-brand-building", "Personal brand building")
    ],
    requiredTopics: [
      criticalTopic("topic-aws-well-architected", "AWS Well-Architected"),
      criticalTopic("topic-aws-multi-az-design", "AWS Multi-AZ Design"),
      criticalTopic("topic-hld-requirements", "HLD Requirements"),
      criticalTopic("topic-hld-capacity-estimation", "Capacity Estimation"),
      criticalTopic("topic-hld-interview-structure", "HLD Interview Structure"),
      criticalTopic("topic-caching", "Caching"),
      criticalTopic("topic-load-balancing", "Load Balancing"),
      criticalTopic("topic-architecture-tradeoffs", "Architecture Tradeoffs"),
      criticalTopic("topic-engineeringos-architecture-case-study", "EngineeringOS Case Study"),
      criticalTopic("topic-agent-os-architecture-case-study", "Agent-OS Case Study"),
      criticalTopic("topic-large-scale-learning-platform-case-study", "Learning Platform Case Study"),
      criticalTopic("topic-behavioral-star-stories", "STAR Stories"),
      criticalTopic("topic-communication-tradeoffs", "Communication Tradeoffs"),
      criticalTopic("topic-application-readiness-gates", "Application Readiness"),
      criticalTopic("topic-compensation-targeting", "Compensation Targeting"),
      highTopic("topic-aws-vpc-networking", "AWS VPC Networking"),
      highTopic("topic-aws-compute-options", "AWS Compute Options"),
      highTopic("topic-aws-cost-performance-tradeoffs", "AWS Cost Performance"),
      highTopic("topic-queues", "Queues and Event-Driven"),
      highTopic("topic-event-driven-architecture", "Event-Driven Architecture"),
      highTopic("topic-consistency-models", "Consistency Models"),
      highTopic("topic-replication-partitioning", "Replication and Partitioning"),
      highTopic("topic-slos-slas", "SLOs and SLAs"),
      highTopic("topic-failure-modes", "Failure Modes"),
      highTopic("topic-resume-positioning", "Resume Positioning"),
      highTopic("topic-portfolio-case-study-packaging", "Case Study Packaging"),
      highTopic("topic-incident-story", "Incident Story"),
      highTopic("topic-stakeholder-update", "Stakeholder Update"),
      mediumTopic("topic-iam-deep-dive", "IAM Deep Dive"),
      mediumTopic("topic-multi-account-organization", "Multi-Account Organization"),
      mediumTopic("topic-dynamodb-advanced-patterns", "DynamoDB Advanced"),
      mediumTopic("topic-disaster-recovery-deep", "Disaster Recovery"),
      mediumTopic("topic-security-architecture-review", "Security Architecture Review"),
      mediumTopic("topic-cross-org-influence", "Cross-Org Influence"),
      mediumTopic("topic-technical-strategy", "Technical Strategy"),
      mediumTopic("topic-referral-outreach", "Referral Outreach")
    ],
    recommendedMissions: [
      reqMission("mission-learn-aws-well-architected", "AWS Well-Architected"),
      reqMission("mission-case-study-engineeringos-hld", "EngineeringOS case study"),
      reqMission("mission-interview-caching-tradeoffs", "Caching interview"),
      reqMission("mission-behavioral-star-ownership", "Ownership STAR story"),
      reqMission("mission-behavioral-leadership-story", "Leadership story"),
      reqMission("mission-behavioral-technical-strategy", "Technical strategy"),
      reqMission("mission-career-resume-positioning", "Resume positioning"),
      recMission("mission-behavioral-follow-up-prep", "Follow-up answer prep"),
      recMission("mission-behavioral-failure-story", "Failure story"),
      recMission("mission-behavioral-story-inventory", "Story inventory"),
      recMission("mission-behavioral-story-tailoring", "Story tailoring"),
      recMission("mission-behavioral-staff-scope", "Staff scope assessment"),
      recMission("mission-behavioral-conflict-resolution", "Conflict resolution"),
      recMission("mission-career-personal-brand-audit", "Personal brand audit"),
      recMission("mission-practice-slo-error-budget", "SLO error budget practice"),
      recMission("mission-arch-production-readiness", "Production readiness review")
    ],
    readinessThresholds: {
      overallReadiness: 78,
      awsReadiness: 75,
      systemDesignReadiness: 78,
      architectureCaseStudyReadiness: 80,
      behavioralReadiness: 75,
      communicationReadiness: 75,
      resumeReadiness: 80,
      offerReadiness: 75
    },
    estimatedPrepWeeks: 16,
    estimatedHoursPerWeek: 10
  },
  {
    role: "staff-engineer",
    label: "Staff Engineer",
    description: "Senior technical leader driving organization-wide architecture, technical strategy, engineering culture, and cross-team execution. Operates at company scope rather than team scope.",
    targetOutcome: "Staff Engineer / Principal Engineer (L6/L7/E7) at FAANG or equivalent high-scale product company",
    typicalCompensation: "80-120 LPA (India GCC), $300-500K (US)",
    interviewStages: [
      "Recruiter screen (30 min)",
      "HM screen — technical strategy deep dive (45 min)",
      "Onsite: 1x System Design / Architecture round (75 min)",
      "Onsite: 1x Technical Strategy round (60 min)",
      "Onsite: 1x Leadership / Cross-Org Influence round (60 min)",
      "Onsite: 1x Behavioral / Culture / Mentoring round (45 min)",
      "Onsite: 1x Coding / DSA round (45 min) — lighter depth, more system design"
    ],
    requiredCapabilities: [
      criticalCap("cap-system-design-hld", "System Design / HLD", 80),
      criticalCap("cap-delivery-leadership", "Delivery & Leadership", 78),
      criticalCap("cap-behavioral-communication", "Behavioral & Communication", 78),
      criticalCap("cap-architecture-case-studies", "Architecture Case Studies", 80),
      highCap("cap-distributed-systems", "Distributed Systems", 75),
      highCap("cap-aws-cloud-architecture", "AWS / Cloud Architecture", 72),
      highCap("cap-node-backend", "Backend Engineering", 72),
      highCap("cap-databases", "Databases / Data Access", 72),
      highCap("cap-reliability-observability", "Reliability / Observability", 72),
      mediumCap("cap-platform-engineering", "Platform Engineering", 68),
      mediumCap("cap-security", "Security", 68),
      mediumCap("cap-career-assets", "Career Assets", 72),
      mediumCap("cap-dsa-problem-solving", "DSA / Problem Solving", 65)
    ],
    requiredSkills: [
      criticalSkill("skill-staff-leadership", "Staff engineering leadership"),
      criticalSkill("skill-delivery-risk", "Delivery and risk leadership"),
      criticalSkill("skill-incident-leadership", "Incident leadership"),
      criticalSkill("skill-senior-storytelling", "Senior-level storytelling"),
      criticalSkill("skill-communication-tradeoffs", "Architecture communication"),
      criticalSkill("skill-hld-tradeoffs", "HLD tradeoff analysis"),
      criticalSkill("skill-case-study-hld", "Architecture case study HLD"),
      criticalSkill("skill-case-study-review", "Case study architecture review"),
      highSkill("skill-async-architecture", "Asynchronous architecture"),
      highSkill("skill-distributed-consistency", "Distributed consistency"),
      highSkill("skill-reliability-engineering", "Reliability engineering"),
      highSkill("skill-observability-design", "Observability design"),
      highSkill("skill-aws-architecture-review", "AWS architecture review"),
      highSkill("skill-hld-requirements", "HLD requirements framing"),
      highSkill("skill-conflict-resolution", "Conflict resolution"),
      highSkill("skill-interview-story-mapping", "Interview story mapping"),
      mediumSkill("skill-platform-developer-experience", "Developer experience"),
      mediumSkill("skill-platform-service-ownership", "Service ownership"),
      mediumSkill("skill-personal-brand-building", "Personal brand building"),
      mediumSkill("skill-data-modeling", "Data modeling"),
      mediumSkill("skill-threat-modeling", "Threat modeling")
    ],
    requiredTopics: [
      criticalTopic("topic-staff-engineer-scope", "Staff Engineer Scope"),
      criticalTopic("topic-technical-strategy", "Technical Strategy"),
      criticalTopic("topic-cross-org-influence", "Cross-Org Influence"),
      criticalTopic("topic-engineering-culture", "Engineering Culture"),
      criticalTopic("topic-architectural-vision", "Architectural Vision"),
      criticalTopic("topic-architecture-tradeoffs", "Architecture Tradeoffs"),
      criticalTopic("topic-hld-requirements", "HLD Requirements"),
      criticalTopic("topic-delivery-risk-communication", "Delivery Risk"),
      criticalTopic("topic-incident-response", "Incident Response"),
      criticalTopic("topic-incident-story", "Incident Story"),
      criticalTopic("topic-postmortem-writing", "Postmortem Writing"),
      highTopic("topic-behavioral-star-stories", "STAR Stories"),
      highTopic("topic-leadership-story", "Leadership Story"),
      highTopic("topic-conflict-resolution", "Conflict Resolution"),
      highTopic("topic-mentoring-vs-sponsorship", "Mentoring vs Sponsorship"),
      highTopic("topic-engineeringos-architecture-case-study", "EngineeringOS Case Study"),
      highTopic("topic-agent-os-architecture-case-study", "Agent-OS Case Study"),
      highTopic("topic-large-scale-learning-platform-case-study", "Learning Platform Case Study"),
      highTopic("topic-caching", "Caching"),
      highTopic("topic-queues", "Queues and Event-Driven"),
      highTopic("topic-consistency-models", "Consistency Models"),
      highTopic("topic-failure-modes", "Failure Modes"),
      mediumTopic("topic-internal-developer-platforms", "Internal Developer Platforms"),
      mediumTopic("topic-golden-paths", "Golden Paths"),
      mediumTopic("topic-service-ownership", "Service Ownership"),
      mediumTopic("topic-stakeholder-update", "Stakeholder Update"),
      mediumTopic("topic-personal-brand-building", "Personal Brand Building"),
      mediumTopic("topic-content-creation-technical", "Technical Content Creation"),
      mediumTopic("topic-conference-speaking", "Conference Speaking")
    ],
    recommendedMissions: [
      reqMission("mission-behavioral-leadership-story", "Leadership story"),
      reqMission("mission-behavioral-technical-strategy", "Technical strategy"),
      reqMission("mission-behavioral-staff-scope", "Staff scope assessment"),
      reqMission("mission-behavioral-conflict-resolution", "Conflict resolution"),
      reqMission("mission-behavioral-story-inventory", "Story inventory"),
      reqMission("mission-behavioral-follow-up-prep", "Follow-up answer prep"),
      recMission("mission-case-study-engineeringos-hld", "EngineeringOS case study"),
      recMission("mission-behavioral-star-ownership", "Ownership STAR story"),
      recMission("mission-behavioral-failure-story", "Failure story"),
      recMission("mission-behavioral-story-tailoring", "Story tailoring"),
      recMission("mission-career-personal-brand-audit", "Personal brand audit"),
      recMission("mission-career-technical-content", "Technical content creation"),
      recMission("mission-practice-incident-review", "Incident review practice"),
      recMission("mission-arch-production-readiness", "Production readiness review"),
      recMission("mission-interview-caching-tradeoffs", "Caching interview")
    ],
    readinessThresholds: {
      overallReadiness: 80,
      systemDesignReadiness: 80,
      leadershipReadiness: 78,
      behavioralReadiness: 78,
      architectureCaseStudyReadiness: 80,
      communicationReadiness: 78
    },
    estimatedPrepWeeks: 16,
    estimatedHoursPerWeek: 10
  }
];
