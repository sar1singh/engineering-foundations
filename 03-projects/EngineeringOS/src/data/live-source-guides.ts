export type LiveSourceLink = {
  title: string;
  url: string;
  kind: "official" | "roadmap" | "practice" | "github" | "video" | "article" | "course";
  topics: string[];
  note: string;
};

export type LiveSourceCategory = {
  category: string;
  goal: string;
  links: LiveSourceLink[];
};

export const liveSourceCategories: LiveSourceCategory[] = [
  {
    category: "JavaScript internals",
    goal: "Closures, scope, promises, async/await, event loop, memory, modules, and runtime behavior.",
    links: [
      { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", kind: "official", topics: ["JS fundamentals", "scope", "objects", "modules"], note: "Primary browser JavaScript reference path." },
      { title: "MDN Closures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures", kind: "official", topics: ["closures", "lexical scope", "private state"], note: "Use for closure definitions and loop-scope pitfalls." },
      { title: "MDN Using promises", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises", kind: "official", topics: ["promises", "microtasks", "async control flow"], note: "Best first source for promise chaining and async semantics." },
      { title: "MDN Promise reference", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise", kind: "official", topics: ["Promise API", "concurrency helpers"], note: "Reference for Promise methods and behavior." },
      { title: "MDN async function", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function", kind: "official", topics: ["async/await", "promise consumption"], note: "Use when rehearsing async/await interview explanations." },
      { title: "javascript.info", url: "https://javascript.info/", kind: "article", topics: ["JS fundamentals", "event loop", "promises", "classes"], note: "Clear tutorial companion after MDN." },
      { title: "javascript.info Event loop", url: "https://javascript.info/event-loop", kind: "article", topics: ["event loop", "macrotasks", "microtasks"], note: "Practical event-loop examples for output-prediction drills." },
      { title: "JavaScript Questions", url: "https://github.com/lydiahallie/javascript-questions", kind: "github", topics: ["output prediction", "JS internals", "interview questions"], note: "Useful for quick JS output-prediction reps after learning the concepts." },
      { title: "30 seconds of code", url: "https://www.30secondsofcode.org/js/p/1", kind: "article", topics: ["JavaScript snippets", "syntax fluency"], note: "Small examples for pattern recognition; use selectively, not as a full curriculum." }
    ]
  },
  {
    category: "Node.js backend",
    goal: "Node runtime, event loop, streams, buffers, process lifecycle, HTTP, errors, and backend APIs.",
    links: [
      { title: "Node.js Documentation", url: "https://nodejs.org/docs/latest/api/", kind: "official", topics: ["Node APIs", "runtime", "backend"], note: "Primary source for built-in modules." },
      { title: "Node.js Event Loop Guide", url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick", kind: "official", topics: ["event loop", "timers", "nextTick"], note: "Use for Node-specific event loop phases." },
      { title: "Node.js Streams API", url: "https://nodejs.org/docs/latest/api/stream.html", kind: "official", topics: ["streams", "backpressure"], note: "Core backend performance topic." },
      { title: "Node.js Buffer API", url: "https://nodejs.org/docs/latest/api/buffer.html", kind: "official", topics: ["buffers", "binary data"], note: "Useful for file/network payload handling." },
      { title: "Node.js Process API", url: "https://nodejs.org/docs/latest/api/process.html", kind: "official", topics: ["process lifecycle", "signals", "env"], note: "Use for lifecycle and ops questions." },
      { title: "Express Guide", url: "https://expressjs.com/en/guide/routing.html", kind: "official", topics: ["routing", "middleware", "APIs"], note: "Good for practical backend API drills." }
    ]
  },
  {
    category: "Roadmaps and minimal topic selection",
    goal: "Use these to decide what to learn, what to skip, and how to sequence the preparation path.",
    links: [
      { title: "roadmap.sh Backend Developer", url: "https://roadmap.sh/backend", kind: "roadmap", topics: ["backend", "APIs", "databases", "deployment"], note: "Best high-level checklist for backend topic coverage." },
      { title: "roadmap.sh Computer Science", url: "https://roadmap.sh/computer-science", kind: "roadmap", topics: ["CS foundations", "algorithms", "OS", "networking"], note: "Use to avoid missing fundamentals without going full university-depth." },
      { title: "roadmap.sh Software Design and Architecture", url: "https://roadmap.sh/software-design-architecture", kind: "roadmap", topics: ["architecture", "design principles", "system design"], note: "Good companion for HLD/LLD sequencing." },
      { title: "roadmap.sh System Design", url: "https://roadmap.sh/system-design", kind: "roadmap", topics: ["HLD", "scalability", "distributed systems"], note: "Quick map of the topics to learn before case studies." },
      { title: "roadmap.sh Node.js", url: "https://roadmap.sh/nodejs", kind: "roadmap", topics: ["Node.js", "backend runtime"], note: "Use as a checklist against the EngineeringOS Node track." },
      { title: "roadmap.sh AWS", url: "https://roadmap.sh/aws", kind: "roadmap", topics: ["AWS", "cloud", "solution architect"], note: "Good AWS learning map before certification-depth details." },
      { title: "Teach Yourself Computer Science", url: "https://teachyourselfcs.com/", kind: "roadmap", topics: ["CS foundations", "OS", "databases", "networking"], note: "Use for deeper gaps when interview prep exposes weak fundamentals." },
      { title: "OSSU Computer Science", url: "https://github.com/ossu/computer-science", kind: "github", topics: ["CS curriculum", "math", "systems"], note: "Full open-source CS curriculum; useful as a reference, not the default fast path." }
    ]
  },
  {
    category: "DSA and coding interviews",
    goal: "80/20 problem patterns, JavaScript implementations, and interview-speed practice.",
    links: [
      { title: "NeetCode Roadmap", url: "https://neetcode.io/roadmap", kind: "practice", topics: ["arrays", "hashing", "two pointers", "trees", "graphs", "DP"], note: "Pattern order for coding interview prep." },
      { title: "NeetCode Practice", url: "https://neetcode.io/practice", kind: "practice", topics: ["NeetCode 150", "pattern reps"], note: "Use after the roadmap to drill one pattern at a time." },
      { title: "LeetCode Problem Set", url: "https://leetcode.com/problemset/", kind: "practice", topics: ["coding drills", "company-style practice"], note: "Main external practice platform." },
      { title: "Blind 75", url: "https://neetcode.io/practice?tab=blind75", kind: "practice", topics: ["high-frequency DSA", "interview speed"], note: "Smallest practical coding list when time is limited." },
      { title: "Tech Interview Handbook", url: "https://www.techinterviewhandbook.org/", kind: "roadmap", topics: ["coding", "behavioral", "system design"], note: "High-signal interview preparation guide." },
      { title: "Tech Interview Handbook GitHub", url: "https://github.com/yangshun/tech-interview-handbook", kind: "github", topics: ["interview prep", "coding", "career"], note: "Open repository for the handbook." },
      { title: "Coding Interview University", url: "https://github.com/jwasham/coding-interview-university", kind: "github", topics: ["CS foundations", "algorithms", "systems"], note: "Deep prep checklist; use only selected sections for your 4-6 month target." },
      { title: "The Algorithms JavaScript", url: "https://github.com/TheAlgorithms/JavaScript", kind: "github", topics: ["algorithms", "JavaScript implementations"], note: "Implementation reference only; keep EngineeringOS solutions original." },
      { title: "AlgoExpert", url: "https://www.algoexpert.io/product", kind: "practice", topics: ["DSA", "guided problem sets"], note: "Paid option with curated sequencing; useful only if you want a guided paid platform." },
      { title: "GeeksforGeeks DSA", url: "https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/", kind: "article", topics: ["arrays", "strings", "hashing", "stacks", "queues"], note: "Supplemental concept refreshers." }
    ]
  },
  {
    category: "System design and HLD",
    goal: "Requirements, scale, APIs, data models, reliability, bottlenecks, and trade-offs.",
    links: [
      { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", kind: "github", topics: ["scalability", "caching", "queues", "databases", "case studies"], note: "Canonical interview prep repository." },
      { title: "AWS Architecture Center", url: "https://aws.amazon.com/architecture/", kind: "official", topics: ["AWS HLD", "reference architectures"], note: "AWS-first design validation." },
      { title: "ByteByteGo Blog", url: "https://blog.bytebytego.com/", kind: "article", topics: ["system design", "visual explainers"], note: "Good visual walkthroughs; use as intuition, then validate details with official docs." },
      { title: "Hello Interview System Design", url: "https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction", kind: "article", topics: ["system design interview", "case studies"], note: "Concise interview-first system design explanations." },
      { title: "Interview Handbook System Design", url: "https://www.interviewhandbook.io/", kind: "article", topics: ["system design", "domain interviews", "fundamentals"], note: "Structured topic pages across backend, ML, data, web, and fundamentals." },
      { title: "Google SRE Book", url: "https://sre.google/sre-book/table-of-contents/", kind: "official", topics: ["reliability", "SLOs", "incident response"], note: "Production reliability foundation." },
      { title: "Google SRE Workbook", url: "https://sre.google/workbook/table-of-contents/", kind: "official", topics: ["SRE practice", "operations"], note: "Hands-on reliability companion." },
      { title: "Awesome Scalability", url: "https://github.com/binhnguyennus/awesome-scalability", kind: "github", topics: ["scalability", "production architecture"], note: "Curated production-scale readings." },
      { title: "Awesome System Design Resources", url: "https://github.com/ashishps1/awesome-system-design-resources", kind: "github", topics: ["HLD", "LLD", "case studies"], note: "Large resource index for follow-up reading." }
    ]
  },
  {
    category: "LLD and machine coding",
    goal: "OOP, SOLID, design patterns, extensibility, clean APIs, and interviewable designs.",
    links: [
      { title: "Low Level Design Primer", url: "https://github.com/prasadgujar/low-level-design-primer", kind: "github", topics: ["LLD", "machine coding", "OOP"], note: "Prompt coverage and design practice sequencing." },
      { title: "Refactoring Guru Design Patterns", url: "https://refactoring.guru/design-patterns", kind: "article", topics: ["design patterns", "OOP"], note: "Visual pattern explanations." },
      { title: "Refactoring Guru Refactoring", url: "https://refactoring.guru/refactoring", kind: "article", topics: ["refactoring", "code smells", "clean design"], note: "Useful for seeing when and why to reshape code." },
      { title: "Refactoring Guru TypeScript examples", url: "https://github.com/RefactoringGuru/design-patterns-typescript", kind: "github", topics: ["design patterns", "TypeScript", "examples"], note: "Concrete TypeScript examples for pattern recognition." },
      { title: "SOLID Principles", url: "https://www.baeldung.com/solid-principles", kind: "article", topics: ["SOLID", "OO design"], note: "Supplemental explanation for design vocabulary." },
      { title: "Awesome Software Engineering Interview", url: "https://github.com/imkgarg/Awesome-Software-Engineering-Interview", kind: "github", topics: ["LLD", "HLD", "interview prep"], note: "Broad repo index for system design and LLD practice." },
      { title: "LLD GitHub topic", url: "https://github.com/topics/low-level-design-problems", kind: "github", topics: ["LLD problems", "machine coding repos"], note: "Discovery page for public LLD practice repositories." },
      { title: "roadmap.sh Software Design", url: "https://roadmap.sh/software-design-architecture", kind: "roadmap", topics: ["architecture", "design principles"], note: "Coverage check for software design fundamentals." }
    ]
  },
  {
    category: "Databases and APIs",
    goal: "SQL, PostgreSQL, MongoDB, Redis, indexes, transactions, pagination, and API contracts.",
    links: [
      { title: "PostgreSQL Documentation", url: "https://www.postgresql.org/docs/current/", kind: "official", topics: ["PostgreSQL", "SQL", "indexes", "transactions"], note: "Primary source for SQL/Postgres behavior." },
      { title: "MongoDB Manual", url: "https://www.mongodb.com/docs/manual/", kind: "official", topics: ["MongoDB", "documents", "indexes"], note: "Primary source for document database behavior." },
      { title: "Redis Documentation", url: "https://redis.io/docs/latest/", kind: "official", topics: ["Redis", "caching", "data structures"], note: "Primary source for Redis and cache patterns." },
      { title: "SQLBolt", url: "https://sqlbolt.com/", kind: "practice", topics: ["SQL basics", "joins", "queries"], note: "Interactive SQL practice." },
      { title: "Use the Index, Luke", url: "https://use-the-index-luke.com/", kind: "article", topics: ["SQL indexes", "query performance"], note: "Useful for index and query tuning intuition." },
      { title: "High Performance PostgreSQL", url: "https://www.crunchydata.com/blog", kind: "article", topics: ["PostgreSQL", "performance", "operations"], note: "Use for practical Postgres tuning and operations articles." },
      { title: "Martin Fowler API Design", url: "https://martinfowler.com/tags/api%20design.html", kind: "article", topics: ["API design", "architecture"], note: "Good source for API and architecture decision essays." },
      { title: "Microsoft REST API Guidelines", url: "https://github.com/microsoft/api-guidelines", kind: "github", topics: ["REST", "API contracts"], note: "Practical API design reference." }
    ]
  },
  {
    category: "AWS Solution Architect",
    goal: "AWS services, architecture review, security, reliability, DR, cost, and operations.",
    links: [
      { title: "AWS Documentation", url: "https://docs.aws.amazon.com/", kind: "official", topics: ["AWS services", "IAM", "VPC", "compute", "databases"], note: "Primary AWS service documentation." },
      { title: "AWS Well-Architected Framework", url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html", kind: "official", topics: ["security", "reliability", "performance", "cost", "operations"], note: "Review framework for AWS architecture decisions." },
      { title: "AWS Architecture Center", url: "https://aws.amazon.com/architecture/", kind: "official", topics: ["reference architectures", "HLD"], note: "Reference architecture discovery." },
      { title: "AWS Skill Builder", url: "https://skillbuilder.aws/", kind: "course", topics: ["AWS learning", "certification"], note: "Official AWS learning platform." },
      { title: "AWS SAA-C03 Exam Guide", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/", kind: "official", topics: ["solution architect", "certification scope"], note: "Use for solution architect exam scope validation." },
      { title: "AWS Workshops", url: "https://workshops.aws/", kind: "course", topics: ["hands-on AWS", "labs", "architecture"], note: "Hands-on AWS labs for practical reinforcement." },
      { title: "AWS Well-Architected Labs", url: "https://www.wellarchitectedlabs.com/", kind: "course", topics: ["Well-Architected", "security", "reliability", "cost"], note: "Lab companion for Well-Architected pillars." },
      { title: "AWS Samples GitHub", url: "https://github.com/aws-samples", kind: "github", topics: ["AWS examples", "labs"], note: "Implementation examples and lab references." }
    ]
  },
  {
    category: "Career, Staff, EM, and behavioral",
    goal: "Senior impact stories, architecture review, incident leadership, strategy, resume, and hiring loops.",
    links: [
      { title: "StaffEng", url: "https://staffeng.com/", kind: "article", topics: ["staff engineering", "leadership"], note: "Real staff engineer narratives and career framing." },
      { title: "The Engineering Manager", url: "https://www.theengineeringmanager.com/", kind: "article", topics: ["EM", "management", "execution"], note: "Management and execution essays." },
      { title: "Google re:Work", url: "https://rework.withgoogle.com/", kind: "official", topics: ["management", "teams", "hiring"], note: "Evidence-backed people and team practices." },
      { title: "The Pragmatic Engineer", url: "https://blog.pragmaticengineer.com/", kind: "article", topics: ["career", "engineering leadership", "industry"], note: "Useful industry context and senior-engineer career framing." },
      { title: "LeadDev", url: "https://leaddev.com/", kind: "article", topics: ["leadership", "staff engineering", "management"], note: "Good for staff/EM communication and operating-model topics." },
      { title: "GitHub Engineering Blog", url: "https://github.blog/engineering/", kind: "article", topics: ["engineering practice", "systems", "culture"], note: "Production engineering stories and patterns." },
      { title: "Atlassian Incident Management", url: "https://www.atlassian.com/incident-management", kind: "article", topics: ["incident management", "postmortems"], note: "Practical incident workflow reference." }
    ]
  },
  {
    category: "AI and agentic systems",
    goal: "LLM basics, RAG, evals, tool use, guardrails, cost, latency, and practical AI architecture.",
    links: [
      { title: "OpenAI Docs", url: "https://platform.openai.com/docs", kind: "official", topics: ["LLMs", "tool calling", "evals", "agents"], note: "Primary OpenAI API reference." },
      { title: "OpenAI Cookbook", url: "https://cookbook.openai.com/", kind: "official", topics: ["RAG", "embeddings", "evals", "examples"], note: "Practical examples and implementation patterns." },
      { title: "Anthropic Prompt Engineering Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", kind: "official", topics: ["prompting", "LLM behavior"], note: "Useful cross-provider prompt design reference." },
      { title: "LangChain Docs", url: "https://python.langchain.com/docs/introduction/", kind: "official", topics: ["agents", "RAG", "tools"], note: "Framework reference for agent/RAG concepts." },
      { title: "LlamaIndex Docs", url: "https://docs.llamaindex.ai/", kind: "official", topics: ["RAG", "indexing", "retrieval"], note: "Retrieval and indexing implementation reference." }
    ]
  }
];
