import type { MasterTopic, Skill, Capability } from "@/types/founder-beta";
import type { SyllabusGap, GapSubAgentResult } from "@/types/gap-driven-ingestion";

export function detectCoverageGaps(
  topics: MasterTopic[],
  skills: Skill[],
  capabilities: Capability[]
): GapSubAgentResult {
  const start = performance.now();
  const gaps: SyllabusGap[] = [];
  const topicIds = new Set(topics.map((t) => t.id));
  const skillIds = new Set(skills.map((s) => s.id));

  let gapCounter = 0;

  for (const topic of topics) {
    if (topic.sourceIds.length < 2) {
      gaps.push({
        id: `gap-cov-${gapCounter++}`,
        type: "low-source-topic",
        severity: topic.sourceIds.length === 0 ? "critical" : "high",
        target: { entityType: "topic", entityId: topic.id, entityName: topic.name },
        reason: `Topic has only ${topic.sourceIds.length} source(s)`,
        detail: `Topic "${topic.name}" (${topic.id}) has ${topic.sourceIds.length} sources. Minimum 2 recommended.`,
        score: topic.sourceIds.length === 0 ? 100 : 80,
      });
    }
  }

  for (const skill of skills) {
    const skillTopicCount = skill.topicIds.filter((tid) => topicIds.has(tid)).length;
    if (skillTopicCount < 2) {
      gaps.push({
        id: `gap-cov-${gapCounter++}`,
        type: "weak-skill-coverage",
        severity: skillTopicCount === 0 ? "critical" : "high",
        target: { entityType: "skill", entityId: skill.id, entityName: skill.name },
        reason: `Skill has only ${skillTopicCount} topic(s)`,
        detail: `Skill "${skill.name}" (${skill.id}) has ${skillTopicCount} associated topics. Minimum 2 recommended.`,
        score: skillTopicCount === 0 ? 95 : 75,
      });
    }
  }

  for (const cap of capabilities) {
    const capSkillCount = cap.skillIds.filter((sid) => skillIds.has(sid)).length;
    if (capSkillCount < 2) {
      gaps.push({
        id: `gap-cov-${gapCounter++}`,
        type: "weak-capability-coverage",
        severity: capSkillCount === 0 ? "critical" : "high",
        target: { entityType: "capability", entityId: cap.id, entityName: cap.name },
        reason: `Capability has only ${capSkillCount} skill(s)`,
        detail: `Capability "${cap.name}" (${cap.id}) has ${capSkillCount} skills. Minimum 2 recommended.`,
        score: capSkillCount === 0 ? 90 : 70,
      });
    }
  }

  return {
    agentId: "coverage-gap-agent",
    agentName: "Coverage Gap Agent",
    gaps,
    trace: {
      agentId: "coverage-gap-agent",
      agentName: "Coverage Gap Agent",
      elapsedMs: Math.round(performance.now() - start),
      gapsFound: gaps.length,
      status: "success",
    },
  };
}
