import type { Capability, FounderBetaPath, Skill } from "@/types/founder-beta";

export const founderBetaSkills: Skill[] = [
  {
    id: "skill-hld-tradeoffs",
    name: "HLD tradeoff analysis",
    capabilityId: "cap-system-design-hld",
    description: "Frame requirements, bottlenecks, scaling paths, and tradeoffs for senior HLD interviews.",
    topicIds: ["topic-api-design", "topic-caching", "topic-load-balancing", "topic-queues"],
    proofTypes: ["hld", "architecture-review"]
  },
  {
    id: "skill-aws-architecture-review",
    name: "AWS architecture review",
    capabilityId: "cap-aws-cloud-architecture",
    description: "Review a cloud architecture using reliability, security, operations, cost, and performance lenses.",
    topicIds: ["topic-aws-well-architected", "topic-load-balancing", "topic-queues"],
    proofTypes: ["aws-design", "architecture-review"]
  },
  {
    id: "skill-node-production-backend",
    name: "Production Node.js backend design",
    capabilityId: "cap-node-backend",
    description: "Design Node.js APIs with reliability, error handling, and production readiness.",
    topicIds: ["topic-api-design", "topic-rate-limiting"],
    proofTypes: ["lld", "case-study"]
  },
  {
    id: "skill-data-access-performance",
    name: "Data access and performance",
    capabilityId: "cap-databases",
    description: "Explain indexing, caching, and query-performance tradeoffs for backend systems.",
    topicIds: ["topic-database-indexing", "topic-redis-caching", "topic-caching"],
    proofTypes: ["architecture-review", "case-study"]
  },
  {
    id: "skill-senior-storytelling",
    name: "Senior-level storytelling",
    capabilityId: "cap-behavioral-communication",
    description: "Convert real work into STAR stories with ownership, tradeoffs, metrics, and follow-ups.",
    topicIds: ["topic-behavioral-star-stories", "topic-engineeringos-architecture-case-study"],
    proofTypes: ["behavioral-answer", "case-study"]
  },
  {
    id: "skill-architect-positioning",
    name: "Architect positioning",
    capabilityId: "cap-career-assets",
    description: "Shape resume and portfolio artifacts toward Solution Architect readiness.",
    topicIds: ["topic-resume-positioning", "topic-engineeringos-architecture-case-study"],
    proofTypes: ["resume-review", "case-study"]
  },
  {
    id: "skill-offer-gates",
    name: "Offer readiness gates",
    capabilityId: "cap-offer-readiness",
    description: "Track hard gates, case studies, compensation targets, and application readiness separately.",
    topicIds: ["topic-resume-positioning", "topic-behavioral-star-stories"],
    proofTypes: ["resume-review", "behavioral-answer", "case-study"]
  }
];

export const founderBetaCapabilities: Capability[] = [
  {
    id: "cap-system-design-hld",
    name: "System Design / HLD",
    category: "technical",
    whyItMatters: "Architect readiness depends on structured HLD, scaling, failure modes, and tradeoff communication.",
    targetRoles: ["solution-architect", "em-aware-lead-backend", "lead-backend", "principal-engineer", "staff-engineer"],
    priorityWeight: 16,
    readinessThreshold: 75,
    sourceCategories: ["github-repository", "roadmap", "engineering-blog"],
    sourceIds: ["hld-system-design-primer", "hld-bytebytego", "hld-awesome-system-design", "hld-roadmap-system-design"],
    roadmapDependencies: ["cap-node-backend", "cap-databases"],
    missionTypes: ["learn", "practice", "implement", "interview", "architecture-case-study"],
    proofTypes: ["hld", "architecture-review", "case-study"],
    skillIds: ["skill-hld-tradeoffs"]
  },
  {
    id: "cap-aws-cloud-architecture",
    name: "AWS / Cloud Architecture",
    category: "technical",
    whyItMatters: "AWS architecture is the primary differentiator for the founder Solution Architect path.",
    targetRoles: ["solution-architect", "lead-backend", "principal-engineer", "staff-engineer"],
    priorityWeight: 18,
    readinessThreshold: 70,
    sourceCategories: ["official-docs", "roadmap", "engineering-blog"],
    sourceIds: ["aws-well-architected", "aws-docs", "aws-architecture-center", "sa-roadmap-aws"],
    roadmapDependencies: ["cap-system-design-hld"],
    missionTypes: ["learn", "implement", "interview", "revision", "weak-area-repair", "architecture-case-study"],
    proofTypes: ["aws-design", "architecture-review", "case-study"],
    skillIds: ["skill-aws-architecture-review"]
  },
  {
    id: "cap-node-backend",
    name: "Node.js Backend",
    category: "technical",
    whyItMatters: "The founder's strongest existing leverage is senior backend delivery and Node.js production design.",
    targetRoles: ["solution-architect", "lead-backend", "principal-engineer", "staff-engineer"],
    priorityWeight: 8,
    readinessThreshold: 70,
    sourceCategories: ["official-docs", "github-repository"],
    sourceIds: ["node-docs", "nodebestpractices"],
    roadmapDependencies: [],
    missionTypes: ["learn", "practice", "implement", "interview"],
    proofTypes: ["lld", "architecture-review"],
    skillIds: ["skill-node-production-backend"]
  },
  {
    id: "cap-databases",
    name: "Databases",
    category: "technical",
    whyItMatters: "Architect and backend interviews require strong indexing, caching, transaction, and data modeling tradeoffs.",
    targetRoles: ["solution-architect", "lead-backend", "principal-engineer", "staff-engineer"],
    priorityWeight: 9,
    readinessThreshold: 70,
    sourceCategories: ["official-docs", "book"],
    sourceIds: ["db-postgres-docs", "db-redis-docs", "dist-google-sre-book"],
    roadmapDependencies: ["cap-node-backend"],
    missionTypes: ["learn", "practice", "implement", "interview", "revision"],
    proofTypes: ["architecture-review", "case-study"],
    skillIds: ["skill-data-access-performance"]
  },
  {
    id: "cap-behavioral-communication",
    name: "Behavioral & Communication",
    category: "behavioral-communication",
    whyItMatters: "Senior and architect loops require clear stories, ownership, conflict handling, and tradeoff communication.",
    targetRoles: ["solution-architect", "em-aware-lead-backend", "lead-backend", "principal-engineer", "staff-engineer"],
    priorityWeight: 7,
    readinessThreshold: 70,
    sourceCategories: ["interview-guide", "career-framework"],
    sourceIds: ["beh-tech-handbook", "beh-amazon-lp", "staff-staffeng"],
    roadmapDependencies: [],
    missionTypes: ["behavioral", "interview", "revision", "career-asset"],
    proofTypes: ["behavioral-answer", "case-study"],
    skillIds: ["skill-senior-storytelling"]
  },
  {
    id: "cap-career-assets",
    name: "Career Assets",
    category: "career-assets",
    whyItMatters: "Resume, portfolio, GitHub, and case studies turn learning into visible offer-readiness proof.",
    targetRoles: ["solution-architect", "em-aware-lead-backend", "lead-backend", "principal-engineer", "staff-engineer"],
    priorityWeight: 8,
    readinessThreshold: 80,
    sourceCategories: ["interview-guide", "career-framework"],
    sourceIds: ["profile-tech-handbook-resume", "profile-google-resume", "staff-staffeng"],
    roadmapDependencies: ["cap-system-design-hld", "cap-behavioral-communication"],
    missionTypes: ["career-asset", "architecture-case-study", "revision"],
    proofTypes: ["resume-review", "github-project", "case-study"],
    skillIds: ["skill-architect-positioning"]
  },
  {
    id: "cap-offer-readiness",
    name: "Offer Readiness",
    category: "offer-readiness",
    whyItMatters: "The founder beta succeeds only when readiness translates into a credible application and offer path.",
    targetRoles: ["solution-architect", "em-aware-lead-backend", "lead-backend", "principal-engineer", "staff-engineer"],
    priorityWeight: 8,
    readinessThreshold: 75,
    sourceCategories: ["job-description", "career-framework"],
    sourceIds: ["career-linkedin-solution-architect-jobs", "career-levels", "career-ambitionbox"],
    roadmapDependencies: ["cap-career-assets", "cap-behavioral-communication"],
    missionTypes: ["career-asset", "revision"],
    proofTypes: ["resume-review", "behavioral-answer", "case-study"],
    skillIds: ["skill-offer-gates"]
  }
];

export const founderBetaPath: FounderBetaPath = {
  id: "founder-beta-solution-architect",
  name: "Founder Beta Solution Architect Path",
  currentProfile: "10+ YOE Senior / Lead Backend Engineer at approximately 40 LPA.",
  targetOutcome: "Solution Architect readiness for 70-80+ LPA Product / GCC / FAANG-level opportunities.",
  timelineWeeks: 16,
  hoursPerWeek: 10,
  primaryRole: "solution-architect",
  secondaryRole: "em-aware-lead-backend",
  capabilityIds: founderBetaCapabilities.map((capability) => capability.id),
  roadmapProjectionId: "founder-architect-beta-16-week",
  hardGateIds: [
    "rule-architect-readiness",
    "rule-aws-readiness",
    "rule-behavioral-readiness",
    "rule-communication-readiness",
    "rule-resume-readiness",
    "rule-architecture-case-studies"
  ],
  caseStudyTopicIds: ["topic-engineeringos-architecture-case-study"]
};
