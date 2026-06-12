# Agent Content Discovery Contracts V1

Date: 2026-06-10

## Purpose

Defines the TypeScript contract types and validation helpers for agent-produced content discovery outputs in EngineeringOS. These contracts extend the base ingestion contracts (`CONTENT_INGESTION_CONTRACTS_V1.md`) with agent-specific metadata, attribution, duplicate risk assessment, and publish boundary enforcement.

## Contract Types

All types live in `src/types/content-ingestion.ts`. They are backward-compatible additions — all existing code continues to compile without changes.

### AgentAttribution

Metadata attached to agent-discovered candidates tracking provenance.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `agentId` | `string` | Yes | Unique agent identity |
| `agentVersion` | `string` | Yes | Agent version string |
| `agentTraceId` | `string` | Yes | Trace identifier for the discovery run |
| `discoveredAt` | `string` | Yes | ISO timestamp of discovery |
| `sourceUrl` | `string` | Yes | URL where the content was found |
| `extractionMethod` | `"scrape" \| "rss" \| "api" \| "manual" \| "community-submission"` | Yes | How the URL was sourced |
| `rawMetadata` | `string` | Yes | Free-form JSON metadata captured at discovery time |

### DuplicateRiskAssessment

Assessment metadata comparing a candidate against existing published content.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `similarCandidateIds` | `string[]` | Yes | IDs of similar raw candidates |
| `similarNormalizedIds` | `string[]` | Yes | IDs of similar normalized items (published content) |
| `similarityScore` | `number` | Yes | 0-1 similarity score |
| `overlappingTopicIds` | `string[]` | Yes | Topic IDs that overlap with existing content |
| `assessedBy` | `string` | Yes | Agent identity that performed the assessment |
| `assessedAt` | `string` | Yes | ISO timestamp |
| `notes` | `string` | Yes | Free-text context about the duplicate risk |

### RawContentCandidate Extensions

Three optional fields added to `RawContentCandidate`:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `attribution` | `AgentAttribution` | No | Agent attribution metadata (required when `discoveryMethod === "agent-discovery"`) |
| `duplicateRisk` | `DuplicateRiskAssessment` | No | Duplicate risk assessment from the duplicate detection agent |
| `agentTraceId` | `string` | No | Trace identifier carried through the agent pipeline |

### NormalizedContentItem Extension

One optional field added:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `agentTraceId` | `string` | No | Trace identifier preserved through normalization |

## Agent Output Contracts

### Resource Discovery Agent Output

```
RawContentCandidate[]   at "discovered" status
                        with attribution (if agent-discovery)
                        without ContentApprovalDecision
```

**Must pass:** `validateAgentDiscoveryOutput` (calls `validateContentCandidate` internally, checks attribution completeness)

### Duplicate Detection Agent Output

```
RawContentCandidate[].duplicateRisk   (added to existing candidate)
                                      without changing candidate status
```

**Must pass:** `validateDuplicateRisk` (checks score range, assessedBy, assessedAt, warns on high overlap)

### Topic Mapping Agent Output

```
TopicMappingCandidate[]   linked to normalizedItemId
                          with mappedBy = agent identity
```

**Must pass:** `validateTopicMappingCandidate` (checks structural validity, capability/skill refs, relevance range)

### Source Quality Review Agent Output

```
SourceMappingCandidate[]   linked to normalizedItemId
                           with mappedBy = agent identity
ContentQualityReview       with reviewerId = agent identity
                           without ContentApprovalDecision
```

**Must pass:** `evaluateContentQuality` (checks score ranges, passed decision consistency)

### Human Approval Gate

```
ContentApprovalDecision    with decision = "approved" | "rejected"
                           with decidedBy = human reviewer identity
                           with nextStatus = "published" | "rejected"
                           with reason (required for rejection)
```

**Must check:** `validateHumanApprovalRequired` returns `false` for auto-approval candidates; `validateTransition` confirms legal state change.

## Validation Helpers

All helpers are in `src/lib/services/content-ingestion-contracts.ts`. They are pure functions — no database, no API, no side effects.

| Function | Purpose |
|----------|---------|
| `validateAgentDiscoveryOutput` | Validates agent-discovered candidate: base candidate validity plus attribution completeness |
| `validateDuplicateRisk` | Validates duplicate risk assessment: score range, required fields, warns on high overlap |
| `validateHumanApprovalRequired` | Returns `true` if candidate requires human review (low confidence, high duplicate risk, no tags) |
| `validateAttribution` | Validates attribution consistency: warns on missing or conflicting metadata |
| `validateAgentCannotPublishDirectly` | Blocks transitions that skip the human approval gate (e.g., discovered -> published) |

## Quality Gates (Agent-Facing)

1. **Agent output gate**: All agent-produced candidates must pass `validateAgentDiscoveryOutput` — attribution completeness plus base candidate validity
2. **Duplicate detection gate**: Duplicate risk assessments must pass `validateDuplicateRisk` — score in 0-1 range, required fields present
3. **Human approval requirement gate**: `validateHumanApprovalRequired` determines if a candidate needs human review before any approval decision
4. **Publish boundary gate**: `validateAgentCannotPublishDirectly` blocks any transition that would bypass the human approval gate

## Agent Roadmap (Deferred)

- Phase 8B: Static Agent Output Simulation Preview — add agent-mock scenarios to the ingestion preview
- Phase 8C: Agent runtime proof-of-concept — implement one lightweight discovery agent against a single RSS feed
- Phase 8D: Multi-agent coordination — topic mapping agent + quality review agent running on candidate queues
- Phases 9+: Production agent pipeline — scheduling, monitoring, retry, conflict resolution

## Relevant Files

- `src/types/content-ingestion.ts` — AgentAttribution, DuplicateRiskAssessment, RawContentCandidate extensions
- `src/lib/services/content-ingestion-contracts.ts` — Agent validation helpers
- `src/lib/services/content-ingestion-agent-validation.test.ts` — Tests for agent validation helpers
- `docs/AGENT_DISCOVERY_ARCHITECTURE_V1.md` — Agent architecture reference
- `docs/CONTENT_INGESTION_CONTRACTS_V1.md` — Base ingestion contract types
- `docs/CONTENT_APPROVAL_WORKFLOW_V1.md` — State machine and approval gates
