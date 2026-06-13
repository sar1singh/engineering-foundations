import type { MasterTopic, SourceReference } from "@/types/founder-beta";
import type { SyllabusGap, GapSubAgentResult } from "@/types/gap-driven-ingestion";

export function detectSourceDiversityGaps(
  topics: MasterTopic[],
  sources: SourceReference[]
): GapSubAgentResult {
  const start = performance.now();
  const gaps: SyllabusGap[] = [];
  const sourceTypeIndex: Record<string, Set<string>> = {};
  for (const topic of topics) {
    const types = new Set<string>();
    for (const sid of topic.sourceIds) {
      const src = sources.find((s) => s.id === sid);
      if (src) types.add(src.sourceType);
    }
    sourceTypeIndex[topic.id] = types;
  }

  let gapCounter = 0;

  for (const topic of topics) {
    const types = sourceTypeIndex[topic.id];
    if (types && types.size < 2) {
      const typeStr = [...types].join(", ");
      gaps.push({
        id: `gap-src-${gapCounter++}`,
        type: "weak-source-diversity",
        severity: types.size === 0 ? "critical" : "medium",
        target: { entityType: "topic", entityId: topic.id, entityName: topic.name },
        reason: `Topic sources come from only ${types.size} source type(s): ${typeStr}`,
        detail: `Topic "${topic.name}" (${topic.id}) sources are all from: ${typeStr}. Mix official docs, blogs, books, and repos.`,
        score: types.size === 0 ? 90 : 60,
      });
    }
  }

  return {
    agentId: "source-diversity-agent",
    agentName: "Source Diversity Agent",
    gaps,
    trace: {
      agentId: "source-diversity-agent",
      agentName: "Source Diversity Agent",
      elapsedMs: Math.round(performance.now() - start),
      gapsFound: gaps.length,
      status: "success",
    },
  };
}
