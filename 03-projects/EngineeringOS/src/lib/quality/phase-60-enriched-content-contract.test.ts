import { describe, expect, it } from "vitest";
import { enrichedTopicContent } from "@/data/content/enriched-content";
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
  "roadmap-sh"
];

const requiredEnrichedSlugs = [
  "hashmap-frequency",
  "graph-bfs",
  "binary-search",
  "dynamic-programming-core",
  "hld-payment-system",
  "hld-booking-system",
  "hld-url-shortener",
  "rate-limiter-lld",
  "cache-lld",
  "multi-az",
  "backup-dr",
  "architecture-review",
  "incident-leadership",
  "resume-linkedin-github",
  "ai-assisted-learning-evaluator"
];

describe("Phase 60 enriched curriculum ingestion contract", () => {
  it("keeps a public source catalog with explicit usage policy", () => {
    expect(sourceCatalog.map((source) => source.id)).toEqual(expect.arrayContaining(requiredSourceIds));

    for (const source of sourceCatalog) {
      expect(source.url, source.id).toMatch(/^https:\/\//);
      expect(source.licenseNote.length, source.id).toBeGreaterThan(20);
      expect(source.usagePolicy.note.length, source.id).toBeGreaterThan(30);
      expect(source.whyUseful.length, source.id).toBeGreaterThan(30);
    }
  });

  it("maps sources across DSA, HLD, LLD, AWS, Staff/EM, Career, and AI topics", () => {
    const mappedTopicSlugs = new Set(sourceTopicMap.flatMap((mapping) => mapping.topicSlugs));

    for (const slug of requiredEnrichedSlugs) {
      expect(mappedTopicSlugs.has(slug), `${slug} source map`).toBe(true);
    }

    expect(sourceTopicMap.some((mapping) => mapping.sourceId === "system-design-primer" && mapping.topicSlugs.includes("hld-payment-system"))).toBe(true);
    expect(sourceTopicMap.some((mapping) => mapping.sourceId === "low-level-design-primer" && mapping.topicSlugs.includes("rate-limiter-lld"))).toBe(true);
    expect(sourceTopicMap.some((mapping) => mapping.sourceId === "roadmap-sh" && mapping.topicSlugs.includes("ai-assisted-learning-evaluator"))).toBe(true);
  });

  it("keeps enriched content visible through the syllabus service", () => {
    for (const slug of requiredEnrichedSlugs) {
      const topic = syllabusService.getTopicBySlug(slug);
      expect(topic, `${slug} topic exists`).not.toBeNull();
      expect(topic?.enrichedContent?.topicSlug, `${slug} enriched content`).toBe(slug);
    }
  });

  it("requires enriched DSA problems to include original statements, approaches, solutions, tests, and narration", () => {
    const dsaContent = enrichedTopicContent.filter((content) => content.enrichedProblems.length > 0);
    expect(dsaContent.length).toBeGreaterThanOrEqual(4);

    for (const content of dsaContent) {
      for (const problem of content.enrichedProblems) {
        expect(problem.sourceRefs.length, problem.id).toBeGreaterThanOrEqual(2);
        expect(problem.originalStatement.length, problem.id).toBeGreaterThan(60);
        expect(problem.hints.length, problem.id).toBeGreaterThanOrEqual(3);
        expect(problem.approach.length, problem.id).toBeGreaterThanOrEqual(4);
        expect(problem.solution, problem.id).toMatch(/export function/);
        expect(problem.complexity.time, problem.id).toMatch(/^O\(/);
        expect(problem.complexity.space, problem.id).toMatch(/^O\(/);
        expect(problem.testCases.length, problem.id).toBeGreaterThanOrEqual(3);
        expect(problem.commonMistakes.length, problem.id).toBeGreaterThanOrEqual(3);
        expect(problem.interviewNarration.length, problem.id).toBeGreaterThan(80);
      }
    }
  });

  it("requires design capstones to include senior-ready review coverage", () => {
    const designContent = enrichedTopicContent.filter((content) => content.designCapstones.length > 0);
    expect(designContent.length).toBeGreaterThanOrEqual(10);

    for (const content of designContent) {
      for (const capstone of content.designCapstones) {
        expect(capstone.prompt.length, capstone.id).toBeGreaterThan(50);
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
});
