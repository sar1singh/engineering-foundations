# Founder Beta Post Validation Decision Tree

Date: 2026-06-06

## Purpose

This document defines how to choose the next implementation path after the Founder Beta validation run.

Validation has not occurred yet. Do not use this document to infer results.

## Decision Inputs

After validation, review:

- usage days
- primary missions executed
- optional missions used
- weak-area repair usefulness
- save/load/reset reliability
- manual progress friction
- readiness/hard-gate clarity
- proof artifact needs
- onboarding setup friction
- case-study progress
- founder trust in `/founder-beta`

## If Validation Succeeds

Definition:

- `/founder-beta` is used consistently.
- Primary Mission reduces planning friction.
- manual progress updates are tolerable.
- persistence is reliable.
- readiness/hard gates are useful enough as draft signals.
- founder wants evidence capture or proof scoring next.

Implementation path:

1. Create `docs/FOUNDER_BETA_VALIDATION_RESULTS_REVIEW.md`.
2. Add minimal Proof Scoring UX if evidence capture is the strongest need.
3. Keep readiness output derived.
4. Continue file-backed persistence unless Prisma is clearly needed.
5. Do not add AI evaluation until proof capture is stable.

Likely next implementation:

```txt
Founder Beta Proof Scoring UX Phase 1
```

## If Validation Partially Succeeds

Definition:

- `/founder-beta` is useful sometimes.
- Primary Mission is directionally valuable.
- one or two friction points block daily use.
- manual progress or onboarding is too noisy, but the model is not wrong.

Implementation path:

1. Create `docs/FOUNDER_BETA_VALIDATION_RESULTS_REVIEW.md`.
2. Pick the smallest proven blocker:
   - manual progress UX cleanup
   - clearer onboarding initialization
   - mission-selection copy improvements
   - weak-area control simplification
   - save/reset clarity
3. Fix only the validated blocker.
4. Rerun a shorter validation cycle.

Likely next implementation:

```txt
Founder Beta Validation Fix Pack
```

## If Validation Fails

Definition:

- founder does not use `/founder-beta`
- Primary Mission does not guide useful work
- readiness/hard gates feel fake or distracting
- manual progress is too burdensome
- the founder needs a different workflow to execute

Implementation path:

1. Create `docs/FOUNDER_BETA_VALIDATION_RESULTS_REVIEW.md`.
2. Do not add Prisma, AI, source ingestion, or dynamic roadmaps.
3. Diagnose whether the failure is:
   - mission selection
   - UX clarity
   - content insufficiency
   - proof/evidence gap
   - onboarding setup
   - wrong validation workflow
4. Update the smallest planning artifact needed.
5. Implement only one corrective slice.

Likely next implementation:

```txt
Founder Beta Core Loop Repair Planning
```

## Special Decision Gates

### Move To Proof Scoring UX

Proceed if:

- founder completes missions but needs evidence capture
- manual readiness estimates feel insufficient
- proof artifacts are naturally produced

Do not proceed if:

- primary mission is not useful yet
- founder is not executing missions

### Move To Evaluated Readiness

Proceed if:

- proof scoring exists
- enough proof artifacts exist
- rubrics are stable

Do not proceed if:

- readiness is still based only on manual estimates

### Move To Richer Onboarding

Proceed if:

- setup is the primary blocker
- founder struggles to choose weak areas/readiness/time

Do not proceed if:

- daily execution is the blocker

### Move To Prisma

Proceed if:

- file-backed storage blocks real usage
- normalized progress shape is stable
- multi-device, relational queries, or auth-linked ownership are required

Do not proceed if:

- local founder validation remains sufficient

## Default Recommendation

Until validation data exists, the default next phase remains:

```txt
Founder Beta Validation Run Execution and Results Review
```
