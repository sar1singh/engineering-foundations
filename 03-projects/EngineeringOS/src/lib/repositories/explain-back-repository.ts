import type { ExplainBackAttempt } from "@/types/progress";

export type SaveExplainBackAttemptInput = {
  topicId: string;
  taskId?: string;
  answer: string;
};

export interface ExplainBackRepository {
  saveExplainBackAttempt(input: SaveExplainBackAttemptInput): Promise<ExplainBackAttempt>;
  getExplainBackAttemptsByTopicId(topicId: string): Promise<ExplainBackAttempt[]>;
  getLatestExplainBackAttempt(topicId: string): Promise<ExplainBackAttempt | null>;
}
