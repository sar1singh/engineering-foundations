# Canonical Graph Patch Proposal V1

Status: Pack 11G complete.

## Purpose

Create a deterministic production-grade path from approved import package to canonical graph patch proposal.

The proposal describes canonical graph modifications, but it does not apply them.

## Flow

```txt
Approved Import
        |
        v
Canonical Patch Proposal
        |
        v
Human Review
```

## Inputs

- `ApprovedImportPackage`
- Current static graph data:
  - source catalog
  - master topics
  - capabilities
  - skills
  - missions

## Outputs

- `CanonicalGraphPatchProposal`
- `CanonicalGraphPatchEntry`
- `CanonicalGraphConflict`
- `CanonicalGraphPatchSummary`
- `CanonicalGraphPatchReview`

## Service

File:

- `src/lib/services/canonical-graph-patch-service.ts`

Functions:

- `generateCanonicalPatchProposal()`
- `validateCanonicalPatchProposal()`
- `detectCanonicalPatchConflicts()`
- `summarizeCanonicalPatchProposal()`
- `serializeCanonicalPatchProposal()`

## Proposal Contents

The proposal includes:

- sources to add
- topics to add
- capability references
- skill references
- affected missions
- duplicate checks
- conflicts
- summary
- pending human review state

## Human Review Gate

Every proposal has:

- `reviewRequired = true`
- `approvalStatus = pending`

There is no bypass and no apply function in Pack 11G.

## UI

The import review flow shows:

- Canonical Patch Proposal
- topics
- sources
- conflicts
- graph impact
- summary
- "Human review required before graph update."

No Apply button exists.

## Safety

Pack 11G does not:

- write to `master-topics.ts`
- write to `source-catalog.ts`
- mutate the canonical graph
- apply a patch
- publish changes
- persist data
- add database, auth, SaaS, deployment, crawling, or AI evaluation

## Next

Pack 11H: Human Approved Canonical Graph Apply.

## Validation

- `npm run typecheck`: passed.
- `npm run lint`: passed with 32 existing warnings and 0 errors.
- `npm run test -- src/lib/services/canonical-graph-patch-service.test.ts`: passed, 8 tests.
- `npm run test`: 1097 tests passed; 8 accepted Playwright/Vitest collection failures remain.
