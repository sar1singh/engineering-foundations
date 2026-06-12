import type {
  RawContentCandidate,
  NormalizedContentItem,
  TopicMappingCandidate,
  SourceMappingCandidate,
  ContentQualityReview,
  ContentApprovalDecision,
  IngestionStatus,
  ContentIngestionError,
  AgentAttribution,
  DuplicateRiskAssessment,
  ContentSourceType,
  ContentTier
} from "@/types/content-ingestion";
import { VALID_TRANSITIONS, INGESTION_WORKFLOW } from "@/types/content-ingestion";
import { founderBetaSourceCatalog } from "@/data/founder-beta";
import { founderBetaCapabilities, founderBetaSkills } from "@/data/founder-beta";

export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export function validateContentCandidate(candidate: RawContentCandidate): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!candidate.id || candidate.id.trim().length === 0) {
    errors.push("Candidate id is required");
  }
  if (!candidate.title || candidate.title.trim().length === 0) {
    errors.push("Candidate title is required");
  }
  if (!candidate.url || candidate.url.trim().length === 0) {
    errors.push("Candidate url is required");
  } else if (!candidate.url.startsWith("http://") && !candidate.url.startsWith("https://")) {
    errors.push("Candidate url must start with http:// or https://");
  }
  if (!candidate.sourceType) {
    errors.push("Candidate sourceType is required");
  }
  if (!candidate.tier) {
    errors.push("Candidate tier is required");
  }
  if (!candidate.category || candidate.category.trim().length === 0) {
    errors.push("Candidate category is required");
  }
  if (typeof candidate.estimatedConfidence !== "number" || candidate.estimatedConfidence < 0 || candidate.estimatedConfidence > 1) {
    errors.push("Candidate estimatedConfidence must be a number between 0 and 1");
  }
  if (!candidate.discoveryMethod) {
    errors.push("Candidate discoveryMethod is required");
  }
  if (!candidate.discoveredBy || candidate.discoveredBy.trim().length === 0) {
    errors.push("Candidate discoveredBy is required");
  }

  if (candidate.tags && candidate.tags.length === 0) {
    warnings.push("Candidate has no tags; consider adding at least one");
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateTopicMappingCandidate(mapping: TopicMappingCandidate): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!mapping.id || mapping.id.trim().length === 0) {
    errors.push("Mapping id is required");
  }
  if (!mapping.normalizedItemId || mapping.normalizedItemId.trim().length === 0) {
    errors.push("Mapping normalizedItemId is required");
  }
  if (!mapping.topicId || mapping.topicId.trim().length === 0) {
    errors.push("Mapping topicId is required");
  }
  if (!mapping.topicName || mapping.topicName.trim().length === 0) {
    errors.push("Mapping topicName is required");
  }
  if (!mapping.capabilityIds || mapping.capabilityIds.length === 0) {
    errors.push("Mapping must include at least one capabilityId");
  } else {
    const validCapIds = new Set(founderBetaCapabilities.map((c) => c.id));
    const invalidCaps = mapping.capabilityIds.filter((cid) => !validCapIds.has(cid));
    if (invalidCaps.length > 0) {
      errors.push(`Invalid capabilityIds: ${invalidCaps.join(", ")}`);
    }
  }
  if (!mapping.skillIds || mapping.skillIds.length === 0) {
    errors.push("Mapping must include at least one skillId");
  } else {
    const validSkillIds = new Set(founderBetaSkills.map((s) => s.id));
    const invalidSkills = mapping.skillIds.filter((sid) => !validSkillIds.has(sid));
    if (invalidSkills.length > 0) {
      errors.push(`Invalid skillIds: ${invalidSkills.join(", ")}`);
    }
  }
  if (typeof mapping.relevanceScore !== "number" || mapping.relevanceScore < 0 || mapping.relevanceScore > 1) {
    errors.push("Mapping relevanceScore must be a number between 0 and 1");
  } else if (mapping.relevanceScore < 0.5) {
    warnings.push("Mapping relevanceScore is below 0.5; consider if mapping is appropriate");
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateSourceMappingCandidate(mapping: SourceMappingCandidate): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!mapping.id || mapping.id.trim().length === 0) {
    errors.push("Mapping id is required");
  }
  if (!mapping.normalizedItemId || mapping.normalizedItemId.trim().length === 0) {
    errors.push("Mapping normalizedItemId is required");
  }
  if (!mapping.sourceId || mapping.sourceId.trim().length === 0) {
    errors.push("Mapping sourceId is required");
  } else {
    const validSourceIds = new Set(founderBetaSourceCatalog.map((s) => s.id));
    if (!validSourceIds.has(mapping.sourceId)) {
      warnings.push(`Source id "${mapping.sourceId}" is not yet in the catalog; mapping references a new source`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function evaluateContentQuality(review: ContentQualityReview): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!review.id || review.id.trim().length === 0) {
    errors.push("Review id is required");
  }
  if (!review.normalizedItemId || review.normalizedItemId.trim().length === 0) {
    errors.push("Review normalizedItemId is required");
  }
  if (!review.reviewerId || review.reviewerId.trim().length === 0) {
    errors.push("Review reviewerId is required");
  }

  const scoreFields = [
    { key: "contentFreshnessScore", label: "Content freshness" },
    { key: "technicalAccuracyScore", label: "Technical accuracy" },
    { key: "relevanceScore", label: "Relevance" },
    { key: "authorityScore", label: "Authority" }
  ] as const;

  for (const { key, label } of scoreFields) {
    const val = review[key];
    if (typeof val !== "number" || val < 0 || val > 1) {
      errors.push(`${label} score must be a number between 0 and 1`);
    }
  }

  if (typeof review.overallScore !== "number" || review.overallScore < 0 || review.overallScore > 1) {
    errors.push("Overall score must be a number between 0 and 1");
  }

  if (review.passed !== true && review.passed !== false) {
    errors.push("Review must have a passed decision (true/false)");
  }

  if (review.overallScore >= 0.7 && review.passed === false) {
    warnings.push("Overall score is >= 0.7 but review is marked as not passed");
  }
  if (review.overallScore < 0.5 && review.passed === true) {
    warnings.push("Overall score is < 0.5 but review is marked as passed");
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function determineApprovalReadiness(
  review: ContentQualityReview,
  topicMappings: TopicMappingCandidate[],
  sourceMappings: SourceMappingCandidate[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!review.passed) {
    errors.push("Content has not passed quality review");
  }
  if (review.overallScore < 0.6) {
    errors.push(`Overall score ${review.overallScore} is below minimum threshold of 0.6`);
  }
  if (topicMappings.length === 0) {
    errors.push("No topic mappings exist; at least one required for approval");
  }
  if (sourceMappings.length === 0) {
    errors.push("No source mappings exist; at least one required for approval");
  }

  const hasLowRelevanceTopics = topicMappings.some((m) => m.relevanceScore < 0.5);
  if (hasLowRelevanceTopics) {
    warnings.push("Some topic mappings have relevance below 0.5");
  }

  const hasInvalidTopicMappings = topicMappings.some((m) => {
    const result = validateTopicMappingCandidate(m);
    return !result.valid;
  });
  if (hasInvalidTopicMappings) {
    errors.push("One or more topic mappings are invalid");
  }

  const hasInvalidSourceMappings = sourceMappings.some((m) => {
    const result = validateSourceMappingCandidate(m);
    return !result.valid;
  });
  if (hasInvalidSourceMappings) {
    errors.push("One or more source mappings are invalid");
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function canTransition(
  currentStatus: IngestionStatus,
  targetStatus: IngestionStatus
): boolean {
  const allowed = VALID_TRANSITIONS[currentStatus];
  if (!allowed) return false;
  return allowed.includes(targetStatus);
}

export function validateTransition(
  currentStatus: IngestionStatus,
  targetStatus: IngestionStatus,
  errors: ContentIngestionError[]
): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  const allowed = VALID_TRANSITIONS[currentStatus];
  if (!allowed) {
    result.errors.push(`Unknown current status: "${currentStatus}"`);
    result.valid = false;
    return result;
  }
  if (!allowed.includes(targetStatus)) {
    result.errors.push(`Cannot transition from "${currentStatus}" to "${targetStatus}". Allowed: [${allowed.join(", ")}]`);
    result.valid = false;
  }

  const unresolvedErrors = errors.filter((e) => !e.resolved);
  if (unresolvedErrors.length > 0 && targetStatus !== "rejected") {
    result.warnings.push(`${unresolvedErrors.length} unresolved error(s) exist; consider resolving before advancing`);
  }

  return result;
}

export function assertHumanApprovalRequired(candidate: RawContentCandidate): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const confidence = candidate.estimatedConfidence;
  if (typeof confidence !== "number" || confidence < 0.4) {
    errors.push(`Human approval required: estimated confidence ${confidence} is below threshold 0.4`);
  }
  if (candidate.duplicateRisk && candidate.duplicateRisk.similarityScore >= 0.7) {
    errors.push(`Human approval required: duplicate risk similarity score ${candidate.duplicateRisk.similarityScore} is at or above threshold 0.7`);
  }
  if (!candidate.tags || candidate.tags.length === 0) {
    errors.push("Human approval required: candidate has no tags");
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function assertAgentCannotPublish(
  currentStatus: IngestionStatus,
  targetStatus: IngestionStatus
): ValidationResult {
  return validateAgentCannotPublishDirectly(currentStatus, targetStatus);
}

export function assertNoAutonomousWrite(decision: ContentApprovalDecision | null): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (decision !== null) {
    errors.push("Agent attempted autonomous write: ContentApprovalDecision already exists. Only human reviewers can create approval decisions.");
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function assertValidAgentBoundary(
  candidate: RawContentCandidate,
  currentStatus: IngestionStatus,
  targetStatus: IngestionStatus
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const discoveryResult = validateAgentDiscoveryOutput(candidate);
  errors.push(...discoveryResult.errors);
  warnings.push(...discoveryResult.warnings);

  const publishResult = validateAgentCannotPublishDirectly(currentStatus, targetStatus);
  errors.push(...publishResult.errors);
  warnings.push(...publishResult.warnings);

  const approvalResult = assertHumanApprovalRequired(candidate);
  if (!approvalResult.valid) {
    errors.push(...approvalResult.errors.map((e) => `Boundary violation: ${e}`));
  }

  const noWriteResult = assertNoAutonomousWrite(null);
  errors.push(...noWriteResult.errors);
  warnings.push(...noWriteResult.warnings);

  return { valid: errors.length === 0, errors, warnings };
}

export function createNormalizedItem(
  candidate: RawContentCandidate,
  normalizedId: string
): NormalizedContentItem {
  const checksum = `${candidate.id}-${candidate.url}-${Date.now()}`;
  return {
    id: normalizedId,
    rawCandidateId: candidate.id,
    normalizedTitle: candidate.title.trim(),
    normalizedUrl: candidate.url.trim(),
    sourceType: candidate.sourceType,
    tier: candidate.tier,
    category: candidate.category,
    description: candidate.description.trim(),
    tags: [...candidate.tags],
    confidenceScore: candidate.estimatedConfidence,
    normalizedAt: new Date().toISOString(),
    normalizedBy: "system",
    checksum,
    agentTraceId: candidate.agentTraceId
  };
}

export function validateAgentDiscoveryOutput(candidate: RawContentCandidate): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const base = validateContentCandidate(candidate);
  errors.push(...base.errors);
  warnings.push(...base.warnings);

  if (candidate.attribution) {
    const attr = candidate.attribution;
    if (!attr.agentId || attr.agentId.trim().length === 0) {
      errors.push("Agent attribution agentId is required");
    }
    if (!attr.agentVersion || attr.agentVersion.trim().length === 0) {
      errors.push("Agent attribution agentVersion is required");
    }
    if (!attr.agentTraceId || attr.agentTraceId.trim().length === 0) {
      errors.push("Agent attribution agentTraceId is required");
    }
    if (!attr.sourceUrl || attr.sourceUrl.trim().length === 0) {
      errors.push("Agent attribution sourceUrl is required");
    }
    if (candidate.discoveryMethod === "agent-discovery" && !attr.agentId) {
      errors.push("Candidates discovered by agent-discovery must include attribution");
    }
  } else if (candidate.discoveryMethod === "agent-discovery") {
    errors.push("Agent-discovered candidates must include attribution metadata");
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateDuplicateRisk(risk: DuplicateRiskAssessment): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof risk.similarityScore !== "number" || risk.similarityScore < 0 || risk.similarityScore > 1) {
    errors.push("Duplicate risk similarityScore must be a number between 0 and 1");
  }
  if (!risk.assessedBy || risk.assessedBy.trim().length === 0) {
    errors.push("Duplicate risk assessedBy is required");
  }
  if (!risk.assessedAt || risk.assessedAt.trim().length === 0) {
    errors.push("Duplicate risk assessedAt is required");
  }

  if (risk.similarityScore >= 0.8 && risk.overlappingTopicIds.length > 0) {
    warnings.push("High similarity score with overlapping topics; likely duplicate");
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateHumanApprovalRequired(candidate: RawContentCandidate): boolean {
  if (!candidate.estimatedConfidence || candidate.estimatedConfidence < 0.4) {
    return true;
  }
  if (candidate.duplicateRisk && candidate.duplicateRisk.similarityScore >= 0.7) {
    return true;
  }
  if (candidate.tags.length === 0) {
    return true;
  }
  return false;
}

export function validateAttribution(candidate: RawContentCandidate): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!candidate.attribution) {
    warnings.push("Candidate has no attribution metadata");
    return { valid: true, errors, warnings };
  }

  const attr = candidate.attribution;
  if (attr.discoveredAt && !candidate.discoveredAt) {
    warnings.push("Attribution has discoveredAt but candidate discoveredAt is missing");
  }
  if (attr.agentId && attr.agentId !== candidate.discoveredBy && candidate.discoveryMethod === "agent-discovery") {
    warnings.push(`Attribution agentId "${attr.agentId}" differs from discoveredBy "${candidate.discoveredBy}"`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateAgentCannotPublishDirectly(
  currentStatus: IngestionStatus,
  targetStatus: IngestionStatus
): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  const invalidDirectTransitions: [IngestionStatus, IngestionStatus][] = [
    ["discovered", "published"],
    ["discovered", "approved"],
    ["normalized", "published"],
    ["mapped", "published"]
  ];

  for (const [from, to] of invalidDirectTransitions) {
    if (currentStatus === from && targetStatus === to) {
      result.errors.push(`Agent output cannot transition directly from "${from}" to "${to}". Must pass through human approval gate.`);
      result.valid = false;
    }
  }

  return result;
}
