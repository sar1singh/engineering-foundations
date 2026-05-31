import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

function readProjectFile(relativePath: string) {
  return readFileSync(join(projectRoot, relativePath), "utf8");
}

describe("product UX contract", () => {
  it("keeps the dashboard focused on readiness, weak areas, and today's learning action", () => {
    const dashboardPage = readProjectFile("src/app/dashboard/page.tsx");

    expect(dashboardPage).toContain("Role readiness");
    expect(dashboardPage).toContain("Domain readiness");
    expect(dashboardPage).toContain("Start today's lesson");
    expect(dashboardPage).toContain("Weak areas");
    expect(dashboardPage).toContain("readinessScore");
  });

  it("keeps syllabus browsing useful for product-level learning operations", () => {
    const syllabusPage = readProjectFile("src/app/syllabus/page.tsx");

    expect(syllabusPage).toContain("Role roadmap filters");
    expect(syllabusPage).toContain("80/20 Core");
    expect(syllabusPage).toContain("Search topics");
    expect(syllabusPage).toContain("Cards");
    expect(syllabusPage).toContain("Table");
    expect(syllabusPage).toContain("domain");
    expect(syllabusPage).toContain("difficulty");
    expect(syllabusPage).toContain("source");
    expect(syllabusPage).toContain("frequency");
  });

  it("keeps syllabus topic pages capable of learning, practice, assessment, and revision", () => {
    const topicPage = readProjectFile("src/app/syllabus/[topicId]/page.tsx");

    expect(topicPage).toContain("Theory and mental model");
    expect(topicPage).toContain("Working code example");
    expect(topicPage).toContain("PracticePanel");
    expect(topicPage).toContain("Interview questions");
    expect(topicPage).toContain("Revision prompts");
    expect(topicPage).toContain("Rubric-based review");
    expect(topicPage).toContain("Mock interview mode");
    expect(topicPage).toContain("Saved responses");
    expect(topicPage).toContain("References");
  });

  it("keeps strategic product surfaces available in navigation", () => {
    const sidebar = readProjectFile("src/components/app-shell/Sidebar.tsx");

    expect(sidebar).toContain("Dashboard");
    expect(sidebar).toContain("Graph");
    expect(sidebar).toContain("Syllabus");
    expect(sidebar).toContain("Progress");
    expect(sidebar).toContain("Content");
    expect(sidebar).toContain("Settings");
  });
});
