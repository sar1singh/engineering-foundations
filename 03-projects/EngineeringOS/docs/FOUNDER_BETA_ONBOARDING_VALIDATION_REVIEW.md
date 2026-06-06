# Founder Beta Onboarding Validation Review

Date: 2026-06-06

## Purpose

This review validates whether the current Founder Beta onboarding initialization preview and save flow are safe enough to connect to an onboarding entrypoint before adding Prisma, auth, AI evaluation, dynamic roadmaps, source ingestion, or multi-user support.

## Current Onboarding Preview And Save Behavior

The active Founder Beta onboarding initialization flow lives inside `/founder-beta`.

Current behavior:

- The onboarding preview is preview-only by default.
- It accepts available minutes, day mode, weak areas, and manual readiness estimates.
- It derives a Today Plan preview through the existing Founder Beta facade.
- If no saved `founder-local` progress exists, the user can select `Save onboarding progress`.
- If saved progress exists, the UI shows `Overwrite onboarding progress` instead of silently saving.
- Overwrite requires explicit confirmation.
- The confirmation copy is: `This will replace your saved local Founder Beta progress. Today Plan and readiness will be recalculated.`
- The user can cancel with `Keep saved progress`.

Assessment:

- Behavior is correct for founder validation.
- The flow is intentionally local and explicit.
- It avoids silently replacing saved founder progress.

## Overwrite Protection

Overwrite protection is correct for the current phase.

Reasons:

- Saved progress existence is checked server-side on the `/founder-beta` page and passed into the preview component.
- The preview component keeps a local `savedProgressExists` flag after successful save.
- First save is available only when no saved progress exists.
- Existing saved progress requires an explicit two-step overwrite action.
- Canceling overwrite keeps the saved progress intact.

Risk:

- The current protection is local-founder validation grade, not multi-user grade. That is acceptable because auth and multi-user support are intentionally deferred.

## Persistence Contract

Saved local progress remains normalized progress input only.

Persisted fields:

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
- `schemaVersion`
- `userId`
- timestamps

The API route and persistence service still use the existing progress adapter and repository boundary. No second progress state model exists.

## Derived Output Contract

Derived outputs remain unpersisted:

- Today Plan
- readiness snapshot
- hard gates
- roadmap projection output
- primary mission
- optional missions
- next actions
- mission recommendations

These values are recomputed from normalized progress input, static Founder Beta seed data, and the deterministic facade/orchestration services.

Assessment:

- The derived-output boundary is still intact.
- The current implementation is safe to expose through a small onboarding handoff.

## Founder Validation UX

The current UX is enough for internal founder validation because it provides:

- a clear preview-only label
- manual draft readiness estimates
- explicit save
- explicit overwrite confirmation
- visible derived Today Plan preview
- visible saved-progress state on the main Founder Beta panel

Not enough for public or multi-user onboarding:

- no auth-linked identity
- no dedicated diagnostic questionnaire
- no evaluated readiness
- no production persistence
- no multi-user ownership model

## Risks Before Dedicated Onboarding Entrypoint

Risks:

- Duplicating the Founder Beta preview form into `/onboarding` could create two state models.
- Duplicating persistence code could weaken the normalized-input-only contract.
- Putting too much Founder Beta detail into the general onboarding wizard could confuse the existing role-preference onboarding.
- A dedicated `/onboarding` save flow could accidentally imply production-grade onboarding before auth and Prisma are ready.

Mitigation:

- Add a small onboarding handoff section that links to the existing `/founder-beta` initializer.
- Do not copy the form into `/onboarding`.
- Do not add new save routes or server actions.
- Keep `/founder-beta` as the only Founder Beta save/overwrite surface for now.

## Recommendation

Safe to implement the smallest integration path.

Decision:

- Add a minimal Founder Beta section to `/onboarding`.
- The section should point users to `/founder-beta`.
- It should explain that Founder Beta initialization is local-only and saves normalized progress input only.
- It should not create a second progress state model.
- It should not duplicate persistence logic.

Do not yet:

- move the preview form into `/onboarding`
- add Prisma
- add auth
- add server actions
- add AI evaluation
- add dynamic roadmaps
- add source ingestion
- persist derived outputs

## Recommended Next Implementation

Add a small `/onboarding` Founder Beta handoff section with a link to `/founder-beta`, then update E2E coverage to verify:

- `/onboarding` renders the Founder Beta handoff
- the handoff links to `/founder-beta`
- Founder Beta onboarding save still requires overwrite confirmation when saved progress exists
- Today Plan/readiness remain derived after save
