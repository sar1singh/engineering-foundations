import { describe, expect, it } from "vitest";
import { roleLearningRoadmaps } from "@/data/syllabus/role-learning-roadmaps";
import { getRoleReadiness } from "@/lib/services/role-readiness-service";
import { syllabusService } from "@/lib/services/syllabus-service";
import type { UserProgress } from "@/types/progress";

const emptyProgress: UserProgress = {
  id: "quality-contract-progress",
  completedTaskIds: [],
  completedTopicIds: [],
  createdAt: "2026-05-31T00:00:00.000Z",
  interviewReadinessPercent: 0,
  lastActiveDate: "2026-05-31",
  readinessScore: 0,
  streakCount: 0,
  updatedAt: "2026-05-31T00:00:00.000Z",
  userId: "quality-contract",
  weakAreas: []
};

const expectedRoleCapabilities: Record<string, string[]> = {
  "backend-senior-engineer": ["javascript", "node", "dsa", "database", "system", "api"],
  "solution-architect": ["aws", "security", "reliability", "performance", "cost", "hld"],
  "staff-principal-engineer": ["architecture", "strategy", "incident", "stakeholder", "roadmap", "tradeoff"],
  "engineering-manager": ["execution", "hiring", "stakeholder", "incident", "calibration", "communication"]
};

describe("role-readiness product contract", () => {
  it("keeps role paths substantial enough for targeted outcomes", () => {
    for (const roadmap of roleLearningRoadmaps) {
      expect(roadmap.topicSlugs.length, `${roadmap.slug} topic count`).toBeGreaterThanOrEqual(12);
      expect(roadmap.focus.length, `${roadmap.slug} focus levels`).toBe(4);
      expect(roadmap.focus.map((focus) => focus.level), `${roadmap.slug} progression`).toEqual(["foundation", "basic", "advanced", "expert"]);
      expect(roadmap.focus.filter((focus) => focus.priority === "core-80-20").length, `${roadmap.slug} 80/20 sections`).toBeGreaterThanOrEqual(2);
    }
  });

  it("keeps every role roadmap linked to real syllabus topics", () => {
    const topics = new Set(
      syllabusService
        .getDomains()
        .flatMap((domain) => domain.modules.flatMap((module) => module.topics.map((topic) => topic.slug)))
    );

    for (const roadmap of roleLearningRoadmaps) {
      for (const slug of roadmap.topicSlugs) {
        expect(topics.has(slug), `${roadmap.slug} missing topic ${slug}`).toBe(true);
      }

      for (const focus of roadmap.focus) {
        for (const slug of focus.topicSlugs) {
          expect(topics.has(slug), `${roadmap.slug}/${focus.level} missing topic ${slug}`).toBe(true);
        }
      }
    }
  });

  it("keeps each target role aligned to its expected capability profile", () => {
    const roleContentBySlug = new Map(
      roleLearningRoadmaps.map((roadmap) => [
        roadmap.slug,
        `${roadmap.title} ${roadmap.audience} ${roadmap.outcome} ${roadmap.topicSlugs.join(" ")} ${roadmap.focus
          .flatMap((focus) => [focus.title, ...focus.topicSlugs])
          .join(" ")}`.toLowerCase()
      ])
    );

    for (const [slug, keywords] of Object.entries(expectedRoleCapabilities)) {
      const roleContent = roleContentBySlug.get(slug) ?? "";
      const hits = keywords.filter((keyword) => roleContent.includes(keyword));

      expect(hits.length, `${slug} capability alignment`).toBeGreaterThanOrEqual(keywords.length);
    }
  });

  it("can generate next-topic readiness actions for every target role", () => {
    const readiness = getRoleReadiness(syllabusService.getDomains(), emptyProgress);

    expect(readiness.map((role) => role.slug)).toEqual(roleLearningRoadmaps.map((role) => role.slug));
    for (const role of readiness) {
      expect(role.nextTopic?.slug, `${role.slug} next topic`).toBeTruthy();
      expect(role.percent, `${role.slug} initial completion`).toBe(0);
    }
  });
});
