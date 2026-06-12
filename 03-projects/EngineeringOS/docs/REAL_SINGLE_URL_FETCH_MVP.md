# Real Single-URL Fetch MVP — Pack 10A

Date: 2026-06-11

## Scope

Implements a real single-URL fetch adapter (`realManualUrlFetch`) using native `fetch()` with safety gates, and a UI mode toggle to switch between Dry Run and Real Fetch modes on the runtime-fetch-preview page.

## Files Created

- `src/lib/services/manual-url-real-fetch.ts` — `realManualUrlFetch(input, boundary)` async function with:
  - Reuses existing validation helpers (`validateManualUrlInput`, `assertNoBulkCrawl`, `assertAllowedProtocol`, `assertNoPrivateNetworkUrl`)
  - Timeout via `AbortController` with `boundary.requestTimeoutMs` (default 15s)
  - Redirect following with manual redirect count tracking (limit: `boundary.redirectLimit`, default 5)
  - Binary/download content-type blocking via denylist (application/octet-stream, application/pdf, application/zip, application/gzip, application/x-tar, application/vnd.*, image/*, audio/*, video/*)
  - Max-bytes enforcement on response text (truncation at `boundary.maxContentBytes` — 20 MiB default) with explicit error for oversized content
  - Error taxonomy using string codes: `"network-error"`, `"timeout"`, `"dns-error"`, `"tls-error"`, `"http-error"`, `"content-too-large"`, `"binary-content-blocked"`, `"redirect-limit-exceeded"`, `"unknown-error"`
  - Attribution with agent ID `"founder-beta-real-fetch-agent"` and version `"1.0.0"` including real response timing metadata
- `src/lib/services/manual-url-real-fetch.test.ts` — 15 tests with mocked `global.fetch`:
  - Invalid protocol blocked
  - Localhost/private IP blocked
  - Timeout via AbortSignal
  - Content size limit enforcement
  - Binary content-type blocked
  - Redirect limit exceeded
  - Successful HTML fetch with correct attribution
  - Error attribution (agent still present on errors)
  - No-autonomous-publish assertion (no side effects)

## Files Modified

- `src/app/founder-beta/runtime-fetch-preview/page.tsx` — added:
  - Fetch mode toggle between "Dry Run" (default) and "Real Fetch"
  - Real fetch execution button with disabled-while-loading state
  - Amber warning panel with explicit constraints for Real Fetch mode
  - Error display card for real fetch failures
  - Result flows into same Candidate Preview → Send to Manual Review Preview → Review Queue pipeline

## Safety Gates (Real Fetch Specific)

- Binary content blocked via MIME-type denylist before reading body
- Max-bytes enforced during body read (oversized = error, not silent truncation)
- Loading/error states prevent double-submit
- Redirect count tracked manually with hard limit (5)
- All existing 12 safety gates from dry-run also enforced

## No-Write Guarantees

- No database writes
- No persistence
- No autonomous publishing
- Human approval required
- Session-only state

## Test Status

- `npx tsc --noEmit`: 0 errors
- `npx eslint src --ext .ts,.tsx`: 0 errors (19 pre-existing warnings)
- `npx vitest run`: 791 passed (15 new), 8 pre-existing Playwright E2E infra failures, 0 regressions

## Next Phase

Pack 10B — Runtime Fetch Candidate Catalog Import Preview (bridge real fetch results into candidate catalog import pipeline, deduplicate against existing catalog, preview import candidates before commit)

## Candidate Catalog Import Preview — Pack 10B

Date: 2026-06-11

### Files Created

- `src/lib/services/manual-url-candidate-bridge.ts` — bridge service that:
  - `buildCandidateFromFetchResult(fetchResult, submission, candidateId?)` — converts a `ManualUrlFetchResult` + form submission into a `RawContentCandidate` with correct tier/discoveryMethod/attribution/confidence defaults
  - `checkDuplicateInCatalog(url, title?)` — checks the source catalog for exact URL matches, domain matches, and exact title matches
  - `previewCandidateImport(fetchResult, submission)` — combines candidate building, validation (`validateContentCandidate`), duplicate detection, and human approval gating into a single `CandidateImportPreview` result
- `src/lib/services/manual-url-candidate-bridge.test.ts` — 17 tests covering:
  - Candidate building from success/error fetch results
  - Fallback handling (missing title, missing finalUrl, no attribution)
  - Custom candidate ID preservation
  - Exact URL, domain, and title duplicate detection
  - Case-insensitive URL matching
  - No-duplicate for unknown URLs
  - Full preview with validation pass/fail
  - Human approval requirement triggers

### Files Modified

- `src/app/founder-beta/runtime-fetch-preview/page.tsx` — added:
  - Import of `previewCandidateImport` from the bridge service
  - `useMemo`-derived `candidateImportPreview` computed from current state
  - "Candidate Import Preview" section showing:
    - All candidate fields (ID, title, URL, sourceType, tier, category, discoveryMethod, discoveredBy, confidence, description)
    - Validation pass/fail with error/warning lists
    - Duplicate detection results with match type (url/domain/title), source title, and catalog ID
    - Human approval requirement badge

### No-Write Guarantees (Pack 10B)

- No database writes
- No persistence
- No candidate catalog import — preview only
- Session-only state

### Test Status (Pack 10B)

- `npx tsc --noEmit`: 0 errors
- `npx eslint src --ext .ts,.tsx`: 0 errors (19 pre-existing warnings, unchanged)
- `npx vitest run`: 793 passed (17 new bridge tests), 8 pre-existing Playwright E2E infra failures, 0 regressions
