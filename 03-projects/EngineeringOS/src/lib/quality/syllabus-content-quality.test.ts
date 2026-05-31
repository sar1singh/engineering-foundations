import { describe, expect, it } from "vitest";
import { syllabusService } from "@/lib/services/syllabus-service";

const highRoiDeepLessonSlugs = [
  "graph-bfs",
  "graph-dfs",
  "topological-sort",
  "dijkstra",
  "union-find",
  "multi-az",
  "backup-dr",
  "hld-payment-system",
  "hld-booking-system",
  "architecture-review",
  "incident-leadership"
] as const;

const missingOrWeakStrategicAreas = [
  {
    label: "Security and Auth",
    keywords: ["security", "auth", "oauth", "jwt", "csrf", "xss", "ssrf", "threat-modeling", "secrets"]
  },
  {
    label: "Performance Engineering",
    keywords: ["performance", "profiling", "load-testing", "observability", "tracing", "metrics", "slo"]
  },
  {
    label: "Interview Operations",
    keywords: ["interviews", "mock-interview", "behavioral", "calibration", "coding-round", "system-design-round"]
  },
  {
    label: "Career Assets",
    keywords: ["career-assets", "resume", "linkedin", "portfolio", "promotion", "proof-of-work"]
  },
  {
    label: "Testing and Quality",
    keywords: ["testing", "quality", "qa", "unit-test", "integration-test", "contract-test"]
  },
  {
    label: "Observability",
    keywords: ["observability", "logging", "metrics", "tracing", "dashboards", "alerts"]
  }
] as const;

describe("syllabus content quality contract", () => {
  it("keeps every rendered topic useful enough to teach, practice, and interview", () => {
    const topics = syllabusService.getDomains().flatMap((domain) => domain.modules.flatMap((module) => module.topics));

    for (const topic of topics) {
      expect(topic.definition.length, `${topic.slug} definition`).toBeGreaterThan(30);
      expect(topic.theory.length, `${topic.slug} theory`).toBeGreaterThan(120);
      expect(topic.mentalModel.length, `${topic.slug} mental model`).toBeGreaterThan(25);
      expect(topic.codeExamples.length, `${topic.slug} code examples`).toBeGreaterThan(0);
      expect(topic.practiceProblems.length, `${topic.slug} practice problems`).toBeGreaterThanOrEqual(8);
      expect(topic.interviewQuestions.length, `${topic.slug} interview questions`).toBeGreaterThanOrEqual(8);
      expect(topic.reviewPrompts.length, `${topic.slug} review prompts`).toBeGreaterThan(0);
      expect(topic.references.length, `${topic.slug} references`).toBeGreaterThan(0);
      expect(topic.commonMistakes.length, `${topic.slug} common mistakes`).toBeGreaterThan(0);
      expect(topic.productionUseCases.length, `${topic.slug} production use cases`).toBeGreaterThan(0);
    }
  });

  it("keeps highest-ROI topics at deep lesson quality", () => {
    for (const slug of highRoiDeepLessonSlugs) {
      const topic = syllabusService.getTopicBySlug(slug);

      expect(topic, `${slug} exists`).not.toBeNull();
      expect(topic?.theory, `${slug} deep lesson`).toContain("Deep lesson:");
      expect(topic?.reviewPrompts.at(-1)?.rubric.length, `${slug} rubric`).toBeGreaterThanOrEqual(4);
    }
  });

  it("covers strategic content areas needed for the stated product ambition", () => {
    const searchableContent = JSON.stringify(syllabusService.getDomains()).toLowerCase();

    for (const area of missingOrWeakStrategicAreas) {
      const hits = area.keywords.filter((keyword) => searchableContent.includes(keyword));
      expect(hits.length, `${area.label} coverage keywords`).toBeGreaterThanOrEqual(4);
    }
  });
});
