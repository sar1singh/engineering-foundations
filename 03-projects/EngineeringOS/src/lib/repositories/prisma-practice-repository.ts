import { prisma } from "@/lib/db/prisma";
import { toPracticeTask } from "@/lib/repositories/prisma-mappers";
import type { PracticeRepository } from "@/lib/repositories/practice-repository";

export const prismaPracticeRepository: PracticeRepository = {
  async getAllTasks() {
    const tasks = await prisma.practiceTask.findMany({ include: { subtasks: true }, orderBy: { title: "asc" } });
    return tasks.map(toPracticeTask);
  },
  async getTaskById(id) {
    const task = await prisma.practiceTask.findUnique({ where: { id }, include: { subtasks: true } });
    return task ? toPracticeTask(task) : null;
  },
  async getTaskBySlug(slug) {
    const task = await prisma.practiceTask.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: { subtasks: true }
    });
    return task ? toPracticeTask(task) : null;
  },
  async getTasksByTopicId(topicId) {
    const tasks = await prisma.practiceTask.findMany({ where: { topicId }, include: { subtasks: true } });
    return tasks.map(toPracticeTask);
  },
  async getTasksBySubtopicId(subtopicId) {
    const tasks = await prisma.practiceTask.findMany({ where: { subtopicId }, include: { subtasks: true } });
    return tasks.map(toPracticeTask);
  }
};
