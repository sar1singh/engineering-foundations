import type { SourceCatalogEntry } from "@/types/enriched-content";

export const sourceCatalog = [
  {
    id: "tech-interview-handbook",
    title: "Tech Interview Handbook",
    url: "https://github.com/yangshun/tech-interview-handbook",
    sourceType: "github-repo",
    domains: ["dsa", "system-design", "career", "staff-em"],
    licenseNote: "MIT license reported by public repository metadata; use as reference and link-out source.",
    usagePolicy: {
      reuse: "open-source-reference",
      note: "Use for topic discovery, interview readiness structure, behavioral/career coverage, and referral links; write original explanations."
    },
    whyUseful: "High-signal FAANG-style interview preparation index covering coding, behavioral, resume, and system-design preparation."
  },
  {
    id: "coding-interview-university",
    title: "Coding Interview University",
    url: "https://github.com/jwasham/coding-interview-university",
    sourceType: "github-repo",
    domains: ["foundations", "dsa", "system-design"],
    licenseNote: "Public GitHub learning roadmap; verify exact license before any reuse beyond linking and summarizing.",
    usagePolicy: {
      reuse: "reference-only",
      note: "Use for coverage checks across CS foundations, operating systems, networking, databases, algorithms, and system design."
    },
    whyUseful: "A complete self-study roadmap that helps EngineeringOS avoid skipping foundational gaps."
  },
  {
    id: "system-design-primer",
    title: "System Design Primer",
    url: "https://github.com/donnemartin/system-design-primer",
    sourceType: "github-repo",
    domains: ["system-design", "aws", "staff-em"],
    licenseNote: "Public GitHub repository; use as reference/link-out and keep EngineeringOS design breakdowns original.",
    usagePolicy: {
      reuse: "reference-only",
      note: "Use for system-design concept coverage, case-study prompts, and further-reading referrals."
    },
    whyUseful: "Canonical interview-prep repository for scalability, availability, caching, queues, databases, and case-study thinking."
  },
  {
    id: "the-algorithms-javascript",
    title: "The Algorithms JavaScript",
    url: "https://github.com/TheAlgorithms/JavaScript",
    sourceType: "github-repo",
    domains: ["dsa"],
    licenseNote: "MIT license is listed in TheAlgorithms public GitHub metadata.",
    usagePolicy: {
      reuse: "open-source-reference",
      note: "Use for algorithm implementation referrals; EngineeringOS solutions should be original and interview-oriented."
    },
    whyUseful: "Public JavaScript algorithm implementations that support syntax and implementation verification."
  },
  {
    id: "neetcode-roadmap",
    title: "NeetCode Roadmap",
    url: "https://neetcode.io/roadmap",
    sourceType: "platform",
    domains: ["dsa"],
    licenseNote: "Proprietary platform content; link only and do not copy explanations, solutions, or problem statements.",
    usagePolicy: {
      reuse: "public-practice-reference",
      note: "Use for pattern sequencing and problem-name mapping only."
    },
    whyUseful: "Practical 80/20 coding-interview pattern sequence."
  },
  {
    id: "leetcode-problemset",
    title: "LeetCode Problem Set",
    url: "https://leetcode.com/problemset/",
    sourceType: "platform",
    domains: ["dsa"],
    licenseNote: "Proprietary platform content; link only and write original problem variants and solutions.",
    usagePolicy: {
      reuse: "public-practice-reference",
      note: "Use problem names and topic tags as referral mapping; do not copy official statements or editorial content."
    },
    whyUseful: "The most common coding-interview practice corpus used by candidates and interviewers."
  },
  {
    id: "checkcheckzz-system-design-interview",
    title: "System Design Interview",
    url: "https://github.com/checkcheckzz/system-design-interview",
    sourceType: "github-repo",
    domains: ["system-design"],
    licenseNote: "Public GitHub repository; verify license before reuse beyond reference links.",
    usagePolicy: {
      reuse: "reference-only",
      note: "Use for case-study discovery and interview prompt coverage."
    },
    whyUseful: "Broad list of system-design interview prompts that helps validate case-study coverage."
  },
  {
    id: "awesome-scalability",
    title: "Awesome Scalability",
    url: "https://github.com/binhnguyennus/awesome-scalability",
    sourceType: "github-repo",
    domains: ["system-design", "aws", "staff-em"],
    licenseNote: "Public curated list; verify exact license before reuse beyond link-out references.",
    usagePolicy: {
      reuse: "reference-only",
      note: "Use for scaling, reliability, distributed-systems, and production architecture reading paths."
    },
    whyUseful: "Curated production-scale architecture readings for senior/staff-level judgment."
  },
  {
    id: "awesome-system-design-resources",
    title: "Awesome System Design Resources",
    url: "https://github.com/ashishps1/awesome-system-design-resources",
    sourceType: "github-repo",
    domains: ["system-design", "lld"],
    licenseNote: "Public curated list; verify exact license before reuse beyond link-out references.",
    usagePolicy: {
      reuse: "reference-only",
      note: "Use for resource discovery, case-study triangulation, and referral links."
    },
    whyUseful: "Large index of HLD/LLD articles, patterns, and interview preparation material."
  },
  {
    id: "low-level-design-primer",
    title: "Low Level Design Primer",
    url: "https://github.com/prasadgujar/low-level-design-primer",
    sourceType: "github-repo",
    domains: ["lld"],
    licenseNote: "Public GitHub repository; verify license before reuse beyond reference links.",
    usagePolicy: {
      reuse: "reference-only",
      note: "Use for LLD prompt coverage and design exercise sequencing."
    },
    whyUseful: "Helpful LLD exercise index for machine-coding and object-oriented design interviews."
  },
  {
    id: "roadmap-sh",
    title: "roadmap.sh",
    url: "https://roadmap.sh/",
    sourceType: "platform",
    domains: ["foundations", "dsa", "system-design", "aws", "ai"],
    licenseNote: "Public roadmap platform; link only unless specific content license is verified.",
    usagePolicy: {
      reuse: "reference-only",
      note: "Use for role-path validation and topic coverage comparisons."
    },
    whyUseful: "Widely used role-based roadmap structure for backend, DevOps, AWS, system design, and AI learning paths."
  },
  {
    id: "aws-docs",
    title: "AWS Documentation",
    url: "https://docs.aws.amazon.com/",
    sourceType: "docs",
    domains: ["aws"],
    licenseNote: "Official AWS documentation; use for verification and link-out references, not copied prose.",
    usagePolicy: {
      reuse: "reference-only",
      note: "Use to verify AWS service behavior, limits, security controls, and operational terminology while keeping EngineeringOS explanations original."
    },
    whyUseful: "Primary source for AWS services including VPC, IAM, Route 53, CloudFront, ELB, ECS/EKS, Lambda, API Gateway, messaging, databases, storage, KMS, CloudTrail, and CloudWatch."
  },
  {
    id: "aws-well-architected-framework",
    title: "AWS Well-Architected Framework",
    url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
    sourceType: "docs",
    domains: ["aws", "system-design", "staff-em"],
    licenseNote: "Official AWS documentation; use as architecture evaluation reference and link-out source.",
    usagePolicy: {
      reuse: "reference-only",
      note: "Use for security, reliability, operational excellence, performance efficiency, cost optimization, and sustainability review lenses."
    },
    whyUseful: "Provides the AWS-native review frame for production architecture tradeoffs, risk discovery, and solution-architect answers."
  },
  {
    id: "aws-architecture-center",
    title: "AWS Architecture Center",
    url: "https://aws.amazon.com/architecture/",
    sourceType: "docs",
    domains: ["aws", "system-design"],
    licenseNote: "Official AWS architecture resource; use for reference architecture discovery and link-out validation.",
    usagePolicy: {
      reuse: "reference-only",
      note: "Use for AWS-first HLD patterns, architecture diagrams, and service-combination verification without copying diagrams or text."
    },
    whyUseful: "Reference architecture hub for AWS production patterns, resilience examples, and solution-architect framing."
  }
] satisfies SourceCatalogEntry[];

export const sourceCatalogById = Object.fromEntries(sourceCatalog.map((source) => [source.id, source]));
