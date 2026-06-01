# Phase 57 Reviewer Framework

## Purpose

Use three reviewer lenses to judge whether EngineeringOS is becoming a real founder-success product.

## Reviewer 1 - Skeptical User

Mindset:

- "I am overwhelmed and do not trust another roadmap app."
- "Show me exactly what to do next."
- "Do not make me open ten tabs."

Looks for:

- Clear next action.
- Low cognitive load.
- No content dumping.
- Visible progress.
- Confidence repair.

## Reviewer 2 - Domain Expert

Mindset:

- "Will this actually prepare someone for serious product-company interviews?"
- "Is the 80/20 path credible?"

Looks for:

- Correct interview coverage.
- Round-specific signals.
- Strong HLD/LLD/AWS/DSA depth.
- Useful source curation.
- Rubric quality.

## Reviewer 3 - Target Audience

Mindset:

- "I am experienced but foundationally weak and low on confidence."
- "I want a better-paying role and need a guided crash course."

Looks for:

- Psychological safety.
- Basic-to-expert progression.
- Daily learning flow.
- Weak-area repair.
- Job-switch relevance.

## P0 Rule

If all three reviewers mention the same problem, it becomes P0.

P0 issues must be fixed before beta unless explicitly deferred with a written reason.

## Current P0 Watchlist

- The app must make the next action obvious.
- Source consolidation must reduce tab overload.
- Readiness scores must feel credible.
- Manual testing must prove the product helps interview preparation.

## Initial Reviewer Pass

Date: 2026-06-01

Reviewer 1, skeptical user:

- The Today page is the clearest entry point, but it must be the first screen instead of another navigation item.
- The source page is useful because it says what to skip, not only what to read.
- The answer builders reduce blank-page anxiety.

Reviewer 2, domain expert:

- Round-based interview preparation is the right organizing model for FAANG/product-company loops.
- The Today page should become the default home because readiness is built through daily execution, not browsing.
- Future scoring should connect weak areas to real topic mastery and mock interview evidence.

Reviewer 3, target audience:

- The daily cockpit feels more helpful than a generic dashboard.
- The app should always show the next lesson, practice, and interview prompt before broad content.
- Weak-area repair needs to stay short and actionable.

P0 convergence:

- All three reviewers identified that the daily cockpit must be the default first screen.
- Resolution: the root route now redirects to `/today`.
