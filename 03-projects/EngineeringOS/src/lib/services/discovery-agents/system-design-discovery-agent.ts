import { systemDesignSeeds } from "@/data/discovery-seeds";
import type { MultiSourceDiscoveryAgentResult } from "@/types/multi-source-discovery-agent";
import { runSeedBackedDiscoveryAgent } from "./source-discovery-agent-runner";

export function runSystemDesignDiscoveryAgent(
  submittedBy: string = "system-design-discovery-agent",
  limit?: number
): MultiSourceDiscoveryAgentResult {
  return runSeedBackedDiscoveryAgent("system-design-discovery-agent", systemDesignSeeds, submittedBy, limit);
}
