import type { LearningModule } from "@/types/category";
import { categories } from "@/data/categories";

const topicIdsByCategorySlug: Record<string, string[]> = {
  "javascript-foundations-core": [
    "js-fundamentals",
    "js-scope",
    "js-execution-context",
    "js-lexical-environment",
    "js-closures",
    "js-hoisting",
    "js-this-binding",
    "js-prototypes"
  ],
  "advanced-javascript-runtime-core": ["js-event-loop", "js-callbacks", "js-promises", "js-async-await"],
  "node-js-backend-engineering-core": ["node-runtime", "node-event-loop", "node-streams", "node-express-basics"],
  "dsa-and-algorithms-core": ["dsa-arrays", "dsa-strings", "dsa-hash-maps", "dsa-two-pointers"],
  "high-level-system-design-core": ["system-design-caching", "system-design-load-balancing", "system-design-queues"],
  "databases-core": ["db-sql-basics", "db-indexes", "db-transactions"],
  "aws-and-cloud-architecture-core": ["aws-iam", "aws-s3", "aws-sqs"]
};

export const modules: LearningModule[] = categories.map((category) => ({
  id: category.moduleIds[0],
  categoryId: category.id,
  title: `${category.title} Module`,
  slug: `${category.slug}-foundations`,
  description: `Foundation module for ${category.title}.`,
  order: 1,
  topicIds: topicIdsByCategorySlug[category.slug] ?? []
}));
