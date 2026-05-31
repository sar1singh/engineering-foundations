# Mock Syllabus Import and Backend Schema Plan

## Purpose

EngineeringOS needs the full syllabus from `00-control/master-roadmap` and, when populated, `01-learning`.

This phase adds a mock-first import structure. It does not add a real backend, OpenAI, auth, billing, deployment, production database behavior, dependency changes, or destructive schema changes.

## Source Audit

Reviewed:

- `00-control/master-roadmap/MASTER_INDEX.md`
- `00-control/master-roadmap/02-javascript/INDEX.md`
- `00-control/master-roadmap/04-dsa/INDEX.md`
- `01-learning`

Findings:

- `00-control/master-roadmap` is the usable syllabus source.
- `MASTER_INDEX.md` defines domain priority and domain routing.
- `02-javascript/INDEX.md` defines JavaScript phases and the Phase 1 fundamentals sequence: Scope, Hoisting, Closures, this, Prototype chain.
- `04-dsa/INDEX.md` defines DSA phases and pass criteria.
- `01-learning` has no importable files in the current workspace.

## Implemented Mock Structure

Added:

- `src/types/syllabus.ts`
- `src/data/mock-syllabus.ts`
- `src/data/syllabus/js-phase-1-fundamentals.ts`
- `src/data/syllabus/js-phase-2-async.ts`
- `src/data/syllabus/js-phase-3-senior.ts`
- `src/data/syllabus/js-phase-4-interview.ts`
- `src/data/syllabus/nodejs-phase-1-core-runtime.ts`
- `src/data/syllabus/nodejs-phase-2-backend-engineering.ts`
- `src/data/syllabus/nodejs-phase-3-scale.ts`
- `src/data/syllabus/nodejs-phase-4-senior.ts`
- `src/data/syllabus/database-topics.ts`
- `src/data/syllabus/system-design-topics.ts`
- `src/data/syllabus/aws-topics.ts`
- `src/data/syllabus/lld-topics.ts`
- `src/data/syllabus/algorithm-topics.ts`
- `src/data/syllabus/hld-case-studies.ts`
- `src/data/syllabus/aws-hld-deepening.ts`
- `src/data/syllabus/staff-em-topics.ts`
- `src/data/syllabus/linear-learning-roadmap.ts`
- `src/data/syllabus/role-learning-roadmaps.ts`
- `src/data/syllabus/topic-depth-overrides.ts`
- `docs/SYLLABUS_PRODUCT_AUDIT.md`
- `src/data/syllabus/dsa-phase-1-foundations.ts`
- `src/data/syllabus/dsa-phase-2-core-patterns.ts`
- `src/data/syllabus/dsa-phase-3-structures.ts`
- `src/data/syllabus/dsa-phase-4.ts`
- `src/lib/services/syllabus-service.ts`
- `src/lib/services/syllabus-service.test.ts`
- `src/app/syllabus/page.tsx`
- `src/app/syllabus/[topicId]/page.tsx`
- `src/components/persistence/SyllabusResponseForm.tsx`

Scaling decision:

- `src/data/mock-syllabus.ts` acts as the catalog aggregator.
- Imported slices live in focused files under `src/data/syllabus/`.
- This keeps mock data easier to review now and easier to migrate into normalized database tables later.
- JavaScript Phases 1-4, Node.js Phases 1-4, Algorithms, Databases, System Design, HLD case studies, AWS, LLD, Staff/Principal/EM, and DSA Phases 1-4 are now split syllabus data modules.

The mock syllabus catalog can represent:

- Domains
- Modules
- Topics
- Source paths
- Definitions
- Why-it-matters copy
- Mental models
- Theory
- Runnable code examples
- Practice problems by `easy`, `medium`, and `hard`
- Interview questions
- Common mistakes
- Production use cases
- Revision prompts
- Self-review, mock AI auditor, and mentor-review prompts
- Progress signals such as reading theory, running code, solving problems, submitting explain-back, and completing review
- References used to create or route the content

## Implemented Syllabus UI

Added `/syllabus` as a syllabus browser and `/syllabus/[topicId]` as a detail view for imported roadmap topics.

Each syllabus detail page can show:

- Short definition
- Theory and mental model
- Working code examples
- Easy, medium, and hard practice prompts
- Interview questions
- Revision prompts
- Common mistakes and production use cases
- References
- Progress signals
- Topic completion action
- Response forms for practice problems, interview questions, and revision prompts
- Rubric-based review prompts with response submission
- Static mock interview mode with response submission
- Saved response history through the existing explain-back persistence repository

## Imported Slices

Imported a small JavaScript fundamentals slice from `00-control/master-roadmap/02-javascript/INDEX.md`:

```txt
JavaScript
  Phase 1 Fundamentals
    Scope
    Hoisting
    Closures
    this
    Prototype Chain
```

Closures received the richest content in this slice:

- Definition
- Theory
- Mental model
- Runnable counter code example
- Easy, medium, and hard practice problems
- Interview questions
- Common mistakes
- Production use cases
- Revision prompts
- Review prompts
- Progress signals

Imported the JavaScript Phase 2 Async slice from `00-control/master-roadmap/02-javascript/INDEX.md` into `src/data/syllabus/js-phase-2-async.ts`:

```txt
JavaScript
  Phase 2 Async
    Promises
    Async Await
    Event Loop
    Microtask vs Macrotask
```

Each JavaScript async topic now includes:

- Interview-ready definition
- Mental model
- Visual model description
- Core theory
- Runnable JavaScript output-trace example
- Easy, medium, and hard practice problems
- Interview questions and answer-review prompts
- Common mistakes
- Production use cases
- Revision prompts
- Progress signals
- References to the local roadmap, MDN, and javascript.info

Imported the JavaScript Phase 3 Senior Topics slice from `00-control/master-roadmap/02-javascript/INDEX.md` into `src/data/syllabus/js-phase-3-senior.ts`:

```txt
JavaScript
  Phase 3 Senior Topics
    Memory leaks
    Garbage collection
    Performance
    Modular architecture
```

Each JavaScript senior topic now includes:

- Interview-ready definition
- Production mental model
- Visual model description
- Core theory
- Working JavaScript example
- Easy, medium, and hard practice problems
- Interview questions and answer-review prompts
- Common mistakes
- Production use cases
- Revision prompts
- Progress signals
- References to the local roadmap, MDN, and web.dev

Imported the JavaScript Phase 4 Interview slice from `00-control/master-roadmap/02-javascript/INDEX.md` into `src/data/syllabus/js-phase-4-interview.ts`:

```txt
JavaScript
  Phase 4 Interview
    Output prediction
    Debugging scenarios
```

Each JavaScript interview topic now includes:

- Interview-ready definition
- Tracing/debugging mental model
- Visual model description
- Core theory
- Runnable local JS drill
- Easy, medium, and hard practice problems
- Interview questions and answer-review prompts
- Common mistakes
- Production use cases
- Revision prompts
- Progress signals
- References to the local roadmap, MDN, javascript.info, and local JS files as the practice path

Imported the Node.js Phase 1 Core Runtime slice from `00-control/master-roadmap/03-nodejs/INDEX.md` into `src/data/syllabus/nodejs-phase-1-core-runtime.ts`:

```txt
Node.js
  Phase 1 Core Runtime
    Event loop in Node
    process lifecycle
    Buffers
    Streams
```

Each Node.js core runtime topic now includes:

- Interview-ready definition
- Runtime mental model
- Visual model description
- Core theory
- Working local Node.js lab
- Easy, medium, and hard practice problems
- Interview questions and answer-review prompts
- Common mistakes
- Production use cases
- Revision prompts
- Progress signals
- References to the local roadmap, official Node docs, local labs, and mini backend projects

Imported the remaining Node.js slices from `00-control/master-roadmap/03-nodejs/INDEX.md`:

```txt
Node.js
  Phase 2 Backend Engineering
    Error handling
    Validation
    Logging
    Config management
  Phase 3 Scale Topics
    Clustering
    worker_threads
    Queue workers
    Rate limiting
  Phase 4 Senior Topics
    Performance tuning
    Graceful shutdown
    Reliability patterns
```

References include official Node.js docs, OWASP Input Validation, OWASP Logging, Redis rate-limit material, local labs, and mini backend projects.

Imported the full Databases roadmap from `00-control/master-roadmap/05-databases/INDEX.md`:

```txt
Databases
  SQL Core
  Performance
  PostgreSQL
  MongoDB
  Redis
```

References include SQLBolt, LeetCode SQL, official PostgreSQL docs, official MongoDB docs, official Redis docs, and local DB practice.

Imported the full System Design roadmap from `00-control/master-roadmap/06-system-design/INDEX.md`:

```txt
System Design
  Foundations
  Building Blocks
  Capacity Math
  Common Systems
  Advanced
```

References include System Design Primer, Google SRE, AWS Elastic Load Balancing, AWS Well-Architected Framework, and AWS Well-Architected Reliability Pillar material.

Architecture focus decision:

- Prioritize AWS Solution Architect, HLD, and LLD.
- Do not add Azure-focused references unless explicitly requested later.
- Use AWS docs and AWS Well-Architected as the cloud architecture reference path.

Imported the AWS core services slice from `00-control/master-roadmap/09-aws/INDEX.md` into `src/data/syllabus/aws-topics.ts`:

```txt
AWS
  IAM
  EC2
  S3
  RDS
  VPC
  Lambda
  SQS SNS
  DynamoDB
```

References include the AWS SAA-C03 Exam Guide, AWS Well-Architected Framework, official AWS service docs, roadmap.sh AWS, and roadmap.sh Software Architect.

Imported an LLD/machine-coding track into `src/data/syllabus/lld-topics.ts`.

The local `00-control/master-roadmap/07-lld/INDEX.md` file is currently empty, so this track is externally guided by roadmap.sh Software Design and Architecture, Low Level Design Primer, System Design Primer OOD, and CodeZym.

```txt
LLD
  Foundations
    OOP Principles
    SOLID
    Design Patterns
    UML Sequence and Class Diagrams
  Machine Coding
    Parking Lot
    Elevator System
    Splitwise Expense Sharing
    Rate Limiter LLD
    Cache LLD
    Notification Service LLD
  Senior Design
    API Design Contracts
    Module Boundaries
    Extensibility Trade-offs
```

Added a deeper Algorithms track in `src/data/syllabus/algorithm-topics.ts` to fill gaps around search, hash maps, trees, graphs, recursion, DP, intervals, and bit manipulation.

Added HLD case-study mocks in `src/data/syllabus/hld-case-studies.ts`:

```txt
URL shortener
Chat
Feed
Booking
Payment
Notification
```

Each case study includes an AWS deployment variant.

Added AWS HLD deepening in `src/data/syllabus/aws-hld-deepening.ts`:

```txt
Multi-AZ
Auto Scaling
Route 53
CloudFront
ElastiCache
API Gateway
Step Functions
ECS/EKS
KMS
CloudTrail
Backup and DR
Cost Optimization
```

Added Staff/Principal/EM topics in `src/data/syllabus/staff-em-topics.ts`:

```txt
Architecture Review
Technical Strategy
Incident Leadership
Roadmap Execution
Hiring and Interview Calibration
Stakeholder Communication
```

Added `src/data/syllabus/linear-learning-roadmap.ts` and surfaced it on `/syllabus` as:

```txt
Junior to Strong Foundation
Mid-Level Backend Engineer
Senior Engineer
Solution Architect
Staff Principal EM
```

Added role-based targeted roadmaps in `src/data/syllabus/role-learning-roadmaps.ts` and surfaced filters on `/syllabus`:

```txt
Senior Backend Engineer
AWS Solution Architect
Staff Principal Engineer
Engineering Manager
```

Each role path includes:

- Foundation, basic, advanced, and expert sections
- 80/20 core focus
- Depth focus
- Expert focus
- Direct topic links into the syllabus detail pages

Current syllabus audit:

- Broad coverage exists for JavaScript, DSA, Algorithms, Node.js, Databases, System Design, HLD case studies, AWS, LLD, and Staff/Principal/EM.
- The UI now supports catalog browsing, linear roadmap browsing, role filtering, and 80/20 focus filtering.
- The UI now supports search and card/table views.
- The service layer now normalizes every rendered topic to at least 8 practice problems and 8 interview questions.
- The service layer now applies deep lesson overrides for graph algorithms, AWS Multi-AZ/DR, payment/booking HLD, architecture review, and incident leadership.
- Remaining top-level gaps are standalone foundations, tradeoffs, security, performance, case-study progression, interview operations, career assets, and AI expansion.

Imported the DSA Phase 1 Foundations slice from `00-control/master-roadmap/04-dsa/INDEX.md`:

```txt
DSA
  Phase 1 Foundations
    Arrays
    Strings
    Hashing
    Stack
    Queue
```

Each DSA foundation topic now includes:

- Interview-ready definition
- Mental model
- Visual model description
- Core theory
- Runnable JavaScript code example
- Easy, medium, and hard practice problems
- Interview questions and answer-review prompts
- Common mistakes
- Production use cases
- Revision prompts
- Progress signals
- References used to create or route the content

Imported the DSA Phase 2 Core Patterns slice from `00-control/master-roadmap/04-dsa/INDEX.md`:

```txt
DSA
  Phase 2 Core Patterns
    Two Pointers
    Sliding Window
    Prefix Sum
    Binary Search
```

Each DSA core-pattern topic now includes:

- Interview-ready definition
- Mental model
- Visual model description
- Core theory
- Runnable JavaScript pattern example
- Easy, medium, and hard practice problems
- Interview questions and answer-review prompts
- Common mistakes
- Production use cases
- Revision prompts
- Progress signals
- References to the local roadmap, LeetCode, and NeetCode practice routing

Imported the DSA Phase 3 Structures slice from `00-control/master-roadmap/04-dsa/INDEX.md`:

```txt
DSA
  Phase 3 Structures
    Linked List
    Trees
    Heap
    Trie
    Graphs
```

Each DSA structure topic now includes:

- Interview-ready definition
- Mental model
- Visual model description
- Core theory
- Runnable JavaScript structure example
- Easy, medium, and hard practice problems
- Interview questions and answer-review prompts
- Common mistakes
- Production use cases
- Revision prompts
- Progress signals
- References to the local roadmap, LeetCode, and NeetCode practice routing

Imported the DSA Phase 4 Advanced slice from `00-control/master-roadmap/04-dsa/INDEX.md` into `src/data/syllabus/dsa-phase-4.ts`:

```txt
DSA
  Phase 4 Advanced
    Greedy
    Backtracking
    Dynamic Programming
```

Each DSA advanced topic now includes:

- Interview-ready definition
- Mental model
- Visual model description
- Core theory
- Runnable JavaScript example
- Easy, medium, and hard practice problems
- Interview questions and answer-review prompts
- Common mistakes
- Production use cases
- Revision prompts
- Proof/strategy review prompts
- Progress signals
- References to the local roadmap, LeetCode, and NeetCode practice routing

## Current Backend Status

EngineeringOS has backend-ready local architecture, but not production backend infrastructure.

Currently present:

- Next.js server components and server actions
- Repository interfaces
- Mock repositories
- Service layer
- Provider wiring through `appServices`
- Local Prisma schema and local SQLite support
- Opt-in Prisma mode
- Mock-default data source
- Local progress persistence abstractions

Not currently present:

- Public REST/GraphQL API routes
- Production PostgreSQL/Supabase database
- Cloud auth
- OpenAI integration
- Billing
- Deployment pipeline
- Hosted backend architecture
- Production observability

Planned later, after local/mock behavior stabilizes:

- Backend API boundary for topic retrieval, progress, code runs, and reviews
- Normalized production DB schema
- Auth/user model
- Safe migration path from mock/local SQLite to hosted DB
- Deployment architecture and environment strategy
- Optional real AI reviewer after explicit approval

## External References Used

The DSA content was synthesized from the local master roadmap plus reliable public references:

- GeeksforGeeks Array Data Structure: `https://www.geeksforgeeks.org/dsa/array-data-structure/`
- GeeksforGeeks String Data Structure: `https://www.geeksforgeeks.org/dsa/string-data-structure/`
- GeeksforGeeks Hash Table Data Structure: `https://www.geeksforgeeks.org/hash-table-data-structure/`
- GeeksforGeeks Stack Data Structure: `https://www.geeksforgeeks.org/stack`
- GeeksforGeeks Queue Data Structure: `https://www.geeksforgeeks.org/dsa/queue-data-structure/`
- LeetCode Array problem list: `https://leetcode.com/problem-list/array/`
- LeetCode String problem list: `https://leetcode.com/problem-list/string/`
- LeetCode Hash Table problem list: `https://leetcode.com/problem-list/hash-table/`
- LeetCode Stack problem list: `https://leetcode.com/problem-list/stack/`
- LeetCode Queue problem list: `https://leetcode.com/problem-list/queue/`
- LeetCode general problem lists: `https://leetcode.com/problem-list/`
- NeetCode roadmap: `https://neetcode.io/roadmap`

## Future Backend Schema Plan

Keep this as planning only until explicitly approved.

Recommended future normalized schema:

```txt
SyllabusSource
  id
  rootPath
  sourceType
  importedAt
  checksum

SyllabusDomain
  id
  slug
  title
  order
  sourcePath
  goal

SyllabusModule
  id
  domainId
  slug
  title
  order
  sourcePath
  goal

SyllabusTopic
  id
  moduleId
  slug
  title
  order
  sourcePath
  definition
  whyItMatters
  mentalModel
  theory

CodeExample
  id
  topicId
  title
  language
  code
  explanation
  runnable

SyllabusReference
  id
  topicId
  title
  url
  sourceType
  usage

PracticeProblem
  id
  topicId
  title
  difficulty
  tagsJson
  prompt
  starterCode
  expectedSignalsJson

ProblemTestCase
  id
  problemId
  input
  expectedOutput
  isHidden

InterviewQuestion
  id
  topicId
  question
  answer
  level

RevisionPrompt
  id
  topicId
  prompt
  frequency

ReviewPrompt
  id
  topicId
  reviewerRole
  prompt
  rubricJson

UserTopicProgress
  id
  userId
  topicId
  readDefinitionAt
  readTheoryAt
  studiedCodeExampleAt
  ranCodeExampleAt
  submittedExplainBackAt
  completedMockReviewAt
  scheduledRevisionAt
  status

UserProblemProgress
  id
  userId
  problemId
  status
  attempts
  lastSubmittedAt

CodeRun
  id
  userId
  codeExampleId
  problemId
  language
  code
  output
  error
  runtimeMs
  createdAt

ReviewResult
  id
  userId
  topicId
  problemId
  reviewerRole
  score
  summary
  strengthsJson
  improvementsJson
  createdAt

ExplainBackAttempt
  id
  userId
  topicId
  answer
  reviewResultId
  createdAt
```

## Compiler and Reviewer Staging

Recommended implementation order:

1. Static code examples in mock content.
2. Browser-side JavaScript runner for small examples only.
3. Save code attempts locally.
4. Mock reviewer using rubric prompts.
5. Real AI reviewer only after explicit approval.

Do not add OpenAI or a remote execution service in the mock syllabus import phase.

## Next Import Step

Import the next missing first-class roadmap domain into the same mock syllabus structure:

```txt
Security, performance, tradeoffs, interview operations, or career assets
```

Add tests that verify:

- Node.js source path is preserved.
- Topic order matches the roadmap.
- Each topic has at least one easy practice problem.
- Progress signals are present.

## Suggested Commit Message

```txt
feat: add mock syllabus import structure
```
