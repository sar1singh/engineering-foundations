# Manual URL Runtime Fetch Plan — Pack 9A

## Overview
This document defines the contracts and safety boundaries for a future
runtime‑fetch component that will let a user submit a single URL for
content ingestion. The component is deliberately constrained.

## Safety Constraints
- **No bulk crawling** – exactly one URL per request.
- **No scraping** – only the raw HTTP response body is retrieved.
- **No autonomous publishing** – the fetched content is only passed to
  the existing import pipeline (validation, mapping, review, approvals,
  preview).
- **Session‑only** – all state lives in the client React session until
  the user exits the app. No database or persistence layer is involved.

## respectRobotsTxt
Updated to safe default: `respectRobotsTxt = "manual-review-required"`
(was previously `false`; changed to respect site usage policies).

## Input Contract
- `url` – fully‑qualified HTTP/HTTPS URL
- `submittedBy` – user identifier
- `submittedAt` – ISO‑8601 timestamp
- `sourceType` – canonical source family
- `consent` – must be true
- Optional hints: `intendedCapabilityId`, `intendedSkillId`, `intendedTopicId`, `notes`

## Fetch Boundary
See `FetchBoundary` type in `src/lib/services/manual-url-fetch-contracts.ts`

## Output Contract
See `ManualUrlFetchResult` type in `src/lib/services/manual-url-fetch-contracts.ts`

## Validation Helpers
See `src/lib/services/manual-url-fetch-validation.ts` for:
- `validateManualUrlInput()`
- `validateFetchBoundary()`
- `validateFetchOutput()`
- `assertNoBulkCrawl()`
- `assertAttributionPresent()`
- `assertAllowedProtocol()`
- `assertNoPrivateNetworkUrl()`

## Next Step
Pack 9C — Manual URL Fetch UI + Candidate Preview Bridge
