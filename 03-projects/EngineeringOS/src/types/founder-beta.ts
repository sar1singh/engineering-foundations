export type FounderBetaRole =
  | "solution-architect"
  | "em-aware-lead-backend"
  | "lead-backend"
  | "principal-engineer"
  | "staff-engineer";

export type CapabilityCategory =
  | "technical"
  | "leadership"
  | "behavioral-communication"
  | "career-assets"
  | "offer-readiness";

export type MissionType =
  | "learn"
  | "practice"
  | "implement"
  | "interview"
  | "behavioral"
  | "career-asset"
  | "revision"
  | "weak-area-repair"
  | "architecture-case-study";

export type ProofType =
  | "coding-solution"
  | "hld"
  | "lld"
  | "architecture-review"
  | "aws-design"
  | "incident-analysis"
  | "behavioral-answer"
  | "resume-review"
  | "github-project"
  | "case-study";

export type ReadinessDimension =
  | "knowledge"
  | "practice"
  | "interview"
  | "implementation";

export type ProofScore = 0 | 1 | 2 | 3 | 4 | 5;

export type SourceReliability = "high" | "medium" | "low";

export type SourceTier = "tier-1" | "tier-2" | "tier-3" | "tier-4";

export type SourceType =
  | "official-docs"
  | "github-repository"
  | "roadmap"
  | "book"
  | "interview-guide"
  | "engineering-blog"
  | "career-framework"
  | "job-description";

export type ReadinessGateStatus = "not-started" | "blocked" | "in-progress" | "ready";

export type Skill = {
  id: string;
  name: string;
  capabilityId: string;
  description: string;
  topicIds: string[];
  proofTypes: ProofType[];
};

export type Capability = {
  id: string;
  name: string;
  category: CapabilityCategory;
  whyItMatters: string;
  targetRoles: FounderBetaRole[];
  priorityWeight: number;
  readinessThreshold: number;
  sourceCategories: string[];
  sourceIds: string[];
  roadmapDependencies: string[];
  missionTypes: MissionType[];
  proofTypes: ProofType[];
  skillIds: string[];
};

export type SourceReference = {
  id: string;
  title: string;
  url: string;
  sourceType: SourceType;
  category: string;
  tier: SourceTier;
  reliability: SourceReliability;
  founderBetaRelevance: string;
  notes?: string;
};

export type TopicSourceMapping = {
  topicId: string;
  sourceIds: string[];
  usage: "validation" | "discovery" | "practice" | "interview" | "proof";
  confidenceScore: number;
  reviewerStatus: "ai_proposed" | "sarwan_review_required" | "sarwan_approved";
};

export type MasterTopic = {
  id: string;
  name: string;
  domainId: string;
  capabilityIds: string[];
  skillIds: string[];
  sourceIds: string[];
  prerequisiteTopicIds: string[];
  relatedTopicIds: string[];
  successorTopicIds: string[];
  alternativeTopicIds: string[];
  interviewImportance: "low" | "medium" | "high";
  roadmapPriority: "p0" | "p1" | "p2";
  estimatedStudyMinutes: number;
  estimatedPracticeMinutes: number;
  proofTypes: ProofType[];
  readinessMetrics: ReadinessDimension[];
  missionTypes: MissionType[];
  confidenceScore: number;
};

export type MissionTask = {
  id: string;
  description: string;
  expectedOutput: string;
};

export type ProofOfCompetency = {
  id: string;
  proofType: ProofType;
  title: string;
  requiredScore: ProofScore;
  rubric: string[];
};

export type DailyMission = {
  id: string;
  missionType: MissionType;
  objective: string;
  capabilityId: string;
  topicId: string;
  estimatedMinutes: number;
  mode: "weekday" | "weekend";
  prerequisiteTopicIds: string[];
  tasks: MissionTask[];
  proofRequirements: ProofOfCompetency[];
  readinessImpact: string[];
};

export type RoadmapProjection = {
  id: string;
  target: string;
  timelineWeeks: number;
  hoursPerWeek: number;
  primaryRole: FounderBetaRole;
  secondaryRole: FounderBetaRole;
  capabilityIds: string[];
  topicIds: string[];
  missionIds: string[];
  hardGateIds: string[];
};

export type ReadinessScore = {
  id: string;
  label: string;
  score: number;
  confidence: number;
  status: ReadinessGateStatus;
};

export type ReadinessRule = {
  id: string;
  label: string;
  threshold: number;
  appliesTo: "topic" | "capability" | "role" | "interview" | "offer";
  description: string;
};

export type OfferReadinessSignal = {
  id: string;
  label: string;
  readinessArea:
    | "resume"
    | "linkedin"
    | "github"
    | "portfolio"
    | "behavioral"
    | "interview"
    | "case-studies"
    | "applications"
    | "referrals"
    | "compensation";
  threshold?: number;
  status: ReadinessGateStatus;
  notes: string;
};

export type FounderBetaPath = {
  id: string;
  name: string;
  currentProfile: string;
  targetOutcome: string;
  timelineWeeks: number;
  hoursPerWeek: number;
  primaryRole: FounderBetaRole;
  secondaryRole: FounderBetaRole;
  capabilityIds: string[];
  roadmapProjectionId: string;
  hardGateIds: string[];
  caseStudyTopicIds: string[];
};
