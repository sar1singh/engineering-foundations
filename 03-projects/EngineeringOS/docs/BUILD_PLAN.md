# EngineeringOS Build Plan

## Build Strategy

EngineeringOS must be built local-first:

```txt
Mock TypeScript data
  -> Repository interfaces
  -> Mock repository implementations
  -> Aggregation services
  -> UI connected to services
  -> Local progress
  -> SQLite + Prisma
  -> Prisma repositories
  -> Supabase/PostgreSQL later
```

Do not jump directly to Supabase, OpenAI, cloud auth, billing, or deployment.

## Phase 0 - Documentation And Verification

Goals:

- Confirm work is inside `03-projects/EngineeringOS/`.
- Confirm `docs/CONTENT_DB_RETRIEVAL_PLAN.md` exists.
- Create missing planning docs:
  - `PRD.md`
  - `UX_FLOW.md`
  - `MVP_SCOPE.md`
  - `BUILD_PLAN.md`
  - `CODEX_TASKS.md`
- Use `CONTENT_DB_RETRIEVAL_PLAN.md` as the source of truth.
- Do not create app code.
- Do not install packages.
- Do not initialize Next.js.

Acceptance criteria:

- All six docs exist in `03-projects/EngineeringOS/docs/`.
- Docs consistently use `EngineeringOS`.
- Docs preserve the local-first and repository-first architecture.

## Phase 1 - Local Static Content

Use TypeScript mock data files.

Required later implementation files:

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

Purpose:

- Fast development
- No backend dependency
- Easy Codex generation
- Easy manual editing
- Good static prototype

Rules:

- Use stable IDs.
- Use slugs for routes.
- Every child must reference a valid parent ID.
- Every topic must have at least one practice task.
- Every topic must have at least one interview question.
- Every topic must have at least one reference link.
- Every coding task should have starter code.
- Every problem statement should have examples and constraints.

## Phase 2 - Local Repository Layer

Create repository interfaces and mock implementations.

Required later implementation files:

```txt
src/lib/repositories/roadmap-repository.ts
src/lib/repositories/category-repository.ts
src/lib/repositories/topic-repository.ts
src/lib/repositories/subtopic-repository.ts
src/lib/repositories/practice-repository.ts
src/lib/repositories/problem-repository.ts
src/lib/repositories/reference-repository.ts
src/lib/repositories/progress-repository.ts
src/lib/repositories/interview-question-repository.ts
src/lib/repositories/revision-prompt-repository.ts
src/lib/repositories/evaluation-rubric-repository.ts
```

Purpose:

- UI does not directly depend on mock files.
- Future DB migration becomes easier.
- Supabase integration later can replace local repositories.
- Components do not manually join topic, task, question, reference, and rubric data.

## Phase 3 - Content Aggregation Services

Create services that compose repository data for UI features.

Required later implementation files:

```txt
src/lib/services/dashboard-service.ts
src/lib/services/roadmap-tree-service.ts
src/lib/services/topic-content-service.ts
src/lib/services/practice-content-service.ts
src/lib/services/revision-service.ts
src/lib/services/readiness-score-service.ts
src/lib/services/search-service.ts
```

Core services:

- `DashboardService`: today's mission, readiness score, current path, weak areas, revision queue.
- `RoadmapTreeService`: active roadmap hierarchy for sidebar, roadmap browser, dashboard, and graph.
- `TopicContentService`: full Topic Studio content by topic ID or slug.
- `PracticeContentService`: full Practice Lab content by task ID or slug.
- `SearchService`: roadmaps, topics, tasks, and references.

Acceptance criteria:

- Topic Studio uses `TopicContentService`.
- Practice Lab uses `PracticeContentService`.
- Dashboard uses `DashboardService`.
- Learning Graph uses `RoadmapTreeService`.
- Missing topic or task returns a safe empty state.

## Phase 4 - UI Connected To Services

After mock data, repositories, and services are stable, connect UI areas to services.

Dashboard:

- Today's Mission from roadmap/progress data
- Current Learning Path from active roadmap
- Weakest Areas from progress/evaluation data
- Revision Queue from revision prompts
- Readiness Score from scoring service

Topic Studio:

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

Practice Lab:

- Task
- Subtasks
- Problem statement
- Examples
- Constraints
- Hints
- Edge cases
- Starter code
- Evaluation panel

Learning Graph:

- Active roadmap tree
- Topic relation edges
- Progress state

## Phase 5 - Local Progress

Progress should remain local during the MVP.

Track:

- Completed topics
- Completed tasks
- Weak areas
- Streak count
- Last active date
- Readiness score
- Interview readiness percent

Progress repositories should be designed so they can later move from local/mock storage to SQLite/Prisma and then Supabase/PostgreSQL.

## Phase 6 - Local Persistent DB

Start only after static content, repositories, services, and service-connected UI work.

Preferred local DB:

```txt
SQLite + Prisma
```

Reason:

- Easy local setup
- Strong schema visibility
- Migration support
- Easy seed script
- Future PostgreSQL migration is easier

Required later implementation files:

```txt
prisma/schema.prisma
prisma/seed.ts
src/lib/db/prisma.ts
src/lib/repositories/prisma-roadmap-repository.ts
src/lib/repositories/prisma-topic-repository.ts
src/lib/repositories/prisma-practice-repository.ts
src/lib/repositories/prisma-problem-repository.ts
```

SQLite JSON string fields are acceptable for early speed. Later PostgreSQL can use `jsonb`, join tables, or normalized tables.

## Phase 7 - Supabase/PostgreSQL Migration

Do not implement until local DB works.

Future steps:

1. Convert SQLite schema to PostgreSQL-compatible schema.
2. Add Supabase project.
3. Add Supabase Auth.
4. Add user ownership fields.
5. Add row-level security.
6. Add progress per user.
7. Add topic content admin/editor workflow.
8. Add pgvector for semantic topic search later.

## Config Strategy

Use config flags later:

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
