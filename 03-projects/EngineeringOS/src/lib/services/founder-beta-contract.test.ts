import { describe, expect, it } from "vitest";

import { FounderBetaFacadeService } from "@/lib/services/founder-beta-facade-service";

describe("Founder beta vertical slice contract", () => {
  const facade = new FounderBetaFacadeService();

  it("returns the default founder beta plan contract", () => {
    const result = facade.getFounderBetaDefaultPlan();

    expect(result.todayPlan).toEqual(expect.any(Object));
    expect(result.primaryMission).toEqual(expect.any(Object));
    expect(result.readinessSnapshot).toEqual(expect.any(Object));
    expect(result.todayPlan.roadmapSummary).toEqual(
      expect.objectContaining({
        id: "founder-architect-beta-16-week",
        target: "Solution Architect",
        timelineWeeks: 16,
        hoursPerWeek: 10,
        primaryRole: "solution-architect",
        secondaryRole: "em-aware-lead-backend"
      })
    );
    expect(result.nextActions.length).toBeGreaterThan(0);
  });

  it("changes output when manual progress input changes", () => {
    const result = facade.getFounderBetaPlanFromProgress({
      completedMissionIds: ["mission-learn-aws-well-architected"],
      weakAreaCapabilityIds: ["cap-system-design-hld"],
      manualReadinessScores: {
        architectReadiness: 78,
        awsReadiness: 72,
        behavioralReadiness: 73,
        communicationReadiness: 74,
        resumeReadiness: 82,
        capabilityReadinessById: {
          "cap-system-design-hld": 62
        }
      }
    });

    expect(result.normalizedInput.completedMissionIds).toEqual(["mission-learn-aws-well-architected"]);
    expect(result.normalizedInput.weakAreaCapabilityIds).toEqual(["cap-system-design-hld"]);
    expect(result.readinessSnapshot.architectReadiness).toBe(78);
    expect(result.todayPlan.primaryMission?.id).not.toBe("mission-learn-aws-well-architected");
    expect(result.todayPlan.weakAreas.capabilityIds).toEqual(["cap-system-design-hld"]);
  });

  it("returns validation warnings for unknown IDs without crashing", () => {
    const result = facade.getFounderBetaPlanFromProgress({
      completedMissionIds: ["unknown-mission"],
      completedTopicIds: ["unknown-topic"],
      weakAreaCapabilityIds: ["unknown-capability"],
      weakAreaTopicIds: ["topic-rate-limiting"],
      manualProofScores: {
        "unknown-proof": 4
      }
    });

    expect(result.todayPlan.path.id).toBe("founder-beta-solution-architect");
    expect(result.validationWarnings).toEqual(
      expect.arrayContaining([
        "Unknown mission id ignored: unknown-mission",
        "Unknown topic id ignored: unknown-topic",
        "Unknown capability id ignored: unknown-capability",
        "Unknown proof id ignored: unknown-proof"
      ])
    );
    expect(result.normalizedInput.weakAreaTopicIds).toEqual(["topic-rate-limiting"]);
  });

  it("includes hard gate status in the public output", () => {
    const result = facade.getFounderBetaPlanFromProgress({
      manualReadinessScores: {
        architectReadiness: 80,
        awsReadiness: 69,
        behavioralReadiness: 72,
        communicationReadiness: 72,
        resumeReadiness: 85
      }
    });

    expect(result.readinessSnapshot.hardGatesPassed).toBe(false);
    expect(result.readinessSnapshot.hardGates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "rule-aws-readiness",
          threshold: 70,
          actual: 69,
          passed: false
        })
      ])
    );
  });

  it("keeps a stable output shape for future UI integration", () => {
    const result = facade.getFounderBetaPlanFromProgress({
      availableMinutes: 60,
      dayMode: "weekday"
    });

    expect(result).toEqual(
      expect.objectContaining({
        normalizedInput: expect.any(Object),
        validationWarnings: expect.any(Array),
        todayPlan: expect.any(Object),
        readinessSnapshot: expect.any(Object),
        primaryMission: expect.any(Object),
        optionalMissions: expect.any(Array),
        nextActions: expect.any(Array)
      })
    );
    expect(result.todayPlan).toEqual(
      expect.objectContaining({
        path: expect.any(Object),
        roadmap: expect.any(Object),
        roadmapSummary: expect.any(Object),
        readinessSnapshot: expect.any(Object),
        primaryMission: expect.any(Object),
        optionalMissions: expect.any(Array),
        weakAreas: expect.objectContaining({
          capabilityIds: expect.any(Array),
          topicIds: expect.any(Array)
        }),
        offerReadinessSignals: expect.any(Array),
        nextRecommendedActions: expect.any(Array)
      })
    );
  });
});
