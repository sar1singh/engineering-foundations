import { prisma } from "@/lib/db/prisma";
import type { RoadmapRepository } from "@/lib/repositories/roadmap-repository";
import { toRoadmap, toTopic } from "@/lib/repositories/prisma-mappers";
import type { RoadmapTree } from "@/types/roadmap";

export const prismaRoadmapRepository: RoadmapRepository = {
  async getAllRoadmaps() {
    const roadmaps = await prisma.roadmap.findMany({
      include: { domains: true },
      orderBy: { title: "asc" }
    });
    return roadmaps.map(toRoadmap);
  },
  async getActiveRoadmap() {
    const roadmap = await prisma.roadmap.findFirst({
      where: { isActive: true },
      include: { domains: true }
    });
    return roadmap ? toRoadmap(roadmap) : null;
  },
  async getRoadmapById(id) {
    const roadmap = await prisma.roadmap.findUnique({
      where: { id },
      include: { domains: true }
    });
    return roadmap ? toRoadmap(roadmap) : null;
  },
  async getRoadmapTree(id) {
    const roadmap = await prisma.roadmap.findUnique({
      where: { id },
      include: {
        domains: {
          orderBy: { order: "asc" },
          include: {
            categories: {
              orderBy: { order: "asc" },
              include: {
                modules: {
                  orderBy: { order: "asc" },
                  include: {
                    topics: { orderBy: { title: "asc" } }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!roadmap) {
      return null;
    }

    const tree: RoadmapTree = {
      roadmap: toRoadmap(roadmap),
      domains: roadmap.domains.map((domain) => ({
        domain: {
          id: domain.id,
          roadmapId: domain.roadmapId,
          title: domain.title,
          slug: domain.slug,
          description: domain.description,
          order: domain.order,
          categoryIds: domain.categories.map((category) => category.id)
        },
        categories: domain.categories.map((category) => ({
          category: {
            id: category.id,
            domainId: category.domainId,
            title: category.title,
            slug: category.slug,
            description: category.description,
            order: category.order,
            moduleIds: category.modules.map((module) => module.id)
          },
          modules: category.modules.map((module) => ({
            module: {
              id: module.id,
              categoryId: module.categoryId,
              title: module.title,
              slug: module.slug,
              description: module.description,
              order: module.order,
              topicIds: module.topics.map((topic) => topic.id)
            },
            topics: module.topics.map(toTopic)
          }))
        }))
      }))
    };

    return tree;
  }
};
