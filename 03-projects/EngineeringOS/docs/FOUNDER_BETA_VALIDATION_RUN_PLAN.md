# Founder Beta Validation Run Plan

Date: 2026-06-06

## Purpose

This plan defines how Sarwan should use the current `/founder-beta` surface for a real founder validation run before adding richer onboarding, proof scoring UX, evaluated readiness, Prisma-backed persistence, AI evaluation, source ingestion, dynamic roadmaps, auth, payments, deployment, or multi-user SaaS.

The goal is to validate the core loop:

```txt
Saved normalized progress input
-> derived Today Plan
-> mission execution
-> manual progress update
-> recalculated readiness and next actions
```

The validation run must prove whether EngineeringOS reduces execution friction and improves Solution Architect readiness behavior, not whether every future feature exists.

## 1. Validation Run Options

### 7-Day Founder Validation

Use this when the goal is a fast signal on whether the current workflow is useful enough to continue.

| Day | Focus | Expected Usage |
| --- | --- | --- |
| Day 1 | Baseline setup | Open `/founder-beta`, reset local progress if needed, set available minutes, day mode, weak areas, and manual readiness estimates, then save local progress. |
| Day 2 | Primary mission execution | Review Today's Primary Mission, execute it outside the app, mark relevant work complete, adjust readiness estimates, and save. |
| Day 3 | Weak-area repair | Check whether optional missions and weak areas point to useful repair work. Update weak areas after execution. |
| Day 4 | Interview readiness | Execute an interview-style mission or communication mission. Adjust behavioral, communication, or architect readiness manually. |
| Day 5 | Career asset readiness | Work on resume positioning, STAR story, or case-study framing. Update Resume Readiness and relevant completed work. |
| Day 6 | Weekend deep work | Use weekend mode for a case study, HLD, LLD, AWS design, or architecture review mission. |
| Day 7 | Weekly review | Review whether the app made the next action obvious, whether manual updates were tolerable, and whether readiness/hard gates felt useful or fake. |

Minimum success for 7 days:

- Sarwan uses `/founder-beta` on at least 5 days.
- At least 3 primary missions are executed.
- At least 1 weak-area or revision action is executed.
- At least 1 career asset or architecture case-study action is advanced.
- The system reduces planning time instead of adding overhead.

### 14-Day Founder Validation

Use this when the goal is stronger confidence before adding persistence upgrades or evaluated readiness.

Week 1 follows the 7-day run.

Week 2 focuses on repeatability:

| Day | Focus | Expected Usage |
| --- | --- | --- |
| Day 8 | Recalibration | Update weak areas and readiness estimates based on Week 1 evidence. |
| Day 9 | Architect depth | Execute an HLD, AWS, or architecture tradeoff mission. |
| Day 10 | Backend depth | Execute a Node.js, database, caching, queue, rate limiting, or API design mission. |
| Day 11 | Communication | Practice a design explanation, behavioral story, stakeholder tradeoff, or leadership answer. |
| Day 12 | Interview simulation | Use the plan to guide a mock interview or self-recorded answer pass. |
| Day 13 | Weekend proof work | Complete or improve one architecture case study artifact. |
| Day 14 | Decision review | Decide whether the next build should improve UX, add proof scoring, add evaluated readiness, enrich onboarding, or move persistence to Prisma. |

Minimum success for 14 days:

- Sarwan uses `/founder-beta` on at least 10 days.
- At least 7 primary missions are executed.
- At least 2 weak-area or revision missions are executed.
- At least 1 architecture case study moves materially forward.
- The Today Plan continues to feel relevant after saved progress changes.
- The manual save/load/reset flow is reliable enough for founder use.

## 2. Daily Usage Workflow For `/founder-beta`

Daily workflow:

1. Open `/founder-beta`.
2. Review the Founder Beta path, Primary Mission, optional missions, readiness snapshot, hard gates, and next actions.
3. Set or adjust available minutes and day mode.
4. Update weak areas if the current mission feels misaligned.
5. Update manual readiness estimates only when there is a real signal from executed work.
6. Save local progress.
7. Execute the Primary Mission outside the app.
8. Return to `/founder-beta`.
9. Mark completed work or adjust readiness/weak areas.
10. Save local progress again.

Use reset only when starting a clean validation run.

Do not treat manual readiness estimates as final evaluated scores. They are internal validation inputs until proof scoring and evaluated readiness exist.

## 3. Manual Updates Each Day

Sarwan should update:

- `availableMinutes`
- `dayMode`
- completed mission IDs when a mission is actually done
- weak capability IDs when a capability feels blocked
- weak topic IDs if topic-level weakness is visible in the UI or fixture
- manual readiness estimates for Architect, AWS, Behavioral, Communication, and Resume readiness
- completed topic IDs when the visible flow supports it
- preferred mission types only when testing mission-selection behavior

Sarwan should keep notes outside the app for now:

- why a mission felt useful or not useful
- whether optional missions created focus or distraction
- whether readiness estimates felt meaningful
- whether hard gates changed behavior
- whether manual updates were too tedious

## 4. Signals That Prove The System Is Useful

Strong usefulness signals:

- Today's Primary Mission is obvious within 1 minute of opening the page.
- The founder spends more time executing than deciding what to do.
- Optional missions support revision or weak-area repair without creating choice overload.
- Hard gates clarify why application readiness is not yet recommended.
- Manual readiness updates change the plan in a way that feels rational.
- Saved local progress survives reloads and helps the next session continue smoothly.
- Reset allows clean validation runs without confusion.
- At least one architecture case study or career asset improves during the run.
- The founder starts trusting `/founder-beta` as the daily launch point.

## 5. Signals That Prove The System Is Confusing Or Premature

Confusion or premature-build signals:

- The founder ignores the Primary Mission and works from memory instead.
- Manual controls feel like bookkeeping rather than focus.
- Readiness estimates feel authoritative despite being manual drafts.
- Optional missions create execution paralysis.
- Weak areas do not influence useful mission selection.
- Hard gates feel disconnected from the work being done.
- Save, overwrite, or reset behavior creates uncertainty.
- The founder needs a separate explanation every day to use the page.
- The system needs evaluated proofs before readiness can be trusted.
- The founder cannot complete a meaningful mission without richer content or guidance.

## 6. What Must Not Be Built Until Validation Is Complete

Do not build during the validation run:

- Prisma migration for Founder Beta progress.
- AI evaluation.
- Runtime source ingestion.
- Resource discovery agents.
- Dynamic roadmap generation.
- Auth, payments, admin, deployment, or multi-user SaaS.
- Public onboarding.
- A second progress state model.
- Persistence of Today Plan, readiness output, hard gates, roadmap projection, primary mission, optional missions, next actions, or recommendations.
- Broad role expansion beyond Solution Architect with EM-aware support.
- Large UI redesigns.

## 7. Decision Gates After Validation

### Improve Manual Progress UX

Choose this if the founder uses `/founder-beta` consistently but manual edits are tedious, noisy, or unclear.

Evidence needed:

- The core loop is useful.
- Manual state entry is the main friction.
- Small UI changes would improve daily use without changing the model.

### Add Proof Scoring UX

Choose this if the founder completes missions and needs a better way to record evidence.

Evidence needed:

- At least several missions produce proof artifacts or reviewable answers.
- Manual readiness estimates are not enough.
- The 0-5 proof scoring rubric is ready to become a UI workflow.

### Add Evaluated Readiness

Choose this only after proof scoring is used enough to provide real evidence.

Evidence needed:

- Proof artifacts exist.
- Rubrics are clear.
- Readiness should be calculated from evidence rather than manual draft estimates.

### Add Richer Onboarding

Choose this if the initial setup is the biggest blocker.

Evidence needed:

- The founder struggles to choose weak areas, readiness estimates, or time settings.
- A diagnostic questionnaire would materially improve the first Today Plan.

### Move Persistence To Prisma

Choose this only if file-backed storage blocks founder validation or the product needs auth-linked, multi-device, relational, or production persistence.

Evidence needed:

- File-backed local storage is no longer enough.
- The normalized progress shape is stable.
- Derived-output boundaries are still respected.

## 8. Validation Checklist

Daily checklist:

- Open `/founder-beta`.
- Confirm Primary Mission is visible.
- Confirm optional missions are not distracting.
- Confirm readiness snapshot and hard gates are understandable.
- Update available time and day mode.
- Update weak areas if needed.
- Update manual readiness only with a real signal.
- Save local progress.
- Execute the Primary Mission.
- Return and update completed work.
- Save again.

End-of-run checklist:

- Did the page reduce planning time?
- Did the Primary Mission feel relevant most days?
- Did weak-area repair help?
- Did hard gates clarify application readiness?
- Did manual estimates feel like draft inputs rather than final truth?
- Did save/load/reset behave predictably?
- Did the founder complete more meaningful readiness work than without the app?
- Which next decision gate has the strongest evidence?

## 9. Recommended Next Implementation Phase

Recommended next phase:

```txt
Founder Beta Validation Run Execution and Results Review
```

Recommended output after the run:

```txt
docs/FOUNDER_BETA_VALIDATION_RESULTS_REVIEW.md
```

That review should summarize actual usage, completed missions, confusing moments, readiness-signal quality, persistence issues, and the next evidence-backed implementation choice.

Do not start proof scoring UX, evaluated readiness, Prisma, AI evaluation, source ingestion, or dynamic roadmaps until this validation run produces evidence for the next step.
