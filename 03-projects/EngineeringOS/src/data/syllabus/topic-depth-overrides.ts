import type { SyllabusCodeExample, SyllabusPracticeProblem, SyllabusReference, SyllabusReviewPrompt } from "@/types/syllabus";

type TopicDepthOverride = {
  theoryAppendix: string;
  codeExamples?: SyllabusCodeExample[];
  practiceProblems?: SyllabusPracticeProblem[];
  interviewQuestions?: string[];
  reviewPrompts?: SyllabusReviewPrompt[];
  references?: SyllabusReference[];
};

const graphReferences: SyllabusReference[] = [
  {
    id: "reference-depth-cp-algorithms-graph",
    title: "CP-Algorithms Graph Algorithms",
    url: "https://cp-algorithms.com/graph/",
    sourceType: "article",
    usage: "Deep reference for graph traversal, shortest paths, topological sorting, and disjoint sets."
  },
  {
    id: "reference-depth-neetcode-roadmap",
    title: "NeetCode Roadmap",
    url: "https://neetcode.io/roadmap",
    sourceType: "practice",
    usage: "Interview problem ordering for graph, tree, heap, backtracking, and dynamic programming patterns."
  }
];

const awsReferences: SyllabusReference[] = [
  {
    id: "reference-depth-aws-reliability",
    title: "AWS Well-Architected Reliability Pillar",
    url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html",
    sourceType: "docs",
    usage: "Primary AWS guidance for Multi-AZ, recovery objectives, fault isolation, and resilience."
  },
  {
    id: "reference-depth-aws-architecture-center",
    title: "AWS Architecture Center",
    url: "https://aws.amazon.com/architecture/",
    sourceType: "docs",
    usage: "AWS-first implementation patterns for scalable and reliable cloud architectures."
  }
];

const hldReferences: SyllabusReference[] = [
  {
    id: "reference-depth-system-design-primer",
    title: "System Design Primer",
    url: "https://github.com/donnemartin/system-design-primer",
    sourceType: "roadmap",
    usage: "Canonical public interview reference for system design concepts and case-study structure."
  },
  {
    id: "reference-depth-aws-builders-library",
    title: "Amazon Builders' Library",
    url: "https://aws.amazon.com/builders-library/",
    sourceType: "article",
    usage: "Production engineering essays for retries, timeouts, overload, reliability, and distributed systems."
  }
];

const leadershipReferences: SyllabusReference[] = [
  {
    id: "reference-depth-staffeng",
    title: "StaffEng",
    url: "https://staffeng.com/",
    sourceType: "article",
    usage: "Public reference for Staff-plus expectations, influence, technical strategy, and leadership behaviors."
  },
  {
    id: "reference-depth-google-sre-incident",
    title: "Google SRE Book",
    url: "https://sre.google/sre-book/table-of-contents/",
    sourceType: "article",
    usage: "Reference for incident response, postmortems, reliability, and operational leadership."
  }
];

function depthReview(id: string, prompt: string): SyllabusReviewPrompt {
  return {
    id,
    reviewerRole: "mentor",
    prompt,
    rubric: [
      "Explains the first-principles model before using jargon",
      "Chooses the right pattern or architecture for the constraints",
      "Names failure modes and verification signals",
      "Connects the answer to interview and production scenarios"
    ]
  };
}

export const topicDepthOverrides: Record<string, TopicDepthOverride> = {
  "graph-bfs": {
    theoryAppendix:
      "Deep lesson: Graph BFS is the default choice for unweighted shortest path, minimum jumps, nearest target, and grid level expansion. The invariant is that the first time a node is dequeued, the distance attached to it is the shortest possible distance from the source. Mark nodes as visited when enqueuing, not when dequeuing, to avoid duplicate queue entries. In grids, define neighbors carefully, validate bounds, and decide whether to mutate the grid or use a visited set.",
    codeExamples: [
      {
        id: "example-graph-bfs-grid-shortest-path",
        title: "Shortest path in a binary grid",
        language: "javascript",
        runnable: true,
        explanation: "BFS expands one distance layer at a time. The first time the target is reached, that distance is minimal.",
        code:
          "function shortestPathGrid(grid) {\n" +
          "  const rows = grid.length;\n" +
          "  const cols = grid[0]?.length ?? 0;\n" +
          "  if (!rows || !cols || grid[0][0] === 1) return -1;\n" +
          "  const queue = [[0, 0, 0]];\n" +
          "  const seen = new Set(['0,0']);\n" +
          "  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n" +
          "  for (let i = 0; i < queue.length; i += 1) {\n" +
          "    const [r, c, dist] = queue[i];\n" +
          "    if (r === rows - 1 && c === cols - 1) return dist;\n" +
          "    for (const [dr, dc] of dirs) {\n" +
          "      const nr = r + dr;\n" +
          "      const nc = c + dc;\n" +
          "      const key = `${nr},${nc}`;\n" +
          "      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || grid[nr][nc] === 1 || seen.has(key)) continue;\n" +
          "      seen.add(key);\n" +
          "      queue.push([nr, nc, dist + 1]);\n" +
          "    }\n" +
          "  }\n" +
          "  return -1;\n" +
          "}\n"
      }
    ],
    practiceProblems: [
      {
        id: "problem-graph-bfs-medium-number-of-islands-bfs",
        title: "Number of Islands with BFS",
        difficulty: "medium",
        tags: ["graph", "bfs", "grid"],
        prompt: "Given a grid of land and water, count connected land components using BFS. Explain your visited-state strategy.",
        expectedSignals: ["Models grid as graph", "Marks visited once", "Handles boundaries"]
      },
      {
        id: "problem-graph-bfs-hard-word-ladder",
        title: "Word Ladder",
        difficulty: "hard",
        tags: ["graph", "bfs", "shortest-path"],
        prompt: "Find the shortest transformation length from beginWord to endWord. Explain why BFS is required.",
        expectedSignals: ["Uses BFS for shortest path", "Builds neighbors efficiently", "Explains level distance"]
      }
    ],
    interviewQuestions: [
      "Why does BFS give shortest path only for unweighted graphs?",
      "When should visited be marked: enqueue time or dequeue time?",
      "How do you model a grid as a graph?"
    ],
    reviewPrompts: [depthReview("review-graph-bfs-shortest-path", "Review a BFS answer for shortest-path correctness, visited-state timing, and grid boundary handling.")],
    references: graphReferences
  },
  "graph-dfs": {
    theoryAppendix:
      "Deep lesson: Graph DFS is best for reachability, components, cycle detection, and exhaustive traversal where shortest distance is not required. The two most important implementation decisions are graph representation and visited-state semantics. For directed cycle detection, use three colors: unvisited, visiting, and visited.",
    codeExamples: [
      {
        id: "example-graph-dfs-directed-cycle",
        title: "Directed cycle detection",
        language: "javascript",
        runnable: true,
        explanation: "The visiting set catches back edges in the current recursion path.",
        code:
          "function hasDirectedCycle(graph) {\n" +
          "  const visiting = new Set();\n" +
          "  const visited = new Set();\n" +
          "  function dfs(node) {\n" +
          "    if (visiting.has(node)) return true;\n" +
          "    if (visited.has(node)) return false;\n" +
          "    visiting.add(node);\n" +
          "    for (const next of graph.get(node) ?? []) {\n" +
          "      if (dfs(next)) return true;\n" +
          "    }\n" +
          "    visiting.delete(node);\n" +
          "    visited.add(node);\n" +
          "    return false;\n" +
          "  }\n" +
          "  for (const node of graph.keys()) if (dfs(node)) return true;\n" +
          "  return false;\n" +
          "}\n"
      }
    ],
    interviewQuestions: ["DFS vs BFS for graph problems?", "How do you detect a cycle in a directed graph?", "What changes for undirected graphs?"],
    reviewPrompts: [depthReview("review-graph-dfs-cycle", "Review a DFS answer for graph representation, cycle handling, recursion depth, and visited-state semantics.")],
    references: graphReferences
  },
  "topological-sort": {
    theoryAppendix:
      "Deep lesson: Topological sort is dependency ordering for directed acyclic graphs. In interviews, Course Schedule is the canonical form. Kahn's algorithm is often easiest to explain because indegree zero means no remaining prerequisites. If the final order length is less than node count, a cycle prevented completion.",
    practiceProblems: [
      {
        id: "problem-topological-sort-medium-course-schedule",
        title: "Course Schedule",
        difficulty: "medium",
        tags: ["graph", "topological-sort", "dependencies"],
        prompt: "Given courses and prerequisites, return whether all courses can be completed.",
        expectedSignals: ["Builds directed graph", "Uses indegrees or DFS colors", "Detects cycle"]
      }
    ],
    interviewQuestions: ["What graph property is required for topological sort?", "How does Kahn's algorithm detect cycles?", "What does edge direction mean in prerequisite problems?"],
    reviewPrompts: [depthReview("review-topological-sort-dependencies", "Review whether the answer correctly models dependencies, edge direction, and cycle detection.")],
    references: graphReferences
  },
  dijkstra: {
    theoryAppendix:
      "Deep lesson: Dijkstra is BFS generalized to non-negative weighted edges. The priority queue always expands the currently cheapest known node. A stale-entry check is important when the same node enters the queue multiple times with improving distances. If edge weights can be negative, Dijkstra is invalid.",
    practiceProblems: [
      {
        id: "problem-dijkstra-medium-network-delay",
        title: "Network Delay Time",
        difficulty: "medium",
        tags: ["graph", "dijkstra", "shortest-path"],
        prompt: "Given directed weighted edges and a source, compute how long for all nodes to receive the signal.",
        expectedSignals: ["Uses min priority queue", "Handles unreachable nodes", "Explains non-negative weights"]
      }
    ],
    interviewQuestions: ["Why is Dijkstra invalid for negative weights?", "What is the stale-entry optimization?", "How is Dijkstra different from BFS?"],
    reviewPrompts: [depthReview("review-dijkstra-shortest-path", "Review whether the answer handles non-negative weights, priority queue behavior, stale entries, and unreachable nodes.")],
    references: graphReferences
  },
  "union-find": {
    theoryAppendix:
      "Deep lesson: Union Find is the fastest mental model for dynamic undirected connectivity. It is not for directed reachability. Path compression flattens trees during find; union by rank or size prevents tall trees. The pattern appears in redundant connection, connected components, accounts merge, and Kruskal MST.",
    practiceProblems: [
      {
        id: "problem-union-find-medium-accounts-merge",
        title: "Accounts Merge",
        difficulty: "medium",
        tags: ["graph", "union-find", "hash-map"],
        prompt: "Merge accounts that share emails. Explain what each set represents.",
        expectedSignals: ["Maps email to owner/set", "Unions shared emails", "Groups by representative"]
      }
    ],
    interviewQuestions: ["When is Union Find better than DFS?", "What does path compression do?", "Why is Union Find usually for undirected connectivity?"],
    reviewPrompts: [depthReview("review-union-find-connectivity", "Review whether the answer identifies undirected connectivity, representative mapping, path compression, and union strategy.")],
    references: graphReferences
  },
  "multi-az": {
    theoryAppendix:
      "Deep lesson: Multi-AZ is the first AWS reliability move, not an advanced luxury. The goal is to remove a single Availability Zone as a single point of failure. A good design spreads load balancers, compute, and stateful services across at least two AZs, but also checks hidden dependencies such as NAT gateways, subnets, route tables, and database failover behavior.",
    interviewQuestions: ["What hidden single-AZ dependency can break a Multi-AZ design?", "How does RDS Multi-AZ differ from read replicas?", "What should a health check prove before traffic shifts?"],
    reviewPrompts: [depthReview("review-multi-az-architecture", "Review the design for hidden single-AZ dependencies, failover behavior, stateful service placement, and health checks.")],
    references: awsReferences
  },
  "backup-dr": {
    theoryAppendix:
      "Deep lesson: Backup and DR are judged by RPO and RTO. RPO is how much data you can lose; RTO is how long recovery can take. Backups that are not restore-tested are hopes, not plans. A senior AWS answer distinguishes accidental deletion, AZ failure, region failure, corruption, and security compromise.",
    interviewQuestions: ["RPO vs RTO?", "What is the difference between backup and replication?", "How do you prove a DR plan works?"],
    reviewPrompts: [depthReview("review-backup-dr-plan", "Review the DR plan for RPO/RTO clarity, restore testing, corruption handling, regional failure, and runbook ownership.")],
    references: awsReferences
  },
  "hld-payment-system": {
    theoryAppendix:
      "Deep lesson: Payment HLD is a state-machine and ledger problem. The critical requirements are idempotency, auditability, reconciliation, security, and failure handling. Never design money movement as a single opaque API call. Model payment intent, authorization, capture, ledger entry, webhook reconciliation, refund, and dispute states.",
    interviewQuestions: ["Why are idempotency keys mandatory in payments?", "What belongs in the ledger?", "How do you reconcile provider webhooks with internal state?"],
    reviewPrompts: [depthReview("review-payment-hld", "Review the payment design for state transitions, idempotency, ledger integrity, webhooks, retries, reconciliation, and auditability.")],
    references: hldReferences
  },
  "hld-booking-system": {
    theoryAppendix:
      "Deep lesson: Booking HLD is a scarce-inventory concurrency problem. Search availability can be cached or eventually consistent, but final reservation needs strong protection against double booking. Common design choices include holds with expiry, database row locks, conditional writes, idempotent booking requests, and payment timeout release workflows.",
    interviewQuestions: ["How do you prevent double booking?", "What is the difference between hold and confirmed reservation?", "Where can eventual consistency be acceptable?"],
    reviewPrompts: [depthReview("review-booking-hld", "Review the booking design for inventory consistency, hold expiry, payment timeout, cache correctness, and overbooking prevention.")],
    references: hldReferences
  },
  "architecture-review": {
    theoryAppendix:
      "Deep lesson: Architecture review is not design theater. A useful review decides whether the proposal satisfies requirements with acceptable risk. The reviewer should ask for alternatives, failure modes, migration plan, observability, security posture, cost drivers, ownership, and rollback strategy.",
    interviewQuestions: ["How do you review an architecture you disagree with?", "What questions reveal hidden risk?", "How do you balance business urgency and technical quality?"],
    reviewPrompts: [depthReview("review-architecture-review", "Review the architecture-review response for requirements, alternatives, risk framing, migration, observability, security, cost, and decision quality.")],
    references: leadershipReferences
  },
  "incident-leadership": {
    theoryAppendix:
      "Deep lesson: Incident leadership is a coordination skill under uncertainty. The leader's job is to stabilize, assign roles, keep communication crisp, make reversible decisions, track timeline, and protect responders from chaos. After mitigation, the system needs a blameless review focused on contributing factors and durable prevention.",
    interviewQuestions: ["What are the first five minutes of incident leadership?", "How do you communicate uncertainty?", "What makes a good postmortem action item?"],
    reviewPrompts: [depthReview("review-incident-leadership", "Review the incident-leadership response for role assignment, mitigation bias, communication cadence, timeline control, and durable follow-up.")],
    references: leadershipReferences
  }
};
