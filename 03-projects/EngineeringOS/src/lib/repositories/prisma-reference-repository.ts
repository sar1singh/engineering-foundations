import { prisma } from "@/lib/db/prisma";
import { toReferenceLink } from "@/lib/repositories/prisma-mappers";
import type { ReferenceRepository } from "@/lib/repositories/reference-repository";

export const prismaReferenceRepository: ReferenceRepository = {
  async getAllReferences() {
    const references = await prisma.referenceLink.findMany({ orderBy: { title: "asc" } });
    return references.map(toReferenceLink);
  },
  async getReferencesByTopicId(topicId) {
    const references = await prisma.referenceLink.findMany({ where: { topicId } });
    return references.map(toReferenceLink);
  },
  async getPrimaryReferencesByTopicId(topicId) {
    const references = await prisma.referenceLink.findMany({ where: { topicId, priority: "primary" } });
    return references.map(toReferenceLink);
  }
};
