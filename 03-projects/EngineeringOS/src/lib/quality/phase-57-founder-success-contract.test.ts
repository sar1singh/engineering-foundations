import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { answerBuilders, crashCourseModes, interviewRounds, sourceGuides, weakAreaRepairs } from "@/data/founder-success-experience";

const projectRoot = process.cwd();

function readProjectFile(relativePath: string) {
  return readFileSync(join(projectRoot, relativePath), "utf8");
}

describe("Phase 57 founder success product contract", () => {
  it("adds the founder-success product surfaces", () => {
    const routes = ["today", "interview-rounds", "sources", "weak-areas", "answer-builders"];

    for (const route of routes) {
      expect(existsSync(join(projectRoot, `src/app/${route}/page.tsx`))).toBe(true);
    }
  });

  it("keeps the new surfaces visible in navigation", () => {
    const sidebar = readProjectFile("src/components/app-shell/Sidebar.tsx");

    expect(sidebar).toContain("Today");
    expect(sidebar).toContain("Interview Rounds");
    expect(sidebar).toContain("Sources");
    expect(sidebar).toContain("Weak Areas");
    expect(sidebar).toContain("Answer Builders");
  });

  it("keeps dark-mode motivational UX as the default shell", () => {
    const layout = readProjectFile("src/app/layout.tsx");
    const css = readProjectFile("src/app/globals.css");

    expect(layout).toContain('data-theme="dark"');
    expect(css).toContain("eo-rise");
    expect(css).toContain("radial-gradient");
    expect(css).toContain("eo-glow-card");
    expect(css).toContain("eo-primary-action");
  });

  it("documents reviewer personas and P0 rule", () => {
    const framework = readProjectFile("docs/PHASE_57_REVIEWER_FRAMEWORK.md");

    expect(framework).toContain("Reviewer 1 - Skeptical User");
    expect(framework).toContain("Reviewer 2 - Domain Expert");
    expect(framework).toContain("Reviewer 3 - Target Audience");
    expect(framework).toContain("P0 Rule");
  });

  it("covers the full Phase 57 learning-product content contract", () => {
    expect(crashCourseModes.map((mode) => mode.id)).toEqual(
      expect.arrayContaining(["30-day-switch", "60-day-product", "90-day-architect", "interview-tomorrow", "weak-foundations"])
    );

    expect(interviewRounds.map((round) => round.title)).toEqual(
      expect.arrayContaining([
        "Recruiter screen",
        "Foundations screen",
        "DSA and algorithms",
        "JavaScript/Node/backend",
        "Database/API round",
        "System design/HLD",
        "LLD/machine coding",
        "AWS/cloud/infra",
        "AI/Agentic AI basics",
        "Behavioral/leadership",
        "EM/Staff/Principal strategy",
        "Hiring manager/final round"
      ])
    );

    for (const round of interviewRounds) {
      expect(round.passThreshold).toBeGreaterThanOrEqual(70);
      expect(round.prompts.length).toBeGreaterThanOrEqual(3);
    }

    for (const guide of sourceGuides) {
      expect(guide.why.length).toBeGreaterThan(20);
      expect(guide.practice.length).toBeGreaterThanOrEqual(3);
    }

    for (const weakArea of weakAreaRepairs) {
      expect(weakArea.fix.length).toBe(3);
      expect(weakArea.confidenceTrend.length).toBeGreaterThan(10);
    }

    expect(answerBuilders.map((builder) => builder.title)).toContain("Incident leadership builder");

    for (const builder of answerBuilders) {
      expect(builder.prompts.length).toBeGreaterThanOrEqual(3);
      expect(builder.rubric.length).toBeGreaterThanOrEqual(3);
      expect(builder.example.length).toBeGreaterThan(30);
    }
  });
});
