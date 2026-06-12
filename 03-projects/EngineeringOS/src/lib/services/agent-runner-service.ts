import type {
  AgentRunRequest,
  AgentRunResult,
  AgentRunOutput,
  AgentRunTrace,
  AgentRunStatus,
  AgentRunnerConfig
} from "@/types/agent-runner";
import { DEFAULT_AGENT_RUNNER_CONFIG } from "@/types/agent-runner";
import type { RawContentCandidate, TopicMappingCandidate, ContentQualityReview, DuplicateRiskAssessment, NormalizedContentItem } from "@/types/content-ingestion";
import {
  validateAgentDiscoveryOutput,
  validateAttribution,
  validateDuplicateRisk,
  validateHumanApprovalRequired,
  validateAgentCannotPublishDirectly,
  evaluateContentQuality,
  createNormalizedItem
} from "@/lib/services/content-ingestion-contracts";
import type { ValidationResult } from "@/lib/services/content-ingestion-contracts";

function generateTraceId(): string {
  return `dry-run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function generateMockCandidates(topicHint?: string, categoryHint?: string): RawContentCandidate[] {
  const topic = topicHint || "software-engineering";
  const category = categoryHint || "general";
  return [
    {
      id: `mock-cand-${topic}-001`,
      title: `Understanding ${topic.replace(/-/g, " ")} Best Practices`,
      url: `https://example.com/${topic}/best-practices`,
      sourceType: "engineering-blog",
      tier: "tier-2",
      category,
      description: `A comprehensive guide to ${topic.replace(/-/g, " ")} best practices for production systems.`,
      discoveryMethod: "agent-discovery",
      discoveredAt: new Date().toISOString(),
      discoveredBy: "mock-discovery-agent-v1",
      tags: [topic, "best-practices", "production"],
      estimatedConfidence: 0.78,
      attribution: {
        agentId: "mock-discovery-agent-v1",
        agentVersion: "1.0.0",
        agentTraceId: `mock-trace-${topic}`,
        discoveredAt: new Date().toISOString(),
        sourceUrl: `https://example.com/${topic}/`,
        extractionMethod: "rss",
        rawMetadata: JSON.stringify({ mock: true, topicHint: topic })
      },
      agentTraceId: `mock-trace-${topic}`
    },
    {
      id: `mock-cand-${topic}-002`,
      title: `Architecting ${topic.replace(/-/g, " ")} at Scale`,
      url: `https://example.com/${topic}/architecture-scale`,
      sourceType: "official-docs",
      tier: "tier-1",
      category,
      description: `Official reference architecture for ${topic.replace(/-/g, " ")} at scale.`,
      discoveryMethod: "agent-discovery",
      discoveredAt: new Date().toISOString(),
      discoveredBy: "mock-discovery-agent-v1",
      tags: [topic, "architecture", "scalability"],
      estimatedConfidence: 0.85,
      attribution: {
        agentId: "mock-discovery-agent-v1",
        agentVersion: "1.0.0",
        agentTraceId: `mock-trace-${topic}`,
        discoveredAt: new Date().toISOString(),
        sourceUrl: `https://example.com/${topic}/`,
        extractionMethod: "api",
        rawMetadata: JSON.stringify({ mock: true, topicHint: topic })
      },
      agentTraceId: `mock-trace-${topic}`
    }
  ];
}

function generateMockTopicMappings(normalizedItemId: string): TopicMappingCandidate[] {
  return [
    {
      id: `mock-tmap-${normalizedItemId}-001`,
      normalizedItemId,
      topicId: "topic-hld-fundamentals",
      topicName: "HLD Fundamentals",
      capabilityIds: ["cap-system-design-hld"],
      skillIds: ["skill-hld-requirements"],
      relevanceScore: 0.82,
      mappedBy: "mock-topic-mapper-agent-v1",
      mappedAt: new Date().toISOString(),
      notes: "Dry-run mapping: strong relevance to HLD fundamentals"
    }
  ];
}

function generateMockQualityReview(normalizedItemId: string): ContentQualityReview {
  return {
    id: `mock-qr-${normalizedItemId}-001`,
    normalizedItemId,
    reviewerId: "mock-quality-agent-v1",
    reviewedAt: new Date().toISOString(),
    urlReachable: true,
    contentFreshnessScore: 0.80,
    technicalAccuracyScore: 0.85,
    relevanceScore: 0.82,
    authorityScore: 0.75,
    overallScore: 0.80,
    issues: [],
    recommendations: ["Dry-run: verify technical accuracy before publishing"],
    passed: true
  };
}

function generateMockDuplicateAssessment(): DuplicateRiskAssessment {
  return {
    similarCandidateIds: [],
    similarNormalizedIds: [],
    similarityScore: 0.15,
    overlappingTopicIds: [],
    assessedBy: "mock-duplicate-detection-agent-v1",
    assessedAt: new Date().toISOString(),
    notes: "Dry-run: no significant overlap detected"
  };
}

function generateNormalizedItems(candidates: RawContentCandidate[]): NormalizedContentItem[] {
  return candidates.map((c, i) => createNormalizedItem(c, `dry-run-norm-${c.id}-${i}`));
}

function runBoundaryAssertions(
  candidates: RawContentCandidate[],
  reviews: ContentQualityReview[],
  duplicateAssessments: DuplicateRiskAssessment[]
): { structureValidation: ValidationResult; gateStatus: "pass" | "blocked" } {
  const structureErrors: string[] = [];
  const structureWarnings: string[] = [];

  for (const candidate of candidates) {
    const discoveryResult = validateAgentDiscoveryOutput(candidate);
    structureErrors.push(...discoveryResult.errors);
    structureWarnings.push(...discoveryResult.warnings);

    const attributionResult = validateAttribution(candidate);
    structureWarnings.push(...attributionResult.warnings);

    const requiresApproval = validateHumanApprovalRequired(candidate);
    if (requiresApproval) {
      structureWarnings.push(`Candidate ${candidate.id} requires human approval before advancing`);
    }
  }

  for (const review of reviews) {
    const reviewResult = evaluateContentQuality(review);
    structureErrors.push(...reviewResult.errors);
    structureWarnings.push(...reviewResult.warnings);
  }

  for (const risk of duplicateAssessments) {
    const riskResult = validateDuplicateRisk(risk);
    structureErrors.push(...riskResult.errors);
    structureWarnings.push(...riskResult.warnings);
  }

  let gateStatus: "pass" | "blocked" = "pass";
  if (candidates.length > 0) {
    const publishGateResult = validateAgentCannotPublishDirectly("discovered", "published");
    gateStatus = publishGateResult.valid ? "pass" : "blocked";
  }

  return {
    structureValidation: { valid: structureErrors.length === 0, errors: structureErrors, warnings: structureWarnings },
    gateStatus
  };
}

export function runMockAgent(
  request: AgentRunRequest,
  config: AgentRunnerConfig = DEFAULT_AGENT_RUNNER_CONFIG
): AgentRunResult {
  const traceId = generateTraceId();
  const startedAt = new Date().toISOString();
  const steps: string[] = [];
  let status: AgentRunStatus = "completed";
  let candidates: RawContentCandidate[] = [];
  let topicMappings: TopicMappingCandidate[] = [];
  let reviews: ContentQualityReview[] = [];
  let duplicateAssessments: DuplicateRiskAssessment[] = [];
  let normalizedItems: NormalizedContentItem[] = [];
  const outputWarnings: string[] = [];

  steps.push(`Starting dry-run for agent type: ${request.agentType}`);
  steps.push(`Topic hint: ${request.topicHint || "none provided"}`);

  if (config.failOnMissingTopicHint && request.agentType === "resource-discovery" && !request.topicHint) {
    status = "failed";
    steps.push("Failed: topicHint is required but was not provided");
  }

  if (request.agentType === "resource-discovery") {
    if (!request.topicHint) {
      outputWarnings.push("No topic hint provided; using default topic 'software-engineering'");
    }
    candidates = generateMockCandidates(request.topicHint, request.categoryHint);
    steps.push(`Generated ${candidates.length} mock candidates`);
    normalizedItems = generateNormalizedItems(candidates);
    steps.push(`Generated ${normalizedItems.length} normalized items`);
  }

  if (request.agentType === "topic-mapping") {
    const normalizedId = `dry-run-norm-target-${traceId}`;
    topicMappings = generateMockTopicMappings(normalizedId);
    steps.push(`Generated ${topicMappings.length} topic mappings`);
  }

  if (request.agentType === "quality-review") {
    const normalizedId = `dry-run-norm-target-${traceId}`;
    reviews = [generateMockQualityReview(normalizedId)];
    steps.push(`Generated ${reviews.length} quality review`);
  }

  if (request.agentType === "duplicate-detection") {
    duplicateAssessments = [generateMockDuplicateAssessment()];
    steps.push(`Generated ${duplicateAssessments.length} duplicate assessment`);
  }

  const { structureValidation, gateStatus } = runBoundaryAssertions(candidates, reviews, duplicateAssessments);
  steps.push(`Boundary assertions complete (gate: ${gateStatus})`);

  if (!structureValidation.valid) {
    steps.push(`Structure validation issues: ${structureValidation.errors.length} error(s)`);
  }

  const completedAt = new Date().toISOString();
  const durationMs = config.simulateLatencyMs || 1;

  const trace: AgentRunTrace = {
    traceId,
    agentType: request.agentType,
    startedAt,
    completedAt,
    durationMs,
    steps
  };

  const output: AgentRunOutput = {
    candidates,
    topicMappings,
    reviews,
    duplicateAssessments,
    normalizedItems,
    warnings: outputWarnings
  };

  return { trace, status, boundaryResult: structureValidation, gateStatus, output };
}

export function runAllMockAgents(
  topicHint?: string,
  categoryHint?: string,
  config?: AgentRunnerConfig
): Record<string, AgentRunResult> {
  const agentTypes = ["resource-discovery", "topic-mapping", "quality-review", "duplicate-detection"] as const;
  const results: Record<string, AgentRunResult> = {};
  for (const agentType of agentTypes) {
    results[agentType] = runMockAgent({ agentType, topicHint, categoryHint }, config);
  }
  return results;
}
