import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const awsHldReferences = [
  { id: "reference-aws-hld-well-architected", title: "AWS Well-Architected Framework", url: "https://docs.aws.amazon.com/en_us/wellarchitected/latest/framework/welcome.html", sourceType: "docs" as const, usage: "AWS architecture review lens for secure, reliable, performant, and cost-aware systems." },
  { id: "reference-aws-hld-reliability", title: "AWS Well-Architected Reliability Pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html", sourceType: "docs" as const, usage: "AWS guidance for multi-AZ, failure recovery, DR, quotas, and resiliency." },
  { id: "reference-aws-hld-architecture-center", title: "AWS Architecture Center", url: "https://aws.amazon.com/architecture/", sourceType: "docs" as const, usage: "AWS reference architectures and architecture diagrams." },
  { id: "reference-aws-hld-saa", title: "AWS SAA-C03 Exam Guide", url: "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03.html", sourceType: "docs" as const, usage: "Official solution architect exam domains and service scope." }
];

function practice(slug: string, title: string): SyllabusPracticeProblem[] {
  return [
    { id: `problem-aws-hld-${slug}-easy`, title: `${title} architecture note`, difficulty: "easy", tags: ["aws", "hld", slug], prompt: `Explain ${title} with a simple AWS architecture note and one failure mode.`, expectedSignals: ["Explains purpose", "Names failure mode"] },
    { id: `problem-aws-hld-${slug}-medium`, title: `${title} design scenario`, difficulty: "medium", tags: ["aws", "solution-architect", slug], prompt: `Apply ${title} to a backend system. Include secure, resilient, performant, and cost-aware choices.`, expectedSignals: ["Well-Architected trade-offs", "AWS components", "Cost/security"] },
    { id: `problem-aws-hld-${slug}-hard`, title: `${title} review board`, difficulty: "hard", tags: ["aws", "staff-review", slug], prompt: `Review a production AWS design involving ${title}. Identify risks, alternatives, rollout, and rollback.`, expectedSignals: ["Risk review", "Alternatives", "Rollout/rollback"] }
  ];
}

function topic(order: number, slug: string, title: string, definition: string, mentalModel: string, theory: string, note: string): SyllabusTopic {
  return {
    id: `syllabus-aws-hld-${slug}`,
    slug,
    title,
    order,
    sourcePath: "00-control/master-roadmap/09-aws/INDEX.md",
    definition,
    whyItMatters: `${title} is an AWS HLD deepening topic for solution architects and senior/staff design reviews.`,
    mentalModel,
    theory: `${theory}\n\nAWS design note: ${note}`,
    codeExamples: [{ id: `example-aws-hld-${slug}`, title: `${title} design note`, language: "text", code: note, explanation: `AWS HLD note for ${title}.`, runnable: false }],
    practiceProblems: practice(slug, title),
    interviewQuestions: [`When use ${title}?`, `What breaks if ${title} is misconfigured?`, `How does ${title} affect cost/security/reliability?`],
    commonMistakes: ["No failure mode", "No cost guardrail", "No security boundary", "No observability"],
    productionUseCases: ["AWS solution architecture", "HLD interviews", "Architecture review boards", "Production readiness reviews"],
    revisionPrompts: [`Explain ${title} in AWS SAA terms.`, `Add ${title} to one HLD case study.`, `Name one metric or audit signal.`],
    reviewPrompts: [{ id: `review-aws-hld-${slug}-mentor`, reviewerRole: "mentor", prompt: `Review ${title} like an AWS staff architect.`, rubric: ["AWS fit", "Well-Architected trade-off", "Operational guardrail", "Cost/security covered"] }],
    references: [...awsHldReferences, { id: `reference-aws-hld-${slug}-roadmap`, title: "EngineeringOS AWS master roadmap", url: "00-control/master-roadmap/09-aws/INDEX.md", sourceType: "roadmap", usage: "Local source for AWS focus." }],
    progressSignals: ["read_definition", "read_theory", "studied_code_example", "ran_code_example", "solved_easy_problem", "solved_medium_problem", "solved_hard_problem", "submitted_explain_back", "completed_mock_review", "scheduled_revision"]
  };
}

export const awsHldDeepeningTopics: SyllabusTopic[] = [
  topic(9, "multi-az", "Multi-AZ Architecture", "Multi-AZ architecture deploys resources across multiple Availability Zones to survive data-center-level failures.", "Distribute critical paths across independent failure zones.", "Use multiple AZs for load-balanced services, databases, NAT, and stateful dependencies where supported.", "ALB spans public subnets in two AZs; ECS/EC2 tasks run in private subnets across AZs; RDS Multi-AZ handles DB failover."),
  topic(10, "autoscaling", "Auto Scaling", "Auto Scaling adjusts compute capacity based on demand, health, or schedules.", "Scale replaceable capacity, not individual servers.", "Know target tracking, step scaling, warmup, health checks, cooldowns, and downstream bottlenecks.", "ALB request count or CPU alarms scale ECS/EC2 service; min capacity protects baseline; max capacity protects cost/downstreams."),
  topic(11, "route-53", "Route 53", "Route 53 provides DNS routing, health checks, and traffic policies for AWS architectures.", "DNS is traffic steering plus failure routing.", "Know latency, weighted, failover, geolocation, alias records, and hosted zones.", "Route 53 failover policy sends users to healthy regional endpoint; health checks detect outage."),
  topic(12, "cloudfront", "CloudFront", "CloudFront is AWS's CDN for caching content and accelerating delivery at edge locations.", "Serve cacheable bytes close to users and protect origins.", "Use CloudFront for static assets, APIs with caching, signed URLs, origin shielding, and AWS WAF integration.", "User -> CloudFront -> S3/ALB/API origin; cache policy controls TTL and headers."),
  topic(13, "elasticache", "ElastiCache", "ElastiCache provides managed Redis or Memcached for low-latency cache and ephemeral state.", "Fast shared memory with explicit freshness and eviction rules.", "Use for cache-aside, sessions, rate limits, locks carefully, and hot read reduction.", "API checks Redis cache before RDS; TTL prevents stale/unbounded growth; alarms track evictions and memory."),
  topic(14, "api-gateway", "API Gateway", "API Gateway manages API endpoints, authorization integration, throttling, routing, and Lambda/service integration.", "Managed API front door with policy controls.", "Use for serverless APIs, throttling, auth, request validation, and usage plans; compare with ALB for container services.", "Client -> API Gateway -> Lambda; usage plan throttles; logs/metrics go to CloudWatch."),
  topic(15, "step-functions", "Step Functions", "Step Functions orchestrates multi-step workflows with retries, branching, timeouts, and state tracking.", "Make workflow state explicit instead of hiding it in callbacks.", "Use for payment, booking, approvals, ETL, and human/async workflows where state and retries matter.", "State machine: validate -> reserve -> charge -> confirm; failures compensate/release inventory."),
  topic(16, "ecs-eks", "ECS/EKS", "ECS and EKS run containerized workloads with orchestration, scaling, networking, and deployment controls.", "Containers package workloads; orchestrators schedule and heal them.", "Use ECS for simpler AWS-native containers; EKS when Kubernetes ecosystem/control is needed. Discuss Fargate vs EC2 capacity.", "ALB -> ECS service on Fargate -> RDS/Redis; blue-green deployment with health checks."),
  topic(17, "kms", "KMS", "AWS KMS manages encryption keys used to protect data across AWS services and applications.", "Keys are security boundaries and audit objects.", "Know envelope encryption, key policies, grants, rotation, multi-region keys, and service integration.", "S3/RDS/DynamoDB encrypted with KMS CMK; CloudTrail records key use; IAM/key policy controls access."),
  topic(18, "cloudtrail", "CloudTrail", "CloudTrail records AWS account API activity for audit, security, and incident investigation.", "Every control-plane action should leave an audit trail.", "Use organization trails, S3 log archive, CloudWatch/EventBridge alerts, and tamper-resistant retention.", "CloudTrail -> central S3 log bucket -> EventBridge alert for sensitive API actions."),
  topic(19, "backup-dr", "Backup and DR", "Backup and DR design defines how data and workloads are restored after accidental deletion, corruption, or regional failure.", "Know RPO/RTO and test restores before disaster.", "Discuss backups, snapshots, cross-region copy, pilot light, warm standby, active-active, and restore drills.", "AWS Backup policies protect RDS/EBS/EFS; cross-region copies support DR; runbooks test restore time."),
  topic(20, "cost-optimization", "Cost Optimization", "Cost optimization delivers required business value at the lowest sustainable AWS cost.", "Architecture choices are also cost choices.", "Know right-sizing, autoscaling, storage classes, reserved/savings plans, caching, data transfer, and observability for cost anomalies.", "Use budgets/anomaly detection; S3 lifecycle; Graviton/right-size EC2; avoid NAT/data-transfer surprises.")
];
