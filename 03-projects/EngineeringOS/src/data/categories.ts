import type { Category } from "@/types/category";
import { domains } from "@/data/domains";

export const categories: Category[] = domains.map((domain) => ({
  id: domain.categoryIds[0],
  domainId: domain.id,
  title: `${domain.title} Core`,
  slug: `${domain.slug}-core`,
  description: `Core category for ${domain.title}.`,
  order: 1,
  moduleIds: [`module-${domain.slug}-foundations`]
}));
