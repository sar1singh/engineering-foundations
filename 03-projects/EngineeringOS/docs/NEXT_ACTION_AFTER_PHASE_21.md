# EngineeringOS Current-State Audit After Phase 21

## Audit Date

2026-05-31

## Current State Summary

EngineeringOS is a Next.js App Router application with TypeScript, Tailwind CSS, ESLint, Vitest, Testing Library, Prisma, and local SQLite support.

The repo is no longer only at Phase 21. Documentation and code show that Phase 22 and Phase 23 work are present:

- Phase 21 documented the npm audit remediation decision and local MVP release checklist.
- Phase 22 validated the local MVP checkpoint with full validation and route smoke checks.
- Phase 23 added local MVP polish: reusable guided next-step navigation, guided next steps across core screens, content search suggestions, and regression tests.

The default app behavior remains mock/local. Prisma remains opt-in through `NEXT_PUBLIC_ENGINEERINGOS_DATA_SOURCE=prisma`.

## Repo Surface Reviewed

- Framework: Next.js App Router under `src/app`.
- Routes: `/`, `/dashboard`, `/graph`, `/topics/[topicId]`, `/practice/[taskId]`, `/progress`, `/content`, `/settings`.
- Components: app shell components, persistence form/history components, and learning guidance components.
- Server actions: progress actions in `src/lib/actions/progress-actions.ts`.
- Services: dashboard, roadmap tree, topic content, practice content, progress summary, revision, readiness, and search services.
- Repositories: mock and Prisma repository implementations behind repository interfaces.
- Prisma: SQLite schema in `prisma/schema.prisma`, migrations, local `dev.db`, and seed script.
- Tests: Vitest unit/component tests plus mock and Prisma route smoke scripts.
- Planning docs: `README.md`, `docs/IMPLEMENTATION_STATUS.md`, `docs/NEXT_PHASE_PLAN.md`, `docs/LOCAL_DATABASE.md`, `docs/AUDIT_REMEDIATION_DECISION.md`, `docs/LOCAL_MVP_CHECKPOINT_REVIEW.md`, `docs/LOCAL_MVP_POLISH_NOTES.md`, `docs/BUILD_PLAN.md`, `docs/MVP_SCOPE.md`, `docs/PRD.md`, and `docs/UX_FLOW.md`.

## Validation Results

`node_modules` exists, so `npm install` was not run.

| Command | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm run test` | Passed: 11 test files, 31 tests |
| `npm run build` | Passed |
| `npm run smoke:mock` | Passed: all 7 core routes returned 200 |
| `npm run smoke:prisma` | Passed: all 7 core routes returned 200 |

## Issues Found

- No validation-blocking issues were found.
- The current docs are mildly confusing if read from a strict "after Phase 21" prompt because the repo already includes Phase 22 and Phase 23 artifacts.
- Existing deferred risks remain: moderate npm audit findings, avoided `prisma migrate dev` on this Windows/Node setup, representative rather than curriculum-grade content, no real AI/auth/cloud/billing/deployment.

## Fixes Applied

No code fixes were applied. Validation passed without requiring behavior changes.

## Tests Added or Updated

No tests were added or updated during this audit because no regression or uncovered bug was identified.

## Phase 21 Status

Phase 21 appears complete. It produced:

- `docs/AUDIT_REMEDIATION_DECISION.md`
- `docs/LOCAL_MVP_RELEASE_CHECKLIST.md`
- implementation status and local database documentation updates

Phase 21 intentionally did not change dependency versions or apply automatic audit fixes.

## Recommended Next Action Item

Highest-ROI next action: Phase 24 - Curriculum Content Depth Pass.

Reasoning:

- Stabilization checks are currently green.
- The local MVP workflow is already connected and smoke-tested.
- The biggest product gap is content depth, not architecture.
- This work can stay small, local-first, testable, and mock-default.
- Dependency remediation should remain a separate explicit dependency-maintenance phase because the current audit decision documents unsafe automatic fixes.

## Exact Next Codex Task

```txt
Implement Phase 24: Curriculum Content Depth Pass for EngineeringOS.

Keep mock as the default data source and Prisma opt-in only. Do not add Supabase, OpenAI, auth, billing, deployment, production database behavior, dependency changes, or destructive database/schema changes.

Start with the JavaScript closures topic and its linked practice task. Expand seeded mock content only where it improves the existing Topic Studio, Practice Lab, Content search, and Progress learning loop. Add or update focused tests for content retrieval/search assumptions touched by the change. Run npm run lint, npm run typecheck, npm run test, npm run build, and route smoke checks after the change. Update docs with the exact content scope completed and any remaining gaps.
```

## Files Likely To Change Next

- `src/data/topics.ts`
- `src/data/subtopics.ts`
- `src/data/practice-tasks.ts`
- `src/data/problem-statements.ts`
- `src/data/reference-links.ts`
- `src/data/revision-prompts.ts`
- `src/lib/services/search-service.test.ts` or a new focused service/content test
- `docs/IMPLEMENTATION_STATUS.md`
- `docs/NEXT_PHASE_PLAN.md`
- `docs/LOCAL_DATABASE.md` or a new Phase 24 note

## Tests Required Next

- Content retrieval still returns the expanded topic and practice task.
- Search suggestions/results still surface the expanded topic and linked practice task.
- Existing persistence and route smoke tests continue to pass.

## Risks and Assumptions

- The working tree already contains modified and untracked EngineeringOS files; preserve that work and avoid broad refactors.
- Prisma migration commands should remain avoided unless explicitly approved.
- Audit remediation remains deferred by design.
- Curriculum expansion should not alter the repository/provider architecture.
- Representative content may still need multiple passes before it is curriculum-grade.

## Suggested Commit Message

```txt
docs: audit EngineeringOS current state after phase 21
```
