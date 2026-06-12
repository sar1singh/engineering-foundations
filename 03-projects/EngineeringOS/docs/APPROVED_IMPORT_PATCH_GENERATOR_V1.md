# Approved Import Patch Generator V1

Date: 2026-06-11

## Purpose

Convert approved review-queue candidates into reviewable patch files without directly modifying canonical data files.

## Scope

Patch generation only. No autonomous publish, no direct writes to `master-topics.ts`, `source-catalog.ts`, or `capabilities.ts`. No persistence, no Prisma, no auth, no SaaS/deployment, no AI evaluation, no scraping/crawling, no bulk ingestion.

## Output Convention

Generated patch preview path:
```
data/ingestion/generated/approved-import-patch.preview.json
```

Patches are returned as serialized JSON strings in tests and service calls. No automatic file writes.

## Patch Types

Defined in `src/types/ingestion-patch.ts`:

- `ApprovedImportCandidate` — review-queue candidate ready for patch generation
- `ImportPatch` — full patch document with entries, conflicts, and report
- `TopicPatchEntry` — patch entry for adding/updating a topic
- `SourcePatchEntry` — patch entry for adding/updating a source
- `CapabilityPatchEntry` — patch entry for adding/updating a capability
- `PatchConflict` — detected conflict with existing canonical data
- `PatchValidationResult` — validation errors/warnings for a generated patch
- `PatchGenerationReport` — summary counts for a patch generation run

## Patch Generator Service

Defined in `src/lib/services/approved-import-patch-generator.ts`:

### Functions

- `generatePatchFromApprovedCandidates(candidates)` — converts approved candidates into a patch document
- `validatePatch(patch)` — validates patch structure and checks for errors
- `detectPatchConflicts(patch)` — returns conflicts from the patch
- `summarizePatch(patch)` — returns generation report summary
- `serializePatch(patch)` — produces stable JSON string
- `buildSourceEntry(candidate)` — builds a source patch entry from a candidate
- `checkForConflict(sourceId, url)` — checks for source ID/URL conflicts against catalog
- `getPatchOutputPath()` — returns canonical output path

### Rules

- Only approved candidates generate patch entries
- Duplicate-risk candidates require explicit `overrideDuplicateRisk: true`
- Rejected/needs-changes/pending candidates are excluded (filtered at caller level)
- No canonical file mutation
- Same URL across multiple candidates is deduplicated
- Source IDs derived from URL domain and path
- Topic IDs derived from candidate title
- Unknown source types reduced to `engineering-blog`

## Tests

Defined in `src/lib/services/approved-import-patch-generator.test.ts`:

- 26 tests covering:
  - Approved candidate creates topic/source patch entries
  - Pending/rejected/needs-changes excluded (caller-level filtering)
  - Duplicate-risk requires override flag
  - Duplicate-risk with override generates entries
  - Conflict detection (existing source ID, existing URL)
  - Patch summary counts
  - Serialization stability
  - Validation errors and warnings
  - Canonical files not modified
  - Output path convention

## UI

A "Patch Preview" section is shown in `IngestionAgentPreview.tsx` when approved candidates exist. Displays:

- Summary counts (processed, skipped, entries, conflicts)
- Source and topic entry breakdown
- Conflict warnings/errors
- JSON preview toggle
- Path hint for expected output location
- No apply button

## Next Phase

Recommended: Pack 10H — Manual Patch Application Review / First Approved Import.
