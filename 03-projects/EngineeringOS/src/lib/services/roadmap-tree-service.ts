import type { RoadmapRepository } from "@/lib/repositories/roadmap-repository";
import type { RoadmapTree } from "@/types/roadmap";

export class RoadmapTreeService {
  constructor(private readonly roadmapRepository: RoadmapRepository) {}

  async getActiveRoadmapTree(): Promise<RoadmapTree | null> {
    const activeRoadmap = await this.roadmapRepository.getActiveRoadmap();

    if (!activeRoadmap) {
      return null;
    }

    return this.roadmapRepository.getRoadmapTree(activeRoadmap.id);
  }

  async getRoadmapTreeById(roadmapId: string): Promise<RoadmapTree | null> {
    return this.roadmapRepository.getRoadmapTree(roadmapId);
  }
}
