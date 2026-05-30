# EngineeringOS Codex Tasks

## Execution Rules

Codex must follow these rules:

1. Work only inside `03-projects/EngineeringOS/`.
2. Use `EngineeringOS` as the product name everywhere.
3. Do not build real backend before local static and interactive app work.
4. Do not add Supabase before repository interfaces are stable.
5. Do not add OpenAI before mock evaluation works.
6. Do not hardcode API keys.
7. Do not put secrets in frontend code.
8. Do not delete files without explicit approval.
9. Do not overbuild SaaS features early.
10. Do not skip type definitions.
11. Do not skip repository interfaces.
12. Do not make UI components manually join large data objects.
13. Use services for aggregation.
14. Use repositories for fetching.
15. Keep tasks small, executable, and testable.
16. Run lint, typecheck, or build after meaningful implementation changes.

## Phase 0 - Planning Documentation

### Task 0.1 - Generate Missing Planning Docs

Create:

```txt
docs/PRD.md
docs/UX_FLOW.md
docs/MVP_SCOPE.md
docs/BUILD_PLAN.md
docs/CODEX_TASKS.md
```

Source of truth:

```txt
docs/CONTENT_DB_RETRIEVAL_PLAN.md
```

Acceptance criteria:

- All six docs exist.
- Generated docs preserve EngineeringOS product goals, user flows, MVP scope, build phases, topic/content retrieval architecture, repository architecture, roadmap hierarchy, DB strategy, Prisma/SQLite later, mock content system, service layer, progress tracking, practice lab, dashboard, learning graph, topic studio, and task breakdown.
- No UI or app code is created.
- No packages are installed.
- No project initialization is performed.

Verification:

```bash
ls docs
```

## Phase 1 - Project Setup And Source Verification

Start this only after Phase 0 docs are complete and the user explicitly asks for implementation.

Acceptance criteria:

- Verify current folder structure.
- Verify docs folder exists.
- Verify all docs exist:
  - `CONTENT_DB_RETRIEVAL_PLAN.md`
  - `PRD.md`
  - `UX_FLOW.md`
  - `MVP_SCOPE.md`
  - `BUILD_PLAN.md`
  - `CODEX_TASKS.md`
- Search for legacy product and folder naming references documented in the naming-correction request.
- Replace only within the approved project folder if found.
- Do not continue beyond Phase 1 until verification is complete.

## Phase 12 - Content System Types

### Task 12.1 - Add Roadmap And Content Types

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

Acceptance criteria:

- Roadmap, domain, category, module, topic, subtopic, practice, problem, reference, evaluation, and progress types exist.
- Topic type supports prerequisites, related topics, advanced topics, learning modes, theory, mental model, code examples, production use cases, mistakes, tasks, questions, references, revision prompts, explain-back prompt, rubric, and completion criteria.
- Types are exported.
- No duplicate conflicting types exist.

Test:

```bash
npm run typecheck
```

### Task 12.2 - Add Full Mock Content Files

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
- Every child references a valid parent ID.
- Every topic has a valid parent module.
- Every topic has at least one practice task.
- Every topic has at least one interview question.
- Every topic has at least one reference link.
- Every practice task has completion criteria.
- Every coding task has starter code.
- Every problem statement has examples and constraints.

Test:

```bash
npm run typecheck
npm run build
```

## Phase 13 - Content Repositories

### Task 13.1 - Add Repository Interfaces

Create:

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

Acceptance criteria:

- Interfaces are typed.
- UI code does not directly depend on mock data.
- Typecheck passes.

Test:

```bash
npm run typecheck
```

### Task 13.2 - Add Mock Repository Implementations

Create mock implementations using `src/data`.

Acceptance criteria:

- Roadmap repository returns active roadmap.
- Topic repository can fetch by ID and slug.
- Practice repository can fetch by ID and slug.
- Problem repository can fetch linked problem statements.
- Reference repository can fetch topic references.
- Progress repository supports local progress state.

Test:

```bash
npm run typecheck
```

## Phase 14 - Content Aggregation Services

### Task 14.1 - Add TopicContentService

Create:

```txt
src/lib/services/topic-content-service.ts
```

Acceptance criteria:

- Can fetch topic content by ID.
- Can fetch topic content by slug.
- Returns topic, subtopics, tasks, problems, questions, references, revision prompts, rubric, prerequisites, related topics, and advanced topics.
- Returns null for a missing topic.
- Topic Studio does not manually join large content objects.

Test:

```bash
npm run typecheck
```

### Task 14.2 - Add RoadmapTreeService

Create:

```txt
src/lib/services/roadmap-tree-service.ts
```

Acceptance criteria:

- Can fetch active roadmap tree.
- Can fetch roadmap tree by ID.
- Tree includes domains, categories, modules, and topics.
- Topic order is stable.
- Learning Graph can use roadmap tree data.
- Dashboard can show current learning path from active roadmap.

Test:

```bash
npm run typecheck
```

### Task 14.3 - Add PracticeContentService

Create:

```txt
src/lib/services/practice-content-service.ts
```

Acceptance criteria:

- Can fetch task by ID or slug.
- Includes linked problem statement.
- Includes examples, constraints, hints, edge cases, starter code, and subtasks.
- Includes related topic.
- Includes rubric if available.
- Returns null for missing task.

Test:

```bash
npm run typecheck
```

### Task 14.4 - Add Dashboard, Revision, Readiness, And Search Services

Create:

```txt
src/lib/services/dashboard-service.ts
src/lib/services/revision-service.ts
src/lib/services/readiness-score-service.ts
src/lib/services/search-service.ts
```

Acceptance criteria:

- Dashboard service returns today's mission, readiness score, current learning path, weak areas, and revision queue.
- Revision service returns relevant prompts.
- Readiness score service derives score from progress and evaluation data.
- Search service can search roadmaps, topics, tasks, and references.

Test:

```bash
npm run typecheck
```

## Phase 15 - Connect UI To Content Services

### Task 15.1 - Refactor Topic Studio To Use TopicContentService

Acceptance criteria:

- Topic Studio no longer manually imports raw topic data.
- Topic Studio displays full topic content.
- Missing topic shows empty state.
- Existing route behavior still works.

Test:

```bash
npm run build
```

### Task 15.2 - Refactor Practice Lab To Use PracticeContentService

Acceptance criteria:

- Practice Lab no longer manually imports raw task data.
- Practice Lab displays subtasks, problem statement, hints, edge cases, examples, starter code, and rubric.
- Missing task shows empty state.

Test:

```bash
npm run build
```

### Task 15.3 - Refactor Dashboard To Use DashboardService

Acceptance criteria:

- Dashboard data comes from roadmap, progress, topic, and task repositories.
- Today's mission comes from active roadmap and progress.
- Weak areas come from progress.
- Revision queue comes from revision prompts.

Test:

```bash
npm run build
```

### Task 15.4 - Refactor Learning Graph To Use RoadmapTreeService

Acceptance criteria:

- Graph nodes are generated from active roadmap topics.
- Graph edges are generated from topic relations.
- Progress state affects node status.

Test:

```bash
npm run build
```

## Phase 16 - Local Database Setup

Start only after Phases 12-15 pass.

### Task 16.1 - Install Prisma And SQLite

Install later:

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

### Task 16.2 - Add Prisma Schema

Add the Prisma schema from `CONTENT_DB_RETRIEVAL_PLAN.md`.

Minimum model areas:

- Roadmap
- Domain
- Category
- LearningModule
- Topic
- TopicRelation
- Subtopic
- PracticeTask
- PracticeSubtask
- ProblemStatement
- ProblemExample
- TestCase
- InterviewQuestion
- ReferenceLink
- RevisionPrompt
- EvaluationRubric
- EvaluationCriterion
- UserProgress

Acceptance criteria:

- Schema validates.
- No relation errors.
- SQLite-compatible JSON string fields are acceptable for early speed.

Test:

```bash
npx prisma validate
```

### Task 16.3 - Create Initial Migration

Run later:

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

### Task 16.4 - Add Seed Script

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
- Revision prompts
- Rubrics

Acceptance criteria:

- Seed runs successfully.
- Database contains seeded data.
- No duplicate IDs.

Test:

```bash
npx prisma db seed
```

### Task 16.5 - Add Prisma Repository Implementations

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

## Future Supabase/PostgreSQL Tasks

Do not implement now.

Future sequence:

1. Convert SQLite schema to PostgreSQL-compatible schema.
2. Add Supabase project.
3. Add Supabase Auth.
4. Add user ownership fields.
5. Add row-level security.
6. Add progress per user.
7. Add topic content admin/editor workflow.
8. Add pgvector for semantic topic search later.

## Future AI Topic Generation Tasks

Do not build real AI generation in MVP.

Later AI may generate drafts for:

- Topic theory
- Mental models
- Practice tasks
- Interview questions
- Revision prompts
- Evaluation rubrics
- YouTube scripts
- Blog drafts

AI-generated content must be reviewed before saving.
