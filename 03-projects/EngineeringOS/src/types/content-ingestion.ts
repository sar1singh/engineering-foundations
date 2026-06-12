export type ContentSourceType =
  | "official-docs"
  | "engineering-blog"
  | "book"
  | "interview-guide"
  | "github-repository"
  | "career-framework"
  | "roadmap"
  | "job-description"
  | "practice-platform";

export type ContentTier = "tier-1" | "tier-2" | "tier-3" | "tier-4";

export type ProofType =
  | "hld"
  | "lld"
  | "coding-solution"
  | "architecture-review"
  | "aws-design"
  | "incident-analysis"
  | "case-study"
  | "behavioral-answer"
  | "resume-review"
  | "github-project";

export type IngestionDiscoveryMethod =
  | "manual"
  | "curator-suggestion"
  | "agent-discovery"
  | "community-submission"
  | "bulk-import";

export type IngestionStatus =
  | "discovered"
  | "normalized"
  | "mapped"
  | "reviewed"
  | "approved"
  | "published"
  | "rejected";

export type IngestionSeverity = "low" | "medium" | "high" | "critical";

export type AgentAttribution = {
  agentId: string;
  agentVersion: string;
  agentTraceId: string;
  discoveredAt: string;
  sourceUrl: string;
  extractionMethod: "scrape" | "rss" | "api" | "manual" | "community-submission";
  rawMetadata: string;
};

export type DuplicateRiskAssessment = {
  similarCandidateIds: string[];
  similarNormalizedIds: string[];
  similarityScore: number;
  overlappingTopicIds: string[];
  assessedBy: string;
  assessedAt: string;
  notes: string;
};

export type RawContentCandidate = {
  id: string;
  title: string;
  url: string;
  sourceType: ContentSourceType;
  tier: ContentTier;
  category: string;
  description: string;
  discoveryMethod: IngestionDiscoveryMethod;
  discoveredAt: string;
  discoveredBy: string;
  tags: string[];
  estimatedConfidence: number;
  attribution?: AgentAttribution;
  duplicateRisk?: DuplicateRiskAssessment;
  agentTraceId?: string;
};

export type NormalizedContentItem = {
  id: string;
  rawCandidateId: string;
  normalizedTitle: string;
  normalizedUrl: string;
  sourceType: ContentSourceType;
  tier: ContentTier;
  category: string;
  description: string;
  tags: string[];
  confidenceScore: number;
  normalizedAt: string;
  normalizedBy: string;
  checksum: string;
  agentTraceId?: string;
};

export type TopicMappingCandidate = {
  id: string;
  normalizedItemId: string;
  topicId: string;
  topicName: string;
  capabilityIds: string[];
  skillIds: string[];
  relevanceScore: number;
  mappedBy: string;
  mappedAt: string;
  notes: string;
};

export type SourceMappingCandidate = {
  id: string;
  normalizedItemId: string;
  sourceId: string;
  sourceTitle: string;
  mappedBy: string;
  mappedAt: string;
  notes: string;
};

export type ContentQualityReview = {
  id: string;
  normalizedItemId: string;
  reviewerId: string;
  reviewedAt: string;
  urlReachable: boolean;
  contentFreshnessScore: number;
  technicalAccuracyScore: number;
  relevanceScore: number;
  authorityScore: number;
  overallScore: number;
  issues: string[];
  recommendations: string[];
  passed: boolean;
};

export type ContentApprovalDecision = {
  id: string;
  normalizedItemId: string;
  decision: "approved" | "rejected";
  decidedBy: string;
  decidedAt: string;
  reason: string;
  nextStatus: "published" | "rejected";
};

export type ContentIngestionBatch = {
  id: string;
  name: string;
  candidates: RawContentCandidate[];
  normalizedItems: NormalizedContentItem[];
  topicMappings: TopicMappingCandidate[];
  sourceMappings: SourceMappingCandidate[];
  reviews: ContentQualityReview[];
  decisions: ContentApprovalDecision[];
  status: IngestionStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type ContentIngestionError = {
  id: string;
  batchId: string;
  candidateId: string;
  stage: IngestionStatus;
  severity: IngestionSeverity;
  message: string;
  details: string;
  timestamp: string;
  resolved: boolean;
};

export type WorkflowTransition = {
  from: IngestionStatus;
  to: IngestionStatus;
  requiredChecks: string[];
  description: string;
};

export const INGESTION_WORKFLOW: WorkflowTransition[] = [
  { from: "discovered", to: "normalized", requiredChecks: ["url_reachable", "has_title", "has_source_type"], description: "Validate raw candidate then normalize" },
  { from: "normalized", to: "mapped", requiredChecks: ["has_checksum", "confidence_above_minimum", "tags_resolved"], description: "Map normalized content to topics/sources" },
  { from: "mapped", to: "reviewed", requiredChecks: ["mappings_complete", "relevance_above_minimum", "at_least_one_mapping"], description: "Submit for quality review" },
  { from: "reviewed", to: "approved", requiredChecks: ["quality_score_above_threshold", "issues_resolved", "review_complete"], description: "Approve for publishing" },
  { from: "approved", to: "published", requiredChecks: ["approval_confirmed", "final_validation_passed"], description: "Publish to registry" },
  { from: "reviewed", to: "rejected", requiredChecks: ["quality_below_threshold", "irrecoverable_issues"], description: "Reject and archive" },
  { from: "approved", to: "rejected", requiredChecks: ["decision_overturned"], description: "Overturn approval" }
];

export const VALID_TRANSITIONS: Record<IngestionStatus, IngestionStatus[]> = {
  discovered: ["normalized"],
  normalized: ["mapped"],
  mapped: ["reviewed"],
  reviewed: ["approved", "rejected"],
  approved: ["published", "rejected"],
  published: [],
  rejected: []
};
