# EngineeringOS Local Database

## Purpose

EngineeringOS uses Prisma + SQLite in Phase 12 to validate the structured content model locally before any production backend exists.

This is not the production backend. Supabase Postgres remains the future production candidate, and Vercel remains the future deployment candidate. No Supabase, Vercel, OpenAI, auth, billing, cloud database, or paid infrastructure is required for this phase.

## Why SQLite + Prisma

- Validates roadmap/content relationships locally.
- Gives the project a real schema before a SaaS backend.
- Keeps development fast and offline-friendly.
- Preserves the repository interface boundary already used by the app.
- Makes a later PostgreSQL/Supabase migration easier.

## Files

- `prisma/schema.prisma`: SQLite-compatible content schema.
- `prisma/migrations/20260530000000_init_engineeringos_content_schema/migration.sql`: initial local schema SQL.
- `prisma/seed.ts`: idempotent seed script using existing mock data.
- `src/lib/db/prisma.ts`: server-side Prisma Client singleton.
- `src/lib/repositories/prisma-*.ts`: Prisma-backed repository implementations.

## Commands

Install dependencies:

```bash
npm install @prisma/client@5.22.0
npm install -D prisma@5.22.0 tsx
```

Validate schema:

```bash
npx prisma validate
```

Generate Prisma Client:

```bash
npx prisma generate
```

Apply the local schema:

```bash
npx prisma migrate dev --name init_engineeringos_content_schema
```

If the local Prisma schema engine fails on Windows/Node compatibility, the checked-in migration SQL can be applied locally with:

```bash
npx prisma db execute --file prisma/migrations/20260530000000_init_engineeringos_content_schema/migration.sql --schema prisma/schema.prisma
```

Seed local data:

```bash
npx prisma db seed
```

## Mock Data vs Prisma Data

Mock data remains the default app data source. Prisma data exists to validate schema and future repository behavior.

Current default:

```ts
dataSource: "mock"
```

Phase 13 adds an opt-in local Prisma read mode without changing the default.

Enable Prisma-backed reads locally with:

```powershell
$env:NEXT_PUBLIC_ENGINEERINGOS_DATA_SOURCE="prisma"
npm run dev
```

For a one-off Prisma-mode build:

```powershell
$env:NEXT_PUBLIC_ENGINEERINGOS_DATA_SOURCE="prisma"
npm run build
```

The env value is intentionally public and non-sensitive. Supported values are:

- `mock`
- `prisma`

Missing or invalid values fall back to `mock`.

## Phase 13 Read-only Boundary

- Prisma mode is opt-in only.
- Mock mode remains stable and default.
- Prisma repositories are selected through `appServices`; React components do not import Prisma directly.
- Prisma read failures return safe null or empty collection fallbacks through provider wiring so pages can render useful empty states instead of crashing.
- Progress still uses local/mock-backed behavior and is not written to Prisma yet.
- No Supabase, OpenAI, auth, billing, deployment, production database, or cloud infrastructure is part of this phase.

The next phase should choose either local Prisma write/persistence planning or Supabase planning. Do not combine both in one phase.

## Phase 14 Persistence Planning

Phase 14 is documentation-only. It defines local Prisma persistence scope in `docs/PRISMA_PERSISTENCE_PLAN.md` without changing the schema, running migrations, or adding write behavior.

Planned Prisma writes for later approval:

- User progress.
- Topic completion.
- Task completion.
- Explain-back attempts.
- Mock AI evaluations.
- Weak area updates.
- Revision queue updates.

Seeded curriculum content should remain read-only for now:

- Roadmaps.
- Domains, categories, and modules.
- Topics and subtopics.
- Practice tasks and subtasks.
- Problem statements and test cases.
- Interview questions.
- Reference links.
- Revision prompts.
- Evaluation rubrics.

Documented future schema gaps:

- `UserTopicProgress`
- `UserTaskProgress`
- `ExplainBackAttempt`
- `AIEvaluationResult`
- `RevisionQueueItem`
- `UserWeakArea`

The recommended next phase is Phase 15: Prisma Persistence Schema Additions. Phase 15 should add approved local schema models only. It should not implement UI writes, Supabase, OpenAI, auth, billing, deployment, or production database behavior.

## Phase 15A Local Persistence Foundation

Phase 15A added the non-destructive persistence foundation:

- Additive Prisma schema models for local user persistence.
- Write-ready repository interfaces.
- Mock and Prisma persistence repository implementations.
- Service methods for local progress operations.
- Server actions as the future UI write boundary.
- Fixed local user ID: `engineeringos-local-user`.

Phase 15A did not:

- Change the default data source.
- Run migrations.
- Run destructive database commands.
- Add Supabase.
- Add auth.
- Add OpenAI.
- Add billing.
- Add deployment.
- Add production database behavior.

New schema models are present in `prisma/schema.prisma`, but the local SQLite database will not contain those tables until an approved Phase 15B schema application step runs.

## Phase 15B Persistence UI Wiring

Phase 15B wired the persistence foundation into the UI with server-action forms:

- Topic Studio can mark a topic complete.
- Topic Studio can save an explain-back attempt.
- Practice Lab can mark a task complete.
- Practice Lab can save a mock evaluation note.
- Progress can reset local progress.

These actions use the existing UI -> server action -> service -> repository flow. React components still do not import Prisma directly.

Phase 15B did not:

- Change the default data source.
- Run migrations.
- Run destructive database commands.
- Add Supabase.
- Add auth.
- Add OpenAI.
- Add billing.
- Add deployment.
- Add production database behavior.

The recommended next phase is Phase 15C: Safe Local Schema Application + Persistence Verification.

## Phase 15C Safe Schema Application

Phase 15C safely applied the local persistence schema to SQLite.

Applied file:

```txt
prisma/migrations/20260530010000_add_local_persistence_foundation/migration.sql
```

Application command:

```bash
npx prisma db execute --file prisma/migrations/20260530010000_add_local_persistence_foundation/migration.sql --schema prisma/schema.prisma
```

Verification:

- `npx prisma validate`: passed.
- `npx prisma migrate diff --from-url "file:./prisma/dev.db" --to-schema-datamodel prisma/schema.prisma --script`: returned an empty migration after application.
- `npx prisma generate`: passed.
- Prisma persistence repository checks passed for topic completion, task completion, weak areas, revision queue, explain-back attempts, and mock evaluation results.
- Default mock-mode build passed.
- Prisma-mode build passed.

`prisma migrate dev` was not used because of the previously documented Windows/Node schema-engine issue.

The next recommended phase is Phase 16: Persistence UX Hardening + Automated Test Setup.

## Phase 16A Persistence UX Hardening

Phase 16A hardened the persistence UI without adding dependencies:

- Replaced plain persistence forms with client components using `useActionState`.
- Added pending labels for write actions.
- Added accessible success/error feedback with `aria-live`.
- Added a latest explain-back attempt panel in Topic Studio.
- Added a latest mock evaluation panel in Practice Lab.
- Kept all writes flowing through server actions, services, and repositories.

No test dependencies were added. Automated test setup is pending explicit approval for the dependency list.

## Phase 16B Automated Test Setup

Phase 16B added automated test tooling:

- `vitest`
- `@vitejs/plugin-react`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `jsdom`

Added test command:

```bash
npm run test
```

Initial coverage:

- Mock progress repository idempotency and reset behavior.
- Progress summary service updates after topic/task completion.
- Persistence action message rendering.

## Phase 17 Persistence Regression Expansion

Phase 17 expanded automated persistence coverage:

- Mock explain-back repository save/read behavior.
- Mock evaluation result repository save/read behavior.
- Mock revision queue update, complete, and defer behavior.
- Revision service persisted queue behavior.
- Server-action success and error paths with mocked services.
- Submit button enabled/disabled behavior.
- Topic and task completion form states.

Validation:

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

`npm install` reported 4 moderate audit vulnerabilities. No automatic audit fix was run because dependency rewrites should be approved separately.

## Safety Notes

- Do not commit `.env`, `.env.local`, or real secrets.
- `.env.example` may contain only safe local placeholders.
- Do not point `DATABASE_URL` at production.
- Do not run destructive reset commands without approval.
- Do not run schema changes or migrations without approval.
- Do not add Supabase yet.
- Do not deploy.
- Do not add OpenAI or real auth in this phase.
