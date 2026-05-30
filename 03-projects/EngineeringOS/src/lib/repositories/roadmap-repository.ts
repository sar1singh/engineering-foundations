import type { Roadmap, RoadmapTree } from "@/types/roadmap";

export interface RoadmapRepository {
  getAllRoadmaps(): Promise<Roadmap[]>;
  getActiveRoadmap(): Promise<Roadmap | null>;
  getRoadmapById(id: string): Promise<Roadmap | null>;
  getRoadmapTree(id: string): Promise<RoadmapTree | null>;
}
