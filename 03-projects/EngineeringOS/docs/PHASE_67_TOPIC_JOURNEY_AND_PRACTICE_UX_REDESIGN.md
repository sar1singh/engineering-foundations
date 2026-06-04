# Phase 67: Topic Journey and Practice UX Redesign

## Goal

Convert topic, course, code, and practice experiences from long stacked pages into guided learning workspaces that are easier to read, navigate, and use during manual study.

## Founder Feedback Covered

- Improve unreadable font color and low-contrast panels.
- Turn narration points into hint/accordion style learning blocks.
- Make external source references clickable.
- Redesign code example plus runner into a two-column workspace.
- Redesign practice prompts into structured cards with hints, thought process, and answer submission hidden behind intentional actions.
- Reduce long single-page scrolling by moving topic areas into section navigation.
- Replace fixed topic checklist with compact gamified progress/status signals.
- Make course cards start a guided journey with previous/next traversal.
- Make whole course/stage cards clickable while keeping topic names as readable chips.
- Avoid showing the same course syllabus twice on one page.
- Make practice accessible from topic pages and runnable-practice routes.

## Implementation Plan

1. Add a shared code-runner workbench component for full-width two-column code study.
2. Refactor topic pages around `section` navigation: learn, solution, code, practice, interview, review, references.
3. Add clickable source-ref cards using the existing source catalog.
4. Replace sticky checklist with compact readiness/status chips.
5. Convert solution narration to accordions.
6. Convert practice prompts to richer cards with expected signals, hints, starter code, and collapsible response forms.
7. Add `/courses/[courseSlug]` journey pages with stage accordions, progress icons, and previous/next lesson traversal.
8. Update course catalog and graph links to use guided course journey pages.
9. Validate with typecheck, lint, focused tests, build, smoke, and e2e.

## Notes

- The local runner remains browser JavaScript/TypeScript-shaped only. Node.js APIs are not enabled in public UI until a separate isolated execution service exists.
- This phase improves UX structure without changing the syllabus data contract.
