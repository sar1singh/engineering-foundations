# Founder Beta Persistence Implementation Plan

Date: 2026-06-05

## Purpose

Prepare the Founder Beta manual-progress slice for persistence implementation.

This is an implementation-preparation document only. It does not add Prisma models, migrations, server actions, routes, UI changes, or persistence code.

Persistence principle:

```txt
Persist normalized progress input.
Recompute all plans, recommendations, readiness outputs, and gates.
```

## Part 1 - Persistence Impact Analysis

## Current Flow

Current local-only flow:

```txt
Manual Progress Input
  -> Progress Adapter
  -> Facade
  -> Today Plan
```

The `/founder-beta` page currently keeps all manual progress in client-local draft state. The draft input is normalized by the progress adapter and passed through the facade to generate a deterministic Today Plan.

## Future Flow

Future persisted flow:

```txt
Persisted Progress
  -> Progress Adapter
  -> Facade
  -> Today Plan
```

Persistence should load saved normalized progress, pass it through the existing adapter/facade boundary, and render the same derived plan shape already locked by the facade and contract tests.

The core product flow should not change:

```txt
Progress state in
  -> deterministic orchestration
  -> current plan out
```

## Affected Services

Affected directly:

- `founder-beta-progress-adapter-service`
  - Remains the normalization boundary.
  - Should continue clamping scores, deduplicating IDs, filtering unknown IDs, and emitting warnings.
- `founder-beta-facade-service`
  - Remains the public entrypoint for plan generation.
  - Should accept persisted progress exactly like current manual draft progress.

Affected indirectly:

- `founder-beta-orchestration-service`
- `founder-beta-readiness-service`
- `founder-beta-mission-selection-service`
- `founder-beta-service`

These should remain deterministic and persistence-agnostic.

New future service boundary:

- Founder Beta progress persistence service or repository.
- It should save and load only normalized progress input.
- It should not calculate readiness, select missions, or duplicate facade logic.

## Affected Pages

Affected directly:

- `/founder-beta`
  - Future work can load persisted progress as initial input.
  - Future work can save normalized draft input.
  - The page should continue rendering derived plan output from the facade.

Affected later:

- `/today`
  - Should not be migrated in the first persistence phase.
  - Any `/today` migration should happen after persisted Founder Beta progress is stable.

Unaffected:

- Existing syllabus, course, dashboard, graph, auth, payment, deployment, and source ingestion surfaces.

## Affected Tests

Existing tests to preserve:

- Founder beta facade tests.
- Founder beta contract test.
- Founder beta progress adapter tests.
- Founder beta E2E smoke test.

Future tests to add:

- Persistence contract test for saved progress shape.
- Repository/service tests for load/save/update behavior.
- API or server-action tests once a write boundary exists.
- Migration tests for default empty progress and older schema versions.

## Migration Risks

Risks:

- Persisting derived Today Plan output can create stale recommendations.
- Saving raw component state can make future UI changes hard.
- Treating manual readiness estimates as final evaluated scores can create false authority.
- JSON-heavy storage without `schemaVersion` can become hard to migrate.
- User ownership must be clear before any public or multi-user beta.

Mitigations:

- Persist only normalized progress input.
- Keep `schemaVersion` and timestamps from the first persisted shape.
- Recompute all derived outputs through the facade.
- Keep the first persistence phase founder-only and narrow.
- Keep manual readiness copy clear until proof-backed scoring exists.

## Rollback Strategy

Rollback must be simple:

- Keep `/founder-beta` capable of rendering with default local progress.
- If persistence fails, fall back to `getFounderBetaDefaultPlan()`.
- Treat persisted progress as optional input, not required infrastructure.
- Do not block the page on save/load failure.
- Avoid schema changes that require destructive rollback.

Rollback behavior:

```txt
Load persisted progress fails
  -> show default plan
  -> surface non-blocking warning in future UI if needed
```

## Part 2 - Persistence Scope Lock

## Persist Later

Only these normalized fields should be persisted in the first persistence phase:

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

Optional later fields:

- `currentMissionId`
- `schemaVersion`
- `createdAt`
- `updatedAt`

These fields are inputs. They describe what the founder marked, estimated, completed, or prefers.

## Do Not Persist

Do not persist:

- Today Plan.
- Mission recommendations.
- Primary mission.
- Optional missions.
- Readiness outputs.
- Hard gate results.
- Roadmap projection output.
- Static founder beta data.
- Capability definitions.
- Source catalog.

Why:

- Today Plan and mission recommendations are derived outputs.
- Readiness outputs and hard gates must reflect the latest scoring rules.
- Roadmap projection output must reflect the latest canonical roadmap projection data.
- Static founder beta data belongs in deterministic seed files.
- Capability definitions and source catalog are reference data, not user progress.

Persisting derived output would create stale state and make rule changes risky.

## Part 3 - Future Persistence Shape

No Prisma model is defined here. This is the normalized conceptual shape only.

Recommended model:

```txt
FounderProgress
```

Fields:

| Field | Purpose |
| --- | --- |
| `userId` | Owner of the founder progress record. Founder-only can use a local owner key until auth is introduced. |
| `completedMissionIds` | Mission IDs marked complete by the user. |
| `skippedMissionIds` | Mission IDs intentionally skipped or deferred. |
| `completedTopicIds` | Topic IDs marked complete or manually acknowledged. |
| `weakAreaCapabilityIds` | Capability IDs manually marked weak. |
| `weakAreaTopicIds` | Topic IDs manually marked weak. |
| `readinessInputs` | Manual readiness estimates and future proof-backed input overrides. |
| `proofScores` | Manual proof score inputs keyed by proof, mission, topic, or artifact ID. |
| `preferences` | Available minutes, day mode, preferred mission types, and similar user-controlled settings. |
| `timestamps` | Created, updated, and optional last reviewed timestamps. |

Suggested structure:

```txt
FounderProgress
  userId
  completedMissionIds[]
  skippedMissionIds[]
  completedTopicIds[]
  weakAreaCapabilityIds[]
  weakAreaTopicIds[]
  readinessInputs
    architectReadiness
    awsReadiness
    behavioralReadiness
    communicationReadiness
    resumeReadiness
    capabilityReadinessById
    topicReadinessById
  proofScores
    [proofOrMissionOrTopicId] -> 0..5
  preferences
    availableMinutes
    dayMode
    preferredMissionTypes[]
  timestamps
    createdAt
    updatedAt
    lastNormalizedAt
```

Relationships:

- `completedMissionIds` reference static founder beta missions.
- `completedTopicIds` and `weakAreaTopicIds` reference static founder beta topics.
- `weakAreaCapabilityIds` reference static founder beta capabilities.
- `proofScores` reference future proof, mission, topic, or artifact IDs.
- `readinessInputs` are manual inputs, not final derived readiness outputs.
- `preferences` feed mission selection but do not own mission recommendations.

## Part 4 - Future API Layer

No API changes are implemented in this phase.

Future read/write boundaries:

## `GET /api/founder-beta/progress`

Responsibilities:

- Load normalized persisted FounderProgress.
- Return progress input only.
- Return empty/default progress if no record exists.
- Never return Today Plan as persisted state.

## `PUT /api/founder-beta/progress`

Responsibilities:

- Accept full manual progress input.
- Normalize through the progress adapter.
- Save normalized progress.
- Return normalized progress, validation warnings, and optionally the recalculated facade plan.

Use when replacing the full draft state.

## `PATCH /api/founder-beta/progress/mission`

Responsibilities:

- Mark one mission complete, skipped, or active.
- Normalize updated progress after mutation.
- Return updated progress and optional recalculated plan.

Use for small mission-completion interactions.

## `PATCH /api/founder-beta/progress/readiness`

Responsibilities:

- Update one or more manual readiness inputs.
- Clamp values through the adapter.
- Return updated normalized progress and warnings.

Use for manual readiness estimate edits.

## API Rules

- Validate all IDs against static founder beta data.
- Save only normalized progress.
- Recompute facade output after save if a plan is returned.
- Keep derived output out of the database.
- Keep writes founder-only until user ownership is formalized.

## Part 5 - Future Server Action Layer

No server actions are implemented in this phase.

Future server actions may be used if `/founder-beta` remains a server-rendered page with simple interactions.

Responsibilities:

- Receive manual progress changes from UI.
- Normalize through `founder-beta-progress-adapter-service`.
- Persist normalized progress through a narrow persistence service.
- Recompute Today Plan through the facade.
- Return validation warnings and refreshed plan data.

Validation:

- Clamp proof scores to `0-5`.
- Clamp readiness scores to `0-100`.
- Deduplicate arrays.
- Drop or warn on unknown IDs.
- Reject unsupported `dayMode` and mission types.
- Never trust raw client-local state as persisted shape.

Adapter usage:

```txt
raw UI input
  -> normalizeFounderBetaProgressInput()
  -> persisted normalized input
```

Facade usage:

```txt
persisted normalized input
  -> getFounderBetaPlanFromProgress()
  -> derived Today Plan
```

## Part 6 - Future Migration Strategy

## Phase 1 - Local-only

Status:

- Complete enough for internal validation.
- `/founder-beta` supports default, demo, weak-area, and local manual draft modes.
- No progress survives reloads.

Why first:

- Validated the plan shape and manual inputs before saving anything.

## Phase 2 - Persistence

Next phase:

- Save and load normalized FounderProgress.
- Keep Today Plan derived.
- Keep writes narrow and founder-only.

Why second:

- The founder workflow needs continuity before onboarding, dynamic roadmaps, AI evaluation, or ingestion can create real value.

## Phase 3 - Onboarding

Later:

- Connect persisted progress to onboarding/profile state.
- Capture experience, target role, available time, weak areas, and diagnostic answers.

Why later:

- Persistence shape must stabilize before onboarding writes into it.

## Phase 4 - Dynamic Roadmaps

Later:

- Regenerate roadmap projections based on persisted progress, readiness, weak areas, and timeline.

Why later:

- Static founder beta projection is enough until persisted progress proves the daily loop.

## Phase 5 - AI Evaluation

Later:

- Evaluate proof, answers, case studies, and readiness confidence.

Why later:

- AI evaluation should operate on saved artifacts and proof workflows, not temporary draft state.

## Phase 6 - Source Ingestion

Later:

- Add source discovery, ingestion, and topic mapping flows.

Why later:

- Source ingestion expands content breadth. It should not precede a stable persisted founder workflow.

## Part 7 - Test Strategy

No tests are added in this docs-only phase.

Future tests:

## Persistence Contract Tests

Validate:

- Persisted shape contains only approved fields.
- Derived outputs are not saved.
- Unknown IDs produce warnings, not crashes.
- Default empty progress loads safely.

## Adapter Tests

Extend existing adapter tests for:

- Persisted input round-trip.
- Schema version handling.
- Older persisted shape migration.
- Empty/null storage fallback.

## Progress Migration Tests

Validate:

- `schemaVersion: 1` remains readable.
- Future versions can migrate forward.
- Missing optional fields become safe defaults.
- Invalid scores and duplicate IDs normalize safely.

## API Tests

Validate:

- `GET progress` returns normalized progress only.
- `PUT progress` saves normalized input.
- Mission completion patch updates only mission-related fields.
- Readiness patch clamps values.
- Derived plan returned by API, if any, is recomputed and not read from persistence.

## E2E Tests

Validate later:

- Loading `/founder-beta` uses persisted progress.
- Saving manual draft persists after reload.
- Validation warnings appear for invalid manual input.
- Demo query-param modes remain read-only and do not overwrite persisted progress.

## Part 8 - Readiness Check

Verdict:

```txt
A. Yes
```

Persistence implementation can safely begin after this document, provided the next phase remains limited to Founder Beta Persistence Phase 1.

Justification:

- The static data, adapter, facade, orchestration, readiness, mission selection, API read boundary, local UI, demo modes, contract tests, and E2E smoke tests already exist.
- The persistence scope is locked to normalized input only.
- Derived Today Plan, readiness outputs, hard gates, roadmap projection, mission recommendations, static founder beta data, capabilities, and source catalog are explicitly excluded from persistence.
- The rollback path is clear: if persisted progress is unavailable, use the default plan.
- Deferred systems are clear: onboarding integration, dynamic roadmaps, AI evaluation, and source ingestion must not be started in the first persistence implementation phase.

Minor caution:

- User ownership must remain founder-only or local until auth/user boundaries are deliberately introduced.

## Recommended Next Implementation Task

Recommended next task:

```txt
Founder Beta Persistence Phase 1 Implementation
```

Scope:

- Add the narrow persistence boundary for normalized FounderProgress.
- Save/load only approved progress input fields.
- Reuse the progress adapter and facade.
- Keep Today Plan derived.
- Do not start source ingestion, AI evaluation, dynamic roadmaps, or broad onboarding migration.
