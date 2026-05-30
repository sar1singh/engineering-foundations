import { prisma } from "@/lib/db/prisma";
import { parseJson } from "@/lib/repositories/prisma-mappers";
import type { SubtopicRepository } from "@/lib/repositories/subtopic-repository";
import type { CodeExample } from "@/types/topic";

function toSubtopic(record: Awaited<ReturnType<typeof prisma.subtopic.findMany>>[number]) {
  return {
    id: record.id,
    topicId: record.topicId,
    title: record.title,
    slug: record.slug,
    summary: record.summary,
    order: record.order,
    theory: record.theory,
    examples: parseJson<CodeExample[]>(record.examples, []),
    practiceTaskIds: [],
    completionCriteria: parseJson<string[]>(record.completionCriteria, [])
  };
}

export const prismaSubtopicRepository: SubtopicRepository = {
  async getAllSubtopics() {
    const subtopics = await prisma.subtopic.findMany({ orderBy: { order: "asc" } });
    return subtopics.map(toSubtopic);
  },
  async getSubtopicById(id) {
    const subtopic = await prisma.subtopic.findUnique({ where: { id } });
    return subtopic ? toSubtopic(subtopic) : null;
  },
  async getSubtopicsByTopicId(topicId) {
    const subtopics = await prisma.subtopic.findMany({ where: { topicId }, orderBy: { order: "asc" } });
    return subtopics.map(toSubtopic);
  }
};
