import type { MasterTopic, ReadinessDimension } from "@/types/founder-beta";
import type { SyllabusGap, GapSubAgentResult } from "@/types/gap-driven-ingestion";

export function detectReadinessCoverageGaps(
  topics: MasterTopic[]
): GapSubAgentResult {
  const start = performance.now();
  const gaps: SyllabusGap[] = [];
  const expectedDimensions: ReadinessDimension[] = ["knowledge", "practice", "interview", "implementation"];
  let gapCounter = 0;

  for (const topic of topics) {
    const dimensions = new Set<ReadinessDimension>(topic.readinessMetrics);
    const missing = expectedDimensions.filter((d) => !dimensions.has(d));
    if (missing.length > 0) {
      gaps.push({
        id: `gap-rdn-${gapCounter++}`,
        type: "weak-readiness-coverage",
        severity: missing.length >= 3 ? "high" : "medium",
        target: { entityType: "topic", entityId: topic.id, entityName: topic.name },
        reason: `Topic missing ${missing.length} readiness dimension(s): ${missing.join(", ")}`,
        detail: `Topic "${topic.name}" (${topic.id}) is missing readiness dimensions: ${missing.join(", ")}. Complete set is: knowledge, practice, interview, implementation.`,
        score: missing.length >= 3 ? 70 : 50,
      });
    }
  }

  for (const topic of topics) {
    if (topic.confidenceScore < 0.7) {
      gaps.push({
        id: `gap-rdn-${gapCounter++}`,
        type: "stale-or-low-confidence-topic",
        severity: topic.confidenceScore < 0.5 ? "critical" : "medium",
        target: { entityType: "topic", entityId: topic.id, entityName: topic.name },
        reason: `Topic confidence score is ${topic.confidenceScore}`,
        detail: `Topic "${topic.name}" (${topic.id}) has a confidence score of ${topic.confidenceScore}. Target >= 0.7.`,
        score: topic.confidenceScore < 0.5 ? 85 : 55,
      });
    }
  }

  return {
    agentId: "readiness-coverage-agent",
    agentName: "Readiness Coverage Agent",
    gaps,
    trace: {
      agentId: "readiness-coverage-agent",
      agentName: "Readiness Coverage Agent",
      elapsedMs: Math.round(performance.now() - start),
      gapsFound: gaps.length,
      status: "success",
    },
  };
}
