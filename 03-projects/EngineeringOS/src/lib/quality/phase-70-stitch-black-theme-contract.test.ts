import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

function readProjectFile(relativePath: string) {
  return readFileSync(join(projectRoot, relativePath), "utf8");
}

describe("Phase 70 Stitch-backed black theme UX contract", () => {
  it("defines the black cyber-noir product system and reusable surfaces", () => {
    const css = readProjectFile("src/app/globals.css");
    for (const token of ["--blueprint-grid", "--danger", "--success", ".eo-os-rail", ".eo-command-bar", ".eo-blueprint-canvas", ".eo-focus-workspace", ".eo-source-card", ".eo-telemetry-card"]) {
      expect(css).toContain(token);
    }
    expect(css).toContain("#050607");
    expect(css).toContain("#00e5ff");
    expect(css).toContain("#b45cff");
    expect(css).toContain("#ffc400");
  });

  it("uses a minimal OS rail with grouped route matrix instead of a large flat sidebar", () => {
    const sidebar = readProjectFile("src/components/app-shell/Sidebar.tsx");
    expect(sidebar).toContain("primaryNav");
    for (const label of ["Mission", "Blueprint", "Focus", "Sources", "Profile"]) {
      expect(sidebar).toContain(label);
    }
    expect(sidebar).toContain("Route matrix");
    expect(sidebar).toContain("<details");
  });

  it("makes dashboard, graph, topic pages, and practice pages follow Stitch modes", () => {
    expect(readProjectFile("src/app/dashboard/page.tsx")).toContain("MISSION_CONTROL // ACTIVE");
    expect(readProjectFile("src/app/dashboard/page.tsx")).toContain("TODAY&apos;S PROTOCOL");
    expect(readProjectFile("src/app/graph/page.tsx")).toContain("BLUEPRINT_MODULE // ROLE PATH");
    expect(readProjectFile("src/app/graph/page.tsx")).toContain("eo-blueprint-canvas");
    expect(readProjectFile("src/app/syllabus/[topicId]/page.tsx")).toContain("SourceReferencesPanel");
    expect(readProjectFile("src/app/practice/[taskId]/page.tsx")).toContain("DSA_WORKSPACE // FOCUS ENGINE");
    expect(readProjectFile("src/app/practice/[taskId]/page.tsx")).toContain("ARCHITECTURAL_RUBRIC // FOCUS ENGINE");
  });

  it("adds a reusable source references panel for external referral links", () => {
    const panelPath = "src/components/learning/SourceReferencesPanel.tsx";
    expect(existsSync(join(projectRoot, panelPath))).toBe(true);
    const panel = readProjectFile(panelPath);
    for (const label of ["Official docs", "Practice platform", "Roadmap", "GitHub repo", "Video/course", "Article/blog"]) {
      expect(panel).toContain(label);
    }
    expect(panel).toContain("target={source.url.startsWith(\"http\") ? \"_blank\" : undefined}");
  });
});
