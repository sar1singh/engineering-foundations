import type {
  RawContentCandidate,
  TopicMappingCandidate,
  SourceMappingCandidate,
  ContentQualityReview,
  AgentAttribution,
  DuplicateRiskAssessment
} from "@/types/content-ingestion";

export type AgentDiscoveryScenario = {
  scenarioId: string;
  agentName: string;
  description: string;
  candidate: RawContentCandidate;
  attribution: AgentAttribution | null;
  duplicateRisk: DuplicateRiskAssessment | null;
  topicMappings: TopicMappingCandidate[];
  sourceMappings: SourceMappingCandidate[];
  review: ContentQualityReview | null;
  label: "valid" | "missing-attribution" | "high-duplicate-risk" | "low-confidence-human-approval" | "cannot-publish-directly";
};

export const AGENT_DISCOVERY_SCENARIOS: AgentDiscoveryScenario[] = [
  {
    scenarioId: "agent-scenario-001",
    agentName: "Resource Discovery Agent v1",
    label: "valid",
    description: "Agent discovers an AWS blog post with full attribution, passing all gates",
    candidate: {
      id: "agent-cand-001",
      title: "Building Resilient Architectures with AWS Multi-AZ Patterns",
      url: "https://aws.amazon.com/blogs/architecture/building-resilient-multi-az-patterns/",
      sourceType: "official-docs",
      tier: "tier-1",
      category: "aws",
      description: "Official AWS blog post covering Multi-AZ deployment patterns for high availability.",
      discoveryMethod: "agent-discovery",
      discoveredAt: "2026-06-10T08:00:00Z",
      discoveredBy: "discovery-agent-v1",
      tags: ["aws", "multi-az", "high-availability", "resilience"],
      estimatedConfidence: 0.85,
      attribution: {
        agentId: "discovery-agent-v1",
        agentVersion: "1.0.0",
        agentTraceId: "trace-001-abc",
        discoveredAt: "2026-06-10T08:00:00Z",
        sourceUrl: "https://aws.amazon.com/blogs/architecture/",
        extractionMethod: "rss",
        rawMetadata: JSON.stringify({ feedSource: "AWS Architecture Blog RSS", fetchLatencyMs: 320 })
      },
      agentTraceId: "trace-001-abc"
    },
    attribution: {
      agentId: "discovery-agent-v1",
      agentVersion: "1.0.0",
      agentTraceId: "trace-001-abc",
      discoveredAt: "2026-06-10T08:00:00Z",
      sourceUrl: "https://aws.amazon.com/blogs/architecture/",
      extractionMethod: "rss",
      rawMetadata: JSON.stringify({ feedSource: "AWS Architecture Blog RSS", fetchLatencyMs: 320 })
    },
    duplicateRisk: null,
    topicMappings: [
      {
        id: "agt-map-t-001",
        normalizedItemId: "norm-agent-001",
        topicId: "topic-aws-well-architected",
        topicName: "AWS Well-Architected Framework",
        capabilityIds: ["cap-aws-cloud-architecture"],
        skillIds: ["skill-aws-architecture-review"],
        relevanceScore: 0.92,
        mappedBy: "topic-mapper-agent-v1",
        mappedAt: "2026-06-10T08:02:00Z",
        notes: "Strong match - Multi-AZ patterns under Well-Architected Reliability pillar"
      }
    ],
    sourceMappings: [
      {
        id: "agt-map-s-001",
        normalizedItemId: "norm-agent-001",
        sourceId: "aws-well-architected",
        sourceTitle: "AWS Well-Architected Framework",
        mappedBy: "source-mapper-agent-v1",
        mappedAt: "2026-06-10T08:02:00Z",
        notes: "Matches existing catalog source aws-well-architected"
      }
    ],
    review: {
      id: "agt-rev-001",
      normalizedItemId: "norm-agent-001",
      reviewerId: "quality-agent-v1",
      reviewedAt: "2026-06-10T08:05:00Z",
      urlReachable: true,
      contentFreshnessScore: 0.90,
      technicalAccuracyScore: 0.95,
      relevanceScore: 0.92,
      authorityScore: 0.98,
      overallScore: 0.93,
      issues: [],
      recommendations: [],
      passed: true
    }
  },
  {
    scenarioId: "agent-scenario-002",
    agentName: "Resource Discovery Agent v1",
    label: "missing-attribution",
    description: "Agent discovers a candidate but attribution metadata is missing",
    candidate: {
      id: "agent-cand-002",
      title: "Understanding Kubernetes Pod Autoscaling",
      url: "https://example.com/k8s-autoscaling-guide",
      sourceType: "engineering-blog",
      tier: "tier-3",
      category: "backend",
      description: "A guide to Kubernetes Horizontal Pod Autoscaling and Vertical Pod Autoscaling.",
      discoveryMethod: "agent-discovery",
      discoveredAt: "2026-06-10T09:00:00Z",
      discoveredBy: "discovery-agent-v1",
      tags: ["kubernetes", "autoscaling", "containers"],
      estimatedConfidence: 0.60,
      agentTraceId: "trace-002-def"
    },
    attribution: null,
    duplicateRisk: null,
    topicMappings: [
      {
        id: "agt-map-t-002",
        normalizedItemId: "norm-agent-002",
        topicId: "topic-aws-compute-options",
        topicName: "AWS Compute Options & Container Orchestration",
        capabilityIds: ["cap-aws-cloud-architecture"],
        skillIds: ["skill-aws-architecture-review"],
        relevanceScore: 0.75,
        mappedBy: "topic-mapper-agent-v1",
        mappedAt: "2026-06-10T09:02:00Z",
        notes: "Kubernetes autoscaling relates to AWS EKS compute options"
      }
    ],
    sourceMappings: [
      {
        id: "agt-map-s-002",
        normalizedItemId: "norm-agent-002",
        sourceId: "kubernetes-docs",
        sourceTitle: "Kubernetes Official Documentation",
        mappedBy: "source-mapper-agent-v1",
        mappedAt: "2026-06-10T09:02:00Z",
        notes: "Matches existing catalog source kubernetes-docs"
      }
    ],
    review: {
      id: "agt-rev-002",
      normalizedItemId: "norm-agent-002",
      reviewerId: "quality-agent-v1",
      reviewedAt: "2026-06-10T09:05:00Z",
      urlReachable: true,
      contentFreshnessScore: 0.70,
      technicalAccuracyScore: 0.75,
      relevanceScore: 0.75,
      authorityScore: 0.65,
      overallScore: 0.72,
      issues: ["Missing attribution metadata from discovery agent"],
      recommendations: ["Ensure discovery agent attaches attribution before output"],
      passed: true
    }
  },
  {
    scenarioId: "agent-scenario-003",
    agentName: "Duplicate Detection Agent v1",
    label: "high-duplicate-risk",
    description: "Agent discovers a candidate that closely matches already-published content",
    candidate: {
      id: "agent-cand-003",
      title: "Introduction to Amazon S3 Storage Classes",
      url: "https://example.com/s3-storage-classes-intro",
      sourceType: "engineering-blog",
      tier: "tier-3",
      category: "aws",
      description: "Overview of Amazon S3 storage classes including Standard, IA, Glacier, and Deep Archive.",
      discoveryMethod: "agent-discovery",
      discoveredAt: "2026-06-10T10:00:00Z",
      discoveredBy: "discovery-agent-v1",
      tags: ["aws", "s3", "storage"],
      estimatedConfidence: 0.55,
      attribution: {
        agentId: "discovery-agent-v1",
        agentVersion: "1.0.0",
        agentTraceId: "trace-003-ghi",
        discoveredAt: "2026-06-10T10:00:00Z",
        sourceUrl: "https://example.com/blog",
        extractionMethod: "scrape",
        rawMetadata: JSON.stringify({ scrapeDepth: 2, wordCount: 1200 })
      },
      duplicateRisk: {
        similarCandidateIds: [],
        similarNormalizedIds: ["norm-existing-s3-guide"],
        similarityScore: 0.88,
        overlappingTopicIds: ["topic-aws-compute-options"],
        assessedBy: "duplicate-detection-agent-v1",
        assessedAt: "2026-06-10T10:01:00Z",
        notes: "Significant overlap with existing S3 storage classes content in the registry"
      },
      agentTraceId: "trace-003-ghi"
    },
    attribution: {
      agentId: "discovery-agent-v1",
      agentVersion: "1.0.0",
      agentTraceId: "trace-003-ghi",
      discoveredAt: "2026-06-10T10:00:00Z",
      sourceUrl: "https://example.com/blog",
      extractionMethod: "scrape",
      rawMetadata: JSON.stringify({ scrapeDepth: 2, wordCount: 1200 })
    },
    duplicateRisk: {
      similarCandidateIds: [],
      similarNormalizedIds: ["norm-existing-s3-guide"],
      similarityScore: 0.88,
      overlappingTopicIds: ["topic-aws-compute-options"],
      assessedBy: "duplicate-detection-agent-v1",
      assessedAt: "2026-06-10T10:01:00Z",
      notes: "Significant overlap with existing S3 storage classes content in the registry"
    },
    topicMappings: [
      {
        id: "agt-map-t-003",
        normalizedItemId: "norm-agent-003",
        topicId: "topic-aws-compute-options",
        topicName: "AWS Compute Options & Container Orchestration",
        capabilityIds: ["cap-aws-cloud-architecture"],
        skillIds: ["skill-aws-architecture-review"],
        relevanceScore: 0.85,
        mappedBy: "topic-mapper-agent-v1",
        mappedAt: "2026-06-10T10:02:00Z",
        notes: "S3 storage classes relate to AWS compute options"
      }
    ],
    sourceMappings: [
      {
        id: "agt-map-s-003",
        normalizedItemId: "norm-agent-003",
        sourceId: "aws-s3-docs",
        sourceTitle: "AWS S3 Documentation",
        mappedBy: "source-mapper-agent-v1",
        mappedAt: "2026-06-10T10:02:00Z",
        notes: "Matches existing catalog source aws-s3-docs"
      }
    ],
    review: {
      id: "agt-rev-003",
      normalizedItemId: "norm-agent-003",
      reviewerId: "quality-agent-v1",
      reviewedAt: "2026-06-10T10:05:00Z",
      urlReachable: true,
      contentFreshnessScore: 0.60,
      technicalAccuracyScore: 0.70,
      relevanceScore: 0.85,
      authorityScore: 0.50,
      overallScore: 0.65,
      issues: ["High duplicate risk - 88% similarity with existing S3 content", "Lower authority - blog post vs official AWS docs"],
      recommendations: ["Verify if this adds value beyond existing S3 documentation sources"],
      passed: true
    }
  },
  {
    scenarioId: "agent-scenario-004",
    agentName: "Resource Discovery Agent v1",
    label: "low-confidence-human-approval",
    description: "Agent discovers a low-confidence candidate that requires human approval",
    candidate: {
      id: "agent-cand-004",
      title: "Personal Reflections on Microservices Architecture",
      url: "https://personal-blog.example.com/microservices-thoughts",
      sourceType: "engineering-blog",
      tier: "tier-4",
      category: "hld",
      description: "A personal blog post with opinions on microservices best practices.",
      discoveryMethod: "agent-discovery",
      discoveredAt: "2026-06-10T11:00:00Z",
      discoveredBy: "discovery-agent-v1",
      tags: [],
      estimatedConfidence: 0.25,
      attribution: {
        agentId: "discovery-agent-v1",
        agentVersion: "1.0.0",
        agentTraceId: "trace-004-jkl",
        discoveredAt: "2026-06-10T11:00:00Z",
        sourceUrl: "https://personal-blog.example.com/",
        extractionMethod: "scrape",
        rawMetadata: JSON.stringify({ scrapeDepth: 1, wordCount: 800, domainAgeYears: 0.5 })
      },
      agentTraceId: "trace-004-jkl"
    },
    attribution: {
      agentId: "discovery-agent-v1",
      agentVersion: "1.0.0",
      agentTraceId: "trace-004-jkl",
      discoveredAt: "2026-06-10T11:00:00Z",
      sourceUrl: "https://personal-blog.example.com/",
      extractionMethod: "scrape",
      rawMetadata: JSON.stringify({ scrapeDepth: 1, wordCount: 800, domainAgeYears: 0.5 })
    },
    duplicateRisk: null,
    topicMappings: [
      {
        id: "agt-map-t-004",
        normalizedItemId: "norm-agent-004",
        topicId: "topic-hld-fundamentals",
        topicName: "HLD Fundamentals",
        capabilityIds: ["cap-system-design-hld"],
        skillIds: ["skill-hld-requirements"],
        relevanceScore: 0.50,
        mappedBy: "topic-mapper-agent-v1",
        mappedAt: "2026-06-10T11:02:00Z",
        notes: "Marginal relevance - personal blog touches on HLD concepts"
      }
    ],
    sourceMappings: [
      {
        id: "agt-map-s-004",
        normalizedItemId: "norm-agent-004",
        sourceId: "brand-new-blog-source",
        sourceTitle: "Personal Engineering Blog",
        mappedBy: "source-mapper-agent-v1",
        mappedAt: "2026-06-10T11:02:00Z",
        notes: "New source not yet in catalog"
      }
    ],
    review: {
      id: "agt-rev-004",
      normalizedItemId: "norm-agent-004",
      reviewerId: "quality-agent-v1",
      reviewedAt: "2026-06-10T11:05:00Z",
      urlReachable: true,
      contentFreshnessScore: 0.40,
      technicalAccuracyScore: 0.35,
      relevanceScore: 0.50,
      authorityScore: 0.15,
      overallScore: 0.35,
      issues: ["Low confidence (0.25) - requires human approval", "No tags for categorization", "Low authority - personal blog with no review", "Low accuracy - unsubstantiated claims"],
      recommendations: ["Reject or request human curator review before any approval decision"],
      passed: false
    }
  },
  {
    scenarioId: "agent-scenario-005",
    agentName: "Resource Discovery Agent v1",
    label: "cannot-publish-directly",
    description: "Agent tries to publish directly without passing through human approval gate",
    candidate: {
      id: "agent-cand-005",
      title: "AWS Lambda Best Practices for Production Workloads",
      url: "https://docs.aws.amazon.com/lambda/latest/operatorguide/best-practices.html",
      sourceType: "official-docs",
      tier: "tier-1",
      category: "aws",
      description: "Official AWS Lambda operator guide covering production best practices.",
      discoveryMethod: "agent-discovery",
      discoveredAt: "2026-06-10T12:00:00Z",
      discoveredBy: "discovery-agent-v1",
      tags: ["aws", "lambda", "serverless", "production"],
      estimatedConfidence: 0.90,
      attribution: {
        agentId: "discovery-agent-v1",
        agentVersion: "1.0.0",
        agentTraceId: "trace-005-mno",
        discoveredAt: "2026-06-10T12:00:00Z",
        sourceUrl: "https://docs.aws.amazon.com/lambda/latest/operatorguide/",
        extractionMethod: "rss",
        rawMetadata: JSON.stringify({ feedSource: "AWS Docs RSS", fetchLatencyMs: 280 })
      },
      agentTraceId: "trace-005-mno"
    },
    attribution: {
      agentId: "discovery-agent-v1",
      agentVersion: "1.0.0",
      agentTraceId: "trace-005-mno",
      discoveredAt: "2026-06-10T12:00:00Z",
      sourceUrl: "https://docs.aws.amazon.com/lambda/latest/operatorguide/",
      extractionMethod: "rss",
      rawMetadata: JSON.stringify({ feedSource: "AWS Docs RSS", fetchLatencyMs: 280 })
    },
    duplicateRisk: null,
    topicMappings: [
      {
        id: "agt-map-t-005",
        normalizedItemId: "norm-agent-005",
        topicId: "topic-aws-compute-options",
        topicName: "AWS Compute Options & Container Orchestration",
        capabilityIds: ["cap-aws-cloud-architecture"],
        skillIds: ["skill-aws-architecture-review"],
        relevanceScore: 0.95,
        mappedBy: "topic-mapper-agent-v1",
        mappedAt: "2026-06-10T12:02:00Z",
        notes: "Direct fit - Lambda best practices under compute options"
      }
    ],
    sourceMappings: [
      {
        id: "agt-map-s-005",
        normalizedItemId: "norm-agent-005",
        sourceId: "aws-lambda-docs",
        sourceTitle: "AWS Lambda Documentation",
        mappedBy: "source-mapper-agent-v1",
        mappedAt: "2026-06-10T12:02:00Z",
        notes: "Matches existing catalog source aws-lambda-docs"
      }
    ],
    review: {
      id: "agt-rev-005",
      normalizedItemId: "norm-agent-005",
      reviewerId: "quality-agent-v1",
      reviewedAt: "2026-06-10T12:05:00Z",
      urlReachable: true,
      contentFreshnessScore: 0.95,
      technicalAccuracyScore: 0.97,
      relevanceScore: 0.95,
      authorityScore: 0.99,
      overallScore: 0.96,
      issues: [],
      recommendations: ["Excellent candidate - proceed through standard approval gate"],
      passed: true
    }
  }
];
