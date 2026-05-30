import type { SavedEvaluationResult } from "@/types/progress";

export type SaveEvaluationResultInput = {
  topicId?: string;
  taskId?: string;
  explainBackAttemptId?: string;
  score: number;
  maxScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  evaluationSource: "mock" | "ai";
};

export interface EvaluationResultRepository {
  saveEvaluationResult(input: SaveEvaluationResultInput): Promise<SavedEvaluationResult>;
  getEvaluationResultsByTopicId(topicId: string): Promise<SavedEvaluationResult[]>;
  getEvaluationResultsByTaskId(taskId: string): Promise<SavedEvaluationResult[]>;
}
