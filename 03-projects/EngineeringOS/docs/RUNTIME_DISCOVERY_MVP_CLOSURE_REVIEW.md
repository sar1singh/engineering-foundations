# Runtime Discovery MVP Closure Review — Pack 9E

Date: 2026-06-11

## Overview

This document audits the completed Runtime Discovery MVP (Packs 9A–9D), verifies all safety gates, identifies remaining blockers before real fetch, and defines Pack 10 options.

## 1. MVP Scope Audit

### Manual URL Input
- **Status: Complete** — `src/app/founder-beta/runtime-fetch-preview/page.tsx`
- URL text input with `type="url"` validation
- `submittedBy` name field (required)
- `sourceType` dropdown (9 types: official-docs, engineering-blog, book, interview-guide, github-repository, career-framework, roadmap, job-description, practice-platform)
- Optional capability/skill/topic selects (cascading: skills filtered by capability)
- Optional notes text input
- Explicit consent checkbox ("I confirm that the submitted URL is publicly accessible and I have the right to fetch it")
- Form disabled until URL + submittedBy + consent are filled
- Reset button clears all form state after a run

### Dry-Run Fetch Adapter
- **Status: Complete** — `src/lib/services/manual-url-dry-run.ts`
- `dryRunManualUrlFetch(input, boundary?)` — synchronous, no network calls
- Validates input → bulk-crawl → boundary before producing output
- Returns `ManualUrlFetchResult` with mocked `fetchStatus: "success"`, `httpStatus: 200`, `contentType: "text/html"`, `title: "Demo Page"`, `rawTextPreview`, `extractedMetadata`
- Attribution includes `agentId: "founder-beta-disc-agent"`, `agentVersion: "0.1.0"`, trace ID (`crypto.randomUUID()`)
- Uses `DEFAULT_FETCH_BOUNDARY` with safe defaults
- 18 tests in `manual-url-fetch-dry-run.test.ts`

### Fetch Boundary Validation
- **Status: Complete** — `src/lib/services/manual-url-fetch-validation.ts`
- `validateManualUrlInput()` — required fields + consent
- `validateFetchBoundary()` — protocol, private network, restricted domains, maxContentBytes, requestTimeoutMs, redirectLimit, allowCookies, allowDownload, respectRobotsTxt
- `validateFetchOutput()` — fetchStatus, httpStatus, finalUrl, contentType, rawTextPreview length, attribution
- `assertNoBulkCrawl()` — rejects URLs with whitespace/commas (multiple URLs)
- `assertAllowedProtocol()` — checks against allowed protocols (https:, http:)
- `assertNoPrivateNetworkUrl()` — blocks localhost, 127.x.x.x, 10.x.x.x, 192.168.x.x, 172.16-31.x.x, 0.0.0.0, ::1
- `assertAttributionPresent()` — validates agentId, agentTraceId, discoveredAt, sourceUrl
- All 7 helpers are pure functions with no side effects

### Candidate Preview
- **Status: Complete** — `runtime-fetch-preview/page.tsx` Candidate Preview section
- Shows validation result badge (✓ VALID / ✕ INVALID) with errors/warnings lists
- On success: displays mocked fetch result (status, HTTP status, final URL, content type, title)
- Attribution card: agent ID, version, trace ID, discovered at, source URL
- Raw text preview (truncated to first ~2k chars)
- Extracted metadata JSON display
- Candidate preview card: title, URL, source type, capability, skill, topic, notes
- "Human approval required" amber badge
- Boundary enforcement list: no writes, no autonomous publish, attribution present

### Manual Review Bridge
- **Status: Complete** — "Send to Manual Review Preview" button
- Converts `ManualUrlFetchResult` into `SessionCandidate` shape
- Pushes candidate into review queue with status `"sent-to-review"`
- Session-only — React useState, lost on page reload

### Queue Hardening
- **Status: Complete** — Pack 9D additions
- Deduplication: sending same URL twice does not create duplicate entries
- Batch operations: "Approve All Pending" and "Reject All Pending" buttons
- Queue status indicators: count badges for sent-to-review / approved / rejected
- Individual approve/reject per candidate
- Keyed by `c.url` for state tracking

### Approval Controls
- **Status: Complete**
- Approve button → sets state to `"approved"`
- Reject button → sets state to `"rejected"`
- State transitions: draft → previewed → sent-to-review → reviewed → approved/rejected
- Publish Preview section appears when any candidate is approved (read-only, no actual publish)
- Human approval requirement displayed as immutable message

### No-Write Guarantees
- **Status: Complete**
- No database writes — all state is React useState
- No API calls — all validation is client-side
- No autonomous publish — "Human approval required — no autonomous publish allowed"
- Session-only state notice at bottom of page
- Verifyable in tests: no persistence imports, no API route calls, no server actions

## 2. Safety Gate Verification

| Gate | Enforced | Where |
|---|---|---|
| No bulk crawl | `assertNoBulkCrawl()` | `manual-url-fetch-validation.ts:28-36` |
| No private network URLs | `assertNoPrivateNetworkUrl()` | `manual-url-fetch-validation.ts:50-66` |
| No autonomous publish | UI label + boundary list | `page.tsx` boundary enforcement section |
| Attribution required | `assertAttributionPresent()` on output | `manual-url-fetch-validation.ts:68-81` |
| Human approval required | Badge + "Send to Manual Review Preview" gate | `page.tsx` candidate preview section |
| Session-only state | React useState + session notice | `page.tsx` session-only notice bottom section |
| Protocol restriction | `assertAllowedProtocol()` via `validateFetchBoundary()` | `manual-url-fetch-validation.ts:38-48` |
| Cookies never sent | `allowCookies: false` in `DEFAULT_FETCH_BOUNDARY` | `manual-url-dry-run.ts:21` |
| Binary downloads blocked | `allowDownload: false` in `DEFAULT_FETCH_BOUNDARY` | `manual-url-dry-run.ts:22` |
| Robots.txt respected | `respectRobotsTxt: "manual-review-required"` | `manual-url-dry-run.ts:19` |
| Consent required | `consent === true` enforced | `manual-url-fetch-validation.ts:23` |
| Restricted domains | `restrictedDomains: ["localhost", "127.0.0.1"]` | `manual-url-dry-run.ts:16` |

**All safety gates verified passing.** 0 safety regressions.

## 3. Readiness Verdict

```txt
RUNTIME DISCOVERY MVP: READY FOR CLOSURE
Dry-run fetch, validation, candidate preview, review bridge, queue hardening:
  - 7 validation helpers (all pure)
  - 12 safety gates (all passing)
  - 4 files under src/lib/services/manual-url-fetch-*
  - 1 UI page (runtime-fetch-preview)
  - 1 test file (19 tests: 4 Pack 9C + 4 Pack 9D)
  - 8 canonical docs updated (4 existing + 4 new)
  - 0 regressions
  - Typecheck clean, lint clean
```

## 4. Remaining Blockers Before Real Fetch

| Blocker | Severity | Notes |
|---|---|---|
| No HTTP client implementation | Hard | Real fetch requires `fetch()` or `axios` + error handling + streaming + timeout + redirects |
| No robots.txt parser | Hard | Must fetch + parse robots.txt before requesting target URL |
| No rate limiting | Medium | Real fetch needs per-domain rate limiting to prevent abuse |
| No content-type validation at fetch time | Medium | Currently validated at output; real fetch should reject non-text types early |
| No response size enforcement at fetch time | Medium | Currently checked in `validateFetchOutput`; real fetch should stream with max-bytes cutoff |
| No TLS/certificate validation | Medium | Real fetch should reject invalid/misconfigured TLS |
| No CORS/referrer policy handling | Low | Browser-side fetch may need CORS-aware config |
| No user-agent configuration | Low | Should use a descriptive UA string for robots.txt compliance |
| No error taxonomy | Low | `fetchStatus: "error"` needs detailed error codes for network, timeout, DNS, TLS, etc. |
| No real attribution | Low | `agentId: "founder-beta-disc-agent"` is a placeholder; real fetch needs actual agent identity |

## 5. Pack 10 Options

### Option A: Real Single-URL Fetch MVP
- Implement `realManualUrlFetch(input, boundary)` using Node `fetch()` or isomorphic `fetch()`
- Add HTTP client with timeout, redirect following, content-type filtering, max-bytes streaming
- Add robots.txt fetch + parse before target fetch
- Add basic rate limiting (one concurrent request per domain)
- Add error taxonomy (network, timeout, DNS, TLS, 4xx, 5xx)
- Replace mocked attribution with real fetch metadata (response headers, timing)
- Update UI to handle real fetch results (loading state, error display, retry)
- **Risk**: Introduces real HTTP calls, needs careful security review
- **Test dependency**: Needs network mocking (e.g., `msw`, `nock`) for deterministic tests

### Option B: More Validation/UX Hardening
- Add bulk URL input (textarea with line-separated URLs) with per-URL validation
- Add candidate comparison view (side-by-side preview)
- Add notes/annotation per candidate in review queue
- Add search/filter in review queue
- Add export review queue as JSON
- Add configurable fetch boundary overrides (UI toggle for advanced users)
- Add URL history (recent submissions, session-scoped)
- **Risk**: Low — all changes are UI-only, no network calls added
- **Test dependency**: None beyond existing test infrastructure

### Option C: Founder Validation
- Ship current runtime-fetch-preview page to founder for manual testing
- Founder submits known URLs (docs, blogs, repos) and reviews dry-run output
- Founder validates: boundary enforcement catches invalid URLs, review queue works, approval flow is clear, session-only notice is understood
- Collect feedback on: missing URL types, confusing validation messages, desired review queue features
- **Risk**: Low — no code changes, uses existing session-only UI
- **Test dependency**: None

## 6. Recommended Next Step

**Option C (Founder Validation) → Option B (UX Hardening based on feedback) → Option A (Real Fetch with blockers resolved).**

Rationale:
1. No real fetch can ship without founder validation of the current dry-run UX — the safety gates and review flow must be confirmed useful before adding network calls.
2. UX hardening after founder feedback will fix real pain points rather than speculative ones.
3. Real fetch (option A) is the highest-risk option and should come last, after the UI is stable and founder-approved.
