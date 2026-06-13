# Pack 11F Baseline Stabilization

Status: complete.

Date: 2026-06-13

## Scope

Stabilize the Pack 11F baseline before Pack 11G. This phase does not start controlled canonical graph import and does not modify canonical graph import behavior.

## Fixes Applied

- Fixed `IngestionAgentPreview.tsx` lint failure by replacing render-time ref reads with state-backed candidate metadata.
- Removed an unused `summary` memo from `IngestionAgentPreview.tsx`.
- Updated stale source-count expectations from `217` to `221` in `content-registry.test.ts`.
- Updated mission time-budget expected order to include the legitimate `mission-cloud-security-review` addition.
- Replaced stale `import-review-service.test.ts` fixture usage with a stable synthetic unique candidate. The old first-import candidate is now already in the catalog, so patch generation correctly skips it.

## Failure Audit

### Stale Test Count After Legitimate Data Changes

- `content-registry.test.ts`: expected `217` sources, actual `221`.
  - Category: stale test count.
  - Action: updated expected count to `221`.

- `founder-beta-mission-selection-service.test.ts`: expected 23 missions under 60 minutes, actual includes `mission-cloud-security-review`.
  - Category: stale test expectation after legitimate mission addition.
  - Action: updated deterministic expected order.

### Stale Import Review Fixture

- `import-review-service.test.ts`: 12 failures caused by `mockCandidates[0]` generating an empty patch after prior legitimate catalog import.
  - Category: stale fixture after legitimate data changes.
  - Action: added `reviewCandidate`, a unique synthetic candidate, for review workflow tests.
  - Behavior unchanged: duplicate/known catalog checks still use historical fixture data where relevant.

### Pre-existing And Accepted

- Playwright/Vitest collection failures in `tests/e2e/*.spec.ts` when run through Vitest.
  - Category: pre-existing test runner boundary issue.
  - Action: accepted for this phase; do not fix in Pack 11F stabilization unless the project chooses to exclude Playwright files from Vitest or split test commands.

## Real Regressions Found

None.

## Safety

No canonical graph import files were modified.

No product behavior was changed except the safe React state fix in `IngestionAgentPreview.tsx`, which preserves the same approved-candidate metadata behavior without reading refs during render.

## Pack 11G Readiness

Pack 11G is safe to start after this baseline, subject to keeping Pack 11F in-memory preview as the validation gate before any controlled canonical patch work.

## Validation

- `npm run typecheck`: passed.
- `npm run lint`: passed with 32 pre-existing warnings and 0 errors.
- Focused service/count/import-review audit tests: 65 passed.
- `npm run test`: 1089 tests passed; 8 Playwright E2E suites still fail during Vitest collection.
