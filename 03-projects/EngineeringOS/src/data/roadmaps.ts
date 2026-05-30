import type { Roadmap } from "@/types/roadmap";
import { domains } from "@/data/domains";

export const roadmaps: Roadmap[] = [
  {
    id: "roadmap-engineering-interview-readiness",
    title: "Engineering Interview Readiness Roadmap",
    slug: "engineering-interview-readiness",
    description: "A structured EngineeringOS roadmap for senior engineering learning, practice, and interview readiness.",
    targetRole: ["Senior Engineer", "Lead Engineer", "Staff Engineer", "Solution Architect"],
    targetLevel: ["Senior", "Lead", "Staff"],
    targetCompanyTypes: ["FAANG", "GCC", "Indian Product Companies", "Well-funded Startups"],
    estimatedWeeks: 24,
    domainIds: domains.map((domain) => domain.id),
    isActive: true,
    createdAt: "2026-05-30T00:00:00.000Z",
    updatedAt: "2026-05-30T00:00:00.000Z"
  }
];
