import { describe, expect, it } from "vitest";
import { enrichedTopicContentBySlug } from "@/data/content/enriched-content";
import { syllabusService } from "@/lib/services/syllabus-service";

const newlyVisibleLldSlugs = [
  "workflow-engine-lld",
  "pub-sub-lld",
  "task-scheduler-lld",
  "feature-flag-service-lld",
  "logger-lld",
  "inventory-order-system-lld"
];

const newlyVisibleHldSlugs = ["hld-ride-sharing", "hld-video-streaming", "hld-distributed-rate-limiter"];

describe("Phase 62 gap closure contract", () => {
  it("makes enriched-only LLD and AI slugs visible as syllabus pages", () => {
    for (const slug of [...newlyVisibleLldSlugs, "agentic-ai-foundations"]) {
      const topic = syllabusService.getTopicBySlug(slug);
      expect(topic, `${slug} syllabus topic`).not.toBeNull();
      expect(topic?.enrichedContent?.topicSlug, `${slug} enriched content`).toBe(slug);
    }
  });

  it("adds the missing high-ROI HLD capstones as visible syllabus pages", () => {
    for (const slug of newlyVisibleHldSlugs) {
      const topic = syllabusService.getTopicBySlug(slug);
      expect(topic, `${slug} syllabus topic`).not.toBeNull();
      expect(topic?.enrichedContent?.designCapstones.length, `${slug} capstone`).toBeGreaterThanOrEqual(1);
      expect(topic?.enrichedContent?.designCapstones[0]?.awsVariant?.length, `${slug} AWS variant`).toBeGreaterThanOrEqual(4);
    }
  });

  it("adds AWS hands-on labs with IaC snippets, validation, cleanup, and safety notes", () => {
    for (const slug of ["vpc", "ecs-eks", "backup-dr"]) {
      const labs = enrichedTopicContentBySlug[slug]?.handsOnLabs ?? [];
      expect(labs.length, `${slug} labs`).toBeGreaterThanOrEqual(1);
      for (const lab of labs) {
        expect(lab.sourceRefs.length, lab.id).toBeGreaterThanOrEqual(2);
        expect(lab.steps.length, lab.id).toBeGreaterThanOrEqual(4);
        expect(lab.iacSnippet.length, lab.id).toBeGreaterThan(80);
        expect(lab.validation.length, lab.id).toBeGreaterThanOrEqual(3);
        expect(lab.cleanup.length, lab.id).toBeGreaterThanOrEqual(2);
        expect(lab.safetyNotes.join(" "), lab.id).toMatch(/sandbox|cost|production|secret/i);
      }
    }
  });
});
