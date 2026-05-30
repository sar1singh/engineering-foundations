# EngineeringOS Next Phase Plan

## Recommended Next Phase

Phase 14: Prisma Write/Persistence Planning.

Do not implement this phase without explicit approval.

## Current Phase 13 Outcome

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

Phase 13 verified that the existing UI can read through Prisma-backed repositories without changing page contracts. Progress remains local/mock-backed and is not written to Prisma yet.

## Why Prisma Write Planning Comes Next

The next useful local-first step is deciding which user actions should persist to SQLite before implementing writes. This should be planned separately from Supabase or production backend work.

Candidate planning areas:

- Progress write ownership and local persistence rules.
- Practice task completion and readiness score update flow.
- Revision queue state changes.
- Topic notes or bookmarks, if they remain in scope.
- Repository write interface naming and error handling.
- Migration path from local SQLite persistence to future Supabase/PostgreSQL.

Supabase planning can happen later as a separate phase. Do not combine local Prisma write work and Supabase planning in one implementation pass.

## Required Phase 14 Planning Work

- Keep `dataSource: "mock"` as the default.
- Keep Prisma mode opt-in only.
- Decide exactly which write paths are allowed locally.
- Preserve read-only UI safety until write scope is approved.
- Define write repository interfaces before adding Prisma write implementation.
- Keep progress local storage/mock-backed unless explicitly moved into Prisma.

## Risks

- Local writes can blur the current read-only safety boundary.
- Progress persistence needs clear ownership between local storage, mock repositories, and Prisma.
- Supabase design decisions should not leak into local SQLite implementation prematurely.
- Missing transaction/error rules could make later sync harder.

## Approval Needed

Before Phase 14 starts, request approval to:

- Plan local Prisma write scope.
- Update repository interfaces for approved write operations.
- Implement only the approved local persistence path.
- Keep Supabase, OpenAI, auth, billing, and deployment out of scope unless separately approved.

## Future Prompt

Use this prompt when ready:

```txt
Implement Phase 14: Prisma Write/Persistence Planning for EngineeringOS. Keep mock as the default data source, keep Prisma mode opt-in, define the approved local write scope before coding, and do not add Supabase, OpenAI, auth, billing, deployment, or paid infrastructure.
```
