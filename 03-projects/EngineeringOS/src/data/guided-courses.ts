import { roleLearningRoadmaps } from "@/data/syllabus/role-learning-roadmaps";

export type GuidedCourse = {
  slug: string;
  title: string;
  audience: string;
  promise: string;
  level: string;
  duration: string;
  gradient: string;
  icon: "server" | "cloud" | "strategy" | "manager" | "code" | "diagram" | "rocket" | "message";
  skills: string[];
  topicSlugs: string[];
  stages: Array<{
    title: string;
    description: string;
    topicSlugs: string[];
  }>;
};

const roleBySlug = new Map(roleLearningRoadmaps.map((roadmap) => [roadmap.slug, roadmap]));

function fromRole(slug: string, extras: Omit<GuidedCourse, "topicSlugs" | "stages">): GuidedCourse {
  const role = roleBySlug.get(slug);
  return {
    ...extras,
    topicSlugs: role?.topicSlugs ?? [],
    stages:
      role?.focus.map((focus) => ({
        title: focus.title,
        description: `${focus.level} / ${focus.priority.replaceAll("-", " ")}`,
        topicSlugs: focus.topicSlugs
      })) ?? []
  };
}

export const guidedCourses: GuidedCourse[] = [
  fromRole("backend-senior-engineer", {
    slug: "senior-backend-engineer",
    title: "Senior Backend Engineer",
    audience: "Experienced engineers rebuilding fundamentals for product-company interviews.",
    promise: "Own Node.js, databases, DSA, APIs, reliability, and senior backend rounds.",
    level: "Foundation -> Senior",
    duration: "8-12 weeks",
    gradient: "from-cyan-400 via-indigo-500 to-fuchsia-500",
    icon: "server",
    skills: ["Node.js", "DSA", "Databases", "APIs", "Reliability"]
  }),
  fromRole("solution-architect", {
    slug: "aws-solution-architect",
    title: "AWS Solution Architect",
    audience: "Backend engineers moving into AWS-first HLD and architecture ownership.",
    promise: "Design secure, reliable, cost-aware AWS systems and explain trade-offs.",
    level: "Core -> Architect",
    duration: "10-14 weeks",
    gradient: "from-amber-300 via-orange-500 to-rose-500",
    icon: "cloud",
    skills: ["AWS", "HLD", "DR", "Security", "Cost"]
  }),
  fromRole("staff-principal-engineer", {
    slug: "staff-principal-engineer",
    title: "Staff/Principal Engineer",
    audience: "Senior engineers preparing for cross-team architecture and strategy loops.",
    promise: "Lead reviews, strategy, incidents, trade-offs, and principal-level case studies.",
    level: "Senior -> Principal",
    duration: "12-16 weeks",
    gradient: "from-violet-400 via-purple-500 to-pink-500",
    icon: "strategy",
    skills: ["Architecture", "Strategy", "Incidents", "Trade-offs", "Influence"]
  }),
  fromRole("engineering-manager", {
    slug: "engineering-manager",
    title: "Engineering Manager",
    audience: "Engineers and leads moving toward EM interviews and execution ownership.",
    promise: "Prepare technical judgment, hiring calibration, incidents, roadmap execution, and behavioral stories.",
    level: "Lead -> EM",
    duration: "8-10 weeks",
    gradient: "from-emerald-300 via-cyan-500 to-blue-500",
    icon: "manager",
    skills: ["Roadmaps", "Hiring", "Incidents", "Stakeholders", "Behavioral"]
  }),
  {
    slug: "dsa-algorithms-bootcamp",
    title: "DSA/Algorithms Bootcamp",
    audience: "Foundationally weak engineers who need fast interview pattern fluency.",
    promise: "Build confidence in arrays, hashing, search, trees, graphs, DP, intervals, and runnable practice.",
    level: "Zero -> Interview",
    duration: "6-8 weeks",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    icon: "code",
    skills: ["HashMaps", "Graphs", "Trees", "DP", "Practice"],
    topicSlugs: ["hashmap-frequency", "binary-search", "tree-dfs", "graph-bfs", "dynamic-programming-core", "intervals", "bit-manipulation"],
    stages: [
      { title: "Foundation", description: "State, arrays, strings, hashing", topicSlugs: ["hashmap-frequency", "binary-search"] },
      { title: "Core Patterns", description: "Tree and graph traversal", topicSlugs: ["tree-dfs", "tree-bfs", "graph-bfs", "graph-dfs"] },
      { title: "Advanced", description: "DP, intervals, bit reasoning", topicSlugs: ["dynamic-programming-core", "intervals", "bit-manipulation"] },
      { title: "Interview Simulation", description: "Timed runnable reps", topicSlugs: ["hashmap-frequency", "graph-bfs", "dynamic-programming-core"] }
    ]
  },
  {
    slug: "hld-lld-system-design-bootcamp",
    title: "HLD/LLD System Design Bootcamp",
    audience: "Engineers who need design confidence for senior/staff/product company loops.",
    promise: "Practice HLD case studies, LLD machine coding, trade-offs, APIs, scale, and AWS variants.",
    level: "Basics -> Staff",
    duration: "8-12 weeks",
    gradient: "from-fuchsia-400 via-rose-500 to-orange-400",
    icon: "diagram",
    skills: ["HLD", "LLD", "APIs", "Trade-offs", "Case Studies"],
    topicSlugs: ["hld-url-shortener", "hld-payment-system", "hld-booking-system", "rate-limiter-lld", "cache-lld", "workflow-engine-lld"],
    stages: [
      { title: "Foundation", description: "Capacity, APIs, data model, trade-offs", topicSlugs: ["scalability", "api-design-contracts", "trade-off-analysis"] },
      { title: "Core HLD", description: "URL, payment, booking, notification", topicSlugs: ["hld-url-shortener", "hld-payment-system", "hld-booking-system"] },
      { title: "Core LLD", description: "Rate limiter, cache, workflow engine", topicSlugs: ["rate-limiter-lld", "cache-lld", "workflow-engine-lld"] },
      { title: "Mock Review", description: "Architecture review and interview simulation", topicSlugs: ["architecture-review", "system-design-round-strategy"] }
    ]
  },
  {
    slug: "aws-infra-bootcamp",
    title: "AWS Infra Bootcamp",
    audience: "Learners targeting AWS Solution Architect and infrastructure HLD rounds.",
    promise: "Hands-on AWS labs for VPC, Route 53, CloudFront, Step Functions, ECS/EKS, DR, and cost.",
    level: "Core -> Architect",
    duration: "6-10 weeks",
    gradient: "from-yellow-300 via-orange-500 to-red-500",
    icon: "cloud",
    skills: ["VPC", "Multi-AZ", "Route 53", "ECS/EKS", "DR"],
    topicSlugs: ["vpc", "multi-az", "route-53", "cloudfront", "api-gateway", "step-functions", "ecs-eks", "backup-dr"],
    stages: [
      { title: "Foundation", description: "IAM, VPC, compute, storage", topicSlugs: ["iam", "vpc", "ec2", "s3"] },
      { title: "Reliable Systems", description: "Multi-AZ, routing, CDN, autoscaling", topicSlugs: ["multi-az", "route-53", "cloudfront", "autoscaling"] },
      { title: "Workflows", description: "API Gateway, Step Functions, ECS/EKS", topicSlugs: ["api-gateway", "step-functions", "ecs-eks"] },
      { title: "Readiness", description: "Backup, DR, security, cost", topicSlugs: ["backup-dr", "kms", "cloudtrail", "cost-optimization"] }
    ]
  },
  {
    slug: "interview-crash-course",
    title: "Interview Crash Course",
    audience: "Job-switch focused learners who need the fastest structured prep loop.",
    promise: "One path across recruiter, foundations, coding, HLD, LLD, AWS, AI, behavioral, and final loops.",
    level: "Crash -> Ready",
    duration: "30 days",
    gradient: "from-lime-300 via-cyan-400 to-indigo-500",
    icon: "rocket",
    skills: ["Rounds", "Mocks", "Stories", "Weak Areas", "Confidence"],
    topicSlugs: ["coding-round-strategy", "system-design-round-strategy", "behavioral-star-stories", "mock-interview-calibration", "resume-linkedin-github"],
    stages: [
      { title: "Calibrate", description: "Find weak rounds", topicSlugs: ["coding-round-strategy", "system-design-round-strategy"] },
      { title: "Repair", description: "Patch foundations and stories", topicSlugs: ["behavioral-star-stories", "resume-linkedin-github"] },
      { title: "Mock", description: "Timed interview simulation", topicSlugs: ["mock-interview-calibration", "hiring-interview-calibration"] },
      { title: "Close", description: "Final polish and offer narrative", topicSlugs: ["stakeholder-communication", "technical-strategy"] }
    ]
  }
];
