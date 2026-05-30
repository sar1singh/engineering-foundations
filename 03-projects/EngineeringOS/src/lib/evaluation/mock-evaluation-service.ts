import type { EvaluationResult, EvaluationService } from "@/lib/evaluation/evaluation-service";

const mockResult = (subject: string): EvaluationResult => ({
  score: 3,
  maxScore: 5,
  summary: `Mock evaluation for ${subject}. Real AI evaluation is disabled.`,
  strengths: ["Clear attempt", "Good starting structure"],
  improvements: ["Add edge cases", "Explain trade-offs explicitly"]
});

export class MockEvaluationService implements EvaluationService {
  async evaluateCode(): Promise<EvaluationResult> {
    return mockResult("code");
  }

  async evaluateExplanation(): Promise<EvaluationResult> {
    return mockResult("explanation");
  }
}

export const mockEvaluationService = new MockEvaluationService();
