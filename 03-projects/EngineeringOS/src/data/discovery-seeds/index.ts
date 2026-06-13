import { awsSeeds } from "./aws-seeds";
import { backendSeeds } from "./backend-seeds";
import { careerSeeds } from "./career-seeds";
import { systemDesignSeeds } from "./system-design-seeds";
import type { DiscoverySeed, DiscoverySeedCategory } from "./system-design-seeds";

export type { DiscoverySeed, DiscoverySeedCategory };

export const discoverySeeds: DiscoverySeed[] = [
  ...systemDesignSeeds,
  ...awsSeeds,
  ...backendSeeds,
  ...careerSeeds,
];

export const discoverySeedCategories: DiscoverySeedCategory[] = [
  "system-design",
  "aws",
  "backend",
  "career",
];

export { awsSeeds, backendSeeds, careerSeeds, systemDesignSeeds };
