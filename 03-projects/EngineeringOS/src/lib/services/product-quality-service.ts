import { roleLearningRoadmaps } from "@/data/syllabus/role-learning-roadmaps";
import { syllabusService } from "@/lib/services/syllabus-service";

const requiredRouterDomains = [
  "foundations",
  "javascript",
  "nodejs",
  "dsa",
  "databases",
  "system-design",
  "lld",
  "tradeoffs",
  "aws",
  "security",
  "performance",
  "case-studies",
  "senior-skills",
  "interviews",
  "career-assets",
  "ai-expansion"
];

const strategicAreas = [
  { label: "Security and Auth", keywords: ["security", "auth", "oauth", "jwt", "csrf", "xss", "ssrf", "threat-modeling", "secrets"] },
  { label: "Performance Engineering", keywords: ["performance", "profiling", "load-testing", "observability", "tracing", "metrics", "slo"] },
  { label: "Interview Operations", keywords: ["interviews", "mock-interview", "behavioral", "calibration", "coding-round", "system-design-round"] },
  { label: "Career Assets", keywords: ["career-assets", "resume", "linkedin", "portfolio", "promotion", "proof-of-work"] },
  { label: "Testing and Quality", keywords: ["testing", "quality", "qa", "unit-test", "integration-test", "contract-test"] },
  { label: "Observability", keywords: ["observability", "logging", "metrics", "tracing", "dashboards", "alerts"] }
];

export type ProductQualityStatus = {
  coveragePercent: number;
  missingRouterDomains: string[];
  thinRolePaths: Array<{ slug: string; title: string; topicCount: number }>;
  shallowTopics: Array<{ slug: string; title: string; issue: string }>;
  strategicAreas: Array<{ label: string; hits: number; required: number; status: "pass" | "watch" }>;
  totals: {
    domains: number;
    topics: number;
    roleRoadmaps: number;
  };
};

export function getProductQualityStatus(): ProductQualityStatus {
  const domains = syllabusService.getDomains();
  const allTopics = domains.flatMap((domain) => domain.modules.flatMap((module) => module.topics));
  const domainSlugs = new Set(domains.map((domain) => domain.slug));
  const searchableContent = JSON.stringify(domains).toLowerCase();
  const missingRouterDomains = requiredRouterDomains.filter((slug) => !domainSlugs.has(slug));
  const thinRolePaths = roleLearningRoadmaps
    .filter((roadmap) => roadmap.topicSlugs.length < 12)
    .map((roadmap) => ({ slug: roadmap.slug, title: roadmap.title, topicCount: roadmap.topicSlugs.length }));
  const shallowTopics = allTopics
    .flatMap((topic) => {
      const issues = [];
      if (topic.theory.length <= 120) issues.push("short theory");
      if (topic.mentalModel.length <= 25) issues.push("short mental model");
      if (topic.practiceProblems.length < 8) issues.push("too few problems");
      if (topic.interviewQuestions.length < 8) issues.push("too few interview questions");
      if (topic.references.length === 0) issues.push("missing references");
      return issues.map((issue) => ({ slug: topic.slug, title: topic.title, issue }));
    })
    .slice(0, 12);
  const areaStatuses = strategicAreas.map((area) => {
    const hits = area.keywords.filter((keyword) => searchableContent.includes(keyword)).length;
    return { label: area.label, hits, required: 4, status: hits >= 4 ? ("pass" as const) : ("watch" as const) };
  });
  const passedChecks =
    (missingRouterDomains.length === 0 ? 1 : 0) +
    (thinRolePaths.length === 0 ? 1 : 0) +
    (shallowTopics.length === 0 ? 1 : 0) +
    areaStatuses.filter((area) => area.status === "pass").length;
  const totalChecks = 3 + areaStatuses.length;

  return {
    coveragePercent: Math.round((passedChecks / totalChecks) * 100),
    missingRouterDomains,
    thinRolePaths,
    shallowTopics,
    strategicAreas: areaStatuses,
    totals: {
      domains: domains.length,
      topics: allTopics.length,
      roleRoadmaps: roleLearningRoadmaps.length
    }
  };
}
