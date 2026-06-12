# Content Approval Workflow V1

Date: 2026-06-09

## Purpose

Defines the state machine and validation rules for moving content through the ingestion lifecycle — from raw discovery to published or rejected — in EngineeringOS. This is a **pure deterministic workflow** with no runtime persistence, no agents, and no UI.

## State Machine

Seven states with strictly defined transitions:

```txt
discovered
  |
  v
normalized
  |
  v
mapped
  |
  v
reviewed
  |        \
  v         v
approved  rejected
  |
  v
published
```

### States

| State | Meaning | Terminal |
| --- | --- | --- |
| `discovered` | Raw candidate entered the system | No |
| `normalized` | Passed structural validation, checksum created | No |
| `mapped` | Linked to topics and sources | No |
| `reviewed` | Quality review completed | No |
| `approved` | Passed review, ready for publishing | No |
| `published` | Live in the registry | **Yes** |
| `rejected` | Discarded at any stage | **Yes** |

### Transition Table

| From | To | Required Checks |
| --- | --- | --- |
| `discovered` | `normalized` | url_reachable, has_title, has_source_type |
| `normalized` | `mapped` | has_checksum, confidence_above_minimum, tags_resolved |
| `mapped` | `reviewed` | mappings_complete, relevance_above_minimum, at_least_one_mapping |
| `reviewed` | `approved` | quality_score_above_threshold, issues_resolved, review_complete |
| `reviewed` | `rejected` | quality_below_threshold, irrecoverable_issues |
| `approved` | `published` | approval_confirmed, final_validation_passed |
| `approved` | `rejected` | decision_overturned |

### Validation Rules (from `VALID_TRANSITIONS`)

```typescript
// Defined in src/types/content-ingestion.ts
export const VALID_TRANSITIONS: Record<IngestionStatus, IngestionStatus[]> = {
  discovered: ["normalized"],
  normalized: ["mapped"],
  mapped: ["reviewed"],
  reviewed: ["approved", "rejected"],
  approved: ["published", "rejected"],
  published: [],
  rejected: []
};
```

Key properties:
- **No skipping**: You cannot go directly from `discovered` to `published`
- **Rejection is available from two states**: `reviewed` or `approved`
- **Terminal states**: `published` and `rejected` have no outgoing transitions
- **No reversal**: Once `published`, content cannot be unpublished through the state machine (would require a new candidate)

## Approval Readiness Conditions

For content to be ready for approval (`reviewed -> approved` transition), all of these must be true:

1. Quality review `passed === true`
2. `overallScore >= 0.6` (minimum threshold)
3. At least one `TopicMappingCandidate` exists
4. At least one `SourceMappingCandidate` exists
5. All topic mappings are individually valid (correct cap/skill refs, valid relevance)
6. All source mappings are individually valid (valid sourceId)

If any condition fails, `determineApprovalReadiness` returns `errors` and `valid: false`.

## Quality Review Dimensions

Each `ContentQualityReview` scores four dimensions plus an overall:

| Dimension | Score Field | Gate |
| --- | --- | --- |
| Content freshness | `contentFreshnessScore` | 0-1 |
| Technical accuracy | `technicalAccuracyScore` | 0-1 |
| Relevance to role/capability | `relevanceScore` | 0-1 |
| Authority of source | `authorityScore` | 0-1 |
| **Overall** | `overallScore` | >= 0.6 for approval |

The validation helper `evaluateContentQuality` also detects inconsistencies:
- Score >= 0.7 but `passed === false` → warning
- Score < 0.5 but `passed === true` → warning

## Error Handling

`ContentIngestionError` records issues per candidate per stage:

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique error ID |
| `batchId` | `string` | Batch reference |
| `candidateId` | `string` | Candidate reference |
| `stage` | `IngestionStatus` | Stage where error occurred |
| `severity` | `"low" \| "medium" \| "high" \| "critical"` | Error severity |
| `message` | `string` | Human-readable message |
| `details` | `string` | Additional context |
| `timestamp` | `string` | ISO timestamp |
| `resolved` | `boolean` | Whether error has been resolved |

The `validateTransition` helper warns about unresolved errors before allowing advancement (unless moving to `rejected`).

## Ingestion Batch

`ContentIngestionBatch` groups all artifacts for a single ingestion run:

```typescript
export type ContentIngestionBatch = {
  id: string;
  name: string;
  candidates: RawContentCandidate[];
  normalizedItems: NormalizedContentItem[];
  topicMappings: TopicMappingCandidate[];
  sourceMappings: SourceMappingCandidate[];
  reviews: ContentQualityReview[];
  decisions: ContentApprovalDecision[];
  status: IngestionStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};
```

The batch itself tracks the overall status. Individual items within the batch can be at different stages, but the batch-level status provides a quick overview for UI rendering.

## Approver Workflow (Manual)

For the current phase, approval is manual — the state machine and validation helpers exist to **guide** the decision, not to make it:

1. Content is proposed as `RawContentCandidate`
2. `validateContentCandidate` checks structural soundness
3. Candidate is normalized via `createNormalizedItem`
4. Topic and source mappings are proposed and validated
5. Quality review is conducted with scored dimensions
6. `determineApprovalReadiness` returns whether the content meets minimum thresholds
7. A human reviewer makes the final `ContentApprovalDecision` (approve/reject)
8. `validateTransition` confirms the state change is legal

## Future Agent Behavior

When agents are built later, they will follow this workflow:

1. **Discovery Agent** produces `RawContentCandidate[]` at `discovered` status
2. **Normalization Agent** validates and normalizes candidates, transitions to `normalized`
3. **Mapping Agent** produces topic and source mappings, transitions to `mapped`
4. **Quality Review Agent** scores dimensions, transitions to `reviewed`
5. **Approval Agent or Human** makes decision, transitions to `approved` or `rejected`
6. **Publishing Agent** ingests into the content registry, transitions to `published`

## Comparison with Ingestion Pipeline in CONTENT_INGESTION_AND_SOURCE_MODEL.md

The existing `IngestionStatus` from the source model (`discovered`, `queued`, `ingested`, `mapped`, `reviewed`, `rejected`, `deprecated`) is a **source-level status** tracking where a source is in its lifecycle. The new `IngestionStatus` in this document is a **content-level status** tracking where a content candidate is in the approval workflow. Both coexist — sources and content have independent lifecycles.

## Agent Discovery Gates (Phase 8A)

Four hard gates in the agent pipeline that precede the human approval gate:

1. **Agent output gate**: Agent-discovered candidates must pass `validateAgentDiscoveryOutput` — attribution completeness plus base candidate validity
2. **Duplicate detection gate**: Duplicate risk assessments must pass `validateDuplicateRisk` — score in 0-1 range, required fields present
3. **Human approval requirement gate**: `validateHumanApprovalRequired` checks if a candidate needs human review — returns `true` when `estimatedConfidence < 0.4`, `duplicateRisk.similarityScore >= 0.7`, or candidate has no tags
4. **Publish boundary gate**: `validateAgentCannotPublishDirectly` blocks any transition that would skip the human approval gate (e.g., `discovered -> published`)

## Relevant Files

- `src/types/content-ingestion.ts` — VALID_TRANSITIONS, INGESTION_WORKFLOW, all workflow types, AgentAttribution, DuplicateRiskAssessment
- `src/lib/services/content-ingestion-contracts.ts` — `canTransition`, `validateTransition`, `determineApprovalReadiness`, `evaluateContentQuality`, agent validation helpers
- `src/lib/services/content-ingestion-contracts.test.ts` — Transition and readiness tests
- `docs/CONTENT_INGESTION_CONTRACTS_V1.md` — Contract type reference
- `docs/AGENT_DISCOVERY_ARCHITECTURE_V1.md` — Agent discovery architecture
- `docs/AGENT_CONTENT_DISCOVERY_CONTRACTS_V1.md` — Agent output contract reference
