export type ContentRegistry = {
  topicsByCapabilityId: Record<string, string[]>;
  topicsBySkillId: Record<string, string[]>;
  sourcesByTopicId: Record<string, string[]>;
  sourcesByCapabilityId: Record<string, string[]>;
  capabilitiesByCategory: Record<string, string[]>;
  totalTopics: number;
  totalSources: number;
  totalCapabilities: number;
  totalSkills: number;
};

export type CapabilityCoverage = {
  capabilityId: string;
  capabilityName: string;
  category: string;
  topicCount: number;
  skillCount: number;
  sourceCount: number;
  proofTypes: string[];
  averageConfidenceScore: number;
};

export type SkillCoverage = {
  skillId: string;
  skillName: string;
  capabilityId: string;
  topicCount: number;
  proofTypes: string[];
};

export type SourceCoverageSummary = {
  totalSources: number;
  byType: Record<string, number>;
  byTier: Record<string, number>;
  byCategory: Record<string, number>;
  unusedSourceIds: string[];
};

export type ProofCoverageSummary = {
  proofTypes: Record<string, number>;
  byCapability: Record<string, string[]>;
  byCategory: Record<string, string[]>;
};

export type InterviewCoverageSummary = {
  interviewCategories: Record<string, number>;
  topicsWithInterviewImportance: Record<string, number>;
};

export type CoverageSummary = {
  capabilityCoverage: CapabilityCoverage[];
  skillCoverage: SkillCoverage[];
  sourceCoverage: SourceCoverageSummary;
  proofCoverage: ProofCoverageSummary;
  interviewCoverage: InterviewCoverageSummary;
};

export type CoverageGapSeverity = "low" | "medium" | "high";

export type CoverageGap = {
  type: "weakly-sourced" | "low-topic-coverage" | "orphan-topic" | "no-proof-types" | "low-confidence";
  severity: CoverageGapSeverity;
  entityId: string;
  entityName: string;
  detail: string;
};

export type GapAnalysisResult = {
  gaps: CoverageGap[];
  weaklySourcedTopics: CoverageGap[];
  lowCoverageCapabilities: CoverageGap[];
  lowCoverageSkills: CoverageGap[];
  lowConfidenceTopics: CoverageGap[];
  totalGaps: number;
};

export type CoverageSummaryRow = {
  id: string;
  name: string;
  type: "capability" | "skill" | "topic" | "source";
  topics: number;
  skills: number;
  sources: number;
  proofTypes: number;
  confidence: number;
};
