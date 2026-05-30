import { topics } from "@/data/topics";
import type { TopicRepository } from "@/lib/repositories/topic-repository";

export const mockTopicRepository: TopicRepository = {
  async getAllTopics() {
    return topics;
  },
  async getTopicById(id) {
    return topics.find((topic) => topic.id === id) ?? null;
  },
  async getTopicBySlug(slug) {
    return topics.find((topic) => topic.slug === slug || topic.id === slug) ?? null;
  },
  async getTopicsByModuleId(moduleId) {
    return topics.filter((topic) => topic.moduleId === moduleId);
  },
  async searchTopics(query) {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return topics;
    }

    return topics.filter((topic) =>
      [topic.title, topic.slug, topic.summary, ...topic.tags].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    );
  }
};
