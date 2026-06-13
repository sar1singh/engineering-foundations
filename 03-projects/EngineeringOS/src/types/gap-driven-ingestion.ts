export type SyllabusGapType =
  | "low-source-topic"
  | "no-source-topic"
  | "weak-skill-coverage"
  | "weak-capability-coverage"
  | "missing-proof-path"
  | "missing-mission-path"
  | "weak-interview-coverage"
  | "weak-readiness-coverage"
  | "weak-source-diversity"
  | "stale-or-low-confidence-topic";

export type SyllabusGapSeverity = "critical" | "high" | "medium" | "low";

export type GapTarget = {
  entityType: "capability" | "skill" | "topic" | "source" | "mission";
  entityId: string;
  entityName: string;
};

export type SyllabusGap = {
  id: string;
  type: SyllabusGapType;
  severity: SyllabusGapSeverity;
  target: GapTarget;
  reason: string;
  detail: string;
  score: number;
  category?: string;
};

export type GapDrivenCandidate = {
  candidateId: string;
  gapId: string;
  seedId: string;
  title: string;
  url: string;
  sourceType: string;
  category: string;
  tags: string[];
  matchScore: number;
  matchReasons: string[];
  proposedSourceId: string;
  proposedTopicId: string;
  reviewRequired: true;
  recommendedAgent: string;
};

export type GapDrivenIngestionPlan = {
  planId: string;
  generatedAt: string;
  totalGaps: number;
  totalCandidates: number;
  gapsByType: Record<string, number>;
  gapsBySeverity: Record<string, number>;
  candidateByCategory: Record<string, number>;
  highPriorityCandidates: GapDrivenCandidate[];
  mediumPriorityCandidates: GapDrivenCandidate[];
  lowPriorityCandidates: GapDrivenCandidate[];
  uncoveredGaps: SyllabusGap[];
  trace: GapSubAgentTrace[];
};

export type GapSubAgentTrace = {
  agentId: string;
  agentName: string;
  elapsedMs: number;
  gapsFound: number;
  status: "success" | "error";
  error?: string;
};

export type GapSubAgentResult = {
  agentId: string;
  agentName: string;
  gaps: SyllabusGap[];
  trace: GapSubAgentTrace;
};
