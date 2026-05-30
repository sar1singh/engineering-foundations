import { categories } from "@/data/categories";
import { domains } from "@/data/domains";
import { modules } from "@/data/modules";
import { roadmaps } from "@/data/roadmaps";
import { topics } from "@/data/topics";
import type { RoadmapRepository } from "@/lib/repositories/roadmap-repository";
import type { RoadmapTree } from "@/types/roadmap";

export const mockRoadmapRepository: RoadmapRepository = {
  async getAllRoadmaps() {
    return roadmaps;
  },
  async getActiveRoadmap() {
    return roadmaps.find((roadmap) => roadmap.isActive) ?? null;
  },
  async getRoadmapById(id) {
    return roadmaps.find((roadmap) => roadmap.id === id) ?? null;
  },
  async getRoadmapTree(id) {
    const roadmap = roadmaps.find((item) => item.id === id);

    if (!roadmap) {
      return null;
    }

    const tree: RoadmapTree = {
      roadmap,
      domains: domains
        .filter((domain) => domain.roadmapId === roadmap.id)
        .sort((a, b) => a.order - b.order)
        .map((domain) => ({
          domain,
          categories: categories
            .filter((category) => category.domainId === domain.id)
            .sort((a, b) => a.order - b.order)
            .map((category) => ({
              category,
              modules: modules
                .filter((module) => module.categoryId === category.id)
                .sort((a, b) => a.order - b.order)
                .map((module) => ({
                  module,
                  topics: topics.filter((topic) => topic.moduleId === module.id)
                }))
            }))
        }))
    };

    return tree;
  }
};
