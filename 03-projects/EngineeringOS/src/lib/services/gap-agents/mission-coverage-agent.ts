import type { MasterTopic, Skill, Capability, DailyMission } from "@/types/founder-beta";
import type { SyllabusGap, GapSubAgentResult } from "@/types/gap-driven-ingestion";

export function detectMissionCoverageGaps(
  topics: MasterTopic[],
  skills: Skill[],
  capabilities: Capability[],
  missions: DailyMission[]
): GapSubAgentResult {
  const start = performance.now();
  const gaps: SyllabusGap[] = [];

  const topicIdsWithMission = new Set<string>();
  const capIdsWithMission = new Set<string>();
  const skillIdsWithMission = new Set<string>();

  for (const m of missions) {
    if (m.topicId) topicIdsWithMission.add(m.topicId);
    if (m.capabilityId) capIdsWithMission.add(m.capabilityId);
  }

  for (const skill of skills) {
    const missionTopicCount = skill.topicIds.filter((tid) => topicIdsWithMission.has(tid)).length;
    if (missionTopicCount === 0) {
      skillIdsWithMission.add(skill.id);
    }
  }

  let gapCounter = 0;

  for (const topic of topics) {
    if (!topicIdsWithMission.has(topic.id)) {
      gaps.push({
        id: `gap-msn-${gapCounter++}`,
        type: "missing-mission-path",
        severity: "medium",
        target: { entityType: "topic", entityId: topic.id, entityName: topic.name },
        reason: `Topic has no mission`,
        detail: `Topic "${topic.name}" (${topic.id}) has no associated daily mission. Consider adding a learn/practice mission.`,
        score: 40,
      });
    }
  }

  return {
    agentId: "mission-coverage-agent",
    agentName: "Mission Coverage Agent",
    gaps,
    trace: {
      agentId: "mission-coverage-agent",
      agentName: "Mission Coverage Agent",
      elapsedMs: Math.round(performance.now() - start),
      gapsFound: gaps.length,
      status: "success",
    },
  };
}
