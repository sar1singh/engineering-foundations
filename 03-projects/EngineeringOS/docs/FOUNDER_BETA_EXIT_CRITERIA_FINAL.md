# Founder Beta Exit Criteria Final

Date: 2026-06-06

## Purpose

This document defines the conditions required to declare Founder Beta complete.

Founder Beta is not complete yet. Validation has not occurred yet.

## Completion Definition

Founder Beta is complete when EngineeringOS proves the founder can repeatedly use `/founder-beta` to move toward Solution Architect readiness through a stable daily loop:

```txt
Open /founder-beta
-> understand Today's Primary Mission
-> execute meaningful work
-> update normalized progress input
-> save locally
-> see derived readiness/next actions update
```

## Required Founder Validation Outcomes

Required validation outcomes:

- Sarwan completes either the 7-day or 14-day validation run.
- `/founder-beta` is used on at least 70% of planned validation days.
- Primary Mission is executed on at least 50% of planned validation days.
- At least one weak-area or revision action proves useful.
- At least one architecture case study or career asset materially improves.
- Manual progress updates are tolerable enough for continued founder use.
- Save/load/reset behavior is trusted.
- Readiness and hard gates guide behavior without pretending to be final evaluated scores.
- Founder can identify the next evidence-backed implementation step.

## Required UX Quality Level

Founder Beta UX is sufficient when:

- the Primary Mission is visible and understandable quickly
- optional missions do not create choice overload
- manual readiness estimates are clearly draft-only
- save, overwrite, and reset are understandable
- onboarding handoff points to the right place without duplicating state
- the page can be used daily without redesign-level friction
- the founder knows what to update after executing a mission

Founder Beta UX is not required to be public-grade, polished, or multi-user-ready.

## Required Persistence Quality

Persistence is sufficient when:

- save works
- load works after reload
- reset works
- malformed/missing local storage falls back safely
- only normalized progress input is persisted
- derived outputs remain derived
- file-backed storage is enough for founder validation

Persisted state must remain limited to:

- completed/skipped mission IDs
- completed topic IDs
- weak area capability/topic IDs
- manual readiness scores
- proof scores
- available minutes
- day mode
- preferred mission types
- schema version, user ID, and timestamps

Do not persist:

- Today Plan
- readiness snapshot
- hard gates
- roadmap projection
- primary mission
- optional missions
- next actions
- recommendations
- static Founder Beta seed data

## Required Product Quality

Founder Beta is complete when the current loop proves:

- the Founder Beta path is coherent for Solution Architect readiness
- EM-aware Lead Backend support remains secondary and not distracting
- Daily Mission flow reduces planning friction
- readiness and hard gates identify useful blockers
- persistence supports continuity across sessions
- next build decisions can be made from evidence instead of speculation

## Explicitly Out Of Scope

Out of scope for Founder Beta completion:

- Prisma migration
- auth
- payments
- deployment hardening
- multi-user SaaS
- public onboarding
- AI evaluation implementation
- runtime source ingestion
- resource discovery agents
- dynamic roadmaps
- full EM roadmap
- broad role expansion
- advanced analytics instrumentation
- persistence of derived outputs

## Final Exit Review

Before declaring Founder Beta complete, create:

```txt
docs/FOUNDER_BETA_VALIDATION_RESULTS_REVIEW.md
```

The exit review must choose one:

- Founder Beta complete
- Founder Beta complete after small UX fix
- Founder Beta incomplete because proof scoring is required
- Founder Beta incomplete because readiness evaluation is required
- Founder Beta incomplete because mission selection is not useful
- Founder Beta incomplete because persistence or onboarding blocks usage

## Current Verdict

Founder Beta is not complete yet.

Reason:

- The implementation is ready for founder validation, but real validation has not occurred yet.
