export type EvaluationResult = {
  score: number;
  maxScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
};

export interface EvaluationService {
  evaluateCode(input: { code: string; taskId?: string }): Promise<EvaluationResult>;
  evaluateExplanation(input: { explanation: string; topicId?: string }): Promise<EvaluationResult>;
}
