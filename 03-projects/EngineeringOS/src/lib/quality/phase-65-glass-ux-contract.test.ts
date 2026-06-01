import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { guidedCourses } from "@/data/guided-courses";

const projectRoot = process.cwd();

function readProjectFile(relativePath: string) {
  return readFileSync(join(projectRoot, relativePath), "utf8");
}

describe("Phase 65 glassmorphism product UX contract", () => {
  it("defines a reusable glassmorphism design system with readable vibrant tokens", () => {
    const css = readProjectFile("src/app/globals.css");
    for (const token of ["--glass", "--glass-border", "--hero-gradient", ".eo-glass", ".eo-gradient-border", ".eo-input", ".eo-chip"]) {
      expect(css).toContain(token);
    }
    expect(css).toContain("#22d3ee");
    expect(css).toContain("#818cf8");
    expect(css).toContain("#d946ef");
  });

  it("adds guided course data and product pages for courses, profile, and placeholder auth", () => {
    expect(guidedCourses.length).toBeGreaterThanOrEqual(8);
    expect(guidedCourses.map((course) => course.title)).toEqual(
      expect.arrayContaining(["Senior Backend Engineer", "AWS Solution Architect", "DSA/Algorithms Bootcamp", "Interview Crash Course"])
    );
    for (const path of ["src/app/courses/page.tsx", "src/app/profile/page.tsx", "src/app/signin/page.tsx", "src/app/signup/page.tsx"]) {
      expect(existsSync(join(projectRoot, path)), path).toBe(true);
    }
  });

  it("groups navigation by product intent instead of a flat sidebar list", () => {
    const sidebar = readProjectFile("src/components/app-shell/Sidebar.tsx");
    for (const label of ["Mission", "Learn", "Practice", "Resources", "Account"]) {
      expect(sidebar).toContain(label);
    }
    expect(sidebar).toContain("/courses");
    expect(sidebar).toContain("/profile");
  });

  it("keeps syllabus focused with collapsible advanced filters and roadmap-first defaults", () => {
    const syllabus = readProjectFile("src/app/syllabus/page.tsx");
    expect(syllabus).toContain("<details");
    expect(syllabus).toContain("Advanced filters");
    expect(syllabus).toContain('view = "cards"');
    expect(syllabus).toContain("Browse guided courses");
  });

  it("adds visual graph, topic continuations, dashboard charts, and runner states", () => {
    expect(readProjectFile("src/app/graph/page.tsx")).toContain("Visual learning graph");
    expect(readProjectFile("src/app/syllabus/[topicId]/page.tsx")).toContain("Continue learning");
    expect(readProjectFile("src/components/dashboard/MissionReadinessChart.tsx")).toContain("RadarChart");
    expect(readProjectFile("src/components/practice/LocalCodeRunner.tsx")).toContain("runnerState");
    expect(readProjectFile("src/components/practice/LocalCodeRunner.tsx")).toContain("passed");
    expect(readProjectFile("src/components/practice/LocalCodeRunner.tsx")).toContain("blocked");
  });
});
