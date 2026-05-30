import { prisma } from "@/lib/db/prisma";
import { parseJson, toProblemStatement } from "@/lib/repositories/prisma-mappers";
import type { ProblemRepository } from "@/lib/repositories/problem-repository";

export const prismaProblemRepository: ProblemRepository = {
  async getProblemById(id) {
    const problem = await prisma.problemStatement.findUnique({
      where: { id },
      include: { examples: true, testCases: true }
    });
    return problem ? toProblemStatement(problem) : null;
  },
  async getProblemsByTopicId(topicId) {
    const problems = await prisma.problemStatement.findMany({
      include: { examples: true, testCases: true }
    });
    return problems.map(toProblemStatement).filter((problem) => problem.topicIds.includes(topicId));
  },
  async getProblemsByDifficulty(difficulty) {
    const problems = await prisma.problemStatement.findMany({
      where: { difficulty },
      include: { examples: true, testCases: true }
    });
    return problems.map((problem) => ({
      ...toProblemStatement(problem),
      topicIds: parseJson<string[]>(problem.topicIds, [])
    }));
  }
};
