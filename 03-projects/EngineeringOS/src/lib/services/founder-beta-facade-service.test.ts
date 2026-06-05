import { describe, expect, it } from "vitest";

import { founderBetaDemoProgress, founderBetaWeakAreaProgress } from "@/data/founder-beta";
import { FounderBetaFacadeService } from "@/lib/services/founder-beta-facade-service";

describe("FounderBetaFacadeService", () => {
  const service = new FounderBetaFacadeService();

  it("generates a default founder beta plan", () => {
    const result = service.getFounderBetaDefaultPlan();

    expect(result.normalizedInput.dayMode).toBe("weekday");
    expect(result.validationWarnings).toEqual([]);
    expect(result.todayPlan.path.id).toBe("founder-beta-solution-architect");
    expect(result.primaryMission).not.toBeNull();
    expect(result.readinessSnapshot.hardGatesPassed).toBe(false);
  });

  it("normalizes progress input before generating the plan", () => {
    const result = service.getFounderBetaPlanFromProgress({
      completedMissionIds: ["mission-practice-api-design", "mission-practice-api-design"],
      completedTopicIds: ["topic-api-design", "topic-api-design"],
      availableMinutes: 90,
      dayMode: "weekend",
      currentMissionId: "mission-implement-rate-limiter",
      manualReadinessScores: {
        architectReadiness: 80,
        awsReadiness: 72,
        behavioralReadiness: 72,
        communicationReadiness: 72,
        resumeReadiness: 82
      }
    });

    expect(result.normalizedInput.completedMissionIds).toEqual(["mission-practice-api-design"]);
    expect(result.normalizedInput.completedTopicIds).toEqual(["topic-api-design"]);
    expect(result.normalizedInput.availableMinutes).toBe(90);
    expect(result.normalizedInput.dayMode).toBe("weekend");
    expect(result.todayPlan.primaryMission?.id).toBe("mission-implement-rate-limiter");
  });

  it("returns warnings for unknown IDs", () => {
    const result = service.getFounderBetaPlanFromProgress({
      completedMissionIds: ["unknown-mission"],
      weakAreaTopicIds: ["unknown-topic"],
      currentMissionId: "unknown-current"
    });

    expect(result.validationWarnings).toEqual(
      expect.arrayContaining([
        "Unknown mission id ignored: unknown-mission",
        "Unknown topic id ignored: unknown-topic",
        "Unknown mission id ignored: unknown-current"
      ])
    );
    expect(result.normalizedInput.completedMissionIds).toEqual([]);
    expect(result.normalizedInput.weakAreaTopicIds).toEqual([]);
  });

  it("uses manual readiness input in the plan readiness output", () => {
    const result = service.getFounderBetaPlanFromProgress({
      manualReadinessScores: {
        architectReadiness: 82,
        awsReadiness: 68,
        behavioralReadiness: 74,
        communicationReadiness: 76,
        resumeReadiness: 84,
        linkedInReadiness: 70,
        githubReadiness: 65,
        portfolioReadiness: 60,
        interviewPipelineReadiness: 50,
        compensationReadiness: 80
      }
    });

    expect(result.readinessSnapshot.architectReadiness).toBe(82);
    expect(result.readinessSnapshot.offerReadiness.hardGates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "rule-aws-readiness",
          actual: 68,
          passed: false
        })
      ])
    );
  });

  it("returns deterministic output for identical progress input", () => {
    const input = {
      availableMinutes: 60,
      weakAreaCapabilityIds: ["cap-aws-cloud-architecture"],
      manualProofScores: {
        "proof-aws-pillar-summary": 4
      },
      manualReadinessScores: {
        architectReadiness: 75,
        awsReadiness: 69,
        behavioralReadiness: 71,
        communicationReadiness: 70,
        resumeReadiness: 82
      }
    };

    const first = service.getFounderBetaPlanFromProgress(input);
    const second = service.getFounderBetaPlanFromProgress(input);

    expect(second).toEqual(first);
  });

  it("accepts founder beta demo progress without validation warnings", () => {
    const defaultPlan = service.getFounderBetaDefaultPlan();
    const demoPlan = service.getFounderBetaPlanFromProgress(founderBetaDemoProgress);

    expect(demoPlan.validationWarnings).toEqual([]);
    expect(demoPlan.normalizedInput.completedMissionIds).toEqual([
      "mission-learn-aws-well-architected",
      "mission-practice-api-design"
    ]);
    expect(demoPlan.normalizedInput.completedTopicIds).toEqual([
      "topic-api-design",
      "topic-load-balancing",
      "topic-aws-well-architected"
    ]);
    expect(demoPlan.readinessSnapshot.architectReadiness).toBe(72);
    expect(demoPlan.primaryMission?.id).not.toBe(defaultPlan.primaryMission?.id);
  });

  it("accepts founder beta weak-area progress without validation warnings", () => {
    const result = service.getFounderBetaPlanFromProgress(founderBetaWeakAreaProgress);

    expect(result.validationWarnings).toEqual([]);
    expect(result.normalizedInput.dayMode).toBe("weekend");
    expect(result.normalizedInput.weakAreaCapabilityIds).toEqual([
      "cap-aws-cloud-architecture",
      "cap-behavioral-communication"
    ]);
    expect(result.normalizedInput.weakAreaTopicIds).toEqual([
      "topic-aws-well-architected",
      "topic-behavioral-star-stories"
    ]);
  });
});
