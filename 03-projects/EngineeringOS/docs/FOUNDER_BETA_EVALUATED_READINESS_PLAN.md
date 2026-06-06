# Founder Beta Evaluated Readiness Plan

Date: 2026-06-06

## Purpose

This is a planning-only document for evolving from manual readiness estimates to evaluated readiness.

Do not implement evaluated readiness until founder validation and proof scoring produce enough evidence.

## Current State

Current readiness is derived from:

- static readiness rules
- manual readiness estimates
- completed work input
- weak areas
- proof score fields when provided manually

Current readiness is useful as a draft planning signal, not as final evaluated truth.

## Evaluated Readiness Definition

Evaluated readiness means readiness is calculated from evidence:

- proof attempts
- proof scores
- interview simulations
- case-study artifacts
- architecture reviews
- behavioral answers
- resume/career asset reviews

Evaluated readiness should explain:

- what evidence supports the score
- which capability is blocked
- what proof is missing
- what repair mission should come next

## Manual Estimates vs Evaluated Readiness

Manual estimates:

- quick
- subjective
- useful for founder validation
- not proof-backed
- should be labeled as draft estimates

Evaluated readiness:

- evidence-backed
- derived from proof attempts
- better for hard gates
- suitable for interview/application decisions
- requires stable proof scoring and rubrics

## Readiness Calculation Evolution

Phase 1: Manual estimates

- current state
- founder inputs rough readiness values
- system derives Today Plan from these inputs

Phase 2: Proof-assisted readiness

- proof scores become inputs
- manual estimates remain available as overrides or calibration notes
- readiness rollups include proof evidence

Phase 3: Evaluated readiness

- proof scores dominate readiness
- manual estimates become secondary
- hard gates reference evidence-backed categories

Phase 4: AI-assisted evaluation later

- only after proof artifacts and rubrics are stable
- AI may propose evaluations
- Sarwan remains reviewer for beta-critical readiness decisions

## Migration Strategy

Migration should be gradual:

1. Keep manual readiness estimates.
2. Add proof scoring UX when validation proves the need.
3. Store proof inputs, not readiness outputs.
4. Derive evaluated readiness from proof inputs.
5. Show manual and evaluated readiness separately during transition.
6. Only retire manual estimates after evaluated readiness is trusted.

## Persistence Rules

May persist later:

- proof attempts
- proof scores
- proof rationale
- artifact references
- reviewer status

Must not persist:

- evaluated readiness output
- hard gate output
- generated recommendations
- Today Plan
- roadmap projection output

## Risks

Risks:

- evaluated readiness may feel authoritative before evidence quality is high
- proof scoring may be inconsistent without rubrics
- AI evaluation may hide uncertainty
- manual and evaluated scores may conflict
- derived outputs may accidentally become persisted state

Mitigation:

- separate manual estimate from evaluated readiness
- show evidence and confidence
- keep hard gates explainable
- require proof scoring before AI evaluation
- keep readiness output derived

## Recommended Trigger

Start evaluated readiness implementation only if:

- founder validation succeeds or partially succeeds
- proof scoring UX exists
- proof artifacts are being captured
- manual estimates are the limiting factor

Until then, keep manual draft readiness estimates.
