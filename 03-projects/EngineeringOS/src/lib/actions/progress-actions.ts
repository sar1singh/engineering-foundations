"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { appServices } from "@/lib/providers";
import type { PersistenceActionState } from "@/lib/actions/persistence-action-state";
import type { SaveEvaluationResultInput } from "@/lib/repositories/evaluation-result-repository";
import type { SaveExplainBackAttemptInput } from "@/lib/repositories/explain-back-repository";
import { evaluateMockAnswer } from "@/lib/services/mock-assessment-service";
import { learningPreferencesCookieName, serializeLearningPreferences } from "@/lib/services/onboarding-service";
import type { RevisionQueueItem, UserWeakArea } from "@/types/progress";

export async function markTopicCompleteAction(topicId: string) {
  await appServices.topicContentService.completeTopic(topicId);
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  revalidatePath(`/topics/${topicId}`);
  revalidatePath(`/syllabus/${topicId}`);
}

export async function markTaskCompleteAction(taskId: string, routePath?: string) {
  await appServices.practiceContentService.completeTask(taskId);
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  revalidatePath(`/practice/${taskId}`);
  if (routePath) {
    revalidatePath(routePath);
  }
}

export async function updateWeakAreasAction(weakAreas: UserWeakArea[]) {
  await appServices.progressSummaryService.updateWeakAreas(weakAreas);
  revalidatePath("/dashboard");
  revalidatePath("/progress");
}

export async function updateRevisionQueueAction(items: RevisionQueueItem[]) {
  await appServices.revisionService.updateRevisionQueue(items);
  revalidatePath("/dashboard");
  revalidatePath("/progress");
}

export async function saveExplainBackAttemptAction(input: SaveExplainBackAttemptInput) {
  return appServices.topicContentService.saveExplainBackAttempt(input);
}

export async function saveEvaluationResultAction(input: SaveEvaluationResultInput) {
  return appServices.topicContentService.saveEvaluationResult(input);
}

export async function resetLocalProgressAction() {
  await appServices.progressSummaryService.resetLocalProgress();
  revalidatePath("/dashboard");
  revalidatePath("/progress");
}

export async function markTopicCompleteFormAction(
  topicId: string,
  _previousState: PersistenceActionState,
  _formData: FormData
): Promise<PersistenceActionState> {
  void _previousState;
  void _formData;

  try {
    await markTopicCompleteAction(topicId);
    return { status: "success", message: "Topic marked complete." };
  } catch {
    return { status: "error", message: "Could not mark this topic complete." };
  }
}

export async function markTaskCompleteFormAction(
  taskId: string,
  routePath: string,
  _previousState: PersistenceActionState,
  _formData: FormData
): Promise<PersistenceActionState> {
  void _previousState;
  void _formData;

  try {
    await markTaskCompleteAction(taskId, routePath);
    return { status: "success", message: "Task marked complete." };
  } catch {
    return { status: "error", message: "Could not mark this task complete." };
  }
}

export async function resetLocalProgressFormAction(
  _previousState: PersistenceActionState,
  _formData: FormData
): Promise<PersistenceActionState> {
  void _previousState;
  void _formData;

  try {
    await resetLocalProgressAction();
    return { status: "success", message: "Local progress reset." };
  } catch {
    return { status: "error", message: "Could not reset local progress." };
  }
}

export async function saveTopicExplainBackFormAction(topicId: string, formData: FormData) {
  const answer = String(formData.get("answer") ?? "").trim();

  if (!answer) {
    return;
  }

  await saveExplainBackAttemptAction({ topicId, answer });
  revalidatePath(`/topics/${topicId}`);
}

export async function saveTopicExplainBackStateAction(
  topicId: string,
  _previousState: PersistenceActionState,
  formData: FormData
): Promise<PersistenceActionState> {
  try {
    const answer = String(formData.get("answer") ?? "").trim();

    if (!answer) {
      return { status: "error", message: "Write an explain-back answer before saving." };
    }

    await saveTopicExplainBackFormAction(topicId, formData);
    return { status: "success", message: "Explain-back attempt saved." };
  } catch {
    return { status: "error", message: "Could not save this explain-back attempt." };
  }
}

export async function saveSyllabusResponseStateAction(
  topicId: string,
  _previousState: PersistenceActionState,
  formData: FormData
): Promise<PersistenceActionState> {
  try {
    const promptType = String(formData.get("promptType") ?? "Syllabus response").trim();
    const prompt = String(formData.get("prompt") ?? "").trim();
    const answer = String(formData.get("answer") ?? "").trim();

    if (!answer) {
      return { status: "error", message: "Write a response before saving." };
    }

    const formattedAnswer = prompt ? `${promptType}: ${prompt}\n\n${answer}` : `${promptType}\n\n${answer}`;

    const attempt = await saveExplainBackAttemptAction({ topicId, answer: formattedAnswer });
    const mockAssessment = evaluateMockAnswer({ answer, promptType });

    await saveEvaluationResultAction({
      topicId,
      explainBackAttemptId: attempt.id,
      score: mockAssessment.score,
      maxScore: mockAssessment.maxScore,
      summary: mockAssessment.summary,
      strengths: mockAssessment.strengths,
      improvements: mockAssessment.improvements,
      evaluationSource: "mock"
    });

    revalidatePath(`/syllabus/${topicId}`);
    revalidatePath("/progress");

    return { status: "success", message: `Response saved and scored ${mockAssessment.score}/${mockAssessment.maxScore}.` };
  } catch {
    return { status: "error", message: "Could not save this response." };
  }
}

export async function saveLearningPreferencesStateAction(
  _previousState: PersistenceActionState,
  formData: FormData
): Promise<PersistenceActionState> {
  try {
    const targetRole = String(formData.get("targetRole") ?? "solution-architect");
    const currentLevel = String(formData.get("currentLevel") ?? "senior") as "junior" | "mid" | "senior" | "staff-em";
    const hoursPerWeek = Number(formData.get("hoursPerWeek") ?? 8);
    const deadlineWeeks = Number(formData.get("deadlineWeeks") ?? 16);
    const learningMode = String(formData.get("learningMode") ?? "core-80-20") as "core-80-20" | "balanced" | "deep-mastery";
    const weakAreas = String(formData.get("weakAreas") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const cookieStore = await cookies();

    const preferences = { targetRole, currentLevel, hoursPerWeek, deadlineWeeks, learningMode, weakAreas };

    await appServices.learnerStateService.savePreferences(preferences);

    cookieStore.set(
      learningPreferencesCookieName,
      serializeLearningPreferences(preferences),
      { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 180 }
    );

    revalidatePath("/dashboard");
    revalidatePath("/onboarding");

    return { status: "success", message: "Learning plan saved." };
  } catch {
    return { status: "error", message: "Could not save learning preferences." };
  }
}

export async function savePracticeMockEvaluationFormAction(taskId: string, topicId: string, formData: FormData) {
  const summary = String(formData.get("summary") ?? "").trim();

  if (!summary) {
    return;
  }

  await saveEvaluationResultAction({
    topicId,
    taskId,
    score: 7,
    maxScore: 10,
    summary,
    strengths: ["Mock self-review captured"],
    improvements: ["Replace with evaluator output in a later AI phase"],
    evaluationSource: "mock"
  });

  revalidatePath(`/practice/${taskId}`);
  revalidatePath("/progress");
}

export async function savePracticeMockEvaluationStateAction(
  taskId: string,
  topicId: string,
  _previousState: PersistenceActionState,
  formData: FormData
): Promise<PersistenceActionState> {
  try {
    const summary = String(formData.get("summary") ?? "").trim();

    if (!summary) {
      return { status: "error", message: "Write a mock evaluation note before saving." };
    }

    await savePracticeMockEvaluationFormAction(taskId, topicId, formData);
    return { status: "success", message: "Mock evaluation note saved." };
  } catch {
    return { status: "error", message: "Could not save this mock evaluation note." };
  }
}
