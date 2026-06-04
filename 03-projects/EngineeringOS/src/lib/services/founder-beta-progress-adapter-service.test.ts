import { describe, expect, it } from "vitest";

import { FounderBetaOrchestrationService } from "@/lib/services/founder-beta-orchestration-service";
import { FounderBetaProgressAdapterService } from "@/lib/services/founder-beta-progress-adapter-service";

describe("FounderBetaProgressAdapterService", () => {
  const adapter = new FounderBetaProgressAdapterService();

  it("returns safe default input", () => {
    const normalized = adapter.getDefaultFounderBetaProgressInput();

    expect(normalized.completedMissionIds).toEqual([]);
    expect(normalized.completedTopicIds).toEqual([]);
    expect(normalized.dayMode).toBe("weekday");
    expect(normalized.manualReadinessScores.architectReadiness).toBe(0);
    expect(normalized.validationWarnings).toEqual([]);
  });

  it("clamps proof scores to the locked 0-5 scale", () => {
    const normalized = adapter.normalizeFounderBetaProgressInput({
      manualProofScores: {
        "proof-api-contract": 9,
        "proof-rate-limiter": -2,
        "proof-caching-interview": 3.6
      }
    });

    expect(normalized.manualProofScores).toEqual({
      "proof-api-contract": 5,
      "proof-rate-limiter": 0,
      "proof-caching-interview": 4
    });
  });

  it("clamps readiness scores to 0-100", () => {
    const normalized = adapter.normalizeFounderBetaProgressInput({
      manualReadinessScores: {
        architectReadiness: 120,
        awsReadiness: -10,
        resumeReadiness: 81.234,
        capabilityReadinessById: {
          "cap-aws-cloud-architecture": 140
        },
        topicReadinessById: {
          "topic-rate-limiting": -5
        }
      }
    });

    expect(normalized.manualReadinessScores.architectReadiness).toBe(100);
    expect(normalized.manualReadinessScores.awsReadiness).toBe(0);
    expect(normalized.manualReadinessScores.resumeReadiness).toBe(81.23);
    expect(normalized.manualReadinessScores.capabilityReadinessById["cap-aws-cloud-architecture"]).toBe(100);
    expect(normalized.manualReadinessScores.topicReadinessById["topic-rate-limiting"]).toBe(0);
  });

  it("deduplicates ID arrays", () => {
    const normalized = adapter.normalizeFounderBetaProgressInput({
      completedMissionIds: ["mission-practice-api-design", "mission-practice-api-design"],
      completedTopicIds: ["topic-api-design", "topic-api-design"],
      weakAreaCapabilityIds: ["cap-system-design-hld", "cap-system-design-hld"],
      weakAreaTopicIds: ["topic-caching", "topic-caching"]
    });

    expect(normalized.completedMissionIds).toEqual(["mission-practice-api-design"]);
    expect(normalized.completedTopicIds).toEqual(["topic-api-design"]);
    expect(normalized.weakAreaCapabilityIds).toEqual(["cap-system-design-hld"]);
    expect(normalized.weakAreaTopicIds).toEqual(["topic-caching"]);
  });

  it("derives weak areas from low manual readiness scores", () => {
    const normalized = adapter.normalizeFounderBetaProgressInput({
      manualReadinessScores: {
        capabilityReadinessById: {
          "cap-aws-cloud-architecture": 62,
          "cap-node-backend": 78
        },
        topicReadinessById: {
          "topic-rate-limiting": 48,
          "topic-api-design": 85
        }
      }
    });

    expect(normalized.weakAreaCapabilityIds).toEqual(["cap-aws-cloud-architecture"]);
    expect(normalized.weakAreaTopicIds).toEqual(["topic-rate-limiting"]);
  });

  it("builds valid Today Plan input for orchestration", () => {
    const todayPlanInput = adapter.buildFounderBetaTodayPlanInput({
      availableMinutes: 90,
      dayMode: "weekday",
      completedMissionIds: ["mission-case-study-engineeringos-hld"],
      currentMissionId: "mission-implement-rate-limiter",
      weakAreaTopicIds: ["topic-rate-limiting"],
      manualReadinessScores: {
        architectReadiness: 76,
        awsReadiness: 69,
        behavioralReadiness: 72,
        communicationReadiness: 71,
        resumeReadiness: 82,
        capabilityReadinessById: {
          "cap-system-design-hld": 64
        }
      }
    });
    const plan = new FounderBetaOrchestrationService().getFounderBetaTodayPlan(todayPlanInput);

    expect(todayPlanInput.mode).toBe("weekday");
    expect(todayPlanInput.previousMissionId).toBe("mission-implement-rate-limiter");
    expect(todayPlanInput.completedArchitectureCaseStudies).toBe(1);
    expect(todayPlanInput.hardGateReadiness?.awsReadiness).toBe(69);
    expect(plan.path.id).toBe("founder-beta-solution-architect");
    expect(plan.primaryMission).not.toBeNull();
  });

  it("handles unknown IDs safely with validation warnings", () => {
    const normalized = adapter.normalizeFounderBetaProgressInput({
      completedMissionIds: ["missing-mission", "mission-practice-api-design"],
      completedTopicIds: ["missing-topic"],
      weakAreaCapabilityIds: ["missing-capability"],
      currentMissionId: "missing-current-mission",
      manualProofScores: {
        "missing-proof": 3
      },
      manualReadinessScores: {
        capabilityReadinessById: {
          "missing-capability": 50
        }
      }
    });

    expect(normalized.completedMissionIds).toEqual(["mission-practice-api-design"]);
    expect(normalized.completedTopicIds).toEqual([]);
    expect(normalized.weakAreaCapabilityIds).toEqual([]);
    expect(normalized.currentMissionId).toBeUndefined();
    expect(normalized.manualProofScores).toEqual({});
    expect(normalized.manualReadinessScores.capabilityReadinessById).toEqual({});
    expect(normalized.validationWarnings).toEqual(
      expect.arrayContaining([
        "Unknown mission id ignored: missing-mission",
        "Unknown topic id ignored: missing-topic",
        "Unknown capability id ignored: missing-capability",
        "Unknown mission id ignored: missing-current-mission",
        "Unknown proof id ignored: missing-proof"
      ])
    );
  });
});
