import type { EvaluationService } from "@/lib/evaluation";
import { mockEvaluationService } from "@/lib/evaluation";
import type { AiService, GeneratedHint } from "@/lib/ai/ai-service";

export class MockAiService implements AiService {
  constructor(private readonly evaluationService: EvaluationService = mockEvaluationService) {}

  async evaluateCode(input: { code: string; taskId?: string }) {
    return this.evaluationService.evaluateCode(input);
  }

  async evaluateExplanation(input: { explanation: string; topicId?: string }) {
    return this.evaluationService.evaluateExplanation(input);
  }

  async suggestNextTask(input: { topicId?: string; weakAreas?: string[] }): Promise<string | null> {
    return input.topicId ? `task-${input.topicId}-core` : input.weakAreas?.[0] ? `task-${input.weakAreas[0]}-core` : null;
  }

  async generateHint(): Promise<GeneratedHint> {
    return {
      hint: "Restate the problem, identify one edge case, then solve the smallest core version first.",
      source: "mock"
    };
  }
}

export const mockAiService = new MockAiService();
