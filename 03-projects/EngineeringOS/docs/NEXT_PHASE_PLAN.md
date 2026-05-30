# EngineeringOS Next Phase Plan

## Recommended Next Phase

Phase 15: Prisma Persistence Schema Additions.

Do not implement this phase without explicit approval.

## Current Phase 14 Outcome

EngineeringOS now has:

- Structured mock content
- Repository interfaces
- Mock repository implementations
- Aggregation services
- Backend-ready provider wiring
- UI pages consuming services
- Local Prisma + SQLite schema
- Seeded local Prisma data
- Prisma repository implementations
- Opt-in Prisma read mode through `NEXT_PUBLIC_ENGINEERINGOS_DATA_SOURCE=prisma`
- Mock mode as the default data source
- A documented local persistence plan in `docs/PRISMA_PERSISTENCE_PLAN.md`

Phase 13 verified that the existing UI can read through Prisma-backed repositories without changing page contracts. Phase 14 defined the future persistence write scope without implementing writes. Progress remains local/mock-backed and is not written to Prisma yet.

## Why Prisma Schema Additions Come Next

The next useful local-first step is adding the approved Prisma schema models for durable local progress. This should be planned and implemented separately from Supabase or production backend work.

Candidate schema areas:

- `UserTopicProgress`
- `UserTaskProgress`
- `ExplainBackAttempt`
- `AIEvaluationResult`
- `RevisionQueueItem`
- `UserWeakArea`

Supabase planning can happen later as a separate phase. Do not combine local Prisma schema additions and Supabase planning in one implementation pass.

## Required Phase 15 Work

- Keep `dataSource: "mock"` as the default.
- Keep Prisma mode opt-in only.
- Add only approved local persistence models.
- Preserve seeded roadmap/topic/task content as read-only.
- Do not implement UI writes yet.
- Do not switch the default data source.
- Do not run destructive database commands.
- Keep progress local storage/mock-backed unless explicitly moved into Prisma.

## Risks

- Schema changes can accidentally imply write behavior before repositories and services are approved.
- Progress persistence needs clear ownership between local storage, mock repositories, and Prisma.
- Supabase design decisions should not leak into local SQLite implementation prematurely.
- Missing transaction/error rules could make later sync harder.
- The previous Windows/Node Prisma schema-engine issue means migration commands require explicit approval and a safe fallback plan.

## Approval Needed

Before Phase 15 starts, request approval to:

- Modify `prisma/schema.prisma`.
- Create or apply a new local migration.
- Generate Prisma Client after schema changes.
- Update docs for the new schema.
- Keep Supabase, OpenAI, auth, billing, and deployment out of scope unless separately approved.

## Future Prompt

Use this prompt when ready:

```txt
Implement Phase 15: Prisma Persistence Schema Additions for EngineeringOS. Keep mock as the default data source, keep Prisma mode opt-in, add only the approved local persistence schema models from PRISMA_PERSISTENCE_PLAN.md, and do not implement UI writes, Supabase, OpenAI, auth, billing, deployment, or paid infrastructure.
```
