import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { practiceTasks } from "@/data/practice-tasks";
import { syllabusService } from "@/lib/services/syllabus-service";

const projectRoot = process.cwd();

function readProjectFile(relativePath: string) {
  return readFileSync(join(projectRoot, relativePath), "utf8");
}

describe("Phase 64 backend-separation UX and product-readiness contract", () => {
  it("keeps API routes typed, documented, and isolated from raw mock data imports", () => {
    const routes = [
      "src/app/api/learner/profile/route.ts",
      "src/app/api/progress/summary/route.ts",
      "src/app/api/readiness/route.ts",
      "src/app/api/quality/status/route.ts"
    ];

    for (const route of routes) {
      const source = readProjectFile(route);
      expect(existsSync(join(projectRoot, route)), route).toBe(true);
      expect(source, route).toContain("NextResponse.json");
      expect(source, route).toContain("withApiLogging");
      expect(source, route).not.toMatch(/@\/data\//);
    }

    const contracts = readProjectFile("src/lib/api-contracts/learning-api.ts");
    expect(contracts).toContain("LearnerProfileResponse");
    expect(contracts).toContain("LearnerProfileUpdateRequest");
    expect(contracts).toContain("ProgressSummaryResponse");
    expect(contracts).toContain("ReadinessResponse");
    expect(contracts).toContain("QualityStatusResponse");
  });

  it("adopts API client on visible learner, progress, readiness, and quality surfaces", () => {
    expect(readProjectFile("src/components/dashboard/ApiReadinessStrip.tsx")).toContain("learningApiClient.getReadiness");
    expect(readProjectFile("src/components/dashboard/ApiReadinessStrip.tsx")).toContain("learningApiClient.getQualityStatus");
    expect(readProjectFile("src/components/dashboard/ApiProgressSummaryCard.tsx")).toContain("learningApiClient.getProgressSummary");
    expect(readProjectFile("src/components/onboarding/ApiLearnerProfileStatus.tsx")).toContain("learningApiClient.getLearnerProfile");
    expect(readProjectFile("src/app/dashboard/page.tsx")).toContain("ApiProgressSummaryCard");
    expect(readProjectFile("src/app/onboarding/page.tsx")).toContain("ApiLearnerProfileStatus");
  });

  it("adds stronger syllabus filters for action-oriented founder learning", () => {
    const syllabusPage = readProjectFile("src/app/syllabus/page.tsx");
    expect(syllabusPage).toContain("Runnable practice");
    expect(syllabusPage).toContain("Design capstones");
    expect(syllabusPage).toContain("Hands-on labs");
    expect(syllabusPage).toContain("Quick <=75m");
    expect(syllabusPage).toContain("content === \"runnable\"");
    expect(syllabusPage).toContain("content === \"capstones\"");
  });

  it("expands runnable DSA practice and keeps harnesses visible", () => {
    const runnableTasks = practiceTasks.filter((task) => task.slug.startsWith("runnable-"));
    expect(runnableTasks.length).toBeGreaterThanOrEqual(8);
    expect(new Set(runnableTasks.map((task) => task.sourceProblemId)).size).toBe(runnableTasks.length);
    for (const task of runnableTasks) {
      expect(task.testHarness, task.slug).toContain("console.assert");
      expect(task.starterCode, task.slug).toContain("Implement your solution here");
    }
  });

  it("adds lab completion UX and founder outcome metrics", () => {
    const topicPage = readProjectFile("src/app/syllabus/[topicId]/page.tsx");
    const labControls = readProjectFile("src/components/labs/LabCompletionControls.tsx");
    const dashboard = readProjectFile("src/app/dashboard/page.tsx");
    const topics = syllabusService.getDomains().flatMap((domain) => domain.modules.flatMap((module) => module.topics));

    expect(topicPage).toContain("LabCompletionControls");
    expect(labControls).toContain("Mark lab complete");
    expect(labControls).toContain("Copy IaC");
    expect(dashboard).toContain("Founder outcome metrics");
    expect(topics.some((topic) => (topic.enrichedContent?.handsOnLabs?.length ?? 0) > 0)).toBe(true);
    expect(topics.some((topic) => (topic.enrichedContent?.designCapstones.length ?? 0) > 0)).toBe(true);
  });
});
