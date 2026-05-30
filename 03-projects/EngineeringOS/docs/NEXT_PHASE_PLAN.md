# EngineeringOS Next Phase Plan

## Recommended Next Phase

Phase 16B: Automated Test Setup.

Do not implement this phase without explicit approval.

## Current Phase 16A Outcome

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
- Additive Prisma persistence models in `prisma/schema.prisma`
- Repository interfaces and implementations for local persistence writes
- Service methods for topic/task completion, weak areas, revision queue, explain-back attempts, and evaluation results
- Server actions as the backend boundary for future UI write wiring
- Server-action forms wired into Topic Studio, Practice Lab, and Progress
- Fixed local user ID: `engineeringos-local-user`
- Applied local SQLite persistence schema via additive SQL and `prisma db execute`
- Verified Prisma persistence repositories against the local database
- Persistence forms with pending, success, and error feedback
- Read-only latest explain-back and mock evaluation history panels

Phase 13 verified that the existing UI can read through Prisma-backed repositories without changing page contracts. Phase 14 defined the future persistence write scope. Phase 15A added the non-destructive local persistence foundation. Phase 15B wired the UI to server actions in mock-default mode. Phase 15C safely applied the local schema and verified Prisma persistence without using `prisma migrate dev`. Phase 16A hardened the persistence UX without adding dependencies.

## Why Automated Tests Come Next

The next useful local-first step is adding an approved test setup for persistence flows. This should remain separate from Supabase or production backend work.

Candidate areas:

- Add approved test dependencies such as Vitest, React Testing Library, and jsdom.
- Add repository/service/component regression tests.
- Keep Prisma mode opt-in.

Supabase planning can happen later as a separate phase. Do not combine local Prisma schema additions and Supabase planning in one implementation pass.

## Required Phase 16B Work

- Keep `dataSource: "mock"` as the default.
- Keep Prisma mode opt-in only.
- Preserve seeded roadmap/topic/task content as read-only.
- Do not switch the default data source.
- Do not run destructive database commands.
- Do not add Supabase, OpenAI, auth, billing, deployment, or production database behavior.
- Do not add test dependencies without explicit approval.

## Risks

- Progress persistence needs automated regression coverage.
- Supabase design decisions should not leak into local SQLite implementation prematurely.
- Missing tests could let repository/provider wiring regress.

## Approval Needed

Before Phase 16B starts, request approval to:

- Add any test dependencies.
- Add automated repository, service, and component tests.
- Keep Supabase, OpenAI, auth, billing, and deployment out of scope unless separately approved.

## Future Prompt

Use this prompt when ready:

```txt
Implement Phase 16B: Automated Test Setup for EngineeringOS. Keep mock as the default data source, keep Prisma mode opt-in, add approved test tooling only after listing dependencies, add repository/service/component regression tests for persistence, and do not add Supabase, OpenAI, auth, billing, deployment, or paid infrastructure.
```
