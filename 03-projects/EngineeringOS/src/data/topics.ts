import type { Topic } from "@/types/topic";
import { modules } from "@/data/modules";

const now = "2026-05-30T00:00:00.000Z";

const moduleByTopicId = new Map(
  modules.flatMap((module) => module.topicIds.map((topicId) => [topicId, module.id] as const))
);

const topicSpecs = [
  ["js-fundamentals", "JavaScript Fundamentals", "javascript", "easy"],
  ["js-scope", "Scope", "scope", "easy"],
  ["js-execution-context", "Execution Context", "execution-context", "medium"],
  ["js-lexical-environment", "Lexical Environment", "lexical-environment", "medium"],
  ["js-closures", "Closures", "closures", "medium"],
  ["js-hoisting", "Hoisting", "hoisting", "easy"],
  ["js-this-binding", "this binding", "this-binding", "medium"],
  ["js-prototypes", "Prototypes", "prototypes", "medium"],
  ["js-event-loop", "Event Loop", "event-loop", "medium"],
  ["js-callbacks", "Callbacks", "callbacks", "easy"],
  ["js-promises", "Promises", "promises", "medium"],
  ["js-async-await", "Async/Await", "async-await", "medium"],
  ["node-runtime", "Node.js Runtime", "node-runtime", "medium"],
  ["node-event-loop", "Event Loop in Node.js", "node-event-loop", "medium"],
  ["node-streams", "Streams", "streams", "medium"],
  ["node-express-basics", "Express Basics", "express-basics", "easy"],
  ["dsa-arrays", "Arrays", "arrays", "easy"],
  ["dsa-strings", "Strings", "strings", "easy"],
  ["dsa-hash-maps", "Hash Maps", "hash-maps", "easy"],
  ["dsa-two-pointers", "Two Pointers", "two-pointers", "medium"],
  ["system-design-caching", "Caching", "caching", "medium"],
  ["system-design-load-balancing", "Load Balancing", "load-balancing", "medium"],
  ["system-design-queues", "Queues", "queues", "medium"],
  ["db-sql-basics", "SQL Basics", "sql-basics", "easy"],
  ["db-indexes", "Indexes", "indexes", "medium"],
  ["db-transactions", "Transactions", "transactions", "medium"],
  ["aws-iam", "IAM", "iam", "easy"],
  ["aws-s3", "S3", "s3", "easy"],
  ["aws-sqs", "SQS", "sqs", "medium"]
] as const;

export const topics: Topic[] = topicSpecs.map(([id, title, slug, difficulty], index) => {
  const previousTopicId = index > 0 ? topicSpecs[index - 1][0] : undefined;
  const nextTopicId = index < topicSpecs.length - 1 ? topicSpecs[index + 1][0] : undefined;

  return {
    id,
    moduleId: moduleByTopicId.get(id) ?? "module-interview-preparation-foundations",
    title,
    slug,
    summary: `${title} is a core EngineeringOS topic for interview readiness and production engineering judgment.`,
    whyItMatters: `${title} helps engineers connect theory, code, trade-offs, and interview signals.`,
    difficulty,
    estimatedMinutes: difficulty === "easy" ? 45 : 75,
    tags: [slug, "interview", "engineering"],
    prerequisites: previousTopicId ? [previousTopicId] : [],
    relatedTopics: nextTopicId ? [nextTopicId] : [],
    advancedTopics: nextTopicId ? [nextTopicId] : [],
    roleRelevance: ["Senior Engineer", "Lead Engineer"],
    companyRelevance: ["FAANG", "GCC", "Indian Product Companies", "Well-funded Startups"],
    interviewRelevance: difficulty === "easy" ? 7 : 9,
    learningModes: {
      fastTrack: {
        summary: `Learn the interview-critical shape of ${title}.`,
        mustKnow: ["Definition", "Common interview pattern", "One working example"],
        skipForNow: ["Rare edge cases", "Historical details"],
        practiceFocus: ["Explain the concept", "Solve one focused task"],
        passCriteria: ["Can explain clearly", "Can apply in a small example"]
      },
      deepMastery: {
        summary: `Build production-level understanding of ${title}.`,
        mustKnow: ["Mental model", "Runtime behavior", "Trade-offs", "Failure modes"],
        skipForNow: [],
        practiceFocus: ["Edge cases", "Debugging", "Production use cases"],
        passCriteria: ["Can teach it", "Can identify pitfalls", "Can connect to adjacent topics"]
      }
    },
    theory: `${title} should be understood through behavior, constraints, use cases, and failure modes.`,
    mentalModel: `Treat ${title} as a tool with explicit inputs, outputs, constraints, and trade-offs.`,
    codeExamples: [
      {
        title: `${title} minimal example`,
        language: "javascript",
        code: `// ${title}\nconsole.log("${slug}");`,
        explanation: `A small placeholder example for ${title}.`
      }
    ],
    productionUseCases: ["Feature implementation", "Debugging", "System design conversations"],
    commonMistakes: ["Memorizing without practice", "Skipping edge cases", "Not explaining trade-offs"],
    subtopicIds: [`subtopic-${id}-core`],
    practiceTaskIds: [`task-${id}-core`],
    interviewQuestionIds: [`question-${id}-core`],
    referenceLinkIds: [`reference-${id}-core`],
    revisionPromptIds: [`revision-${id}-core`],
    explainBackPrompt: `Explain ${title} to a junior engineer with one example and one pitfall.`,
    evaluationRubricId: `rubric-${id}-core`,
    completionCriteria: ["Summary understood", "Practice task complete", "Explain-back prompt answered"],
    createdAt: now,
    updatedAt: now
  };
});
