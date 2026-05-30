import { prisma } from "@/lib/db/prisma";
import { toInterviewQuestion } from "@/lib/repositories/prisma-mappers";
import type { InterviewQuestionRepository } from "@/lib/repositories/interview-question-repository";

export const prismaInterviewQuestionRepository: InterviewQuestionRepository = {
  async getQuestionsByTopicId(topicId) {
    const questions = await prisma.interviewQuestion.findMany({ where: { topicId } });
    return questions.map(toInterviewQuestion);
  }
};
