export type Roadmap = {
  id: string;
  title: string;
  slug: string;
  description: string;
  targetRole: string[];
  targetLevel: string[];
  targetCompanyTypes: string[];
  estimatedWeeks: number;
  domainIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Domain = {
  id: string;
  roadmapId: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  categoryIds: string[];
};

export type RoadmapTree = {
  roadmap: Roadmap;
  domains: Array<{
    domain: Domain;
    categories: Array<{
      category: import("@/types/category").Category;
      modules: Array<{
        module: import("@/types/category").LearningModule;
        topics: import("@/types/topic").Topic[];
      }>;
    }>;
  }>;
};
