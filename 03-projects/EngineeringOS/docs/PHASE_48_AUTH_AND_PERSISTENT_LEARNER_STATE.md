# Phase 48 Auth and Persistent Learner State

## Purpose

Phase 48 moves onboarding preferences and learner state toward a real user profile and repository boundary.

This is a bridge, not full production auth. EngineeringOS still uses mock auth and local-first behavior, but pages and actions no longer treat cookies as the primary learner-state abstraction.

## Implemented

- Added `LearnerPreferencesRepository`.
- Added `MockLearnerPreferencesRepository`.
- Added `LearnerStateService`.
- Wired `learnerPreferencesRepository` and `learnerStateService` into `appServices`.
- Updated `/onboarding` to read preferences through `learnerStateService`.
- Updated `/dashboard` to read preferences through `learnerStateService`.
- Updated onboarding save action to save preferences through the learner-state service.
- Kept cookie fallback for local continuity and reload compatibility.
- Added service tests and Phase 48 quality contract tests.

## Current State

- Auth: still mock guest/local user.
- Preferences: saved through repository boundary, with cookie fallback still retained.
- Progress/evaluations: already behind repository/service boundaries from earlier phases.
- Prisma-backed learner preferences: not implemented yet because it needs a schema migration and generated client update.

## Why Cookie Fallback Remains

The app is still local/mock by default. The cookie fallback preserves local onboarding behavior while the repository/service boundary is introduced safely.

Future production behavior should use:

- Authenticated user ID.
- Database-backed learner profile.
- Database-backed learning preferences.
- Database-backed progress, responses, evaluations, revision queue, and weak areas.

## Remaining Blockers

- Real auth provider.
- Prisma model for learner profile/preferences.
- Safe migration path.
- Session/user ownership checks for all learner-state reads and writes.
- Data export/delete policy.
- Security review for auth cookies and learner data.

## Phase 49 Recommendation

Phase 49 should implement the database-backed learner profile schema:

- Add `LearnerProfile` or `UserProfile` model.
- Add `LearnerPreferences` model or JSON field.
- Add Prisma repository implementation.
- Apply schema safely in local mode.
- Keep mock fallback.
- Add persistence tests for preference save/read after process-level fallback is removed.
