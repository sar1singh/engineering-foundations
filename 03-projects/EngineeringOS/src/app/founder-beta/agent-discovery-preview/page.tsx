import Link from "next/link";
import { AGENT_DISCOVERY_SCENARIOS } from "@/data/founder-beta/agent-discovery-mock-scenarios";
import { simulateAllAgentScenarios } from "@/lib/services/agent-discovery-simulator";
import { AgentDiscoveryReview } from "@/components/founder-beta/AgentDiscoveryReview";
import { AgentRunnerPreview } from "@/components/founder-beta/AgentRunnerPreview";

export default function FounderBetaAgentDiscoveryPreviewPage() {
  const results = simulateAllAgentScenarios(AGENT_DISCOVERY_SCENARIOS);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-700">Founder Beta</p>
          <h1 className="mt-1 text-xl font-semibold">Agent Discovery Preview</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manual review of agent-discovered candidates + dry-run agent runner — preview only, no runtime agents, no writes.
          </p>
        </div>
        <Link
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          href="/founder-beta"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="rounded-lg border border-indigo-200 bg-white p-6">
        <AgentRunnerPreview />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Agent Discovery Review Queue</h2>
        <AgentDiscoveryReview results={results} />
      </div>
    </div>
  );
}
