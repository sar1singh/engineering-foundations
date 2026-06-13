import type { MasterTopic, Capability } from "@/types/founder-beta";
import type { SyllabusGap, GapSubAgentResult } from "@/types/gap-driven-ingestion";

export function detectProofCoverageGaps(
  topics: MasterTopic[],
  capabilities: Capability[]
): GapSubAgentResult {
  const start = performance.now();
  const gaps: SyllabusGap[] = [];
  const requiredProofs: Record<string, Set<string>> = {};

  for (const topic of topics) {
    const proofSet = new Set(topic.proofTypes.map((p) => p));
    requiredProofs[topic.id] = proofSet;
  }

  let gapCounter = 0;

  for (const topic of topics) {
    const proofs = requiredProofs[topic.id];
    if (!proofs || proofs.size < 2) {
      gaps.push({
        id: `gap-prf-${gapCounter++}`,
        type: "missing-proof-path",
        severity: proofs?.size === 0 ? "high" : "medium",
        target: { entityType: "topic", entityId: topic.id, entityName: topic.name },
        reason: `Topic has only ${proofs?.size ?? 0} proof type(s)`,
        detail: `Topic "${topic.name}" (${topic.id}) has ${proofs?.size ?? 0} proof types. At least 2 recommended (e.g. knowledge + practice).`,
        score: proofs?.size === 0 ? 80 : 50,
      });
    }
  }

  for (const cap of capabilities) {
    const capProofs = new Set(cap.proofTypes.map((p) => p));
    if (capProofs.size < 3) {
      gaps.push({
        id: `gap-prf-${gapCounter++}`,
        type: "missing-proof-path",
        severity: "high",
        target: { entityType: "capability", entityId: cap.id, entityName: cap.name },
        reason: `Capability has only ${capProofs.size} proof type(s)`,
        detail: `Capability "${cap.name}" (${cap.id}) has ${capProofs.size} proof types. At least 3 recommended.`,
        score: 65,
      });
    }
  }

  return {
    agentId: "proof-coverage-agent",
    agentName: "Proof Coverage Agent",
    gaps,
    trace: {
      agentId: "proof-coverage-agent",
      agentName: "Proof Coverage Agent",
      elapsedMs: Math.round(performance.now() - start),
      gapsFound: gaps.length,
      status: "success",
    },
  };
}
