import { describe, expect, it } from "vitest";
import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  FileFounderBetaProgressRepository,
  FOUNDER_BETA_LOCAL_USER_ID,
  InMemoryFounderBetaProgressRepository
} from "@/lib/repositories/founder-beta-progress-repository";
import { FounderBetaProgressPersistenceService } from "@/lib/services/founder-beta-progress-persistence-service";

describe("FounderBetaProgressPersistenceService", () => {
  it("returns default normalized progress when nothing has been saved", async () => {
    const service = createService();

    const progress = await service.getFounderBetaProgress();

    expect(progress.userId).toBe(FOUNDER_BETA_LOCAL_USER_ID);
    expect(progress.completedMissionIds).toEqual([]);
    expect(progress.completedTopicIds).toEqual([]);
    expect(progress.dayMode).toBe("weekday");
    expect(progress).not.toHaveProperty("todayPlan");
    expect(progress).not.toHaveProperty("readinessSnapshot");
    expect(progress).not.toHaveProperty("hardGateStatus");
    expect(progress).not.toHaveProperty("primaryMission");
    expect(progress).not.toHaveProperty("optionalMissions");
  });

  it("saves only normalized founder beta progress input", async () => {
    const service = createService();

    const result = await service.saveFounderBetaProgress({
      completedMissionIds: ["mission-practice-api-design", "unknown-mission", "mission-practice-api-design"],
      completedTopicIds: ["topic-api-design", "missing-topic"],
      weakAreaCapabilityIds: ["cap-aws-cloud-architecture"],
      manualReadinessScores: {
        architectReadiness: 77.456,
        awsReadiness: 120,
        communicationReadiness: -5
      },
      manualProofScores: {
        "proof-api-contract": 6,
        "missing-proof": 3
      },
      availableMinutes: 74.6,
      dayMode: "weekend",
      preferredMissionTypes: ["learn", "interview", "learn"]
    });

    expect(result.progress.completedMissionIds).toEqual(["mission-practice-api-design"]);
    expect(result.progress.completedTopicIds).toEqual(["topic-api-design"]);
    expect(result.progress.weakAreaCapabilityIds).toContain("cap-aws-cloud-architecture");
    expect(result.progress.manualReadinessScores.architectReadiness).toBe(77.46);
    expect(result.progress.manualReadinessScores.awsReadiness).toBe(100);
    expect(result.progress.manualReadinessScores.communicationReadiness).toBe(0);
    expect(result.progress.proofScores["proof-api-contract"]).toBe(5);
    expect(result.progress.availableMinutes).toBe(75);
    expect(result.progress.dayMode).toBe("weekend");
    expect(result.progress.preferredMissionTypes).toEqual(["learn", "interview"]);
    expect(result.validationWarnings).toEqual([
      "Unknown mission id ignored: unknown-mission",
      "Unknown topic id ignored: missing-topic",
      "Unknown proof id ignored: missing-proof"
    ]);
  });

  it("loads saved progress without storing derived facade output", async () => {
    const service = createService();

    await service.saveFounderBetaProgress({
      completedMissionIds: ["mission-practice-api-design"],
      manualReadinessScores: {
        architectReadiness: 80
      }
    });

    const loaded = await service.getFounderBetaProgress();

    expect(loaded.completedMissionIds).toEqual(["mission-practice-api-design"]);
    expect(loaded.manualReadinessScores.architectReadiness).toBe(80);
    expect(Object.keys(loaded)).not.toContain("todayPlan");
    expect(Object.keys(loaded)).not.toContain("nextActions");
    expect(Object.keys(loaded)).not.toContain("roadmapProjection");
  });

  it("updates existing progress through the same normalization boundary", async () => {
    const service = createService();

    await service.saveFounderBetaProgress({
      completedMissionIds: ["mission-practice-api-design"],
      dayMode: "weekday"
    });

    const result = await service.updateFounderBetaProgress({
      completedTopicIds: ["topic-caching"],
      dayMode: "weekend"
    });

    expect(result.progress.completedMissionIds).toEqual(["mission-practice-api-design"]);
    expect(result.progress.completedTopicIds).toEqual(["topic-caching"]);
    expect(result.progress.dayMode).toBe("weekend");
  });

  it("clears saved progress without persisting derived output", async () => {
    const service = createService();

    await service.saveFounderBetaProgress({
      completedMissionIds: ["mission-practice-api-design"],
      manualReadinessScores: {
        architectReadiness: 80
      }
    });

    await service.clearFounderBetaProgress();
    const loaded = await service.getStoredFounderBetaProgress();
    const plan = await service.getFounderBetaPlanFromPersistedProgress();

    expect(loaded).toBeNull();
    expect(plan.normalizedInput.completedMissionIds).toEqual([]);
    expect(plan.readinessSnapshot.architectReadiness).toBe(0);
  });

  it("derives facade output from loaded progress instead of persisting it", async () => {
    const service = createService();

    await service.saveFounderBetaProgress({
      completedMissionIds: ["mission-practice-api-design"],
      manualReadinessScores: {
        architectReadiness: 82,
        awsReadiness: 71,
        behavioralReadiness: 72,
        communicationReadiness: 73,
        resumeReadiness: 84
      }
    });

    const plan = await service.getFounderBetaPlanFromPersistedProgress();
    const loaded = await service.getFounderBetaProgress();

    expect(plan.normalizedInput.completedMissionIds).toEqual(["mission-practice-api-design"]);
    expect(plan.readinessSnapshot.architectReadiness).toBe(82);
    expect(plan.readinessSnapshot.hardGates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "rule-architect-readiness",
          actual: 82
        })
      ])
    );
    expect(loaded).not.toHaveProperty("readinessSnapshot");
    expect(loaded).not.toHaveProperty("hardGateStatus");
  });
});

describe("FileFounderBetaProgressRepository", () => {
  it("returns null when the progress file is missing", async () => {
    const repository = new FileFounderBetaProgressRepository(await createTempProgressPath());

    await expect(repository.getProgress(FOUNDER_BETA_LOCAL_USER_ID)).resolves.toBeNull();
  });

  it("falls back safely when the progress file is malformed", async () => {
    const filePath = await createTempProgressPath();
    await writeFile(filePath, "{", "utf8");
    const repository = new FileFounderBetaProgressRepository(filePath);

    await expect(repository.getProgress(FOUNDER_BETA_LOCAL_USER_ID)).resolves.toBeNull();
  });

  it("migrates a missing schema version to the current schema version", async () => {
    const filePath = await createTempProgressPath();
    await writeFile(
      filePath,
      JSON.stringify({
        progressByUserId: {
          [FOUNDER_BETA_LOCAL_USER_ID]: {
            userId: FOUNDER_BETA_LOCAL_USER_ID,
            completedMissionIds: ["mission-practice-api-design"],
            manualReadinessScores: {
              architectReadiness: 80
            },
            proofScores: {},
            dayMode: "weekend",
            preferredMissionTypes: ["learn"]
          }
        }
      }),
      "utf8"
    );
    const repository = new FileFounderBetaProgressRepository(filePath);

    const progress = await repository.getProgress(FOUNDER_BETA_LOCAL_USER_ID);

    expect(progress?.schemaVersion).toBe(1);
    expect(progress?.completedMissionIds).toEqual(["mission-practice-api-design"]);
    expect(progress?.dayMode).toBe("weekend");
  });
});

function createService() {
  return new FounderBetaProgressPersistenceService(new InMemoryFounderBetaProgressRepository());
}

async function createTempProgressPath(): Promise<string> {
  const directory = await mkdtemp(path.join(os.tmpdir(), "founder-beta-progress-"));
  return path.join(directory, "progress.json");
}
