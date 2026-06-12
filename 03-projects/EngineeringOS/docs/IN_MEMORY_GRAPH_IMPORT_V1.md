# In-Memory Graph Import V1

Status: Pack 11F complete.

## Purpose

Validate approved batch patch output against the current static founder-beta graph without writing to canonical files.

This service is a preview boundary only. It clones static graph data in memory, applies approved entries that pass validation, reports conflicts and rollback instructions, then returns a deterministic result object.

## Inputs

- Approved batch patch output from `createApprovedBatchPatch()`.
- Read-only static graph data:
  - `founderBetaSourceCatalog`
  - `founderBetaMasterTopics`
  - `founderBetaCapabilities`
  - `founderBetaSkills`

## Service

File:

- `src/lib/services/in-memory-graph-import-service.ts`

Functions:

- `applyPatchToInMemoryGraph()`
- `validateInMemoryGraphImport()`
- `rollbackInMemoryGraphImport()`
- `summarizeGraphImport()`
- `compareGraphBeforeAfter()`

## Rules

- Only `approvedEntries` are considered.
- Duplicate topic IDs are blocked.
- Duplicate source IDs are blocked.
- Duplicate source URLs are blocked unless `allowDuplicateSourceUrls` is set.
- Topics must reference at least one source.
- Topic source references must exist in the preview graph after source entries are applied.
- Invalid capability IDs are blocked.
- Invalid skill IDs are blocked.
- Topic proof types are required. Pack 11F derives them deterministically from referenced skills and capabilities, falling back to `architecture-review` for source-only discovery topics.
- Capability patch entries are not imported in Pack 11F.
- No canonical files are written.

## Result

`GraphImportResult` includes:

- `addedTopics`
- `addedSources`
- `updatedTopics`
- `skippedEntries`
- `conflicts`
- `warnings`
- `rollbackPlan`
- `beforeCounts`
- `afterCounts`
- `graph`

## UI

`RuntimeDiscoveryQueuePanel` includes an optional `In-memory Import Preview` after batch patch output generation.

The UI shows:

- before/after counts
- conflict count
- skipped count
- deterministic summary
- rollback preview notes
- no-write warning

There is no Apply to Graph button.

## Safety

Pack 11F does not:

- write to `master-topics.ts`
- write to `source-catalog.ts`
- mutate canonical graph arrays
- publish changes
- persist data
- use Prisma, auth, SaaS, deployment, crawling, or AI evaluation

## Recommended Next

Pack 11G: Controlled Canonical Graph Import Patch.
