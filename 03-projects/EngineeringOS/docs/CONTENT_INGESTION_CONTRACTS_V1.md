# Content Ingestion Contracts V1

Date: 2026-06-09

## Purpose

Defines the deterministic TypeScript contract types and static validation helpers for content ingestion in EngineeringOS. These contracts are the **schema layer** — they define what data flows through the ingestion pipeline, how it is validated, and what states it transitions through — without any runtime ingestion, agents, scraping, or database access.

This document builds on the ingestion philosophy in `CONTENT_INGESTION_AND_SOURCE_MODEL.md` and the decision locks in `CONTENT_INGESTION_DECISIONS.md`.

## Contract Types

All types live in `src/types/content-ingestion.ts`. They are pure TypeScript interfaces — no zod, no io-ts, no runtime validation at the type level. Validation is handled by deterministic helper functions in `src/lib/services/content-ingestion-contracts.ts`.

### RawContentCandidate

The entry point for any content entering the system. An agent or curator produces this before any processing.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Unique identifier |
| `title` | `string` | Yes | Human-readable title |
| `url` | `string` | Yes | Source URL (http/https) |
| `sourceType` | `ContentSourceType` | Yes | Category of source |
| `tier` | `ContentTier` | Yes | Priority tier (1-4) |
| `category` | `string` | Yes | Domain/category |
| `description` | `string` | Yes | Summary |
| `discoveryMethod` | `IngestionDiscoveryMethod` | Yes | How discovered |
| `discoveredAt` | `string` | Yes | ISO timestamp |
| `discoveredBy` | `string` | Yes | Who/what discovered |
| `tags` | `string[]` | Yes | At least 0 tags |
| `estimatedConfidence` | `number` | Yes | 0-1 confidence score |

`discoveryMethod` values: `manual`, `curator-suggestion`, `agent-discovery`, `community-submission`, `bulk-import`

### NormalizedContentItem

The cleaned, normalized version of a candidate after passing quality gates.

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique ID |
| `rawCandidateId` | `string` | Back-reference to candidate |
| `normalizedTitle` | `string` | Trimmed title |
| `normalizedUrl` | `string` | Trimmed URL |
| `sourceType` | `ContentSourceType` | Inherited from candidate |
| `tier` | `ContentTier` | Inherited from candidate |
| `category` | `string` | Inherited from candidate |
| `description` | `string` | Inherited from candidate |
| `tags` | `string[]` | Resolved tags |
| `confidenceScore` | `number` | 0-1, may be adjusted |
| `normalizedAt` | `string` | ISO timestamp |
| `normalizedBy` | `string` | System or curator name |
| `checksum` | `string` | Content-bound checksum |

### TopicMappingCandidate

Links a normalized item to a registered topic, capability, and skill.

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique mapping ID |
| `normalizedItemId` | `string` | Back-reference to normalized item |
| `topicId` | `string` | Target topic ID |
| `topicName` | `string` | Human-readable topic name |
| `capabilityIds` | `string[]` | One or more capability IDs |
| `skillIds` | `string[]` | One or more skill IDs |
| `relevanceScore` | `number` | 0-1 relevance |
| `mappedBy` | `string` | Who created the mapping |
| `mappedAt` | `string` | ISO timestamp |
| `notes` | `string` | Free-text context |

### SourceMappingCandidate

Links a normalized item to a source in the Source Catalog.

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique mapping ID |
| `normalizedItemId` | `string` | Back-reference to normalized item |
| `sourceId` | `string` | Source catalog ID |
| `sourceTitle` | `string` | Human-readable source title |
| `mappedBy` | `string` | Who created the mapping |
| `mappedAt` | `string` | ISO timestamp |
| `notes` | `string` | Free-text context |

### ContentQualityReview

A scored quality review with pass/fail outcome.

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique review ID |
| `normalizedItemId` | `string` | Target item |
| `reviewerId` | `string` | Reviewer identity |
| `reviewedAt` | `string` | ISO timestamp |
| `urlReachable` | `boolean` | Whether URL was reachable |
| `contentFreshnessScore` | `number` | 0-1 |
| `technicalAccuracyScore` | `number` | 0-1 |
| `relevanceScore` | `number` | 0-1 |
| `authorityScore` | `number` | 0-1 |
| `overallScore` | `number` | 0-1 aggregated |
| `issues` | `string[]` | Issues found |
| `recommendations` | `string[]` | Improvement suggestions |
| `passed` | `boolean` | Final pass/fail |

### ContentApprovalDecision

A human or system decision to approve or reject.

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique decision ID |
| `normalizedItemId` | `string` | Target item |
| `decision` | `"approved" \| "rejected"` | Final decision |
| `decidedBy` | `string` | Approver identity |
| `decidedAt` | `string` | ISO timestamp |
| `reason` | `string` | Justification |
| `nextStatus` | `"published" \| "rejected"` | Target status |

### ContentIngestionBatch

Groups all lifecycle artifacts for a single ingestion run.

### ContentIngestionError

Records an error at a specific stage with severity and resolution state.

## Validation Helpers

All helpers are in `src/lib/services/content-ingestion-contracts.ts`. They are pure functions — no database, no API, no side effects.

| Function | Purpose |
| --- | --- |
| `validateContentCandidate` | Validates required fields, URL format, confidence range, warns on missing tags |
| `validateTopicMappingCandidate` | Validates mapping ID, topic ref, capability refs against registry, skill refs against registry, relevance range |
| `validateSourceMappingCandidate` | Validates mapping ID, source ref, warns if source not yet in catalog |
| `evaluateContentQuality` | Validates review fields, score ranges, detects score/passed conflicts |
| `determineApprovalReadiness` | Checks review passed, overall >= 0.6, mappings exist, no invalid mappings |
| `canTransition` | Pure state machine check against VALID_TRANSITIONS |
| `validateTransition` | Checks transition + warns about unresolved errors |
| `createNormalizedItem` | Creates normalized item from raw candidate with checksum |

## Quality Gates

The validation helpers enforce these gates:

1. **Candidate structural gate**: valid id, title, http/https url, sourceType, tier, category, 0-1 confidence, discovery method
2. **Topic mapping gate**: references valid capabilityIds and skillIds from `founderBetaCapabilities` and `founderBetaSkills`
3. **Source mapping gate**: sourceId must be present; warns if not in `founderBetaSourceCatalog`
4. **Quality gate**: all 4 scores (freshness, accuracy, relevance, authority) must be 0-1; overallScore must be 0-1; passed must be boolean; detects inconsistent score/passed combinations
5. **Approval readiness gate**: passed === true, overallScore >= 0.6, at least one topic mapping, at least one source mapping, all mappings individually valid
6. **Transition gate**: only allowed transitions per VALID_TRANSITIONS; warns on unresolved errors

## Agent Output Extensions (Phase 8A)

Three agent-specific additions to the base contracts, all in `src/types/content-ingestion.ts`:

### AgentAttribution

Provenance metadata on agent-discovered candidates. Required when `discoveryMethod === "agent-discovery"`. Includes `agentId`, `agentVersion`, `agentTraceId`, `discoveredAt`, `sourceUrl`, `extractionMethod`, `rawMetadata`.

### DuplicateRiskAssessment

Compares a candidate against existing published content. Includes `similarityScore` (0-1), `similarCandidateIds`, `similarNormalizedIds`, `overlappingTopicIds`, `assessedBy`, `assessedAt`.

### RawContentCandidate Extensions

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `attribution` | `AgentAttribution` | No | Agent provenance (required when `discoveryMethod === "agent-discovery"`) |
| `duplicateRisk` | `DuplicateRiskAssessment` | No | Duplicate risk from detection agent |
| `agentTraceId` | `string` | No | Pipeline trace identifier |

### Agent Validation Helpers (Phase 8A)

| Function | Purpose |
|----------|---------|
| `validateAgentDiscoveryOutput` | Validates agent-discovered candidate: base validity + attribution completeness |
| `validateDuplicateRisk` | Validates duplicate risk: score range, required fields, warns on high overlap |
| `validateHumanApprovalRequired` | Returns `true` if candidate requires human review (low confidence, high duplicate risk, missing tags) |
| `validateAttribution` | Validates attribution consistency: warns on missing or conflicting metadata |
| `validateAgentCannotPublishDirectly` | Blocks transitions that skip the human approval gate |

## Agent Roadmap (Deferred)

All types and validation helpers for agent outputs are defined and tested (Phase 8A). What remains deferred:

- **Phase 8B**: Static Agent Output Simulation Preview — add agent-mock scenarios to the ingestion preview
- **Phase 8C**: Agent runtime proof-of-concept — implement one lightweight discovery agent against a single RSS feed
- **Phase 8D+**: Multi-agent coordination, scheduling, retry, conflict resolution

Future agents that will produce these types:
- **Discovery Agent**: produces `RawContentCandidate[]` with `discoveryMethod: "agent-discovery"` and attribution
- **Duplicate Detection Agent**: produces `DuplicateRiskAssessment` added to candidate metadata
- **Normalization Agent**: calls `createNormalizedItem` and `validateContentCandidate`
- **Mapping Agent**: produces `TopicMappingCandidate[]` and `SourceMappingCandidate[]`
- **Quality Review Agent**: produces `ContentQualityReview` records
- **Human Approval Gate**: produces `ContentApprovalDecision` (agents cannot produce decisions directly)

## Relevant Files

- `src/types/content-ingestion.ts` — All contract types, INGESTION_WORKFLOW, VALID_TRANSITIONS
- `src/lib/services/content-ingestion-contracts.ts` — All validation helpers
- `src/lib/services/content-ingestion-contracts.test.ts` — 20+ tests covering valid/invalid/boundary cases
