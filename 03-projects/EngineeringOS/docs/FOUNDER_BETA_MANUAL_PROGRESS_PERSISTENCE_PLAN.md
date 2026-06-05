# Founder Beta Manual Progress Persistence Plan

Date: 2026-06-05

## Purpose

Define what founder beta manual progress data can later be persisted.

This is a planning document only. It does not add Prisma models, server actions, POST routes, UI changes, or persistence code.

Persistence verdict:

```txt
Persist normalized progress input later.
Do not persist component-local state.
Do not persist derived Today Plan output.
Do not persist static seed data.
```

## 1. Persistence Purpose

Persistence should allow the founder to return to EngineeringOS and continue from the last validated manual progress state.

It should preserve:

- What the user marked complete.
- What the user marked weak.
- Manual readiness estimates.
- Manual proof scores when proof scoring is introduced.
- Time/day preferences for mission selection.
- Current mission context if useful.

It should not preserve generated outputs that can be recalculated from canonical data and normalized input.

The goal is continuity, not authority. Persisted manual readiness values are still estimates until backed by proof, mission history, or review.

## 2. Fields Safe To Persist

Safe fields:

- `completedMissionIds`
- `skippedMissionIds`
- `completedTopicIds`
- `weakAreaCapabilityIds`
- `weakAreaTopicIds`
- `manualProofScores`
- `manualReadinessScores`
- `availableMinutes`
- `dayMode`
- `currentMissionId`
- `preferredMissionTypes`
- `updatedAt`
- `schemaVersion`

Safe manual readiness scores:

- `architectReadiness`
- `awsReadiness`
- `behavioralReadiness`
- `communicationReadiness`
- `resumeReadiness`
- `linkedInReadiness`
- `githubReadiness`
- `portfolioReadiness`
- `interviewPipelineReadiness`
- `compensationReadiness`
- `capabilityReadinessById`
- `topicReadinessById`

These must be normalized through `founder-beta-progress-adapter-service` before saving.

## 3. Fields That Must Remain Derived

Do not persist these as source-of-truth fields:

- Today Plan.
- Primary mission.
- Optional missions.
- Prioritized mission list.
- Next actions.
- Readiness snapshot.
- Hard-gate pass/fail status.
- Offer-readiness score.
- Role readiness score.
- Capability readiness rollups.
- Weak areas derived from low readiness scores.
- Completed architecture case study count.
- Validation warnings.

Reason:

These are outputs of the facade, readiness engine, mission selection, or adapter. They should be recalculated whenever canonical data, rules, or user progress changes.

## 4. Fields That Must Remain Static Seed Data

Do not persist copies of:

- Founder beta path.
- Capabilities.
- Skills.
- Master topics.
- Source catalog.
- Topic-source mappings.
- Roadmap projection.
- Daily mission definitions.
- Mission tasks.
- Proof requirements.
- Readiness rules.
- Hard-gate thresholds.
- Proof score labels.
- Offer-readiness signal definitions.
- Demo progress fixtures.

Persist only IDs that reference these seed objects.

## 5. Fields That Must Not Be Saved From Component-Local State

Do not save:

- UI expansion/collapse state.
- Checkbox rendering order.
- Selected tab/section.
- Query-param mode.
- Local unsanitized number input strings.
- Raw unvalidated arrays.
- Display labels.
- Derived mission objective text.
- Generated warning messages.
- Temporary component booleans such as `isDemoActive`.

If the UI state needs persistence later, create a separate UI preferences model. Do not mix it with founder beta progress.

## 6. Normalized Persistence Shape

Recommended persisted shape:

```ts
type FounderBetaPersistedProgress = {
  schemaVersion: 1;
  updatedAt: string;
  completedMissionIds: string[];
  skippedMissionIds: string[];
  completedTopicIds: string[];
  weakAreaCapabilityIds: string[];
  weakAreaTopicIds: string[];
  manualProofScores: Record<string, 0 | 1 | 2 | 3 | 4 | 5>;
  manualReadinessScores: {
    architectReadiness?: number;
    awsReadiness?: number;
    behavioralReadiness?: number;
    communicationReadiness?: number;
    resumeReadiness?: number;
    linkedInReadiness?: number;
    githubReadiness?: number;
    portfolioReadiness?: number;
    interviewPipelineReadiness?: number;
    compensationReadiness?: number;
    capabilityReadinessById?: Record<string, number>;
    topicReadinessById?: Record<string, number>;
  };
  availableMinutes?: number;
  dayMode?: "weekday" | "weekend";
  currentMissionId?: string;
  preferredMissionTypes?: string[];
};
```

Rules:

- Save only normalized values.
- Clamp scores before saving.
- Deduplicate arrays before saving.
- Drop unknown IDs before saving.
- Store timestamps in ISO format.
- Keep schema version explicit from the start.

## 7. Future Prisma Model Considerations

Do not add Prisma yet.

When persistence is approved, prefer one narrow model first:

```txt
FounderBetaProgress
```

Possible columns:

- `id`
- `userId` or local founder owner key
- `schemaVersion`
- `completedMissionIdsJson`
- `skippedMissionIdsJson`
- `completedTopicIdsJson`
- `weakAreaCapabilityIdsJson`
- `weakAreaTopicIdsJson`
- `manualProofScoresJson`
- `manualReadinessScoresJson`
- `availableMinutes`
- `dayMode`
- `currentMissionId`
- `preferredMissionTypesJson`
- `createdAt`
- `updatedAt`

Keep the first version JSON-heavy to avoid premature schema hardening. Normalize into relational tables only after real usage proves the access patterns.

Future normalized models may include:

- Mission attempt history.
- Proof submissions.
- Readiness history.
- Weak-area events.
- Revision queue.
- Case-study artifacts.

Do not start there.

## 8. Server Action/API Design Later

Do not add POST yet.

Later design:

- `GET /api/founder-beta/today`
  - Returns facade plan from persisted progress if available.
  - Falls back to default plan.

- `GET /api/founder-beta/progress`
  - Returns normalized persisted progress only.

- `POST /api/founder-beta/progress`
  - Accepts raw/manual progress input.
  - Normalizes through `founder-beta-progress-adapter-service`.
  - Saves normalized progress.
  - Returns facade output plus warnings.

Server action alternative:

- Use only if `/founder-beta` remains server-rendered and simple.
- Keep normalization server-side.
- Never save raw component state.

Required later safeguards:

- Validate IDs against static seed data.
- Clamp scores.
- Require owner/user boundary before beta/public use.
- Keep derived Today Plan out of persistence.

## 9. Migration Path From Local Draft UI To Persistence

Recommended sequence:

1. Keep current local-only UI.
2. Improve grouping and labels.
3. Add a local "preview normalized payload" developer section if useful.
4. Add a persistence contract test with the proposed normalized shape.
5. Add a mock repository or in-memory repository boundary.
6. Add read/write service methods around normalized progress.
7. Only then consider Prisma.
8. Add Prisma model after one manual beta pass validates the fields.
9. Wire save/load behavior behind the same facade output.

Do not migrate directly from component state to Prisma.

## 10. Risks

Product risks:

- Persisting manual readiness too early can make estimates look official.
- Saving too many fields can make the UI harder to change.
- Adding persistence before proof scoring can reinforce checkbox progress.

Technical risks:

- Component-local state can leak into the data model.
- Derived output can become stale if persisted.
- JSON blobs can become messy if schema versioning is skipped.
- User ownership must be solved before any public beta path.

Scope risks:

- Persistence may invite save-state UX, history, undo, sync, auth, and dashboard changes.
- The slice can drift into `/today` migration before the manual loop is validated.

Mitigation:

- Persist only normalized progress input.
- Recompute everything else.
- Keep the first persistence version founder-only and narrow.

## 11. Recommended Next Implementation Task

Recommended next task:

```txt
Improve the local-only /founder-beta manual panel grouping and labels.
```

Scope:

- Group controls into Time, Manual Readiness Estimates, Weak Areas, and Completed Missions.
- Add helper text for completed mission behavior.
- Use shorter mission labels if available.
- No persistence.
- No POST.
- No Prisma.
- No server actions.

Reason:

The persistence shape is now clear enough. The remaining blocker is whether the local UI fields are understandable enough to save later.
