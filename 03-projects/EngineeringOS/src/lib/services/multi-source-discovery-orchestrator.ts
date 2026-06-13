import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";
import type {
  MultiSourceDiscoveryAgentResult,
  MultiSourceDiscoveryAgentType,
  MultiSourceDiscoverySummary,
  MultiSourceDuplicateWarning,
} from "@/types/multi-source-discovery-agent";
import { runAwsDiscoveryAgent } from "./discovery-agents/aws-discovery-agent";
import { runBackendDiscoveryAgent } from "./discovery-agents/backend-discovery-agent";
import { runCareerDiscoveryAgent } from "./discovery-agents/career-discovery-agent";
import { runSystemDesignDiscoveryAgent } from "./discovery-agents/system-design-discovery-agent";

export type MultiSourceDiscoveryRunInput = {
  agents: readonly MultiSourceDiscoveryAgentType[];
  submittedBy?: string;
  limitPerAgent?: number;
};

export type MultiSourceDiscoveryRunResult = {
  agentResults: MultiSourceDiscoveryAgentResult[];
  summary: MultiSourceDiscoverySummary;
  crossAgentDuplicateWarnings: MultiSourceDuplicateWarning[];
  warnings: string[];
};

export const DEFAULT_MULTI_SOURCE_DISCOVERY_AGENTS: MultiSourceDiscoveryAgentType[] = [
  "aws-discovery-agent",
  "system-design-discovery-agent",
  "backend-discovery-agent",
  "career-discovery-agent",
];

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, "").toLowerCase();
}

function uniqueAgents(agents: readonly MultiSourceDiscoveryAgentType[]): MultiSourceDiscoveryAgentType[] {
  return [...new Set(agents.length > 0 ? agents : DEFAULT_MULTI_SOURCE_DISCOVERY_AGENTS)].sort();
}

export function runSingleSourceDiscoveryAgent(
  agentType: MultiSourceDiscoveryAgentType,
  submittedBy: string = agentType,
  limitPerAgent?: number
): MultiSourceDiscoveryAgentResult {
  switch (agentType) {
    case "aws-discovery-agent":
      return runAwsDiscoveryAgent(submittedBy, limitPerAgent);
    case "backend-discovery-agent":
      return runBackendDiscoveryAgent(submittedBy, limitPerAgent);
    case "career-discovery-agent":
      return runCareerDiscoveryAgent(submittedBy, limitPerAgent);
    case "system-design-discovery-agent":
      return runSystemDesignDiscoveryAgent(submittedBy, limitPerAgent);
  }
}

export function deduplicateAcrossAgents(
  agentResults: MultiSourceDiscoveryAgentResult[]
): MultiSourceDuplicateWarning[] {
  const byUrl = new Map<string, MultiSourceDuplicateWarning>();

  for (const result of agentResults) {
    for (const candidate of result.candidates) {
      const normalizedUrl = normalizeUrl(candidate.seed.url);
      const existing = byUrl.get(normalizedUrl);
      if (existing) {
        existing.agentTypes = [...new Set([...existing.agentTypes, result.agentType])].sort();
        existing.seedIds = [...new Set([...existing.seedIds, candidate.seed.id])].sort();
        existing.titles = [...new Set([...existing.titles, candidate.seed.title])].sort();
      } else {
        byUrl.set(normalizedUrl, {
          normalizedUrl,
          agentTypes: [result.agentType],
          seedIds: [candidate.seed.id],
          titles: [candidate.seed.title],
        });
      }
    }
  }

  return [...byUrl.values()]
    .filter((warning) => warning.agentTypes.length > 1 || warning.seedIds.length > 1)
    .sort((a, b) => a.normalizedUrl.localeCompare(b.normalizedUrl));
}

export function summarizeMultiSourceDiscovery(
  agentResults: MultiSourceDiscoveryAgentResult[],
  crossAgentDuplicateWarnings: MultiSourceDuplicateWarning[] = deduplicateAcrossAgents(agentResults)
): MultiSourceDiscoverySummary {
  return {
    selectedAgents: agentResults.map((result) => result.agentType).sort(),
    totalSeeds: agentResults.reduce((sum, result) => sum + result.seeds.length, 0),
    totalCandidates: agentResults.reduce((sum, result) => sum + result.candidates.length, 0),
    reviewRequired: agentResults.reduce(
      (sum, result) => sum + result.candidates.filter((candidate) => candidate.reviewRequired).length,
      0
    ),
    duplicateRisk: agentResults.reduce(
      (sum, result) => sum + result.candidates.filter((candidate) => candidate.duplicate).length,
      0
    ),
    failed: agentResults.reduce(
      (sum, result) => sum + result.candidates.filter((candidate) => candidate.status === "failed").length,
      0
    ),
    crossAgentDuplicateWarnings: crossAgentDuplicateWarnings.length,
    graphWrites: 0,
    publishActions: 0,
  };
}

export function runSelectedDiscoveryAgents(
  input: MultiSourceDiscoveryRunInput
): MultiSourceDiscoveryRunResult {
  const beforeSources = founderBetaSourceCatalog.length;
  const beforeTopics = founderBetaMasterTopics.length;
  const selectedAgents = uniqueAgents(input.agents);
  const agentResults = selectedAgents.map((agentType) =>
    runSingleSourceDiscoveryAgent(agentType, input.submittedBy ?? agentType, input.limitPerAgent)
  );
  const crossAgentDuplicateWarnings = deduplicateAcrossAgents(agentResults);

  return {
    agentResults,
    crossAgentDuplicateWarnings,
    summary: summarizeMultiSourceDiscovery(agentResults, crossAgentDuplicateWarnings),
    warnings: [
      "Multi-source discovery does not modify the graph.",
      "All candidates require human review before any graph update.",
      ...(founderBetaSourceCatalog.length !== beforeSources || founderBetaMasterTopics.length !== beforeTopics
        ? ["Graph mutation detected during multi-source discovery."]
        : []),
    ],
  };
}
