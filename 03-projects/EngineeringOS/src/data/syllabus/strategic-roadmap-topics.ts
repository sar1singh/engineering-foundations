import { staffPrincipalEmTopics } from "@/data/syllabus/staff-em-topics";
import type { SyllabusPracticeProblem, SyllabusReference, SyllabusTopic } from "@/types/syllabus";

function references(domain: string): SyllabusReference[] {
  return [
    {
      id: `reference-${domain}-roadmapsh-backend`,
      title: "roadmap.sh Backend Roadmap",
      url: "https://roadmap.sh/backend",
      sourceType: "roadmap",
      usage: "Cross-checks backend foundation and interview-readiness sequencing."
    },
    {
      id: `reference-${domain}-system-design-primer`,
      title: "System Design Primer",
      url: "https://github.com/donnemartin/system-design-primer",
      sourceType: "roadmap",
      usage: "Public reference for system design concepts, case studies, and interview framing."
    },
    {
      id: `reference-${domain}-google-sre`,
      title: "Google SRE Book",
      url: "https://sre.google/sre-book/table-of-contents/",
      sourceType: "article",
      usage: "Reference for reliability, incidents, observability, and operating production systems."
    }
  ];
}

function practice(domain: string, slug: string, title: string): SyllabusPracticeProblem[] {
  return [
    {
      id: `problem-${domain}-${slug}-easy`,
      title: `${title} explain-back`,
      difficulty: "easy",
      tags: [domain, slug, "foundation"],
      prompt: `Explain ${title} in your own words, then name one interview or production scenario where it matters.`,
      expectedSignals: ["Clear definition", "Concrete scenario", "Correct vocabulary"]
    },
    {
      id: `problem-${domain}-${slug}-medium`,
      title: `${title} applied plan`,
      difficulty: "medium",
      tags: [domain, slug, "application"],
      prompt: `Create a practical plan for ${title}. Include steps, risks, success metrics, and one trade-off.`,
      expectedSignals: ["Stepwise plan", "Risks", "Metrics", "Trade-off"]
    },
    {
      id: `problem-${domain}-${slug}-hard`,
      title: `${title} executive review`,
      difficulty: "hard",
      tags: [domain, slug, "review"],
      prompt: `Review ${title} like a senior/staff interview or operating review. Include alternatives, failure modes, and decision criteria.`,
      expectedSignals: ["Alternatives", "Failure modes", "Decision criteria", "Senior-level clarity"]
    }
  ];
}

function topic(input: {
  domain: string;
  sourcePath: string;
  order: number;
  slug: string;
  title: string;
  definition: string;
  mentalModel: string;
  theory: string;
  example: string;
  interviewQuestions: string[];
  commonMistakes: string[];
  productionUseCases: string[];
  extraReferences?: SyllabusReference[];
}): SyllabusTopic {
  return {
    id: `syllabus-${input.domain}-${input.slug}`,
    slug: input.slug,
    title: input.title,
    order: input.order,
    sourcePath: input.sourcePath,
    definition: input.definition,
    whyItMatters: `${input.title} supports EngineeringOS readiness across foundation, interview, production, portfolio, and senior operating goals.`,
    mentalModel: input.mentalModel,
    theory: `${input.theory}\n\nOperating model: clarify goal -> map constraints -> choose the smallest useful artifact -> practice -> review -> improve with evidence.`,
    codeExamples: [
      {
        id: `example-${input.domain}-${input.slug}`,
        title: `${input.title} template`,
        language: "text",
        code: input.example,
        explanation: `Reusable template for ${input.title}.`,
        runnable: false
      }
    ],
    practiceProblems: practice(input.domain, input.slug, input.title),
    interviewQuestions: input.interviewQuestions,
    commonMistakes: input.commonMistakes,
    productionUseCases: input.productionUseCases,
    revisionPrompts: [`Explain ${input.title} in 90 seconds.`, `Name one metric that proves ${input.title} worked.`, `Write the next action for ${input.title}.`],
    reviewPrompts: [
      {
        id: `review-${input.domain}-${input.slug}`,
        reviewerRole: "mentor",
        prompt: `Review ${input.title} for interview readiness, product usefulness, and senior-engineer clarity.`,
        rubric: ["Goal is explicit", "Artifact is useful", "Evidence is measurable", "Trade-off is named"]
      }
    ],
    references: [...references(input.domain), ...(input.extraReferences ?? []), { id: `reference-${input.domain}-${input.slug}-local`, title: "EngineeringOS master roadmap", url: input.sourcePath, sourceType: "roadmap", usage: "Local master-roadmap source path for this first-class domain." }],
    progressSignals: ["read_definition", "read_theory", "studied_code_example", "ran_code_example", "solved_easy_problem", "solved_medium_problem", "solved_hard_problem", "submitted_explain_back", "completed_mock_review", "scheduled_revision"]
  };
}

export const foundationTopics: SyllabusTopic[] = [
  topic({
    domain: "foundations",
    sourcePath: "00-control/master-roadmap/01-foundations/INDEX.md",
    order: 1,
    slug: "cs-os-networking-foundations",
    title: "CS OS and Networking Foundations",
    definition: "CS, operating-system, and networking foundations explain how programs use CPU, memory, processes, threads, files, sockets, DNS, TCP, TLS, and HTTP.",
    mentalModel: "Backend systems are layered machines; know the layer that owns each failure.",
    theory: "A strong backend engineer can trace a request from browser or client through DNS, TCP/TLS, HTTP, load balancer, process, event loop/thread, memory, database, and response. This foundation helps diagnose latency, resource leaks, timeouts, and scale limits.",
    example: "Trace checklist:\nDNS -> TCP -> TLS -> HTTP -> load balancer -> app process -> DB/cache -> response\nFor each layer: owner, timeout, metric, failure mode",
    interviewQuestions: ["What happens when you type a URL?", "Process vs thread?", "TCP vs UDP?", "Where can latency appear in a backend request?"],
    commonMistakes: ["Memorizing layers without failure modes", "Ignoring DNS/TLS", "Confusing concurrency with parallelism", "No timeout story"],
    productionUseCases: ["Incident debugging", "System design", "Node.js runtime reasoning", "AWS networking"]
  }),
  topic({
    domain: "foundations",
    sourcePath: "00-control/master-roadmap/01-foundations/INDEX.md",
    order: 2,
    slug: "big-o-debugging-foundations",
    title: "Big-O and Debugging Foundations",
    definition: "Big-O describes how time and space grow with input size, while debugging turns symptoms into evidence, hypotheses, experiments, and fixes.",
    mentalModel: "Complexity predicts growth; debugging proves what is actually happening.",
    theory: "Use Big-O for algorithm choice and production growth risks, then use debugging discipline for real failures. Strong candidates explain complexity, edge cases, logs, reproduction, binary search debugging, and verification signals.",
    example: "Debug loop:\nSymptom:\nReproduction:\nHypothesis:\nEvidence:\nExperiment:\nFix:\nVerification:\nRegression test:",
    interviewQuestions: ["How do you explain O(n log n)?", "How do you debug a flaky issue?", "What evidence comes before a fix?", "How do you prove a bug is fixed?"],
    commonMistakes: ["Only stating time complexity", "No reproduction", "Changing many things at once", "No regression test"],
    productionUseCases: ["Coding interviews", "Production debugging", "Performance reviews", "Incident fixes"]
  })
];

export const tradeoffTopics: SyllabusTopic[] = [
  topic({
    domain: "tradeoffs",
    sourcePath: "00-control/master-roadmap/08-tradeoffs/INDEX.md",
    order: 1,
    slug: "consistency-availability-tradeoffs",
    title: "Consistency and Availability Trade-offs",
    definition: "Consistency and availability trade-offs decide how a system behaves when data replication, network partitions, latency, or failures prevent perfect answers.",
    mentalModel: "Every distributed design chooses what to protect first when reality becomes partial.",
    theory: "Senior system design answers should name user impact, data correctness needs, stale-read tolerance, conflict handling, failover behavior, and operational complexity. Not every system needs strong consistency everywhere.",
    example: "Decision record:\nInvariant:\nCan reads be stale?\nCan writes be delayed?\nConflict strategy:\nUser-visible failure:\nRecovery metric:",
    interviewQuestions: ["When is eventual consistency acceptable?", "How does CAP affect design?", "How do bookings differ from feeds?", "What invariant must never break?"],
    commonMistakes: ["Saying CAP without applying it", "No invariant", "No conflict strategy", "Treating all data equally"],
    productionUseCases: ["Booking systems", "Payment systems", "Feeds", "Multi-region AWS HLD"]
  }),
  topic({
    domain: "tradeoffs",
    sourcePath: "00-control/master-roadmap/08-tradeoffs/INDEX.md",
    order: 2,
    slug: "build-buy-cost-reliability-tradeoffs",
    title: "Build Buy Cost and Reliability Trade-offs",
    definition: "Build/buy, cost, and reliability trade-offs compare engineering control, delivery speed, operational burden, vendor risk, resilience, and total cost.",
    mentalModel: "Architecture is resource allocation: time, money, risk, reliability, and ownership.",
    theory: "Staff and architect decisions require a recommendation, not only a list. Compare options using constraints, reversibility, team skill, failure blast radius, migration path, and operational load. AWS service choices are often trade-off decisions.",
    example: "Options table:\nOption A:\nOption B:\nCost:\nReliability:\nSecurity:\nTeam ownership:\nReversibility:\nRecommendation:",
    interviewQuestions: ["When do you buy instead of build?", "How do you reduce AWS cost without hurting reliability?", "How do you explain a trade-off to product?", "What makes a decision reversible?"],
    commonMistakes: ["No recommendation", "Ignoring operational cost", "No migration plan", "Optimizing only cloud bill"],
    productionUseCases: ["Architecture reviews", "Technical strategy", "AWS cost optimization", "Roadmap planning"]
  })
];

export const caseStudyTopics: SyllabusTopic[] = [
  topic({
    domain: "case-studies",
    sourcePath: "00-control/master-roadmap/12-case-studies/INDEX.md",
    order: 1,
    slug: "case-study-whatsapp-chat",
    title: "WhatsApp Chat Case Study",
    definition: "A WhatsApp-style chat case study examines real-time messaging, delivery guarantees, online presence, media, notification fanout, and multi-region reliability.",
    mentalModel: "Chat is ordered user communication plus delivery state under unreliable networks.",
    theory: "Cover one-to-one chat, groups, message IDs, ordering, retries, offline sync, WebSocket connections, queues, storage, media upload, push notifications, abuse prevention, and observability. AWS variants can use ALB/API Gateway, ECS, DynamoDB/RDS, SQS, S3, CloudFront, and ElastiCache.",
    example: "Case study outline:\nRequirements:\nScale:\nAPIs:\nData model:\nRealtime path:\nOffline path:\nFailure modes:\nAWS variant:\nMetrics:",
    interviewQuestions: ["How do you guarantee message ordering?", "How do offline users receive messages?", "How do you handle group fanout?", "What metrics prove chat health?"],
    commonMistakes: ["No delivery states", "No offline sync", "No abuse controls", "No connection scaling story"],
    productionUseCases: ["Chat HLD", "Notification systems", "Realtime collaboration", "Mobile backend design"]
  }),
  topic({
    domain: "case-studies",
    sourcePath: "00-control/master-roadmap/12-case-studies/INDEX.md",
    order: 2,
    slug: "case-study-netflix-streaming",
    title: "Netflix Streaming Case Study",
    definition: "A Netflix-style streaming case study studies content ingestion, encoding, CDN distribution, personalization, playback reliability, and cost-aware global delivery.",
    mentalModel: "Streaming is content preparation plus edge delivery plus user playback resilience.",
    theory: "Discuss upload/ingest, transcoding pipeline, metadata, recommendation read path, CDN caching, adaptive bitrate, DRM/security, observability, and regional resilience. AWS variants can use S3, MediaConvert-like workflows, CloudFront, Step Functions, DynamoDB/RDS, and analytics pipelines.",
    example: "Case study outline:\nIngest:\nEncode:\nStore:\nDistribute:\nPlayback:\nPersonalize:\nProtect:\nObserve:\nOptimize cost:",
    interviewQuestions: ["Why use CDN?", "How does adaptive bitrate help?", "How do you handle regional failures?", "Where does cost explode?"],
    commonMistakes: ["No encoding pipeline", "No CDN cache strategy", "No playback metrics", "No cost model"],
    productionUseCases: ["Media platforms", "CDN design", "Batch workflows", "Recommendation read paths"]
  })
];

export const careerAssetTopics: SyllabusTopic[] = [
  topic({
    domain: "career-assets",
    sourcePath: "00-control/master-roadmap/15-career-assets/INDEX.md",
    order: 1,
    slug: "resume-linkedin-github",
    title: "Resume LinkedIn and GitHub",
    definition: "Resume, LinkedIn, and GitHub assets translate engineering experience into recruiter-readable proof of scope, impact, ownership, and technical credibility.",
    mentalModel: "Career assets are packaging for evidence, not decoration.",
    theory: "A strong resume shows impact, scale, complexity, and outcomes. LinkedIn should match the target role narrative. GitHub should show clean projects, READMEs, architecture notes, tests, and proof-of-work that supports interviews.",
    example: "Asset checklist:\nResume headline:\nTop impact bullets:\nLinkedIn target role summary:\nGitHub pinned projects:\nREADME proof:\nArchitecture screenshots:\nInterview story links:",
    interviewQuestions: ["How does your resume show senior scope?", "Which GitHub project proves backend depth?", "How does LinkedIn match your target role?", "What proof-of-work supports your strongest claim?"],
    commonMistakes: ["Task bullets instead of impact", "Stale GitHub", "No role narrative", "No quantified outcomes"],
    productionUseCases: ["Recruiter screens", "Portfolio reviews", "Job applications", "Networking outreach"],
    extraReferences: [
      { id: "reference-career-github-docs-readme", title: "GitHub README guidance", url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes", sourceType: "docs", usage: "Reference for making GitHub projects easier to understand and evaluate." }
    ]
  }),
  topic({
    domain: "career-assets",
    sourcePath: "00-control/master-roadmap/15-career-assets/INDEX.md",
    order: 2,
    slug: "portfolio-proof-of-work",
    title: "Portfolio and Proof-of-Work",
    definition: "A portfolio and proof-of-work package demonstrates technical judgment through projects, architecture notes, demos, tests, trade-offs, and clear product outcomes.",
    mentalModel: "Show the artifact, the decision, the trade-off, and the measurable result.",
    theory: "For Senior Backend, Solution Architect, Staff, or EM tracks, portfolio artifacts should include a system design doc, implementation notes, tests, observability screenshots, deployment plan, and a concise story about decisions and constraints.",
    example: "Proof-of-work page:\nProblem:\nUsers:\nArchitecture:\nTrade-offs:\nTests:\nObservability:\nAWS deployment variant:\nLessons:\nNext improvement:",
    interviewQuestions: ["What project best proves your senior readiness?", "What trade-off did you make?", "How did you test it?", "What would you improve next?"],
    commonMistakes: ["Only screenshots", "No architecture", "No tests", "No decision story", "No user value"],
    productionUseCases: ["Portfolio website", "GitHub showcase", "Interview discussion", "Content marketing"]
  }),
  topic({
    domain: "career-assets",
    sourcePath: "00-control/master-roadmap/15-career-assets/INDEX.md",
    order: 3,
    slug: "promotion-packet-star-stories",
    title: "Promotion Packet and STAR Stories",
    definition: "Promotion packets and STAR stories organize evidence of scope, impact, leadership, execution, and learning for interviews, promotion, and stakeholder calibration.",
    mentalModel: "Promotion and behavioral interviews both ask for credible evidence of repeated impact.",
    theory: "Build stories for incidents, architecture decisions, conflict, ambiguity, mentoring, delivery, and business impact. Each story should include situation, task, action, result, learning, metrics, and how the behavior maps to the target role.",
    example: "Story packet:\nRole signal:\nSituation:\nTask:\nAction:\nResult:\nMetric:\nLeadership behavior:\nWhat changed permanently:\nFollow-up question:",
    interviewQuestions: ["Tell me about your biggest impact.", "Tell me about a failed project.", "How did you influence without authority?", "Why are you ready for the next level?"],
    commonMistakes: ["No metrics", "No personal action", "No learning", "Only project chronology", "No role-level mapping"],
    productionUseCases: ["Behavioral interviews", "Promotion review", "Manager calibration", "Staff/EM readiness"]
  })
];

export const aiExpansionTopics: SyllabusTopic[] = [
  topic({
    domain: "ai-expansion",
    sourcePath: "00-control/master-roadmap/16-ai-expansion/INDEX.md",
    order: 1,
    slug: "agentic-ai-foundations",
    title: "Agentic AI Foundations",
    definition: "Agentic AI foundations cover LLM basics, prompting, embeddings, RAG, evals, guardrails, tool calling, agents, workflow orchestration, safety, and cost/latency monitoring.",
    mentalModel: "Agentic AI is probabilistic reasoning wrapped in deterministic product, tool, safety, and workflow boundaries.",
    theory: "The 80/20 practical track is: understand model behavior, ground answers with retrieval, validate with evals, constrain tool calls, add human approval for risky actions, and monitor quality, safety, latency, and spend like any production system.",
    example: "AI system checklist:\nUse case:\nTrusted sources:\nPrompt contract:\nTool allowlist:\nEval set:\nGuardrails:\nHuman review:\nCost/latency budget:\nRollback:",
    interviewQuestions: ["How would you design a RAG system?", "What makes an agent safe?", "How do you evaluate AI answer quality?", "Where do guardrails belong?", "How do cost and latency shape model choice?"],
    commonMistakes: ["No eval set", "Giving tools too much permission", "No source grounding", "Ignoring token cost", "Treating prompts as the only safety layer"],
    productionUseCases: ["RAG assistants", "AI coding assistant rollout", "Agentic incident workflows", "Learning evaluators", "AI system design interviews"]
  }),
  topic({
    domain: "ai-expansion",
    sourcePath: "00-control/master-roadmap/16-ai-expansion/INDEX.md",
    order: 2,
    slug: "ai-assisted-learning-evaluator",
    title: "AI-Assisted Learning Evaluator",
    definition: "An AI-assisted learning evaluator uses prompts, rubrics, retrieval, and human review to give feedback on practice answers without replacing judgment.",
    mentalModel: "AI feedback is a draft reviewer; the product still needs rubrics, evidence, and human calibration.",
    theory: "Future EngineeringOS AI should evaluate explain-back answers, code explanations, system design mocks, and behavioral stories using explicit rubrics. It must preserve sources, avoid hallucinated grading, and keep user progress auditable.",
    example: "Evaluator flow:\nUser answer:\nTopic rubric:\nReference context:\nScore:\nStrengths:\nGaps:\nNext drill:\nHuman override:",
    interviewQuestions: ["How would you design an AI reviewer safely?", "How do you prevent hallucinated feedback?", "What data should be stored?", "Where should human review remain?"],
    commonMistakes: ["No rubric", "No source grounding", "Overtrusting AI score", "No privacy model"],
    productionUseCases: ["Mock evaluator", "Rubric scoring", "Revision planning", "Mentor workflow"]
  })
];

export const testingQualityTopics: SyllabusTopic[] = [
  topic({
    domain: "testing-quality",
    sourcePath: "00-control/master-roadmap/01-foundations/INDEX.md",
    order: 1,
    slug: "testing-quality-strategy",
    title: "Testing and Quality Strategy",
    definition: "Testing and quality strategy defines how unit-test, integration-test, contract-test, QA review, and release checks protect behavior, architecture, and user trust.",
    mentalModel: "Quality is a risk-control system: test the smallest useful behavior, then the boundaries where systems meet.",
    theory: "A senior engineer chooses tests by risk and feedback speed. Unit tests protect logic, integration tests protect real boundaries, contract tests protect service agreements, smoke tests protect critical routes, and QA checks protect user workflows. The goal is confidence with fast feedback, not maximum test count.",
    example: "Quality plan:\nUnit-test: pure logic and edge cases\nIntegration-test: repository/service boundaries\nContract-test: API or content schema expectations\nSmoke-test: critical app routes\nQA checklist: role path, progress, submission, readiness\nRelease signal: typecheck, lint, tests, build",
    interviewQuestions: ["Unit test vs integration test?", "What should be a contract test?", "How do you design a QA checklist?", "How do you prevent flaky tests?", "What quality gates block a release?"],
    commonMistakes: ["Only testing happy paths", "No contract-test coverage", "QA after release only", "Slow brittle tests", "No ownership of failing tests"],
    productionUseCases: ["Release readiness", "Content QA", "Backend service testing", "SaaS workflow regression", "EngineeringOS quality contracts"],
    extraReferences: [
      { id: "reference-testing-martin-fowler", title: "Martin Fowler Testing", url: "https://martinfowler.com/testing/", sourceType: "article", usage: "Reference for testing strategy, test pyramid, and practical quality trade-offs." },
      { id: "reference-testing-vitest", title: "Vitest Guide", url: "https://vitest.dev/guide/", sourceType: "docs", usage: "Tooling reference for EngineeringOS unit and contract tests." }
    ]
  })
];

export const seniorSkillsTopics: SyllabusTopic[] = staffPrincipalEmTopics.map((item) => ({
  ...item,
  id: `syllabus-senior-skills-${item.slug}`,
  sourcePath: "00-control/master-roadmap/13-senior-skills/INDEX.md",
  references: item.references.map((reference) =>
    reference.id.includes("local-roadmap")
      ? { ...reference, title: "EngineeringOS Senior Skills master roadmap", url: "00-control/master-roadmap/13-senior-skills/INDEX.md" }
      : reference
  )
}));
