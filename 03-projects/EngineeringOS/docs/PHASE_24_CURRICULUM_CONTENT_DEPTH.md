# Phase 24 Curriculum Content Depth Pass

## Scope

Phase 24 started the curriculum depth pass with the JavaScript closures topic and its linked counter practice task.

This phase intentionally stayed local-first:

- Default data source remains `mock`.
- Prisma remains opt-in only.
- No dependency versions were changed.
- No Prisma schema changes or migrations were added.
- No destructive database commands were run.
- No Supabase, OpenAI, auth, billing, deployment, production database behavior, or external service integration was added.

## Content Updated

- Expanded the `js-closures` topic summary, why-it-matters copy, tags, prerequisites, related topics, advanced topics, learning modes, theory, mental model, code examples, production use cases, common mistakes, explain-back prompt, and completion criteria.
- Expanded the closures subtopic with a focused lexical-environment explanation and stronger completion criteria.
- Expanded the linked practice task `implement-counter-with-closure` with a concrete `createCounter(start = 0)` assignment, richer subtasks, starter code, solution approach, hints, edge cases, and completion criteria.
- Expanded the linked problem statement into `Closure Counter Factory` with examples, constraints, expected output, and test-case expectations.
- Updated the closures primary reference to the MDN closures guide.
- Updated the closures revision prompt and interview question to reinforce the same learning loop.

## Tests Added

Added `src/lib/services/curriculum-content-depth.test.ts`.

The test verifies:

- Topic Studio retrieves the expanded closures topic, subtopic, revision prompt, and reference.
- Practice Lab retrieves the richer closure counter task and problem statement.
- Content search surfaces the closures topic by `lexical-scope`, the linked task by `counter`, and the MDN reference by `closures`.

## Validation

Run after implementation:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run smoke:mock
npm run smoke:prisma
```

Result: all passed. `npm run test` passed with 12 test files and 34 tests.

## Remaining Gaps

- Only the closures slice has curriculum-grade depth. Most seeded topics still use representative template content.
- The local SQLite seed data was not regenerated in this phase, so Prisma mode may continue to show older seeded content until a safe, approved local seed refresh is performed.
- No real code execution engine exists for validating the counter implementation.
- No real AI evaluation exists for explain-back answers.
- Dependency audit remediation remains deferred to a separate dependency-maintenance phase.

## Recommended Next Action

Phase 25 should continue the curriculum depth pass with the next high-signal JavaScript topic, preferably `js-promises` or `js-event-loop`, using the same pattern:

- Expand one topic and its linked practice task.
- Keep architecture unchanged.
- Add focused service/search tests.
- Run full validation and route smoke checks.

## Suggested Commit Message

```txt
feat: deepen closures curriculum content
```
