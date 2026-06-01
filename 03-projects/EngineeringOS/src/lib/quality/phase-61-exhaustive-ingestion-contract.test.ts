import { describe, expect, it } from "vitest";
import { enrichedTopicContent, enrichedTopicContentBySlug } from "@/data/content/enriched-content";
import { sourceCatalog } from "@/data/content/source-catalog";
import { sourceTopicMap } from "@/data/content/source-topic-map";
import { syllabusService } from "@/lib/services/syllabus-service";

const requiredSourceIds = [
  "tech-interview-handbook",
  "coding-interview-university",
  "system-design-primer",
  "the-algorithms-javascript",
  "neetcode-roadmap",
  "leetcode-problemset",
  "checkcheckzz-system-design-interview",
  "awesome-scalability",
  "awesome-system-design-resources",
  "low-level-design-primer",
  "roadmap-sh",
  "aws-docs",
  "aws-well-architected-framework",
  "aws-architecture-center"
];

const visibleHighRoiSlugs = [
  "hashmap-frequency",
  "linear-search",
  "binary-search",
  "sorting",
  "tree-dfs",
  "tree-bfs",
  "graph-dfs",
  "graph-bfs",
  "topological-sort",
  "dijkstra",
  "union-find",
  "recursion-backtracking",
  "dynamic-programming-core",
  "intervals",
  "bit-manipulation",
  "hld-url-shortener",
  "hld-chat-system",
  "hld-feed-system",
  "hld-booking-system",
  "hld-payment-system",
  "hld-notification-system",
  "hld-search-autocomplete",
  "hld-file-storage",
  "hld-metrics-observability",
  "hld-ecommerce-checkout",
  "parking-lot",
  "elevator-system",
  "splitwise-expense-sharing",
  "rate-limiter-lld",
  "cache-lld",
  "notification-service-lld",
  "vpc",
  "iam",
  "route-53",
  "cloudfront",
  "api-gateway",
  "step-functions",
  "ecs-eks",
  "multi-az",
  "autoscaling",
  "elasticache",
  "kms",
  "cloudtrail",
  "backup-dr",
  "cost-optimization",
  "architecture-review",
  "technical-strategy",
  "incident-leadership",
  "roadmap-execution",
  "hiring-interview-calibration",
  "stakeholder-communication",
  "resume-linkedin-github",
  "ai-assisted-learning-evaluator"
];

const dsaSlugs = [
  "hashmap-frequency",
  "linear-search",
  "binary-search",
  "sorting",
  "tree-dfs",
  "tree-bfs",
  "graph-dfs",
  "graph-bfs",
  "topological-sort",
  "dijkstra",
  "union-find",
  "recursion-backtracking",
  "dynamic-programming-core",
  "intervals",
  "bit-manipulation"
];

const designSlugs = visibleHighRoiSlugs.filter((slug) => !dsaSlugs.includes(slug));

describe("Phase 61 exhaustive ingestion contract", () => {
  it("keeps required source catalog entries and maps every high-ROI slug", () => {
    expect(sourceCatalog.map((source) => source.id)).toEqual(expect.arrayContaining(requiredSourceIds));

    const mappedSlugs = new Set(sourceTopicMap.flatMap((mapping) => mapping.topicSlugs));
    for (const slug of visibleHighRoiSlugs) {
      expect(mappedSlugs.has(slug), `${slug} source mapping`).toBe(true);
    }
  });

  it("makes high-ROI enriched topics visible through the syllabus service", () => {
    for (const slug of visibleHighRoiSlugs) {
      const topic = syllabusService.getTopicBySlug(slug);
      expect(topic, `${slug} syllabus topic`).not.toBeNull();
      expect(topic?.enrichedContent?.topicSlug, `${slug} enriched content`).toBe(slug);
    }
  });

  it("keeps DSA enriched problems solution-ready", () => {
    for (const slug of dsaSlugs) {
      const content = enrichedTopicContentBySlug[slug];
      expect(content?.enrichedProblems.length, `${slug} enriched problems`).toBeGreaterThanOrEqual(1);

      for (const problem of content.enrichedProblems) {
        expect(problem.sourceRefs.length, problem.id).toBeGreaterThanOrEqual(2);
        expect(problem.originalStatement.length, problem.id).toBeGreaterThan(50);
        expect(problem.hints.length, problem.id).toBeGreaterThanOrEqual(3);
        expect(problem.approach.length, problem.id).toBeGreaterThanOrEqual(4);
        expect(problem.solution, problem.id).toMatch(/export function|class /);
        expect(problem.complexity.time, problem.id).toMatch(/^O\(/);
        expect(problem.complexity.space, problem.id).toMatch(/^O\(/);
        expect(problem.testCases.length, problem.id).toBeGreaterThanOrEqual(3);
        expect(problem.commonMistakes.length, problem.id).toBeGreaterThanOrEqual(3);
        expect(problem.interviewNarration.length, problem.id).toBeGreaterThan(80);
      }
    }
  });

  it("keeps HLD, LLD, AWS, Staff/EM, Career, and AI capstones senior-review-ready", () => {
    for (const slug of designSlugs) {
      const content = enrichedTopicContentBySlug[slug];
      expect(content?.designCapstones.length, `${slug} capstones`).toBeGreaterThanOrEqual(1);

      for (const capstone of content.designCapstones) {
        expect(capstone.sourceRefs.length, capstone.id).toBeGreaterThanOrEqual(2);
        expect(capstone.requirements.length, capstone.id).toBeGreaterThanOrEqual(4);
        expect(capstone.approach.length, capstone.id).toBeGreaterThanOrEqual(4);
        expect(capstone.designBreakdown.length, capstone.id).toBeGreaterThanOrEqual(4);
        expect(capstone.tradeoffs.length, capstone.id).toBeGreaterThanOrEqual(3);
        expect(capstone.failureModes.length, capstone.id).toBeGreaterThanOrEqual(3);
        expect(capstone.security.length, capstone.id).toBeGreaterThanOrEqual(3);
        expect(capstone.observability.length, capstone.id).toBeGreaterThanOrEqual(3);
        expect(capstone.rubric.length, capstone.id).toBeGreaterThanOrEqual(4);
        expect(capstone.expectedSeniorSignals.length, capstone.id).toBeGreaterThanOrEqual(4);
      }
    }
  });

  it("keeps AWS-first and includes AI safety/eval/cost/latency coverage", () => {
    const allText = JSON.stringify(enrichedTopicContent).toLowerCase();
    expect(allText).not.toContain("azure");
    expect(allText).toContain("eval");
    expect(allText).toContain("guardrail");
    expect(allText).toContain("cost");
    expect(allText).toContain("latency");
    expect(allText).toContain("rag");
    expect(allText).toContain("tool");
  });
});
