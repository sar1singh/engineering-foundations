# Readiness Scoring Model

## Purpose

EngineeringOS must separate learning progress from interview readiness and offer readiness.

Completing content does not mean being ready for interviews or offers.

## Strategy Anchor

- Product: Career Transformation Operating System for Engineers.
- Persona: 5-15 YOE engineers targeting Senior, Staff, Principal, Architect, Engineering Manager, product/GCC, or FAANG-level outcomes.
- First-customer outcome: help the founder/user build evidence-backed readiness for a 70-80+ LPA product/GCC outcome.
- MVP beta scope: readiness scoring for one complete beta path.
- Build sequence: add four-part topic readiness, roll up capability readiness, separate interview readiness, then separate offer readiness.
- Do not build yet: a single vanity progress score that hides interview or offer gaps.

## Topic Readiness

Each topic should track four dimensions:

- Knowledge Score: Can the learner explain the concept accurately?
- Practice Score: Can the learner solve relevant exercises or problems?
- Interview Score: Can the learner answer under interview conditions?
- Implementation Score: Can the learner apply it in a realistic system, codebase, design, or artifact?

Suggested MVP scale:

```txt
0 = Not started
1 = Exposed
2 = Practiced with help
3 = Can do independently
4 = Interview-ready / production-ready for target level
```

## Capability Readiness

Capability readiness is a weighted rollup of topic readiness, proof tasks, and target-role importance.

It should expose:

- Strong capabilities.
- Weak capabilities.
- Blocking topics.
- Missing proof tasks.
- Interview risk.
- Implementation risk.

## Interview Readiness

Interview readiness is separate from learning progress.

It should include:

- DSA round readiness.
- Machine coding / LLD readiness.
- HLD/system design readiness.
- Backend/AWS depth readiness.
- Behavioral/leadership readiness.
- Resume/project discussion readiness.
- Mock interview performance.

## Offer Readiness

Offer readiness tracks job-switch execution, not learning alone.

It should include:

- Resume.
- LinkedIn.
- Portfolio/proof-of-work.
- Target company list.
- Referral/networking pipeline.
- Application tracker.
- Compensation target clarity.
- Interview scheduling and follow-up state.

## Rollup Rule

Do not collapse everything into one misleading score.

The UI may show a summary, but the model must preserve:

- Learning progress.
- Topic readiness.
- Capability readiness.
- Interview readiness.
- Offer readiness.

## MVP Acceptance Criteria

- Topic completion is no longer binary-only.
- Four score dimensions exist in the model or docs before implementation.
- Interview readiness has its own view/model.
- Offer readiness has its own view/model.
- Today's Mission can use readiness gaps to choose work.

## Non-Goals

- A vanity readiness percentage without evidence.
- Scoring based only on page views or checked boxes.
- Mixing job-search artifacts into topic completion.
- AI-only evaluation without clear rubric.
