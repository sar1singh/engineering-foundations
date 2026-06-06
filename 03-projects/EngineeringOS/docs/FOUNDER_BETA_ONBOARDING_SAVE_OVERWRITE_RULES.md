# Founder Beta Onboarding Save Overwrite Rules

Date: 2026-06-05

## Goal

Define explicit rules for saving onboarding initialization into `founder-local` progress.

This is a planning document only. It does not implement code, Prisma, UI changes, server actions, auth, AI, scraping, or dynamic roadmap generation.

## 1. When Onboarding Can Save Progress

Onboarding can save progress only when all of these are true:

- The user has explicitly chosen to save onboarding initialization.
- The draft input has been normalized through the existing founder beta progress adapter.
- The saved shape contains only approved normalized progress input fields.
- The UI clearly states that saving will initialize local founder progress.
- The operation does not save derived Today Plan, readiness output, hard gates, roadmap output, or mission recommendations.

Allowed first-save case:

- No saved `founder-local` progress exists.
- Onboarding draft becomes the first local progress record.
- Confirmation copy must make clear this starts local founder progress.

Allowed update case:

- Saved `founder-local` progress exists.
- The user explicitly confirms that onboarding values should update saved local progress.
- The update must preserve fields that are not part of the onboarding draft unless the user explicitly changes them.

Allowed reset/reinitialize case:

- The user explicitly chooses a separate reset/reinitialize action.
- The user confirms existing local progress may be cleared or replaced.

## 2. When It Must Not Overwrite Saved Progress

Onboarding must not overwrite saved progress when:

- A saved `founder-local` progress record exists and the user has not confirmed overwrite.
- The user is only previewing onboarding initialization.
- The user changes onboarding draft fields locally but does not click an explicit save action.
- Demo mode or weak-area demo mode is active.
- The draft contains unknown IDs that were dropped or warned by validation.
- The operation would replace completed missions/topics without explicit confirmation.
- The operation would replace proof scores without explicit confirmation.
- The operation would replace manual readiness estimates without explicit confirmation.
- The operation would replace preferred mission types without explicit confirmation.
- The operation would replace available minutes/day mode without making the schedule update explicit.

Never-save cases:

- Do not save preview-only state automatically.
- Do not save on page load.
- Do not save on input change.
- Do not save derived output.
- Do not save demo fixture state unless the user explicitly converts it into a local save through the normal save flow.

## 3. Required Confirmation Copy

First save copy:

```txt
Save onboarding initialization as local Founder Beta progress?
This will create your local founder progress record. It will not save derived Today Plan, readiness outputs, hard gates, or mission recommendations.
```

Existing progress copy:

```txt
Saved local progress already exists.
Overwrite selected local progress inputs with this onboarding draft?
Completed work, readiness estimates, weak areas, and schedule values may change. Derived Today Plan output will be recomputed and not saved.
```

Reset/reinitialize copy:

```txt
Reset local Founder Beta progress and initialize from onboarding?
This clears saved local progress inputs before applying the onboarding draft. This cannot restore the previous local file unless you have a backup.
```

Preview copy:

```txt
Preview only. Does not overwrite saved progress.
```

Saved confirmation copy:

```txt
Onboarding initialization saved locally. Today Plan was recomputed from saved progress.
```

No-overwrite confirmation copy:

```txt
Saved progress kept. Onboarding preview was not saved.
```

## 4. Preview vs Save vs Reset vs Overwrite

Preview:

- Client-local draft only.
- No persistence call.
- Uses progress adapter and facade to show derived Today Plan preview.
- Must display `Preview only. Does not overwrite saved progress.`

Save:

- Writes normalized progress input.
- Allowed without overwrite confirmation only when no saved progress exists.
- Recomputes Today Plan after save.
- Does not persist derived output.

Reset:

- Clears saved `founder-local` progress.
- Existing `/founder-beta` reset behavior remains separate from onboarding save.
- After reset, default founder progress can be used again.

Overwrite:

- Updates or replaces selected saved progress inputs when saved progress already exists.
- Requires explicit confirmation.
- Should prefer merge/update semantics over full replacement unless the user chooses reset/reinitialize.
- Must not overwrite fields outside the onboarding draft.

## 5. Fields Onboarding May Initialize

Onboarding may initialize these normalized input fields:

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

Conservative defaults:

- Empty completed/skipped missions.
- Empty completed topics unless explicitly selected.
- Weak areas from founder self-assessment.
- Manual readiness estimates from founder self-assessment.
- Available minutes/day mode from onboarding schedule.
- Proof scores only when onboarding explicitly captures proof/case-study state.

## 6. Fields Onboarding Must Not Save

Onboarding must not save:

- Today Plan.
- Readiness snapshot.
- Hard gate status.
- Roadmap projection output.
- Roadmap summary.
- Primary mission.
- Optional missions.
- Next recommended actions.
- Mission selection reasons.
- Offer readiness signals.
- Capability definitions.
- Master topics.
- Static founder beta source catalog.
- Demo fixture identity.
- UI-only display state.
- Confirmation modal state.

These remain either derived outputs, static seed data, or transient UI state.

## 7. Saved Progress Remains Normalized Input Only

All onboarding saves must follow this flow:

```txt
Onboarding draft input
  -> progress adapter normalization
  -> validation warnings
  -> save normalized progress input
  -> facade recomputes Today Plan
```

Persisted state must remain compatible with:

- `getFounderBetaPlanFromProgress(input)`
- existing progress persistence service
- existing file-backed repository
- future Prisma migration, if/when needed

Persistence must preserve:

- `schemaVersion`
- `userId`
- timestamps
- only normalized input fields

Persistence must not preserve:

- rendered plan.
- selected mission object.
- readiness result object.
- hard-gate result object.

## 8. Tests Required Before Implementation

Required unit/service tests:

- First-save with no existing progress saves normalized input only.
- Existing saved progress is not overwritten without explicit confirmation.
- Explicit overwrite updates only allowed onboarding fields.
- Reset/reinitialize clears old progress before applying onboarding draft, if implemented.
- Unknown IDs produce warnings and are not saved.
- Derived outputs are absent from saved records.

Required E2E or page tests:

- Preview changes do not persist after reload.
- Save onboarding initialization creates local progress when no record exists.
- Existing saved progress shows an overwrite warning/confirmation.
- Cancel overwrite keeps saved progress unchanged.
- Confirm overwrite updates saved progress and recomputes Today Plan.
- Demo and weak-area modes do not auto-save.

Regression checks:

- Existing `/founder-beta` save/load/reset behavior still works.
- `npm run typecheck`
- `npm run lint`
- focused founder beta E2E
- focused persistence service tests

## 9. Recommended Implementation Task

Recommended next task:

```txt
Implement Founder Beta onboarding initialization save confirmation.
```

Scope:

- Add explicit save behavior for onboarding preview only.
- If no saved progress exists, allow first save.
- If saved progress exists, require overwrite confirmation.
- Save only normalized progress input.
- Reuse the existing progress adapter, persistence service, and facade.
- Keep reset/reinitialize separate.
- Do not add Prisma, auth, AI, scraping, dynamic roadmaps, or derived-output persistence.

## Overwrite Verdict

Overwrite is allowed only with explicit confirmation.

Default behavior must be no overwrite. Preview must remain safe and non-persistent until the founder intentionally saves or confirms overwrite.
