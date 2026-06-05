# Founder Beta Manual Progress Internal UX Pass

Date: 2026-06-05

## Purpose

Review the `/founder-beta` manual progress panel across:

- `/founder-beta`
- `/founder-beta?demo=1`
- `/founder-beta?demo=weak-area`

Verdict:

```txt
Good enough for internal validation.
Not ready for persistence.
Needs clearer grouping and friendlier labels before saving real progress.
```

## 1. Is The Page Understandable?

Mostly yes for an internal builder/user.

The page communicates the core loop:

```txt
manual progress draft
→ recalculated Today Plan
→ readiness snapshot
→ hard gates
→ next actions
```

The default, demo, and weak-area modes are useful for validating different plan states without persistence.

Main issue:

- The page still exposes internal model language such as mission IDs, capability IDs, and readiness scores.
- It is understandable to the founder/operator, but not yet polished enough for a broader user.

## 2. Is The Manual Panel Too Noisy?

Slightly.

The panel is acceptable for internal validation, but the completed missions list can become visually heavy because mission objective text is long.

Before persistence:

- Reduce visual weight of completed mission controls.
- Consider showing mission type, topic, and short title rather than full objective.
- Keep the number of controls small.

Do not add more fields yet unless they are necessary for validating the next persistence model.

## 3. Are Readiness Controls Grouped Clearly?

Partially.

The readiness controls are present and now include:

- Architect Readiness.
- AWS Readiness.
- Behavioral Readiness.
- Communication Readiness.
- Resume Readiness.

This matches the hard-gate model better than the previous version.

Remaining issue:

- Readiness controls sit beside time controls. They should be visually grouped as "Manual readiness estimates" before persistence.
- The helper copy is useful, but it should appear directly under the readiness group, not feel like generic panel copy.

## 4. Are Mission Controls Clear?

Partially.

Completed mission checkboxes work for validation, but they are not yet a user-friendly progress model.

Risks:

- Mission objectives are long.
- There is no visible explanation of what checking a mission does.
- Completed missions can change the selected primary mission, but that relationship may not be obvious.

Before persistence:

- Add a short line: "Marking a mission complete removes it from selection."
- Use shorter mission labels or include mission type badges.

## 5. Is "Local Draft Only" Clear?

Yes.

The label is visible and the panel copy says changes update only the page and are not saved.

This is enough for internal validation.

Before persistence:

- Keep the local-only label until actual save behavior exists.
- Do not introduce "saved", "synced", or "profile" language yet.

## 6. Is The Helper Copy Enough?

Yes for now.

The helper copy correctly says:

```txt
These are manual draft estimates for internal validation.
They are not persisted and are not final evaluated readiness scores.
```

This reduces fake authority around readiness values.

Before persistence:

- Keep this copy visible near readiness controls.
- Add proof/rubric context only when proof scoring becomes editable.

## 7. What Must Improve Before Persistence?

Required before persistence:

- Group controls into clearer sections:
  - Time.
  - Manual readiness estimates.
  - Weak areas.
  - Completed missions.
- Replace raw/long mission objective labels with shorter labels.
- Explain what completed mission and weak-area selections do.
- Keep validation warnings visible near the controls.
- Decide whether readiness values are manually saved, derived from proof, or both.
- Define the persistence shape from the existing progress adapter, not from UI-specific state.

Persistence should store normalized progress input, not arbitrary component state.

## 8. What Should Not Be Built Yet?

Do not build:

- Prisma schema changes.
- Save buttons.
- POST routes.
- Server actions.
- Auth/user ownership.
- AI scoring.
- Proof submission forms.
- Case-study upload/review workflow.
- Offer pipeline tracker.
- `/today` migration.
- Public beta workflows.
- Full UI redesign.

## Recommended Next Task

Recommended next task:

```txt
Create a persistence planning doc for founder beta manual progress.
```

The doc should define:

- What exact normalized fields can be persisted later.
- What remains derived.
- What remains static.
- What should never be saved from component-local state.
- The no-Prisma implementation sequence for one more local validation pass.
