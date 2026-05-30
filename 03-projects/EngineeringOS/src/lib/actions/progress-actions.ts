"use server";

import { revalidatePath } from "next/cache";
import { appServices } from "@/lib/providers";
import type { SaveEvaluationResultInput } from "@/lib/repositories/evaluation-result-repository";
import type { SaveExplainBackAttemptInput } from "@/lib/repositories/explain-back-repository";
import type { RevisionQueueItem, UserWeakArea } from "@/types/progress";

export async function markTopicCompleteAction(topicId: string) {
  await appServices.topicContentService.completeTopic(topicId);
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  revalidatePath(`/topics/${topicId}`);
}

export async function markTaskCompleteAction(taskId: string) {
  await appServices.practiceContentService.completeTask(taskId);
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  revalidatePath(`/practice/${taskId}`);
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

export async function saveTopicExplainBackFormAction(topicId: string, formData: FormData) {
  const answer = String(formData.get("answer") ?? "").trim();

  if (!answer) {
    return;
  }

  await saveExplainBackAttemptAction({ topicId, answer });
  revalidatePath(`/topics/${topicId}`);
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
