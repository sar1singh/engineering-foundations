import { describe, expect, it } from "vitest";
import { mockSyllabusCatalog } from "@/data/mock-syllabus";
import { linearLearningRoadmap } from "@/data/syllabus/linear-learning-roadmap";
import { roleLearningRoadmaps } from "@/data/syllabus/role-learning-roadmaps";
import { syllabusService } from "@/lib/services/syllabus-service";

const executiveObjective = {
  productName: "EngineeringOS",
  mission: "local-first learning, interview, and job-switch operating system for engineers",
  currentSprintGoal: "Reach interview-ready backend engineer level for top product companies within 4-6 months",
  targetRoles: ["Senior Backend Engineer", "AWS Solution Architect", "Staff Principal Engineer", "Engineering Manager"],
  requiredProductCapabilities: [
    "structured syllabus",
    "role-based roadmap",
    "80/20 path",
    "daily direction",
    "practice",
    "interview preparation",
    "progress tracking",
    "readiness scoring",
    "references"
  ]
} as const;

describe("CEO/CTO product objective contract", () => {
  it("keeps EngineeringOS aligned to the stated business mission", () => {
    expect(mockSyllabusCatalog.title).toContain(executiveObjective.productName);
    expect(mockSyllabusCatalog.sourceRoots).toContain("00-control/master-roadmap");
    expect(mockSyllabusCatalog.importNotes.join(" ")).toContain("local-only");
  });

  it("keeps the app focused on role-based interview and job-switch outcomes", () => {
    expect(roleLearningRoadmaps.map((roadmap) => roadmap.title)).toEqual(executiveObjective.targetRoles);

    for (const roadmap of roleLearningRoadmaps) {
      expect(roadmap.outcome.toLowerCase()).toMatch(/interview|architect|strategy|execution|design|reliable|stakeholder/);
      expect(roadmap.focus.map((focus) => focus.level)).toEqual(["foundation", "basic", "advanced", "expert"]);
      expect(roadmap.focus.some((focus) => focus.priority === "core-80-20")).toBe(true);
    }
  });

  it("supports a linear junior to senior/staff/EM growth path", () => {
    expect(linearLearningRoadmap.map((stage) => stage.stage)).toEqual([
      "Junior to Strong Foundation",
      "Mid-Level Backend Engineer",
      "Senior Engineer",
      "Solution Architect",
      "Staff Principal EM"
    ]);

    for (const stage of linearLearningRoadmap) {
      expect(stage.goal.length).toBeGreaterThan(40);
      expect(stage.topicSlugs.length).toBeGreaterThanOrEqual(8);
    }
  });

  it("protects product capability coverage instead of only code correctness", () => {
    const domains = syllabusService.getDomains();
    const allTopics = domains.flatMap((domain) => domain.modules.flatMap((module) => module.topics));

    expect(domains.length).toBeGreaterThanOrEqual(12);
    expect(allTopics.length).toBeGreaterThanOrEqual(150);
    expect(roleLearningRoadmaps.length).toBeGreaterThanOrEqual(4);
    expect(linearLearningRoadmap.length).toBeGreaterThanOrEqual(5);
  });
});
