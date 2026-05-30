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
- `src/data/syllabus/dsa-phase-4.ts`
- `src/lib/services/syllabus-service.ts`
- `src/lib/services/syllabus-service.test.ts`

Scaling decision:

- `src/data/mock-syllabus.ts` should act as the catalog aggregator.
- Larger imported slices should move into focused files under `src/data/syllabus/`.
- This keeps mock data easier to review now and easier to migrate into normalized database tables later.
- DSA Phase 4 is the first split syllabus data module.

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

Import the next DSA slice from `00-control/master-roadmap/04-dsa/INDEX.md` into the same mock syllabus structure:

```txt
JavaScript
  Phase 2 Async
    Promises
    Async Await
    Event Loop
    Microtask vs Macrotask
```

Add tests that verify:

- DSA source path is preserved.
- Topic order matches the roadmap.
- Each topic has at least one easy practice problem.
- Progress signals are present.

## Suggested Commit Message

```txt
feat: add mock syllabus import structure
```
