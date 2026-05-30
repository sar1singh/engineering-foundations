import { problemStatements } from "@/data/problem-statements";
import type { ProblemRepository } from "@/lib/repositories/problem-repository";

export const mockProblemRepository: ProblemRepository = {
  async getProblemById(id) {
    return problemStatements.find((problem) => problem.id === id) ?? null;
  },
  async getProblemsByTopicId(topicId) {
    return problemStatements.filter((problem) => problem.topicIds.includes(topicId));
  },
  async getProblemsByDifficulty(difficulty) {
    return problemStatements.filter((problem) => problem.difficulty === difficulty);
  }
};
