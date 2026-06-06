# Founder Beta Local Persistence Review

Date: 2026-06-05

## Purpose

Review Founder Beta local file-backed persistence after Phase 1 UI wiring and reset support.

This is a docs-only review. It does not add Prisma, code changes, UI changes, route changes, auth, AI, scraping, dynamic roadmap generation, or source ingestion.

## Verdict

```txt
A. Keep file-backed storage for founder validation
```

Reason:

The current file-backed persistence is sufficient for a single-founder validation loop. It preserves normalized progress input, keeps Today Plan output derived, supports reset, and avoids Prisma/auth/schema work before the daily workflow is proven.

It should not be treated as production storage or a multi-user foundation.

## 1. What Is Complete

Complete:

- Static founder beta data contracts and seed data.
- Founder beta query, readiness, mission selection, orchestration, adapter, and facade services.
- File-backed local progress repository.
- In-memory test repository.
- Founder beta progress persistence service.
- `POST /api/founder-beta/progress` for saving normalized local progress.
- `DELETE /api/founder-beta/progress` for clearing saved local progress.
- `/founder-beta` loading saved `founder-local` progress when present.
- Default/demo/weak-area fallback modes when no saved progress exists.
- Explicit `Save local progress` action.
- Explicit `Reset local progress` action.
- Confirmation messages:
  - `Local progress saved`
  - `Local progress reset`
- E2E coverage for:
  - page rendering
  - save
  - persisted reload
  - reset
  - return to default plan
- Repository fallback for missing, empty, or malformed local progress JSON.

## 2. What Is Persisted

Persisted fields:

- `schemaVersion`
- `userId`
- `completedMissionIds`
- `skippedMissionIds`
- `completedTopicIds`
- `weakAreaCapabilityIds`
- `weakAreaTopicIds`
- `manualReadinessScores`
- `proofScores`
- `availableMinutes`
- `dayMode`
- `preferredMissionTypes`
- `createdAt`
- `updatedAt`

These are normalized progress inputs only.

The current fixed local user is:

```txt
founder-local
```

## 3. What Is Intentionally Not Persisted

Intentionally not persisted:

- Today Plan.
- Readiness snapshot.
- Hard gate status.
- Roadmap projection output.
- Primary mission.
- Optional missions.
- Mission recommendations.
- Next actions.
- Static founder beta data.
- Capability definitions.
- Master topics.
- Source catalog.
- Demo fixtures.
- UI-only state such as query mode, section state, temporary success/error flags, or display labels.

Reason:

These are derived outputs or static reference data. They must be recomputed from normalized progress input and canonical founder beta data so rules can evolve without stale saved recommendations.

## 4. File-Backed Storage Risks

Risks:

- Shared local file state is not safe for parallel writers.
- E2E tests can race if desktop/mobile projects write the same file concurrently.
- A crash during write can leave an empty or malformed JSON file.
- File-backed persistence has no user isolation beyond the fixed local ID.
- There is no audit history, conflict resolution, backup, or multi-device sync.
- Local file paths are environment-specific and not suitable for deployment.

Mitigations already added:

- Missing local file falls back to empty progress.
- Empty or malformed local JSON falls back to empty progress.
- E2E suite skips mobile project for this shared-store path.
- Reset action clears the local founder record for clean validation runs.
- Repository boundary keeps Prisma replacement possible later.

Remaining acceptable risk:

- For one founder on one local machine, file-backed persistence is adequate.

## 5. E2E Shared-Store Limitation

The Founder Beta E2E tests exercise a shared file-backed local store.

Because Playwright runs desktop and mobile projects in parallel by default, both projects can try to save, reset, or load the same file at the same time.

Current decision:

- Founder Beta local persistence E2E is constrained to Chromium.
- Mobile project runs are skipped for this persistence-specific suite.

This is acceptable for founder validation because the test is verifying storage behavior, not mobile layout. General mobile rendering can be covered separately without shared local writes.

Before multi-user support, this limitation must be removed by using user-scoped persistent storage with isolated test records.

## 6. Reset Behavior

Reset behavior is complete for local founder validation.

Flow:

```txt
Click Reset local progress
  -> DELETE /api/founder-beta/progress
  -> clear founder-local saved progress
  -> reset draft inputs to default
  -> show Local progress reset
  -> derive default Today Plan again
```

Reset does not delete static founder beta data. It only clears saved normalized progress input.

Reset is important because founder validation will involve repeated trial runs, demo states, weak-area checks, and manual readiness experiments.

## 7. Can Founder Validation Continue With File-Backed Storage?

Yes.

Founder validation can continue with file-backed storage if the validation remains:

- single-user
- local
- non-production
- manual
- focused on validating the Today Mission and readiness loop

File-backed storage is enough to answer:

- Does saved manual progress survive reload?
- Does the daily plan derive correctly from saved input?
- Are the saved fields understandable?
- Does reset make validation repeatable?
- Does the founder actually use the loop daily?

File-backed storage is not enough to answer:

- Can multiple users safely use the app?
- Can auth-owned progress be isolated?
- Can progress sync across devices?
- Can proof history and readiness history scale?
- Can public beta data be backed up and migrated?

## 8. When Prisma Should Be Reconsidered

Prisma should be reconsidered after one of these triggers:

- Founder uses the local loop for a real validation pass and confirms the saved fields are correct.
- Progress needs to survive beyond one local machine.
- Onboarding needs to write into founder progress.
- Multiple users or auth-owned records are required.
- Proof submissions need durable history.
- Mission attempt history becomes important.
- Readiness history or decay needs timestamps per event.
- Offer-readiness artifacts need structured persistence.
- File-backed test limitations start blocking useful QA.

Do not move to Prisma merely because persistence exists.

Move to Prisma when the model needs user ownership, relational integrity, durable history, or beta-grade storage.

## 9. What Must Happen Before Multi-User Support

Before multi-user support:

- Add real auth/user ownership.
- Replace fixed `founder-local` identity with authenticated user IDs.
- Move the repository implementation from file-backed storage to Prisma or managed database storage.
- Define a proper `FounderBetaProgress` or broader progress model.
- Add migration/version handling for saved progress.
- Ensure derived outputs are still not persisted.
- Add authorization checks for all read/write routes.
- Add tests for user isolation.
- Add data reset/export behavior per user.
- Decide whether founder beta progress is separate from or merged into the broader learner profile.

Multi-user support should not begin from the file-backed implementation.

The file-backed implementation is a founder validation bridge, not the production persistence layer.

## Recommended Next Task

Recommended next task:

```txt
Run a founder manual validation pass using file-backed storage.
```

Suggested validation checklist:

- Start from default `/founder-beta`.
- Change manual readiness and available time.
- Save local progress.
- Reload and confirm the plan still makes sense.
- Complete or mark one mission.
- Reset local progress.
- Record friction in the manual progress panel.
- Decide whether the saved fields are sufficient before Prisma.
