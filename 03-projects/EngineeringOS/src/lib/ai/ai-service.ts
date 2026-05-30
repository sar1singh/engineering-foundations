import type { EvaluationResult } from "@/lib/evaluation";

export type GeneratedHint = {
  hint: string;
  source: "mock";
};

export interface AiService {
  evaluateCode(input: { code: string; taskId?: string }): Promise<EvaluationResult>;
  evaluateExplanation(input: { explanation: string; topicId?: string }): Promise<EvaluationResult>;
  suggestNextTask(input: { topicId?: string; weakAreas?: string[] }): Promise<string | null>;
  generateHint(input: { taskId?: string; context?: string }): Promise<GeneratedHint>;
}
