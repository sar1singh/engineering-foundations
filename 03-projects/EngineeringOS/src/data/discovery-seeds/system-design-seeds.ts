import type { ContentSourceType } from "@/types/content-ingestion";

export type DiscoverySeedCategory = "system-design" | "aws" | "backend" | "career";

export type DiscoverySeed = {
  id: string;
  title: string;
  url: string;
  sourceType: ContentSourceType;
  category: DiscoverySeedCategory;
  tags: string[];
  proposedSourceId?: string;
  proposedTopicId?: string;
};

export const systemDesignSeeds: DiscoverySeed[] = [
  {
    id: "seed-system-design-ddd-aggregate-design",
    title: "Aggregate Design Canvas",
    url: "https://github.com/ddd-crew/aggregate-design-canvas",
    sourceType: "github-repository",
    category: "system-design",
    tags: ["ddd", "aggregates", "architecture"],
    proposedSourceId: "ddd-aggregate-design-canvas",
    proposedTopicId: "topic-ddd-aggregate-design",
  },
  {
    id: "seed-system-design-microservices-patterns",
    title: "Microservices Patterns",
    url: "https://microservices.io/patterns/index.html",
    sourceType: "engineering-blog",
    category: "system-design",
    tags: ["microservices", "patterns", "distributed-systems"],
    proposedSourceId: "microservices-patterns",
    proposedTopicId: "topic-microservices-patterns",
  },
  {
    id: "seed-system-design-architecture-decision-records",
    title: "Architecture Decision Records",
    url: "https://adr.github.io/",
    sourceType: "official-docs",
    category: "system-design",
    tags: ["adr", "architecture-review", "documentation"],
    proposedSourceId: "architecture-decision-records",
    proposedTopicId: "topic-architecture-decision-records",
  },
  {
    id: "seed-system-design-data-intensive-applications",
    title: "Designing Data-Intensive Applications",
    url: "https://dataintensive.net/",
    sourceType: "book",
    category: "system-design",
    tags: ["databases", "replication", "consistency"],
    proposedSourceId: "designing-data-intensive-apps",
    proposedTopicId: "topic-designing-data-intensive-apps",
  },
  {
    id: "seed-system-design-scalability-lessons",
    title: "Scalability for Startups",
    url: "https://www.allthingsdistributed.com/",
    sourceType: "engineering-blog",
    category: "system-design",
    tags: ["scalability", "tradeoffs", "architecture"],
    proposedSourceId: "allthingsdistributed-blog",
    proposedTopicId: "topic-scalability-startups",
  },
  {
    id: "seed-system-design-high-availability",
    title: "High Availability Architecture Patterns",
    url: "https://learn.microsoft.com/en-us/azure/architecture/framework/resiliency/overview",
    sourceType: "official-docs",
    category: "system-design",
    tags: ["availability", "resilience", "failure-modes"],
    proposedSourceId: "azure-ha-architecture-patterns",
    proposedTopicId: "topic-high-availability-architecture",
  },
  {
    id: "seed-system-design-api-guidelines",
    title: "Microsoft REST API Guidelines",
    url: "https://github.com/microsoft/api-guidelines",
    sourceType: "github-repository",
    category: "system-design",
    tags: ["api-design", "contracts", "rest"],
    proposedSourceId: "microsoft-api-guidelines",
    proposedTopicId: "topic-api-guidelines",
  },
  {
    id: "seed-system-design-queue-patterns",
    title: "Enterprise Integration Patterns",
    url: "https://www.enterpriseintegrationpatterns.com/patterns/messaging/",
    sourceType: "book",
    category: "system-design",
    tags: ["queues", "messaging", "integration"],
    proposedSourceId: "enterprise-integration-patterns",
    proposedTopicId: "topic-enterprise-integration-patterns",
  },
  {
    id: "seed-system-design-reliability-patterns",
    title: "Release It Patterns",
    url: "https://pragprog.com/titles/mnee2/release-it-second-edition/",
    sourceType: "book",
    category: "system-design",
    tags: ["reliability", "bulkheads", "circuit-breaker"],
    proposedSourceId: "release-it-book",
    proposedTopicId: "topic-release-it-patterns",
  },
  {
    id: "seed-system-design-load-balancing",
    title: "Load Balancing Algorithms",
    url: "https://www.nginx.com/resources/glossary/load-balancing/",
    sourceType: "engineering-blog",
    category: "system-design",
    tags: ["load-balancing", "traffic", "nginx"],
    proposedSourceId: "nginx-load-balancing",
    proposedTopicId: "topic-load-balancing-algorithms",
  },
];
