import { describe, expect, it } from "vitest";
import { founderBetaMissionSelectionService } from "@/lib/services/founder-beta-mission-selection-service";

describe("FounderBetaMissionSelectionService", () => {
  it("selects a primary mission for the highest-priority hard blocker that fits the time budget", () => {
    const mission = founderBetaMissionSelectionService.selectPrimaryMission({
      availableMinutes: 60,
      hardGateReadiness: {
        awsReadiness: 50
      }
    });

    expect(mission?.id).toBe("mission-learn-aws-well-architected");
  });

  it("prioritizes an incomplete previous mission before readiness gaps", () => {
    const mission = founderBetaMissionSelectionService.selectPrimaryMission({
      availableMinutes: 90,
      previousMissionId: "mission-implement-rate-limiter",
      capabilityReadinessById: {
        "cap-behavioral-communication": 40
      }
    });

    expect(mission?.id).toBe("mission-implement-rate-limiter");
  });

  it("selects optional missions from revision or weak-area candidates and limits them to two", () => {
    const optionalMissions = founderBetaMissionSelectionService.selectOptionalMissions(
      {
        availableMinutes: 180,
        weakAreaCapabilityIds: ["cap-behavioral-communication", "cap-career-assets", "cap-system-design-hld"],
        revisionTopicIds: ["topic-caching"]
      },
      "mission-practice-api-design"
    );

    expect(optionalMissions.length).toBeLessThanOrEqual(2);
    expect(optionalMissions.map((mission) => mission.id)).toEqual([
      "mission-interview-caching-tradeoffs",
      "mission-behavioral-star-ownership"
    ]);
  });

  it("filters missions by time budget using stable seed ordering", () => {
    const missions = founderBetaMissionSelectionService.getMissionsForTimeBudget(60);

    expect(missions.map((mission) => mission.id)).toEqual([
      "mission-learn-aws-well-architected",
      "mission-interview-caching-tradeoffs",
      "mission-behavioral-star-ownership",
      "mission-career-resume-positioning"
    ]);
  });

  it("keeps weak-area missions deterministic behind roadmap critical path priority", () => {
    const prioritized = founderBetaMissionSelectionService.prioritizeMissions({
      weakAreaTopicIds: ["topic-rate-limiting"]
    });

    const rateLimiter = prioritized.find(({ mission }) => mission.id === "mission-implement-rate-limiter");

    expect(rateLimiter?.reason).toBe("roadmap-critical-path");
    expect(rateLimiter?.score).toBeGreaterThan(
      prioritized.find(({ mission }) => mission.id === "mission-career-resume-positioning")?.score ?? 0
    );
  });

  it("returns stable deterministic ordering for repeated calls", () => {
    const input = {
      availableMinutes: 120,
      capabilityReadinessById: {
        "cap-system-design-hld": 55,
        "cap-aws-cloud-architecture": 55
      }
    };

    const first = founderBetaMissionSelectionService.prioritizeMissions(input).map(({ mission }) => mission.id);
    const second = founderBetaMissionSelectionService.prioritizeMissions(input).map(({ mission }) => mission.id);

    expect(second).toEqual(first);
  });

  it("returns a selection reason for a mission", () => {
    const mission = founderBetaMissionSelectionService.selectPrimaryMission({
      hardGateReadiness: {
        resumeReadiness: 50
      }
    });

    expect(mission?.id).toBe("mission-career-resume-positioning");
    expect(
      mission
        ? founderBetaMissionSelectionService.getMissionSelectionReason(mission, {
            hardGateReadiness: {
              resumeReadiness: 50
            }
          })
        : null
    ).toBe("hard-blocker");
  });
});
