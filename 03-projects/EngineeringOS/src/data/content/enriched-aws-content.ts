import { designTopic } from "@/data/content/enriched-factories";
import type { EnrichedHandsOnLab, EnrichedTopicContent } from "@/types/enriched-content";

const awsRefs = ["roadmap-sh", "awesome-scalability", "system-design-primer"];

const awsLabsBySlug: Record<string, EnrichedHandsOnLab[]> = {
  vpc: [
    {
      id: "lab-aws-vpc-two-az-foundation",
      title: "Two-AZ VPC foundation",
      goal: "Sketch and provision the network shape used by most AWS-first SaaS deployments.",
      sourceRefs: ["aws-docs", "aws-architecture-center", "aws-well-architected-framework"],
      scenario: "A beta SaaS app needs public ingress, private compute, private data stores, controlled egress, and room to add ECS/RDS later.",
      steps: ["Create a VPC CIDR plan.", "Create public and private subnets in two AZs.", "Attach an internet gateway.", "Add NAT egress per AZ for private workloads.", "Enable VPC Flow Logs.", "Document security group boundaries."],
      iacSnippet: `# Terraform sketch
resource "aws_vpc" "main" {
  cidr_block           = "10.20.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "engineeringos-beta-vpc" }
}

resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.20.0.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true
}`,
      validation: ["Two public and two private subnets exist.", "Route tables separate public ingress and private egress.", "Flow logs are enabled.", "No database subnet has direct public routing."],
      cleanup: ["Destroy sandbox VPC resources.", "Confirm no NAT gateway remains billing.", "Remove temporary log groups if created."],
      safetyNotes: ["Run only in a sandbox AWS account.", "NAT gateways cost money while active.", "Never attach production CIDR ranges to experiments."]
    }
  ],
  "ecs-eks": [
    {
      id: "lab-aws-ecs-service-blue-green",
      title: "ECS service deployment skeleton",
      goal: "Practice the production shape of a containerized web service behind an ALB.",
      sourceRefs: ["aws-docs", "aws-architecture-center", "aws-well-architected-framework"],
      scenario: "EngineeringOS needs a deployable web container path that can later support blue-green or canary releases.",
      steps: ["Build a small container image.", "Define an ECS task with least-privilege task role.", "Create an ECS service behind an ALB target group.", "Add health checks.", "Document blue-green/canary rollout options."],
      iacSnippet: `# Terraform sketch
resource "aws_ecs_service" "web" {
  name            = "engineeringos-web"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.web.arn
  desired_count   = 2

  deployment_controller {
    type = "ECS"
  }
}`,
      validation: ["Two tasks are healthy.", "ALB target group health check passes.", "Task role has no wildcard admin permissions.", "Rollback path is documented."],
      cleanup: ["Scale service to zero.", "Delete ECS service/task resources.", "Delete temporary ALB if created."],
      safetyNotes: ["Do not push real secrets into task definitions.", "Use Secrets Manager references.", "Set a service desired count limit in sandbox."]
    }
  ],
  "backup-dr": [
    {
      id: "lab-aws-backup-restore-drill",
      title: "Backup and restore drill",
      goal: "Prove that backup policy is real by restoring data into a disposable environment.",
      sourceRefs: ["aws-docs", "aws-well-architected-framework"],
      scenario: "A learner must explain RPO/RTO and demonstrate that a database snapshot can be restored before a beta launch.",
      steps: ["Create a small test database or table.", "Enable backup/snapshot policy.", "Record RPO/RTO targets.", "Restore into a separate test resource.", "Run a read validation.", "Write the restore runbook."],
      iacSnippet: `# Runbook sketch
RPO: 24h
RTO: 2h
1. Identify latest healthy snapshot.
2. Restore into isolated subnet group.
3. Run checksum/read validation.
4. Point staging app to restored endpoint.
5. Record elapsed restore time.`,
      validation: ["Restore completes inside target RTO.", "Restored data passes validation query.", "Runbook has owner and timestamp.", "Backup alarms exist."],
      cleanup: ["Delete restored test database.", "Delete temporary snapshots if policy allows.", "Keep the runbook artifact."],
      safetyNotes: ["Never test destructive restore against production.", "Protect snapshots with encryption.", "Verify retention and deletion policy."]
    }
  ],
  "api-gateway": [
    {
      id: "lab-aws-lambda-api-gateway",
      title: "Lambda/API Gateway hello service",
      goal: "Practice the smallest serverless API shape with logging, auth placeholder, and throttling notes.",
      sourceRefs: ["aws-docs", "aws-architecture-center"],
      scenario: "A lightweight learner-profile endpoint needs a low-ops API before containerization is justified.",
      steps: ["Define a Lambda handler.", "Expose it through API Gateway HTTP API.", "Add structured logs.", "Document auth and throttling controls.", "Add a CloudWatch alarm for 5xx errors."],
      iacSnippet: `# Terraform sketch
resource "aws_lambda_function" "profile_api" {
  function_name = "engineeringos-profile-api"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_apigatewayv2_api" "http" {
  name          = "engineeringos-http-api"
  protocol_type = "HTTP"
}`,
      validation: ["HTTP route returns 200 for health input.", "Lambda logs include request id.", "5xx alarm is configured.", "Auth/throttle decision is documented."],
      cleanup: ["Delete HTTP API.", "Delete Lambda function and log group.", "Remove temporary IAM role."],
      safetyNotes: ["Never put secrets in Lambda environment variables without encryption controls.", "Use sandbox account.", "Set reserved concurrency for experiments."]
    }
  ],
  "step-functions": [
    {
      id: "lab-aws-step-functions-checkout-saga",
      title: "Step Functions checkout saga",
      goal: "Model retries, compensation, and state visibility for a multi-step workflow.",
      sourceRefs: ["aws-docs", "aws-well-architected-framework"],
      scenario: "A checkout flow must reserve inventory, charge payment, create an order, and release inventory if payment fails.",
      steps: ["Define ReserveInventory, ChargePayment, CreateOrder, and ReleaseInventory states.", "Add retry/catch around provider-like tasks.", "Record execution input/output.", "Add CloudWatch execution metrics.", "Write a compensation runbook."],
      iacSnippet: `{
  "StartAt": "ReserveInventory",
  "States": {
    "ReserveInventory": { "Type": "Task", "Next": "ChargePayment", "Retry": [{ "ErrorEquals": ["States.ALL"], "MaxAttempts": 2 }] },
    "ChargePayment": { "Type": "Task", "Next": "CreateOrder", "Catch": [{ "ErrorEquals": ["States.ALL"], "Next": "ReleaseInventory" }] },
    "CreateOrder": { "Type": "Task", "End": true },
    "ReleaseInventory": { "Type": "Task", "End": true }
  }
}`,
      validation: ["Happy path reaches CreateOrder.", "Payment failure reaches ReleaseInventory.", "Execution history shows retries.", "Runbook names owner and rollback signal."],
      cleanup: ["Delete state machine.", "Delete test Lambda/task resources.", "Archive the runbook artifact."],
      safetyNotes: ["Use fake payment/inventory adapters.", "Never point a lab state machine at production queues.", "Limit execution history retention as needed."]
    }
  ],
  "route-53": [
    {
      id: "lab-aws-route53-failover",
      title: "Route 53 failover drill",
      goal: "Practice DNS health-check failover without touching production domains.",
      sourceRefs: ["aws-docs", "aws-well-architected-framework", "aws-architecture-center"],
      scenario: "A SaaS app needs DNS failover from a primary endpoint to a static maintenance or secondary endpoint.",
      steps: ["Create a sandbox hosted zone or subdomain.", "Define primary and secondary alias records.", "Attach health check to primary.", "Lower TTL for the drill.", "Simulate primary health failure and observe routing change."],
      iacSnippet: `# Terraform sketch
resource "aws_route53_record" "primary" {
  zone_id        = aws_route53_zone.sandbox.zone_id
  name           = "app.example.test"
  type           = "A"
  set_identifier = "primary"
  failover_routing_policy { type = "PRIMARY" }
}`,
      validation: ["Primary record serves while healthy.", "Secondary record serves after failed health check.", "TTL behavior is documented.", "Rollback restores primary routing."],
      cleanup: ["Delete sandbox records.", "Delete health checks.", "Restore normal TTL values."],
      safetyNotes: ["Do not run failover drills on production domains without approval.", "Health checks can create small recurring costs.", "Use a disposable subdomain."]
    }
  ],
  cloudfront: [
    {
      id: "lab-aws-cloudfront-signed-urls",
      title: "CloudFront signed URL sketch",
      goal: "Practice private content delivery with edge caching and controlled access.",
      sourceRefs: ["aws-docs", "aws-architecture-center"],
      scenario: "A portfolio or course asset should be downloadable only for authorized learners while still benefiting from CDN delivery.",
      steps: ["Create an S3 origin.", "Configure CloudFront with Origin Access Control.", "Define cache behavior.", "Sketch signed URL generation.", "Add access-log and cache-hit validation."],
      iacSnippet: `# Policy sketch
resource "aws_cloudfront_distribution" "private_assets" {
  enabled = true
  origin {
    domain_name              = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.assets.id
    origin_id                = "private-assets"
  }
}`,
      validation: ["Direct S3 public access is blocked.", "CloudFront can fetch through OAC.", "Unsigned private asset URL is denied.", "Signed URL access path is documented."],
      cleanup: ["Delete distribution after disabling.", "Delete temporary S3 objects.", "Remove signing keys from sandbox."],
      safetyNotes: ["Use sandbox assets instead of real private learner data.", "Protect signing keys.", "CloudFront deletion can take time."]
    }
  ],
  "ci-cd-blue-green-canary": [
    {
      id: "lab-aws-cicd-canary-deployment",
      title: "CI/CD canary deployment guardrails",
      goal: "Practice a production deployment flow that shifts traffic gradually and rolls back on health signals.",
      sourceRefs: ["aws-docs", "aws-well-architected-framework", "aws-architecture-center"],
      scenario: "EngineeringOS needs a beta deployment path where a new container or Lambda version can receive 10% traffic before full rollout.",
      steps: ["Define build, test, deploy, and verify stages.", "Create two deployment targets or versions.", "Shift a small percentage of traffic to the candidate.", "Watch latency, error, and business-health alarms.", "Rollback automatically or manually when alarms fire.", "Record the deployment decision log."],
      iacSnippet: `# Pipeline/runbook sketch
stages:
  - build_and_unit_test
  - publish_artifact
  - deploy_candidate
  - shift_traffic_10_percent
  - monitor_cloudwatch_alarms
  - promote_or_rollback

rollback_signal:
  p95_latency_ms: "> 800"
  error_rate_percent: "> 2"
  canary_duration_minutes: 15`,
      validation: ["Candidate version receives limited traffic first.", "CloudWatch alarms can stop promotion.", "Rollback path is documented and tested.", "Deployment record includes owner, version, and health decision."],
      cleanup: ["Delete temporary candidate resources.", "Remove test alarms if created.", "Archive the canary runbook."],
      safetyNotes: ["Use sandbox services before real beta traffic.", "Keep rollback fast and boring.", "Never promote when health signals are unknown."]
    }
  ]
};

const awsContent = [
  designTopic({
    topicSlug: "vpc",
    title: "AWS VPC",
    domain: "AWS",
    prompt: "Design a production VPC for a SaaS app with public entrypoints, private workloads, NAT/egress, subnet isolation, and future multi-AZ growth.",
    sourceRefs: awsRefs,
    requirements: ["Public and private subnet layout", "Multi-AZ placement", "Controlled egress", "Security group and NACL strategy", "Flow logs and auditability"],
    designBreakdown: ["CIDR planning", "Public ALB subnets", "Private app subnets", "Database subnets", "NAT gateways per AZ", "VPC endpoints", "Flow logs"],
    awsVariant: ["VPC across two or three AZs", "ALB in public subnets", "ECS/EKS/Lambda in private subnets", "RDS subnet group", "Gateway/interface endpoints", "CloudWatch/VPC Flow Logs"]
  }),
  designTopic({
    topicSlug: "iam",
    title: "AWS IAM",
    domain: "AWS",
    prompt: "Design an IAM baseline for a SaaS team with least privilege, role separation, workload identity, break-glass access, and audit trails.",
    sourceRefs: awsRefs,
    requirements: ["Least privilege", "Role-based access", "Workload roles", "Break-glass path", "Access review", "Audit logging"],
    designBreakdown: ["Account roles", "Permission boundaries", "Service roles", "OIDC/CI roles", "Secrets access", "Break-glass process", "Access analyzer"],
    awsVariant: ["IAM Identity Center", "Scoped IAM roles", "STS assume-role", "CloudTrail", "IAM Access Analyzer", "KMS key policies"]
  }),
  designTopic({
    topicSlug: "route-53",
    title: "Route 53",
    domain: "AWS",
    prompt: "Design DNS and traffic steering for a SaaS app using Route 53 health checks, failover, weighted rollout, and latency-aware routing.",
    sourceRefs: awsRefs,
    requirements: ["Hosted-zone ownership", "Alias records", "Health checks", "Failover routing", "Weighted/canary rollout", "DNS TTL strategy"],
    designBreakdown: ["Hosted zones", "Alias to ALB/CloudFront", "Health-check endpoints", "Failover policy", "Weighted records", "Rollback through weight shift", "DNS monitoring"],
    awsVariant: ["Route 53 hosted zone", "Alias A/AAAA records", "Health checks", "Failover and weighted routing policies", "CloudWatch alarms", "CloudFront/ALB targets"]
  }),
  designTopic({
    topicSlug: "cloudfront",
    title: "CloudFront",
    domain: "AWS",
    prompt: "Design CloudFront distribution strategy for static assets, API acceleration, signed URLs, origin protection, WAF, cache policies, and invalidation.",
    sourceRefs: awsRefs,
    requirements: ["Cache static content", "Protect origins", "Support signed/private content", "Control TTL and headers", "Use WAF", "Measure cache effectiveness"],
    designBreakdown: ["Distribution", "Origins", "Behaviors", "Cache policies", "Origin request policies", "Signed URL/cookie flow", "Invalidation workflow", "WAF rules"],
    awsVariant: ["CloudFront + S3 origin", "CloudFront + ALB/API origin", "Origin Access Control", "AWS WAF", "CloudWatch cache metrics", "Lambda@Edge/CloudFront Functions where needed"]
  }),
  designTopic({
    topicSlug: "api-gateway",
    title: "API Gateway",
    domain: "AWS",
    prompt: "Design an API Gateway front door with authentication, throttling, validation, versioning, observability, and backend integration.",
    sourceRefs: awsRefs,
    requirements: ["Route APIs", "Authenticate callers", "Throttle abuse", "Validate requests", "Version APIs", "Trace failures"],
    designBreakdown: ["REST/HTTP API choice", "Authorizers", "Usage plans/throttles", "Request validation", "Integration with Lambda/ECS", "Stage deployment", "Access logs"],
    awsVariant: ["API Gateway HTTP/REST APIs", "JWT/Lambda authorizer", "Lambda or private ALB integration", "WAF", "CloudWatch access logs", "X-Ray tracing"]
  }),
  designTopic({
    topicSlug: "step-functions",
    title: "Step Functions",
    domain: "AWS",
    prompt: "Design a durable workflow using Step Functions for retries, branching, compensation, timeouts, manual steps, and auditability.",
    sourceRefs: awsRefs,
    requirements: ["Durable state machine", "Retry and catch policies", "Branching", "Timeouts", "Compensation", "Execution history"],
    designBreakdown: ["State machine definition", "Task states", "Choice states", "Retry/catch", "Compensation branch", "Execution input/output", "Audit trail"],
    awsVariant: ["Step Functions Standard for durable workflows", "Lambda/ECS tasks", "EventBridge triggers", "SQS for downstream work", "CloudWatch execution metrics", "X-Ray tracing"]
  }),
  designTopic({
    topicSlug: "ecs-eks",
    title: "ECS and EKS",
    domain: "AWS",
    prompt: "Design container hosting for a SaaS app and choose ECS or EKS based on team maturity, scaling, networking, deployment, and operations.",
    sourceRefs: awsRefs,
    requirements: ["Run containerized services", "Autoscale workloads", "Deploy safely", "Secure service identity", "Observe runtime", "Manage cost"],
    designBreakdown: ["Cluster choice", "Task/pod model", "Service discovery", "Load balancing", "Autoscaling", "Deployment strategy", "Runtime observability"],
    awsVariant: ["ECS Fargate for simpler managed operations", "EKS for Kubernetes ecosystem needs", "ALB ingress", "CloudWatch Container Insights", "IAM roles for tasks/service accounts", "Blue-green/canary deploys"]
  }),
  designTopic({
    topicSlug: "ci-cd-blue-green-canary",
    title: "CI/CD Blue-Green and Canary",
    domain: "AWS",
    prompt: "Design a safe AWS deployment pipeline with automated tests, artifact promotion, canary or blue-green traffic shifting, alarms, and rollback.",
    sourceRefs: awsRefs,
    requirements: ["Build repeatably", "Run automated checks", "Deploy without downtime", "Shift traffic gradually", "Rollback on health regression", "Audit deployment decisions"],
    designBreakdown: ["Source trigger", "Build artifact", "Test gate", "Candidate environment/version", "Traffic shifting", "CloudWatch alarms", "Rollback playbook", "Deployment audit trail"],
    awsVariant: ["CodePipeline/CodeBuild or GitHub Actions OIDC", "ECS blue-green via CodeDeploy or weighted ALB routing", "Lambda alias weighted traffic", "CloudWatch alarms", "Route 53 weighted routing for coarse canaries", "IAM scoped deployment role"]
  }),
  designTopic({
    topicSlug: "multi-az",
    title: "Multi-AZ Architecture",
    domain: "AWS",
    prompt: "Design an AWS-first multi-AZ SaaS deployment with graceful failover, backups, and disaster-recovery objectives.",
    sourceRefs: awsRefs,
    requirements: ["Serve across at least two AZs", "Avoid single-AZ stateful dependencies", "Define RTO and RPO", "Automate backups", "Prove failover with tests"],
    designBreakdown: ["Route 53/CloudFront entry", "ALB across public subnets", "Compute across private subnets", "RDS Multi-AZ/DynamoDB", "Queue buffering", "Backup and restore runbook", "Game-day drill"],
    awsVariant: ["Route 53 + CloudFront + ALB", "ECS/EKS across private subnets", "RDS Multi-AZ", "ElastiCache Multi-AZ when needed", "CloudWatch + CloudTrail", "AWS Backup"]
  }),
  designTopic({
    topicSlug: "autoscaling",
    title: "Autoscaling",
    domain: "AWS",
    prompt: "Design autoscaling for web, worker, and database-adjacent workloads using target tracking, queue depth, cooldowns, and cost guardrails.",
    sourceRefs: awsRefs,
    requirements: ["Scale web traffic", "Scale async workers", "Avoid oscillation", "Protect downstream systems", "Control cost", "Test load behavior"],
    designBreakdown: ["Scaling metric", "Target tracking policy", "Queue-depth worker scaling", "Cooldowns", "Min/max capacity", "Load test", "Downstream protection"],
    awsVariant: ["Application Auto Scaling", "ECS service autoscaling", "Lambda concurrency", "SQS ApproximateAgeOfOldestMessage", "RDS read replicas where appropriate", "CloudWatch alarms"]
  }),
  designTopic({
    topicSlug: "elasticache",
    title: "ElastiCache",
    domain: "AWS",
    prompt: "Design a caching layer with ElastiCache for hot reads, sessions, rate-limit counters, invalidation, failover, and observability.",
    sourceRefs: awsRefs,
    requirements: ["Reduce read latency", "Handle cache misses", "Invalidate stale data", "Survive node failures", "Protect memory", "Measure hit ratio"],
    designBreakdown: ["Cache key design", "TTL strategy", "Read-through/write-through choice", "Invalidation path", "Redis cluster mode", "Eviction policy", "Hit-ratio dashboard"],
    awsVariant: ["ElastiCache Redis", "Multi-AZ replication group", "Security groups/private subnets", "CloudWatch memory/eviction metrics", "Parameter groups", "Backup where needed"]
  }),
  designTopic({
    topicSlug: "kms",
    title: "KMS",
    domain: "AWS",
    prompt: "Design encryption key management with KMS for application secrets, data stores, envelope encryption, rotation, and audit.",
    sourceRefs: awsRefs,
    requirements: ["Encrypt sensitive data", "Separate key ownership", "Rotate keys", "Audit key usage", "Limit decrypt permissions", "Support incident response"],
    designBreakdown: ["Key hierarchy", "CMKs/customer-managed keys", "Envelope encryption", "Key policies", "IAM grants", "Rotation", "CloudTrail review"],
    awsVariant: ["AWS KMS customer-managed keys", "S3/RDS/DynamoDB encryption", "Secrets Manager integration", "CloudTrail KMS events", "IAM condition keys"]
  }),
  designTopic({
    topicSlug: "cloudtrail",
    title: "CloudTrail",
    domain: "AWS",
    prompt: "Design CloudTrail audit logging for account activity, admin changes, incident investigation, retention, and tamper resistance.",
    sourceRefs: awsRefs,
    requirements: ["Capture management events", "Store logs durably", "Detect suspicious actions", "Retain audit evidence", "Protect logs from tampering", "Support investigation"],
    designBreakdown: ["Organization trail", "S3 log bucket", "Log file validation", "CloudWatch/EventBridge detections", "Athena queries", "Retention policy", "Access controls"],
    awsVariant: ["CloudTrail organization trail", "S3 Object Lock where needed", "KMS encryption", "EventBridge rules", "CloudWatch alarms", "Athena/Glue log analysis"]
  }),
  designTopic({
    topicSlug: "backup-dr",
    title: "Backup and DR",
    domain: "AWS",
    prompt: "Design backup and disaster recovery for a SaaS platform with RPO/RTO targets, restore drills, cross-region copies, and ownership.",
    sourceRefs: awsRefs,
    requirements: ["Define RPO/RTO", "Automate backups", "Copy critical backups cross-region", "Test restore", "Protect from corruption", "Document runbooks"],
    designBreakdown: ["Asset inventory", "Backup policies", "Cross-region copy", "Restore runbook", "Restore drill schedule", "Corruption detection", "DR decision tree"],
    awsVariant: ["AWS Backup", "RDS snapshots/PITR", "S3 versioning/Object Lock", "Cross-region copies", "Route 53 failover planning", "CloudWatch backup alarms"]
  }),
  designTopic({
    topicSlug: "cost-optimization",
    title: "Cost Optimization",
    domain: "AWS",
    prompt: "Design an AWS cost optimization program for a growing SaaS product without damaging reliability or team speed.",
    sourceRefs: awsRefs,
    requirements: ["Allocate costs", "Detect anomalies", "Rightsize workloads", "Choose savings plans/reservations", "Control data transfer", "Track unit economics"],
    designBreakdown: ["Tagging strategy", "Cost explorer review", "Budgets/anomaly detection", "Rightsizing queue", "Storage lifecycle", "Commitment planning", "Unit-cost dashboard"],
    awsVariant: ["AWS Budgets", "Cost Explorer", "Cost Anomaly Detection", "Compute Optimizer", "S3 lifecycle", "Savings Plans", "CUR/Athena dashboards"]
  })
];

export const enrichedAwsContent = awsContent.map((content): EnrichedTopicContent => ({
  ...content,
  handsOnLabs: awsLabsBySlug[content.topicSlug] ?? []
}));
