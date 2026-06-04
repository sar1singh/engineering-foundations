import type { DailyMission } from "@/types/founder-beta";

export const founderBetaDailyMissions: DailyMission[] = [
  {
    id: "mission-learn-aws-well-architected",
    missionType: "learn",
    objective: "Understand the AWS Well-Architected pillars and map them to Solution Architect interview expectations.",
    capabilityId: "cap-aws-cloud-architecture",
    topicId: "topic-aws-well-architected",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-load-balancing"],
    tasks: [
      {
        id: "task-read-pillars",
        description: "Review the pillars and write one founder-beta use case for each.",
        expectedOutput: "Five short pillar notes tied to EngineeringOS."
      }
    ],
    proofRequirements: [
      {
        id: "proof-aws-pillar-summary",
        proofType: "aws-design",
        title: "AWS Well-Architected pillar summary",
        requiredScore: 3,
        rubric: ["Covers all pillars", "Uses original wording", "Connects to a real architecture decision"]
      }
    ],
    readinessImpact: ["AWS Readiness", "Architect Readiness", "Knowledge"]
  },
  {
    id: "mission-practice-api-design",
    missionType: "practice",
    objective: "Draft an API contract for a roadmap projection endpoint.",
    capabilityId: "cap-node-backend",
    topicId: "topic-api-design",
    estimatedMinutes: 75,
    mode: "weekday",
    prerequisiteTopicIds: [],
    tasks: [
      {
        id: "task-api-contract",
        description: "Define request, response, error states, pagination, and versioning for a projection API.",
        expectedOutput: "API contract with edge cases and error handling."
      }
    ],
    proofRequirements: [
      {
        id: "proof-api-contract",
        proofType: "lld",
        title: "Roadmap projection API contract",
        requiredScore: 3,
        rubric: ["Clear inputs", "Clear response shape", "Failure states included", "Versioning considered"]
      }
    ],
    readinessImpact: ["Node.js Backend", "System Design Readiness", "Practice"]
  },
  {
    id: "mission-implement-rate-limiter",
    missionType: "implement",
    objective: "Design a rate limiter for a mission generation API.",
    capabilityId: "cap-system-design-hld",
    topicId: "topic-rate-limiting",
    estimatedMinutes: 90,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-api-design", "topic-redis-caching"],
    tasks: [
      {
        id: "task-rate-limiter-design",
        description: "Choose an algorithm, define keys/windows, and explain Redis failure handling.",
        expectedOutput: "LLD/HLD hybrid note with tradeoffs."
      }
    ],
    proofRequirements: [
      {
        id: "proof-rate-limiter",
        proofType: "lld",
        title: "Rate limiter design note",
        requiredScore: 3,
        rubric: ["Algorithm selected", "Redis tradeoffs covered", "Failure behavior explained", "Abuse cases considered"]
      }
    ],
    readinessImpact: ["System Design Readiness", "Implementation", "Interview Readiness"]
  },
  {
    id: "mission-interview-caching-tradeoffs",
    missionType: "interview",
    objective: "Answer a senior system-design prompt on cache placement, invalidation, and failure modes.",
    capabilityId: "cap-system-design-hld",
    topicId: "topic-caching",
    estimatedMinutes: 45,
    mode: "weekday",
    prerequisiteTopicIds: ["topic-redis-caching"],
    tasks: [
      {
        id: "task-cache-answer",
        description: "Write or speak a concise answer covering cache-aside, TTL, invalidation, stampede, and fallback.",
        expectedOutput: "Interview-style answer with follow-up tradeoffs."
      }
    ],
    proofRequirements: [
      {
        id: "proof-caching-interview",
        proofType: "hld",
        title: "Caching tradeoff interview answer",
        requiredScore: 4,
        rubric: ["Structured answer", "Failure modes included", "Tradeoffs explicit", "Follow-ups handled"]
      }
    ],
    readinessImpact: ["Interview Readiness", "System Design Readiness", "Communication Readiness"]
  },
  {
    id: "mission-behavioral-star-ownership",
    missionType: "behavioral",
    objective: "Create an ownership STAR story from EngineeringOS or prior backend work.",
    capabilityId: "cap-behavioral-communication",
    topicId: "topic-behavioral-star-stories",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: [],
    tasks: [
      {
        id: "task-star-story",
        description: "Write context, personal role, action, tradeoffs, result, metrics, and two follow-up answers.",
        expectedOutput: "One interview-ready STAR story draft."
      }
    ],
    proofRequirements: [
      {
        id: "proof-ownership-story",
        proofType: "behavioral-answer",
        title: "Ownership STAR story",
        requiredScore: 4,
        rubric: ["Real experience", "Personal action clear", "Metrics included", "Reflection included", "Follow-ups ready"]
      }
    ],
    readinessImpact: ["Behavioral Readiness", "Communication Readiness", "Offer Readiness"]
  },
  {
    id: "mission-career-resume-positioning",
    missionType: "career-asset",
    objective: "Rewrite the top resume summary and three bullets for Solution Architect positioning.",
    capabilityId: "cap-career-assets",
    topicId: "topic-resume-positioning",
    estimatedMinutes: 60,
    mode: "weekday",
    prerequisiteTopicIds: [],
    tasks: [
      {
        id: "task-resume-bullets",
        description: "Draft one target-role summary and three architecture/impact bullets.",
        expectedOutput: "Resume summary plus three measurable senior-impact bullets."
      }
    ],
    proofRequirements: [
      {
        id: "proof-resume-positioning",
        proofType: "resume-review",
        title: "Solution Architect resume positioning",
        requiredScore: 4,
        rubric: ["Target role clear", "Architecture impact visible", "Metrics included", "No generic claims"]
      }
    ],
    readinessImpact: ["Resume Readiness", "Offer Readiness"]
  },
  {
    id: "mission-case-study-engineeringos-hld",
    missionType: "architecture-case-study",
    objective: "Create the first HLD artifact for the EngineeringOS Architecture case study.",
    capabilityId: "cap-career-assets",
    topicId: "topic-engineeringos-architecture-case-study",
    estimatedMinutes: 180,
    mode: "weekend",
    prerequisiteTopicIds: ["topic-api-design", "topic-load-balancing", "topic-aws-well-architected"],
    tasks: [
      {
        id: "task-engineeringos-hld",
        description: "Define requirements, modules, APIs, storage, scaling path, AWS deployment, and failure modes.",
        expectedOutput: "HLD artifact for EngineeringOS Architecture."
      },
      {
        id: "task-engineeringos-review",
        description: "Add a Well-Architected review with reliability, security, cost, operations, and performance notes.",
        expectedOutput: "Architecture review section attached to the case study."
      }
    ],
    proofRequirements: [
      {
        id: "proof-engineeringos-case-study",
        proofType: "case-study",
        title: "EngineeringOS Architecture case study HLD",
        requiredScore: 4,
        rubric: ["Requirements clear", "Architecture coherent", "AWS tradeoffs included", "Failure modes covered", "Interview narrative usable"]
      }
    ],
    readinessImpact: ["Architect Readiness", "AWS Readiness", "Communication Readiness", "Architecture Case Study Readiness"]
  }
];
