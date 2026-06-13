import { awsSeeds } from "@/data/discovery-seeds";
import type { MultiSourceDiscoveryAgentResult } from "@/types/multi-source-discovery-agent";
import { runSeedBackedDiscoveryAgent } from "./source-discovery-agent-runner";

export function runAwsDiscoveryAgent(
  submittedBy: string = "aws-discovery-agent",
  limit?: number
): MultiSourceDiscoveryAgentResult {
  return runSeedBackedDiscoveryAgent("aws-discovery-agent", awsSeeds, submittedBy, limit);
}
