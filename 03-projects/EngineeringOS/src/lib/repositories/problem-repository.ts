import type { ProblemStatement } from "@/types/problem";

export interface ProblemRepository {
  getProblemById(id: string): Promise<ProblemStatement | null>;
  getProblemsByTopicId(topicId: string): Promise<ProblemStatement[]>;
  getProblemsByDifficulty(difficulty: "easy" | "medium" | "hard"): Promise<ProblemStatement[]>;
}
