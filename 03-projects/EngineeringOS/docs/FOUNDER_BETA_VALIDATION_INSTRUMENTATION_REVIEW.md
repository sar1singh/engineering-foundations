# Founder Beta Validation Instrumentation Review

Date: 2026-06-06

## Purpose

This review defines what can be observed during the Founder Beta validation run without adding new instrumentation, analytics, Prisma, AI evaluation, source ingestion, dynamic roadmaps, auth, deployment, payments, or multi-user SaaS.

Validation has not occurred yet. This document prepares the run; it does not report outcomes.

## What Signals Are Currently Observable

The current `/founder-beta` surface can already show and validate:

- selected Founder Beta path
- derived Today Plan
- primary mission
- optional missions
- readiness snapshot
- hard gate status
- next actions
- validation warnings for ignored/unknown progress input IDs
- local draft manual progress values
- saved local progress values after reload
- reset behavior
- default, demo, and weak-area modes
- onboarding initialization preview
- onboarding save and overwrite confirmation

The current file-backed local progress store can also be inspected directly during development to confirm only normalized progress input is saved.

## What Signals Are Missing

Missing signals:

- real mission completion history with timestamps
- time-to-start after opening `/founder-beta`
- whether the founder actually executed the mission outside the app
- proof artifacts for HLD, LLD, AWS, case studies, resume, or behavioral answers
- proof scoring per task
- evidence-backed readiness
- failed/skipped mission reason
- perceived usefulness rating
- perceived confusion rating
- manual notes per day
- before/after readiness rationale
- case-study artifact completion quality

These should be collected manually during validation rather than instrumented in the app yet.

## What Can Be Measured Manually

Sarwan can manually record:

- date
- available minutes
- day mode
- primary mission shown
- primary mission executed or not executed
- optional missions used or ignored
- weak areas updated
- readiness estimates changed
- reason for readiness changes
- whether hard gates felt useful
- whether the plan reduced planning time
- confusion points
- completed proof/case-study artifacts
- save/load/reset issues
- decision-gate recommendation after each week

Recommended manual capture location:

- external notes file, journal, spreadsheet, or a later `docs/FOUNDER_BETA_VALIDATION_RESULTS_REVIEW.md`.

Do not add a new notes model before validation proves it is necessary.

## What Should Not Be Instrumented Yet

Do not instrument yet:

- analytics events
- telemetry pipelines
- database event tables
- session replay
- click tracking
- time tracking
- automatic readiness evaluation
- AI proof review
- source usage tracking
- multi-user attribution
- cloud logging

Reason:

- Founder validation needs product signal, not analytics infrastructure.
- Adding instrumentation now would increase surface area before the core loop is proven.
- The founder can manually record enough signal for the next decision.

## Founder Validation Metrics

Primary validation metrics:

- usage days: target 5 of 7 or 10 of 14
- primary missions executed: target 3 of 7 or 7 of 14
- weekly planning friction: target less than 5 minutes to decide what to do
- optional mission usefulness: at least one revision or weak-area action helps
- persistence reliability: save/load/reset works without confusion
- readiness clarity: hard gates and readiness estimates guide behavior without feeling final or fake
- founder trust: `/founder-beta` becomes the daily launch point

Secondary validation metrics:

- architecture case-study progress
- resume/career asset progress
- number of confusing controls
- number of times founder bypasses the app
- number of times mission selection feels wrong
- number of times proof scoring is clearly needed

## Instrumentation Verdict

Current instrumentation is enough for manual founder validation.

Do not add runtime instrumentation until after the validation results review identifies a specific missing signal that cannot be captured manually.

## Recommended Next Step

Run the 7-day or 14-day Founder Beta validation using `docs/FOUNDER_BETA_VALIDATION_RUN_PLAN.md`, then create:

```txt
docs/FOUNDER_BETA_VALIDATION_RESULTS_REVIEW.md
```
