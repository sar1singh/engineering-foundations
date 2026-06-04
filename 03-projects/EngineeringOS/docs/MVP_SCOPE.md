# EngineeringOS MVP Scope

> Superseded by revised MVP strategy: use `docs/BETA_MVP_STRATEGY.md` as the current MVP source of truth. This file preserves useful historical local-first architecture and content-scope context.

## MVP Summary

The EngineeringOS MVP is a local-first Career Transformation Operating System for Engineers. The MVP must prove one complete guided beta path from current Senior/Lead backend engineer state toward Solution Architect, Staff-level, Engineering Manager, FAANG-level readiness, and a 70-80+ LPA product/GCC outcome.

The MVP starts from content, guided journey, syllabus quality, roadmap quality, capability modeling, daily missions, and readiness scoring. Mock TypeScript data, SQLite, Prisma, and service-driven architecture are implementation tools, not the product center.

## In Scope

### Product Experience

- Today's Mission first experience
- Capability graph
- Role roadmap projection
- Learning graph
- Topic Studio
- Practice Lab
- Local progress tracking
- Topic readiness scoring
- Interview readiness tracking
- Offer readiness tracking
- Local code execution
- Mock AI evaluation
- Search across roadmap content

### Content System

EngineeringOS must store and retrieve:

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

### Required Roadmap Hierarchy

```txt
Target Role
  Capability
    Skill
      Topic
        Task
          Proof of Competency
```

Roadmaps are projections from the Master Syllabus, not independent content forks.

### Required Initial Domains

The MVP should seed at least:

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

### Required Topic Seeds

The MVP should include representative topics across:

- JavaScript Fundamentals, Scope, Execution Context, Lexical Environment, Closures, Hoisting, this binding, Prototypes, Event Loop, Callbacks, Promises, Async/Await, Error Handling, Memory Management, Garbage Collection, Modules
- Node.js Runtime, Event Loop in Node.js, libuv, Streams, Buffers, Express Basics, Middleware, Error Handling, Authentication, Rate Limiting, Background Jobs
- Arrays, Strings, Hash Maps, Two Pointers, Sliding Window, Stack, Queue, Linked List, Binary Search, Trees, Graphs, Recursion, Dynamic Programming Basics
- Scalability Basics, Load Balancing, Caching, Database Indexing, Replication, Sharding, Queues, Rate Limiting, CDN, Observability, Design URL Shortener, Design WhatsApp, Design Instagram Feed, Design Payment System
- SQL Basics, PostgreSQL Basics, Indexes, Transactions, Isolation Levels, Joins, Query Planning, MongoDB Basics, Document Modeling, Consistency Tradeoffs
- IAM, VPC Basics, EC2, Lambda, S3, API Gateway, SQS, SNS, DynamoDB, RDS, CloudWatch, Step Functions, Well-Architected Framework

## Architecture Scope

### Mock Content System

Create TypeScript mock data files later during implementation:

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

Mock data rules:

- Use stable IDs.
- Use slugs for routes.
- Every child must reference a valid parent ID.
- Every topic must have at least one practice task.
- Every topic must have at least one interview question.
- Every topic must have at least one reference link.
- Every practice task must have completion criteria.
- Every coding task should have starter code.
- Every problem statement should have examples and constraints.

### Repository Layer

The UI must not directly depend on mock files long-term.

Repository interfaces must cover:

- Roadmaps
- Categories
- Topics
- Subtopics
- Practice tasks
- Problem statements
- References
- Progress
- Interview questions
- Revision prompts
- Evaluation rubrics

### Service Layer

Services must aggregate repository data for the UI:

- `DashboardService`
- `RoadmapTreeService`
- `TopicContentService`
- `PracticeContentService`
- `RevisionService`
- `ReadinessScoreService`
- `SearchService`

## Later Local DB Scope

After the static/mock repository version works, add local persistence:

- SQLite
- Prisma ORM
- `prisma/schema.prisma`
- `prisma/seed.ts`
- Prisma repository implementations
- Config switch from mock repositories to Prisma repositories

Fields such as tags, target roles, completion criteria, hints, and edge cases may be stored as JSON strings in SQLite for early speed. Do not over-normalize in the MVP.

## Future Scope, Not MVP

Do not implement now:

- Supabase
- PostgreSQL production migration
- Supabase Auth
- Row-level security
- pgvector
- User-specific cloud progress
- Real OpenAI topic generation
- Billing
- Deployment
- GitHub sync
- LeetCode sync

Future AI topic generation may create drafts for topic theory, mental models, practice tasks, interview questions, revision prompts, evaluation rubrics, YouTube scripts, and blog drafts. AI-generated content must be reviewed before saving.

## MVP Acceptance Criteria

- EngineeringOS uses structured roadmap/topic/content storage and retrieval.
- Topics are not simple hardcoded UI cards.
- The app can retrieve complete Topic Studio content through a service.
- The app can retrieve complete Practice Lab content through a service.
- The dashboard uses service-level data.
- The learning graph uses roadmap tree and topic relation data.
- Progress can be tracked locally.
- The system can later switch from mock repositories to Prisma repositories without changing UI contracts.
