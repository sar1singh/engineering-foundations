# EngineeringOS — Content, Roadmap, Database & Retrieval Implementation Plan

## Purpose

This file extends the existing EngineeringOS planning docs.

It must be used with:

- `PRD.md`
- `UX_FLOW.md`
- `MVP_SCOPE.md`
- `BUILD_PLAN.md`
- `CODEX_TASKS.md`

This file adds the missing implementation plan for:

- Fetching learning topics
- Retrieving topic content
- Storing master roadmaps
- Storing categories, topics, subtopics, tasks, subtasks, and problem statements
- Creating backend-ready repositories
- Preparing a local-first database structure
- Preparing future Supabase/PostgreSQL migration
- Ensuring every topic follows the agreed EngineeringOS learning format

Primary rule:

Build local-first using mock/local data first, then SQLite/local DB or JSON persistence, then Supabase/PostgreSQL later.

Do not directly jump to Supabase, OpenAI, cloud auth, billing, or deployment.

---

# 1. Product Context

EngineeringOS is an AI-powered learning, interview, and job-switch operating system for engineers.

It is being built inside:

```txt
engineering-os/projects/EngineeringOS/
```

The product serves four purposes:

1. Personal learning system
2. Public SaaS MVP
3. Portfolio/showcase project
4. Content marketing / teaching platform

The current MVP must support:

- Dashboard
- Topic graph
- Topic studio
- Practice lab
- Progress tracking
- Local code execution
- Mock AI evaluation
- Backend-ready repository architecture
- Master roadmap storage
- Topic/content retrieval
- Problem/task/subtask storage

---

# 2. Missing Scope Being Added

The earlier plan included dashboard, graph, topic studio, practice lab, and local progress.

This file adds the required content/data layer.

EngineeringOS must not treat topics as hardcoded UI-only mock objects forever.

It needs a structured content system that can store and retrieve:

- Master roadmaps
- Domains
- Categories
- Modules
- Topics
- Subtopics
- Concepts
- Practice tasks
- Subtasks
- Problem statements
- Examples
- Constraints
- Hints
- Edge cases
- Interview questions
- Reference links
- Revision prompts
- Explain-back prompts
- AI evaluation rubrics
- Learning modes
- Topic prerequisites
- Topic graph relationships
- Role relevance
- Company relevance
- Difficulty progression
- Progress metadata

---

# 3. Build Strategy for Content System

The content system must be built in phases.

## Phase 1 — Local Static Content

Use TypeScript mock data files.

Required:

```txt
src/data/roadmaps.ts
src/data/categories.ts
src/data/topics.ts
src/data/subtopics.ts
src/data/practice-tasks.ts
src/data/problem-statements.ts
src/data/learning-graph.ts
src/data/references.ts
src/data/evaluation-rubrics.ts
```

Purpose:

- Fast development
- No backend dependency
- Easy Codex generation
- Easy manual editing
- Good for static prototype

## Phase 2 — Local Repository Layer

Create repository interfaces and local/mock implementations.

Required:

```txt
src/lib/repositories/roadmap-repository.ts
src/lib/repositories/category-repository.ts
src/lib/repositories/topic-repository.ts
src/lib/repositories/subtopic-repository.ts
src/lib/repositories/practice-repository.ts
src/lib/repositories/problem-repository.ts
src/lib/repositories/reference-repository.ts
src/lib/repositories/progress-repository.ts
```

Purpose:

- UI does not directly depend on mock files
- Future DB migration becomes easier
- Supabase integration later can replace local repositories

## Phase 3 — Local Persistent DB

After static prototype and repository layer are stable, add local database support.

Recommended local options:

Option A:

- SQLite
- Prisma ORM

Option B:

- SQLite
- Drizzle ORM

Preferred for AI-agent simplicity:

- SQLite + Prisma

Reason:

- Easy local setup
- Strong schema visibility
- Migration support
- Future PostgreSQL migration is easier

Required local DB files:

```txt
prisma/schema.prisma
prisma/seed.ts
src/lib/db/prisma.ts
src/lib/repositories/prisma-roadmap-repository.ts
src/lib/repositories/prisma-topic-repository.ts
src/lib/repositories/prisma-practice-repository.ts
```

## Phase 4 — Supabase/PostgreSQL Migration

Only after local DB works.

Add:

- Supabase Auth
- Supabase PostgreSQL
- pgvector later
- Row-level security later
- User-specific progress later

The data model should be designed so it can move from SQLite to PostgreSQL.

---

# 4. Core Content Format

Every topic must follow this EngineeringOS format.

## Topic Required Format

Each topic must contain:

```txt
1. Topic name
2. Short summary
3. Why this matters
4. Prerequisites
5. Related topics
6. Advanced topics
7. Difficulty
8. Estimated time
9. Role relevance
10. Interview relevance
11. Company relevance
12. Learning modes
13. Theory
14. Mental model
15. Code examples
16. Production use cases
17. Common mistakes
18. Practice tasks
19. Subtasks
20. Problem statements
21. Edge cases
22. Interview questions
23. Explain-back prompt
24. Evaluation rubric
25. Revision prompts
26. Reference links
27. Completion criteria
```

## Learning Modes

Every topic should support:

### Fast Track / 80-20 Mode

Purpose:

- Interview-first
- High ROI
- Minimal theory
- Practice-heavy
- Clear pass condition

### Deep Mastery Mode

Purpose:

- Full understanding
- Production-level context
- Edge cases
- Trade-offs
- System connections
- Teaching/content creation

---

# 5. Master Roadmap Structure

EngineeringOS must store the master roadmap as structured data.

## Roadmap Hierarchy

```txt
Roadmap
  Domain
    Category
      Module
        Topic
          Subtopic
            Practice Task
              Subtask
              Problem Statement
```

## Example

```txt
Engineering Interview Roadmap
  JavaScript
    Runtime Fundamentals
      Scope and Execution Context
        Closures
          Lexical Environment
          Closure Memory Behavior
          Closure Interview Patterns
          Practice Task: Implement counter with closure
            Subtask: Create private variable
            Subtask: Return increment function
            Subtask: Explain memory retention
```

---

# 6. Required Initial Roadmap Domains

The system should seed at least these roadmap domains:

```txt
1. JavaScript Foundations
2. Advanced JavaScript Runtime
3. Node.js Backend Engineering
4. DSA and Algorithms
5. Low-Level Design
6. High-Level System Design
7. Distributed Systems
8. Databases
9. Caching
10. Messaging and Queues
11. API Design
12. Security and Auth
13. AWS and Cloud Architecture
14. Observability
15. Testing and Quality
16. Interview Preparation
17. Content Creation / Proof-of-Work
18. Career Execution
```

These domains must be extensible.

Do not hardcode the app for only JavaScript topics.

---

# 7. Required Initial Topic Seeds

The MVP should seed enough topics to demonstrate the system.

## JavaScript Topics

```txt
JavaScript Fundamentals
Scope
Execution Context
Lexical Environment
Closures
Hoisting
this binding
Prototypes
Event Loop
Callbacks
Promises
Async/Await
Error Handling
Memory Management
Garbage Collection
Modules
```

## Node.js Topics

```txt
Node.js Runtime
Event Loop in Node.js
libuv
Streams
Buffers
Express Basics
Middleware
Error Handling
Authentication
Rate Limiting
Background Jobs
```

## DSA Topics

```txt
Arrays
Strings
Hash Maps
Two Pointers
Sliding Window
Stack
Queue
Linked List
Binary Search
Trees
Graphs
Recursion
Dynamic Programming Basics
```

## System Design Topics

```txt
Scalability Basics
Load Balancing
Caching
Database Indexing
Replication
Sharding
Queues
Rate Limiting
CDN
Observability
Design URL Shortener
Design WhatsApp
Design Instagram Feed
Design Payment System
```

## Database Topics

```txt
SQL Basics
PostgreSQL Basics
Indexes
Transactions
Isolation Levels
Joins
Query Planning
MongoDB Basics
Document Modeling
Consistency Tradeoffs
```

## AWS Topics

```txt
IAM
VPC Basics
EC2
Lambda
S3
API Gateway
SQS
SNS
DynamoDB
RDS
CloudWatch
Step Functions
Well-Architected Framework
```

---

# 8. TypeScript Types

Create the following files:

```txt
src/types/roadmap.ts
src/types/category.ts
src/types/topic.ts
src/types/subtopic.ts
src/types/practice.ts
src/types/problem.ts
src/types/reference.ts
src/types/evaluation.ts
src/types/progress.ts
```

## Roadmap Type

```ts
export type Roadmap = {
  id: string
  title: string
  slug: string
  description: string
  targetRole: string[]
  targetLevel: string[]
  targetCompanyTypes: string[]
  estimatedWeeks: number
  domainIds: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

## Domain Type

```ts
export type Domain = {
  id: string
  roadmapId: string
  title: string
  slug: string
  description: string
  order: number
  categoryIds: string[]
}
```

## Category Type

```ts
export type Category = {
  id: string
  domainId: string
  title: string
  slug: string
  description: string
  order: number
  moduleIds: string[]
}
```

## Module Type

```ts
export type Module = {
  id: string
  categoryId: string
  title: string
  slug: string
  description: string
  order: number
  topicIds: string[]
}
```

## Topic Type

```ts
export type Topic = {
  id: string
  moduleId: string
  title: string
  slug: string
  summary: string
  whyItMatters: string
  difficulty: "easy" | "medium" | "hard" | "expert"
  estimatedMinutes: number
  tags: string[]

  prerequisites: string[]
  relatedTopics: string[]
  advancedTopics: string[]

  roleRelevance: string[]
  companyRelevance: string[]
  interviewRelevance: number

  learningModes: {
    fastTrack: LearningModeContent
    deepMastery: LearningModeContent
  }

  theory: string
  mentalModel: string
  codeExamples: CodeExample[]
  productionUseCases: string[]
  commonMistakes: string[]

  subtopicIds: string[]
  practiceTaskIds: string[]
  interviewQuestionIds: string[]
  referenceLinkIds: string[]
  revisionPromptIds: string[]

  explainBackPrompt: string
  evaluationRubricId: string
  completionCriteria: string[]

  createdAt: string
  updatedAt: string
}
```

## Learning Mode Content Type

```ts
export type LearningModeContent = {
  summary: string
  mustKnow: string[]
  skipForNow: string[]
  practiceFocus: string[]
  passCriteria: string[]
}
```

## Code Example Type

```ts
export type CodeExample = {
  title: string
  language: "javascript" | "typescript" | "sql" | "python" | "text"
  code: string
  explanation: string
}
```

## Subtopic Type

```ts
export type Subtopic = {
  id: string
  topicId: string
  title: string
  slug: string
  summary: string
  order: number
  theory: string
  examples: CodeExample[]
  practiceTaskIds: string[]
  completionCriteria: string[]
}
```

## Practice Task Type

```ts
export type PracticeTask = {
  id: string
  topicId: string
  subtopicId?: string
  title: string
  slug: string
  difficulty: "easy" | "medium" | "hard"
  estimatedMinutes: number
  taskType:
    | "concept"
    | "coding"
    | "debugging"
    | "design"
    | "explain-back"
    | "revision"

  statement: string
  subtasks: PracticeSubtask[]
  problemStatementId?: string
  starterCode?: string
  solutionApproach?: string
  hints: string[]
  edgeCases: string[]
  completionCriteria: string[]
}
```

## Practice Subtask Type

```ts
export type PracticeSubtask = {
  id: string
  title: string
  description: string
  order: number
  isRequired: boolean
}
```

## Problem Statement Type

```ts
export type ProblemStatement = {
  id: string
  title: string
  slug: string
  source: "internal" | "leetcode" | "hackerrank" | "codechef" | "external"
  externalUrl?: string
  difficulty: "easy" | "medium" | "hard"
  topicIds: string[]
  statement: string
  examples: ProblemExample[]
  constraints: string[]
  expectedOutput?: string
  testCases: TestCase[]
}
```

## Problem Example Type

```ts
export type ProblemExample = {
  input: string
  output: string
  explanation: string
}
```

## Test Case Type

```ts
export type TestCase = {
  input: string
  expectedOutput: string
  isHidden: boolean
}
```

## Reference Link Type

```ts
export type ReferenceLink = {
  id: string
  title: string
  url: string
  sourceType:
    | "docs"
    | "youtube"
    | "article"
    | "github"
    | "leetcode"
    | "course"
    | "book"
    | "blog"
  topicIds: string[]
  priority: "primary" | "secondary" | "optional"
}
```

## Evaluation Rubric Type

```ts
export type EvaluationRubric = {
  id: string
  topicId?: string
  taskId?: string
  criteria: EvaluationCriterion[]
}
```

## Evaluation Criterion Type

```ts
export type EvaluationCriterion = {
  id: string
  title: string
  description: string
  maxScore: number
}
```

---

# 9. Local Mock Data Files

Create these files:

```txt
src/data/roadmaps.ts
src/data/domains.ts
src/data/categories.ts
src/data/modules.ts
src/data/topics.ts
src/data/subtopics.ts
src/data/practice-tasks.ts
src/data/problem-statements.ts
src/data/interview-questions.ts
src/data/reference-links.ts
src/data/revision-prompts.ts
src/data/evaluation-rubrics.ts
src/data/learning-graph.ts
```

## Mock Data Rules

- Use stable IDs.
- Use slugs for routes.
- Every child must reference valid parent ID.
- Every topic must have at least one practice task.
- Every topic must have at least one interview question.
- Every topic must have at least one reference link.
- Every practice task must have completion criteria.
- Every coding task should have starter code.
- Every problem statement should have examples and constraints.

## Example Topic ID Convention

```txt
js-closures
js-event-loop
js-promises
dsa-arrays
system-design-caching
aws-sqs
```

## Example Route Slug

```txt
closures
event-loop
promises
arrays
caching
sqs
```

---

# 10. Repository Layer

The UI must not permanently depend on direct imports from `src/data`.

Create repository interfaces.

## Roadmap Repository

```ts
export interface RoadmapRepository {
  getAllRoadmaps(): Promise<Roadmap[]>
  getActiveRoadmap(): Promise<Roadmap | null>
  getRoadmapById(id: string): Promise<Roadmap | null>
  getRoadmapTree(id: string): Promise<RoadmapTree | null>
}
```

## Topic Repository

```ts
export interface TopicRepository {
  getAllTopics(): Promise<Topic[]>
  getTopicById(id: string): Promise<Topic | null>
  getTopicBySlug(slug: string): Promise<Topic | null>
  getTopicsByModuleId(moduleId: string): Promise<Topic[]>
  getTopicContent(topicId: string): Promise<TopicContent | null>
  searchTopics(query: string): Promise<Topic[]>
}
```

## Practice Repository

```ts
export interface PracticeRepository {
  getAllTasks(): Promise<PracticeTask[]>
  getTaskById(id: string): Promise<PracticeTask | null>
  getTaskBySlug(slug: string): Promise<PracticeTask | null>
  getTasksByTopicId(topicId: string): Promise<PracticeTask[]>
  getTasksBySubtopicId(subtopicId: string): Promise<PracticeTask[]>
}
```

## Problem Repository

```ts
export interface ProblemRepository {
  getProblemById(id: string): Promise<ProblemStatement | null>
  getProblemsByTopicId(topicId: string): Promise<ProblemStatement[]>
  getProblemsByDifficulty(difficulty: "easy" | "medium" | "hard"): Promise<ProblemStatement[]>
}
```

## Reference Repository

```ts
export interface ReferenceRepository {
  getReferencesByTopicId(topicId: string): Promise<ReferenceLink[]>
  getPrimaryReferencesByTopicId(topicId: string): Promise<ReferenceLink[]>
}
```

---

# 11. Topic Content Retrieval

Create a topic content aggregation service.

File:

```txt
src/lib/services/topic-content-service.ts
```

Purpose:

Given a topic ID or slug, return the complete topic content needed by Topic Studio.

## TopicContent Type

```ts
export type TopicContent = {
  topic: Topic
  subtopics: Subtopic[]
  practiceTasks: PracticeTask[]
  problemStatements: ProblemStatement[]
  interviewQuestions: InterviewQuestion[]
  referenceLinks: ReferenceLink[]
  revisionPrompts: RevisionPrompt[]
  evaluationRubric: EvaluationRubric | null
  prerequisites: Topic[]
  relatedTopics: Topic[]
  advancedTopics: Topic[]
}
```

## Service Methods

```ts
export interface TopicContentService {
  getTopicContentById(topicId: string): Promise<TopicContent | null>
  getTopicContentBySlug(slug: string): Promise<TopicContent | null>
}
```

## Acceptance Criteria

- Topic Studio uses TopicContentService.
- Topic Studio receives full structured content.
- No component manually joins topic, tasks, questions, references, and rubrics.
- Missing topic returns a safe empty state.

---

# 12. Roadmap Tree Retrieval

Create roadmap tree service.

File:

```txt
src/lib/services/roadmap-tree-service.ts
```

Purpose:

Return the entire roadmap hierarchy for sidebar, roadmap browser, and learning graph.

## RoadmapTree Type

```ts
export type RoadmapTree = {
  roadmap: Roadmap
  domains: Array<{
    domain: Domain
    categories: Array<{
      category: Category
      modules: Array<{
        module: Module
        topics: Topic[]
      }>
    }>
  }>
}
```

## Methods

```ts
export interface RoadmapTreeService {
  getActiveRoadmapTree(): Promise<RoadmapTree | null>
  getRoadmapTreeById(roadmapId: string): Promise<RoadmapTree | null>
}
```

## Acceptance Criteria

- Learning graph can use roadmap tree data.
- Roadmap browser can display domains/categories/modules/topics.
- Dashboard can show current learning path from active roadmap.

---

# 13. Database Plan

## 13.1 Local DB First

After the static/mock repository version works, implement local DB.

Recommended:

```txt
SQLite + Prisma
```

Reason:

- Works locally
- Good schema visibility
- Good for Codex
- Easy seed script
- Easier future PostgreSQL migration

## 13.2 Prisma Schema

Create:

```txt
prisma/schema.prisma
```

Minimum models:

```prisma
model Roadmap {
  id                 String   @id
  title              String
  slug               String   @unique
  description        String
  targetRoles        String
  targetLevels       String
  targetCompanyTypes String
  estimatedWeeks     Int
  isActive           Boolean  @default(false)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  domains            Domain[]
}

model Domain {
  id          String   @id
  roadmapId   String
  title       String
  slug        String
  description String
  order       Int

  roadmap     Roadmap  @relation(fields: [roadmapId], references: [id])
  categories  Category[]

  @@unique([roadmapId, slug])
}

model Category {
  id          String   @id
  domainId    String
  title       String
  slug        String
  description String
  order       Int

  domain      Domain   @relation(fields: [domainId], references: [id])
  modules     LearningModule[]

  @@unique([domainId, slug])
}

model LearningModule {
  id          String   @id
  categoryId  String
  title       String
  slug        String
  description String
  order       Int

  category    Category @relation(fields: [categoryId], references: [id])
  topics      Topic[]

  @@unique([categoryId, slug])
}

model Topic {
  id                 String   @id
  moduleId           String
  title              String
  slug               String   @unique
  summary            String
  whyItMatters        String
  difficulty          String
  estimatedMinutes    Int
  tags               String
  roleRelevance       String
  companyRelevance    String
  interviewRelevance  Int
  theory             String
  mentalModel         String
  explanation         String
  productionUseCases  String
  commonMistakes      String
  explainBackPrompt   String
  completionCriteria  String
  evaluationRubricId  String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  module              LearningModule @relation(fields: [moduleId], references: [id])
  subtopics           Subtopic[]
  practiceTasks       PracticeTask[]
  interviewQuestions  InterviewQuestion[]
  referenceLinks      ReferenceLink[]
  revisionPrompts     RevisionPrompt[]
}

model TopicRelation {
  id             String @id
  sourceTopicId  String
  targetTopicId  String
  relationType   String

  @@index([sourceTopicId])
  @@index([targetTopicId])
}

model Subtopic {
  id                 String @id
  topicId            String
  title              String
  slug               String
  summary            String
  order              Int
  theory             String
  completionCriteria String

  topic              Topic @relation(fields: [topicId], references: [id])
  practiceTasks      PracticeTask[]

  @@unique([topicId, slug])
}

model PracticeTask {
  id                 String @id
  topicId            String
  subtopicId          String?
  title              String
  slug               String @unique
  difficulty          String
  estimatedMinutes    Int
  taskType            String
  statement           String
  starterCode         String?
  solutionApproach    String?
  hints               String
  edgeCases           String
  completionCriteria  String
  problemStatementId  String?

  topic              Topic @relation(fields: [topicId], references: [id])
  subtopic           Subtopic? @relation(fields: [subtopicId], references: [id])
  problemStatement   ProblemStatement? @relation(fields: [problemStatementId], references: [id])
  subtasks           PracticeSubtask[]
}

model PracticeSubtask {
  id             String @id
  practiceTaskId String
  title          String
  description    String
  order          Int
  isRequired     Boolean @default(true)

  practiceTask   PracticeTask @relation(fields: [practiceTaskId], references: [id])
}

model ProblemStatement {
  id             String @id
  title          String
  slug           String @unique
  source         String
  externalUrl    String?
  difficulty     String
  statement      String
  constraints    String
  expectedOutput String?

  practiceTasks  PracticeTask[]
  examples       ProblemExample[]
  testCases      TestCase[]
}

model ProblemExample {
  id                 String @id
  problemStatementId  String
  input              String
  output             String
  explanation        String

  problemStatement   ProblemStatement @relation(fields: [problemStatementId], references: [id])
}

model TestCase {
  id                 String @id
  problemStatementId  String
  input              String
  expectedOutput     String
  isHidden           Boolean @default(false)

  problemStatement   ProblemStatement @relation(fields: [problemStatementId], references: [id])
}

model InterviewQuestion {
  id       String @id
  topicId  String
  question String
  answer   String?
  level    String

  topic    Topic @relation(fields: [topicId], references: [id])
}

model ReferenceLink {
  id         String @id
  topicId    String
  title      String
  url        String
  sourceType String
  priority   String

  topic      Topic @relation(fields: [topicId], references: [id])
}

model RevisionPrompt {
  id        String @id
  topicId   String
  prompt    String
  frequency String

  topic     Topic @relation(fields: [topicId], references: [id])
}

model EvaluationRubric {
  id       String @id
  topicId  String?
  taskId   String?

  criteria EvaluationCriterion[]
}

model EvaluationCriterion {
  id          String @id
  rubricId    String
  title       String
  description String
  maxScore    Int

  rubric      EvaluationRubric @relation(fields: [rubricId], references: [id])
}

model UserProgress {
  id                       String   @id
  userId                   String
  completedTopicIds         String
  completedTaskIds          String
  weakAreas                 String
  streakCount               Int
  lastActiveDate            DateTime?
  readinessScore            Int
  interviewReadinessPercent Int
  createdAt                 DateTime @default(now())
  updatedAt                 DateTime @updatedAt
}
```

## 13.3 JSON Storage in DB

For early speed, fields like tags, targetRoles, completionCriteria, hints, and edgeCases can be stored as JSON strings in SQLite.

Later in PostgreSQL, these can become:

- `jsonb`
- join tables
- normalized tables

Do not over-normalize in MVP.

---

# 14. Seed Script Plan

Create:

```txt
prisma/seed.ts
```

The seed script should insert:

- 1 active roadmap
- 18 domains
- Key categories
- Key modules
- Initial topic set
- Initial subtopics
- Initial practice tasks
- Initial problem statements
- Initial interview questions
- Initial reference links
- Initial revision prompts
- Evaluation rubrics

## Required Seed Roadmap

```txt
Engineering Interview Readiness Roadmap
```

Target roles:

```txt
Senior Engineer
Lead Engineer
Staff Engineer
Solution Architect
```

Target companies:

```txt
FAANG
GCC
Indian Product Companies
Well-funded Startups
```

---

# 15. Fetching and Retrieval Flows

## 15.1 Dashboard Flow

Dashboard needs:

```txt
Active roadmap
Current topic
Today's mission
Progress state
Weak areas
Revision queue
Readiness score
```

Retrieval flow:

```txt
Dashboard
  -> DashboardService
    -> RoadmapTreeService
    -> TopicRepository
    -> PracticeRepository
    -> ProgressRepository
```

## 15.2 Learning Graph Flow

Learning Graph needs:

```txt
Active roadmap tree
Topic relationships
Progress state
```

Retrieval flow:

```txt
Graph Page
  -> RoadmapTreeService
  -> TopicRelationRepository
  -> ProgressRepository
```

## 15.3 Topic Studio Flow

Topic Studio needs complete topic content.

Retrieval flow:

```txt
/topics/[topicId or slug]
  -> TopicContentService
    -> TopicRepository
    -> SubtopicRepository
    -> PracticeRepository
    -> ProblemRepository
    -> InterviewQuestionRepository
    -> ReferenceRepository
    -> RevisionPromptRepository
    -> EvaluationRubricRepository
```

## 15.4 Practice Lab Flow

Practice Lab needs:

```txt
Practice task
Problem statement
Starter code
Hints
Edge cases
Evaluation rubric
Progress state
```

Retrieval flow:

```txt
/practice/[taskId or slug]
  -> PracticeContentService
    -> PracticeRepository
    -> ProblemRepository
    -> EvaluationRubricRepository
    -> ProgressRepository
```

---

# 16. Required Services

Create:

```txt
src/lib/services/dashboard-service.ts
src/lib/services/roadmap-tree-service.ts
src/lib/services/topic-content-service.ts
src/lib/services/practice-content-service.ts
src/lib/services/revision-service.ts
src/lib/services/readiness-score-service.ts
src/lib/services/search-service.ts
```

## DashboardService

Responsibilities:

- Get today's mission
- Get readiness score
- Get current learning path
- Get weak areas
- Get revision queue

## TopicContentService

Responsibilities:

- Fetch full topic content
- Aggregate topic data from multiple repositories
- Return safe null if topic is missing

## PracticeContentService

Responsibilities:

- Fetch task
- Fetch linked problem statement
- Fetch test cases
- Fetch rubric
- Fetch related topic

## SearchService

Responsibilities:

- Search roadmaps
- Search topics
- Search tasks
- Search references

---

# 17. UI Changes Required

## Dashboard

Should not use simple hardcoded cards long-term.

Dashboard must use DashboardService.

It must show:

- Today's Mission from roadmap/progress data
- Current Learning Path from active roadmap
- Weakest Areas from progress/evaluation data
- Revision Queue from revision prompts
- Readiness Score from scoring service

## Topic Studio

Topic Studio must use TopicContentService.

It should show:

- Topic
- Subtopics
- Practice tasks
- Problem statements
- Interview questions
- References
- Revision prompts
- Rubric
- Prerequisites
- Related topics
- Advanced topics

## Practice Lab

Practice Lab must use PracticeContentService.

It should show:

- Task
- Subtasks
- Problem statement
- Examples
- Constraints
- Hints
- Edge cases
- Starter code
- Evaluation panel

## Learning Graph

Learning Graph must use:

- RoadmapTreeService
- TopicRelation data
- Progress data

---

# 18. Codex Task Additions

Add these tasks to `CODEX_TASKS.md`.

---

## Phase 12 — Content System Types

### Task 12.1 — Add Roadmap and Content Types

Create:

```txt
src/types/roadmap.ts
src/types/category.ts
src/types/topic.ts
src/types/subtopic.ts
src/types/practice.ts
src/types/problem.ts
src/types/reference.ts
src/types/evaluation.ts
src/types/progress.ts
```

Add the type definitions from this file.

Acceptance criteria:

- All types compile.
- Types are exported.
- No duplicate conflicting types exist.

Test:

```bash
npm run typecheck
```

---

### Task 12.2 — Add Full Mock Content Files

Create:

```txt
src/data/roadmaps.ts
src/data/domains.ts
src/data/categories.ts
src/data/modules.ts
src/data/topics.ts
src/data/subtopics.ts
src/data/practice-tasks.ts
src/data/problem-statements.ts
src/data/interview-questions.ts
src/data/reference-links.ts
src/data/revision-prompts.ts
src/data/evaluation-rubrics.ts
src/data/learning-graph.ts
```

Acceptance criteria:

- At least 1 active roadmap exists.
- At least 18 domains exist.
- At least 20 topics exist across JavaScript, Node.js, DSA, System Design, DB, and AWS.
- Every topic has a valid parent module.
- Every practice task has a valid topic.
- Every coding task has starter code.
- Every topic has at least one interview question.
- Every topic has at least one reference link.

Test:

```bash
npm run typecheck
npm run build
```

---

## Phase 13 — Content Repositories

### Task 13.1 — Add Repository Interfaces

Create:

```txt
src/lib/repositories/roadmap-repository.ts
src/lib/repositories/category-repository.ts
src/lib/repositories/topic-repository.ts
src/lib/repositories/subtopic-repository.ts
src/lib/repositories/practice-repository.ts
src/lib/repositories/problem-repository.ts
src/lib/repositories/reference-repository.ts
src/lib/repositories/interview-question-repository.ts
src/lib/repositories/revision-prompt-repository.ts
src/lib/repositories/evaluation-rubric-repository.ts
```

Acceptance criteria:

- Interfaces are typed.
- No UI code depends on these yet.
- Typecheck passes.

Test:

```bash
npm run typecheck
```

---

### Task 13.2 — Add Mock Repository Implementations

Create mock implementations using `src/data`.

Acceptance criteria:

- Roadmap repository returns active roadmap.
- Topic repository can fetch by ID and slug.
- Practice repository can fetch by ID and slug.
- Problem repository can fetch linked problem statements.
- Reference repository can fetch topic references.

Test:

```bash
npm run typecheck
```

---

## Phase 14 — Content Aggregation Services

### Task 14.1 — Add TopicContentService

Create:

```txt
src/lib/services/topic-content-service.ts
```

Acceptance criteria:

- Can fetch topic content by ID.
- Can fetch topic content by slug.
- Returns topic, subtopics, tasks, problems, questions, references, revision prompts, rubric, prerequisites, related topics, and advanced topics.
- Returns null for missing topic.

Test:

```bash
npm run typecheck
```

---

### Task 14.2 — Add RoadmapTreeService

Create:

```txt
src/lib/services/roadmap-tree-service.ts
```

Acceptance criteria:

- Can fetch active roadmap tree.
- Tree includes domains, categories, modules, and topics.
- Topic order is stable.

Test:

```bash
npm run typecheck
```

---

### Task 14.3 — Add PracticeContentService

Create:

```txt
src/lib/services/practice-content-service.ts
```

Acceptance criteria:

- Can fetch task by ID or slug.
- Includes linked problem statement.
- Includes topic.
- Includes rubric if available.
- Returns null for missing task.

Test:

```bash
npm run typecheck
```

---

## Phase 15 — Connect UI to Content Services

### Task 15.1 — Refactor Topic Studio to Use TopicContentService

Acceptance criteria:

- Topic Studio no longer manually imports raw topic data.
- Topic Studio displays full topic content.
- Missing topic shows empty state.
- Existing route behavior still works.

Test:

```bash
npm run build
```

---

### Task 15.2 — Refactor Practice Lab to Use PracticeContentService

Acceptance criteria:

- Practice Lab no longer manually imports raw task data.
- Practice Lab displays subtasks, problem statement, hints, edge cases, and examples.
- Missing task shows empty state.

Test:

```bash
npm run build
```

---

### Task 15.3 — Refactor Dashboard to Use DashboardService

Create:

```txt
src/lib/services/dashboard-service.ts
```

Acceptance criteria:

- Dashboard data comes from roadmap/progress/topic/task repositories.
- Today's mission comes from active roadmap and progress.
- Weak areas come from progress.
- Revision queue comes from revision prompts.

Test:

```bash
npm run build
```

---

### Task 15.4 — Refactor Learning Graph to Use RoadmapTreeService

Acceptance criteria:

- Graph nodes are generated from active roadmap topics.
- Graph edges are generated from topic relations.
- Progress state affects node status.

Test:

```bash
npm run build
```

---

## Phase 16 — Local Database Setup

Start only after Phases 12–15 pass.

### Task 16.1 — Install Prisma and SQLite

Install:

```bash
npm install prisma @prisma/client
npx prisma init --datasource-provider sqlite
```

Acceptance criteria:

- `prisma/schema.prisma` exists.
- `.env` or `.env.local` contains local SQLite database URL.
- `.env.example` contains placeholder.
- `.env.local` is ignored by Git.

Test:

```bash
npx prisma validate
```

---

### Task 16.2 — Add Prisma Schema

Add the Prisma schema from this file.

Acceptance criteria:

- Schema validates.
- No relation errors.

Test:

```bash
npx prisma validate
```

---

### Task 16.3 — Create Initial Migration

Run:

```bash
npx prisma migrate dev --name init_EngineeringOS_content_schema
```

Acceptance criteria:

- SQLite database is created.
- Migration file exists.
- Prisma client generates.

Test:

```bash
npx prisma generate
```

---

### Task 16.4 — Add Seed Script

Create:

```txt
prisma/seed.ts
```

Seed:

- Active roadmap
- Domains
- Categories
- Modules
- Topics
- Subtopics
- Tasks
- Problems
- Questions
- References
- Rubrics

Acceptance criteria:

- Seed runs successfully.
- Database contains seeded data.
- No duplicate IDs.

Test:

```bash
npx prisma db seed
```

---

### Task 16.5 — Add Prisma Repository Implementations

Create:

```txt
src/lib/repositories/prisma-roadmap-repository.ts
src/lib/repositories/prisma-topic-repository.ts
src/lib/repositories/prisma-practice-repository.ts
src/lib/repositories/prisma-problem-repository.ts
```

Acceptance criteria:

- Repository interfaces remain unchanged.
- Prisma implementations satisfy interfaces.
- App can switch from mock repositories to Prisma repositories using config.

Test:

```bash
npm run typecheck
npm run build
```

---

# 19. Config Flags

Add config flags:

```ts
export const appConfig = {
  appName: "EngineeringOS",
  dataSource: "mock", // "mock" | "prisma" | "supabase"
  features: {
    enableAuth: false,
    enableRealAI: false,
    enableSupabase: false,
    enablePrisma: false,
    enableGithubSync: false,
    enableLeetCodeSync: false,
    enableBilling: false
  }
}
```

Rules:

- MVP starts with `dataSource: "mock"`.
- Prisma can be enabled later.
- Supabase comes after Prisma/local DB stabilizes.

---

# 20. Future Supabase/PostgreSQL Plan

Do not implement now.

When ready:

1. Convert SQLite schema to PostgreSQL-compatible schema.
2. Add Supabase project.
3. Add Supabase Auth.
4. Add user ownership fields.
5. Add row-level security.
6. Add progress per user.
7. Add topic content admin/editor workflow.
8. Add pgvector for semantic topic search later.

Future tables:

```txt
users
roadmaps
domains
categories
modules
topics
subtopics
practice_tasks
practice_subtasks
problem_statements
problem_examples
test_cases
interview_questions
reference_links
revision_prompts
evaluation_rubrics
evaluation_criteria
topic_relations
user_progress
user_topic_progress
user_task_progress
user_explain_back_attempts
ai_evaluations
```

---

# 21. AI Topic Generation Later

Do not build real AI generation in MVP.

Later, AI can help generate:

- Topic theory
- Mental models
- Practice tasks
- Interview questions
- Revision prompts
- Evaluation rubrics
- YouTube scripts
- Blog drafts

AI-generated content must be reviewed before saving.

Future flow:

```txt
User requests topic generation
  -> AI generates draft
  -> User reviews
  -> Save as draft topic
  -> Publish to roadmap
```

---

# 22. Non-Negotiable Rules for Codex

Codex must follow these rules:

1. Do not build real backend before local static and interactive app work.
2. Do not add Supabase before repository interfaces are stable.
3. Do not add OpenAI before mock evaluation works.
4. Do not hardcode API keys.
5. Do not put secrets in frontend code.
6. Do not work outside `engineering-os/projects/EngineeringOS/`.
7. Do not delete files without explicit approval.
8. Do not overbuild SaaS features early.
9. Do not skip type definitions.
10. Do not skip repository interfaces.
11. Do not make UI components manually join large data objects.
12. Use services for aggregation.
13. Use repositories for fetching.
14. Keep tasks small, executable, and testable.
15. Run lint/typecheck/build after meaningful changes.

---

# 23. Final Codex Instruction

Use this prompt when giving this file to Codex:

```txt
You are working inside engineering-os/projects/EngineeringOS/.

Do not build randomly.

First read:

- docs/PRD.md
- docs/UX_FLOW.md
- docs/MVP_SCOPE.md
- docs/BUILD_PLAN.md
- docs/CODEX_TASKS.md
- docs/CONTENT_DB_RETRIEVAL_PLAN.md

Your job is to implement EngineeringOS in the correct order.

Important:

The app must support structured roadmap/topic/content storage and retrieval.

Do not keep topics as simple hardcoded cards.

You must create:

- Roadmap hierarchy
- Categories
- Modules
- Topics
- Subtopics
- Practice tasks
- Subtasks
- Problem statements
- Interview questions
- References
- Revision prompts
- Evaluation rubrics
- Topic relations
- Repository interfaces
- Mock repository implementations
- Topic content service
- Roadmap tree service
- Practice content service
- Dashboard service

Build order:

1. Static mock content files
2. Repository interfaces
3. Mock repository implementations
4. Aggregation services
5. UI connected to services
6. Local progress
7. Local database with Prisma/SQLite
8. Prisma repositories
9. Supabase later, not now

Start with mock/local implementation.

Do not add Supabase, OpenAI, billing, auth, or deployment until the local prototype, content retrieval layer, and repository architecture work.

Execute tasks one at a time.
After each task, run the relevant test command.
Keep commits small.
```

---

# 24. Recommended File Name

Save this file as:

```txt
engineering-os/projects/EngineeringOS/docs/CONTENT_DB_RETRIEVAL_PLAN.md
```
