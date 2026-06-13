import { discoverySeeds } from "@/data/discovery-seeds";
import type { DiscoverySeed, DiscoverySeedCategory } from "@/data/discovery-seeds";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";
import type { PipelineResult } from "@/types/runtime-sub-agent";
import type { ManualUrlSubmission } from "./manual-url-fetch-contracts";
import { runRuntimeSubAgentPipeline } from "./runtime-sub-agent-orchestrator";

export type AutonomousDiscoveryInput = {
  categories: DiscoverySeedCategory[];
  submittedBy?: string;
  limit?: number;
};

export type AutonomousDiscoveryCandidate = {
  seed: DiscoverySeed;
  status: "review-required" | "duplicate-risk" | "failed";
  reviewRequired: boolean;
  duplicate: boolean;
  duplicateMatchCount: number;
  pipelineResult: PipelineResult;
};

export type AutonomousDiscoverySummary = {
  totalSeeds: number;
  selectedCategories: DiscoverySeedCategory[];
  candidatesDiscovered: number;
  reviewRequired: number;
  duplicateRisk: number;
  failed: number;
  traceSteps: number;
  graphWrites: 0;
};

export type AutonomousDiscoveryResult = {
  candidates: AutonomousDiscoveryCandidate[];
  summary: AutonomousDiscoverySummary;
  warnings: string[];
};

function selectedCategorySet(categories: DiscoverySeedCategory[]): Set<DiscoverySeedCategory> {
  return new Set(categories.length > 0 ? categories : ["system-design", "aws", "backend", "career"]);
}

function toSubmission(seed: DiscoverySeed, submittedBy: string): ManualUrlSubmission {
  return {
    url: seed.url,
    submittedBy,
    submittedAt: "2026-06-13T00:00:00.000Z",
    sourceType: seed.sourceType,
    notes: `Autonomous discovery seed: ${seed.title}. Tags: ${seed.tags.join(", ")}`,
    consent: true,
  };
}

export function discoverCandidatesFromSeeds(
  categories: DiscoverySeedCategory[],
  seeds: DiscoverySeed[] = discoverySeeds
): DiscoverySeed[] {
  const selected = selectedCategorySet(categories);
  return seeds
    .filter((seed) => selected.has(seed.category))
    .sort((a, b) => `${a.category}:${a.id}`.localeCompare(`${b.category}:${b.id}`));
}

export function deduplicateDiscoveryCandidates(seeds: DiscoverySeed[]): DiscoverySeed[] {
  const seenUrls = new Set<string>();
  const unique: DiscoverySeed[] = [];

  for (const seed of seeds) {
    const normalizedUrl = seed.url.trim().replace(/\/+$/, "").toLowerCase();
    if (seenUrls.has(normalizedUrl)) continue;
    seenUrls.add(normalizedUrl);
    unique.push(seed);
  }

  return unique;
}

export function buildDiscoverySummary(
  candidates: AutonomousDiscoveryCandidate[],
  selectedCategories: DiscoverySeedCategory[],
  totalSeeds: number
): AutonomousDiscoverySummary {
  return {
    totalSeeds,
    selectedCategories: [...selectedCategorySet(selectedCategories)].sort(),
    candidatesDiscovered: candidates.length,
    reviewRequired: candidates.filter((candidate) => candidate.reviewRequired).length,
    duplicateRisk: candidates.filter((candidate) => candidate.duplicate).length,
    failed: candidates.filter((candidate) => candidate.status === "failed").length,
    traceSteps: candidates.reduce((sum, candidate) => sum + candidate.pipelineResult.trace.length, 0),
    graphWrites: 0,
  };
}

export function runAutonomousDiscovery(
  input: AutonomousDiscoveryInput
): AutonomousDiscoveryResult {
  const beforeSources = founderBetaSourceCatalog.length;
  const beforeTopics = founderBetaMasterTopics.length;
  const selectedSeeds = deduplicateDiscoveryCandidates(
    discoverCandidatesFromSeeds(input.categories).slice(0, input.limit ?? 12)
  );
  const submittedBy = input.submittedBy ?? "autonomous-discovery-agent";

  const candidates = selectedSeeds.map((seed): AutonomousDiscoveryCandidate => {
    const pipelineResult = runRuntimeSubAgentPipeline(toSubmission(seed, submittedBy));
    const duplicate = pipelineResult.duplicate?.duplicateInfo.isDuplicate ?? false;
    const reviewRequired = pipelineResult.review?.humanApprovalRequired ?? false;
    return {
      seed,
      status: !pipelineResult.success ? "failed" : duplicate ? "duplicate-risk" : "review-required",
      reviewRequired,
      duplicate,
      duplicateMatchCount: pipelineResult.duplicate?.duplicateInfo.matches.length ?? 0,
      pipelineResult,
    };
  });

  const warnings = [
    "Autonomous discovery does not modify the graph.",
    ...(founderBetaSourceCatalog.length !== beforeSources || founderBetaMasterTopics.length !== beforeTopics
      ? ["Graph mutation detected during autonomous discovery."]
      : []),
  ];

  return {
    candidates,
    summary: buildDiscoverySummary(candidates, input.categories, selectedSeeds.length),
    warnings,
  };
}
