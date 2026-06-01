import type { EnrichedDesignCapstone, EnrichedPracticeProblem, EnrichedTopicContent } from "@/types/enriched-content";

export type DsaSeed = {
  topicSlug: string;
  title: string;
  pattern: string;
  sourceRefs?: string[];
  problems: Array<{
    id: string;
    title: string;
    difficulty: "easy" | "medium" | "hard";
    statement: string;
    code: string;
    time: string;
    space: string;
  }>;
};

export type DesignSeed = {
  topicSlug: string;
  title: string;
  domain: "HLD" | "LLD" | "AWS" | "Staff/EM" | "Career" | "AI";
  prompt: string;
  sourceRefs: string[];
  requirements: string[];
  designBreakdown: string[];
  awsVariant?: string[];
};

export function dsaTopic(seed: DsaSeed): EnrichedTopicContent {
  const sourceRefs = seed.sourceRefs ?? ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"];

  return {
    topicSlug: seed.topicSlug,
    sourceRefs,
    beginnerExplanation: `${seed.title} is an 80/20 interview pattern: first identify the trigger, then keep the smallest state needed to make each step correct.`,
    deepExplanation: `For ${seed.title}, strong candidates explain the invariant before coding, choose data structures deliberately, and narrate edge cases while preserving the target complexity.`,
    whyInterviewersAsk: `${seed.title} tests whether you can turn a familiar-looking problem into a precise invariant, implementation, complexity analysis, and follow-up discussion.`,
    prerequisites: ["Arrays and strings", "Big-O analysis", "JavaScript/TypeScript functions", "Test-case tracing"],
    skipForNow: ["Micro-optimized language tricks", "Rare competitive-programming variants"],
    roleRelevance: ["Coding screen", "Senior engineer loop", "FAANG/product-company interview practice"],
    estimatedTimeMinutes: 120,
    interviewFrequency: "high",
    lineByLineExplanation: [
      "State the pattern trigger in one sentence.",
      "Name the invariant or state you maintain.",
      "Walk one sample input before coding.",
      "Close with complexity, edge cases, and a follow-up tradeoff."
    ],
    enrichedProblems: seed.problems.map((item, index) => dsaProblem(seed, item, sourceRefs, index)),
    designCapstones: []
  };
}

function dsaProblem(
  seed: DsaSeed,
  item: DsaSeed["problems"][number],
  sourceRefs: string[],
  index: number
): EnrichedPracticeProblem {
  return {
    id: `phase61-${seed.topicSlug}-${item.id}`,
    title: item.title,
    sourceRefs,
    originalStatement: item.statement,
    pattern: seed.pattern,
    difficulty: item.difficulty,
    hints: [
      `Ask what state makes each ${seed.title} step local instead of repeatedly scanning.`,
      "Write the brute force first in words, then name the repeated work.",
      "Protect empty, single-item, duplicate, and boundary inputs before optimizing."
    ],
    approach: [
      `Recognize the ${seed.pattern} trigger from the prompt constraints.`,
      "Define the state/invariant that must be true after each loop or recursive call.",
      "Process the input once or in the required traversal order.",
      "Update the answer only when the invariant proves the candidate is valid.",
      "Return the answer with explicit handling for not-found or empty cases."
    ],
    solutionLanguage: "typescript",
    solution: item.code,
    complexity: { time: item.time, space: item.space },
    testCases: [
      `${item.title} handles the standard happy path for drill ${index + 1}.`,
      `${item.title} handles empty or minimum-sized input without throwing.`,
      `${item.title} handles duplicates, ties, or boundary values according to the prompt.`
    ],
    commonMistakes: [
      "Coding from memory without saying the invariant.",
      "Skipping boundary inputs until the interviewer asks.",
      "Giving complexity for the happy path while ignoring stored state."
    ],
    interviewNarration: `I would present this as a ${seed.pattern} problem. I will first define the state, then process the input while preserving that invariant, and finally validate with boundary cases so the interviewer can see correctness rather than only memorized code.`
  };
}

export function designTopic(seed: DesignSeed): EnrichedTopicContent {
  const capstone: EnrichedDesignCapstone = {
    id: `phase61-${seed.topicSlug}-capstone`,
    prompt: seed.prompt,
    sourceRefs: seed.sourceRefs,
    requirements: seed.requirements,
    approach: [
      "Clarify users, scale, consistency, latency, compliance, and failure expectations.",
      "Draw the write path, read path, and async recovery path separately.",
      "Pick the ownership boundary for data, APIs, queues, and operational runbooks.",
      "Name tradeoffs explicitly and show what would change at 10x traffic.",
      "Close with rollout, observability, security, and cost controls."
    ],
    designBreakdown: seed.designBreakdown,
    tradeoffs: [
      "Simpler synchronous flow is easier to reason about but creates user-facing latency and tighter coupling.",
      "Asynchronous queues improve resilience but introduce eventual consistency, retries, and replay concerns.",
      "Managed AWS services reduce operational burden but require cost, limits, IAM, and vendor-specific failure planning."
    ],
    failureModes: [
      "Dependency timeout or partial write leaves workflow state ambiguous.",
      "Hot partition or celebrity-style skew overloads a small part of the system.",
      "Retry without idempotency duplicates work, money movement, notifications, or state transitions.",
      "Operator lacks a tested rollback, replay, or restore path."
    ],
    security: [
      "Least-privilege IAM and scoped service credentials.",
      "Encryption in transit and at rest with KMS where relevant.",
      "Tenant/user authorization checks on every read and write path.",
      "Audit logs for admin or high-risk operations."
    ],
    observability: [
      "Golden signals: latency, traffic, errors, saturation.",
      "Business correctness metrics tied to the workflow.",
      "Queue age, retry count, DLQ depth, and dependency health.",
      "Dashboards and alerts owned before launch."
    ],
    awsVariant: seed.awsVariant ?? [
      "Route 53 and CloudFront for entry and edge acceleration where useful.",
      "API Gateway or ALB in front of ECS/EKS/Lambda services.",
      "RDS/DynamoDB/S3 chosen by access pattern and consistency needs.",
      "SQS/SNS/EventBridge/Step Functions for async workflows.",
      "CloudWatch, CloudTrail, KMS, and AWS Backup for operations and governance."
    ],
    rubric: [
      "Requirements are explicit and prioritized.",
      "Data ownership and consistency boundaries are clear.",
      "Failure modes, security, observability, and cost are covered.",
      "AWS choices are justified instead of listed as buzzwords.",
      "The answer shows senior judgment through tradeoffs and rollout plan."
    ],
    expectedSeniorSignals: [
      "Asks clarifying questions before drawing boxes.",
      "Protects correctness and user trust on failure paths.",
      "Balances speed, cost, reliability, and team operability.",
      "Communicates decisions in a way an EM, PM, SRE, and interviewer can follow."
    ]
  };

  return {
    topicSlug: seed.topicSlug,
    sourceRefs: seed.sourceRefs,
    beginnerExplanation: `${seed.title} is a ${seed.domain} interview topic where the first win is a clear problem boundary and a simple end-to-end flow.`,
    deepExplanation: `A senior ${seed.domain} answer for ${seed.title} separates functional requirements from operational guarantees, then defends tradeoffs with failure, security, observability, and AWS deployment details.`,
    whyInterviewersAsk: `Interviewers use ${seed.title} to test practical judgment, communication, tradeoff depth, and whether you can operate what you design.`,
    prerequisites: ["API design", "Data modeling", "Queues and async workflows", "AWS fundamentals", "Observability basics"],
    skipForNow: ["Vendor-specific edge cases that do not change the core design", "Premature multi-region complexity unless required"],
    roleRelevance: ["Senior engineer", "Staff/principal engineer", "Solution architect", "Engineering manager"],
    estimatedTimeMinutes: 150,
    interviewFrequency: seed.domain === "Career" ? "very-high" : "high",
    enrichedProblems: [],
    designCapstones: [capstone]
  };
}
