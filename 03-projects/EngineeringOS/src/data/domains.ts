import type { Domain } from "@/types/roadmap";

const domainNames = [
  "JavaScript Foundations",
  "Advanced JavaScript Runtime",
  "Node.js Backend Engineering",
  "DSA and Algorithms",
  "Low-Level Design",
  "High-Level System Design",
  "Distributed Systems",
  "Databases",
  "Caching",
  "Messaging and Queues",
  "API Design",
  "Security and Auth",
  "AWS and Cloud Architecture",
  "Observability",
  "Testing and Quality",
  "Interview Preparation",
  "Content Creation / Proof-of-Work",
  "Career Execution"
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const domains: Domain[] = domainNames.map((title, index) => {
  const slug = slugify(title);

  return {
    id: `domain-${slug}`,
    roadmapId: "roadmap-engineering-interview-readiness",
    title,
    slug,
    description: `${title} topics for the EngineeringOS roadmap.`,
    order: index + 1,
    categoryIds: [`category-${slug}-core`]
  };
});
