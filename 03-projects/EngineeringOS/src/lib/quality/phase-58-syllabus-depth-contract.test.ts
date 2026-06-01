import { describe, expect, it } from "vitest";
import { algorithmAdvancedTopics, algorithmFoundationTopics, algorithmTreeGraphTopics } from "@/data/syllabus/algorithm-topics";
import { roleLearningRoadmaps } from "@/data/syllabus/role-learning-roadmaps";
import { syllabusService } from "@/lib/services/syllabus-service";

const algorithmTopics = [...algorithmFoundationTopics, ...algorithmTreeGraphTopics, ...algorithmAdvancedTopics];

describe("Phase 58 syllabus depth contract", () => {
  it("keeps every rendered topic at the minimum learning contract depth", () => {
    const domains = syllabusService.getDomains();
    const topics = domains.flatMap((domain) => domain.modules.flatMap((module) => module.topics));

    for (const topic of topics) {
      expect(topic.definition.length, `${topic.slug} definition`).toBeGreaterThan(20);
      expect(topic.mentalModel.length, `${topic.slug} mental model`).toBeGreaterThan(20);
      expect(topic.theory.length, `${topic.slug} theory`).toBeGreaterThan(40);
      expect(topic.practiceProblems.length, `${topic.slug} practice`).toBeGreaterThanOrEqual(8);
      expect(topic.interviewQuestions.length, `${topic.slug} interview questions`).toBeGreaterThanOrEqual(8);
      expect(topic.reviewPrompts.length, `${topic.slug} review prompts`).toBeGreaterThanOrEqual(1);
      expect(topic.references.length, `${topic.slug} references`).toBeGreaterThanOrEqual(1);
      expect(topic.commonMistakes.length, `${topic.slug} common mistakes`).toBeGreaterThanOrEqual(3);
      expect(topic.productionUseCases.length, `${topic.slug} production use cases`).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps Algorithms topics source-backed with real pattern problem sets", () => {
    expect(algorithmTopics.length).toBeGreaterThanOrEqual(15);

    for (const topic of algorithmTopics) {
      expect(topic.practiceProblems.length, `${topic.slug} real problem count`).toBeGreaterThanOrEqual(8);
      expect(topic.practiceProblems.some((problem) => problem.id.startsWith("generated-")), `${topic.slug} generated filler`).toBe(false);
      expect(topic.references.map((reference) => reference.title)).toEqual(
        expect.arrayContaining(["NeetCode Roadmap", "LeetCode Problem Set", "The Algorithms JavaScript"])
      );

      for (const problem of topic.practiceProblems) {
        expect(problem.tags, `${topic.slug}/${problem.id} source mapping`).toEqual(
          expect.arrayContaining(["source-neetcode", "source-leetcode"])
        );
      }
    }
  });

  it("keeps rendered DSA domain topics source-mapped for coding interview practice", () => {
    const dsaDomains = syllabusService.getDomains().filter((domain) => ["dsa", "algorithms"].includes(domain.slug));
    const topics = dsaDomains.flatMap((domain) => domain.modules.flatMap((module) => module.topics));

    for (const topic of topics) {
      const sourceMappedProblems = topic.practiceProblems.filter((problem) =>
        problem.tags.includes("source-neetcode") && problem.tags.includes("source-leetcode")
      );

      expect(sourceMappedProblems.length, `${topic.slug} source-mapped practice`).toBeGreaterThanOrEqual(8);
      const referenceTitles = topic.references.map((reference) => reference.title.toLowerCase());
      expect(referenceTitles.some((title) => title.includes("neetcode")), `${topic.slug} neetcode reference`).toBe(true);
      expect(referenceTitles.some((title) => title.includes("leetcode")), `${topic.slug} leetcode reference`).toBe(true);
      expect(referenceTitles.some((title) => title.includes("algorithms")), `${topic.slug} algorithms reference`).toBe(true);
    }
  });

  it("keeps HLD, LLD, Staff/EM, Career, and AI capstone surfaces credible", () => {
    const topics = syllabusService.getDomains().flatMap((domain) => domain.modules.flatMap((module) => module.topics.map((topic) => ({ domain, module, topic }))));

    const hldCaseStudies = topics.filter(({ module }) => module.slug === "hld-case-studies");
    expect(hldCaseStudies.length).toBeGreaterThanOrEqual(6);
    for (const { topic } of hldCaseStudies) {
      expect(`${topic.theory} ${topic.codeExamples.map((example) => example.code).join(" ")}`).toMatch(/AWS|CloudFront|Route 53|ECS|RDS|DynamoDB|SQS|Lambda|Step Functions/i);
      expect(topic.reviewPrompts[0]?.rubric.join(" ")).toMatch(/AWS|Scale|Trade|Failure|Cost|security/i);
    }

    const lldMachineCoding = topics.filter(({ module }) => module.slug === "lld-machine-coding");
    expect(lldMachineCoding.map(({ topic }) => topic.slug)).toEqual(
      expect.arrayContaining(["parking-lot", "elevator-system", "splitwise-expense-sharing", "rate-limiter-lld", "cache-lld", "notification-service-lld"])
    );
    for (const { topic } of lldMachineCoding) {
      expect(topic.codeExamples.some((example) => example.language === "typescript")).toBe(true);
      expect(topic.practiceProblems.some((problem) => problem.tags.includes("machine-coding"))).toBe(true);
    }

    const careerTopics = topics.filter(({ domain }) => domain.slug === "career-assets").map(({ topic }) => topic);
    expect(careerTopics.map((topic) => topic.slug)).toEqual(
      expect.arrayContaining(["resume-linkedin-github", "portfolio-proof-of-work", "promotion-packet-star-stories"])
    );

    const aiTopics = topics.filter(({ domain }) => domain.slug === "ai-expansion").map(({ topic }) => topic);
    expect(aiTopics.map((topic) => topic.slug)).toEqual(expect.arrayContaining(["ai-assisted-learning-evaluator"]));
  });

  it("keeps every target role connected to capstone or deliverable topics", () => {
    const roleCapstoneKeywords = ["hld-", "architecture-review", "incident-leadership", "mock-interview", "behavioral", "portfolio", "resume", "system-design-round"];

    for (const role of roleLearningRoadmaps) {
      const joinedSlugs = [...role.topicSlugs, ...role.focus.flatMap((focus) => focus.topicSlugs)];
      expect(
        joinedSlugs.some((slug) => roleCapstoneKeywords.some((keyword) => slug.includes(keyword))),
        `${role.slug} capstone/deliverable coverage`
      ).toBe(true);
    }
  });
});
