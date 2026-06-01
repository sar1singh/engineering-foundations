export const crashCourseModes = [
  {
    id: "30-day-switch",
    title: "30-day job switch sprint",
    pace: "90 minutes/day",
    promise: "Compress the highest-frequency DSA, backend, HLD, AWS, and behavioral signals.",
    dailyPlan: ["One core lesson", "Two practice reps", "One interview answer", "One weak-area repair"]
  },
  {
    id: "60-day-product",
    title: "60-day FAANG/product prep",
    pace: "75 minutes/day",
    promise: "Build round-wise readiness for coding, system design, behavioral, and senior ownership.",
    dailyPlan: ["One lesson", "One practice set", "One mock prompt", "One review loop"]
  },
  {
    id: "90-day-architect",
    title: "90-day solution architect path",
    pace: "60 minutes/day",
    promise: "Deepen AWS, HLD, LLD, reliability, security, cost, and leadership answers.",
    dailyPlan: ["One architecture topic", "One design scenario", "One AWS trade-off", "One review note"]
  },
  {
    id: "interview-tomorrow",
    title: "Interview tomorrow mode",
    pace: "2-3 hours",
    promise: "Skip new depth. Rehearse the signals most likely to decide the next round.",
    dailyPlan: ["Review weak areas", "Run two mocks", "Prepare stories", "Restate crisp summaries"]
  },
  {
    id: "weak-foundations",
    title: "Weak foundations recovery mode",
    pace: "45 minutes/day",
    promise: "Rebuild confidence from first principles before adding senior interview pressure.",
    dailyPlan: ["One foundation concept", "One tiny example", "One explain-back", "One confidence note"]
  }
];

export const interviewRounds = [
  { title: "Recruiter screen", score: 62, passThreshold: 75, tests: "Role fit, motivation, compensation, timeline.", signal: "Clear target role and credible story.", action: "Prepare 90-second pitch.", prompts: ["Tell me about yourself for this role.", "Why are you switching now?", "What compensation range are you targeting?"] },
  { title: "Foundations screen", score: 48, passThreshold: 72, tests: "HTTP, OS, networking, Big-O, debugging.", signal: "Can explain fundamentals simply.", action: "Repair CS/web basics.", prompts: ["Explain what happens when you open a URL.", "Compare process and thread.", "Estimate Big-O for a nested loop with early exit."] },
  { title: "DSA and algorithms", score: 34, passThreshold: 78, tests: "Patterns, complexity, edge cases, communication.", signal: "Solves common patterns calmly.", action: "Practice arrays, hash maps, trees, graphs.", prompts: ["Find first non-repeating character.", "Detect cycle in a linked list.", "Shortest path in an unweighted graph."] },
  { title: "JavaScript/Node/backend", score: 49, passThreshold: 76, tests: "Closures, async, event loop, Node APIs, errors.", signal: "Explains runtime behavior and backend trade-offs.", action: "Review async/event-loop and API error handling.", prompts: ["Explain microtasks vs macrotasks.", "Design retry-safe API handling.", "Debug a memory leak in Node."] },
  { title: "Database/API round", score: 51, passThreshold: 76, tests: "SQL/NoSQL, indexes, transactions, pagination, contracts.", signal: "Designs reliable data and API flows.", action: "Review API contracts and DB trade-offs.", prompts: ["Design cursor pagination.", "Explain index selectivity.", "Choose SQL vs document store."] },
  { title: "System design/HLD", score: 43, passThreshold: 80, tests: "Requirements, scale, data, bottlenecks, trade-offs.", signal: "Structures design under ambiguity.", action: "Run URL shortener/payment mock.", prompts: ["Design URL shortener.", "Design payment flow.", "Design notification system."] },
  { title: "LLD/machine coding", score: 39, passThreshold: 76, tests: "OOP, SOLID, extensibility, clean APIs.", signal: "Creates maintainable designs.", action: "Practice rate limiter/cache.", prompts: ["Design LRU cache.", "Design rate limiter.", "Design parking lot APIs."] },
  { title: "AWS/cloud/infra", score: 46, passThreshold: 78, tests: "VPC, IAM, Multi-AZ, DR, cost, observability.", signal: "Maps HLD to AWS safely.", action: "Review Multi-AZ and DR.", prompts: ["Deploy a multi-AZ API.", "Pick ECS vs EKS.", "Design backup and restore."] },
  { title: "AI/Agentic AI basics", score: 37, passThreshold: 70, tests: "LLM fundamentals, RAG, evals, safety, agent workflows.", signal: "Can discuss practical AI system trade-offs.", action: "Review RAG, evals, and guardrails.", prompts: ["Design a RAG support assistant.", "Explain hallucination mitigation.", "Define an eval set."] },
  { title: "Behavioral/leadership", score: 55, passThreshold: 76, tests: "Conflict, ownership, incidents, influence.", signal: "Specific STAR stories with impact.", action: "Write two senior stories.", prompts: ["Tell me about conflict.", "Tell me about a failed project.", "Tell me about influence without authority."] },
  { title: "EM/Staff/Principal strategy", score: 41, passThreshold: 78, tests: "Roadmaps, architecture review, hiring, execution.", signal: "Balances business, people, and systems.", action: "Practice architecture review.", prompts: ["Review a migration proposal.", "Create a team execution plan.", "Calibrate interview signals."] },
  { title: "Hiring manager/final round", score: 52, passThreshold: 75, tests: "Scope, judgment, communication, seniority fit.", signal: "Shows calm ownership and business alignment.", action: "Rehearse role narrative and operating model.", prompts: ["What will you improve in your first 90 days?", "How do you make trade-offs?", "Why should we hire you at this level?"] }
];

export const sourceGuides = [
  {
    topic: "DSA 80/20",
    primary: "EngineeringOS DSA path",
    video: "NeetCode roadmap videos",
    article: "GeeksforGeeks pattern references",
    practice: ["LeetCode Blind 75", "NeetCode 150", "Graph BFS/DFS drills"],
    repo: "TheAlgorithms/JavaScript",
    why: "This covers the interview patterns with the highest return before long-tail problem chasing.",
    skip: "Competitive-programming-only tricks until core patterns are stable."
  },
  {
    topic: "JavaScript/Node backend",
    primary: "EngineeringOS JavaScript and Node phases",
    video: "JavaScript.info/YouTube event loop and Node runtime explainers",
    article: "MDN JavaScript guide and Node.js official docs",
    practice: ["Async/event loop drills", "Express/API exercises", "Error-handling refactors"],
    repo: "nodejs/node and public backend starter repos",
    why: "Senior backend rounds often test runtime understanding more than framework memorization.",
    skip: "Framework churn until closures, async, HTTP, errors, and testing are stable."
  },
  {
    topic: "Database/API design",
    primary: "EngineeringOS DB/API path",
    video: "Postgres and Redis conference talks",
    article: "PostgreSQL docs, Redis docs, and API design guides",
    practice: ["Index review", "Cursor pagination", "Transaction boundary design"],
    repo: "Public Postgres/Redis examples",
    why: "Most real backend and HLD interviews hinge on data modeling, consistency, and query behavior.",
    skip: "Exotic database internals before indexes, transactions, caching, and pagination."
  },
  {
    topic: "System Design/HLD",
    primary: "EngineeringOS HLD case studies",
    video: "ByteByteGo system design explainers",
    article: "AWS Architecture Center",
    practice: ["URL shortener", "Payment system", "Booking system"],
    repo: "donnemartin/system-design-primer",
    why: "These cases teach requirement shaping, bottlenecks, reliability, and trade-offs repeatedly.",
    skip: "Exotic distributed systems before API/data/failure basics."
  },
  {
    topic: "AWS Solution Architect",
    primary: "EngineeringOS AWS HLD path",
    video: "AWS official architecture talks",
    article: "AWS Well-Architected Framework",
    practice: ["Multi-AZ design", "Backup/DR plan", "Cost review"],
    repo: "AWS samples and architecture refs",
    why: "AWS-first mapping converts abstract HLD into credible Solution Architect execution detail.",
    skip: "Azure/GCP unless required by the target role."
  },
  {
    topic: "Staff/EM interviews",
    primary: "EngineeringOS Staff/EM track",
    video: "Leadership and incident review talks",
    article: "StaffEng and Google SRE",
    practice: ["Architecture review", "Incident leadership", "Roadmap execution"],
    repo: "Public engineering strategy/RFC examples",
    why: "Senior interviews test judgment, narrative, and leverage as much as technical facts.",
    skip: "Generic management theory without interview stories."
  }
];

export const weakAreaRepairs = [
  { area: "Graph algorithms", why: "Low DSA confidence and high interview frequency.", confidenceTrend: "Rising after two BFS/DFS reps", rounds: ["DSA", "Foundations"], fix: ["Review BFS/DFS mental models", "Solve two graph problems", "Explain visited-state trade-offs"] },
  { area: "AWS Multi-AZ/DR", why: "Critical for Solution Architect and HLD credibility.", confidenceTrend: "Flat until RTO/RPO trade-offs are rehearsed", rounds: ["AWS/cloud", "System design"], fix: ["Draw active-passive DR", "Explain RTO/RPO", "Name cost trade-offs"] },
  { area: "Behavioral stories", why: "Experienced candidates lose offers when impact is vague.", confidenceTrend: "Improves when stories include metrics", rounds: ["Behavioral", "Final"], fix: ["Write STAR+impact", "Add metrics", "Practice concise delivery"] },
  { area: "Architecture review", why: "Staff/Principal/EM loops expect trade-off judgment under ambiguity.", confidenceTrend: "Needs more structured options analysis", rounds: ["EM/Staff/Principal strategy", "Hiring manager/final round"], fix: ["State business goal", "Compare two options", "Name risks and decision criteria"] }
];

export const answerBuilders = [
  { title: "HLD answer builder", sections: ["Requirements", "Scale", "APIs", "Data model", "Components", "Bottlenecks", "Trade-offs", "Failure modes", "Security", "Observability", "Summary"], prompts: ["Who are the users and scale?", "What can fail?", "What trade-off did you choose?"], rubric: ["Requirements before architecture", "Clear data and API model", "Explicit reliability/security/cost trade-offs"], example: "For a payment system, start with idempotent payment intent APIs, ledger records, webhook retries, and reconciliation." },
  { title: "LLD answer builder", sections: ["Objects", "Responsibilities", "Interfaces", "State", "Extensibility", "Tests", "Edge cases"], prompts: ["What changes should be easy?", "Where does state live?", "How will you test it?"], rubric: ["Small interfaces", "Low coupling", "Clear extension points", "Edge cases named"], example: "For an LRU cache, separate storage, list ordering, capacity policy, and tests for update/get/evict paths." },
  { title: "AWS architecture builder", sections: ["Workload", "Networking", "Compute", "Data", "Security", "Reliability", "Cost", "Operations"], prompts: ["What is the blast radius?", "What needs Multi-AZ?", "What is the recovery target?"], rubric: ["IAM/networking least privilege", "Multi-AZ and backup strategy", "Cost and observability included"], example: "For an API workload, use Route 53, CloudFront/API Gateway, ECS across private subnets, RDS Multi-AZ, KMS, CloudWatch, and backup policies." },
  { title: "Behavioral STAR+impact builder", sections: ["Situation", "Task", "Action", "Result", "Learning", "Senior signal", "Business impact"], prompts: ["What was hard?", "What did you personally do?", "What changed because of you?"], rubric: ["Specific personal actions", "Measurable result", "Reflection without blame"], example: "For an incident story, include customer impact, mitigation, communication, root cause, prevention, and business result." },
  { title: "Staff/EM strategy builder", sections: ["Business goal", "Constraints", "Options", "Recommendation", "Risks", "Roadmap", "Stakeholders", "Success metrics"], prompts: ["What business outcome matters?", "Who disagrees and why?", "How do you sequence delivery?"], rubric: ["Business-aligned strategy", "Trade-offs explicit", "Execution plan and communication included"], example: "For a platform migration, propose phases, guardrails, adoption metrics, rollback path, and stakeholder updates." },
  { title: "Incident leadership builder", sections: ["Detection", "Severity", "Command", "Mitigation", "Communication", "Root cause", "Prevention", "Learning"], prompts: ["Who is incident commander?", "What is the customer message?", "What prevents recurrence?"], rubric: ["Calm command structure", "Customer-aware communication", "Actionable prevention"], example: "For a database outage, stabilize reads, communicate status, preserve evidence, restore service, and produce a blameless action plan." }
];
