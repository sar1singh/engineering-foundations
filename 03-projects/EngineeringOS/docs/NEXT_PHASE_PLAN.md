# EngineeringOS Next Phase Plan

## Recommended Next Phase

Phase 19: Persistence Route and Interaction Test Automation.

Do not implement this phase without explicit approval.

## Current Phase 18 Outcome

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
- Vitest and Testing Library configured
- Repository, service, and component smoke tests added
- `npm run test` available
- Expanded regression tests for persistence repositories, revision service, server actions, submit button, and completion forms
- Compact persistence history lists for explain-back attempts and mock evaluations
- Prisma-mode route smoke passed for dashboard, graph, topic, practice, progress, content, and settings

Phase 13 verified that the existing UI can read through Prisma-backed repositories without changing page contracts. Phase 14 defined the future persistence write scope. Phase 15A added the non-destructive local persistence foundation. Phase 15B wired the UI to server actions in mock-default mode. Phase 15C safely applied the local schema and verified Prisma persistence without using `prisma migrate dev`. Phase 16A hardened the persistence UX. Phase 16B added automated test tooling and first regression tests. Phase 17 expanded regression coverage across persistence paths. Phase 18 smoke-tested Prisma-mode UI routes and improved persistence history display.

## Why Route And Interaction Automation Comes Next

The next useful local-first step is automating route and interaction checks so Prisma-mode confidence is repeatable. This should remain separate from Supabase or production backend work.

Candidate areas:

- Add scripted route smoke checks for mock and Prisma modes.
- Add interaction-level tests for persistence forms where feasible.
- Add regression checks for history list rendering after saved records.
- Keep Prisma mode opt-in.

Supabase planning can happen later as a separate phase. Do not combine local Prisma schema additions and Supabase planning in one implementation pass.

## Required Phase 19 Work

- Keep `dataSource: "mock"` as the default.
- Keep Prisma mode opt-in only.
- Preserve seeded roadmap/topic/task content as read-only.
- Do not switch the default data source.
- Do not run destructive database commands.
- Do not add Supabase, OpenAI, auth, billing, deployment, or production database behavior.
- Do not add more test dependencies without explicit approval.

## Risks

- Route smoke checks are currently manual command snippets, not reusable scripts.
- Supabase design decisions should not leak into local SQLite implementation prematurely.
- Missing tests could let repository/provider wiring regress.

## Approval Needed

Before Phase 19 starts, request approval to:

- Add reusable smoke scripts or additional interaction test tooling if needed.
- Add automated mock/prisma route checks.
- Keep Supabase, OpenAI, auth, billing, and deployment out of scope unless separately approved.

## Future Prompt

Use this prompt when ready:

```txt
Implement Phase 19: Persistence Route and Interaction Test Automation for EngineeringOS. Keep mock as the default data source, keep Prisma mode opt-in, add reusable route smoke checks and interaction regression coverage, and do not add Supabase, OpenAI, auth, billing, deployment, or paid infrastructure.
```
