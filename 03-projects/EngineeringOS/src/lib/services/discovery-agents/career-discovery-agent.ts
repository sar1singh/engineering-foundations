import { careerSeeds } from "@/data/discovery-seeds";
import type { MultiSourceDiscoveryAgentResult } from "@/types/multi-source-discovery-agent";
import { runSeedBackedDiscoveryAgent } from "./source-discovery-agent-runner";

export function runCareerDiscoveryAgent(
  submittedBy: string = "career-discovery-agent",
  limit?: number
): MultiSourceDiscoveryAgentResult {
  return runSeedBackedDiscoveryAgent("career-discovery-agent", careerSeeds, submittedBy, limit);
}
