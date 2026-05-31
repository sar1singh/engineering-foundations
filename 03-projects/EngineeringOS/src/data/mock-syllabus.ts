import { dsaPhaseFourTopics } from "@/data/syllabus/dsa-phase-4";
import { dsaPhaseOneTopics } from "@/data/syllabus/dsa-phase-1-foundations";
import { dsaPhaseThreeTopics } from "@/data/syllabus/dsa-phase-3-structures";
import { dsaPhaseTwoTopics } from "@/data/syllabus/dsa-phase-2-core-patterns";
import { algorithmAdvancedTopics, algorithmFoundationTopics, algorithmTreeGraphTopics } from "@/data/syllabus/algorithm-topics";
import {
  databaseMongoTopics,
  databasePerformanceTopics,
  databasePostgresTopics,
  databaseRedisTopics,
  databaseSqlCoreTopics
} from "@/data/syllabus/database-topics";
import { awsCoreServiceTopics } from "@/data/syllabus/aws-topics";
import { awsHldDeepeningTopics } from "@/data/syllabus/aws-hld-deepening";
import { hldCaseStudyTopics } from "@/data/syllabus/hld-case-studies";
import { jsPhaseFourInterviewTopics } from "@/data/syllabus/js-phase-4-interview";
import { jsPhaseOneFundamentalsTopics } from "@/data/syllabus/js-phase-1-fundamentals";
import { jsPhaseThreeSeniorTopics } from "@/data/syllabus/js-phase-3-senior";
import { jsPhaseTwoAsyncTopics } from "@/data/syllabus/js-phase-2-async";
import { nodejsPhaseOneCoreRuntimeTopics } from "@/data/syllabus/nodejs-phase-1-core-runtime";
import { nodejsPhaseFourSeniorTopics } from "@/data/syllabus/nodejs-phase-4-senior";
import { nodejsPhaseThreeScaleTopics } from "@/data/syllabus/nodejs-phase-3-scale";
import { nodejsPhaseTwoBackendEngineeringTopics } from "@/data/syllabus/nodejs-phase-2-backend-engineering";
import { lldFoundationTopics, lldMachineCodingTopics, lldSeniorDesignTopics } from "@/data/syllabus/lld-topics";
import { interviewPreparationTopics } from "@/data/syllabus/interview-topics";
import { performanceEngineeringTopics } from "@/data/syllabus/performance-topics";
import { securityFoundationTopics } from "@/data/syllabus/security-topics";
import { staffPrincipalEmTopics } from "@/data/syllabus/staff-em-topics";
import {
  aiExpansionTopics,
  careerAssetTopics,
  caseStudyTopics,
  foundationTopics,
  seniorSkillsTopics,
  testingQualityTopics,
  tradeoffTopics
} from "@/data/syllabus/strategic-roadmap-topics";
import {
  systemDesignAdvancedTopics,
  systemDesignBuildingBlockTopics,
  systemDesignCapacityMathTopics,
  systemDesignCommonSystemTopics,
  systemDesignFoundationTopics
} from "@/data/syllabus/system-design-topics";
import type { MockSyllabusCatalog } from "@/types/syllabus";

export const mockSyllabusCatalog: MockSyllabusCatalog = {
  id: "mock-syllabus-master-roadmap-v1",
  title: "EngineeringOS Master Roadmap Mock Syllabus",
  sourceRoots: ["00-control/master-roadmap", "01-learning"],
  importNotes: [
    "00-control/master-roadmap is available and provides domain ordering plus JavaScript and DSA sequences.",
    "01-learning currently has no importable files in this workspace.",
    "This mock catalog is intentionally local-only and does not change Prisma or production schema."
  ],
  domains: [
    {
      id: "syllabus-domain-javascript",
      slug: "javascript",
      title: "JavaScript",
      order: 2,
      sourcePath: "00-control/master-roadmap/02-javascript/INDEX.md",
      goal: "Clear JS deep-dive rounds and become strong backend JS engineer.",
      modules: [
        {
          id: "syllabus-module-js-fundamentals",
          slug: "javascript-fundamentals",
          title: "Phase 1 Fundamentals",
          order: 1,
          sourcePath: "00-control/master-roadmap/02-javascript/INDEX.md",
          goal: "Explain concept plus code from scratch.",
          topics: jsPhaseOneFundamentalsTopics
        },
        {
          id: "syllabus-module-js-async",
          slug: "javascript-async",
          title: "Phase 2 Async",
          order: 2,
          sourcePath: "00-control/master-roadmap/02-javascript/INDEX.md",
          goal: "Explain asynchronous JavaScript concepts plus code from scratch.",
          topics: jsPhaseTwoAsyncTopics
        },
        {
          id: "syllabus-module-js-senior",
          slug: "javascript-senior",
          title: "Phase 3 Senior Topics",
          order: 3,
          sourcePath: "00-control/master-roadmap/02-javascript/INDEX.md",
          goal: "Explain production JavaScript trade-offs, debugging, and modular design from first principles.",
          topics: jsPhaseThreeSeniorTopics
        },
        {
          id: "syllabus-module-js-interview",
          slug: "javascript-interview",
          title: "Phase 4 Interview",
          order: 4,
          sourcePath: "00-control/master-roadmap/02-javascript/INDEX.md",
          goal: "Convert JavaScript internals into fast output-prediction and debugging interview performance.",
          topics: jsPhaseFourInterviewTopics
        }
      ]
    },
    {
      id: "syllabus-domain-nodejs",
      slug: "nodejs",
      title: "Node.js",
      order: 3,
      sourcePath: "00-control/master-roadmap/03-nodejs/INDEX.md",
      goal: "Strong backend runtime + production engineering depth.",
      modules: [
        {
          id: "syllabus-module-nodejs-core-runtime",
          slug: "nodejs-core-runtime",
          title: "Phase 1 Core Runtime",
          order: 1,
          sourcePath: "00-control/master-roadmap/03-nodejs/INDEX.md",
          goal: "Explain Node.js runtime behavior and build local backend runtime labs.",
          topics: nodejsPhaseOneCoreRuntimeTopics
        },
        {
          id: "syllabus-module-nodejs-backend-engineering",
          slug: "nodejs-backend-engineering",
          title: "Phase 2 Backend Engineering",
          order: 2,
          sourcePath: "00-control/master-roadmap/03-nodejs/INDEX.md",
          goal: "Build production-ready backend request handling and operational foundations.",
          topics: nodejsPhaseTwoBackendEngineeringTopics
        },
        {
          id: "syllabus-module-nodejs-scale",
          slug: "nodejs-scale",
          title: "Phase 3 Scale Topics",
          order: 3,
          sourcePath: "00-control/master-roadmap/03-nodejs/INDEX.md",
          goal: "Choose the right Node.js scaling pattern for CPU work, background work, and traffic control.",
          topics: nodejsPhaseThreeScaleTopics
        },
        {
          id: "syllabus-module-nodejs-senior",
          slug: "nodejs-senior",
          title: "Phase 4 Senior Topics",
          order: 4,
          sourcePath: "00-control/master-roadmap/03-nodejs/INDEX.md",
          goal: "Reason about performance, shutdown, and reliability under production constraints.",
          topics: nodejsPhaseFourSeniorTopics
        }
      ]
    },
    {
      id: "syllabus-domain-dsa",
      slug: "dsa",
      title: "DSA",
      order: 1,
      sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
      goal: "Crack coding rounds with pattern recognition and speed.",
      modules: [
        {
          id: "syllabus-module-dsa-foundations",
          slug: "dsa-foundations",
          title: "Phase 1 Foundations",
          order: 1,
          sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
          goal: "Build easy-problem speed and explain approaches clearly.",
          topics: dsaPhaseOneTopics
        },
        {
          id: "syllabus-module-dsa-core-patterns",
          slug: "dsa-core-patterns",
          title: "Phase 2 Core Patterns",
          order: 2,
          sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
          goal: "Recognize and apply reusable array/string interview patterns under time pressure.",
          topics: dsaPhaseTwoTopics
        },
        {
          id: "syllabus-module-dsa-structures",
          slug: "dsa-structures",
          title: "Phase 3 Structures",
          order: 3,
          sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
          goal: "Master pointer, hierarchical, priority, prefix, and graph structures for coding interviews.",
          topics: dsaPhaseThreeTopics
        },
        {
          id: "syllabus-module-dsa-advanced",
          slug: "dsa-advanced",
          title: "Phase 4 Advanced",
          order: 4,
          sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
          goal: "Choose and justify advanced strategies for optimization, search, and recurrence-heavy problems.",
          topics: dsaPhaseFourTopics
        }
      ]
    },
    {
      id: "syllabus-domain-databases",
      slug: "databases",
      title: "Databases",
      order: 5,
      sourcePath: "00-control/master-roadmap/05-databases/INDEX.md",
      goal: "Crack SQL rounds + backend data decisions.",
      modules: [
        {
          id: "syllabus-module-db-sql-core",
          slug: "database-sql-core",
          title: "SQL Core",
          order: 1,
          sourcePath: "00-control/master-roadmap/05-databases/INDEX.md",
          goal: "Write correct SQL interview queries and explain result shape.",
          topics: databaseSqlCoreTopics
        },
        {
          id: "syllabus-module-db-performance",
          slug: "database-performance",
          title: "Performance",
          order: 2,
          sourcePath: "00-control/master-roadmap/05-databases/INDEX.md",
          goal: "Read query behavior and justify performance choices.",
          topics: databasePerformanceTopics
        },
        {
          id: "syllabus-module-db-postgresql",
          slug: "database-postgresql",
          title: "PostgreSQL",
          order: 3,
          sourcePath: "00-control/master-roadmap/05-databases/INDEX.md",
          goal: "Explain PostgreSQL concurrency and scaling primitives.",
          topics: databasePostgresTopics
        },
        {
          id: "syllabus-module-db-mongodb",
          slug: "database-mongodb",
          title: "MongoDB",
          order: 4,
          sourcePath: "00-control/master-roadmap/05-databases/INDEX.md",
          goal: "Choose MongoDB schema and scale patterns from access patterns.",
          topics: databaseMongoTopics
        },
        {
          id: "syllabus-module-db-redis",
          slug: "database-redis",
          title: "Redis",
          order: 5,
          sourcePath: "00-control/master-roadmap/05-databases/INDEX.md",
          goal: "Use Redis for cache, TTL, and rate-limiting decisions.",
          topics: databaseRedisTopics
        }
      ]
    },
    {
      id: "syllabus-domain-system-design",
      slug: "system-design",
      title: "System Design",
      order: 6,
      sourcePath: "00-control/master-roadmap/06-system-design/INDEX.md",
      goal: "Clear senior backend architecture rounds.",
      modules: [
        {
          id: "syllabus-module-sd-foundations",
          slug: "system-design-foundations",
          title: "Foundations",
          order: 1,
          sourcePath: "00-control/master-roadmap/06-system-design/INDEX.md",
          goal: "Explain core architecture quality attributes and trade-offs.",
          topics: systemDesignFoundationTopics
        },
        {
          id: "syllabus-module-sd-building-blocks",
          slug: "system-design-building-blocks",
          title: "Building Blocks",
          order: 2,
          sourcePath: "00-control/master-roadmap/06-system-design/INDEX.md",
          goal: "Choose common backend components for load, latency, and reliability.",
          topics: systemDesignBuildingBlockTopics
        },
        {
          id: "syllabus-module-sd-capacity-math",
          slug: "system-design-capacity-math",
          title: "Capacity Math",
          order: 3,
          sourcePath: "00-control/master-roadmap/06-system-design/INDEX.md",
          goal: "Estimate traffic, storage, and peak load quickly.",
          topics: systemDesignCapacityMathTopics
        },
        {
          id: "syllabus-module-sd-common-systems",
          slug: "system-design-common-systems",
          title: "Common Systems",
          order: 4,
          sourcePath: "00-control/master-roadmap/06-system-design/INDEX.md",
          goal: "Practice common 40-minute backend design mocks.",
          topics: systemDesignCommonSystemTopics
        },
        {
          id: "syllabus-module-sd-advanced",
          slug: "system-design-advanced",
          title: "Advanced",
          order: 5,
          sourcePath: "00-control/master-roadmap/06-system-design/INDEX.md",
          goal: "Explain distributed-system failure and recovery trade-offs.",
          topics: systemDesignAdvancedTopics
        },
        {
          id: "syllabus-module-hld-case-studies",
          slug: "hld-case-studies",
          title: "HLD Case Studies",
          order: 6,
          sourcePath: "00-control/master-roadmap/06-system-design/INDEX.md",
          goal: "Practice common HLD mocks with AWS deployment variants.",
          topics: hldCaseStudyTopics
        }
      ]
    },
    {
      id: "syllabus-domain-algorithms",
      slug: "algorithms",
      title: "Algorithms",
      order: 4,
      sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
      goal: "Deepen search, hashing, tree, graph, recursion, DP, interval, and bit patterns for interviews.",
      modules: [
        {
          id: "syllabus-module-algo-foundations",
          slug: "algorithm-foundations",
          title: "Foundations",
          order: 1,
          sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
          goal: "Master the highest-frequency algorithm primitives.",
          topics: algorithmFoundationTopics
        },
        {
          id: "syllabus-module-algo-tree-graph",
          slug: "algorithm-tree-graph",
          title: "Trees and Graphs",
          order: 2,
          sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
          goal: "Handle traversal, connectivity, dependency, and shortest-path interviews.",
          topics: algorithmTreeGraphTopics
        },
        {
          id: "syllabus-module-algo-advanced",
          slug: "algorithm-advanced",
          title: "Advanced Patterns",
          order: 3,
          sourcePath: "00-control/master-roadmap/04-dsa/INDEX.md",
          goal: "Handle recursion, DP, interval, and bit-manipulation transfer problems.",
          topics: algorithmAdvancedTopics
        }
      ]
    },
    {
      id: "syllabus-domain-lld",
      slug: "lld",
      title: "LLD",
      order: 7,
      sourcePath: "00-control/master-roadmap/07-lld/INDEX.md",
      goal: "Build machine-coding, OOP design, and senior module-design skill.",
      modules: [
        {
          id: "syllabus-module-lld-foundations",
          slug: "lld-foundations",
          title: "Foundations",
          order: 1,
          sourcePath: "00-control/master-roadmap/07-lld/INDEX.md",
          goal: "Learn OOP, SOLID, design patterns, and diagramming for maintainable design.",
          topics: lldFoundationTopics
        },
        {
          id: "syllabus-module-lld-machine-coding",
          slug: "lld-machine-coding",
          title: "Machine Coding",
          order: 2,
          sourcePath: "00-control/master-roadmap/07-lld/INDEX.md",
          goal: "Practice common LLD interview problems with working designs.",
          topics: lldMachineCodingTopics
        },
        {
          id: "syllabus-module-lld-senior-design",
          slug: "lld-senior-design",
          title: "Senior Design",
          order: 3,
          sourcePath: "00-control/master-roadmap/07-lld/INDEX.md",
          goal: "Make API, module, and extensibility trade-offs like a senior/staff engineer.",
          topics: lldSeniorDesignTopics
        }
      ]
    },
    {
      id: "syllabus-domain-aws",
      slug: "aws",
      title: "AWS",
      order: 8,
      sourcePath: "00-control/master-roadmap/09-aws/INDEX.md",
      goal: "Prepare for AWS Solution Architect HLD and SAA-style trade-off decisions.",
      modules: [
        {
          id: "syllabus-module-aws-core-services",
          slug: "aws-core-services",
          title: "Core Services",
          order: 1,
          sourcePath: "00-control/master-roadmap/09-aws/INDEX.md",
          goal: "Master the core AWS primitives used in solution architecture.",
          topics: awsCoreServiceTopics
        },
        {
          id: "syllabus-module-aws-hld-deepening",
          slug: "aws-hld-deepening",
          title: "AWS HLD Deepening",
          order: 2,
          sourcePath: "00-control/master-roadmap/09-aws/INDEX.md",
          goal: "Apply AWS services to resilient, secure, cost-aware HLD decisions.",
          topics: awsHldDeepeningTopics
        }
      ]
    },
    {
      id: "syllabus-domain-staff-em",
      slug: "staff-em",
      title: "Staff Principal EM",
      order: 9,
      sourcePath: "00-control/master-roadmap/13-senior-skills/INDEX.md",
      goal: "Grow from senior execution into architecture leadership, staff scope, and EM-ready judgment.",
      modules: [
        {
          id: "syllabus-module-staff-em-leadership",
          slug: "staff-em-leadership",
          title: "Leadership and Operating Skills",
          order: 1,
          sourcePath: "00-control/master-roadmap/13-senior-skills/INDEX.md",
          goal: "Practice architecture review, strategy, incidents, execution, hiring, and stakeholder communication.",
          topics: staffPrincipalEmTopics
        }
      ]
    },
    {
      id: "syllabus-domain-security",
      slug: "security",
      title: "Security",
      order: 10,
      sourcePath: "00-control/master-roadmap/10-security/INDEX.md",
      goal: "Build secure backend, HLD, and AWS architecture judgment for senior interviews and production reviews.",
      modules: [
        {
          id: "syllabus-module-security-foundations",
          slug: "security-foundations",
          title: "Security and Auth Foundations",
          order: 1,
          sourcePath: "00-control/master-roadmap/10-security/INDEX.md",
          goal: "Explain threat modeling, OAuth/OIDC/JWT, sessions, CSRF, XSS, SSRF, secrets, injection, and AWS security controls.",
          topics: securityFoundationTopics
        }
      ]
    },
    {
      id: "syllabus-domain-performance",
      slug: "performance",
      title: "Performance",
      order: 11,
      sourcePath: "00-control/master-roadmap/11-performance/INDEX.md",
      goal: "Diagnose bottlenecks, design for SLOs, and explain performance trade-offs across backend and AWS systems.",
      modules: [
        {
          id: "syllabus-module-performance-engineering",
          slug: "performance-engineering",
          title: "Performance Engineering",
          order: 1,
          sourcePath: "00-control/master-roadmap/11-performance/INDEX.md",
          goal: "Practice profiling, load testing, capacity planning, observability, SLOs, tracing, metrics, and caching decisions.",
          topics: performanceEngineeringTopics
        }
      ]
    },
    {
      id: "syllabus-domain-interviews",
      slug: "interviews",
      title: "Interviews",
      order: 14,
      sourcePath: "00-control/master-roadmap/14-interviews/INDEX.md",
      goal: "Convert learning into coding, system design, behavioral, mock interview, and calibration readiness.",
      modules: [
        {
          id: "syllabus-module-interview-preparation",
          slug: "interview-preparation",
          title: "Interview Preparation",
          order: 1,
          sourcePath: "00-control/master-roadmap/14-interviews/INDEX.md",
          goal: "Practice coding rounds, system design rounds, behavioral STAR stories, mock interviews, and interviewer-style calibration.",
          topics: interviewPreparationTopics
        }
      ]
    },
    {
      id: "syllabus-domain-foundations",
      slug: "foundations",
      title: "Foundations",
      order: 1,
      sourcePath: "00-control/master-roadmap/01-foundations/INDEX.md",
      goal: "Build CS, OS, networking, Big-O, debugging, and request-lifecycle foundations for backend engineering.",
      modules: [
        {
          id: "syllabus-module-foundations-core",
          slug: "foundations-core",
          title: "Core Engineering Foundations",
          order: 1,
          sourcePath: "00-control/master-roadmap/01-foundations/INDEX.md",
          goal: "Explain the core systems knowledge behind backend debugging, interviews, and production reasoning.",
          topics: foundationTopics
        }
      ]
    },
    {
      id: "syllabus-domain-tradeoffs",
      slug: "tradeoffs",
      title: "Tradeoffs",
      order: 8,
      sourcePath: "00-control/master-roadmap/08-tradeoffs/INDEX.md",
      goal: "Practice engineering decision-making across consistency, availability, cost, reliability, build/buy, and reversibility.",
      modules: [
        {
          id: "syllabus-module-tradeoffs-decisions",
          slug: "tradeoffs-decisions",
          title: "Engineering Decisions",
          order: 1,
          sourcePath: "00-control/master-roadmap/08-tradeoffs/INDEX.md",
          goal: "Turn architecture choices into clear recommendations with constraints, risks, alternatives, and metrics.",
          topics: tradeoffTopics
        }
      ]
    },
    {
      id: "syllabus-domain-case-studies",
      slug: "case-studies",
      title: "Case Studies",
      order: 12,
      sourcePath: "00-control/master-roadmap/12-case-studies/INDEX.md",
      goal: "Study real-world-style systems such as chat and streaming to connect HLD, AWS, performance, reliability, and cost.",
      modules: [
        {
          id: "syllabus-module-case-studies-famous-systems",
          slug: "case-studies-famous-systems",
          title: "Famous System Case Studies",
          order: 1,
          sourcePath: "00-control/master-roadmap/12-case-studies/INDEX.md",
          goal: "Practice interview-grade case studies with requirements, architecture, failure modes, AWS variants, and metrics.",
          topics: caseStudyTopics
        }
      ]
    },
    {
      id: "syllabus-domain-senior-skills",
      slug: "senior-skills",
      title: "Senior Skills",
      order: 13,
      sourcePath: "00-control/master-roadmap/13-senior-skills/INDEX.md",
      goal: "Represent the master-roadmap senior-skills router explicitly while Staff/EM remains the role-focused view.",
      modules: [
        {
          id: "syllabus-module-senior-skills-operating",
          slug: "senior-skills-operating",
          title: "Leadership and Operating Skills",
          order: 1,
          sourcePath: "00-control/master-roadmap/13-senior-skills/INDEX.md",
          goal: "Practice leadership, incidents, architecture reviews, execution, hiring calibration, and stakeholder communication.",
          topics: seniorSkillsTopics
        }
      ]
    },
    {
      id: "syllabus-domain-career-assets",
      slug: "career-assets",
      title: "Career Assets",
      order: 15,
      sourcePath: "00-control/master-roadmap/15-career-assets/INDEX.md",
      goal: "Turn EngineeringOS learning into resume, LinkedIn, GitHub, portfolio, proof-of-work, promotion, and interview assets.",
      modules: [
        {
          id: "syllabus-module-career-assets-proof",
          slug: "career-assets-proof",
          title: "Proof and Positioning",
          order: 1,
          sourcePath: "00-control/master-roadmap/15-career-assets/INDEX.md",
          goal: "Package skill into recruiter-readable and interviewer-credible artifacts.",
          topics: careerAssetTopics
        }
      ]
    },
    {
      id: "syllabus-domain-ai-expansion",
      slug: "ai-expansion",
      title: "AI Expansion",
      order: 16,
      sourcePath: "00-control/master-roadmap/16-ai-expansion/INDEX.md",
      goal: "Track future AI-assisted learning, evaluator, prompt, and product/system design expansion without enabling real AI prematurely.",
      modules: [
        {
          id: "syllabus-module-ai-expansion-future",
          slug: "ai-expansion-future",
          title: "Future AI Learning Systems",
          order: 1,
          sourcePath: "00-control/master-roadmap/16-ai-expansion/INDEX.md",
          goal: "Plan AI-assisted evaluation with rubrics, sources, privacy, and human review boundaries.",
          topics: aiExpansionTopics
        }
      ]
    },
    {
      id: "syllabus-domain-testing-quality",
      slug: "testing-quality",
      title: "Testing and Quality",
      order: 17,
      sourcePath: "00-control/master-roadmap/01-foundations/INDEX.md",
      goal: "Protect EngineeringOS and backend learning with unit-test, integration-test, contract-test, QA, and release-quality strategy.",
      modules: [
        {
          id: "syllabus-module-testing-quality-strategy",
          slug: "testing-quality-strategy",
          title: "Quality Strategy",
          order: 1,
          sourcePath: "00-control/master-roadmap/01-foundations/INDEX.md",
          goal: "Choose the right quality gate for logic, boundaries, contracts, workflows, and release confidence.",
          topics: testingQualityTopics
        }
      ]
    }
  ]
};
