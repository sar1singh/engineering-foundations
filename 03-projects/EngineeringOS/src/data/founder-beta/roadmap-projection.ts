import type { RoadmapProjection } from "@/types/founder-beta";
import { founderBetaCapabilities } from "@/data/founder-beta/capabilities";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";

const founderArchitectTopicIds = founderBetaMasterTopics
  .filter((topic) => topic.roadmapPriority === "p0" || topic.roadmapPriority === "p1")
  .map((topic) => topic.id);

export const founderArchitectBetaRoadmapProjection: RoadmapProjection = {
  id: "founder-architect-beta-16-week",
  target: "Solution Architect",
  timelineWeeks: 16,
  hoursPerWeek: 10,
  primaryRole: "solution-architect",
  secondaryRole: "em-aware-lead-backend",
  capabilityIds: founderBetaCapabilities.map((capability) => capability.id),
  topicIds: founderArchitectTopicIds,
  missionIds: [
    "mission-learn-aws-well-architected",
    "mission-practice-api-design",
    "mission-implement-rate-limiter",
    "mission-interview-caching-tradeoffs",
    "mission-behavioral-star-ownership",
    "mission-career-resume-positioning",
    "mission-case-study-engineeringos-hld"
  ],
  hardGateIds: [
    "rule-architect-readiness",
    "rule-aws-readiness",
    "rule-behavioral-readiness",
    "rule-communication-readiness",
    "rule-resume-readiness",
    "rule-architecture-case-studies"
  ]
};
