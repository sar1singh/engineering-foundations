import { backendSeeds } from "@/data/discovery-seeds";
import type { MultiSourceDiscoveryAgentResult } from "@/types/multi-source-discovery-agent";
import { runSeedBackedDiscoveryAgent } from "./source-discovery-agent-runner";

export function runBackendDiscoveryAgent(
  submittedBy: string = "backend-discovery-agent",
  limit?: number
): MultiSourceDiscoveryAgentResult {
  return runSeedBackedDiscoveryAgent("backend-discovery-agent", backendSeeds, submittedBy, limit);
}
