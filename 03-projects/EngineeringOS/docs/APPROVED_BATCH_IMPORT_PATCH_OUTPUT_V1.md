# Approved Batch Import Patch Output V1

Date: 2026-06-12

## Purpose

Produce a deterministic, serializable patch output from the approved entries in a batch import review package, ready for downstream consumption (inspection, diff, manual review, or eventual graph application).

## Scope

- Consumes `ApprovedImportPackage` after per-entry approve/reject decisions have been made via `approvePatchEntry`/`rejectPatchEntry`.
- Produces `ApprovedBatchPatchOutput` containing only approved entries, rollback notes, warnings, and structural metadata.
- Serializes to JSON for preview or file output.
- Output path: `data/ingestion/generated/approved-batch-import-patch.preview.json`.

## Design

### Separation of Concerns

The output service is called after the review bridge has created the `ApprovedImportPackage` and the user has made per-entry decisions. It does not replace or duplicate the bridge service — it consumes its output.

| Stage | Service | Produces |
|-------|---------|----------|
| Batch queue processing | `runtime-discovery-queue-service` | Queue items |
| Bridge to import review | `runtime-discovery-review-bridge` | `ApprovedImportPackage` + `ImportPatch` |
| Per-entry approval | `import-review-service` (approvePatchEntry/rejectPatchEntry) | Updated `ApprovedImportPackage` |
| Output generation | `approved-batch-patch-output-service` | `ApprovedBatchPatchOutput` |

### Functions

- **createApprovedBatchPatch(pkg)** — Filters `pkg.approvedEntries` for the output; also includes rejected/pending counts for transparency. Includes rollback notes per entry type and conflict warnings.
- **validateApprovedBatchPatch(output)** — Validates the output structure: checks for ID existence, warns on zero approved entries, reports error-level conflicts.
- **serializeApprovedBatchPatch(output)** — Deterministic JSON serialization with 2-space indent.
- **createPatchOutputFilename()** — Returns `approved-batch-import-patch.preview.json`.
- **summarizeApprovedBatchPatch(output)** — Returns the summary object (`{ totalEntries, approvedCount, rejectedCount, pendingCount, hasConflicts, hasWarnings, hasApprovedEntries }`).

### Output Type

```typescript
type ApprovedBatchPatchOutput = {
  id: string;
  title: string;
  description: string;
  sourcePatch: ImportPatch;
  approvedEntries: PatchEntry[];
  rejectedEntries: PatchEntry[];
  pendingEntries: PatchEntry[];
  conflicts: ImportConflict[];
  warnings: string[];
  rollbackNotes: string[];
  summary: {
    totalEntries: number;
    approvedCount: number;
    rejectedCount: number;
    pendingCount: number;
    hasConflicts: boolean;
    hasWarnings: boolean;
    hasApprovedEntries: boolean;
  };
  generatedAt: string;
  outputPath: string;
};
```

### Rollback Notes

Each approved source entry generates: `"Rollback: Remove source \"{sourceId}\" from source catalog."`

Each approved topic entry generates: `"Rollback: Remove topic \"{topicId}\" from master topics and remove all references."`

Conflict-based notes are added when present: `"Rollback note: N conflict(s) may require manual resolution during rollback."`

## Rules

- Only entries with `decision === "approved"` appear in `approvedEntries`.
- Duplicate-risk items are excluded at the bridge level (via `overrideDuplicateRisk` flag) — the output service works with whatever `approvedEntries` are present.
- No canonical writes of any kind — output is serialized only; preview-only.
- Deterministic output for same input (stable JSON serialization).

## Files

- `src/lib/services/approved-batch-patch-output-service.ts` — service implementation
- `src/lib/services/approved-batch-patch-output-service.test.ts` — 23 tests

## Tests (23)

| Area | Tests | Covering |
|------|-------|----------|
| createApprovedBatchPatch | 12 | approved entries included, non-approved excluded, duplicate-risk behavior, conflicts, rollback notes, warnings, structure, summary |
| validateApprovedBatchPatch | 3 | valid output, empty warning, conflict detection |
| serializeApprovedBatchPatch | 3 | valid JSON, stable output, keys present |
| createPatchOutputFilename | 2 | deterministic, correct name |
| summarizeApprovedBatchPatch | 1 | returns correct summary |
| no canonical writes | 2 | source catalog and master topics unmodified |
