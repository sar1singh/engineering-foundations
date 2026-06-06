import type { SourceReference, SourceReliability, SourceTier, SourceType } from "@/types/founder-beta";

type SourceSeed = Omit<SourceReference, "sourceType" | "tier" | "reliability"> & {
  sourceType: SourceType;
  tier: SourceTier;
  reliability: SourceReliability;
};

const source = (seed: SourceSeed): SourceReference => seed;

export const founderBetaSourceCatalog: SourceReference[] = [
  source({
    id: "aws-well-architected",
    title: "AWS Well-Architected Framework",
    url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
    sourceType: "official-docs",
    category: "AWS / Cloud Architecture",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Primary architecture review rubric for Solution Architect readiness."
  }),
  source({
    id: "aws-docs",
    title: "AWS Documentation",
    url: "https://docs.aws.amazon.com/",
    sourceType: "official-docs",
    category: "AWS / Cloud Architecture",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical AWS service behavior and cloud architecture reference."
  }),
  source({
    id: "aws-architecture-center",
    title: "AWS Architecture Center",
    url: "https://aws.amazon.com/architecture/",
    sourceType: "official-docs",
    category: "AWS / Cloud Architecture",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Reference architectures for founder case-study proof."
  }),
  source({
    id: "aws-builders-library",
    title: "Amazon Builders' Library",
    url: "https://aws.amazon.com/builders-library/",
    sourceType: "engineering-blog",
    category: "AWS / Distributed Systems",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Deep reliability, distributed systems, and operational design reference."
  }),
  source({
    id: "aws-prescriptive-guidance",
    title: "AWS Prescriptive Guidance",
    url: "https://docs.aws.amazon.com/prescriptive-guidance/",
    sourceType: "official-docs",
    category: "AWS / Cloud Architecture",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Implementation-oriented cloud architecture patterns."
  }),
  source({
    id: "aws-iam-docs",
    title: "AWS IAM Documentation",
    url: "https://docs.aws.amazon.com/iam/",
    sourceType: "official-docs",
    category: "AWS Security",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical IAM, access control, and least-privilege reference."
  }),
  source({
    id: "aws-vpc-docs",
    title: "Amazon VPC Documentation",
    url: "https://docs.aws.amazon.com/vpc/",
    sourceType: "official-docs",
    category: "AWS Networking",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical VPC, subnet, routing, and network-boundary reference."
  }),
  source({
    id: "aws-ec2-docs",
    title: "Amazon EC2 Documentation",
    url: "https://docs.aws.amazon.com/ec2/",
    sourceType: "official-docs",
    category: "AWS Compute",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Compute baseline for EC2 tradeoff discussions."
  }),
  source({
    id: "aws-ecs-docs",
    title: "Amazon ECS Documentation",
    url: "https://docs.aws.amazon.com/ecs/",
    sourceType: "official-docs",
    category: "AWS Compute",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Container deployment tradeoffs for backend architecture."
  }),
  source({
    id: "aws-lambda-docs",
    title: "AWS Lambda Documentation",
    url: "https://docs.aws.amazon.com/lambda/",
    sourceType: "official-docs",
    category: "AWS Compute",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Serverless compute tradeoff and event-driven design reference."
  }),
  source({
    id: "aws-rds-docs",
    title: "Amazon RDS Documentation",
    url: "https://docs.aws.amazon.com/rds/",
    sourceType: "official-docs",
    category: "AWS Databases",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Managed relational database architecture and HA reference."
  }),
  source({
    id: "aws-dynamodb-docs",
    title: "Amazon DynamoDB Documentation",
    url: "https://docs.aws.amazon.com/dynamodb/",
    sourceType: "official-docs",
    category: "AWS Databases",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "NoSQL and high-scale key-value modeling reference."
  }),
  source({
    id: "aws-s3-docs",
    title: "Amazon S3 Documentation",
    url: "https://docs.aws.amazon.com/s3/",
    sourceType: "official-docs",
    category: "AWS Storage",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Object storage, durability, lifecycle, and access-control reference."
  }),
  source({
    id: "aws-sqs-docs",
    title: "Amazon SQS Documentation",
    url: "https://docs.aws.amazon.com/sqs/",
    sourceType: "official-docs",
    category: "AWS Messaging",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Queue design, retries, and asynchronous workflow reference."
  }),
  source({
    id: "aws-sns-docs",
    title: "Amazon SNS Documentation",
    url: "https://docs.aws.amazon.com/sns/",
    sourceType: "official-docs",
    category: "AWS Messaging",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Pub/sub and fanout architecture reference."
  }),
  source({
    id: "aws-eventbridge-docs",
    title: "Amazon EventBridge Documentation",
    url: "https://docs.aws.amazon.com/eventbridge/",
    sourceType: "official-docs",
    category: "AWS Messaging",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Event routing and event-driven architecture reference."
  }),
  source({
    id: "aws-cloudwatch-docs",
    title: "Amazon CloudWatch Documentation",
    url: "https://docs.aws.amazon.com/cloudwatch/",
    sourceType: "official-docs",
    category: "AWS Observability",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Monitoring, metrics, alarms, and operational visibility reference."
  }),
  source({
    id: "aws-xray-docs",
    title: "AWS X-Ray Documentation",
    url: "https://docs.aws.amazon.com/xray/",
    sourceType: "official-docs",
    category: "AWS Observability",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Tracing and distributed request diagnosis reference."
  }),
  source({
    id: "aws-route53-docs",
    title: "Amazon Route 53 Documentation",
    url: "https://docs.aws.amazon.com/route53/",
    sourceType: "official-docs",
    category: "AWS Networking",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "DNS, routing, failover, and edge routing reference."
  }),
  source({
    id: "aws-cloudfront-docs",
    title: "Amazon CloudFront Documentation",
    url: "https://docs.aws.amazon.com/cloudfront/",
    sourceType: "official-docs",
    category: "AWS Edge / CDN",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Content delivery, caching, signed URLs, and edge distribution reference."
  }),
  source({
    id: "js-mdn-guide",
    title: "MDN JavaScript Guide",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    sourceType: "official-docs",
    category: "JavaScript",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical language refresh for backend and interview fundamentals."
  }),
  source({
    id: "ts-handbook",
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    sourceType: "official-docs",
    category: "TypeScript",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical typed modeling reference for backend APIs and LLD."
  }),
  source({
    id: "node-docs",
    title: "Node.js API Docs",
    url: "https://nodejs.org/docs/latest/api/",
    sourceType: "official-docs",
    category: "Node.js",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical Node.js runtime and backend API reference."
  }),
  source({
    id: "node-learn",
    title: "Node.js Learn",
    url: "https://nodejs.org/en/learn",
    sourceType: "official-docs",
    category: "Node.js",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Practical Node.js learning reference for production backend topics."
  }),
  source({
    id: "express-docs",
    title: "Express Documentation",
    url: "https://expressjs.com/",
    sourceType: "official-docs",
    category: "Node.js Backend",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "API routing and middleware design reference."
  }),
  source({
    id: "nodebestpractices",
    title: "Node.js Best Practices",
    url: "https://github.com/goldbergyoni/nodebestpractices",
    sourceType: "github-repository",
    category: "Node.js",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Production Node.js architecture, reliability, testing, and security practices."
  }),
  source({
    id: "owasp-cheat-sheets",
    title: "OWASP Cheat Sheet Series",
    url: "https://cheatsheetseries.owasp.org/",
    sourceType: "official-docs",
    category: "Security",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Application security and threat-modeling reference."
  }),
  source({
    id: "oauth-docs",
    title: "OAuth 2.0",
    url: "https://oauth.net/2/",
    sourceType: "official-docs",
    category: "Authentication / Authorization",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Authentication and authorization protocol reference."
  }),
  source({
    id: "jwt-intro",
    title: "JWT Introduction",
    url: "https://jwt.io/introduction",
    sourceType: "official-docs",
    category: "Authentication / Authorization",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Token structure and interview discussion reference."
  }),
  source({
    id: "db-postgres-docs",
    title: "PostgreSQL Docs",
    url: "https://www.postgresql.org/docs/",
    sourceType: "official-docs",
    category: "Databases",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical source for indexing, transactions, and query planning."
  }),
  source({
    id: "postgres-indexes-docs",
    title: "PostgreSQL Indexes",
    url: "https://www.postgresql.org/docs/current/indexes.html",
    sourceType: "official-docs",
    category: "Databases",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Index design and query optimization reference."
  }),
  source({
    id: "postgres-transactions-docs",
    title: "PostgreSQL Transaction Isolation",
    url: "https://www.postgresql.org/docs/current/transaction-iso.html",
    sourceType: "official-docs",
    category: "Databases",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Transaction and consistency tradeoff reference."
  }),
  source({
    id: "db-redis-docs",
    title: "Redis Docs",
    url: "https://redis.io/docs/latest/",
    sourceType: "official-docs",
    category: "Databases",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical source for Redis caching and data structure tradeoffs."
  }),
  source({
    id: "redis-rate-limiting",
    title: "Redis Rate Limiting Patterns",
    url: "https://redis.io/redis-best-practices/basic-rate-limiting/",
    sourceType: "official-docs",
    category: "Redis / Rate Limiting",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Rate limiting and abuse-protection implementation reference."
  }),
  source({
    id: "dist-google-sre-book",
    title: "Google SRE Book",
    url: "https://sre.google/sre-book/table-of-contents/",
    sourceType: "book",
    category: "Observability / Reliability",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical reliability, SLO, incident, and operations reference."
  }),
  source({
    id: "google-sre-workbook",
    title: "Google SRE Workbook",
    url: "https://sre.google/workbook/table-of-contents/",
    sourceType: "book",
    category: "Observability / Reliability",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Practical SRE implementation and incident response reference."
  }),
  source({
    id: "opentelemetry-docs",
    title: "OpenTelemetry Documentation",
    url: "https://opentelemetry.io/docs/",
    sourceType: "official-docs",
    category: "Observability",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Vendor-neutral logs, metrics, and traces reference."
  }),
  source({
    id: "kubernetes-docs",
    title: "Kubernetes Documentation",
    url: "https://kubernetes.io/docs/",
    sourceType: "official-docs",
    category: "Cloud / DevOps",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Deferred P1/P2 cloud-native operations reference for later Architect breadth."
  }),
  source({
    id: "hld-system-design-primer",
    title: "System Design Primer",
    url: "https://github.com/donnemartin/system-design-primer",
    sourceType: "github-repository",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "High-signal HLD interview preparation and architecture topic discovery."
  }),
  source({
    id: "hld-awesome-system-design",
    title: "Awesome System Design Resources",
    url: "https://github.com/ashishps1/awesome-system-design-resources",
    sourceType: "github-repository",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Discovery source for HLD, architecture, and distributed systems resources."
  }),
  source({
    id: "hld-bytebytego",
    title: "ByteByteGo",
    url: "https://bytebytego.com/",
    sourceType: "interview-guide",
    category: "System Design / HLD",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Practical system design explanation and interview framing source."
  }),
  source({
    id: "backend-roadmap",
    title: "roadmap.sh Backend Roadmap",
    url: "https://roadmap.sh/backend",
    sourceType: "roadmap",
    category: "Backend Engineering",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Market-aligned backend topic coverage and sequencing signal."
  }),
  source({
    id: "hld-roadmap-system-design",
    title: "roadmap.sh System Design Roadmap",
    url: "https://roadmap.sh/system-design",
    sourceType: "roadmap",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Market-aligned HLD topic coverage and projection validation."
  }),
  source({
    id: "sa-roadmap-aws",
    title: "roadmap.sh AWS Roadmap",
    url: "https://roadmap.sh/aws",
    sourceType: "roadmap",
    category: "Solution Architect",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "AWS learning sequence validation for Architect projection."
  }),
  source({
    id: "sa-roadmap-devops",
    title: "roadmap.sh DevOps Roadmap",
    url: "https://roadmap.sh/devops",
    sourceType: "roadmap",
    category: "DevOps / Cloud",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Operational maturity and deployment-awareness signal."
  }),
  source({
    id: "lld-grokking-oop",
    title: "Refactoring Guru Design Patterns",
    url: "https://refactoring.guru/design-patterns",
    sourceType: "interview-guide",
    category: "LLD / Design Patterns",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "LLD vocabulary and design pattern reference."
  }),
  source({
    id: "leetcode-patterns",
    title: "LeetCode",
    url: "https://leetcode.com/problemset/",
    sourceType: "interview-guide",
    category: "DSA",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Coding interview practice source for senior backend DSA patterns."
  }),
  source({
    id: "neetcode-roadmap",
    title: "NeetCode Roadmap",
    url: "https://neetcode.io/roadmap",
    sourceType: "roadmap",
    category: "DSA",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Pattern-based coding interview roadmap."
  }),
  source({
    id: "js-33-concepts",
    title: "33 JavaScript Concepts",
    url: "https://github.com/leonardomso/33-js-concepts",
    sourceType: "github-repository",
    category: "JavaScript",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "JavaScript concept interview refresh."
  }),
  source({
    id: "js-wtfjs",
    title: "wtfjs",
    url: "https://github.com/denysdovhan/wtfjs",
    sourceType: "github-repository",
    category: "JavaScript",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "JavaScript edge-case interview awareness."
  }),
  source({
    id: "staff-staffeng",
    title: "StaffEng",
    url: "https://staffeng.com/",
    sourceType: "career-framework",
    category: "Lead / Principal / Staff Engineering",
    tier: "tier-4",
    reliability: "high",
    founderBetaRelevance: "Technical leadership and seniority signal for Staff/Principal/Architect-adjacent readiness."
  }),
  source({
    id: "staff-engineers-path",
    title: "The Staff Engineer's Path",
    url: "https://www.oreilly.com/library/view/the-staff-engineers/9781098118723/",
    sourceType: "book",
    category: "Technical Leadership",
    tier: "tier-4",
    reliability: "high",
    founderBetaRelevance: "Staff-level influence, communication, and scope reference."
  }),
  source({
    id: "will-larson-staff",
    title: "Irrational Exuberance - Staff Engineering",
    url: "https://lethain.com/",
    sourceType: "engineering-blog",
    category: "Technical Leadership",
    tier: "tier-4",
    reliability: "high",
    founderBetaRelevance: "Engineering leadership, staff/principal scope, and organizational tradeoff reference."
  }),
  source({
    id: "beh-tech-handbook",
    title: "Tech Interview Handbook Behavioral",
    url: "https://www.techinterviewhandbook.org/behavioral-interview/",
    sourceType: "interview-guide",
    category: "Behavioral Interviews",
    tier: "tier-3",
    reliability: "high",
    founderBetaRelevance: "Behavioral interview structure and question discovery."
  }),
  source({
    id: "beh-amazon-lp",
    title: "Amazon Leadership Principles",
    url: "https://www.amazon.jobs/content/en/our-workplace/leadership-principles",
    sourceType: "career-framework",
    category: "Behavioral Interviews",
    tier: "tier-3",
    reliability: "high",
    founderBetaRelevance: "FAANG-style senior behavioral signal for ownership and leadership stories."
  }),
  source({
    id: "beh-mit-star",
    title: "MIT STAR Method",
    url: "https://capd.mit.edu/resources/the-star-method-for-behavioral-interviews/",
    sourceType: "career-framework",
    category: "Behavioral Interviews",
    tier: "tier-3",
    reliability: "high",
    founderBetaRelevance: "Structured behavioral story framing reference."
  }),
  source({
    id: "profile-tech-handbook-resume",
    title: "Tech Interview Handbook Resume",
    url: "https://www.techinterviewhandbook.org/resume/",
    sourceType: "interview-guide",
    category: "Resume / LinkedIn / GitHub / Portfolio",
    tier: "tier-3",
    reliability: "high",
    founderBetaRelevance: "Resume positioning and senior impact-bullet guidance."
  }),
  source({
    id: "profile-google-resume",
    title: "Google Resume Tips",
    url: "https://careers.google.com/how-we-hire/resume/",
    sourceType: "career-framework",
    category: "Resume / LinkedIn / GitHub / Portfolio",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Big-tech resume signal for application readiness."
  }),
  source({
    id: "github-profile-readme",
    title: "GitHub Profile README Docs",
    url: "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme",
    sourceType: "official-docs",
    category: "GitHub / Portfolio",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "GitHub proof-of-work presentation reference."
  }),
  source({
    id: "career-linkedin-solution-architect-jobs",
    title: "LinkedIn Solution Architect Jobs",
    url: "https://www.linkedin.com/jobs/search/?keywords=Solution%20Architect",
    sourceType: "job-description",
    category: "Career Strategy / Compensation / Applications",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Dynamic market signal for target-role expectations.",
    notes: "Requires manual recency review before beta-critical mapping approval."
  }),
  source({
    id: "career-linkedin-lead-backend-jobs",
    title: "LinkedIn Lead Backend Jobs",
    url: "https://www.linkedin.com/jobs/search/?keywords=Lead%20Backend%20Engineer",
    sourceType: "job-description",
    category: "Career Strategy / Compensation / Applications",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Dynamic market signal for Lead Backend overlap."
  }),
  source({
    id: "career-levels",
    title: "Levels.fyi",
    url: "https://www.levels.fyi/",
    sourceType: "career-framework",
    category: "Career Strategy / Compensation / Applications",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Compensation calibration support for target and stretch outcomes."
  }),
  source({
    id: "career-ambitionbox",
    title: "AmbitionBox Salaries",
    url: "https://www.ambitionbox.com/salaries",
    sourceType: "career-framework",
    category: "Career Strategy / Compensation / Applications",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "India compensation signal for Product/GCC calibration."
  }),
  source({
    id: "career-haseeb-negotiation",
    title: "Ten Rules for Negotiating a Job Offer",
    url: "https://haseebq.com/my-ten-rules-for-negotiating-a-job-offer/",
    sourceType: "career-framework",
    category: "Negotiation",
    tier: "tier-4",
    reliability: "medium",
    founderBetaRelevance: "Negotiation awareness and offer strategy reference."
  })
];
