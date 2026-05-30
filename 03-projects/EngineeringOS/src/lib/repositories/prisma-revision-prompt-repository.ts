import { prisma } from "@/lib/db/prisma";
import { toRevisionPrompt } from "@/lib/repositories/prisma-mappers";
import type { RevisionPromptRepository } from "@/lib/repositories/revision-prompt-repository";

export const prismaRevisionPromptRepository: RevisionPromptRepository = {
  async getPromptsByTopicId(topicId) {
    const prompts = await prisma.revisionPrompt.findMany({ where: { topicId } });
    return prompts.map(toRevisionPrompt);
  },
  async getPromptsForTopics(topicIds) {
    const prompts = await prisma.revisionPrompt.findMany({ where: { topicId: { in: topicIds } } });
    return prompts.map(toRevisionPrompt);
  }
};
