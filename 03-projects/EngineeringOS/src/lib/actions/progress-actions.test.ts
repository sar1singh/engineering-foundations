import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidatePath = vi.fn();
const completeTopic = vi.fn();
const completeTask = vi.fn();
const resetLocalProgress = vi.fn();
const saveExplainBackAttempt = vi.fn();
const saveEvaluationResult = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath
}));

vi.mock("@/lib/providers", () => ({
  appServices: {
    topicContentService: {
      completeTopic,
      saveExplainBackAttempt,
      saveEvaluationResult
    },
    practiceContentService: {
      completeTask
    },
    progressSummaryService: {
      resetLocalProgress,
      updateWeakAreas: vi.fn()
    },
    revisionService: {
      updateRevisionQueue: vi.fn()
    }
  }
}));

describe("progress actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success state after marking topic complete", async () => {
    const { markTopicCompleteFormAction } = await import("@/lib/actions/progress-actions");

    const result = await markTopicCompleteFormAction("js-fundamentals", { status: "idle", message: "" }, new FormData());

    expect(result.status).toBe("success");
    expect(completeTopic).toHaveBeenCalledWith("js-fundamentals");
    expect(revalidatePath).toHaveBeenCalledWith("/progress");
  });

  it("returns error state when topic completion fails", async () => {
    completeTopic.mockRejectedValueOnce(new Error("nope"));
    const { markTopicCompleteFormAction } = await import("@/lib/actions/progress-actions");

    const result = await markTopicCompleteFormAction("js-fundamentals", { status: "idle", message: "" }, new FormData());

    expect(result.status).toBe("error");
  });

  it("revalidates the visible practice slug route after marking a task complete", async () => {
    const { markTaskCompleteFormAction } = await import("@/lib/actions/progress-actions");

    const result = await markTaskCompleteFormAction(
      "task-js-closures-core",
      "/practice/implement-counter-with-closure",
      { status: "idle", message: "" },
      new FormData()
    );

    expect(result.status).toBe("success");
    expect(completeTask).toHaveBeenCalledWith("task-js-closures-core");
    expect(revalidatePath).toHaveBeenCalledWith("/practice/implement-counter-with-closure");
  });

  it("validates explain-back form content before saving", async () => {
    const { saveTopicExplainBackStateAction } = await import("@/lib/actions/progress-actions");

    const result = await saveTopicExplainBackStateAction("js-fundamentals", { status: "idle", message: "" }, new FormData());

    expect(result.status).toBe("error");
    expect(saveExplainBackAttempt).not.toHaveBeenCalled();
  });

  it("saves mock evaluation form content", async () => {
    const { savePracticeMockEvaluationStateAction } = await import("@/lib/actions/progress-actions");
    const formData = new FormData();
    formData.set("summary", "Solid explanation.");

    const result = await savePracticeMockEvaluationStateAction(
      "task-js-fundamentals-core",
      "js-fundamentals",
      { status: "idle", message: "" },
      formData
    );

    expect(result.status).toBe("success");
    expect(saveEvaluationResult).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: "task-js-fundamentals-core",
        topicId: "js-fundamentals",
        evaluationSource: "mock"
      })
    );
  });

  it("revalidates dashboard and progress after reset", async () => {
    const { resetLocalProgressFormAction } = await import("@/lib/actions/progress-actions");

    const result = await resetLocalProgressFormAction({ status: "idle", message: "" }, new FormData());

    expect(result.status).toBe("success");
    expect(resetLocalProgress).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(revalidatePath).toHaveBeenCalledWith("/progress");
  });
});
