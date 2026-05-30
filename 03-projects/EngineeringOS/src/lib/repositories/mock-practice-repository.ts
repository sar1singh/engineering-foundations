import { practiceTasks } from "@/data/practice-tasks";
import type { PracticeRepository } from "@/lib/repositories/practice-repository";

export const mockPracticeRepository: PracticeRepository = {
  async getAllTasks() {
    return practiceTasks;
  },
  async getTaskById(id) {
    return practiceTasks.find((task) => task.id === id) ?? null;
  },
  async getTaskBySlug(slug) {
    return practiceTasks.find((task) => task.slug === slug || task.id === slug) ?? null;
  },
  async getTasksByTopicId(topicId) {
    return practiceTasks.filter((task) => task.topicId === topicId);
  },
  async getTasksBySubtopicId(subtopicId) {
    return practiceTasks.filter((task) => task.subtopicId === subtopicId);
  }
};
