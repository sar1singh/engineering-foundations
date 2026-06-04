import type { RoadmapProjection } from "@/types/founder-beta";

export const founderArchitectBetaRoadmapProjection: RoadmapProjection = {
  id: "founder-architect-beta-16-week",
  target: "Solution Architect",
  timelineWeeks: 16,
  hoursPerWeek: 10,
  primaryRole: "solution-architect",
  secondaryRole: "em-aware-lead-backend",
  capabilityIds: [
    "cap-system-design-hld",
    "cap-aws-cloud-architecture",
    "cap-node-backend",
    "cap-databases",
    "cap-behavioral-communication",
    "cap-career-assets",
    "cap-offer-readiness"
  ],
  topicIds: [
    "topic-api-design",
    "topic-caching",
    "topic-rate-limiting",
    "topic-load-balancing",
    "topic-queues",
    "topic-database-indexing",
    "topic-redis-caching",
    "topic-aws-well-architected",
    "topic-resume-positioning",
    "topic-behavioral-star-stories",
    "topic-engineeringos-architecture-case-study"
  ],
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
