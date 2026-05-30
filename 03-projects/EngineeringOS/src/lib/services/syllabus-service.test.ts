import { describe, expect, it } from "vitest";
import { syllabusService } from "@/lib/services/syllabus-service";

describe("SyllabusService", () => {
  it("exposes the master-roadmap mock syllabus source roots", () => {
    const catalog = syllabusService.getCatalog();

    expect(catalog.sourceRoots).toContain("00-control/master-roadmap");
    expect(catalog.sourceRoots).toContain("01-learning");
    expect(catalog.importNotes.join(" ")).toContain("01-learning currently has no importable files");
  });

  it("imports the JavaScript fundamentals sequence from the master roadmap", () => {
    const javascriptDomain = syllabusService.getDomains().find((domain) => domain.slug === "javascript");
    expect(javascriptDomain).toBeDefined();
    const [fundamentals] = javascriptDomain?.modules ?? [];

    expect(javascriptDomain?.sourcePath).toBe("00-control/master-roadmap/02-javascript/INDEX.md");
    expect(fundamentals.topics.map((topic) => topic.title)).toEqual([
      "Scope",
      "Hoisting",
      "Closures",
      "this",
      "Prototype Chain"
    ]);
  });

  it("represents closures with code examples, problem difficulty levels, review prompts, and progress signals", () => {
    const topic = syllabusService.getTopicBySlug("closures");

    expect(topic?.definition).toContain("outer lexical scope");
    expect(topic?.codeExamples[0]?.runnable).toBe(true);
    expect(topic?.practiceProblems.map((problem) => problem.difficulty)).toEqual(["easy", "medium", "hard"]);
    expect(topic?.reviewPrompts.map((prompt) => prompt.reviewerRole)).toContain("mentor");
    expect(topic?.progressSignals).toContain("ran_code_example");
    expect(topic?.progressSignals).toContain("completed_mock_review");
  });

  it("imports DSA Phase 1 Foundations from the master roadmap", () => {
    const dsaDomain = syllabusService.getDomains().find((domain) => domain.slug === "dsa");
    const [foundations] = dsaDomain?.modules ?? [];

    expect(dsaDomain?.sourcePath).toBe("00-control/master-roadmap/04-dsa/INDEX.md");
    expect(foundations.topics.map((topic) => topic.title)).toEqual(["Arrays", "Strings", "Hashing", "Stack", "Queue"]);
  });

  it("represents every DSA foundation topic with interview-ready practice and references", () => {
    const dsaDomain = syllabusService.getDomains().find((domain) => domain.slug === "dsa");
    const topics = dsaDomain?.modules[0]?.topics ?? [];

    expect(topics).toHaveLength(5);
    for (const topic of topics) {
      expect(topic.theory).toContain("Visual model:");
      expect(topic.codeExamples[0]?.runnable).toBe(true);
      expect(topic.practiceProblems.map((problem) => problem.difficulty)).toEqual(["easy", "medium", "hard"]);
      expect(topic.references.length).toBeGreaterThanOrEqual(3);
      expect(topic.progressSignals).toContain("solved_easy_problem");
      expect(topic.reviewPrompts.map((prompt) => prompt.reviewerRole)).toContain("mentor");
    }
  });

  it("imports DSA Phase 2 Core Patterns from the master roadmap", () => {
    const dsaDomain = syllabusService.getDomains().find((domain) => domain.slug === "dsa");
    const corePatterns = dsaDomain?.modules.find((module) => module.slug === "dsa-core-patterns");

    expect(corePatterns?.sourcePath).toBe("00-control/master-roadmap/04-dsa/INDEX.md");
    expect(corePatterns?.topics.map((topic) => topic.title)).toEqual([
      "Two Pointers",
      "Sliding Window",
      "Prefix Sum",
      "Binary Search"
    ]);
  });

  it("represents every DSA core pattern with visual models, runnable examples, and difficulty coverage", () => {
    const dsaDomain = syllabusService.getDomains().find((domain) => domain.slug === "dsa");
    const topics = dsaDomain?.modules.find((module) => module.slug === "dsa-core-patterns")?.topics ?? [];

    expect(topics).toHaveLength(4);
    for (const topic of topics) {
      expect(topic.theory).toContain("Visual model:");
      expect(topic.codeExamples[0]?.runnable).toBe(true);
      expect(topic.practiceProblems.map((problem) => problem.difficulty)).toEqual(["easy", "medium", "hard"]);
      expect(topic.references.map((reference) => reference.title)).toContain("NeetCode roadmap");
      expect(topic.progressSignals).toContain("solved_medium_problem");
      expect(topic.reviewPrompts.map((prompt) => prompt.reviewerRole)).toContain("mentor");
    }
  });

  it("imports DSA Phase 3 Structures from the master roadmap", () => {
    const dsaDomain = syllabusService.getDomains().find((domain) => domain.slug === "dsa");
    const structures = dsaDomain?.modules.find((module) => module.slug === "dsa-structures");

    expect(structures?.sourcePath).toBe("00-control/master-roadmap/04-dsa/INDEX.md");
    expect(structures?.topics.map((topic) => topic.title)).toEqual(["Linked List", "Trees", "Heap", "Trie", "Graphs"]);
  });

  it("represents every DSA structure with visual models, runnable examples, and difficulty coverage", () => {
    const dsaDomain = syllabusService.getDomains().find((domain) => domain.slug === "dsa");
    const topics = dsaDomain?.modules.find((module) => module.slug === "dsa-structures")?.topics ?? [];

    expect(topics).toHaveLength(5);
    for (const topic of topics) {
      expect(topic.theory).toContain("Visual model:");
      expect(topic.codeExamples[0]?.runnable).toBe(true);
      expect(topic.practiceProblems.map((problem) => problem.difficulty)).toEqual(["easy", "medium", "hard"]);
      expect(topic.references.map((reference) => reference.title)).toContain("EngineeringOS DSA master roadmap");
      expect(topic.progressSignals).toContain("solved_medium_problem");
      expect(topic.reviewPrompts.map((prompt) => prompt.reviewerRole)).toContain("mentor");
    }
  });

  it("imports DSA Phase 4 Advanced from a split syllabus data module", () => {
    const dsaDomain = syllabusService.getDomains().find((domain) => domain.slug === "dsa");
    const advanced = dsaDomain?.modules.find((module) => module.slug === "dsa-advanced");

    expect(advanced?.sourcePath).toBe("00-control/master-roadmap/04-dsa/INDEX.md");
    expect(advanced?.topics.map((topic) => topic.title)).toEqual(["Greedy", "Backtracking", "Dynamic Programming"]);
  });

  it("represents every DSA advanced topic with proof/review prompts and difficulty coverage", () => {
    const dsaDomain = syllabusService.getDomains().find((domain) => domain.slug === "dsa");
    const topics = dsaDomain?.modules.find((module) => module.slug === "dsa-advanced")?.topics ?? [];

    expect(topics).toHaveLength(3);
    for (const topic of topics) {
      expect(topic.theory).toContain("Visual model:");
      expect(topic.codeExamples[0]?.runnable).toBe(true);
      expect(topic.practiceProblems.map((problem) => problem.difficulty)).toEqual(["easy", "medium", "hard"]);
      expect(topic.reviewPrompts[0]?.rubric).toContain("Strategy choice is justified");
      expect(topic.references.map((reference) => reference.title)).toContain("NeetCode roadmap");
      expect(topic.progressSignals).toContain("solved_hard_problem");
    }
  });
});
