import { founderBetaCapabilities } from "@/data/founder-beta/capabilities";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { dsaProblemBank } from "@/data/founder-beta/dsa-problem-bank";
import { founderBetaSkills } from "@/data/founder-beta/capabilities";
import { founderArchitectBetaRoadmapProjection } from "@/data/founder-beta/roadmap-projection";
import type {
  Capability,
  MasterTopic,
  RoadmapPhase,
  RoadmapProjectionResult,
  RoadmapWeek,
  Skill
} from "@/types/founder-beta";

export type RoadmapProjectionInput = {
  capabilityReadinessById?: Record<string, number>;
  topicReadinessById?: Record<string, number>;
  completedTopicIds?: string[];
  weakAreaCapabilityIds?: string[];
  weakAreaTopicIds?: string[];
  availableHoursPerWeek?: number;
  timelineWeeks?: number;
};

const allCanonicalTopics: MasterTopic[] = [...founderBetaMasterTopics, ...dsaProblemBank];
const allTopicMap = new Map<string, MasterTopic>();
for (const topic of allCanonicalTopics) {
  allTopicMap.set(topic.id, topic);
}

const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: "phase-backend-foundations",
    label: "Backend Foundations",
    weekStart: 1,
    weekEnd: 3,
    focus: "Strengthen Node.js production backend, databases, LLD, and senior-backend DSA as the foundation for architect-level depth.",
    capabilityIds: ["cap-node-backend", "cap-low-level-design", "cap-databases", "cap-dsa-problem-solving"],
    skillIds: [
      "skill-api-contract-design", "skill-backend-service-structure", "skill-node-production-backend", "skill-node-observability",
      "skill-lld-api-modeling", "skill-lld-workflow-modeling",
      "skill-data-modeling", "skill-data-access-performance",
      "skill-dsa-patterns", "skill-dsa-communication",
      "skill-dsa-complexity-analysis", "skill-dsa-array-techniques", "skill-dsa-string-techniques",
      "skill-dsa-hashing-techniques", "skill-dsa-two-pointer-techniques", "skill-dsa-sliding-window-techniques",
      "skill-dsa-binary-search-techniques", "skill-dsa-linked-list-techniques", "skill-dsa-stack-techniques",
      "skill-dsa-queue-techniques", "skill-dsa-sorting-techniques", "skill-dsa-recursion-techniques",
      "skill-dsa-tree-techniques", "skill-dsa-bst-techniques", "skill-dsa-heap-techniques"
    ],
    topicIds: [
      "topic-api-design", "topic-api-versioning", "topic-idempotency-keys",
      "topic-service-boundaries", "topic-error-handling", "topic-configuration-management",
      "topic-node-runtime", "topic-node-async-event-loop", "topic-node-streams-backpressure",
      "topic-node-testing-strategy", "topic-node-logging", "topic-node-graceful-shutdown",
      "topic-node-performance-profiling",
      "topic-database-indexing", "topic-postgres-schema-design", "topic-postgres-query-planning",
      "topic-transactions-isolation", "topic-redis-caching",
      "topic-lld-api-contracts", "topic-lld-rate-limiter", "topic-lld-cache-design",
      "topic-lld-workflow-engine", "topic-lld-scheduler",
      "topic-dsa-arrays-hashing", "topic-dsa-two-pointers-sliding-window",
      "topic-dsa-trees-graphs", "topic-dsa-heaps-greedy-dp",
      "topic-dsa-complexity-analysis", "topic-dsa-interview-communication",
      "topic-dsa-big-o-notation", "topic-dsa-time-complexity", "topic-dsa-space-complexity",
      "topic-dsa-array-two-sum", "topic-dsa-array-maximum-subarray", "topic-dsa-array-product-except-self",
      "topic-dsa-array-rotate-array", "topic-dsa-array-move-zeroes", "topic-dsa-array-best-time-stock",
      "topic-dsa-string-valid-palindrome", "topic-dsa-string-longest-substring", "topic-dsa-string-group-anagrams",
      "topic-dsa-string-longest-palindrome", "topic-dsa-string-reverse-words",
      "topic-dsa-hash-two-sum", "topic-dsa-hash-longest-consecutive",
      "topic-dsa-two-pointer-container-water", "topic-dsa-two-pointer-three-sum",
      "topic-dsa-sliding-maximum", "topic-dsa-sliding-longest-repeating",
      "topic-dsa-binary-search-basic", "topic-dsa-binary-search-rotated",
      "topic-dsa-linked-list-reverse", "topic-dsa-linked-list-cycle", "topic-dsa-linked-list-merge-sorted",
      "topic-dsa-stack-valid-parentheses", "topic-dsa-stack-next-greater",
      "topic-dsa-queue-implement",
      "topic-dsa-sorting-quicksort", "topic-dsa-sorting-mergesort",
      "topic-dsa-recursion-basics",
      "topic-dsa-tree-traversal", "topic-dsa-tree-max-depth", "topic-dsa-tree-lca",
      "topic-dsa-bst-validate",
      "topic-dsa-heap-kth-largest", "topic-dsa-heap-top-k-frequent"
    ]
  },
  {
    id: "phase-system-design-foundations",
    label: "System Design Foundations",
    weekStart: 4,
    weekEnd: 6,
    focus: "Build structured HLD capability covering requirements framing, capacity estimation, tradeoff analysis, caching, load balancing, and core distributed patterns.",
    capabilityIds: ["cap-system-design-hld", "cap-distributed-systems", "cap-databases"],
    skillIds: [
      "skill-hld-requirements", "skill-hld-tradeoffs", "skill-hld-interview-execution",
      "skill-distributed-consistency", "skill-async-architecture",
      "skill-data-modeling", "skill-data-access-performance"
    ],
    topicIds: [
      "topic-hld-requirements", "topic-hld-capacity-estimation", "topic-hld-interview-structure",
      "topic-architecture-tradeoffs",
      "topic-caching", "topic-cache-invalidation", "topic-rate-limiting", "topic-load-balancing",
      "topic-queues", "topic-event-driven-architecture", "topic-outbox-pattern",
      "topic-saga-workflows", "topic-retries-backoff",
      "topic-consistency-models", "topic-replication-partitioning", "topic-data-partitioning",
      "topic-notification-system-design"
    ]
  },
  {
    id: "phase-cloud-architecture",
    label: "Cloud Architecture",
    weekStart: 7,
    weekEnd: 9,
    focus: "Master AWS services, Well-Architected Framework, security patterns, and reliability/observability design for Solution Architect readiness.",
    capabilityIds: ["cap-aws-cloud-architecture", "cap-security", "cap-reliability-observability"],
    skillIds: [
      "skill-aws-foundations", "skill-aws-architecture-review", "skill-aws-data-messaging",
      "skill-auth-boundaries", "skill-threat-modeling",
      "skill-reliability-engineering", "skill-observability-design"
    ],
    topicIds: [
      "topic-aws-well-architected", "topic-aws-iam-basics", "topic-aws-vpc-networking",
      "topic-aws-compute-options", "topic-aws-rds-basics", "topic-aws-dynamodb-basics",
      "topic-aws-s3-basics", "topic-aws-sqs-sns-eventbridge", "topic-aws-cloudfront-cdn",
      "topic-aws-multi-az-design", "topic-rto-rpo-dr", "topic-aws-cost-performance-tradeoffs",
      "topic-cloudwatch-observability", "topic-dynamodb-data-modeling",
      "topic-authentication-authorization", "topic-oauth2-oidc", "topic-jwt-sessions",
      "topic-rbac-abac", "topic-threat-modeling", "topic-api-security", "topic-secrets-management",
      "topic-slos-slas", "topic-observability-logs-metrics-traces", "topic-alerting-runbooks",
      "topic-failure-modes", "topic-graceful-degradation", "topic-incident-response",
      "topic-postmortem-writing"
    ]
  },
  {
    id: "phase-distributed-systems",
    label: "Distributed Systems",
    weekStart: 10,
    weekEnd: 11,
    focus: "Deepen distributed systems knowledge with advanced consistency, async workflows, reliability patterns, and failure analysis.",
    capabilityIds: ["cap-distributed-systems", "cap-reliability-observability", "cap-system-design-hld"],
    skillIds: [
      "skill-distributed-consistency", "skill-async-architecture",
      "skill-reliability-engineering", "skill-observability-design",
      "skill-hld-tradeoffs"
    ],
    topicIds: [
      "topic-idempotency-keys", "topic-retries-backoff",
      "topic-event-driven-architecture", "topic-outbox-pattern", "topic-saga-workflows",
      "topic-consistency-models", "topic-replication-partitioning",
      "topic-failure-modes", "topic-graceful-degradation", "topic-incident-response",
      "topic-postmortem-writing", "topic-alerting-runbooks",
      "topic-large-scale-learning-platform-design"
    ]
  },
  {
    id: "phase-architecture-communication",
    label: "Architecture & Communication",
    weekStart: 12,
    weekEnd: 13,
    focus: "Integrate architecture tradeoff communication, case study creation, behavioral storytelling, and delivery leadership evidence.",
    capabilityIds: ["cap-system-design-hld", "cap-behavioral-communication", "cap-delivery-leadership", "cap-architecture-case-studies"],
    skillIds: [
      "skill-hld-tradeoffs", "skill-hld-interview-execution",
      "skill-senior-storytelling", "skill-communication-tradeoffs",
      "skill-delivery-risk", "skill-incident-leadership",
      "skill-case-study-hld", "skill-case-study-review"
    ],
    topicIds: [
      "topic-architecture-tradeoffs", "topic-architecture-review-communication",
      "topic-hld-interview-structure", "topic-communication-tradeoffs",
      "topic-behavioral-star-stories", "topic-ownership-story", "topic-incident-story",
      "topic-stakeholder-update", "topic-delivery-risk-communication",
      "topic-cross-team-dependency-management", "topic-mentoring-senior-engineers",
      "topic-engineeringos-architecture-case-study",
      "topic-case-study-tradeoff-review", "topic-case-study-behavioral-narrative"
    ]
  },
  {
    id: "phase-interview-offer-readiness",
    label: "Interview & Offer Readiness",
    weekStart: 14,
    weekEnd: 16,
    focus: "Complete architecture case studies, polish career assets, build offer readiness gates, and finalize interview preparation across behavioral, HLD, DSA, and advanced problem solving.",
    capabilityIds: ["cap-behavioral-communication", "cap-career-assets", "cap-offer-readiness", "cap-architecture-case-studies", "cap-dsa-problem-solving"],
    skillIds: [
      "skill-senior-storytelling", "skill-communication-tradeoffs",
      "skill-architect-positioning", "skill-proof-of-work-packaging",
      "skill-offer-gates", "skill-interview-pipeline",
      "skill-case-study-hld", "skill-case-study-review",
      "skill-dsa-patterns", "skill-dsa-communication",
      "skill-dsa-greedy-techniques", "skill-dsa-backtracking-techniques",
      "skill-dsa-graph-techniques", "skill-dsa-dp-techniques"
    ],
    topicIds: [
      "topic-behavioral-star-stories", "topic-ownership-story", "topic-incident-story",
      "topic-communication-tradeoffs", "topic-architecture-review-communication",
      "topic-engineeringos-architecture-case-study", "topic-agent-os-architecture-case-study",
      "topic-large-scale-learning-platform-case-study",
      "topic-case-study-tradeoff-review", "topic-case-study-behavioral-narrative",
      "topic-resume-positioning", "topic-linkedin-positioning",
      "topic-github-portfolio-positioning", "topic-github-proof-of-work",
      "topic-portfolio-case-study-packaging",
      "topic-application-readiness-gates", "topic-compensation-targeting",
      "topic-referral-outreach", "topic-application-tracker",
      "topic-interview-pipeline-management", "topic-negotiation-awareness",
      "topic-dsa-complexity-analysis", "topic-dsa-interview-communication",
      "topic-dsa-heaps-greedy-dp",
      "topic-dsa-greedy-jump-game", "topic-dsa-greedy-interval-scheduling",
      "topic-dsa-backtracking-subsets", "topic-dsa-backtracking-permutations",
      "topic-dsa-graph-bfs", "topic-dsa-graph-dfs", "topic-dsa-graph-number-islands",
      "topic-dsa-graph-course-schedule",
      "topic-dsa-dp-climbing-stairs", "topic-dsa-dp-coin-change",
      "topic-dsa-dp-longest-increasing", "topic-dsa-dp-knapsack", "topic-dsa-dp-house-robber",
      "topic-hld-interview-structure"
    ]
  }
];

export class FounderBetaRoadmapProjection {
  generateProjection(input: RoadmapProjectionInput = {}): RoadmapProjectionResult {
    const capabilities = founderBetaCapabilities;
    const allSkills = founderBetaSkills;
    const weakCapIds = new Set(input.weakAreaCapabilityIds ?? []);
    const weakTopicIds = new Set(input.weakAreaTopicIds ?? []);
    const completedTopics = new Set(input.completedTopicIds ?? []);
    const timelineWeeks = input.timelineWeeks ?? founderArchitectBetaRoadmapProjection.timelineWeeks;
    const hoursPerWeek = input.availableHoursPerWeek ?? founderArchitectBetaRoadmapProjection.hoursPerWeek;
    const topicReadinessById = input.topicReadinessById ?? {};

    const phases = this.buildPrioritizedPhases(weakCapIds, weakTopicIds);
    const weeklyBreakdown = this.buildWeeklyBreakdown(phases, timelineWeeks, hoursPerWeek, completedTopics, weakTopicIds, topicReadinessById);
    const priorityCapabilityOrder = this.buildPriorityCapabilityOrder(capabilities, weakCapIds, input.capabilityReadinessById ?? {});
    const recommendedSkillOrder = this.buildRecommendedSkillOrder(allSkills, phases, weakCapIds);
    const recommendedTopicProgression = this.buildTopicProgression(phases, completedTopics, weakTopicIds, topicReadinessById);

    return {
      id: "founder-architect-16-week-roadmap",
      target: "Solution Architect",
      timelineWeeks,
      hoursPerWeek,
      phases,
      weeklyBreakdown,
      priorityCapabilityOrder,
      recommendedSkillOrder,
      recommendedTopicProgression
    };
  }

  private buildPrioritizedPhases(
    weakCapIds: Set<string>,
    weakTopicIds: Set<string>
  ): RoadmapPhase[] {
    const hasWeakAreas = weakCapIds.size > 0 || weakTopicIds.size > 0;

    if (!hasWeakAreas) {
      return ROADMAP_PHASES;
    }

    const scored = ROADMAP_PHASES.map((phase) => {
      const capOverlap = phase.capabilityIds.filter((cid) => weakCapIds.has(cid)).length;
      const topicOverlap = phase.topicIds.filter((tid) => weakTopicIds.has(tid)).length;
      const relevanceScore = capOverlap * 3 + topicOverlap;
      return { phase, relevanceScore };
    });

    const prioritized = [...scored].sort((a, b) => {
      if (a.relevanceScore !== b.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }

      return ROADMAP_PHASES.indexOf(a.phase) - ROADMAP_PHASES.indexOf(b.phase);
    });

    let weekCursor = 1;
    const phases = prioritized.map(({ phase }) => {
      const weekCount = phase.weekEnd - phase.weekStart + 1;
      const adjusted: RoadmapPhase = {
        ...phase,
        weekStart: weekCursor,
        weekEnd: weekCursor + weekCount - 1
      };
      weekCursor += weekCount;
      return adjusted;
    });

    return phases;
  }

  private buildWeeklyBreakdown(
    phases: RoadmapPhase[],
    timelineWeeks: number,
    hoursPerWeek: number,
    completedTopics: Set<string>,
    weakTopicIds: Set<string>,
    topicReadinessById: Record<string, number>
  ): RoadmapWeek[] {
    const weeks: RoadmapWeek[] = [];

    for (let week = 1; week <= timelineWeeks; week++) {
      const phase = phases.find((p) => week >= p.weekStart && week <= p.weekEnd);

      if (!phase) {
        continue;
      }

      const phaseWeeks = phase.weekEnd - phase.weekStart + 1;
      const weekInPhase = week - phase.weekStart;
      const chunkSize = Math.max(1, Math.ceil(phase.topicIds.length / phaseWeeks));
      const start = weekInPhase * chunkSize;
      const weekTopicIds = phase.topicIds.slice(start, start + chunkSize);

      const filteredTopics = weekTopicIds.filter((tid) => {
        if (completedTopics.has(tid)) {
          return false;
        }

        return true;
      });

      const sortedTopics = [...filteredTopics].sort((a, b) => {
        const aWeak = weakTopicIds.has(a) ? 1 : 0;
        const bWeak = weakTopicIds.has(b) ? 1 : 0;
        if (aWeak !== bWeak) return bWeak - aWeak;

        const aReadiness = topicReadinessById[a] ?? 50;
        const bReadiness = topicReadinessById[b] ?? 50;
        return aReadiness - bReadiness;
      });

      weeks.push({
        weekNumber: week,
        phaseId: phase.id,
        phaseLabel: phase.label,
        focusCapabilityIds: phase.capabilityIds,
        focusSkillIds: phase.skillIds,
        focusTopicIds: sortedTopics.length > 0 ? sortedTopics : phase.topicIds.slice(start, start + chunkSize),
        estimatedHours: hoursPerWeek
      });
    }

    return weeks;
  }

  private buildPriorityCapabilityOrder(
    capabilities: Capability[],
    weakCapIds: Set<string>,
    capabilityReadinessById: Record<string, number>
  ): string[] {
    const withScore = capabilities.map((cap) => {
      const readiness = capabilityReadinessById[cap.id] ?? 0;
      const isWeak = weakCapIds.has(cap.id);
      const gap = Math.max(0, cap.readinessThreshold - readiness);

      const priorityScore = (gap * (isWeak ? 2 : 1) + (isWeak ? 50 : 0)) * (cap.priorityWeight / 10);

      return { id: cap.id, priorityScore, gap };
    });

    return withScore
      .sort((a, b) => b.priorityScore - a.priorityScore || b.gap - a.gap)
      .map((c) => c.id);
  }

  private buildRecommendedSkillOrder(
    skills: Skill[],
    phases: RoadmapPhase[],
    weakCapIds: Set<string>
  ): string[] {
    const phaseCapIds = new Set(phases.flatMap((p) => p.capabilityIds));
    const phaseSkillIds = new Set(phases.flatMap((p) => p.skillIds));

    const relevant = skills.filter((s) => phaseSkillIds.has(s.id) && phaseCapIds.has(s.capabilityId));

    const withScore = relevant.map((skill) => ({
      id: skill.id,
      phaseIndex: phases.findIndex((p) => p.skillIds.includes(skill.id)),
      isWeakArea: weakCapIds.has(skill.capabilityId)
    }));

    return withScore
      .sort((a, b) => {
        if (a.isWeakArea !== b.isWeakArea) return a.isWeakArea ? -1 : 1;
        return a.phaseIndex - b.phaseIndex;
      })
      .map((s) => s.id);
  }

  private buildTopicProgression(
    phases: RoadmapPhase[],
    completedTopics: Set<string>,
    weakTopicIds: Set<string>,
    topicReadinessById: Record<string, number>
  ): string[] {
    const progression: string[] = [];

    for (const phase of phases) {
      const phaseTopics = [...phase.topicIds].filter((tid) => !completedTopics.has(tid));

      phaseTopics.sort((a, b) => {
        const aWeak = weakTopicIds.has(a) ? 1 : 0;
        const bWeak = weakTopicIds.has(b) ? 1 : 0;
        if (aWeak !== bWeak) return bWeak - aWeak;

        const aReadiness = topicReadinessById[a] ?? 50;
        const bReadiness = topicReadinessById[b] ?? 50;
        return aReadiness - bReadiness;
      });

      progression.push(...phaseTopics);
    }

    const prerequisitesFirst = this.reorderPrerequisites(progression, completedTopics);

    return prerequisitesFirst;
  }

  private reorderPrerequisites(topicIds: string[], completedTopics: Set<string> = new Set()): string[] {
    const result: string[] = [];
    const placed = new Set(completedTopics);

    for (const tid of topicIds) {
      if (completedTopics.has(tid)) continue;
      this.placeWithPrerequisites(tid, result, placed, new Set(), completedTopics);
    }

    const remaining = topicIds.filter((tid) => !placed.has(tid));
    result.push(...remaining);

    return result;
  }

  private placeWithPrerequisites(
    topicId: string,
    result: string[],
    placed: Set<string>,
    visiting: Set<string>,
    completedTopics: Set<string> = new Set()
  ): void {
    if (placed.has(topicId) || visiting.has(topicId) || completedTopics.has(topicId)) {
      return;
    }

    const topic = allTopicMap.get(topicId);
    if (!topic) {
      placed.add(topicId);
      result.push(topicId);
      return;
    }

    visiting.add(topicId);

    for (const prereqId of topic.prerequisiteTopicIds) {
      if (!placed.has(prereqId) && !completedTopics.has(prereqId)) {
        this.placeWithPrerequisites(prereqId, result, placed, visiting, completedTopics);
      }
    }

    visiting.delete(topicId);
    placed.add(topicId);
    result.push(topicId);
  }
}

export const founderBetaRoadmapProjection = new FounderBetaRoadmapProjection();
