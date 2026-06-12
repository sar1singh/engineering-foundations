import type { RawContentCandidate, IngestionStatus } from "@/types/content-ingestion";
import {
  validateContentCandidate,
  validateTopicMappingCandidate,
  validateSourceMappingCandidate,
  evaluateContentQuality,
  determineApprovalReadiness,
  createNormalizedItem
} from "@/lib/services/content-ingestion-contracts";
import type { MockIngestionScenario } from "@/data/founder-beta/ingestion-mock-candidates";

export type LifecycleStep = {
  status: IngestionStatus;
  label: string;
  passed: boolean;
  detail: string;
};

export type SimulationResult = {
  candidateId: string;
  candidate: RawContentCandidate;
  label: string;
  description: string;
  validationResult: ReturnType<typeof validateContentCandidate>;
  lifecycleSteps: LifecycleStep[];
  normalizedItem: ReturnType<typeof createNormalizedItem> | null;
  topicMappingResults: ReturnType<typeof validateTopicMappingCandidate>[];
  sourceMappingResults: ReturnType<typeof validateSourceMappingCandidate>[];
  qualityResult: ReturnType<typeof evaluateContentQuality> | null;
  approvalResult: ReturnType<typeof determineApprovalReadiness> | null;
  finalStatus: IngestionStatus;
  rejectionReason: string | null;
};

function buildLifecycle(scenario: MockIngestionScenario): LifecycleStep[] {
  const steps: LifecycleStep[] = [];
  const preview = scenario.applyPreview;
  const candidate = scenario.candidate;
  const validationResult = validateContentCandidate(candidate);

  const isRejected = preview.decision?.decision === "rejected" || preview.decision?.nextStatus === "rejected";
  const isPublished = preview.decision?.nextStatus === "published" && preview.decision?.decision === "approved";

  const discoveredOk = Boolean(candidate.id && candidate.title && candidate.url.startsWith("http"));
  steps.push({ status: "discovered", label: "Discovered", passed: discoveredOk, detail: `Candidate "${candidate.title || "(untitled)"}" entered the system` });

  const normalizedOk = validationResult.valid;
  const normalizedItem = normalizedOk ? createNormalizedItem(candidate, preview.normalizedItemId) : null;
  steps.push({ status: "normalized", label: "Normalized", passed: normalizedOk, detail: normalizedOk ? `Checksum created: ${normalizedItem!.checksum.slice(0, 24)}...` : `Validation failed: ${validationResult.errors.join("; ")}` });

  const topicResults = preview.topicMappings.map((m) => validateTopicMappingCandidate(m));
  const sourceResults = preview.sourceMappings.map((m) => validateSourceMappingCandidate(m));
  const allMappingsValid = topicResults.every((r) => r.valid) && sourceResults.every((r) => r.valid) && preview.topicMappings.length > 0;
  steps.push({ status: "mapped", label: "Mapped", passed: normalizedOk && allMappingsValid, detail: allMappingsValid ? `${preview.topicMappings.length} topic mapping(s), ${preview.sourceMappings.length} source mapping(s)` : `Mapping issues: ${topicResults.flatMap((r) => r.errors).concat(sourceResults.flatMap((r) => r.errors)).join("; ") || "Missing mappings"}` });

  const qualityResult = evaluateContentQuality(preview.review);
  const qualityPassed = qualityResult.valid && preview.review.overallScore >= 0.6;
  steps.push({ status: "reviewed", label: "Reviewed", passed: normalizedOk && allMappingsValid && qualityResult.valid, detail: qualityResult.valid ? `Overall score: ${preview.review.overallScore} — ${qualityPassed ? "Passes" : "Below"} threshold (0.6)` : `Quality issues: ${qualityResult.errors.join("; ")}` });

  if (isRejected) {
    steps.push({ status: "rejected", label: "Rejected", passed: false, detail: preview.decision?.reason || "Rejected by reviewer" });
  } else {
    const approvalResult = determineApprovalReadiness(preview.review, preview.topicMappings, preview.sourceMappings);
    const canBeApproved = approvalResult.valid && qualityPassed;
    steps.push({ status: "approved", label: "Approved", passed: canBeApproved, detail: canBeApproved ? `Approved by ${preview.decision?.decidedBy || "system"}` : `Not approved: ${approvalResult.errors.join("; ")}` });

    if (isPublished) {
      steps.push({ status: "published", label: "Published", passed: true, detail: `Published to registry by ${preview.decision!.decidedBy}` });
    } else {
      steps.push({ status: "published", label: "Published", passed: false, detail: "Not published — candidate was not approved for publishing" });
    }
  }

  return steps;
}

export function simulateIngestion(scenario: MockIngestionScenario): SimulationResult {
  const candidate = scenario.candidate;
  const preview = scenario.applyPreview;

  const validationResult = validateContentCandidate(candidate);
  const normalizedItem = validationResult.valid ? createNormalizedItem(candidate, preview.normalizedItemId) : null;

  const topicMappingResults = preview.topicMappings.map((m) => validateTopicMappingCandidate(m));
  const sourceMappingResults = preview.sourceMappings.map((m) => validateSourceMappingCandidate(m));
  const qualityResult = evaluateContentQuality(preview.review);
  const approvalResult = determineApprovalReadiness(preview.review, preview.topicMappings, preview.sourceMappings);

  const lifecycleSteps = buildLifecycle(scenario);

  const isRejected = preview.decision?.decision === "rejected" || preview.decision?.nextStatus === "rejected";
  const isPublished = preview.decision?.nextStatus === "published" && preview.decision?.decision === "approved";
  const finalStatus: IngestionStatus = isRejected ? "rejected" : isPublished ? "published" : "reviewed";
  const rejectionReason = isRejected ? (preview.decision?.reason || null) : null;

  return {
    candidateId: candidate.id || "unknown",
    candidate,
    label: scenario.label,
    description: scenario.description,
    validationResult,
    lifecycleSteps,
    normalizedItem,
    topicMappingResults,
    sourceMappingResults,
    qualityResult,
    approvalResult,
    finalStatus,
    rejectionReason
  };
}

export function simulateAllCandidates(scenarios: MockIngestionScenario[]): SimulationResult[] {
  return scenarios.map(simulateIngestion);
}

export const WORKFLOW_GRAPH: { from: string; to: string }[] = [
  { from: "discovered", to: "normalized" },
  { from: "normalized", to: "mapped" },
  { from: "mapped", to: "reviewed" },
  { from: "reviewed", to: "approved" },
  { from: "reviewed", to: "rejected" },
  { from: "approved", to: "published" },
  { from: "approved", to: "rejected" }
];
