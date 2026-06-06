# Founder Beta Completion Roadmap

Date: 2026-06-06

## Purpose

This roadmap defines the complete path from the current state to Founder Beta Complete.

It assumes validation has not occurred yet.

## Current State

Complete:

- Founder Beta static data and contracts
- deterministic query/readiness/mission/orchestration/facade services
- `/founder-beta` page
- file-backed local progress persistence
- save/load/reset
- onboarding initialization preview
- onboarding save/overwrite protection
- minimal `/onboarding` handoff
- validation run plan
- instrumentation review and future decision planning

Not complete:

- real founder validation
- validation results review
- proof scoring UX
- evaluated readiness
- final Founder Beta exit review

## Remaining Phases

### Phase 1: Founder Validation Execution

Run either:

- 7-day validation, or
- 14-day validation

Inputs:

- `docs/FOUNDER_BETA_VALIDATION_RUN_PLAN.md`
- `docs/FOUNDER_BETA_VALIDATION_INSTRUMENTATION_REVIEW.md`

Exit artifact:

```txt
docs/FOUNDER_BETA_VALIDATION_RESULTS_REVIEW.md
```

Gate:

- Do not implement proof scoring, evaluated readiness, Prisma, AI, source ingestion, or dynamic roadmaps before this review.

### Phase 2: Post-Validation Decision

Use:

- `docs/FOUNDER_BETA_POST_VALIDATION_DECISION_TREE.md`

Choose one path:

- success -> proof scoring UX or small completion polish
- partial success -> focused validation fix pack
- failure -> core loop repair planning

Gate:

- The next implementation must be justified by validation evidence.

### Phase 3: Proof Scoring UX, If Proven

Use:

- `docs/FOUNDER_BETA_PROOF_SCORING_UX_PLAN.md`

Build only if validation shows proof capture is needed.

Goal:

- record proof score inputs
- keep readiness derived
- avoid AI evaluation

Gate:

- proof scores must be usable before evaluated readiness begins.

### Phase 4: Evaluated Readiness, If Proven

Use:

- `docs/FOUNDER_BETA_EVALUATED_READINESS_PLAN.md`

Build only after proof scoring produces evidence.

Goal:

- derive readiness from proof inputs
- keep manual estimates separate
- keep hard gates explainable

Gate:

- evaluated readiness must not persist derived outputs.

### Phase 5: Completion Review

Use:

- `docs/FOUNDER_BETA_EXIT_CRITERIA_FINAL.md`

Create:

```txt
docs/FOUNDER_BETA_COMPLETION_REVIEW.md
```

The review must decide:

- Founder Beta complete
- complete after small UX fix
- incomplete because proof scoring is required
- incomplete because evaluated readiness is required
- incomplete because mission selection is not useful
- incomplete because persistence or onboarding blocks usage

## Dependencies

Validation execution depends on:

- current `/founder-beta` implementation
- local file-backed persistence
- manual founder note-taking

Proof scoring depends on:

- validation evidence
- stable proof score rubric
- missions that produce proof artifacts

Evaluated readiness depends on:

- proof scoring UX
- proof artifacts
- stable readiness rules

Prisma migration depends on:

- stable normalized progress shape
- evidence that file-backed storage blocks progress
- future auth or multi-user need

## Decision Gates

Do not skip these gates:

1. Validation run before new feature work.
2. Validation results review before proof scoring or UX changes.
3. Proof scoring before evaluated readiness.
4. Evaluated readiness before AI evaluation.
5. Stable founder beta loop before Prisma/auth/SaaS.

## Validation Gates

Founder Beta cannot be complete unless:

- founder uses `/founder-beta` consistently
- primary missions are executed
- manual progress updates are tolerable
- persistence is reliable
- readiness/hard gates are useful draft signals
- at least one architecture case study or career asset advances
- next implementation choice is evidence-backed

## Explicit Non-Goals Before Completion

- Prisma
- AI evaluation
- source ingestion runtime
- dynamic roadmaps
- auth
- payments
- deployment
- multi-user SaaS
- broad role expansion
- derived-output persistence

## Recommended Next Phase

```txt
Founder Beta Validation Run Execution and Results Review
```

Recommended artifact:

```txt
docs/FOUNDER_BETA_VALIDATION_RESULTS_REVIEW.md
```
