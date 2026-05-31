import { describe, expect, it } from "vitest";
import { syllabusService } from "@/lib/services/syllabus-service";
import { getDomainReadiness, getRoleReadiness } from "@/lib/services/role-readiness-service";
import type { UserProgress } from "@/types/progress";

const baseProgress: UserProgress = {
  id: "progress-test",
  userId: "test-user",
  completedTopicIds: ["syllabus-aws-iam", "syllabus-aws-vpc"],
  completedTaskIds: [],
  weakAreas: [],
  streakCount: 0,
  readinessScore: 0,
  interviewReadinessPercent: 0,
  createdAt: "2026-05-31T00:00:00.000Z",
  updatedAt: "2026-05-31T00:00:00.000Z"
};

describe("role readiness service", () => {
  it("calculates role readiness and next topics from syllabus progress", () => {
    const domains = syllabusService.getDomains();
    const readiness = getRoleReadiness(domains, baseProgress);
    const solutionArchitect = readiness.find((role) => role.slug === "solution-architect");

    expect(solutionArchitect?.total).toBeGreaterThan(10);
    expect(solutionArchitect?.completed).toBe(2);
    expect(solutionArchitect?.nextTopic?.slug).toBeTruthy();
  });

  it("calculates domain readiness percentages", () => {
    const domains = syllabusService.getDomains();
    const readiness = getDomainReadiness(domains, baseProgress);
    const aws = readiness.find((domain) => domain.slug === "aws");

    expect(aws?.total).toBeGreaterThan(8);
    expect(aws?.completed).toBe(2);
    expect(aws?.percent).toBeGreaterThan(0);
  });
});
