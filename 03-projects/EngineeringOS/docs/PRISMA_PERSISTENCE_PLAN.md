# EngineeringOS Prisma Persistence Plan

## Phase Purpose

Phase 14 defines the local Prisma persistence plan before any write implementation begins.

This is a planning-only phase. It does not add Prisma writes, schema changes, migrations, Supabase, OpenAI, auth, billing, deployment, or production database behavior.

## 1. Why Local Prisma Persistence Is Needed

EngineeringOS already proves read-only content retrieval through mock repositories and opt-in Prisma repositories. Local Prisma persistence is needed next so the MVP can remember user learning activity across sessions while preserving the same repository and service boundaries.

Local persistence should support:

- Completed topics.
- Completed practice tasks.
- Explain-back attempts.
- Mock AI evaluation results.
- Weak area changes.
- Revision queue changes.
- Readiness and interview readiness updates.

The goal is not to turn EngineeringOS into a production SaaS database yet. The goal is to validate local user-progress behavior against SQLite before any Supabase/PostgreSQL migration.

## 2. Data That Should Remain Local Storage For Now

The following can remain local storage or mock-backed until Prisma write scope is explicitly approved:

- Unsaved UI preferences.
- Temporary filter and search state.
- Expanded or collapsed sidebar/tree state.
- Draft answer text before the user submits an explain-back attempt.
- Monaco/editor scratchpad content before submission.
- Transient dashboard display state.

Local storage remains acceptable for short-lived client state. Prisma should be reserved for durable learning records.

## 3. Data To Write To Prisma Later

Planned Prisma writes for a later approved phase:

- User progress.
- Topic completion.
- Task completion.
- Explain-back attempts.
- Mock AI evaluations.
- Weak area updates.
- Revision queue updates.

These writes should be local-only first, routed through repository interfaces, and only enabled when Prisma mode is explicitly selected.

## 4. Data That Should Stay Read-only

Roadmap and curriculum content should remain seed/read-only for now:

- Roadmap content edits.
- Domain edits.
- Category edits.
- Module edits.
- Topic edits.
- Subtopic edits.
- Practice task edits.
- Problem statement edits.
- Interview question edits.
- Reference link edits.
- Revision prompt authoring.
- Evaluation rubric authoring.
- Schema edits.
- Auth or user management.
- Billing.
- Production data.

Content authoring and admin workflows are future scope. Phase 15 should focus only on schema additions for local user persistence, not content editing.

## 5. Risk Analysis

- Write scope can accidentally blur the current read-only safety boundary.
- A single aggregate `UserProgress` row is simple but may become hard to query, sync, or migrate.
- Granular progress rows are more durable but require careful idempotency rules.
- Local writes can hide mock-mode regressions if mock remains insufficiently tested.
- Prisma write errors must not crash core read-only learning pages.
- The previous Windows/Node Prisma schema-engine issue means migration commands require explicit approval and care.
- Supabase concerns can overcomplicate the local SQLite design if introduced too early.

## 6. Approval Boundaries

These require explicit approval before implementation:

- Prisma schema changes.
- Prisma migrations.
- Destructive database operations.
- Switching default `dataSource` from `mock` to `prisma`.
- Writing real user data to SQLite.
- Adding Supabase.
- Adding auth.
- Adding OpenAI.
- Adding billing.
- Adding deployment.
- Adding production database configuration.

Until approved, Phase 13 behavior remains the boundary: mock is default, Prisma is opt-in read-only, and progress is local/mock-backed.

## 7. Write Operation Design

Future writes should follow the existing architecture:

```txt
Page action
  -> Service method
    -> Repository interface
      -> Prisma repository implementation
        -> SQLite
```

Rules:

- UI components should not import Prisma.
- UI components should not manually mutate persistence data.
- Services should validate domain intent before calling repositories.
- Repositories should own persistence details and idempotency.
- Writes should return updated domain types or clear operation results.
- Missing topic/task IDs should return typed failures instead of throwing for normal user mistakes.
- Prisma write mode should remain opt-in until explicitly changed.
- Mock mode should keep working without a database.

## 8. Repository Method Additions Needed

Do not implement these in Phase 14. These are proposed additions for Phase 15 or later.

### ProgressRepository

Current read methods:

```ts
getCurrentProgress()
getCompletedTopicIds()
getCompletedTaskIds()
getWeakAreas()
```

Planned additions:

```ts
getProgress()
markTopicComplete(topicId)
markTaskComplete(taskId)
updateWeakAreas(weakAreas)
updateRevisionQueue(items)
resetLocalProgress()
```

### EvaluationRepository

The current project has `EvaluationRubricRepository` for read-only rubrics. A separate write-focused evaluation repository should be considered for user results.

Planned additions:

```ts
saveEvaluationResult(result)
getEvaluationResultsByTopicId(topicId)
getEvaluationResultsByTaskId(taskId)
```

### ExplainBackRepository

This repository does not exist yet. Add only if explain-back attempts become a durable local persistence feature.

Planned methods:

```ts
saveExplainBackAttempt(attempt)
getExplainBackAttemptsByTopicId(topicId)
getLatestExplainBackAttempt(topicId)
```

### RevisionRepository

Current revision prompts are read-only content. User revision queue state should be separate from seeded prompts.

Planned methods:

```ts
updateRevisionQueue(items)
getRevisionQueue()
markRevisionItemComplete(itemId)
deferRevisionItem(itemId, nextReviewAt)
```

## 9. Service Method Additions Needed

Do not implement these in Phase 14. These are proposed service additions:

### ProgressSummaryService

```ts
markTopicComplete(topicId)
markTaskComplete(taskId)
resetLocalProgress()
```

### PracticeContentService

```ts
completeTask(taskId)
saveTaskEvaluation(taskId, result)
```

### TopicContentService

```ts
completeTopic(topicId)
saveExplainBackAttempt(topicId, attempt)
```

### RevisionService

```ts
updateRevisionQueue(items)
completeRevisionItem(itemId)
deferRevisionItem(itemId, nextReviewAt)
```

### ReadinessScoreService

```ts
recalculateReadiness()
recordWeakAreaUpdate(topicId, reason)
```

## 10. Testing Strategy

Phase 15 should include tests or checks for:

- Mock mode still builds and works without SQLite.
- Prisma mode reads still pass after schema additions.
- Repository write methods are idempotent where needed.
- Marking the same topic complete twice does not duplicate progress.
- Marking the same task complete twice does not duplicate progress.
- Resetting local progress clears only user progress tables, not seeded curriculum content.
- Missing topic/task IDs return safe failures.
- Progress summary updates after topic/task completion.
- Revision queue updates do not mutate seeded `RevisionPrompt` content.
- Evaluation results do not mutate seeded `EvaluationRubric` content.

Required validation after implementation:

```bash
npm run typecheck
npm run lint
npm run build
```

Prisma schema validation and migration commands should only run in Phase 15 after approval.

## 11. Rollback Strategy

Future persistence work should be reversible:

- Keep mock mode as the default fallback.
- Keep mock repositories and mock data intact.
- Add schema changes in a new migration instead of editing prior migration history.
- Do not use destructive reset commands without explicit approval.
- If Prisma write behavior fails, switch local env back to `NEXT_PUBLIC_ENGINEERINGOS_DATA_SOURCE=mock`.
- Keep seeded roadmap/topic/task content read-only so user-progress rollback does not damage curriculum data.
- Prefer additive schema changes for Phase 15.

## 12. Supabase Migration Considerations Later

Supabase/PostgreSQL remains future scope and should not be combined with local Prisma persistence implementation.

Later migration considerations:

- SQLite stringified JSON fields may become PostgreSQL `jsonb` or normalized join tables.
- Local-only `userId` placeholders must become real authenticated user ownership.
- Progress, attempts, evaluations, weak areas, and revision queue items will need user-scoped indexes.
- Row-level security must be designed before production user data exists.
- Auth and billing must be planned separately.
- Supabase schema should come after local persistence semantics are proven.

## 13. Proposed Data Model Gaps

The current Prisma schema includes `UserProgress`, but it does not yet model granular durable progress and evaluation history.

Likely future models:

- `UserTopicProgress`: one row per user/topic completion state.
- `UserTaskProgress`: one row per user/task completion state.
- `ExplainBackAttempt`: submitted explain-back answer and metadata.
- `AIEvaluationResult`: mock AI or later real AI evaluation output.
- `RevisionQueueItem`: user-specific review queue state.
- `UserWeakArea`: durable weak area records and reasons.

Do not add these models in Phase 14. They are proposed additions for Phase 15 after explicit approval.

## 14. Phase 15 Recommendation

The next phase should be:

```txt
Phase 15 - Prisma Persistence Schema Additions
```

Phase 15 should add the approved schema models only. It should not implement UI writes, Supabase, OpenAI, auth, billing, deployment, or production database behavior.
