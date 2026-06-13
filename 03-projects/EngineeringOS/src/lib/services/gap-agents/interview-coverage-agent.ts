import type { MasterTopic } from "@/types/founder-beta";
import type { SyllabusGap, GapSubAgentResult } from "@/types/gap-driven-ingestion";

export function detectInterviewCoverageGaps(
  topics: MasterTopic[]
): GapSubAgentResult {
  const start = performance.now();
  const gaps: SyllabusGap[] = [];

  let gapCounter = 0;

  for (const topic of topics) {
    if (topic.interviewImportance === "high" && topic.confidenceScore < 0.75) {
      gaps.push({
        id: `gap-int-${gapCounter++}`,
        type: "weak-interview-coverage",
        severity: "high",
        target: { entityType: "topic", entityId: topic.id, entityName: topic.name },
        reason: `High-interview topic has low confidence (${topic.confidenceScore})`,
        detail: `Topic "${topic.name}" is high interview importance but confidence is ${topic.confidenceScore}. Target >= 0.75.`,
        score: 75,
      });
    }
  }

  for (const topic of topics) {
    if (topic.interviewImportance === "medium" && topic.sourceIds.length < 2) {
      gaps.push({
        id: `gap-int-${gapCounter++}`,
        type: "weak-interview-coverage",
        severity: "medium",
        target: { entityType: "topic", entityId: topic.id, entityName: topic.name },
        reason: `Medium-interview topic has only ${topic.sourceIds.length} source(s)`,
        detail: `Topic "${topic.name}" (${topic.id}) is medium interview importance but has insufficient sources.`,
        score: 45,
      });
    }
  }

  return {
    agentId: "interview-coverage-agent",
    agentName: "Interview Coverage Agent",
    gaps,
    trace: {
      agentId: "interview-coverage-agent",
      agentName: "Interview Coverage Agent",
      elapsedMs: Math.round(performance.now() - start),
      gapsFound: gaps.length,
      status: "success",
    },
  };
}
