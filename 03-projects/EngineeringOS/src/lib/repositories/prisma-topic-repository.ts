import { prisma } from "@/lib/db/prisma";
import type { TopicRepository } from "@/lib/repositories/topic-repository";
import { toTopic } from "@/lib/repositories/prisma-mappers";

export const prismaTopicRepository: TopicRepository = {
  async getAllTopics() {
    const topics = await prisma.topic.findMany({ orderBy: { title: "asc" } });
    return topics.map(toTopic);
  },
  async getTopicById(id) {
    const topic = await prisma.topic.findUnique({ where: { id } });
    return topic ? toTopic(topic) : null;
  },
  async getTopicBySlug(slug) {
    const topic = await prisma.topic.findFirst({ where: { OR: [{ slug }, { id: slug }] } });
    return topic ? toTopic(topic) : null;
  },
  async getTopicsByModuleId(moduleId) {
    const topics = await prisma.topic.findMany({ where: { moduleId }, orderBy: { title: "asc" } });
    return topics.map(toTopic);
  },
  async searchTopics(query) {
    const normalized = query.trim();
    const topics = await prisma.topic.findMany({
      where: normalized
        ? {
            OR: [
              { title: { contains: normalized } },
              { slug: { contains: normalized } },
              { summary: { contains: normalized } },
              { tags: { contains: normalized } }
            ]
          }
        : undefined,
      orderBy: { title: "asc" }
    });
    return topics.map(toTopic);
  }
};
