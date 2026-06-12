import {
  validateAgentDiscoveryOutput,
  validateDuplicateRisk,
  validateHumanApprovalRequired,
  validateAttribution,
  validateAgentCannotPublishDirectly,
  validateTopicMappingCandidate,
  validateSourceMappingCandidate,
  evaluateContentQuality,
  createNormalizedItem
} from "@/lib/services/content-ingestion-contracts";
import type { AgentDiscoveryScenario } from "@/data/founder-beta/agent-discovery-mock-scenarios";

export type AgentDiscoveryPreviewResult = {
  scenarioId: string;
  agentName: string;
  label: string;
  description: string;
  discoveryMethod: string;
  confidence: number;
  attributionValidation: ReturnType<typeof validateAttribution>;
  agentDiscoveryValidation: ReturnType<typeof validateAgentDiscoveryOutput>;
  duplicateRiskValidation: ReturnType<typeof validateDuplicateRisk> | null;
  requiresHumanApproval: boolean;
  humanApprovalRationale: string[];
  candidatePreview: ReturnType<typeof createNormalizedItem> | null;
  topicMappingResults: ReturnType<typeof validateTopicMappingCandidate>[];
  sourceMappingResults: ReturnType<typeof validateSourceMappingCandidate>[];
  qualityResult: ReturnType<typeof evaluateContentQuality> | null;
  publishGateResult: ReturnType<typeof validateAgentCannotPublishDirectly>;
  finalGateStatus: "pass" | "blocked";
};

export function simulateAgentDiscovery(scenario: AgentDiscoveryScenario): AgentDiscoveryPreviewResult {
  const candidate = scenario.candidate;

  const attributionValidation = validateAttribution(candidate);
  const agentDiscoveryValidation = validateAgentDiscoveryOutput(candidate);
  const duplicateRiskValidation = candidate.duplicateRisk ? validateDuplicateRisk(candidate.duplicateRisk) : null;
  const requiresHumanApproval = validateHumanApprovalRequired(candidate);

  const humanApprovalRationale: string[] = [];
  if (!candidate.estimatedConfidence || candidate.estimatedConfidence < 0.4) {
    humanApprovalRationale.push(`Low confidence (${candidate.estimatedConfidence}) — below 0.4 threshold`);
  }
  if (candidate.duplicateRisk && candidate.duplicateRisk.similarityScore >= 0.7) {
    humanApprovalRationale.push(`High duplicate risk (${candidate.duplicateRisk.similarityScore.toFixed(2)}) — similarity >= 0.7`);
  }
  if (candidate.tags.length === 0) {
    humanApprovalRationale.push("No tags assigned — needs curator categorization");
  }

  const candidatePreview = agentDiscoveryValidation.valid ? createNormalizedItem(candidate, `norm-${candidate.id}`) : null;

  const topicMappingResults = scenario.topicMappings.map((m) => validateTopicMappingCandidate(m));
  const sourceMappingResults = scenario.sourceMappings.map((m) => validateSourceMappingCandidate(m));
  const qualityResult = scenario.review ? evaluateContentQuality(scenario.review) : null;

  const publishGateResult = validateAgentCannotPublishDirectly("discovered", "published");

  const isBlocked =
    !agentDiscoveryValidation.valid ||
    (duplicateRiskValidation !== null && !duplicateRiskValidation.valid) ||
    requiresHumanApproval;

  return {
    scenarioId: scenario.scenarioId,
    agentName: scenario.agentName,
    label: scenario.label,
    description: scenario.description,
    discoveryMethod: candidate.discoveryMethod,
    confidence: candidate.estimatedConfidence,
    attributionValidation,
    agentDiscoveryValidation,
    duplicateRiskValidation,
    requiresHumanApproval,
    humanApprovalRationale,
    candidatePreview,
    topicMappingResults,
    sourceMappingResults,
    qualityResult,
    publishGateResult,
    finalGateStatus: isBlocked ? "blocked" : "pass"
  };
}

export function simulateAllAgentScenarios(scenarios: AgentDiscoveryScenario[]): AgentDiscoveryPreviewResult[] {
  return scenarios.map(simulateAgentDiscovery);
}
