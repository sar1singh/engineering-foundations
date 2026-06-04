import type { SourceReference } from "@/types/founder-beta";

export const founderBetaSourceCatalog: SourceReference[] = [
  {
    id: "aws-well-architected",
    title: "AWS Well-Architected Framework",
    url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
    sourceType: "official-docs",
    category: "AWS / Cloud Architecture",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Primary architecture review rubric for Solution Architect readiness."
  },
  {
    id: "aws-docs",
    title: "AWS Documentation",
    url: "https://docs.aws.amazon.com/",
    sourceType: "official-docs",
    category: "AWS / Cloud Architecture",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical AWS service behavior and cloud architecture reference."
  },
  {
    id: "js-mdn-guide",
    title: "MDN JavaScript Guide",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    sourceType: "official-docs",
    category: "JavaScript",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical language refresh for backend and interview fundamentals."
  },
  {
    id: "node-docs",
    title: "Node.js API Docs",
    url: "https://nodejs.org/docs/latest/api/",
    sourceType: "official-docs",
    category: "Node.js",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical Node.js runtime and backend API reference."
  },
  {
    id: "db-postgres-docs",
    title: "PostgreSQL Docs",
    url: "https://www.postgresql.org/docs/",
    sourceType: "official-docs",
    category: "Databases",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical source for indexing, transactions, and query planning."
  },
  {
    id: "db-redis-docs",
    title: "Redis Docs",
    url: "https://redis.io/docs/latest/",
    sourceType: "official-docs",
    category: "Databases",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical source for Redis caching and data structure tradeoffs."
  },
  {
    id: "dist-google-sre-book",
    title: "Google SRE Book",
    url: "https://sre.google/sre-book/table-of-contents/",
    sourceType: "book",
    category: "Observability / Reliability",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Canonical reliability, SLO, incident, and operations reference."
  },
  {
    id: "hld-system-design-primer",
    title: "System Design Primer",
    url: "https://github.com/donnemartin/system-design-primer",
    sourceType: "github-repository",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "High-signal HLD interview preparation and architecture topic discovery."
  },
  {
    id: "backend-roadmap",
    title: "roadmap.sh Backend Roadmap",
    url: "https://roadmap.sh/backend",
    sourceType: "roadmap",
    category: "Backend Engineering",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Market-aligned backend topic coverage and sequencing signal."
  },
  {
    id: "hld-roadmap-system-design",
    title: "roadmap.sh System Design Roadmap",
    url: "https://roadmap.sh/system-design",
    sourceType: "roadmap",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Market-aligned HLD topic coverage and projection validation."
  },
  {
    id: "hld-bytebytego",
    title: "ByteByteGo",
    url: "https://bytebytego.com/",
    sourceType: "interview-guide",
    category: "System Design / HLD",
    tier: "tier-3",
    reliability: "medium",
    founderBetaRelevance: "Practical system design explanation and interview framing source."
  },
  {
    id: "staff-staffeng",
    title: "StaffEng",
    url: "https://staffeng.com/",
    sourceType: "career-framework",
    category: "Lead / Principal / Staff Engineering",
    tier: "tier-4",
    reliability: "high",
    founderBetaRelevance: "Technical leadership and seniority signal for Staff/Principal/Architect-adjacent readiness."
  },
  {
    id: "nodebestpractices",
    title: "Node.js Best Practices",
    url: "https://github.com/goldbergyoni/nodebestpractices",
    sourceType: "github-repository",
    category: "Node.js",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Production Node.js architecture, reliability, testing, and security practices."
  },
  {
    id: "hld-awesome-system-design",
    title: "Awesome System Design Resources",
    url: "https://github.com/ashishps1/awesome-system-design-resources",
    sourceType: "github-repository",
    category: "System Design / HLD",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Discovery source for HLD, architecture, and distributed systems resources."
  },
  {
    id: "aws-architecture-center",
    title: "AWS Architecture Center",
    url: "https://aws.amazon.com/architecture/",
    sourceType: "official-docs",
    category: "AWS / Cloud Architecture",
    tier: "tier-1",
    reliability: "high",
    founderBetaRelevance: "Reference architectures for founder case-study proof."
  },
  {
    id: "sa-roadmap-aws",
    title: "roadmap.sh AWS Roadmap",
    url: "https://roadmap.sh/aws",
    sourceType: "roadmap",
    category: "Solution Architect",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "AWS learning sequence validation for Architect projection."
  },
  {
    id: "beh-tech-handbook",
    title: "Tech Interview Handbook Behavioral",
    url: "https://www.techinterviewhandbook.org/behavioral-interview/",
    sourceType: "interview-guide",
    category: "Behavioral Interviews",
    tier: "tier-3",
    reliability: "high",
    founderBetaRelevance: "Behavioral interview structure and question discovery."
  },
  {
    id: "beh-amazon-lp",
    title: "Amazon Leadership Principles",
    url: "https://www.amazon.jobs/content/en/our-workplace/leadership-principles",
    sourceType: "career-framework",
    category: "Behavioral Interviews",
    tier: "tier-3",
    reliability: "high",
    founderBetaRelevance: "FAANG-style senior behavioral signal for ownership and leadership stories."
  },
  {
    id: "profile-tech-handbook-resume",
    title: "Tech Interview Handbook Resume",
    url: "https://www.techinterviewhandbook.org/resume/",
    sourceType: "interview-guide",
    category: "Resume / LinkedIn / GitHub / Portfolio",
    tier: "tier-3",
    reliability: "high",
    founderBetaRelevance: "Resume positioning and senior impact-bullet guidance."
  },
  {
    id: "profile-google-resume",
    title: "Google Resume Tips",
    url: "https://careers.google.com/how-we-hire/resume/",
    sourceType: "career-framework",
    category: "Resume / LinkedIn / GitHub / Portfolio",
    tier: "tier-2",
    reliability: "high",
    founderBetaRelevance: "Big-tech resume signal for application readiness."
  },
  {
    id: "career-linkedin-solution-architect-jobs",
    title: "LinkedIn Solution Architect Jobs",
    url: "https://www.linkedin.com/jobs/search/?keywords=Solution%20Architect",
    sourceType: "job-description",
    category: "Career Strategy / Compensation / Applications",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Dynamic market signal for target-role expectations.",
    notes: "Requires manual recency review before beta-critical mapping approval."
  },
  {
    id: "career-levels",
    title: "Levels.fyi",
    url: "https://www.levels.fyi/",
    sourceType: "career-framework",
    category: "Career Strategy / Compensation / Applications",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "Compensation calibration support for target and stretch outcomes."
  },
  {
    id: "career-ambitionbox",
    title: "AmbitionBox Salaries",
    url: "https://www.ambitionbox.com/salaries",
    sourceType: "career-framework",
    category: "Career Strategy / Compensation / Applications",
    tier: "tier-2",
    reliability: "medium",
    founderBetaRelevance: "India compensation signal for Product/GCC calibration."
  }
];
