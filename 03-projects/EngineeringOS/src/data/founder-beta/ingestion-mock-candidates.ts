import type { RawContentCandidate, TopicMappingCandidate, SourceMappingCandidate, ContentQualityReview, ContentApprovalDecision, ContentIngestionError, ContentSourceType, ContentTier, IngestionDiscoveryMethod } from "@/types/content-ingestion";

export type MockIngestionScenario = {
  candidate: RawContentCandidate;
  description: string;
  label: "valid" | "invalid" | "weak" | "duplicate-risk" | "publish-ready";
  applyPreview: {
    normalizedItemId: string;
    topicMappings: TopicMappingCandidate[];
    sourceMappings: SourceMappingCandidate[];
    review: ContentQualityReview;
    errors: ContentIngestionError[];
    decision: ContentApprovalDecision | null;
  };
};

export const MOCK_INGESTION_CANDIDATES: MockIngestionScenario[] = [
  {
    label: "publish-ready",
    description: "A strong AWS candidate that passes all gates and reaches published",
    candidate: {
      id: "mock-cand-001",
      title: "AWS Well-Architected Framework - Reliability Pillar Deep Dive",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html",
      sourceType: "official-docs",
      tier: "tier-1",
      category: "aws",
      description: "Deep dive into the AWS Well-Architected Reliability Pillar with best practices for resilient architectures.",
      discoveryMethod: "manual",
      discoveredAt: "2026-06-09T08:00:00Z",
      discoveredBy: "curator-sarwan",
      tags: ["aws", "well-architected", "reliability", "resilience", "ha"],
      estimatedConfidence: 0.92
    },
    applyPreview: {
      normalizedItemId: "norm-mock-001",
      topicMappings: [
        {
          id: "map-t-mock-001",
          normalizedItemId: "norm-mock-001",
          topicId: "topic-aws-well-architected",
          topicName: "AWS Well-Architected Framework",
          capabilityIds: ["cap-aws-cloud-architecture"],
          skillIds: ["skill-aws-architecture-review"],
          relevanceScore: 0.95,
          mappedBy: "curator-sarwan",
          mappedAt: "2026-06-09T08:05:00Z",
          notes: "Direct fit - reliability pillar belongs under Well-Architected"
        }
      ],
      sourceMappings: [
        {
          id: "map-s-mock-001",
          normalizedItemId: "norm-mock-001",
          sourceId: "aws-well-architected",
          sourceTitle: "AWS Well-Architected Framework",
          mappedBy: "curator-sarwan",
          mappedAt: "2026-06-09T08:05:00Z",
          notes: "Matches existing catalog source"
        }
      ],
      review: {
        id: "rev-mock-001",
        normalizedItemId: "norm-mock-001",
        reviewerId: "reviewer-sarwan",
        reviewedAt: "2026-06-09T08:10:00Z",
        urlReachable: true,
        contentFreshnessScore: 0.95,
        technicalAccuracyScore: 0.93,
        relevanceScore: 0.96,
        authorityScore: 0.98,
        overallScore: 0.94,
        issues: [],
        recommendations: ["Consider adding a companion guide on Multi-AZ patterns"],
        passed: true
      },
      errors: [],
      decision: {
        id: "dec-mock-001",
        normalizedItemId: "norm-mock-001",
        decision: "approved",
        decidedBy: "reviewer-sarwan",
        decidedAt: "2026-06-09T08:15:00Z",
        reason: "Excellent quality, authoritative source, directly relevant to Architect capability",
        nextStatus: "published"
      }
    }
  },
  {
    label: "valid",
    description: "A valid LLD candidate that passes structural validation and quality review",
    candidate: {
      id: "mock-cand-002",
      title: "Grokking the Low Level Design Interview",
      url: "https://www.educative.io/courses/grokking-low-level-design-interview",
      sourceType: "interview-guide",
      tier: "tier-2",
      category: "lld",
      description: "Comprehensive course covering OOP design patterns, SOLID principles, and common LLD interview problems.",
      discoveryMethod: "curator-suggestion",
      discoveredAt: "2026-06-09T09:00:00Z",
      discoveredBy: "curator-alice",
      tags: ["lld", "design-patterns", "oop", "solid"],
      estimatedConfidence: 0.78
    },
    applyPreview: {
      normalizedItemId: "norm-mock-002",
      topicMappings: [
        {
          id: "map-t-mock-002",
          normalizedItemId: "norm-mock-002",
          topicId: "topic-lld-api-contracts",
          topicName: "LLD API Contracts & Design",
          capabilityIds: ["cap-low-level-design"],
          skillIds: ["skill-lld-api-modeling"],
          relevanceScore: 0.85,
          mappedBy: "curator-alice",
          mappedAt: "2026-06-09T09:05:00Z",
          notes: "Covers OOP and design patterns relevant to LLD"
        }
      ],
      sourceMappings: [
        {
          id: "map-s-mock-002",
          normalizedItemId: "norm-mock-002",
          sourceId: "educative-grokking-coding",
          sourceTitle: "Educative - Grokking Coding Interview",
          mappedBy: "curator-alice",
          mappedAt: "2026-06-09T09:05:00Z",
          notes: "New educative LLD-specific resource"
        }
      ],
      review: {
        id: "rev-mock-002",
        normalizedItemId: "norm-mock-002",
        reviewerId: "reviewer-sarwan",
        reviewedAt: "2026-06-09T09:10:00Z",
        urlReachable: true,
        contentFreshnessScore: 0.85,
        technicalAccuracyScore: 0.80,
        relevanceScore: 0.88,
        authorityScore: 0.75,
        overallScore: 0.82,
        issues: ["Could benefit from more code examples in later chapters"],
        recommendations: ["Pair with actual LLD coding practice on CodeZym"],
        passed: true
      },
      errors: [],
      decision: {
        id: "dec-mock-002",
        normalizedItemId: "norm-mock-002",
        decision: "approved",
        decidedBy: "reviewer-sarwan",
        decidedAt: "2026-06-09T09:15:00Z",
        reason: "Solid LLD resource with good coverage of patterns",
        nextStatus: "published"
      }
    }
  },
  {
    label: "invalid",
    description: "An invalid candidate with missing required fields",
    candidate: {
      id: "",
      title: "",
      url: "ftp://bad-protocol.com",
      sourceType: "" as ContentSourceType,
      tier: "" as ContentTier,
      category: "",
      description: "This candidate has no valid data.",
      discoveryMethod: "" as IngestionDiscoveryMethod,
      discoveredAt: "",
      discoveredBy: "",
      tags: [],
      estimatedConfidence: 2.5
    },
    applyPreview: {
      normalizedItemId: "norm-mock-003",
      topicMappings: [],
      sourceMappings: [],
      review: {
        id: "rev-mock-003",
        normalizedItemId: "norm-mock-003",
        reviewerId: "",
        reviewedAt: "",
        urlReachable: false,
        contentFreshnessScore: 0,
        technicalAccuracyScore: 0,
        relevanceScore: 0,
        authorityScore: 0,
        overallScore: 0,
        issues: ["Missing all fields"],
        recommendations: [],
        passed: false
      },
      errors: [
        { id: "err-mock-003", batchId: "batch-003", candidateId: "mock-cand-003", stage: "discovered", severity: "critical", message: "Candidate id is required", details: "Empty id field", timestamp: "2026-06-09T10:00:00Z", resolved: false },
        { id: "err-mock-004", batchId: "batch-003", candidateId: "mock-cand-003", stage: "discovered", severity: "critical", message: "Candidate title is required", details: "Empty title field", timestamp: "2026-06-09T10:00:00Z", resolved: false },
        { id: "err-mock-005", batchId: "batch-003", candidateId: "mock-cand-003", stage: "discovered", severity: "high", message: "Invalid URL protocol", details: "Must be http/https", timestamp: "2026-06-09T10:00:00Z", resolved: false }
      ],
      decision: {
        id: "dec-mock-003",
        normalizedItemId: "norm-mock-003",
        decision: "rejected",
        decidedBy: "system",
        decidedAt: "2026-06-09T10:05:00Z",
        reason: "Structural validation failed - missing id, title, invalid URL",
        nextStatus: "rejected"
      }
    }
  },
  {
    label: "weak",
    description: "A low-confidence candidate that fails quality review and gets rejected",
    candidate: {
      id: "mock-cand-004",
      title: "Random Blog Post on System Design",
      url: "https://example.com/random-system-design-post",
      sourceType: "engineering-blog",
      tier: "tier-4",
      category: "hld",
      description: "A personal blog post about system design with no peer review or authority.",
      discoveryMethod: "agent-discovery",
      discoveredAt: "2026-06-09T11:00:00Z",
      discoveredBy: "discovery-agent-v1",
      tags: [],
      estimatedConfidence: 0.35
    },
    applyPreview: {
      normalizedItemId: "norm-mock-004",
      topicMappings: [
        {
          id: "map-t-mock-004",
          normalizedItemId: "norm-mock-004",
          topicId: "topic-hld-fundamentals",
          topicName: "HLD Fundamentals",
          capabilityIds: ["cap-system-design-hld"],
          skillIds: ["skill-hld-requirements"],
          relevanceScore: 0.45,
          mappedBy: "discovery-agent-v1",
          mappedAt: "2026-06-09T11:05:00Z",
          notes: "Marginal relevance - blog post touches on HLD concepts"
        }
      ],
      sourceMappings: [
        {
          id: "map-s-mock-004",
          normalizedItemId: "norm-mock-004",
          sourceId: "brand-new-blog-source",
          sourceTitle: "Example Engineering Blog",
          mappedBy: "discovery-agent-v1",
          mappedAt: "2026-06-09T11:05:00Z",
          notes: "New source - not yet in the catalog"
        }
      ],
      review: {
        id: "rev-mock-004",
        normalizedItemId: "norm-mock-004",
        reviewerId: "reviewer-sarwan",
        reviewedAt: "2026-06-09T11:10:00Z",
        urlReachable: true,
        contentFreshnessScore: 0.50,
        technicalAccuracyScore: 0.40,
        relevanceScore: 0.45,
        authorityScore: 0.20,
        overallScore: 0.38,
        issues: ["Low authority - personal blog with no review", "Low accuracy - several claims unsubstantiated", "No tags for categorization"],
        recommendations: ["Consider higher-authority sources for HLD content"],
        passed: false
      },
      errors: [
        { id: "err-mock-006", batchId: "batch-004", candidateId: "mock-cand-004", stage: "reviewed", severity: "high", message: "Quality score below threshold", details: "Overall score 0.38 < 0.6 minimum", timestamp: "2026-06-09T11:10:00Z", resolved: false }
      ],
      decision: {
        id: "dec-mock-004",
        normalizedItemId: "norm-mock-004",
        decision: "rejected",
        decidedBy: "reviewer-sarwan",
        decidedAt: "2026-06-09T11:15:00Z",
        reason: "Quality review failed - overall score 0.38 below 0.6 threshold, low authority, unsubstantiated claims",
        nextStatus: "rejected"
      }
    }
  },
  {
    label: "duplicate-risk",
    description: "A candidate similar to existing content flagged for duplicate review",
    candidate: {
      id: "mock-cand-005",
      title: "Understanding the Event Loop in Node.js",
      url: "https://example.com/nodejs-event-loop-guide",
      sourceType: "engineering-blog",
      tier: "tier-3",
      category: "backend",
      description: "A guide to the Node.js event loop, timers, and process.nextTick.",
      discoveryMethod: "agent-discovery",
      discoveredAt: "2026-06-09T12:00:00Z",
      discoveredBy: "discovery-agent-v1",
      tags: ["nodejs", "event-loop", "async"],
      estimatedConfidence: 0.65
    },
    applyPreview: {
      normalizedItemId: "norm-mock-005",
      topicMappings: [
        {
          id: "map-t-mock-005",
          normalizedItemId: "norm-mock-005",
          topicId: "topic-node-event-loop",
          topicName: "Node.js Event Loop & Async Patterns",
          capabilityIds: ["cap-node-backend"],
          skillIds: ["skill-node-production-backend"],
          relevanceScore: 0.88,
          mappedBy: "discovery-agent-v1",
          mappedAt: "2026-06-09T12:05:00Z",
          notes: "Direct topic match - but existing sources already cover this well"
        }
      ],
      sourceMappings: [
        {
          id: "map-s-mock-005",
          normalizedItemId: "norm-mock-005",
          sourceId: "nodejs-docs",
          sourceTitle: "Node.js Official Documentation",
          mappedBy: "discovery-agent-v1",
          mappedAt: "2026-06-09T12:05:00Z",
          notes: "Potential duplicate - Node.js docs already cover event loop thoroughly"
        }
      ],
      review: {
        id: "rev-mock-005",
        normalizedItemId: "norm-mock-005",
        reviewerId: "reviewer-sarwan",
        reviewedAt: "2026-06-09T12:10:00Z",
        urlReachable: true,
        contentFreshnessScore: 0.75,
        technicalAccuracyScore: 0.80,
        relevanceScore: 0.88,
        authorityScore: 0.50,
        overallScore: 0.72,
        issues: ["Content overlaps significantly with existing Node.js docs source", "Authority score reduced - blog post compared to official docs"],
        recommendations: ["Consider whether this adds value beyond existing nodejs-docs mapping"],
        passed: true
      },
      errors: [
        { id: "err-mock-007", batchId: "batch-005", candidateId: "mock-cand-005", stage: "reviewed", severity: "medium", message: "Potential duplicate content", details: "Topic 'topic-node-event-loop' already has 2+ sources with higher authority", timestamp: "2026-06-09T12:10:00Z", resolved: false }
      ],
      decision: {
        id: "dec-mock-005",
        normalizedItemId: "norm-mock-005",
        decision: "approved",
        decidedBy: "reviewer-sarwan",
        decidedAt: "2026-06-09T12:15:00Z",
        reason: "Passes quality gate; approved with duplicate-risk note for manual review",
        nextStatus: "published"
      }
    }
  }
];
