# Founder Beta Proof Scoring UX Plan

Date: 2026-06-06

## Purpose

This is a planning-only document for a future proof scoring UX.

Do not implement this until founder validation shows that proof capture is the right next step.

## UX Concept

Proof Scoring UX should let Sarwan record evidence after completing meaningful work.

The UX should answer:

- What proof was attempted?
- Which mission/topic/capability does it support?
- What score was assigned?
- Why was that score assigned?
- What repair or revision should follow?

Proof scoring should not feel like a generic checkbox. It should feel like a lightweight review of competency.

## Inputs

Potential inputs:

- proof ID
- mission ID
- topic ID
- capability ID
- proof type
- proof score `0-5`
- short evidence note
- optional artifact link or file path
- optional reviewer note
- optional repair action

Proof score scale:

- `0` Not Attempted
- `1` Attempted
- `2` Partial
- `3` Acceptable
- `4` Strong
- `5` Interview Ready

## Proof Score Workflow

Recommended workflow:

1. Founder completes a mission.
2. Founder opens proof scoring for that mission.
3. Founder selects or confirms proof type.
4. Founder assigns `0-5` score.
5. Founder adds a short rationale.
6. System derives updated readiness from proof input.
7. System injects repair/revision if score is low.

Low scores are not penalties. They are readiness signals.

## Required Contracts

Required future contracts:

- proof attempt input
- proof score input
- proof-to-mission mapping
- proof-to-topic mapping
- proof-to-capability mapping
- proof score rationale
- proof score timestamp
- proof revision recommendation

The current static seed data already includes proof concepts, but a proof scoring UX should not add a second readiness model.

## Persistence Rules

May persist later:

- proof score input
- proof rationale
- proof attempt timestamp
- optional artifact reference
- mission/topic/capability IDs

Must remain derived:

- Today Plan
- readiness snapshot
- hard gate status
- roadmap projection
- primary mission
- optional missions
- next actions
- proof-derived readiness rollups

## Risks

Risks:

- creating fake authority if proof scores are subjective but displayed as evaluated truth
- too much form friction after every mission
- scoring before proof rubrics are stable
- duplicating manual readiness estimates instead of replacing them gradually
- persisting derived readiness by accident

Mitigation:

- keep proof scoring small
- use clear draft/evidence language
- derive readiness from proof input rather than saving readiness output
- start with only a few proof types: HLD, AWS design, behavioral answer, resume/case study

## What Must Remain Deferred

Do not implement with Proof Scoring UX Phase 1:

- AI evaluation
- multi-reviewer workflow
- public sharing
- certificate/badge logic
- Prisma migration unless validation proves it is needed
- dynamic roadmap generation
- source ingestion

## Recommended Trigger

Build proof scoring UX only if founder validation shows:

- missions are being completed
- manual readiness estimates are not enough
- the founder naturally produces proof artifacts that need scoring
