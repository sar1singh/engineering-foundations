import type { FounderBetaProgressInput } from "@/lib/services/founder-beta-progress-adapter-service";

export const founderBetaEmptyProgress: FounderBetaProgressInput = {
  completedMissionIds: [],
  skippedMissionIds: [],
  completedTopicIds: [],
  weakAreaCapabilityIds: [],
  weakAreaTopicIds: [],
  manualProofScores: {},
  manualReadinessScores: {},
  availableMinutes: 60,
  dayMode: "weekday",
  preferredMissionTypes: []
};

export const founderBetaDemoProgress: FounderBetaProgressInput = {
  completedMissionIds: ["mission-learn-aws-well-architected", "mission-practice-api-design"],
  completedTopicIds: ["topic-api-design", "topic-load-balancing", "topic-aws-well-architected"],
  weakAreaCapabilityIds: ["cap-system-design-hld"],
  weakAreaTopicIds: ["topic-rate-limiting"],
  manualProofScores: {
    "proof-aws-pillar-summary": 4,
    "proof-api-contract": 3
  },
  manualReadinessScores: {
    architectReadiness: 72,
    awsReadiness: 74,
    behavioralReadiness: 66,
    communicationReadiness: 68,
    resumeReadiness: 76,
    linkedInReadiness: 55,
    githubReadiness: 60,
    portfolioReadiness: 50,
    interviewPipelineReadiness: 45,
    compensationReadiness: 70,
    capabilityReadinessById: {
      "cap-system-design-hld": 64,
      "cap-aws-cloud-architecture": 74,
      "cap-node-backend": 78
    },
    topicReadinessById: {
      "topic-rate-limiting": 52,
      "topic-caching": 58,
      "topic-aws-well-architected": 76
    }
  },
  availableMinutes: 90,
  dayMode: "weekday",
  currentMissionId: "mission-implement-rate-limiter",
  preferredMissionTypes: ["implement", "interview", "weak-area-repair"]
};

export const founderBetaWeakAreaProgress: FounderBetaProgressInput = {
  completedMissionIds: ["mission-practice-api-design"],
  completedTopicIds: ["topic-api-design"],
  weakAreaCapabilityIds: ["cap-aws-cloud-architecture", "cap-behavioral-communication"],
  weakAreaTopicIds: ["topic-aws-well-architected", "topic-behavioral-star-stories"],
  manualProofScores: {
    "proof-api-contract": 3
  },
  manualReadinessScores: {
    architectReadiness: 58,
    awsReadiness: 48,
    behavioralReadiness: 45,
    communicationReadiness: 50,
    resumeReadiness: 62,
    capabilityReadinessById: {
      "cap-aws-cloud-architecture": 48,
      "cap-behavioral-communication": 45
    },
    topicReadinessById: {
      "topic-aws-well-architected": 42,
      "topic-behavioral-star-stories": 45
    }
  },
  availableMinutes: 180,
  dayMode: "weekend",
  preferredMissionTypes: ["learn", "behavioral", "weak-area-repair"]
};
