# Phase 49 Database-backed Learner Profile

## Purpose

Phase 49 moves learner preferences from mock-only repository state toward database-backed learner profile persistence.

This keeps the app local-first while preparing for real authenticated user profiles later.

## Implemented

- Added Prisma `LearnerProfile` model.
- Added additive SQL migration: `20260531010000_add_learner_profile`.
- Added `PrismaLearnerPreferencesRepository`.
- Wired Prisma mode to use the Prisma learner preferences repository.
- Kept mock mode on the mock learner preferences repository.
- Added repository smoke coverage.

## Current Scope

- Local SQLite persistence is supported in Prisma mode.
- Mock mode remains default.
- Auth is still mock; the repository uses the current mock user ID.
- This is not production auth.

## Remaining Work

- Apply and verify the migration in every local/dev environment.
- Move production DB provider from SQLite to Postgres before beta.
- Add real auth and session-owned user IDs.
- Add user data export/delete policy.
- Add deployment migration strategy.
