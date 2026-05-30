import { prisma } from "@/lib/db/prisma";
import { toEvaluationRubric } from "@/lib/repositories/prisma-mappers";
import type { EvaluationRubricRepository } from "@/lib/repositories/evaluation-rubric-repository";

export const prismaEvaluationRubricRepository: EvaluationRubricRepository = {
  async getRubricById(id) {
    const rubric = await prisma.evaluationRubric.findUnique({ where: { id }, include: { criteria: true } });
    return rubric ? toEvaluationRubric(rubric) : null;
  },
  async getRubricByTopicId(topicId) {
    const rubric = await prisma.evaluationRubric.findFirst({ where: { topicId }, include: { criteria: true } });
    return rubric ? toEvaluationRubric(rubric) : null;
  },
  async getRubricByTaskId(taskId) {
    const rubric = await prisma.evaluationRubric.findFirst({ where: { taskId }, include: { criteria: true } });
    return rubric ? toEvaluationRubric(rubric) : null;
  }
};
