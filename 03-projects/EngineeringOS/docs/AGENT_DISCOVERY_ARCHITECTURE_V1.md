# Agent Discovery Architecture V1

Date: 2026-06-10

## Purpose

Define the agent architecture for discovering, mapping, reviewing, and approving content candidates in EngineeringOS. This is a **pure architecture and contract document** — no runtime agents, no scraping, no autonomous writes. All agents defined here produce typed outputs that existing contract helpers validate. The human approval gate and publish boundary ensure no agent can directly publish content.

## Agent Overview

Six logical components form the content ingestion pipeline:

```
┌─────────────────────┐
│ Resource Discovery  │─── RawContentCandidate[]
│ Agent               │
└─────────────────────┘
           │
           ▼
┌─────────────────────┐
│ Duplicate Detection │─── DuplicateRiskAssessment[]
│ Agent               │
└─────────────────────┘
           │
           ▼
┌─────────────────────┐
│ Topic Mapping       │─── TopicMappingCandidate[]
│ Agent               │
└─────────────────────┘
           │
           ▼
┌─────────────────────┐
│ Source Quality      │─── SourceMappingCandidate[]
│ Review Agent        │
└─────────────────────┘
           │
           ▼
┌─────────────────────┐
│ Human Approval Gate │─── ContentApprovalDecision
│ (Hard Gate)         │
└─────────────────────┘
           │
           ▼
┌─────────────────────┐
│ Publish Boundary    │─── NormalizedContentItem (registry entry)
│ (Hard Gate)         │
└─────────────────────┘
```

Agents are **stateless producers** — they read candidate URLs, produce typed outputs, and have no access to the persistence layer. All shared state flows through typed contracts.

## 1. Resource Discovery Agent

**Purpose:** Discover URLs and produce `RawContentCandidate[]` with agent attribution.

**Discovery sources:**
- RSS/Atom feeds from known source catalog entries
- Curator-submitted URLs (via `curator-suggestion` discovery method on existing infrastructure)
- Community-submitted links (via `community-submission` discovery method)
- Manual curator entry (via `manual` discovery method)
- Agent-scraped index pages (via `agent-discovery` discovery method)

**Output:** `RawContentCandidate[]`

**Constraints:**
- Must include `attribution` metadata when `discoveryMethod === "agent-discovery"`
- Must set `estimatedConfidence` based on source authority, content freshness, and URL trust
- Must not publish directly — outputs always enter the pipeline at `discovered` status
- Must pass `validateContentCandidate` and `validateAgentDiscoveryOutput`

**Validation gate:** `validateAgentDiscoveryOutput` checks attribution completeness and base candidate validity.

## 2. Duplicate Detection Agent

**Purpose:** Compare new candidates against existing published content and flag overlap.

**Input:** `RawContentCandidate` (from Discovery Agent or curator)

**Comparison method:**
- URL hash intersection with existing normalized items
- Title similarity scoring (normalized edit distance or Jaccard)
- Topic overlap scoring (identical topicIds to existing mapped candidates)
- Configurable threshold: `similarityScore >= 0.7` triggers human review

**Output:** `DuplicateRiskAssessment` stored on the candidate as `candidate.duplicateRisk`

**Constraints:**
- Must not block discovery — duplicates are flagged for review, not dropped
- High-similarity candidates (`>= 0.8`) with overlapping topics produce a warning via `validateDuplicateRisk`
- Must operate against a read-only index of published content (no direct persistence writes)

**Validation gate:** `validateDuplicateRisk` checks score range, assessedBy, assessedAt, and warns on high overlap.

## 3. Topic Mapping Agent

**Purpose:** Propose `TopicMappingCandidate[]` linking a normalized item to registered topics, capabilities, and skills.

**Input:** `NormalizedContentItem`, `RawContentCandidate` metadata

**Mapping heuristics:**
- Keyword matching: candidate title, description, tags against topic names and skill descriptions
- Source-based: known topic affiliations for high-authority sources
- Category-based: candidate category maps directly to known capability groups
- Confidence floor: skip mappings where `relevanceScore < 0.3`

**Output:** `TopicMappingCandidate[]`

**Constraints:**
- All proposed mappings must pass `validateTopicMappingCandidate` (valid capabilityIds, skillIds, relevanceScore range)
- The agent must set `mappedBy` to its agent identity and `mappedAt` to ISO timestamp
- The agent may propose multiple mappings per candidate (0..N)
- Zero mappings is allowed but will cause `determineApprovalReadiness` to fail the approval gate

**Validation gate:** `validateTopicMappingCandidate` checks structural validity, capability/skill registry references, relevance range.

## 4. Source Quality Review Agent

**Purpose:** Produce `SourceMappingCandidate[]` and `ContentQualityReview` for a candidate.

**Input:** `NormalizedContentItem`, candidate URL, source catalog references

**Quality review scoring:**
- `contentFreshnessScore`: time since content publication vs threshold (recent = higher)
- `technicalAccuracyScore`: inferred from source authority tier and category alignment (tier-1 official docs = high, tier-4 blog = lower)
- `relevanceScore`: derived from topic mapping relevance scores (average of all proposed mappings)
- `authorityScore`: derived from source tier and catalog reliability rating
- `overallScore`: weighted average of the four dimension scores

**Constraints:**
- The agent must produce exactly one `ContentQualityReview` per candidate
- The agent must set `reviewerId` to its agent identity
- The agent must not set `passed: true` when `overallScore < 0.6`
- The agent must never produce a `ContentApprovalDecision` — quality is review only

**Validation gate:** `evaluateContentQuality` checks score ranges, passed decision, and warns on score/passed inconsistency.

## 5. Human Approval Gate

**Purpose:** The only entry point for `ContentApprovalDecision` creation. Agents cannot directly approve or reject.

**Gate conditions (must return `false` from `validateHumanApprovalRequired` for auto-approval):**
- `estimatedConfidence >= 0.4`
- No high duplicate risk (`duplicateRisk.similarityScore < 0.7`)
- Has at least one tag
- `determineApprovalReadiness` returns `valid: true` (quality passed, overall >= 0.6, mappings exist)

**If `validateHumanApprovalRequired` returns `true`, the candidate MUST be reviewed by a human curator before any approval decision.**

**Human workflows:**
- **Approve:** Creates `ContentApprovalDecision` with `decision: "approved"`, `nextStatus: "published"`
- **Reject:** Creates `ContentApprovalDecision` with `decision: "rejected"`, `nextStatus: "rejected"`, with required reason
- **Needs changes:** Returns candidate to `reviewed` status for agent re-processing (not a terminal state)

**Validation gate:** `validateTransition` confirms the state change is legal; `validateAgentCannotPublishDirectly` ensures agents skip the human gate.

## 6. Publish Boundary

**Purpose:** Enforce that only human-approved candidates (or those meeting all automated gates) reach `published` status.

**Boundary rules:**
- Only `ContentApprovalDecision` with `decision: "approved"` and `nextStatus: "published"` can trigger a publish transition
- `validateTransition("approved", "published")` must pass
- `validateAgentCannotPublishDirectly` must pass for the full path (agents cannot skip from discovered/normalized/mapped directly to published)
- Published candidates produce a `NormalizedContentItem` that serves as the registry entry

**Constraints:**
- Agents cannot set `decision`, `decidedBy`, `nextStatus` on `ContentApprovalDecision` — only human reviewers can
- The publish boundary is the final hard gate before content enters the content registry

## Data Flow

```
Discovery Agent               → RawContentCandidate[] (discovered status, with attribution)
Duplicate Detection Agent     → RawContentCandidate[].duplicateRisk (added to candidate metadata)
Normalization (utility)        → NormalizedContentItem (via createNormalizedItem helper)
Topic Mapping Agent           → TopicMappingCandidate[] (validated mappings)
Source Quality Review Agent   → SourceMappingCandidate[] + ContentQualityReview
Human Approval Gate           → ContentApprovalDecision (approve or reject)
Publish Boundary              → N/A (validates transition legality, produces no new type)
```

## Interaction with Existing Infrastructure

| Component | Interaction |
|-----------|-------------|
| `content-ingestion-contracts.ts` | All agent outputs validated by existing helpers |
| `content-ingestion-simulator.ts` | Can be extended with agent-mock scenarios (Phase 8B) |
| `content-ingestion-review-session.ts` | After Phase 7F, session review state mirrors human approval gate |
| `IngestionPreview.tsx` | Human approval gate UI already exists (Phase 7F approve/reject buttons) |
| `ingestion-mock-candidates.ts` | Two mock scenarios already use `discoveryMethod: "agent-discovery"` (weak, duplicate-risk) |
| Source catalog | Agent reads source catalog for quality scoring (read-only) |
| Capability/skill registry | Agent reads for topic mapping validation (read-only) |

## Deferred Agent Runtime

- No runtime agent execution, scheduling, or orchestration
- No agent-to-agent communication protocol
- No persistent agent state or checkpointing
- No agent authentication or authorization model
- No multi-agent conflict resolution (two agents proposing contradictory mappings)
- No agent retry, backoff, or error recovery
- All of the above are deferred to Phase 8C+ after static agent simulation proves the contract model

## Relevant Files

- `src/types/content-ingestion.ts` — AgentAttribution, DuplicateRiskAssessment, RawContentCandidate.attribution/.duplicateRisk/.agentTraceId
- `src/lib/services/content-ingestion-contracts.ts` — validateAgentDiscoveryOutput, validateDuplicateRisk, validateHumanApprovalRequired, validateAttribution, validateAgentCannotPublishDirectly
- `docs/AGENT_CONTENT_DISCOVERY_CONTRACTS_V1.md` — Agent output contract reference
- `docs/CONTENT_INGESTION_CONTRACTS_V1.md` — Base ingestion contract types
- `docs/CONTENT_APPROVAL_WORKFLOW_V1.md` — State machine and approval gates
