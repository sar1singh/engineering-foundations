import { describe, expect, it } from "vitest";
import { linearLearningRoadmap } from "@/data/syllabus/linear-learning-roadmap";
import { roleLearningRoadmaps } from "@/data/syllabus/role-learning-roadmaps";
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
    expectDifficultyCoverage(topic?.practiceProblems.map((problem) => problem.difficulty));
    expect(topic?.reviewPrompts.map((prompt) => prompt.reviewerRole)).toContain("mentor");
    expect(topic?.progressSignals).toContain("ran_code_example");
    expect(topic?.progressSignals).toContain("completed_mock_review");
  });

  it("imports JavaScript Phase 2 Async from the master roadmap", () => {
    const javascriptDomain = syllabusService.getDomains().find((domain) => domain.slug === "javascript");
    const asyncModule = javascriptDomain?.modules.find((module) => module.slug === "javascript-async");

    expect(asyncModule?.sourcePath).toBe("00-control/master-roadmap/02-javascript/INDEX.md");
    expect(asyncModule?.topics.map((topic) => topic.title)).toEqual([
      "Promises",
      "Async Await",
      "Event Loop",
      "Microtask vs Macrotask"
    ]);
    expect(asyncModule?.topics.map((topic) => topic.order)).toEqual([6, 7, 8, 9]);
  });

  it("represents every JavaScript async topic with runnable traces, practice coverage, and queue review prompts", () => {
    const javascriptDomain = syllabusService.getDomains().find((domain) => domain.slug === "javascript");
    const topics = javascriptDomain?.modules.find((module) => module.slug === "javascript-async")?.topics ?? [];

    expect(topics).toHaveLength(4);
    for (const topic of topics) {
      expect(topic.theory).toContain("Visual model:");
      expect(topic.codeExamples[0]?.runnable).toBe(true);
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
      expect(topic.references.map((reference) => reference.title)).toContain("EngineeringOS JavaScript master roadmap");
      expect(topic.progressSignals).toContain("ran_code_example");
      expect(topic.progressSignals).toContain("solved_easy_problem");
      expect(topic.reviewPrompts.map((prompt) => prompt.reviewerRole)).toContain("mentor");
    }
  });

  it("imports JavaScript Phase 3 Senior Topics from the master roadmap", () => {
    const javascriptDomain = syllabusService.getDomains().find((domain) => domain.slug === "javascript");
    const seniorModule = javascriptDomain?.modules.find((module) => module.slug === "javascript-senior");

    expect(seniorModule?.sourcePath).toBe("00-control/master-roadmap/02-javascript/INDEX.md");
    expect(seniorModule?.topics.map((topic) => topic.title)).toEqual([
      "Memory Leaks",
      "Garbage Collection",
      "Performance",
      "Modular Architecture"
    ]);
    expect(seniorModule?.topics.map((topic) => topic.order)).toEqual([10, 11, 12, 13]);
  });

  it("represents every JavaScript senior topic with production practice and progress tracking signals", () => {
    const javascriptDomain = syllabusService.getDomains().find((domain) => domain.slug === "javascript");
    const topics = javascriptDomain?.modules.find((module) => module.slug === "javascript-senior")?.topics ?? [];

    expect(topics).toHaveLength(4);
    for (const topic of topics) {
      expect(topic.theory).toContain("Visual model:");
      expect(topic.codeExamples[0]?.runnable).toBe(true);
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
      expect(topic.references.map((reference) => reference.title)).toContain("EngineeringOS JavaScript master roadmap");
      expect(topic.progressSignals).toContain("solved_hard_problem");
      expect(topic.reviewPrompts[0]?.rubric).toContain("Verification signal is measurable");
    }
  });

  it("imports JavaScript Phase 4 Interview from the master roadmap", () => {
    const javascriptDomain = syllabusService.getDomains().find((domain) => domain.slug === "javascript");
    const interviewModule = javascriptDomain?.modules.find((module) => module.slug === "javascript-interview");

    expect(interviewModule?.sourcePath).toBe("00-control/master-roadmap/02-javascript/INDEX.md");
    expect(interviewModule?.topics.map((topic) => topic.title)).toEqual(["Output Prediction", "Debugging Scenarios"]);
    expect(interviewModule?.topics.map((topic) => topic.order)).toEqual([14, 15]);
  });

  it("represents every JavaScript interview topic with local drills and verified learning references", () => {
    const javascriptDomain = syllabusService.getDomains().find((domain) => domain.slug === "javascript");
    const topics = javascriptDomain?.modules.find((module) => module.slug === "javascript-interview")?.topics ?? [];

    expect(topics).toHaveLength(2);
    for (const topic of topics) {
      expect(topic.codeExamples[0]?.explanation).toContain("local JS file");
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
      expect(topic.references.map((reference) => reference.title)).toContain("javascript.info Event loop");
      expect(topic.references.map((reference) => reference.title)).toContain("EngineeringOS JavaScript master roadmap");
      expect(topic.progressSignals).toContain("submitted_explain_back");
    }
  });

  it("imports DSA Phase 1 Foundations from the master roadmap", () => {
    const dsaDomain = syllabusService.getDomains().find((domain) => domain.slug === "dsa");
    const [foundations] = dsaDomain?.modules ?? [];

    expect(dsaDomain?.sourcePath).toBe("00-control/master-roadmap/04-dsa/INDEX.md");
    expect(foundations.topics.map((topic) => topic.title)).toEqual(["Arrays", "Strings", "Hashing", "Stack", "Queue"]);
  });

  it("imports Node.js Phase 1 Core Runtime from the master roadmap", () => {
    const nodeDomain = syllabusService.getDomains().find((domain) => domain.slug === "nodejs");
    const coreRuntime = nodeDomain?.modules.find((module) => module.slug === "nodejs-core-runtime");

    expect(nodeDomain?.sourcePath).toBe("00-control/master-roadmap/03-nodejs/INDEX.md");
    expect(coreRuntime?.topics.map((topic) => topic.title)).toEqual([
      "Event Loop in Node",
      "Process Lifecycle",
      "Buffers",
      "Streams"
    ]);
    expect(coreRuntime?.topics.map((topic) => topic.order)).toEqual([1, 2, 3, 4]);
  });

  it("represents every Node.js core runtime topic with official docs, local labs, and progress signals", () => {
    const nodeDomain = syllabusService.getDomains().find((domain) => domain.slug === "nodejs");
    const topics = nodeDomain?.modules.find((module) => module.slug === "nodejs-core-runtime")?.topics ?? [];

    expect(topics).toHaveLength(4);
    for (const topic of topics) {
      expect(topic.sourcePath).toBe("00-control/master-roadmap/03-nodejs/INDEX.md");
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
      expect(topic.practiceProblems[0]?.tags).toContain("local-lab");
      expect(topic.references.map((reference) => reference.title)).toContain("Node.js Stream API");
      expect(topic.references.map((reference) => reference.title)).toContain("EngineeringOS Node.js master roadmap");
      expect(topic.progressSignals).toContain("ran_code_example");
    }
  });

  it("imports all Node.js phases from the master roadmap", () => {
    const nodeDomain = syllabusService.getDomains().find((domain) => domain.slug === "nodejs");

    expect(nodeDomain?.modules.map((module) => module.title)).toEqual([
      "Phase 1 Core Runtime",
      "Phase 2 Backend Engineering",
      "Phase 3 Scale Topics",
      "Phase 4 Senior Topics"
    ]);
    expect(nodeDomain?.modules.flatMap((module) => module.topics.map((topic) => topic.title))).toEqual([
      "Event Loop in Node",
      "Process Lifecycle",
      "Buffers",
      "Streams",
      "Error Handling",
      "Validation",
      "Logging",
      "Config Management",
      "Clustering",
      "worker_threads",
      "Queue Workers",
      "Rate Limiting",
      "Performance Tuning",
      "Graceful Shutdown",
      "Reliability Patterns"
    ]);
  });

  it("imports the full Databases roadmap sequence with practice-platform references", () => {
    const databaseDomain = syllabusService.getDomains().find((domain) => domain.slug === "databases");
    const topics = databaseDomain?.modules.flatMap((module) => module.topics) ?? [];

    expect(databaseDomain?.sourcePath).toBe("00-control/master-roadmap/05-databases/INDEX.md");
    expect(topics.map((topic) => topic.title)).toEqual([
      "SELECT",
      "JOINS",
      "GROUP BY",
      "Subqueries",
      "Window Functions",
      "Indexes",
      "Query Tuning",
      "Explain Plan",
      "MVCC",
      "Locks",
      "Partitioning",
      "Replication Basics",
      "MongoDB Schema Design",
      "MongoDB Aggregation",
      "MongoDB Sharding Basics",
      "Cache Patterns",
      "TTL",
      "Rate Limiting"
    ]);
    expect(topics).toHaveLength(18);
    for (const topic of topics) {
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
      expect(topic.references.map((reference) => reference.title)).toContain("SQLBolt interactive SQL lessons");
      expect(topic.references.map((reference) => reference.title)).toContain("EngineeringOS Databases master roadmap");
      expect(topic.progressSignals).toContain("submitted_explain_back");
    }
  });

  it("imports the full System Design roadmap sequence with design-mock references", () => {
    const systemDesignDomain = syllabusService.getDomains().find((domain) => domain.slug === "system-design");
    const topics =
      systemDesignDomain?.modules
        .filter((module) => module.slug !== "hld-case-studies")
        .flatMap((module) => module.topics) ?? [];

    expect(systemDesignDomain?.sourcePath).toBe("00-control/master-roadmap/06-system-design/INDEX.md");
    expect(topics.map((topic) => topic.title)).toEqual([
      "Scalability",
      "Availability",
      "Reliability",
      "CAP Basics",
      "Latency",
      "Load Balancer",
      "Cache",
      "Queue",
      "DB Replica",
      "CDN",
      "DAU/MAU",
      "RPS",
      "Storage Estimation",
      "URL Shortener",
      "Chat System",
      "Feed System",
      "Booking System",
      "Payment System",
      "Notification System",
      "Multi-region",
      "Eventual Consistency",
      "Idempotency",
      "Disaster Recovery"
    ]);
    expect(topics).toHaveLength(23);
    for (const topic of topics) {
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
      expect(topic.references.map((reference) => reference.title)).toContain("System Design Primer");
      expect(topic.references.map((reference) => reference.title)).toContain("EngineeringOS System Design master roadmap");
      expect(topic.progressSignals).toContain("completed_mock_review");
    }
  });

  it("imports AWS Solution Architect core services with AWS-first references", () => {
    const awsDomain = syllabusService.getDomains().find((domain) => domain.slug === "aws");
    const topics = awsDomain?.modules.find((module) => module.slug === "aws-core-services")?.topics ?? [];

    expect(awsDomain?.sourcePath).toBe("00-control/master-roadmap/09-aws/INDEX.md");
    expect(topics.map((topic) => topic.title)).toEqual(["IAM", "EC2", "S3", "RDS", "VPC", "Lambda", "SQS SNS", "DynamoDB"]);
    for (const topic of topics) {
      expect(topic.references.map((reference) => reference.title)).toContain("AWS SAA-C03 Exam Guide");
      expect(topic.references.map((reference) => reference.title)).toContain("AWS Well-Architected Framework");
      expect(topic.references.map((reference) => reference.title)).toContain("roadmap.sh AWS Roadmap");
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
    }
  });

  it("imports an externally guided LLD track when the local roadmap index is empty", () => {
    const lldDomain = syllabusService.getDomains().find((domain) => domain.slug === "lld");
    const topics = lldDomain?.modules.flatMap((module) => module.topics) ?? [];

    expect(lldDomain?.sourcePath).toBe("00-control/master-roadmap/07-lld/INDEX.md");
    expect(lldDomain?.modules.map((module) => module.title)).toEqual(["Foundations", "Machine Coding", "Senior Design"]);
    expect(topics.map((topic) => topic.title)).toContain("Parking Lot");
    expect(topics.map((topic) => topic.title)).toContain("Rate Limiter LLD");
    expect(topics.map((topic) => topic.title)).toContain("API Design Contracts");
    for (const topic of topics) {
      expect(topic.references.map((reference) => reference.title)).toContain("roadmap.sh Software Design and Architecture");
      expect(topic.references.map((reference) => reference.title)).toContain("Low Level Design Primer");
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
    }
  });

  it("adds a deeper Algorithms track for search, hash maps, trees, graphs, and advanced patterns", () => {
    const algorithmDomain = syllabusService.getDomains().find((domain) => domain.slug === "algorithms");
    const topics = algorithmDomain?.modules.flatMap((module) => module.topics) ?? [];

    expect(topics.map((topic) => topic.title)).toEqual([
      "HashMap Frequency Counting",
      "Linear Search",
      "Binary Search",
      "Sorting",
      "Tree DFS",
      "Tree BFS",
      "Graph DFS",
      "Graph BFS",
      "Topological Sort",
      "Dijkstra",
      "Union Find",
      "Recursion and Backtracking",
      "Dynamic Programming Core",
      "Intervals",
      "Bit Manipulation"
    ]);
    for (const topic of topics) {
      expect(topic.codeExamples[0]?.language).toBe("javascript");
      expect(topic.references.map((reference) => reference.title)).toContain("NeetCode Roadmap");
      expect(topic.references.map((reference) => reference.title)).toContain("The Algorithms JavaScript");
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
    }
  });

  it("adds HLD case studies with AWS deployment variants", () => {
    const systemDesignDomain = syllabusService.getDomains().find((domain) => domain.slug === "system-design");
    const caseStudies = systemDesignDomain?.modules.find((module) => module.slug === "hld-case-studies")?.topics ?? [];

    expect(caseStudies.map((topic) => topic.title)).toEqual([
      "URL Shortener HLD",
      "Chat System HLD",
      "Feed System HLD",
      "Booking System HLD",
      "Payment System HLD",
      "Notification System HLD"
    ]);
    for (const topic of caseStudies) {
      expect(topic.theory).toContain("AWS deployment variant");
      expect(topic.references.map((reference) => reference.title)).toContain("AWS Architecture Center");
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
    }
  });

  it("deepens AWS HLD topics for solution architect readiness", () => {
    const awsDomain = syllabusService.getDomains().find((domain) => domain.slug === "aws");
    const topics = awsDomain?.modules.find((module) => module.slug === "aws-hld-deepening")?.topics ?? [];

    expect(topics.map((topic) => topic.title)).toContain("Multi-AZ Architecture");
    expect(topics.map((topic) => topic.title)).toContain("Cost Optimization");
    expect(topics).toHaveLength(12);
    for (const topic of topics) {
      expect(topic.references.map((reference) => reference.title)).toContain("AWS Well-Architected Framework");
      expect(topic.references.map((reference) => reference.title)).toContain("AWS Architecture Center");
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
    }
  });

  it("adds Staff Principal EM leadership topics", () => {
    const staffDomain = syllabusService.getDomains().find((domain) => domain.slug === "staff-em");
    const topics = staffDomain?.modules.flatMap((module) => module.topics) ?? [];

    expect(topics.map((topic) => topic.title)).toEqual([
      "Architecture Review",
      "Technical Strategy",
      "Incident Leadership",
      "Roadmap Execution",
      "Hiring and Interview Calibration",
      "Stakeholder Communication"
    ]);
    for (const topic of topics) {
      expect(topic.references.map((reference) => reference.title)).toContain("StaffEng");
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
    }
  });

  it("defines a linear learning path from junior to staff principal EM", () => {
    expect(linearLearningRoadmap.map((stage) => stage.stage)).toEqual([
      "Junior to Strong Foundation",
      "Mid-Level Backend Engineer",
      "Senior Engineer",
      "Solution Architect",
      "Staff Principal EM"
    ]);
    expect(linearLearningRoadmap.at(-1)?.topicSlugs).toContain("stakeholder-communication");
  });

  it("defines role-based 80/20 learning roadmaps for targeted outcomes", () => {
    expect(roleLearningRoadmaps.map((roadmap) => roadmap.slug)).toEqual([
      "backend-senior-engineer",
      "solution-architect",
      "staff-principal-engineer",
      "engineering-manager"
    ]);

    for (const roadmap of roleLearningRoadmaps) {
      expect(roadmap.focus.map((focus) => focus.level)).toEqual(["foundation", "basic", "advanced", "expert"]);
      expect(roadmap.focus.some((focus) => focus.priority === "core-80-20")).toBe(true);
      expect(roadmap.topicSlugs.length).toBeGreaterThanOrEqual(8);
    }

    const solutionArchitect = roleLearningRoadmaps.find((roadmap) => roadmap.slug === "solution-architect");
    expect(solutionArchitect?.topicSlugs).toContain("multi-az");
    expect(solutionArchitect?.topicSlugs).toContain("hld-payment-system");
  });

  it("normalizes every rendered topic to at least eight practice problems and interview questions", () => {
    const topics = syllabusService.getDomains().flatMap((domain) => domain.modules.flatMap((module) => module.topics));

    expect(topics.length).toBeGreaterThan(100);
    for (const topic of topics) {
      expect(topic.practiceProblems.length).toBeGreaterThanOrEqual(8);
      expect(topic.interviewQuestions.length).toBeGreaterThanOrEqual(8);
      expect(topic.references.length).toBeGreaterThan(0);
      expect(topic.codeExamples.length).toBeGreaterThan(0);
    }
  });

  it("applies deep lesson overrides for the highest-ROI interview topics", () => {
    const deepTopics = [
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
    ];

    for (const slug of deepTopics) {
      const topic = syllabusService.getTopicBySlug(slug);

      expect(topic?.theory).toContain("Deep lesson:");
      expect(topic?.reviewPrompts.length).toBeGreaterThan(0);
      expect(topic?.reviewPrompts.at(-1)?.rubric.length).toBeGreaterThanOrEqual(4);
      expect(topic?.practiceProblems.length).toBeGreaterThanOrEqual(8);
      expect(topic?.interviewQuestions.length).toBeGreaterThanOrEqual(8);
      expect(topic?.references.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("represents every DSA foundation topic with interview-ready practice and references", () => {
    const dsaDomain = syllabusService.getDomains().find((domain) => domain.slug === "dsa");
    const topics = dsaDomain?.modules[0]?.topics ?? [];

    expect(topics).toHaveLength(5);
    for (const topic of topics) {
      expect(topic.theory).toContain("Visual model:");
      expect(topic.codeExamples[0]?.runnable).toBe(true);
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
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
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
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
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
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
      expectDifficultyCoverage(topic.practiceProblems.map((problem) => problem.difficulty));
      expect(topic.reviewPrompts[0]?.rubric).toContain("Strategy choice is justified");
      expect(topic.references.map((reference) => reference.title)).toContain("NeetCode roadmap");
      expect(topic.progressSignals).toContain("solved_hard_problem");
    }
  });
});

function expectDifficultyCoverage(difficulties: Array<"easy" | "medium" | "hard"> | undefined) {
  expect(difficulties).toBeDefined();
  expect(difficulties).toContain("easy");
  expect(difficulties).toContain("medium");
  expect(difficulties).toContain("hard");
}

