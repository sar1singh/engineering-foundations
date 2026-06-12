# First Import Workflow V1

Date: 2026-06-11

## Purpose

Define the human-driven import review workflow for applying approved patch entries into the EngineeringOS knowledge graph. This is the first phase that prepares actual graph updates — but no automatic writes.

## Workflow Stages

### 1. Candidate

Import candidates are stored as a deterministic JSON fixture in `data/ingestion/first-import-candidates.json`. Each candidate includes a URL, title, source type, category, description, tier, reliability, and duplicate risk override flag.

### 2. Patch Generation

The `generatePatchFromApprovedCandidates()` service (Pack 10G) converts approved candidates into a structured `ImportPatch` with entries (topic, source) and conflict detection against existing canonical data.

### 3. Review

The import review service (`import-review-service.ts`) wraps a generated patch into an `ApprovedImportPackage`:

- `createImportReviewPackage(patch)` — wraps patch with review items, detects conflicts
- `reviewPatchEntry(pkg, entryIndex)` — inspects a single entry
- `approvePatchEntry(pkg, entryIndex, notes?)` — marks entry as approved
- `rejectPatchEntry(pkg, entryIndex, notes?)` — marks entry as rejected
- `detectImportConflicts(pkg)` — returns conflicts
- `generateApplicationPlan(pkg)` — produces the plan
- `summarizeImportPackage(pkg)` — returns summary counts

### 4. Import Package

An `ApprovedImportPackage` contains:

- The original `ImportPatch`
- `ImportReviewItem[]` with per-entry decision state
- `approvedEntries` and `rejectedEntries` arrays
- `ImportReviewSummary` with counts
- `ImportApplicationPlan` with structured add instructions

### 5. Application Plan

The `ImportApplicationPlan` includes:

- `topicsToAdd[]` — entries with action, ID, name, conflicts, notes
- `sourcesToAdd[]` — entries with action, ID, name, conflicts, notes
- `capabilitiesImpacted[]` — capability references
- `skillsImpacted[]` — skill references
- `duplicateRisks[]` — risk descriptions
- `reviewNotes[]` — accumulated notes

### 6. Human Approval Requirements

- All patch entries must be reviewed by a human
- Each entry defaults to "pending" — no auto-approval
- Conflicts are surfaced with severity (info/warning/error)
- The application plan is a preview — no writes
- No Apply button exists in the UI

### 7. Rollback Process

Since no writes occur in this phase:

- Rollback is trivially "don't apply the plan"
- If entries are rejected, they are excluded from the application plan
- The JSON fixture can be re-run to regenerate the review state
- Session state is ephemeral — page refresh resets all decisions

## UI

The import review UI is at `/founder-beta/import-review`. It provides:

- Generate Review Package button
- Summary cards (total/approved/rejected/pending counts)
- Conflict display by severity
- Per-entry Approve/Reject buttons
- Application plan (sources to add, topics to add, capabilities/skills impacted)
- Duplicate risk warnings
- JSON preview toggle
- "Preview only — no apply button" warning

## First Import Candidate Set

File: `data/ingestion/first-import-candidates.json`

10 candidates covering:

1. Event-Driven Architecture Patterns (engineering-blog)
2. AWS Architecture Blog (engineering-blog, duplicate risk overridden)
3. System Design Primer (github-repository)
4. Microservices Guide by Martin Fowler (engineering-blog)
5. Architecting for Scale (engineering-blog)
6. Google Cloud Security Foundations Guide (official-docs)
7. Distributed Systems Lecture Series (engineering-blog)
8. Software Architecture: The Hard Parts (book)
9. MDN Web Performance Guide (official-docs, duplicate risk overridden)
10. Event-Driven Microservices (book)

## Next Phase

Recommended: Pack 10I — First Real Knowledge Graph Import.
