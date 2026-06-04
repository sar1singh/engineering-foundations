# Phase 66 - Premium Learning UX Correction

## Goal

Close the highest-ROI UI gaps found after the Phase 65 audit. Phase 65 made the app modern, but the experience still felt too dense and internal. Phase 66 pushes the product closer to a guided learning OS inspired by roadmap.sh, LeetCode, Horizon UI, and polished SaaS admin products.

## Scope

- Redesign `/syllabus` as a guided catalog:
  - role/course-first tabs
  - curated path cards before raw topic browsing
  - compact featured topics
  - raw catalog behind optional expanded sections
- Convert `/graph` from a vertical timeline into a branch-style roadmap canvas.
- Convert `/practice/[taskId]` into a LeetCode-style split workspace:
  - problem context
  - tabs/sections for hints, edge cases, criteria, starter, harness
  - runner as the primary right-side workspace
  - rubric and review below
- Refocus `/dashboard` around Today's Mission:
  - primary daily action first
  - mission metrics and next steps above dense analytics
  - analytics moved into collapsible sections
- Premium visual pass:
  - stronger typography
  - card accents
  - badges
  - empty states
  - less repetitive long-page scanning

## Non-Goals

- No paid templates.
- No real auth provider.
- No new graph/canvas library.
- No Azure.
- No curriculum contract changes.

## Acceptance Criteria

- Syllabus no longer opens as an endless wall of cards.
- Graph visibly reads as branching roadmap, not only a timeline.
- Practice page feels closer to LeetCode/NeetCode than an internal form page.
- Dashboard first viewport prioritizes "what should I do today?"
- Existing quality and E2E contracts still pass or are updated only to reflect stronger UX semantics.
