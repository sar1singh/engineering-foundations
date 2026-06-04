import { describe, expect, it } from "vitest";

import { FounderBetaOrchestrationService } from "@/lib/services/founder-beta-orchestration-service";

describe("FounderBetaOrchestrationService", () => {
  const service = new FounderBetaOrchestrationService();

  it("returns the founder beta today plan shape", () => {
    const plan = service.getFounderBetaTodayPlan({
      availableMinutes: 60,
      architectReadiness: 78,
      awsReadiness: 72,
      behavioralReadiness: 74,
      communicationReadiness: 73,
      resumeReadiness: 82,
      completedArchitectureCaseStudies: 3
    });

    expect(plan.path.id).toBe("founder-beta-solution-architect");
    expect(plan.roadmapSummary.id).toBe("founder-architect-beta-16-week");
    expect(plan.roadmapSummary.timelineWeeks).toBe(16);
    expect(plan.offerReadinessSignals.length).toBeGreaterThan(0);
    expect(plan.weakAreas).toEqual({ capabilityIds: [], topicIds: [] });
    expect(plan.nextRecommendedActions.length).toBeGreaterThan(0);
  });

  it("includes mission selection in the today plan", () => {
    const plan = service.getFounderBetaTodayPlan({
      availableMinutes: 60,
      weakAreaCapabilityIds: ["capability-aws-cloud-architecture"]
    });

    expect(plan.primaryMission).not.toBeNull();
    expect(plan.primaryMission?.id).toBe("mission-learn-aws-well-architected");
    expect(plan.optionalMissions.length).toBeLessThanOrEqual(2);
  });

  it("includes a readiness snapshot and hard gate status", () => {
    const plan = service.getFounderBetaTodayPlan({
      architectReadiness: 80,
      awsReadiness: 60,
      behavioralReadiness: 72,
      communicationReadiness: 75,
      resumeReadiness: 82,
      completedArchitectureCaseStudies: 3
    });

    expect(plan.readinessSnapshot.architectReadiness).toBe(80);
    expect(plan.readinessSnapshot.hardGatesPassed).toBe(false);
    expect(plan.readinessSnapshot.hardGates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "rule-aws-readiness",
          passed: false
        })
      ])
    );
  });

  it("handles missing input safely", () => {
    const plan = service.getFounderBetaTodayPlan();

    expect(plan.path.id).toBe("founder-beta-solution-architect");
    expect(plan.primaryMission).not.toBeNull();
    expect(plan.readinessSnapshot.hardGatesPassed).toBe(false);
    expect(plan.nextRecommendedActions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "action-start-primary-mission"
        })
      ])
    );
  });

  it("returns deterministic output for identical input", () => {
    const input = {
      availableMinutes: 90,
      architectReadiness: 76,
      awsReadiness: 69,
      behavioralReadiness: 71,
      communicationReadiness: 72,
      resumeReadiness: 83,
      completedArchitectureCaseStudies: 2,
      weakAreaTopicIds: ["topic-rate-limiting"]
    };

    const firstPlan = service.getFounderBetaTodayPlan(input);
    const secondPlan = service.getFounderBetaTodayPlan(input);

    expect(secondPlan).toEqual(firstPlan);
  });
});
