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
  }),
  source({
    id: "geeksforgeeks-dsa",
    title: "GeeksforGeeks DSA Self-Paced",
    url: "https://www.geeksforgeeks.org/data-structures/",
    sourceType: "interview-guide",
    category: "DSA",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Comprehensive DSA concept reference with problem pattern coverage."
  }),
  source({
    id: "educative-grokking-coding",
    title: "Educative Grokking Coding Interview Patterns",
    url: "https://www.educative.io/courses/grokking-the-coding-interview",
    sourceType: "interview-guide",
    category: "DSA",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Pattern-based coding interview preparation for senior backend roles."
  }),
  // ── Phase 6A: DSA / Problem Solving Expansion ──
  source({
    id: "cp-algorithms",
    title: "CP-Algorithms",
    url: "https://cp-algorithms.com/",
    sourceType: "github-repository",
    category: "DSA",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Advanced algorithm patterns and complexity analysis reference."
  }),
  source({
    id: "algomonster",
    title: "AlgoMonster",
    url: "https://algo.monster/",
    sourceType: "interview-guide",
    category: "DSA",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Systematic coding interview pattern breakdown for DSA preparation."
  }),
  source({
    id: "interviewbit-dsa",
    title: "InterviewBit DSA",
    url: "https://www.interviewbit.com/courses/programming/",
    sourceType: "interview-guide",
    category: "DSA",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Curated DSA topic progression with timed mock tests."
  }),
  source({
    id: "hackerrank-dsa",
    title: "HackerRank DSA",
    url: "https://www.hackerrank.com/domains/data-structures",
    sourceType: "interview-guide",
    category: "DSA",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Practice problems across all DSA categories with difficulty progression."
  }),
  source({
    id: "codesignal-dsa",
    title: "CodeSignal Learn DSA",
    url: "https://codesignal.com/learn/",
    sourceType: "interview-guide",
    category: "DSA",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Assessment-focused DSA practice aligned with company interview rubrics."
  }),
  source({
    id: "geeksforgeeks-algorithms",
    title: "GeeksforGeeks Algorithms",
    url: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/",
    sourceType: "interview-guide",
    category: "DSA",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Algorithm category reference with implementations, complexity, and problem links."
  }),
  source({
    id: "visualgo",
    title: "VisuAlgo",
    url: "https://visualgo.net/",
    sourceType: "github-repository",
    category: "DSA",
    tier: "tier-3",
    reliability: "high",
    founderBetaRelevance: "Algorithm visualization for mental model building and teaching."
  }),
  source({
    id: "big-o-cheatsheet",
    title: "Big-O Cheatsheet",
    url: "https://www.bigocheatsheet.com/",
    sourceType: "interview-guide",
    category: "DSA",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Time and space complexity reference for interview preparation."
  }),
  source({
    id: "codewars-dsa",
    title: "Codewars",
    url: "https://www.codewars.com/",
    sourceType: "interview-guide",
    category: "DSA",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Community-driven code kata covering DSA patterns with peer solutions."
  }),
  source({
    id: "topcoder-dsa",
    title: "Topcoder DSA Tutorials",
    url: "https://www.topcoder.com/community/data-science/data-science-tutorials/",
    sourceType: "interview-guide",
    category: "DSA",
    tier: "tier-4",
    reliability: "medium",
    founderBetaRelevance: "Comprehensive algorithm tutorial archive for senior-level DSA depth."
  }),
  source({
    id: "princeton-algorithms",
    title: "Princeton Algorithms (Coursera)",
    url: "https://www.coursera.org/learn/algorithms-part1",
    sourceType: "interview-guide",
    category: "DSA",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Foundational data structures and algorithms course from Princeton."
  }),
  source({
    id: "mit-6006-intro-algorithms",
    title: "MIT 6.006 Introduction to Algorithms",
    url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
    sourceType: "interview-guide",
    category: "DSA",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Rigorous algorithm foundations with video lectures and problem sets."
  }),
  source({
    id: "algorithm-design-manual",
    title: "The Algorithm Design Manual",
    url: "https://www.algorist.com/",
    sourceType: "book",
    category: "DSA",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Practical algorithm design reference with war stories and problem catalog."
  }),
  source({
    id: "cracking-coding-interview",
    title: "Cracking the Coding Interview",
    url: "https://www.crackingthecodinginterview.com/",
    sourceType: "book",
    category: "DSA",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Classic coding interview preparation covering 189 real interview questions."
  }),
  source({
    id: "grokking-algorithms",
    title: "Grokking Algorithms",
    url: "https://www.manning.com/books/grokking-algorithms",
    sourceType: "book",
    category: "DSA",
    tier: "tier-3",
    reliability: "high",
    founderBetaRelevance: "Visual, example-driven algorithms book for conceptual understanding."
  }),
  source({
    id: "cses-fi-handbook",
    title: "Competitive Programming Handbook (CSES)",
    url: "https://cses.fi/book/book.pdf",
    sourceType: "book",
    category: "DSA",
    tier: "tier-4",
    reliability: "medium",
    founderBetaRelevance: "Comprehensive algorithm handbook for advanced topic coverage."
  }),
  // ── Phase 6A: HLD / System Design Expansion ──
  source({
    id: "ddia-book",
    title: "Designing Data-Intensive Applications",
    url: "https://dataintensive.net/",
    sourceType: "book",
    category: "System Design / HLD",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Authoritative reference on distributed systems, storage, and data architecture."
  }),
  source({
    id: "highscalability",
    title: "HighScalability Blog",
    url: "http://highscalability.com/",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Real-world system design case studies and architecture breakdowns."
  }),
  source({
    id: "martin-fowler-microservices",
    title: "Martin Fowler — Microservices Guide",
    url: "https://martinfowler.com/microservices/",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical microservices reference with architectural patterns and tradeoffs."
  }),
  source({
    id: "uber-engineering",
    title: "Uber Engineering Blog",
    url: "https://www.uber.com/en-IN/blog/engineering/",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Production-scale engineering architecture case studies."
  }),
  source({
    id: "netflix-tech-blog",
    title: "Netflix Tech Blog",
    url: "https://netflixtechblog.com/",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Streaming architecture, chaos engineering, and global-scale design patterns."
  }),
  source({
    id: "discord-engineering",
    title: "Discord Engineering Blog",
    url: "https://discord.com/category/engineering/",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Real-time messaging architecture and data-store design patterns."
  }),
  source({
    id: "stripe-blog",
    title: "Stripe Blog — Engineering",
    url: "https://stripe.com/blog/engineering",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Payment system architecture and API design patterns."
  }),
  source({
    id: "cloudflare-blog",
    title: "Cloudflare Blog",
    url: "https://blog.cloudflare.com/",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Edge computing, DDoS protection, and global network architecture."
  }),
  source({
    id: "confluent-blog",
    title: "Confluent Blog — Kafka Patterns",
    url: "https://www.confluent.io/blog/",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Event streaming patterns and Kafka architecture deep dives."
  }),
  source({
    id: "building-microservices",
    title: "Building Microservices — Sam Newman",
    url: "https://samnewman.io/",
    sourceType: "book",
    category: "System Design / HLD",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Authoritative microservices design, decomposition, and integration reference."
  }),
  source({
    id: "infoq-architecture",
    title: "InfoQ Architecture Presentations",
    url: "https://www.infoq.com/architecture/",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Conference architecture talks covering production system design patterns."
  }),
  source({
    id: "system-design-interview-alex-xu",
    title: "System Design Interview — Alex Xu",
    url: "https://www.amazon.com/System-Design-Interview-Insiders-Guide/dp/1736049119",
    sourceType: "book",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Interview-focused system design problems with step-by-step solutions."
  }),
  source({
    id: "system-design-interview-vol2",
    title: "System Design Interview Volume 2 — Alex Xu",
    url: "https://www.amazon.com/System-Design-Interview-Insiders-Guide/dp/1736049119",
    sourceType: "book",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Additional system design problems covering real-world interview scenarios."
  }),
  source({
    id: "instagram-engineering",
    title: "Instagram Engineering Blog",
    url: "https://engineering.instagram.com/",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Social media architecture, caching, and data-store scaling patterns."
  }),
  source({
    id: "linkedin-engineering",
    title: "LinkedIn Engineering Blog",
    url: "https://engineering.linkedin.com/",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Professional network architecture and data infrastructure patterns."
  }),
  // ── Phase 6A: LLD / Design Patterns Expansion ──
  source({
    id: "head-first-design-patterns",
    title: "Head First Design Patterns",
    url: "https://www.oreilly.com/library/view/head-first-design/9781492077992/",
    sourceType: "book",
    category: "LLD / Design Patterns",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Accessible design pattern reference with real-world examples and exercises."
  }),
  source({
    id: "clean-code",
    title: "Clean Code — Robert C. Martin",
    url: "https://www.oreilly.com/library/view/clean-code-a/9780136083238/",
    sourceType: "book",
    category: "LLD / Design Patterns",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Authoritative reference on code quality, naming, and maintainability."
  }),
  source({
    id: "clean-architecture",
    title: "Clean Architecture — Robert C. Martin",
    url: "https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/",
    sourceType: "book",
    category: "LLD / Design Patterns",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Architecture boundaries, dependency inversion, and system organization patterns."
  }),
  source({
    id: "gof-design-patterns",
    title: "Gang of Four Design Patterns",
    url: "https://www.oreilly.com/library/view/design-patterns-elements/0201633612/",
    sourceType: "book",
    category: "LLD / Design Patterns",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical design patterns reference — foundational for LLD vocabulary."
  }),
  source({
    id: "dzone-design-patterns",
    title: "DZone Design Patterns Guide",
    url: "https://dzone.com/refcardz/design-patterns",
    sourceType: "interview-guide",
    category: "LLD / Design Patterns",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Quick design pattern reference with examples and use-case guidance."
  }),
  source({
    id: "sourcemaking-design-patterns",
    title: "SourceMaking Design Patterns",
    url: "https://sourcemaking.com/design_patterns",
    sourceType: "interview-guide",
    category: "LLD / Design Patterns",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Structured design pattern catalog with intent, structure, and code examples."
  }),
  source({
    id: "ddd-quickly",
    title: "Domain-Driven Design Quickly",
    url: "https://www.domainlanguage.com/ddd/",
    sourceType: "book",
    category: "LLD / Design Patterns",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Concise DDD reference for bounded contexts, aggregates, and ubiquitous language."
  }),
  source({
    id: "uml-distilled",
    title: "UML Distilled — Martin Fowler",
    url: "https://www.oreilly.com/library/view/uml-distilled-3rd/020165783X/",
    sourceType: "book",
    category: "LLD / Design Patterns",
    tier: "tier-3",
    reliability: "high",
    founderBetaRelevance: "UML modeling reference for architecture documentation and design communication."
  }),
  source({
    id: "solid-principles-guide",
    title: "SOLID Principles Guide",
    url: "https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design",
    sourceType: "interview-guide",
    category: "LLD / Design Patterns",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "SOLID principles reference with examples for interview preparation."
  }),
  source({
    id: "lld-coding-interview",
    title: "Low Level Design Interview — Pratik Mali",
    url: "https://github.com/pratikmal/machine-coding-node",
    sourceType: "github-repository",
    category: "LLD / Design Patterns",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Machine coding LLD problems with Node.js implementations."
  }),
  source({
    id: "machine-coding-roulette",
    title: "Machine Coding Round — GitHub Resources",
    url: "https://github.com/ashishps1/awesome-low-level-design",
    sourceType: "github-repository",
    category: "LLD / Design Patterns",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Curated LLD problem collection with design discussion and solutions."
  }),
  // ── Phase 6A: Backend Engineering / Node.js / API Design Expansion ──
  source({
    id: "twelve-factor-app",
    title: "The Twelve-Factor App",
    url: "https://12factor.net/",
    sourceType: "official-docs",
    category: "Backend Engineering",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical SaaS application design methodology for production backend services."
  }),
  source({
    id: "rest-api-design-guidelines",
    title: "Microsoft REST API Guidelines",
    url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design",
    sourceType: "official-docs",
    category: "Backend Engineering",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Production REST API design conventions, pagination, and versioning patterns."
  }),
  source({
    id: "grpc-docs",
    title: "gRPC Documentation",
    url: "https://grpc.io/docs/",
    sourceType: "official-docs",
    category: "Backend Engineering",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "gRPC contract-first API design for inter-service communication patterns."
  }),
  source({
    id: "graphql-docs",
    title: "GraphQL Documentation",
    url: "https://graphql.org/learn/",
    sourceType: "official-docs",
    category: "Backend Engineering",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "GraphQL query language and API design patterns for modern backends."
  }),
  source({
    id: "martin-fowler-blog",
    title: "Martin Fowler's Blog",
    url: "https://martinfowler.com/",
    sourceType: "engineering-blog",
    category: "Backend Engineering",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Enterprise architecture, refactoring, and software design patterns."
  }),
  source({
    id: "kafka-docs",
    title: "Apache Kafka Documentation",
    url: "https://kafka.apache.org/documentation/",
    sourceType: "official-docs",
    category: "Backend Engineering",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Event streaming platform architecture and producer/consumer patterns."
  }),
  source({
    id: "rabbitmq-docs",
    title: "RabbitMQ Documentation",
    url: "https://www.rabbitmq.com/documentation.html",
    sourceType: "official-docs",
    category: "Backend Engineering",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Message broker patterns, exchanges, queues, and routing reference."
  }),
  source({
    id: "nginx-blog",
    title: "NGINX Blog",
    url: "https://www.nginx.com/blog/",
    sourceType: "engineering-blog",
    category: "Backend Engineering",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Reverse proxy, load balancing, and API gateway patterns."
  }),
  source({
    id: "api-security-best-practices",
    title: "API Security Best Practices",
    url: "https://github.com/shieldfy/API-Security-Checklist",
    sourceType: "github-repository",
    category: "Backend Engineering",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Production API security checklists for backend service hardening."
  }),
  source({
    id: "openapi-spec",
    title: "OpenAPI Specification",
    url: "https://swagger.io/specification/",
    sourceType: "official-docs",
    category: "Backend Engineering",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "API contract-first design standard for documentation and code generation."
  }),
  source({
    id: "json-api-spec",
    title: "JSON:API Specification",
    url: "https://jsonapi.org/",
    sourceType: "official-docs",
    category: "Backend Engineering",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Standard JSON API response format for consistent backend API design."
  }),
  source({
    id: "use-the-index-luke",
    title: "Use The Index, Luke",
    url: "https://use-the-index-luke.com/",
    sourceType: "book",
    category: "Databases",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Comprehensive SQL indexing and query performance reference."
  }),
  source({
    id: "pganalyze-blog",
    title: "pganalyze Blog — Postgres Performance",
    url: "https://pganalyze.com/blog",
    sourceType: "engineering-blog",
    category: "Databases",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "PostgreSQL query performance, indexing, and vacuum deep dives."
  }),
  source({
    id: "mongodb-docs",
    title: "MongoDB Documentation",
    url: "https://www.mongodb.com/docs/",
    sourceType: "official-docs",
    category: "Databases",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "MongoDB aggregation, indexing, and schema design patterns."
  }),
  source({
    id: "cockroachdb-blog",
    title: "CockroachDB Blog — Distributed SQL",
    url: "https://www.cockroachlabs.com/blog/",
    sourceType: "engineering-blog",
    category: "Databases",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Distributed SQL database architecture and consistency patterns."
  }),
  // ── Phase 6A: AWS / Cloud Expansion ──
  source({
    id: "aws-cdk-docs",
    title: "AWS CDK Documentation",
    url: "https://docs.aws.amazon.com/cdk/",
    sourceType: "official-docs",
    category: "AWS Infrastructure as Code",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Infrastructure-as-code patterns for AWS resource provisioning."
  }),
  source({
    id: "aws-cloudformation-docs",
    title: "AWS CloudFormation Documentation",
    url: "https://docs.aws.amazon.com/cloudformation/",
    sourceType: "official-docs",
    category: "AWS Infrastructure as Code",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Declarative AWS resource modeling and infrastructure automation."
  }),
  source({
    id: "aws-eks-docs",
    title: "Amazon EKS Documentation",
    url: "https://docs.aws.amazon.com/eks/",
    sourceType: "official-docs",
    category: "AWS Compute",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Kubernetes on AWS reference for container orchestration patterns."
  }),
  source({
    id: "aws-waf-docs",
    title: "AWS WAF Documentation",
    url: "https://docs.aws.amazon.com/waf/",
    sourceType: "official-docs",
    category: "AWS Security",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Web application firewall rules and DDoS protection patterns."
  }),
  source({
    id: "aws-shield-docs",
    title: "AWS Shield Documentation",
    url: "https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html",
    sourceType: "official-docs",
    category: "AWS Security",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "DDoS protection and mitigation patterns for production workloads."
  }),
  source({
    id: "aws-backup-docs",
    title: "AWS Backup Documentation",
    url: "https://docs.aws.amazon.com/aws-backup/",
    sourceType: "official-docs",
    category: "AWS Storage",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Centralized backup and disaster recovery policy management."
  }),
  source({
    id: "aws-step-functions-docs",
    title: "AWS Step Functions Documentation",
    url: "https://docs.aws.amazon.com/step-functions/",
    sourceType: "official-docs",
    category: "AWS Compute",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Workflow orchestration and state machine design patterns."
  }),
  source({
    id: "aws-cost-management-docs",
    title: "AWS Cost Management Documentation",
    url: "https://docs.aws.amazon.com/cost-management/",
    sourceType: "official-docs",
    category: "AWS Cost Optimization",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Cost optimization, budgeting, and tagging strategy reference."
  }),
  source({
    id: "aws-elasticache-docs",
    title: "Amazon ElastiCache Documentation",
    url: "https://docs.aws.amazon.com/elasticache/",
    sourceType: "official-docs",
    category: "AWS Caching",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "In-memory caching with Redis/Memcached for application performance."
  }),
  source({
    id: "aws-api-gateway-docs",
    title: "Amazon API Gateway Documentation",
    url: "https://docs.aws.amazon.com/apigateway/",
    sourceType: "official-docs",
    category: "AWS Networking",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "API management, throttling, and integration patterns."
  }),
  // ── Phase 6A: Observability / Reliability Expansion ──
  source({
    id: "honeycomb-blog",
    title: "Honeycomb Blog — Observability",
    url: "https://www.honeycomb.io/blog",
    sourceType: "engineering-blog",
    category: "Observability",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Practical observability patterns beyond traditional monitoring."
  }),
  source({
    id: "grafana-docs",
    title: "Grafana Documentation",
    url: "https://grafana.com/docs/grafana/latest/",
    sourceType: "official-docs",
    category: "Observability",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Dashboard and metrics visualization reference for operational visibility."
  }),
  source({
    id: "datadog-blog",
    title: "Datadog Engineering Blog",
    url: "https://www.datadoghq.com/blog/engineering/",
    sourceType: "engineering-blog",
    category: "Observability",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Monitoring, distributed tracing, and APM implementation patterns."
  }),
  source({
    id: "prometheus-docs",
    title: "Prometheus Documentation",
    url: "https://prometheus.io/docs/",
    sourceType: "official-docs",
    category: "Observability",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Metrics collection, alerting, and time-series monitoring reference."
  }),
  source({
    id: "chaos-engineering-principles",
    title: "Principles of Chaos Engineering",
    url: "https://principlesofchaos.org/",
    sourceType: "book",
    category: "Observability / Reliability",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Chaos engineering principles for resilience testing and failure modeling."
  }),
  source({
    id: "incident-response-guide",
    title: "Incident Response Guide — PagerDuty",
    url: "https://response.pagerduty.com/",
    sourceType: "career-framework",
    category: "Observability / Reliability",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Incident response lifecycle and on-call best practices."
  }),
  // ── Phase 6A: Security Expansion ──
  source({
    id: "owasp-top-ten",
    title: "OWASP Top 10 Web Security Risks",
    url: "https://owasp.org/www-project-top-ten/",
    sourceType: "official-docs",
    category: "Security",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical web application security risk classification and mitigation reference."
  }),
  source({
    id: "sans-security-essentials",
    title: "SANS Security Essentials",
    url: "https://www.sans.org/security-resources/",
    sourceType: "career-framework",
    category: "Security",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Security fundamentals and certification roadmap reference."
  }),
  source({
    id: "cve-database",
    title: "Common Vulnerabilities and Exposures (CVE)",
    url: "https://cve.mitre.org/",
    sourceType: "official-docs",
    category: "Security",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Vulnerability database for awareness of production security risks."
  }),
  source({
    id: "lets-encrypt-tls",
    title: "Let's Encrypt — TLS Basics",
    url: "https://letsencrypt.org/how-it-works/",
    sourceType: "official-docs",
    category: "Security",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "TLS/SSL fundamentals, certificate lifecycle, and encryption reference."
  }),
  source({
    id: "nist-security-guidelines",
    title: "NIST Cybersecurity Framework",
    url: "https://www.nist.gov/cyberframework",
    sourceType: "official-docs",
    category: "Security",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Enterprise security framework for compliance and risk assessment."
  }),
  // ── Phase 6A: Behavioral / Interview Expansion ──
  source({
    id: "cracking-pm-interview",
    title: "Cracking the PM Interview — Behavioral",
    url: "https://www.crackingthepminterview.com/",
    sourceType: "book",
    category: "Behavioral Interviews",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Behavioral interview structure and product-sense framing for architect roles."
  }),
  source({
    id: "exponent-behavioral",
    title: "Exponent Behavioral Interview Guide",
    url: "https://www.tryexponent.com/behavioral-interview",
    sourceType: "interview-guide",
    category: "Behavioral Interviews",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Structured behavioral question preparation with sample responses."
  }),
  source({
    id: "interviewing-io",
    title: "Interviewing.io Behavioral Prep",
    url: "https://interviewing.io/guides/behavioral-interview",
    sourceType: "interview-guide",
    category: "Behavioral Interviews",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Anonymous behavioral practice sessions with peer feedback."
  }),
  source({
    id: "pramp-behavioral",
    title: "Pramp Behavioral Practice",
    url: "https://www.pramp.com/",
    sourceType: "interview-guide",
    category: "Behavioral Interviews",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Free peer-to-peer mock interview platform for behavioral rounds."
  }),
  source({
    id: "behavioral-star-examples",
    title: "STAR Method Example Answers — The Muse",
    url: "https://www.themuse.com/advice/star-interview-method",
    sourceType: "career-framework",
    category: "Behavioral Interviews",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "STAR method examples for senior behavioral interview storytelling."
  }),
  // ── Phase 6A: Career / Resume / Negotiation Expansion ──
  source({
    id: "startup-resume-guide",
    title: "The Startup Resume Guide",
    url: "https://www.startupresume.io/",
    sourceType: "career-framework",
    category: "Resume / LinkedIn / GitHub / Portfolio",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Resume crafting guidance for senior engineering and architect roles."
  }),
  source({
    id: "levels-negotiation",
    title: "Levels.fyi Negotiation Guide",
    url: "https://www.levels.fyi/blog/negotiate-compensation-offer.html",
    sourceType: "career-framework",
    category: "Negotiation",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Compensation negotiation strategies with data-backed leverage points."
  }),
  source({
    id: "linkedin-profile-optimization",
    title: "LinkedIn Profile Optimization Guide",
    url: "https://www.linkedin.com/business/sales/blog/profile-best-practices/17-steps-to-a-better-linkedin-profile",
    sourceType: "career-framework",
    category: "Resume / LinkedIn / GitHub / Portfolio",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "LinkedIn profile positioning for architect and senior roles."
  }),
  source({
    id: "portfolio-proof-work-guide",
    title: "Building a Technical Portfolio",
    url: "https://github.com/portfolio-performance/portfolio",
    sourceType: "career-framework",
    category: "Resume / LinkedIn / GitHub / Portfolio",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Proof-of-work portfolio guidance for solution architect roles."
  }),
  source({
    id: "job-application-strategy",
    title: "Job Application Strategy — Levels FYI",
    url: "https://www.levels.fyi/blog/how-to-apply-to-jobs.html",
    sourceType: "career-framework",
    category: "Career Strategy / Compensation / Applications",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Strategic job application timing and pipeline management guidance."
  }),
  source({
    id: "compensation-negotiation-kalzumeus",
    title: "Salary Negotiation — Kalzumeus",
    url: "https://www.kalzumeus.com/2012/01/23/salary-negotiation/",
    sourceType: "engineering-blog",
    category: "Negotiation",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Classic salary negotiation advice for senior engineering candidates."
  }),
  // ── Phase 6A: Engineering Leadership Expansion ──
  source({
    id: "manager-path-engineering",
    title: "The Engineering Manager — Camille Fournier",
    url: "https://www.oreilly.com/library/view/the-managers-path/9781491973882/",
    sourceType: "book",
    category: "Technical Leadership",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Engineering management transition reference for architect-adjacent roles."
  }),
  source({
    id: "beyond-leadership-stories",
    title: "Beyond Leadership Stories — Staff Engineering",
    url: "https://staffeng.com/stories/",
    sourceType: "engineering-blog",
    category: "Lead / Principal / Staff Engineering",
    tier: "tier-3",
    reliability: "high",
    founderBetaRelevance: "First-hand staff engineering experiences and career progression stories."
  }),
  source({
    id: "tech-leadership-guidelines",
    title: "Tech Leadership Guidelines — Irrational Exuberance",
    url: "https://lethain.com/tech-leadership/",
    sourceType: "engineering-blog",
    category: "Technical Leadership",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Technical leadership frameworks for architect and staff-level influence."
  }),

  // ── Roadmap Pack 1: JS / Node / TS Sources ────────────────────────────
  source({
    id: "v8-docs",
    title: "V8 JavaScript Engine Documentation",
    url: "https://v8.dev/docs",
    sourceType: "official-docs",
    category: "JavaScript",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical V8 engine reference for JS memory management, hidden classes, and JIT compilation."
  }),
  source({
    id: "js-you-dont-know-js",
    title: "You Don't Know JS — Book Series",
    url: "https://github.com/getify/You-Dont-Know-JS",
    sourceType: "book",
    category: "JavaScript",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Deep JS internals reference for closures, prototypes, async, and scope."
  }),
  source({
    id: "js-javascript-info",
    title: "JavaScript.info",
    url: "https://javascript.info/",
    sourceType: "official-docs",
    category: "JavaScript",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Comprehensive modern JavaScript tutorial for language core and async patterns."
  }),
  source({
    id: "vitest-docs",
    title: "Vitest Documentation",
    url: "https://vitest.dev/guide/",
    sourceType: "official-docs",
    category: "JavaScript Testing",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Official Vitest reference — the testing framework used by EngineeringOS."
  }),
  source({
    id: "typescript-docs",
    title: "TypeScript Official Documentation",
    url: "https://www.typescriptlang.org/docs/",
    sourceType: "official-docs",
    category: "TypeScript",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical TypeScript reference for type system, generics, and configuration."
  }),
  source({
    id: "node-testing",
    title: "Node.js Testing — node:test module",
    url: "https://nodejs.org/api/test.html",
    sourceType: "official-docs",
    category: "Node.js Testing",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Node.js built-in test runner for understanding Node-native testing patterns."
  }),

  // ── Roadmap Pack 2: System Design / LLD / Architecture Sources ──────
  source({
    id: "ddd-strategic-design",
    title: "Domain-Driven Design Strategic Patterns",
    url: "https://www.domainlanguage.com/ddd/strategic-design/",
    sourceType: "book",
    category: "System Design / HLD",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Strategic DDD patterns — bounded contexts, context maps, ubiquitous language for service decomposition."
  }),
  source({
    id: "db-migration-patterns",
    title: "Database Migration and Schema Evolution Patterns",
    url: "https://www.principlesofchaos.com/database-migration-patterns/",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Zero-downtime migration, expand-contract, schema versioning, and branching patterns."
  }),
  source({
    id: "resilience4j-patterns",
    title: "Resilience4j — Circuit Breaker, Bulkhead, Retry Patterns",
    url: "https://resilience4j.readme.io/docs/getting-started",
    sourceType: "official-docs",
    category: "Resilience Patterns",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Production circuit breaker, bulkhead, retry, rate limiter, and timeout patterns reference."
  }),
  source({
    id: "architecture-decision-records",
    title: "Architecture Decision Records — ADR Pattern",
    url: "https://adr.github.io/",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Canonical ADR format and governance pattern for documenting architecture tradeoffs."
  }),
  source({
    id: "engineering-blog-real-time",
    title: "Real-Time Architecture Case Studies — Discord, WhatsApp",
    url: "https://discord.com/blog/how-discord-stores-billions-of-messages",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Real-world real-time system architectures for chat and presence system design references."
  }),
  source({
    id: "distributed-systems-patterns",
    title: "Distributed Systems Patterns — Canonical References",
    url: "https://martin.kleppmann.com/patterns/",
    sourceType: "book",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Distributed systems patterns for consistent hashing, consensus, replication, and partitioning."
  }),

  // ════════════════════════════════════════════════════════════
  // Roadmap Pack 3 — Security
  // ════════════════════════════════════════════════════════════
  source({
    id: "portswigger-web-security",
    title: "PortSwigger Web Security Academy",
    url: "https://portswigger.net/web-security",
    sourceType: "security-guides",
    category: "Security",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Interactive labs and deep-dive content for OWASP Top 10, SSRF, CSRF, XSS, SQL injection, and authentication vulnerabilities."
  }),
  source({
    id: "snyk-vulnerability-db",
    title: "Snyk Vulnerability Database",
    url: "https://security.snyk.io/",
    sourceType: "security-guides",
    category: "Security",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Open-source dependency vulnerability database for assessing and managing supply-chain security risks."
  }),
  source({
    id: "latacora-security-practices",
    title: "Latacora Security Practices — The Startup CISO's Handbook",
    url: "https://latacora.com/playbook/",
    sourceType: "security-guides",
    category: "Security",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Practical security practices for startups covering authentication, IAM, secrets management, and incident response."
  }),
  source({
    id: "security-headers-guide",
    title: "OWASP Secure Headers Project",
    url: "https://owasp.org/www-project-secure-headers/",
    sourceType: "security-guides",
    category: "Security",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Security header reference for Content-Security-Policy, HSTS, X-Frame-Options, and other HTTP security headers."
  }),

  // ════════════════════════════════════════════════════════════
  // Roadmap Pack 3 — Testing & QA
  // ════════════════════════════════════════════════════════════
  source({
    id: "martin-fowler-testing",
    title: "Martin Fowler — Testing Strategies",
    url: "https://martinfowler.com/testing/",
    sourceType: "engineering-blog",
    category: "Testing & QA",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Authoritative writing on test pyramids, contract testing, microservice test strategies, and testability."
  }),
  source({
    id: "pact-docs",
    title: "Pact — Contract Testing Documentation",
    url: "https://docs.pact.io/",
    sourceType: "official-docs",
    category: "Testing & QA",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Canonical contract testing framework for consumer-driven contracts between services."
  }),
  source({
    id: "k6-docs",
    title: "k6 — Load Testing Documentation",
    url: "https://k6.io/docs/",
    sourceType: "official-docs",
    category: "Testing & QA",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Open-source load testing tool for performance, stress, and reliability testing of backend APIs."
  }),
  source({
    id: "testing-library-docs",
    title: "Testing Library Documentation",
    url: "https://testing-library.com/docs/",
    sourceType: "official-docs",
    category: "Testing & QA",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical testing-library approach for unit and integration tests focused on user behavior rather than implementation."
  }),
  source({
    id: "cypress-docs",
    title: "Cypress — End-to-End Testing Documentation",
    url: "https://docs.cypress.io/",
    sourceType: "official-docs",
    category: "Testing & QA",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "E2E testing framework for browser-based testing, component testing, and API testing in CI pipelines."
  }),
  source({
    id: "google-testing-blog",
    title: "Google Testing Blog",
    url: "https://testing.googleblog.com/",
    sourceType: "engineering-blog",
    category: "Testing & QA",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Industry testing best practices from Google covering test size, flaky tests, continuous integration, and testing culture."
  }),

  // ════════════════════════════════════════════════════════════
  // Roadmap Pack 3 — Containerization / Docker
  // ════════════════════════════════════════════════════════════
  source({
    id: "docker-docs",
    title: "Docker Official Documentation",
    url: "https://docs.docker.com/",
    sourceType: "official-docs",
    category: "Containerization",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical Docker reference for images, layers, networking, volumes, Compose, and production container patterns."
  }),
  // ════════════════════════════════════════════════════════════
  // Roadmap Pack 3 — Real-Time Systems
  // ════════════════════════════════════════════════════════════
  source({
    id: "websocket-rfc",
    title: "RFC 6455 — The WebSocket Protocol",
    url: "https://datatracker.ietf.org/doc/html/rfc6455",
    sourceType: "official-docs",
    category: "Real-Time Systems",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Definitive WebSocket protocol specification covering handshake, framing, masking, and connection lifecycle."
  }),
  source({
    id: "streaming-systems-book",
    title: "Streaming Systems (Akidau et al.)",
    url: "https://www.oreilly.com/library/view/streaming-systems/9781491983863/",
    sourceType: "book",
    category: "Real-Time Systems",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Foundational book on stream processing, event-time vs processing-time, watermarks, and exactly-once semantics."
  }),

  // ════════════════════════════════════════════════════════════
  // Roadmap Pack 4 — AWS Architecture
  // ════════════════════════════════════════════════════════════
  source({
    id: "aws-organizations-docs",
    title: "AWS Organizations Documentation",
    url: "https://docs.aws.amazon.com/organizations/",
    sourceType: "official-docs",
    category: "AWS Governance",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Multi-account strategy, SCPs, and consolidated billing reference."
  }),
  source({
    id: "aws-transit-gateway-docs",
    title: "AWS Transit Gateway Documentation",
    url: "https://docs.aws.amazon.com/vpc/latest/tgw/",
    sourceType: "official-docs",
    category: "AWS Networking",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Centralized network hub, VPC peering alternatives, and hybrid connectivity reference."
  }),
  source({
    id: "aws-config-docs",
    title: "AWS Config Documentation",
    url: "https://docs.aws.amazon.com/config/",
    sourceType: "official-docs",
    category: "AWS Governance",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Resource compliance, configuration rules, and governance auditing reference."
  }),
  source({
    id: "aws-trusted-advisor-docs",
    title: "AWS Trusted Advisor Documentation",
    url: "https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html",
    sourceType: "official-docs",
    category: "AWS Cost Optimization",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Cost optimization checks, performance recommendations, and security best-practice reference."
  }),
  source({
    id: "aws-security-hub-docs",
    title: "AWS Security Hub Documentation",
    url: "https://docs.aws.amazon.com/securityhub/",
    sourceType: "official-docs",
    category: "AWS Security",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Centralized security posture, compliance checks, and automated remediation reference."
  }),
  source({
    id: "aws-aurora-docs",
    title: "Amazon Aurora Documentation",
    url: "https://docs.aws.amazon.com/aurora/",
    sourceType: "official-docs",
    category: "AWS Databases",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Aurora architecture, storage, replication, and serverless design reference."
  }),

  // ════════════════════════════════════════════════════════════
  // Roadmap Pack 4 — Reliability Engineering
  // ════════════════════════════════════════════════════════════
  source({
    id: "incident-management-best-practices",
    title: "Incident Management Best Practices — Atlassian",
    url: "https://www.atlassian.com/incident-management",
    sourceType: "career-framework",
    category: "Observability / Reliability",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Incident lifecycle, severity frameworks, and escalation best practices."
  }),
  source({
    id: "on-call-best-practices",
    title: "On-Call Best Practices — PagerDuty",
    url: "https://www.pagerduty.com/resources/learn/on-call-best-practices/",
    sourceType: "career-framework",
    category: "Observability / Reliability",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "On-call scheduling, escalation policies, and incident response workflow."
  }),
  source({
    id: "capacity-planning-guide",
    title: "Capacity Planning Guide — Google SRE",
    url: "https://sre.google/workbook/capacity-planning/",
    sourceType: "book",
    category: "Observability / Reliability",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Capacity planning methodologies, demand forecasting, and resource provisioning patterns."
  }),
  source({
    id: "production-readiness-guide",
    title: "Production Readiness Review Framework — Google SRE",
    url: "https://sre.google/workbook/production-readiness/",
    sourceType: "book",
    category: "Observability / Reliability",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "PRR criteria, service maturity assessment, and launch checklist patterns."
  }),
  source({
    id: "post-incident-review-guide",
    title: "Post-Incident Review Guide — Google SRE",
    url: "https://sre.google/workbook/post-incident-review/",
    sourceType: "book",
    category: "Observability / Reliability",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Blameless postmortem culture, incident analysis, and action-item tracking patterns."
  }),
  source({
    id: "chaos-engineering-tools",
    title: "Chaos Engineering Tools — Gremlin, Litmus, Chaos Mesh",
    url: "https://gremlin.com/community/",
    sourceType: "engineering-blog",
    category: "Observability / Reliability",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Chaos engineering tooling, failure injection, and resilience testing patterns."
  }),

  // ════════════════════════════════════════════════════════════
  // Roadmap Pack 4 — Platform Engineering
  // ════════════════════════════════════════════════════════════
  source({
    id: "terraform-docs",
    title: "Terraform Documentation",
    url: "https://developer.hashicorp.com/terraform/docs",
    sourceType: "official-docs",
    category: "Infrastructure as Code",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical Terraform reference for IaC patterns, modules, state management, and provisioning."
  }),
  source({
    id: "github-actions-docs",
    title: "GitHub Actions Documentation",
    url: "https://docs.github.com/en/actions",
    sourceType: "official-docs",
    category: "CI/CD",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "CI/CD pipeline design, workflow orchestration, and deployment automation reference."
  }),
  source({
    id: "platform-engineering-guide",
    title: "Platform Engineering — Humanitec Guide",
    url: "https://platformengineering.org/",
    sourceType: "engineering-blog",
    category: "Platform Engineering",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Platform engineering concepts, IDP architecture, and internal developer platform patterns."
  }),
  source({
    id: "backstage-docs",
    title: "Backstage — Spotify Developer Portal",
    url: "https://backstage.io/docs/",
    sourceType: "official-docs",
    category: "Platform Engineering",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Internal developer portal reference with service catalog, templates, and plugin architecture."
  }),
  source({
    id: "accelerate-book",
    title: "Accelerate — State of DevOps Report",
    url: "https://www.devops-research.com/research.html",
    sourceType: "book",
    category: "Platform Engineering",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "DORA metrics, deployment frequency, lead time, and DevOps capability measurement framework."
  }),
  source({
    id: "gitops-patterns",
    title: "GitOps — ArgoCD and Flux Patterns",
    url: "https://argo-cd.readthedocs.io/",
    sourceType: "official-docs",
    category: "CI/CD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "GitOps deployment patterns, declarative infrastructure, and automated sync workflows."
  }),
  source({
    id: "ci-cd-best-practices",
    title: "CI/CD Best Practices — Google Cloud",
    url: "https://cloud.google.com/architecture/devops",
    sourceType: "engineering-blog",
    category: "CI/CD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Continuous delivery pipeline patterns, deployment strategies, and release engineering practices."
  }),
  source({
    id: "service-ownership-guide",
    title: "Service Ownership — Teams and Services",
    url: "https://sre.google/sre-book/evolving-sre-engagement-model/",
    sourceType: "book",
    category: "Platform Engineering",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Service ownership models, team topology, and platform team interaction patterns."
  }),
  source({
    id: "golden-paths-guide",
    title: "Golden Paths and Scaffolding — Engineering Effectiveness",
    url: "https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-at-spotify/",
    sourceType: "engineering-blog",
    category: "Platform Engineering",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Golden path patterns, developer scaffolding, and paved-road platform design."
  }),
  source({
    id: "platform-maturity-model",
    title: "Platform Maturity Model — CNCF",
    url: "https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/",
    sourceType: "official-docs",
    category: "Platform Engineering",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Platform maturity stages, adoption metrics, and capability progression framework."
  }),

  // ════════════════════════════════════════════════════════════
  // Roadmap Pack 5 — Behavioral Leadership & Staff Engineering
  // ════════════════════════════════════════════════════════════
  source({
    id: "crucial-conversations-book",
    title: "Crucial Conversations — Patterson et al.",
    url: "https://www.crucialconversations.com/",
    sourceType: "book",
    category: "Behavioral / Leadership",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Handling high-stakes conversations, conflict resolution, and pushback for architect-level communication."
  }),
  source({
    id: "influence-without-authority",
    title: "Influence Without Authority — Cohen & Bradford",
    url: "https://www.wiley.com/en-us/Influence+Without+Authority%2C+3rd+Edition-p-9781119347712",
    sourceType: "book",
    category: "Behavioral / Leadership",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Cross-team influence models for architect and staff engineers operating without formal authority."
  }),
  source({
    id: "staff-engineers-arc",
    title: "The Staff Engineer's Arc — Will Larson",
    url: "https://staffeng.com/guides/staff-arc/",
    sourceType: "career-framework",
    category: "Lead / Principal / Staff Engineering",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Staff engineer scope archetypes, arc types, and transition framework from senior to staff."
  }),
  source({
    id: "technical-strategy-framework",
    title: "Technical Strategy and Roadmaps — Runtastic/Tom Geraghty",
    url: "https://www.infoq.com/articles/technical-strategy-roadmap-framework/",
    sourceType: "engineering-blog",
    category: "Technical Leadership",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Technical strategy document patterns, architecture roadmaps, and cross-team alignment frameworks."
  }),
  source({
    id: "engineering-culture-handbook",
    title: "Engineering Culture Handbook — Irrational Exuberance",
    url: "https://lethain.com/engineering-culture/",
    sourceType: "engineering-blog",
    category: "Technical Leadership",
    tier: "tier-3",
    reliability: "high",
    founderBetaRelevance: "Engineering culture patterns, standards definition, and organizational maturity guidance."
  }),
  source({
    id: "personal-brand-engineer",
    title: "Personal Branding for Engineers — Coding Blocks",
    url: "https://www.codingblocks.net/podcast/personal-branding-for-developers/",
    sourceType: "career-framework",
    category: "Career Strategy / Compensation / Applications",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Personal brand building strategies for senior engineers targeting architect and staff roles."
  }),
  source({
    id: "technical-blogging-guide",
    title: "Technical Blogging Guide — Hashnode/DEV",
    url: "https://guide.howtotechnicalwriting.com/",
    sourceType: "career-framework",
    category: "Resume / LinkedIn / GitHub / Portfolio",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Technical content creation patterns for building portfolio visibility and thought leadership."
  }),
  source({
    id: "conference-speaking-cfp",
    title: "Conference Speaking — CFP Preparation Guide",
    url: "https://www.cfpland.com/guides/speaking/",
    sourceType: "career-framework",
    category: "Career Strategy / Compensation / Applications",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Conference proposal writing, talk preparation, and speaker brand building for senior engineers."
  }),
  source({
    id: "behavioral-interview-frameworks",
    title: "Behavioral Interview Frameworks — STAR, CAR, SOAR Comparison",
    url: "https://www.themuse.com/advice/behavioral-interview-frameworks",
    sourceType: "interview-guide",
    category: "Behavioral Interviews",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Comparative interview story frameworks for tailoring responses to different company cultures."
  }),
  source({
    id: "story-inventory-method",
    title: "Story Inventory Method — Cracking the Coding Interview",
    url: "https://www.crackingthecodinginterview.com/",
    sourceType: "interview-guide",
    category: "Behavioral Interviews",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Preparing a catalog of 10-15 stories covering ownership, conflict, failure, leadership, and technical depth."
  }),
  source({
    id: "leadership-storytelling-guide",
    title: "Leadership Storytelling — Stanford GSB",
    url: "https://www.gsb.stanford.edu/insights/why-leadership-storytelling-essential",
    sourceType: "career-framework",
    category: "Behavioral / Leadership",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Leadership communication and storytelling techniques for staff and architect-level interviews."
  }),
  source({
    id: "staff-engineer-interview-prep",
    title: "Staff+ Engineering Interview Preparation — StaffEng",
    url: "https://staffeng.com/guides/interviewing/",
    sourceType: "career-framework",
    category: "Lead / Principal / Staff Engineering",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Staff engineer interview patterns, system design expectations, and behavioral depth requirements."
  }),

  // ── Pack 10I: First Real Import — Approved Candidates ───────────────────
  source({
    id: "confluent-eda-patterns",
    title: "Event-Driven Architecture Patterns — Confluent Blog",
    url: "https://www.confluent.io/blog/event-driven-architecture-patterns/",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Comprehensive guide to event-driven architecture patterns including event sourcing, CQRS, and saga orchestration."
  }),
  source({
    id: "system-design-primer",
    title: "System Design Primer — GitHub",
    url: "https://github.com/donnemartin/system-design-primer",
    sourceType: "github-repository",
    category: "System Design / HLD",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Comprehensive system design resource covering scalability, load balancing, caching, and data partitioning for interview preparation."
  }),
  source({
    id: "microservices-guide",
    title: "Microservices Guide — Martin Fowler",
    url: "https://martinfowler.com/articles/microservices.html",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "In-depth analysis of microservices architecture, trade-offs, and organizational implications."
  }),
  source({
    id: "gcp-security-foundations",
    title: "Google Cloud Security Foundations Guide",
    url: "https://cloud.google.com/architecture/security-foundations",
    sourceType: "official-docs",
    category: "Security",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Google Cloud security best practices covering identity, network security, data protection, and compliance foundations."
  }),

  // ── Pack 11H: Human Approved Canonical Graph Apply ───────────────────
  source({
    id: "aws-prescriptive-guidance-saga",
    title: "Saga Pattern - AWS Prescriptive Guidance",
    url: "https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga.html",
    sourceType: "official-docs",
    category: "AWS / Distributed Systems",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "AWS guidance for saga orchestration, compensating transactions, and distributed workflow consistency."
  }),
  source({
    id: "aws-eventbridge-pipes",
    title: "Amazon EventBridge Pipes",
    url: "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes.html",
    sourceType: "official-docs",
    category: "AWS / Cloud Architecture",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "EventBridge Pipes provides point-to-point integration between event sources and targets with optional filtering and enrichment, a key serverless integration pattern for AWS architects."
  }),
  source({
    id: "grpc-core-concepts",
    title: "gRPC Core Concepts",
    url: "https://grpc.io/docs/what-is-grpc/core-concepts/",
    sourceType: "official-docs",
    category: "Backend Engineering",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "gRPC core concepts including service definitions, message types, RPC lifecycle, streaming, and HTTP/2 transport — essential for API contract design and inter-service communication patterns."
  }),
  source({
    id: "nodejs-diagnostics-guide",
    title: "Node.js Diagnostics Guide",
    url: "https://nodejs.org/en/learn/diagnostics",
    sourceType: "official-docs",
    category: "Backend Engineering",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Official Node.js diagnostics guide covering debugging, profiling, memory analysis, performance monitoring, and production troubleshooting for Node.js applications."
  }),

  // ── Pack 12E: Autonomous Import Scale-Up Batch 1 ─────────────────
  source({
    id: "aws-step-functions-dev-guide",
    title: "AWS Step Functions Developer Guide",
    url: "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html",
    sourceType: "official-docs",
    category: "AWS / Cloud Architecture",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "AWS Step Functions Developer Guide covering workflow orchestration, state machine design patterns, error handling, and execution management for serverless workflows."
  }),
  source({
    id: "aws-lambda-best-practices",
    title: "AWS Lambda Best Practices",
    url: "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html",
    sourceType: "official-docs",
    category: "AWS / Cloud Architecture",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "AWS Lambda best practices covering function configuration, performance optimization, error handling, security, and operational excellence for serverless functions."
  }),
  source({
    id: "aws-ecs-capacity-providers",
    title: "Amazon ECS Capacity Providers",
    url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-capacity-providers.html",
    sourceType: "official-docs",
    category: "AWS / Cloud Architecture",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Amazon ECS Capacity Providers documentation covering cluster capacity management, Fargate/EC2 launch type strategies, auto-scaling, and capacity planning for container workloads."
  }),
  source({
    id: "aws-serverless-lens",
    title: "Serverless Lens (Well-Architected)",
    url: "https://docs.aws.amazon.com/wellarchitected/latest/serverless-applications-lens/welcome.html",
    sourceType: "official-docs",
    category: "AWS / Cloud Architecture",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Serverless Applications Lens extending the AWS Well-Architected Framework with serverless-specific design principles, best practices, and architecture review questions."
  }),
  source({
    id: "ddd-aggregate-design-canvas",
    title: "Aggregate Design Canvas",
    url: "https://github.com/ddd-crew/aggregate-design-canvas",
    sourceType: "github-repository",
    category: "System Design / LLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "DDD Aggregate Design Canvas providing structured templates and heuristics for identifying aggregate boundaries, consistency rules, and domain event modeling in tactical DDD."
  }),
  source({
    id: "microservices-patterns",
    title: "Microservices Patterns Catalog",
    url: "https://microservices.io/patterns/index.html",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Comprehensive catalog of microservices architecture patterns including decomposition, communication, data management, observability, and deployment patterns."
  }),
  source({
    id: "microsoft-api-guidelines",
    title: "Microsoft REST API Guidelines",
    url: "https://github.com/microsoft/api-guidelines",
    sourceType: "github-repository",
    category: "System Design / LLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Industry-standard REST API design guidelines covering URL structure, versioning, pagination, error responses, naming conventions, and API governance practices."
  }),
  source({
    id: "postgres-performance-tips",
    title: "PostgreSQL Performance Tips",
    url: "https://www.postgresql.org/docs/current/performance-tips.html",
    sourceType: "official-docs",
    category: "Databases",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Official PostgreSQL performance optimization guide covering query planning, index utilization, memory configuration, vacuum strategies, and execution analysis."
  }),
  source({
    id: "redis-patterns",
    title: "Redis Patterns & How-Tos",
    url: "https://redis.io/learn/howtos",
    sourceType: "official-docs",
    category: "Databases",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Official Redis how-to guide covering caching patterns, rate limiting, session storage, message queues, real-time data structures, and Redis Cluster configuration."
  }),
  source({
    id: "oauth-security-practices",
    title: "OAuth 2.0 Security Best Current Practice",
    url: "https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics",
    sourceType: "official-docs",
    category: "Backend Engineering",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "IETF specification for OAuth 2.0 security best practices covering token binding, redirect URI validation, CSRF protection, refresh token rotation, and authorization code flow hardening."
  }),
  source({
    id: "staff-engineer-book",
    title: "Staff Engineer: Leadership Beyond the Management Track",
    url: "https://staffeng.com/book",
    sourceType: "book",
    category: "Career / Staff+ Engineering",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Definitive reference for the staff-plus engineering career path covering scope, strategy, cross-org influence, role navigation, and organizational impact."
  }),
  source({
    id: "engineering-strategy",
    title: "Engineering Strategy (Lethain)",
    url: "https://lethain.com/eng-strategies/",
    sourceType: "engineering-blog",
    category: "Career / Staff+ Engineering",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Practical guide to creating engineering strategies, aligning teams around technical direction, and driving organizational change through strategic planning."
  }),

  // ── Pack 12F: Autonomous Import Wave 2 - Coverage Gap Discovery ──
  source({
    id: "aws-sqs-visibility-timeout",
    title: "Amazon SQS Visibility Timeout",
    url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
    sourceType: "official-docs",
    category: "AWS / Cloud Architecture",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Amazon SQS visibility timeout documentation covering message locking mechanics, timeout management, retry strategies, dead-letter queue integration, and ordering guarantees for reliable distributed message processing."
  }),
  source({
    id: "aws-cqrs-pattern",
    title: "CQRS Pattern - AWS Prescriptive Guidance",
    url: "https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/cqrs.html",
    sourceType: "official-docs",
    category: "AWS / Cloud Architecture",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "AWS Prescriptive Guidance for CQRS pattern implementation using DynamoDB, SQS, EventBridge, Lambda, and API Gateway — covering event sourcing integration, read model projections, and consistency tradeoffs."
  }),
  source({
    id: "allthingsdistributed-blog",
    title: "All Things Distributed (Werner Vogels)",
    url: "https://www.allthingsdistributed.com/",
    sourceType: "engineering-blog",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Real-world scalability patterns and architectural lessons from the AWS CTO covering distributed systems, scalability thinking, database scaling, caching strategies, and operational excellence."
  }),
  source({
    id: "azure-ha-architecture-patterns",
    title: "Azure Resiliency Framework — HA Architecture Patterns",
    url: "https://learn.microsoft.com/en-us/azure/architecture/framework/resiliency/overview",
    sourceType: "official-docs",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Microsoft Azure Resiliency Framework covering HA architecture patterns — redundancy, failover, health probes, SLA calculation, multi-region deployment, and cloud resilience best practices."
  }),
  source({
    id: "openapi-specification-guide",
    title: "OpenAPI Specification Guide",
    url: "https://learn.openapis.org/specification/",
    sourceType: "official-docs",
    category: "Backend Engineering",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Official OpenAPI Specification guide covering schema definitions, endpoint modeling, request/response validation, security schemes, API versioning, and tooling for code generation and API testing."
  }),
  source({
    id: "rabbitmq-tutorials",
    title: "RabbitMQ Tutorials",
    url: "https://www.rabbitmq.com/tutorials",
    sourceType: "official-docs",
    category: "Backend Engineering",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Official RabbitMQ tutorials covering exchange types, queue bindings, routing keys, message acknowledgment, publisher confirms, dead letter exchanges, and clustering patterns."
  }),
  source({
    id: "twelve-factor-config",
    title: "Twelve-Factor App Config",
    url: "https://12factor.net/config",
    sourceType: "engineering-blog",
    category: "Backend Engineering",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Twelve-Factor App methodology for backend services — configuration management, environment separation, stateless processes, backing services, and build/release/run pipeline best practices."
  }),
  source({
    id: "google-tech-writing",
    title: "Google Technical Writing Courses",
    url: "https://developers.google.com/tech-writing",
    sourceType: "official-docs",
    category: "Career / Staff+ Engineering",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Google Technical Writing courses covering audience analysis, document structure, clarity, conciseness, diagrams, code comments, and API documentation for engineering communication."
  }),
  source({
    id: "amazon-leadership-principles",
    title: "Amazon Leadership Principles",
    url: "https://www.amazon.jobs/content/en/our-workplace/leadership-principles",
    sourceType: "official-docs",
    category: "Career / Staff+ Engineering",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Amazon Leadership Principles framework for behavioral interview preparation — covering STAR story crafting, ownership demonstration, conflict navigation, and leadership impact articulation."
  })
];
