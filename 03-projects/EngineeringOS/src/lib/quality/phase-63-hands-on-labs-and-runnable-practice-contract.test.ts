import { describe, expect, it } from "vitest";
import { enrichedTopicContentBySlug } from "@/data/content/enriched-content";
import { practiceTasks } from "@/data/practice-tasks";
import { syllabusService } from "@/lib/services/syllabus-service";

const requestedAwsLabSlugs = ["api-gateway", "step-functions", "route-53", "cloudfront", "ci-cd-blue-green-canary"];

describe("Phase 63 hands-on labs and runnable practice contract", () => {
  it("adds requested AWS hands-on labs as visible syllabus topics", () => {
    for (const slug of requestedAwsLabSlugs) {
      const topic = syllabusService.getTopicBySlug(slug);
      const labs = enrichedTopicContentBySlug[slug]?.handsOnLabs ?? [];

      expect(topic, `${slug} visible topic`).not.toBeNull();
      expect(topic?.enrichedContent?.topicSlug, `${slug} enriched content`).toBe(slug);
      expect(labs.length, `${slug} labs`).toBeGreaterThanOrEqual(1);

      for (const lab of labs) {
        expect(lab.steps.length, `${lab.id} steps`).toBeGreaterThanOrEqual(4);
        expect(lab.iacSnippet.length, `${lab.id} IaC snippet`).toBeGreaterThan(80);
        expect(lab.validation.length, `${lab.id} validation`).toBeGreaterThanOrEqual(3);
        expect(lab.cleanup.length, `${lab.id} cleanup`).toBeGreaterThanOrEqual(2);
        expect(lab.safetyNotes.join(" "), `${lab.id} safety`).toMatch(/sandbox|production|secret|rollback/i);
      }
    }
  });

  it("promotes selected enriched DSA problems into runnable practice tasks with visible test harnesses", () => {
    const runnableTasks = practiceTasks.filter((task) => task.slug.startsWith("runnable-"));

    expect(runnableTasks.length).toBeGreaterThanOrEqual(5);
    for (const task of runnableTasks) {
      expect(task.sourceProblemId, task.slug).toMatch(/^enriched-/);
      expect(task.starterCode, task.slug).toContain("export function");
      expect(task.starterCode, task.slug).toContain("Implement your solution here");
      expect(task.testHarness, task.slug).toContain("console.assert");
      expect(task.testHarness, task.slug).toContain("visible harness passed");
      expect(task.completionCriteria.join(" "), task.slug).toMatch(/assertions pass|Complexity/i);
    }
  });
});
