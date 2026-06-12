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
  | "knowledge"
  | "coding-solution"
  | "complexity-analysis"
  | "pattern-explanation"
  | "implementation-task"
  | "interview-answer"
  | "hld"
  | "lld"
  | "architecture-review"
  | "aws-design"
  | "incident-analysis"
  | "behavioral-answer"
  | "resume-review"
  | "github-project"
  | "case-study"
  // Phase 3: Interview Readiness
  | "dsa-interview"
  | "lld-interview"
  | "hld-interview"
  | "behavioral-interview";

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
  | "job-description"
  | "security-guides";

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
    | "compensation"
    | "technical"
    | "leadership"
    | "communication"
    | "architecture"
    | "project-depth";
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

// Phase 2A: Roadmap Projection types
export type RoadmapPhase = {
  id: string;
  label: string;
  weekStart: number;
  weekEnd: number;
  focus: string;
  capabilityIds: string[];
  skillIds: string[];
  topicIds: string[];
};

export type RoadmapWeek = {
  weekNumber: number;
  phaseId: string;
  phaseLabel: string;
  focusCapabilityIds: string[];
  focusSkillIds: string[];
  focusTopicIds: string[];
  estimatedHours: number;
};

export type RoadmapProjectionResult = {
  id: string;
  target: string;
  timelineWeeks: number;
  hoursPerWeek: number;
  phases: RoadmapPhase[];
  weeklyBreakdown: RoadmapWeek[];
  priorityCapabilityOrder: string[];
  recommendedSkillOrder: string[];
  recommendedTopicProgression: string[];
};

// Phase 2B: Mission Candidate Generation

export type MissionCandidatePriority = "critical" | "high" | "medium" | "low";

export type MissionCandidate = {
  id: string;
  missionType: MissionType;
  capabilityId: string;
  skillId: string;
  topicIds: string[];
  proofTypes: ProofType[];
  estimatedMinutes: number;
  readinessTarget: number;
  priorityReason: string;
  priority: MissionCandidatePriority;
  prerequisiteTopicIds: string[];
  dependsOnMissionIds: string[];
};

// Phase 3A: Proof Lifecycle

export type ProofLifecycleState = "not_started" | "attempted" | "submitted" | "completed" | "validated";

export type ProofRecord = {
  id: string;
  proofType: ProofType;
  capabilityId: string;
  skillId: string;
  topicId: string;
  state: ProofLifecycleState;
  score: ProofScore | null;
  artifactRef: string | null;
  submittedAt: string | null;
  completedAt: string | null;
  validatedAt: string | null;
  attemptCount: number;
};

export type ProofTransition =
  | { from: "not_started"; to: "attempted" }
  | { from: "attempted"; to: "not_started" }
  | { from: "attempted"; to: "submitted" }
  | { from: "submitted"; to: "not_started" }
  | { from: "submitted"; to: "completed" }
  | { from: "completed"; to: "validated" }
  | { from: "completed"; to: "not_started" }
  | { from: "validated"; to: "completed" }
  | { from: "validated"; to: "not_started" };

// Phase 3B: Readiness Rollup

export type ReadinessBand = "not-started" | "blocked" | "in-progress" | "ready" | "strong";

export type TopicReadinessDetail = {
  topicId: string;
  topicName: string;
  knowledge: number;
  practice: number;
  interview: number;
  implementation: number;
  overall: number;
  band: ReadinessBand;
};

export type SkillReadinessDetail = {
  skillId: string;
  skillName: string;
  topicReadiness: TopicReadinessDetail[];
  overall: number;
  band: ReadinessBand;
};

export type CapabilityReadinessDetail = {
  capabilityId: string;
  capabilityName: string;
  category: CapabilityCategory;
  skillReadiness: SkillReadinessDetail[];
  overall: number;
  band: ReadinessBand;
  blockers: string[];
};

export type RoleReadinessDetail = {
  role: FounderBetaRole;
  capabilityReadiness: CapabilityReadinessDetail[];
  overall: number;
  band: ReadinessBand;
};

export type ReadinessRollupInput = {
  proofRecords?: ProofRecord[];
  topicReadinessOverride?: Record<string, { knowledge?: number; practice?: number; interview?: number; implementation?: number }>;
  capabilityReadinessOverride?: Record<string, number>;
  completedTopicIds?: string[];
  roleWeights?: Record<string, number>;
};

// Phase 3C: Offer Readiness

export type OfferReadinessArea =
  | "resume"
  | "linkedin"
  | "github"
  | "portfolio"
  | "behavioral"
  | "interview"
  | "architecture-case-studies"
  | "applications"
  | "referrals"
  | "compensation"
  | "technical"
  | "leadership"
  | "communication"
  | "architecture"
  | "project-depth";

export type OfferReadinessAreaDetail = {
  area: OfferReadinessArea;
  score: number;
  band: ReadinessBand;
  blockingGaps: string[];
};

export type OfferReadinessResult = {
  overallScore: number;
  overallBand: ReadinessBand;
  areas: OfferReadinessAreaDetail[];
  hardGatesPassed: boolean;
  blockingGaps: string[];
  recommendedActions: string[];
};

export type OfferReadinessInput = {
  capabilityReadinessById: Record<string, number>;
  proofCompletionByCapabilityId: Record<string, number>;
  completedCaseStudyCount: number;
  resumeReadiness: number;
  linkedinReadiness: number;
  githubReadiness: number;
  portfolioReadiness: number;
  behavioralReadiness: number;
  interviewReadiness: number;
  applicationReadiness: number;
  referralReadiness: number;
  compensationReadiness: number;
  technicalReadiness: number;
  leadershipReadiness: number;
  communicationReadiness: number;
  architectureReadiness: number;
  projectDepthReadiness: number;
  completedTopicIds: string[];
  hardGateThresholds?: Partial<Record<string, number>>;
};

// Phase 3D: Mission Candidate Readiness Impact

export type MissionCandidateReadinessImpact = {
  candidateId: string;
  missionType: MissionType;
  topicDeltas: Array<{ topicId: string; topicName: string; delta: number }>;
  skillDeltas: Array<{ skillId: string; skillName: string; delta: number }>;
  capabilityDeltas: Array<{ capabilityId: string; capabilityName: string; delta: number }>;
  roleReadinessDelta: number;
  overallValueScore: number;
};

export type MissionOfferReadinessImpact = {
  candidateId: string;
  dsaPriorityBoost: number;
  offerReadinessReduction: number;
  dsaFocusedActions: string[];
};

// Phase 3: Interview Readiness Platform

export type InterviewCategory =
  | "dsa"
  | "problem-solving"
  | "lld"
  | "hld"
  | "system-design"
  | "aws"
  | "behavioral"
  | "leadership"
  | "resume-deep-dive"
  | "project-deep-dive";

export type InterviewSessionType =
  | "dsa"
  | "lld"
  | "hld"
  | "behavioral"
  | "mixed-architect";

export type InterviewSessionStatus = "pending" | "in-progress" | "completed" | "timed-out";

export type InterviewQuestion = {
  id: string;
  category: InterviewCategory;
  capabilityId: string;
  skillId: string;
  topicId: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  tags: string[];
  rubricIds: string[];
  prompt: string;
  context?: string;
};

export type InterviewSession = {
  id: string;
  sessionType: InterviewSessionType;
  status: InterviewSessionStatus;
  questionIds: string[];
  currentQuestionIndex: number;
  startedAt: string | null;
  completedAt: string | null;
  timeLimitMinutes: number;
  responses: InterviewResponse[];
};

export type InterviewResponse = {
  questionId: string;
  responseText: string;
  timeSpentSeconds: number;
  submittedAt: string;
};

export type RubricCriterion = {
  id: string;
  label: string;
  description: string;
  maxScore: number;
  weight: number;
  scoreLevels: Array<{ level: number; label: string; description: string }>;
};

export type Rubric = {
  id: string;
  name: string;
  category: InterviewCategory;
  criteria: RubricCriterion[];
};

export type RubricScore = {
  criterionId: string;
  score: number;
  rationale: string;
};

export type InterviewEvaluationResult = {
  sessionId: string;
  sessionType: InterviewSessionType;
  totalScore: number;
  maxScore: number;
  percentage: number;
  categoryScores: Array<{
    category: InterviewCategory;
    score: number;
    maxScore: number;
    percentage: number;
  }>;
  rubricScores: RubricScore[];
  strengths: string[];
  weaknesses: string[];
  improvementAreas: string[];
  completedAt: string;
};

export type InterviewProofType = "dsa-interview" | "lld-interview" | "hld-interview" | "behavioral-interview";

export type InterviewReadinessSnapshot = {
  dsaInterviewScore: number;
  lldInterviewScore: number;
  hldInterviewScore: number;
  behavioralInterviewScore: number;
  overallInterviewReadiness: number;
  recentEvaluationIds: string[];
  weakCategories: InterviewCategory[];
  recommendedPracticeAreas: string[];
};
