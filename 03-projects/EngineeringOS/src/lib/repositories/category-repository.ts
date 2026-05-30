import type { Category, LearningModule } from "@/types/category";

export interface CategoryRepository {
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  getCategoriesByDomainId(domainId: string): Promise<Category[]>;
  getAllModules(): Promise<LearningModule[]>;
  getModuleById(id: string): Promise<LearningModule | null>;
  getModulesByCategoryId(categoryId: string): Promise<LearningModule[]>;
}
