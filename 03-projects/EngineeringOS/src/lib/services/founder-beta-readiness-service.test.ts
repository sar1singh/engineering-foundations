import { describe, expect, it } from "vitest";
import { founderBetaReadinessService } from "@/lib/services/founder-beta-readiness-service";

describe("FounderBetaReadinessService", () => {
  it("calculates weighted topic readiness from proof-scale dimensions", () => {
    const score = founderBetaReadinessService.calculateTopicReadiness({
      knowledge: 4,
      practice: 3,
      interview: 2,
      implementation: 2
    });

    expect(score).toBe(53);
  });

  it("clamps topic readiness and handles missing dimensions safely", () => {
    expect(
      founderBetaReadinessService.calculateTopicReadiness({
        knowledge: 120,
        practice: -10,
        interview: undefined,
        implementation: 5
      })
    ).toBe(50);
  });

  it("calculates capability and role readiness deterministically", () => {
    expect(
      founderBetaReadinessService.calculateCapabilityReadiness({
        topicReadinessScores: [80, 60],
        proofScores: [4, 3],
        interviewReadinessScore: 70,
        recencyScore: 80,
        blockerPenalty: 5
      })
    ).toBe(66);

    expect(
      founderBetaReadinessService.calculateRoleReadiness({
        capabilityScores: [
          { score: 80, weight: 2 },
          { score: 60, weight: 1 }
        ]
      })
    ).toBe(73.33);
  });

  it("evaluates hard gate pass and fail states", () => {
    const failed = founderBetaReadinessService.evaluateHardGates({
      architectReadiness: 74,
      awsReadiness: 70,
      behavioralReadiness: 70,
      communicationReadiness: 70,
      resumeReadiness: 80,
      completedArchitectureCaseStudies: 3
    });

    expect(failed.find((gate) => gate.id === "rule-architect-readiness")?.passed).toBe(false);

    const passed = founderBetaReadinessService.evaluateHardGates({
      architectReadiness: 75,
      awsReadiness: 70,
      behavioralReadiness: 70,
      communicationReadiness: 70,
      resumeReadiness: 80,
      completedArchitectureCaseStudies: 3
    });

    expect(passed.every((gate) => gate.passed)).toBe(true);
  });

  it("returns proof score labels", () => {
    expect(founderBetaReadinessService.getProofScoreLabel(0)).toBe("Not Attempted");
    expect(founderBetaReadinessService.getProofScoreLabel(3)).toBe("Acceptable");
    expect(founderBetaReadinessService.getProofScoreLabel(5)).toBe("Interview Ready");
  });

  it("returns readiness bands", () => {
    expect(founderBetaReadinessService.getReadinessBand(0)).toBe("not-started");
    expect(founderBetaReadinessService.getReadinessBand(49)).toBe("blocked");
    expect(founderBetaReadinessService.getReadinessBand(50)).toBe("in-progress");
    expect(founderBetaReadinessService.getReadinessBand(75)).toBe("ready");
    expect(founderBetaReadinessService.getReadinessBand(90)).toBe("strong");
  });

  it("calculates offer readiness while respecting hard gates", () => {
    const blocked = founderBetaReadinessService.calculateOfferReadiness({
      architectReadiness: 80,
      awsReadiness: 72,
      behavioralReadiness: 72,
      communicationReadiness: 72,
      resumeReadiness: 60,
      completedArchitectureCaseStudies: 3,
      linkedInReadiness: 80,
      githubReadiness: 80,
      portfolioReadiness: 80,
      interviewPipelineReadiness: 80,
      compensationReadiness: 80
    });

    expect(blocked.hardGatesPassed).toBe(false);
    expect(blocked.band).toBe("blocked");

    const ready = founderBetaReadinessService.calculateOfferReadiness({
      architectReadiness: 80,
      awsReadiness: 72,
      behavioralReadiness: 72,
      communicationReadiness: 72,
      resumeReadiness: 82,
      completedArchitectureCaseStudies: 3,
      linkedInReadiness: 80,
      githubReadiness: 80,
      portfolioReadiness: 80,
      interviewPipelineReadiness: 80,
      compensationReadiness: 80
    });

    expect(ready.hardGatesPassed).toBe(true);
    expect(ready.band).toBe("ready");
    expect(ready.score).toBe(81.75);
  });

  it("handles empty and partial inputs safely", () => {
    expect(founderBetaReadinessService.calculateCapabilityReadiness({})).toBe(0);
    expect(founderBetaReadinessService.calculateRoleReadiness({})).toBe(0);

    const offerReadiness = founderBetaReadinessService.calculateOfferReadiness({});
    expect(offerReadiness.score).toBe(0);
    expect(offerReadiness.hardGatesPassed).toBe(false);
  });
});
