# EngineeringOS Next Phase Plan

## Recommended Next Phase

Phase 25: Continue Curriculum Content Depth Pass.

Do not implement this phase without explicit approval.

## Current Phase 24 Outcome

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
- Reusable route smoke scripts for mock and Prisma modes
- Persistence form interaction tests for explain-back, mock evaluation, and reset progress
- Persistence history empty states
- Settings copy clarifying mock default and local-only Prisma opt-in
- Audit findings triaged without automatic fixes
- Audit remediation decision documented
- Local MVP release checklist documented
- Local MVP checkpoint review documented
- Full local validation passed
- Mock and Prisma route smoke passed
- Guided next-step navigation added across core screens
- Content search suggestions added
- Local MVP polish notes documented
- Deeper JavaScript closures curriculum content
- A richer `implement-counter-with-closure` practice task and closure counter problem statement
- Focused service/search regression tests for the closures content slice

Phase 13 verified that the existing UI can read through Prisma-backed repositories without changing page contracts. Phase 14 defined the future persistence write scope. Phase 15A added the non-destructive local persistence foundation. Phase 15B wired the UI to server actions in mock-default mode. Phase 15C safely applied the local schema and verified Prisma persistence without using `prisma migrate dev`. Phase 16A hardened the persistence UX. Phase 16B added automated test tooling and first regression tests. Phase 17 expanded regression coverage across persistence paths. Phase 18 smoke-tested Prisma-mode UI routes and improved persistence history display. Phase 19 automated mock/prisma route smoke and added interaction tests. Phase 20 polished persistence copy/empty states and triaged npm audit findings. Phase 21 documented the audit remediation decision and local MVP release checklist. Phase 22 reviewed the release checklist and documented the local MVP checkpoint decision. Phase 23 improved local navigation continuity with guided next steps and content search suggestions. Phase 24 started the curriculum depth pass with JavaScript closures and the linked counter practice task.

## Why Continued Curriculum Content Depth Comes Next

The local MVP checkpoint now passes validation and has a clearer learning loop. Phase 24 proved the smallest useful pattern for curriculum depth: improve one topic slice, keep architecture unchanged, and add focused retrieval/search tests. The next useful local-first step is applying that same pattern to another high-signal topic.

Candidate areas:

- Expand `js-promises` or `js-event-loop` theory, mental models, common mistakes, and production use cases.
- Improve the linked practice task statement, hints, edge cases, and completion criteria.
- Improve linked problem examples, reference metadata, revision prompt, and interview question.
- Add focused tests for content retrieval and search assumptions touched by the slice.
- Keep dependency maintenance as a separate approval path if prioritized.
- Keep Prisma mode opt-in.

Supabase planning can happen later as a separate phase. Do not combine local Prisma schema additions and Supabase planning in one implementation pass.

## Required Phase 25 Work

- Keep `dataSource: "mock"` as the default.
- Keep Prisma mode opt-in only.
- Preserve seeded roadmap/topic/task content as read-only.
- Do not switch the default data source.
- Do not run destructive database commands.
- Do not add Supabase, OpenAI, auth, billing, deployment, or production database behavior.
- Do not change dependency versions without explicit approval.

## Risks

- Local MVP may still need copy/content polish before broader use.
- Audit remediation remains deferred unless separately approved.
- Supabase design decisions should not leak into local SQLite implementation prematurely.
- Local SQLite seed content may lag behind mock data until a safe, approved seed refresh path is chosen.
- Missing tests could let content retrieval or search regress.

## Approval Needed

Before Phase 25 starts, request approval to:

- Define the curriculum depth scope.
- Update seeded mock content.
- Add or update tests for changed behavior.
- Keep Supabase, OpenAI, auth, billing, and deployment out of scope unless separately approved.

## Future Prompt

Use this prompt when ready:

```txt
Implement Phase 25: Continue the Curriculum Content Depth Pass for EngineeringOS.

Choose one high-signal JavaScript topic, preferably js-promises or js-event-loop, and expand only that topic slice plus its linked practice task/problem/reference/revision/interview content. Keep mock as the default data source and Prisma opt-in only. Do not add Supabase, OpenAI, auth, billing, deployment, production database behavior, dependency changes, or destructive database/schema changes. Add focused service/search tests for the content retrieval assumptions touched by the change, run full validation and route smoke checks, and update docs with the exact scope completed.
```
